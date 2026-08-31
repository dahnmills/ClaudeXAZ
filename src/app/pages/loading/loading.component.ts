import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { LogoComponent } from '../../shared/ui/logo/logo.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';

const TIP_ROTATION_MS = 4500;

type Phase = 'solo' | 'pairing' | 'connecting' | 'converge';

const SEQUENCE: { phase: Phase; duration: number }[] = [
  { phase: 'solo', duration: 1000 },
  { phase: 'pairing', duration: 900 },
  { phase: 'connecting', duration: 1800 },
  { phase: 'converge', duration: 1600 },
];

const STATUS_TEXT: Record<Phase, string> = {
  solo: 'Loading',
  pairing: 'Loading',
  connecting: 'Loading',
  converge: 'Connecting',
};

interface Tip {
  text: string;
}

// Qirin usage tips — sober, factual, one fact per screen (PRODUCT.md tone:
// trustworthy / precise / efficient, never playful). About using the app,
// not the business rules it enforces.
const TIPS: Tip[] = [
  { text: 'Search by company name, ID, or country: one bar covers all three.' },
  { text: 'Open a buyer dossier straight from search results to see grade, exposure, and history in one view.' },
  { text: 'Filters stack, so you can combine grade, exposure, and status without losing your search.' },
  { text: 'TAG rules can be reordered by drag-and-drop, no need to rebuild a rule set from scratch.' },
  { text: 'Notifications flag decisions waiting on manual review. Clear them as you act on each one.' },
  { text: 'Check Release Notes before reporting something as a bug. It might already be documented.' },
];

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [LogoComponent, IconComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent implements OnInit, OnDestroy {
  protected readonly dotIndices = [0, 1, 2, 3, 4, 5, 6];
  protected readonly tips = TIPS;
  protected readonly tipIndex = signal(0);
  protected readonly tick = signal(0);

  protected readonly phase = signal<Phase>('solo');
  protected readonly statusText = computed(() => STATUS_TEXT[this.phase()]);

  private tipIntervalId: ReturnType<typeof setInterval> | null = null;
  private phaseTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private sequenceStep = 0;

  ngOnInit(): void {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      this.phase.set('converge');
      return;
    }

    this.tipIntervalId = setInterval(() => {
      this.tipIndex.set((this.tipIndex() + 1) % this.tips.length);
      this.tick.set(this.tick() + 1);
    }, TIP_ROTATION_MS);

    this.runSequence();
  }

  ngOnDestroy(): void {
    if (this.tipIntervalId !== null) clearInterval(this.tipIntervalId);
    if (this.phaseTimeoutId !== null) clearTimeout(this.phaseTimeoutId);
  }

  // Joue la séquence une seule fois : elle s'arrête sur 'converge' (icône
  // centrée, "Connecting") et ne boucle pas — l'app est chargée, terminé.
  private runSequence(): void {
    const step = SEQUENCE[this.sequenceStep];
    this.phase.set(step.phase);
    if (this.sequenceStep >= SEQUENCE.length - 1) return;

    this.phaseTimeoutId = setTimeout(() => {
      this.sequenceStep += 1;
      this.runSequence();
    }, step.duration);
  }
}
