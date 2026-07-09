import { Component, OnInit, OnDestroy, HostListener, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  BreadcrumbsComponent,
  CrumbComponent,
  TopboxComponent,
  PageHeaderComponent,
  PageTitleComponent,
  SkeletonItemComponent,
  SelectComponent,
  type SelectOption,
  CardComponent,
  WidgetCardComponent,
  ChartComponent,
  type ChartTone,
  PropertiesPanelComponent,
  ListWidgetComponent,
  NewsfeedComponent,
  ModalComponent,
  ButtonComponent,
  ButtonIconComponent,
  IconComponent,
  type IconName,
  DividerComponent,
  TextareaComponent,
  DrawerComponent,
  GridSelectionComponent,
  InputTextComponent,
  InputSearchComponent,
  FlyoutMenuComponent,
  FlyoutMenuItemComponent,
  type LayoutConfig,
  type LayoutId,
} from '../../shared/ui';
import { type BuyerCompany } from './buyer-summary.store';
import { SECTIONS } from '../../user-testing/mocks';
import { type PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import { type ListWidgetItem } from '../../shared/ui/list-widget/list-widget.component';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { ToasterService } from '../../shared/ui/toaster/toaster.service';
import { BuyerSummaryStore } from './buyer-summary.store';

const PROVIDER_DELAY_MS = 2500;
const MONTHS = ['May 23', 'Jul 23', 'Sep 23', 'Nov 23', 'Jan 24', 'Mar 24', 'May 24', 'Jul 24'];

const DEFAULT_COMPANY: BuyerCompany = {
  name: 'Immobilière du Marais',
  companyId: '137381425',
  city: 'BHV',
  address: '34 RUE DE LA VERRIÈRE - 75004 - PARIS 4 - FRANCE',
};

let uidCounter = 0;
function nextUid(): string { return `slot-${++uidCounter}`; }

export type SlotSize = '' | 'S' | 'M' | 'L';

export interface SlotConfig {
  uid: string;
  widgetType: string;
  widgetSize: SlotSize;   // '' = not chosen yet → type select stays disabled
  cols: 1 | 2;
  rows: 1 | 2;
  loading: boolean;
}

let boardUidCounter = 0;
function nextBoardId(): string { return `board-${++boardUidCounter}`; }

export interface Board {
  id: string;
  name: string;
  builtin: boolean;          // default boards can't be deleted/renamed
  slots: { widgetType: string; cols: 1 | 2; rows: 1 | 2 }[];
}

// Default boards available on every buyer — content mirrors the demo widgets
export const DEFAULT_BOARDS: Board[] = [
  {
    id: 'common', name: 'Common', builtin: true,
    slots: [
      { widgetType: 'grade',        cols: 1, rows: 1 },
      { widgetType: 'exposure',     cols: 1, rows: 1 },
      { widgetType: 'risk-figures', cols: 1, rows: 1 },
      { widgetType: 'financials',   cols: 1, rows: 1 },
      { widgetType: 'jobs',         cols: 1, rows: 1 },
      { widgetType: 'newsfeed',     cols: 2, rows: 1 },
      { widgetType: 'notepad',      cols: 1, rows: 1 },
    ],
  },
  {
    id: 'credit-assessment', name: 'Credit Assessment', builtin: true,
    slots: [
      { widgetType: 'grade',        cols: 2, rows: 1 },
      { widgetType: 'score',        cols: 1, rows: 1 },
      { widgetType: 'risk-figures', cols: 1, rows: 1 },
      { widgetType: 'exposure',     cols: 2, rows: 1 },
      { widgetType: 'limit',        cols: 1, rows: 1 },
      { widgetType: 'coverage',     cols: 1, rows: 1 },
    ],
  },
  {
    id: 'credit-underwriting', name: 'Credit Underwriting', builtin: true,
    slots: [
      { widgetType: 'exposure',       cols: 2, rows: 1 },
      { widgetType: 'overdues',       cols: 1, rows: 1 },
      { widgetType: 'payment-history', cols: 1, rows: 1 },
      { widgetType: 'financials',     cols: 1, rows: 1 },
      { widgetType: 'limit',          cols: 1, rows: 1 },
      { widgetType: 'risk-figures',   cols: 1, rows: 1 },
      { widgetType: 'grade',          cols: 1, rows: 1 },
    ],
  },
];

export interface CardPreview { id: string; label: string; custom?: boolean; }

// ── Card builder model ────────────────────────────────────────────────────────
// A custom card = a named stack of blocks, each block backed by a DS primitive
// and (for data blocks) wired to real buyer data points. Free composition,
// zero style freedom → stays consistent with the board.

let blockUidCounter = 0;
function nextBlockId(): string { return `block-${++blockUidCounter}`; }
let zoneUidCounter = 0;
function nextZoneId(): string { return `zone-${++zoneUidCounter}`; }
let customCardCounter = 0;
function nextCustomCardId(): string { return `custom-${++customCardCounter}`; }

export type BlockKind = 'heading' | 'figures' | 'chart' | 'note';

export interface CardBlock {
  id: string;
  kind: BlockKind;
  text?: string;            // heading: title ; note: free text
  dataPointIds?: string[];  // figures: ids picked from DATA_CATALOG
  metricId?: string;        // chart: id from METRIC_CATALOG
}

// A layout zone holds an independent stack of blocks
export interface CardZone { id: string; blocks: CardBlock[]; }

export interface CustomCard { id: string; name: string; layoutId: string; zones: CardZone[]; }

// Card layouts — the skeleton chosen first. Each defines its zone count; the CSS
// (grid-template-areas, class bs-zones--<id>) drives the actual placement.
// Drawn from dashboard tools: sidebar/master-detail (Dynatrace, Grafana),
// hero KPI banner (Power BI), triptych (Looker Studio).
export interface CardLayoutDef { id: string; label: string; hint: string; zones: number; }

export const CARD_LAYOUTS: CardLayoutDef[] = [
  { id: 'stack',        label: 'Stack',         hint: 'Single column, blocks stacked',   zones: 1 },
  { id: 'two-col',      label: 'Two columns',   hint: 'Two columns side by side',        zones: 2 },
  { id: 'three-col',    label: 'Three columns', hint: 'Triptych of equal columns',       zones: 3 },
  { id: 'sidebar',      label: 'Sidebar',       hint: 'Narrow highlight + wide detail',  zones: 2 },
  { id: 'split-header', label: 'Split header',  hint: 'Full-width header over two cols',  zones: 3 },
  { id: 'grid-2x2',     label: 'Grid 2×2',      hint: 'Four compact quadrants',          zones: 4 },
  { id: 'hero-row',     label: 'Hero + row',    hint: 'Focal banner over a row of three', zones: 4 },
];

const CARD_LAYOUT_MAP: Record<string, CardLayoutDef> =
  Object.fromEntries(CARD_LAYOUTS.map(l => [l.id, l]));

// A single buyer data point the analyst can drop onto a Figures block
export interface DataPoint { id: string; label: string; value: string; category: string; }

// A time series the analyst can plot in a Chart block
export interface Metric {
  id: string; label: string; data: number[]; tone: ChartTone;
  invertY?: boolean; yLabels?: string[]; min?: number; max?: number;
}

// Palette shown in the "Add block" bar
export const BLOCK_KINDS: { kind: BlockKind; label: string; icon: IconName }[] = [
  { kind: 'heading', label: 'Heading', icon: 'aa' },
  { kind: 'figures', label: 'Figures', icon: 'grid' },
  { kind: 'chart',   label: 'Chart',   icon: 'chart' },
  { kind: 'note',    label: 'Note',    icon: 'edit-compose' },
];

export const LAYOUTS: LayoutConfig[] = [
  { id: '4x1',          label: '4 equal',    gridCols: 4, slots: [{cols:1,rows:1},{cols:1,rows:1},{cols:1,rows:1},{cols:1,rows:1},{cols:1,rows:1},{cols:1,rows:1},{cols:1,rows:1},{cols:1,rows:1}] },
  { id: '2x1-1x1-1x1',  label: 'Mixed 6',   gridCols: 4, slots: [{cols:2,rows:1},{cols:1,rows:1},{cols:1,rows:1},{cols:1,rows:1},{cols:2,rows:1},{cols:1,rows:1}] },
  { id: '2x2-mix',      label: 'Large left', gridCols: 4, slots: [{cols:2,rows:2},{cols:1,rows:1},{cols:1,rows:1},{cols:1,rows:1},{cols:1,rows:1}] },
  { id: '1x2-side',     label: 'Large right',gridCols: 4, slots: [{cols:1,rows:1},{cols:1,rows:1},{cols:2,rows:2},{cols:1,rows:1},{cols:1,rows:1}] },
  { id: '2x2-full',     label: '2×2 grid',   gridCols: 4, slots: [{cols:2,rows:1},{cols:2,rows:1},{cols:2,rows:1},{cols:2,rows:1}] },
  { id: '4x2-alt',      label: 'Tall left',  gridCols: 4, slots: [{cols:2,rows:2},{cols:2,rows:1},{cols:1,rows:1},{cols:1,rows:1},{cols:2,rows:1}] },
];

export const WIDGET_TYPE_OPTIONS: SelectOption[] = [
  { value: 'grade',           label: 'Grade' },
  { value: 'exposure',        label: 'Exposure' },
  { value: 'risk-figures',    label: 'Risk figures' },
  { value: 'limit',           label: 'Limit' },
  { value: 'overdues',        label: 'Overdues' },
  { value: 'payment-history', label: 'Payment history' },
  { value: 'score',           label: 'Score' },
  { value: 'coverage',        label: 'Coverage' },
  { value: 'financials',      label: 'Financials' },
  { value: 'notepad',         label: 'Notepad' },
  { value: 'jobs',            label: 'Jobs to do' },
  { value: 'newsfeed',        label: 'Newsfeed' },
];

export const WIDGET_SIZE_OPTIONS: SelectOption[] = [
  { value: 'S', label: '1×1 — Small' },
  { value: 'M', label: '2×1 — Medium' },
  { value: 'L', label: '2×2 — Large' },
];

export const CARD_PREVIEWS: CardPreview[] = WIDGET_TYPE_OPTIONS.map(o => ({ id: o.value, label: o.label }));

// Buyer data catalogue — flat list of real data points the analyst can compose
// onto a Figures block. Mirrors the demo widget mocks, grouped for the picker.
export const DATA_CATALOG: DataPoint[] = [
  { id: 'exposure',       label: 'Exposure',         value: '1 548 000',      category: 'Risk' },
  { id: 'highest-limit',  label: 'Highest limit',    value: '10 000 246 000', category: 'Risk' },
  { id: 'number-limits',  label: 'Number of limits', value: '72',             category: 'Risk' },
  { id: 'granted-limit',  label: 'Granted limit',    value: '5 000 000',      category: 'Limits' },
  { id: 'used-limit',     label: 'Used limit',       value: '1 548 000',      category: 'Limits' },
  { id: 'available-limit',label: 'Available',        value: '3 452 000',      category: 'Limits' },
  { id: 'turnover',       label: 'Turnover',         value: '123 900 000',    category: 'Financials' },
  { id: 'pre-tax-profit', label: 'Pre tax Profit',   value: '18 000',         category: 'Financials' },
  { id: 'cashflow',       label: 'Cashflow',         value: '22 000',         category: 'Financials' },
  { id: 'total-overdue',  label: 'Total overdue',    value: '0',              category: 'Overdues' },
  { id: 'oldest-overdue', label: 'Oldest',           value: 'N/A',            category: 'Overdues' },
  { id: 'disputes',       label: 'Disputes',         value: 'None',           category: 'Overdues' },
  { id: 'score',          label: 'Score',            value: '82 / 100',       category: 'Score' },
  { id: 'score-trend',    label: 'Trend',            value: 'Stable',         category: 'Score' },
  { id: 'score-updated',  label: 'Updated',          value: '11 nov 2024',    category: 'Score' },
  { id: 'cover-requested',label: 'Cover requested',  value: '2 000 000',      category: 'Coverage' },
  { id: 'cover-granted',  label: 'Cover granted',    value: '2 000 000',      category: 'Coverage' },
  { id: 'cover-decision', label: 'Decision',         value: 'Approved',       category: 'Coverage' },
  { id: 'pay-on-time',    label: 'On time',          value: '94 %',           category: 'Payment' },
  { id: 'pay-late-30',    label: 'Late 1-30',        value: '6 %',            category: 'Payment' },
  { id: 'pay-late-30p',   label: 'Late 30+',         value: '0 %',            category: 'Payment' },
];


// Time series the analyst can plot in a Chart block
export const METRIC_CATALOG: Metric[] = [
  { id: 'grade-history', label: 'Grade history', data: [6,6,6,7,6,5,5,6], tone: 'positive',
    invertY: true, yLabels: ['1','4','7','10','N/A'], min: 1, max: 11 },
  { id: 'exposure-trend', label: 'Exposure trend', data: [12,18,15,22,28,26,34,40], tone: 'brand' },
];

export const METRIC_OPTIONS: SelectOption[] = METRIC_CATALOG.map(m => ({ value: m.id, label: m.label }));

const DATA_POINT_MAP: Record<string, DataPoint> = Object.fromEntries(DATA_CATALOG.map(d => [d.id, d]));
const METRIC_MAP: Record<string, Metric> = Object.fromEntries(METRIC_CATALOG.map(m => [m.id, m]));

export const LOADING_MESSAGES = [
  "Preparing your layout",
  "Placing your cards",
  "Finishing up",
];

const WIDGET_LABELS: Record<string, string> = Object.fromEntries(WIDGET_TYPE_OPTIONS.map(o => [o.value, o.label]));

@Component({
  selector: 'app-buyer-summary',
  standalone: true,
  imports: [
    TopboxTestShellComponent,
    BreadcrumbsComponent,
    CrumbComponent,
    TopboxComponent,
    PageHeaderComponent,
    PageTitleComponent,
    SkeletonItemComponent,
    SelectComponent,
    CardComponent,
    WidgetCardComponent,
    ChartComponent,
    PropertiesPanelComponent,
    ListWidgetComponent,
    NewsfeedComponent,
    ModalComponent,
    ButtonComponent,
    ButtonIconComponent,
    IconComponent,
    DividerComponent,
    TextareaComponent,
    DrawerComponent,
    GridSelectionComponent,
    InputTextComponent,
    InputSearchComponent,
    FlyoutMenuComponent,
    FlyoutMenuItemComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './buyer-summary.component.html',
  styleUrl: './buyer-summary.component.scss',
})
export class BuyerSummaryComponent implements OnInit, OnDestroy {
  private route   = inject(ActivatedRoute);
  private store   = inject(BuyerSummaryStore);
  private toaster = inject(ToasterService);

  // Pending timers — cleared on destroy to avoid callbacks on a dead component
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private schedule(fn: () => void, ms: number): void {
    const id = setTimeout(() => { this.timers.delete(id); fn(); }, ms);
    this.timers.add(id);
  }

  company  = this.store.current;
  routeId  = signal<string>('');
  loading  = signal<boolean>(true);

  view        = computed<BuyerCompany>(() => {
    const c = this.company();
    if (!c) return DEFAULT_COMPANY;
    return { ...c, companyId: c.companyId || this.routeId() };
  });
  companyName = computed(() => this.view().name);
  companyId   = computed(() => this.view().companyId || this.routeId());

  detailsModalOpen = signal<boolean>(false);
  openDetails()  { this.detailsModalOpen.set(true); }
  closeDetails() { this.detailsModalOpen.set(false); }
  readonly detailsSections: PropertySection[] = SECTIONS;

  // ── Board state ────────────────────────────────────────────────────────────
  boardState      = signal<'loading' | 'configure' | 'ready'>('ready');
  selectedLayout  = signal<LayoutId | null>(null);
  slots           = signal<SlotConfig[]>([]);

  // All boards (defaults + user-created) and the one currently shown
  boards          = signal<Board[]>(DEFAULT_BOARDS.map(b => ({ ...b })));
  currentBoardId  = signal<string>(DEFAULT_BOARDS[0].id);

  discardConfirmOpen = signal(false);
  renamingBoardId    = signal<string | null>(null);
  renameValue        = signal('');
  // id of the board being edited (null = creating a fresh board)
  editingBoardId     = signal<string | null>(null);
  // Single drawer drives everything: board management, creation, card/layout config
  drawerOpen         = signal(false);
  drawerView         = signal<'boards' | 'cards' | 'layouts' | 'create'>('boards');
  cardFilter         = signal('');
  loadingStep        = signal(0);
  loadingFade        = signal(false);
  // uid of the "Pick a card" placeholder awaiting a type from the drawer
  targetSlotUid      = signal<string | null>(null);
  // ── Native HTML5 drag state ──────────────────────────────────────────────
  dragActive    = signal(false);            // a drag is in progress
  draggingUid   = signal<string | null>(null); // slot being dragged (null = from drawer)
  dragCardId    = signal<string | null>(null); // widget type dragged from the drawer
  dropIndex     = signal<number | null>(null); // insertion index for the bar indicator
  dropOnUid     = signal<string | null>(null); // empty placeholder being aimed

  // ── Card builder state ─────────────────────────────────────────────────────
  customCards    = signal<CustomCard[]>([]);          // user-built cards (mock persistence)
  builderOpen    = signal(false);
  editingCardId  = signal<string | null>(null);       // null = creating a fresh card
  builderStep    = signal<'layout' | 'compose'>('layout');
  // canvas + inspector: "<zoneId>:<blockId>" of the selected block (edited in
  // the right-hand inspector panel)
  selectedBlockKey = signal<string | null>(null);
  // figures field picker: search query per block id
  fieldSearch      = signal<Record<string, string>>({});
  draftCard      = signal<CustomCard>({ id: '', name: '', layoutId: 'stack', zones: [] });

  // Board currently displayed in ready state
  currentBoard = computed(() =>
    this.boards().find(b => b.id === this.currentBoardId()) ?? this.boards()[0]
  );

  // Dropdown options reflect the live board list
  boardOptions = computed<SelectOption[]>(() =>
    this.boards().map(b => ({ value: b.id, label: b.name }))
  );

  // Drawer header label follows the active view
  drawerTitle = computed(() => {
    switch (this.drawerView()) {
      case 'boards':  return 'Boards';
      case 'create':  return 'New board';
      default:        return 'Cards & layouts';
    }
  });

  // Custom cards surface as draggable previews alongside the built-in ones
  customCardPreviews = computed<CardPreview[]>(() =>
    this.customCards().map(c => ({ id: c.id, label: c.name, custom: true }))
  );

  // Front-only filter — "gr" → "Grade". Custom cards listed first.
  filteredCards = computed(() => {
    const all = [...this.customCardPreviews(), ...CARD_PREVIEWS];
    const q = this.cardFilter().trim().toLowerCase();
    if (!q) return all;
    return all.filter(c => c.label.toLowerCase().includes(q));
  });

  readonly LAYOUTS             = LAYOUTS;
  readonly WIDGET_TYPE_OPTIONS = WIDGET_TYPE_OPTIONS;
  readonly WIDGET_SIZE_OPTIONS = WIDGET_SIZE_OPTIONS;
  readonly CARD_PREVIEWS       = CARD_PREVIEWS;
  readonly LOADING_MESSAGES    = LOADING_MESSAGES;
  readonly BLOCK_KINDS         = BLOCK_KINDS;
  readonly METRIC_OPTIONS      = METRIC_OPTIONS;
  readonly CARD_LAYOUTS        = CARD_LAYOUTS;

  // Builder modal title follows step + create/edit mode
  builderTitle = computed(() => {
    const verb = this.editingCardId() ? 'Edit' : 'Create';
    return this.builderStep() === 'layout'
      ? `${verb} custom card — pick a layout`
      : `${verb} custom card`;
  });

  readonly skeletonCards = Array.from({ length: 8 });
  readonly months        = MONTHS;
  readonly gradeY        = ['1','2','3','4','5','6','7','8','9','10','N/A'];
  // Compact Y axis for small slot previews (fewer rows = less vertical space)
  readonly gradeYShort   = ['1','4','7','10','N/A'];
  readonly gradeData     = [6,6,6,7,6,5,5,6];
  readonly exposureData  = [12,18,15,22,28,26,34,40];

  readonly riskFigures: PropertySection[] = [{
    rows: [
      { label: 'Exposure',        value: '1 548 000' },
      { label: 'Highest limit',   value: '10 000 246 000' },
      { label: 'Number of limits', value: '72' },
    ],
  }];
  readonly companyIndicators: PropertySection[] = [{
    rows: [
      { label: 'Reaction', value: 'N/A' },
      { label: 'MIG',      value: 'N/A' },
      { label: 'PRG',      value: 'Yes' },
    ],
  }];
  readonly financials: PropertySection[] = [{
    rows: [
      { label: 'Turnover',       value: '123 900 000' },
      { label: 'Pre tax Profit', value: '18 000' },
      { label: 'Cashflow',       value: '22 000' },
    ],
  }];
  readonly limitFigures: PropertySection[] = [{
    rows: [
      { label: 'Granted limit', value: '5 000 000' },
      { label: 'Used limit',    value: '1 548 000' },
      { label: 'Available',     value: '3 452 000' },
    ],
  }];
  readonly overduesFigures: PropertySection[] = [{
    rows: [
      { label: 'Total overdue', value: '0' },
      { label: 'Oldest',        value: 'N/A' },
      { label: 'Disputes',      value: 'None' },
    ],
  }];
  readonly scoreFigures: PropertySection[] = [{
    rows: [
      { label: 'Score',    value: '82 / 100' },
      { label: 'Trend',    value: 'Stable' },
      { label: 'Updated',  value: '11 nov 2024' },
    ],
  }];
  readonly coverageFigures: PropertySection[] = [{
    rows: [
      { label: 'Cover requested', value: '2 000 000' },
      { label: 'Cover granted',   value: '2 000 000' },
      { label: 'Decision',        value: 'Approved' },
    ],
  }];
  readonly paymentFigures: PropertySection[] = [{
    rows: [
      { label: 'On time',   value: '94 %' },
      { label: 'Late 1-30', value: '6 %' },
      { label: 'Late 30+',  value: '0 %' },
    ],
  }];
  readonly jobItems: ListWidgetItem[] = [
    { label: 'ManA - Grade Transfer',    date: '11 nov 2024 - 16:42', badge: { label: 'High priority',   status: 'error' } },
    { label: 'Buyer information update', date: '11 nov 2024 - 16:42', badge: { label: 'Medium priority', status: 'warning' } },
    { label: 'CLR',                      date: '11 nov 2024 - 16:42', badge: { label: 'Low priority',    status: 'success' } },
  ];
  readonly notepadItems: ListWidgetItem[] = [
    { label: 'Reminder 1', date: '11 nov 2024 - 16:42', badge: { label: 'info', status: 'info' } },
    { label: 'Reminder 2', date: '11 nov 2024 - 16:42', badge: { label: 'info', status: 'info' } },
    { label: 'Reminder 3', date: '11 nov 2024 - 16:42', badge: { label: 'info', status: 'info' } },
  ];

  // Index of the ready-board card whose context menu is open (null = none)
  openCardMenu = signal<number | null>(null);

  toggleCardMenu(i: number): void {
    this.openCardMenu.update(cur => cur === i ? null : i);
  }
  closeCardMenu(): void { this.openCardMenu.set(null); }

  // Close the open card menu on any outside click or Escape
  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.openCardMenu() !== null) this.closeCardMenu();
  }
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.openCardMenu() !== null) this.closeCardMenu();
  }

  // Card menu actions (ready board) ────────────────────────────────────────────

  // Only chart widgets expose a "See figures" entry
  widgetHasFigures(type: string): boolean {
    return type === 'grade' || type === 'exposure';
  }

  cardMenuSeeFigures(): void {
    this.closeCardMenu();
    this.openDetails();
  }

  cardMenuViewData(): void {
    this.closeCardMenu();
    this.openDetails();
  }

  cardMenuEditBoard(): void {
    this.closeCardMenu();
    const board = this.currentBoard();
    if (board && !board.builtin) {
      this.editBoard(board);
    } else {
      // built-in boards aren't editable in place — open the boards drawer
      this.openBoardsDrawer();
    }
  }

  cardMenuRemove(index: number): void {
    this.closeCardMenu();
    const board = this.currentBoard();
    if (!board || board.builtin) return; // can't mutate a default board
    const slots = board.slots.filter((_, idx) => idx !== index);
    this.boards.update(arr => arr.map(b => b.id === board.id ? { ...b, slots } : b));
  }

  // ── Board switching ─────────────────────────────────────────────────────────

  selectBoard(id: string): void {
    this.currentBoardId.set(id);
  }

  // ── Drawer (single surface: boards / create / cards / layouts) ───────────────

  // Open the drawer on the boards list (ready state "Manage boards")
  openBoardsDrawer(): void {
    this.drawerView.set('boards');
    this.drawerOpen.set(true);
  }

  // Open the drawer on cards/layouts (configure state "Cards & layouts")
  openDrawer(view: 'cards' | 'layouts' = 'cards'): void {
    this.drawerView.set(view);
    this.drawerOpen.set(true);
  }

  // Switch the boards drawer to the inline layout picker
  openCreateBoard(): void {
    this.editingBoardId.set(null);
    this.selectedLayout.set(null);
    this.drawerView.set('create');
  }

  selectLayout(id: LayoutId): void {
    this.selectedLayout.set(id);
    this.drawerOpen.set(false);
    this.boardState.set('loading');
    this.loadingStep.set(0);
    this.loadingFade.set(false);

    this.cycleLoadingMessage(900, 1);
    this.cycleLoadingMessage(1700, 2);
    this.schedule(() => {
      this.slots.set(this.buildSlots(id));
      this.boardState.set('configure');
    }, 2400);
  }


  // Re-open a user board in configure mode to tweak it
  editBoard(board: Board): void {
    this.drawerOpen.set(false);
    this.editingBoardId.set(board.id);
    this.slots.set(board.slots.map(s => ({
      uid: nextUid(),
      widgetType: s.widgetType,
      widgetSize: (s.cols === 1 && s.rows === 1 ? 'S' : s.cols === 2 && s.rows === 2 ? 'L' : 'M') as SlotSize,
      cols: s.cols,
      rows: s.rows,
      loading: false,
    })));
    this.boardState.set('configure');
  }

  private cycleLoadingMessage(delay: number, step: number): void {
    this.schedule(() => {
      this.loadingFade.set(true);
      this.schedule(() => {
        this.loadingStep.set(step);
        this.loadingFade.set(false);
      }, 300);
    }, delay);
  }

  switchLayout(id: LayoutId): void {
    this.selectedLayout.set(id);
    this.slots.set(this.buildSlots(id));
    this.drawerOpen.set(false);
  }

  // ── Save / cancel the board being configured ────────────────────────────────

  validateBoard(): void {
    const configured = this.slots().filter(s => s.widgetType);
    if (!configured.length) return;
    const cards = configured.map(s => ({ widgetType: s.widgetType, cols: s.cols, rows: s.rows }));

    const editId = this.editingBoardId();
    if (editId) {
      // Update existing board in place
      this.boards.update(arr => arr.map(b => b.id === editId ? { ...b, slots: cards } : b));
      this.currentBoardId.set(editId);
      this.toaster.show('Your changes are saved', { tone: 'success', title: 'Board updated' });
    } else {
      // Create a new board
      const id = nextBoardId();
      const count = this.boards().filter(b => !b.builtin).length + 1;
      this.boards.update(arr => [...arr, { id, builtin: false, name: `My board ${count}`, slots: cards }]);
      this.currentBoardId.set(id);
      this.toaster.show('Your board is saved', { tone: 'success', title: 'Board saved' });
    }
    this.exitConfigure();
  }

  private hasUnsavedWork(): boolean {
    return this.slots().some(s => s.widgetType || s.widgetSize);
  }

  cancelConfigure(): void {
    if (this.hasUnsavedWork()) {
      this.discardConfirmOpen.set(true);
      return;
    }
    this.exitConfigure();
  }

  confirmDiscard(): void {
    this.discardConfirmOpen.set(false);
    this.exitConfigure();
  }

  private exitConfigure(): void {
    this.boardState.set('ready');
    this.drawerOpen.set(false);
    this.editingBoardId.set(null);
  }

  // ── Board management (rename / delete) ───────────────────────────────────────

  startRename(board: Board): void {
    this.renamingBoardId.set(board.id);
    this.renameValue.set(board.name);
  }

  commitRename(): void {
    const id = this.renamingBoardId();
    const name = this.renameValue().trim();
    if (id && name) {
      this.boards.update(arr => arr.map(b => b.id === id ? { ...b, name } : b));
    }
    this.renamingBoardId.set(null);
  }

  cancelRename(): void {
    this.renamingBoardId.set(null);
  }

  deleteBoard(board: Board): void {
    this.boards.update(arr => arr.filter(b => b.id !== board.id));
    if (this.currentBoardId() === board.id) {
      this.currentBoardId.set(this.boards()[0]?.id ?? '');
    }
    this.toaster.show(`“${board.name}” was deleted`, { tone: 'success', title: 'Board deleted' });
  }

  setSlotType(i: number, val: string): void {
    if (!val) return;
    const uid = this.slots()[i]?.uid;
    // Mark loading, then reveal widget after short delay
    this.slots.update(arr => arr.map((s, idx) =>
      idx === i ? { ...s, widgetType: val, loading: true } : s
    ));
    // Track by uid (not index) — list may reorder during the delay
    this.schedule(() => {
      this.slots.update(arr => arr.map(s =>
        s.uid === uid ? { ...s, loading: false } : s
      ));
    }, 700);
  }

  setSlotSize(i: number, val: string): void {
    const size = val as SlotSize;
    if (!size) return;
    const cols: 1 | 2 = size === 'S' ? 1 : 2;
    const rows: 1 | 2 = size === 'L' ? 2 : 1;
    this.slots.update(arr => arr.map((s, idx) =>
      idx === i ? { ...s, widgetSize: size, cols, rows } : s
    ));
  }

  // Toolbar: set an explicit grid size on a card (cols × rows), any time
  setSlotDims(i: number, cols: 1 | 2, rows: 1 | 2): void {
    this.slots.update(arr => arr.map((s, idx) =>
      idx === i ? { ...s, cols, rows, widgetSize: this.dimsToSize(cols, rows) } : s
    ));
  }

  private dimsToSize(cols: 1 | 2, rows: 1 | 2): SlotSize {
    if (cols === 1 && rows === 1) return 'S';
    if (cols === 2 && rows === 2) return 'L';
    return 'M';
  }

  // Toolbar: duplicate a configured card
  duplicateSlot(i: number): void {
    this.slots.update(arr => {
      const src = arr[i];
      if (!src) return arr;
      const copy: SlotConfig = { ...src, uid: nextUid() };
      return [...arr.slice(0, i + 1), copy, ...arr.slice(i + 1)];
    });
  }

  // Toolbar: go back to type selection (keeps the chosen size)
  editSlotType(i: number): void {
    this.slots.update(arr => arr.map((s, idx) =>
      idx === i ? { ...s, widgetType: '', loading: false } : s
    ));
  }

  // ── Resize by dragging the bottom-right corner ───────────────────────────────
  // Snaps to grid steps: horizontal → cols 1|2, vertical → rows 1|2
  private resizeState: { index: number; startX: number; startY: number; cols: 1 | 2; rows: 1 | 2 } | null = null;

  startResize(ev: PointerEvent, i: number): void {
    ev.preventDefault();
    ev.stopPropagation();
    const slot = this.slots()[i];
    if (!slot) return;
    this.resizeState = { index: i, startX: ev.clientX, startY: ev.clientY, cols: slot.cols, rows: slot.rows };
    (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);
  }

  @HostListener('document:pointermove', ['$event'])
  onResizeMove(ev: PointerEvent): void {
    const r = this.resizeState;
    if (!r) return;
    const STEP = 160; // px per grid step
    const dCols = Math.round((ev.clientX - r.startX) / STEP);
    const dRows = Math.round((ev.clientY - r.startY) / STEP);
    const cols = Math.min(2, Math.max(1, r.cols + dCols)) as 1 | 2;
    const rows = Math.min(2, Math.max(1, r.rows + dRows)) as 1 | 2;
    const cur = this.slots()[r.index];
    if (cur && (cur.cols !== cols || cur.rows !== rows)) {
      this.setSlotDims(r.index, cols, rows);
    }
  }

  @HostListener('document:pointerup')
  onResizeEnd(): void { this.resizeState = null; }

  removeSlot(i: number): void {
    this.slots.update(arr => arr.filter((_, idx) => idx !== i));
  }

  addEmptySlot(): void {
    // Empty slot defaults to 1×1; type is picked from the drawer, size via toolbar
    this.slots.update(arr => [
      ...arr,
      { uid: nextUid(), widgetType: '', widgetSize: 'S', cols: 1, rows: 1, loading: false },
    ]);
  }

  // Select a "Pick a card" placeholder → open the drawer so the next pick fills it
  pickForSlot(uid: string): void {
    this.targetSlotUid.set(uid);
    this.openDrawer('cards');
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    this.targetSlotUid.set(null);
  }

  // Fill a specific placeholder with a widget type (loading → reveal)
  private fillSlot(uid: string, widgetType: string): void {
    this.slots.update(arr => arr.map(s =>
      s.uid === uid ? { ...s, widgetType, loading: true } : s
    ));
    this.schedule(() => {
      this.slots.update(arr => arr.map(s => s.uid === uid ? { ...s, loading: false } : s));
    }, 700);
  }

  // Click-to-add from the drawer. Priority: the explicitly-targeted placeholder,
  // then the first empty slot, otherwise append a fresh card.
  addCard(widgetType: string): void {
    const target = this.targetSlotUid();
    if (target && this.slots().some(s => s.uid === target && !s.widgetType)) {
      this.fillSlot(target, widgetType);
      this.targetSlotUid.set(null);
      this.drawerOpen.set(false);
      return;
    }
    const empty = this.slots().find(s => !s.widgetType && !s.loading);
    if (empty) {
      this.fillSlot(empty.uid, widgetType);
      return;
    }
    const uid = nextUid();
    this.slots.update(arr => [
      ...arr,
      { uid, widgetType, widgetSize: 'S', cols: 1, rows: 1, loading: true },
    ]);
    this.schedule(() => {
      this.slots.update(arr => arr.map(s => s.uid === uid ? { ...s, loading: false } : s));
    }, 700);
  }

  // ── Drag & drop — native HTML5. Deterministic: the browser fires dragover on
  //    the real slot under the pointer, so placement always matches the cue. ──

  // Reorder: a board slot starts dragging (whole card is draggable)
  onSlotDragStart(ev: DragEvent, uid: string): void {
    this.dragActive.set(true);
    this.draggingUid.set(uid);
    this.dragCardId.set(null);
    ev.dataTransfer?.setData('text/plain', uid);
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
  }

  // Add: a drawer card starts dragging
  onCardDragStart(ev: DragEvent, cardId: string): void {
    this.dragActive.set(true);
    this.draggingUid.set(null);
    this.dragCardId.set(cardId);
    ev.dataTransfer?.setData('text/plain', cardId);
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'copy';
  }

  onDragEnd(): void { this.resetDrag(); }

  private resetDrag(): void {
    this.dragActive.set(false);
    this.draggingUid.set(null);
    this.dragCardId.set(null);
    this.dropIndex.set(null);
    this.dropOnUid.set(null);
  }

  // Hover over a specific slot: decide replace-empty vs insert before/after.
  onSlotDragOver(ev: DragEvent, index: number, slot: SlotConfig): void {
    ev.preventDefault();
    ev.stopPropagation();
    if (slot.uid === this.draggingUid()) { this.dropIndex.set(null); this.dropOnUid.set(null); return; }

    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const rel  = (ev.clientX - rect.left) / rect.width; // 0..1 across the slot

    // Empty placeholder: centre third → fill it; side thirds → insert beside it.
    if (!slot.widgetType && !slot.loading) {
      if (rel > 0.25 && rel < 0.75) {
        this.dropOnUid.set(slot.uid);
        this.dropIndex.set(null);
      } else {
        this.dropOnUid.set(null);
        this.dropIndex.set(rel >= 0.75 ? index + 1 : index);
      }
      return;
    }

    // Filled card: insert before/after based on pointer half
    this.dropOnUid.set(null);
    this.dropIndex.set(rel > 0.5 ? index + 1 : index);
  }

  // Grid-level dragover: only authorise the drop. Never overwrite the target —
  // it stays whatever the last hovered slot (or the Add tile) computed, so the
  // gap between two cards doesn't reset the insertion point to "append".
  onGridDragOver(ev: DragEvent): void {
    ev.preventDefault();
  }

  // Hovering the trailing "Add card" tile → append at the end
  onAddTileDragOver(ev: DragEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.dropOnUid.set(null);
    this.dropIndex.set(this.slots().length);
  }

  onGridDrop(ev: DragEvent): void {
    ev.preventDefault();
    const onUid = this.dropOnUid();
    const index = this.dropIndex();
    const draggingUid = this.draggingUid();
    const cardId = this.dragCardId();

    // 1) Dropped onto an empty placeholder
    if (onUid) {
      if (cardId) this.fillSlot(onUid, cardId);                    // drawer → fill
      else if (draggingUid) this.moveIntoEmpty(draggingUid, onUid); // reorder → swap into empty
      this.resetDrag();
      return;
    }

    // 2) Insert / move at the computed index
    const at = index ?? this.slots().length;
    if (cardId) {
      const newSlot: SlotConfig = { uid: nextUid(), widgetType: cardId, widgetSize: 'S', cols: 1, rows: 1, loading: true };
      this.slots.update(arr => {
        const i = Math.max(0, Math.min(at, arr.length));
        return [...arr.slice(0, i), newSlot, ...arr.slice(i)];
      });
      this.schedule(() => {
        this.slots.update(arr => arr.map(s => s.uid === newSlot.uid ? { ...s, loading: false } : s));
      }, 700);
    } else if (draggingUid) {
      this.moveToIndex(draggingUid, at);
    }
    this.resetDrag();
  }

  // Move a slot so it lands at `targetIndex` (index in the current array)
  private moveToIndex(uid: string, targetIndex: number): void {
    this.slots.update(arr => {
      const from = arr.findIndex(s => s.uid === uid);
      if (from < 0) return arr;
      const without = [...arr.slice(0, from), ...arr.slice(from + 1)];
      // adjust index if we removed an element before the target
      const at = Math.max(0, Math.min(from < targetIndex ? targetIndex - 1 : targetIndex, without.length));
      return [...without.slice(0, at), arr[from], ...without.slice(at)];
    });
  }

  // Move an existing slot into an empty placeholder's spot (drops the empty)
  private moveIntoEmpty(uid: string, emptyUid: string): void {
    this.slots.update(arr => {
      const src = arr.find(s => s.uid === uid);
      if (!src) return arr;
      const without = arr.filter(s => s.uid !== uid);
      const at = without.findIndex(s => s.uid === emptyUid);
      if (at < 0) return arr;
      return [...without.slice(0, at), src, ...without.slice(at + 1)];
    });
  }

  widgetLabel(widgetType: string): string {
    return WIDGET_LABELS[widgetType] ?? this.customCardFor(widgetType)?.name ?? widgetType;
  }

  // ── Custom-card rendering ────────────────────────────────────────────────────

  // A widgetType resolves to a custom card when its id matches one we built
  customCardFor(widgetType: string): CustomCard | null {
    return this.customCards().find(c => c.id === widgetType) ?? null;
  }

  // Map a Figures block's picked data points → PropertySection[] (the shape the
  // properties panel already consumes across the board)
  figuresSection(block: CardBlock): PropertySection[] {
    const rows = (block.dataPointIds ?? [])
      .map(id => DATA_POINT_MAP[id])
      .filter(Boolean)
      .map(d => ({ label: d.label, value: d.value }));
    return [{ rows }];
  }

  metricFor(metricId: string | undefined): Metric | null {
    return metricId ? METRIC_MAP[metricId] ?? null : null;
  }

  // ── Card builder ─────────────────────────────────────────────────────────────

  // Build the empty zones a layout requires
  private blankZones(layoutId: string): CardZone[] {
    const def = CARD_LAYOUT_MAP[layoutId] ?? CARD_LAYOUTS[0];
    return Array.from({ length: def.zones }, () => ({ id: nextZoneId(), blocks: [] }));
  }

  openCardBuilder(): void {
    this.drawerOpen.set(false);   // the builder opens as a modal — close the drawer behind it
    this.editingCardId.set(null);
    this.builderStep.set('layout');
    this.selectedBlockKey.set(null);
    const zones = this.blankZones('stack');
    this.draftCard.set({ id: nextCustomCardId(), name: '', layoutId: 'stack', zones });
    this.builderOpen.set(true);
  }

  editCustomCard(id: string): void {
    const card = this.customCards().find(c => c.id === id);
    if (!card) return;
    this.drawerOpen.set(false);   // same: modal replaces the drawer
    this.editingCardId.set(id);
    this.builderStep.set('compose');
    this.selectedBlockKey.set(null);
    // Deep copy so edits don't mutate the live card until saved
    this.draftCard.set({
      id: card.id,
      name: card.name,
      layoutId: card.layoutId,
      zones: card.zones.map(z => ({
        id: z.id,
        blocks: z.blocks.map(b => ({ ...b, dataPointIds: b.dataPointIds ? [...b.dataPointIds] : undefined })),
      })),
    });
    this.builderOpen.set(true);
  }

  closeBuilder(): void {
    this.builderOpen.set(false);
    this.editingCardId.set(null);
  }

  // Step 1 → pick the skeleton. Changing layout re-shapes the zones, preserving
  // blocks where possible (flatten then re-spread across the new zones).
  selectCardLayout(layoutId: string): void {
    this.draftCard.update(c => {
      if (c.layoutId === layoutId && c.zones.length) return c;
      const def = CARD_LAYOUT_MAP[layoutId] ?? CARD_LAYOUTS[0];
      const carried = c.zones.flatMap(z => z.blocks);
      const zones: CardZone[] = Array.from({ length: def.zones }, () => ({ id: nextZoneId(), blocks: [] }));
      // Keep existing content: drop everything into the first zone
      if (carried.length) zones[0].blocks = carried;
      this.selectedBlockKey.set(null);
      return { ...c, layoutId, zones };
    });
  }

  goToCompose(): void {
    this.builderStep.set('compose');
  }

  backToLayout(): void { this.builderStep.set('layout'); }

  layoutLabel(layoutId: string): string { return CARD_LAYOUT_MAP[layoutId]?.label ?? layoutId; }

  // ── Canvas + inspector (select on the canvas, edit on the right) ────────────
  private blockKey(zoneId: string, blockId: string): string { return `${zoneId}:${blockId}`; }

  isBlockSelected(zoneId: string, blockId: string): boolean {
    return this.selectedBlockKey() === this.blockKey(zoneId, blockId);
  }

  // Select a block on the canvas → its editor shows in the inspector (set, not
  // toggle: the selection stays visible while editing on the right).
  selectBlock(zoneId: string, blockId: string): void {
    this.selectedBlockKey.set(this.blockKey(zoneId, blockId));
  }

  // The selected block resolved against the live draft (null if none / deleted)
  selectedBlock = computed<{ zoneId: string; block: CardBlock } | null>(() => {
    const key = this.selectedBlockKey();
    if (!key) return null;
    const [zoneId, blockId] = key.split(':');
    const zone = this.draftCard().zones.find(z => z.id === zoneId);
    const block = zone?.blocks.find(b => b.id === blockId);
    return block ? { zoneId, block } : null;
  });

  // Add a block from the inline tile row → drop it in the zone and select it
  // (so it appears straight away in the inspector, ready to fill).
  addBlockFromMenu(zoneId: string, kind: BlockKind): void {
    const block = this.newBlock(kind);
    this.draftCard.update(c => ({
      ...c,
      zones: c.zones.map(z => z.id === zoneId ? { ...z, blocks: [...z.blocks, block] } : z),
    }));
    this.selectedBlockKey.set(this.blockKey(zoneId, block.id));
  }

  blockKindLabel(kind: BlockKind): string {
    return BLOCK_KINDS.find(b => b.kind === kind)?.label ?? kind;
  }
  blockKindIcon(kind: BlockKind): IconName {
    return BLOCK_KINDS.find(b => b.kind === kind)?.icon ?? 'grid';
  }

  setCardName(name: string): void {
    this.draftCard.update(c => ({ ...c, name }));
  }

  private newBlock(kind: BlockKind): CardBlock {
    const block: CardBlock = { id: nextBlockId(), kind };
    if (kind === 'figures') block.dataPointIds = [];
    if (kind === 'chart')   block.metricId = METRIC_CATALOG[0]?.id;
    if (kind === 'heading') block.text = '';
    if (kind === 'note')    block.text = '';
    return block;
  }

  removeBlock(zoneId: string, blockId: string): void {
    this.draftCard.update(c => ({
      ...c,
      zones: c.zones.map(z => z.id === zoneId ? { ...z, blocks: z.blocks.filter(b => b.id !== blockId) } : z),
    }));
  }

  moveBlock(zoneId: string, blockId: string, dir: -1 | 1): void {
    this.draftCard.update(c => ({
      ...c,
      zones: c.zones.map(z => {
        if (z.id !== zoneId) return z;
        const i = z.blocks.findIndex(b => b.id === blockId);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= z.blocks.length) return z;
        const blocks = [...z.blocks];
        [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
        return { ...z, blocks };
      }),
    }));
  }

  private updateBlock(zoneId: string, blockId: string, patch: Partial<CardBlock>): void {
    this.draftCard.update(c => ({
      ...c,
      zones: c.zones.map(z => z.id === zoneId
        ? { ...z, blocks: z.blocks.map(b => b.id === blockId ? { ...b, ...patch } : b) }
        : z),
    }));
  }

  setBlockText(zoneId: string, blockId: string, text: string): void {
    this.updateBlock(zoneId, blockId, { text });
  }

  setBlockMetric(zoneId: string, blockId: string, metricId: string): void {
    this.updateBlock(zoneId, blockId, { metricId });
  }

  toggleDataPoint(zoneId: string, block: CardBlock, dpId: string): void {
    const cur = block.dataPointIds ?? [];
    // Add → append (becomes last in display order). Remove → drop it.
    const next = cur.includes(dpId) ? cur.filter(x => x !== dpId) : [...cur, dpId];
    this.updateBlock(zoneId, block.id, { dataPointIds: next });
  }

  // The chosen data points, in display order (the order of dataPointIds)
  selectedDataPoints(block: CardBlock): DataPoint[] {
    return (block.dataPointIds ?? []).map(id => DATA_POINT_MAP[id]).filter(Boolean);
  }

  // ── Figures field search picker ──────────────────────────────────────────────
  fieldQuery(blockId: string): string { return this.fieldSearch()[blockId] ?? ''; }

  setFieldQuery(blockId: string, q: string): void {
    this.fieldSearch.update(m => ({ ...m, [blockId]: q }));
  }

  // Catalogue minus already-selected, filtered by the search query (label or category)
  fieldResults(block: CardBlock): DataPoint[] {
    const chosen = new Set(block.dataPointIds ?? []);
    const q = (this.fieldSearch()[block.id] ?? '').trim().toLowerCase();
    return DATA_CATALOG.filter(d => !chosen.has(d.id)).filter(d =>
      !q || d.label.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    );
  }

  // Add a field from the search results and clear the query
  addField(zoneId: string, block: CardBlock, dpId: string): void {
    if ((block.dataPointIds ?? []).includes(dpId)) return;
    this.updateBlock(zoneId, block.id, { dataPointIds: [...(block.dataPointIds ?? []), dpId] });
    this.setFieldQuery(block.id, '');
  }

  // Reorder a chosen field within the block — drives its position in the card
  moveDataPoint(zoneId: string, block: CardBlock, dpId: string, dir: -1 | 1): void {
    const cur = [...(block.dataPointIds ?? [])];
    const i = cur.indexOf(dpId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= cur.length) return;
    [cur[i], cur[j]] = [cur[j], cur[i]];
    this.updateBlock(zoneId, block.id, { dataPointIds: cur });
  }

  private blockHasContent(b: CardBlock): boolean {
    return (b.kind === 'figures' && (b.dataPointIds?.length ?? 0) > 0)
      || (b.kind === 'chart'   && !!b.metricId)
      || ((b.kind === 'heading' || b.kind === 'note') && !!b.text?.trim());
  }

  // A draft is valid once it has a name and at least one block carrying content
  canSaveCustomCard = computed(() => {
    const c = this.draftCard();
    if (!c.name.trim()) return false;
    return c.zones.some(z => z.blocks.some(b => this.blockHasContent(b)));
  });

  validateCustomCard(): void {
    if (!this.canSaveCustomCard()) return;
    const card = this.draftCard();
    const editId = this.editingCardId();
    if (editId) {
      this.customCards.update(arr => arr.map(c => c.id === editId ? card : c));
      this.toaster.show('Your changes are saved', { tone: 'success', title: 'Card updated' });
    } else {
      this.customCards.update(arr => [...arr, card]);
      this.toaster.show('Your card is ready to drop on a board', { tone: 'success', title: 'Card created' });
    }
    this.closeBuilder();
  }

  deleteCustomCard(id: string): void {
    this.customCards.update(arr => arr.filter(c => c.id !== id));
  }

  private buildSlots(id: LayoutId): SlotConfig[] {
    const layout = LAYOUTS.find(l => l.id === id)!;
    return layout.slots.map(s => ({
      uid: nextUid(),
      widgetType: '',
      widgetSize: (s.cols === 1 && s.rows === 1 ? 'S' : s.cols === 2 && s.rows === 2 ? 'L' : 'M') as 'S' | 'M' | 'L',
      cols: s.cols,
      rows: s.rows,
      loading: false,
    }));
  }

  ngOnInit(): void {
    this.routeId.set(this.route.snapshot.paramMap.get('id') ?? '');
    if (this.store.consumeJustCreated()) {
      this.toaster.show('Company created', { tone: 'success', title: 'Success' });
    }
    this.schedule(() => this.loading.set(false), PROVIDER_DELAY_MS);
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
    this.timers.clear();
  }
}
