import { Component, computed, input, output } from '@angular/core';

export type VisualButtonTone = 'default' | 'accent';

@Component({
  selector: 'ds-visual-button',
  standalone: true,
  imports: [],
  templateUrl: './visual-button.component.html',
  styleUrl: './visual-button.component.scss',
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
export class VisualButtonComponent {
  title       = input.required<string>();
  description = input<string>('');
  tone        = input<VisualButtonTone>('default');
  selected    = input<boolean>(false);
  disabled    = input<boolean>(false);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-visual-button',
    `ds-visual-button--tone-${this.tone()}`,
    this.selected() ? 'ds-visual-button--selected' : '',
    this.disabled() ? 'ds-visual-button--disabled' : '',
  ].filter(Boolean).join(' '));
}
