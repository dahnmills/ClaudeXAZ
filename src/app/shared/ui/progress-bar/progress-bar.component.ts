import { Component, computed, input } from '@angular/core';

export type ProgressBarSize = 's' | 'm';
export type ProgressBarTone = 'brand' | 'positive' | 'warning' | 'negative';

/**
 * Barre de progression linéaire. Value entre 0 et 1.
 */
@Component({
  selector: 'ds-progress-bar',
  standalone: true,
  template: `<span class="ds-progress-bar__fill" [style.width.%]="pct()"></span>`,
  styleUrl: './progress-bar.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'progressbar',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '1',
    '[attr.aria-valuenow]': 'value()',
  },
})
export class ProgressBarComponent {
  value = input<number>(0);
  size  = input<ProgressBarSize>('s');
  tone  = input<ProgressBarTone>('brand');

  pct = computed(() => Math.max(0, Math.min(1, this.value())) * 100);

  hostClasses = computed(() => [
    'ds-progress-bar',
    `ds-progress-bar--size-${this.size()}`,
    `ds-progress-bar--tone-${this.tone()}`,
  ].join(' '));
}
