import { Component, input } from '@angular/core';

/**
 * Atom interne au composant Modal — zone de contenu scrollable.
 * Pas destiné à être utilisé en dehors d'un <ds-modal>.
 */
@Component({
  selector: 'ds-modal-content',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './modal-content.component.scss',
  host: {
    'class':         'ds-modal-content',
    '[style.height]': 'height()',
  },
})
export class ModalContentComponent {
  /** Hauteur fixe (px ou autre unité CSS). Defaults to 460px conformément à Figma. */
  height = input<string>('460px');
}
