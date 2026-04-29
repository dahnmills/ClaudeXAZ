import { Component, computed, input } from '@angular/core';

export type CellSize  = 's' | 'm';
export type CellAlign = 'left' | 'right' | 'center';

/**
 * Cellule de données — affiche du texte ou un slot custom.
 * S'utilise dans une <ds-table-row>. Padding aligné Figma : pl-8 / pr-20 / py 16 (M) ou 8 (S).
 */
@Component({
  selector: 'ds-cell',
  standalone: true,
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
  host: {
    '[class]':       'hostClasses()',
    'role':          'cell',
  },
})
export class CellComponent {
  size       = input<CellSize>('m');
  align      = input<CellAlign>('left');
  /** Style "New" (ligne nouvelle) — passe le contenu en bold */
  emphasized = input<boolean>(false);

  hostClasses = computed(() => [
    'ds-cell',
    `ds-cell--size-${this.size()}`,
    `ds-cell--align-${this.align()}`,
    this.emphasized() ? 'ds-cell--emphasized' : '',
  ].filter(Boolean).join(' '));
}
