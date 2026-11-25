// Buyer Summary V2, automatic status of the cards.
// Compromise validated on 2026-11-20 (edit-flow benchmark, section 6):
// - status tones (on track, warning, problem) are COMPUTED from the data by the
//   business thresholds below, never picked by hand, so they never contradict
//   the data; always an icon, a label and the reason;
// - at most 2 automatic status backgrounds per board (the most urgent), the
//   other cards keep their status label without a background; never a full
//   green background;
// - the analyst can hide the background ("No background") or force it, pale or
//   strong; "Auto" is the default; subtle and strong highlights stay manual.

import {
  type BentoCard, type BentoKind, type Emphasis, type EmphasisChoice, EMPHASIS_MAP, AS_OF,
  JOBS, PAYMENT_BANDS, OVERDUE_PERIODS, COVER_HISTORY, GRADE_CHANGES, GRADE_HISTORY, FINANCIALS, EXTERNAL_RATINGS,
} from './buyer-summary-v2.data';

export type Tone = 'positive' | 'warning' | 'negative';

export interface AutoStatus {
  tone: Tone;
  /** Why, with this buyer's figures ("review due in 12 days"). */
  reason: string;
  /** The threshold, in words. */
  rule: string;
  /** Order among statuses of the same tone (1 = most urgent). */
  rank: number;
}

export interface AutoRule {
  kind: BentoKind;
  card: string;
  thresholds: string;
}

// ── Facts of the buyer, derived from the mock data ──────────────────────────

const MONTHS_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};
/** "02 Dec 2024" → days since epoch (UTC). */
const day = (d: string) => {
  const [dd, mm, yy] = d.split(' ');
  return Date.UTC(Number(yy), MONTHS_INDEX[mm], Number(dd)) / 86_400_000;
};
const TODAY = day(AS_OF);

const EXPOSURE = 1_548_000;
const GRANTED_LIMIT = 5_000_000;
const COVER_GRANTED = 2_000_000;
const COVER_OUTCOME: string = COVER_HISTORY[0].outcome;
const LIMIT_REVIEW_DUE = '02 Dec 2024';
const SANCTION_HITS_OPEN = 1;
const SCORE = 82;
const CLAIMS_OPEN = 0;
const OVERDUE_OPEN_USD = OVERDUE_PERIODS[OVERDUE_PERIODS.length - 1].value * 1000;
const OVERDUE_OLDEST_DAYS = 0;
const MOODYS_IG = ['Aaa', 'Aa1', 'Aa2', 'Aa3', 'A1', 'A2', 'A3', 'Baa1', 'Baa2', 'Baa3'];
const INVESTMENT_GRADE = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-'];

const pct = (a: number, b: number) => Math.round((a / b) * 100);

// ── Thresholds (listed in the release note and the report) ──────────────────

export const AUTO_RULES: AutoRule[] = [
  { kind: 'sanction',        card: 'Sanctions',     thresholds: 'Problem when a screening hit is still open' },
  { kind: 'overdues',        card: 'Overdues',      thresholds: 'Problem when an overdue is older than 30 days; warning when any amount is overdue; on track when nothing is overdue' },
  { kind: 'limit-review',    card: 'Limit review',  thresholds: 'Problem when the review date is past; warning when it is due in less than 30 days' },
  { kind: 'exposure',        card: 'Exposure',      thresholds: 'Problem above 100 % of the granted limit; warning above 80 %' },
  { kind: 'limit',           card: 'Limit left',    thresholds: 'Problem above 100 % of the limit used; warning above 80 %' },
  { kind: 'coverage',        card: 'Coverage',      thresholds: 'Problem when the latest request was refused; warning when exposure is above 80 % of the cover' },
  { kind: 'payment',         card: 'Payments',      thresholds: 'Problem when any share is paid more than 30 days late; warning when more than 10 % is paid late' },
  { kind: 'claims',          card: 'Claims',        thresholds: 'Problem when a claim is open' },
  { kind: 'jobs',            card: 'Jobs to do',    thresholds: 'Warning when a high-priority task is past its due date' },
  { kind: 'grade',           card: 'Grade',         thresholds: 'Problem from grade 7; warning after a downgrade in the last 6 months' },
  { kind: 'score',           card: 'Score',         thresholds: 'Problem under 50 / 100; warning under 65' },
  { kind: 'financials',      card: 'Financials',    thresholds: 'Warning when the latest pre-tax profit is negative or gearing is above 2' },
  { kind: 'external-rating', card: 'Ext. rating',   thresholds: 'Warning when an agency rates the buyer below investment grade (BBB-)' },
];

const RULE_TEXT = Object.fromEntries(AUTO_RULES.map(r => [r.kind, r.thresholds])) as Record<BentoKind, string>;
const RANK = Object.fromEntries(AUTO_RULES.map((r, i) => [r.kind, i + 1])) as Record<BentoKind, number>;

const status = (kind: BentoKind, tone: Tone, reason: string): AutoStatus =>
  ({ tone, reason, rule: RULE_TEXT[kind], rank: RANK[kind] });

/** Status computed for a card of this kind, or null when nothing calls for it. */
export function autoStatus(kind: BentoKind): AutoStatus | null {
  switch (kind) {
    case 'sanction':
      return SANCTION_HITS_OPEN > 0 ? status(kind, 'negative', `${SANCTION_HITS_OPEN} screening hit to clear`) : null;
    case 'overdues':
      if (OVERDUE_OPEN_USD > 0 && OVERDUE_OLDEST_DAYS > 30) return status(kind, 'negative', `Overdue for ${OVERDUE_OLDEST_DAYS} days`);
      if (OVERDUE_OPEN_USD > 0) return status(kind, 'warning', `${OVERDUE_OPEN_USD} USD overdue`);
      return status(kind, 'positive', `No overdue open as of ${AS_OF}`);
    case 'limit-review': {
      const days = day(LIMIT_REVIEW_DUE) - TODAY;
      if (days < 0) return status(kind, 'negative', `Review overdue by ${-days} days`);
      if (days < 30) return status(kind, 'warning', `Review due in ${days} days`);
      return null;
    }
    case 'exposure':
    case 'limit': {
      const used = pct(EXPOSURE, GRANTED_LIMIT);
      if (used > 100) return status(kind, 'negative', `${used} % of the limit used`);
      if (used > 80) return status(kind, 'warning', `${used} % of the limit used`);
      return null;
    }
    case 'coverage': {
      if (COVER_OUTCOME === 'Refused') return status(kind, 'negative', 'Latest request refused');
      const share = pct(EXPOSURE, COVER_GRANTED);
      return share > 80 ? status(kind, 'warning', `Exposure at ${share} % of the cover`) : null;
    }
    case 'payment': {
      const late30 = PAYMENT_BANDS.find(b => b.tone === 'negative')?.value ?? 0;
      const late = PAYMENT_BANDS.filter(b => b.tone !== 'positive').reduce((s, b) => s + b.value, 0);
      if (late30 > 0) return status(kind, 'negative', `${late30} % paid more than 30 days late`);
      if (late > 10) return status(kind, 'warning', `${late} % paid late`);
      return null;
    }
    case 'claims':
      return CLAIMS_OPEN > 0 ? status(kind, 'negative', `${CLAIMS_OPEN} claim open`) : null;
    case 'jobs': {
      const late = JOBS.filter(j => j.priority === 'High' && day(j.due) < TODAY).length;
      return late ? status(kind, 'warning', `${late} high-priority ${late === 1 ? 'task' : 'tasks'} past due`) : null;
    }
    case 'grade': {
      const grade = GRADE_HISTORY[GRADE_HISTORY.length - 1];
      if (grade >= 7) return status(kind, 'negative', `Grade A${grade}`);
      // Latest change ("Jul 24"), months before the board's date
      const recent = GRADE_CHANGES[0];
      const [m, y] = recent.date.split(' ');
      const [, am, ay] = AS_OF.split(' ');
      const months = (Number(ay) - 2000 - Number(y)) * 12 + MONTHS_INDEX[am] - MONTHS_INDEX[m];
      return !recent.up && months <= 6 ? status(kind, 'warning', `Downgraded to ${recent.to} in ${recent.date}`) : null;
    }
    case 'score':
      if (SCORE < 50) return status(kind, 'negative', `Score ${SCORE} / 100`);
      if (SCORE < 65) return status(kind, 'warning', `Score ${SCORE} / 100`);
      return null;
    case 'financials': {
      const profit = Number(FINANCIALS.find(f => f.label === 'Pre-tax profit')?.values[0].replace(/\s/g, '') ?? 0);
      const gearing = Number(FINANCIALS.find(f => f.label === 'Gearing')?.values[0] ?? 0);
      if (profit < 0) return status(kind, 'warning', 'Pre-tax loss in the latest accounts');
      if (gearing > 2) return status(kind, 'warning', `Gearing at ${gearing}`);
      return null;
    }
    case 'external-rating': {
      const low = EXTERNAL_RATINGS.filter(r => !INVESTMENT_GRADE.includes(r.rating) && !MOODYS_IG.includes(r.rating));
      return low.length ? status(kind, 'warning', `${low[0].agency} rates ${low[0].rating}`) : null;
    }
    default:
      return null;
  }
}

/** No rule for this card: the reason shown next to "Auto". */
export const noRuleReason = (kind: BentoKind) =>
  RULE_TEXT[kind] ? 'No alert: within the thresholds' : 'No business threshold on this card';

export const MAX_AUTO_BACKGROUNDS = 2;
const SEVERITY: Record<Tone, number> = { negative: 3, warning: 2, positive: 1 };

/** Cards (in reading order) whose automatic status gets its background. */
export function autoBackgrounds(cardsInOrder: BentoCard[]): Set<string> {
  const candidates = cardsInOrder
    .filter(c => c.emphasis === 'auto')
    .map(c => ({ c, s: autoStatus(c.kind) }))
    .filter((x): x is { c: BentoCard; s: AutoStatus } => !!x.s);
  candidates.sort((a, b) => SEVERITY[b.s.tone] - SEVERITY[a.s.tone] || a.s.rank - b.s.rank);
  return new Set(candidates.slice(0, MAX_AUTO_BACKGROUNDS).map(x => x.c.id));
}

export const TONE_LABEL: Record<Tone, string> = { positive: 'On track', warning: 'Warning', negative: 'Problem' };

export interface Look {
  /** Emphasis class drawn (bento-cell--e-*). */
  cls: Emphasis;
  reversed: boolean;
  status: AutoStatus | null;
  /** The status has a background (automatic or forced). */
  toned: boolean;
  /** Automatic status left without background (cap of 2 per board). */
  capped: boolean;
  /** Manual highlight (subtle or strong). */
  highlight: boolean;
}

/** What a card looks like, from the analyst's choice and the computed status. */
export function lookOf(card: BentoCard, withBackground: boolean): Look {
  const s = autoStatus(card.kind);
  const choice = normalize(card.emphasis);
  let cls: Emphasis = 'none';
  if (choice === 'subtle' || choice === 'strong') cls = choice;
  else if (s && choice === 'status-strong' && s.tone !== 'positive') cls = `${s.tone}-strong` as Emphasis;
  else if (s && (choice === 'status' || choice === 'status-strong' || (choice === 'auto' && withBackground))) cls = s.tone;
  return {
    cls,
    reversed: EMPHASIS_MAP[cls].reversed,
    status: s,
    toned: cls !== 'none' && cls !== 'subtle' && cls !== 'strong',
    capped: !!s && choice === 'auto' && !withBackground,
    highlight: cls === 'subtle' || cls === 'strong',
  };
}

/** Old saved boards may hold a hand-picked tone: it becomes "always show the status". */
export function normalize(e: EmphasisChoice | string): EmphasisChoice {
  if (e === 'auto' || e === 'none' || e === 'subtle' || e === 'strong' || e === 'status' || e === 'status-strong') return e;
  if (typeof e === 'string' && e.endsWith('-strong')) return 'status-strong';
  return 'status';
}

export interface EmphasisOption {
  value: EmphasisChoice;
  label: string;
  /** Swatch class (bento-swatch--*). */
  swatch: Emphasis;
  disabled: boolean;
  note?: string;
}

/** The emphasis menu of a card of this kind. */
export function emphasisOptions(kind: BentoKind): EmphasisOption[] {
  const s = autoStatus(kind);
  const tone = s ? TONE_LABEL[s.tone] : 'Status';
  return [
    { value: 'auto', label: s ? `Auto, ${tone.toLowerCase()}` : 'Auto', swatch: s?.tone ?? 'none', disabled: false,
      note: s ? `${s.reason}. ${s.rule}.` : noRuleReason(kind) },
    { value: 'none', label: 'No background', swatch: 'none', disabled: false },
    { value: 'status', label: `${tone}, always shown`, swatch: s?.tone ?? 'none', disabled: !s },
    { value: 'status-strong', label: `${tone}, strong`, swatch: s && s.tone !== 'positive' ? `${s.tone}-strong` as Emphasis : 'none',
      disabled: !s || s.tone === 'positive' },
    { value: 'subtle', label: 'Subtle background', swatch: 'subtle', disabled: false },
    { value: 'strong', label: 'Strong background', swatch: 'strong', disabled: false },
  ];
}
