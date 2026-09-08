import { RuleCriteria, Comparison, Freshness } from './tag-configuration.models';

const COMPARISON_LABEL: Record<Comparison, string> = { Upgrade: '↑ Upgrade', Same: '= Same', Downgrade: '↓ Downgrade' };

export function fmtList(v: string[] | null): string {
  return v && v.length ? v.join(', ') : 'Any';
}
export function fmtFreshness(v: Freshness | null): string { return v ?? 'Any'; }
export function fmtComparison(v: Comparison | null): string { return v ? COMPARISON_LABEL[v] : 'Any'; }
export function fmtTransferred(v: boolean | null): string { return v == null ? 'Any' : (v ? 'Yes' : 'No'); }
// La valeur stockée reste '<=' (modèle, export JSON) ; seul l'affichage porte
// le glyphe, pour dire la même chose en lecture et dans la modale.
const OP_GLYPH: Record<'>' | '<=', string> = { '>': '>', '<=': '≤' };

export function fmtExposure(v: RuleCriteria['exposure'], currency: string): string {
  return v ? `${OP_GLYPH[v.op]} ${v.amount.toLocaleString('en-US')} ${currency}` : 'Any';
}
export function isAny(v: unknown): boolean {
  return v == null || (Array.isArray(v) && v.length === 0);
}
