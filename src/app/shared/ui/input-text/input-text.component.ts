import { Component, input, output, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ds-input-text',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextComponent {
  label       = input<string>('');
  placeholder = input<string>('');
  optional    = input<boolean>(false);
  disabled    = input<boolean>(false);
  readonly    = input<boolean>(false);
  error       = input<boolean>(false);
  errorMessage = input<string>('');

  /** Valeur bindée via [(value)] */
  value = model<string>('');

  inputId = computed(() => `ds-input-${Math.random().toString(36).slice(2, 8)}`);

  hostClasses = computed(() => [
    'ds-input-text',
    this.disabled() ? 'ds-input-text--disabled'  : '',
    this.readonly()  ? 'ds-input-text--readonly'  : '',
    this.error()     ? 'ds-input-text--error'      : '',
  ].filter(Boolean).join(' '));
}
