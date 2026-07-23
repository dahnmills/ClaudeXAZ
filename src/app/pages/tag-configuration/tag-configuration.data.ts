import {
  Country, CountryCode, TagRule, FreshnessConfig, StatusReasonCode,
  EMPTY_CRITERIA, RuleSetVersion, RuleSetHistoryEntry,
} from './tag-configuration.models';

export const COUNTRIES: Country[] = [
  { code: 'FR', name: 'France',          currency: 'EUR' },
  { code: 'DE', name: 'Germany',         currency: 'EUR' },
  { code: 'NE', name: 'Northern Europe', currency: 'EUR' },
  { code: 'PT', name: 'Portugal',        currency: 'EUR', readOnly: true },
];

export const SENSITIVITY_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'S0', label: 'S0' }, { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' }, { value: 'S2+', label: 'S2+' },
  { value: 'S3', label: 'S3' }, { value: 'SN', label: 'SN' },
  { value: 'None', label: 'None' },
];

export const GRADE_OPTIONS = [
  { value: 'Any', label: 'Any' },
  ...['01','02','03','04','05','06','07','08','09','10'].map(g => ({ value: g, label: g })),
  { value: 'NA', label: 'NA' }, { value: 'noGrade', label: '(no grade)' },
];

export const GRADE_TYPE_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Automatic', label: 'Automatic' }, { value: 'Manual', label: 'Manual' },
];

export const FRESHNESS_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Fresh', label: 'Fresh' }, { value: 'Outdated', label: 'Outdated' }, { value: 'Old', label: 'Old' },
];

export const COMPARISON_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Upgrade', label: '↑ Upgrade' }, { value: 'Same', label: '= Same' }, { value: 'Downgrade', label: '↓ Downgrade' },
];

export const COMPANY_ROLE_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Insured', label: 'Insured' }, { value: 'Prospect', label: 'Prospect' },
  { value: 'FormerlyInsured', label: 'Formerly insured' }, { value: 'noRole', label: '(no role)' },
];

export const EXPOSURE_OP_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '>', label: '> (greater than)' }, { value: '<=', label: '≤ (less or equal)' },
];

export const TRANSFERRED_OPTIONS = [
  { value: 'Any', label: 'Any' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' },
];

export const NACE_OPTIONS = [
  { value: '62.01', label: '62.01: Computer programming' },
  { value: '41.20', label: '41.20: Construction of buildings' },
  { value: '46.90', label: '46.90: Non-specialised wholesale' },
  { value: '68.20', label: '68.20: Renting of real estate' },
  { value: '10.71', label: '10.71: Bread & fresh pastry' },
];

export const LEGAL_FORM_OPTIONS = [
  { value: 'GmbH', label: 'GmbH' }, { value: 'AG', label: 'AG' },
  { value: 'SARL', label: 'SARL' }, { value: 'SA', label: 'SA' }, { value: 'Lda', label: 'Lda' },
];

export const STATUS_REASON_REFERENTIAL: StatusReasonCode[] = [
  { code: 'FAILL', label: 'Business bankruptcy' },
  { code: 'LIQJU', label: 'Liquidation' },
  { code: 'CESJU', label: 'Dissolved' },
  { code: 'SAUVG', label: 'Chapter 11' },
  { code: 'SURSI', label: 'Moratorium' },
  { code: 'LIQSI', label: 'Liquidation simplifiée' },
  { code: 'CLOFA', label: 'Closure of bankruptcy' },
  { code: 'CESEC', label: 'Ceased to trade' },
  { code: 'INTER', label: 'Disqualified' },
];

// --- mock generators ---

const FR_RULES: TagRule[] = [
  { id: 'fr-1', position: 1, decision: 'Accept', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08','09','10'], cvgValue: ['04','05','06'], cvgType: ['Automatic'], cvgFreshness: 'Fresh' } },
  { id: 'fr-2', position: 2, decision: 'Refuse', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S1'], cvgValue: ['04','05'], transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CreateTask', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
  { id: 'fr-4', position: 4, decision: 'Accept', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, exposure: { op: '<=', amount: 100000 }, nace: ['62.01'] } },
  { id: 'fr-5', position: 5, decision: 'CreateTask', status: 'NC',
    criteria: { ...EMPTY_CRITERIA, companyRole: ['Prospect'] } },
];

// Northern Europe: generate ~67 rules to exercise P4 filtering.
function neRules(): TagRule[] {
  const sens = ['SN','S0','S1','S2','S3'] as const;
  const types = ['Automatic','Manual'] as const;
  const decisions = ['Accept','Refuse','CreateTask'] as const;
  const out: TagRule[] = [];
  let n = 1;
  for (const s of sens) {
    for (const t of types) {
      for (let i = 0; i < 7; i++) {
        out.push({
          id: `ne-${n}`, position: n, status: 'Valid',
          decision: decisions[n % 3],
          criteria: {
            ...EMPTY_CRITERIA,
            sensitivity: [s],
            cvgType: [t],
            cvgValue: i % 2 === 0 ? ['04','05'] : null,
            cvgFreshness: i % 3 === 0 ? 'Fresh' : null,
            newAutoGrade: i % 4 === 0 ? ['08'] : null,
          },
        });
        n++;
      }
    }
  }
  return out;   // 5 * 2 * 7 = 70 rules
}

const RULES: Record<CountryCode, TagRule[]> = {
  FR: FR_RULES,
  DE: [],                 // empty-state demo
  NE: neRules(),
  PT: FR_RULES.slice(0, 3).map((r, i) => ({ ...r, id: `pt-${i+1}`, position: i+1 })),
};

export function rulesForCountry(code: CountryCode): TagRule[] {
  return RULES[code].map(r => ({ ...r, criteria: { ...r.criteria } }));
}

// --- version history mocks (Compare rule versions) ---

const FR_RULES_V1: TagRule[] = [
  { id: 'fr-1', position: 1, decision: 'Accept', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08', '09', '10'], cvgValue: ['04', '05'], cvgType: ['Automatic'], cvgFreshness: 'Fresh' } },
  { id: 'fr-2', position: 2, decision: 'Refuse', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, cvgValue: ['04', '05'], transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CreateTask', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
  { id: 'fr-4', position: 4, decision: 'Accept', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, exposure: { op: '<=', amount: 100000 }, nace: ['62.01'] } },
  { id: 'fr-5', position: 5, decision: 'CreateTask', status: 'NC',
    criteria: { ...EMPTY_CRITERIA, companyRole: ['Prospect'] } },
];

const FR_RULES_V2: TagRule[] = [
  { id: 'fr-1', position: 1, decision: 'Accept', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08', '09', '10'], cvgValue: ['04', '05', '06'], cvgType: ['Automatic'], cvgFreshness: 'Fresh' } },
  { id: 'fr-2', position: 2, decision: 'Refuse', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S1'], cvgValue: ['04', '05'], transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CreateTask', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
];

const VERSIONS: Record<CountryCode, RuleSetVersion[]> = {
  FR: [
    { id: '9811580', label: '9811580 - 02-07-25', date: '2025-07-02', rules: FR_RULES_V1,
      accepted: { pct: 30.12, count: 30 }, refused: { pct: 34.06, count: 34 }, jtd: { pct: 35.82, count: 36 } },
    { id: '9811586', label: '9811586 - 19-08-25', date: '2025-08-19', rules: FR_RULES_V2,
      accepted: { pct: 40.24, count: 40 }, refused: { pct: 37.04, count: 37 }, jtd: { pct: 22.72, count: 23 } },
  ],
  DE: [],
  NE: [
    { id: '9800210', label: '9800210 - 11-05-25', date: '2025-05-11', rules: neRules().slice(0, 20),
      accepted: { pct: 28.50, count: 20 }, refused: { pct: 33.10, count: 23 }, jtd: { pct: 38.40, count: 27 } },
  ],
  PT: [
    { id: '9805310', label: '9805310 - 30-03-25', date: '2025-03-30', rules: FR_RULES_V1.slice(0, 3),
      accepted: { pct: 33.33, count: 3 }, refused: { pct: 33.33, count: 3 }, jtd: { pct: 33.34, count: 3 } },
  ],
};

export function versionsForCountry(code: CountryCode): RuleSetVersion[] {
  return VERSIONS[code].map(v => ({
    ...v,
    rules: v.rules.map(r => ({ ...r, criteria: { ...r.criteria } })),
    accepted: { ...v.accepted }, refused: { ...v.refused }, jtd: { ...v.jtd },
  }));
}

// --- publication history mocks (History tab) ---

const HISTORY: Record<CountryCode, RuleSetHistoryEntry[]> = {
  FR: [
    { id: '123456791', createdLabel: '11 nov. 2025', lastUpdateLabel: '14 nov. 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '12-10-25 → —', status: 'Active', rules: FR_RULES_V2 },
    { id: '123456790', createdLabel: '19 aoû. 2025', lastUpdateLabel: '11 oct. 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '19-08-25 → 12-10-25', status: 'Archived', rules: FR_RULES_V2 },
    { id: '123456789', createdLabel: '2 jul. 2025',  lastUpdateLabel: '18 aoû. 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '02-07-25 → 19-08-25', status: 'Archived', rules: FR_RULES_V1 },
  ],
  DE: [],
  NE: [
    { id: '980021099', createdLabel: '11 mai 2025', lastUpdateLabel: '11 mai 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '11-05-25 → —', status: 'Active', rules: neRules() },
  ],
  PT: [
    { id: '980531099', createdLabel: '30 mar. 2025', lastUpdateLabel: '30 mar. 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '30-03-25 → —', status: 'Active', rules: FR_RULES_V1.slice(0, 3) },
  ],
};

export function historyForCountry(code: CountryCode): RuleSetHistoryEntry[] {
  return HISTORY[code].map(h => ({ ...h, rules: h.rules.map(r => ({ ...r, criteria: { ...r.criteria } })) }));
}

const FRESHNESS: Record<CountryCode, FreshnessConfig> = {
  FR: { lastCheckedAutograde: { freshUpToMonths: 12, oldAfterMonths: 24 }, validManualGrade: { freshUpToMonths: 9,  oldAfterMonths: 18 } },
  DE: { lastCheckedAutograde: { freshUpToMonths: 12, oldAfterMonths: 24 }, validManualGrade: { freshUpToMonths: 9,  oldAfterMonths: 18 } },
  NE: { lastCheckedAutograde: { freshUpToMonths: 6,  oldAfterMonths: 18 }, validManualGrade: { freshUpToMonths: 6,  oldAfterMonths: 12 } },
  PT: { lastCheckedAutograde: { freshUpToMonths: 12, oldAfterMonths: 24 }, validManualGrade: { freshUpToMonths: 9,  oldAfterMonths: 18 } },
};

export function freshnessForCountry(code: CountryCode): FreshnessConfig {
  const f = FRESHNESS[code];
  return { lastCheckedAutograde: { ...f.lastCheckedAutograde }, validManualGrade: { ...f.validManualGrade } };
}

const CODES: Record<CountryCode, StatusReasonCode[]> = {
  FR: [ STATUS_REASON_REFERENTIAL[0], STATUS_REASON_REFERENTIAL[1], STATUS_REASON_REFERENTIAL[2], STATUS_REASON_REFERENTIAL[3], STATUS_REASON_REFERENTIAL[4] ],
  DE: [ STATUS_REASON_REFERENTIAL[0], STATUS_REASON_REFERENTIAL[1] ],
  NE: [],
  PT: [ STATUS_REASON_REFERENTIAL[0] ],
};

export function codesForCountry(code: CountryCode): StatusReasonCode[] {
  return CODES[code].map(c => ({ ...c }));
}
