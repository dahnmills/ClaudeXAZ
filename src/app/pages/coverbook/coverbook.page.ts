import { Component, ElementRef, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs';

import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { TopboxComponent, type TopboxGradeColor } from '../../shared/ui/topbox/topbox.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { PageTitleComponent } from '../../shared/ui/page-title/page-title.component';
import { BreadcrumbsComponent } from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent } from '../../shared/ui/crumb/crumb.component';
import { TabComponent } from '../../shared/ui/tab/tab.component';
import { LinkComponent } from '../../shared/ui/link/link.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { SelectComponent, type SelectOption } from '../../shared/ui/select/select.component';
import {
  FilterDrawerComponent,
  type FilterDefinition,
  type FilterDrawerTab,
  type FilterValue,
  type SavedFilter,
} from '../../shared/ui/filter-drawer/filter-drawer.component';
import { FlyoutMenuComponent } from '../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../shared/ui/flyout-menu/flyout-menu-item.component';
import { FlyoutMenuTitleComponent } from '../../shared/ui/flyout-menu/flyout-menu-title.component';
import { TableRowComponent } from '../../shared/ui/table/table-row.component';
import { CellComponent } from '../../shared/ui/table/cell.component';
import { CellHeaderComponent, type SortDirection } from '../../shared/ui/table/cell-header.component';
import { CellActionComponent } from '../../shared/ui/table/cell-action.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { GradeComponent } from '../../shared/ui/grade/grade.component';
import { PolicyColorComponent } from '../../shared/ui/policy-color/policy-color.component';
import { CardComponent } from '../../shared/ui/card/card.component';
import { PropertiesPanelComponent, type PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { SnackbarService } from '../../shared/ui/snackbar/snackbar.service';

import type { PolicyColorValue } from '../../shared/ui/policy-color/policy-color.component';
import type {
  CoverAmount,
  CoverbookSide,
  CoverbookTab,
  CreditLimitCover,
  Grade,
  GradeBasedCover,
} from './coverbook.models';
import { columnsFor, humanizeCode, type CoverColumn, type CoverRow } from './coverbook.columns';
import {
  REFERENCE_CURRENCY,
  buyerCreditLimits,
  buyerFor,
  buyerGradeCovers,
  policyCreditLimits,
  policyFor,
  policyGradeCovers,
  policyRelatives,
} from './coverbook.mock';

interface TabDef {
  id:    CoverbookTab;
  label: string;
}

type CurrencyMode = 'reference' | 'original';
type CoversTab = 'credit-limits' | 'grade-covers';

const BUYER_TABS: TabDef[] = [
  { id: 'exposure-summary', label: 'Exposure Summary' },
  { id: 'exposure-details', label: 'Exposure details' },
  { id: 'credit-limits',    label: 'Credit Limits' },
  { id: 'grade-covers',     label: 'Grade based covers' },
  { id: 'downloads',        label: 'Download & Enrichments' },
];

const POLICY_TABS: TabDef[] = [
  { id: 'credit-limits',   label: 'Credit Limits' },
  { id: 'grade-covers',    label: 'Grade based covers' },
  { id: 'policy-exposure', label: 'Policy exposure' },
  { id: 'downloads',       label: 'Download & enrichments' },
];

/** Catégories du champ « Select your filters ». */
interface FilterCategory {
  key:   string;
  label: string;
  value: (row: CoverRow) => string;
  /** Libellé lisible d'une valeur. */
  show?: (value: string) => string;
}

const COLOR_NAMES: Record<PolicyColorValue, string> = {
  red: 'Red', orange: 'Orange', yellow: 'Yellow', green: 'Green', none: 'No color', unknown: 'Unknown',
};

/**
 * Coverbook : couvertures d'un acheteur (côté buyer) ou d'une police (côté policy).
 * Source : Figma [CU] Coverbook 2026, nodes 6032:6969 (buyer) et 6359:3002 (policy).
 *
 * Une seule page pour les deux côtés : la route porte `data.side`. Seuls les
 * onglets Credit Limits et Grade based covers sont branchés ; les autres
 * affichent un état vide.
 */
@Component({
  selector: 'app-coverbook-page',
  standalone: true,
  imports: [
    DatePipe,
    TopboxTestShellComponent,
    TopboxComponent,
    PageHeaderComponent,
    PageTitleComponent,
    BreadcrumbsComponent,
    CrumbComponent,
    TabComponent,
    LinkComponent,
    IconComponent,
    ButtonComponent,
    SelectComponent,
    FilterDrawerComponent,
    FlyoutMenuComponent,
    FlyoutMenuItemComponent,
    FlyoutMenuTitleComponent,
    TableRowComponent,
    CellComponent,
    CellHeaderComponent,
    CellActionComponent,
    BadgeComponent,
    GradeComponent,
    PolicyColorComponent,
    CardComponent,
    PropertiesPanelComponent,
    ModalComponent,
  ],
  templateUrl: './coverbook.page.html',
  styleUrl: './coverbook.page.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeFlyouts()',
  },
})
export class CoverbookPage {
  private route    = inject(ActivatedRoute);
  private router   = inject(Router);
  private snackbar = inject(SnackbarService);
  private host     = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly referenceCurrency = REFERENCE_CURRENCY;

  // ── Contexte de route ────────────────────────────────────────────────────
  readonly side = toSignal(
    this.route.data.pipe(map((d) => (d['side'] as CoverbookSide) ?? 'buyer')),
    { initialValue: 'buyer' as CoverbookSide },
  );
  readonly entityId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );

  /** Nom et couleur transmis par « Go to policy covers » (état de navigation). */
  private readonly policyHint = (() => {
    const s = this.router.getCurrentNavigation()?.extras.state ?? history.state;
    return s && typeof s['policyName'] === 'string'
      ? { name: s['policyName'] as string, color: s['policyColor'] as PolicyColorValue }
      : undefined;
  })();

  readonly buyer  = computed(() => buyerFor(this.entityId() || '4421706'));
  readonly policy = computed(() => policyFor(this.entityId() || '2590417133', this.policyHint));
  readonly relatives = computed(() => policyRelatives(this.policy()));

  readonly tabs = computed(() => (this.side() === 'buyer' ? BUYER_TABS : POLICY_TABS));
  readonly activeTab = signal<CoverbookTab>('credit-limits');
  readonly activeTabLabel = computed(() => this.tabs().find((t) => t.id === this.activeTab())?.label ?? '');
  readonly coversTab = computed<CoversTab | null>(() => {
    const t = this.activeTab();
    return t === 'credit-limits' || t === 'grade-covers' ? t : null;
  });

  readonly pageTitle = computed(() => (this.side() === 'buyer' ? 'Buyer covers' : 'Policy covers'));
  readonly currentCrumb = computed(() => `${this.pageTitle()} - ${this.activeTabLabel()}`);

  // ── Données ──────────────────────────────────────────────────────────────
  private readonly creditLimits = computed<CreditLimitCover[]>(() =>
    this.side() === 'buyer' ? buyerCreditLimits(this.buyer()) : policyCreditLimits(this.policy()));
  private readonly gradeCovers = computed<GradeBasedCover[]>(() =>
    this.side() === 'buyer' ? buyerGradeCovers(this.buyer()) : policyGradeCovers(this.policy()));

  private readonly rows = computed<CoverRow[]>(() =>
    this.coversTab() === 'grade-covers' ? this.gradeCovers() : this.creditLimits());

  // ── Colonnes ─────────────────────────────────────────────────────────────
  private readonly allColumns = computed(() => columnsFor(this.side(), this.coversTab() ?? 'credit-limits'));
  /** Colonnes masquées, par onglet (clé `side:tab`). */
  private readonly hidden = signal<Record<string, string[]>>({});
  private readonly hiddenKey = computed(() => `${this.side()}:${this.coversTab()}`);
  readonly hiddenColumns = computed(() => new Set(this.hidden()[this.hiddenKey()] ?? []));
  readonly manageableColumns = computed(() => this.allColumns().filter((c) => c.hideable));
  readonly columns = computed(() => this.allColumns().filter((c) => !this.hiddenColumns().has(c.key)));
  readonly wideTable = computed(() => this.coversTab() === 'grade-covers' && this.columns().length > 6);

  toggleColumn(key: string): void {
    const k = this.hiddenKey();
    const current = new Set(this.hidden()[k] ?? []);
    if (current.has(key)) current.delete(key);
    else current.add(key);
    this.hidden.update((h) => ({ ...h, [k]: [...current] }));
  }

  // ── Devise ───────────────────────────────────────────────────────────────
  readonly currencyMode = signal<CurrencyMode>('reference');
  readonly currencyOptions: SelectOption[] = [
    { value: 'reference', label: `${REFERENCE_CURRENCY} (default)` },
    { value: 'original',  label: 'Original currency' },
  ];

  setCurrency(value: string): void {
    this.currencyMode.set(value === 'original' ? 'original' : 'reference');
  }

  formatNumber(n: number): string {
    return n.toLocaleString('en-US').replace(/,/g, ' ');
  }

  formatAmount(a: CoverAmount | null): string {
    if (!a) return '-';
    const original = this.currencyMode() === 'original';
    const n = (original ? a.original : a.reference).toLocaleString('en-US').replace(/,/g, ' ');
    return original ? `${a.currency} ${n}` : n;
  }

  // ── Filtres ──────────────────────────────────────────────────────────────
  private readonly filterCategories = computed<FilterCategory[]>(() => {
    // Côté policy, toutes les lignes ont la couleur de la police : pas de filtre couleur.
    const base: FilterCategory[] = this.side() === 'buyer'
      ? [{ key: 'color', label: 'Policy color', value: (r) => r.policyColor,
          show: (v) => COLOR_NAMES[v as PolicyColorValue] }]
      : [];
    if (this.coversTab() === 'grade-covers') {
      return [
        ...base,
        { key: 'coverCode', label: 'Cover code', value: (r) => (r as GradeBasedCover).coverCode },
        { key: 'type',      label: 'Type',       value: (r) => (r as GradeBasedCover).type },
      ];
    }
    return [
      ...base,
      { key: 'decision', label: 'Decision code', value: (r) => (r as CreditLimitCover).decisionCode, show: humanizeCode },
      { key: 'status',   label: 'Cover status',  value: (r) => (r as CreditLimitCover).coverStatus, show: humanizeCode },
      ...(this.side() === 'buyer'
        ? [{ key: 'bu', label: 'Inforce BU', value: (r: CoverRow) => r.inforceBu }]
        : []),
    ];
  });

  // Mécanique de Reject Management et de la page Filters : le select applique un
  // filtre enregistré, Filter ouvre le panneau à droite (ds-filter-drawer), qui
  // gère aussi l'enregistrement, le renommage et la suppression des filtres.

  /** Une liste de cases par catégorie, valeurs tirées des lignes de l'onglet. */
  readonly filters = computed<FilterDefinition[]>(() =>
    this.filterCategories().map((cat) => ({
      id: cat.key,
      label: cat.label,
      type: 'checkbox-list',
      defaultOpen: true,
      columns: 2,
      options: [...new Set(this.rows().map(cat.value))].sort()
        .map((v) => ({ value: v, label: cat.show ? cat.show(v) : v })),
    })));

  readonly drawerOpen          = signal(false);
  readonly currentTab          = signal<FilterDrawerTab>('current');
  readonly activeSavedFilterId = signal<string | null>(null);
  readonly appliedFilters      = signal<Record<string, FilterValue>>({});
  readonly currentFilters      = signal<Record<string, FilterValue>>({});

  /** Exemples, valables des deux côtés (les clés absentes d'un onglet sont ignorées). */
  readonly savedFilters = signal<SavedFilter[]>([
    { id: 'saved-refusals', name: 'Refusals and restrictive answers', filters: { decision: ['Refusal', 'RestrictiveAnswer'] }, createdAt: new Date('2026-10-02T09:00:00') },
    { id: 'saved-partial', name: 'Partial or no cover', filters: { status: ['Partial', 'NoCover'] }, createdAt: new Date('2026-10-14T15:30:00') },
    { id: 'saved-check', name: 'Grade covers to check', filters: { coverCode: ['Check policy'] }, createdAt: new Date('2026-11-03T11:10:00') },
  ]);
  readonly savedFilterOptions = computed<SelectOption[]>(() =>
    this.savedFilters().map((f) => ({ value: f.id, label: f.name })));

  /** Filtres renseignés et connus de l'onglet, affichés sur le bouton : « Filter (2) ». */
  readonly activeFiltersCount = computed(() => {
    const keys = new Set(this.filterCategories().map((c) => c.key));
    return Object.entries(this.appliedFilters())
      .filter(([k, v]) => keys.has(k) && (Array.isArray(v) ? v.length > 0 : !!v)).length;
  });

  openDrawer(): void {
    this.closeFlyouts();
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
    const filter = this.savedFilters().find((f) => f.id === filterId);
    if (filter) this.applyFilters(filter.filters, filter.id);
  }

  private applyFilters(filters: Record<string, FilterValue>, savedId: string | null): void {
    this.currentFilters.set({ ...filters });
    this.appliedFilters.set({ ...filters });
    this.activeSavedFilterId.set(savedId);
  }

  resetFilters(): void {
    this.applyFilters({}, null);
  }

  private readonly filteredRows = computed(() => {
    const applied = this.appliedFilters();
    // OU dans une catégorie, ET entre catégories ; une clé absente de l'onglet est ignorée.
    const active = this.filterCategories()
      .map((cat) => ({ cat, values: applied[cat.key] }))
      .filter((x): x is { cat: FilterCategory; values: string[] } => Array.isArray(x.values) && x.values.length > 0);
    if (!active.length) return this.rows();
    return this.rows().filter((row) => active.every(({ cat, values }) => values.includes(cat.value(row))));
  });

  // ── Tri ──────────────────────────────────────────────────────────────────
  readonly sortKey = signal<string | null>(null);
  readonly sortDir = signal<SortDirection>(null);

  sortDirectionFor(col: CoverColumn): SortDirection {
    return this.sortKey() === col.key ? this.sortDir() : null;
  }

  toggleSort(col: CoverColumn): void {
    if (this.sortKey() !== col.key) {
      this.sortKey.set(col.key);
      this.sortDir.set('asc');
    } else if (this.sortDir() === 'asc') {
      this.sortDir.set('desc');
    } else {
      this.sortKey.set(null);
      this.sortDir.set(null);
    }
  }

  readonly visibleRows = computed(() => {
    const rows = this.filteredRows();
    const key = this.sortKey();
    const dir = this.sortDir();
    const col = this.allColumns().find((c) => c.key === key);
    if (!col || !dir) return rows;
    const value = col.sortValue ?? col.text ?? (() => '');
    const sign = dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      // Les valeurs vides restent en bas, quel que soit le sens.
      if (va === null || va === '') return vb === null || vb === '' ? 0 : 1;
      if (vb === null || vb === '') return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sign;
      return String(va).localeCompare(String(vb), 'en', { numeric: true }) * sign;
    });
  });

  // ── Onglets ──────────────────────────────────────────────────────────────
  selectTab(id: CoverbookTab): void {
    if (id === this.activeTab()) return;
    this.activeTab.set(id);
    this.sortKey.set(null);
    this.sortDir.set(null);
    this.resetFilters();
    this.closeFlyouts();
  }

  // ── Menus flottants ──────────────────────────────────────────────────────
  readonly columnsMenuOpen  = signal(false);
  readonly policiesMenuOpen = signal(false);

  toggleColumnsMenu(): void {
    this.policiesMenuOpen.set(false);
    this.columnsMenuOpen.update((v) => !v);
  }

  togglePoliciesMenu(): void {
    this.columnsMenuOpen.set(false);
    this.policiesMenuOpen.update((v) => !v);
  }

  closeFlyouts(): void {
    this.columnsMenuOpen.set(false);
    this.policiesMenuOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target || !this.host.nativeElement.contains(target)) { this.closeFlyouts(); return; }
    if (!target.closest('.cb-columns')) this.columnsMenuOpen.set(false);
    if (!target.closest('.cb-policies') && !target.closest('ds-topbox')) this.policiesMenuOpen.set(false);
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  exportCovers(): void {
    this.snackbar.show(`Export started: ${this.visibleRows().length} covers`, { tone: 'neutral', icon: 'download' });
  }

  updateCoverInformation(): void {
    this.snackbar.show('Cover information update requested', { tone: 'neutral', icon: 'refresh' });
  }

  goToDocuments(): void {
    this.snackbar.show(this.side() === 'buyer' ? 'Documents are not part of this prototype' : 'PAF 360 is not part of this prototype');
  }

  openRelated(row: CoverRow): void {
    if (this.side() === 'buyer') {
      this.router.navigate(['/coverbook/policy', row.policyId], {
        state: { policyName: row.policyName, policyColor: row.policyColor },
      });
    } else {
      this.router.navigate(['/coverbook/buyer', row.buyerId]);
    }
  }

  // ── Détail d'une ligne (modale « View details ») ─────────────────────────
  readonly detailRow = signal<CoverRow | null>(null);

  openDetails(row: CoverRow): void {
    this.detailRow.set(row);
  }

  closeDetails(): void {
    this.detailRow.set(null);
  }

  readonly detailSections = computed<PropertySection[]>(() => {
    const row = this.detailRow();
    if (!row) return [];
    const fmtDate = (iso: string | null) => (iso ? new DatePipe('en-US').transform(iso, 'MMM d, y') : null);
    const gradeLabel = (g: Grade) =>
      g.type === 'na' ? 'N/A' : g.type === 'nc' ? 'N/C' : `${g.type === 'manual' ? 'M' : 'A'}${g.grade}`;
    const who = this.side() === 'buyer'
      ? [{ label: 'Policy Type & ID', value: row.policyId }, { label: 'Policy name', value: row.policyName }]
      : [{ label: 'Cie ID', value: row.buyerId }, { label: 'Buyer name', value: row.buyerName }];

    if (this.coversTab() === 'grade-covers') {
      const g = row as GradeBasedCover;
      return [
        { rows: [...who, { label: 'IBUs', value: `${g.contractBu} / ${g.inforceBu}` },
                 { label: 'LOB / Segment', value: `${g.lob ?? '-'} / ${g.segment ?? '-'}` }] },
        { rows: [{ label: 'Policy color', value: COLOR_NAMES[g.policyColor] },
                 { label: 'Answer amount', value: this.formatAmount(g.answer) },
                 { label: 'Decision grade', value: gradeLabel(g.decisionGrade) },
                 { label: 'Type', value: g.type }] },
        { rows: [{ label: 'Request date', value: fmtDate(g.requestDate) },
                 { label: 'Last update', value: fmtDate(g.lastUpdate) },
                 { label: 'Expiration date', value: fmtDate(g.expirationDate) },
                 { label: 'Cover code', value: g.coverCode }] },
      ];
    }
    const c = row as CreditLimitCover;
    return [
      { rows: [...who, { label: 'Inforce BU', value: c.inforceBu },
               { label: 'LOB / Segment', value: `${c.lob ?? '-'} / ${c.segment ?? '-'}` },
               { label: 'Decision code', value: humanizeCode(c.decisionCode) }] },
      { rows: [{ label: 'Policy color & name', value: `${COLOR_NAMES[c.policyColor]}, ${c.coverType}` },
               { label: 'Request amount', value: this.formatAmount(c.request) },
               { label: 'Answer amount', value: this.formatAmount(c.answer) },
               { label: 'Underwriter', value: c.underwriter }] },
      { rows: [{ label: 'Expiration date', value: fmtDate(c.expirationDate) ?? 'N/A' },
               { label: 'Request date', value: fmtDate(c.requestDate) ?? 'N/A' },
               { label: 'Decision date', value: fmtDate(c.decisionDate) },
               { label: 'Risk horizon', value: c.riskHorizon === null ? 'N/A' : `${c.riskHorizon} days` }] },
    ];
  });

  // ── Résumé de police (Figma coverbook--policy-cover) ─────────────────────
  private readonly policyColorTpl     = viewChild<TemplateRef<unknown>>('policyColorTpl');
  private readonly customerSegmentTpl = viewChild<TemplateRef<unknown>>('customerSegmentTpl');

  readonly policySections = computed<PropertySection[]>(() => {
    const p = this.policy();
    const colorTpl = this.policyColorTpl();
    const segTpl   = this.customerSegmentTpl();
    return [
      { rows: [{ label: 'Insured BU', value: p.insuredBu }, { label: 'InForce BU', value: p.inforceBu }] },
      { rows: [{ label: 'Product name', value: p.productName }, { label: 'Family Name', value: p.familyName }] },
      { rows: [{ label: 'Segment', value: p.segment }, { label: 'LOB', value: p.lob }] },
      { rows: [{ label: 'Policy language', value: p.language }, { label: 'Strategic Policy', value: p.strategic ? 'Yes' : 'No' }] },
      { rows: [
        { label: 'Policy color', value: colorTpl ? { kind: 'template', template: colorTpl } : p.color },
        { label: 'Customer segment', value: segTpl ? { kind: 'template', template: segTpl } : p.customerSegment },
      ] },
    ];
  });

  // ── Topbox ───────────────────────────────────────────────────────────────
  gradeLabel(g: Grade): string {
    if (g.type === 'na') return 'N/A';
    if (g.type === 'nc') return 'N/C';
    return `${g.type === 'manual' ? 'M' : 'A'}${g.grade}`;
  }

  gradeColor(g: Grade): TopboxGradeColor {
    return g.grade ? (`grade-${g.grade}` as TopboxGradeColor) : 'grade-none';
  }

  policyGradeColor(color: PolicyColorValue): TopboxGradeColor {
    const map: Record<PolicyColorValue, TopboxGradeColor> = {
      red: 'grade-7', orange: 'grade-6', yellow: 'grade-4', green: 'grade-2', none: 'grade-none', unknown: 'grade-none',
    };
    return map[color];
  }

  policyLetter(color: PolicyColorValue): string {
    return { red: 'R', orange: 'O', yellow: 'Y', green: 'G', none: 'N', unknown: 'U' }[color];
  }

  // ── Accès typés pour le gabarit ──────────────────────────────────────────
  asGrade(row: CoverRow): GradeBasedCover {
    return row as GradeBasedCover;
  }
}
