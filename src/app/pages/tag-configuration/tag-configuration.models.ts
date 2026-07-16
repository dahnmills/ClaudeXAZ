export type Sensitivity = 'S0' | 'S1' | 'S2' | 'S2+' | 'S3' | 'SN' | 'None';
export type Grade =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'
  | 'NA' | 'noGrade';
export type GradeType  = 'Automatic' | 'Manual';
export type Freshness  = 'Fresh' | 'Outdated' | 'Old';
export type Comparison = 'Upgrade' | 'Same' | 'Downgrade';
export type Decision   = 'Accept' | 'Refuse' | 'CreateTask';
export type RuleStatus = 'Valid' | 'NC';
export type CountryCode = 'FR' | 'DE' | 'NE' | 'PT';

/** null = "Any" (criterion inactive, ignored in matching). */
export interface RuleCriteria {
  sensitivity:  Sensitivity[] | null;
  exposure:     { op: '>' | '<='; amount: number } | null;
  newAutoGrade: Grade[] | null;

  cvgValue:     Grade[] | null;
  cvgType:      GradeType[] | null;
  cvgFreshness: Freshness | null;
  transferred:  boolean | null;
  newVsCvg:     Comparison | null;

  lastAgValue:     Grade[] | null;
  lastAgFreshness: Freshness | null;
  newVsLastAg:     Comparison | null;

  nace:        string[] | null;
  legalForm:   string[] | null;
  companyRole: string[] | null;
}

export interface TagRule {
  id: string;
  position: number;
  decision: Decision;
  status: RuleStatus;
  criteria: RuleCriteria;
}

export interface FreshnessConfig {
  lastCheckedAutograde: { freshUpToMonths: number; oldAfterMonths: number };
  validManualGrade:     { freshUpToMonths: number; oldAfterMonths: number };
}

export interface StatusReasonCode { code: string; label: string; }

export interface Country { code: CountryCode; name: string; currency: string; }

export const EMPTY_CRITERIA: RuleCriteria = {
  sensitivity: null, exposure: null, newAutoGrade: null,
  cvgValue: null, cvgType: null, cvgFreshness: null, transferred: null, newVsCvg: null,
  lastAgValue: null, lastAgFreshness: null, newVsLastAg: null,
  nace: null, legalForm: null, companyRole: null,
};

export type BadgeStatus  = 'info' | 'warning' | 'success' | 'error' | 'neutral';
export type BadgeVariant = 'light' | 'strong';

export const DECISION_BADGE: Record<Decision, { label: string; status: BadgeStatus; variant: BadgeVariant }> = {
  Accept:     { label: 'Accept',      status: 'success', variant: 'strong' },
  Refuse:     { label: 'Refuse',      status: 'error',   variant: 'strong' },
  CreateTask: { label: 'Create task', status: 'warning', variant: 'strong' },
};

/** P4 filter chip keys (the 5 filterable criteria). */
export const FILTER_KEYS = ['sensitivity', 'newAutoGrade', 'cvgType', 'cvgValue', 'cvgFreshness'] as const;
export type FilterKey = typeof FILTER_KEYS[number];
