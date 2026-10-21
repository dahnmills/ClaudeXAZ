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
  TagFilterChipComponent,
  TableRowComponent,
  CellComponent,
  CellHeaderComponent,
  CellActionComponent,
  CellSelectionComponent,
  FlyoutMenuComponent,
  FlyoutMenuItemComponent,
} from '../../shared/ui';
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
    TagFilterChipComponent,
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

  // ── Filtres : le champ prépare, le bouton Filter applique ───────────────────
  readonly buOptions = [...new Set(REJECTS.map(r => r.bu))].sort().map(bu => ({ value: bu, label: bu }));
  readonly pendingBus = signal<Set<string>>(new Set());
  private readonly appliedBus = signal<Set<string>>(new Set());

  applyFilters(): void {
    this.appliedBus.set(new Set(this.pendingBus()));
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
    const bus = this.appliedBus();
    const key = this.sortKey();
    const way = this.sortDir() === 'asc' ? 1 : -1;
    const list = REJECTS
      .filter(r => tab === 'all' || r.category === tab)
      .filter(r => bus.size === 0 || bus.has(r.bu));
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
