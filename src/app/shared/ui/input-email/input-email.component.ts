import { Component, input, computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ds-input-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-email.component.html',
  styleUrl: './input-email.component.scss',
})
export class InputEmailComponent {
  label        = input<string>('');
  placeholder  = input<string>('');
  optional     = input<boolean>(false);
  disabled     = input<boolean>(false);
  readonly     = input<boolean>(false);
  error        = input<boolean>(false);
  errorMessage = input<string>('');

  value = model<string>('');

  inputId = signal(`ds-input-email-${Math.random().toString(36).slice(2, 8)}`);

  hostClasses = computed(() => [
    'ds-input-email',
    this.disabled() ? 'ds-input-email--disabled' : '',
    this.readonly()  ? 'ds-input-email--readonly'  : '',
    this.error()     ? 'ds-input-email--error'      : '',
  ].filter(Boolean).join(' '));
}
