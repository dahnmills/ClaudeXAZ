import { Component, computed, input, output } from '@angular/core';

export type TableRowState = 'default' | 'active' | 'disabled';

/**
 * Rangée d'un tableau — wrapper flex pour des <ds-cell> / <ds-cell-action> / <ds-cell-selection>.
 *
 * États :
 *   • default   — normal
 *   • active    — sélectionnée (ex. ligne courante d'un détail)
 *   • disabled  — non interactive, opacité réduite
 *
 * Comportement :
 *   • interactive=true → la rangée gère hover + cursor + clavier + emit `clicked`
 *   • new=true        → marque la ligne comme "nouvelle" (passe les cells emphasized via CSS)
 */
@Component({
  selector: 'ds-table-row',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './table-row.component.scss',
  host: {
    '[class]':              'hostClasses()',
    'role':                 'row',
    '[attr.tabindex]':      'interactive() && !isDisabled() ? 0 : null',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '(click)':              'onClick($event)',
    '(keydown.enter)':      'onClick($event)',
    '(keydown.space)':      '$event.preventDefault(); onClick($event)',
  },
})
export class TableRowComponent {
  state       = input<TableRowState>('default');
  interactive = input<boolean>(false);
  /** Marque la ligne comme nouvelle — bg subtil + cells en gras */
  new         = input<boolean>(false);

  clicked = output<MouseEvent | KeyboardEvent>();

  isDisabled = computed(() => this.state() === 'disabled');

  hostClasses = computed(() => [
    'ds-table-row',
    `ds-table-row--state-${this.state()}`,
    this.interactive() ? 'ds-table-row--interactive' : '',
    this.new()         ? 'ds-table-row--new'         : '',
  ].filter(Boolean).join(' '));

  onClick(event: MouseEvent | KeyboardEvent): void {
    if (this.isDisabled() || !this.interactive()) return;
    this.clicked.emit(event);
  }
}
