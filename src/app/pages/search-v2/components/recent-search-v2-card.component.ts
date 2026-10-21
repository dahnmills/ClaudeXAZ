import { Component, computed, input, output } from '@angular/core';
import { IconComponent, type IconName } from '../../../shared/ui/icon/icon.component';
import { IconTileComponent } from '../../../shared/ui/icon-tile/icon-tile.component';
import { SEARCH_TYPES, COUNTRIES, DIAL_CODES } from '../../../shared/ui/search-bar-multi/search-bar-multi.component';
import { moreCriteriaSlots } from '../../../shared/ui/more-criteria/more-criteria.component';
import { POLICY_MODES, POLICY_STATUSES } from '../../../shared/ui/policy-criteria/policy-criteria.model';
import type { BuyerRecentV2, PolicyRecentV2, RecentV2Entry } from '../search-v2-recents.model';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Ce qu'une carte affiche, quel que soit l'objet cherché. */
interface RecentView {
  icon: IconName;
  object: string;
  searched: string;
  searchType: string;
  /** Critères renseignés seulement, déjà résumés en une ligne. */
  summary: string;
}

/**
 * Une recherche passée, sous une forme unique pour tous les objets : pastille
 * d'objet, ce qu'on a cherché et le type de recherche sur la ligne 1, les seuls
 * critères renseignés sur la ligne 2, la date à droite. Aucune colonne propre à
 * un objet : un fil chronologique mêlant plusieurs objets reste lisible, et un
 * nouvel objet ne demande qu'une icône et un résumé. Mêmes métriques que
 * ds-result-card, pour que Recent search, Recently viewed et Favorites aient la
 * même hauteur de carte. Cliquable en entier : le clic relance la recherche.
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

  /** Quand la recherche a été lancée (ou rejouée), en clair : "29 Sep 2026, 14:32". */
  timestamp = computed(() => {
    const d = new Date(this.entry().ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
  });

  // Même pastille que la carte de résultat de l'objet (ds-result-card : grid)
  private buyerView(e: BuyerRecentV2): RecentView {
    const s = moreCriteriaSlots(e.criteria);
    const country = e.country ? COUNTRIES.find(c => c.code === e.country)?.label ?? e.country.toUpperCase() : null;
    const parts = [
      country,
      e.idType,
      s.status.value,
      s.street.value, s.city.value, s.region.value, s.zip.value, s.phone.value,
      s.extendedSearch.value ? 'Extended country search' : null,
    ].filter((v): v is string => !!v);
    return {
      icon: 'grid',
      object: 'Buyer',
      searched: e.type === 'phone' && e.country ? `${DIAL_CODES[e.country]} ${e.query}` : e.query,
      searchType: SEARCH_TYPES.find(t => t.id === e.type)?.label ?? e.type,
      summary: parts.join(' · ') || 'No criteria',
    };
  }

  private policyView(e: PolicyRecentV2): RecentView {
    const c = e.criteria;
    const bu = e.buCode ?? 'All BUs';
    let summary: string;
    if (e.mode === 'open') {
      summary = c.extension.trim() ? `${bu} · Ext. ${c.extension.trim()}` : bu;
    } else if (c.searchIn === 'drafts') {
      summary = `${bu} · Drafts`;
    } else {
      const statuses = c.statuses.length === POLICY_STATUSES.length
        ? 'All statuses'
        : POLICY_STATUSES.filter(s => c.statuses.includes(s.id)).map(s => s.label).join(', ');
      summary = `${bu} · Policies · ${statuses}`;
    }
    return {
      icon: 'contract',
      object: 'Policy',
      searched: e.query.trim() || 'Any number or keyword',
      searchType: POLICY_MODES.find(m => m.id === e.mode)?.label ?? '',
      summary,
    };
  }
}
