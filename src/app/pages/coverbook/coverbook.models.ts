import type { PolicyColorValue } from '../../shared/ui/policy-color/policy-color.component';
import type { GradeType, GradeValue } from '../../shared/ui/grade/grade.component';

/**
 * Modèle Coverbook, dérivé des exports « merged full exposure » (une feuille
 * `exposure data`, 89 colonnes identiques côté acheteur et côté police).
 * Seules les colonnes affichées ou utiles au prototype sont reprises ici.
 */

export type CoverbookSide = 'buyer' | 'policy';

/** Onglets des deux écrans. Seuls les deux onglets « covers » sont branchés. */
export type CoverbookTab =
  | 'exposure-summary'
  | 'exposure-details'
  | 'credit-limits'
  | 'grade-covers'
  | 'policy-exposure'
  | 'downloads';

/** Export « Cover type code ». */
export type CoverType = 'Primary' | 'PreCheck' | 'Cap' | 'CapPlus';

/** Export « Cover status code ». */
export type CoverStatus = 'Cover' | 'Partial' | 'NoCover';

/** Export « Decision code » (les 13 valeurs vues dans les exports). */
export type DecisionCode =
  | 'Agreement'
  | 'AlreadyAgreed'
  | 'Refusal'
  | 'RestrictiveAnswer'
  | 'Maintain'
  | 'PolicyTransfer'
  | 'PartialWithdrawal'
  | 'RiskWithdrawal'
  | 'UnableToCover'
  | 'AdministrativeWithdrawal'
  | 'PartialCancellation'
  | 'LimitUpdate'
  | 'BuyerTransfer';

/** Export « Answer type code » : porte la colonne Underwriter. */
export type AnswerType = 'Manual' | 'Automatic' | 'NotApplicable';

/** Grade based covers : valeurs de la colonne Type de l'écran actuel. */
export type GradeCoverType = 'GradePolicyCoverBasic' | 'GradePolicyCoverDeluxe' | 'GradeCover';

/** Grade based covers : code de couverture (lien vers la police à vérifier). */
export type CoverCode = 'Cover' | 'Check policy';

/**
 * Montant dans ses deux devises : la devise d'origine (« Original request
 * currency » / « Decision currency ») et la devise de référence de l'export
 * (« Converted … », toujours EUR).
 */
export interface CoverAmount {
  original:  number;
  currency:  string;
  reference: number;
}

export interface Grade {
  type:  GradeType;
  grade: GradeValue | null;
}

/** Ligne de l'onglet Credit Limits (une couverture de limite de crédit). */
export interface CreditLimitCover {
  id:             string;
  // Police
  policyId:       string;
  policyName:     string;
  productName:    string;
  policyColor:    PolicyColorValue;
  contractBu:     string;
  inforceBu:      string;
  lob:            string | null;
  segment:        string | null;
  // Acheteur
  buyerId:        string;
  buyerName:      string;
  buyerCountry:   string;
  buyerGrade:     Grade;
  // Couverture
  coverType:      CoverType;
  coverStatus:    CoverStatus;
  requestDate:    string | null;
  decisionDate:   string;
  expirationDate: string | null;
  request:        CoverAmount | null;
  answer:         CoverAmount;
  decisionCode:   DecisionCode;
  answerType:     AnswerType;
  /** « Automatic Decision » ou identifiant de l'underwriter. */
  underwriter:    string;
  /** Jours. */
  riskHorizon:    number | null;
}

/** Ligne de l'onglet Grade based covers. */
export interface GradeBasedCover {
  id:             string;
  policyId:       string;
  policyName:     string;
  productName:    string;
  /** Police vérifiée (coche à côté du nom). */
  verified:       boolean;
  policyColor:    PolicyColorValue;
  contractBu:     string;
  inforceBu:      string;
  lob:            string | null;
  segment:        string | null;
  buyerId:        string;
  buyerName:      string;
  requestDate:    string;
  lastUpdate:     string;
  answer:         CoverAmount | null;
  decisionGrade:  Grade;
  expirationDate: string | null;
  coverCode:      CoverCode;
  type:           GradeCoverType;
}

export interface CoverbookBuyer {
  id:         string;
  name:       string;
  grade:      Grade;
  highRisk:   boolean;
  sru:        boolean;
  sanction:   boolean;
}

export interface CoverbookPolicy {
  id:              string;
  name:            string;
  color:           PolicyColorValue;
  insuredBu:       string;
  inforceBu:       string;
  productName:     string;
  familyName:      string;
  segment:         string;
  lob:             string;
  language:        string;
  strategic:       boolean;
  customerSegment: string;
}
