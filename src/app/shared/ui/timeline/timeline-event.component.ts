import { Component, computed, input, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type TimelineEventStatus = 'error' | 'warning' | 'success' | 'info' | 'neutral';

@Component({
  selector: 'ds-timeline-event',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './timeline-event.component.html',
  styleUrl: './timeline-event.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.role]': '"listitem"',
  },
})
export class TimelineEventComponent {
  title       = input.required<string>();
  status      = input<TimelineEventStatus>('neutral');
  /** Cache la ligne descendante (utile pour le dernier event). */
  isLast      = input<boolean>(false);
  /** Désactive le toggle. */
  disabled    = input<boolean>(false);

  open = model<boolean>(false);

  hostClasses = computed(() => [
    'ds-timeline-event',
    `ds-timeline-event--status-${this.status()}`,
    this.open()     ? 'ds-timeline-event--open'     : '',
    this.disabled() ? 'ds-timeline-event--disabled' : '',
    this.isLast()   ? 'ds-timeline-event--last'     : '',
  ].filter(Boolean).join(' '));

  toggle() {
    if (this.disabled()) return;
    this.open.update(v => !v);
  }
}
