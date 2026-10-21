import type { PolicyStatus } from '../policy-result-card/policy.model';

/**
 * Les deux recherches de Qirin, choisies dans le 2e slot de la barre.
 * Open policy : on connaît la police (BU + n° + extension), accès direct.
 * Global search : recherche large, filtrée par source et statut.
 */
export type PolicyMode = 'open' | 'global';

export const POLICY_MODES: { id: PolicyMode; label: string }[] = [
  { id: 'open',   label: 'Open policy' },
  { id: 'global', label: 'Global search' },
];

/** Critères d'une recherche Policies, tous posés dans la barre. L'extension ne
 *  sert qu'en Open policy ; Search in et les statuts qu'en Global search. */
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
