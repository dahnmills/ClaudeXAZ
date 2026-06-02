import { Component, computed, input, output } from '@angular/core';

export type ChipType = 'static' | 'filter' | 'select';
export type ChipSize = 's' | 'm';

@Component({
  selector: 'ds-chip',
  standalone: true,
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  host: {
    '[class]':            'hostClasses()',
    '[attr.aria-pressed]': 'type() === "select" ? selected() : null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]':    'isInteractive() && !disabled() ? 0 : null',
    'role':               'button',
    '(click)':            'onActivate()',
    '(keydown.enter)':    'onActivate()',
    '(keydown.space)':    '$event.preventDefault(); onActivate()',
  },
})
export class ChipComponent {
  type     = input<ChipType>('static');
  label    = input.required<string>();
  size     = input<ChipSize>('m');
  selected = input<boolean>(false);
  disabled = input<boolean>(false);

  activated = output<void>();
  removed   = output<void>();

  isInteractive = computed(() => this.type() !== 'static');

  hostClasses = computed(() => [
    'ds-chip',
    `ds-chip--type-${this.type()}`,
    `ds-chip--size-${this.size()}`,
    this.selected() ? 'ds-chip--selected' : '',
    this.disabled() ? 'ds-chip--disabled' : '',
  ].filter(Boolean).join(' '));

  onActivate(): void {
    if (this.disabled()) return;
    if (this.type() === 'select') this.activated.emit();
    if (this.type() === 'filter') this.removed.emit();
  }
}
