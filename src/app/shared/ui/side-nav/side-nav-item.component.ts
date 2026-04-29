import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ds-side-nav-item',
  standalone: true,
  imports: [],
  templateUrl: './side-nav-item.component.html',
  styleUrl: './side-nav-item.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'menuitem',
    '[attr.aria-current]': 'selected() ? "page" : null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': '!disabled() && clicked.emit()',
    '(keydown.enter)': '!disabled() && clicked.emit()',
    '(keydown.space)': '$event.preventDefault(); !disabled() && clicked.emit()',
  },
})
export class SideNavItemComponent {
  selected = input<boolean>(false);
  disabled = input<boolean>(false);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-side-nav-item',
    this.selected()  ? 'ds-side-nav-item--selected'  : '',
    this.disabled()  ? 'ds-side-nav-item--disabled'  : '',
  ].filter(Boolean).join(' '));
}
