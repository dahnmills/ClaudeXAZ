import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import type { PolicyCriteriaValues, PolicyMode } from '../../shared/ui/policy-criteria/policy-criteria.model';

/** Une recherche Policies telle que la barre la pose. */
export interface PolicyQuery {
  mode: PolicyMode;
  /** null = toutes les BU (Global search seulement ; Open policy l'exige). */
  buCode: string | null;
  query: string;
  criteria: PolicyCriteriaValues;
}

export interface PolicySearchResult {
  items: PolicyResultData[];
  /** Open policy qui désigne une seule police : la page la déplie d'office. */
  exactHit: boolean;
}

/**
 * Open policy : police de la BU dont le n° (ou n°-extension, tel qu'affiché)
 * est exactement la saisie, extension appliquée si elle est renseignée, tous
 * statuts confondus.
 * Global search : source (polices ou drafts, exclusif), BU si choisie, statuts
 * cochés (polices seulement ; aucun coché = aucune police), puis recherche partielle sur le n°
 * et le policyholder. L'extension n'y joue pas.
 */
export function searchPolicies(pool: PolicyResultData[], q: PolicyQuery): PolicySearchResult {
  const c = q.criteria;
  const text = q.query.trim().toLowerCase();

  if (q.mode === 'open') {
    if (!q.buCode || !text) return { items: [], exactHit: false };
    const ext = c.extension.trim();
    const items = pool.filter(p =>
      p.kind === 'policy' &&
      p.buCode === q.buCode &&
      (p.policyNumber.toLowerCase() === text || p.id.toLowerCase() === text) &&
      (!ext || p.extension === ext),
    );
    return { items, exactHit: items.length === 1 };
  }

  const filtered = pool.filter(p =>
    (c.searchIn === 'drafts' ? p.kind === 'draft' : p.kind === 'policy') &&
    (!q.buCode || p.buCode === q.buCode) &&
    (c.searchIn === 'drafts' || (p.status !== null && c.statuses.includes(p.status))),
  );
  if (!text) return { items: filtered, exactHit: false };
  return {
    items: filtered.filter(p =>
      p.policyNumber.toLowerCase().includes(text)
      || p.id.toLowerCase().includes(text)
      || p.policyholder.toLowerCase().includes(text),
    ),
    exactHit: false,
  };
}
