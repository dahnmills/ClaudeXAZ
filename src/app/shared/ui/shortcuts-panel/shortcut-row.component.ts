import { Component, computed, input, output } from '@angular/core';
import { ShortcutKeysComponent, type KeyCombo } from '../keycap/shortcut-keys.component';

/**
 * Atome interne au panneau de raccourcis — une ligne « libellé … combo ».
 *
 * Le pointillé entre les deux n'est pas décoratif : sur trois colonnes de
 * libellés de longueurs très inégales, c'est lui qui rattache visuellement le
 * bon combo au bon libellé (le procédé des sommaires imprimés, repris par
 * Figma). Sans lui l'œil dérape d'une ligne à l'autre.
 *
 * La ligne est cliquable et déclenche l'action : le panneau sert alors de
 * palette de commandes autant que d'aide-mémoire — on peut faire la chose sans
 * connaître encore son raccourci, tout en le lisant. L'interactivité vit sur
 * l'hôte (pas de `<button>` natif), comme `ds-flyout-menu-item`.
 *
 * Pas destiné à être utilisé en dehors d'un `<ds-shortcuts-panel>`.
 */
@Component({
  selector: 'ds-shortcut-row',
  standalone: true,
  imports: [ShortcutKeysComponent],
  templateUrl: './shortcut-row.component.html',
  styleUrl: './shortcut-row.component.scss',
  host: {
    '[class]':          'hostClasses()',
    'role':             'button',
    'tabindex':         '0',
    // Seul reste du « Click a line to run it » retiré du pied : l'infobulle
    // native ne coûte aucun pixel permanent et n'apparaît qu'à qui hésite.
    'title':            'Run this shortcut',
    '(click)':          'activated.emit()',
    '(keydown.enter)':  'activated.emit()',
    '(keydown.space)':  '$event.preventDefault(); activated.emit()',
  },
})
export class ShortcutRowComponent {
  label = input.required<string>();
  keys  = input.required<KeyCombo>();
  /** Portée du raccourci, quand il n'est pas disponible partout. */
  context = input<string>('');
  /** Raccourci déjà déclenché au moins une fois → touches en bleu. */
  used = input<boolean>(false);

  activated = output<void>();

  hostClasses = computed(() => [
    'ds-shortcut-row',
    this.used() ? 'ds-shortcut-row--used' : '',
  ].filter(Boolean).join(' '));
}
