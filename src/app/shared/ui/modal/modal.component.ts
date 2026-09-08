import { Component, computed, HostListener, input, output } from '@angular/core';
import { ModalHeaderComponent } from './modal-header.component';
import { ModalContentComponent } from './modal-content.component';
import { ModalFooterComponent } from './modal-footer.component';

export type ModalSize = 'small' | 'medium' | 'large' | 'xlarge';

@Component({
  selector: 'ds-modal',
  standalone: true,
  imports: [ModalHeaderComponent, ModalContentComponent, ModalFooterComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    '[class]':            'hostClasses()',
    '[attr.aria-hidden]': '!open() || suspended() ? true : null',
    '[attr.title]':       'null',
    'role':               'dialog',
    'aria-modal':         'true',
  },
})
export class ModalComponent {
  open  = input<boolean>(false);
  size  = input<ModalSize>('medium');
  title = input.required<string>();

  // Footer
  /** Affiche/masque entièrement le footer (boutons + zone grise) */
  footer    = input<boolean>(true);
  showBack  = input<boolean>(false);
  backLabel = input<string>('Back');

  // Comportement de fermeture
  closeOnBackdrop = input<boolean>(true);
  closeOnEscape   = input<boolean>(true);

  /** On n'empile pas une popin d'alerte sur une modale : la modale s'efface le
   *  temps de la question et revient intacte si on annule. Elle reste montée
   *  (saisies, position de défilement conservées), mais devient invisible,
   *  inatteignable au clavier et sourde à Échap. C'est la popin qui répond. */
  suspended = input<boolean>(false);

  // Hauteur du contenu (passée au ds-modal-content)
  contentHeight = input<string>('460px');

  closed      = output<void>();
  backClicked = output<void>();

  hostClasses = computed(() => [
    'ds-modal',
    `ds-modal--${this.size()}`,
    this.open() ? 'ds-modal--open' : '',
    this.suspended() ? 'ds-modal--suspended' : '',
  ].filter(Boolean).join(' '));

  onBackdropClick(): void {
    if (this.closeOnBackdrop() && !this.suspended()) {
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open() && this.closeOnEscape() && !this.suspended()) {
      this.closed.emit();
    }
  }
}
