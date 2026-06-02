import { Component, inject } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { LinkComponent } from '../link/link.component';
import { ToasterService, type Toast, type ToastTone } from './toaster.service';

@Component({
  selector: 'ds-toaster-container',
  standalone: true,
  imports: [IconComponent, LinkComponent],
  templateUrl: './toaster-container.component.html',
  styleUrl: './toaster-container.component.scss',
  host: { 'class': 'ds-toaster-container', 'aria-live': 'polite' },
})
export class ToasterContainerComponent {
  private readonly toaster = inject(ToasterService);
  readonly toasts = this.toaster.toasts;

  iconFor(tone: ToastTone): IconName {
    switch (tone) {
      case 'success': return 'check-circle';
      case 'info':    return 'info-circle';
      case 'warning': return 'warning-triangle';
      case 'error':   return 'error-circle';
    }
  }

  onAction(t: Toast): void {
    this.toaster.triggerAction(t.id);
  }

  dismiss(t: Toast): void {
    this.toaster.dismiss(t.id);
  }
}
