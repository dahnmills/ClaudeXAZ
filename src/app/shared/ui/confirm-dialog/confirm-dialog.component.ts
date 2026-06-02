import { Component, HostListener, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

export type ConfirmDialogTone = 'warning' | 'danger' | 'info';

@Component({
  selector: 'ds-confirm-dialog',
  standalone: true,
  imports: [IconComponent, ButtonComponent, ButtonIconComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'alertdialog',
    'aria-modal': 'true',
    '[attr.aria-hidden]': '!open()',
  },
})
export class ConfirmDialogComponent {
  open         = input<boolean>(false);
  title        = input.required<string>();
  tone         = input<ConfirmDialogTone>('warning');
  confirmLabel = input<string>('Confirm');
  cancelLabel  = input<string>('Cancel');

  confirmed = output<void>();
  cancelled = output<void>();
  closed    = output<void>();

  hostClasses = computed(() => [
    'ds-confirm-dialog',
    `ds-confirm-dialog--${this.tone()}`,
    this.open() ? 'ds-confirm-dialog--open' : '',
  ].filter(Boolean).join(' '));

  iconName = computed(() => {
    switch (this.tone()) {
      case 'warning': return 'warning-triangle';
      case 'danger':  return 'warning-triangle';
      case 'info':    return 'info-circle';
    }
  });

  onBackdropClick(): void {
    this.cancelled.emit();
    this.closed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.closed.emit();
  }

  onConfirm(): void {
    this.confirmed.emit();
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.onCancel();
  }
}
