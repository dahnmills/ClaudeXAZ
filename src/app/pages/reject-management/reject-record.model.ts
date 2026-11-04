/** Contenu d'un rejet : les champs du message reçu, rangés comme dans l'extraction. */

export interface RejectField {
  /** Numéro du champ dans le message (#). */
  n: number;
  /** Nom technique du champ (QAJA01-…). */
  tech: string;
  /** Nom métier. */
  label: string;
  /** Longueur maximale. */
  length: number;
  /** Valeur reçue. */
  value: string;
  /** Raison du rejet quand ce champ est en cause. */
  error?: string;
  /** Valeur à choisir dans une liste du dataref Qirin (pour le pays du rejet). */
  dataref?: DatarefList;
  /** Champ barré par le métier : plus utilisé dans Qirin, masqué à la correction. */
  notUsed?: boolean;
}

/** Listes du dataref Qirin proposées à la correction. */
export type DatarefList = 'region';

export interface RejectSection {
  name: string;
  fields: RejectField[];
}

/** Bloc du message (COMMON DATA, COMPANY, BRANCH…), découpé en sous-sections. */
export interface RejectBlock {
  name: string;
  sections: RejectSection[];
}

/**
 * Comment sortir d'un rejet (retour métier du 2026-11-04) :
 * - `correct-and-resubmit` : corriger le champ dans le rejet, puis Resubmit ;
 * - `delete` : régler la cause hors du rejet, puis Delete (le rejet est caduc) ;
 * - `resubmit-as-is` : régler la cause hors du rejet, puis Resubmit sans rien changer.
 */
export type RejectResolutionKind = 'correct-and-resubmit' | 'delete' | 'resubmit-as-is';

/** Une société Qirin citée par la résolution. */
export interface RejectCompanyRef {
  name: string;
  /** Euler Hermes ID. */
  id: string;
  country: string;
}

/** Simulation, dans le prototype, d'une action faite ailleurs dans Qirin. */
export interface RejectStepStub {
  label: string;
  title: string;
  body: string;
  confirmLabel: string;
  /** Toaster une fois l'action simulée. */
  done: string;
}

export interface RejectResolutionStep {
  text: string;
  /** Lien vers une page Qirin (ouvert dans un nouvel onglet). */
  link?: { label: string; href: string };
  stub?: RejectStepStub;
  /** L'étape se fait dans le rejet : mène aux champs en cause. */
  goToFields?: boolean;
}

export interface RejectResolution {
  kind: RejectResolutionKind;
  /** Raison du rejet, en mots simples. */
  reason: string;
  /** Cause probable, quand on la connaît. */
  likelyCause?: string;
  /** Société qui porte déjà la valeur en conflit (doublon). */
  conflictingCompany?: RejectCompanyRef;
  /** Champs en cause à corriger dans le rejet (numéros). Les autres champs en
   *  cause restent en lecture seule : leur cause se règle hors du rejet. */
  fieldsToCorrect?: number[];
  steps: RejectResolutionStep[];
}

export interface RejectRecord {
  id: string;
  /** En-tête de l'extraction : Sub-System, Reject Source, Reject Type, EHBU… */
  meta: Record<string, string>;
  blocks: RejectBlock[];
  resolution?: RejectResolution;
}
