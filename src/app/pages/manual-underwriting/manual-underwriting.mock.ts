import type { SelectOption } from '../../shared/ui/select/select.component';
import type { MultiSelectOption } from '../../shared/ui/multi-select/multi-select.component';

export type RequestStatus = 'draft' | 'to-validate' | 'validated';
export type Rights = 'can' | 'cannot';

export interface Decision {
  answer:       string;
  reason:       string;
  permAmount:   string;
  permLimited:  string;
  permDays:     string;
  tempAmount:   string;
  tempDays:     string;
  notifications: string;
  invoice:      string;
  comment:      string;
  preparedBy:   string;
  date:         string;
}

export const BUYER = {
  id:       '4421706',
  name:     'Maison Verlaine Chocolatier (BE)',
  grade:    'M4',
  gradeColor: 'grade-4' as const,
  address:  'Rue des Tanneurs 18, 1000 Brussels, Belgium',
  legalForm: 'Limited company (SA)',
  sector:   'Food manufacturing',
};

export const REQUEST_REF = 'CLR-2026-087412';
export const CURRENT_USER = 'Alex Martin';

export const ANSWER_OPTIONS: SelectOption[] = [
  { value: 'agreement',   label: 'Agreement' },
  { value: 'restrictive', label: 'Restrictive answer' },
  { value: 'refusal',     label: 'Refusal' },
  { value: 'withdrawal',  label: 'Withdrawal of cover' },
];

export const REASON_OPTIONS: SelectOption[] = [
  { value: 'financials-ok',   label: 'Satisfactory financial statements' },
  { value: 'good-payments',   label: 'Good payment experience' },
  { value: 'weak-financials', label: 'Weak financial structure' },
  { value: 'payment-delays',  label: 'Payment delays reported' },
  { value: 'no-information',  label: 'Insufficient information' },
  { value: 'policy-limits',   label: 'Policy capacity reached' },
];

export const NOTIFICATION_OPTIONS: SelectOption[] = [
  { value: 'none',       label: 'None' },
  { value: 'policyholder', label: 'Policyholder' },
  { value: 'both',       label: 'Policyholder and broker' },
];

export const INVOICE_OPTIONS: SelectOption[] = [
  { value: 'any',     label: 'Any invoice date' },
  { value: 'issued',  label: 'Invoices issued after the decision' },
  { value: 'shipped', label: 'Goods shipped after the decision' },
];

export interface Person { id: string; name: string; role: string; email: string; }

/** People who have the right to complete this request. */
export const PEOPLE: Person[] = [
  { id: 'p1', name: 'Paul Icy',        role: 'Senior underwriter',  email: 'paul.icy@example.com' },
  { id: 'p2', name: 'Camille Durand',  role: 'Underwriting manager', email: 'camille.durand@example.com' },
  { id: 'p3', name: 'Jonas Weber',     role: 'Underwriter',         email: 'jonas.weber@example.com' },
  { id: 'p4', name: 'Marta Lopez',     role: 'Risk credit manager', email: 'marta.lopez@example.com' },
  { id: 'p5', name: 'Hana Sato',       role: 'Senior underwriter',  email: 'hana.sato@example.com' },
];

export const RECIPIENT_OPTIONS: MultiSelectOption[] =
  PEOPLE.map(p => ({ value: p.id, label: `${p.name}, ${p.role}` }));

export const OTHER_USER_DECISION: Decision = {
  answer: 'restrictive', reason: 'weak-financials',
  permAmount: '300000', permLimited: '250000', permDays: '60',
  tempAmount: '150000', tempDays: '30',
  notifications: 'both', invoice: 'issued',
  comment: 'Latest balance sheet shows a drop in equity. Limit kept below the request.',
  preparedBy: 'Jonas Weber', date: '04 Nov 2026',
};

export function label(options: SelectOption[], value: string): string {
  return options.find(o => o.value === value)?.label ?? '';
}

/** 1500000 -> "1 500 000". Empty string stays empty. */
export function money(v: string | number, currency = 'EUR'): string {
  const n = typeof v === 'string' ? Number(v.replace(/\s/g, '')) : v;
  if (v === '' || Number.isNaN(n)) return '-';
  return `${currency} ${Math.round(n).toLocaleString('en-US').replace(/,/g, ' ')}`;
}
