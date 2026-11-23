import { Component, computed, input } from '@angular/core';

export type SparklineTone = 'brand' | 'positive' | 'warning' | 'negative';

/** Normal range drawn behind the line, in the units of the values. */
export interface SparklineBand {
  from: number;
  to: number;
}

/**
 * Sparkline: a word-sized trend line (Tufte), driven by the data.
 *
 * - No axis and no grid (use ds-chart for that); fills the width and the
 *   height of its container.
 * - Drawn in a 0..100 viewBox stretched to the box; the stroke stays sharp
 *   (vector-effect). The last point is an HTML dot so it stays round.
 * - `ariaLabel` is required: it says the trend in words, the drawing is hidden
 *   from assistive technologies.
 * - `reversed`: on a strong (dark or full status) background.
 */
@Component({
  selector: 'ds-sparkline',
  standalone: true,
  imports: [],
  templateUrl: './sparkline.component.html',
  styleUrl: './sparkline.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'img',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class SparklineComponent {
  /** Values, oldest first. */
  values    = input.required<number[]>();
  /** The trend in words ("Exposure up from 0.47 M to 1.55 M over 8 periods"). */
  ariaLabel = input.required<string>();
  /** Explicit bounds (else min and max of the values). */
  min       = input<number | null>(null);
  max       = input<number | null>(null);
  /** Lowest value on top (grades: 1 = best). */
  invertY   = input<boolean>(false);
  /** Dot on the latest value. */
  lastValue = input<boolean>(true);
  /** Optional normal range, shaded behind the line. */
  band      = input<SparklineBand | null>(null);
  tone      = input<SparklineTone>('brand');
  reversed  = input<boolean>(false);

  hostClasses = computed(() => [
    'ds-sparkline',
    `ds-sparkline--tone-${this.tone()}`,
    this.reversed() && 'ds-sparkline--reversed',
  ].filter(Boolean).join(' '));

  private bounds = computed(() => {
    const v = this.values();
    const b = this.band();
    const lo = this.min() ?? Math.min(...v, ...(b ? [b.from, b.to] : []));
    const hi = this.max() ?? Math.max(...v, ...(b ? [b.from, b.to] : []));
    return { lo, span: hi - lo || 1 };
  });

  private x(i: number): number {
    const n = this.values().length;
    return n <= 1 ? 0 : (i / (n - 1)) * 100;
  }

  private y(v: number): number {
    const { lo, span } = this.bounds();
    const norm = Math.max(0, Math.min(1, (v - lo) / span));
    return this.invertY() ? norm * 100 : (1 - norm) * 100;
  }

  /** Points of the polyline in the 0..100 viewBox. */
  points = computed(() => this.values().map((v, i) => `${this.x(i)},${this.y(v)}`).join(' '));

  /** Band as a rectangle of the viewBox (top and height). */
  bandRect = computed(() => {
    const b = this.band();
    if (!b) return null;
    const a = this.y(b.from);
    const c = this.y(b.to);
    return { y: Math.min(a, c), h: Math.abs(a - c) };
  });

  /** Position of the latest value, in % of the box. */
  last = computed(() => {
    const v = this.values();
    return v.length ? { left: this.x(v.length - 1), top: this.y(v[v.length - 1]) } : null;
  });
}
