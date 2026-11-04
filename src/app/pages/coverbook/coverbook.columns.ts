import type { PolicyColorValue } from '../../shared/ui/policy-color/policy-color.component';
import type {
  CoverAmount,
  CoverbookSide,
  CreditLimitCover,
  Grade,
  GradeBasedCover,
} from './coverbook.models';

export type CoverRow = CreditLimitCover | GradeBasedCover;

/** Rendu d'une cellule. Le gabarit de la page a un cas par type. */
export type CellKind =
  | 'policy-id'      // icône police + identifiant
  | 'text'           // une ligne, tronquée avec la valeur complète au survol
  | 'stacked'        // deux lignes (IBUs contrat / inforce, LOB / segment)
  | 'color-name'     // pastille de couleur + nom (Credit Limits)
  | 'color'          // pastille seule (Grade based covers)
  | 'policy-name'    // nom en gras (+ coche vérifiée), produit dessous
  | 'amount'         // montant dans la devise affichée
  | 'grade'          // pastille de grade
  | 'date'
  | 'cover-code';    // « Cover » (badge) ou « Check policy » (lien)

export interface CoverColumn {
  key:        string;
  title:      string;
  /** Titre sur deux lignes (colonne étroite). */
  multiline?: boolean;
  /** Valeur texte sur deux lignes au plus (Figma : « Policy / StatusChange », « Automatic / Decision »). */
  wrap?:      boolean;
  sortable:   boolean;
  /** Masquable depuis « Manage columns ». La première colonne ne l'est pas. */
  hideable:   boolean;
  kind:       CellKind;
  text?:      (row: CoverRow) => string;
  lines?:     (row: CoverRow) => [string, string];
  amount?:    (row: CoverRow) => CoverAmount | null;
  grade?:     (row: CoverRow) => Grade;
  color?:     (row: CoverRow) => PolicyColorValue;
  date?:      (row: CoverRow) => string | null;
  /** Valeur de tri ; à défaut, `text`. Les montants trient sur la devise de référence. */
  sortValue?: (row: CoverRow) => string | number | null;
}

const cl = (row: CoverRow) => row as CreditLimitCover;
const gc = (row: CoverRow) => row as GradeBasedCover;

/** « PolicyTransfer » → « Policy transfer » : le code reste lisible dans une cellule. */
export function humanizeCode(code: string): string {
  const words = code.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function lobSegment(row: CoverRow): [string, string] {
  return [row.lob ?? '-', row.segment ?? '-'];
}

function gradeSort(g: Grade): number {
  return g.grade ?? 99;
}

// ── Credit Limits (Figma 6032:6969 / 6359:3002) ───────────────────────────

const BUYER_CREDIT_LIMITS: CoverColumn[] = [
  { key: 'policyId', title: 'Policy Type & ID', sortable: true, hideable: false, kind: 'policy-id',
    text: (r) => r.policyId },
  { key: 'inforceBu', title: 'Inforce BUs', multiline: true, wrap: true, sortable: true, hideable: true, kind: 'text',
    text: (r) => r.inforceBu },
  { key: 'lobSegment', title: 'LOB / Segment', multiline: true, sortable: true, hideable: true, kind: 'text',
    text: (r) => (r.lob || r.segment ? `${r.lob ?? '-'} / ${r.segment ?? '-'}` : '-') },
  { key: 'colorName', title: 'Policy color & name', multiline: true, sortable: true, hideable: true, kind: 'color-name',
    color: (r) => r.policyColor, text: (r) => cl(r).coverType },
  { key: 'request', title: 'Request amount', multiline: true, sortable: true, hideable: true, kind: 'amount',
    amount: (r) => cl(r).request, sortValue: (r) => cl(r).request?.reference ?? null },
  { key: 'answer', title: 'Answer amount', multiline: true, sortable: true, hideable: true, kind: 'amount',
    amount: (r) => cl(r).answer, sortValue: (r) => cl(r).answer.reference },
  { key: 'decisionCode', title: 'Decision code', multiline: true, wrap: true, sortable: true, hideable: true, kind: 'text',
    text: (r) => humanizeCode(cl(r).decisionCode) },
  { key: 'underwriter', title: 'Underwriter', wrap: true, sortable: true, hideable: true, kind: 'text',
    text: (r) => cl(r).underwriter },
];

const POLICY_CREDIT_LIMITS: CoverColumn[] = [
  { key: 'buyerId', title: 'Cie ID', sortable: true, hideable: false, kind: 'text',
    text: (r) => r.buyerId, sortValue: (r) => Number(r.buyerId) },
  { key: 'buyerName', title: 'Buyer Name', wrap: true, sortable: true, hideable: true, kind: 'text',
    text: (r) => r.buyerName },
  { key: 'grade', title: 'Grade', sortable: true, hideable: true, kind: 'grade',
    grade: (r) => cl(r).buyerGrade, sortValue: (r) => gradeSort(cl(r).buyerGrade) },
  { key: 'request', title: 'Request amount', multiline: true, sortable: true, hideable: true, kind: 'amount',
    amount: (r) => cl(r).request, sortValue: (r) => cl(r).request?.reference ?? null },
  { key: 'answer', title: 'Answer amount', multiline: true, sortable: true, hideable: true, kind: 'amount',
    amount: (r) => cl(r).answer, sortValue: (r) => cl(r).answer.reference },
  { key: 'decisionCode', title: 'Decision code', multiline: true, wrap: true, sortable: true, hideable: true, kind: 'text',
    text: (r) => humanizeCode(cl(r).decisionCode) },
  { key: 'underwriter', title: 'Underwriter', wrap: true, sortable: true, hideable: true, kind: 'text',
    text: (r) => cl(r).underwriter },
];

// ── Grade based covers (écran actuel, pas de maquette Figma dédiée) ───────

const GRADE_TAIL: CoverColumn[] = [
  { key: 'requestDate', title: 'Request date', multiline: true, sortable: true, hideable: true, kind: 'date',
    date: (r) => gc(r).requestDate, sortValue: (r) => gc(r).requestDate },
  { key: 'lastUpdate', title: 'Last update', multiline: true, sortable: true, hideable: true, kind: 'date',
    date: (r) => gc(r).lastUpdate, sortValue: (r) => gc(r).lastUpdate },
  { key: 'answer', title: 'Answer amount', multiline: true, sortable: true, hideable: true, kind: 'amount',
    amount: (r) => gc(r).answer, sortValue: (r) => gc(r).answer?.reference ?? null },
  { key: 'decisionGrade', title: 'Decision grade', multiline: true, sortable: true, hideable: true, kind: 'grade',
    grade: (r) => gc(r).decisionGrade, sortValue: (r) => gradeSort(gc(r).decisionGrade) },
  { key: 'expirationDate', title: 'Expiration date', multiline: true, sortable: true, hideable: true, kind: 'date',
    date: (r) => gc(r).expirationDate, sortValue: (r) => gc(r).expirationDate },
  { key: 'coverCode', title: 'Cover code', multiline: true, sortable: true, hideable: true, kind: 'cover-code',
    text: (r) => gc(r).coverCode },
  { key: 'type', title: 'Type', sortable: true, hideable: true, kind: 'text',
    text: (r) => gc(r).type },
];

const BUYER_GRADE_COVERS: CoverColumn[] = [
  { key: 'policyId', title: 'Policy ID', sortable: true, hideable: false, kind: 'policy-id',
    text: (r) => r.policyId },
  { key: 'ibus', title: 'IBUs', sortable: true, hideable: true, kind: 'stacked',
    lines: (r) => [r.contractBu, r.inforceBu], text: (r) => `${r.contractBu} / ${r.inforceBu}` },
  { key: 'lobSegment', title: 'LOB / Segment', multiline: true, sortable: true, hideable: true, kind: 'stacked',
    lines: lobSegment, text: (r) => `${r.lob ?? '-'} / ${r.segment ?? '-'}` },
  { key: 'policyName', title: 'Policy name', sortable: true, hideable: true, kind: 'policy-name',
    text: (r) => r.policyName },
  { key: 'color', title: 'Color', sortable: true, hideable: true, kind: 'color',
    color: (r) => r.policyColor, text: (r) => r.policyColor },
  ...GRADE_TAIL,
];

const POLICY_GRADE_COVERS: CoverColumn[] = [
  { key: 'buyerId', title: 'Cie ID', sortable: true, hideable: false, kind: 'text',
    text: (r) => r.buyerId, sortValue: (r) => Number(r.buyerId) },
  { key: 'buyerName', title: 'Buyer Name', wrap: true, sortable: true, hideable: true, kind: 'text',
    text: (r) => r.buyerName },
  ...GRADE_TAIL,
];

export function columnsFor(side: CoverbookSide, tab: 'credit-limits' | 'grade-covers'): CoverColumn[] {
  if (side === 'buyer') return tab === 'credit-limits' ? BUYER_CREDIT_LIMITS : BUYER_GRADE_COVERS;
  return tab === 'credit-limits' ? POLICY_CREDIT_LIMITS : POLICY_GRADE_COVERS;
}
