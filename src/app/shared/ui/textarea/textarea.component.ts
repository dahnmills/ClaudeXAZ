import { Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ds-textarea',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent {
  label        = input<string>('');
  placeholder  = input<string>('');
  optional     = input<boolean>(false);
  disabled     = input<boolean>(false);
  readonly     = input<boolean>(false);
  error        = input<boolean>(false);
  errorMessage = input<string>('');
  rows         = input<number>(3);

  /** Valeur bindée via [(value)] */
  value = model<string>('');

  inputId = computed(() => `ds-textarea-${Math.random().toString(36).slice(2, 8)}`);

  hostClasses = computed(() => [
    'ds-textarea',
    this.disabled() ? 'ds-textarea--disabled' : '',
    this.readonly() ? 'ds-textarea--readonly' : '',
    this.error()    ? 'ds-textarea--error'    : '',
  ].filter(Boolean).join(' '));
}
