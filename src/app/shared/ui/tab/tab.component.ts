import { Component, input, output, computed } from '@angular/core';

export type TabTone = 'default' | 'accent' | 'reversed';

@Component({
  selector: 'ds-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  host: {
    '[class]':              'hostClasses()',
    'role':                 'tab',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]':      'selected() ? 0 : -1',
    '(click)':              '!disabled() && selected.set ? null : clicked.emit()',
    '(keydown.enter)':      '!disabled() && clicked.emit()',
    '(keydown.space)':      '$event.preventDefault(); !disabled() && clicked.emit()',
  },
})
export class TabComponent {
  tone     = input<TabTone>('default');
  selected = input<boolean>(false);
  disabled = input<boolean>(false);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-tab',
    `ds-tab--tone-${this.tone()}`,
    this.selected() ? 'ds-tab--selected'  : '',
    this.disabled() ? 'ds-tab--disabled'  : '',
  ].filter(Boolean).join(' '));
}
