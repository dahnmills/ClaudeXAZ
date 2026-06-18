import { Component, computed, input, OnChanges, output, signal } from '@angular/core';
import {
  ModalComponent,
  StepperComponent,
  InputTextComponent,
  SelectComponent,
  CheckboxComponent,
  ButtonComponent,
  ButtonIconComponent,
  IconComponent,
  type SelectOption,
} from '../../../shared/ui';

interface ContactRow  { name: string; email: string; }
interface ActivityRow { type: string; code: string; meaning: string; }

const STEPS = [
  { label: 'Identity' },
  { label: 'Address' },
  { label: 'Information & Contacts' },
  { label: 'Financial information' },
  { label: 'Activities' },
];

const ALL_STEPS = STEPS.map((_, i) => i); // [0,1,2,3,4]

@Component({
  selector: 'app-company-edit-wizard',
  standalone: true,
  imports: [
    ModalComponent, StepperComponent, InputTextComponent, SelectComponent,
    CheckboxComponent, ButtonComponent, ButtonIconComponent, IconComponent,
  ],
  templateUrl: './company-edit-wizard.component.html',
  styleUrl: './company-edit-wizard.component.scss',
})
export class CompanyEditWizardComponent implements OnChanges {
  open   = input<boolean>(false);
  closed = output<void>();
  saved  = output<void>();

  readonly steps = STEPS;
  currentStep  = signal<number>(0);
  isLast       = computed(() => this.currentStep() === this.steps.length - 1);
  completedSteps = signal<number[]>([...ALL_STEPS]);

  // ── Champs pré-remplis EasyJet ────────────────────────────────
  private form = signal<Record<string, string>>({
    companyStatus:     'active',
    legalForm:         'ltd',
    protectedBuyer:    'no',
    companyName:       'EASYJET AIRLINE COMPANY LIMITED',
    nonLatinName:      '',
    identifierType:    'other',
    identifierOther:   'CRO',
    workforceMin:      '12259',
    workforceMax:      '12259',
    creationDate:      '17/03/1995',
    businessStartDate: '01/01/2000',
    // Address
    streetNumber:      '89',
    streetName:        'HANGAR LONDON LUTON AIRPORT',
    additionalLine:    '',
    poBox:             '',
    pbCode:            '',
    postCode:          'LU2 9LY',
    town:              'Luton',
    area:              '',
    country:           'United Kingdom',
    // Info & Contacts
    phone:             '+44 1582 525252',
    fax:               '',
    website:           'https://easyjet.com',
    // Financial
    currency:          'gbp',
    shareCapital:      '',
    shareCapitalDate:  '',
    issuedCapital:     '',
    contributionKind:  'no',
    contributionResult:'',
    turnover:          '8508000000',
    turnoverYear:      '2023',
    turnoverType:      'audited',
  });

  fieldVal(key: string): string { return this.form()[key] ?? ''; }
  setField(key: string, val: string) { this.form.update(f => ({ ...f, [key]: val })); }

  publicBuyer  = signal<boolean>(false);
  nonLatinAddr = signal<boolean>(false);

  contacts = signal<ContactRow[]>([
    { name: 'Investor Relations', email: 'investor.relations@easyjet.com' },
  ]);
  addContact()    { this.contacts.update(c => [...c, { name: '', email: '' }]); }
  removeContact(i: number) { this.contacts.update(c => c.filter((_, idx) => idx !== i)); }
  setContact(i: number, key: keyof ContactRow, val: string) {
    this.contacts.update(c => c.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  mainActivity = signal<ActivityRow>({ type: 'nace', code: '6210', meaning: 'Transports aériens réguliers' });
  setMainActivity(key: keyof ActivityRow, val: string) {
    this.mainActivity.update(a => ({ ...a, [key]: val }));
  }

  secondaryActivities = signal<ActivityRow[]>([
    { type: 'nace', code: '5100', meaning: 'Air Transport' },
  ]);
  addActivity()    { this.secondaryActivities.update(a => [...a, { type: 'NAF', code: '', meaning: '' }]); }
  removeActivity(i: number) { this.secondaryActivities.update(a => a.filter((_, idx) => idx !== i)); }
  setActivity(i: number, key: keyof ActivityRow, val: string) {
    this.secondaryActivities.update(a => a.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  // ── Options selects ────────────────────────────────────────────
  readonly companyStatusOptions: SelectOption[] = [
    { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'ceased', label: 'Ceased' },
  ];
  readonly legalFormOptions: SelectOption[] = [
    { value: 'sarl', label: 'SARL' }, { value: 'sas', label: 'SAS' }, { value: 'sa', label: 'SA' },
    { value: 'gmbh', label: 'GmbH' }, { value: 'ltd', label: 'LTD' }, { value: 'other', label: 'OTHER' },
  ];
  readonly yesNoOptions: SelectOption[] = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
  readonly identifierTypeOptions: SelectOption[] = [
    { value: 'siren', label: 'SIREN' }, { value: 'siret', label: 'SIRET' }, { value: 'duns', label: 'DUNS' },
    { value: 'vat', label: 'VAT' }, { value: 'other', label: 'Other' },
  ];
  readonly areaOptions: SelectOption[] = [
    { value: 'idf', label: 'Île-de-France' }, { value: 'ara', label: 'Auvergne-Rhône-Alpes' },
    { value: 'paca', label: "Provence-Alpes-Côte d'Azur" },
  ];
  readonly currencyOptions: SelectOption[] = [
    { value: 'eur', label: 'EUR' }, { value: 'usd', label: 'USD' }, { value: 'gbp', label: 'GBP' }, { value: 'chf', label: 'CHF' },
  ];
  readonly turnoverTypeOptions: SelectOption[] = [
    { value: 'estimated', label: 'Estimated' }, { value: 'declared', label: 'Declared' }, { value: 'audited', label: 'Audited' },
  ];
  readonly activityTypeOptions: SelectOption[] = [
    { value: 'naf', label: 'NAF' }, { value: 'nace', label: 'NACE' }, { value: 'sic', label: 'SIC' },
  ];

  // ── Navigation ─────────────────────────────────────────────────
  back() { if (this.currentStep() > 0) this.currentStep.update(s => s - 1); }
  next() {
    if (this.isLast()) { this.save(); return; }
    this.currentStep.update(s => s + 1);
  }
  goToStep(i: number) { this.currentStep.set(i); }

  save() {
    this.saved.emit();
    this.close();
  }

  close() {
    this.closed.emit();
    this.currentStep.set(0);
  }

  ngOnChanges(): void {
    if (this.open()) this.currentStep.set(0);
  }
}
