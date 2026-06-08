import { Component, computed, input, output } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';

@Component({
  selector: 'ds-tile',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
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
export class TileComponent {
  label    = input.required<string>();
  icon     = input<IconName>('user');
  selected = input<boolean>(false);
  disabled = input<boolean>(false);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-tile',
    this.selected() ? 'ds-tile--selected' : '',
    this.disabled() ? 'ds-tile--disabled' : '',
  ].filter(Boolean).join(' '));
}
