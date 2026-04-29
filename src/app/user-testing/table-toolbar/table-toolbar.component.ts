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
  primaryLabel = input<string>('Primary action');
  secondaryLabel = input<string>('Secondary action');
  tertiaryLabel = input<string>('Tertiary action');
}
