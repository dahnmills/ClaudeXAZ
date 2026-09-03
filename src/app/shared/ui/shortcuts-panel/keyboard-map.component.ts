import { Component, computed, input, output } from '@angular/core';
import { KeycapComponent } from '../keycap/keycap.component';
import { TagComponent } from '../tag/tag.component';

/** Données de l'onglet Layout. Tout est déjà résolu par l'appelant. */
export interface KeyboardMapView {
  /** Dispositions proposées, déjà libellées. */
  layouts: readonly { value: string; label: string }[];
  /** Disposition retenue pour le dessin. */
  layout: string;
  /** D'où vient ce dessin : légendes du navigateur, choix manuel, ou supposition. */
  source: 'browser' | 'manual' | 'guess';
  /** Rangées de lettres telles qu'imprimées sur les touches. */
  rows: readonly (readonly string[])[];
  /** Lettres qui portent déjà un raccourci. */
  lit: readonly string[];
}

/**
 * Sous-composant du panneau — onglet « Layout ».
 *
 * Répond à la seule question que pose une disposition : « est-ce que mes
 * raccourcis bougent si mon clavier n'est pas un QWERTY ? ». Non — ils suivent
 * la lettre GRAVÉE sur la touche. Le clavier dessiné le montre au lieu de le
 * promettre : les touches allumées sont celles qui portent un raccourci, à leur
 * vraie place sur la disposition de l'utilisateur.
 *
 * D'où le choix de ne dessiner QUE les trois rangées de lettres. La rangée de
 * chiffres est identique sur toutes les dispositions latines — la montrer
 * n'apprendrait rien, et le panneau tient à hauteur constante.
 *
 * Sélecteur en `ds-tag` et non en `ds-select` : trois choix ne méritent pas un
 * menu, et un menu déroulant serait rogné par le défilement du corps du
 * panneau.
 *
 * Pas destiné à être utilisé en dehors d'un `<ds-shortcuts-panel>`.
 */
@Component({
  selector: 'ds-keyboard-map',
  standalone: true,
  imports: [KeycapComponent, TagComponent],
  templateUrl: './keyboard-map.component.html',
  styleUrl: './keyboard-map.component.scss',
})
export class KeyboardMapComponent {
  view = input.required<KeyboardMapView>();

  /** Disposition choisie par l'utilisateur — n'affecte QUE le dessin. */
  layoutChange = output<string>();

  private litSet = computed(() => new Set(this.view().lit));

  isLit(letter: string): boolean {
    return this.litSet().has(letter);
  }
}
