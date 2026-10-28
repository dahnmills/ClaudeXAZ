import type { PolicyStatus } from '../policy-result-card/policy.model';

/** Critères d'une recherche Policies, tous posés dans la barre. Les statuts ne
 *  filtrent que les polices : un draft a ses propres statuts, non filtrés. */
export interface PolicyCriteriaValues {
  searchIn: 'policies' | 'drafts';
  statuses: PolicyStatus[];
}

export const POLICY_STATUSES: { id: PolicyStatus; label: string }[] = [
  { id: 'issued',    label: 'Issued' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'expired',   label: 'Expired' },
];

/** Jeu par défaut : polices Issued seulement, comme dans Qirin (les polices
 *  terminées noient la liste). Fonction, pas constante : chaque appelant a le sien. */
export function defaultPolicyCriteria(): PolicyCriteriaValues {
  return { searchIn: 'policies', statuses: ['issued'] };
}

/** Changer de source. Revenir des drafts aux polices recoche le défaut (Issued) :
 *  on repart d'une recherche valide. Resélectionner la source courante ne touche à rien. */
export function withSearchIn(c: PolicyCriteriaValues, searchIn: PolicyCriteriaValues['searchIn']): PolicyCriteriaValues {
  if (searchIn === c.searchIn) return c;
  return searchIn === 'policies' ? { searchIn, statuses: defaultPolicyCriteria().statuses } : { ...c, searchIn };
}
