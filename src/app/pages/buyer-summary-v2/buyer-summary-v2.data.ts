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
  | 'decisions' | 'policies' | 'coverage' | 'glance' | 'sanction' | 'limit-review';

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
  'sanction':     { title: 'Is there a sanction hit to clear?', short: 'Sanctions' },
  'limit-review': { title: 'Is a limit review due?',            short: 'Limit review' },
};

// Emphasis levels: none, brand (subtle pale blue, strong navy) and status tones
// for small key infos (subtle = pale background, strong = full background).
export type Emphasis =
  | 'none' | 'subtle' | 'strong'
  | 'positive' | 'positive-strong'
  | 'warning' | 'warning-strong'
  | 'negative' | 'negative-strong';

export interface EmphasisDef {
  id: Emphasis;
  label: string;
  /** Status shown next to the title (never the colour alone). */
  status?: string;
  icon?: 'check-circle' | 'warning-triangle' | 'error-circle' | 'star-filled';
  /** Text is white on this background. */
  reversed: boolean;
}

export const EMPHASES: EmphasisDef[] = [
  { id: 'none',            label: 'None',                reversed: false },
  { id: 'subtle',          label: 'Subtle',              reversed: false, icon: 'star-filled', status: 'Highlighted' },
  { id: 'strong',          label: 'Strong',              reversed: true,  icon: 'star-filled', status: 'Highlighted' },
  { id: 'positive',        label: 'On track',            reversed: false, icon: 'check-circle', status: 'On track' },
  { id: 'positive-strong', label: 'On track, strong',    reversed: true,  icon: 'check-circle', status: 'On track' },
  { id: 'warning',         label: 'Warning',             reversed: false, icon: 'warning-triangle', status: 'Warning' },
  { id: 'warning-strong',  label: 'Warning, strong',     reversed: false, icon: 'warning-triangle', status: 'Warning' },
  { id: 'negative',        label: 'Problem',             reversed: false, icon: 'error-circle', status: 'Problem' },
  { id: 'negative-strong', label: 'Problem, strong',     reversed: true,  icon: 'error-circle', status: 'Problem' },
];

export const EMPHASIS_MAP: Record<Emphasis, EmphasisDef> =
  Object.fromEntries(EMPHASES.map(e => [e.id, e])) as Record<Emphasis, EmphasisDef>;

export interface BentoCard {
  id: string;
  kind: BentoKind;
  format: string;
  emphasis: Emphasis;
}

// Default board, direction A: packs with no free cell on 6 columns (1280 px)
export const DEFAULT_CARDS: BentoCard[] = [
  { id: 'grade',        kind: 'grade',        format: '3x2',  emphasis: 'strong' },
  { id: 'exposure',     kind: 'exposure',     format: '3x1',  emphasis: 'subtle' },
  { id: 'limit',        kind: 'limit',        format: '1x1',  emphasis: 'subtle' },
  { id: 'payment',      kind: 'payment',      format: '2x1',  emphasis: 'none' },
  { id: 'overdues',     kind: 'overdues',     format: '1x2',  emphasis: 'positive' },
  { id: 'financials',   kind: 'financials',   format: '2x3',  emphasis: 'none' },
  { id: 'jobs',         kind: 'jobs',         format: '1x4',  emphasis: 'none' },
  { id: 'newsfeed',     kind: 'newsfeed',     format: '2x2',  emphasis: 'none' },
  { id: 'score',        kind: 'score',        format: '1x1',  emphasis: 'none' },
  { id: 'risk-figures', kind: 'risk-figures', format: '1x1',  emphasis: 'none' },
  { id: 'notepad',      kind: 'notepad',      format: '1x1',  emphasis: 'none' },
  { id: 'identity',     kind: 'identity',     format: '2x1',  emphasis: 'none' },
  { id: 'sanction',     kind: 'sanction',     format: '1x1',  emphasis: 'negative-strong' },
  { id: 'limit-review', kind: 'limit-review', format: '1x1',  emphasis: 'warning' },
  { id: 'decisions',    kind: 'decisions',    format: '2x1',  emphasis: 'none' },
  { id: 'policies',     kind: 'policies',     format: '4x2',  emphasis: 'none' },
  { id: 'coverage',     kind: 'coverage',     format: '2x2',  emphasis: 'none' },
  { id: 'glance',       kind: 'glance',       format: 'full', emphasis: 'none' },
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
  { date: 'May 23', from: 'A4', to: 'A4', reason: 'Annual review, grade confirmed',        up: true },
  { date: 'Jan 23', from: 'A5', to: 'A4', reason: 'FY 2021 accounts filed',                up: true },
  { date: 'Aug 22', from: 'A4', to: 'A5', reason: 'Press alert: works delayed',            up: false },
  { date: 'Mar 22', from: '',   to: 'A4', reason: 'Grade assigned at first request',       up: true },
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
  { label: 'Review policy 2590423690 at expiry',  due: '31 Dec 2024', priority: 'Medium', status: 'warning' },
  { label: 'Check the BHV lease guarantee',       due: '06 Jan 2025', priority: 'Low',    status: 'success' },
];

export interface NewsItem { date: string; headline: string; source: string; tone: string; status: BadgeStatus; }
export const NEWS: NewsItem[] = [
  { date: '11 Nov 2024', headline: 'Immobilière du Marais signs a 12-year lease with BHV', source: 'Les Echos',   tone: 'Positive', status: 'success' },
  { date: '28 Oct 2024', headline: 'Q3 rental income up 4 % on the Marais portfolio',       source: 'Company',     tone: 'Positive', status: 'success' },
  { date: '14 Oct 2024', headline: 'Paris office vacancy reaches 9.1 %',                    source: 'Reuters',     tone: 'Negative', status: 'error' },
  { date: '30 Sep 2024', headline: 'New CFO appointed from a listed property group',        source: 'Company',     tone: 'Neutral',  status: 'neutral' },
  { date: '12 Sep 2024', headline: 'Refinancing of 40 M of bank debt completed',            source: 'L\'Agefi',    tone: 'Positive', status: 'success' },
  { date: '02 Aug 2024', headline: 'Works on rue de la Verrière delayed to 2025',           source: 'Le Parisien', tone: 'Neutral',  status: 'neutral' },
  { date: '18 Jul 2024', headline: 'FY 2023 accounts: net debt down 2.5 %',                 source: 'Company',     tone: 'Positive', status: 'success' },
  { date: '24 Jun 2024', headline: 'Two retail tenants leave the Marais portfolio',         source: 'Les Echos',   tone: 'Negative', status: 'error' },
  { date: '03 May 2024', headline: 'Marais Holding enters a joint venture in Lyon',         source: 'Reuters',     tone: 'Neutral',  status: 'neutral' },
  { date: '11 Mar 2024', headline: 'Green loan of 15 M signed for energy works',            source: 'Les Echos',   tone: 'Positive', status: 'success' },
];

export interface NoteItem { text: string; date: string; author: string; }
export const NOTES: NoteItem[] = [
  { text: 'Call the CFO about the FY 2024 interim accounts', date: '11 Nov 2024', author: 'C. Morel' },
  { text: 'BHV lease signed: check the impact on cashflow',   date: '04 Nov 2024', author: 'C. Morel' },
  { text: 'Sanction hit is a namesake, proof requested',      date: '28 Oct 2024', author: 'J. Petit' },
  { text: 'Two retail tenants left: watch Q3 rental income',  date: '26 Jun 2024', author: 'C. Morel' },
  { text: 'Partial cover in March: 1.50 M of 2.00 M granted', date: '14 Mar 2024', author: 'J. Petit' },
  { text: 'Grade back to A4 after payments on time',          date: '20 Nov 2023', author: 'C. Morel' },
  { text: 'Late payment of Sep 23 settled after 18 days',     date: '06 Oct 2023', author: 'J. Petit' },
  { text: 'Cover of 1.50 M approved, review in 6 months',     date: '02 Oct 2023', author: 'C. Morel' },
  { text: 'FY 2022 accounts received, gearing 1.57',          date: '30 Jun 2023', author: 'J. Petit' },
  { text: 'Annual review done, grade A4 confirmed',           date: '15 May 2023', author: 'C. Morel' },
  { text: 'Cover request of 500 000 refused: FY 2021 missing', date: '03 Feb 2023', author: 'J. Petit' },
  { text: 'Press alert on delayed works, grade to A5',        date: '29 Aug 2022', author: 'C. Morel' },
  { text: 'Partial cover of 300 000 on the first request',    date: '21 Apr 2022', author: 'J. Petit' },
  { text: 'New buyer: first grade A4 assigned',               date: '14 Mar 2022', author: 'C. Morel' },
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
  { date: '12 Jun 2024', label: 'Annual review',       amount: '',          outcome: 'Confirmed', status: 'info' },
  { date: '14 Mar 2024', label: 'Cover increase',      amount: '1 500 000', outcome: 'Partial',  status: 'warning' },
  { date: '05 Dec 2023', label: 'Limit review',        amount: '1 500 000', outcome: 'Kept',     status: 'info' },
  { date: '20 Nov 2023', label: 'Grade A5 to A4',      amount: '',          outcome: 'Upgrade',  status: 'success' },
  { date: '02 Oct 2023', label: 'Cover request',       amount: '1 500 000', outcome: 'Approved', status: 'success' },
  { date: '18 Sep 2023', label: 'Grade A4 to A5',      amount: '',          outcome: 'Downgrade', status: 'error' },
  { date: '10 Jul 2023', label: 'Cover renewal',       amount: '500 000',   outcome: 'Approved', status: 'success' },
  { date: '15 May 2023', label: 'Annual review',       amount: '',          outcome: 'Confirmed', status: 'info' },
  { date: '03 Feb 2023', label: 'Cover request',       amount: '500 000',   outcome: 'Refused',  status: 'error' },
  { date: '16 Jan 2023', label: 'Grade A5 to A4',      amount: '',          outcome: 'Upgrade',  status: 'success' },
  { date: '29 Aug 2022', label: 'Grade A4 to A5',      amount: '',          outcome: 'Downgrade', status: 'error' },
  { date: '21 Apr 2022', label: 'Cover request',       amount: '300 000',   outcome: 'Approved', status: 'success' },
  { date: '14 Mar 2022', label: 'First grade',         amount: '',          outcome: 'A4',       status: 'info' },
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
  { date: '21 Apr 2022', requested: '300 000',   granted: '300 000',   outcome: 'Approved', status: 'success' },
  { date: '02 Apr 2022', requested: '500 000',   granted: '300 000',   outcome: 'Partial',  status: 'warning' },
];

// Overdue amount per period, USD k (one late payment in Sep 23)
export const OVERDUE_PERIODS = [
  { label: 'May 23', value: 0 }, { label: 'Jul 23', value: 0 }, { label: 'Sep 23', value: 42 },
  { label: 'Nov 23', value: 0 }, { label: 'Jan 24', value: 0 }, { label: 'Mar 24', value: 0 },
  { label: 'May 24', value: 0 }, { label: 'Jul 24', value: 0 },
];

export const OVERDUE_EVENTS: { date: string; text: string; status: BadgeStatus; outcome: string }[] = [
  { date: '06 Oct 2023', text: 'Sep 23 invoice paid in full after 18 days', status: 'success', outcome: 'Closed' },
  { date: '18 Sep 2023', text: 'Invoice of 42 000 overdue, 1 to 30 days',   status: 'warning', outcome: 'Late' },
  { date: '09 Sep 2022', text: 'Aug 22 invoice paid in full after 10 days', status: 'success', outcome: 'Closed' },
  { date: '30 Aug 2022', text: 'Invoice of 12 500 overdue, 1 to 30 days',   status: 'warning', outcome: 'Late' },
];

// Payment experience per month: share paid on time, share late 1 to 30 days
export const PAYMENT_MONTHS = [
  { month: 'Nov 24', onTime: 96, late: 4 }, { month: 'Oct 24', onTime: 95, late: 5 },
  { month: 'Sep 24', onTime: 94, late: 6 }, { month: 'Aug 24', onTime: 93, late: 7 },
  { month: 'Jul 24', onTime: 95, late: 5 }, { month: 'Jun 24', onTime: 92, late: 8 },
  { month: 'May 24', onTime: 94, late: 6 }, { month: 'Apr 24', onTime: 93, late: 7 },
  { month: 'Mar 24', onTime: 95, late: 5 }, { month: 'Feb 24', onTime: 94, late: 6 },
  { month: 'Jan 24', onTime: 92, late: 8 }, { month: 'Dec 23', onTime: 93, late: 7 },
];

// Limit movements per policy
export const POLICY_MOVES = [
  { date: '11 Nov 2024', policy: 'Galeries Lumière SA',      text: 'Limit raised to 1 500 000' },
  { date: '04 Oct 2024', policy: 'Seine Office Supply',      text: 'Put under review' },
  { date: '12 Jul 2024', policy: 'Batiplus Distribution',    text: 'Limit raised to 1 200 000' },
  { date: '14 Mar 2024', policy: 'Marais Facility Services', text: 'Limit set at 900 000' },
  { date: '20 Jan 2024', policy: 'Hexa Sécurité',            text: 'Renewal due 31 Dec 2024' },
  { date: '02 Oct 2023', policy: 'Lutèce Entretien',         text: 'Limit set at 400 000' },
  { date: '10 Jul 2023', policy: 'Hexa Sécurité',            text: 'Limit set at 300 000' },
  { date: '15 May 2023', policy: 'Seine Office Supply',      text: 'Limit set at 700 000' },
  { date: '03 Feb 2023', policy: 'Galeries Lumière SA',      text: 'Increase refused' },
  { date: '16 Jan 2023', policy: 'Batiplus Distribution',    text: 'Limit set at 800 000' },
  { date: '21 Apr 2022', policy: 'Galeries Lumière SA',      text: 'Limit set at 1 000 000' },
  { date: '14 Mar 2022', policy: 'Marais Facility Services', text: 'Policy opened' },
];

// Which cards can show more when the board stretches them to close a gap
// (lists, tables, charts). Fixed-content cards never stretch.
export const STRETCH: Record<BentoKind, { v: boolean; h: boolean }> = {
  'grade':        { v: true,  h: true },
  'exposure':     { v: true,  h: true },
  'payment':      { v: true,  h: false },
  'overdues':     { v: true,  h: false },
  'financials':   { v: true,  h: true },
  'jobs':         { v: true,  h: false },
  'newsfeed':     { v: true,  h: true },
  'decisions':    { v: true,  h: true },
  'policies':     { v: true,  h: false },
  'coverage':     { v: true,  h: false },
  'notepad':      { v: true,  h: false },
  'limit':        { v: false, h: false },
  'score':        { v: false, h: false },
  'risk-figures': { v: false, h: false },
  'identity':     { v: false, h: false },
  'glance':       { v: false, h: false },
  'sanction':     { v: false, h: false },
  'limit-review': { v: false, h: false },
};
