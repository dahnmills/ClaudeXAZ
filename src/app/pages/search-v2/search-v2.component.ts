import { Component, computed, inject, input, signal, viewChild, type ElementRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import {
  PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, TabComponent, IconComponent,
  ConfirmDialogComponent, ButtonComponent, SpinnerComponent, ChipComponent,
} from '../../shared/ui';
import { SearchBarScopedComponent, type SearchScope } from '../../shared/ui/search-bar-scoped/search-bar-scoped.component';
import type { SearchType, IdTypeOption } from '../../shared/ui/search-bar-multi/search-bar-multi.component';
import type { FlagCode } from '../../shared/ui/flag/flag.component';
import {
  MoreCriteriaComponent, emptyMoreCriteria, moreCriteriaCount, type MoreCriteriaValues,
} from '../../shared/ui/more-criteria/more-criteria.component';
import { defaultPolicyCriteria, type PolicyCriteriaValues, type PolicyMode } from '../../shared/ui/policy-criteria/policy-criteria.model';
import { ResultCardComponent, type ResultCardData } from '../../shared/ui/result-card/result-card.component';
import { PolicyResultCardComponent } from '../../shared/ui/policy-result-card/policy-result-card.component';
import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { BuyerSummaryStore } from '../buyer-summary/buyer-summary.store';
import { ViewedBuyersStore } from '../buyer-summary/viewed-buyers.store';
import { CompanyCreationWizardComponent } from '../search/company-creation-wizard/company-creation-wizard.component';
import { ToasterService } from '../../shared/ui/toaster/toaster.service';
import { RecentSearchV2CardComponent } from './components/recent-search-v2-card.component';
import { SearchV2RecentsStore } from './search-v2-recents.store';
import type { RecentV2Entry } from './search-v2-recents.model';
import { SearchV2ViewedStore } from './search-v2-viewed.store';
import { SearchV2FavoritesStore } from './search-v2-favorites.store';
import { searchPolicies, type PolicyQuery } from './policy-search';
import { POLICIES } from './policies.mock';
import { BUYERS } from './buyers.mock';
import {
  filterHistory, countByKind, clearLabel, emptyLabel, historyDate, fullDate,
  type HistoryFilter, type HistoryTab, type HistoryKind,
} from './search-v2-history';

type TabId = 'search' | 'searched' | 'viewed' | 'favorites';

@Component({
  selector: 'app-search-v2',
  standalone: true,
  imports: [
    TopboxTestShellComponent, PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, TabComponent,
    IconComponent, ButtonComponent, SpinnerComponent, ConfirmDialogComponent, ChipComponent,
    SearchBarScopedComponent, MoreCriteriaComponent,
    ResultCardComponent, PolicyResultCardComponent, RecentSearchV2CardComponent, CompanyCreationWizardComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './search-v2.component.html',
  styleUrl: './search-v2.component.scss',
})
export class SearchV2Component {
  state = input<'default' | 'results'>('default');

  activeTab = signal<TabId>('search');
  showMoreCriteria = signal(false);

  // ── Barre ───────────────────────────────────────────────────────────────
  scope = signal<SearchScope>('buyers');
  searchType = signal<SearchType>('company-id');
  searchCountry = signal<FlagCode | null>(null);
  searchIdType = signal<IdTypeOption | null>(null);
  policyMode = signal<PolicyMode>('open');
  buCode = signal<string | null>(null);
  searchQuery = signal('');
  criteria = signal<MoreCriteriaValues>(emptyMoreCriteria());
  policyCriteria = signal<PolicyCriteriaValues>(defaultPolicyCriteria());

  /** More criteria n'existe que côté Buyers. */
  criteriaCount = computed(() => moreCriteriaCount(this.criteria()));

  hasSearched = signal(false);
  isResults = computed(() => this.hasSearched() || this.state() === 'results');

  /** Changer d'objet repart de zéro : rien de l'objet quitté ne reste affiché. */
  onScopeChange(s: SearchScope) {
    this.scope.set(s);
    this.searchQuery.set('');
    this.criteria.set(emptyMoreCriteria());
    this.policyMode.set('open');
    this.policyCriteria.set(defaultPolicyCriteria());
    this.buCode.set(null);
    this.clearResults();
  }

  /** Changer de mode Policies (Open policy / Global search) repart de zéro aussi :
   *  la barre a déjà vidé la saisie et les critères, on retire les résultats. */
  onPolicyModeChange(m: PolicyMode) {
    this.policyMode.set(m);
    this.clearResults();
  }

  private clearResults() {
    this.hasSearched.set(false);
    this.appliedPolicyQuery.set(null);
    this.showMoreCriteria.set(false);
    this.expandedKey.set(null);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  toggleMoreCriteria() { this.showMoreCriteria.update(v => !v); }

  // ── Buyers (logique V1) ─────────────────────────────────────────────────
  results = signal<ResultCardData[]>(BUYERS);
  appliedQuery = signal('');
  appliedType = signal<SearchType>('company-id');
  isInternalSearch = computed(() => this.isResults() && this.appliedType() === 'company-id');

  buyerFiltered = computed(() => {
    const q = this.appliedQuery();
    const all = this.results();
    if (!q) return all;
    if (this.appliedType() === 'company-id') return all.filter(r => (r.companyId ?? '') === q);
    return all.filter(r => r.name.toLowerCase().includes(q) || (r.companyId ?? '').includes(q));
  });

  // ── Policies ────────────────────────────────────────────────────────────
  appliedPolicyQuery = signal<PolicyQuery | null>(null);
  policyResult = computed(() => {
    const q = this.appliedPolicyQuery();
    return q ? searchPolicies(POLICIES, q) : { items: [] as PolicyResultData[], exactHit: false };
  });

  // ── Liste courante + chargement progressif ─────────────────────────────
  private readonly PAGE_SIZE = 6;
  visibleCount = signal(this.PAGE_SIZE);
  loadingMore = signal(false);

  totalCount = computed(() => this.scope() === 'buyers' ? this.buyerFiltered().length : this.policyResult().items.length);
  visibleBuyers = computed(() => this.buyerFiltered().slice(0, this.visibleCount()));
  visiblePolicies = computed(() => this.policyResult().items.slice(0, this.visibleCount()));
  allLoaded = computed(() => this.visibleCount() >= this.totalCount());
  noResults = computed(() => this.isResults() && this.totalCount() === 0);

  scrollHost = viewChild<ElementRef<HTMLElement>>('scrollHost');

  loadMore() {
    if (this.loadingMore() || this.allLoaded()) return;
    this.loadingMore.set(true);
    setTimeout(() => {
      this.visibleCount.update(n => Math.min(n + this.PAGE_SIZE, this.totalCount()));
      this.loadingMore.set(false);
      this.maybeFill();
    }, 500);
  }

  onScroll(e: Event) {
    const el = e.target as HTMLElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 160) this.loadMore();
  }

  private maybeFill() {
    const el = this.scrollHost()?.nativeElement;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight + 4 && !this.allLoaded() && !this.loadingMore()) this.loadMore();
  }

  /** Dépliage d'une carte, toutes listes confondues : `buyer:<id>` ou `policy:<id>`. */
  expandedKey = signal<string | null>(null);
  toggleExpanded(key: string) { this.expandedKey.set(this.expandedKey() === key ? null : key); }
  buyerKey(r: ResultCardData, i: number) { return `buyer:${r.companyId ?? 'idx-' + i}`; }
  policyKey(p: PolicyResultData) { return `policy:${p.id}`; }

  // ── Recherche ───────────────────────────────────────────────────────────
  recentsStore = inject(SearchV2RecentsStore);

  runSearch() {
    this.hasSearched.set(true);
    this.visibleCount.set(this.PAGE_SIZE);
    this.activeTab.set('search');
    this.showMoreCriteria.set(false);
    const q = this.searchQuery().trim();

    if (this.scope() === 'buyers') {
      this.appliedType.set(this.searchType());
      this.appliedQuery.set(q.toLowerCase());
      this.expandedKey.set(null);
      this.recentsStore.record({
        kind: 'buyer', type: this.searchType(), query: q,
        country: this.searchCountry(), idType: this.searchIdType(), criteria: this.criteria(),
      });
    } else {
      const query: PolicyQuery = { mode: this.policyMode(), buCode: this.buCode(), query: q, criteria: this.policyCriteria() };
      this.appliedPolicyQuery.set(query);
      const r = this.policyResult();
      this.expandedKey.set(r.exactHit ? this.policyKey(r.items[0]) : null);
      this.recentsStore.record({ kind: 'policy', mode: query.mode, buCode: query.buCode, query: q, criteria: query.criteria });
    }
    setTimeout(() => this.maybeFill());
  }

  /** Rejouer remet la barre sur le bon objet, recharge tout et relance. */
  pickRecent(e: RecentV2Entry) {
    // Changer d'objet passe par la même remise à zéro qu'au clic sur le slot 1
    const target: SearchScope = e.kind === 'buyer' ? 'buyers' : 'policies';
    if (target !== this.scope()) this.onScopeChange(target);
    if (e.kind === 'buyer') {
      this.searchType.set(e.type);
      this.searchCountry.set(e.country);
      this.searchIdType.set(e.idType);
      this.criteria.set(e.criteria);
    } else {
      this.policyMode.set(e.mode);
      this.buCode.set(e.buCode);
      this.policyCriteria.set(e.criteria);
    }
    this.searchQuery.set(e.query);
    this.runSearch();
  }

  // ── Actions buyers (V1) ─────────────────────────────────────────────────
  private router = inject(Router);
  private buyerStore = inject(BuyerSummaryStore);
  private toaster = inject(ToasterService);
  favorites = inject(SearchV2FavoritesStore);

  isBuyerFavorite(r: ResultCardData) { return !!r.companyId && this.favorites.has('buyer', r.companyId); }
  toggleBuyerFavorite(r: ResultCardData) {
    if (!r.companyId) return;
    this.favorites.toggle({ kind: 'buyer', id: r.companyId, buyer: r });
  }

  pendingCreateIdx = signal<number | null>(null);
  pendingCompanyName = computed(() => {
    const idx = this.pendingCreateIdx();
    return idx === null ? '' : (this.results()[idx]?.name ?? '');
  });
  addCompany(r: ResultCardData) { this.pendingCreateIdx.set(this.results().indexOf(r)); }
  cancelCreate() { this.pendingCreateIdx.set(null); }

  confirmCreate() {
    const idx = this.pendingCreateIdx();
    if (idx === null || idx < 0) return;
    const id = Math.floor(Math.random() * 1e9).toString();
    let created: ResultCardData | undefined;
    this.results.update(list => list.map((r, i) => {
      if (i !== idx) return r;
      created = { ...r, exists: true, companyId: id };
      return created;
    }));
    if (created) {
      this.buyerStore.set({ name: created.name, companyId: id, city: created.city, address: created.address }, false);
      this.toaster.show('Company created', { tone: 'success', title: 'Success' });
    }
    this.pendingCreateIdx.set(null);
    this.router.navigate(['/buyer-summary', id]);
  }

  openResult(r: ResultCardData) {
    if (!r.companyId) return;
    this.buyerStore.set({ name: r.name, companyId: r.companyId, city: r.city, address: r.address });
    this.router.navigate(['/buyer-summary', r.companyId]);
  }

  showCreateWizard = signal(false);
  openManualCreate()  { this.showCreateWizard.set(true); }
  closeManualCreate() { this.showCreateWizard.set(false); }

  // ── Actions policies ────────────────────────────────────────────────────
  viewedPolicies = inject(SearchV2ViewedStore);

  isPolicyFavorite(p: PolicyResultData) { return this.favorites.has('policy', p.id); }
  togglePolicyFavorite(p: PolicyResultData) { this.favorites.toggle({ kind: 'policy', id: p.id, policy: p }); }

  /** Pas encore de page Police : on le dit, et la police entre dans Recently viewed. */
  openPolicy(p: PolicyResultData) {
    this.viewedPolicies.record(p);
    this.toaster.show('Policy page coming soon', { tone: 'info', title: 'Not available yet' });
  }

  // ── Onglets ─────────────────────────────────────────────────────────────
  viewedBuyers = inject(ViewedBuyersStore);

  setTab(t: TabId) {
    this.activeTab.set(t);
    this.expandedKey.set(null);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  recentsCount = computed(() => this.recentsStore.entries().length);
  viewedCount = computed(() => this.viewedBuyers.entries().length + this.viewedPolicies.entries().length);
  favoritesCount = computed(() => this.favorites.entries().length);

  // ── Historiques : filtre partagé All / Buyers / Policies ───────────────
  historyFilter = signal<HistoryFilter>('all');
  setHistoryFilter(v: string) {
    this.historyFilter.set(v === 'buyer' || v === 'policy' ? v : 'all');
    this.expandedKey.set(null);
  }

  /** Un buyer consulté se lit dans sa carte de résultat (copie de la règle V1). */
  private buyerCard(companyId: string, fallback: ResultCardData): ResultCardData {
    return this.results().find(r => r.companyId === companyId) ?? fallback;
  }

  viewedItems = computed(() => [
    ...this.viewedBuyers.entries().map(b => ({
      kind: 'buyer' as const, ts: b.ts, id: b.companyId ?? '',
      buyer: this.buyerCard(b.companyId ?? '', { name: b.name, city: b.city, address: b.address ?? '', companyId: b.companyId, exists: true }),
    })),
    ...this.viewedPolicies.entries().map(v => ({ kind: 'policy' as const, ts: v.ts, id: v.id, policy: v.policy })),
  ]);

  private tabItems = computed<{ kind: HistoryKind; ts: number }[]>(() => {
    switch (this.activeTab()) {
      case 'searched':  return this.recentsStore.entries();
      case 'viewed':    return this.viewedItems();
      case 'favorites': return this.favorites.entries();
      default:          return [];
    }
  });

  historyCounts = computed(() => countByKind(this.tabItems()));

  historyOptions = computed<{ value: HistoryFilter; label: string }[]>(() => {
    const c = this.historyCounts();
    return [
      { value: 'all',    label: `All (${c.all})` },
      { value: 'buyer',  label: `Buyers (${c.buyer})` },
      { value: 'policy', label: `Policies (${c.policy})` },
    ];
  });

  shownRecents   = computed(() => filterHistory(this.recentsStore.entries(), this.historyFilter()));
  shownViewed    = computed(() => filterHistory(this.viewedItems(), this.historyFilter()));
  shownFavorites = computed(() => filterHistory(this.favorites.entries(), this.historyFilter()));


  historyClearLabel = computed(() => clearLabel(this.historyFilter()));
  historyEmpty(tab: HistoryTab) { return emptyLabel(tab, this.historyFilter()); }

  /** Date des cartes Recently viewed : "Viewed yesterday", l'instant exact en infobulle. */
  viewedDate(ts: number) { return historyDate('Viewed', ts, Date.now()); }
  exactDate(ts: number) { return fullDate(ts); }
  isoDate(ts: number) { return new Date(ts).toISOString(); }

  historyShownCount = computed(() => this.historyCounts()[this.historyFilter()]);

  /** Clear n'efface que ce qui est affiché. */
  clearHistory() {
    const f = this.historyFilter();
    const kind = f === 'all' ? undefined : f;
    switch (this.activeTab()) {
      case 'searched':
        this.recentsStore.clear(kind);
        break;
      case 'viewed':
        if (kind !== 'policy') this.viewedBuyers.clear();
        if (kind !== 'buyer') this.viewedPolicies.clear();
        break;
      case 'favorites':
        this.favorites.clear(kind);
        break;
    }
  }
}
