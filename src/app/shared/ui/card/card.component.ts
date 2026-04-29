import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-card',
  standalone: true,
  imports: [],
  template: '<ng-content />',
  styleUrl: './card.component.scss',
  host: {
    'class':                    'ds-card',
    '[class.ds-card--no-padding]': 'noPadding()',
    '[attr.aria-busy]':         'loading() || null',
  },
})
export class CardComponent {
  /** Supprime le padding interne — utile quand le contenu gère son propre espacement */
  noPadding = input<boolean>(false);
  /** État de chargement — passe aria-busy=true */
  loading   = input<boolean>(false);
}
