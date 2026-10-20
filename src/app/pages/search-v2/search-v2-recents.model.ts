import type { SearchType, IdTypeOption } from '../../shared/ui/search-bar-multi/search-bar-multi.component';
import type { FlagCode } from '../../shared/ui/flag/flag.component';
import type { MoreCriteriaValues } from '../../shared/ui/more-criteria/more-criteria.component';
import type { PolicyCriteriaValues } from '../../shared/ui/policy-criteria/policy-criteria.model';

/** Une recherche buyer passée : mêmes champs que l'entrée V1, plus son objet. */
export interface BuyerRecentV2 {
  kind: 'buyer';
  type: SearchType;
  query: string;
  country: FlagCode | null;
  idType: IdTypeOption | null;
  criteria: MoreCriteriaValues;
  ts: number;
}

/** Une recherche policy passée, avec tout ce qui la distingue d'une autre. */
export interface PolicyRecentV2 {
  kind: 'policy';
  buCode: string | null;
  query: string;
  criteria: PolicyCriteriaValues;
  ts: number;
}

export type RecentV2Entry = BuyerRecentV2 | PolicyRecentV2;
export type RecentV2Input = Omit<BuyerRecentV2, 'ts'> | Omit<PolicyRecentV2, 'ts'>;

/** Signature d'une recherche. Deux entrées ne coexistent que si un critère les distingue. */
export function recentKey(e: RecentV2Input): string {
  if (e.kind === 'buyer') {
    const c = e.criteria;
    return JSON.stringify([
      'buyer', e.type, e.query, e.country, e.idType,
      [...c.statuses].sort(), c.extendCountry, c.street, c.city, c.region, c.zip, c.phone,
    ]);
  }
  const c = e.criteria;
  return JSON.stringify(['policy', e.buCode, e.query, c.searchIn, c.searchIn === 'drafts' ? [] : [...c.statuses].sort(), c.extension]);
}
