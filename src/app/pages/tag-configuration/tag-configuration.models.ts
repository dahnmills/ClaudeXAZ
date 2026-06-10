export type TagDecision   = 'valid' | 'refuse' | 'task' | 'nc';
export type TagFreshness  = 'fresh' | 'outdated' | 'old';
export type TagRuleStatus = 'draft' | 'active' | 'inactive';

/**
 * Critères d'une règle, organisés en 4 groupes (cf. mockup 1.1).
 * `null` = critère inactif ("Any" — n'entre pas dans le matching).
 */
export interface TagRuleCriteria {
  // ── Critères directs ───────────────────────────────
  sensitivity:   string[] | null;          // S0..S3
  exposureMin:   number   | null;          // EUR
  exposureMax:   number   | null;
  newAutograde:  string[] | null;          // 05..10

  // ── Grade valide ───────────────────────────────────
  validValue:       string[] | null;       // grades
  validType:        string[] | null;       // ALGORITHMIC | MANUAL
  validFreshness:   TagFreshness | null;
  validTransferred: boolean | null;
  validVsNew:       string | null;         // ex. "≥ nouvel"

  // ── Dernier AG vérifié ─────────────────────────────
  lastAgValue:     string[] | null;
  lastAgFreshness: TagFreshness | null;
  lastAgVsNew:     string | null;

  // ── Additionnels ───────────────────────────────────
  nace:      string[] | null;
  legalForm: string[] | null;
  role:      string[] | null;
}

export interface TagRule {
  id:       string;
  position: number;
  decision: TagDecision;
  criteria: TagRuleCriteria;
}

export interface TagSystemRule {
  id:          string;   // TRANS-LAST-PENDING | TRANS-NA-EXCL | TRANS-DEFAULT
  label:       string;   // libellé métier
  description: string;
  phase:       'pre' | 'post';   // pre = avant règles pays, post = filet de sécurité
  decision:    TagDecision;
}

export interface FreshnessConfig {
  lastVerified: { freshMonths: number; outdatedMonths: number };
  manualGrade:  { freshMonths: number; outdatedMonths: number };
}

export interface StatusExclusion {
  code:  string;
  label: string;
}

/**
 * IRP CLOSTHDO closed-status reference (COMPANY_STATUS_REASON). Source of truth for
 * the TRANS-NA-EXCL exclusion list: admins pick from this set, free entry is forbidden
 * (cf. draft V2, mock 4.1). Replace this mock with the live referential lookup later.
 */
export const STATUS_REASON_REFERENTIAL: StatusExclusion[] = [
  { code: 'FAILL', label: 'Business bankruptcy' },
  { code: 'LIQJU', label: 'Liquidation' },
  { code: 'LIQSI', label: 'Liquidation simplifiée' },
  { code: 'CLOFA', label: 'Closure of bankruptcy' },
  { code: 'BANST', label: 'Bankruptcy for sole trader' },
  { code: 'CESJU', label: 'Dissolved' },
  { code: 'CESEC', label: 'Ceased to trade' },
  { code: 'INTER', label: 'Disqualified' },
];

export interface TagHistoryEntry {
  version:    number;
  status:     TagRuleStatus;
  createdAt:  string;
  createdBy:  string;
  modifiedAt: string;
  modifiedBy: string;
}

export type BadgeStatus  = 'info' | 'warning' | 'success' | 'error' | 'neutral';
export type BadgeVariant = 'light' | 'strong';

/**
 * Mapping décision → ds-badge. Couleurs sémantiques (UX claire) :
 *  Accepter = vert · Refuser = rouge · Tâche = ambre (action requise) · N/C = gris.
 */
export const DECISION_BADGE: Record<TagDecision, { label: string; status: BadgeStatus; variant: BadgeVariant }> = {
  valid:  { label: 'Accept',      status: 'success', variant: 'strong' },
  refuse: { label: 'Refuse',      status: 'error',   variant: 'strong' },
  task:   { label: 'Create task', status: 'warning', variant: 'strong' },
  nc:     { label: 'Not evaluated', status: 'neutral', variant: 'light' },
};
