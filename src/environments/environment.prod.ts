/**
 * Feedback Companion — configuration Supabase (production).
 * Remplis les valeurs avec ton projet Supabase avant le build de prod.
 * L'anon key est publique par design (RLS autorise l'insert anonyme,
 * jamais le select) — voir docs/feedback/SUPABASE.md.
 */
export const environment = {
  production: true,
  supabaseUrl: '',
  supabaseAnonKey: '',
  feedbackTable: 'feedback',
};
