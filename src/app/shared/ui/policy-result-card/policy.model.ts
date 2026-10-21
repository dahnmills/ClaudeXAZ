/** Modèle d'une police (ou d'un draft) tel que la recherche V2 l'affiche.
 *  Module pur : aucun import Angular, lu par les tests node. */

export type PolicyStatus = 'issued' | 'cancelled' | 'expired';
export type PolicyKind = 'policy' | 'draft';

export interface PolicyDetail { label: string; value: string; }

export interface PolicyResultData {
  /** Identifiant stable : n° + extension. Clé des favoris et de l'historique. */
  id: string;
  policyNumber: string;
  /** '00', '01'… ; '00' pour un draft. */
  extension: string;
  kind: PolicyKind;
  /** null pour un draft : il n'a pas encore de statut. */
  status: PolicyStatus | null;
  policyholder: string;
  /** Libellé de BU, ex. 'AT USA'. */
  buCode: string;
  effectiveDate: string;
  expiryDate: string;
  details?: PolicyDetail[];
}

/** BU proposées par le slot BU de la barre, triées. */
export const BU_CODES: string[] = ['Acredia', 'AT Belgium', 'AT Brazil', 'AT UK', 'AT USA'];

export const POLICY_STATUS_LABELS: Record<PolicyStatus, string> = {
  issued:    'Issued',
  cancelled: 'Cancelled',
  expired:   'Expired',
};
