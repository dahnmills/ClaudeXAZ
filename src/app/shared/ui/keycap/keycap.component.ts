import { Component, computed, input } from '@angular/core';

/**
 * Atome — représentation visuelle d'UNE touche du clavier.
 *
 * Rendu en `<kbd>`, l'élément sémantique de la saisie clavier : un lecteur
 * d'écran annonce « touche M » et non la lettre isolée au milieu d'une phrase.
 *
 * Purement présentationnel : le composant ignore l'OS et le raccourci auquel il
 * appartient — l'appelant lui passe un libellé DÉJÀ résolu (« Alt » sur
 * Windows, « ⌥ » sur macOS). Voir `keyLabel()` dans shortcuts.data.ts.
 *
 * `tone="accent"` porte l'état « déjà utilisé » du panneau de raccourcis : une
 * touche que l'utilisateur a réellement pressée passe en bleu, à la manière du
 * panneau de Figma. C'est le seul signal qui distingue un raccourci appris d'un
 * raccourci jamais essayé.
 */
@Component({
  selector: 'ds-keycap',
  standalone: true,
  imports: [],
  templateUrl: './keycap.component.html',
  styleUrl: './keycap.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class KeycapComponent {
  /** Libellé affiché sur la touche, déjà résolu pour l'OS courant. */
  label = input.required<string>();
  tone  = input<'default' | 'accent'>('default');

  /** Une touche nommée (Alt, Shift, Enter…) ne tient pas dans un carré. */
  wide = computed(() => this.label().length > 1);

  hostClasses = computed(() => [
    'ds-keycap',
    `ds-keycap--tone-${this.tone()}`,
    this.wide() ? 'ds-keycap--wide' : '',
  ].filter(Boolean).join(' '));
}
