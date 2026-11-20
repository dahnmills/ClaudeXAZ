// Buyer Summary V2, Bento board: formats, catalogue and mock data.
// Figures stay coherent with the V1 mocks (exposure 1 548 000, granted limit
// 5 000 000, 72 limits, on time 94 %, score 82 / 100, cover 2 000 000 approved)
// and with the topbox (automatic grade A3).

import { type BadgeStatus } from '../../shared/ui';

// ── Formats ──────────────────────────────────────────────────────────────────

export type FormatGroup = 'Square' | 'Horizontal' | 'Vertical' | 'Block';

export interface BentoFormat {
  id: string;
  /** Width in columns; 'full' spans the whole board. */
  w: number | 'full';
  /** Height in square rows. */
  h: number;
  label: string;
  group: FormatGroup;
}

// The fourteen formats of the benchmark (section 3.2)
export const FORMATS: BentoFormat[] = [
  { id: '1x1',  w: 1,      h: 1, label: '1 × 1',      group: 'Square' },
  { id: '2x2',  w: 2,      h: 2, label: '2 × 2',      group: 'Square' },
  { id: '3x3',  w: 3,      h: 3, label: '3 × 3',      group: 'Square' },
  { id: '2x1',  w: 2,      h: 1, label: '2 × 1',      group: 'Horizontal' },
  { id: '3x1',  w: 3,      h: 1, label: '3 × 1',      group: 'Horizontal' },
  { id: '4x1',  w: 4,      h: 1, label: '4 × 1',      group: 'Horizontal' },
  { id: 'full', w: 'full', h: 1, label: 'Full width', group: 'Horizontal' },
  { id: '1x2',  w: 1,      h: 2, label: '1 × 2',      group: 'Vertical' },
  { id: '1x3',  w: 1,      h: 3, label: '1 × 3',      group: 'Vertical' },
  { id: '1x4',  w: 1,      h: 4, label: '1 × 4',      group: 'Vertical' },
  { id: '3x2',  w: 3,      h: 2, label: '3 × 2',      group: 'Block' },
  { id: '2x3',  w: 2,      h: 3, label: '2 × 3',      group: 'Block' },
  { id: '4x2',  w: 4,      h: 2, label: '4 × 2',      group: 'Block' },
  { id: '4x3',  w: 4,      h: 3, label: '4 × 3',      group: 'Block' },
];

export const FORMAT_GROUPS: FormatGroup[] = ['Square', 'Horizontal', 'Vertical', 'Block'];

export const FORMAT_MAP: Record<string, BentoFormat> =
  Object.fromEntries(FORMATS.map(f => [f.id, f]));

// ── Catalogue ────────────────────────────────────────────────────────────────

export type BentoKind =
  | 'grade' | 'exposure' | 'limit' | 'payment' | 'overdues' | 'financials'
  | 'jobs' | 'newsfeed' | 'score' | 'risk-figures' | 'notepad' | 'identity'
  | 'decisions' | 'policies' | 'coverage' | 'glance';

export interface BentoKindDef {
  /** Business question, shown from 2 columns wide. */
  title: string;
  /** Short title for 1-column cards: never wraps. */
  short: string;
  /** Unit or scope, next to the title. */
  meta?: string;
}

export const KINDS: Record<BentoKind, BentoKindDef> = {
  'grade':        { title: 'How risky is this buyer?',          short: 'Grade' },
  'exposure':     { title: 'How much are we exposed?',          short: 'Exposure',     meta: 'USD' },
  'limit':        { title: 'How much limit is left?',           short: 'Limit left',   meta: 'USD' },
  'payment':      { title: 'Does the buyer pay on time?',       short: 'Payments' },
  'overdues':     { title: 'Any unpaid invoices?',              short: 'Overdues',     meta: 'USD' },
  'financials':   { title: 'Is the company financially sound?', short: 'Financials',   meta: 'USD k' },
  'jobs':         { title: 'What needs doing?',                 short: 'Jobs to do' },
  'newsfeed':     { title: 'What is said about the company?',   short: 'News' },
  'score':        { title: 'What does the score say?',          short: 'Score' },
  'risk-figures': { title: 'How many limits on the market?',    short: 'Risk figures', meta: 'USD' },
  'notepad':      { title: 'What did we note?',                 short: 'Notes' },
  'identity':     { title: 'Who is this company?',              short: 'Company' },
  'decisions':    { title: 'What did we decide lately?',        short: 'Decisions' },
  'policies':     { title: 'Which policies carry the exposure?', short: 'By policy',   meta: 'USD' },
  'coverage':     { title: 'Is the latest request covered?',    short: 'Coverage',     meta: 'USD' },
  'glance':       { title: 'Where does the buyer stand?',       short: 'At a glance' },
};

export interface BentoCard {
  id: string;
  kind: BentoKind;
  format: string;
  highlight: boolean;
}

// Default board, direction A: packs with no free cell on 6 columns (1280 px)
export const DEFAULT_CARDS: BentoCard[] = [
  { id: 'grade',        kind: 'grade',        format: '3x2',  highlight: true },
  { id: 'exposure',     kind: 'exposure',     format: '3x1',  highlight: false },
  { id: 'limit',        kind: 'limit',        format: '1x1',  highlight: false },
  { id: 'payment',      kind: 'payment',      format: '2x1',  highlight: false },
  { id: 'overdues',     kind: 'overdues',     format: '1x2',  highlight: false },
  { id: 'financials',   kind: 'financials',   format: '2x3',  highlight: false },
  { id: 'jobs',         kind: 'jobs',         format: '1x4',  highlight: false },
  { id: 'newsfeed',     kind: 'newsfeed',     format: '2x2',  highlight: false },
  { id: 'score',        kind: 'score',        format: '1x1',  highlight: false },
  { id: 'risk-figures', kind: 'risk-figures', format: '1x1',  highlight: false },
  { id: 'notepad',      kind: 'notepad',      format: '1x1',  highlight: false },
  { id: 'identity',     kind: 'identity',     format: '3x1',  highlight: false },
  { id: 'decisions',    kind: 'decisions',    format: '2x1',  highlight: false },
  { id: 'policies',     kind: 'policies',     format: '4x2',  highlight: false },
  { id: 'coverage',     kind: 'coverage',     format: '2x2',  highlight: false },
  { id: 'glance',       kind: 'glance',       format: 'full', highlight: false },
];

// ── Mock data ────────────────────────────────────────────────────────────────

export const MONTHS = ['May 23', 'Jul 23', 'Sep 23', 'Nov 23', 'Jan 24', 'Mar 24', 'May 24', 'Jul 24'];

// Grade 1 = best. Ends on 3, the topbox grade (A3).
export const GRADE_HISTORY = [4, 4, 5, 4, 4, 4, 4, 3];
export const GRADE_Y = ['1', '4', '7', '10'];

export interface GradeChange { date: string; from: string; to: string; reason: string; up: boolean; }
export const GRADE_CHANGES: GradeChange[] = [
  { date: 'Jul 24', from: 'A4', to: 'A3', reason: 'FY 2023 accounts: debt down, equity up', up: true },
  { date: 'Nov 23', from: 'A5', to: 'A4', reason: 'Payments back on time',                 up: true },
  { date: 'Sep 23', from: 'A4', to: 'A5', reason: 'Late payments, 1 to 30 days',           up: false },
  { date: 'May 23', from: '',   to: 'A4', reason: 'Annual review',                         up: true },
];

// Exposure in USD k, same shape as the V1 trend, ends on 1 548 000
export const EXPOSURE_TREND = [465, 697, 581, 852, 1084, 1006, 1316, 1548];

export const SCORE_TREND = [78, 80, 79, 81, 82, 82, 82, 82];

export interface PaymentBand { label: string; value: number; tone: 'positive' | 'warning' | 'negative'; }
export const PAYMENT_BANDS: PaymentBand[] = [
  { label: 'On time',     value: 94, tone: 'positive' },
  { label: '1 to 30 days', value: 6,  tone: 'warning' },
  { label: '30+ days',    value: 0,  tone: 'negative' },
];

export interface FinRow { label: string; values: string[]; delta: string; up: boolean | null; }
export const FIN_YEARS = ['FY 2023', 'FY 2022', 'FY 2021'];
export const FINANCIALS: FinRow[] = [
  { label: 'Turnover',       values: ['123 900', '118 400', '109 700'], delta: '+4.6 %',  up: true },
  { label: 'Pre-tax profit', values: ['18',      '-240',    '85'],      delta: '+258',    up: true },
  { label: 'Cashflow',       values: ['22',      '15',      '40'],      delta: '+7',      up: true },
  { label: 'Net equity',     values: ['41 200',  '40 900',  '39 800'],  delta: '+0.7 %',  up: true },
  { label: 'Total debt',     values: ['62 500',  '64 100',  '58 300'],  delta: '-2.5 %',  up: false },
  { label: 'Gearing',        values: ['1.52',    '1.57',    '1.46'],    delta: '-0.05',   up: false },
  { label: 'Employees',      values: ['412',     '398',     '377'],     delta: '+14',     up: true },
];
export const TURNOVER_TREND = [98.2, 104.5, 109.7, 118.4, 123.9];
export const TURNOVER_YEARS = ['2019', '2020', '2021', '2022', '2023'];

export interface JobItem { label: string; due: string; priority: string; status: BadgeStatus; }
export const JOBS: JobItem[] = [
  { label: 'ManA - Grade Transfer',              due: '11 Nov 2024', priority: 'High',   status: 'error' },
  { label: 'Check sanction screening hit',        due: '13 Nov 2024', priority: 'High',   status: 'error' },
  { label: 'Buyer information update',            due: '15 Nov 2024', priority: 'Medium', status: 'warning' },
  { label: 'Annual review of the limit',          due: '02 Dec 2024', priority: 'Medium', status: 'warning' },
  { label: 'CLR',                                 due: '09 Dec 2024', priority: 'Low',    status: 'success' },
  { label: 'Ask for FY 2024 interim accounts',    due: '16 Dec 2024', priority: 'Low',    status: 'success' },
];

export interface NewsItem { date: string; headline: string; source: string; tone: string; status: BadgeStatus; }
export const NEWS: NewsItem[] = [
  { date: '11 Nov 2024', headline: 'Immobilière du Marais signs a 12-year lease with BHV', source: 'Les Echos',   tone: 'Positive', status: 'success' },
  { date: '28 Oct 2024', headline: 'Q3 rental income up 4 % on the Marais portfolio',       source: 'Company',     tone: 'Positive', status: 'success' },
  { date: '14 Oct 2024', headline: 'Paris office vacancy reaches 9.1 %',                    source: 'Reuters',     tone: 'Negative', status: 'error' },
  { date: '30 Sep 2024', headline: 'New CFO appointed from a listed property group',        source: 'Company',     tone: 'Neutral',  status: 'neutral' },
  { date: '12 Sep 2024', headline: 'Refinancing of 40 M of bank debt completed',            source: 'L\'Agefi',    tone: 'Positive', status: 'success' },
  { date: '02 Aug 2024', headline: 'Works on rue de la Verrière delayed to 2025',           source: 'Le Parisien', tone: 'Neutral',  status: 'neutral' },
];

export interface NoteItem { text: string; date: string; author: string; }
export const NOTES: NoteItem[] = [
  { text: 'Call the CFO about the FY 2024 interim accounts', date: '11 Nov 2024', author: 'C. Morel' },
  { text: 'BHV lease signed: check the impact on cashflow',   date: '04 Nov 2024', author: 'C. Morel' },
  { text: 'Sanction hit is a namesake, proof requested',      date: '28 Oct 2024', author: 'J. Petit' },
];

export interface Fact { label: string; value: string; }
export const IDENTITY: Fact[] = [
  { label: 'Company ID',  value: '137381425' },
  { label: 'Legal form',  value: 'SAS' },
  { label: 'Activity',    value: 'Rental of own real estate (68.20)' },
  { label: 'Founded',     value: '1987' },
  { label: 'Employees',   value: '412' },
  { label: 'Group',       value: 'Marais Holding' },
  { label: 'City',        value: 'Paris 4, France' },
  { label: 'Address',     value: '34 rue de la Verrière, 75004' },
  { label: 'Website',     value: 'immobiliere-marais.fr' },
  { label: 'Last update', value: '11 Nov 2024' },
];

export interface DecisionItem { date: string; label: string; amount: string; outcome: string; status: BadgeStatus; }
export const DECISIONS: DecisionItem[] = [
  { date: '11 Nov 2024', label: 'Cover request',       amount: '2 000 000', outcome: 'Approved', status: 'success' },
  { date: '12 Jul 2024', label: 'Grade A4 to A3',      amount: '',          outcome: 'Upgrade',  status: 'success' },
  { date: '14 Mar 2024', label: 'Cover increase',      amount: '1 500 000', outcome: 'Partial',  status: 'warning' },
  { date: '20 Nov 2023', label: 'Grade A5 to A4',      amount: '',          outcome: 'Upgrade',  status: 'success' },
  { date: '02 Oct 2023', label: 'Cover request',       amount: '1 500 000', outcome: 'Approved', status: 'success' },
  { date: '18 Sep 2023', label: 'Grade A4 to A5',      amount: '',          outcome: 'Downgrade', status: 'error' },
  { date: '15 May 2023', label: 'Annual review',       amount: '',          outcome: 'Confirmed', status: 'info' },
  { date: '03 Feb 2023', label: 'Cover request',       amount: '500 000',   outcome: 'Refused',  status: 'error' },
];

export interface PolicyRow { policy: string; holder: string; exposure: string; exposureShort: string; share: number; limit: string; used: number; status: string; badge: BadgeStatus; }
// Sums: exposure 1 548 000, limits 5 000 000 (the granted limit)
export const POLICIES: PolicyRow[] = [
  { policy: '2590417133', holder: 'Galeries Lumière SA',     exposure: '520 000', exposureShort: '520 k', share: 34, limit: '1 500 000', used: 35, status: 'Active',  badge: 'success' },
  { policy: '2590418871', holder: 'Batiplus Distribution',   exposure: '410 000', exposureShort: '410 k', share: 26, limit: '1 200 000', used: 34, status: 'Active',  badge: 'success' },
  { policy: '2590420045', holder: 'Marais Facility Services', exposure: '268 000', exposureShort: '268 k', share: 17, limit: '900 000',   used: 30, status: 'Active',  badge: 'success' },
  { policy: '2590421302', holder: 'Seine Office Supply',     exposure: '190 000', exposureShort: '190 k', share: 12, limit: '700 000',   used: 27, status: 'Review',  badge: 'warning' },
  { policy: '2590422517', holder: 'Lutèce Entretien',        exposure: '110 000', exposureShort: '110 k', share: 7,  limit: '400 000',   used: 28, status: 'Active',  badge: 'success' },
  { policy: '2590423690', holder: 'Hexa Sécurité',           exposure: '50 000',  exposureShort: '50 k',  share: 3,  limit: '300 000',   used: 17, status: 'Expiring', badge: 'neutral' },
];

export interface CoverStep { date: string; requested: string; granted: string; outcome: string; status: BadgeStatus; }
export const COVER_HISTORY: CoverStep[] = [
  { date: '11 Nov 2024', requested: '2 000 000', granted: '2 000 000', outcome: 'Approved', status: 'success' },
  { date: '14 Mar 2024', requested: '2 000 000', granted: '1 500 000', outcome: 'Partial',  status: 'warning' },
  { date: '02 Oct 2023', requested: '1 500 000', granted: '1 500 000', outcome: 'Approved', status: 'success' },
  { date: '03 Feb 2023', requested: '500 000',   granted: '0',         outcome: 'Refused',  status: 'error' },
];
