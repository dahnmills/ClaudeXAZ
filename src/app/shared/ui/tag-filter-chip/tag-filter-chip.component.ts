import { Component, ElementRef, HostListener, OnDestroy, computed, inject, input, model, signal } from '@angular/core';
import { ChipComponent } from '../chip/chip.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { InputSearchComponent } from '../input-search/input-search.component';
import { SingleOpenFlyout, claimFlyout, releaseFlyout } from '../flyout-menu/single-open-flyout';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';
import { IconComponent } from '../icon/icon.component';

export interface TagFilterOption { value: string; label: string; }

/**
 * Filter chip: opens a flyout of checkboxes for multi-select.
 * `variant="chip"` (default): ds-chip trigger, used in the P4 filter bar.
 * `variant="field"`: ds-select-styled bordered box + label, used as a
 * multi-value form field inside the rule modal (matches ds-select chrome
 * so it sits naturally in a grid of single-select dropdowns).
 *
 * `searchable` ajoute un champ de recherche en tête du flyout. Il s'active
 * champ par champ, pas au-delà d'un seuil d'options : ce qui appelle une
 * recherche, c'est d'être branché sur un référentiel (secteurs NACE, formes
 * juridiques nationales), pas de compter beaucoup d'entrées. Une liste fermée
 * de 13 grades se lit d'un coup d'œil, un référentiel de 500 codes non.
 */
@Component({
  selector: 'ds-tag-filter-chip',
  standalone: true,
  imports: [ChipComponent, CheckboxComponent, FlyoutMenuComponent, IconComponent, InputSearchComponent],
  templateUrl: './tag-filter-chip.component.html',
  styleUrl: './tag-filter-chip.component.scss',
})
export class TagFilterChipComponent implements SingleOpenFlyout, OnDestroy {
  label       = input.required<string>();
  options     = input.required<TagFilterOption[]>();
  selected    = model<Set<string>>(new Set());
  variant     = input<'chip' | 'field'>('chip');
  placeholder = input<string>('Any');
  searchable  = input<boolean>(false);

  open   = signal(false);
  search = signal('');

  private elRef = inject(ElementRef);

  private static nextId = 0;
  fieldId = `tag-filter-chip-${TagFilterChipComponent.nextId++}`;

  count     = computed(() => this.selected().size);
  active    = computed(() => this.count() > 0);
  chipLabel = computed(() => this.active() ? `${this.label()} · ${this.count()}` : this.label());
  fieldValue = computed(() => {
    const opts = this.options();
    const sel = this.selected();
    const labels = opts.filter(o => sel.has(o.value)).map(o => o.label);
    return labels.length ? labels.join(', ') : '';
  });

  // On cherche dans la valeur ET dans le libellé : un code NACE se retrouve
  // aussi bien en tapant « 62 » qu'en tapant « program ».
  visibleOptions = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.options();
    return this.options().filter(
      o => o.value.toLowerCase().includes(q) || o.label.toLowerCase().includes(q),
    );
  });

  toggleOpen(): void {
    if (this.open()) {
      this.closeFlyout();
      return;
    }
    claimFlyout(this);
    this.open.set(true);
  }

  closeFlyout(): void {
    releaseFlyout(this);
    this.open.set(false);
    this.search.set('');   // réouvrir doit montrer la liste entière
  }

  ngOnDestroy(): void {
    releaseFlyout(this);
  }

  isChecked(value: string): boolean {
    return this.selected().has(value);
  }

  toggleValue(value: string): void {
    const next = new Set(this.selected());
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    this.selected.set(next);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.elRef.nativeElement.contains(event.target as Node)) this.closeFlyout();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.closeFlyout();
  }
}
