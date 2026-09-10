import { Component, computed, effect, input, output, signal } from '@angular/core';
import {
  ModalComponent,
  ButtonComponent,
  ButtonIconComponent,
  IconComponent,
  BadgeComponent,
  CardComponent,
  ChipComponent,
  DividerComponent,
  InputSearchComponent,
  StandaloneDropdownComponent,
  ConfirmDialogComponent,
  type SelectOption,
} from '../../../shared/ui';
import { BUYERS, type Buyer, type Portfolio } from '../portfolio-management.data';

/** Tri d'une colonne. Les deux colonnes se trient indépendamment. */
export type BuyerOrder = 'name-asc' | 'name-desc' | 'status';

/** État d'un acheteur par rapport au portefeuille tel qu'il était à l'ouverture. */
type Stage = 'new' | 'removed' | 'unchanged';

/** Une ligne de colonne : l'acheteur et ce qui lui arrive. */
export interface BuyerRow {
  buyer: Buyer;
  stage: Stage;
}

const ORDER_LABELS: Record<BuyerOrder, string> = {
  'name-asc':  'Name A to Z',
  'name-desc': 'Name Z to A',
  'status':    'Status',
};

/** Les mêmes tris, sous la forme attendue par ds-standalone-dropdown. */
const ORDER_OPTIONS: SelectOption[] = (Object.keys(ORDER_LABELS) as BuyerOrder[])
  .map(value => ({ value, label: ORDER_LABELS[value] }));

/**
 * Update portfolio : deux colonnes, un acheteur passe de l'une à l'autre.
 *
 * Rien n'est appliqué avant `Update`. Tant qu'on est dans la modale, un ajout se
 * lit en vert et porte le libellé « New », un retrait se lit en rouge et porte
 * « Removed ». Un acheteur ramené à sa place d'origine redevient neutre : on ne
 * garde pas la trace d'un aller-retour qui ne change rien.
 *
 * Fermer avec des changements en attente demande confirmation (la modale se
 * suspend, la popin répond), fermer sans changement ne demande rien.
 */
@Component({
  selector: 'pm-update-portfolio-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ButtonComponent,
    ButtonIconComponent,
    IconComponent,
    BadgeComponent,
    CardComponent,
    ChipComponent,
    DividerComponent,
    InputSearchComponent,
    StandaloneDropdownComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './update-portfolio-modal.component.html',
  styleUrl: './update-portfolio-modal.component.scss',
})
export class UpdatePortfolioModalComponent {
  open      = input<boolean>(false);
  /** Portefeuille édité. `null` quand la modale est fermée. */
  portfolio = input<Portfolio | null>(null);

  /** Nouvelle composition validée par l'utilisateur. */
  updated = output<{ id: string; buyerIds: string[] }>();
  closed  = output<void>();

  /** Composition au moment de l'ouverture : la référence des états new / removed. */
  private readonly initial = signal<string[]>([]);
  /** Composition en cours d'édition. */
  private readonly staged = signal<string[]>([]);

  readonly leaveOpen = signal(false);

  // ── Filtres et tri, une paire par colonne ────────────────────────────────
  readonly currentSearch = signal('');
  readonly currentOrder  = signal<BuyerOrder>('name-asc');
  readonly showNew       = signal(true);
  readonly showKept      = signal(true);

  readonly availableSearch = signal('');
  readonly availableOrder  = signal<BuyerOrder>('name-asc');
  readonly showRemoved     = signal(true);
  readonly showNeverIn     = signal(true);

  /** Options du menu de tri : l'atome porte la liste, la page ne gère plus l'ouverture. */
  readonly ORDER_OPTIONS = ORDER_OPTIONS;

  readonly title = computed(() => {
    const owner = this.portfolio()?.owner;
    // Trait d'union comme le titre de page : un nom qui suit un titre s'annonce
    // au trait, pas au point médian.
    return owner ? `Update portfolio - ${owner}` : 'Update portfolio';
  });

  constructor() {
    // Chaque ouverture repart de la composition réelle du portefeuille : la modale
    // ne conserve rien d'une session précédente.
    effect(() => {
      const target = this.portfolio();
      if (!this.open() || !target) return;
      this.initial.set([...target.buyerIds]);
      this.staged.set([...target.buyerIds]);
      this.resetFilters();
    });
  }

  // ── Colonnes ─────────────────────────────────────────────────────────────

  /**
   * Colonne de gauche : ce que contiendra le portefeuille si on valide.
   * Un acheteur y est « New » s'il n'y était pas à l'ouverture.
   */
  readonly currentRows = computed<BuyerRow[]>(() => {
    const before = new Set(this.initial());
    const rows = this.staged()
      .map(id => ({ buyer: this.buyerOf(id), stage: (before.has(id) ? 'unchanged' : 'new') as Stage }))
      .filter((row): row is BuyerRow => row.buyer !== null);
    return this.present(rows, this.currentSearch(), this.currentOrder(), this.showNew(), this.showKept());
  });

  /**
   * Colonne de droite : tout le reste du référentiel. Un acheteur y est
   * « Removed » s'il était dans le portefeuille à l'ouverture.
   *
   * Un acheteur rattaché à un autre portefeuille reste disponible ici : c'est ce
   * que fait l'écran legacy, et c'est aussi pour ça que le dépôt de fichier fait
   * confirmer les déplacements.
   */
  readonly availableRows = computed<BuyerRow[]>(() => {
    const before = new Set(this.initial());
    const inPortfolio = new Set(this.staged());
    const rows = BUYERS
      .filter(buyer => !inPortfolio.has(buyer.id))
      .map(buyer => ({ buyer, stage: (before.has(buyer.id) ? 'removed' : 'unchanged') as Stage }));
    return this.present(rows, this.availableSearch(), this.availableOrder(), this.showRemoved(), this.showNeverIn());
  });

  /** Compteurs d'en-tête : la colonne entière, pas le résultat filtré. */
  readonly currentCount   = computed(() => this.staged().length);
  readonly availableCount = computed(() => BUYERS.length - this.staged().length);

  readonly addedCount   = computed(() => {
    const before = new Set(this.initial());
    return this.staged().filter(id => !before.has(id)).length;
  });

  readonly removedCount = computed(() => {
    const after = new Set(this.staged());
    return this.initial().filter(id => !after.has(id)).length;
  });

  readonly dirty = computed(() => this.addedCount() > 0 || this.removedCount() > 0);

  // L'atome rend une chaîne, le tri est une union fermée : on la referme ici.
  setCurrentOrder(value: string): void   { this.currentOrder.set(value as BuyerOrder); }
  setAvailableOrder(value: string): void { this.availableOrder.set(value as BuyerOrder); }

  // ── Transferts ───────────────────────────────────────────────────────────

  /** Ajout : l'acheteur rejoint la fin de la colonne de gauche, le tri le replace. */
  add(id: string): void {
    if (this.staged().includes(id)) return;
    this.staged.update(list => [...list, id]);
  }

  remove(id: string): void {
    this.staged.update(list => list.filter(other => other !== id));
  }

  // ── Sorties ──────────────────────────────────────────────────────────────

  onUpdate(): void {
    const target = this.portfolio();
    if (!target) return;
    this.updated.emit({ id: target.id, buyerIds: [...this.staged()] });
  }

  /** Fermeture : silencieuse si rien n'est en attente, sinon la popin tranche. */
  requestClose(): void {
    if (!this.dirty()) {
      this.closed.emit();
      return;
    }
    this.leaveOpen.set(true);
  }

  onLeaveConfirmed(): void {
    this.leaveOpen.set(false);
    this.closed.emit();
  }

  onLeaveCancelled(): void {
    this.leaveOpen.set(false);
  }

  // ── Interne ──────────────────────────────────────────────────────────────

  private buyerOf(id: string): Buyer | null {
    return BUYERS.find(buyer => buyer.id === id) ?? null;
  }

  /**
   * Filtre par état, puis par recherche (nom ou identifiant, insensible à la
   * casse), puis trie. Une colonne vide n'est pas une erreur, le template le dit.
   */
  private present(
    rows: BuyerRow[],
    search: string,
    order: BuyerOrder,
    showChanged: boolean,
    showUnchanged: boolean,
  ): BuyerRow[] {
    const needle = search.trim().toLowerCase();
    return rows
      .filter(row => row.stage === 'unchanged' ? showUnchanged : showChanged)
      .filter(row => !needle
        || row.buyer.name.toLowerCase().includes(needle)
        || row.buyer.id.includes(needle))
      .sort((a, b) => {
        const byName = (x: BuyerRow, y: BuyerRow, way: number) =>
          x.buyer.name.localeCompare(y.buyer.name, undefined, { sensitivity: 'base' }) * way;
        if (order === 'status') {
          // Ce qui a changé remonte, le reste suit : « New » d'un côté, « Removed »
          // de l'autre, chaque groupe alphabétique. C'est la relecture d'un
          // brouillon avant de valider, pas une exploration du référentiel.
          const rank = (row: BuyerRow) => row.stage === 'unchanged' ? 1 : 0;
          const gap = rank(a) - rank(b);
          return gap !== 0 ? gap : byName(a, b, 1);
        }
        return byName(a, b, order === 'name-desc' ? -1 : 1);
      });
  }

  private resetFilters(): void {
    this.currentSearch.set('');
    this.availableSearch.set('');
    this.currentOrder.set('name-asc');
    this.availableOrder.set('name-asc');
    this.showNew.set(true);
    this.showKept.set(true);
    this.showRemoved.set(true);
    this.showNeverIn.set(true);
    this.leaveOpen.set(false);
  }
}
