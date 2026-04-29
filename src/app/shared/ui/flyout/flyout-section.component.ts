import { Component, computed, input } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';

/**
 * Atom interne au composant Flyout — bloc de section avec label, icône et items.
 * Pas destiné à être utilisé en dehors d'un <ds-flyout>.
 */
@Component({
  selector: 'ds-flyout-section',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './flyout-section.component.html',
  styleUrl: './flyout-section.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class FlyoutSectionComponent {
  label       = input<string | null>(null);
  icon        = input<IconName | null>(null);
  highlighted = input<boolean>(false);

  hostClasses = computed(() => [
    'ds-flyout-section',
    this.highlighted() ? 'ds-flyout-section--highlighted' : '',
  ].filter(Boolean).join(' '));
}
