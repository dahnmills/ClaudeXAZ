import { Component, computed, input, output } from '@angular/core';

export type ToggleState = 'Default' | 'Hover' | 'Active' | 'Disabled';

/**
 * Toggle (switch) — track 40×20, knob 16×16.
 *
 * États Figma : Default, Hover, Active, Disabled
 * Propriétés   : selected, error, disabled, label
 */
@Component({
  selector: 'ds-toggle',
  standalone: true,
  imports: [],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.role]': '"switch"',
    '[attr.tabindex]': 'disabled() ? null : 0',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-checked]': 'selected()',
    '(click)': 'onActivate()',
    '(keydown.enter)': 'onActivate()',
    '(keydown.space)': '$event.preventDefault(); onActivate()',
  },
})
export class ToggleComponent {
  selected = input<boolean>(false);
  error    = input<boolean>(false);
  disabled = input<boolean>(false);
  label    = input<string>('');
  /** État visuel forcé pour Storybook (Default | Hover | Active | Disabled). */
  state    = input<ToggleState>('Default');

  selectedChange = output<boolean>();

  hostClasses = computed(() => [
    'ds-toggle',
    `ds-toggle--state-${this.state()}`,
    this.selected() ? 'ds-toggle--selected' : '',
    this.error()    ? 'ds-toggle--error'    : '',
    this.disabled() ? 'ds-toggle--disabled' : '',
  ].filter(Boolean).join(' '));

  onActivate(): void {
    if (this.disabled()) return;
    this.selectedChange.emit(!this.selected());
  }
}
