import { Component, computed, input, output } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';

@Component({
  selector: 'ds-select-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './select-button.component.html',
  styleUrl: './select-button.component.scss',
  host: {
    '[class]':              'hostClasses()',
    '[attr.role]':          '"button"',
    '[attr.tabindex]':      'disabled() ? null : 0',
    '[attr.aria-pressed]':  'selected()',
    '[attr.aria-disabled]': 'disabled() || null',
    '(click)':              '!disabled() && clicked.emit()',
    '(keydown.enter)':      '!disabled() && clicked.emit()',
    '(keydown.space)':      '$event.preventDefault(); !disabled() && clicked.emit()',
  },
})
export class SelectButtonComponent {
  label    = input.required<string>();
  sublabel = input<string>('');
  icon     = input<IconName>('file');
  selected = input<boolean>(false);
  disabled = input<boolean>(false);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-select-button',
    this.selected() ? 'ds-select-button--selected' : '',
    this.disabled() ? 'ds-select-button--disabled' : '',
  ].filter(Boolean).join(' '));
}
