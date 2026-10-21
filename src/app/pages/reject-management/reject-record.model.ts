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
}

export interface RejectSection {
  name: string;
  fields: RejectField[];
}

/** Bloc du message (COMMON DATA, COMPANY, BRANCH…), découpé en sous-sections. */
export interface RejectBlock {
  name: string;
  sections: RejectSection[];
}

export interface RejectRecord {
  id: string;
  /** En-tête de l'extraction : Sub-System, Reject Source, Reject Type, EHBU… */
  meta: Record<string, string>;
  blocks: RejectBlock[];
}
