import { Component, HostListener, computed, input, output, signal } from '@angular/core';
import { ButtonComponent, type ButtonType, type ButtonTone } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ds-button-split',
  standalone: true,
  imports: [ButtonComponent, ButtonIconComponent, IconComponent],
  templateUrl: './button-split.component.html',
  styleUrl: './button-split.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class ButtonSplitComponent {
  type     = input<ButtonType>('primary');
  tone     = input<ButtonTone>('default');
  reversed = input<boolean>(false);
  disabled = input<boolean>(false);
  loading  = input<boolean>(false);

  primaryClicked = output<void>();
  toggleClicked  = output<boolean>();

  menuOpen = signal<boolean>(false);

  hostClasses = computed(() => [
    'ds-button-split',
    `ds-button-split--type-${this.type()}`,
    this.disabled() ? 'ds-button-split--disabled' : '',
    this.menuOpen() ? 'ds-button-split--menu-open' : '',
  ].filter(Boolean).join(' '));

  onPrimary(): void {
    if (this.disabled() || this.loading()) return;
    this.primaryClicked.emit();
  }

  onToggle(): void {
    if (this.disabled() || this.loading()) return;
    this.menuOpen.update(v => !v);
    this.toggleClicked.emit(this.menuOpen());
  }

  closeMenu(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.toggleClicked.emit(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    // Use composedPath (captured at dispatch time), not ev.target — the
    // toggle's own click flips menuOpen synchronously, which re-renders the
    // chevron icon's inner SVG ([innerHTML]) before this document-level
    // handler runs; ev.target can then point at an already-detached node,
    // making closest() return null and closing the menu on its own opening click.
    const path = ev.composedPath() as Element[];
    if (!path.some(el => el.tagName?.toLowerCase() === 'ds-button-split')) this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.closeMenu(); }
}
