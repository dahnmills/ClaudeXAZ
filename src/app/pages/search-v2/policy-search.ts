import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import type { PolicyCriteriaValues } from '../../shared/ui/policy-criteria/policy-criteria.model';

/** Une recherche Policies telle que la barre et le panneau la posent. */
export interface PolicyQuery {
  /** null = toutes les BU. */
  buCode: string | null;
  query: string;
  criteria: PolicyCriteriaValues;
}

export interface PolicySearchResult {
  items: PolicyResultData[];
  /** Vrai quand la saisie désigne exactement une police d'une BU choisie :
   *  c'est l'ancien « Open policy », la page déplie le résultat d'office. */
  exactHit: boolean;
}

/**
 * Filtre le jeu de polices. Ordre : source (polices ou drafts, exclusif), BU,
 * statut (polices seulement, aucun coché = tous), extension, puis la saisie.
 * Une saisie égale au n° d'une seule police, BU choisie, donne un accès direct ;
 * sinon recherche partielle sur le n° et le policyholder.
 */
export function searchPolicies(pool: PolicyResultData[], q: PolicyQuery): PolicySearchResult {
  const c = q.criteria;
  const ext = c.extension.trim();
  const filtered = pool.filter(p =>
    (c.searchIn === 'drafts' ? p.kind === 'draft' : p.kind === 'policy') &&
    (!q.buCode || p.buCode === q.buCode) &&
    (c.searchIn === 'drafts' || !c.statuses.length || (p.status !== null && c.statuses.includes(p.status))) &&
    (!ext || p.extension === ext),
  );

  const text = q.query.trim().toLowerCase();
  if (!text) return { items: filtered, exactHit: false };

  if (q.buCode) {
    const exact = filtered.filter(p => p.policyNumber.toLowerCase() === text);
    if (exact.length === 1) return { items: exact, exactHit: true };
  }

  return {
    items: filtered.filter(p =>
      p.policyNumber.toLowerCase().includes(text) || p.policyholder.toLowerCase().includes(text),
    ),
    exactHit: false,
  };
}
