import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ModalComponent,
  StepperComponent,
  InputTextComponent,
  SelectComponent,
  CheckboxComponent,
  ButtonComponent,
  ButtonIconComponent,
  IconComponent,
  SpinnerComponent,
  TooltipDirective,
  type SelectOption,
} from '../../../shared/ui';
import { BuyerSummaryStore, type BuyerCompany } from '../../buyer-summary/buyer-summary.store';

interface ContactRow  { name: string; email: string; }
interface ActivityRow { type: string; code: string; meaning: string; }

const STEPS = [
  { label: 'Identity' },
  { label: 'Address' },
  { label: 'Information & Contacts' },
  { label: 'Financial information' },
  { label: 'Activities' },
];

/** Délai simulant la vérification async en fin d'étape. */
const VERIFY_MS = 2000;

/** Société existante proposée lors d'un match (mock). */
const MATCH_COMPANY: BuyerCompany = {
  name: 'Immobilière du Marais',
  companyId: '137381425',
  city: 'BHV',
  address: '34 RUE DE LA VERRIÈRE - 75004 - PARIS 4 - FRANCE',
};

@Component({
  selector: 'app-company-creation-wizard',
  standalone: true,
  imports: [
    ModalComponent, StepperComponent, InputTextComponent, SelectComponent,
    CheckboxComponent, ButtonComponent, ButtonIconComponent, IconComponent, SpinnerComponent, TooltipDirective,
  ],
  templateUrl: './company-creation-wizard.component.html',
  styleUrl: './company-creation-wizard.component.scss',
})
export class CompanyCreationWizardComponent {
  open   = input<boolean>(false);
  closed = output<void>();

  private router = inject(Router);
  private store  = inject(BuyerSummaryStore);

  readonly steps = STEPS;
  currentStep = signal<number>(0);
  isLast = computed(() => this.currentStep() === this.steps.length - 1);

  /** Étapes déjà complétées (restent vertes même après Back, pas de re-vérif). */
  completedSteps = signal<number[]>([]);
  private markCompleted(i: number) {
    this.completedSteps.update(c => c.includes(i) ? c : [...c, i]);
  }

  // ── État de vérification / matching ───────────────────────────────────
  verifying       = signal<boolean>(false);
  matchSuggestion = signal<BuyerCompany | null>(null);
  private matchResolved = false;

  // ── Valeurs du formulaire ─────────────────────────────────────────────
  private form = signal<Record<string, string>>({});
  fieldVal(key: string): string { return this.form()[key] ?? ''; }
  setField(key: string, val: string) { this.form.update(f => ({ ...f, [key]: val })); }

  publicBuyer    = signal<boolean>(false);
  nonLatinAddr   = signal<boolean>(false);

  contacts = signal<ContactRow[]>([{ name: '', email: '' }, { name: '', email: '' }]);
  addContact()    { this.contacts.update(c => [...c, { name: '', email: '' }]); }
  removeContact(i: number) { this.contacts.update(c => c.filter((_, idx) => idx !== i)); }
  setContact(i: number, key: keyof ContactRow, val: string) {
    this.contacts.update(c => c.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  mainActivity = signal<ActivityRow>({ type: 'NAF', code: '', meaning: '' });
  setMainActivity(key: keyof ActivityRow, val: string) {
    this.mainActivity.update(a => ({ ...a, [key]: val }));
  }
  secondaryActivities = signal<ActivityRow[]>([{ type: 'NAF', code: '', meaning: '' }]);
  addActivity()    { this.secondaryActivities.update(a => [...a, { type: 'NAF', code: '', meaning: '' }]); }
  removeActivity(i: number) { this.secondaryActivities.update(a => a.filter((_, idx) => idx !== i)); }
  setActivity(i: number, key: keyof ActivityRow, val: string) {
    this.secondaryActivities.update(a => a.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  // ── Options des selects (mock) ────────────────────────────────────────
  readonly companyStatusOptions: SelectOption[] = [
    { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'ceased', label: 'Ceased' },
  ];
  readonly legalFormOptions: SelectOption[] = [
    { value: 'sarl', label: 'SARL' }, { value: 'sas', label: 'SAS' }, { value: 'sa', label: 'SA' },
    { value: 'gmbh', label: 'GmbH' }, { value: 'ltd', label: 'LTD' }, { value: 'other', label: 'OTHER' },
  ];
  readonly yesNoOptions: SelectOption[] = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
  readonly identifierTypeOptions: SelectOption[] = [
    { value: 'siren', label: 'SIREN' }, { value: 'siret', label: 'SIRET' }, { value: 'duns', label: 'DUNS' }, { value: 'vat', label: 'VAT' },
  ];
  readonly areaOptions: SelectOption[] = [
    { value: 'idf', label: 'Île-de-France' }, { value: 'ara', label: 'Auvergne-Rhône-Alpes' }, { value: 'paca', label: "Provence-Alpes-Côte d'Azur" },
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

  // ── Navigation ────────────────────────────────────────────────────────
  back() { if (this.currentStep() > 0) this.currentStep.update(s => s - 1); }
  goToStep(i: number) { if (this.completedSteps().includes(i) || i === this.currentStep()) this.currentStep.set(i); }

  next() {
    const cur = this.currentStep();
    if (this.isLast()) { this.markCompleted(cur); this.finish(); return; }

    // Étape déjà complétée (revenue via Back) → pas de re-vérification, on avance.
    if (this.completedSteps().includes(cur)) {
      this.currentStep.update(s => s + 1);
      return;
    }

    this.verifying.set(true);
    setTimeout(() => {
      this.verifying.set(false);
      // ~1 fois sur 2 : suggestion d'une société existante (une seule fois par parcours).
      if (!this.matchResolved && Math.random() < 0.5) {
        this.matchSuggestion.set(MATCH_COMPANY);
        return;
      }
      this.markCompleted(cur);
      this.currentStep.update(s => s + 1);
    }, VERIFY_MS);
  }

  /** L'utilisateur confirme : c'est cette société → redirect Buyer Summary existant. */
  acceptMatch() {
    const m = this.matchSuggestion();
    if (!m) return;
    this.matchSuggestion.set(null);
    this.store.set(m, false);
    this.close();
    this.router.navigate(['/buyer-summary', m.companyId]);
  }

  /** Ce n'est pas elle → on continue le formulaire. */
  rejectMatch() {
    this.matchResolved = true;
    this.matchSuggestion.set(null);
    this.markCompleted(this.currentStep());
    this.currentStep.update(s => s + 1);
  }

  private genId(): string { return Math.floor(Math.random() * 1e9).toString(); }

  private finish() {
    const f = this.form();
    const id = this.genId();
    const address = [f['streetNumber'], f['streetName'], f['postCode'], f['town'], f['country'] || 'FRANCE']
      .filter(Boolean).join(' - ');
    const company: BuyerCompany = {
      name: f['companyName'] || 'New company',
      companyId: id,
      city: f['town'] || undefined,
      address: address || undefined,
    };
    this.store.set(company, true);
    this.close();
    this.router.navigate(['/buyer-summary', id]);
  }

  close() {
    this.closed.emit();
    // reset pour la prochaine ouverture
    this.currentStep.set(0);
    this.completedSteps.set([]);
    this.matchSuggestion.set(null);
    this.matchResolved = false;
    this.verifying.set(false);
  }
}
