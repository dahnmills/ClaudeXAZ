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
  ConfirmDialogComponent,
  TooltipDirective,
  type SelectOption,
} from '../../../shared/ui';
import { BuyerSummaryStore, type BuyerCompany } from '../../buyer-summary/buyer-summary.store';

/** Champs du bloc adresse non latine. */
const NON_LATIN_FIELDS = ['nlStreetNumber', 'nlStreetName', 'nlAdditionalLine', 'nlTown'];

const DATE_RE  = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface IdentifierRow    { type: string; value: string; }
interface SecondaryNameRow { name: string; nonLatin: string; }
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
    CheckboxComponent, ButtonComponent, ButtonIconComponent, IconComponent, SpinnerComponent, ConfirmDialogComponent, TooltipDirective,
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

  /** Plus haute étape jamais atteinte : toute étape ≤ maxReached est navigable. */
  maxReached = signal<number>(0);

  // ── État de vérification / matching ───────────────────────────────────
  verifying       = signal<boolean>(false);
  matchSuggestion = signal<BuyerCompany | null>(null);
  private matchResolved = false;

  // ── Valeurs du formulaire ─────────────────────────────────────────────
  private form = signal<Record<string, string>>({});
  fieldVal(key: string): string { return this.form()[key] ?? ''; }
  setField(key: string, val: string) { this.form.update(f => ({ ...f, [key]: val })); }

  publicBuyer    = signal<boolean>(false);

  /** Adresse non latine : repliée par défaut, ouverte par le bouton sous l'adresse. */
  nonLatinAddr   = signal<boolean>(false);
  addNonLatinAddr() { this.nonLatinAddr.set(true); }
  /** Retirer le bloc efface aussi ses valeurs : rien de caché n'est envoyé. */
  removeNonLatinAddr() {
    this.nonLatinAddr.set(false);
    this.form.update(f => {
      const next = { ...f };
      NON_LATIN_FIELDS.forEach(k => delete next[k]);
      return next;
    });
  }

  // ── Validation ────────────────────────────────────────────────────────
  /** Étapes où l'on a tenté Next : les erreurs n'apparaissent qu'après, puis suivent la frappe. */
  private attempted = signal<number[]>([]);

  /** Erreurs de l'étape courante. Messages courts : une ligne sous un champ étroit. */
  private stepErrors = computed<Record<string, string>>(() => {
    const f = this.form();
    const e: Record<string, string> = {};
    const required = (k: string) => { if (!f[k]?.trim()) e[k] = 'Required'; };
    const date = (k: string) => { if (f[k] && !DATE_RE.test(f[k])) e[k] = 'Use DD/MM/YYYY'; };
    const num  = (k: string) => { if (f[k] && !/^\d+$/.test(f[k])) e[k] = 'Numbers only'; };
    switch (this.currentStep()) {
      case 0:
        ['companyStatus', 'legalForm', 'companyName'].forEach(required);
        ['workforceMin', 'workforceMax'].forEach(num);
        if (!e['workforceMin'] && !e['workforceMax'] && f['workforceMin'] && f['workforceMax']
          && +f['workforceMax'] < +f['workforceMin']) e['workforceMax'] = 'Below the minimum';
        ['creationDate', 'businessStartDate'].forEach(date);
        // Un identifiant entamé doit être complet : type et valeur vont ensemble
        this.identifiers().forEach((id, i) => {
          if (id.value.trim() && !id.type) e['idType' + i] = 'Required';
          if (id.type && !id.value.trim()) e['idValue' + i] = 'Required';
        });
        break;
      case 1:
        ['streetName', 'postCode', 'town'].forEach(required);
        break;
      case 2:
        if (f['website'] && !/^https?:\/\/\S+\.\S+/.test(f['website'])) e['website'] = 'Start with https://';
        this.contacts().forEach((c, i) => {
          if (c.email && !EMAIL_RE.test(c.email)) e['contactEmail' + i] = 'Invalid email';
        });
        break;
      case 3:
        date('shareCapitalDate');
        if (f['turnoverYear'] && !/^\d{4}$/.test(f['turnoverYear'])) e['turnoverYear'] = 'Use YYYY';
        break;
    }
    return e;
  });

  /** Message d'erreur d'un champ, vide tant que l'étape n'a pas été soumise. */
  errorOf(key: string): string {
    return this.attempted().includes(this.currentStep()) ? this.stepErrors()[key] ?? '' : '';
  }

  /** Identifiants et noms secondaires : blocs fermés tant que la liste est vide.
      Le premier ajout ouvre le bloc, removeX() le referme en vidant la liste. */
  identifiers = signal<IdentifierRow[]>([]);
  addIdentifier()    { this.identifiers.update(l => [...l, { type: '', value: '' }]); }
  removeIdentifiers() { this.identifiers.set([]); }
  removeIdentifier(i: number) { this.identifiers.update(l => l.filter((_, idx) => idx !== i)); }
  setIdentifier(i: number, key: keyof IdentifierRow, val: string) {
    this.identifiers.update(l => l.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  secondaryNames = signal<SecondaryNameRow[]>([]);
  addSecondaryName()    { this.secondaryNames.update(l => [...l, { name: '', nonLatin: '' }]); }
  removeSecondaryNames() { this.secondaryNames.set([]); }
  removeSecondaryName(i: number) { this.secondaryNames.update(l => l.filter((_, idx) => idx !== i)); }
  setSecondaryName(i: number, key: keyof SecondaryNameRow, val: string) {
    this.secondaryNames.update(l => l.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

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
  goToStep(i: number) { if (i <= this.maxReached()) this.currentStep.set(i); }

  next() {
    const cur = this.currentStep();
    // Une étape en erreur ne passe pas : on montre les erreurs et on reste.
    if (Object.keys(this.stepErrors()).length) {
      this.attempted.update(a => a.includes(cur) ? a : [...a, cur]);
      return;
    }
    if (this.isLast()) { this.markCompleted(cur); this.finish(); return; }

    // Étape déjà complétée (revenue via Back) → pas de re-vérification, on avance.
    if (this.completedSteps().includes(cur)) {
      const next = cur + 1;
      this.maxReached.update(m => Math.max(m, next));
      this.currentStep.set(next);
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
      const next = cur + 1;
      this.maxReached.update(m => Math.max(m, next));
      this.currentStep.set(next);
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
    const next = this.currentStep() + 1;
    this.maxReached.update(m => Math.max(m, next));
    this.currentStep.set(next);
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

  // ── Sortie avec confirmation ──────────────────────────────────────────
  /** Vrai dès qu'une saisie existe : sans elle, quitter ne coûte rien. */
  private isDirty = computed(() =>
    Object.values(this.form()).some(v => v.trim())
    || this.publicBuyer()
    || this.identifiers().some(r => r.type || r.value.trim())
    || this.secondaryNames().some(r => r.name.trim() || r.nonLatin.trim())
    || this.contacts().some(r => r.name.trim() || r.email.trim())
    || this.mainActivity().code.trim() || this.mainActivity().meaning.trim()
    || this.secondaryActivities().some(r => r.code.trim() || r.meaning.trim()));

  leaveOpen = signal(false);

  /** Croix, Échap, fond : si on a saisi quelque chose, la modale s'efface derrière la popin. */
  requestClose() {
    if (this.isDirty()) { this.leaveOpen.set(true); return; }
    this.close();
  }
  confirmLeave() { this.leaveOpen.set(false); this.close(); }
  keepEditing()  { this.leaveOpen.set(false); }

  close() {
    this.leaveOpen.set(false);
    this.form.set({});
    this.publicBuyer.set(false);
    this.nonLatinAddr.set(false);
    this.identifiers.set([]);
    this.secondaryNames.set([]);
    this.contacts.set([{ name: '', email: '' }, { name: '', email: '' }]);
    this.mainActivity.set({ type: 'NAF', code: '', meaning: '' });
    this.secondaryActivities.set([{ type: 'NAF', code: '', meaning: '' }]);
    this.closed.emit();
    // reset pour la prochaine ouverture
    this.currentStep.set(0);
    this.completedSteps.set([]);
    this.maxReached.set(0);
    this.matchSuggestion.set(null);
    this.matchResolved = false;
    this.verifying.set(false);
    this.attempted.set([]);
  }
}
