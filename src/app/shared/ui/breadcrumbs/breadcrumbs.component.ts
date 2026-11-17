import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-breadcrumbs',
  standalone: true,
  // Ordre DOM logique : le fil d'Ariane d'abord, les actions ensuite. L'ordre
  // visuel (fil à gauche, actions à droite) est inchangé : même flux, actions
  // poussées à droite par `margin-left: auto`.
  template: `
    <div class="ds-breadcrumbs__trail">
      <ng-content />
    </div>
    <div class="ds-breadcrumbs__actions">
      <ng-content select="[slot=actions]" />
    </div>
  `,
  styleUrl: './breadcrumbs.component.scss',
  host: {
    'class':            'ds-breadcrumbs',
    'role':             'navigation',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class BreadcrumbsComponent {
  /** Nom accessible de la navigation (défaut « Breadcrumb »). */
  ariaLabel = input<string>('Breadcrumb');
}
