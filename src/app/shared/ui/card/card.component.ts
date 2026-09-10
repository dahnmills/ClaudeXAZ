import { Component, input } from '@angular/core';

/** Teinte de la carte. `positive` / `negative` marquent un changement en attente. */
export type CardTone = 'default' | 'positive' | 'negative';

@Component({
  selector: 'ds-card',
  standalone: true,
  imports: [],
  template: '<ng-content />',
  styleUrl: './card.component.scss',
  host: {
    'class':                    'ds-card',
    '[class.ds-card--no-padding]':     'noPadding()',
    '[class.ds-card--elevated]':       'elevated()',
    '[class.ds-card--tone-positive]':  'tone() === "positive"',
    '[class.ds-card--tone-negative]':  'tone() === "negative"',
    '[attr.aria-busy]':         'loading() || null',
  },
})
export class CardComponent {
  /** Supprime le padding interne : utile quand le contenu gère son propre espacement */
  noPadding = input<boolean>(false);
  /** État de chargement : passe aria-busy=true */
  loading   = input<boolean>(false);
  /** Détache la carte au repos (ex : row expandable en état ouvert). Voir DESIGN.md Elevation */
  elevated  = input<boolean>(false);
  /**
   * Teinte fonctionnelle. Sert à marquer un ajout ou un retrait tant qu'il n'est
   * pas confirmé : la carte se colore, le contenu ne bouge pas. La couleur seule
   * ne porte jamais le sens, elle double toujours un libellé (voir ds-badge).
   */
  tone      = input<CardTone>('default');
}
