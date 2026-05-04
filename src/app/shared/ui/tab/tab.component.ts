import { Component, input, output, computed } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type TabTone = 'default' | 'accent' | 'reversed';

@Component({
  selector: 'ds-tab',
  standalone: true,
  imports: [IconComponent],
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

  // Figma 57:231 — extra slots
  icon     = input<boolean>(false);          // gates [slot=icon] rendering
  counter  = input<number | null>(null);     // red badge top-right
  chevron  = input<boolean>(false);          // dropdown indicator

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-tab',
    `ds-tab--tone-${this.tone()}`,
    this.selected() ? 'ds-tab--selected'  : '',
    this.disabled() ? 'ds-tab--disabled'  : '',
  ].filter(Boolean).join(' '));
}
