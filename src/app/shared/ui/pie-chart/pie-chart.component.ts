import { Component, computed, input, signal } from '@angular/core';

export type PieChartTone = 'brand' | 'positive' | 'warning' | 'negative';

export interface PieChartSegment {
  label:   string;
  value:   number;
  tone:    PieChartTone;
  tooltip: string;
}

/**
 * Donut chart minimal en SVG (segments en cercles superposés, pas d'arcs
 * <path> — un stroke-dasharray/-dashoffset par segment suffit pour un anneau
 * et évite toute trigonométrie). Tooltip par segment tenu en signal local
 * (pas dsTooltip) car chaque segment porte un texte différent au survol.
 */
@Component({
  selector: 'ds-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
  host: { 'class': 'ds-pie-chart' },
})
export class PieChartComponent {
  segments  = input.required<PieChartSegment[]>();
  size      = input<number>(120);
  thickness = input<number>(16);

  hovered = signal<number | null>(null);

  private radius = computed(() => (this.size() - this.thickness()) / 2);
  circumference  = computed(() => 2 * Math.PI * this.radius());

  total = computed(() => this.segments().reduce((sum, s) => sum + s.value, 0));

  /** Small visual gap between segments — otherwise stroke-linecap:round's
   * rounded ends overlap invisibly at full-length segments. */
  private readonly gapDeg = 3;

  arcs = computed(() => {
    const c = this.circumference();
    const t = this.total() || 1;
    const gapLen = (this.gapDeg / 360) * c;
    let offset = 0;
    return this.segments().map((s, i) => {
      const rawLen = (s.value / t) * c;
      const len = Math.max(rawLen - gapLen, 0);
      const dashoffset = -offset;
      offset += rawLen;
      return { ...s, index: i, dasharray: `${len} ${c - len}`, dashoffset };
    });
  });

  hoveredTooltip = computed(() => {
    const i = this.hovered();
    return i === null ? null : this.arcs()[i]?.tooltip ?? null;
  });

  onEnter(i: number): void { this.hovered.set(i); }
  onLeave(): void { this.hovered.set(null); }
}
