import { Component, DestroyRef, ElementRef, HostListener, afterRenderEffect, computed, inject, input, model, signal, viewChild } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { TagComponent } from '../tag/tag.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';

export interface MultiSelectOption {
  value: string;
  label: string;
}

/**
 * Dropdown multi-sélection.
 * Source : Figma > -Components--Data Entry > Dropdown (node 3008:817).
 *
 * Le champ reprend la coque de ds-input-text ; chaque valeur choisie y remonte
 * en ds-tag Filter, dont la croix la retire directement. Au-delà de
 * `maxVisible` tags, « (+x more) » dit combien restent. Un clic sur le champ
 * ouvre la liste à cocher (mêmes rangées que ds-tag-filter-chip).
 *
 * `variant="inline"` retire la bordure et la hauteur du champ : pour poser le
 * dropdown dans un slot de barre de recherche.
 */
@Component({
  selector: 'ds-multi-select',
  standalone: true,
  imports: [IconComponent, TagComponent, CheckboxComponent, FlyoutMenuComponent],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class MultiSelectComponent {
  label        = input<string>('');
  options      = input.required<MultiSelectOption[]>();
  placeholder  = input<string>('');
  /** Icône en tête du champ, pour la variante inline d'une barre. */
  icon         = input<IconName | null>(null);
  /** Plafond optionnel. Sans lui, le champ montre tous les tags qui tiennent
   *  et passe à « (+x more) » seulement quand la place manque. */
  maxVisible   = input<number | null>(null);
  variant      = input<'default' | 'inline'>('default');
  disabled     = input<boolean>(false);
  error        = input<boolean>(false);
  errorMessage = input<string>('');

  /** Valeurs choisies, dans l'ordre des options. */
  value = model<string[]>([]);

  open = signal(false);
  readonly fieldId = `ds-multi-select-${Math.random().toString(36).slice(2, 8)}`;

  hostClasses = computed(() => [
    'ds-multi-select',
    `ds-multi-select--${this.variant()}`,
    this.disabled() ? 'ds-multi-select--disabled' : '',
    this.error()    ? 'ds-multi-select--error'    : '',
    this.open()     ? 'ds-multi-select--open'     : '',
  ].filter(Boolean).join(' '));

  selectedOptions = computed(() => {
    const v = this.value();
    return this.options().filter(o => v.includes(o.value));
  });
  /** Nombre de tags qui tiennent dans la largeur réelle du champ (mesuré). */
  private fitCount = signal<number>(Number.POSITIVE_INFINITY);
  private limit = computed(() => Math.min(this.fitCount(), this.maxVisible() ?? Number.POSITIVE_INFINITY));
  visibleTags = computed(() => this.selectedOptions().slice(0, this.limit()));
  hiddenCount = computed(() => Math.max(0, this.selectedOptions().length - this.limit()));

  private valueEl = viewChild<ElementRef<HTMLElement>>('valueEl');
  private measureEl = viewChild<ElementRef<HTMLElement>>('measureEl');
  private observer?: ResizeObserver;

  constructor() {
    // La rangée de mesure (invisible) porte tous les tags choisis : leurs
    // largeurs réelles disent combien en tiennent dans la place disponible.
    afterRenderEffect(() => {
      const value = this.valueEl()?.nativeElement;
      const measure = this.measureEl()?.nativeElement;
      this.selectedOptions();
      if (!value || !measure) return;
      if (!this.observer) {
        this.observer = new ResizeObserver(() => this.fit());
        this.observer.observe(value);
        this.observer.observe(measure);
      }
      this.fit();
    });
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }

  private fit() {
    const value = this.valueEl()?.nativeElement;
    const measure = this.measureEl()?.nativeElement;
    if (!value || !measure) return;
    const tags = Array.from(measure.querySelectorAll<HTMLElement>('ds-tag'));
    const more = measure.querySelector<HTMLElement>('.ds-multi-select__more');
    const available = value.clientWidth;
    const moreGap = parseFloat(getComputedStyle(value).columnGap) || 0;
    // Bord droit du k-ième tag, gaps compris, mesuré depuis le début de la rangée
    const rightEdge = (k: number) => k === 0 ? 0 : tags[k - 1].offsetLeft + tags[k - 1].offsetWidth - tags[0].offsetLeft;

    let count = tags.length;
    if (rightEdge(tags.length) > available) {
      const moreWidth = more?.offsetWidth ?? 0;
      count = 0;
      for (let k = tags.length - 1; k >= 1; k--) {
        if (rightEdge(k) + moreGap + moreWidth <= available) { count = k; break; }
      }
    }
    if (count !== this.fitCount()) this.fitCount.set(count);
  }

  private host = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent) {
    if (this.open() && !this.host.nativeElement.contains(ev.target as Node)) this.open.set(false);
  }

  @HostListener('keydown.escape')
  onEscape() { this.open.set(false); }

  toggleOpen() {
    if (this.disabled()) return;
    this.open.update(v => !v);
  }

  isChecked(v: string) { return this.value().includes(v); }

  toggleValue(v: string) {
    const next = this.isChecked(v) ? this.value().filter(x => x !== v) : [...this.value(), v];
    // Garde l'ordre des options : la liste de tags ne saute pas selon l'ordre des clics
    this.value.set(this.options().map(o => o.value).filter(x => next.includes(x)));
  }

  remove(v: string, ev?: Event) {
    ev?.stopPropagation();
    if (this.disabled()) return;
    this.value.set(this.value().filter(x => x !== v));
  }
}
