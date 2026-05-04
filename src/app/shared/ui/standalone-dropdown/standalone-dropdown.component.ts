import { Component, computed, input, output } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';

@Component({
  selector: 'ds-standalone-dropdown',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './standalone-dropdown.component.html',
  styleUrl: './standalone-dropdown.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    'role': 'button',
    '(click)': '!disabled() && clicked.emit()',
    '(keydown.enter)': '!disabled() && clicked.emit()',
    '(keydown.space)': '$event.preventDefault(); !disabled() && clicked.emit()',
  },
})
export class StandaloneDropdownComponent {
  icon = input<IconName | null>(null);
  label = input.required<string>();
  disabled = input<boolean>(false);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-standalone-dropdown',
    this.disabled() ? 'ds-standalone-dropdown--disabled' : '',
  ].filter(Boolean).join(' '));
}
