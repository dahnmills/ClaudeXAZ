import { Component, input, output, computed } from '@angular/core';

export type ButtonIconType = 'primary' | 'secondary' | 'tertiary' | 'plain';
export type ButtonIconTone = 'default' | 'accent' | 'positive' | 'negative';
export type ButtonIconSize = 's' | 'm';

@Component({
  selector: 'ds-button-icon',
  standalone: true,
  imports: [],
  template: '<ng-content />',
  styleUrl: './button-icon.component.scss',
  host: {
    '[class]':              'hostClasses()',
    '[attr.disabled]':      'disabled() || null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-label]':    'ariaLabel()',
    '[attr.tabindex]':      'disabled() ? -1 : 0',
    'role':                 'button',
    '(click)':              '!disabled() && clicked.emit()',
    '(keydown.enter)':      '!disabled() && clicked.emit()',
    '(keydown.space)':      '$event.preventDefault(); !disabled() && clicked.emit()',
  },
})
export class ButtonIconComponent {
  type     = input<ButtonIconType>('primary');
  tone     = input<ButtonIconTone>('default');
  size     = input<ButtonIconSize>('s');
  reversed = input<boolean>(false);
  disabled = input<boolean>(false);
  /** Obligatoire pour l'accessibilité — remplace le label textuel absent */
  ariaLabel = input.required<string>();

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-button-icon',
    `ds-button-icon--type-${this.type()}`,
    `ds-button-icon--tone-${this.tone()}`,
    `ds-button-icon--size-${this.size()}`,
    this.reversed() ? 'ds-button-icon--reversed'  : '',
    this.disabled() ? 'ds-button-icon--disabled'  : '',
  ].filter(Boolean).join(' '));
}
