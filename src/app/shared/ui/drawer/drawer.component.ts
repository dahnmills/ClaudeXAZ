import { Component, HostListener, computed, input, output } from '@angular/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ds-drawer',
  standalone: true,
  imports: [ButtonIconComponent, IconComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-hidden]': '!open()',
  },
})
export class DrawerComponent {
  open = input<boolean>(false);
  title = input.required<string>();
  closeOnEscape = input<boolean>(true);

  closed = output<void>();

  hostClasses = computed(() => [
    'ds-drawer',
    this.open() ? 'ds-drawer--open' : '',
  ].filter(Boolean).join(' '));

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open() && this.closeOnEscape()) {
      this.closed.emit();
    }
  }
}
