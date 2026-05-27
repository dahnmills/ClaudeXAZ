import { Component, computed, signal } from '@angular/core';
import type { SortDirection } from '../../shared/ui/table/cell-header.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CellComponent } from '../../shared/ui/table/cell.component';
import { CellHeaderComponent } from '../../shared/ui/table/cell-header.component';
import { CellSelectionComponent } from '../../shared/ui/table/cell-selection.component';
import {
  FilterDefinition,
  FilterDrawerComponent,
  FilterDrawerTab,
  FilterValue,
  SavedFilter,
} from '../../shared/ui/filter-drawer/filter-drawer.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { SelectComponent, SelectOption } from '../../shared/ui/select/select.component';
import { TableRowComponent } from '../../shared/ui/table/table-row.component';
import { TopboxTestShellComponent } from '../topbox/topbox-test-shell.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { BreadcrumbsComponent } from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent } from '../../shared/ui/crumb/crumb.component';
import { PageTitleComponent } from '../../shared/ui/page-title/page-title.component';
import { TabComponent } from '../../shared/ui/tab/tab.component';
import { COMPANIES, Company, TRADE_SECTOR_COLOR_MAP } from './companies.mock';
import { filterCompanies, formatMoney } from './filters-predicate';

type SortColumn =
  | 'company'
  | 'nationalId'
  | 'sector'
  | 'bu'
  | 'grade'
  | 'turnover'
  | 'sensitivity'
  | 'status';

const GRADE_ORDER = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'NA'];
const SENSITIVITY_ORDER = ['S0', 'S1', 'S2P', 'SN'];

@Component({
  selector: 'app-filters-test-page',
  standalone: true,
  imports: [
    BadgeComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    CellComponent,
    CellHeaderComponent,
    CellSelectionComponent,
    CrumbComponent,
    FilterDrawerComponent,
    IconComponent,
    PageHeaderComponent,
    PageTitleComponent,
    SelectComponent,
    TabComponent,
    TableRowComponent,
    TopboxTestShellComponent,
  ],
  templateUrl: './filters-test-page.component.html',
  styleUrl: './filters-test-page.component.scss',
})
export class FiltersTestPageComponent {
  drawerOpen = signal(false);
  currentTab = signal<FilterDrawerTab>('current');
  checked = signal<Record<string, boolean>>({});
  activeSavedFilterId = signal<string | null>(null);
  sortKey = signal<SortColumn | null>(null);
  sortDir = signal<SortDirection>(null);
  savedFilterOptions = computed<SelectOption[]>(() =>
    this.savedFilters().map((f) => ({ value: f.id, label: f.name })),
  );

  appliedFilters = signal<Record<string, FilterValue>>({
    companyId: '',
    grade: ['2', '5'],
    sensitivity: ['S1', 'SN'],
  });

  currentFilters = signal<Record<string, FilterValue>>({
    companyId: '',
    grade: ['2', '5'],
    sensitivity: ['S1', 'SN'],
  });

  savedFilters = signal<SavedFilter[]>([
    {
      id: 'saved-1',
      name: 'High-risk EU banking',
      filters: { tradeSectorColor: ['1'], businessUnits: ['France', 'Germany'], grade: ['2'] },
      createdAt: new Date('2026-04-15T09:00:00'),
    },
    {
      id: 'saved-2',
      name: 'Closed accounts FY25',
      filters: { status: ['closed'] },
      createdAt: new Date('2026-05-01T11:30:00'),
    },
  ]);

  filteredCompanies = computed<Company[]>(() => filterCompanies(COMPANIES, this.appliedFilters()));

  sortedCompanies = computed<Company[]>(() => {
    const rows = this.filteredCompanies();
    const key = this.sortKey();
    const dir = this.sortDir();
    if (!key || !dir) return rows;
    const sorted = [...rows].sort((a, b) => this.compareCompanies(a, b, key));
    return dir === 'asc' ? sorted : sorted.reverse();
  });

  activeFiltersCount = computed(() => {
    const filters = this.appliedFilters();
    return Object.keys(filters).filter((key) => this.isActiveValue(filters[key])).length;
  });

  filters: FilterDefinition[] = [
    {
      id: 'companyId',
      label: 'Company ID',
      type: 'text',
      defaultOpen: true,
      placeholder: 'Search company ID',
    },
    {
      id: 'nationalId',
      label: 'National ID',
      type: 'composite-id',
      defaultOpen: true,
      placeholder: '123123',
      idTypes: [
        { value: 'siren', label: 'SIREN' },
        { value: 'siret', label: 'SIRET' },
        { value: 'rcs', label: 'RCS' },
      ],
    },
    {
      id: 'tradeSectorColor',
      label: 'Trade sector color',
      type: 'checkbox-list',
      defaultOpen: true,
      columns: 2,
      options: [
        { value: '1', label: '1', color: '#2a8c33' },
        { value: '2', label: '2', color: '#5cb260' },
        { value: '3', label: '3', color: '#008ED6' },
        { value: '4', label: '4', color: '#f5c400' },
        { value: 'NA', label: 'NA', color: '#9aa0a6' },
      ],
    },
    {
      id: 'tradeSectorFamily',
      label: 'Trade sector family',
      type: 'search-chips',
      defaultOpen: true,
      placeholder: 'Search for trade sector family',
      options: [
        { value: 'automotive', label: 'Automotive' },
        { value: 'banking', label: 'Banking' },
        { value: 'retail', label: 'Retail' },
        { value: 'construction', label: 'Construction' },
        { value: 'food', label: 'Food' },
        { value: 'pharmaceutics', label: 'Pharmaceutics' },
        { value: 'energy', label: 'Energy' },
        { value: 'technology', label: 'Technology' },
        { value: 'textile', label: 'Textile' },
        { value: 'cosmetics', label: 'Cosmetics' },
        { value: 'aerospace', label: 'Aerospace' },
        { value: 'mining', label: 'Mining' },
        { value: 'hospitality', label: 'Hospitality' },
        { value: 'transport', label: 'Transport' },
        { value: 'trading', label: 'Trading' },
        { value: 'metallurgy', label: 'Metallurgy' },
      ],
    },
    {
      id: 'businessUnits',
      label: 'Business units',
      type: 'tree',
      defaultOpen: true,
      placeholder: 'Search for a business unit',
      tree: [
        {
          value: 'AMER',
          label: 'AMER',
          children: [
            { value: 'USA', label: 'USA' },
            { value: 'Canada', label: 'Canada' },
          ],
        },
        {
          value: 'EMEA',
          label: 'EMEA',
          children: [
            { value: 'France', label: 'France' },
            { value: 'Germany', label: 'Germany' },
          ],
        },
        {
          value: 'APAC',
          label: 'APAC',
          children: [
            { value: 'Japan', label: 'Japan' },
            { value: 'Singapore', label: 'Singapore' },
          ],
        },
      ],
    },
    {
      id: 'grade',
      label: 'Grade',
      type: 'button-range',
      rangeMode: 'range',
      defaultOpen: true,
      helperText: 'Select a grade or range',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '10', label: '10' },
        { value: 'NA', label: 'NA' },
      ],
      appendedFilters: [
        { id: 'grade.acceptor', label: 'Acceptor', type: 'checkbox' },
        { id: 'grade.source', label: 'Source', type: 'checkbox' },
      ],
    },
    {
      id: 'financials',
      label: 'Financials',
      type: 'group',
      defaultOpen: true,
      children: [
        {
          id: 'financials.turnover',
          label: 'Turnover',
          type: 'range-currency',
          rangeMode: 'single',
          currencySymbol: '€',
          options: [
            { value: '<1M', label: '<1M', from: null, to: 999_999 },
            { value: '1M-10M', label: '1M-10M', from: 1_000_000, to: 10_000_000 },
            { value: '10M-100M', label: '10M-100M', from: 10_000_000, to: 100_000_000 },
            { value: '>100M', label: '>100M', from: 100_000_000, to: null },
          ],
        },
        {
          id: 'financials.operationProfit',
          label: 'Operation profit',
          type: 'range-currency',
          rangeMode: 'single',
          currencySymbol: '€',
          options: [
            { value: '<1M', label: '<1M', from: null, to: 999_999 },
            { value: '1M-10M', label: '1M-10M', from: 1_000_000, to: 10_000_000 },
            { value: '10M-100M', label: '10M-100M', from: 10_000_000, to: 100_000_000 },
            { value: '>100M', label: '>100M', from: 100_000_000, to: null },
          ],
        },
        {
          id: 'financials.shareholderFunds',
          label: 'Shareholder funds',
          type: 'range-currency',
          rangeMode: 'single',
          currencySymbol: '€',
          options: [
            { value: '<1M', label: '<1M', from: null, to: 999_999 },
            { value: '1M-10M', label: '1M-10M', from: 1_000_000, to: 10_000_000 },
            { value: '10M-100M', label: '10M-100M', from: 10_000_000, to: 100_000_000 },
            { value: '>100M', label: '>100M', from: 100_000_000, to: null },
          ],
        },
        {
          id: 'financials.totalAssets',
          label: 'Total assets',
          type: 'range-currency',
          rangeMode: 'single',
          currencySymbol: '€',
          options: [
            { value: '<1M', label: '<1M', from: null, to: 999_999 },
            { value: '1M-10M', label: '1M-10M', from: 1_000_000, to: 10_000_000 },
            { value: '10M-100M', label: '10M-100M', from: 10_000_000, to: 100_000_000 },
            { value: '>100M', label: '>100M', from: 100_000_000, to: null },
          ],
        },
      ],
    },
    {
      id: 'sensitivity',
      label: 'Sensitivity',
      type: 'button-range',
      rangeMode: 'range',
      defaultOpen: true,
      helperText: 'Select one or a range',
      options: [
        { value: 'S0', label: 'S0' },
        { value: 'S1', label: 'S1' },
        { value: 'S2P', label: 'S2P' },
        { value: 'SN', label: 'SN' },
      ],
    },
    {
      id: 'sruInsured',
      label: 'SRU / Insured',
      type: 'checkbox-list',
      defaultOpen: true,
      options: [
        { value: 'sru', label: 'SRU' },
        { value: 'insured', label: 'Insured' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox-list',
      defaultOpen: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'closed', label: 'Closed' },
      ],
    },
  ];

  openDrawer(): void {
    this.currentFilters.set({ ...this.appliedFilters() });
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  onApplied(filters: Record<string, FilterValue>): void {
    this.currentFilters.set(filters);
    this.appliedFilters.set({ ...filters });
    this.activeSavedFilterId.set(null);
    this.drawerOpen.set(false);
  }

  onSavedFilterApplied(filter: SavedFilter): void {
    this.appliedFilters.set({ ...filter.filters });
    this.activeSavedFilterId.set(filter.id);
    this.drawerOpen.set(false);
  }

  onSavedFilterCreated(filter: SavedFilter): void {
    this.activeSavedFilterId.set(filter.id);
    this.currentFilters.set({ ...filter.filters });
    this.appliedFilters.set({ ...filter.filters });
  }

  onSavedSelectChange(filterId: string): void {
    const filter = this.savedFilters().find((f) => f.id === filterId);
    if (!filter) return;
    this.currentFilters.set({ ...filter.filters });
    this.appliedFilters.set({ ...filter.filters });
    this.activeSavedFilterId.set(filter.id);
  }

  formatMoney = formatMoney;

  cycleSort(key: SortColumn): void {
    if (this.sortKey() !== key) {
      this.sortKey.set(key);
      this.sortDir.set('asc');
      return;
    }
    const dir = this.sortDir();
    if (dir === 'asc') this.sortDir.set('desc');
    else if (dir === 'desc') { this.sortKey.set(null); this.sortDir.set(null); }
    else this.sortDir.set('asc');
  }

  sortDirFor(key: SortColumn): SortDirection {
    return this.sortKey() === key ? this.sortDir() : null;
  }

  private compareCompanies(a: Company, b: Company, key: SortColumn): number {
    switch (key) {
      case 'company':     return a.name.localeCompare(b.name);
      case 'nationalId':  return a.nationalId.localeCompare(b.nationalId);
      case 'sector':      return a.tradeSectorFamily.localeCompare(b.tradeSectorFamily);
      case 'bu':          return a.businessUnit.localeCompare(b.businessUnit);
      case 'grade':       return GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade);
      case 'turnover':    return a.turnover - b.turnover;
      case 'sensitivity': return SENSITIVITY_ORDER.indexOf(a.sensitivity) - SENSITIVITY_ORDER.indexOf(b.sensitivity);
      case 'status':      return a.status.localeCompare(b.status);
    }
  }

  idTypeLabel(type: Company['nationalIdType']): string {
    switch (type) {
      case 'siren': return 'SIREN';
      case 'siret': return 'SIRET';
      case 'rcs':   return 'RCS';
    }
  }

  tradeSectorBadge(row: Company) {
    return TRADE_SECTOR_COLOR_MAP[row.tradeSectorColor];
  }

  toggleAll(rows: Company[], selectAll: boolean): void {
    this.checked.set(
      selectAll
        ? rows.reduce<Record<string, boolean>>((acc, r) => ((acc[r.id] = true), acc), {})
        : {},
    );
  }

  toggleRow(id: string, value: boolean): void {
    this.checked.set({ ...this.checked(), [id]: value });
  }

  countChecked(): number {
    return Object.values(this.checked()).filter(Boolean).length;
  }

  private isActiveValue(value: FilterValue): boolean {
    if (value === null || value === undefined || value === '' || value === false) return false;
    if (Array.isArray(value)) {
      if (value.length === 2 && (typeof value[0] === 'number' || value[0] === null) && (typeof value[1] === 'number' || value[1] === null)) {
        return value[0] !== null || value[1] !== null;
      }
      return value.length > 0;
    }
    if (typeof value === 'object') {
      return Object.values(value).some((v) => this.isActiveValue(v as FilterValue));
    }
    return true;
  }
}
