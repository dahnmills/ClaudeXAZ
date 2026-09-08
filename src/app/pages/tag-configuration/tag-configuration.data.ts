import {
  Country, CountryCode, TagRule, FreshnessConfig, StatusReasonCode,
  EMPTY_CRITERIA, RuleSetDraft, RuleSetHistoryEntry,
} from './tag-configuration.models';

// Un pays, une devise, un référentiel de formes juridiques. Pas de région :
// « Northern Europe » n'a ni devise ni droit des sociétés à elle.
export const COUNTRIES: Country[] = [
  { code: 'FR', name: 'France',   currency: 'EUR', flag: 'fr' },
  { code: 'DE', name: 'Germany',  currency: 'EUR', flag: 'de' },
  { code: 'NO', name: 'Norway',   currency: 'NOK', flag: 'no' },
  { code: 'PT', name: 'Portugal', currency: 'EUR', flag: 'pt', readOnly: true },
];

export function countryByCode(code: CountryCode): Country {
  return COUNTRIES.find(c => c.code === code)!;
}

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
  { value: 'FormerlyInsured', label: 'Formerly insured' },
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

// Les formes juridiques sont un référentiel national : une SARL n'existe pas en
// Norvège, une AS n'existe pas en France. C'est ce qui rend la copie d'un set
// d'un pays à l'autre risquée : et donc signalable.
const LEGAL_FORMS: Record<CountryCode, { value: string; label: string }[]> = {
  FR: [{ value: 'SARL', label: 'SARL' }, { value: 'SA', label: 'SA' }, { value: 'SAS', label: 'SAS' }, { value: 'SCI', label: 'SCI' }],
  DE: [{ value: 'GmbH', label: 'GmbH' }, { value: 'AG', label: 'AG' }, { value: 'KG', label: 'KG' }, { value: 'OHG', label: 'OHG' }],
  NO: [{ value: 'AS', label: 'AS' }, { value: 'ASA', label: 'ASA' }, { value: 'ANS', label: 'ANS' }, { value: 'DA', label: 'DA' }],
  PT: [{ value: 'Lda', label: 'Lda' }, { value: 'SA', label: 'SA' }, { value: 'Unipessoal', label: 'Unipessoal' }],
};

export function legalFormsForCountry(code: CountryCode): { value: string; label: string }[] {
  return LEGAL_FORMS[code].map(o => ({ ...o }));
}

export const STATUS_REASON_REFERENTIAL: StatusReasonCode[] = [
  { code: 'FAILL', label: 'Business bankruptcy' },
  { code: 'LIQJU', label: 'Liquidation' },
  { code: 'CESJU', label: 'Dissolved' },
  { code: 'SAUVG', label: 'Chapter 11' },
  { code: 'SURSI', label: 'Moratorium' },
  { code: 'LIQSI', label: 'Simplified liquidation' },
  { code: 'CLOFA', label: 'Closure of bankruptcy' },
  { code: 'CESEC', label: 'Ceased to trade' },
  { code: 'INTER', label: 'Disqualified' },
];

// --- mock generators ---

const FR_RULES: TagRule[] = [
  { id: 'fr-1', position: 1, decision: 'Accept',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08','09','10'], cvgValue: ['04','05','06'], cvgType: ['Automatic'], cvgFreshness: 'Fresh' } },
  { id: 'fr-2', position: 2, decision: 'Refuse',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S1'], cvgValue: ['04','05'], transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CreateTask',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
  { id: 'fr-4', position: 4, decision: 'Accept',
    criteria: { ...EMPTY_CRITERIA, exposure: { op: '<=', amount: 100000 }, nace: ['62.01'] } },
  { id: 'fr-5', position: 5, decision: 'CreateTask',
    criteria: { ...EMPTY_CRITERIA, companyRole: ['Prospect'] } },
];

// Norvège : ~70 règles pour éprouver le filtrage P4. Montants en NOK et formes
// juridiques norvégiennes : de quoi rendre la copie France ↔ Norvège parlante.
function noRules(): TagRule[] {
  const sens = ['SN','S0','S1','S2','S3'] as const;
  const types = ['Automatic','Manual'] as const;
  const decisions = ['Accept','Refuse','CreateTask'] as const;
  const out: TagRule[] = [];
  let n = 1;
  for (const s of sens) {
    for (const t of types) {
      for (let i = 0; i < 7; i++) {
        out.push({
          id: `no-${n}`, position: n,
          decision: decisions[n % 3],
          criteria: {
            ...EMPTY_CRITERIA,
            sensitivity: [s],
            cvgType: [t],
            cvgValue: i % 2 === 0 ? ['04','05'] : null,
            cvgFreshness: i % 3 === 0 ? 'Fresh' : null,
            newAutoGrade: i % 4 === 0 ? ['08'] : null,
            exposure: i % 6 === 0 ? { op: '>', amount: 2500000 } : null,
            legalForm: i % 5 === 0 ? ['AS'] : null,
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
  NO: noRules(),
  PT: FR_RULES.slice(0, 3).map((r, i) => ({ ...r, id: `pt-${i+1}`, position: i+1 })),
};

export function rulesForCountry(code: CountryCode): TagRule[] {
  return RULES[code].map(r => ({ ...r, criteria: { ...r.criteria } }));
}

// --- publication history mocks (History tab) ---

const FR_RULES_V1: TagRule[] = [
  { id: 'fr-1', position: 1, decision: 'Accept',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08', '09', '10'], cvgValue: ['04', '05'], cvgType: ['Automatic'], cvgFreshness: 'Fresh' } },
  { id: 'fr-2', position: 2, decision: 'Refuse',
    criteria: { ...EMPTY_CRITERIA, cvgValue: ['04', '05'], transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CreateTask',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
  { id: 'fr-4', position: 4, decision: 'Accept',
    criteria: { ...EMPTY_CRITERIA, exposure: { op: '<=', amount: 100000 }, nace: ['62.01'] } },
  { id: 'fr-5', position: 5, decision: 'CreateTask',
    criteria: { ...EMPTY_CRITERIA, companyRole: ['Prospect'] } },
];

const HISTORY: Record<CountryCode, RuleSetHistoryEntry[]> = {
  FR: [
    { id: '123456791', createdLabel: '11 Nov. 2025', lastUpdateLabel: '14 Nov. 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '12-10-25 → —', status: 'Active', rules: FR_RULES },
    { id: '123456790', createdLabel: '19 Aug. 2025', lastUpdateLabel: '11 Oct. 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '19-08-25 → 12-10-25', status: 'Archived', rules: FR_RULES.slice(0, 3) },
    { id: '123456789', createdLabel: '2 Jul. 2025',  lastUpdateLabel: '18 Aug. 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '02-07-25 → 19-08-25', status: 'Archived', rules: FR_RULES_V1 },
  ],
  DE: [],
  NO: [
    { id: '980021099', createdLabel: '11 May 2025', lastUpdateLabel: '11 May 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '11-05-25 → —', status: 'Active', rules: noRules() },
  ],
  PT: [
    { id: '980531099', createdLabel: '30 Mar. 2025', lastUpdateLabel: '30 Mar. 2025', lastUpdateBy: 'Alain Verse', activePeriodLabel: '30-03-25 → —', status: 'Active', rules: FR_RULES_V1.slice(0, 3) },
  ],
};

export function historyForCountry(code: CountryCode): RuleSetHistoryEntry[] {
  return HISTORY[code].map(h => ({ ...h, rules: h.rules.map(r => ({ ...r, criteria: { ...r.criteria } })) }));
}

// --- brouillons (un par pays au maximum) ---

// Brouillon en dur sur la France : l'historique montre les quatre états dès
// l'ouverture, et la toolbar propose Resume / Delete sans avoir à éditer.
const FR_DRAFT_RULES: TagRule[] = [
  // règle 1 : seuil de fraîcheur retiré
  { id: 'fr-1', position: 1, decision: 'Accept',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08','09','10'], cvgValue: ['04','05','06'], cvgType: ['Automatic'] } },
  { id: 'fr-2', position: 2, decision: 'Refuse',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S1'], cvgValue: ['04','05'], transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CreateTask',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
  { id: 'fr-4', position: 4, decision: 'Accept',
    criteria: { ...EMPTY_CRITERIA, exposure: { op: '<=', amount: 100000 }, nace: ['62.01'] } },
  { id: 'fr-5', position: 5, decision: 'CreateTask',
    criteria: { ...EMPTY_CRITERIA, companyRole: ['Prospect'] } },
  // règle ajoutée, pas encore validée
  { id: 'fr-6', position: 6, decision: 'Refuse',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S3'], exposure: { op: '>', amount: 500000 }, legalForm: ['SCI'] } },
];

const SEED_DRAFTS: RuleSetDraft[] = [
  { country: 'FR', rules: FR_DRAFT_RULES, lastEditedLabel: '2 days ago', lastEditedBy: 'John Doe' },
];

export function seedDrafts(): Record<string, RuleSetDraft> {
  const out: Record<string, RuleSetDraft> = {};
  for (const d of SEED_DRAFTS) {
    out[d.country] = { ...d, rules: d.rules.map(r => ({ ...r, criteria: { ...r.criteria } })) };
  }
  return out;
}

const FRESHNESS: Record<CountryCode, FreshnessConfig> = {
  FR: { lastCheckedAutograde: { freshUpToMonths: 12, oldAfterMonths: 24 }, validManualGrade: { freshUpToMonths: 9,  oldAfterMonths: 18 } },
  DE: { lastCheckedAutograde: { freshUpToMonths: 12, oldAfterMonths: 24 }, validManualGrade: { freshUpToMonths: 9,  oldAfterMonths: 18 } },
  NO: { lastCheckedAutograde: { freshUpToMonths: 6,  oldAfterMonths: 18 }, validManualGrade: { freshUpToMonths: 6,  oldAfterMonths: 12 } },
  PT: { lastCheckedAutograde: { freshUpToMonths: 12, oldAfterMonths: 24 }, validManualGrade: { freshUpToMonths: 9,  oldAfterMonths: 18 } },
};

export function freshnessForCountry(code: CountryCode): FreshnessConfig {
  const f = FRESHNESS[code];
  return { lastCheckedAutograde: { ...f.lastCheckedAutograde }, validManualGrade: { ...f.validManualGrade } };
}

const CODES: Record<CountryCode, StatusReasonCode[]> = {
  FR: [ STATUS_REASON_REFERENTIAL[0], STATUS_REASON_REFERENTIAL[1], STATUS_REASON_REFERENTIAL[2], STATUS_REASON_REFERENTIAL[3], STATUS_REASON_REFERENTIAL[4] ],
  DE: [ STATUS_REASON_REFERENTIAL[0], STATUS_REASON_REFERENTIAL[1] ],
  NO: [],
  PT: [ STATUS_REASON_REFERENTIAL[0] ],
};

export function codesForCountry(code: CountryCode): StatusReasonCode[] {
  return CODES[code].map(c => ({ ...c }));
}
