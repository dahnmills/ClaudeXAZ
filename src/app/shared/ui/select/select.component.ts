import { Component, ElementRef, HostListener, OnDestroy, computed, inject, input, model, output, signal } from '@angular/core';
import { SingleOpenFlyout, claimFlyout, releaseFlyout } from '../flyout-menu/single-open-flyout';
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
export class SelectComponent implements SingleOpenFlyout, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  label        = input<string>('');
  placeholder  = input<string>('');
  options      = input.required<SelectOption[]>();
  disabled     = input<boolean>(false);
  error        = input<boolean>(false);
  errorMessage = input<string>('');

  value           = model<string>('');
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
    this.error()    ? 'ds-select--error'     : '',
    this.open()     ? 'ds-select--open'      : '',
  ].filter(Boolean).join(' '));

  toggle(): void {
    if (this.disabled()) return;
    if (this.open()) {
      this.closeFlyout();
      return;
    }
    claimFlyout(this);
    this.open.set(true);
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    this.value.set(option.value);
    this.selectionChange.emit(option.value);
    this.closeFlyout();
  }

  closeFlyout(): void {
    releaseFlyout(this);
    this.open.set(false);
  }

  ngOnDestroy(): void {
    releaseFlyout(this);
  }

  // Test THIS instance, not `closest('ds-select')`, the latter matches any
  // select on the page, so clicking a sibling select's trigger left both
  // flyouts open (5 of them sit side by side in the TAG rule modal).
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as Node | null;
    if (target && this.hostRef.nativeElement.contains(target)) return;
    this.closeFlyout();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.closeFlyout();
  }
}
