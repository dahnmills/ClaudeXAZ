import { Component, computed, input, output } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'ds-checkbox-card',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './checkbox-card.component.html',
  styleUrl: './checkbox-card.component.scss',
  host: {
    '[class]':              'hostClasses()',
    '[attr.role]':          '"checkbox"',
    '[attr.tabindex]':      'disabled() ? null : 0',
    '[attr.aria-checked]':  'checked()',
    '[attr.aria-disabled]': 'disabled() || null',
    '(click)':              'onActivate()',
    '(keydown.enter)':      'onActivate()',
    '(keydown.space)':      '$event.preventDefault(); onActivate()',
  },
})
export class CheckboxCardComponent {
  label    = input.required<string>();
  sublabel = input<string>('');
  badge    = input<string>('');
  checked  = input<boolean>(false);
  disabled = input<boolean>(false);

  checkedChange = output<boolean>();

  hostClasses = computed(() => [
    'ds-checkbox-card',
    this.checked()  ? 'ds-checkbox-card--checked'  : '',
    this.disabled() ? 'ds-checkbox-card--disabled' : '',
  ].filter(Boolean).join(' '));

  onActivate(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }
}
