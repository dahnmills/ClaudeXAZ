import {
  POLICY_STATUS_LABELS, DRAFT_STATUS_LABELS,
  type PolicyResultData, type PolicyStatus, type DraftStatus,
} from '../../shared/ui/policy-result-card/policy.model';
import type { PolicyCriteriaValues } from '../../shared/ui/policy-criteria/policy-criteria.model';

/**
 * Tri de la liste Policies. Une seule liste, une seule carte : trier par une
 * propriété catégorielle (étape, statut) range les cartes en groupes, trier par
 * date ou par nom reste à plat. Module pur, lu par les tests node.
 */
export type PolicyOrder = 'relevance' | 'stage' | 'status' | 'date' | 'name';

export interface PolicyGroup {
  /** null : liste à plat, pas d'en-tête. */
  label: string | null;
  items: PolicyResultData[];
}

/** Parcours du prospect : l'APP avant la NBI. */
const STAGE_ORDER = ['app', 'nbi'] as const;
const POLICY_STATUS_ORDER: PolicyStatus[] = ['issued', 'cancelled', 'expired'];
/** Du vivant au clos : ce qui attend une action d'abord. */
const DRAFT_STATUS_ORDER: DraftStatus[] = ['pending', 'returned', 'issued', 'inactive', 'transformed', 'aborted', 'cancelled'];

const GROUPED: PolicyOrder[] = ['stage', 'status'];

/** Les tris proposés selon la source ; l'étape n'existe que pour les drafts. */
export function orderOptions(searchIn: PolicyCriteriaValues['searchIn']): { value: PolicyOrder; label: string }[] {
  return [
    { value: 'relevance', label: 'Relevance' },
    ...(searchIn === 'drafts' ? [{ value: 'stage' as const, label: 'Stage' }] : []),
    { value: 'status', label: 'Status' },
    { value: 'date', label: searchIn === 'drafts' ? 'Inception' : 'Next renewal' },
    { value: 'name', label: 'Name' },
  ];
}

function rank(p: PolicyResultData, order: PolicyOrder): number {
  if (order === 'stage') return p.kind === 'draft' ? STAGE_ORDER.indexOf(p.draftStage) : 0;
  return p.kind === 'draft' ? DRAFT_STATUS_ORDER.indexOf(p.status) : POLICY_STATUS_ORDER.indexOf(p.status);
}

/** Police : prochain renouvellement ; draft : début de couverture proposé. */
function dateOf(p: PolicyResultData): string | undefined {
  return p.kind === 'draft' ? p.inceptionDate : p.nextRenewalDate;
}

/** La liste triée, sans toucher à l'entrée. Tri stable : à égalité, l'ordre de la recherche. */
export function orderPolicies(items: PolicyResultData[], order: PolicyOrder): PolicyResultData[] {
  const list = [...items];
  switch (order) {
    case 'stage':
    case 'status':
      return list.sort((a, b) => rank(a, order) - rank(b, order));
    case 'date':
      return list.sort((a, b) => {
        const da = dateOf(a), db = dateOf(b);
        if (!da || !db) return da ? -1 : db ? 1 : 0;
        return da.localeCompare(db);
      });
    case 'name':
      return list.sort((a, b) => a.policyName.localeCompare(b.policyName, 'en', { sensitivity: 'base' }));
    default:
      return list;
  }
}

function groupLabel(p: PolicyResultData, order: PolicyOrder): string | null {
  if (order === 'stage') return p.kind === 'draft' ? p.draftStage.toUpperCase() : null;
  if (order === 'status') return p.kind === 'draft' ? DRAFT_STATUS_LABELS[p.status] : POLICY_STATUS_LABELS[p.status];
  return null;
}

/** Range une liste déjà triée en groupes consécutifs (la page chargée, pas toute la liste). */
export function groupPolicies(sorted: PolicyResultData[], order: PolicyOrder): PolicyGroup[] {
  if (!sorted.length) return [];
  if (!GROUPED.includes(order)) return [{ label: null, items: sorted }];
  const groups: PolicyGroup[] = [];
  for (const p of sorted) {
    const label = groupLabel(p, order);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(p);
    else groups.push({ label, items: [p] });
  }
  return groups;
}

/** Effectif de chaque groupe sur toute la liste : l'en-tête annonce le total, même
 *  quand le chargement progressif n'a pas encore tout affiché. */
export function groupCounts(sorted: PolicyResultData[], order: PolicyOrder): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of sorted) {
    const label = groupLabel(p, order);
    if (label) counts[label] = (counts[label] ?? 0) + 1;
  }
  return counts;
}
