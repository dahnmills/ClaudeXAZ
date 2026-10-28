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
