import { Component, input, output, computed } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

export type FunctionalNoticeStatus = 'info' | 'success' | 'warning' | 'error' | 'default';
export type FunctionalNoticeEmphasis = 'high' | 'medium' | 'low';

@Component({
  selector: 'ds-functional-notice',
  standalone: true,
  imports: [IconComponent, ButtonIconComponent],
  templateUrl: './functional-notice.component.html',
  styleUrl: './functional-notice.component.scss',
})
export class FunctionalNoticeComponent {
  status    = input<FunctionalNoticeStatus>('info');
  emphasis  = input<FunctionalNoticeEmphasis>('high');
  title     = input<string>('');
  message   = input<string>('');
  dismissible = input<boolean>(false);

  dismissed = output<void>();

  hostClasses = computed(() => [
    'ds-functional-notice',
    `ds-functional-notice--${this.status()}`,
    `ds-functional-notice--emphasis-${this.emphasis()}`,
  ].join(' '));

  iconName = computed<IconName>(() => {
    switch (this.status()) {
      case 'success': return 'check-circle';
      case 'warning': return 'warning-triangle';
      case 'error':   return 'error-circle';
      default:        return 'info-circle';
    }
  });
}
