import { Component, input } from '@angular/core';
import {
  ChartComponent, PropertiesPanelComponent, IconComponent, BadgeComponent, GradeComponent, LinkComponent,
} from '../../shared/ui';
import {
  type BentoKind, AS_OF,
  MONTHS, GRADE_HISTORY, GRADE_Y, GRADE_CHANGES, EXPOSURE_TREND, SCORE_TREND,
  PAYMENT_BANDS, FIN_YEARS, FINANCIALS, TURNOVER_TREND, TURNOVER_YEARS, JOBS, NEWS,
  NOTES, IDENTITY, DECISIONS, POLICIES, COVER_HISTORY,
  OVERDUE_PERIODS, OVERDUE_EVENTS, PAYMENT_MONTHS, POLICY_MOVES, EXTERNAL_RATINGS,
} from './buyer-summary-v2.data';
import * as F from './buyer-summary-v2.facts';

/** What a Bento card shows, by kind; its size picks the content level
 *  (container queries on the cell). Host in `display: contents`: the content
 *  lays out directly in the card's column. */
@Component({
  selector: 'app-bento-card-body',
  standalone: true,
  imports: [ChartComponent, PropertiesPanelComponent, IconComponent, BadgeComponent, GradeComponent, LinkComponent],
  templateUrl: './bento-card-body.component.html',
  styleUrl: './bento-card-body.component.scss',
  host: { '[attr.data-tone]': 'tone()' },
})
export class BentoCardBodyComponent {
  kind = input.required<BentoKind>();
  /** Navy or full status background: charts and links go reversed. */
  hl   = input<boolean>(false);
  /** Emphasis drawn on the cell (colours come from its --bc-* variables). */
  tone = input<string>('none');

  readonly AS_OF = AS_OF;
  // One label out of two: eight labels collide below 3 columns
  readonly sparseMonths = MONTHS.map((m, i) => (i % 2 === 0 ? m : ''));
  readonly gradeHistory = GRADE_HISTORY;
  readonly gradeY = GRADE_Y;
  readonly gradeChanges = GRADE_CHANGES;
  readonly exposureTrend = EXPOSURE_TREND;
  readonly scoreTrend = SCORE_TREND;
  readonly paymentBands = PAYMENT_BANDS;
  readonly finYears = FIN_YEARS;
  readonly financials = FINANCIALS;
  readonly turnoverTrend = TURNOVER_TREND;
  readonly turnoverYears = TURNOVER_YEARS;
  readonly jobs = JOBS;
  readonly news = NEWS;
  readonly notes = NOTES;
  readonly identity = IDENTITY;
  readonly decisions = DECISIONS;
  readonly policies = POLICIES;
  readonly coverHistory = COVER_HISTORY;
  readonly overduePeriods = OVERDUE_PERIODS;
  readonly overdueEvents = OVERDUE_EVENTS;
  readonly paymentMonths = PAYMENT_MONTHS;
  readonly policyMoves = POLICY_MOVES;
  readonly ratings = EXTERNAL_RATINGS;

  readonly limitKv = F.limitKv;
  readonly riskKv = F.riskKv;
  readonly scoreKv = F.scoreKv;
  readonly exposureKv = F.exposureKv;
  readonly reviewKv = F.reviewKv;
  readonly sanctionKv = F.sanctionKv;
  readonly paymentKv = F.paymentKv;
  readonly overdueFacts = F.overdueFacts;
  readonly coverFacts = F.coverFacts;

  /** Visibility class of the i-th item of a list, by card height. */
  rowLevel(i: number, base: number, perStep: number): string {
    if (i < base) return '';
    if (i < base + perStep) return 'h2';
    if (i < base + perStep * 2) return 'h3';
    return 'h4';
  }
}
