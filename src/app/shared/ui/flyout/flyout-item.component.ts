import { Component, computed, input } from '@angular/core';

/**
 * Atom interne au composant Flyout — entrée individuelle (titre + référence + badge optionnel).
 * Pas destiné à être utilisé en dehors d'un <ds-flyout>.
 */
@Component({
  selector: 'ds-flyout-item',
  standalone: true,
  templateUrl: './flyout-item.component.html',
  styleUrl: './flyout-item.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class FlyoutItemComponent {
  title       = input.required<string>();
  reference   = input<string | null>(null);
  emphasized  = input<boolean>(false);

  hostClasses = computed(() => [
    'ds-flyout-item',
    this.emphasized() ? 'ds-flyout-item--emphasized' : '',
  ].filter(Boolean).join(' '));
}
