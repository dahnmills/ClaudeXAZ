import type { FlagCode } from '../../shared/ui/flag/flag.component';

export type Sensitivity = 'S0' | 'S1' | 'S2' | 'S2+' | 'S3' | 'SN' | 'None';
export type Grade =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'
  | 'NA' | 'noGrade';
export type GradeType  = 'Automatic' | 'Manual';
export type Freshness  = 'Fresh' | 'Outdated' | 'Old';
export type Comparison = 'Upgrade' | 'Same' | 'Downgrade';
/** Codes de décision du moteur, tels qu'ils partent et reviennent par l'API.
 *  La valeur stockée est le code, jamais le libellé : c'est elle que transporte
 *  l'export JSON d'un jeu de règles. Les libellés vivent dans DECISION_BADGE. */
export type Decision   = 'ACCEPT' | 'REFUSE' | 'CREATE_TASK';
export type CountryCode = 'FR' | 'DE' | 'NO' | 'PT';

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
  criteria: RuleCriteria;
}

export type RuleSetStatus = 'Draft' | 'Active' | 'Archived';

/** One row of the History tab: a past rule-set publication. Dates are display-ready strings (mock, no live formatting). */
export interface RuleSetHistoryEntry {
  id: string;
  createdLabel: string;
  lastUpdateLabel: string;
  lastUpdateBy: string;
  activePeriodLabel: string;
  status: RuleSetStatus;
  rules: TagRule[];
}

export interface FreshnessConfig {
  lastCheckedAutograde: { freshUpToMonths: number; oldAfterMonths: number };
  validManualGrade:     { freshUpToMonths: number; oldAfterMonths: number };
}

export interface StatusReasonCode { code: string; label: string; }

export interface Country { code: CountryCode; name: string; currency: string; flag: FlagCode; readOnly?: boolean; }

/**
 * Brouillon d'un jeu de règles, un par pays. Persiste hors édition : on peut
 * quitter l'écran, changer de pays et revenir le reprendre. Rien n'est
 * enregistré tant que l'utilisateur ne l'enregistre pas explicitement.
 */
export interface RuleSetDraft {
  country: CountryCode;
  rules: TagRule[];
  lastEditedLabel: string;
  lastEditedBy: string;
  /** Renseigné quand le brouillon est né d'un set d'un autre pays, devise et
   *  formes juridiques peuvent alors ne plus correspondre. */
  copiedFrom?: { country: CountryCode; countryName: string; currency: string; setId: string };
}

export const EMPTY_CRITERIA: RuleCriteria = {
  sensitivity: null, exposure: null, newAutoGrade: null,
  cvgValue: null, cvgType: null, cvgFreshness: null, transferred: null, newVsCvg: null,
  lastAgValue: null, lastAgFreshness: null, newVsLastAg: null,
  nace: null, legalForm: null, companyRole: null,
};

export type BadgeStatus  = 'info' | 'warning' | 'success' | 'error' | 'neutral';
export type BadgeVariant = 'light' | 'strong';

// Vocabulaire GCAM : le verdict porte sur les deux grades en présence, le
// nouvel autograde (AUG) et le grade manuel valide (MAG). « Accept » seul ne
// disait pas ce qui était accepté, « Refuse » laissait croire à un rejet de la
// société. Les codes, eux, ne bougent pas.
export const DECISION_BADGE: Record<Decision, { label: string; status: BadgeStatus; variant: BadgeVariant }> = {
  ACCEPT:      { label: 'Accept AUG',  status: 'success', variant: 'strong' },
  REFUSE:      { label: 'Keep MAG',    status: 'error',   variant: 'strong' },
  CREATE_TASK: { label: 'Create task', status: 'warning', variant: 'strong' },
};

/**
 * Un filtre de la liste de règles : sa déclaration porte aussi la façon de lire
 * le critère correspondant. Ajouter un filtre est alors une entrée de plus dans
 * RULE_FILTERS, sans toucher au moteur de filtrage.
 *
 * `read` rend les valeurs du critère pour une règle. `null` ou tableau vide
 * valent « Any » : la règle ne contraint pas ce critère, elle ne sort donc que
 * si « Any » est coché.
 */
export interface RuleFilter {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  read: (c: RuleCriteria) => string[] | null;
}
