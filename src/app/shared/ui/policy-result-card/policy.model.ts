/** Modèle d'une police (ou d'un draft) tel que la recherche V2 l'affiche.
 *  Module pur : aucun import Angular, lu par les tests node. */

export type PolicyStatus = 'issued' | 'cancelled' | 'expired';
/** Une version APP est toujours `applicant` ; les autres statuts sont ceux des NBI. */
export type DraftStatus = 'applicant' | 'pending' | 'returned' | 'aborted' | 'cancelled' | 'transformed';
/** Étape de la dernière version du draft : applicant, puis Non Binding Indication. */
export type DraftStage = 'app' | 'nbi';
export type PolicyKind = 'policy' | 'draft';

/** Ce que polices et drafts partagent. Les champs optionnels manquent hors Compass. */
interface PolicyBase {
  /** Clé stable, BU comprise : voir policyId(). Clé des favoris et de l'historique. */
  id: string;
  /** Libellé de BU, ex. 'AT USA'. Fait partie de la clé. */
  buCode: string;
  /** Texte : les zéros à gauche comptent. Un draft commence par D. */
  policyNumber: string;
  /** Nom de la police, distinct du nom de l'assuré (un assuré peut avoir plusieurs polices). */
  policyName: string;
  insuredName: string;
  insuredCompanyId?: string;
  insuredCountry?: string;
  /** CAP, CAP+, Partial non-can… */
  product?: string;
  segment?: string;
  lob?: string;
  brokerName?: string;
  brokerCompanyId?: string;
}

/** Police signée. Dates au format ISO 'YYYY-MM-DD'. */
export interface SignedPolicy extends PolicyBase {
  kind: 'policy';
  /** Texte : '001', '01' et '1' sont trois clés différentes. null = pas d'extension. */
  extension: string | null;
  status: PolicyStatus;
  inceptionDate: string;
  expiryDate: string;
  /** Absente pour une police terminée. */
  nextRenewalDate?: string;
  /** Police Cancelled seulement. */
  cancellationDate?: string;
  /** BU qui porte le risque, identique à buCode dans la plupart des cas. */
  inforceBu?: string;
}

/** Draft : une carte par draft, son étape et son statut sont ceux de la dernière version. */
export interface DraftPolicy extends PolicyBase {
  kind: 'draft';
  draftStage: DraftStage;
  status: DraftStatus;
  updatedDate: string;
}

export type PolicyResultData = SignedPolicy | DraftPolicy;

type PolicyKeyParts =
  | { kind: 'policy'; buCode: string; policyNumber: string; extension: string | null }
  | { kind: 'draft'; buCode: string; policyNumber: string };

/** Clé unique, sur le modèle de l'URL Qirin : 'POL/AT UK/7730012/0234', 'DFT/AT UK/D20431'. */
export function policyId(p: PolicyKeyParts): string {
  if (p.kind === 'draft') return `DFT/${p.buCode}/${p.policyNumber}`;
  return p.extension === null ? `POL/${p.buCode}/${p.policyNumber}` : `POL/${p.buCode}/${p.policyNumber}/${p.extension}`;
}

/** BU proposées par le slot BU de la barre, triées. */
export const BU_CODES: string[] = ['Acredia', 'AT Belgium', 'AT Brazil', 'AT Italy', 'AT UK', 'AT USA'];

export const POLICY_STATUS_LABELS: Record<PolicyStatus, string> = {
  issued:    'Issued',
  cancelled: 'Cancelled',
  expired:   'Expired',
};

export const DRAFT_STATUS_LABELS: Record<DraftStatus, string> = {
  applicant:   'Applicant',
  pending:     'Pending',
  returned:    'Returned',
  aborted:     'Aborted',
  cancelled:   'Cancelled',
  transformed: 'Transformed',
};
