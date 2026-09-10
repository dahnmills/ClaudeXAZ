import { Component, computed, effect, input, output, signal } from '@angular/core';
import {
  ModalComponent,
  ButtonComponent,
  IconComponent,
  BadgeComponent,
  SegmentedControlComponent,
  InputSearchComponent,
  TagFilterChipComponent,
  RadioCardComponent,
  ConfirmDialogComponent,
  type SegmentedOption,
  type TagFilterOption,
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

/** « 1 buyer », « 3 buyers ». Le pluriel se lit : une revue précédente avait déjà
 *  relevé des décomptes au singulier fautif sur cet écran. */
const plural = (n: number, one: string, many = `${one}s`): string =>
  `${n} ${n === 1 ? one : many}`;

/**
 * Select another portfolio : on va consulter le portefeuille de quelqu'un d'autre,
 * ou revenir au sien, sa carte étant marquée « You » comme les autres.
 *
 * Deux entrées dans le même écran, un titulaire ou une équipe, parce que c'est la
 * même question posée à deux échelles. Le pays filtre les deux : chercher un
 * collègue dont on ne sait que le pays est le cas courant, et le réserver aux
 * équipes obligerait à passer par l'équipe pour retrouver une personne.
 *
 * Rien n'est listé à l'ouverture : l'annuaire est trop long pour qu'un début
 * d'alphabet serve à quelque chose. On cherche, ou on filtre par pays, et alors
 * les résultats arrivent en cartes.
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
    RadioCardComponent,
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

  /** Périmètre déjà consulté. La carte qui le porte est marquée et ne se choisit pas. */
  current = input<PortfolioScope | null>(null);

  /**
   * Login de celui qui regarde. Sa carte est marquée « You » : c'est par là qu'on
   * revient chez soi sans passer par le titre de la page.
   */
  myLogin = input<string>('');

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
    // Aucune recherche, aucun pays : aucune ligne. C'est la liste elle-même qui
    // est vide, pas seulement son affichage, donc une sélection ne peut pas
    // survivre à l'effacement de la recherche qui l'avait fait apparaître.
    if (!this.filtered()) return [];
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

  // Le décompte ne s'affiche que sous recherche ou filtre : avant, il n'y a rien
  // à compter et annoncer un total sans rien lister se contredirait.
  readonly countText = computed(() =>
    `${this.rows().length} of ${this.pool().length} ${this.noun()}`);

  readonly listLabel = computed(() => this.mode() === 'user' ? 'Users' : 'Teams');

  readonly idleText = computed(() =>
    this.mode() === 'user'
      ? 'Search a user by login or name, or filter by country.'
      : 'Search a team by name, or filter by country.');

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
    if (this.isMe(pick)) {
      return 'You are about to go back to your own portfolio. The list will show what you hold again.';
    }
    const scope = pick.kind === 'user'
      ? `the portfolio of ${pick.label}`
      : `the ${pick.portfolioCount} portfolios of ${pick.label}`;
    return `You are about to view ${scope}. The list will show that scope only, until you go back to your own portfolio.`;
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

  /** Le nom d'abord, l'identifiant ensuite : on cherche un collègue par son nom,
   *  et une équipe n'a que le sien. */
  cardLabel(scope: PortfolioScope): string {
    return this.mode() === 'user' ? scope.fullName || scope.label : scope.label;
  }

  /** Ce qui situe le périmètre : de qui il s'agit, où, et à quelle échelle. */
  cardSublabel(scope: PortfolioScope): string {
    return this.mode() === 'user'
      ? [scope.label, scope.teamName, scope.country].filter(Boolean).join(' · ')
      : [scope.country, plural(scope.userCount, 'user')].join(' · ');
  }

  /**
   * Volumes du périmètre, en face de son nom. Un périmètre sans portefeuille n'a
   * pas « 0 buyer », il n'a rien à consulter : la carte le dit en mots, elle n'a
   * pas de colonne où poser le tiret d'une cellule vide.
   */
  statsText(scope: PortfolioScope): string {
    if (!scope.portfolioCount) return 'No portfolio yet';
    return `${plural(scope.portfolioCount, 'portfolio')} · ${plural(scope.buyerCount, 'buyer')}`;
  }

  isCurrent(scope: PortfolioScope): boolean {
    const cur = this.current();
    return !!cur && cur.kind === scope.kind && cur.id === scope.id;
  }

  /** Sa propre carte. Une équipe n'est jamais « vous », même celle dont on est membre. */
  isMe(scope: PortfolioScope): boolean {
    return scope.kind === 'user' && !!this.myLogin() && scope.id === this.myLogin();
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
