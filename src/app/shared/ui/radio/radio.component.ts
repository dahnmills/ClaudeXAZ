import { Component, computed, input, output } from '@angular/core';

export type RadioState = 'Default' | 'Hover' | 'Active' | 'Disabled';

/**
 * Bouton radio — cercle de 20px, dot de 8px.
 *
 * États Figma : Default, Hover, Active, Disabled
 * Propriétés   : selected, error, disabled, label
 */
@Component({
  selector: 'ds-radio',
  standalone: true,
  imports: [],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.role]': '"radio"',
    '[attr.tabindex]': 'disabled() ? null : 0',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-checked]': 'selected()',
    '(click)': 'onActivate()',
    '(keydown.enter)': 'onActivate()',
    '(keydown.space)': '$event.preventDefault(); onActivate()',
  },
})
export class RadioComponent {
  selected = input<boolean>(false);
  error    = input<boolean>(false);
  disabled = input<boolean>(false);
  label    = input<string>('');
  /** État visuel forcé pour Storybook (Default | Hover | Active | Disabled). */
  state    = input<RadioState>('Default');

  selectedChange = output<boolean>();

  hostClasses = computed(() => [
    'ds-radio',
    `ds-radio--state-${this.state()}`,
    this.selected() ? 'ds-radio--selected' : '',
    this.error()    ? 'ds-radio--error'    : '',
    this.disabled() ? 'ds-radio--disabled' : '',
  ].filter(Boolean).join(' '));

  onActivate(): void {
    if (this.disabled()) return;
    if (this.selected()) return; // un radio coché reste coché
    this.selectedChange.emit(true);
  }
}
