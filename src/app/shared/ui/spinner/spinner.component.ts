import { Component, computed, input } from '@angular/core';

export type SpinnerSize = 'xs' | 's' | 'm' | 'l';
export type SpinnerTone = 'default' | 'current';

@Component({
  selector: 'ds-spinner',
  standalone: true,
  template: `<span class="ds-spinner__ring" aria-hidden="true"></span>`,
  styleUrl: './spinner.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'status',
    'aria-label': 'Chargement en cours',
  },
})
export class SpinnerComponent {
  size = input<SpinnerSize>('m');
  /** 'current' hérite de currentColor (utile dans Button loading state) */
  tone = input<SpinnerTone>('default');

  hostClasses = computed(() =>
    ['ds-spinner', `ds-spinner--size-${this.size()}`, `ds-spinner--tone-${this.tone()}`].join(' '),
  );
}
