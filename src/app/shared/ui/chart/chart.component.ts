import { Component, computed, input } from '@angular/core';

export type ChartTone = 'brand' | 'positive' | 'warning' | 'negative';

/**
 * Line chart minimal en SVG (courbe + points + grille + axes).
 *
 * - Tracé en pourcentages dans un viewBox 0..100 (preserveAspectRatio="none")
 *   pour remplir la largeur ; le trait reste net via vector-effect.
 * - Les points sont des éléments HTML en overlay (left%/top%) pour rester ronds
 *   quel que soit l'étirement horizontal.
 * - `invertY` : valeur basse en haut (cas Grade : 1 = meilleur, en haut).
 */
@Component({
  selector: 'ds-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[style.height.px]': 'height()',
    'role': 'img',
  },
})
export class ChartComponent {
  /** Valeurs Y, dans l'ordre des X (gauche → droite). */
  data    = input.required<number[]>();
  /** Libellés axe X (sous le tracé). */
  xLabels = input<string[]>([]);
  /** Libellés axe Y (haut → bas). */
  yLabels = input<string[]>([]);
  /** Bornes Y explicites (sinon min/max des données). */
  min     = input<number | null>(null);
  max     = input<number | null>(null);
  /** Inverse l'axe Y : la plus petite valeur en haut. */
  invertY = input<boolean>(false);
  /** Hauteur totale du composant en px. */
  height  = input<number>(160);
  tone    = input<ChartTone>('brand');
  showGrid = input<boolean>(true);
  showDots = input<boolean>(true);

  hostClasses = computed(() => [
    'ds-chart',
    `ds-chart--tone-${this.tone()}`,
  ].join(' '));

  private bounds = computed(() => {
    const d = this.data();
    const lo = this.min() ?? Math.min(...d);
    const hi = this.max() ?? Math.max(...d);
    return { lo, span: hi - lo || 1 };
  });

  private xPct(i: number): number {
    const n = this.data().length;
    return n <= 1 ? 0 : (i / (n - 1)) * 100;
  }

  private yPct(v: number): number {
    const { lo, span } = this.bounds();
    const norm = (v - lo) / span;
    return this.invertY() ? norm * 100 : (1 - norm) * 100;
  }

  /** Points pour <polyline> dans le viewBox 0..100. */
  linePoints = computed(() =>
    this.data().map((v, i) => `${this.xPct(i)},${this.yPct(v)}`).join(' '),
  );

  /** Positions des points (overlay HTML), en %. */
  dots = computed(() =>
    this.data().map((v, i) => ({ left: this.xPct(i), top: this.yPct(v) })),
  );

  /** Lignes verticales de grille (% sur X), une par libellé X. */
  gridXs = computed(() => this.ticks(this.xLabels().length));
  /** Lignes horizontales de grille (% sur Y), une par libellé Y. */
  gridYs = computed(() => this.ticks(this.yLabels().length));

  private ticks(count: number): number[] {
    if (count <= 1) return [];
    return Array.from({ length: count }, (_, i) => (i / (count - 1)) * 100);
  }
}
