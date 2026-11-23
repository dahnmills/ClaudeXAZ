import { Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export type GroupHeadingLevel = 3 | 4 | 5 | 6;

/**
 * Group heading: names a group of content inside a card (Primer
 * ActionList.GroupHeading). 12 px semi-bold, secondary text, sentence case,
 * one line, never truncated.
 *
 * Rules: only from 2 groups in a card; never as the first element when it
 * repeats the card title; 4 words at most. Heading level 4 by default (under a
 * card title in h3), set `level` so no level is skipped. Optional meta aligned
 * right ("3 movements", "EUR k").
 */
@Component({
  selector: 'ds-group-heading',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './group-heading.component.html',
  styleUrl: './group-heading.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class GroupHeadingComponent {
  level    = input<GroupHeadingLevel>(4);
  /** Short meta at the end of the line, regular weight. */
  meta     = input<string>('');
  reversed = input<boolean>(false);

  hostClasses = computed(() => [
    'ds-group-heading',
    this.reversed() && 'ds-group-heading--reversed',
  ].filter(Boolean).join(' '));
}
