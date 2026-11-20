import {
  Component, ElementRef, HostListener, Injector, OnDestroy, OnInit, afterNextRender,
  computed, effect, inject, signal, viewChild, viewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import {
  BreadcrumbsComponent,
  CrumbComponent,
  TopboxComponent,
  PageHeaderComponent,
  PageTitleComponent,
  CardComponent,
  ChartComponent,
  PropertiesPanelComponent,
  ModalComponent,
  ButtonComponent,
  ButtonIconComponent,
  IconComponent,
  BadgeComponent,
  GradeComponent,
  LinkComponent,
  FlyoutMenuComponent,
  FlyoutMenuItemComponent,
  FlyoutMenuTitleComponent,
  DividerComponent,
  DrawerComponent,
  SelectComponent,
  InputTextComponent,
  RadioCardComponent,
  ConfirmDialogComponent,
  InlineEditComponent,
  type SelectOption,
} from '../../shared/ui';
import { type BuyerCompany } from '../buyer-summary/buyer-summary.store';
import { SECTIONS } from '../../user-testing/mocks';
import { type PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { ToasterService } from '../../shared/ui/toaster/toaster.service';
import { BuyerSummaryStore } from '../buyer-summary/buyer-summary.store';
import { ViewedBuyersStore } from '../buyer-summary/viewed-buyers.store';
import {
  type BentoCard, type BentoFormat, type BentoKind, type Emphasis, type EmphasisChoice, EMPHASES, EMPHASIS_MAP,
  FORMATS, FORMAT_GROUPS, FORMAT_MAP, KINDS,
  MONTHS, GRADE_HISTORY, GRADE_Y, GRADE_CHANGES, EXPOSURE_TREND, SCORE_TREND,
  PAYMENT_BANDS, FIN_YEARS, FINANCIALS, TURNOVER_TREND, TURNOVER_YEARS, JOBS, NEWS,
  NOTES, IDENTITY, DECISIONS, POLICIES, COVER_HISTORY,
  OVERDUE_PERIODS, OVERDUE_EVENTS, PAYMENT_MONTHS, POLICY_MOVES,
} from './buyer-summary-v2.data';
import { type Placed, packCards } from './bento-layout';
import {
  type Board, type TemplateId, TEMPLATES, TEMPLATE_MAP,
  cloneCards, templateBoards, loadBoards, saveBoards, newId,
} from './buyer-summary-v2.boards';

export { type Placed } from './bento-layout';

const DEFAULT_COMPANY: BuyerCompany = {
  name: 'Immobilière du Marais',
  companyId: '137381425',
  city: 'BHV',
  address: '34 RUE DE LA VERRIÈRE - 75004 - PARIS 4 - FRANCE',
};

// ── Layout constants (benchmark section 3.1 and 4) ───────────────────────────
// Candidates for Semantic layout tokens: container queries and JS can't read a
// var(), so they live here for the prototype.
const MIN_COL_PX = 172;
const COL_STEPS = [12, 8, 6, 4, 2];

// ── Motion constants (benchmark section 5.2) ─────────────────────────────────
// Candidates for --semantic-motion-* tokens (none exist today).
const MOTION_MS        = 240;
const MOTION_EASE      = 'cubic-bezier(0.2, 0, 0, 1)';
const LAND_MS          = 280;
const LAND_EASE        = 'cubic-bezier(0.05, 0.7, 0.1, 1)';
const BOARD_NAME_MAX   = 40;   // characters (edit-flow benchmark 2.2)
const DRAG_THRESHOLD   = 6;    // px before a press becomes a drag
const MOVE_COOLDOWN_MS = 140;  // hysteresis between two reorders

interface PressState { id: string; el: HTMLElement; x: number; y: number; }
interface DragState {
  id: string;
  el: HTMLElement;
  offX: number; offY: number;      // pointer offset inside the card
  lastX: number; lastY: number;
  origin: BentoCard[];             // order before the drag (Escape restores it)
  lastMove: number;
}

@Component({
  selector: 'app-buyer-summary-v2',
  standalone: true,
  imports: [
    TopboxTestShellComponent,
    BreadcrumbsComponent,
    CrumbComponent,
    TopboxComponent,
    PageHeaderComponent,
    PageTitleComponent,
    CardComponent,
    ChartComponent,
    PropertiesPanelComponent,
    ModalComponent,
    ButtonComponent,
    ButtonIconComponent,
    IconComponent,
    BadgeComponent,
    GradeComponent,
    LinkComponent,
    FlyoutMenuComponent,
    FlyoutMenuItemComponent,
    FlyoutMenuTitleComponent,
    DividerComponent,
    DrawerComponent,
    SelectComponent,
    InputTextComponent,
    RadioCardComponent,
    ConfirmDialogComponent,
    InlineEditComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './buyer-summary-v2.component.html',
  styleUrl: './buyer-summary-v2.component.scss',
})
export class BuyerSummaryV2Component implements OnInit, OnDestroy {
  private route    = inject(ActivatedRoute);
  private store    = inject(BuyerSummaryStore);
  private viewed   = inject(ViewedBuyersStore);
  private toaster  = inject(ToasterService);
  private injector = inject(Injector);

  company  = this.store.current;
  routeId  = signal<string>('');

  view = computed<BuyerCompany>(() => {
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

  // ── Data exposed to the template ───────────────────────────────────────────
  readonly KINDS = KINDS;
  readonly FORMAT_GROUPS = FORMAT_GROUPS;
  readonly months = MONTHS;
  // One label out of two: eight labels collide below 3 columns
  readonly sparseMonths = MONTHS.map((m, i) => (i % 2 === 0 ? m : ''));
  readonly gradeHistory = GRADE_HISTORY;
  readonly gradeY = GRADE_Y;
  readonly gradeChanges = GRADE_CHANGES;
  readonly exposureTrend = EXPOSURE_TREND;
  readonly scoreTrend = SCORE_TREND;
  readonly paymentBands = PAYMENT_BANDS;
  readonly finYears = FIN_YEARS;
  readonly financials = FINANCIALS;
  readonly turnoverTrend = TURNOVER_TREND;
  readonly turnoverYears = TURNOVER_YEARS;
  readonly jobs = JOBS;
  readonly news = NEWS;
  readonly notes = NOTES;
  readonly identity = IDENTITY;
  readonly decisions = DECISIONS;
  readonly policies = POLICIES;
  readonly coverHistory = COVER_HISTORY;
  readonly overduePeriods = OVERDUE_PERIODS;
  readonly overdueEvents = OVERDUE_EVENTS;
  readonly paymentMonths = PAYMENT_MONTHS;
  readonly policyMoves = POLICY_MOVES;

  // Label / value lists that show as many rows as their card holds
  readonly limitKv = [
    { label: 'Granted', value: '5 000 000' }, { label: 'Used', value: '1 548 000' },
    { label: 'Granted on', value: '11 Nov 2024' }, { label: 'Expiry', value: 'None' }, { label: 'Policies', value: '6' },
  ];
  readonly riskKv = [
    { label: 'Highest limit', value: '10.0 bn' }, { label: 'Exposure', value: '1.55 M' },
    { label: 'Policies', value: '6' }, { label: 'Updated', value: '11 Nov 2024' },
  ];
  readonly scoreKv = [
    { label: 'Updated', value: '11 Nov 2024' }, { label: 'Sector', value: '74 / 100' },
    { label: '12 months ago', value: '80' }, { label: 'Lowest, 18 m', value: '78' },
  ];
  readonly exposureKv = [
    { label: 'Granted limit', value: '5 000 000' }, { label: 'Available', value: '3 452 000' },
    { label: 'Policies', value: '6' }, { label: 'Limits on market', value: '72' },
    { label: 'Highest limit', value: '10 000 246 000' },
  ];
  readonly reviewKv = [
    { label: 'Last review', value: '12 Jun 2024' }, { label: 'Owner', value: 'C. Morel' },
    { label: 'Policies', value: '6' }, { label: 'Priority', value: 'Medium' },
  ];
  readonly sanctionKv = [
    { label: 'List', value: 'EU' }, { label: 'Screened', value: '28 Oct 2024' },
    { label: 'Status', value: 'Proof asked' }, { label: 'Owner', value: 'J. Petit' },
  ];
  readonly paymentKv = [
    { label: 'Average delay', value: '3 days' }, { label: 'DSO', value: '47 days' },
    { label: 'Invoices', value: '1 284' }, { label: 'Disputes', value: 'None' },
  ];
  readonly limitFacts: PropertySection[] = [{ rows: [
    { label: 'Granted', value: '5 000 000' },
    { label: 'Used',    value: '1 548 000' },
    { label: 'Available', value: '3 452 000' },
  ] }];
  readonly limitMore: PropertySection[] = [{ rows: [
    { label: 'Granted on', value: '11 Nov 2024' },
    { label: 'Expiry',     value: 'None' },
    { label: 'Policies',   value: '6' },
  ] }];
  readonly exposureFacts: PropertySection[] = [{ rows: [
    { label: 'Granted limit', value: '5 000 000' },
    { label: 'Available',     value: '3 452 000' },
    { label: 'Policies',      value: '6' },
  ] }];
  readonly overdueFacts: PropertySection[] = [{ rows: [
    { label: 'Oldest',      value: 'N/A' },
    { label: 'Disputes',    value: 'None' },
    { label: 'Collections', value: '0 open' },
    { label: 'Claims, 24 m', value: '0' },
  ] }];
  readonly paymentFacts: PropertySection[] = [{ rows: [
    { label: 'Average delay', value: '3 days' },
    { label: 'DSO',           value: '47 days' },
    { label: 'Invoices',      value: '1 284' },
  ] }];
  readonly scoreFacts: PropertySection[] = [{ rows: [
    { label: 'Updated', value: '11 Nov 2024' },
    { label: 'Sector',  value: '74 / 100' },
  ] }];
  readonly riskFacts: PropertySection[] = [{ rows: [
    { label: 'Highest limit', value: '10 000 246 000' },
    { label: 'Exposure',      value: '1 548 000' },
  ] }];
  readonly coverFacts: PropertySection[] = [{ rows: [
    { label: 'Requested', value: '2 000 000' },
    { label: 'Granted',   value: '2 000 000' },
    { label: 'Decided',   value: '11 Nov 2024' },
    { label: 'By',        value: 'C. Morel' },
  ] }];

  // ── Boards (templates + personal boards), saved in localStorage ───────────
  readonly TEMPLATES = TEMPLATES;
  private stored = loadBoards();
  boards         = signal<Board[]>(this.stored?.boards ?? templateBoards());
  currentBoardId = signal<string>(this.stored?.current ?? 'common');
  currentBoard   = computed(() => this.boards().find(b => b.id === this.currentBoardId()) ?? this.boards()[0]);
  boardOptions   = computed<SelectOption[]>(() => this.boards().map(b => ({ value: b.id, label: b.name })));

  // Manage boards drawer (V1 "Manage boards" panel)
  drawerOpen   = signal<boolean>(false);
  drawerView   = signal<'boards' | 'create'>('boards');
  newBoardName = signal<string>('');
  newBoardFrom = signal<'current' | 'empty' | TemplateId>('current');
  deleteTarget = signal<Board | null>(null);

  // ── Board model: working copy of the current board's cards ────────────────
  cards   = signal<BentoCard[]>(cloneCards(this.currentBoard()?.cards ?? []));
  cols    = signal<number>(6);
  editing = signal<boolean>(false);
  dragId  = signal<string | null>(null);
  openMenuId = signal<string | null>(null);
  menuView   = signal<'format' | 'emphasis'>('format');
  announcement = signal<string>('');

  // While dragging, no settling swaps: the lifted card's spot stays predictable
  placed   = computed(() => packCards(this.cards(), this.cols(), this.dragId() === null));
  ghost    = computed(() => this.placed().find(p => p.card.id === this.dragId()) ?? null);
  rowCount = computed(() => this.placed().reduce((m, p) => Math.max(m, p.y + p.h), 0));

  private wrapRef  = viewChild<ElementRef<HTMLElement>>('wrap');
  private gridRef  = viewChild<ElementRef<HTMLElement>>('grid');
  private cellRefs = viewChildren<ElementRef<HTMLElement>>('cell');

  private resizeObs: ResizeObserver | null = null;
  private press: PressState | null = null;
  private drag: DragState | null = null;
  private reducedMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    // Lists fit their card: re-measure after every layout change
    effect(() => {
      this.placed();
      this.scheduleFit();
    });
    afterNextRender(() => {
      const wrap = this.wrapRef()?.nativeElement;
      if (!wrap || typeof ResizeObserver === 'undefined') return;
      this.resizeObs = new ResizeObserver(entries => {
        const width = entries[0]?.contentRect.width ?? 0;
        this.cols.set(this.colsFor(width));
        this.scheduleFit();
      });
      this.resizeObs.observe(wrap);
    });
  }

  /** Largest even column count whose columns stay ≥ 172 px; 1 below 360 px. */
  private colsFor(width: number): number {
    const gap = this.gapPx();
    for (const n of COL_STEPS) {
      if (n * MIN_COL_PX + (n - 1) * gap <= width) return n;
    }
    return 1;
  }

  private gapPx(): number {
    const grid = this.gridRef()?.nativeElement;
    if (!grid) return 16;
    return parseFloat(getComputedStyle(grid).columnGap) || 0;
  }

  // ── Fit lists: as many items as the card holds, then "+ n more" ─────────

  private fitFrame = 0;

  private scheduleFit(): void {
    if (typeof requestAnimationFrame === 'undefined') return;
    cancelAnimationFrame(this.fitFrame);
    this.fitFrame = requestAnimationFrame(() => this.fitLists());
  }

  private fitLists(): void {
    const grid = this.gridRef()?.nativeElement;
    if (!grid) return;
    for (const fit of Array.from(grid.querySelectorAll<HTMLElement>('.bc-fit'))) {
      const items = Array.from(fit.querySelectorAll<HTMLElement>('.bc-fit__item'));
      const more = fit.querySelector<HTMLElement>('.bc-fit__more');
      items.forEach(i => (i.hidden = false));
      fit.classList.remove('bc-fit--none', 'bc-fit--full');
      const prev = fit.previousElementSibling as HTMLElement | null;
      if (prev?.classList.contains('bc-fit-label')) prev.hidden = false;
      if (more) more.hidden = true;
      if (getComputedStyle(fit).display === 'none') continue;
      const min = Number(fit.dataset['min'] ?? 0);
      const visible = items.filter(i => getComputedStyle(i).display !== 'none');
      let hidden = 0;
      while (fit.scrollHeight > fit.clientHeight + 1 && hidden < visible.length - min) {
        visible[visible.length - 1 - hidden].hidden = true;
        hidden++;
        if (more) {
          more.hidden = false;
          more.textContent = (more.dataset['tpl'] ?? '+ {n} more').replace('{n}', String(hidden));
        }
      }
      // The "more" line alone must not overflow; nothing shown = no label either
      const none = visible.length > 0 && hidden === visible.length;
      if (more && (none || fit.scrollHeight > fit.clientHeight + 1)) more.hidden = true;
      fit.classList.toggle('bc-fit--full', hidden > 0 && !none);
      fit.classList.toggle('bc-fit--none', none);
      const label = fit.previousElementSibling as HTMLElement | null;
      if (label?.classList.contains('bc-fit-label')) label.hidden = none;
    }
  }

  // ── Template helpers ───────────────────────────────────────────────────────

  cellClass(p: Placed): string {
    return `bento-cell--x${p.x + 1} bento-cell--y${p.y + 1} bento-cell--w${p.w} bento-cell--h${p.h}`;
  }

  gridClass(): string {
    return `bento--c${this.cols()}`;
  }

  kindOf(kind: BentoKind) { return KINDS[kind]; }

  formatsOf(group: string): BentoFormat[] {
    return FORMATS.filter(f => f.group === group);
  }

  formatLabel(id: string): string { return FORMAT_MAP[id]?.label ?? id; }

  position(id: string): number {
    return this.placed().findIndex(p => p.card.id === id) + 1;
  }

  /** Visibility class of the i-th item of a list, by card height. */
  rowLevel(i: number, base: number, perStep: number): string {
    if (i < base) return '';
    if (i < base + perStep) return 'h2';
    if (i < base + perStep * 2) return 'h3';
    return 'h4';
  }

  // ── Edit mode ──────────────────────────────────────────────────────────────

  startEditing(): void {
    this.editing.set(true);
    this.announce('Edit mode. Drag a card by its handle to move it. With the keyboard, focus the handle, press Space, then the arrow keys.');
  }

  stopEditing(): void {
    this.cancelPress();
    this.closeMenu();
    this.keyGrab.set(null);
    this.editing.set(false);
    this.saveCurrentCards();
    this.announce('Board saved.');
    this.toaster.show('Your board layout is saved', { tone: 'success', title: 'Board updated' });
  }

  /** Cards of the board's template (a copy), or null for a board started empty. */
  private templateCards(board: Board | undefined): BentoCard[] | null {
    const t = board?.template ? TEMPLATE_MAP[board.template] : null;
    return t ? cloneCards(t.cards) : null;
  }

  canReset = computed(() => !!this.currentBoard()?.template);

  resetBoard(): void {
    this.closeMenu();
    const cards = this.templateCards(this.currentBoard());
    if (!cards) return;
    this.mutate(() => this.cards.set(cards));
    this.announce(`Board reset to the ${TEMPLATE_MAP[this.currentBoard().template!].name} template.`);
  }

  // ── Boards: switch, create, duplicate, rename, delete ──────────────────────

  private persist(): void {
    saveBoards(this.currentBoardId(), this.boards());
  }

  private saveCurrentCards(): void {
    const id = this.currentBoardId();
    const cards = cloneCards(this.cards());
    this.boards.update(arr => arr.map(b => (b.id === id ? { ...b, cards } : b)));
    this.persist();
  }

  selectBoard(id: string): void {
    if (!id || id === this.currentBoardId() || this.editing()) return;
    const board = this.boards().find(b => b.id === id);
    if (!board) return;
    this.closeMenu();
    this.currentBoardId.set(id);
    this.cards.set(cloneCards(board.cards));
    this.persist();
    this.announce(`${board.name} board, ${board.cards.length} cards.`);
  }

  openBoardsDrawer(): void {
    this.drawerView.set('boards');
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  /** Unique name: "My board", "My board 2"... */
  private uniqueName(base: string, except?: string): string {
    const taken = new Set(this.boards().filter(b => b.id !== except).map(b => b.name.toLowerCase()));
    if (!taken.has(base.toLowerCase())) return base;
    let n = 2;
    while (taken.has(`${base} ${n}`.toLowerCase())) n++;
    return `${base} ${n}`;
  }

  openCreateBoard(): void {
    this.newBoardFrom.set('current');
    this.newBoardName.set(this.uniqueName(`Copy of ${this.currentBoard().name}`));
    this.drawerView.set('create');
    this.drawerOpen.set(true);
  }

  pickNewBoardSource(from: 'current' | 'empty' | TemplateId): void {
    this.newBoardFrom.set(from);
    const name = from === 'current' ? `Copy of ${this.currentBoard().name}`
      : from === 'empty' ? 'My board' : `My ${TEMPLATE_MAP[from].name}`;
    this.newBoardName.set(this.uniqueName(name));
  }

  newBoardNameError = computed(() => {
    const name = this.newBoardName().trim();
    if (!name) return 'Give the board a name';
    if (name.length > BOARD_NAME_MAX) return `${BOARD_NAME_MAX} characters at most`;
    if (this.boards().some(b => b.name.toLowerCase() === name.toLowerCase())) return 'A board already has this name';
    return '';
  });

  createBoard(): void {
    if (this.newBoardNameError()) return;
    const from = this.newBoardFrom();
    const source = from === 'current' ? this.cards()
      : from === 'empty' ? [] : TEMPLATE_MAP[from].cards;
    const board: Board = {
      id: newId('board'),
      name: this.newBoardName().trim(),
      builtin: false,
      template: from === 'current' ? this.currentBoard().template : from === 'empty' ? null : from,
      cards: source.map(c => ({ ...c, id: newId(c.kind) })),
    };
    this.boards.update(arr => [...arr, board]);
    this.drawerOpen.set(false);
    this.currentBoardId.set(board.id);
    this.cards.set(cloneCards(board.cards));
    this.persist();
    this.toaster.show(`“${board.name}” is ready`, { tone: 'success', title: 'Board created' });
    this.announce(`${board.name} created.`);
    // An empty board goes straight to edit mode: there is nothing to read yet
    if (!board.cards.length) this.startEditing();
  }

  duplicateBoard(board: Board): void {
    const copy: Board = {
      ...board,
      id: newId('board'),
      name: this.uniqueName(`Copy of ${board.name}`),
      builtin: false,
      cards: (board.id === this.currentBoardId() ? this.cards() : board.cards).map(c => ({ ...c, id: newId(c.kind) })),
    };
    const i = this.boards().findIndex(b => b.id === board.id);
    this.boards.update(arr => [...arr.slice(0, i + 1), copy, ...arr.slice(i + 1)]);
    this.currentBoardId.set(copy.id);
    this.cards.set(cloneCards(copy.cards));
    this.persist();
    this.announce(`${copy.name} created and opened.`);
  }

  renameError(board: Board, name: string): string {
    const n = name.trim();
    if (!n) return 'Give the board a name';
    if (n.length > BOARD_NAME_MAX) return `${BOARD_NAME_MAX} characters at most`;
    if (this.boards().some(b => b.id !== board.id && b.name.toLowerCase() === n.toLowerCase())) return 'A board already has this name';
    return '';
  }

  renameBoard(board: Board, name: string): void {
    const error = this.renameError(board, name);
    if (error) {
      this.toaster.show(error, { tone: 'warning', title: 'Name not saved' });
      // Re-render the field with the previous name
      this.boards.update(arr => [...arr]);
      return;
    }
    this.boards.update(arr => arr.map(b => (b.id === board.id ? { ...b, name: name.trim() } : b)));
    this.persist();
    this.announce(`Board renamed ${name.trim()}.`);
  }

  askDeleteBoard(board: Board): void {
    this.deleteTarget.set(board);
  }

  confirmDeleteBoard(): void {
    const board = this.deleteTarget();
    this.deleteTarget.set(null);
    if (!board || board.builtin) return;
    const i = this.boards().findIndex(b => b.id === board.id);
    this.boards.update(arr => arr.filter(b => b.id !== board.id));
    if (this.currentBoardId() === board.id) {
      // Back to the previous board, or Common
      const next = this.boards()[Math.max(0, i - 1)] ?? this.boards()[0];
      this.currentBoardId.set(next.id);
      this.cards.set(cloneCards(next.cards));
    }
    this.persist();
    this.toaster.show(`“${board.name}” was deleted`, { tone: 'success', title: 'Board deleted' });
  }

  // ── Card toolbar (V1 floating toolbar): formats, emphasis, handle ──────────

  /** Formats offered as segments, as in V1; the 14 are in the "More" list. */
  readonly QUICK_FORMATS = ['1x1', '2x1', '2x2'];
  readonly EMPHASES = EMPHASES;

  toggleMenu(id: string, view: 'format' | 'emphasis'): void {
    const open = this.openMenuId() === id && this.menuView() === view;
    this.openMenuId.set(open ? null : id);
    this.menuView.set(view);
  }

  closeMenu(): void {
    this.openMenuId.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    if (this.openMenuId() === null) return;
    // composedPath: the clicked item may already be gone (menu re-render)
    const inside = ev.composedPath().some(n => n instanceof HTMLElement && n.classList.contains('bs-toolbar'));
    if (inside) return;
    this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.drag) { this.cancelDrag(); return; }
    if (this.openMenuId() !== null) {
      this.closeMenu();
    }
  }

  setFormat(id: string, format: string): void {
    this.closeMenu();
    this.mutate(() => this.cards.update(arr => arr.map(c => (c.id === id ? { ...c, format } : c))));
    this.announce(`${this.titleOf(id)} is now ${this.formatLabel(format)}.`);
  }

  setEmphasis(id: string, emphasis: Emphasis): void {
    this.closeMenu();
    this.cards.update(arr => arr.map(c => (c.id === id ? { ...c, emphasis } : c)));
    this.announce(`${this.titleOf(id)}: emphasis ${EMPHASIS_MAP[emphasis].label}.`);
  }

  emphasisOf(e: EmphasisChoice) { return EMPHASIS_MAP[e === 'auto' ? 'none' : e]; }

  duplicateCard(id: string): void {
    const arr = this.cards();
    const i = arr.findIndex(c => c.id === id);
    if (i < 0) return;
    const copy: BentoCard = { ...arr[i], id: newId(arr[i].kind), emphasis: 'auto' };
    this.mutate(() => this.cards.set([...arr.slice(0, i + 1), copy, ...arr.slice(i + 1)]));
    this.announce(`${this.titleOf(id)} duplicated.`);
  }

  removeCard(id: string): void {
    const name = this.titleOf(id);
    this.mutate(() => this.cards.update(arr => arr.filter(c => c.id !== id)));
    this.announce(`${name} removed. Reset layout brings it back.`);
  }


  // ── Keyboard move on the handle (no extra UI) ──────────────────────────────
  // Space or Enter picks the card up, arrows move it one place in the reading
  // order, Space or Enter drops it, Escape puts it back.
  keyGrab = signal<{ id: string; origin: BentoCard[] } | null>(null);

  onHandleKey(ev: KeyboardEvent, id: string): void {
    const grab = this.keyGrab();
    if (ev.key === ' ' || ev.key === 'Enter') {
      ev.preventDefault();
      if (grab?.id === id) {
        this.keyGrab.set(null);
        this.announce(`${this.titleOf(id)} dropped at position ${this.position(id)} of ${this.cards().length}.`);
      } else {
        this.keyGrab.set({ id, origin: this.cards() });
        this.announce(`${this.titleOf(id)} picked up, position ${this.position(id)} of ${this.cards().length}. Use the arrow keys, then Space to drop.`);
      }
      return;
    }
    if (ev.key === 'Escape' && grab?.id === id) {
      ev.preventDefault();
      ev.stopPropagation();
      this.keyGrab.set(null);
      this.mutate(() => this.cards.set(grab.origin));
      this.announce(`Move cancelled. ${this.titleOf(id)} is back at position ${this.position(id)}.`);
      this.focusHandle(id);
      return;
    }
    if (grab?.id !== id) return;
    const step = ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? -1
      : ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1 : 0;
    if (!step) return;
    ev.preventDefault();
    const order = this.placed().map(p => p.card.id);
    const pos = order.indexOf(id);
    const target = Math.max(0, Math.min(order.length - 1, pos + step));
    if (target === pos) return;
    const visual = order.filter(x => x !== id);
    visual.splice(target, 0, id);
    const byId = new Map(this.cards().map(c => [c.id, c]));
    this.mutate(() => this.cards.set(visual.map(x => byId.get(x)!)));
    this.announce(`Position ${this.position(id)} of ${order.length}.`);
    this.focusHandle(id);
  }

  private titleOf(id: string): string {
    const c = this.cards().find(x => x.id === id);
    return c ? KINDS[c.kind].short : id;
  }

  private announce(msg: string): void {
    // Clear first so the same message is read again
    this.announcement.set('');
    queueMicrotask(() => this.announcement.set(msg));
  }

  private focusHandle(id: string): void {
    afterNextRender(() => {
      this.cellEl(id)?.querySelector<HTMLElement>('.bs-toolbar__handle')?.focus();
    }, { injector: this.injector });
  }

  // ── FLIP ───────────────────────────────────────────────────────────────────

  private cellEl(id: string): HTMLElement | null {
    return this.cellRefs().map(r => r.nativeElement).find(el => el.dataset['id'] === id) ?? null;
  }

  private snapshot(): Map<string, DOMRect> {
    const m = new Map<string, DOMRect>();
    for (const r of this.cellRefs()) {
      const el = r.nativeElement;
      m.set(el.dataset['id'] ?? '', el.getBoundingClientRect());
    }
    return m;
  }

  /** Apply a model change and animate every card from its old box to its new one. */
  private mutate(change: () => void, skipId: string | null = null, after?: () => void): void {
    const before = this.snapshot();
    change();
    afterNextRender(() => {
      after?.();
      if (this.reducedMotion) return;
      for (const r of this.cellRefs()) {
        const el = r.nativeElement;
        const id = el.dataset['id'] ?? '';
        if (id === skipId) continue;
        const a = before.get(id);
        if (!a) continue;
        el.getAnimations().forEach(an => an.cancel());
        const b = el.getBoundingClientRect();
        const dx = a.left - b.left;
        const dy = a.top - b.top;
        const sx = b.width ? a.width / b.width : 1;
        const sy = b.height ? a.height / b.height : 1;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) continue;
        el.animate(
          [
            { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
            { transformOrigin: 'top left', transform: 'none' },
          ],
          { duration: MOTION_MS, easing: MOTION_EASE },
        );
      }
    }, { injector: this.injector });
  }

  // ── Drag with pointer events ───────────────────────────────────────────────

  onCellPointerDown(ev: PointerEvent, id: string): void {
    if (!this.editing() || ev.button !== 0) return;
    const target = ev.target as HTMLElement;
    if (target.closest('.bs-toolbar')) return;
    this.closeMenu();
    this.press = { id, el: ev.currentTarget as HTMLElement, x: ev.clientX, y: ev.clientY };
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(ev: PointerEvent): void {
    const p = this.press;
    if (!p) return;
    if (!this.drag) {
      if (Math.hypot(ev.clientX - p.x, ev.clientY - p.y) < DRAG_THRESHOLD) return;
      const rect = p.el.getBoundingClientRect();
      this.drag = {
        id: p.id, el: p.el,
        offX: p.x - rect.left, offY: p.y - rect.top,
        lastX: ev.clientX, lastY: ev.clientY,
        origin: this.cards(), lastMove: 0,
      };
      this.dragId.set(p.id);
      this.announce(`${this.titleOf(p.id)} picked up, position ${this.position(p.id)} of ${this.cards().length}.`);
    }
    ev.preventDefault();
    const d = this.drag;
    d.lastX = ev.clientX;
    d.lastY = ev.clientY;
    this.followPointer();
    this.hitTest(ev.clientX, ev.clientY);
  }

  @HostListener('document:pointerup')
  @HostListener('document:pointercancel')
  onPointerUp(): void {
    const d = this.drag;
    this.press = null;
    if (!d) return;
    this.drag = null;
    const from = d.el.style.transform;
    d.el.style.transform = '';
    this.dragId.set(null);
    if (!this.reducedMotion && from) {
      // Land on the slot, with a slight settle
      d.el.animate(
        [
          { transform: from },
          { transform: 'scale(0.985)', offset: 0.75 },
          { transform: 'none' },
        ],
        { duration: LAND_MS, easing: LAND_EASE },
      );
    }
    this.announce(`${this.titleOf(d.id)} dropped at position ${this.position(d.id)} of ${this.cards().length}.`);
  }

  private cancelPress(): void {
    if (this.drag) this.cancelDrag();
    this.press = null;
  }

  private cancelDrag(): void {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    this.press = null;
    d.el.style.transform = '';
    this.dragId.set(null);
    this.mutate(() => this.cards.set(d.origin));
    this.announce(`Move cancelled. ${this.titleOf(d.id)} is back at position ${this.position(d.id)}.`);
  }

  /** The lifted card follows the pointer, relative to its current slot. */
  private followPointer(): void {
    const d = this.drag;
    const grid = this.gridRef()?.nativeElement;
    if (!d || !grid) return;
    const g = grid.getBoundingClientRect();
    const left = g.left + d.el.offsetLeft;
    const top  = g.top + d.el.offsetTop;
    const lift = this.reducedMotion ? '' : ' scale(1.02)';
    d.el.style.transform = `translate(${d.lastX - d.offX - left}px, ${d.lastY - d.offY - top}px)${lift}`;
  }

  /** Where the lifted card is held → the order in which it would land there.
   *  Tries every position in the list and keeps the one whose packed slot is
   *  closest to the lifted card's top-left cell (ties keep the current order). */
  private hitTest(x: number, y: number): void {
    const d = this.drag;
    const grid = this.gridRef()?.nativeElement;
    if (!d || !grid) return;
    const now = performance.now();
    if (now - d.lastMove < MOVE_COOLDOWN_MS) return;
    const g = grid.getBoundingClientRect();
    const cols = this.cols();
    const gap = this.gapPx();
    const step = (g.width - (cols - 1) * gap) / cols + gap;
    const tc = Math.max(0, Math.round((x - d.offX - g.left) / step));
    const tr = Math.max(0, Math.round((y - d.offY - g.top) / step));

    const cards = this.cards();
    const from = cards.findIndex(c => c.id === d.id);
    const rest = cards.filter(c => c.id !== d.id);
    const dist = (order: BentoCard[]) => {
      const p = packCards(order, cols, false).find(q => q.card.id === d.id)!;
      const cx = Math.min(tc, cols - p.w);
      return Math.abs(p.x - cx) + Math.abs(p.y - tr);
    };
    let best = from;
    let bestDist = dist(cards);
    for (let i = 0; i <= rest.length; i++) {
      if (i === from) continue;
      const order = [...rest.slice(0, i), cards[from], ...rest.slice(i)];
      const di = dist(order);
      if (di < bestDist) { best = i; bestDist = di; }
    }
    if (best === from) return;
    d.lastMove = now;
    this.reorder(d.id, best);
  }

  private reorder(id: string, to: number): void {
    const arr = [...this.cards()];
    const from = arr.findIndex(c => c.id === id);
    if (from < 0 || from === to) return;
    const [card] = arr.splice(from, 1);
    arr.splice(to, 0, card);
    this.mutate(() => this.cards.set(arr), id, () => this.followPointer());
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.routeId.set(id);
    // Une visite ne compte que sur la route du buyer (voir V1).
    if (id) {
      this.viewed.record({ ...this.view(), companyId: this.companyId() });
    }
    if (this.store.consumeJustCreated()) {
      this.toaster.show('Company created', { tone: 'success', title: 'Success' });
    }
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
  }
}
