import { Component, computed, input, output } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { FlagComponent, type FlagCode } from '../../../shared/ui/flag/flag.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { IconTileComponent } from '../../../shared/ui/icon-tile/icon-tile.component';
import { TableRowComponent } from '../../../shared/ui/table/table-row.component';
import { CellHeaderComponent } from '../../../shared/ui/table/cell-header.component';
import { CellComponent } from '../../../shared/ui/table/cell.component';
import { SEARCH_TYPES, COUNTRIES, DIAL_CODES } from '../../../shared/ui/search-bar-multi/search-bar-multi.component';
import { moreCriteriaSlots } from '../../../shared/ui/more-criteria/more-criteria.component';
import { POLICY_MODES, POLICY_STATUSES } from '../../../shared/ui/policy-criteria/policy-criteria.model';
import type { BuyerRecentV2, PolicyRecentV2, RecentV2Entry } from '../search-v2-recents.model';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EMPTY = '—';

/** Une ligne prête à afficher : mêmes colonnes pour toutes les lignes du tableau. */
interface RecentRow {
  entry: RecentV2Entry;
  searched: string;
  cells: { value: string; flag?: FlagCode }[];
  at: string;
}

/**
 * Recherches récentes d'un seul objet, en tableau : les libellés une fois en
 * en-tête, une rangée par recherche, colonnes fixes. Les critères rares sont
 * résumés dans une seule colonne Criteria au lieu d'une colonne chacun, pour
 * que la ligne se lise sans une forêt de cases vides. La rangée entière relance
 * la recherche.
 */
@Component({
  selector: 'app-recent-searches-table',
  standalone: true,
  imports: [CardComponent, FlagComponent, IconComponent, IconTileComponent, TableRowComponent, CellHeaderComponent, CellComponent],
  templateUrl: './recent-searches-table.component.html',
  styleUrl: './recent-searches-table.component.scss',
})
export class RecentSearchesTableComponent {
  kind = input.required<'buyer' | 'policy'>();
  entries = input.required<RecentV2Entry[]>();
  replayed = output<RecentV2Entry>();

  isPolicy = computed(() => this.kind() === 'policy');

  /** Colonnes entre Searched et Searched at, dans l'ordre de la barre. */
  columns = computed(() => this.isPolicy()
    ? ['Mode', 'BU code', 'Criteria']
    : ['Type', 'Country', 'ID type', 'Criteria']);

  rows = computed<RecentRow[]>(() => this.entries().map(e => e.kind === 'policy' ? this.policyRow(e) : this.buyerRow(e)));

  private buyerRow(e: BuyerRecentV2): RecentRow {
    const s = moreCriteriaSlots(e.criteria);
    const criteria = [s.status, s.street, s.city, s.region, s.zip, s.phone, s.extendedSearch]
      .map(slot => slot.value).filter((v): v is string => !!v);
    const country = e.country ? COUNTRIES.find(c => c.code === e.country)?.label ?? e.country.toUpperCase() : '';
    return {
      entry: e,
      searched: e.type === 'phone' && e.country ? `${DIAL_CODES[e.country]} ${e.query}` : e.query,
      cells: [
        { value: SEARCH_TYPES.find(t => t.id === e.type)?.label ?? e.type },
        { value: country || EMPTY, flag: e.country ?? undefined },
        { value: e.idType ?? EMPTY },
        { value: criteria.join(' · ') || EMPTY },
      ],
      at: this.timestamp(e.ts),
    };
  }

  private policyRow(e: PolicyRecentV2): RecentRow {
    const c = e.criteria;
    let criteria: string;
    if (e.mode === 'open') {
      criteria = c.extension.trim() ? `Ext. ${c.extension.trim()}` : EMPTY;
    } else if (c.searchIn === 'drafts') {
      criteria = 'Drafts';
    } else {
      const statuses = c.statuses.length === POLICY_STATUSES.length
        ? 'All statuses'
        : POLICY_STATUSES.filter(s => c.statuses.includes(s.id)).map(s => s.label).join(', ');
      criteria = `Policies · ${statuses}`;
    }
    return {
      entry: e,
      searched: e.query.trim() || 'Any number or keyword',
      cells: [
        { value: POLICY_MODES.find(m => m.id === e.mode)?.label ?? '' },
        { value: e.buCode ?? 'All BUs' },
        { value: criteria },
      ],
      at: this.timestamp(e.ts),
    };
  }

  /** Quand la recherche a été lancée (ou rejouée), en clair : "29 Sep 2026, 14:32". */
  private timestamp(ts: number): string {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
  }
}
