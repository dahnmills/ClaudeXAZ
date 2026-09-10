import { Component, computed, inject, signal } from '@angular/core';
import {
  PageHeaderComponent,
  BreadcrumbsComponent,
  CrumbComponent,
  PageTitleComponent,
  ButtonComponent,
  IconComponent,
  TableRowComponent,
  CellComponent,
  CellHeaderComponent,
  CellActionComponent,
  CellSelectionComponent,
  FlyoutMenuComponent,
  FlyoutMenuItemComponent,
  FunctionalNoticeComponent,
  ToasterContainerComponent,
  ToasterService,
} from '../../shared/ui';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { UploadPortfoliosModalComponent } from './components/upload-portfolios-modal.component';
import { UpdatePortfolioModalComponent } from './components/update-portfolio-modal.component';
import { SelectPortfolioModalComponent } from './components/select-portfolio-modal.component';
import {
  PORTFOLIOS,
  PORTFOLIO_TEAMS,
  PORTFOLIO_TEAMS_BY_ID,
  PORTFOLIO_USERS,
  type Assignment,
  type Portfolio,
  type PortfolioScope,
} from './portfolio-management.data';

/** Colonnes triables du tableau. */
type SortKey = 'owner' | 'buyers';

/** Périmètre retenu, gardé par référence et non par objet : les compteurs restent vivants. */
interface ScopeRef {
  kind: 'user' | 'team';
  id: string;
}


@Component({
  selector: 'app-portfolio-management',
  standalone: true,
  imports: [
    TopboxTestShellComponent,
    PageHeaderComponent,
    BreadcrumbsComponent,
    CrumbComponent,
    PageTitleComponent,
    ButtonComponent,
    IconComponent,
    TableRowComponent,
    CellComponent,
    CellHeaderComponent,
    CellActionComponent,
    CellSelectionComponent,
    FlyoutMenuComponent,
    FlyoutMenuItemComponent,
    FunctionalNoticeComponent,
    ToasterContainerComponent,
    UploadPortfoliosModalComponent,
    UpdatePortfolioModalComponent,
    SelectPortfolioModalComponent,
  ],
  templateUrl: './portfolio-management.component.html',
  styleUrl: './portfolio-management.component.scss',
})
export class PortfolioManagementComponent {
  private toaster = inject(ToasterService);

  readonly portfolios = signal<Portfolio[]>(
    PORTFOLIOS.map(p => ({ ...p, buyerIds: [...p.buyerIds] })),
  );

  readonly sortKey = signal<SortKey>('owner');
  readonly sortDir = signal<'asc' | 'desc'>('asc');

  readonly uploadOpen = signal(false);

  /**
   * Portefeuille en cours de mise à jour, gardé par identifiant et non par objet :
   * la modale lit toujours la version courante de la liste, jamais une copie figée
   * à l'ouverture.
   */
  readonly updateTargetId = signal<string | null>(null);
  readonly updateTarget = computed<Portfolio | null>(
    () => this.portfolios().find(p => p.id === this.updateTargetId()) ?? null,
  );

  /** Lignes cochées, par identifiant de portefeuille. */
  readonly selectedIds = signal<string[]>([]);

  // ── Périmètre consulté ─────────────────────────────────────────────────────

  readonly selectOpen = signal(false);

  /**
   * `null` = tous les portefeuilles. Sinon on regarde le portefeuille de quelqu'un
   * d'autre, comme sur Agenda : le titre le nomme, le tableau s'y réduit.
   */
  readonly scopeRef = signal<ScopeRef | null>(null);

  /** Périmètres proposés par utilisateur. Les compteurs viennent des portefeuilles réels. */
  readonly userScopes = computed<PortfolioScope[]>(() =>
    PORTFOLIO_USERS.map(user => {
      const team = PORTFOLIO_TEAMS_BY_ID.get(user.teamId)!;
      const held = this.portfolios().filter(p => p.owner === user.login);
      const buyers = held.reduce((sum, p) => sum + p.buyerIds.length, 0);
      return {
        kind: 'user' as const,
        id: user.login,
        label: user.login,
        fullName: user.fullName,
        teamName: team.name,
        country: team.country,
        owners: [user.login],
        userCount: 1,
        portfolioCount: held.length,
        buyerCount: buyers,
        haystack: [user.login, user.fullName, team.name, team.country].join(' '),
      };
    }),
  );

  /** Mêmes périmètres à l'échelle de l'équipe : tous les portefeuilles de ses membres. */
  readonly teamScopes = computed<PortfolioScope[]>(() =>
    PORTFOLIO_TEAMS.map(team => {
      const members = PORTFOLIO_USERS.filter(u => u.teamId === team.id).map(u => u.login);
      const held = this.portfolios().filter(p => members.includes(p.owner));
      const buyers = held.reduce((sum, p) => sum + p.buyerIds.length, 0);
      return {
        kind: 'team' as const,
        id: team.id,
        label: team.name,
        fullName: '',
        teamName: team.name,
        country: team.country,
        owners: members,
        userCount: members.length,
        portfolioCount: held.length,
        buyerCount: buyers,
        haystack: [team.name, team.country, ...members].join(' '),
      };
    }),
  );

  /** Le périmètre est recalculé à chaque changement de données, jamais figé à la bascule. */
  readonly scope = computed<PortfolioScope | null>(() => {
    const ref = this.scopeRef();
    if (!ref) return null;
    const pool = ref.kind === 'user' ? this.userScopes() : this.teamScopes();
    return pool.find(s => s.id === ref.id) ?? null;
  });

  /**
   * Tri local : le titulaire se compare en texte (insensible à la casse), le
   * nombre d'acheteurs en nombre. On copie avant de trier, `sort()` mute. Sous
   * périmètre, seuls les portefeuilles de ses titulaires restent.
   */
  readonly rows = computed<Portfolio[]>(() => {
    const key = this.sortKey();
    const way = this.sortDir() === 'asc' ? 1 : -1;
    const owners = this.scope()?.owners ?? null;
    const list = owners
      ? this.portfolios().filter(p => owners.includes(p.owner))
      : this.portfolios();
    return [...list].sort((a, b) =>
      key === 'buyers'
        ? (a.buyerIds.length - b.buyerIds.length) * way
        : a.owner.localeCompare(b.owner, undefined, { sensitivity: 'base' }) * way,
    );
  });

  /** Portefeuilles écartés par le périmètre : la bande le dit, l'écran ne ment pas. */
  readonly hiddenCount = computed(() => this.portfolios().length - this.rows().length);

  readonly scopeMessage = computed(() => {
    const scope = this.scope();
    if (!scope) return '';
    const what = scope.kind === 'user'
      ? `the portfolio of ${scope.label}`
      : `the ${scope.portfolioCount} portfolios of ${scope.label}`;
    const hidden = this.hiddenCount();
    const rest = hidden
      ? ` ${hidden} other portfolio${hidden > 1 ? 's are' : ' is'} hidden.`
      : '';
    return `Viewing ${what}.${rest}`;
  });

  /** Un titulaire peut exister sans portefeuille : le tableau vide doit le dire. */
  readonly emptyMessage = computed(() => {
    const scope = this.scope();
    if (!scope) return 'No portfolio yet.';
    return scope.kind === 'user'
      ? `${scope.label} holds no portfolio yet.`
      : `No portfolio yet in ${scope.label}.`;
  });

  onSwitched(scope: PortfolioScope): void {
    this.scopeRef.set({ kind: scope.kind, id: scope.id });
    this.selectOpen.set(false);
    // Les lignes cochées n'appartiennent plus au tableau affiché : on repart d'une
    // sélection vide plutôt que d'agir plus tard sur des lignes invisibles.
    this.clearSelection();
    const what = scope.kind === 'user'
      ? `the portfolio of ${scope.label}`
      : `the ${scope.portfolioCount} portfolios of ${scope.label}`;
    this.toaster.show(`Now viewing ${what}`, { tone: 'info' });
  }

  showAllPortfolios(): void {
    this.scopeRef.set(null);
    this.clearSelection();
  }

  /** `null` sur une colonne non triée : l'en-tête affiche alors la double flèche. */
  sortDirectionOf(key: SortKey): 'asc' | 'desc' | null {
    return this.sortKey() === key ? this.sortDir() : null;
  }

  /** Cliquer la colonne triée inverse le sens, une autre colonne repart en asc. */
  onSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
      return;
    }
    this.sortKey.set(key);
    this.sortDir.set('asc');
  }

  // ── Sélection de lignes ────────────────────────────────────────────────────

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggleRow(id: string, checked: boolean): void {
    this.selectedIds.update(list =>
      checked ? [...list, id] : list.filter(other => other !== id),
    );
  }

  /**
   * Les trois gestes de la case d'en-tête travaillent sur les lignes **affichées**.
   * Sous périmètre, cocher tout ne doit pas ramasser des portefeuilles qu'on ne
   * voit pas.
   */
  readonly allSelected = computed(() => {
    const rows = this.rows();
    return rows.length > 0 && this.selectedIds().length === rows.length;
  });

  /** Sélection partielle : la case d'en-tête passe en indéterminée. */
  readonly someSelected = computed(() => {
    const count = this.selectedIds().length;
    return count > 0 && count < this.rows().length;
  });

  toggleAll(checked: boolean): void {
    this.selectedIds.set(checked ? this.rows().map(p => p.id) : []);
  }

  clearSelection(): void {
    this.selectedIds.set([]);
  }

  // ── Mise à jour d'un portefeuille ──────────────────────────────────────────

  openUpdate(id: string): void {
    this.updateTargetId.set(id);
  }

  /**
   * Nouvelle composition validée dans la modale. Un acheteur n'appartient qu'à un
   * portefeuille à la fois : ceux qu'on vient d'ajouter sont retirés de celui qui
   * les tenait, et le toast le dit au lieu de le laisser deviner.
   */
  onUpdated(change: { id: string; buyerIds: string[] }): void {
    const before = this.portfolios().find(p => p.id === change.id);
    if (!before) return;

    const kept = new Set(before.buyerIds);
    const added = change.buyerIds.filter(id => !kept.has(id));
    const next = new Set(change.buyerIds);
    const removed = before.buyerIds.filter(id => !next.has(id));

    let takenFrom = 0;
    this.portfolios.update(list =>
      list.map(portfolio => {
        if (portfolio.id === change.id) {
          return { ...portfolio, buyerIds: [...change.buyerIds] };
        }
        const trimmed = portfolio.buyerIds.filter(id => !next.has(id));
        if (trimmed.length === portfolio.buyerIds.length) return portfolio;
        takenFrom += portfolio.buyerIds.length - trimmed.length;
        return { ...portfolio, buyerIds: trimmed };
      }),
    );

    this.updateTargetId.set(null);

    const parts = [`${before.owner} updated`];
    if (added.length) parts.push(`${added.length} buyer${added.length > 1 ? 's' : ''} added`);
    if (removed.length) parts.push(`${removed.length} removed`);
    if (takenFrom) parts.push(`${takenFrom} moved from another portfolio`);
    this.toaster.show(parts.join(' · '), { tone: 'success' });
  }

  /**
   * Application du fichier : chaque ligne retire l'acheteur de son portefeuille
   * d'origine et l'ajoute au portefeuille demandé, créé s'il n'existait pas.
   * Le calcul est générique, aucun décompte n'est écrit en dur.
   */
  onApplied(batch: Assignment[]): void {
    const byOwner = new Map(
      this.portfolios().map(p => [p.owner, { ...p, buyerIds: [...p.buyerIds] }]),
    );
    let created = 0;
    // Le prochain identifiant se prend au-dessus du plus grand existant, pas au
    // nombre de portefeuilles : la numérotation ne commence pas à 1 et un compteur
    // finirait par rendre un identifiant déjà pris.
    let lastId = this.portfolios().reduce(
      (top, p) => Math.max(top, Number(p.id.replace(/\D/g, '')) || 0),
      0,
    );

    for (const line of batch) {
      if (line.from) {
        const source = byOwner.get(line.from);
        if (source) source.buyerIds = source.buyerIds.filter(id => id !== line.buyerId);
      }
      let target = byOwner.get(line.to);
      if (!target) {
        created += 1;
        lastId += 1;
        target = {
          id: `PF-${lastId.toString().padStart(4, '0')}`,
          owner: line.to,
          buyerIds: [],
        };
        byOwner.set(line.to, target);
      }
      if (!target.buyerIds.includes(line.buyerId)) target.buyerIds.push(line.buyerId);
    }

    this.portfolios.set([...byOwner.values()]);
    this.uploadOpen.set(false);
    // Les portefeuilles créés n'étaient pas cochables avant l'application : on
    // repart d'une sélection vide plutôt que d'en garder une qui ne dit plus rien.
    this.clearSelection();

    const moved = batch.filter(a => a.from).length;
    const parts = [`${batch.length} buyers assigned`];
    if (moved) parts.push(`${moved} moved from another portfolio`);
    if (created) parts.push(`${created} portfolio${created > 1 ? 's' : ''} created`);
    this.toaster.show(parts.join(' · '), { tone: 'success' });
  }
}
