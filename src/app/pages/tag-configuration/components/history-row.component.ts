import { Component, computed, input, output } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { RuleSetHistoryEntry } from '../tag-configuration.models';

/** One row of the History tab — a past rule-set publication, opens a detail drawer. */
@Component({
  selector: 'tag-history-row',
  standalone: true,
  imports: [CardComponent, BadgeComponent, IconComponent],
  templateUrl: './history-row.component.html',
  styleUrl: './history-row.component.scss',
})
export class HistoryRowComponent {
  entry    = input.required<RuleSetHistoryEntry>();
  selected = input<boolean>(false);

  opened = output<void>();

  statusBadge = computed(() => {
    switch (this.entry().status) {
      case 'Active':  return { label: 'Active', status: 'info' as const };
      case 'Draft':   return { label: 'Draft',  status: 'neutral' as const };
      case 'Archived': return null;
    }
  });
}
