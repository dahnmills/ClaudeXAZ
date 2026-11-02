import {
  POLICY_STATUS_LABELS, DRAFT_STATUS_LABELS,
  type PolicyResultData, type PolicyStatus, type DraftStatus,
} from '../../shared/ui/policy-result-card/policy.model';
import type { PolicyCriteriaValues } from '../../shared/ui/policy-criteria/policy-criteria.model';

/**
 * Regroupement de la liste Policies. Une seule liste, une seule carte : grouper
 * par étape ou par statut range les cartes sous des intertitres, l'ordre de la
 * recherche est gardé dans chaque groupe. Module pur, lu par les tests node.
 */
export type PolicyGrouping = 'none' | 'stage' | 'status';

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

/** Les regroupements proposés selon la source ; l'étape n'existe que pour les drafts. */
export function groupingOptions(searchIn: PolicyCriteriaValues['searchIn']): { value: PolicyGrouping; label: string }[] {
  return [
    { value: 'none', label: 'None' },
    ...(searchIn === 'drafts' ? [{ value: 'stage' as const, label: 'Stage' }] : []),
    { value: 'status', label: 'Status' },
  ];
}

function rank(p: PolicyResultData, grouping: PolicyGrouping): number {
  if (grouping === 'stage') return p.kind === 'draft' ? STAGE_ORDER.indexOf(p.draftStage) : 0;
  return p.kind === 'draft' ? DRAFT_STATUS_ORDER.indexOf(p.status) : POLICY_STATUS_ORDER.indexOf(p.status);
}

/** La liste dans l'ordre des groupes, sans toucher à l'entrée. Tri stable : dans
 *  un groupe, l'ordre de la recherche. */
export function sortForGrouping(items: PolicyResultData[], grouping: PolicyGrouping): PolicyResultData[] {
  if (grouping === 'none') return [...items];
  return [...items].sort((a, b) => rank(a, grouping) - rank(b, grouping));
}

function groupLabel(p: PolicyResultData, grouping: PolicyGrouping): string | null {
  if (grouping === 'stage') return p.kind === 'draft' ? p.draftStage.toUpperCase() : null;
  if (grouping === 'status') return p.kind === 'draft' ? DRAFT_STATUS_LABELS[p.status] : POLICY_STATUS_LABELS[p.status];
  return null;
}

/** Range une liste déjà triée en groupes consécutifs (la page chargée, pas toute la liste). */
export function groupPolicies(sorted: PolicyResultData[], grouping: PolicyGrouping): PolicyGroup[] {
  if (!sorted.length) return [];
  if (grouping === 'none') return [{ label: null, items: sorted }];
  const groups: PolicyGroup[] = [];
  for (const p of sorted) {
    const label = groupLabel(p, grouping);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(p);
    else groups.push({ label, items: [p] });
  }
  return groups;
}

/** Effectif de chaque groupe sur toute la liste : l'en-tête annonce le total, même
 *  quand le chargement progressif n'a pas encore tout affiché. */
export function groupCounts(sorted: PolicyResultData[], grouping: PolicyGrouping): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of sorted) {
    const label = groupLabel(p, grouping);
    if (label) counts[label] = (counts[label] ?? 0) + 1;
  }
  return counts;
}
