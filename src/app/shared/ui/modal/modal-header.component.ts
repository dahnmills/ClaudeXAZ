import { Component, input, output } from '@angular/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent } from '../icon/icon.component';

/**
 * Atom interne au composant Modal — sert d'en-tête (titre + close).
 * Pas destiné à être utilisé en dehors d'un <ds-modal>.
 */
@Component({
  selector: 'ds-modal-header',
  standalone: true,
  imports: [ButtonIconComponent, IconComponent],
  templateUrl: './modal-header.component.html',
  styleUrl: './modal-header.component.scss',
  host: {
    'class': 'ds-modal-header',
  },
})
export class ModalHeaderComponent {
  title = input.required<string>();

  closeClicked = output<void>();
}
