import { Component } from '@angular/core';

@Component({
  selector: 'ds-breadcrumbs',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './breadcrumbs.component.scss',
  host: {
    'class':      'ds-breadcrumbs',
    'role':       'navigation',
    'aria-label': 'Breadcrumb',
  },
})
export class BreadcrumbsComponent {}
