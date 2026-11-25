// Buyer Summary V2, boards: the three job templates (Common, Credit Assessment,
// Credit Underwriting, as in V1) rebuilt as Bento boards, and their storage.
// Every template ends on a clean bottom edge at 6 columns (1280 px) and at
// 8 columns (1920 px): checked by the layout engine (holesOf).

import { type BentoCard, type BentoKind, type EmphasisChoice, FORMAT_MAP, KINDS, EMPHASIS_MAP } from './buyer-summary-v2.data';
import { normalize } from './buyer-summary-v2.status';

export interface Board {
  id: string;
  name: string;
  /** Job template: read-only (never edited, renamed or deleted); duplicate it to change it. */
  builtin: boolean;
  /** Template the board started from (null: started empty). */
  template: TemplateId | null;
  cards: BentoCard[];
}

export type TemplateId = 'common' | 'credit-assessment' | 'credit-underwriting';

export interface BoardTemplate {
  id: TemplateId;
  name: string;
  /** Who it is for, shown when creating a board. */
  purpose: string;
  cards: BentoCard[];
}

const c = (kind: BentoKind, format: string, emphasis: EmphasisChoice = 'auto', id: string = kind): BentoCard =>
  ({ id, kind, format, emphasis });

export const TEMPLATES: BoardTemplate[] = [
  {
    id: 'common',
    name: 'Common',
    purpose: 'Everything at a glance: risk, exposure, payments, company and follow-up',
    cards: [
      c('grade',        '3x2', 'strong'),
      c('exposure',     '3x1', 'subtle'),
      c('limit',        '1x1'),
      c('payment',      '2x1'),
      c('overdues',     '1x2'),
      c('financials',   '2x3'),
      c('jobs',         '1x4'),
      c('newsfeed',     '2x2'),
      c('score',        '1x1'),
      c('risk-figures', '1x1'),
      c('identity',     '2x1'),
      c('notepad',      '1x1'),
      c('sanction',     '1x1'),
      c('limit-review', '1x1'),
      c('decisions',    '2x1'),
      c('policies',     '3x2'),
      c('coverage',     '2x2'),
      c('glance',       'full'),
    ],
  },
  {
    // Credit analyst: is the buyer solvent, does it pay, what changed?
    id: 'credit-assessment',
    name: 'Credit Assessment',
    purpose: 'For credit analysts: grade and its history, financials, payment behaviour, news and screening',
    cards: [
      c('grade',           '3x2', 'strong'),
      c('financials',      '3x3'),
      c('score',           '1x1'),
      c('external-rating', '1x1'),
      c('sanction',        '1x1'),
      c('payment',         '3x2'),
      c('overdues',        '1x2'),
      c('newsfeed',        '2x2'),
      c('identity',        '3x1'),
      c('decisions',       '3x1'),
      c('notepad',         '1x1'),
      c('claims',          '1x1'),
    ],
  },
  {
    // Underwriter: how much can we cover, how much is used, what is due?
    id: 'credit-underwriting',
    name: 'Credit Underwriting',
    purpose: 'For underwriters: exposure against the limit, cover requests, policies, overdues and tasks due',
    cards: [
      c('exposure',     '3x2', 'strong'),
      c('coverage',     '2x2'),
      c('limit',        '1x1'),
      c('limit-review', '1x1'),
      c('policies',     '4x2'),
      c('jobs',         '1x3'),
      c('overdues',     '1x2'),
      c('payment',      '2x1'),
      c('grade',        '2x2'),
      c('decisions',    '3x1'),
      c('risk-figures', '1x1'),
      c('claims',       '1x1'),
    ],
  },
];

export const TEMPLATE_MAP: Record<TemplateId, BoardTemplate> =
  Object.fromEntries(TEMPLATES.map(t => [t.id, t])) as Record<TemplateId, BoardTemplate>;

export const cloneCards = (cards: BentoCard[]): BentoCard[] => cards.map(x => ({ ...x }));

export function templateBoards(): Board[] {
  return TEMPLATES.map(t => ({ id: t.id, name: t.name, builtin: true, template: t.id, cards: cloneCards(t.cards) }));
}

// ── Storage (localStorage, key of its own: the V1 never reads it) ───────────
// Templates live in the code and are read-only: only the analyst's own boards
// and the last board opened are stored. Version 1 also stored the templates,
// which could be edited then: a template saved with changes comes back as a
// board of your own, "Common (edited)", instead of being lost.

export const STORAGE_KEY = 'qirin.buyer-summary-v2.boards';
const STORAGE_VERSION = 2;

export interface StoredBoards {
  v: number;
  current: string;
  boards: Board[];
}

const validCard = (x: unknown): x is BentoCard => {
  const k = x as BentoCard;
  return !!k && typeof k.id === 'string' && k.kind in KINDS && k.format in FORMAT_MAP
    && (k.emphasis === 'auto' || k.emphasis === 'status' || k.emphasis === 'status-strong' || k.emphasis in EMPHASIS_MAP);
};

/** Same cards in the same order, formats and emphases (ids aside). */
const sameLayout = (a: BentoCard[], b: BentoCard[]) =>
  a.length === b.length && a.every((c, i) => c.kind === b[i].kind && c.format === b[i].format
    && normalize(c.emphasis) === normalize(b[i].emphasis));

/** "Common (edited)", then "Common (edited) 2"... */
const freeName = (base: string, boards: Board[]) => {
  const taken = new Set(boards.map(b => b.name.toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;
  let n = 2;
  while (taken.has(`${base} ${n}`.toLowerCase())) n++;
  return `${base} ${n}`;
};

/** Templates (from the code) then your saved boards; null when nothing readable is stored. */
export function loadBoards(): StoredBoards | null {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredBoards;
    if ((data?.v !== 1 && data?.v !== STORAGE_VERSION) || !Array.isArray(data.boards)) return null;
    const saved = data.boards
      .filter(b => b && typeof b.id === 'string' && typeof b.name === 'string' && Array.isArray(b.cards))
      .map(b => ({ ...b, template: b.template ?? null, cards: b.cards.filter(validCard).map(c => ({ ...c, emphasis: normalize(c.emphasis) })) }));
    let current = data.current;
    const own: Board[] = [];
    for (const b of saved) {
      if (!b.builtin) { own.push(b); continue; }
      // Version 1 stored the templates. Unchanged, the code's version is
      // enough; changed, it becomes a board of your own so the work is kept.
      const t = TEMPLATE_MAP[b.id as TemplateId];
      if (!t || !b.cards.length || sameLayout(b.cards, t.cards)) continue;
      const edited: Board = {
        id: newId('board'),
        name: freeName(`${t.name} (edited)`, [...templateBoards(), ...saved, ...own]),
        builtin: false,
        template: t.id,
        cards: b.cards,
      };
      own.push(edited);
      if (current === b.id) current = edited.id;
    }
    const boards = [...templateBoards(), ...own];
    if (!boards.some(b => b.id === current)) current = boards[0].id;
    // The migrated state is written once, in the new format
    if (data.v !== STORAGE_VERSION) saveBoards(current, boards);
    return { v: STORAGE_VERSION, current, boards };
  } catch {
    return null;
  }
}

/** Saves your boards and the board opened; the templates never. */
export function saveBoards(current: string, boards: Board[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: STORAGE_VERSION, current, boards: boards.filter(b => !b.builtin) }));
  } catch {
    // Private mode or full storage: the board still works for this visit
  }
}

let uid = 0;
/** Unique id for a board or a card (time based: survives reloads). */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${(++uid).toString(36)}`;
}
