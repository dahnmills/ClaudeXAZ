import { Component, HostListener, computed, input, model, output, signal } from '@angular/core';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../flyout-menu/flyout-menu-item.component';
import { IconComponent } from '../icon/icon.component';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ds-select',
  standalone: true,
  imports: [FlyoutMenuComponent, FlyoutMenuItemComponent, IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SelectComponent {
  label = input<string>('');
  placeholder = input<string>('');
  options = input.required<SelectOption[]>();
  disabled = input<boolean>(false);
  error = input<boolean>(false);
  errorMessage = input<string>('');

  value = model<string>('');

  selectionChange = output<string>();

  open = signal(false);

  inputId = computed(() => `ds-select-${Math.random().toString(36).slice(2, 8)}`);

  selectedLabel = computed(() => {
    const v = this.value();
    if (!v) return '';
    return this.options().find((o) => o.value === v)?.label ?? '';
  });

  hostClasses = computed(() => [
    'ds-select',
    this.disabled() ? 'ds-select--disabled' : '',
    this.error() ? 'ds-select--error' : '',
    this.open() ? 'ds-select--open' : '',
  ].filter(Boolean).join(' '));

  toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    this.value.set(option.value);
    this.selectionChange.emit(option.value);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.ds-select')) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.open.set(false);
  }
}
