/** Types partagés du Feedback Companion. */

export type FeedbackKind = 'reaction' | 'rating' | 'comment' | 'screen';
export type Reaction = 'like' | 'dislike' | 'confused';

/** Rectangle capturé (élément ou zone libre), en px page. */
export interface FeedbackRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Infos sur l'élément pointé / la zone sélectionnée (null pour un retour d'écran). */
export interface FeedbackTarget {
  /** Origine de la cible : clic sur un élément, ou drag d'une zone libre. */
  mode: 'element' | 'zone';
  /** Chemin CSS court vers l'élément (repérage). Null pour une zone. */
  selector: string | null;
  /** Texte visible tronqué (lisibilité humaine sans rejouer le proto). */
  text: string | null;
  /** Classes `ds-*` de l'élément / des composants sous la zone. */
  label: string | null;
  /** Rectangle de la cible (repérage visuel dans /results). */
  rect: FeedbackRect | null;
}

/** Ce que le composant de saisie produit, avant enrichissement contextuel. */
export interface FeedbackDraft {
  kind: FeedbackKind;
  reaction?: Reaction | null;
  rating?: number | null;
  comment?: string | null;
  target?: FeedbackTarget | null;
  /** Vignette PNG en data URL (html2canvas), optionnelle. */
  screenshot?: string | null;
}

/** Ligne complète telle que persistée (miroir de la table Supabase `feedback`). */
export interface FeedbackEntry {
  id: string;
  created_at: string;
  session_id: string;
  route: string;
  kind: FeedbackKind;
  reaction: Reaction | null;
  rating: number | null;
  comment: string | null;
  target_mode: 'element' | 'zone' | null;
  target_selector: string | null;
  target_text: string | null;
  target_label: string | null;
  target_rect: FeedbackRect | null;
  screenshot: string | null;
  viewport: { w: number; h: number } | null;
  user_agent: string | null;
  /** Provenance de lecture (non persistée côté Supabase). */
  source?: 'supabase' | 'local';
}
