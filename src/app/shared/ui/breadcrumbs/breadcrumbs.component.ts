import { Component } from '@angular/core';

@Component({
  selector: 'ds-breadcrumbs',
  standalone: true,
  template: `
    <div class="ds-breadcrumbs__trail">
      <ng-content select=":not([slot=actions])" />
    </div>
    <div class="ds-breadcrumbs__actions">
      <ng-content select="[slot=actions]" />
    </div>
  `,
  styleUrl: './breadcrumbs.component.scss',
  host: {
    'class':      'ds-breadcrumbs',
    'role':       'navigation',
    'aria-label': 'Breadcrumb',
  },
})
export class BreadcrumbsComponent {}
