import { FeedbackEntry } from '../../shared/feedback/feedback.types';

/**
 * Jeu de démonstration pour /results (mode local uniquement).
 * Permet de visualiser la page peuplée sans avoir à semer des retours à la main.
 * Purement local : jamais utilisé en mode Supabase.
 */

/** Petite capture factice (SVG → data URL) pour illustrer les vignettes. */
function shot(label: string, bg: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300">` +
    `<rect width="480" height="300" fill="${bg}"/>` +
    `<rect x="16" y="16" width="448" height="44" rx="4" fill="#ffffff"/>` +
    `<rect x="16" y="76" width="300" height="16" rx="3" fill="#ffffff" opacity="0.85"/>` +
    `<rect x="16" y="100" width="220" height="16" rx="3" fill="#ffffff" opacity="0.6"/>` +
    `<rect x="16" y="150" width="448" height="120" rx="6" fill="#ffffff" opacity="0.92"/>` +
    `<text x="24" y="290" font-family="sans-serif" font-size="13" fill="#414141">${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const SESSION_A = 'a1b2c3d4-1111-4aaa-8000-000000000001';
const SESSION_B = 'b2c3d4e5-2222-4bbb-8000-000000000002';
const SESSION_C = 'c3d4e5f6-3333-4ccc-8000-000000000003';

/** Génère le jeu de démo daté relativement à `now` (passé en param, pas de Date.now ici). */
export function buildDemoEntries(now: number): FeedbackEntry[] {
  const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
  const base = {
    viewport: { w: 1440, h: 900 },
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36',
    source: 'local' as const,
  };

  return [
    {
      ...base, id: 's-1', created_at: hoursAgo(2), session_id: SESSION_A,
      route: '/review/buyer-summary/137381425', kind: 'comment',
      reaction: 'like', rating: 5, comment: "La note de risque est immédiatement visible, exactement là où je la cherche. Très clair.",
      target_mode: 'element', target_selector: 'section.ds-card > div.ds-grade', target_text: 'Grade A2 · Faible risque', target_label: 'ds-grade ds-badge',
      target_rect: { x: 320, y: 180, w: 220, h: 64 }, screenshot: shot('Buyer summary · bloc grade', '#003781'),
    },
    {
      ...base, id: 's-2', created_at: hoursAgo(5), session_id: SESSION_A,
      route: '/review/buyer-summary/137381425', kind: 'comment',
      reaction: 'confused', rating: null, comment: "Je ne comprends pas la différence entre « exposition » et « encours ». Deux libellés proches, pas de définition au survol.",
      target_mode: 'zone', target_selector: null, target_text: null, target_label: 'ds-properties-panel ds-card',
      target_rect: { x: 80, y: 420, w: 520, h: 180 }, screenshot: shot('Panneau propriétés · exposition', '#496ebd'),
    },
    {
      ...base, id: 's-3', created_at: hoursAgo(9), session_id: SESSION_B,
      route: '/review/search', kind: 'reaction',
      reaction: 'like', rating: null, comment: null,
      target_mode: 'element', target_selector: 'ds-search-bar input', target_text: 'Rechercher une entreprise', target_label: 'ds-search-bar',
      target_rect: { x: 240, y: 96, w: 640, h: 48 }, screenshot: shot('Recherche · barre', '#007ab3'),
    },
    {
      ...base, id: 's-4', created_at: hoursAgo(26), session_id: SESSION_B,
      route: '/review/tag-configuration', kind: 'comment',
      reaction: 'dislike', rating: 2, comment: "Réordonner les règles à la souris est frustrant : la cible de dépôt n'est pas claire, j'ai déplacé la mauvaise règle deux fois.",
      target_mode: 'zone', target_selector: null, target_text: null, target_label: 'ds-collapsible-table',
      target_rect: { x: 64, y: 260, w: 800, h: 320 }, screenshot: shot('TAG · réordonnancement', '#b0050c'),
    },
    {
      ...base, id: 's-5', created_at: hoursAgo(30), session_id: SESSION_C,
      route: '/review/tag-configuration', kind: 'rating',
      reaction: null, rating: 4, comment: null,
      target_mode: 'element', target_selector: 'ds-button.ds-button--type-primary', target_text: 'Enregistrer les règles', target_label: 'ds-button',
      target_rect: { x: 720, y: 640, w: 200, h: 40 }, screenshot: null,
    },
    {
      ...base, id: 's-6', created_at: hoursAgo(49), session_id: SESSION_C,
      route: '/review/admin-data', kind: 'comment',
      reaction: null, rating: null, comment: "Il manque un état de chargement : la table reste vide une seconde, on croit qu'il n'y a pas de données.",
      target_mode: 'zone', target_selector: null, target_text: null, target_label: 'ds-table-row ds-cell',
      target_rect: { x: 48, y: 200, w: 900, h: 260 }, screenshot: shot('Admin data · table', '#767676'),
    },
    {
      ...base, id: 's-7', created_at: hoursAgo(73), session_id: SESSION_A,
      route: '/review/buyer-summary/137381425', kind: 'reaction',
      reaction: 'like', rating: null, comment: null,
      target_mode: 'element', target_selector: 'ds-timeline', target_text: 'Historique des décisions', target_label: 'ds-timeline',
      target_rect: { x: 640, y: 420, w: 360, h: 300 }, screenshot: shot('Timeline · décisions', '#1e8927'),
    },
    {
      ...base, id: 's-8', created_at: hoursAgo(120), session_id: SESSION_B,
      route: '/review/search', kind: 'screen',
      reaction: 'confused', rating: 3, comment: "L'écran de résultats est dense. Bien pour un expert, mais un filtre « décision » en tête de liste aiderait à trier vite.",
      target_mode: null, target_selector: null, target_text: null, target_label: null,
      target_rect: null, screenshot: null,
    },
  ];
}
