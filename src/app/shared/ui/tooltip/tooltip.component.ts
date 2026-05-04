import { Component, ViewEncapsulation, input } from '@angular/core';

export type TooltipPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'left' | 'right';

@Component({
  selector: 'ds-tooltip',
  standalone: true,
  template: `
    <div class="ds-tooltip__indicator"></div>
    <div class="ds-tooltip__content">{{ text() }}</div>
  `,
  styleUrl: './tooltip.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ds-tooltip',
    '[class]': 'hostClass()',
    'role': 'tooltip',
  },
})
export class TooltipComponent {
  text     = input.required<string>();
  position = input<TooltipPosition>('top-center');
  reversed = input<boolean>(false);

  hostClass() {
    return [
      'ds-tooltip',
      `ds-tooltip--${this.position()}`,
      this.reversed() ? 'ds-tooltip--reversed' : '',
    ].filter(Boolean).join(' ');
  }
}
