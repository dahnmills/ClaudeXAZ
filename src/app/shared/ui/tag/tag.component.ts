import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type TagType = 'static' | 'filter' | 'select';

@Component({
  selector: 'ds-tag',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-pressed]': 'type() === "select" ? selected() : null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'isInteractive() && !disabled() ? 0 : null',
    'role': 'button',
    '(click)': 'onClick()',
    '(keydown.enter)': 'onKey($event)',
    '(keydown.space)': 'onKey($event)',
  },
})
export class TagComponent {
  type = input<TagType>('select');
  label = input.required<string>();
  selected = input<boolean>(false);
  disabled = input<boolean>(false);

  toggled = output<void>();
  removed = output<void>();

  isInteractive = computed(() => this.type() !== 'static');

  hostClasses = computed(() => [
    'ds-tag',
    `ds-tag--${this.type()}`,
    this.selected() ? 'ds-tag--selected' : '',
    this.disabled() ? 'ds-tag--disabled' : '',
  ].filter(Boolean).join(' '));

  onClick() {
    if (this.disabled()) return;
    if (this.type() === 'select') this.toggled.emit();
    if (this.type() === 'filter') this.removed.emit();
  }

  onKey(ev: KeyboardEvent) {
    if (ev.key === ' ') ev.preventDefault();
    this.onClick();
  }
}
