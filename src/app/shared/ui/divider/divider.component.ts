import { Component, computed, input } from '@angular/core';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerTone = 'subtle' | 'strong';

@Component({
  selector: 'ds-divider',
  standalone: true,
  template: '',
  styleUrl: './divider.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'separator',
    '[attr.aria-orientation]': 'orientation()',
  },
})
export class DividerComponent {
  orientation = input<DividerOrientation>('horizontal');
  tone        = input<DividerTone>('subtle');

  hostClasses = computed(() => [
    'ds-divider',
    `ds-divider--orientation-${this.orientation()}`,
    `ds-divider--tone-${this.tone()}`,
  ].join(' '));
}
