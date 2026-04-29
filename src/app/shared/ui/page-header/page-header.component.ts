import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  host: {
    'class': 'ds-page-header',
  },
})
export class PageHeaderComponent {
  topbox      = input<boolean>(true);
  breadcrumb  = input<boolean>(true);
  tabs        = input<boolean>(true);
}
