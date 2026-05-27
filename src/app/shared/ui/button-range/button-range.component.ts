import { Component, computed, input, output } from '@angular/core';

export type ButtonRangeStatus = 'default' | 'selected' | 'between';

@Component({
  selector: 'ds-button-range',
  standalone: true,
  template: `{{ label() }}`,
  styleUrl: './button-range.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-disabled]': 'disabled() || null',
    'role': 'button',
    '(click)': '!disabled() && clicked.emit()',
    '(keydown.enter)': '!disabled() && clicked.emit()',
    '(keydown.space)': '$event.preventDefault(); !disabled() && clicked.emit()',
  },
})
export class ButtonRangeComponent {
  label = input.required<string>();
  status = input<ButtonRangeStatus>('default');
  disabled = input<boolean>(false);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-button-range',
    `ds-button-range--${this.status()}`,
    this.disabled() ? 'ds-button-range--disabled' : '',
  ].filter(Boolean).join(' '));
}
