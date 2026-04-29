import { Component, input } from '@angular/core';

export interface PropertyRow {
  label: string;
  value: string | null;
  /** Force le display d'un placeholder ('-') si value est null/empty. Default true. */
  showEmptyPlaceholder?: boolean;
}

export interface PropertySection {
  title: string;
  rows: PropertyRow[];
}

/**
 * Grille de sections de propriétés (label/value), affichée en 1 ou 2 colonnes.
 * Réutilisée dans le contenu d'une modal "Full properties" et dans l'expansion accordéon de la Topbox.
 */
@Component({
  selector: 'ds-properties-panel',
  standalone: true,
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss',
  host: {
    '[class]': '"ds-properties-panel ds-properties-panel--cols-" + columns()',
  },
})
export class PropertiesPanelComponent {
  sections = input.required<PropertySection[]>();
  columns  = input<1 | 2 | 3 | 4>(2);
  /** Style 'card' = chaque section dans une box bordée — 'flat' = sans border (pour accordéon) */
  variant  = input<'card' | 'flat'>('card');
}
