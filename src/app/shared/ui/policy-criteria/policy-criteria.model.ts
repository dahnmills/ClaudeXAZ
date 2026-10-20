import type { PolicyStatus } from '../policy-result-card/policy.model';

/** Critères complémentaires d'une recherche Policies, tels que la page les détient. */
export interface PolicyCriteriaValues {
  searchIn: 'policies' | 'drafts';
  statuses: PolicyStatus[];
  extension: string;
}

export const POLICY_STATUSES: { id: PolicyStatus; label: string }[] = [
  { id: 'issued',    label: 'Issued' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'expired',   label: 'Expired' },
];

/** Jeu par défaut, celui de Qirin : polices émises. Fonction, pas constante :
 *  chaque appelant a le sien. */
export function defaultPolicyCriteria(): PolicyCriteriaValues {
  return { searchIn: 'policies', statuses: ['issued'], extension: '' };
}

/** Nombre de critères actifs, lu par le compteur « More criteria (n) ».
 *  En Drafts, les statuts ne filtrent rien : ils ne comptent pas. */
export function policyCriteriaCount(v: PolicyCriteriaValues): number {
  let n = v.searchIn === 'drafts' ? 1 : v.statuses.length;
  if (v.extension.trim()) n++;
  return n;
}
