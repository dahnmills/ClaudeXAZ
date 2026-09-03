import { Component, computed, input, output } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { ShortcutKeysComponent, type KeyCombo } from '../keycap/shortcut-keys.component';

/**
 * Atom interne au composant Flyout Menu — entrée d'action (icône + label) avec ses états.
 * Pas destiné à être utilisé en dehors d'un <ds-flyout-menu>.
 *
 * `shortcut` affiche la combinaison clavier de l'action, alignée à droite. Un
 * raccourci ne s'apprend pas dans une page d'aide qu'on ne visite pas : il
 * s'apprend là où on fait déjà la chose à la souris.
 */
@Component({
  selector: 'ds-flyout-menu-item',
  standalone: true,
  imports: [IconComponent, ShortcutKeysComponent],
  templateUrl: './flyout-menu-item.component.html',
  styleUrl: './flyout-menu-item.component.scss',
  host: {
    '[class]':              'hostClasses()',
    'role':                 'menuitem',
    '[attr.tabindex]':      'disabled() ? -1 : 0',
    '[attr.aria-disabled]': 'disabled() || null',
    '(click)':              '!disabled() && clicked.emit()',
    '(keydown.enter)':      '!disabled() && clicked.emit()',
    '(keydown.space)':      '$event.preventDefault(); !disabled() && clicked.emit()',
  },
})
export class FlyoutMenuItemComponent {
  label    = input.required<string>();
  icon     = input<IconName | null>(null);
  disabled = input<boolean>(false);
  /** Combinaison clavier de l'action, libellés déjà résolus pour l'OS. */
  shortcut = input<KeyCombo>([]);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-flyout-menu-item',
    this.disabled() ? 'ds-flyout-menu-item--disabled' : '',
  ].filter(Boolean).join(' '));
}
