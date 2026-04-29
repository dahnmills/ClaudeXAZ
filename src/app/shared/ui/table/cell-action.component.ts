import { Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

export type CellActionSize = 's' | 'm';

/**
 * Cellule d'action en bout de ligne — bouton 3 points qui ouvre un flyout-menu.
 * Le menu est passé via le slot [slot=menu] (typiquement un <ds-flyout-menu>).
 *
 *   <ds-cell-action ariaLabel="Row actions">
 *     <ds-flyout-menu slot="menu">
 *       <ds-flyout-menu-item label="Edit"   icon="edit"   (clicked)="..."/>
 *       <ds-flyout-menu-item label="Delete" icon="trash"  (clicked)="..."/>
 *     </ds-flyout-menu>
 *   </ds-cell-action>
 */
@Component({
  selector: 'ds-cell-action',
  standalone: true,
  imports: [IconComponent, ButtonIconComponent],
  templateUrl: './cell-action.component.html',
  styleUrl: './cell-action.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role':    'cell',
  },
})
export class CellActionComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  size      = input<CellActionSize>('m');
  ariaLabel = input<string>('Row actions');

  menuOpened = output<void>();
  menuClosed = output<void>();

  protected open = signal(false);

  hostClasses = computed(() => [
    'ds-cell-action',
    `ds-cell-action--size-${this.size()}`,
  ].join(' '));

  toggleMenu(): void {
    const next = !this.open();
    this.open.set(next);
    if (next) this.menuOpened.emit();
    else      this.menuClosed.emit();
  }

  onMenuClick(event: MouseEvent): void {
    // Click sur un item du menu : on ferme. Le clic ne propage pas vers la rangée.
    event.stopPropagation();
    this.open.set(false);
    this.menuClosed.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as Node | null;
    if (target && this.hostRef.nativeElement.contains(target)) return;
    this.open.set(false);
    this.menuClosed.emit();
  }
}
