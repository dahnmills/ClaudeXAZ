import { Component } from '@angular/core';

@Component({
  selector: 'ds-spinner',
  standalone: true,
  template: `<span class="ds-spinner__ring" aria-hidden="true"></span>`,
  styleUrl: './spinner.component.scss',
  host: {
    'class': 'ds-spinner',
    'role': 'status',
    'aria-label': 'Chargement en cours',
  },
})
export class SpinnerComponent {}
