import {
  Component, ElementRef, HostListener, Injector, OnDestroy, OnInit, afterNextRender,
  computed, inject, signal, viewChild, viewChildren,
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
  ProgressBarComponent,
  LinkComponent,
  FlyoutMenuComponent,
  FlyoutMenuItemComponent,
  FlyoutMenuTitleComponent,
  DividerComponent,
} from '../../shared/ui';
import { type BuyerCompany } from '../buyer-summary/buyer-summary.store';
import { SECTIONS } from '../../user-testing/mocks';
import { type PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { ToasterService } from '../../shared/ui/toaster/toaster.service';
import { BuyerSummaryStore } from '../buyer-summary/buyer-summary.store';
import { ViewedBuyersStore } from '../buyer-summary/viewed-buyers.store';
import {
  type BentoCard, type BentoFormat, type BentoKind,
  DEFAULT_CARDS, FORMATS, FORMAT_GROUPS, FORMAT_MAP, KINDS,
  MONTHS, GRADE_HISTORY, GRADE_Y, GRADE_CHANGES, EXPOSURE_TREND, SCORE_TREND,
  PAYMENT_BANDS, FIN_YEARS, FINANCIALS, TURNOVER_TREND, TURNOVER_YEARS, JOBS, NEWS,
  NOTES, IDENTITY, DECISIONS, POLICIES, COVER_HISTORY,
} from './buyer-summary-v2.data';

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
const DRAG_THRESHOLD   = 6;    // px before a press becomes a drag
const MOVE_COOLDOWN_MS = 140;  // hysteresis between two reorders

export interface Placed {
  card: BentoCard;
  x: number;  // column, 0-based
  y: number;  // row, 0-based
  w: number;
  h: number;
}

/** First free slot, in list order, restarting from the top for each card
 *  (fills holes left higher up). Width is capped to the column count. */
export function packCards(cards: BentoCard[], cols: number): Placed[] {
  const taken: boolean[][] = [];
  const free = (x: number, y: number, w: number, h: number) => {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) if (taken[yy]?.[xx]) return false;
    }
    return true;
  };
  const out: Placed[] = [];
  for (const card of cards) {
    const f = FORMAT_MAP[card.format] ?? FORMATS[0];
    const w = f.w === 'full' ? cols : Math.min(f.w, cols);
    const h = f.h;
    let placed = false;
    for (let y = 0; !placed; y++) {
      for (let x = 0; x + w <= cols && !placed; x++) {
        if (!free(x, y, w, h)) continue;
        for (let yy = y; yy < y + h; yy++) {
          taken[yy] ??= [];
          for (let xx = x; xx < x + w; xx++) taken[yy][xx] = true;
        }
        out.push({ card, x, y, w, h });
        placed = true;
      }
    }
  }
  // DOM in visual order: Tab and screen readers follow the eye
  return out.sort((a, b) => a.y - b.y || a.x - b.x);
}

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
    ProgressBarComponent,
    LinkComponent,
    FlyoutMenuComponent,
    FlyoutMenuItemComponent,
    FlyoutMenuTitleComponent,
    DividerComponent,
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

  // ── Board model ────────────────────────────────────────────────────────────
  cards   = signal<BentoCard[]>(DEFAULT_CARDS.map(c => ({ ...c })));
  cols    = signal<number>(6);
  editing = signal<boolean>(false);
  dragId  = signal<string | null>(null);
  openMenuId = signal<string | null>(null);
  menuView   = signal<'main' | 'format'>('main');
  announcement = signal<string>('');

  placed   = computed(() => packCards(this.cards(), this.cols()));
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
    afterNextRender(() => {
      const wrap = this.wrapRef()?.nativeElement;
      if (!wrap || typeof ResizeObserver === 'undefined') return;
      this.resizeObs = new ResizeObserver(entries => {
        const width = entries[0]?.contentRect.width ?? 0;
        this.cols.set(this.colsFor(width));
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

  /** Visibility class of the i-th fact of a fact grid, by card width. */
  factLevel(i: number): string {
    if (i < 2) return '';
    if (i < 4) return 'w2';
    if (i < 6) return 'w3';
    if (i < 8) return 'w4';
    return 'w3 h2';
  }

  // ── Edit mode ──────────────────────────────────────────────────────────────

  startEditing(): void {
    this.editing.set(true);
    this.announce('Edit mode. Drag a card to move it, or open its menu to move it, change its format or highlight it.');
  }

  stopEditing(): void {
    this.cancelPress();
    this.closeMenu();
    this.editing.set(false);
    this.announce('Board saved.');
    this.toaster.show('Your board layout is saved', { tone: 'success', title: 'Board updated' });
  }

  resetBoard(): void {
    this.closeMenu();
    this.mutate(() => this.cards.set(DEFAULT_CARDS.map(c => ({ ...c }))));
    this.announce('Board reset to the default layout.');
  }

  // ── Card menu ──────────────────────────────────────────────────────────────

  toggleMenu(id: string): void {
    this.menuView.set('main');
    this.openMenuId.update(cur => (cur === id ? null : id));
  }

  closeMenu(): void {
    this.openMenuId.set(null);
    this.menuView.set('main');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    if (this.openMenuId() === null) return;
    // composedPath: the clicked item may already be gone (menu view switch)
    const inside = ev.composedPath().some(n => n instanceof HTMLElement && n.classList.contains('bento-cell__tools'));
    if (inside) return;
    this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.drag) { this.cancelDrag(); return; }
    if (this.openMenuId() !== null) {
      const id = this.openMenuId()!;
      this.closeMenu();
      this.focusMenuButton(id);
    }
  }

  moveCard(id: string, where: 'before' | 'after' | 'start' | 'end'): void {
    const order = this.placed().map(p => p.card.id);
    const pos = order.indexOf(id);
    let target = pos;
    if (where === 'before') target = Math.max(0, pos - 1);
    if (where === 'after')  target = Math.min(order.length - 1, pos + 1);
    if (where === 'start')  target = 0;
    if (where === 'end')    target = order.length - 1;
    this.closeMenu();
    if (target === pos) return;
    // Reorder on the visual order so "before / after" match what the eye sees
    const visual = order.filter(x => x !== id);
    visual.splice(target, 0, id);
    const byId = new Map(this.cards().map(c => [c.id, c]));
    this.mutate(() => this.cards.set(visual.map(x => byId.get(x)!)));
    this.announce(`${this.titleOf(id)} moved to position ${this.position(id)} of ${order.length}.`);
    this.focusMenuButton(id);
  }

  setFormat(id: string, format: string): void {
    this.closeMenu();
    this.mutate(() => this.cards.update(arr => arr.map(c => (c.id === id ? { ...c, format } : c))));
    this.announce(`${this.titleOf(id)} is now ${this.formatLabel(format)}.`);
    this.focusMenuButton(id);
  }

  toggleHighlight(id: string): void {
    this.closeMenu();
    this.cards.update(arr => arr.map(c => (c.id === id ? { ...c, highlight: !c.highlight } : c)));
    const on = this.cards().find(c => c.id === id)?.highlight;
    this.announce(`${this.titleOf(id)} ${on ? 'highlighted' : 'no longer highlighted'}.`);
    this.focusMenuButton(id);
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

  private focusMenuButton(id: string): void {
    afterNextRender(() => {
      const btn = this.cellEl(id)?.querySelector<HTMLElement>('.bento-cell__menu-btn');
      btn?.focus();
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
    if (target.closest('.bento-cell__tools')) return;
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
      const p = packCards(order, cols).find(q => q.card.id === d.id)!;
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
