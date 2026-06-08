import { Component, input, output, computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ds-input-search',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.scss',
})
export class InputSearchComponent {
  label        = input<string>('');
  placeholder  = input<string>('Search…');
  optional     = input<boolean>(false);
  disabled     = input<boolean>(false);
  readonly     = input<boolean>(false);
  error        = input<boolean>(false);
  errorMessage = input<string>('');

  value = model<string>('');

  cleared = output<void>();

  inputId = signal(`ds-input-search-${Math.random().toString(36).slice(2, 8)}`);

  hostClasses = computed(() => [
    'ds-input-search',
    this.disabled() ? 'ds-input-search--disabled' : '',
    this.readonly()  ? 'ds-input-search--readonly'  : '',
    this.error()     ? 'ds-input-search--error'      : '',
  ].filter(Boolean).join(' '));

  clear() {
    this.value.set('');
    this.cleared.emit();
  }
}
