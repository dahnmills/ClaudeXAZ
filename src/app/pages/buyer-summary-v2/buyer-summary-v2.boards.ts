// Buyer Summary V2, boards: the three job templates (Common, Credit Assessment,
// Credit Underwriting, as in V1) rebuilt as Bento boards, and their storage.
// Every template ends on a clean bottom edge at 6 columns (1280 px) and at
// 8 columns (1920 px): checked by the layout engine (holesOf).

import { type BentoCard, type BentoKind, type EmphasisChoice, FORMAT_MAP, KINDS, EMPHASIS_MAP } from './buyer-summary-v2.data';

export interface Board {
  id: string;
  name: string;
  /** Job template: can be edited and reset, not renamed or deleted (as in V1). */
  builtin: boolean;
  /** Template the board started from, for "Reset to template". */
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
      c('notepad',      '1x1'),
      c('identity',     '2x1'),
      c('sanction',     '1x1'),
      c('limit-review', '1x1'),
      c('decisions',    '2x1'),
      c('policies',     '4x2'),
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
      c('grade',        '2x1'),
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

export const STORAGE_KEY = 'qirin.buyer-summary-v2.boards';
const STORAGE_VERSION = 1;

export interface StoredBoards {
  v: number;
  current: string;
  boards: Board[];
}

const validCard = (x: unknown): x is BentoCard => {
  const k = x as BentoCard;
  return !!k && typeof k.id === 'string' && k.kind in KINDS && k.format in FORMAT_MAP
    && (k.emphasis === 'auto' || k.emphasis in EMPHASIS_MAP);
};

/** Saved boards, or null when nothing (or nothing readable) is stored. */
export function loadBoards(): StoredBoards | null {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredBoards;
    if (data?.v !== STORAGE_VERSION || !Array.isArray(data.boards)) return null;
    const boards = data.boards
      .filter(b => b && typeof b.id === 'string' && typeof b.name === 'string' && Array.isArray(b.cards))
      .map(b => ({ ...b, template: b.template ?? null, cards: b.cards.filter(validCard) }));
    // A template removed from the code is dropped; a new one is added
    for (const t of templateBoards()) {
      if (!boards.some(b => b.id === t.id)) boards.splice(TEMPLATES.findIndex(x => x.id === t.id), 0, t);
    }
    const current = boards.some(b => b.id === data.current) ? data.current : boards[0].id;
    return { v: STORAGE_VERSION, current, boards };
  } catch {
    return null;
  }
}

export function saveBoards(current: string, boards: Board[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: STORAGE_VERSION, current, boards }));
  } catch {
    // Private mode or full storage: the board still works for this visit
  }
}

let uid = 0;
/** Unique id for a board or a card (time based: survives reloads). */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${(++uid).toString(36)}`;
}
