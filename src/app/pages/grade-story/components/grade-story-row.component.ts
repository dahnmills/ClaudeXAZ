import { Component, computed, input, output } from '@angular/core';
import { GradeComponent } from '../../../shared/ui/grade/grade.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { GradeStoryEntry } from '../grade-story.models';

/**
 * One grade-story row (BN AZTQIRIN-55735). Two independently clickable
 * zones instead of the old whole-row click: the grade/score value opens
 * TRAM score details, the grade status opens the TAG explanation. Each
 * zone carries its own icon + hover affordance so the split reads at a
 * glance, per the ticket's "visual indicator" requirement.
 */
@Component({
  selector: 'gs-grade-story-row',
  standalone: true,
  imports: [GradeComponent, BadgeComponent, IconComponent],
  templateUrl: './grade-story-row.component.html',
  styleUrl: './grade-story-row.component.scss',
})
export class GradeStoryRowComponent {
  entry = input.required<GradeStoryEntry>();

  scoreClicked  = output<void>();
  statusClicked = output<void>();

  statusBadge = computed(() => this.entry().status === 'Valid'
    ? { label: 'Valid', status: 'info' as const }
    : { label: 'N/C',   status: 'neutral' as const });
}
