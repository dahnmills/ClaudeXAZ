import { Component, computed, input, output } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';

/**
 * Atom interne au composant Flyout Menu — entrée d'action (icône + label) avec ses états.
 * Pas destiné à être utilisé en dehors d'un <ds-flyout-menu>.
 */
@Component({
  selector: 'ds-flyout-menu-item',
  standalone: true,
  imports: [IconComponent],
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

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-flyout-menu-item',
    this.disabled() ? 'ds-flyout-menu-item--disabled' : '',
  ].filter(Boolean).join(' '));
}
