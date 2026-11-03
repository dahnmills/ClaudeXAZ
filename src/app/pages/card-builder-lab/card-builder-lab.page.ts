import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  ButtonComponent,
  ButtonIconComponent,
  ChartComponent,
  ConfirmDialogComponent,
  FunctionalNoticeComponent,
  IconComponent,
  InlineEditComponent,
  InputSearchComponent,
  InputTextComponent,
  ModalComponent,
  PropertiesPanelComponent,
  type PropertySection,
  ChipComponent,
  WidgetCardComponent,
} from '../../shared/ui';
import { ToasterService } from '../../shared/ui/toaster/toaster.service';
import { type Metric } from '../buyer-summary/buyer-summary.component';

// Card builder lab: interactive mock of the redesigned custom-card builder.
// Studies: docs/card-builder-ux-study-2026-10-02.md,
// docs/card-builder-benchmark-2026-10-06.md, brief of 14/10 and its 15/10
// iteration (docs/card-builder-redesign-brief-2026-10-14.md).
//
// A modal in two steps, in the order of the analyst's intent (Norman,
// sequential mapping): first the shape of the card, then what fills it.
// - Format: each format is drawn as the card it makes. Ready cards (filled
//   with this buyer's data) and empty formats, one click each.
// - Content: the card at its board size, the catalogue beside it. A click in
//   the catalogue fills the next free place; a click on an item opens its
//   toolbar on the item itself and turns the catalogue into "Replace".
// - Each column is an ordered list of items packed to the top, with room for
//   6 lines. A figure takes one line with its value beside the label, two with
//   it below; a section title one, a chart five.
// - The layout control never empties the card: an option that would drop
//   content is off, with its reason.
// - The card lands in the board slot that opened the builder.

export type CardSize = 'S' | 'M';
type ColumnCount = 1 | 2;
type Column = 0 | 1;
// Where a figure's value sits: beside its label (1 line) or below it (2 lines)
export type Display = 'beside' | 'below';

// What a column holds, in order: item keys ('fig:<id>' | 'chart:<id>' |
// 'head:<n>' for a section title)
type Items = string[];

type Group = 'Our exposure' | 'Financial strength' | 'Payment behaviour' | 'Risk rating';

// One metric of the buyer. Every label reads on its own, out of its group.
// With a history, it can also be shown as a chart.
interface Figure {
  id: string;
  label: string;
  value: string;
  group: Group;
  chart?: Metric;
}

interface LabCard {
  id: string;
  name: string;
  nameEdited: boolean;  // false → name follows the content
  size: CardSize;
  columnCount: ColumnCount;
  display: Display;
  headings: Record<string, string>; // section title text, by 'head:<n>' key
  cols: [Items, Items];
}

// Built-in cards around the draft, so it is judged in context
interface BoardCard { id: string; title: string; size: CardSize; rows: { label: string; value: string }[]; }

// One place of the board: a built-in card, a custom card, or empty
interface BoardSlot { uid: string; builtin?: BoardCard; customId?: string; }

// A starting point named after the analyst's question, filled with real data
interface Template {
  id: string;
  name: string;
  hint: string;
  card: Pick<LabCard, 'size' | 'columnCount' | 'display' | 'headings' | 'cols'>;
}

// An empty format, drawn as the card it makes
interface Format { id: string; size: CardSize; columnCount: ColumnCount; display: Display; name: string; }

// The selected spot: an item of a column, or its "Add" line (key null)
interface Selection { column: Column; key: string | null; }

// Lines of a column at board size, and the lines a chart takes
const LINES = 6;
const CHART_LINES = 5;

const MONTHS = ['May 23', 'Jul 23', 'Sep 23', 'Nov 23', 'Jan 24', 'Mar 24', 'May 24', 'Jul 24'];

// Grouped by the analyst's questions, not by kind (benchmark §3): four groups
// that do not overlap, charts on the row of the figure they plot.
const GROUPS: Group[] = ['Our exposure', 'Financial strength', 'Payment behaviour', 'Risk rating'];

const FIGURES: Figure[] = [
  { id: 'exposure', label: 'Exposure', value: '1 548 000', group: 'Our exposure',
    chart: { id: 'exposure', label: 'Exposure trend', data: [12, 18, 15, 22, 28, 26, 34, 40], tone: 'brand' } },
  { id: 'highest-limit', label: 'Highest limit', value: '10 000 246 000', group: 'Our exposure' },
  { id: 'number-limits', label: 'Number of limits', value: '72', group: 'Our exposure' },
  { id: 'granted-limit', label: 'Granted limit', value: '5 000 000', group: 'Our exposure' },
  { id: 'used-limit', label: 'Used limit', value: '1 548 000', group: 'Our exposure',
    chart: { id: 'used-limit', label: 'Limit usage', data: [22, 25, 24, 28, 30, 29, 31, 31], tone: 'brand' } },
  { id: 'available-limit', label: 'Available limit', value: '3 452 000', group: 'Our exposure' },
  { id: 'cover-requested', label: 'Cover requested', value: '2 000 000', group: 'Our exposure' },
  { id: 'cover-granted', label: 'Cover granted', value: '2 000 000', group: 'Our exposure' },
  { id: 'cover-decision', label: 'Cover decision', value: 'Approved', group: 'Our exposure' },

  { id: 'turnover', label: 'Turnover', value: '123 900 000', group: 'Financial strength',
    chart: { id: 'turnover', label: 'Turnover trend', data: [98, 102, 105, 104, 110, 115, 119, 124], tone: 'positive' } },
  { id: 'pre-tax-profit', label: 'Pre-tax profit', value: '18 000', group: 'Financial strength',
    chart: { id: 'pre-tax-profit', label: 'Profit trend', data: [30, 26, 24, 20, 22, 19, 17, 18], tone: 'warning' } },
  { id: 'cashflow', label: 'Cashflow', value: '22 000', group: 'Financial strength',
    chart: { id: 'cashflow', label: 'Cashflow trend', data: [15, 18, 14, 20, 19, 23, 21, 22], tone: 'positive' } },

  { id: 'pay-on-time', label: 'Paid on time', value: '94 %', group: 'Payment behaviour',
    chart: { id: 'pay-on-time', label: 'Paid on time trend', data: [88, 90, 89, 92, 91, 93, 95, 94], tone: 'positive' } },
  { id: 'pay-late-30', label: 'Paid 1-30 days late', value: '6 %', group: 'Payment behaviour' },
  { id: 'pay-late-30p', label: 'Paid 30+ days late', value: '0 %', group: 'Payment behaviour' },
  { id: 'total-overdue', label: 'Total overdue', value: '0', group: 'Payment behaviour',
    chart: { id: 'total-overdue', label: 'Overdue trend', data: [4, 6, 3, 2, 2, 1, 0, 0], tone: 'warning' } },
  { id: 'oldest-overdue', label: 'Oldest overdue', value: 'N/A', group: 'Payment behaviour' },
  { id: 'disputes', label: 'Open disputes', value: 'None', group: 'Payment behaviour' },
  { id: 'dbt', label: 'Days beyond terms', value: '4 days', group: 'Payment behaviour',
    chart: { id: 'dbt', label: 'Days beyond terms trend', data: [9, 8, 8, 6, 7, 5, 4, 4], tone: 'warning' } },

  { id: 'grade', label: 'Grade', value: '6', group: 'Risk rating',
    chart: { id: 'grade', label: 'Grade history', data: [6, 6, 6, 7, 6, 5, 5, 6], tone: 'positive',
      invertY: true, yLabels: ['1', '4', '7', '10', 'N/A'], min: 1, max: 11 } },
  { id: 'score', label: 'Score', value: '82 / 100', group: 'Risk rating',
    chart: { id: 'score', label: 'Score history', data: [70, 72, 75, 74, 78, 80, 81, 82], tone: 'positive' } },
  { id: 'score-trend', label: 'Score trend', value: 'Stable', group: 'Risk rating' },
  { id: 'score-updated', label: 'Score updated', value: '11 nov 2024', group: 'Risk rating' },
];
const FIGURE_MAP: Record<string, Figure> = Object.fromEntries(FIGURES.map(f => [f.id, f]));

const BOARD: BoardCard[] = [
  { id: 'b-risk', title: 'Risk figures (USD)', size: 'S', rows: [
    { label: 'Exposure', value: '1 548 000' }, { label: 'Highest limit', value: '10 000 246 000' }] },
  { id: 'b-fin', title: 'Financials (USD)', size: 'S', rows: [
    { label: 'Turnover', value: '123 900 000' }, { label: 'Cashflow', value: '22 000' }] },
  { id: 'b-limit', title: 'Limit (USD)', size: 'S', rows: [
    { label: 'Granted limit', value: '5 000 000' }, { label: 'Available', value: '3 452 000' }] },
  { id: 'b-score', title: 'Score', size: 'S', rows: [
    { label: 'Score', value: '82 / 100' }, { label: 'Trend', value: 'Stable' }] },
  { id: 'b-cover', title: 'Coverage (USD)', size: 'M', rows: [
    { label: 'Cover requested', value: '2 000 000' }, { label: 'Decision', value: 'Approved' }] },
  { id: 'b-pay', title: 'Payment history', size: 'S', rows: [
    { label: 'On time', value: '94 %' }, { label: 'Late 30+', value: '0 %' }] },
];

let cardCounter = 0;
let headCounter = 0;
let slotCounter = 0;

const linesOf = (key: string, display: Display): number =>
  key.startsWith('chart:') ? CHART_LINES : key.startsWith('fig:') && display === 'below' ? 2 : 1;
const used = (items: Items, display: Display): number => items.reduce((n, k) => n + linesOf(k, display), 0);

// Benchmark §4: one template per analyst question, plus a blank start
const TEMPLATES: Template[] = [
  { id: 'exposure', name: 'Exposure at a glance', hint: 'Small, 6 figures on what we have committed',
    card: { size: 'S', columnCount: 1, display: 'beside', headings: {},
      cols: [['fig:exposure', 'fig:highest-limit', 'fig:granted-limit', 'fig:used-limit',
        'fig:available-limit', 'fig:cover-granted'], []] } },
  { id: 'payment', name: 'Payment behaviour', hint: 'Small, 6 figures on how this buyer pays',
    card: { size: 'S', columnCount: 1, display: 'beside', headings: {},
      cols: [['fig:pay-on-time', 'fig:pay-late-30', 'fig:pay-late-30p', 'fig:total-overdue',
        'fig:oldest-overdue', 'fig:dbt'], []] } },
  { id: 'financial', name: 'Financial strength', hint: 'Wide, latest figures beside the turnover trend',
    card: { size: 'M', columnCount: 2, display: 'beside', headings: { 'head:t1': 'Latest year' },
      cols: [['head:t1', 'fig:turnover', 'fig:pre-tax-profit', 'fig:cashflow'], ['chart:turnover']] } },
];

const FORMATS: Format[] = [
  { id: 'S-beside',  size: 'S', columnCount: 1, display: 'beside', name: 'Small' },
  { id: 'S-below',   size: 'S', columnCount: 1, display: 'below',  name: 'Small' },
  { id: 'M-beside',  size: 'M', columnCount: 1, display: 'beside', name: 'Wide' },
  { id: 'M-below',   size: 'M', columnCount: 1, display: 'below',  name: 'Wide' },
  { id: 'M2-beside', size: 'M', columnCount: 2, display: 'beside', name: 'Wide, 2 columns' },
  { id: 'M2-below',  size: 'M', columnCount: 2, display: 'below',  name: 'Wide, 2 columns' },
];

// Built-in cards first, then two free slots: where a custom card goes
const INITIAL_SLOTS: BoardSlot[] = [
  ...BOARD.map(b => ({ uid: `slot-${++slotCounter}`, builtin: b })),
  { uid: `slot-${++slotCounter}` },
  { uid: `slot-${++slotCounter}` },
];

@Component({
  selector: 'app-card-builder-lab',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ButtonComponent,
    ButtonIconComponent,
    ChartComponent,
    ConfirmDialogComponent,
    FunctionalNoticeComponent,
    IconComponent,
    InlineEditComponent,
    InputSearchComponent,
    InputTextComponent,
    ModalComponent,
    PropertiesPanelComponent,
    ChipComponent,
    WidgetCardComponent,
  ],
  templateUrl: './card-builder-lab.page.html',
  styleUrl: './card-builder-lab.page.scss',
})
export class CardBuilderLabPage {
  private toaster = inject(ToasterService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly TEMPLATES = TEMPLATES;
  readonly LINES = LINES;
  readonly CHART_LINES = CHART_LINES;
  // A column is narrow: first, middle and last month only, or the labels collide
  readonly axisMonths = [MONTHS[0], MONTHS[Math.floor((MONTHS.length - 1) / 2)], MONTHS[MONTHS.length - 1]];
  readonly CHART_HEIGHT = 96;

  // ── Board ──────────────────────────────────────────────────────────────
  slots       = signal<BoardSlot[]>(INITIAL_SLOTS);
  customCards = signal<LabCard[]>([]);
  flashId     = signal<string | null>(null);   // card just added → brief highlight

  // ── Builder state ──────────────────────────────────────────────────────
  builderOpen = signal(false);
  editingId   = signal<string | null>(null);   // null = new card
  // Board slot the new card goes to, null = a new slot at the end
  private targetUid: string | null = null;
  draft       = signal<LabCard>(this.blankCard());
  private initialSnapshot = '';
  private templateSnapshot = '';   // the card as the last template made it
  private appliedTemplate: string | null = null;
  // The template the card still matches, untouched since it was applied
  activeTemplate = computed(() =>
    JSON.stringify(this.draft()) === this.templateSnapshot ? this.appliedTemplate : null);

  // The two steps, in the order of intent: the shape, then what fills it
  step        = signal<'format' | 'content'>('format');
  // What a catalogue click acts on: null = the next free place, else an item
  // (replace) or a column's "Add" (fill that column)
  sel         = signal<Selection | null>(null);
  query       = signal('');
  discardOpen = signal(false);
  // The last card composed by hand, kept when a ready card replaces it:
  // offered again as "Your card" among the formats. Nothing asks, nothing is lost.
  private ownCard = signal<LabCard | null>(null);
  announcement = signal('');                   // live region (WCAG 4.1.3)

  // Drag state (native HTML5): a bonus, every move also exists as a button
  dragKey = signal<string | null>(null);
  dropAt  = signal<Selection | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────
  // A section title alone is not a card: it needs a figure or a chart
  hasContent = computed(() => this.keys(this.draft()).some(k => !this.isHeading(k)));
  hasItems   = computed(() => this.keys(this.draft()).length > 0);
  // Work a ready card would throw away: items placed by hand
  private hasOwnWork = computed(() => this.hasItems() && !this.activeTemplate());

  selKey = computed(() => this.sel()?.key ?? null);

  builderTitle = computed(() => this.editingId() ? 'Edit card' : 'New card');

  readonly FORMATS = FORMATS;

  // The card's format as one of the six
  formatId = computed(() => {
    const c = this.draft();
    return `${c.columnCount === 2 ? 'M2' : c.size}-${c.display}`;
  });

  formatLabel = computed(() => {
    const f = FORMATS.find(x => x.id === this.formatId())!;
    return `${f.name} · values ${f.display}`;
  });

  // Figures a format holds, said under its drawing
  capacity(f: Format): number { return (f.display === 'below' ? LINES / 2 : LINES) * f.columnCount; }

  // The card's content laid out in another format, or null when it would not hold
  private reshape(c: LabCard, f: Format): LabCard | null {
    const all = [...c.cols[0], ...c.cols[1]];
    const cols: [Items, Items] = f.columnCount === 2
      ? (c.columnCount === 2 ? [c.cols[0], c.cols[1]] : [c.cols[0], []])
      : [all, []];
    if (cols.some(col => used(col, f.display) > LINES)) return null;
    return { ...c, size: f.size, columnCount: f.columnCount, display: f.display, cols };
  }

  // A format that would drop content is off, with its reason
  formatFits(f: Format): boolean { return !!this.reshape(this.draft(), f); }

  // A ready card drawn with this buyer's data, as it would come
  templateCard(t: Template): LabCard {
    return { ...this.blankCard(), ...t.card, id: 'tpl-' + t.id, name: t.name, nameEdited: true };
  }

  rowsOf(n: number): number[] { return Array.from({ length: n }, (_, i) => i); }

  // Draws a format: each column as its lines, a figure as label and value
  formatColumns(f: Format): number[] {
    return Array.from({ length: f.columnCount }, () => f.display === 'below' ? LINES / 2 : LINES);
  }

    // Charts need room the selected column lacks. Said only once the analyst
  // reaches for one, with the way out: not a standing line of the panel.
  // The selection it was asked on: any other selection forgets it
  private chartAskedOn = signal<Selection | null>(null);
  chartsBlocked = computed(() => {
    const s = this.sel();
    const d = this.draft().display;
    if (!s) return this.cardColumns(this.draft()).every(c => LINES - used(this.draft().cols[c], d) < CHART_LINES);
    const freed = s.key ? linesOf(s.key, d) : 0;
    return LINES - used(this.draft().cols[s.column], d) + freed < CHART_LINES;
  });
  chartRoomHint = computed(() => this.chartAskedOn() === this.sel() && this.chartsBlocked()
    ? { canWiden: this.draft().columnCount === 1 && this.formatFits(FORMATS[4]) } : null);

  // Charts blocked on a one-column card: the second column is the room they need
  widenForChart(): void {
    const next = this.reshape(this.draft(), FORMATS.find(f => f.id === `M2-${this.draft().display}`)!);
    if (next) { this.draft.set(next); this.sel.set({ column: 1, key: null }); this.announce("Two columns: the right one is empty."); }
  }

  pickChart(f: Figure): void {
    const key = 'chart:' + f.id;
    if (!this.onCard(key) && this.chartsBlocked()) { this.chartAskedOn.set(this.sel()); return; }
    this.pick(key);
  }

  // List on the right: the four groups, narrowed by the search
  // The catalogue by the analyst's questions: one category at a time, or all.
  // In each, figures then charts, each block named, so a chart never passes
  // for a decoration and new metrics have a place to go.
  readonly GROUPS = GROUPS;
  category = signal<Group | 'all'>('all');

  setCategory(c: Group | 'all'): void {
    this.category.set(c);
    // The chosen chip comes fully into view, wherever the row was scrolled
    setTimeout(() => this.catsEl()?.nativeElement.querySelector<HTMLElement>('.ds-chip--selected')
      ?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: this.motion() }));
  }

  // ── Category row: what lies past each edge ─────────────────────────────
  private catsEl = viewChild<ElementRef<HTMLElement>>('cats');
  catsBefore = signal(false);
  catsAfter  = signal(false);

  // Measured when the row appears, when it is resized, and as it scrolls
  private watchCats = effect(onCleanup => {
    const el = this.catsEl()?.nativeElement;
    if (!el) return;
    const ro = new ResizeObserver(() => this.measureCats());
    ro.observe(el);
    this.measureCats();
    onCleanup(() => ro.disconnect());
  });

  measureCats(): void {
    const el = this.catsEl()?.nativeElement;
    if (!el) return;
    this.catsBefore.set(el.scrollLeft > 1);
    this.catsAfter.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  // A chevron moves by most of a row's width: the last chip seen stays in sight
  scrollCats(dir: -1 | 1): void {
    const el = this.catsEl()?.nativeElement;
    el?.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: this.motion() });
  }

  // Over the row, the wheel scrolls it sideways instead of the list
  onCatsWheel(ev: WheelEvent): void {
    const el = this.catsEl()?.nativeElement;
    if (!el || el.scrollWidth <= el.clientWidth || Math.abs(ev.deltaY) <= Math.abs(ev.deltaX)) return;
    ev.preventDefault();
    el.scrollLeft += ev.deltaY;
  }

  private motion(): ScrollBehavior {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  // What a category holds, said on its chip
  categoryCount(c: Group | 'all'): number {
    const figs = FIGURES.filter(f => c === 'all' || f.group === c);
    return figs.length + figs.filter(f => f.chart).length;
  }

  private matches(f: Figure, q: string, chart: boolean): boolean {
    if (!q) return true;
    const label = chart ? f.chart!.label : f.label;
    return label.toLowerCase().includes(q) || f.group.toLowerCase().includes(q);
  }

  // A search looks in every category: the chips narrow browsing, not finding
  groups = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.category();
    return GROUPS
      .filter(group => !!q || cat === 'all' || group === cat)
      .map(group => ({
        group,
        figures: FIGURES.filter(f => f.group === group && this.matches(f, q, false)),
        charts:  FIGURES.filter(f => f.group === group && !!f.chart && this.matches(f, q, true)),
      }))
      .filter(g => g.figures.length || g.charts.length);
  });

  // ── Items ──────────────────────────────────────────────────────────────
  private keys(card: LabCard): string[] {
    return this.cardColumns(card).flatMap(c => card.cols[c]);
  }

  private locate(card: LabCard, key: string): { column: Column; index: number } | null {
    for (const column of this.cardColumns(card)) {
      const index = card.cols[column].indexOf(key);
      if (index >= 0) return { column, index };
    }
    return null;
  }

  lines(key: string, card: LabCard): number { return linesOf(key, card.display); }

  // Lines left in a column: the card shows "Add" only when there are some
  room(card: LabCard, column: Column): number { return LINES - used(card.cols[column], card.display); }

  // Does `key` fit in `column`, counting what it replaces and its own lines
  // if it already sits there?
  private fitsIn(key: string, column: Column, replaced: string | null): boolean {
    const items = this.draft().cols[column];
    const d = this.draft().display;
    const freed = (replaced && replaced !== key ? linesOf(replaced, d) : 0) + (items.includes(key) ? linesOf(key, d) : 0);
    return linesOf(key, d) <= LINES - used(items, d) + freed;
  }

  // An item shows once: already on the card, its row is marked, not offered.
  // Section titles are not unique: 'head:new' always makes a new one.
  canPick(key: string): boolean {
    if (this.locate(this.draft(), key)) return false;
    const s = this.sel();
    return s ? this.fitsIn(key, s.column, s.key) : this.autoColumn(key) !== null;
  }

  // Nothing selected: the first column with room for it
  private autoColumn(key: string): Column | null {
    return this.cardColumns(this.draft()).find(c => this.fitsIn(key, c, null)) ?? null;
  }

  // The card is full: a catalogue click has nowhere to go
  cardFull = computed(() => !this.sel() && this.cardColumns(this.draft()).every(c => this.room(this.draft(), c) === 0));

  onCard(key: string): boolean { return !!this.locate(this.draft(), key); }

  // ── Lookups for the template ───────────────────────────────────────────
  figureOf(key: string): Figure { return FIGURE_MAP[key.slice(key.indexOf(':') + 1)]; }
  isChart(key: string): boolean { return key.startsWith('chart:'); }
  isHeading(key: string): boolean { return key.startsWith('head:'); }

  headingText(card: LabCard, key: string): string { return card.headings[key] ?? ''; }

  labelOf(key: string): string {
    if (this.isHeading(key)) return this.headingText(this.draft(), key).trim() || 'Section title';
    const f = this.figureOf(key);
    return this.isChart(key) ? f.chart!.label : f.label;
  }

  // What a screen reader hears on an item of the card: what it says, not "Change X"
  itemAria(key: string): string {
    if (this.isHeading(key)) return `Section title: ${this.labelOf(key)}`;
    if (this.isChart(key)) return `${this.labelOf(key)}, chart`;
    return `${this.labelOf(key)}, ${this.figureOf(key).value}`;
  }

  // Template thumbnail: each column as its items, a chart as one tall block
  thumbColumns(t: Template): { kind: 'fig' | 'chart' | 'head' | 'free'; lines: number }[][] {
    const cols = t.card.columnCount === 2 ? [t.card.cols[0], t.card.cols[1]] : [t.card.cols[0]];
    return cols.map(col => {
      const out = col.map(k => ({ kind: k.slice(0, k.indexOf(':')) as 'fig' | 'chart' | 'head', lines: linesOf(k, t.card.display) }));
      const left = LINES - used(col, t.card.display);
      return left ? [...out, { kind: 'free' as const, lines: left }] : out;
    });
  }

  sectionsOf(key: string): PropertySection[] {
    const f = this.figureOf(key);
    return [{ rows: [{ label: f.label, value: f.value }] }];
  }

  cardColumns(card: LabCard): Column[] { return card.columnCount === 2 ? [0, 1] : [0]; }

  columnLabel(c: Column): string { return c === 0 ? 'left column' : 'right column'; }

  isSelected(column: Column, key: string | null): boolean {
    const s = this.sel();
    return !!s && s.column === column && s.key === key;
  }

  // ── Builder lifecycle ──────────────────────────────────────────────────
  private blankCard(): LabCard {
    return { id: '', name: '', nameEdited: false, size: 'S', columnCount: 1, display: 'beside', headings: {}, cols: [[], []] };
  }

  // From an empty slot of the board, or from the header (first free slot)
  openNew(slotUid?: string): void {
    this.targetUid = slotUid ?? this.slots().find(s => !s.builtin && !s.customId)?.uid ?? null;
    this.editingId.set(null);
    this.draft.set({ ...this.blankCard(), id: `lab-card-${++cardCounter}` });
    this.startSession('format');
  }

  // An existing card has its shape already: straight to its content
  openEdit(id: string): void {
    const card = this.customCards().find(c => c.id === id);
    if (!card) return;
    this.targetUid = null;
    this.editingId.set(id);
    this.draft.set({ ...card, headings: { ...card.headings }, cols: [[...card.cols[0]], [...card.cols[1]]] });
    this.startSession('content');
  }

  private startSession(step: 'format' | 'content'): void {
    // A toast from the last save would sit over the modal's footer
    this.toaster.clear();
    this.initialSnapshot = JSON.stringify(this.draft());
    this.query.set('');
    this.templateSnapshot = '';
    this.appliedTemplate = null;
    this.ownCard.set(null);
    this.sel.set(null);
    this.step.set(step);
    this.builderOpen.set(true);
  }

  // ── Step 1: format ─────────────────────────────────────────────────────
  // An empty format: the content, if any, follows it
  chooseFormat(f: Format): void {
    const next = this.reshape(this.draft(), f);
    if (!next) return;
    this.draft.set(next);
    this.toContent();
    this.announce(`${f.name}, values ${f.display}. Click a figure to add it.`);
  }

  // A ready card replaces the content: hand-made work is kept aside first
  chooseStart(t: Template): void {
    if (this.activeTemplate() !== t.id) {
      if (this.hasOwnWork()) this.ownCard.set(this.draft());
      this.applyTemplate(t);
    }
    this.toContent();
  }

  // "Your card": the one kept aside when a ready card replaced it
  resume(): void {
    const kept = this.ownCard();
    if (kept && !this.hasOwnWork()) {
      this.draft.set(kept);
      this.ownCard.set(null);
      this.templateSnapshot = '';
      this.appliedTemplate = null;
    }
    this.toContent();
  }

  showResume = computed(() => !!this.ownCard() && !this.hasOwnWork());
  draftAsTemplate = computed<Template>(() => ({ id: 'own', name: 'Your card', hint: '', card: this.ownCard() ?? this.draft() }));

  // Back to step 1, from the footer or the format chip: the content stays
  toFormat(): void {
    this.sel.set(null);
    this.step.set('format');
  }

  private toContent(): void {
    this.sel.set(null);
    this.query.set('');
    this.category.set('all');
    this.step.set('content');
    setTimeout(() => this.host.nativeElement.ownerDocument.querySelector<HTMLElement>('.lab-pick__search input')?.focus());
  }

  private applyTemplate(t: Template): void {
    const before = this.draft();
    // A name the analyst typed stays; a template name follows the template
    const typed = before.nameEdited && !TEMPLATES.some(x => x.name === before.name);
    // Fresh keys for section titles, so two cards never share one
    const rename = Object.fromEntries(Object.keys(t.card.headings).map(k => [k, `head:${++headCounter}`]));
    const cols = t.card.cols.map(col => col.map(k => rename[k] ?? k)) as [Items, Items];
    const headings = Object.fromEntries(Object.entries(t.card.headings).map(([k, v]) => [rename[k], v]));
    // The template name names the question: it stays when a figure is swapped
    const card: LabCard = { ...before, ...t.card, headings, cols, name: typed ? before.name : t.name, nameEdited: true };
    this.draft.set(card);
    this.templateSnapshot = JSON.stringify(card);
    this.appliedTemplate = t.id;
    this.announce(`${t.name}: click an item on the card to replace it.`);
  }

  // Empties every column, the format stays
  clearCard(): void {
    if (!this.hasItems()) return;
    if (this.hasOwnWork()) this.ownCard.set(this.draft());
    const c = this.draft();
    const typed = c.nameEdited && !TEMPLATES.some(x => x.name === c.name);
    this.draft.set({ ...c, headings: {}, cols: [[], []], name: typed ? c.name : '', nameEdited: typed });
    this.templateSnapshot = '';
    this.appliedTemplate = null;
    this.sel.set(null);
    this.announce('Card cleared.');
  }

  // A new card with nothing placed, or a template as it came, loses nothing
  private isDirty(): boolean {
    if (!this.editingId() && (!this.hasContent() || !!this.activeTemplate())) return false;
    return JSON.stringify(this.draft()) !== this.initialSnapshot;
  }

  // Cancel only asks when real work would be lost (NN/g confirmation dialogs)
  requestCancel(): void {
    if (this.isDirty()) { this.discardOpen.set(true); return; }
    this.closeBuilder();
  }

  confirmDiscard(): void {
    this.discardOpen.set(false);
    this.closeBuilder();
  }

  private closeBuilder(): void {
    this.builderOpen.set(false);
    this.editingId.set(null);
    this.sel.set(null);
  }

  save(): void {
    if (!this.hasContent()) return;
    const card = { ...this.draft(), name: this.draft().name.trim() || 'Untitled card' };
    const editing = this.editingId();
    if (editing) {
      this.customCards.update(arr => arr.map(c => c.id === editing ? card : c));
      this.toaster.show(`"${card.name}" is updated on every board that shows it.`, { tone: 'success', title: 'Card updated' });
    } else {
      this.customCards.update(arr => [card, ...arr]);
      // Into the slot that opened the builder, or a new one at the end
      const uid = this.targetUid;
      this.slots.update(arr => uid && arr.some(s => s.uid === uid)
        ? arr.map(s => s.uid === uid ? { uid, customId: card.id } : s)
        : [...arr, { uid: `slot-${++slotCounter}`, customId: card.id }]);
      this.toaster.show(`"${card.name}" is now on this board.`, { tone: 'success', title: 'Card added' });
    }
    this.flash(card.id);
    this.closeBuilder();
    // Where it landed may be off screen: brought into view, focus on its Edit button
    setTimeout(() => {
      const cell = this.host.nativeElement.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
      cell?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      cell?.querySelector<HTMLElement>('.lab-grid__edit ds-button-icon')?.focus({ preventScroll: true });
    }, 50);
  }

    cardById(id: string): LabCard | undefined { return this.customCards().find(c => c.id === id); }

  // Slots with their custom card resolved, for the board template
  boardView = computed(() => this.slots().map(s => ({
    uid: s.uid, builtin: s.builtin, card: s.customId ? this.cardById(s.customId) : undefined,
  })));

  // Off the board at once, with Undo rather than "Are you sure?" (study §4)
  removeFromBoard(uid: string): void {
    const slot = this.slots().find(s => s.uid === uid);
    const card = slot?.customId ? this.cardById(slot.customId) : undefined;
    if (!slot || !card) return;
    this.slots.update(arr => arr.map(s => s.uid === uid ? { uid } : s));
    this.announce(`${card.name} removed from the board.`);
    this.toaster.show(`"${card.name}" is off this board.`, { tone: 'info', title: 'Card removed', actionLabel: 'Undo' },
      () => {
        // Back in its slot, unless another card took it meanwhile
        this.slots.update(arr => arr.some(s => s.uid === uid && !s.customId)
          ? arr.map(s => s.uid === uid ? { uid, customId: card.id } : s)
          : [...arr, { uid: `slot-${++slotCounter}`, customId: card.id }]);
        this.flash(card.id);
        this.announce(`${card.name} is back on the board.`);
      });
  }

  private flash(id: string): void {
    this.flashId.set(id);
    setTimeout(() => { if (this.flashId() === id) this.flashId.set(null); }, 1200);
  }

  // ── Card settings ──────────────────────────────────────────────────────
  setName(name: string): void {
    this.draft.update(c => ({ ...c, name, nameEdited: name.trim().length > 0 }));
  }

  // Until the analyst types a name, the name follows the content
  private autoName(c: LabCard): LabCard {
    if (c.nameEdited) return c;
    return { ...c, name: this.keys(c).filter(k => !this.isHeading(k)).slice(0, 2).map(k => this.labelOf(k)).join(' & ') };
  }

  setHeadingText(key: string, text: string): void {
    this.draft.update(c => ({ ...c, headings: { ...c.headings, [key]: text } }));
  }

  // ── Selection ──────────────────────────────────────────────────────────
  select(column: Column, key: string | null): void {
    this.sel.set({ column, key });
  }

  // ── Content ────────────────────────────────────────────────────────────
  // Replaces the selected item, or adds at the end of its column
  pick(key: string): void {
    // Already on the card: the row leads to it
    const at = this.locate(this.draft(), key);
    if (at) { this.sel.set({ column: at.column, key }); this.focusSelected(); return; }
    if (!this.canPick(key)) return;
    const auto = !this.sel();
    const s = this.sel() ?? { column: this.autoColumn(key)!, key: null };
    if (key === 'head:new') {
      key = `head:${++headCounter}`;
      this.setHeadingText(key, '');
    }
    const replaced = s.key;
    this.draft.update(c => {
      const cols: [Items, Items] = [[...c.cols[0]], [...c.cols[1]]];
      const col = cols[s.column];
      const headings = { ...c.headings };
      if (replaced) {
        col[col.indexOf(replaced)] = key;
        delete headings[replaced];
      } else col.push(key);
      return this.autoName({ ...c, cols, headings });
    });
    const card = this.draft();
    if (auto && !this.isHeading(key)) {
      // Filling: the next click goes to the next free place again
      this.sel.set(null);
    } else if (replaced || this.isHeading(key)) {
      // Replacing, or a title to name: stays on it
      this.sel.set({ column: s.column, key });
    } else if (this.room(card, s.column) > 0) {
      this.sel.set({ column: s.column, key: null });
    } else {
      // Column full: on to the other one, else stay on what was just added
      const other = this.cardColumns(card).find(c => c !== s.column && this.room(card, c) > 0);
      this.sel.set(other !== undefined ? { column: other, key: null } : { column: s.column, key });
    }
    this.announce(replaced ? `${this.labelOf(replaced)} replaced by ${this.labelOf(key)}.` : `${this.labelOf(key)} added.`);
  }

  // The items below move up. The next item, or "Add", is selected and focused,
  // so the keyboard never falls back to the page.
  remove(key: string): void {
    const at = this.locate(this.draft(), key);
    if (!at) return;
    const label = this.labelOf(key);
    this.draft.update(c => {
      const cols: [Items, Items] = [[...c.cols[0]], [...c.cols[1]]];
      cols[at.column].splice(at.index, 1);
      const { [key]: _gone, ...headings } = c.headings;
      return this.autoName({ ...c, cols, headings });
    });
    const next = this.draft().cols[at.column][at.index] ?? null;
    this.sel.set({ column: at.column, key: next });
    this.announce(`${label} removed.`);
    this.focusSelected();
  }

  canMoveBy(dir: -1 | 1): boolean {
    const at = this.selKey() ? this.locate(this.draft(), this.selKey()!) : null;
    if (!at) return false;
    const to = at.index + dir;
    return to >= 0 && to < this.draft().cols[at.column].length;
  }

  moveBy(dir: -1 | 1): void {
    const key = this.selKey();
    if (!key || !this.canMoveBy(dir)) return;
    const at = this.locate(this.draft(), key)!;
    this.draft.update(c => {
      const cols: [Items, Items] = [[...c.cols[0]], [...c.cols[1]]];
      const col = cols[at.column];
      [col[at.index], col[at.index + dir]] = [col[at.index + dir], col[at.index]];
      return this.autoName({ ...c, cols });
    });
    this.announce(`${this.labelOf(key)} moved ${dir === -1 ? 'up' : 'down'}.`);
  }

  canMoveAcross = computed(() => {
    const s = this.sel();
    if (!s?.key || this.draft().columnCount === 1) return false;
    return this.fitsIn(s.key, s.column === 0 ? 1 : 0, null);
  });

  // To the end of the other column
  moveAcross(): void {
    const s = this.sel();
    if (!s?.key || !this.canMoveAcross()) return;
    const target: Column = s.column === 0 ? 1 : 0;
    this.moveTo(s.key, target, this.draft().cols[target].length);
    this.announce(`${this.labelOf(s.key)} moved to the ${this.columnLabel(target)}.`);
  }

  // Puts `key` before position `index` of `column`
  private moveTo(key: string, column: Column, index: number): void {
    const from = this.locate(this.draft(), key);
    this.draft.update(c => {
      const cols: [Items, Items] = [[...c.cols[0]], [...c.cols[1]]];
      let target = index;
      if (from) {
        cols[from.column].splice(from.index, 1);
        if (from.column === column && from.index < target) target--;
      }
      cols[column].splice(target, 0, key);
      return this.autoName({ ...c, cols });
    });
    this.sel.set({ column, key });
  }

  // ── Keyboard on the card ───────────────────────────────────────────────
  // Arrows walk the items, Alt + arrows move one, Delete removes it
  onItemKeydown(ev: KeyboardEvent, column: Column, key: string): void {
    if (ev.key === 'Delete' || ev.key === 'Backspace') {
      ev.preventDefault();
      this.remove(key);
      return;
    }
    const dir = ev.key === 'ArrowUp' ? -1 : ev.key === 'ArrowDown' ? 1 : 0;
    if (!dir) return;
    ev.preventDefault();
    if (ev.altKey) {
      this.select(column, key);
      if (this.canMoveBy(dir)) { this.moveBy(dir); this.focusSelected(); }
      return;
    }
    const items = this.draft().cols[column];
    const i = items.indexOf(key) + dir;
    const target = i >= 0 && i < items.length ? items[i] : i === items.length && this.room(this.draft(), column) > 0 ? null : undefined;
    if (target !== undefined) this.focusSpot(column, target);
  }

  // From "Add", ArrowUp goes back to the last item of the column
  onAddKeydown(ev: KeyboardEvent, column: Column): void {
    if (ev.key !== 'ArrowUp') return;
    const items = this.draft().cols[column];
    if (!items.length) return;
    ev.preventDefault();
    this.focusSpot(column, items[items.length - 1]);
  }

  private focusSelected(): void {
    const s = this.sel();
    if (s) this.focusSpot(s.column, s.key);
  }

  // After the card re-renders: the item, or the column's "Add"
  private focusSpot(column: Column, key: string | null): void {
    setTimeout(() => {
      const sel = key ? `[data-col="${column}"][data-key="${key}"]` : `[data-col="${column}"][data-add]`;
      this.host.nativeElement.ownerDocument.querySelector<HTMLElement>(`.lab-preview ${sel}`)?.focus();
    });
  }

  // ── Drag and drop (pointer path, a bonus over the buttons) ─────────────
  onDragStart(ev: DragEvent, key: string): void {
    this.dragKey.set(key);
    ev.dataTransfer?.setData('text/plain', key);
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
  }

  // Over an item: goes before it. Over "Add": goes at the end. A column
  // without room for it refuses it: no-drop cursor.
  onDragOver(ev: DragEvent, column: Column, key: string | null): void {
    const dragged = this.dragKey();
    if (!dragged || dragged === key || !this.fitsIn(dragged, column, null)) { this.dropAt.set(null); return; }
    ev.preventDefault();
    this.dropAt.set({ column, key });
  }

  onDrop(ev: DragEvent): void {
    ev.preventDefault();
    const dragged = this.dragKey();
    const at = this.dropAt();
    if (dragged && at) {
      const items = this.draft().cols[at.column];
      this.moveTo(dragged, at.column, at.key ? items.indexOf(at.key) : items.length);
      this.announce(`${this.labelOf(dragged)} moved.`);
    }
    this.onDragEnd();
  }

  onDragEnd(): void {
    this.dragKey.set(null);
    this.dropAt.set(null);
  }

  isDropTarget(column: Column, key: string | null): boolean {
    const at = this.dropAt();
    return !!at && at.column === column && at.key === key;
  }

  // ── Misc ───────────────────────────────────────────────────────────────
  private announce(msg: string): void {
    this.announcement.set('');
    setTimeout(() => this.announcement.set(msg), 30);
  }

  // Edit mode: say where the card lives before the analyst changes it
  usedOnBoards(): number { return 2; }
}
