import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { LogoComponent } from '../../shared/ui/logo/logo.component';
import { BURST_DURATION, CableRig, PEAK_OVERSHOOT_TIME } from './cable-rig';

const HOLD_DURATION = 0.9; // seconds the plugs sit "connected" before unplugging

/**
 * Full-screen "Qirin is down" state. No shell, no navigation, no links —
 * when the product is unavailable there is nowhere else to send the user.
 *
 * The plug/cable illustration is a flat silhouette (the classic "unplugged"
 * icon language), drawn on one shared canvas so the male and female
 * connector can genuinely touch (and overlap, like a real insertion) when
 * "plugged in" — that's not achievable across two separately-laid-out
 * elements with a real CSS gap between them.
 */
@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
})
export class MaintenanceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rigCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private maleRig?: CableRig;
  private femaleRig?: CableRig;
  private rafId: number | null = null;
  private lastFrameTime = 0;
  private elapsed = 0;
  private disconnected = false;
  private burstStart: number | null = null;
  private readonly onResize = () => this.resize();

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const colors = this.resolveCssColors();
    this.maleRig = new CableRig(ctx, true, 'left', {
      plug: colors.blueA600,
      cable: colors.blueA400,
      socketPunch: colors.background,
    });
    this.femaleRig = new CableRig(ctx, false, 'right', {
      plug: colors.blueA800,
      cable: colors.blueA600,
      socketPunch: colors.background,
    });

    this.resize();
    window.addEventListener('resize', this.onResize);

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      this.maleRig.fastForward(3);
      this.femaleRig.fastForward(3);
      this.render();
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame((t) => this.loop(t));
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
  }

  private loop(time: number): void {
    if (!this.maleRig || !this.femaleRig) return;
    const dt = this.lastFrameTime ? Math.min((time - this.lastFrameTime) / 1000, 1 / 30) : 1 / 60;
    this.lastFrameTime = time;
    this.elapsed += dt;

    if (!this.disconnected && this.elapsed >= HOLD_DURATION) {
      this.disconnected = true;
      this.maleRig.startDisconnect();
      this.femaleRig.startDisconnect();
      this.burstStart = this.elapsed + PEAK_OVERSHOOT_TIME;
    }

    this.maleRig.step(dt);
    this.femaleRig.step(dt);
    this.render();

    // Keep looping indefinitely (even once settled, the redraw is cheap) —
    // stopping early risks the canvas going blank on any edge case that
    // would otherwise have triggered a redraw (tab visibility changes,
    // zoom, etc).
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  private render(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.maleRig || !this.femaleRig) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Male first, female second — a real inserted prong is hidden inside
    // the socket's housing, not floating on top of it. Drawing the female
    // body last covers whatever part of the male's prong falls inside her
    // footprint; only the short stretch bridging the gap stays visible.
    // As they pull apart, more of the prong is uncovered on its own —
    // "emerging from the socket" falls out of the layering for free.
    this.maleRig.draw();
    this.femaleRig.draw();

    if (this.burstStart !== null) {
      const progress = (this.elapsed - this.burstStart) / BURST_DURATION;
      this.maleRig.drawBurst(progress);
      this.femaleRig.drawBurst(progress);
    }
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(cssWidth * dpr));
    canvas.height = Math.max(1, Math.round(cssHeight * dpr));
    const ctx = canvas.getContext('2d');
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.maleRig?.resize(cssWidth, cssHeight);
    this.femaleRig?.resize(cssWidth, cssHeight);
    this.render();
  }

  /** Canvas can't resolve `var(--token)` on its own — read the computed value once. */
  private resolveCssColors(): { blueA400: string; blueA600: string; blueA800: string; background: string } {
    const probe = document.createElement('span');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const resolve = (token: string): string => {
      probe.style.color = `var(${token})`;
      return getComputedStyle(probe).color;
    };
    const colors = {
      blueA400: resolve('--foundation-color-blue-a-400'),
      blueA600: resolve('--foundation-color-blue-a-600'),
      blueA800: resolve('--foundation-color-blue-a-800'),
      background: resolve('--semantic-color-static-background-main-primary'),
    };
    document.body.removeChild(probe);
    return colors;
  }
}
