import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type PaginationStyle = 'classic' | 'infinite';

@Component({
  selector: 'ds-pagination',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  host: { 'class': 'ds-pagination', 'role': 'navigation', '[attr.aria-label]': '"Pagination"' },
})
export class PaginationComponent {
  /** Style d'affichage. classic = numérotation complète + First/Last. infinite = Back / N of M / Next */
  style = input<PaginationStyle>('classic');
  /** Page courante (1-based) */
  page  = input<number>(1);
  /** Nombre total de pages */
  total = input.required<number>();
  /** Nombre de pages affichées autour de la page courante en mode classic */
  siblings = input<number>(1);
  /** Affiche le bouton First/Last en mode classic */
  showFirstLast = input<boolean>(true);

  pageChange = output<number>();

  isClassic  = computed(() => this.style() === 'classic');
  isInfinite = computed(() => this.style() === 'infinite');

  canPrev = computed(() => this.page() > 1);
  canNext = computed(() => this.page() < this.total());

  /** Liste des numéros et "..." à afficher. */
  pages = computed<(number | '...')[]>(() => {
    const total = this.total();
    const cur   = this.page();
    const sib   = this.siblings();
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const result: (number | '...')[] = [];
    const left  = Math.max(2, cur - sib);
    const right = Math.min(total - 1, cur + sib);
    result.push(1);
    if (left > 2) result.push('...');
    for (let i = left; i <= right; i++) result.push(i);
    if (right < total - 1) result.push('...');
    result.push(total);
    return result;
  });

  goTo(p: number) {
    if (p < 1 || p > this.total() || p === this.page()) return;
    this.pageChange.emit(p);
  }

  prev() { if (this.canPrev()) this.pageChange.emit(this.page() - 1); }
  next() { if (this.canNext()) this.pageChange.emit(this.page() + 1); }
  first() { if (this.page() !== 1) this.pageChange.emit(1); }
  last()  { if (this.page() !== this.total()) this.pageChange.emit(this.total()); }
}
