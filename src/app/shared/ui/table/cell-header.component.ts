import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';

export type CellHeaderType = 'default' | 'action' | 'selection';
export type SortDirection  = 'asc' | 'desc' | null;

/**
 * Cellule d'en-tête de tableau — variants : default (titre + sort), action, selection (checkbox select-all).
 */
@Component({
  selector: 'ds-cell-header',
  standalone: true,
  imports: [IconComponent, CheckboxComponent],
  templateUrl: './cell-header.component.html',
  styleUrl: './cell-header.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role':    'columnheader',
  },
})
export class CellHeaderComponent {
  type          = input<CellHeaderType>('default');
  title         = input<string>('');
  subTitle      = input<string | null>(null);
  sortable      = input<boolean>(false);
  sortDirection = input<SortDirection>(null);

  /** État de la checkbox select-all (variant Selection) */
  allSelected      = input<boolean>(false);
  /** État indéterminé (certaines lignes sélectionnées, mais pas toutes) */
  allIndeterminate = input<boolean>(false);

  sortClicked        = output<void>();
  allSelectedChange  = output<boolean>();

  hostClasses = computed(() => [
    'ds-cell-header',
    `ds-cell-header--type-${this.type()}`,
  ].join(' '));

  sortIconName = computed(() => {
    const dir = this.sortDirection();
    if (dir === 'asc')  return 'chevron-up';
    if (dir === 'desc') return 'chevron-down';
    return 'unfold'; // non trié — double chevron neutre
  });

  toggleSelectAll(): void {
    this.allSelectedChange.emit(!this.allSelected());
  }
}
