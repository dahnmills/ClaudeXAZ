import { Component, computed, input } from '@angular/core';
import { TableRowComponent, CellComponent, CellHeaderComponent } from '../../shared/ui';
import { type DetailTable } from './buyer-summary-v2.data';

/** One table of the card detail panel (DS table rows and cells), or its
 *  dated empty sentence. */
@Component({
  selector: 'app-bento-detail-table',
  standalone: true,
  imports: [TableRowComponent, CellComponent, CellHeaderComponent],
  templateUrl: './bento-detail-table.component.html',
  styleUrl: './bento-detail-table.component.scss',
  host: { class: 'dt-section' },
})
export class BentoDetailTableComponent {
  table = input.required<DetailTable>();

  /** Column grid: "w" text column, "n" short column. */
  pattern = computed(() => this.table().columns.map(c => (c.wide ? 'w' : 'n')).join(''));
}
