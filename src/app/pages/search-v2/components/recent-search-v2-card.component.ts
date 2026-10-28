import { Component, computed, input, output } from '@angular/core';
import { IconComponent, type IconName } from '../../../shared/ui/icon/icon.component';
import { IconTileComponent } from '../../../shared/ui/icon-tile/icon-tile.component';
import { SEARCH_TYPES, COUNTRIES, DIAL_CODES } from '../../../shared/ui/search-bar-multi/search-bar-multi.component';
import { moreCriteriaSlots } from '../../../shared/ui/more-criteria/more-criteria.component';
import { POLICY_STATUSES } from '../../../shared/ui/policy-criteria/policy-criteria.model';
import type { BuyerRecentV2, PolicyRecentV2, RecentV2Entry } from '../search-v2-recents.model';
import { fullDate, historyDate } from '../search-v2-history';

/** Un critère renseigné : son libellé, puis la valeur cherchée. */
interface Criterion { label: string; value: string; }

/** Ce qu'une carte affiche, quel que soit l'objet cherché. */
interface RecentView {
  icon: IconName;
  object: string;
  searched: string;
  searchType: string;
  /** Critères renseignés seulement, dans l'ordre du formulaire. */
  criteria: Criterion[];
}

/**
 * Une recherche passée, sous une forme unique pour tous les objets : pastille
 * d'objet, ce qu'on a cherché et le type de recherche sur la ligne 1, les seuls
 * critères renseignés sur la ligne 2 (libellé, puis valeur en gras), la date à
 * droite. Aucune colonne propre à un objet : un fil chronologique mêlant
 * plusieurs objets reste lisible, et un nouvel objet ne demande qu'une icône et
 * ses critères. Mêmes métriques que ds-result-card en size s, pour que Recent
 * search, Recently viewed et Favorites aient la même hauteur de carte.
 * Cliquable en entier : le clic relance la recherche.
 */
@Component({
  selector: 'app-recent-search-v2-card',
  standalone: true,
  imports: [IconComponent, IconTileComponent],
  templateUrl: './recent-search-v2-card.component.html',
  styleUrl: './recent-search-v2-card.component.scss',
})
export class RecentSearchV2CardComponent {
  entry = input.required<RecentV2Entry>();
  replayed = output<void>();

  view = computed<RecentView>(() => {
    const e = this.entry();
    return e.kind === 'policy' ? this.policyView(e) : this.buyerView(e);
  });

  /** Les critères en clair, pour l'infobulle et le lecteur d'écran. */
  criteriaText = computed(() =>
    this.view().criteria.map(c => `${c.label}: ${c.value}`).join(', ') || 'No criteria');

  /** Quand la recherche a été lancée (ou rejouée) : "Searched 2 h ago", l'instant
   *  exact en infobulle. */
  timestamp = computed(() => historyDate('Searched', this.entry().ts, Date.now()));
  exactDate = computed(() => fullDate(this.entry().ts));
  isoDate = computed(() => new Date(this.entry().ts).toISOString());

  // Même pastille que la carte de résultat de l'objet (ds-result-card : grid)
  private buyerView(e: BuyerRecentV2): RecentView {
    const s = moreCriteriaSlots(e.criteria);
    const country = e.country ? COUNTRIES.find(c => c.code === e.country)?.label ?? e.country.toUpperCase() : null;
    const criteria: (Criterion | null)[] = [
      country ? { label: 'Country', value: country } : null,
      e.idType ? { label: 'ID type', value: e.idType } : null,
      ...[s.status, s.street, s.city, s.region, s.zip, s.phone, s.extendedSearch]
        .map(slot => slot.value ? { label: slot.key, value: slot.value } : null),
    ];
    return {
      icon: 'grid',
      object: 'Buyer',
      searched: e.type === 'phone' && e.country ? `${DIAL_CODES[e.country]} ${e.query}` : e.query,
      searchType: SEARCH_TYPES.find(t => t.id === e.type)?.label ?? e.type,
      criteria: criteria.filter((c): c is Criterion => !!c),
    };
  }

  private policyView(e: PolicyRecentV2): RecentView {
    const c = e.criteria;
    const criteria: Criterion[] = [{ label: 'BU', value: e.buCode ?? 'All BUs' }];
    if (c.searchIn === 'drafts') {
      criteria.push({ label: 'Search in', value: 'Drafts' });
    } else {
      criteria.push({ label: 'Search in', value: 'Policies' });
      criteria.push({
        label: 'Status',
        value: c.statuses.length === POLICY_STATUSES.length
          ? 'All'
          : POLICY_STATUSES.filter(s => c.statuses.includes(s.id)).map(s => s.label).join(', '),
      });
    }
    return {
      icon: 'contract',
      object: 'Policy',
      searched: e.query.trim() || 'Any name, number or Company ID',
      searchType: 'Global search',
      criteria,
    };
  }
}
