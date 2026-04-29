import { Component } from '@angular/core';

/**
 * Panneau Flyout — conteneur arrondi avec ombre.
 * Le positionnement (ancre, top/left, etc.) est géré par le consommateur.
 * Le contenu se compose de <ds-flyout-section> + <ds-flyout-item>.
 */
@Component({
  selector: 'ds-flyout',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './flyout.component.scss',
  host: {
    'class': 'ds-flyout',
    'role':  'dialog',
  },
})
export class FlyoutComponent {}
