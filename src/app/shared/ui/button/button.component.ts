import { Component, input, output, computed } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'plain';
export type ButtonTone = 'default' | 'accent' | 'positive' | 'negative';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    '[class]':            'hostClasses()',
    '[attr.disabled]':    'isInactive() || null',
    '[attr.aria-disabled]': 'isInactive() || null',
    '[attr.aria-busy]':   'loading() || null',
    '[attr.tabindex]':    'isInactive() ? -1 : 0',
    'role':               'button',
    '(click)':            '!isInactive() && clicked.emit()',
    '(keydown.enter)':    '!isInactive() && clicked.emit()',
    '(keydown.space)':    '$event.preventDefault(); !isInactive() && clicked.emit()',
  },
})
export class ButtonComponent {
  type      = input<ButtonType>('primary');
  tone      = input<ButtonTone>('default');
  reversed  = input<boolean>(false);
  disabled  = input<boolean>(false);
  loading   = input<boolean>(false);
  fullWidth = input<boolean>(false);

  clicked = output<void>();

  isInactive = computed(() => this.disabled() || this.loading());

  hostClasses = computed(() => [
    'ds-button',
    `ds-button--type-${this.type()}`,
    `ds-button--tone-${this.tone()}`,
    this.reversed()  ? 'ds-button--reversed'  : '',
    this.disabled()  ? 'ds-button--disabled'  : '',
    this.loading()   ? 'ds-button--loading'   : '',
    this.fullWidth() ? 'ds-button--full-width': '',
  ].filter(Boolean).join(' '));
}
