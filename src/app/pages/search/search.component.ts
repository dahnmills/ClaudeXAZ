import { Component, computed, input, signal } from '@angular/core';
import {
  HeaderComponent,
  SideNavComponent,
  SideNavItemComponent,
  PageHeaderComponent,
  BreadcrumbsComponent,
  CrumbComponent,
  TabComponent,
  IconComponent,
  LogoComponent,
  ButtonIconComponent,
  ModalComponent,
} from '../../shared/ui';
import { SearchBarMultiComponent, type SearchType } from '../../shared/ui/search-bar-multi/search-bar-multi.component';
import { MoreCriteriaComponent } from '../../shared/ui/more-criteria/more-criteria.component';
import { ResultCardComponent, type ResultCardData } from '../../shared/ui/result-card/result-card.component';

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
];

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    HeaderComponent,
    SideNavComponent,
    SideNavItemComponent,
    PageHeaderComponent,
    BreadcrumbsComponent,
    CrumbComponent,
    TabComponent,
    IconComponent,
    LogoComponent,
    ButtonIconComponent,
    SearchBarMultiComponent,
    MoreCriteriaComponent,
    ResultCardComponent,
    ModalComponent,
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

  results = signal<ResultCardData[]>(SEED_RESULTS);
  hasSearched = signal<boolean>(false);

  favoriteIds = signal<Set<number>>(new Set());
  recents = signal<RecentEntry[]>([]);

  isResults = computed(() => this.hasSearched() || this.state() === 'results');

  visibleResults = computed(() => {
    const all = this.results();
    if (this.activeTab() === 'favorites') {
      const favs = this.favoriteIds();
      return all.map((r, i) => ({ r, i })).filter(x => favs.has(x.i));
    }
    return all.map((r, i) => ({ r, i }));
  });

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

  showCreateModal = signal<boolean>(false);

  addCompany(_idx: number) {
    this.showCreateModal.set(true);
  }
  closeCreateModal() { this.showCreateModal.set(false); }

  private genId(): string {
    return Math.floor(Math.random() * 1e9).toString();
  }

  setTab(t: TabId) {
    this.activeTab.set(t);
    this.expandedIdx.set(null);
  }

  runSearch() {
    this.hasSearched.set(true);
    const q = this.searchQuery().trim();
    if (q) {
      this.recents.update(r => [{ type: this.searchType(), query: q, ts: Date.now() }, ...r].slice(0, 10));
    }
    this.activeTab.set('search');
  }

  pickRecent(entry: RecentEntry) {
    this.searchType.set(entry.type);
    this.searchQuery.set(entry.query);
    this.activeTab.set('search');
    this.hasSearched.set(true);
  }

  clearRecents() { this.recents.set([]); }

  favoritesCount = computed(() => this.favoriteIds().size);
  recentsCount = computed(() => this.recents().length);

  formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
