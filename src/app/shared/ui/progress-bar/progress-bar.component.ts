import { Component, computed, input } from '@angular/core';

export type ProgressBarSize = 's' | 'm';
export type ProgressBarTone = 'brand' | 'positive' | 'warning' | 'negative';

/**
 * Barre de progression linéaire. Value entre 0 et 1.
 */
@Component({
  selector: 'ds-progress-bar',
  standalone: true,
  template: `<span class="ds-progress-bar__fill" [style.width.%]="indeterminate() ? null : pct()"></span>`,
  styleUrl: './progress-bar.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'progressbar',
    '[attr.aria-valuemin]': 'indeterminate() ? null : 0',
    '[attr.aria-valuemax]': 'indeterminate() ? null : 1',
    '[attr.aria-valuenow]': 'indeterminate() ? null : value()',
  },
})
export class ProgressBarComponent {
  value = input<number>(0);
  size  = input<ProgressBarSize>('s');
  tone  = input<ProgressBarTone>('brand');
  /** Progression inconnue (chargement initial) : anime un fill glissant plutôt que value(). */
  indeterminate = input<boolean>(false);

  pct = computed(() => Math.max(0, Math.min(1, this.value())) * 100);

  hostClasses = computed(() => [
    'ds-progress-bar',
    `ds-progress-bar--size-${this.size()}`,
    `ds-progress-bar--tone-${this.tone()}`,
    this.indeterminate() ? 'ds-progress-bar--indeterminate' : '',
  ].filter(Boolean).join(' '));
}
