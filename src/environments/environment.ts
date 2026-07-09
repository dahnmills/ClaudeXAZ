/**
 * Feedback Companion — configuration Supabase.
 *
 * Laisse `supabaseUrl` / `supabaseAnonKey` vides pour tester en local sans
 * backend : les retours sont alors stockés en `localStorage` (clé
 * `qirin.feedback.local`) et lisibles depuis /results (source « local »).
 *
 * Une fois ton projet Supabase créé (voir docs/feedback/SUPABASE.md) :
 *   - supabaseUrl      : https://<project-ref>.supabase.co
 *   - supabaseAnonKey  : la clé « anon public » du projet
 * Le service bascule automatiquement sur l'API REST PostgREST.
 */
export const environment = {
  production: false,
  supabaseUrl: '',
  supabaseAnonKey: '',
  /** Table cible côté Supabase. */
  feedbackTable: 'feedback',
};
