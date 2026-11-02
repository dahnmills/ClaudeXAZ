/** Modèle d'une police (ou d'un draft) tel que la recherche V2 l'affiche.
 *  Module pur : aucun import Angular, lu par les tests node. */

export type PolicyStatus = 'issued' | 'cancelled' | 'expired';
/** Statut de la dernière version d'un draft, quelle que soit son étape : une APP
 *  peut être Issued, une NBI Inactive (statuts lus dans Qirin et la réunion du
 *  27 octobre). « Applicant » est une étape, pas un statut. */
export type DraftStatus = 'issued' | 'inactive' | 'pending' | 'returned' | 'aborted' | 'cancelled' | 'transformed';
/** Étape atteinte par le draft : applicant, puis Non Binding Indication. */
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
  /** Texte : '001', '01' et '1' sont trois clés différentes. null = pas d'extension. */
  extension: string | null;
  /** Dates au format ISO 'YYYY-MM-DD'. Sur un draft : la couverture proposée. */
  inceptionDate: string;
  expiryDate: string;
  /** BU qui porte le risque, identique à buCode dans la plupart des cas. */
  inforceBu?: string;
}

/** Police signée. */
export interface SignedPolicy extends PolicyBase {
  kind: 'policy';
  status: PolicyStatus;
  /** Absente pour une police terminée. */
  nextRenewalDate?: string;
  /** Police Cancelled seulement. */
  cancellationDate?: string;
}

/** Draft : un résultat par draft, avec l'étape atteinte et le statut de sa dernière
 *  version. Les versions (000 pour l'APP, 001, 002… pour les NBI) ne se listent pas
 *  dans la recherche : leur navigation appartient à la page du draft. */
export interface DraftPolicy extends PolicyBase {
  kind: 'draft';
  /** Le suffixe affiché par Qirin est la version : il ne fait pas partie du résultat. */
  extension: null;
  draftStage: DraftStage;
  status: DraftStatus;
  /** APP comprise : 1 pour un draft resté applicant. */
  versionCount: number;
}

export type PolicyResultData = SignedPolicy | DraftPolicy;

type PolicyKeyParts = { kind: PolicyKind; buCode: string; policyNumber: string; extension: string | null };

/** Clé unique, sur le modèle de l'URL Qirin : 'POL/AT UK/7730012/0234', 'DFT/AT UK/D20431/002'. */
export function policyId(p: PolicyKeyParts): string {
  const head = `${p.kind === 'draft' ? 'DFT' : 'POL'}/${p.buCode}/${p.policyNumber}`;
  return p.extension === null ? head : `${head}/${p.extension}`;
}

/** BU proposées par le slot BU de la barre, triées. */
export const BU_CODES: string[] = ['Acredia', 'AT Belgium', 'AT Brazil', 'AT Italy', 'AT UK', 'AT USA'];

export const POLICY_STATUS_LABELS: Record<PolicyStatus, string> = {
  issued:    'Issued',
  cancelled: 'Cancelled',
  expired:   'Expired',
};

export const DRAFT_STATUS_LABELS: Record<DraftStatus, string> = {
  issued:      'Issued',
  inactive:    'Inactive',
  pending:     'Pending',
  returned:    'Returned',
  aborted:     'Aborted',
  cancelled:   'Cancelled',
  transformed: 'Transformed',
};
