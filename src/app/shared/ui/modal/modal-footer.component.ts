import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

/**
 * Atom interne au composant Modal — pied de page (Back + slot actions).
 * Pas destiné à être utilisé en dehors d'un <ds-modal>.
 */
@Component({
  selector: 'ds-modal-footer',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './modal-footer.component.html',
  styleUrl: './modal-footer.component.scss',
  host: {
    'class': 'ds-modal-footer',
  },
})
export class ModalFooterComponent {
  showBack  = input<boolean>(true);
  backLabel = input<string>('Back');

  backClicked = output<void>();
}
