/** Ce que la carte de résultat Policy affiche, calculé hors Angular.
 *  Module pur : lu par les tests node. */
import type { BadgeStatus } from '../badge/badge.component';
import {
  POLICY_STATUS_LABELS, DRAFT_STATUS_LABELS,
  type PolicyResultData, type PolicyStatus, type DraftStatus,
} from './policy.model';

/** Fenêtre d'alerte avant la next renewal date, en jours. */
const RENEWAL_ALERT_DAYS = 30;
const DAY_MS = 86_400_000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** Valeur vide d'un champ du dépliage. */
export const EMPTY_VALUE = '—';
const EMPTY = EMPTY_VALUE;

const POLICY_TONES: Record<PolicyStatus, BadgeStatus> = { issued: 'success', cancelled: 'error', expired: 'neutral' };
const DRAFT_TONES: Record<DraftStatus, BadgeStatus> = {
  applicant: 'info', pending: 'warning', returned: 'warning',
  aborted: 'neutral', cancelled: 'error', transformed: 'success',
};

export interface PolicyDateBlock { label: string; value: string; alert: boolean; }
export interface PolicyDetailRow { label: string; value: string; }

/** La clé telle que l'utilisateur la lit et la copie : 'AT UK · 7730012 · 0234', 'AT UK · D20431 · NBI'. */
export function policyKeyLabel(p: PolicyResultData): string {
  const parts = [p.buCode, p.policyNumber];
  if (p.kind === 'draft') parts.push(p.draftStage.toUpperCase());
  else if (p.extension !== null) parts.push(p.extension);
  return parts.join(' · ');
}

export function policyBadge(p: PolicyResultData): { label: string; status: BadgeStatus } {
  return p.kind === 'draft'
    ? { label: DRAFT_STATUS_LABELS[p.status], status: DRAFT_TONES[p.status] }
    : { label: POLICY_STATUS_LABELS[p.status], status: POLICY_TONES[p.status] };
}

/** '2026-11-15' → '15 Nov 2026'. */
export function formatPolicyDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
}

/** Jours calendaires (UTC) entre aujourd'hui et une date ISO, négatif si passée. */
function daysUntil(iso: string, today: Date): number {
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - start) / DAY_MS);
}

/**
 * La date de la colonne droite. Police Issued : next renewal, en alerte dans les
 * 30 jours qui précèdent ou une fois dépassée. Police terminée : sa date de fin.
 * Draft : sa dernière mise à jour. null quand il n'y a rien de fiable à montrer.
 */
export function policyDateBlock(p: PolicyResultData, today: Date): PolicyDateBlock | null {
  if (p.kind === 'draft') return { label: 'Updated', value: formatPolicyDate(p.updatedDate), alert: false };
  if (p.status === 'cancelled') {
    return p.cancellationDate ? { label: 'Cancelled on', value: formatPolicyDate(p.cancellationDate), alert: false } : null;
  }
  if (p.status === 'expired') return { label: 'Expired on', value: formatPolicyDate(p.expiryDate), alert: false };
  if (!p.nextRenewalDate) return null;
  const days = daysUntil(p.nextRenewalDate, today);
  return {
    label: days < 0 ? 'Renewal overdue' : 'Next renewal',
    value: formatPolicyDate(p.nextRenewalDate),
    alert: days <= RENEWAL_ALERT_DAYS,
  };
}

/** Les infos secondaires du dépliage, dans l'ordre de lecture. Un draft n'a pas de dates de police. */
export function policyDetailRows(p: PolicyResultData): PolicyDetailRow[] {
  const broker = [p.brokerName, p.brokerCompanyId].filter(Boolean).join(' · ');
  const rows: PolicyDetailRow[] = [
    { label: 'Insured Company ID', value: p.insuredCompanyId ?? EMPTY },
    { label: 'Insured country', value: p.insuredCountry ?? EMPTY },
  ];
  if (p.kind === 'policy') {
    rows.push(
      { label: 'Inception', value: formatPolicyDate(p.inceptionDate) },
      { label: 'Expiry', value: formatPolicyDate(p.expiryDate) },
    );
  }
  rows.push(
    { label: 'Segment', value: p.segment ?? EMPTY },
    { label: 'LOB', value: p.lob ?? EMPTY },
    { label: 'Broker', value: broker || EMPTY },
  );
  if (p.kind === 'policy') rows.push({ label: 'Inforce BU', value: p.inforceBu ?? EMPTY });
  return rows;
}

/** Champs par colonne du dépliage : ds-properties-panel pose une colonne par section. */
const DETAIL_ROWS_PER_COLUMN = 2;

/** Le dépliage en colonnes de 2 champs, dans l'ordre de lecture : 4 colonnes pour une police. */
export function policyDetailColumns(p: PolicyResultData): PolicyDetailRow[][] {
  const rows = policyDetailRows(p);
  const cols: PolicyDetailRow[][] = [];
  for (let i = 0; i < rows.length; i += DETAIL_ROWS_PER_COLUMN) cols.push(rows.slice(i, i + DETAIL_ROWS_PER_COLUMN));
  return cols;
}

/** Police signée, draft au stade applicant, draft en NBI : trois icônes distinctes. */
export function policyTileIcon(p: PolicyResultData): 'contract' | 'file-new' | 'file-text' {
  if (p.kind === 'policy') return 'contract';
  return p.draftStage === 'app' ? 'file-new' : 'file-text';
}
