import { Component, computed, input, model, output, signal } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { StandaloneDropdownComponent } from '../standalone-dropdown/standalone-dropdown.component';
import { ButtonComponent } from '../button/button.component';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../flyout-menu/flyout-menu-item.component';
import { FlagComponent, type FlagCode } from '../flag/flag.component';

export type SearchType = 'company-id' | 'id' | 'name' | 'phone' | 'manager';
export type IdTypeOption = 'DUN' | 'TVA' | 'SIREN' | 'SIRET';

interface TypeMeta {
  icon: IconName;
  label: string;
  placeholder: string;
}

const TYPE_META: Record<SearchType, TypeMeta> = {
  'company-id': { icon: 'hash',  label: 'Company ID', placeholder: 'Enter a company ID (e.g. 113, 184...)' },
  'id':         { icon: 'hash',  label: 'ID',         placeholder: 'Enter a company ID (e.g. 113, 184...)' },
  'name':       { icon: 'aa',    label: 'Name',       placeholder: 'Enter a company name' },
  'phone':      { icon: 'phone', label: 'Phone',      placeholder: 'Enter a phone number' },
  'manager':    { icon: 'user',  label: 'Manager',    placeholder: 'Enter a manager name' },
};

export const SEARCH_TYPES: { id: SearchType; label: string; icon: IconName }[] = [
  { id: 'company-id', label: 'Company ID', icon: 'hash' },
  { id: 'id',         label: 'ID',         icon: 'hash' },
  { id: 'name',       label: 'Name',       icon: 'aa' },
  { id: 'phone',      label: 'Phone',      icon: 'phone' },
  { id: 'manager',    label: 'Manager',    icon: 'user' },
];

export const COUNTRIES: { code: FlagCode; label: string }[] = [
  { code: 'fr', label: 'France' },
  { code: 'de', label: 'Germany' },
  { code: 'kr', label: 'Korea' },
  { code: 'gb', label: 'UK' },
  { code: 'us', label: 'USA' },
];

export const ID_TYPES: IdTypeOption[] = ['DUN', 'TVA', 'SIREN', 'SIRET'];

@Component({
  selector: 'ds-search-bar-multi',
  standalone: true,
  imports: [IconComponent, StandaloneDropdownComponent, ButtonComponent, FlyoutMenuComponent, FlyoutMenuItemComponent, FlagComponent],
  templateUrl: './search-bar-multi.component.html',
  styleUrl: './search-bar-multi.component.scss',
  host: { 'class': 'ds-search-bar-multi' },
})
export class SearchBarMultiComponent {
  type = model<SearchType>('company-id');
  country = model<FlagCode | null>(null);
  idType = model<IdTypeOption | null>(null);
  query = model<string>('');
  criteriaCount = input<number>(0);

  searchClicked = output<void>();
  moreCriteriaClicked = output<void>();

  openFlyout = signal<'type' | 'country' | 'id-type' | null>(null);

  searchTypes = SEARCH_TYPES;
  countries = COUNTRIES;
  idTypes = ID_TYPES;

  meta = computed<TypeMeta>(() => TYPE_META[this.type()]);

  countryEnabled = computed(() => {
    const t = this.type();
    return t === 'id' || t === 'name' || t === 'phone';
  });
  idTypeEnabled = computed(() => this.type() === 'id');

  countryLabel = computed(() => {
    const c = this.country();
    return c ? (this.countries.find(x => x.code === c)?.label ?? 'Select a country') : 'Select a country';
  });
  idTypeLabel = computed(() => this.idType() ?? 'ID Type');

  toggle(which: 'type' | 'country' | 'id-type') {
    this.openFlyout.update(v => v === which ? null : which);
  }
  close() { this.openFlyout.set(null); }

  pickType(t: SearchType) {
    this.type.set(t);
    if (!this.countryEnabled()) this.country.set(null);
    if (!this.idTypeEnabled()) this.idType.set(null);
    this.close();
  }
  pickCountry(c: FlagCode) {
    this.country.set(c);
    this.close();
  }
  pickIdType(it: IdTypeOption) {
    this.idType.set(it);
    this.close();
  }

  onInput(ev: Event) {
    this.query.set((ev.target as HTMLInputElement).value);
  }
  clearQuery() { this.query.set(''); }
}
