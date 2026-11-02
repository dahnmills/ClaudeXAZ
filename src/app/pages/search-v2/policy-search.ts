import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import type { PolicyCriteriaValues } from '../../shared/ui/policy-criteria/policy-criteria.model';

/** Une recherche Policies telle que la barre la pose. */
export interface PolicyQuery {
  /** null = toutes les BU. */
  buCode: string | null;
  query: string;
  criteria: PolicyCriteriaValues;
}

/**
 * Source (polices ou drafts, exclusif), BU si choisie, statuts cochés (polices
 * seulement ; aucun coché = aucune police), puis le texte : en partiel sur le nom
 * de police, l'assuré, le broker et le n° ; en exact sur les Company ID de
 * l'assuré et du broker. L'extension n'est jamais cherchée.
 */
export function searchPolicies(pool: PolicyResultData[], q: PolicyQuery): PolicyResultData[] {
  const c = q.criteria;
  const raw = q.query.trim();
  const text = raw.toLowerCase();

  const filtered = pool.filter(p =>
    (c.searchIn === 'drafts' ? p.kind === 'draft' : p.kind === 'policy') &&
    (!q.buCode || p.buCode === q.buCode) &&
    (p.kind === 'draft' || c.statuses.includes(p.status)),
  );
  if (!text) return filtered;

  return filtered.filter(p =>
    [p.policyName, p.insuredName, p.brokerName ?? '', p.policyNumber].some(v => v.toLowerCase().includes(text))
    || p.insuredCompanyId === raw
    || p.brokerCompanyId === raw,
  );
}
