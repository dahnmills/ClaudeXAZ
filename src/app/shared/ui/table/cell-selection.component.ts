import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { ToggleComponent } from '../toggle/toggle.component';

export type CellSelectionSize    = 's' | 'm';
export type CellSelectionControl =
  | 'drag'
  | 'check'
  | 'toggle'
  | 'drag-check'
  | 'drag-toggle';

/**
 * Cellule de sélection / réorganisation en début de ligne.
 * 5 combinaisons de contrôles : drag / check / toggle / drag+check / drag+toggle.
 *
 * Les contrôles `check` et `toggle` consomment respectivement `<ds-checkbox>`
 * et `<ds-toggle>` du design system (Data Entry).
 */
@Component({
  selector: 'ds-cell-selection',
  standalone: true,
  imports: [IconComponent, CheckboxComponent, ToggleComponent],
  templateUrl: './cell-selection.component.html',
  styleUrl: './cell-selection.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role':    'cell',
  },
})
export class CellSelectionComponent {
  size    = input<CellSelectionSize>('m');
  control = input<CellSelectionControl>('check');

  checked     = input<boolean>(false);
  toggleValue = input<boolean>(false);
  disabled    = input<boolean>(false);

  checkedChange = output<boolean>();
  toggleChange  = output<boolean>();
  /** Émis au mousedown sur le drag handle — le parent peut initier un drag. */
  dragStart     = output<MouseEvent>();

  hostClasses = computed(() => [
    'ds-cell-selection',
    `ds-cell-selection--size-${this.size()}`,
    this.disabled() ? 'ds-cell-selection--disabled' : '',
  ].filter(Boolean).join(' '));

  hasDrag   = computed(() => this.control() === 'drag'   || this.control() === 'drag-check' || this.control() === 'drag-toggle');
  hasCheck  = computed(() => this.control() === 'check'  || this.control() === 'drag-check');
  hasToggle = computed(() => this.control() === 'toggle' || this.control() === 'drag-toggle');

  onCheckedChange(value: boolean): void {
    if (this.disabled()) return;
    this.checkedChange.emit(value);
  }

  onToggleChange(value: boolean): void {
    if (this.disabled()) return;
    this.toggleChange.emit(value);
  }

  onDragMouseDown(event: MouseEvent): void {
    if (this.disabled()) return;
    this.dragStart.emit(event);
  }
}
