import { Component, computed, input, output } from '@angular/core';
import { RadioComponent } from '../radio/radio.component';
import { BadgeComponent } from '../badge/badge.component';

export type RadioCardTone = 'default' | 'success' | 'warning' | 'error';

@Component({
  selector: 'ds-radio-card',
  standalone: true,
  imports: [RadioComponent, BadgeComponent],
  templateUrl: './radio-card.component.html',
  styleUrl: './radio-card.component.scss',
  host: {
    '[class]':              'hostClasses()',
    '[attr.role]':          '"radio"',
    '[attr.tabindex]':      'disabled() ? null : 0',
    '[attr.aria-checked]':  'selected()',
    '[attr.aria-disabled]': 'disabled() || null',
    '(click)':              'onActivate()',
    '(keydown.enter)':      'onActivate()',
    '(keydown.space)':      '$event.preventDefault(); onActivate()',
  },
})
export class RadioCardComponent {
  label      = input.required<string>();
  sublabel   = input<string>('');
  badge      = input<string>('');
  tone       = input<RadioCardTone>('default');
  selected   = input<boolean>(false);
  disabled   = input<boolean>(false);

  selectedChange = output<boolean>();

  hostClasses = computed(() => [
    'ds-radio-card',
    `ds-radio-card--tone-${this.tone()}`,
    this.selected() ? 'ds-radio-card--selected' : '',
    this.disabled() ? 'ds-radio-card--disabled' : '',
  ].filter(Boolean).join(' '));

  onActivate(): void {
    if (this.disabled() || this.selected()) return;
    this.selectedChange.emit(true);
  }
}
