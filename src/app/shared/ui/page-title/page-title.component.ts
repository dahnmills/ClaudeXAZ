import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-page-title',
  standalone: true,
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
  host: {
    'class': 'ds-page-title',
  },
})
export class PageTitleComponent {
  title = input.required<string>();
}
