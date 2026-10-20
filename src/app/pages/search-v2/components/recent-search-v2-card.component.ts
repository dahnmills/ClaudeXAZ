import { Component, computed, input, output } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { FlagComponent, type FlagCode } from '../../../shared/ui/flag/flag.component';
import { SEARCH_TYPES, COUNTRIES, DIAL_CODES } from '../../../shared/ui/search-bar-multi/search-bar-multi.component';
import { moreCriteriaSlots } from '../../../shared/ui/more-criteria/more-criteria.component';
import { POLICY_STATUSES } from '../../../shared/ui/policy-criteria/policy-criteria.model';
import type { RecentV2Entry } from '../search-v2-recents.model';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface RecentField { label: string; value: string; flag?: FlagCode; }

/** Copie de la carte V1, avec une variante Policy (colonnes propres aux polices). */
@Component({
  selector: 'app-recent-search-v2-card',
  standalone: true,
  imports: [CardComponent, FlagComponent],
  templateUrl: './recent-search-v2-card.component.html',
  styleUrl: './recent-search-v2-card.component.scss',
})
export class RecentSearchV2CardComponent {
  entry = input.required<RecentV2Entry>();
  replayed = output<void>();

  isPolicy = computed(() => this.entry().kind === 'policy');

  searchedValue = computed(() => {
    const e = this.entry();
    if (e.kind === 'policy' && !e.query.trim()) return 'Any number or keyword';
    return e.kind === 'buyer' && e.type === 'phone' && e.country ? `${DIAL_CODES[e.country]} ${e.query}` : e.query;
  });

  timestamp = computed(() => {
    const d = new Date(this.entry().ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
  });

  fields = computed<RecentField[]>(() => {
    const e = this.entry();
    if (e.kind === 'policy') {
      const c = e.criteria;
      const statuses = c.searchIn === 'drafts'
        ? ''
        : POLICY_STATUSES.filter(s => c.statuses.includes(s.id)).map(s => s.label).join(', ');
      return [
        { label: 'Searched',    value: this.searchedValue() },
        { label: 'BU code',     value: e.buCode ?? 'All BUs' },
        { label: 'Search in',   value: c.searchIn === 'drafts' ? 'Drafts' : 'Policies' },
        { label: 'Status',      value: statuses },
        { label: 'Extension',   value: c.extension },
        { label: 'Searched at', value: this.timestamp() },
      ];
    }
    const s = moreCriteriaSlots(e.criteria);
    const country = e.country ? COUNTRIES.find(c => c.code === e.country)?.label ?? e.country.toUpperCase() : '';
    return [
      { label: 'Searched', value: this.searchedValue() },
      { label: 'Type',     value: SEARCH_TYPES.find(t => t.id === e.type)?.label ?? e.type },
      { label: 'Country',  value: country, flag: e.country ?? undefined },
      { label: 'ID type',  value: e.idType ?? '' },
      { label: s.status.key,         value: s.status.value ?? '' },
      { label: s.street.key,         value: s.street.value ?? '' },
      { label: s.city.key,           value: s.city.value ?? '' },
      { label: s.region.key,         value: s.region.value ?? '' },
      { label: s.zip.key,            value: s.zip.value ?? '' },
      { label: s.phone.key,          value: s.phone.value ?? '' },
      { label: s.extendedSearch.key, value: s.extendedSearch.value ?? '' },
      { label: 'Searched at', value: this.timestamp() },
    ];
  });
}
