import { Component } from '@angular/core';

/**
 * Flyout Menu — panneau dropdown contenant des actions.
 * Le positionnement (ancre, top/left, etc.) est géré par le consommateur.
 * Compose des <ds-flyout-menu-item> en content projection.
 */
@Component({
  selector: 'ds-flyout-menu',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './flyout-menu.component.scss',
  host: {
    'class': 'ds-flyout-menu',
    'role':  'menu',
  },
})
export class FlyoutMenuComponent {}
