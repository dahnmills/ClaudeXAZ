import type { CompleteFormValue } from './complete-form/complete-form.component';
import type { SelectOption } from '../../shared/ui/select/select.component';
import type { MultiSelectOption } from '../../shared/ui/multi-select/multi-select.component';

export type RequestStatus = 'draft' | 'to-be-validated' | 'validated';
export type Rights = 'can' | 'cannot';

export interface Decision extends CompleteFormValue {
  preparedBy: string;
  date:       string;
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
  answer: 'restrictive', reason: '102',
  permanentAmount: '300000', permanentCurrency: 'EUR', permanentUntil: '31/12/2026', permanentDays: '60', invoiceDate: '',
  temporaryAmount: '150000', temporaryDays: '30', temporaryUntil: '31/01/2027',
  notifications: 'both', invoice: 'standard', provisionally: false,
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
