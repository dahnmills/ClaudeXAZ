import { Component, computed, input } from '@angular/core';

export type BadgeStatus = 'info' | 'warning' | 'success' | 'error' | 'neutral';
export type BadgeVariant = 'light' | 'strong';
export type BadgeSize = 's' | 'm';

@Component({
  selector: 'ds-badge',
  standalone: true,
  template: `
    <span class="ds-badge__content">
      <ng-content select="[slot=icon]" />
      <span class="ds-badge__label">{{ label() }}</span>
    </span>
  `,
  styleUrl: './badge.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'status',
    '[attr.aria-label]': 'label()',
  },
})
export class BadgeComponent {
  label   = input.required<string>();
  status  = input<BadgeStatus>('info');
  variant = input<BadgeVariant>('light');
  size    = input<BadgeSize>('s');

  hostClasses = computed(() => [
    'ds-badge',
    `ds-badge--status-${this.status()}`,
    `ds-badge--style-${this.variant()}`,   // CSS garde le préfixe --style-
    `ds-badge--size-${this.size()}`,
  ].join(' '));
}
