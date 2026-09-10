import {
  Country, CountryCode, TagRule, FreshnessConfig, StatusReasonCode,
  EMPTY_CRITERIA, RuleSetDraft, RuleSetHistoryEntry, RuleFilter,
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

const GRADES = ['01','02','03','04','05','06','07','08','09','10'];

// Deux listes de grades, et c'est voulu. « (no grade) » n'a de sens que pour le
// grade valide courant : une société peut n'en avoir aucun, et aucun autre
// critère n'attrape ce cas. Côté autogrades, l'absence est lue OLD par le
// moteur, donc déjà couverte par les règles sur la fraîcheur.
export const GRADE_OPTIONS = [
  { value: 'Any', label: 'Any' },
  ...GRADES.map(g => ({ value: g, label: g })),
  { value: 'NA', label: 'NA' }, { value: 'noGrade', label: '(no grade)' },
];

export const AUTOGRADE_OPTIONS = [
  { value: 'Any', label: 'Any' },
  ...GRADES.map(g => ({ value: g, label: g })),
  { value: 'NA', label: 'NA' },
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

// Extrait du référentiel des secteurs d'activité (NACE Rev. 2), trié par code.
// En production la liste vient de /tradeSectors et compte plusieurs centaines
// d'entrées : d'où la recherche sur ce champ, qui doit répondre au code comme
// au libellé.
export const NACE_OPTIONS = [
  { value: '01.11', label: '01.11: Growing of cereals' },
  { value: '01.41', label: '01.41: Raising of dairy cattle' },
  { value: '03.11', label: '03.11: Marine fishing' },
  { value: '05.10', label: '05.10: Mining of hard coal' },
  { value: '08.11', label: '08.11: Quarrying of stone' },
  { value: '10.11', label: '10.11: Processing of meat' },
  { value: '10.51', label: '10.51: Operation of dairies' },
  { value: '10.71', label: '10.71: Bread & fresh pastry' },
  { value: '11.02', label: '11.02: Manufacture of wine' },
  { value: '13.10', label: '13.10: Preparation of textile fibres' },
  { value: '14.13', label: '14.13: Manufacture of outerwear' },
  { value: '16.23', label: "16.23: Builders' carpentry" },
  { value: '17.21', label: '17.21: Corrugated paper & board' },
  { value: '18.12', label: '18.12: Other printing' },
  { value: '20.14', label: '20.14: Basic organic chemicals' },
  { value: '21.20', label: '21.20: Pharmaceutical preparations' },
  { value: '22.22', label: '22.22: Plastic packing goods' },
  { value: '23.61', label: '23.61: Concrete products' },
  { value: '24.10', label: '24.10: Basic iron & steel' },
  { value: '25.11', label: '25.11: Metal structures' },
  { value: '26.20', label: '26.20: Computers & peripherals' },
  { value: '27.12', label: '27.12: Electricity distribution apparatus' },
  { value: '28.25', label: '28.25: Non-domestic cooling equipment' },
  { value: '29.10', label: '29.10: Manufacture of motor vehicles' },
  { value: '30.11', label: '30.11: Building of ships' },
  { value: '31.01', label: '31.01: Office & shop furniture' },
  { value: '32.50', label: '32.50: Medical & dental instruments' },
  { value: '33.12', label: '33.12: Repair of machinery' },
  { value: '35.11', label: '35.11: Production of electricity' },
  { value: '36.00', label: '36.00: Water collection & supply' },
  { value: '38.11', label: '38.11: Collection of non-hazardous waste' },
  { value: '41.20', label: '41.20: Construction of buildings' },
  { value: '42.11', label: '42.11: Construction of roads' },
  { value: '43.22', label: '43.22: Plumbing & heating installation' },
  { value: '45.11', label: '45.11: Sale of cars' },
  { value: '46.90', label: '46.90: Non-specialised wholesale' },
  { value: '47.11', label: '47.11: Retail in non-specialised stores' },
  { value: '49.41', label: '49.41: Freight transport by road' },
  { value: '50.20', label: '50.20: Sea freight water transport' },
  { value: '52.10', label: '52.10: Warehousing & storage' },
  { value: '55.10', label: '55.10: Hotels & similar accommodation' },
  { value: '56.10', label: '56.10: Restaurants & mobile food service' },
  { value: '58.29', label: '58.29: Other software publishing' },
  { value: '61.10', label: '61.10: Wired telecommunications' },
  { value: '62.01', label: '62.01: Computer programming' },
  { value: '62.02', label: '62.02: Computer consultancy' },
  { value: '63.11', label: '63.11: Data processing & hosting' },
  { value: '64.19', label: '64.19: Other monetary intermediation' },
  { value: '68.20', label: '68.20: Renting of real estate' },
  { value: '69.20', label: '69.20: Accounting & tax consultancy' },
  { value: '70.22', label: '70.22: Business & management consultancy' },
  { value: '71.12', label: '71.12: Engineering activities' },
  { value: '73.11', label: '73.11: Advertising agencies' },
  { value: '77.11', label: '77.11: Renting of cars' },
  { value: '78.10', label: '78.10: Employment placement agencies' },
  { value: '81.21', label: '81.21: General cleaning of buildings' },
  { value: '82.20', label: '82.20: Activities of call centres' },
  { value: '85.59', label: '85.59: Other education' },
  { value: '86.10', label: '86.10: Hospital activities' },
  { value: '87.30', label: '87.30: Residential care for the elderly' },
  { value: '95.11', label: '95.11: Repair of computers' },
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

// Les filtres de la liste de règles, déclarés une seule fois : le libellé, les
// options et la façon de lire le critère correspondant. Ouvrir un sixième filtre
// est une entrée de plus ici, le moteur de filtrage ne bouge pas.
// Note : le filtre du nouvel autograde suit son critère et n'offre pas
// « (no grade) », alors que celui du grade valide courant le garde.
export const RULE_FILTERS: RuleFilter[] = [
  { id: 'sensitivity',  label: 'Sensitivity',     options: SENSITIVITY_OPTIONS, read: c => c.sensitivity },
  { id: 'newAutoGrade', label: 'New autograde',   options: AUTOGRADE_OPTIONS,   read: c => c.newAutoGrade },
  { id: 'cvgValue',     label: 'CVG - Value',     options: GRADE_OPTIONS,       read: c => c.cvgValue },
  { id: 'cvgType',      label: 'CVG - Type',      options: GRADE_TYPE_OPTIONS,  read: c => c.cvgType },
  { id: 'cvgFreshness', label: 'CVG - Freshness', options: FRESHNESS_OPTIONS,   read: c => c.cvgFreshness == null ? null : [c.cvgFreshness] },
];

// --- mock generators ---

// La fraîcheur du grade valide ne se dit que d'un grade manuel (règle 2 :
// « garder le MAG parce qu'il est encore frais »). Un jeu de règles où elle
// cohabiterait avec un type automatique serait incohérent avec la modale, qui
// grise le champ dans ce cas.
const FR_RULES: TagRule[] = [
  { id: 'fr-1', position: 1, decision: 'ACCEPT',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08','09','10'], cvgValue: ['04','05','06'], cvgType: ['Automatic'] } },
  { id: 'fr-2', position: 2, decision: 'REFUSE',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S1'], cvgValue: ['04','05'], cvgType: ['Manual'], cvgFreshness: 'Fresh', transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CREATE_TASK',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
  { id: 'fr-4', position: 4, decision: 'ACCEPT',
    criteria: { ...EMPTY_CRITERIA, exposure: { op: '<=', amount: 100000 }, nace: ['62.01'] } },
  // Forme juridique française : copiée en Norvège, elle y est inconnue et se
  // fait marquer sur la carte. C'est ce qui rend le sens France → Norvège aussi
  // parlant que l'autre.
  { id: 'fr-5', position: 5, decision: 'CREATE_TASK',
    criteria: { ...EMPTY_CRITERIA, companyRole: ['Prospect'], legalForm: ['SARL'] } },
];

// Norvège : ~70 règles pour éprouver le filtrage P4. Montants en NOK et formes
// juridiques norvégiennes : de quoi rendre la copie France ↔ Norvège parlante.
function noRules(): TagRule[] {
  const sens = ['SN','S0','S1','S2','S3'] as const;
  const types = ['Automatic','Manual'] as const;
  const decisions = ['ACCEPT','REFUSE','CREATE_TASK'] as const;
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
            cvgFreshness: t === 'Manual' && i % 3 === 0 ? 'Fresh' : null,
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
  { id: 'fr-1', position: 1, decision: 'ACCEPT',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08', '09', '10'], cvgValue: ['04', '05'], cvgType: ['Automatic'] } },
  { id: 'fr-2', position: 2, decision: 'REFUSE',
    criteria: { ...EMPTY_CRITERIA, cvgValue: ['04', '05'], cvgType: ['Manual'], cvgFreshness: 'Fresh', transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CREATE_TASK',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
  { id: 'fr-4', position: 4, decision: 'ACCEPT',
    criteria: { ...EMPTY_CRITERIA, exposure: { op: '<=', amount: 100000 }, nace: ['62.01'] } },
  { id: 'fr-5', position: 5, decision: 'CREATE_TASK',
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
// l'ouverture, et la page d'accueil montre le cas « un brouillon est déjà en
// cours » (Edit rules et Create new set grisés, reprise ou suppression depuis
// l'onglet History).
const FR_DRAFT_RULES: TagRule[] = [
  { id: 'fr-1', position: 1, decision: 'ACCEPT',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08','09','10'], cvgValue: ['04','05','06'], cvgType: ['Automatic'] } },
  // règle 2 : type et seuil de fraîcheur du grade valide retirés
  { id: 'fr-2', position: 2, decision: 'REFUSE',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S1'], cvgValue: ['04','05'], transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CREATE_TASK',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
  { id: 'fr-4', position: 4, decision: 'ACCEPT',
    criteria: { ...EMPTY_CRITERIA, exposure: { op: '<=', amount: 100000 }, nace: ['62.01'] } },
  { id: 'fr-5', position: 5, decision: 'CREATE_TASK',
    criteria: { ...EMPTY_CRITERIA, companyRole: ['Prospect'] } },
  // règle ajoutée, pas encore validée
  { id: 'fr-6', position: 6, decision: 'REFUSE',
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
