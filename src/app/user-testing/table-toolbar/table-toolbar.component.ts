import { Component, input } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './table-toolbar.component.html',
  styleUrl: './table-toolbar.component.scss',
})
export class TableToolbarComponent {
  total = input<number>(0);
  selected = input<number>(0);
  itemsLabel = input<string>('items');
  selectedLabel = input<string>('selected');
  actionLabels = input<string[]>([]);
}
