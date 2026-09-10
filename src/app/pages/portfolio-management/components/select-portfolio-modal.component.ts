import { Component, computed, effect, input, output, signal } from '@angular/core';
import {
  ModalComponent,
  ButtonComponent,
  IconComponent,
  BadgeComponent,
  SegmentedControlComponent,
  InputSearchComponent,
  TagFilterChipComponent,
  TableRowComponent,
  CellComponent,
  CellHeaderComponent,
  ConfirmDialogComponent,
  type SegmentedOption,
  type TagFilterOption,
  type TableRowState,
} from '../../../shared/ui';
import { PORTFOLIO_COUNTRIES, type PortfolioScope } from '../portfolio-management.data';

/** Les deux entrées : par titulaire ou par équipe. */
type Mode = 'user' | 'team';

const MODES: SegmentedOption[] = [
  { value: 'user', label: 'By user', icon: 'user', iconPos: 'left' },
  { value: 'team', label: 'By team', icon: 'users', iconPos: 'left' },
];

const COUNTRY_OPTIONS: TagFilterOption[] =
  PORTFOLIO_COUNTRIES.map(c => ({ value: c, label: c }));

/**
 * Select another portfolio : on va consulter le portefeuille de quelqu'un d'autre.
 *
 * Deux entrées dans le même écran, un titulaire ou une équipe, parce que c'est la
 * même question posée à deux échelles. Le pays filtre les deux : chercher un
 * collègue dont on ne sait que le pays est le cas courant, et le réserver aux
 * équipes obligerait à passer par l'équipe pour retrouver une personne.
 *
 * La bascule n'est pas appliquée au clic : une popin nomme le périmètre visé et
 * dit ce qui va changer à l'écran. La modale se suspend le temps de la question et
 * revient intacte si on annule.
 */
@Component({
  selector: 'pm-select-portfolio-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    SegmentedControlComponent,
    InputSearchComponent,
    TagFilterChipComponent,
    TableRowComponent,
    CellComponent,
    CellHeaderComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './select-portfolio-modal.component.html',
  styleUrl: './select-portfolio-modal.component.scss',
})
export class SelectPortfolioModalComponent {
  open = input<boolean>(false);

  /** Périmètres candidats, comptés par la page sur les portefeuilles réels. */
  users = input<PortfolioScope[]>([]);
  teams = input<PortfolioScope[]>([]);

  /** Périmètre déjà consulté, `null` quand on regarde tous les portefeuilles. */
  current = input<PortfolioScope | null>(null);

  switched = output<PortfolioScope>();
  closed   = output<void>();

  readonly MODES = MODES;
  readonly COUNTRY_OPTIONS = COUNTRY_OPTIONS;

  readonly mode      = signal<Mode>('user');
  readonly search    = signal('');
  readonly countries = signal<Set<string>>(new Set());
  readonly pickedId  = signal<string | null>(null);

  readonly confirmOpen = signal(false);

  constructor() {
    // Chaque ouverture repart de zéro : une recherche laissée en place au tour
    // précédent cacherait la moitié de l'annuaire sans qu'on sache pourquoi.
    effect(() => {
      if (this.open()) this.reset();
    });
  }

  readonly pool = computed<PortfolioScope[]>(() => {
    const list = this.mode() === 'user' ? this.users() : this.teams();
    return [...list].sort((a, b) => a.label.localeCompare(b.label));
  });

  readonly rows = computed<PortfolioScope[]>(() => {
    const q = this.search().trim().toLowerCase();
    const countries = this.countries();
    return this.pool().filter(scope => {
      if (countries.size && !countries.has(scope.country)) return false;
      return !q || scope.haystack.toLowerCase().includes(q);
    });
  });

  readonly picked = computed<PortfolioScope | null>(() => {
    const id = this.pickedId();
    return id ? this.rows().find(s => s.id === id) ?? null : null;
  });

  readonly filtered = computed(() => !!this.search().trim() || this.countries().size > 0);

  readonly noun = computed(() => this.mode() === 'user' ? 'users' : 'teams');

  readonly countText = computed(() => {
    const shown = this.rows().length;
    const total = this.pool().length;
    return this.filtered()
      ? `${shown} of ${total} ${this.noun()}`
      : `${total} ${this.noun()}`;
  });

  readonly searchLabel = computed(() =>
    this.mode() === 'user' ? 'Search a user' : 'Search a team');

  readonly searchPlaceholder = computed(() =>
    this.mode() === 'user' ? 'Login or name' : 'Team name');

  readonly emptyText = computed(() =>
    this.mode() === 'user'
      ? 'No user matches this search.'
      : 'No team matches this search.');

  readonly confirmText = computed(() => {
    const pick = this.picked();
    if (!pick) return '';
    const scope = pick.kind === 'user'
      ? `the portfolio of ${pick.label}`
      : `the ${pick.portfolioCount} portfolios of ${pick.label}`;
    return `You are about to view ${scope}. The list will show that scope only, until you go back to all portfolios.`;
  });

  setMode(value: string): void {
    if (value === this.mode()) return;
    this.mode.set(value as Mode);
    // Une recherche écrite pour un login ne veut plus rien dire sur des équipes,
    // et une sélection ne survit pas au changement d'échelle. Le pays, lui, reste :
    // c'est le même filtre sur les deux listes.
    this.search.set('');
    this.pickedId.set(null);
  }

  clearFilters(): void {
    this.search.set('');
    this.countries.set(new Set());
  }

  pick(scope: PortfolioScope): void {
    if (this.isCurrent(scope)) return;
    this.pickedId.set(scope.id);
  }

  /** Le périmètre déjà consulté n'est pas un choix : il est marqué et inerte. */
  rowState(scope: PortfolioScope): TableRowState {
    if (this.isCurrent(scope)) return 'disabled';
    return scope.id === this.pickedId() ? 'active' : 'default';
  }

  /**
   * Valeur d'une colonne de volume. Un périmètre sans portefeuille n'a pas
   * « 0 buyer », il n'a rien : la cellule porte le tiret des cellules vides.
   */
  heldText(value: number, portfolios: number): string {
    return portfolios ? String(value) : '—';
  }

  isCurrent(scope: PortfolioScope): boolean {
    const cur = this.current();
    return !!cur && cur.kind === scope.kind && cur.id === scope.id;
  }

  askConfirm(): void {
    if (!this.picked()) return;
    this.confirmOpen.set(true);
  }

  onConfirmed(): void {
    const pick = this.picked();
    this.confirmOpen.set(false);
    if (pick) this.switched.emit(pick);
  }

  requestClose(): void {
    this.confirmOpen.set(false);
    this.closed.emit();
  }

  private reset(): void {
    this.mode.set('user');
    this.search.set('');
    this.countries.set(new Set());
    this.pickedId.set(null);
    this.confirmOpen.set(false);
  }
}
