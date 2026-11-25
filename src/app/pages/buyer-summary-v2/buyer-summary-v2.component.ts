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
  PropertiesPanelComponent,
  ModalComponent,
  ButtonComponent,
  ButtonIconComponent,
  IconComponent,
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
  InputSearchComponent,
  SnackbarComponent,
  SkeletonItemComponent,
  FunctionalNoticeComponent,
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
  type BentoCard, type BentoFormat, type BentoKind, type CatalogEntry, type Emphasis, type EmphasisChoice,
  FORMATS, FORMAT_GROUPS, FORMAT_MAP, KINDS,
  CATALOG, CATALOG_GROUPS, CATALOG_MAP,
  AS_OF, AS_OF_TIME, CARD_UPDATED, shortDate,
} from './buyer-summary-v2.data';
import { type Placed, packCards, nearestFormat, stepFormat } from './bento-layout';
import { BentoCardBodyComponent } from './bento-card-body.component';
import { BentoThumbComponent } from './bento-thumb.component';
import {
  type Look, type Tone, type EmphasisOption, TONE_LABEL, MAX_AUTO_BACKGROUNDS,
  autoBackgrounds, lookOf, normalize, emphasisOptions,
} from './buyer-summary-v2.status';
import { type IconName } from '../../shared/ui/icon/icon.component';
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
const DRAG_GRIP_PX     = 48;   // where a card from the gallery is held
const FLASH_MS         = 700;  // fade of a card just added (benchmark 5.1)
const SNACK_MS         = 8000; // time to undo a removal
const BOOT_MS          = 500;  // first card of a board, then one card every 50 ms
const BOOT_STEP_MS     = 50;
const ADD_LOAD_MS      = 600;  // a card just added or retried
const MOVE_COOLDOWN_MS = 140;  // hysteresis between two reorders

const sameOrder = (a: BentoCard[], b: BentoCard[]) =>
  a.length === b.length && a.every((c, i) => c === b[i]);
/** Where a new board starts: a template, a copy of an existing board, or nothing. */
type NewBoardSource = 'template' | 'board' | 'empty';

const sameCards = (a: BentoCard[], b: BentoCard[]) =>
  a.length === b.length && a.every((c, i) => c.id === b[i].id && c.kind === b[i].kind
    && c.format === b[i].format && c.emphasis === b[i].emphasis);

interface PressState { id: string; el: HTMLElement | null; x: number; y: number; add?: boolean; }
interface DragState {
  id: string;
  el: HTMLElement;
  offX: number; offY: number;      // pointer offset inside the card
  lastX: number; lastY: number;
  origin: BentoCard[];             // order before the drag (Escape restores it)
  lastMove: number;
  fromGallery: boolean;            // a new card dragged out of the gallery
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
    PropertiesPanelComponent,
    ModalComponent,
    ButtonComponent,
    ButtonIconComponent,
    IconComponent,
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
    InputSearchComponent,
    SnackbarComponent,
    SkeletonItemComponent,
    FunctionalNoticeComponent,
    NgTemplateOutlet,
    BentoCardBodyComponent,
    BentoThumbComponent,
  ],
  templateUrl: './buyer-summary-v2.component.html',
  styleUrls: ['./buyer-summary-v2.component.scss', './buyer-summary-v2.panels.scss'],
})
export class BuyerSummaryV2Component implements OnInit, OnDestroy {
  private route    = inject(ActivatedRoute);
  private store    = inject(BuyerSummaryStore);
  private viewed   = inject(ViewedBuyersStore);
  private toaster  = inject(ToasterService);
  private injector = inject(Injector);
  private host     = inject(ElementRef);

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
  readonly FORMAT_GROUPS = FORMAT_GROUPS;

  readonly AS_OF = AS_OF;
  readonly AS_OF_TIME = AS_OF_TIME;

  // ── Boards (templates + personal boards), saved in localStorage ───────────
  readonly TEMPLATES = TEMPLATES;
  private stored = loadBoards();
  boards         = signal<Board[]>(this.stored?.boards ?? templateBoards());
  currentBoardId = signal<string>(this.stored?.current ?? 'common');
  currentBoard   = computed(() => this.boards().find(b => b.id === this.currentBoardId()) ?? this.boards()[0]);
  boardOptions   = computed<SelectOption[]>(() => this.boards().map(b => ({ value: b.id, label: b.name })));
  /** Manage boards: the job templates on top, the analyst's own boards below. */
  templateList   = computed(() => this.boards().filter(b => b.builtin));
  ownBoards      = computed(() => this.boards().filter(b => !b.builtin));

  // Manage boards drawer: templates open as they are (read-only), your boards
  // also rename and delete; a new board starts from a template, from a copy of
  // an existing board, or empty
  drawerOpen   = signal<boolean>(false);
  drawerView   = signal<'boards' | 'create'>('boards');
  newBoardName = signal<string>('');
  newBoardFrom = signal<NewBoardSource>('template');
  newBoardTemplate = signal<TemplateId>('common');
  newBoardSourceId = signal<string>('common');
  /** The name was typed by hand: changing the source no longer rewrites it. */
  private newBoardNameTouched = false;
  templateOptions = TEMPLATES.map<SelectOption>(t => ({ value: t.id, label: t.name }));

  // ── Board model: working copy of the current board's cards ────────────────
  cards   = signal<BentoCard[]>(cloneCards(this.currentBoard()?.cards ?? []));
  cols    = signal<number>(6);
  editing = signal<boolean>(false);
  dragId  = signal<string | null>(null);
  openMenuId = signal<string | null>(null);
  menuView   = signal<'format' | 'emphasis'>('format');
  announcement = signal<string>('');

  // While dragging, no settling swaps: the lifted card's spot stays predictable
  // While dragging or resizing, no settling swaps (the spot stays predictable)
  // and no stretching while resizing (the card shows the format it snaps to)
  placed   = computed(() => packCards(this.cards(), this.cols(),
    this.dragId() === null && this.resizeId() === null, this.resizeId() === null));
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
    const grid = this.host.nativeElement as HTMLElement;
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
    const edge = p.w >= 2 ? '' : p.x === 0 ? ' bento-cell--start' : p.x + p.w === this.cols() ? ' bento-cell--end' : '';
    return `bento-cell--x${p.x + 1} bento-cell--y${p.y + 1} bento-cell--w${p.w} bento-cell--h${p.h}${edge}`;
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

  // ── Edit mode ──────────────────────────────────────────────────────────────

  /** Board as it was when edit mode started (Cancel goes back to it). */
  private editOrigin = signal<BentoCard[]>([]);
  discardOpen = signal<'cancel' | 'leave' | null>(null);
  private leaveResolve: ((ok: boolean) => void) | null = null;

  /** Changes since edit mode started (undo steps that still count). */
  changeCount = computed(() => this.undoStack().length);
  dirty = computed(() => this.editing() && !sameCards(this.cards(), this.editOrigin()));

  startEditing(): void {
    // Templates are read-only: Duplicate makes a board of your own to edit
    if (this.currentBoard().builtin) return;
    this.editOrigin.set(this.cards());
    this.undoStack.set([]);
    this.redoStack.set([]);
    this.editing.set(true);
    this.announce('Edit mode. Drag a card to move it, or use its toolbar. Done saves, Cancel puts the board back.');
  }

  /** Done: save the board and leave edit mode. */
  stopEditing(): void {
    const changed = this.dirty();
    this.exitEditing();
    this.saveCurrentCards();
    this.announce('Board saved.');
    if (changed) this.toaster.show('Your board layout is saved', { tone: 'success', title: 'Board updated' });
  }

  /** Cancel: back to the board as it was, after a confirmation if work is lost. */
  cancelEditing(): void {
    if (this.dirty()) { this.discardOpen.set('cancel'); return; }
    this.exitEditing();
    this.announce('Edit mode closed, nothing changed.');
  }

  confirmDiscard(): void {
    const reason = this.discardOpen();
    this.discardOpen.set(null);
    const origin = this.editOrigin();
    this.exitEditing();
    this.mutate(() => this.cards.set(origin));
    this.announce('Changes discarded.');
    if (reason === 'leave') this.settleLeave(true);
  }

  keepEditing(): void {
    const reason = this.discardOpen();
    this.discardOpen.set(null);
    if (reason === 'leave') this.settleLeave(false);
  }

  private exitEditing(): void {
    this.cancelPress();
    this.closeMenu();
    this.keyGrab.set(null);
    this.galleryOpen.set(false);
    this.snack.set(null);
    this.undoStack.set([]);
    this.redoStack.set([]);
    this.editing.set(false);
  }

  /** Route guard: leaving the page in edit mode with changes asks first. */
  canLeave(): boolean | Promise<boolean> {
    if (!this.dirty()) return true;
    this.discardOpen.set('leave');
    return new Promise<boolean>(resolve => (this.leaveResolve = resolve));
  }

  private settleLeave(ok: boolean): void {
    this.leaveResolve?.(ok);
    this.leaveResolve = null;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(ev: BeforeUnloadEvent): void {
    if (this.dirty()) ev.preventDefault();
  }

  // ── Undo / redo (session stack, Ctrl+Z, Ctrl+Shift+Z) ─────────────────────

  undo(): void {
    const stack = this.undoStack();
    if (!stack.length) return;
    const prev = stack[stack.length - 1];
    this.undoStack.set(stack.slice(0, -1));
    this.redoStack.update(s => [...s, this.cards()]);
    this.snack.set(null);
    this.mutate(() => this.cards.set(prev));
    this.announce('Undone.');
  }

  redo(): void {
    const stack = this.redoStack();
    if (!stack.length) return;
    const next = stack[stack.length - 1];
    this.redoStack.set(stack.slice(0, -1));
    this.undoStack.update(s => [...s, this.cards()]);
    this.mutate(() => this.cards.set(next));
    this.announce('Redone.');
  }

  @HostListener('document:keydown', ['$event'])
  onShortcut(ev: KeyboardEvent): void {
    if (!this.editing() || !(ev.ctrlKey || ev.metaKey)) return;
    const t = ev.target as HTMLElement | null;
    if (t?.closest('input, textarea')) return;
    const k = ev.key.toLowerCase();
    if (k === 'z' && !ev.shiftKey) { ev.preventDefault(); this.undo(); }
    else if ((k === 'z' && ev.shiftKey) || k === 'y') { ev.preventDefault(); this.redo(); }
  }

  // Reversible actions get a snackbar with Undo instead of a confirmation
  snack = signal<{ text: string; undo: () => void } | null>(null);
  private snackTimer: ReturnType<typeof setTimeout> | undefined;

  private showSnack(text: string, undo: () => void = () => this.undo()): void {
    clearTimeout(this.snackTimer);
    this.snack.set({ text, undo });
    this.snackTimer = setTimeout(() => this.snack.set(null), SNACK_MS);
  }

  undoFromSnack(ev: Event): void {
    ev.preventDefault();
    const undo = this.snack()?.undo;
    this.snack.set(null);
    undo?.();
  }

  // ── Boards: switch, create, rename, delete ─────────────────────────────────

  private persist(): void {
    saveBoards(this.currentBoardId(), this.boards());
  }

  private saveCurrentCards(): void {
    const id = this.currentBoardId();
    const cards = cloneCards(this.cards());
    // A template is never changed, not even by mistake
    this.boards.update(arr => arr.map(b => (b.id === id && !b.builtin ? { ...b, cards } : b)));
    this.persist();
  }

  selectBoard(id: string): void {
    if (!id || id === this.currentBoardId() || this.editing()) return;
    const board = this.boards().find(b => b.id === id);
    if (!board) return;
    this.closeMenu();
    this.currentBoardId.set(id);
    this.cards.set(cloneCards(board.cards));
    this.loadBoard();
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

  /** New board: from a template, from a copy of an existing board, or empty.
   *  The open board preselects the template or the board to copy. */
  openCreateBoard(): void {
    const cur = this.currentBoard();
    this.newBoardNameTouched = false;
    this.newBoardTemplate.set(cur.template ?? 'common');
    this.newBoardSourceId.set(cur.id);
    this.pickNewBoardSource(cur.builtin ? 'template' : 'board');
    this.drawerView.set('create');
    this.drawerOpen.set(true);
  }

  pickNewBoardSource(from: NewBoardSource): void {
    this.newBoardFrom.set(from);
    this.suggestBoardName();
  }

  pickNewBoardTemplate(id: string): void {
    if (!(id in TEMPLATE_MAP)) return;
    this.newBoardTemplate.set(id as TemplateId);
    this.suggestBoardName();
  }

  pickNewBoardCopy(id: string): void {
    if (!this.boards().some(b => b.id === id)) return;
    this.newBoardSourceId.set(id);
    this.suggestBoardName();
  }

  typeNewBoardName(name: string): void {
    this.newBoardNameTouched = true;
    this.newBoardName.set(name);
  }

  /** Default name, editable: "Copy of Common", "New board". */
  private suggestBoardName(): void {
    if (this.newBoardNameTouched) return;
    const from = this.newBoardFrom();
    const base = from === 'empty' ? 'New board'
      : `Copy of ${from === 'template' ? TEMPLATE_MAP[this.newBoardTemplate()].name : this.boardById(this.newBoardSourceId())?.name ?? 'board'}`;
    this.newBoardName.set(this.uniqueName(base).slice(0, BOARD_NAME_MAX));
  }

  /** What the new board will hold, under the choices. */
  newBoardSummary = computed(() => {
    const from = this.newBoardFrom();
    if (from === 'empty') return 'No card yet.';
    if (from === 'template') {
      const t = TEMPLATE_MAP[this.newBoardTemplate()];
      return `${t.purpose}, ${t.cards.length} cards.`;
    }
    const n = this.boardById(this.newBoardSourceId())?.cards.length ?? 0;
    return `${n} ${n === 1 ? 'card' : 'cards'}, as saved.`;
  });

  private boardById(id: string): Board | undefined {
    return this.boards().find(b => b.id === id);
  }

  /** Cards and template of the source picked in New board. */
  private newBoardSource(): { cards: BentoCard[]; template: TemplateId | null } {
    const from = this.newBoardFrom();
    if (from === 'template') {
      const t = TEMPLATE_MAP[this.newBoardTemplate()];
      return { cards: t.cards, template: t.id };
    }
    if (from === 'board') {
      const b = this.boardById(this.newBoardSourceId()) ?? this.currentBoard();
      // The open board: its saved state (edits are only saved by Done)
      return { cards: b.cards, template: b.template };
    }
    return { cards: [], template: null };
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
    const { cards, template } = this.newBoardSource();
    this.addOwnBoard(this.newBoardName().trim(), cards, template, 'Board created');
  }

  /** Duplicate the open board (template or yours): the copy opens in edit mode. */
  duplicateBoard(): void {
    if (this.editing()) return;
    const src = this.currentBoard();
    const name = this.uniqueName(`Copy of ${src.name}`).slice(0, BOARD_NAME_MAX);
    this.addOwnBoard(name, src.cards, src.template, 'Board duplicated');
  }

  /** A new board of your own, opened at once in edit mode: it is made to be changed. */
  private addOwnBoard(name: string, source: BentoCard[], template: TemplateId | null, title: string): void {
    const board: Board = {
      id: newId('board'),
      name,
      builtin: false,
      template,
      cards: source.map(c => ({ ...c, id: newId(c.kind) })),
    };
    this.closeMenu();
    this.boards.update(arr => [...arr, board]);
    this.drawerOpen.set(false);
    this.openBoard(board);
    this.persist();
    this.toaster.show(`You are editing “${board.name}”, one of your boards`, { tone: 'success', title });
    this.startEditing();
    this.announce(`${board.name} created. Edit mode: drag a card to move it, or use its toolbar. Done saves.`);
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

  /** Delete one of your boards at once: no confirmation, Undo in the snackbar. */
  deleteBoard(board: Board): void {
    if (board.builtin) return;
    const before = this.boards();
    const wasCurrent = this.currentBoardId();
    const i = before.findIndex(b => b.id === board.id);
    this.boards.update(arr => arr.filter(b => b.id !== board.id));
    if (wasCurrent === board.id) {
      // Back to the previous board, or Common
      this.openBoard(this.boards()[Math.max(0, i - 1)] ?? this.boards()[0]);
    }
    this.persist();
    this.showSnack(`“${board.name}” deleted.`, () => {
      this.boards.set(before);
      if (wasCurrent === board.id) this.openBoard(board);
      this.persist();
      this.announce(`${board.name} is back.`);
    });
    this.announce(`${board.name} deleted. Undo brings it back.`);
  }

  private openBoard(board: Board): void {
    this.currentBoardId.set(board.id);
    this.cards.set(cloneCards(board.cards));
    this.loadBoard();
  }

  // ── Card toolbar (V1 floating toolbar): formats, emphasis, handle ──────────

  /** Formats offered as segments, as in V1; the 14 are in the "More" list. */
  readonly QUICK_FORMATS = ['1x1', '2x1', '2x2'];

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
    if (this.resize) { this.resizeEnd(true); return; }
    if (this.drag) { this.cancelDrag(); return; }
    if (this.openMenuId() !== null) {
      this.closeMenu();
    }
  }

  setFormat(id: string, format: string): void {
    this.closeMenu();
    if (this.cards().find(c => c.id === id)?.format === format) return;
    this.checkpoint();
    this.mutate(() => this.cards.update(arr => arr.map(c => (c.id === id ? { ...c, format } : c))));
    this.announce(`${this.titleOf(id)} is now ${this.formatLabel(format)}.`);
  }

  setEmphasis(id: string, emphasis: EmphasisChoice): void {
    this.closeMenu();
    this.checkpoint();
    this.cards.update(arr => arr.map(c => (c.id === id ? { ...c, emphasis } : c)));
    const kind = this.cards().find(c => c.id === id)?.kind;
    this.announce(`${this.titleOf(id)}: ${kind ? this.emphasisLabel(kind, emphasis) : emphasis}.`);
  }

  // ── Emphasis: computed status (thresholds) + manual highlight ─────────────

  readonly TONE_LABEL = TONE_LABEL;

  /** Look of every card: the 2 most urgent automatic statuses get a background. */
  looks = computed(() => {
    const order = this.placed().map(p => p.card);
    const bg = autoBackgrounds(order);
    return new Map(this.cards().map(c => [c.id, lookOf(c, bg.has(c.id))]));
  });

  look(card: BentoCard): Look {
    const l = this.looks().get(card.id) ?? lookOf(card, true);
    // Error: no data, so no status and no background. The neutral card lets the
    // error notice and Retry read as they do everywhere (DS functional notice).
    return this.isError(card.id) ? { ...l, cls: 'none', reversed: false, status: null, toned: false, capped: false, highlight: false } : l;
  }

  statusIcon(tone: Tone): IconName {
    return tone === 'positive' ? 'check-circle' : tone === 'warning' ? 'warning-triangle' : 'error-circle';
  }

  /** Reason of an On track status, for screen readers (Warning and Problem show it as text). */
  statusTip(card: BentoCard, em: Look): string {
    if (!em.status) return '';
    const how = normalize(card.emphasis) === 'auto' ? 'Automatic' : 'Shown on purpose';
    const cap = em.capped ? ` No background: kept for the ${MAX_AUTO_BACKGROUNDS} most urgent cards of the board.` : '';
    return `${how}: ${em.status.reason}. ${em.status.rule}.${cap}`;
  }

  emphasisMenu(kind: BentoKind): EmphasisOption[] {
    return emphasisOptions(kind);
  }

  emphasisLabel(kind: BentoKind, e: EmphasisChoice): string {
    return emphasisOptions(kind).find(o => o.value === normalize(e))?.label ?? e;
  }

  duplicateCard(id: string): void {
    const arr = this.cards();
    const i = arr.findIndex(c => c.id === id);
    if (i < 0) return;
    const copy: BentoCard = { ...arr[i], id: newId(arr[i].kind), emphasis: 'auto' };
    this.checkpoint();
    this.mutate(() => this.cards.set([...arr.slice(0, i + 1), copy, ...arr.slice(i + 1)]));
    this.announce(`${this.titleOf(id)} duplicated.`);
  }

  removeCard(id: string): void {
    const name = this.titleOf(id);
    this.checkpoint();
    this.mutate(() => this.cards.update(arr => arr.filter(c => c.id !== id)));
    this.showSnack(`${name} removed.`);
    this.announce(`${name} removed. Undo brings it back.`);
  }


  // ── Resize by the corner handle (point 3) ────────────────────────────────
  // The corner handle only stops on the fourteen formats; the neighbours move
  // aside live with the same FLIP engine. Keyboard: arrows on the handle.
  resizeId = signal<string | null>(null);
  private resize: { id: string; el: HTMLElement; origin: BentoCard[]; from: string } | null = null;

  onResizeDown(ev: PointerEvent, id: string): void {
    if (ev.button !== 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    const el = this.cellEl(id);
    const card = this.cards().find(c => c.id === id);
    if (!el || !card) return;
    this.closeMenu();
    this.checkpoint();
    this.resize = { id, el, origin: this.cards(), from: card.format };
    this.resizeId.set(id);
    this.announce(`Resizing ${this.titleOf(id)}, ${this.formatLabel(card.format)}.`);
  }

  private resizeMove(ev: PointerEvent): void {
    const r = this.resize;
    const grid = this.gridRef()?.nativeElement;
    if (!r || !grid) return;
    const g = grid.getBoundingClientRect();
    const cols = this.cols();
    const gap = this.gapPx();
    const step = (g.width - (cols - 1) * gap) / cols + gap;
    const left = g.left + r.el.offsetLeft;
    const top = g.top + r.el.offsetTop;
    const w = Math.max(1, Math.min(cols, Math.round((ev.clientX - left + gap) / step)));
    const h = Math.max(1, Math.round((ev.clientY - top + gap) / step));
    const format = nearestFormat(w, h, cols);
    const card = this.cards().find(c => c.id === r.id);
    if (!card || card.format === format) return;
    this.mutate(() => this.cards.update(arr => arr.map(c => (c.id === r.id ? { ...c, format } : c))));
  }

  private resizeEnd(cancel = false): void {
    const r = this.resize;
    if (!r) return;
    this.resize = null;
    this.resizeId.set(null);
    const card = this.cards().find(c => c.id === r.id);
    if (cancel) {
      this.mutate(() => this.cards.set(r.origin));
      this.dropCheckpoint();
      this.announce(`Resize cancelled. ${this.titleOf(r.id)} is back to ${this.formatLabel(r.from)}.`);
      return;
    }
    if (!card || card.format === r.from) { this.dropCheckpoint(); return; }
    // Holes close again (stretching was off during the gesture)
    this.mutate(() => this.cards.update(arr => [...arr]));
    this.announce(`${this.titleOf(r.id)} is now ${this.formatLabel(card.format)}.`);
  }

  onResizeKey(ev: KeyboardEvent, id: string): void {
    const d: Record<string, [number, number]> = {
      ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1],
    };
    const step = d[ev.key];
    if (!step) return;
    ev.preventDefault();
    const card = this.cards().find(c => c.id === id);
    if (!card) return;
    const format = stepFormat(card.format, step[0], step[1], this.cols());
    if (format === card.format) {
      this.announce(`${this.titleOf(id)} stays ${this.formatLabel(format)}: no format that way.`);
      return;
    }
    this.setFormat(id, format);
    afterNextRender(() => this.cellEl(id)?.querySelector<HTMLElement>('.bento-resize')?.focus(), { injector: this.injector });
  }

  /** Card date in its header, only when it differs from the board's date. */
  cardDate(kind: BentoKind): string {
    const d = CARD_UPDATED[kind];
    return d === AS_OF ? '' : shortDate(d);
  }

  // ── Loading states (point 6) ───────────────────────────────────────────────
  // Skeleton at the card's final size, in reading order (no jump when the data
  // comes); an error stays inside its card with Retry.
  loadingIds = signal<ReadonlySet<string>>(new Set());
  errorIds   = signal<ReadonlySet<string>>(new Set());
  /** The rating provider fails on the first load of each visit (demo of the error state). */
  private providerFailed = false;
  private loadTimers: ReturnType<typeof setTimeout>[] = [];

  isLoading(id: string): boolean { return this.loadingIds().has(id); }
  isError(id: string): boolean { return this.errorIds().has(id); }

  private markLoading(id: string, delay = ADD_LOAD_MS): void {
    this.loadingIds.update(s => new Set([...s, id]));
    this.errorIds.update(s => { const n = new Set(s); n.delete(id); return n; });
    this.loadTimers.push(setTimeout(() => this.finishLoad(id), delay));
  }

  private finishLoad(id: string): void {
    this.loadingIds.update(s => { const n = new Set(s); n.delete(id); return n; });
    const card = this.cards().find(c => c.id === id);
    if (card?.kind === 'external-rating' && !this.providerFailed) {
      this.providerFailed = true;
      this.errorIds.update(s => new Set([...s, id]));
      this.announce(`${KINDS[card.kind].short}: the rating provider did not answer.`);
    }
    this.scheduleFit();
  }

  /** Whole board: cards arrive one after the other, in reading order. */
  private loadBoard(): void {
    this.loadTimers.forEach(t => clearTimeout(t));
    this.loadTimers = [];
    this.loadingIds.set(new Set());
    packCards(this.cards(), this.cols()).forEach((p, i) => this.markLoading(p.card.id, BOOT_MS + i * BOOT_STEP_MS));
  }

  retryCard(id: string): void {
    this.markLoading(id);
    this.announce(`${this.titleOf(id)}: loading again.`);
  }

  // ── Undo steps (one per action or gesture, edit mode only) ─────────────────

  undoStack = signal<BentoCard[][]>([]);
  redoStack = signal<BentoCard[][]>([]);

  /** Remember the board before an action (call once per action). */
  private checkpoint(): void {
    if (!this.editing()) return;
    this.undoStack.update(s => [...s, this.cards()]);
    this.redoStack.set([]);
  }

  /** The action did nothing in the end: forget its step. */
  private dropCheckpoint(): void {
    this.undoStack.update(s => s.slice(0, -1));
  }

  // ── Card gallery: vignettes by topic, a click adds, a drag places ─────────
  // A card lands in its default format at the first free place (or in the
  // free space picked); its toolbar then changes the format and the emphasis.

  galleryOpen   = signal<boolean>(false);
  gallerySearch = signal<string>('');
  /** Change card type: the card whose kind is replaced. */
  replaceId     = signal<string | null>(null);
  /** "Add a card here": the hole the card goes to. */
  targetHole    = signal<{ x: number; y: number; w: number; h: number } | null>(null);
  galleryDragging = signal<boolean>(false);
  /** Last card added: its background fades out (700 ms). */
  flashId       = signal<string | null>(null);
  /** Kind of the vignette pressed, until the press becomes a drag. */
  private pressKind: BentoKind | null = null;
  /** A drag out of the gallery just ended: the click that follows adds nothing. */
  private suppressClick = false;
  private pendingAdd: { x: number; y: number; dropped?: boolean } | null = null;
  private galleryReturnFocus: HTMLElement | null = null;

  onBoardKinds = computed(() => new Set(this.cards().map(c => c.kind)));

  galleryGroups = computed(() => {
    const q = this.gallerySearch().trim().toLowerCase();
    const hole = this.targetHole();
    return CATALOG_GROUPS.map(g => ({
      group: g,
      entries: CATALOG.filter(e => e.group === g.id).filter(e => {
        if (hole && (e.minW ?? 1) > hole.w) return false;
        if (!q) return true;
        const k = KINDS[e.kind];
        return `${k.title} ${k.short} ${e.keywords} ${e.shows} ${g.label}`.toLowerCase().includes(q);
      }),
    })).filter(g => g.entries.length);
  });

  galleryCount = computed(() => this.galleryGroups().reduce((n, g) => n + g.entries.length, 0));

  /** Accessible name of a vignette: its name, what it shows, and if it is on the board. */
  tileLabel(e: CatalogEntry): string {
    const on = this.onBoardKinds().has(e.kind) ? ', already on the board' : '';
    return `${KINDS[e.kind].short}: ${e.shows}${on}`;
  }

  /** Emphasis class actually drawn for a card. */
  emClass(card: BentoCard): Emphasis {
    return this.look(card).cls;
  }

  /** The format can hold a card of this kind, on this board and in the free space picked. */
  private fits(kind: BentoKind, f: BentoFormat): boolean {
    const cols = this.cols();
    const w = f.w === 'full' ? cols : f.w;
    if (w > cols) return false;
    const hole = this.targetHole();
    if (hole && (w > hole.w || f.h > hole.h)) return false;
    return w >= Math.min(CATALOG_MAP[kind].minW ?? 1, cols);
  }

  /** Format of a card from the gallery: the one asked for, else its default, else the closest that fits. */
  private formatFor(kind: BentoKind, wanted?: string): string {
    const ok = (id: string | undefined) => !!id && !!FORMAT_MAP[id] && this.fits(kind, FORMAT_MAP[id]);
    const rec = CATALOG_MAP[kind].recommended;
    if (ok(wanted)) return wanted!;
    if (ok(rec)) return rec;
    const hole = this.targetHole();
    const f = FORMAT_MAP[rec];
    const near = nearestFormat(hole?.w ?? (f.w === 'full' ? this.cols() : f.w), hole?.h ?? f.h, this.cols());
    if (ok(near)) return near;
    return FORMATS.find(x => this.fits(kind, x))?.id ?? '1x1';
  }

  openGallery(hole: { x: number; y: number; w: number; h: number } | null = null, replaceId: string | null = null): void {
    this.galleryReturnFocus = document.activeElement as HTMLElement | null;
    this.closeMenu();
    this.drawerOpen.set(false);
    if (!this.editing()) this.startEditing();
    this.targetHole.set(hole);
    this.replaceId.set(replaceId);
    this.gallerySearch.set('');
    this.galleryOpen.set(true);
  }

  closeGallery(): void {
    this.galleryOpen.set(false);
    this.targetHole.set(null);
    this.replaceId.set(null);
    const back = this.galleryReturnFocus;
    this.galleryReturnFocus = null;
    if (back?.isConnected) afterNextRender(() => back.focus(), { injector: this.injector });
  }

  private galleryCard(kind: BentoKind): BentoCard {
    return { id: newId(kind), kind, format: this.formatFor(kind), emphasis: 'auto' };
  }

  /** Where the new card goes: in the hole asked for, or the first free slot
   *  that takes its format (end of the list = first free slot, reading order). */
  private insertIndex(card: BentoCard): number {
    const cards = this.cards();
    const hole = this.targetHole();
    if (!hole) return cards.length;
    const cols = this.cols();
    let best = cards.length;
    let bestDist = Infinity;
    for (let i = 0; i <= cards.length; i++) {
      const order = [...cards.slice(0, i), card, ...cards.slice(i)];
      const p = packCards(order, cols, false).find(q => q.card.id === card.id)!;
      const d = Math.abs(p.x - hole.x) + Math.abs(p.y - hole.y);
      if (d < bestDist) { best = i; bestDist = d; }
      if (d === 0) break;
    }
    return best;
  }

  /** Click or Enter on a vignette: add the card, or change the type of the card asked for. */
  pickGalleryCard(kind: BentoKind): void {
    if (this.suppressClick) { this.suppressClick = false; return; }
    const replaceId = this.replaceId();
    this.checkpoint();
    if (replaceId) {
      const old = this.cards().find(c => c.id === replaceId);
      const name = this.titleOf(replaceId);
      const format = this.formatFor(kind, old?.format);
      this.mutate(() => this.cards.update(arr => arr.map(c => (c.id === replaceId ? { ...c, kind, format } : c))));
      this.closeGallery();
      this.afterAdd(replaceId, `${name} changed to ${KINDS[kind].short}.`);
      return;
    }
    const card = this.galleryCard(kind);
    const i = this.insertIndex(card);
    this.mutate(() => this.cards.update(arr => [...arr.slice(0, i), card, ...arr.slice(i)]));
    this.targetHole.set(null);
    this.afterAdd(card.id);
  }

  /** After a card lands: scroll to it, fade, announce. */
  private afterAdd(id: string, message?: string): void {
    this.flashId.set(id);
    setTimeout(() => { if (this.flashId() === id) this.flashId.set(null); }, FLASH_MS);
    this.markLoading(id);
    afterNextRender(() => {
      const el = this.cellEl(id);
      el?.scrollIntoView({ block: 'nearest', behavior: this.reducedMotion ? 'auto' : 'smooth' });
      const p = this.placed().find(q => q.card.id === id);
      if (message) this.announce(message);
      else if (p) this.announce(`${this.titleOf(id)} added, position ${this.position(id)}, row ${p.y + 1}.`);
    }, { injector: this.injector });
  }

  /** Change card type (V1 "Change card type"): the gallery replaces the kind. */
  changeCardType(id: string): void {
    this.openGallery(null, id);
  }

  /** Arrow keys move between the vignettes (up and down by position), Home and End go to the ends. */
  onTileKey(ev: KeyboardEvent): void {
    const tiles = Array.from(this.host.nativeElement.querySelectorAll('.bg-tile') as NodeListOf<HTMLElement>);
    const from = tiles.indexOf(ev.currentTarget as HTMLElement);
    if (from < 0) return;
    let to = -1;
    if (ev.key === 'ArrowRight') to = Math.min(tiles.length - 1, from + 1);
    else if (ev.key === 'ArrowLeft') to = Math.max(0, from - 1);
    else if (ev.key === 'Home') to = 0;
    else if (ev.key === 'End') to = tiles.length - 1;
    else if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      const down = ev.key === 'ArrowDown';
      const r = tiles[from].getBoundingClientRect();
      const cx = r.left + r.width / 2;
      let best = Infinity;
      tiles.forEach((t, i) => {
        const q = t.getBoundingClientRect();
        const dy = down ? q.top - r.bottom : r.top - q.bottom;
        if (dy < 0) return;
        const d = dy * 1000 + Math.abs(q.left + q.width / 2 - cx);
        if (d < best) { best = d; to = i; }
      });
    } else return;
    ev.preventDefault();
    if (to >= 0 && to !== from) {
      tiles[to].focus();
      tiles[to].scrollIntoView({ block: 'nearest' });
    }
  }

  // Drag a vignette out of the gallery onto the board (a click does the same)
  onGalleryPointerDown(ev: PointerEvent, kind: BentoKind): void {
    this.suppressClick = false;
    if (ev.button !== 0) return;
    // No text selection while the vignette is dragged; the click still fires
    ev.preventDefault();
    (ev.currentTarget as HTMLElement).focus({ preventScroll: true });
    this.pressKind = kind;
    this.press = { id: '', el: null, x: ev.clientX, y: ev.clientY, add: true };
  }

  private startGalleryDrag(ev: PointerEvent): void {
    const kind = this.pressKind;
    if (!kind) return;
    const card = this.galleryCard(kind);
    const origin = this.cards();
    this.press = null;
    this.suppressClick = true;
    this.pendingAdd = { x: ev.clientX, y: ev.clientY };
    this.galleryDragging.set(true);
    this.checkpoint();
    this.mutate(() => this.cards.set([...origin, card]), card.id, () => {
      const pending = this.pendingAdd;
      this.pendingAdd = null;
      const el = this.cellEl(card.id);
      if (!el || !pending) { this.galleryDragging.set(false); return; }
      const r = el.getBoundingClientRect();
      this.drag = {
        id: card.id, el,
        offX: Math.min(r.width / 2, DRAG_GRIP_PX), offY: DRAG_GRIP_PX / 2,
        lastX: pending.x, lastY: pending.y,
        origin, lastMove: 0, fromGallery: true,
      };
      this.dragId.set(card.id);
      this.announce(`${KINDS[card.kind].short} picked up from the gallery. Drop it on the board.`);
      this.followPointer();
      this.hitTest(pending.x, pending.y);
      if (pending.dropped) this.onPointerUp(new PointerEvent('pointerup', { clientX: pending.x, clientY: pending.y }));
    });
  }

  private overGallery(x: number, y: number): boolean {
    const panel = document.querySelector('.bento-gallery .ds-drawer__panel');
    if (!panel) return false;
    const r = panel.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  /** Free cells in edit mode, merged into rectangles ("Add a card here"). */
  holes = computed(() => {
    if (!this.editing() || this.dragId() !== null || this.resizeId() !== null) return [];
    const placed = this.placed();
    const cols = this.cols();
    const rows = this.rowCount();
    const taken = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false));
    for (const p of placed) for (let y = p.y; y < p.y + p.h; y++) for (let x = p.x; x < p.x + p.w; x++) taken[y][x] = true;
    const out: { x: number; y: number; w: number; h: number }[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (taken[y][x]) continue;
        let w = 1;
        while (x + w < cols && !taken[y][x + w]) w++;
        let h = 1;
        while (y + h < rows && taken[y + h].slice(x, x + w).every(t => !t)) h++;
        for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) taken[yy][xx] = true;
        out.push({ x, y, w, h });
      }
    }
    return out;
  });

  holeClass(h: { x: number; y: number; w: number; h: number }): string {
    return `bento-hole bento-cell--x${h.x + 1} bento-cell--y${h.y + 1} bento-cell--w${h.w} bento-cell--h${h.h}`;
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
        if (sameOrder(grab.origin, this.cards())) this.dropCheckpoint();
        this.announce(`${this.titleOf(id)} dropped at position ${this.position(id)} of ${this.cards().length}.`);
      } else {
        this.checkpoint();
        this.keyGrab.set({ id, origin: this.cards() });
        this.announce(`${this.titleOf(id)} picked up, position ${this.position(id)} of ${this.cards().length}. Use the arrow keys, then Space to drop.`);
      }
      return;
    }
    if (ev.key === 'Escape' && grab?.id === id) {
      ev.preventDefault();
      ev.stopPropagation();
      this.keyGrab.set(null);
      this.dropCheckpoint();
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
    if (this.resize) { ev.preventDefault(); this.resizeMove(ev); return; }
    // A card from the gallery is being inserted: wait for its cell
    if (this.pendingAdd) { this.pendingAdd.x = ev.clientX; this.pendingAdd.y = ev.clientY; return; }
    const p = this.press;
    if (!this.drag) {
      if (!p) return;
      if (Math.hypot(ev.clientX - p.x, ev.clientY - p.y) < DRAG_THRESHOLD) return;
      if (p.add) { this.startGalleryDrag(ev); return; }
      const rect = p.el!.getBoundingClientRect();
      this.drag = {
        id: p.id, el: p.el!,
        offX: p.x - rect.left, offY: p.y - rect.top,
        lastX: ev.clientX, lastY: ev.clientY,
        origin: this.cards(), lastMove: 0, fromGallery: false,
      };
      this.dragId.set(p.id);
      this.checkpoint();
      this.announce(`${this.titleOf(p.id)} picked up, position ${this.position(p.id)} of ${this.cards().length}.`);
    }
    ev.preventDefault();
    const d = this.drag;
    d.lastX = ev.clientX;
    d.lastY = ev.clientY;
    this.followPointer();
    this.hitTest(ev.clientX, ev.clientY);
  }

  @HostListener('document:pointerup', ['$event'])
  @HostListener('document:pointercancel', ['$event'])
  onPointerUp(ev?: PointerEvent): void {
    if (this.resize) { this.resizeEnd(); return; }
    if (this.pendingAdd) { this.pendingAdd.dropped = true; return; }
    const d = this.drag;
    this.press = null;
    if (!d) return;
    // The click that ends a drag out of the gallery adds nothing
    if (d.fromGallery) setTimeout(() => (this.suppressClick = false));
    // Dropped back on the gallery: the card is not added
    if (d.fromGallery && ev && this.overGallery(ev.clientX, ev.clientY)) {
      this.cancelDrag();
      return;
    }
    this.drag = null;
    const from = d.el.style.transform;
    d.el.style.transform = '';
    this.dragId.set(null);
    this.galleryDragging.set(false);
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
    if (d.fromGallery) {
      this.afterAdd(d.id);
      return;
    }
    // No real move: no undo step
    if (sameOrder(d.origin, this.cards())) this.dropCheckpoint();
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
    this.galleryDragging.set(false);
    this.dropCheckpoint();
    const name = this.titleOf(d.id);
    this.mutate(() => this.cards.set(d.origin));
    this.announce(d.fromGallery ? `${name} not added.` : `Move cancelled. ${name} is back at position ${this.position(d.id)}.`);
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
    this.loadBoard();
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
    this.loadTimers.forEach(t => clearTimeout(t));
    clearTimeout(this.snackTimer);
    this.resizeObs?.disconnect();
  }
}
