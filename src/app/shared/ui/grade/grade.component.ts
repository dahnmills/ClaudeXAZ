import { Component, computed, input } from '@angular/core';

export type GradeType  = 'manual' | 'automatic' | 'nc' | 'na';
export type GradeValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type GradeSize  = 's' | 'm';

@Component({
  selector: 'ds-grade',
  standalone: true,
  imports: [],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss',
  host: { '[class]': 'hostClasses()', 'role': 'status' },
})
export class GradeComponent {
  type   = input<GradeType>('manual');
  grade  = input<GradeValue | null>(null);
  /** Score décimal optionnel affiché entre parenthèses : (1.00) */
  score  = input<number | null>(null);
  size   = input<GradeSize>('m');

  hostClasses = computed(() => [
    'ds-grade',
    `ds-grade--type-${this.type()}`,
    this.grade() !== null ? `ds-grade--g${this.grade()}` : '',
    `ds-grade--size-${this.size()}`,
  ].filter(Boolean).join(' '));

  /** Préfixe : M = manual, A = automatic, sinon "—" (NC/NA) */
  prefix = computed(() => {
    const t = this.type();
    if (t === 'manual')    return 'M';
    if (t === 'automatic') return 'A';
    if (t === 'nc')        return 'N/C';
    if (t === 'na')        return 'N/A';
    return '';
  });

  /** Label dans la pastille : M1, A10, N/C, N/A */
  pillLabel = computed(() => {
    const t = this.type();
    if (t === 'nc' || t === 'na') return this.prefix();
    return `${this.prefix()}${this.grade() ?? ''}`;
  });

  formattedScore = computed(() => {
    const s = this.score();
    if (s === null || s === undefined) return '';
    return `(${s.toFixed(2)})`;
  });
}
