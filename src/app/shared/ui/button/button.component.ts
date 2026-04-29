import { Component, input, output, computed } from '@angular/core';

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'plain';
export type ButtonTone = 'default' | 'accent';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    '[class]':            'hostClasses()',
    '[attr.disabled]':    'disabled() || null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]':    'disabled() ? -1 : 0',
    'role':               'button',
    '(click)':            '!disabled() && clicked.emit()',
    '(keydown.enter)':    '!disabled() && clicked.emit()',
    '(keydown.space)':    '$event.preventDefault(); !disabled() && clicked.emit()',
  },
})
export class ButtonComponent {
  type     = input<ButtonType>('primary');
  tone     = input<ButtonTone>('default');
  reversed = input<boolean>(false);
  disabled = input<boolean>(false);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-button',
    `ds-button--type-${this.type()}`,
    `ds-button--tone-${this.tone()}`,
    this.reversed()  ? 'ds-button--reversed'  : '',
    this.disabled()  ? 'ds-button--disabled'  : '',
  ].filter(Boolean).join(' '));
}
