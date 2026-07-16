import { RuleCriteria, Comparison, Freshness } from './tag-configuration.models';

const COMPARISON_LABEL: Record<Comparison, string> = { Upgrade: '↑ Upgrade', Same: '= Same', Downgrade: '↓ Downgrade' };

export function fmtList(v: string[] | null): string {
  return v && v.length ? v.join(', ') : 'Any';
}
export function fmtFreshness(v: Freshness | null): string { return v ?? 'Any'; }
export function fmtComparison(v: Comparison | null): string { return v ? COMPARISON_LABEL[v] : 'Any'; }
export function fmtTransferred(v: boolean | null): string { return v == null ? 'Any' : (v ? 'Yes' : 'No'); }
export function fmtExposure(v: RuleCriteria['exposure'], currency: string): string {
  return v ? `${v.op} ${v.amount.toLocaleString('en-US')} ${currency}` : 'Any';
}
export function isAny(v: unknown): boolean {
  return v == null || (Array.isArray(v) && v.length === 0);
}
/** True when NACE + legal form + company role are all Any (Other group collapses by default). */
export function otherAllAny(c: RuleCriteria): boolean {
  return isAny(c.nace) && isAny(c.legalForm) && isAny(c.companyRole);
}
