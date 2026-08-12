import { Component, ElementRef, computed, effect, inject, input, model, output, signal, viewChild } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { type BadgeStatus } from '../badge/badge.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

/** Une entité indexée par la palette (buyer, application, …). */
export interface SpotlightItem {
  /** Identifiant métier affiché avec un `#` et copiable. */
  id: string;
  /** Libellé principal. */
  name: string;
  /** Type d'entité (« Buyer », « Application »…). */
  type: string;
  /** Icône produit à gauche du libellé. */
  icon?: IconName;
  /** Statut optionnel rendu en badge (« Open »…). */
  status?: string;
  statusTone?: BadgeStatus;
}

/** Item + son rang absolu dans la liste plate (pour la sélection clavier). */
interface RankedItem {
  item: SpotlightItem;
  index: number;
}

/** Groupe rendu dans le dropdown. */
interface Section {
  key: 'results';
  label: string | null;
  items: RankedItem[];
}

/**
 * Palette de recherche « Spotlight » (⌘K / Ctrl+K).
 *
 * Props in / events out : la palette ne connaît pas la source de données ni la
 * navigation. On lui passe le corpus (`items`) et les récents (`recents`) ; elle
 * filtre, groupe (Résultats / Suggestions / Recent), gère la navigation clavier
 * et émet `selected` (ouvrir la fiche) et `copied` (copier l'ID).
 *
 * Le déclencheur global ⌘K est laissé à l'hôte : il pilote `open`.
 */
@Component({
  selector: 'ds-spotlight',
  standalone: true,
  imports: [IconComponent, ButtonIconComponent],
  templateUrl: './spotlight.component.html',
  styleUrl: './spotlight.component.scss',
  host: {
    'class': 'ds-spotlight',
    '[class.ds-spotlight--open]': 'open()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SpotlightComponent {
  open  = model<boolean>(false);
  query = model<string>('');

  /** Corpus recherché (mock côté hôte). */
  items = input<SpotlightItem[]>([]);
  /** Recherches récentes, affichées à vide. */
  recents = input<SpotlightItem[]>([]);
  placeholder = input<string>('Quick search');
  /** Nombre max de résultats directs avant de basculer le reste en suggestions. */
  maxResults = input<number>(4);

  /** L'utilisateur valide un résultat (clic / Enter). */
  selected = output<SpotlightItem>();
  /** L'utilisateur copie l'ID d'un résultat. */
  copied = output<SpotlightItem>();
  /** La palette se ferme (Esc, clic backdrop). */
  closed = output<void>();

  private inputEl = viewChild<ElementRef<HTMLInputElement>>('search');
  private host = inject(ElementRef<HTMLElement>);

  /** Index sélectionné dans la liste plate (navigation clavier). */
  activeIndex = signal<number>(0);

  private normalizedQuery = computed(() => this.query().trim().toLowerCase());

  /** Résultats directs : le libellé ou l'ID contient la requête. */
  private matches = computed<SpotlightItem[]>(() => {
    const q = this.normalizedQuery();
    if (!q) return [];
    return this.items().filter(
      it => it.name.toLowerCase().includes(q) || it.id.includes(q),
    );
  });

  /**
   * Sections rendues. À vide → aucune (barre seule). Sinon une seule liste de
   * résultats directs. Chaque item porte son rang absolu, calculé ici une fois
   * → le template n'a aucune arithmétique d'index à faire.
   */
  sections = computed<Section[]>(() => {
    let rank = 0;
    const rankItems = (items: SpotlightItem[]): RankedItem[] =>
      items.map(item => ({ item, index: rank++ }));

    // À vide, la barre est SEULE (aucun dropdown) : les résultats
    // n'apparaissent qu'à la saisie.
    if (!this.normalizedQuery()) return [];
    const direct = this.matches().slice(0, this.maxResults());
    return direct.length ? [{ key: 'results', label: null, items: rankItems(direct) }] : [];
  });

  /** Liste plate des items visibles, pour la navigation clavier. */
  private flat = computed<RankedItem[]>(() => this.sections().flatMap(s => s.items));

  hasResults = computed(() => this.flat().length > 0);
  /** Aucun résultat après une saisie (≠ état vide initial). */
  emptyState = computed(() => !!this.normalizedQuery() && !this.hasResults());

  /**
   * Complétion inline (façon Spotlight macOS) : si le nom du résultat ACTIF
   * commence par la requête tapée, on propose le reste en texte fantôme dans la
   * barre. Accepté par Tab ou →. On préserve la casse d'origine du nom.
   */
  completion = computed<{ typed: string; ghost: string } | null>(() => {
    const raw = this.query();
    if (!raw || raw !== raw.trimStart()) return null; // pas de complétion si espace en tête
    const active = this.flat()[this.activeIndex()]?.item;
    if (!active) return null;
    const name = active.name;
    if (name.length <= raw.length) return null;
    // Préfixe insensible à la casse
    if (name.slice(0, raw.length).toLowerCase() !== raw.toLowerCase()) return null;
    return { typed: name.slice(0, raw.length), ghost: name.slice(raw.length) };
  });

  constructor() {
    // À chaque changement de requête, on ré-ancre la sélection sur le 1er item ;
    // et on focus le champ à l'ouverture.
    effect(() => {
      this.query();
      this.activeIndex.set(0);
    });
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => this.inputEl()?.nativeElement.focus());
      }
    });
  }

  isActive(index: number) { return this.activeIndex() === index; }

  onInput(ev: Event) {
    this.query.set((ev.target as HTMLInputElement).value);
  }

  onKeydown(ev: KeyboardEvent) {
    if (!this.open()) return;
    switch (ev.key) {
      case 'Escape':
        ev.preventDefault();
        this.close();
        break;
      case 'ArrowDown':
        ev.preventDefault();
        this.move(1);
        break;
      case 'ArrowUp':
        ev.preventDefault();
        this.move(-1);
        break;
      case 'Tab':
      case 'ArrowRight': {
        // Tab / → : accepte la complétion fantôme si le curseur est en fin.
        const el = this.inputEl()?.nativeElement;
        const atEnd = el ? el.selectionStart === el.value.length : true;
        if (this.completion() && atEnd) {
          ev.preventDefault();
          this.acceptCompletion();
        }
        break;
      }
      case 'Enter': {
        ev.preventDefault();
        const entry = this.flat()[this.activeIndex()];
        if (entry) this.pick(entry.item);
        break;
      }
    }
  }

  /** Complète la requête avec le suffixe fantôme (nom complet du résultat actif). */
  private acceptCompletion() {
    const c = this.completion();
    if (!c) return;
    this.query.set(c.typed + c.ghost);
    queueMicrotask(() => {
      const el = this.inputEl()?.nativeElement;
      if (el) el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  private move(delta: number) {
    const n = this.flat().length;
    if (!n) return;
    this.activeIndex.update(i => (i + delta + n) % n);
  }

  pick(item: SpotlightItem) {
    this.selected.emit(item);
    this.close();
  }

  copy(ev: Event, item: SpotlightItem) {
    ev.stopPropagation();
    navigator.clipboard?.writeText(item.id).catch(() => {});
    this.copied.emit(item);
  }

  clear() {
    this.query.set('');
    this.inputEl()?.nativeElement.focus();
  }

  close() {
    this.open.set(false);
    this.closed.emit();
  }

  onBackdrop() { this.close(); }
}
