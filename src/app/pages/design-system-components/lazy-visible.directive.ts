import { Directive, ElementRef, OnDestroy, OnInit, inject, output } from '@angular/core';

/**
 * Emits once when the host scrolls near the viewport, then disconnects.
 * Used to stagger the Storybook preview iframes — mounting all of them
 * at once (one full Storybook preview bundle each) hammers the dev server
 * hard enough to make it hang or crash.
 */
@Directive({
  selector: '[dscLazyVisible]',
  standalone: true,
})
export class LazyVisibleDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  readonly dscLazyVisible = output<void>();

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.dscLazyVisible.emit();
          this.observer?.disconnect();
        }
      },
      { rootMargin: '150px' },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
