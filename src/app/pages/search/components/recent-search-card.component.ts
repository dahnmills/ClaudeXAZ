import { Component, computed, input, output } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { FlagComponent, type FlagCode } from '../../../shared/ui/flag/flag.component';
import { SEARCH_TYPES, COUNTRIES } from '../../../shared/ui/search-bar-multi/search-bar-multi.component';
import { moreCriteriaSlots } from '../../../shared/ui/more-criteria/more-criteria.component';
import type { RecentEntry } from '../recent-searches.store';

/** Un critère de la carte : son libellé, sa valeur, et son drapeau pour le pays.
 *  Valeur vide = critère non posé ; sa colonne reste en place, elle ne dit rien
 *  de plus. */
interface RecentField {
  label: string;
  value: string;
  flag?: FlagCode;
}

@Component({
  selector: 'app-recent-search-card',
  standalone: true,
  imports: [CardComponent, FlagComponent],
  templateUrl: './recent-search-card.component.html',
  styleUrl: './recent-search-card.component.scss',
})
export class RecentSearchCardComponent {
  entry = input.required<RecentEntry>();
  /** Rejouer la recherche : clic n'importe où sur la carte. */
  replayed = output<void>();

  /**
   * Ce qu'on a tapé d'abord, c'est ce qu'on cherche dans la liste. Viennent
   * ensuite les critères qui le qualifient, dans l'ordre de la barre de
   * recherche : le type, le pays, le type d'ID, puis les critères
   * complémentaires.
   */
  fields = computed<RecentField[]>(() => {
    const e = this.entry();
    const s = moreCriteriaSlots(e.criteria);
    const country = e.country
      ? COUNTRIES.find(c => c.code === e.country)?.label ?? e.country.toUpperCase()
      : '';
    return [
      { label: 'Searched', value: e.query },
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
    ];
  });
}
