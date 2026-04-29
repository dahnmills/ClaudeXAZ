import { Component, computed, input, output } from '@angular/core';

export type CheckboxState = 'Default' | 'Hover' | 'Active' | 'Disabled';

/**
 * Case à cocher — rendue sur un carré de 20px.
 *
 * États Figma :
 *   Default, Hover, Active, Disabled
 *
 * Propriétés :
 *   checked       — état coché
 *   indeterminate — état intermédiaire (l'indicateur "-")
 *   error         — bordure rouge + fond rouge quand checked
 *   disabled      — opacité 40%, pointer-events none
 */
@Component({
  selector: 'ds-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  host: {
    '[class]':  'hostClasses()',
    '[attr.tabindex]': 'isDisabled() ? null : 0',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.aria-checked]': 'checked()',
    '(click)': 'onContainerClick()',
    '(keydown.enter)': 'onKeydown()',
    '(keydown.space)': '$event.preventDefault(); onKeydown()',
  },
})
export class CheckboxComponent {
  checked       = input<boolean>(false);
  indeterminate = input<boolean>(false);
  error         = input<boolean>(false);
  disabled      = input<boolean>(false);
  label         = input<string>('');

  checkedChange         = output<boolean>();
  indeterminateChange   = output<boolean>();
  state                 = input<CheckboxState>('Default');

  isDisabled = computed(() => this.disabled());

  // Affiche "✓" : checked ET (pas indeterminate OU checked+error+disabled)
  showCheck = computed(
    () => this.checked() && (!this.indeterminate() || this.checkedError()),
  );

  // Affiche "-" : checked+indeterminate ET (pas error OU checked+error+disabled)
  showIndeterminate = computed(
    () => this.checked() && this.indeterminate() && !this.indeterminateError(),
  );

  checkedError = computed(() => this.checked() && this.error() && this.disabled());
  indeterminateError = computed(
    () => this.checked() && this.indeterminate() && this.error() && this.disabled(),
  );

  checkedColor(): string {
    if (this.checked() && this.error() && !this.disabled()) {
      return 'var(--semantic-color-interactive-background-strong-negative-default)';
    }
    if (this.checked()) {
      return 'var(--semantic-color-interactive-background-strong-default)';
    }
    return '';
  }

  checkedBorderColor(): string {
    if (this.checked() && this.error() && !this.disabled()) {
      return 'var(--semantic-color-interactive-border-strong-negative-default)';
    }
    if (this.checked()) {
      return 'var(--semantic-color-interactive-border-strong-default)';
    }
    return '';
  }

  checkedHoverColor(): string {
    if (!this.checked() || this.checkedError()) return '';
    if (this.checked() && this.error()) {
      return 'var(--semantic-color-interactive-background-strong-negative-hover)';
    }
    if (this.state() === 'Active') {
      return 'var(--semantic-color-interactive-background-strong-active)';
    }
    if (this.state() === 'Hover') {
      return 'var(--semantic-color-interactive-background-strong-hover)';
    }
    return 'var(--semantic-color-interactive-background-strong-hover)';
  }

  indeterminateBorderColor(): string {
    if (this.checked() && this.indeterminate() && this.error() && this.disabled()) {
      return 'var(--semantic-color-interactive-border-strong-alt-disabled)';
    }
    if (this.checked() && this.indeterminate()) {
      return this.checkedBorderColor();
    }
    return '';
  }

  indeterminateHoverColor(): string {
    if (this.checked() && this.indeterminate()) {
      if (this.checkedError()) return 'var(--semantic-color-interactive-background-light-alt-hover)';
      if (this.checked() && this.error()) {
        return 'var(--semantic-color-interactive-background-strong-negative-hover)';
      }
      if (this.state() === 'Active') {
        return 'var(--semantic-color-interactive-background-strong-active)';
      }
      return 'var(--semantic-color-interactive-background-strong-hover)';
    }
    return 'var(--semantic-color-interactive-background-light-alt-hover)';
  }

  hostClasses = computed(() => [
    'ds-checkbox',
    `ds-checkbox--state-${this.state()}`,
    this.isDisabled() ? 'ds-checkbox--disabled' : '',
  ].filter(Boolean).join(' '));

  onContainerClick(): void {
    if (this.isDisabled()) return;
    if (this.indeterminate()) {
      this.indeterminateChange.emit(!this.indeterminate());
    } else {
      this.checkedChange.emit(!this.checked());
    }
  }

  onKeydown(): void {
    if (this.isDisabled()) return;
    if (this.indeterminate()) {
      this.indeterminateChange.emit(!this.indeterminate());
    } else {
      this.checkedChange.emit(!this.checked());
    }
  }

  onClickBox(event: MouseEvent): void {
    event.stopPropagation();
    this.onContainerClick();
  }
}
