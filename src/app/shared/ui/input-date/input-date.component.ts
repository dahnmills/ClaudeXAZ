import { Component, input, output, computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ds-input-date',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss',
})
export class InputDateComponent {
  label        = input<string>('');
  placeholder  = input<string>('dd/mm/yyyy');
  optional     = input<boolean>(false);
  disabled     = input<boolean>(false);
  readonly     = input<boolean>(false);
  error        = input<boolean>(false);
  errorMessage = input<string>('');

  value = model<string>('');

  inputId = signal(`ds-input-date-${Math.random().toString(36).slice(2, 8)}`);

  hostClasses = computed(() => [
    'ds-input-date',
    this.disabled() ? 'ds-input-date--disabled' : '',
    this.readonly()  ? 'ds-input-date--readonly'  : '',
    this.error()     ? 'ds-input-date--error'      : '',
  ].filter(Boolean).join(' '));
}
