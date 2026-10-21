import { Component, ElementRef, HostListener, computed, inject, input, model, output, signal } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { StandaloneDropdownComponent } from '../standalone-dropdown/standalone-dropdown.component';
import { ButtonComponent } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../flyout-menu/flyout-menu-item.component';
import { FlagComponent, type FlagCode } from '../flag/flag.component';
import { DividerComponent } from '../divider/divider.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { InputSearchComponent } from '../input-search/input-search.component';
import { MultiSelectComponent, type MultiSelectOption } from '../multi-select/multi-select.component';
import {
  SEARCH_TYPES, COUNTRIES, ID_TYPES, DIAL_CODES,
  type SearchType, type IdTypeOption,
} from '../search-bar-multi/search-bar-multi.component';
import { BU_CODES } from '../policy-result-card/policy.model';
import {
  POLICY_MODES, POLICY_STATUSES, defaultPolicyCriteria, allPolicyStatuses,
  type PolicyMode, type PolicyCriteriaValues,
} from '../policy-criteria/policy-criteria.model';

export type SearchScope = 'buyers' | 'policies';

type Flyout = 'scope' | 'type' | 'country' | 'id-type' | 'mode' | 'bu' | 'search-in';

const SCOPES: { id: SearchScope; label: string; icon: IconName }[] = [
  { id: 'buyers',   label: 'Buyers',   icon: 'buyers' },
  { id: 'policies', label: 'Policies', icon: 'contract' },
];

const POLICY_MODE_ICONS: Record<PolicyMode, IconName> = { open: 'launch', global: 'search' };

const SEARCH_IN_OPTIONS: { id: 'policies' | 'drafts'; label: string }[] = [
  { id: 'policies', label: 'Policies' },
  { id: 'drafts',   label: 'Drafts' },
];

const BUYER_PLACEHOLDERS: Record<SearchType, string> = {
  'company-id': 'Enter a company ID (e.g. 113, 184...)',
  'id':         'Enter a company ID (e.g. 113, 184...)',
  'name':       'Enter a company name',
  'phone':      'Enter a phone number',
  'manager':    'Enter a manager name',
};

/**
 * Barre de recherche à objet. Le premier slot choisit ce qu'on cherche ;
 * les slots suivants en dépendent. Côté Buyers, mêmes règles que
 * ds-search-bar-multi (types et listes importés, pas redéclarés). Côté
 * Policies, les deux écrans de Qirin mis à plat : le 2e slot choisit Open
 * policy (BU obligatoire, n°, extension) ou Global search (BU optionnelle,
 * saisie, Search in, Status). Pas de More criteria côté Policies : tout est
 * dans la barre.
 */
@Component({
  selector: 'ds-search-bar-scoped',
  standalone: true,
  imports: [IconComponent, StandaloneDropdownComponent, ButtonComponent, ButtonIconComponent, FlyoutMenuComponent, FlyoutMenuItemComponent, FlagComponent, DividerComponent, TooltipDirective, InputSearchComponent, MultiSelectComponent],
  templateUrl: './search-bar-scoped.component.html',
  styleUrl: './search-bar-scoped.component.scss',
  host: { class: 'ds-search-bar-scoped' },
})
export class SearchBarScopedComponent {
  scope   = model<SearchScope>('buyers');
  type    = model<SearchType>('company-id');
  country = model<FlagCode | null>(null);
  idType  = model<IdTypeOption | null>(null);
  policyMode     = model<PolicyMode>('open');
  buCode         = model<string | null>(null);
  policyCriteria = model<PolicyCriteriaValues>(defaultPolicyCriteria());
  query   = model<string>('');
  criteriaCount = input<number>(0);

  searchClicked = output<void>();
  moreCriteriaClicked = output<void>();

  openFlyout = signal<Flyout | null>(null);
  buFilter = signal<string>('');

  readonly scopes = SCOPES;
  readonly searchTypes = SEARCH_TYPES;
  readonly countries = COUNTRIES;
  readonly idTypes = ID_TYPES;
  readonly policyModes = POLICY_MODES.map(m => ({ ...m, icon: POLICY_MODE_ICONS[m.id] }));
  readonly statusOptions: MultiSelectOption[] = POLICY_STATUSES.map(s => ({ value: s.id, label: s.label }));
  readonly searchInOptions = SEARCH_IN_OPTIONS;

  isBuyers = computed(() => this.scope() === 'buyers');
  scopeMeta = computed(() => SCOPES.find(s => s.id === this.scope())!);
  typeMeta = computed(() => SEARCH_TYPES.find(t => t.id === this.type())!);

  placeholder = computed(() => {
    if (this.isBuyers()) return BUYER_PLACEHOLDERS[this.type()];
    return this.isOpen() ? 'Enter a policy number' : 'Search a policy number or policyholder';
  });

  // ── Buyers : règles reprises de ds-search-bar-multi ───────────────────
  countryVisible = computed(() => this.isBuyers() && this.type() !== 'company-id');
  countryEnabled = computed(() => ['id', 'name', 'phone'].includes(this.type()));
  idTypeVisible  = computed(() => this.isBuyers() && this.type() === 'id');
  idTypeEnabled  = computed(() => this.idTypeVisible() && !!this.country());
  countryLabel = computed(() => {
    const c = this.country();
    return c ? (COUNTRIES.find(x => x.code === c)?.label ?? 'Select a country') : 'Select a country';
  });
  idTypeLabel = computed(() => this.idType() ?? 'ID Type');
  idTypeTooltip = computed(() => this.idTypeVisible() && !this.country() ? 'Select a country before choosing an ID Type' : '');
  phonePrefix = computed(() => {
    const c = this.country();
    return this.isBuyers() && this.type() === 'phone' && c ? DIAL_CODES[c] : null;
  });
  inputDisabled = computed(() => this.isBuyers() && this.type() === 'phone' && !this.country());

  /** Company ID = recherche interne, critères inutiles. Policies : pas de bouton du tout. */
  moreCriteriaEnabled = computed(() => this.type() !== 'company-id');
  moreCriteriaTooltip = computed(() => this.moreCriteriaEnabled() ? '' : 'Not available for a Company ID search');

  attempted = signal(false);
  countryError = computed(() => this.attempted() && this.countryEnabled() && this.countryVisible()
    && (this.type() === 'phone' || this.type() === 'id') && !this.country());
  idTypeError = computed(() => this.attempted() && this.idTypeEnabled() && !this.idType());
  /** Saisie obligatoire côté Buyers et en Open policy ; une Global search vide liste les filtres. */
  queryError = computed(() => this.attempted() && (this.isBuyers() || this.isOpen()) && !this.query().trim());
  /** La BU est obligatoire pour ouvrir une police, comme dans Qirin. */
  buError = computed(() => this.attempted() && !this.isBuyers() && this.isOpen() && !this.buCode());

  searchValid = computed(() => {
    if (!this.isBuyers()) return this.isOpen() ? (!!this.buCode() && !!this.query().trim()) : !this.statusError();
    if (!this.query().trim()) return false;
    if (this.type() === 'phone') return !!this.country();
    if (this.type() === 'id') return !!this.country() && !!this.idType();
    return true;
  });

  // ── Policies ──────────────────────────────────────────────────────────
  isOpen = computed(() => this.policyMode() === 'open');
  modeMeta = computed(() => this.policyModes.find(m => m.id === this.policyMode()) ?? this.policyModes[0]);
  submitLabel = computed(() => !this.isBuyers() && this.isOpen() ? 'Open' : 'Search');

  buLabel = computed(() => this.buCode() ?? (this.isOpen() ? 'Select a BU' : 'All BUs'));
  buOptions = computed(() => {
    const f = this.buFilter().trim().toLowerCase();
    return f ? BU_CODES.filter(b => b.toLowerCase().includes(f)) : BU_CODES;
  });

  searchInLabel = computed(() => this.policyCriteria().searchIn === 'drafts' ? 'Drafts' : 'Policies');
  /** Un draft n'a pas de statut : le slot reste visible, désactivé. */
  statusDisabled = computed(() => this.policyCriteria().searchIn === 'drafts');

  /** Aucun statut coché en Global search sur les polices : rien ne pourrait sortir,
   *  on le dit tout de suite et la recherche reste bloquée. */
  statusError = computed(() => !this.isBuyers() && !this.isOpen() && !this.statusDisabled()
    && !this.policyCriteria().statuses.length);
  /** Open policy : n° et extension sont deux champs jumeaux, même icône. */
  fieldIcon = computed<IconName>(() => !this.isBuyers() && this.isOpen() ? 'hash' : 'search');
  private host = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent) {
    if (this.openFlyout() && !this.host.nativeElement.contains(ev.target as Node)) this.close();
  }

  toggle(which: Flyout) {
    this.openFlyout.update(v => v === which ? null : which);
    if (which === 'bu') this.buFilter.set('');
  }
  close() { this.openFlyout.set(null); }

  /** Changer d'objet vide la saisie ; le parent vide les critères de l'objet quitté. */
  pickScope(s: SearchScope) {
    this.close();
    if (s === this.scope()) return;
    this.query.set('');
    this.attempted.set(false);
    this.scope.set(s);
  }

  pickType(t: SearchType) {
    this.type.set(t);
    if (!this.countryEnabled()) this.country.set(null);
    if (t !== 'id') this.idType.set(null);
    this.attempted.set(false);
    this.close();
  }
  pickCountry(c: FlagCode) { this.country.set(c); this.close(); }
  pickIdType(it: IdTypeOption) { this.idType.set(it); this.close(); }
  pickBu(b: string | null) { this.buCode.set(b); this.close(); }

  /** Changer de mode repart de zéro : la saisie et les critères d'un mode n'ont pas de sens dans l'autre. */
  pickMode(m: PolicyMode) {
    this.close();
    if (m === this.policyMode()) return;
    this.query.set('');
    this.policyCriteria.set(defaultPolicyCriteria());
    this.attempted.set(false);
    this.policyMode.set(m);
  }

  pickSearchIn(v: 'policies' | 'drafts') {
    // Revenir aux polices recoche tous les statuts : on repart de tout.
    this.policyCriteria.update(c => ({ ...c, searchIn: v, statuses: v === 'policies' ? allPolicyStatuses() : c.statuses }));
    this.close();
  }

  setStatuses(values: string[]) {
    const statuses = POLICY_STATUSES.map(s => s.id).filter(id => values.includes(id));
    this.policyCriteria.update(c => ({ ...c, statuses }));
  }

  markTouched() { this.attempted.set(true); }
  onInput(ev: Event) { this.query.set((ev.target as HTMLInputElement).value); }
  onExtensionInput(ev: Event) {
    const extension = (ev.target as HTMLInputElement).value;
    this.policyCriteria.update(c => ({ ...c, extension }));
  }
  clearQuery() { this.query.set(''); }
  clearExtension() { this.policyCriteria.update(c => ({ ...c, extension: '' })); }

  submit() {
    if (this.searchValid()) this.searchClicked.emit();
    else this.attempted.set(true);
  }
}
