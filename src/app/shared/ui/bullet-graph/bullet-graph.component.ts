import { Component, computed, input } from '@angular/core';

export type BulletGraphTone = 'brand' | 'positive' | 'warning' | 'negative';

/**
 * Bullet graph (Stephen Few), driven by the data: a measure bar, an optional
 * comparative mark (target, previous period) and 0 to 2 qualitative range
 * limits drawn in a single hue behind the bar.
 *
 * - Values are in the unit of `max` (100 by default: percentages).
 * - `ariaLabel` is required: it says the value and the gap in words; the
 *   drawing is hidden from assistive technologies.
 * - `reversed`: on a strong (dark or full status) background.
 */
@Component({
  selector: 'ds-bullet-graph',
  standalone: true,
  imports: [],
  templateUrl: './bullet-graph.component.html',
  styleUrl: './bullet-graph.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'img',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class BulletGraphComponent {
  /** The measure. */
  value     = input.required<number>();
  /** The value and the gap in words ("31 % of the limit used, 26 % in May 24"). */
  ariaLabel = input.required<string>();
  /** Top of the scale. */
  max       = input<number>(100);
  /** Comparative mark (target, previous period), or none. */
  target    = input<number | null>(null);
  /** Upper limits of the qualitative ranges, at most 2 (3 ranges with the rest of the track). */
  ranges    = input<number[]>([]);
  tone      = input<BulletGraphTone>('brand');
  reversed  = input<boolean>(false);

  hostClasses = computed(() => [
    'ds-bullet-graph',
    `ds-bullet-graph--tone-${this.tone()}`,
    this.reversed() && 'ds-bullet-graph--reversed',
  ].filter(Boolean).join(' '));

  private pct(v: number): number {
    const m = this.max() || 1;
    return Math.max(0, Math.min(100, (v / m) * 100));
  }

  valuePct  = computed(() => this.pct(this.value()));
  targetPct = computed(() => { const t = this.target(); return t === null ? null : this.pct(t); });

  /** Ranges from the widest to the narrowest, so the narrowest is drawn on top. */
  rangePcts = computed(() =>
    [...this.ranges()].slice(0, 2).sort((a, b) => b - a).map((r, i, all) => ({
      width: this.pct(r),
      // The narrowest range is the darkest
      level: all.length - i,
    })),
  );
}
