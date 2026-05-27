import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';

export type CellHeaderType  = 'default' | 'action' | 'selection';
export type CellHeaderAlign = 'left' | 'right' | 'center';
export type SortDirection   = 'asc' | 'desc' | null;

@Component({
  selector: 'ds-cell-header',
  standalone: true,
  imports: [IconComponent, CheckboxComponent],
  templateUrl: './cell-header.component.html',
  styleUrl: './cell-header.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role':    'columnheader',
    '[attr.tabindex]':  'sortable() && type() === "default" ? 0 : null',
    '[attr.aria-sort]': 'sortAttr()',
    '(click)':           'onHostClick()',
    '(keydown.enter)':   'onHostClick()',
    '(keydown.space)':   'onHostKeySpace($event)',
  },
})
export class CellHeaderComponent {
  type          = input<CellHeaderType>('default');
  title         = input<string>('');
  subTitle      = input<string | null>(null);
  sortable      = input<boolean>(false);
  sortDirection = input<SortDirection>(null);
  align         = input<CellHeaderAlign>('left');

  allSelected      = input<boolean>(false);
  allIndeterminate = input<boolean>(false);

  sortClicked        = output<void>();
  allSelectedChange  = output<boolean>();

  hostClasses = computed(() => [
    'ds-cell-header',
    `ds-cell-header--type-${this.type()}`,
    `ds-cell-header--align-${this.align()}`,
    this.sortable() && this.type() === 'default' ? 'ds-cell-header--sortable' : '',
    this.sortDirection() === 'asc' ? 'ds-cell-header--sorted-asc' : '',
    this.sortDirection() === 'desc' ? 'ds-cell-header--sorted-desc' : '',
  ].filter(Boolean).join(' '));

  sortIconName = computed(() => {
    const dir = this.sortDirection();
    if (dir === 'asc')  return 'chevron-up';
    if (dir === 'desc') return 'chevron-down';
    return 'unfold';
  });

  sortAttr = computed(() => {
    const dir = this.sortDirection();
    if (dir === 'asc') return 'ascending';
    if (dir === 'desc') return 'descending';
    return 'none';
  });

  onHostClick(): void {
    if (!this.sortable() || this.type() !== 'default') return;
    this.sortClicked.emit();
  }

  onHostKeySpace(event: Event): void {
    if (!this.sortable() || this.type() !== 'default') return;
    event.preventDefault();
    this.sortClicked.emit();
  }

  toggleSelectAll(): void {
    this.allSelectedChange.emit(!this.allSelected());
  }
}
