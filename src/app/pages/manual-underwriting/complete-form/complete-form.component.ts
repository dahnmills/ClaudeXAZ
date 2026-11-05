/**
 * Body of the "Complete" modal of Manual Underwriting.
 *
 * Contract with the parent modal:
 *  - The parent owns the footer (Cancel, Save as draft, Submit; with no rights: "Send to complete",
 *    no ellipsis in button labels).
 *    Grab the component with a template ref or viewChild and call:
 *      save()    emits `saved` with the draft (no validation)
 *      submit()  validates, shows errors, and emits `submitted` only when valid
 *    `valid()` is a signal, true when Answer and Reason are filled and no field is malformed.
 *  - The parent gives the modal a fixed `contentHeight`; the form fills it (height 100%) and
 *    scrolls inside the grey panel, so the modal never jumps.
 *  - `rights` false: every control is disabled and a notice explains why; save() and submit() do nothing.
 *  - `closed` is emitted by cancel(), for a parent that wants to route its Cancel through the form.
 *  - Errors only show after the first submit() attempt.
 */
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { SelectComponent, SelectOption } from '../../../shared/ui/select/select.component';
import { InputTextComponent } from '../../../shared/ui/input-text/input-text.component';
import { TextareaComponent } from '../../../shared/ui/textarea/textarea.component';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox.component';
import { FunctionalNoticeComponent } from '../../../shared/ui/functional-notice/functional-notice.component';

export interface CompleteFormValue {
  answer: string;
  reason: string;
  permanentAmount: string;
  permanentCurrency: string;
  permanentUntil: string;
  permanentDays: string;
  invoiceDate: string;
  temporaryAmount: string;
  temporaryDays: string;
  temporaryUntil: string;
  notifications: string;
  invoice: string;
  provisionally: boolean;
  comment: string;
}

export const EMPTY_COMPLETE_FORM_VALUE: CompleteFormValue = {
  answer: '', reason: '',
  permanentAmount: '', permanentCurrency: 'EUR', permanentUntil: '', permanentDays: '', invoiceDate: '',
  temporaryAmount: '', temporaryDays: '', temporaryUntil: '',
  notifications: '', invoice: '', provisionally: false, comment: '',
};

type TextKey = Exclude<keyof CompleteFormValue, 'provisionally'>;

const DATE_RE = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const NUMBER_RE = /^\d+([.,]\d+)?$/;
const REQUIRED: TextKey[] = ['answer', 'reason'];
const NUMERIC: TextKey[] = ['permanentAmount', 'permanentDays', 'temporaryAmount', 'temporaryDays'];
const DATES: TextKey[] = ['permanentUntil', 'invoiceDate', 'temporaryUntil'];

export const ANSWER_OPTIONS: SelectOption[] = [
  { value: 'agreement', label: 'Agreement' },
  { value: 'refusal', label: 'Refusal' },
  { value: 'restrictive', label: 'Restrictive answer' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'withdrawal', label: 'Risk withdrawal' },
];

export const REASON_OPTIONS: SelectOption[] = [
  { value: '101', label: '101 - Insufficient financial information' },
  { value: '102', label: '102 - Negative equity' },
  { value: '103', label: '103 - Payment incidents reported' },
  { value: '104', label: '104 - Sector under surveillance' },
  { value: '105', label: '105 - Group guarantee missing' },
  { value: '106', label: '106 - Recent change of management' },
  { value: '107', label: '107 - Insolvency proceedings opened' },
  { value: '108', label: '108 - Exposure above country limit' },
  { value: '109', label: '109 - Buyer unknown or not traceable' },
  { value: '110', label: '110 - Favourable financial review' },
];

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'EUR', label: 'EUR' }, { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' }, { value: 'CHF', label: 'CHF' },
];

export const NOTIFICATION_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'policyholder', label: 'Policyholder' },
  { value: 'broker', label: 'Broker' },
  { value: 'both', label: 'Policyholder and broker' },
];

export const INVOICE_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'No invoice' },
  { value: 'standard', label: 'Standard invoice' },
  { value: 'pro-forma', label: 'Pro forma' },
];

@Component({
  selector: 'app-mu-complete-form',
  standalone: true,
  imports: [SelectComponent, InputTextComponent, TextareaComponent, CheckboxComponent, FunctionalNoticeComponent],
  templateUrl: './complete-form.component.html',
  styleUrl: './complete-form.component.scss',
})
export class CompleteFormComponent {
  readonly rights = input<boolean>(true);
  readonly value = input<Partial<CompleteFormValue> | null>(null);

  readonly saved = output<CompleteFormValue>();
  readonly submitted = output<CompleteFormValue>();
  readonly closed = output<void>();

  readonly commentMax = 500;

  readonly answerOptions = ANSWER_OPTIONS;
  readonly reasonOptions = REASON_OPTIONS;
  readonly currencyOptions = CURRENCY_OPTIONS;
  readonly notificationOptions = NOTIFICATION_OPTIONS;
  readonly invoiceOptions = INVOICE_OPTIONS;

  readonly draft = signal<CompleteFormValue>({ ...EMPTY_COMPLETE_FORM_VALUE });
  readonly attempted = signal(false);

  private readonly errors = computed(() => {
    const d = this.draft();
    const e: Partial<Record<TextKey, string>> = {};
    for (const k of REQUIRED) if (!d[k]) e[k] = 'Required';
    for (const k of NUMERIC) if (d[k] && !NUMBER_RE.test(d[k].trim())) e[k] = 'Numbers only';
    for (const k of DATES) if (d[k] && !DATE_RE.test(d[k].trim())) e[k] = 'Use DD/MM/YYYY';
    return e;
  });

  readonly valid = computed(() => Object.keys(this.errors()).length === 0);
  readonly commentLength = computed(() => this.draft().comment.length);

  constructor() {
    effect(() => {
      const v = this.value();
      this.draft.set({ ...EMPTY_COMPLETE_FORM_VALUE, ...(v ?? {}) });
      this.attempted.set(false);
    }, { allowSignalWrites: true });
  }

  get(k: TextKey): string { return this.draft()[k]; }

  set(k: TextKey, v: string): void {
    this.draft.update(d => ({ ...d, [k]: k === 'comment' ? v.slice(0, this.commentMax) : v }));
  }

  setProvisionally(v: boolean): void { this.draft.update(d => ({ ...d, provisionally: v })); }

  errorOf(k: TextKey): string { return this.rights() && this.attempted() ? (this.errors()[k] ?? '') : ''; }

  save(): void {
    if (!this.rights()) return;
    this.saved.emit(this.draft());
  }

  submit(): void {
    if (!this.rights()) return;
    this.attempted.set(true);
    if (this.valid()) this.submitted.emit(this.draft());
  }

  cancel(): void { this.closed.emit(); }
}
