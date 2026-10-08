import { Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  ButtonComponent,
  ButtonIconComponent,
  ChartComponent,
  ConfirmDialogComponent,
  FunctionalNoticeComponent,
  IconComponent,
  InputSearchComponent,
  InputTextComponent,
  ModalComponent,
  PropertiesPanelComponent,
  type PropertySection,
  SegmentedControlComponent,
  type SegmentedOption,
  WidgetCardComponent,
  BadgeComponent,
} from '../../shared/ui';
import { ToasterService } from '../../shared/ui/toaster/toaster.service';
import { type Metric } from '../buyer-summary/buyer-summary.component';

// Card builder lab: interactive mock of the redesigned custom-card builder.
// Studies: docs/card-builder-ux-study-2026-10-02.md and
// docs/card-builder-benchmark-2026-10-06.md.
//
// Two steps, each showing the whole card at its board size:
// 1. Format: name, size, columns, figures display, beside the empty card.
// 2. Content, slot first (Apple Watch, Garmin, Wahoo): click a place, pick
//    what goes there in the list on the right; click a filled place to
//    replace, move or remove what it holds.
// Each column has a fixed number of places, so nothing can overflow.

export type CardSize = 'S' | 'M';
type ColumnCount = 1 | 2;
type Column = 0 | 1;
export type Density = 'stacked' | 'inline';

// What one place of a column holds: an item key ('fig:<id>' | 'chart:<id>'),
// or nothing. A chart spans several places, its following ones are not listed.
type Cell = string | null;

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
  density: Density;     // figures on one line (6 places) or label above value (3)
  cells: [Cell[], Cell[]];
}

// Built-in cards around the draft, so it is judged in context
interface BoardCard { id: string; title: string; size: CardSize; rows: { label: string; value: string }[]; }

const PLACES: Record<Density, number> = { inline: 6, stacked: 3 };
// A chart takes nearly a whole column: 5 places of 6, or the 3 of 3
const CHART_SPAN: Record<Density, number> = { inline: 5, stacked: 3 };

const MONTHS = ['May 23', 'Jul 23', 'Sep 23', 'Nov 23', 'Jan 24', 'Mar 24', 'May 24', 'Jul 24'];

// Grouped by the analyst's questions, not by kind (benchmark §3): four groups
// that do not overlap, charts next to the figure they plot.
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

const empty = (n: number): Cell[] => Array.from({ length: n }, () => null);

@Component({
  selector: 'app-card-builder-lab',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    BadgeComponent,
    ButtonComponent,
    ButtonIconComponent,
    ChartComponent,
    ConfirmDialogComponent,
    FunctionalNoticeComponent,
    IconComponent,
    InputSearchComponent,
    InputTextComponent,
    ModalComponent,
    PropertiesPanelComponent,
    SegmentedControlComponent,
    WidgetCardComponent,
  ],
  templateUrl: './card-builder-lab.page.html',
  styleUrl: './card-builder-lab.page.scss',
})
export class CardBuilderLabPage {
  private toaster = inject(ToasterService);

  readonly BOARD  = BOARD;
  // A place is narrow: first, middle and last month only, or the labels collide
  readonly axisMonths = [MONTHS[0], MONTHS[Math.floor((MONTHS.length - 1) / 2)], MONTHS[MONTHS.length - 1]];
  readonly CHART_HEIGHT = 96;

  // ── Board ──────────────────────────────────────────────────────────────
  customCards = signal<LabCard[]>([]);
  flashId     = signal<string | null>(null);   // card just added → brief highlight

  // ── Builder state ──────────────────────────────────────────────────────
  builderOpen = signal(false);
  step        = signal<1 | 2>(1);
  editingId   = signal<string | null>(null);   // null = new card
  draft       = signal<LabCard>(this.blankCard());
  private initialSnapshot = '';
  // The place the list on the right acts on
  sel         = signal<{ column: Column; index: number } | null>(null);
  query       = signal('');
  // The list shows figures or charts, never both on one row
  kind        = signal<'fig' | 'chart'>('fig');
  discardOpen = signal(false);
  announcement = signal('');                   // live region (WCAG 4.1.3)

  // Drag state (native HTML5): a bonus, every move also exists as a button
  dragKey = signal<string | null>(null);
  dropAt  = signal<{ column: Column; index: number } | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────
  hasContent = computed(() => this.keys(this.draft()).length > 0);

  // Key held by the selected place, null when the place is empty
  selKey = computed(() => {
    const s = this.sel();
    return s ? this.draft().cells[s.column][s.index] ?? null : null;
  });

  freeTotal = computed(() => this.cardColumns(this.draft()).reduce<number>((n, c) => n + this.free(this.draft().cells[c]), 0));

  placesHint = computed(() => {
    const n = this.freeTotal();
    if (n === 0) return 'The card is full: click an item to replace or remove it.';
    return `${n} free ${n === 1 ? 'place' : 'places'}. Click a place to fill it, drag an item to move it.`;
  });

  // Step 1: what the format holds, so the choice is made knowing it
  capacityHint = computed(() => {
    const c = this.draft();
    const n = this.places(c) * c.columnCount;
    return `Holds ${n} figures, or ${c.columnCount === 2 ? 'two charts' : 'one chart'}.`;
  });

  builderTitle = computed(() => this.editingId() ? 'Edit card' : 'New card');

  // Format settings: an option that would not hold the content is off, with its reason
  sizeOptions = computed<SegmentedOption[]>(() => {
    const c = this.draft();
    return [
      { value: 'S', label: 'Small', disabled: c.columnCount === 2 && !this.merged(c) },
      { value: 'M', label: 'Wide' },
    ];
  });

  columnOptions = computed<SegmentedOption[]>(() => {
    const c = this.draft();
    return [
      { value: '1', label: 'One', disabled: c.columnCount === 2 && !this.merged(c) },
      { value: '2', label: 'Two', disabled: c.size === 'S' },
    ];
  });

  densityOptions = computed<SegmentedOption[]>(() => {
    const c = this.draft();
    const other: Density = c.density === 'stacked' ? 'inline' : 'stacked';
    const fits = this.cardColumns(c).every(col => !!this.fit(c.cells[col], other));
    return [
      { value: 'stacked', label: 'Label above value', disabled: other === 'stacked' && !fits },
      { value: 'inline',  label: 'On one line',       disabled: other === 'inline' && !fits },
    ];
  });

  formatHint = computed(() => {
    const c = this.draft();
    if (c.size === 'S') return 'Two columns need a wide card.';
    if (c.columnCount === 2 && !this.merged(c)) return 'One column cannot hold all this content: remove items first.';
    return '';
  });

  densityHint = computed(() => this.densityOptions().some(o => o.disabled)
    ? 'Labels above values take twice the height: remove a few items first.'
    : '');

  kindOptions: SegmentedOption[] = [
    { value: 'fig',   label: `Figures (${FIGURES.length})` },
    { value: 'chart', label: `Charts (${FIGURES.filter(f => f.chart).length})` },
  ];

  setKind(value: string): void { this.kind.set(value === 'chart' ? 'chart' : 'fig'); }

  // No chart fits the selected place: said once above the list, not on each row
  chartsBlocked = computed(() => this.kind() === 'chart'
    && !FIGURES.some(f => f.chart && (this.canPick('chart:' + f.id) || this.selKey() === 'chart:' + f.id)));

  // List on the right: the four groups, narrowed by the tab and the search
  groups = computed(() => {
    const q = this.query().trim().toLowerCase();
    const charts = this.kind() === 'chart';
    return GROUPS
      .map(group => ({
        group,
        figures: FIGURES.filter(f => f.group === group && (!charts || !!f.chart) && (!q
          || (charts ? f.chart!.label : f.label).toLowerCase().includes(q)
          || group.toLowerCase().includes(q))),
      }))
      .filter(g => g.figures.length);
  });

  // ── Places ─────────────────────────────────────────────────────────────
  span(key: string, density: Density = this.draft().density): number {
    return key.startsWith('chart:') ? CHART_SPAN[density] : 1;
  }

  places(card: LabCard): number { return PLACES[card.density]; }

  private free(cells: Cell[]): number { return cells.filter(c => c === null).length; }

  private keys(card: LabCard): string[] {
    return this.cardColumns(card).flatMap(c => card.cells[c].filter((k): k is string => !!k));
  }

  private locate(card: LabCard, key: string): { column: Column; index: number } | null {
    for (const column of this.cardColumns(card)) {
      const index = card.cells[column].indexOf(key);
      if (index >= 0) return { column, index };
    }
    return null;
  }

  // Put `key` before place `i`, then take back as many empty places as it
  // spans, the nearest ones below first: items under it move down.
  private insert(cells: Cell[], i: number, key: string, density: Density): Cell[] {
    const out = [...cells];
    out.splice(i, 0, key);
    let n = this.span(key, density);
    for (let j = i + 1; j < out.length && n; ) {
      if (out[j] === null) { out.splice(j, 1); n--; } else j++;
    }
    for (let j = i - 1; j >= 0 && n; j--) {
      if (out[j] === null) { out.splice(j, 1); n--; }
    }
    return out;
  }

  // Take `key` out, its places left empty where it was
  private extract(cells: Cell[], key: string, density: Density): Cell[] {
    const out = [...cells];
    const i = out.indexOf(key);
    if (i >= 0) out.splice(i, 1, ...empty(this.span(key, density)));
    return out;
  }

  // Same content in another density: empty places go first, from the bottom.
  // null when the items alone need more places than the column has.
  private fit(cells: Cell[], density: Density): Cell[] | null {
    const places = PLACES[density];
    const used = cells.reduce((n, c) => n + (c ? this.span(c, density) : 0), 0);
    if (used > places) return null;
    const out = [...cells];
    let total = used + this.free(out);
    while (total > places) { out.splice(out.lastIndexOf(null), 1); total--; }
    while (total < places) { out.push(null); total++; }
    return out;
  }

  // Two columns folded into one: the left one, then the items of the right one
  private merged(card: LabCard): Cell[] | null {
    return this.fit([...card.cells[0], ...card.cells[1].filter(k => !!k)], card.density);
  }

  // Can `key` go to place `index` of `column`? Counts the room freed by what
  // it replaces and by `key` itself leaving the same column.
  private fitsAt(key: string, column: Column, replaced: Cell): boolean {
    const card = this.draft();
    const cells = card.cells[column];
    const freed = (replaced && replaced !== key ? this.span(replaced) : 0)
      + (cells.includes(key) ? this.span(key) : 0);
    return this.span(key) <= this.free(cells) + freed;
  }

  canPick(key: string): boolean {
    const s = this.sel();
    // An item shows once: already on the card, it is greyed out in the list.
    // It moves with Up, Down and drag, not from here.
    if (!s || this.locate(this.draft(), key)) return false;
    return this.fitsAt(key, s.column, this.selKey());
  }

  // ── Lookups for the template ───────────────────────────────────────────
  figureOf(key: string): Figure { return FIGURE_MAP[key.slice(key.indexOf(':') + 1)]; }
  isChart(key: string): boolean { return key.startsWith('chart:'); }

  labelOf(key: string): string {
    const f = this.figureOf(key);
    return this.isChart(key) ? f.chart!.label : f.label;
  }

  sectionsOf(key: string): PropertySection[] {
    const f = this.figureOf(key);
    return [{ rows: [{ label: f.label, value: f.value }] }];
  }

  cardColumns(card: LabCard): Column[] { return card.columnCount === 2 ? [0, 1] : [0]; }

  columnLabel(c: Column): string { return c === 0 ? 'left column' : 'right column'; }

  isSelected(column: Column, index: number): boolean {
    const s = this.sel();
    return this.step() === 2 && !!s && s.column === column && s.index === index;
  }

  // Tag beside an option of the list: that item is already on the card
  where(key: string): string | null {
    if (this.selKey() === key) return 'In this place';
    return this.locate(this.draft(), key) ? 'On the card' : null;
  }

  chartNote(f: Figure): string {
    const key = 'chart:' + f.id;
    if (this.locate(this.draft(), key) || this.canPick(key)) return `Takes ${this.span(key)} places`;
    return `Needs ${this.span(key)} free places`;
  }

  selTitle = computed(() => {
    const s = this.sel();
    if (!s) return '';
    const key = this.selKey();
    const where = this.draft().columnCount === 2 ? `, ${this.columnLabel(s.column)}` : '';
    return key ? `${this.labelOf(key)}${where}` : `Empty place${where}`;
  });

  // ── Builder lifecycle ──────────────────────────────────────────────────
  private blankCard(): LabCard {
    return { id: '', name: '', nameEdited: false, size: 'S', columnCount: 1, density: 'stacked',
      cells: [empty(PLACES.stacked), []] };
  }

  openNew(): void {
    this.editingId.set(null);
    this.draft.set({ ...this.blankCard(), id: `lab-card-${++cardCounter}` });
    this.startSession();
  }

  openEdit(id: string): void {
    const card = this.customCards().find(c => c.id === id);
    if (!card) return;
    this.editingId.set(id);
    this.draft.set({ ...card, cells: [[...card.cells[0]], [...card.cells[1]]] });
    this.startSession();
  }

  // Opens on the first empty place: the list is ready to fill it at once
  private startSession(): void {
    this.initialSnapshot = JSON.stringify(this.draft());
    this.query.set('');
    this.kind.set('fig');
    this.selectFirstFree();
    // A new card starts with its format; an existing one with its content
    this.step.set(this.editingId() ? 2 : 1);
    this.builderOpen.set(true);
  }

  // A new card with nothing placed loses nothing: a format alone is not work
  private isDirty(): boolean {
    if (!this.editingId() && !this.hasContent()) return false;
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
      this.toaster.show(`"${card.name}" is now on this board.`, { tone: 'success', title: 'Card added' });
    }
    this.flash(card.id);
    this.closeBuilder();
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
    return { ...c, name: this.keys(c).slice(0, 2).map(k => this.labelOf(k)).join(' & ') };
  }

  setSize(value: string): void {
    const size = value as CardSize;
    if (this.sizeOptions().find(o => o.value === size)?.disabled || size === this.draft().size) return;
    this.draft.update(c => size === 'S' && c.columnCount === 2
      ? { ...c, size, columnCount: 1, cells: [this.merged(c)!, []] }
      : { ...c, size });
    this.selectFirstFree();
    this.announce(`Size set to ${size === 'S' ? 'small' : 'wide'}.`);
  }

  setColumns(value: string): void {
    const count = Number(value) as ColumnCount;
    if (this.columnOptions().find(o => o.value === value)?.disabled || count === this.draft().columnCount) return;
    this.draft.update(c => count === 2
      // The right column opens empty, the content stays on the left
      ? { ...c, columnCount: 2, cells: [c.cells[0], empty(PLACES[c.density])] }
      : { ...c, columnCount: 1, cells: [this.merged(c)!, []] });
    this.selectFirstFree();
    this.announce(count === 2 ? 'Two columns: the right one is empty.' : 'One column.');
  }

  setDensity(value: string): void {
    const density = value as Density;
    if (this.densityOptions().find(o => o.value === density)?.disabled || density === this.draft().density) return;
    this.draft.update(c => ({
      ...c, density,
      cells: [this.fit(c.cells[0], density)!, c.columnCount === 2 ? this.fit(c.cells[1], density)! : []],
    }));
    this.selectFirstFree();
    this.announce(density === 'inline' ? 'Figures on one line.' : 'Labels above values.');
  }

  goToStep(step: 1 | 2): void {
    this.step.set(step);
    this.query.set('');
    if (step === 2 && !this.sel()) this.selectFirstFree();
  }

  // ── Selection ──────────────────────────────────────────────────────────
  // On the format step too: clicking a place of the card goes to its content
  select(column: Column, index: number): void {
    this.step.set(2);
    this.sel.set({ column, index });
    this.query.set('');
    // A selected item opens its own tab, so it shows up as "In this place"
    const key = this.draft().cells[column][index];
    if (key) this.kind.set(this.isChart(key) ? 'chart' : 'fig');
  }

  // First empty place from `after` on, in that column, then in the others
  private selectFirstFree(from?: { column: Column; index: number }): void {
    const card = this.draft();
    const order = from ? [from.column, ...this.cardColumns(card).filter(c => c !== from.column)] : this.cardColumns(card);
    for (const column of order) {
      const start = from && column === from.column ? from.index : 0;
      const cells = card.cells[column];
      let index = cells.indexOf(null, start);
      if (index < 0 && start > 0) index = cells.indexOf(null);
      if (index >= 0) { this.sel.set({ column, index }); return; }
    }
    this.sel.set(null);
  }

  // ── Content ────────────────────────────────────────────────────────────
  // Fills the selected place, or replaces what it holds. An item already on
  // the card moves here: each item shows once.
  pick(key: string): void {
    const s = this.sel();
    if (!s || !this.canPick(key)) return;
    const replaced = this.selKey();
    this.placeKey(key, s.column, s.index, replaced);
    const at = this.locate(this.draft(), key)!;
    if (replaced) {
      this.sel.set(at);
      this.announce(`${this.labelOf(replaced)} replaced by ${this.labelOf(key)}.`);
    } else {
      // Filling: move on to the next empty place, to keep picking
      this.selectFirstFree({ column: at.column, index: at.index + 1 });
      this.announce(`${this.labelOf(key)} added.`);
    }
  }

  // Moves or adds `key` to place `index` of `column`, dropping `replaced` if any
  private placeKey(key: string, column: Column, index: number, replaced: Cell): void {
    this.draft.update(c => {
      const d = c.density;
      const cells: [Cell[], Cell[]] = [[...c.cells[0]], [...c.cells[1]]];
      let target = index;
      if (replaced) cells[column] = this.extract(cells[column], replaced, d);
      const from = this.locate({ ...c, cells }, key);
      if (from) {
        cells[from.column] = this.extract(cells[from.column], key, d);
        // Leaving from above in the same column: its extra places shift the target down
        if (from.column === column && from.index < target) target += this.span(key, d) - 1;
      }
      cells[column] = this.insert(cells[column], target, key, d);
      return this.autoName({ ...c, cells });
    });
  }

  // Immediate and silent: the place empties on the card, which says enough.
  // The empty place gets selected, so a replacement is one click away.
  remove(key: string): void {
    const at = this.locate(this.draft(), key);
    if (!at) return;
    this.draft.update(c => {
      const cells: [Cell[], Cell[]] = [[...c.cells[0]], [...c.cells[1]]];
      cells[at.column] = this.extract(cells[at.column], key, c.density);
      return this.autoName({ ...c, cells });
    });
    this.sel.set(at);
    this.announce(`${this.labelOf(key)} removed.`);
  }

  // One place up or down: swaps with what is there, an item or an empty place
  canMoveBy(dir: -1 | 1): boolean {
    const s = this.sel();
    if (!s || !this.selKey()) return false;
    const to = s.index + dir;
    return to >= 0 && to < this.draft().cells[s.column].length;
  }

  moveBy(dir: -1 | 1): void {
    const s = this.sel();
    const key = this.selKey();
    if (!s || !key || !this.canMoveBy(dir)) return;
    this.draft.update(c => {
      const cells: [Cell[], Cell[]] = [[...c.cells[0]], [...c.cells[1]]];
      const col = cells[s.column];
      [col[s.index], col[s.index + dir]] = [col[s.index + dir], col[s.index]];
      return this.autoName({ ...c, cells });
    });
    this.sel.set({ column: s.column, index: s.index + dir });
    this.announce(`${this.labelOf(key)} moved ${dir === -1 ? 'up' : 'down'}.`);
  }

  canMoveAcross = computed(() => {
    const s = this.sel();
    const key = this.selKey();
    if (!s || !key || this.draft().columnCount === 1) return false;
    return this.fitsAt(key, s.column === 0 ? 1 : 0, null);
  });

  // To the first empty place of the other column
  moveAcross(): void {
    const s = this.sel();
    const key = this.selKey();
    if (!s || !key || !this.canMoveAcross()) return;
    const target: Column = s.column === 0 ? 1 : 0;
    this.placeKey(key, target, this.draft().cells[target].indexOf(null), null);
    this.sel.set(this.locate(this.draft(), key));
    this.announce(`${this.labelOf(key)} moved to the ${this.columnLabel(target)}.`);
  }

  // ── Drag and drop (pointer path, a bonus over the buttons) ─────────────
  onDragStart(ev: DragEvent, key: string): void {
    this.dragKey.set(key);
    ev.dataTransfer?.setData('text/plain', key);
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
  }

  // A place where the dragged item does not fit refuses it: no-drop cursor
  onCellDragOver(ev: DragEvent, column: Column, index: number): void {
    const key = this.dragKey();
    if (!key || !this.fitsAt(key, column, null)) { this.dropAt.set(null); return; }
    ev.preventDefault();
    this.dropAt.set({ column, index });
  }

  onCellDrop(ev: DragEvent): void {
    ev.preventDefault();
    const key = this.dragKey();
    const at = this.dropAt();
    if (key && at && this.draft().cells[at.column][at.index] !== key) {
      this.placeKey(key, at.column, at.index, null);
      this.sel.set(this.locate(this.draft(), key));
      this.announce(`${this.labelOf(key)} moved.`);
    }
    this.onDragEnd();
  }

  onDragEnd(): void {
    this.dragKey.set(null);
    this.dropAt.set(null);
  }

  isDropTarget(column: Column, index: number): boolean {
    const at = this.dropAt();
    return !!at && at.column === column && at.index === index;
  }

  // ── Misc ───────────────────────────────────────────────────────────────
  private announce(msg: string): void {
    this.announcement.set('');
    setTimeout(() => this.announcement.set(msg), 30);
  }

  // Edit mode: say where the card lives before the analyst changes it
  usedOnBoards(): number { return 2; }
}
