import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  HostListener,
  OnDestroy,
  createComponent,
  inject,
  input,
} from '@angular/core';
import { TooltipComponent, TooltipPosition } from './tooltip.component';

@Directive({
  selector: '[dsTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  dsTooltip         = input.required<string>();
  dsTooltipPosition = input<TooltipPosition>('top-center');
  dsTooltipReversed = input<boolean>(false);
  dsTooltipDelay    = input<number>(1000);

  private host         = inject<ElementRef<HTMLElement>>(ElementRef);
  private appRef       = inject(ApplicationRef);
  private envInjector  = inject(EnvironmentInjector);

  private timer?: ReturnType<typeof setTimeout>;
  private ref?: ComponentRef<TooltipComponent>;

  @HostListener('mouseenter') onEnter() {
    this.cancel();
    this.timer = setTimeout(() => this.show(), this.dsTooltipDelay());
  }

  @HostListener('mouseleave') onLeave() { this.cancel(); }
  @HostListener('focusout')   onBlur()  { this.cancel(); }
  @HostListener('click')      onClick() { this.cancel(); }

  ngOnDestroy() { this.cancel(); }

  private cancel() {
    if (this.timer) { clearTimeout(this.timer); this.timer = undefined; }
    if (this.ref) {
      this.appRef.detachView(this.ref.hostView);
      this.ref.destroy();
      this.ref = undefined;
    }
  }

  private show() {
    const text = this.dsTooltip();
    if (!text) return;

    this.ref = createComponent(TooltipComponent, {
      environmentInjector: this.envInjector,
    });
    this.ref.setInput('text', text);
    this.ref.setInput('position', this.dsTooltipPosition());
    this.ref.setInput('reversed', this.dsTooltipReversed());
    this.appRef.attachView(this.ref.hostView);

    const el = this.ref.location.nativeElement as HTMLElement;
    el.style.position = 'fixed';
    el.style.visibility = 'hidden';
    document.body.appendChild(el);

    requestAnimationFrame(() => this.position(el));
  }

  private position(el: HTMLElement) {
    const trigger = this.host.nativeElement.getBoundingClientRect();
    const tip = el.getBoundingClientRect();
    const gap = 4;
    let top = 0, left = 0;

    switch (this.dsTooltipPosition()) {
      case 'top-left':     top = trigger.top - tip.height - gap; left = trigger.left; break;
      case 'top-center':   top = trigger.top - tip.height - gap; left = trigger.left + trigger.width / 2 - tip.width / 2; break;
      case 'top-right':    top = trigger.top - tip.height - gap; left = trigger.right - tip.width; break;
      case 'bottom-left':  top = trigger.bottom + gap; left = trigger.left; break;
      case 'bottom-center':top = trigger.bottom + gap; left = trigger.left + trigger.width / 2 - tip.width / 2; break;
      case 'bottom-right': top = trigger.bottom + gap; left = trigger.right - tip.width; break;
      case 'left':         top = trigger.top + trigger.height / 2 - tip.height / 2; left = trigger.left - tip.width - gap; break;
      case 'right':        top = trigger.top + trigger.height / 2 - tip.height / 2; left = trigger.right + gap; break;
    }

    el.style.top = `${Math.round(top)}px`;
    el.style.left = `${Math.round(left)}px`;
    el.style.visibility = 'visible';
  }
}
