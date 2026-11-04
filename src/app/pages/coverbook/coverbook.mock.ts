import type { PolicyColorValue } from '../../shared/ui/policy-color/policy-color.component';
import type { GradeValue } from '../../shared/ui/grade/grade.component';
import type {
  AnswerType,
  CoverAmount,
  CoverStatus,
  CoverType,
  CoverbookBuyer,
  CoverbookPolicy,
  CreditLimitCover,
  DecisionCode,
  Grade,
  GradeBasedCover,
  GradeCoverType,
} from './coverbook.models';

/**
 * Données fictives du Coverbook. Les noms, identifiants et montants sont
 * inventés : seules les colonnes, les énumérations et les ordres de grandeur
 * reprennent les exports réels (répartition des couleurs, des codes de
 * décision, des devises, des horizons de risque…).
 *
 * Génération déterministe (graine fixe) : la même URL rend toujours le même tableau.
 */

// ── Générateur pseudo-aléatoire à graine (mulberry32) ─────────────────────
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedOf(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Tirage pondéré : `[[valeur, poids], …]`. */
function weighted<T>(r: () => number, table: [T, number][]): T {
  const total = table.reduce((s, [, w]) => s + w, 0);
  let x = r() * total;
  for (const [v, w] of table) {
    x -= w;
    if (x <= 0) return v;
  }
  return table[table.length - 1][0];
}

function pick<T>(r: () => number, list: readonly T[]): T {
  return list[Math.floor(r() * list.length)];
}

function digits(r: () => number, n: number): string {
  let s = String(1 + Math.floor(r() * 9));
  while (s.length < n) s += Math.floor(r() * 10);
  return s;
}

// ── Référentiels fictifs ──────────────────────────────────────────────────
const COMPANY_NAMES = [
  'Brasserie Halden', 'Norvik Logistics', 'Cortes Agroalimentaria', 'Lumen Textiles',
  'Atelier Brunet', 'Kestrel Components', 'Valdora Foods', 'Meridian Packaging',
  'Orsa Chemicals', 'Baltic Steelworks', 'Sierra Cafe Export', 'Tamaris Retail',
  'Quercus Paper', 'Helix Pharma', 'Andes Mineracao', 'Caldera Energy',
  'Pomona Fruits', 'Vireo Electronics', 'Fjord Seafood', 'Granit Bau',
  'Solenne Cosmetics', 'Iberia Motor Parts', 'Riva Marine', 'Talisman Home',
  'Opal Software', 'Nimbus Telecom', 'Castellan Wines', 'Ferro Machinery',
  'Lys Distribution', 'Zephyr Transport', 'Corvel Plastics', 'Amarante Textil',
] as const;

const COUNTRY_SUFFIX = ['(FR)', '(BE)', '(DE)', '(ES)', '(IT)', '(BR)', '(CO)', '(US)', '(MA)', '(NL)'] as const;

/** Libellés d'entités Allianz Trade (mêmes familles que les codes BU des exports). */
const BUS = [
  'AT France', 'AT Belgium', 'AT Germany', 'AT Italy', 'AT Americas', 'AT Brazil',
  'AT Middle East', 'AT Nordics', 'AT Asia', 'Solunion Colombia', 'Solunion Chile',
] as const;

/** Produits : famille Corporate Advantage (LOB Core / STCI) ou Short Term TCI (sans LOB). */
const PRODUCTS: { name: string; family: 'CA' | 'TCI' }[] = [
  { name: 'EH Corporate Advantage',          family: 'CA'  },
  { name: 'Corporate Advantage',             family: 'CA'  },
  { name: 'EH Corporate Advantage AE',       family: 'CA'  },
  { name: 'Allianz Trade Credit Insurance',  family: 'TCI' },
  { name: 'World-Program',                   family: 'TCI' },
  { name: 'Solunion Credit Insurance',       family: 'TCI' },
  { name: 'Multimarket Global Turnover',     family: 'TCI' },
  { name: 'BR Corp Advantage Dom',           family: 'TCI' },
];

const UNDERWRITERS = ['jmercier', 'akowalski', 'lmorel', 'tsilva', 'rbianchi', 'hdumont'] as const;

/** Taux de conversion fictifs vers la devise de référence (EUR). */
const TO_EUR: Record<string, number> = {
  EUR: 1, USD: 0.92, BRL: 0.17, VND: 0.000036, GBP: 1.17, ZAR: 0.05, INR: 0.011,
};

const COLOR_TABLE: [PolicyColorValue, number][] = [
  ['orange', 15], ['red', 12], ['yellow', 7], ['none', 4], ['green', 2], ['unknown', 3],
];

const DECISION_TABLE: [DecisionCode, number][] = [
  ['PolicyTransfer', 30], ['Agreement', 14], ['Refusal', 9], ['RestrictiveAnswer', 9],
  ['Maintain', 6], ['PartialWithdrawal', 6], ['RiskWithdrawal', 4], ['UnableToCover', 1],
  ['AlreadyAgreed', 1], ['AdministrativeWithdrawal', 1], ['PartialCancellation', 1],
  ['LimitUpdate', 1],
];

/** Statut de couverture induit par le code de décision (déterministe dans les exports). */
function statusFor(r: () => number, code: DecisionCode): CoverStatus {
  switch (code) {
    case 'Agreement':
    case 'AlreadyAgreed':
    case 'LimitUpdate':
      return 'Cover';
    case 'Refusal':
    case 'RiskWithdrawal':
    case 'UnableToCover':
    case 'AdministrativeWithdrawal':
      return 'NoCover';
    case 'RestrictiveAnswer':
    case 'PartialWithdrawal':
    case 'PartialCancellation':
      return 'Partial';
    case 'Maintain':
      return r() < 0.9 ? 'Partial' : 'Cover';
    default:
      return weighted(r, [['Partial', 46], ['Cover', 34], ['NoCover', 20]]);
  }
}

/** Type de réponse : les événements système n'ont pas d'underwriter. */
function answerTypeFor(r: () => number, code: DecisionCode): AnswerType {
  if (code === 'RestrictiveAnswer') return 'Manual';
  if (['PolicyTransfer', 'PartialWithdrawal', 'RiskWithdrawal', 'AdministrativeWithdrawal',
       'LimitUpdate', 'BuyerTransfer', 'PartialCancellation'].includes(code)) {
    return 'NotApplicable';
  }
  return r() < 0.75 ? 'Manual' : 'Automatic';
}

function underwriterFor(r: () => number, type: AnswerType): string {
  if (type === 'Automatic') return 'Automatic Decision';
  if (type === 'Manual')    return pick(r, UNDERWRITERS);
  return 'System';
}

/** Montant de référence log-uniforme entre 50 k et 7 M EUR, arrondi à 5 000. */
function referenceAmount(r: () => number): number {
  const v = Math.exp(Math.log(5e4) + r() * (Math.log(7e6) - Math.log(5e4)));
  return Math.max(5000, Math.round(v / 5000) * 5000);
}

function amount(reference: number, currency: string): CoverAmount {
  const rate = TO_EUR[currency] ?? 1;
  const original = currency === 'EUR' ? reference : Math.round(reference / rate / 1000) * 1000;
  return { original, currency, reference };
}

/** Date ISO (jour) entre deux bornes. */
function isoBetween(r: () => number, from: string, to: string): string {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return new Date(a + r() * (b - a)).toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function grade(r: () => number): Grade {
  const g = weighted<GradeValue | null>(r, [
    [5, 1650], [6, 1514], [7, 428], [4, 427], [8, 169], [9, 97], [3, 86], [null, 22], [2, 21], [1, 8],
  ]);
  if (g === null) return { type: 'na', grade: null };
  return { type: r() < 0.7 ? 'manual' : 'automatic', grade: g };
}

function companyName(r: () => number): string {
  return `${pick(r, COMPANY_NAMES)} ${pick(r, COUNTRY_SUFFIX)}`;
}

function policyId(r: () => number): string {
  return `P${digits(r, 9)}-0000${1 + Math.floor(r() * 3)}`;
}

// ── Entités ───────────────────────────────────────────────────────────────
const DEFAULT_BUYER: Omit<CoverbookBuyer, 'id'> = {
  name:     'Maison Verlaine Chocolatier (BE)',
  grade:    { type: 'manual', grade: 4 },
  highRisk: true,
  sru:      true,
  sanction: true,
};

export function buyerFor(id: string): CoverbookBuyer {
  return { id, ...DEFAULT_BUYER };
}

export function policyFor(id: string, hint?: { name: string; color: PolicyColorValue }): CoverbookPolicy {
  return {
    id,
    name:            hint?.name ?? 'VALDORA DISTRIBUTION SERVICES, SOCIEDAD LIMITADA/Global V.4',
    color:           hint?.color ?? 'yellow',
    insuredBu:       'AT',
    inforceBu:       'AT Italy',
    productName:     'Allianz Trade Credit',
    familyName:      'Insurance Corporate Advantage',
    segment:         'STCI',
    lob:             'Core',
    language:        'Italian',
    strategic:       false,
    customerSegment: 'D',
  };
}

/** Polices voisines du menu « Policies » de la topbox police. */
export interface PolicyRelative {
  id:     string;
  name:   string;
  badge?: string;
}

export function policyRelatives(policy: CoverbookPolicy): { parents: PolicyRelative[]; siblings: PolicyRelative[] } {
  const r = rng(seedOf(policy.id + ':family'));
  return {
    parents:  [{ id: policyId(r), name: 'Valdora Group Master Policy' }],
    siblings: [
      { id: policyId(r), name: 'Valdora Iberia Top-up',     badge: 'CAP' },
      { id: policyId(r), name: 'Valdora Export Program',    badge: 'J' },
      { id: policyId(r), name: 'Valdora Retail Extension',  badge: 'CAP+' },
    ],
  };
}

// ── Credit limits ─────────────────────────────────────────────────────────
function creditLimit(r: () => number, i: number, fixed: Partial<CreditLimitCover>): CreditLimitCover {
  const product  = pick(r, PRODUCTS);
  const decision = weighted(r, DECISION_TABLE);
  const status   = statusFor(r, decision);
  const type     = answerTypeFor(r, decision);
  const currency = weighted(r, [['EUR', 26], ['USD', 17], ['BRL', 2], ['VND', 2], ['GBP', 2]]);
  const hasRequest = r() < 0.56;
  const decisionDate = isoBetween(r, '2024-01-15', '2026-10-20');
  const reqRef   = referenceAmount(r);
  const ansRef   = status === 'NoCover' ? 0
                 : status === 'Partial' ? Math.round((reqRef * (0.2 + r() * 0.6)) / 5000) * 5000
                 : reqRef;
  const horizon  = weighted<number | null>(r, [[345, 8], [0, 3], [120, 3], [235, 1], [420, 1], [null, 1]]);
  const coverType = weighted<CoverType>(r, [['Primary', 41], ['PreCheck', 4], ['Cap', 3], ['CapPlus', 1]]);

  return {
    id:             `CL-${String(i + 1).padStart(3, '0')}`,
    policyId:       policyId(r),
    policyName:     companyName(r),
    productName:    product.name,
    policyColor:    weighted(r, COLOR_TABLE),
    contractBu:     pick(r, BUS),
    inforceBu:      pick(r, BUS),
    lob:            product.family === 'CA' ? 'Core' : null,
    segment:        product.family === 'CA' ? 'STCI' : null,
    buyerId:        digits(r, 7 + Math.floor(r() * 3)),
    buyerName:      companyName(r),
    buyerCountry:   pick(r, ['FR', 'BE', 'BR', 'CO', 'MA', 'PE', 'DE', 'ES']),
    buyerGrade:     grade(r),
    coverType,
    coverStatus:    status,
    requestDate:    hasRequest ? addDays(decisionDate, -Math.floor(r() * 20)) : null,
    decisionDate,
    expirationDate: r() < 0.4 ? addDays(decisionDate, 365) : null,
    request:        hasRequest ? amount(reqRef, currency) : null,
    answer:         amount(ansRef, currency),
    decisionCode:   decision,
    answerType:     type,
    underwriter:    underwriterFor(r, type),
    riskHorizon:    horizon,
    ...fixed,
  };
}

// ── Grade based covers ───────────────────────────────────────────────────
function gradeCover(r: () => number, i: number, fixed: Partial<GradeBasedCover>): GradeBasedCover {
  const product   = pick(r, PRODUCTS);
  const request   = isoBetween(r, '2025-01-10', '2026-09-30');
  const last      = addDays(request, 1 + Math.floor(r() * 40));
  const answered  = r() < 0.6;
  const currency  = weighted(r, [['EUR', 6], ['USD', 4], ['GBP', 1]]);
  const type      = weighted<GradeCoverType>(r, [['GradePolicyCoverBasic', 5], ['GradePolicyCoverDeluxe', 3], ['GradeCover', 2]]);
  const g         = grade(r);

  return {
    id:             `GC-${String(i + 1).padStart(3, '0')}`,
    policyId:       policyId(r),
    policyName:     companyName(r),
    productName:    product.name,
    verified:       r() < 0.5,
    policyColor:    weighted(r, COLOR_TABLE),
    contractBu:     pick(r, BUS),
    inforceBu:      pick(r, BUS),
    lob:            product.family === 'CA' ? 'Core' : null,
    segment:        product.family === 'CA' ? 'STCI' : null,
    buyerId:        digits(r, 7 + Math.floor(r() * 3)),
    buyerName:      companyName(r),
    requestDate:    request,
    lastUpdate:     last,
    answer:         answered ? amount(Math.round(referenceAmount(r) / 50000) * 50000 || 50000, currency) : null,
    decisionGrade:  g,
    expirationDate: r() < 0.7 ? addDays(last, 365) : null,
    coverCode:      r() < 0.6 ? 'Cover' : 'Check policy',
    type,
    ...fixed,
  };
}

const ROWS = 25;
const GRADE_ROWS = 14;

export function buyerCreditLimits(buyer: CoverbookBuyer): CreditLimitCover[] {
  const r = rng(seedOf('buyer-cl:' + buyer.id));
  return Array.from({ length: ROWS }, (_, i) =>
    creditLimit(r, i, { buyerId: buyer.id, buyerName: buyer.name, buyerGrade: buyer.grade, buyerCountry: 'BE' }));
}

export function buyerGradeCovers(buyer: CoverbookBuyer): GradeBasedCover[] {
  const r = rng(seedOf('buyer-gc:' + buyer.id));
  return Array.from({ length: GRADE_ROWS }, (_, i) =>
    gradeCover(r, i, { buyerId: buyer.id, buyerName: buyer.name }));
}

export function policyCreditLimits(policy: CoverbookPolicy): CreditLimitCover[] {
  const r = rng(seedOf('policy-cl:' + policy.id));
  return Array.from({ length: ROWS }, (_, i) =>
    creditLimit(r, i, {
      policyId:    policy.id,
      policyName:  policy.name,
      productName: 'EH Corporate Advantage',
      policyColor: policy.color,
      contractBu:  'AT France',
      inforceBu:   'AT France',
      lob:         'Core',
      segment:     'STCI',
    }));
}

export function policyGradeCovers(policy: CoverbookPolicy): GradeBasedCover[] {
  const r = rng(seedOf('policy-gc:' + policy.id));
  return Array.from({ length: GRADE_ROWS }, (_, i) =>
    gradeCover(r, i, {
      policyId:    policy.id,
      policyName:  policy.name,
      productName: 'EH Corporate Advantage',
      policyColor: policy.color,
      contractBu:  'AT France',
      inforceBu:   'AT France',
      lob:         'Core',
      segment:     'STCI',
    }));
}

export const REFERENCE_CURRENCY = 'EUR';
