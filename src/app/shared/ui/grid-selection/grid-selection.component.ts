import { Component, input, output } from '@angular/core';

export interface SlotDef { cols: 1 | 2; rows: 1 | 2; }

export type LayoutId = '4x1' | '2x1-1x1-1x1' | '2x2-mix' | '1x2-side' | '2x2-full' | '4x2-alt';

export interface LayoutConfig {
  id: LayoutId;
  label: string;
  slots: SlotDef[];
  gridCols: number;
}

@Component({
  selector: 'ds-grid-selection',
  standalone: true,
  imports: [],
  template: `
    <button
      class="ds-grid-selection"
      [class.ds-grid-selection--selected]="selected()"
      type="button"
      (click)="selectedChange.emit()"
    >
      <div class="ds-grid-selection__grid"
           [style.grid-template-columns]="'repeat(' + layout().gridCols + ', 1fr)'">
        @for (slot of layout().slots; track $index) {
          <div class="ds-grid-selection__block"
               [style.grid-column]="'span ' + slot.cols"
               [style.grid-row]="'span ' + slot.rows">
          </div>
        }
      </div>
      <span class="ds-grid-selection__label">{{ layout().label }}</span>
    </button>
  `,
  styleUrl: './grid-selection.component.scss',
})
export class GridSelectionComponent {
  layout   = input.required<LayoutConfig>();
  selected = input<boolean>(false);

  selectedChange = output<void>();
}
