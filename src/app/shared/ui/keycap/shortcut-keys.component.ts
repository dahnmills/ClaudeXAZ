import { Component, input } from '@angular/core';
import { KeycapComponent } from './keycap.component';

/**
 * Jeton de séquence dans un combo. Sépare deux touches pressées L'UNE APRÈS
 * L'AUTRE (accord : « G puis I ») de deux touches pressées ENSEMBLE.
 * Reconnu ici uniquement à l'affichage — c'est l'appelant qui décide si son
 * catalogue utilise des accords.
 */
export const KEY_THEN = 'then';

/**
 * Un combo = suite de libellés de touches, déjà résolus pour l'OS courant.
 * Les touches simultanées se suivent (`['Alt', 'M']`) ; `KEY_THEN` marque une
 * séquence (`['G', 'then', 'I']`).
 */
export type KeyCombo = readonly string[];

/**
 * Molécule — rend un combo complet en composant `ds-keycap`.
 *
 * Pas de « + » entre les touches : les carrés accolés suffisent à lire la
 * simultanéité, et c'est la convention de Figma comme de macOS. Le mot « then »
 * est le seul séparateur, réservé aux accords.
 */
@Component({
  selector: 'ds-shortcut-keys',
  standalone: true,
  imports: [KeycapComponent],
  templateUrl: './shortcut-keys.component.html',
  styleUrl: './shortcut-keys.component.scss',
  host: { class: 'ds-shortcut-keys' },
})
export class ShortcutKeysComponent {
  keys = input.required<KeyCombo>();
  tone = input<'default' | 'accent'>('default');

  readonly then = KEY_THEN;
}
