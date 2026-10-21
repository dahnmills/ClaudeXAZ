import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import {
  PageHeaderComponent,
  BreadcrumbsComponent,
  CrumbComponent,
  PageTitleComponent,
  TabComponent,
  LinkComponent,
  ButtonComponent,
  IconComponent,
  CheckboxComponent,
  SelectComponent,
  TableRowComponent,
  CellComponent,
  CellHeaderComponent,
  CellActionComponent,
  CellSelectionComponent,
  FlyoutMenuComponent,
  FlyoutMenuItemComponent,
} from '../../shared/ui';
import type { SelectOption } from '../../shared/ui/select/select.component';
import {
  FilterDrawerComponent,
  type FilterDefinition,
  type FilterDrawerTab,
  type FilterValue,
  type SavedFilter,
} from '../../shared/ui/filter-drawer/filter-drawer.component';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import {
  REJECTS,
  REJECT_COLUMNS,
  REJECT_TOTALS,
  type Reject,
  type RejectCategory,
  type RejectColumn,
} from './reject-management.data';

type RejectTab = 'all' | RejectCategory;

/** Valeurs distinctes d'une colonne, pour les cases du drawer. */
function optionsOf(key: 'bu' | 'idType' | 'country') {
  return [...new Set(REJECTS.map(r => r[key]))].sort().map(v => ({ value: v, label: v }));
}

/** Filtre texte : contient, sans casse ; vide = pas de filtre. */
function matchesText(value: string, filter: FilterValue | undefined): boolean {
  return typeof filter !== 'string' || !filter.trim() || value.toLowerCase().includes(filter.trim().toLowerCase());
}

/** Filtre à cases : une des valeurs cochées ; aucune case = pas de filtre. */
function inList(value: string, filter: FilterValue | undefined): boolean {
  return !Array.isArray(filter) || filter.length === 0 || (filter as string[]).includes(value);
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Reject Management (Figma Transverse 6001:1073). Rejets en tableau : un onglet
 * par catégorie, une barre d'actions (filtres, gestion des colonnes), sélection
 * de lignes, tri par colonne et menu d'actions par ligne.
 */
@Component({
  selector: 'app-reject-management',
  standalone: true,
  imports: [
    TopboxTestShellComponent,
    PageHeaderComponent,
    BreadcrumbsComponent,
    CrumbComponent,
    PageTitleComponent,
    TabComponent,
    LinkComponent,
    ButtonComponent,
    IconComponent,
    CheckboxComponent,
    SelectComponent,
    FilterDrawerComponent,
    TableRowComponent,
    CellComponent,
    CellHeaderComponent,
    CellActionComponent,
    CellSelectionComponent,
    FlyoutMenuComponent,
    FlyoutMenuItemComponent,
  ],
  templateUrl: './reject-management.component.html',
  styleUrl: './reject-management.component.scss',
})
export class RejectManagementComponent {
  private elRef = inject(ElementRef);

  readonly totals = REJECT_TOTALS;
  readonly tabs: { id: RejectTab; label: string }[] = [
    { id: 'all',         label: 'All rejects' },
    { id: 'functional',  label: 'Functional rejects' },
    { id: 'technical',   label: 'Technical rejects' },
    { id: 'maintenance', label: 'Maintenance rejects' },
  ];
  readonly activeTab = signal<RejectTab>('all');

  // ── Filtres : mécanique de la page Filters (filtres enregistrés dans le
  //    select, Filter ouvre le drawer) ──────────────────────────────────────────
  readonly drawerOpen = signal(false);
  readonly currentTab = signal<FilterDrawerTab>('current');
  readonly activeSavedFilterId = signal<string | null>(null);
  readonly appliedFilters = signal<Record<string, FilterValue>>({});
  readonly currentFilters = signal<Record<string, FilterValue>>({});

  readonly savedFilters = signal<SavedFilter[]>([
    { id: 'saved-cbnl', name: 'CBNL rejects', filters: { bu: ['CBNL'] }, createdAt: new Date('2026-07-20T09:00:00') },
    { id: 'saved-fr', name: 'French buyers', filters: { country: ['FR'] }, createdAt: new Date('2026-07-22T14:30:00') },
  ]);
  readonly savedFilterOptions = computed<SelectOption[]>(() =>
    this.savedFilters().map(f => ({ value: f.id, label: f.name })));

  readonly filters: FilterDefinition[] = [
    { id: 'type', label: 'Type', type: 'text', defaultOpen: true, placeholder: 'Search a reject type' },
    { id: 'buyerId', label: 'Buyer ID', type: 'text', defaultOpen: true, placeholder: 'Search a buyer ID' },
    { id: 'bu', label: 'BU', type: 'checkbox-list', defaultOpen: true, columns: 2, options: optionsOf('bu') },
    { id: 'idType', label: 'ID Type', type: 'checkbox-list', defaultOpen: true, columns: 2, options: optionsOf('idType') },
    { id: 'country', label: 'Country', type: 'checkbox-list', defaultOpen: true, columns: 2, options: optionsOf('country') },
  ];

  /** Nombre de filtres renseignés, affiché sur le bouton : « Filter (2) ». */
  readonly activeFiltersCount = computed(() =>
    Object.values(this.appliedFilters()).filter(v => Array.isArray(v) ? v.length > 0 : !!v).length);

  openDrawer(): void {
    this.currentFilters.set({ ...this.appliedFilters() });
    this.drawerOpen.set(true);
  }

  onApplied(filters: Record<string, FilterValue>): void {
    this.applyFilters(filters, null);
    this.drawerOpen.set(false);
  }

  onSavedFilterApplied(filter: SavedFilter): void {
    this.applyFilters(filter.filters, filter.id);
    this.drawerOpen.set(false);
  }

  onSavedFilterCreated(filter: SavedFilter): void {
    this.applyFilters(filter.filters, filter.id);
  }

  onSavedSelectChange(filterId: string): void {
    const filter = this.savedFilters().find(f => f.id === filterId);
    if (filter) this.applyFilters(filter.filters, filter.id);
  }

  private applyFilters(filters: Record<string, FilterValue>, savedId: string | null): void {
    this.currentFilters.set({ ...filters });
    this.appliedFilters.set({ ...filters });
    this.activeSavedFilterId.set(savedId);
    this.selectedIds.set([]);
  }

  // ── Colonnes ────────────────────────────────────────────────────────────────
  readonly columns = REJECT_COLUMNS;
  readonly hiddenColumns = signal<Set<RejectColumn>>(new Set());
  readonly columnsOpen = signal(false);
  readonly visibleColumns = computed(() => this.columns.filter(c => !this.hiddenColumns().has(c.key)));

  isShown(key: RejectColumn): boolean {
    return !this.hiddenColumns().has(key);
  }

  /** Une colonne au moins reste affichée : un tableau sans colonne ne dit plus rien. */
  toggleColumn(key: RejectColumn, shown: boolean): void {
    const next = new Set(this.hiddenColumns());
    if (shown) next.delete(key);
    else if (this.visibleColumns().length > 1) next.add(key);
    this.hiddenColumns.set(next);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.columnsOpen()) return;
    const panel = (this.elRef.nativeElement as HTMLElement).querySelector('.rm-columns');
    if (panel && !panel.contains(event.target as Node)) this.columnsOpen.set(false);
  }

  // ── Lignes : onglet, filtres, tri ─────────────────────────────────────────
  /** Aucun tri à l'arrivée (Figma) : les rejets dans l'ordre reçu. */
  readonly sortKey = signal<RejectColumn | null>(null);
  readonly sortDir = signal<'asc' | 'desc'>('asc');

  readonly rows = computed<Reject[]>(() => {
    const tab = this.activeTab();
    const f = this.appliedFilters();
    const key = this.sortKey();
    const way = this.sortDir() === 'asc' ? 1 : -1;
    const list = REJECTS
      .filter(r => tab === 'all' || r.category === tab)
      .filter(r => matchesText(r.type, f['type']) && matchesText(r.buyerId, f['buyerId']))
      .filter(r => inList(r.bu, f['bu']) && inList(r.idType, f['idType']) && inList(r.country, f['country']));
    if (!key) return list;
    return list.sort((a, b) => a[key].localeCompare(b[key], undefined, { numeric: true }) * way);
  });

  setTab(tab: RejectTab): void {
    this.activeTab.set(tab);
    this.selectedIds.set([]);
  }

  sortDirectionOf(key: RejectColumn): 'asc' | 'desc' | null {
    return this.sortKey() === key ? this.sortDir() : null;
  }

  /** Cliquer la colonne triée inverse le sens, une autre colonne repart en asc. */
  onSort(key: RejectColumn): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
      return;
    }
    this.sortKey.set(key);
    this.sortDir.set('asc');
  }

  cellValue(row: Reject, key: RejectColumn): string {
    if (key !== 'date') return row[key];
    const [y, m, d] = row.date.split('-').map(Number);
    return `${d} ${MONTHS[m - 1]} ${y}`;
  }

  // ── Sélection ───────────────────────────────────────────────────────────────
  readonly selectedIds = signal<string[]>([]);

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggleRow(id: string, checked: boolean): void {
    this.selectedIds.update(list => checked ? [...list, id] : list.filter(other => other !== id));
  }

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
    this.selectedIds.set(checked ? this.rows().map(r => r.id) : []);
  }
}
