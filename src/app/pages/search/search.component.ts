import { Component, computed, inject, input, signal, viewChild, type ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  PageHeaderComponent,
  BreadcrumbsComponent,
  CrumbComponent,
  TabComponent,
  IconComponent,
  ConfirmDialogComponent,
  ButtonComponent,
  SpinnerComponent,
} from '../../shared/ui';
import { SearchBarMultiComponent, type SearchType } from '../../shared/ui/search-bar-multi/search-bar-multi.component';
import { MoreCriteriaComponent } from '../../shared/ui/more-criteria/more-criteria.component';
import { ResultCardComponent, type ResultCardData } from '../../shared/ui/result-card/result-card.component';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { BuyerSummaryStore } from '../buyer-summary/buyer-summary.store';
import { CompanyCreationWizardComponent } from './company-creation-wizard/company-creation-wizard.component';

type TabId = 'search' | 'recent' | 'favorites';

interface RecentEntry {
  type: SearchType;
  query: string;
  ts: number;
}

const SEED_RESULTS: ResultCardData[] = [
  {
    name: 'Immobilière du Marais',
    city: 'BHV',
    address: '34 RUE DE LA VERRIÈRE - 75004 - PARIS 4 - FRANCE',
    companyId: '137381425',
    score: 0.6,
    exists: true,
    general: [
      { label: 'Trade sector', value: 'REAL PROPERTY LESSOR,NEC' },
      { label: 'Legal form', value: 'OTHER' },
      { label: 'States', value: 'Active' },
    ],
    financial: [{ label: 'Turnover amount', value: '$948 000' }],
    localIds: [
      { label: 'DUN', value: '126546151' },
      { label: 'TVAFR', value: 'FR1184841153' },
      { label: 'SIREN', value: '8114445221' },
      { label: 'SIRET', value: '811444522211154' },
      { label: 'Info provider', value: 'DNB' },
    ],
    providers: ['EH', 'DNB'],
  },
  {
    name: 'Immobilière du Marais',
    city: 'BHV',
    address: '34 RUE DE LA VERRIÈRE - 75004 - PARIS 4 - FRANCE',
    companyId: '137381425',
    score: 0.6,
    exists: true,
  },
  {
    name: 'Marais Properties Group',
    address: '12 RUE DES ARCHIVES - 75004 - PARIS 4 - FRANCE',
    score: 0.45,
    exists: false,
    general: [
      { label: 'Trade sector', value: 'REAL PROPERTY LESSOR,NEC' },
      { label: 'Legal form', value: 'OTHER' },
      { label: 'States', value: 'Active' },
    ],
    financial: [{ label: 'Turnover amount', value: '$420 000' }],
    localIds: [
      { label: 'DUN', value: '126546152' },
      { label: 'SIREN', value: '8114445222' },
    ],
    providers: ['DNB'],
  },
  {
    name: 'Le Marais SARL',
    address: '4 RUE DES ROSIERS - 75004 - PARIS 4 - FRANCE',
    score: 0.32,
    exists: false,
  },
  { name: 'Boucherie Centrale du Marais', city: 'Paris', address: '8 RUE VIEILLE DU TEMPLE - 75004 - PARIS 4 - FRANCE', companyId: '204558719', score: 0.88, exists: true,
    general: [{ label: 'Trade sector', value: 'FOOD RETAIL' }, { label: 'Legal form', value: 'SARL' }, { label: 'States', value: 'Active' }],
    financial: [{ label: 'Turnover amount', value: '$1 240 000' }],
    localIds: [{ label: 'SIREN', value: '204558719' }, { label: 'TVAFR', value: 'FR40204558719' }],
    providers: ['EH', 'DNB'] },
  { name: 'Atelier Verrière Design', address: '17 RUE CHARLOT - 75003 - PARIS 3 - FRANCE', score: 0.27, exists: false },
  { name: 'Nordsee Logistik GmbH', city: 'Hamburg', address: 'GROSSE ELBSTRASSE 45 - 22767 - HAMBURG - GERMANY', companyId: '551023884', score: 0.74, exists: true,
    general: [{ label: 'Trade sector', value: 'FREIGHT TRANSPORT' }, { label: 'Legal form', value: 'GMBH' }, { label: 'States', value: 'Active' }],
    financial: [{ label: 'Turnover amount', value: '€8 900 000' }],
    localIds: [{ label: 'DUN', value: '315002884' }, { label: 'Info provider', value: 'DNB' }], providers: ['DNB'] },
  { name: 'Iberia Cafés y Tostados SL', city: 'Madrid', address: 'CALLE DE ALCALÁ 120 - 28009 - MADRID - SPAIN', score: 0.41, exists: false },
  { name: 'Northwind Trading Ltd', city: 'London', address: '221B BAKER STREET - NW1 6XE - LONDON - UNITED KINGDOM', companyId: '693118250', score: 0.69, exists: true,
    general: [{ label: 'Trade sector', value: 'WHOLESALE' }, { label: 'Legal form', value: 'LTD' }, { label: 'States', value: 'Active' }],
    localIds: [{ label: 'CRN', value: '06931182' }], providers: ['EH'] },
  { name: 'Verde Agricoltura SpA', city: 'Bologna', address: 'VIA EMILIA 230 - 40139 - BOLOGNA - ITALY', score: 0.36, exists: false },
  { name: 'Marais Immobilier Conseil', city: 'Paris', address: '12 RUE DE TURENNE - 75004 - PARIS 4 - FRANCE', companyId: '118994372', score: 0.81, exists: true,
    general: [{ label: 'Trade sector', value: 'REAL ESTATE' }, { label: 'Legal form', value: 'SAS' }, { label: 'States', value: 'Active' }],
    financial: [{ label: 'Turnover amount', value: '€2 400 000' }],
    localIds: [{ label: 'SIREN', value: '118994372' }, { label: 'TVAFR', value: 'FR40118994372' }], providers: ['EH'] },
  { name: 'Aurora Solar Solutions BV', city: 'Amsterdam', address: 'HERENGRACHT 88 - 1015 - AMSTERDAM - NETHERLANDS', score: 0.22, exists: false },
  { name: 'Stahlbau Müller AG', city: 'Zürich', address: 'BAHNHOFSTRASSE 14 - 8001 - ZÜRICH - SWITZERLAND', companyId: '770042913', score: 0.63, exists: true,
    financial: [{ label: 'Turnover amount', value: 'CHF 14 200 000' }], providers: ['DNB', 'EH'] },
  { name: 'Le Petit Comptoir SAS', address: '3 RUE DE BRETAGNE - 75003 - PARIS 3 - FRANCE', score: 0.18, exists: false },
  { name: 'Atlantic Seafood Imports Inc', city: 'Boston', address: '88 SEAPORT BLVD - 02210 - BOSTON MA - USA', companyId: '900215674', score: 0.77, exists: true,
    general: [{ label: 'Trade sector', value: 'SEAFOOD IMPORT' }, { label: 'Legal form', value: 'INC' }, { label: 'States', value: 'Active' }], providers: ['DNB'] },
  { name: 'Lumière Studio Créatif', city: 'Lyon', address: '45 RUE DE LA RÉPUBLIQUE - 69002 - LYON - FRANCE', score: 0.31, exists: false },
  { name: 'Polaris Tech Nordic AB', city: 'Stockholm', address: 'KUNGSGATAN 32 - 11135 - STOCKHOLM - SWEDEN', companyId: '556677001', score: 0.58, exists: true,
    general: [{ label: 'Trade sector', value: 'SOFTWARE & IT SERVICES' }, { label: 'Legal form', value: 'AB' }, { label: 'States', value: 'Active' }],
    financial: [{ label: 'Turnover amount', value: 'SEK 32 000 000' }],
    localIds: [{ label: 'ORG', value: '556677-0015' }], providers: ['DNB'] },
  { name: 'Café des Archives', address: '21 RUE DES ARCHIVES - 75004 - PARIS 4 - FRANCE', score: 0.44, exists: false },
  { name: 'Galaxy Pharma Distribution', city: 'Dublin', address: '5 GRAND CANAL SQUARE - D02 - DUBLIN - IRELAND', companyId: '482290117', score: 0.7, exists: true,
    financial: [{ label: 'Turnover amount', value: '€3 100 000' }], localIds: [{ label: 'CRO', value: '482290' }], providers: ['EH'] },
  { name: 'Bois & Matières Premières', city: 'Bordeaux', address: '9 QUAI DES CHARTRONS - 33000 - BORDEAUX - FRANCE', score: 0.25, exists: false },
  { name: 'Helvetia Watch Components', city: 'Genève', address: 'RUE DU RHÔNE 62 - 1204 - GENÈVE - SWITZERLAND', companyId: '661120945', score: 0.85, exists: true,
    general: [{ label: 'Trade sector', value: 'PRECISION COMPONENTS' }, { label: 'Legal form', value: 'SA' }], providers: ['DNB', 'EH'] },
  { name: 'Mistral Énergie Renouvelable', city: 'Marseille', address: '14 LA CANEBIÈRE - 13001 - MARSEILLE - FRANCE', score: 0.39, exists: false },
  { name: 'Brooklyn Craft Goods LLC', city: 'New York', address: '55 WATER STREET - 11201 - BROOKLYN NY - USA', companyId: '300558142', score: 0.66, exists: true,
    general: [{ label: 'Trade sector', value: 'WHOLESALE TRADE' }, { label: 'Legal form', value: 'LLC' }, { label: 'States', value: 'Active' }],
    financial: [{ label: 'Turnover amount', value: '$5 700 000' }],
    localIds: [{ label: 'DUN', value: '300558142' }, { label: 'EIN', value: '83-1204412' }], providers: ['DNB'] },
  { name: 'Verrière & Fils Menuiserie', address: '34 RUE DE LA VERRIÈRE - 75004 - PARIS 4 - FRANCE', score: 0.29, exists: false },
  { name: 'Danube Textiles Kft', city: 'Budapest', address: 'VÁCI ÚT 178 - 1138 - BUDAPEST - HUNGARY', companyId: '128840073', score: 0.52, exists: true,
    general: [{ label: 'Trade sector', value: 'TEXTILE MANUFACTURING' }, { label: 'Legal form', value: 'KFT' }, { label: 'States', value: 'Active' }],
    financial: [{ label: 'Turnover amount', value: 'HUF 890 000 000' }],
    localIds: [{ label: 'HU-REG', value: '01-09-128840' }], providers: ['EH'] },
];

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    TopboxTestShellComponent,
    PageHeaderComponent,
    BreadcrumbsComponent,
    CrumbComponent,
    TabComponent,
    IconComponent,
    SearchBarMultiComponent,
    MoreCriteriaComponent,
    ResultCardComponent,
    ConfirmDialogComponent,
    ButtonComponent,
    SpinnerComponent,
    CompanyCreationWizardComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  state = input<'default' | 'results'>('default');

  activeTab = signal<TabId>('search');
  showMoreCriteria = signal<boolean>(false);
  criteriaCount = signal<number>(0);
  expandedIdx = signal<number | null>(null);

  searchType = signal<SearchType>('company-id');
  searchQuery = signal<string>('');
  /** Requête réellement appliquée (figée au clic Search — pas à la volée). */
  appliedQuery = signal<string>('');

  results = signal<ResultCardData[]>(SEED_RESULTS);
  hasSearched = signal<boolean>(false);

  favoriteIds = signal<Set<number>>(new Set());
  recents = signal<RecentEntry[]>([]);

  isResults = computed(() => this.hasSearched() || this.state() === 'results');

  // ── Chargement progressif (infinite scroll) ────────────────────────────
  private readonly PAGE_SIZE = 6;
  visibleCount = signal<number>(this.PAGE_SIZE);
  loadingMore  = signal<boolean>(false);

  private indexed = computed(() => this.results().map((r, i) => ({ r, i })));

  /** Résultats filtrés par la requête (indices d'origine conservés). */
  filtered = computed(() => {
    const q = this.appliedQuery();
    if (!q) return this.indexed();
    return this.indexed().filter(x =>
      x.r.name.toLowerCase().includes(q) || (x.r.companyId ?? '').includes(q),
    );
  });

  /** Résultats visibles de l'onglet Search (tranche selon visibleCount). */
  visibleResults = computed(() => this.filtered().slice(0, this.visibleCount()));

  /** Favoris : tous (pas de pagination). */
  favoriteResults = computed(() => {
    const favs = this.favoriteIds();
    return this.indexed().filter(x => favs.has(x.i));
  });

  allLoaded = computed(() => this.visibleCount() >= this.filtered().length);

  /** Aucun résultat après une recherche (≠ état initial avant recherche). */
  noResults = computed(() => this.isResults() && this.filtered().length === 0);

  scrollHost = viewChild<ElementRef<HTMLElement>>('scrollHost');

  loadMore() {
    if (this.loadingMore() || this.allLoaded()) return;
    this.loadingMore.set(true);
    setTimeout(() => {
      this.visibleCount.update(n => Math.min(n + this.PAGE_SIZE, this.filtered().length));
      this.loadingMore.set(false);
      this.maybeFill();
    }, 500);
  }

  onScroll(e: Event) {
    const el = e.target as HTMLElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 160) this.loadMore();
  }

  /** Charge encore tant que le conteneur n'est pas scrollable (sinon le scroll
   *  ne se déclenche jamais et on reste bloqué sur la première page). */
  private maybeFill() {
    const el = this.scrollHost()?.nativeElement;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight + 4 && !this.allLoaded() && !this.loadingMore()) {
      this.loadMore();
    }
  }

  toggleCard(idx: number) {
    this.expandedIdx.set(this.expandedIdx() === idx ? null : idx);
  }

  toggleMoreCriteria() {
    this.showMoreCriteria.update(v => !v);
  }

  toggleFavorite(idx: number) {
    this.favoriteIds.update(s => {
      const next = new Set(s);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  isFavorite(idx: number) {
    return this.favoriteIds().has(idx);
  }

  private router = inject(Router);
  private buyerStore = inject(BuyerSummaryStore);

  /** Index du résultat en attente de confirmation de création (null = popin fermée). */
  pendingCreateIdx = signal<number | null>(null);

  pendingCompanyName = computed(() => {
    const idx = this.pendingCreateIdx();
    return idx === null ? '' : (this.results()[idx]?.name ?? '');
  });

  addCompany(idx: number) {
    this.pendingCreateIdx.set(idx);
  }

  cancelCreate() {
    this.pendingCreateIdx.set(null);
  }

  confirmCreate() {
    const idx = this.pendingCreateIdx();
    if (idx === null) return;

    const id = this.genId();
    let created: ResultCardData | undefined;

    // Mutation à la volée : le résultat devient "existant" (badge ID au retour).
    this.results.update(list =>
      list.map((r, i) => {
        if (i !== idx) return r;
        created = { ...r, exists: true, companyId: id };
        return created;
      }),
    );

    if (created) {
      this.buyerStore.set(
        { name: created.name, companyId: id, city: created.city, address: created.address },
        true,
      );
    }

    this.pendingCreateIdx.set(null);
    this.router.navigate(['/buyer-summary', id]);
  }

  private genId(): string {
    return Math.floor(Math.random() * 1e9).toString();
  }

  // ── Création manuelle (wizard multi-étapes) ────────────────────────────
  showCreateWizard = signal<boolean>(false);
  openManualCreate()  { this.showCreateWizard.set(true); }
  closeManualCreate() { this.showCreateWizard.set(false); }

  setTab(t: TabId) {
    this.activeTab.set(t);
    this.expandedIdx.set(null);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  runSearch() {
    this.hasSearched.set(true);
    this.visibleCount.set(this.PAGE_SIZE);
    const q = this.searchQuery().trim();
    this.appliedQuery.set(q.toLowerCase());
    if (q) {
      this.recents.update(r => [{ type: this.searchType(), query: q, ts: Date.now() }, ...r].slice(0, 10));
    }
    this.activeTab.set('search');
    setTimeout(() => this.maybeFill());
  }

  pickRecent(entry: RecentEntry) {
    this.searchType.set(entry.type);
    this.searchQuery.set(entry.query);
    this.appliedQuery.set(entry.query.trim().toLowerCase());
    this.visibleCount.set(this.PAGE_SIZE);
    this.activeTab.set('search');
    this.hasSearched.set(true);
    setTimeout(() => this.maybeFill());
  }

  clearRecents() { this.recents.set([]); }

  favoritesCount = computed(() => this.favoriteIds().size);
  recentsCount = computed(() => this.recents().length);

  formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
