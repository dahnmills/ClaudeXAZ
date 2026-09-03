import { KEY_THEN, type KeyCombo } from '../../shared/ui/keycap/shortcut-keys.component';
import type { Shortcut, ShortcutGroup } from '../../shared/ui/shortcuts-panel/shortcuts-panel.component';
import { legendLetter } from './keyboard-layout';

/**
 * Catalogue des raccourcis clavier de Qirin + résolution touche ↔ événement.
 *
 * ── Plans de modificateurs ────────────────────────────────────────────────
 * Le choix des combinaisons n'est pas libre : chaque touche déjà prise par l'OS
 * ou le navigateur est un raccourci qui « ne marche pas » une fois sur deux.
 * D'où quatre plans nets, chacun avec un sens :
 *
 *   Alt + chiffre        aller à une entrée du menu latéral, dans SON ORDRE
 *                        (1 = Home … 6 = Applications). Mapping spatial : rien
 *                        à mémoriser, on compte.
 *   Alt + lettre         aller à une destination nommée hors menu latéral
 *                        (M = ManA, W = Watchlist, N = Notifications…).
 *   Alt + Shift + lettre ouvrir un outil ou un réglage (T = TAG configuration,
 *                        A = Admin data, D = Dark mode…).
 *   lettre seule         agir sur la vue courante (C = Copy ID, F = Filters).
 *                        Neutralisée dès qu'un champ de saisie a le focus.
 *
 * Ctrl/⌘ n'est utilisé que là où il redit exactement ce que l'OS dit déjà
 * (S = enregistrer, Z = annuler) — la seule circonstance où l'article de Knock
 * juge légitime d'écraser un raccourci natif.
 *
 * ── Combinaisons volontairement évitées ───────────────────────────────────
 *   Alt+F, Alt+I, Alt+K   déjà pris dans ce proto par le compagnon de feedback,
 *                         l'inspecteur et la palette Spotlight.
 *   Alt+D, Alt+E, Alt+←/→, Alt+Home   pris par le navigateur (barre d'adresse,
 *                         menu, historique).
 *   Ctrl+A/C/V/X          appartiennent à la saisie de texte.
 *
 * ── Dispositions clavier ──────────────────────────────────────────────────
 * Une lettre est reconnue par ce qui est GRAVÉ sur la touche, pas par sa
 * position : « Alt + M » vise la touche marquée M, qu'elle soit à droite du N
 * (QWERTY) ou au bout de la rangée du milieu (AZERTY). Les chiffres, eux, sont
 * reconnus par position — c'est elle qui ne bouge pas d'une disposition à
 * l'autre. Détail dans keyboard-layout.ts.
 *
 * ── `bind: false` ─────────────────────────────────────────────────────────
 * Certaines combinaisons (flèches, Entrée, Espace, PgDn, zoom) ont déjà un sens
 * natif dans la page. On les DOCUMENTE — le testeur doit savoir qu'elles
 * existent — sans les capter : les intercepter globalement casserait le
 * défilement et l'activation des boutons.
 */

// ── Types ──────────────────────────────────────────────────────────────────

/** Jeton d'une combinaison canonique : modificateur, ou touche littérale. */
export type ComboToken = string;

export interface ShortcutDef {
  id: string;
  /** Catégories où la ligne apparaît. Un raccourci essentiel est listé deux
   *  fois — même `id`, donc les deux lignes s'allument ensemble. */
  groups: string[];
  label: string;
  /** Combinaison canonique, indépendante de l'OS et de la disposition clavier. */
  combo: ComboToken[];
  /** Route atteinte, SANS préfixe de zone (l'appelant ajoute /review, etc.). */
  route?: string;
  /** Portée affichée quand le raccourci n'est pas disponible partout. */
  context?: string;
  /** `false` = documenté mais non capté. Voir l'en-tête. */
  bind?: boolean;
}

export interface ShortcutCategory {
  key: string;
  label: string;
}

// ── Résolution des libellés selon l'OS ─────────────────────────────────────

/**
 * Un Mac affiche ⌥⌘⇧, un PC écrit Alt/Ctrl/Shift. Montrer les mauvais glyphes
 * suffit à faire passer le panneau pour une capture d'écran d'un autre produit.
 */
export const IS_MAC =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

const KEY_LABELS: Record<string, string> = {
  alt:        IS_MAC ? '⌥' : 'Alt',
  mod:        IS_MAC ? '⌘' : 'Ctrl',
  shift:      IS_MAC ? '⇧' : 'Shift',
  esc:        'Esc',
  enter:      IS_MAC ? '↩' : 'Enter',
  space:      'Space',
  up:         '↑',
  down:       '↓',
  left:       '←',
  right:      '→',
  pgdn:       'PgDn',
  pgup:       'PgUp',
  backspace:  '⌫',
  tab:        'Tab',
  f11:        'F11',
  [KEY_THEN]: KEY_THEN,
};

/** Libellé affichable d'un jeton canonique. */
export function keyLabel(token: ComboToken): string {
  return KEY_LABELS[token] ?? (token.length === 1 ? token.toUpperCase() : token);
}

// ── Signatures : comparer une combinaison à un événement ───────────────────

const MODIFIERS = ['alt', 'mod', 'shift'] as const;
const MODIFIER_SET = new Set<string>(MODIFIERS);

/** Forme canonique d'une combinaison : modificateurs dans un ordre fixe, puis
 *  la touche. Deux définitions qui produisent la même signature sont en
 *  conflit. */
export function comboSignature(combo: readonly ComboToken[]): string {
  const mods = MODIFIERS.filter((m) => combo.includes(m));
  const keys = combo
    .filter((t) => !MODIFIER_SET.has(t) && t !== KEY_THEN)
    .map((k) => k.toLowerCase());
  return [...mods, ...keys].join('+');
}

/**
 * Touche pressée, normalisée.
 *
 * Deux règles, et elles s'opposent — c'est ce qui rend la fonction non
 * triviale :
 *
 * - Les CHIFFRES se lisent par POSITION (`event.code`). Sur AZERTY la rangée
 *   haute imprime « & é " ' » sans Shift : un catalogue bâti sur `event.key`
 *   casserait Alt+1 pour tout le monde hors QWERTY. `Digit1` est la même touche
 *   physique sur toutes les dispositions latines.
 * - Les LETTRES se lisent par LÉGENDE, c'est-à-dire ce qui est gravé dessus. La
 *   touche marquée `M` d'un AZERTY est à la position que QWERTY nomme
 *   `Semicolon` : se fier au `code` obligerait à presser `,` pour déclencher
 *   « Alt + M ». Trois sources, par fiabilité décroissante — `event.key` (déjà
 *   la légende, sauf modificateur composant un caractère), la Keyboard Map du
 *   navigateur (voir keyboard-layout.ts), puis le `code` qui suppose un QWERTY.
 *
 * Le reste (Échap, flèches, `?`…) passe par `event.key` : ces touches n'ont pas
 * de `code` stable d'une disposition à l'autre.
 */
function normalizeEventKey(ev: KeyboardEvent): string {
  const code = ev.code ?? '';
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);

  if (/^[a-zA-Z]$/.test(ev.key)) return ev.key.toLowerCase();
  const legend = legendLetter(code);
  if (legend) return legend;
  if (/^Key[A-Z]$/.test(code)) return code.slice(3).toLowerCase();

  switch (ev.key) {
    case 'Escape':     return 'esc';
    case 'Enter':      return 'enter';
    case ' ':          return 'space';
    case 'ArrowUp':    return 'up';
    case 'ArrowDown':  return 'down';
    case 'ArrowLeft':  return 'left';
    case 'ArrowRight': return 'right';
    case 'PageDown':   return 'pgdn';
    case 'PageUp':     return 'pgup';
    case 'Backspace':  return 'backspace';
    case 'Tab':        return 'tab';
    default:           return ev.key.toLowerCase();
  }
}

/**
 * Signature d'un événement clavier, comparable à `comboSignature`.
 *
 * Shift n'est retenu que sur une LETTRE. Sur `?`, `/` ou un chiffre AZERTY,
 * Shift ne modifie pas la touche : il la produit. Le compter reviendrait à
 * exiger « Alt + Shift + 1 » là où l'utilisateur a simplement fait « Alt + 1 ».
 * Corollaire assumé : le plan Alt + Shift + chiffre est inutilisable, on ne
 * l'utilise donc pas dans le catalogue.
 */
export function eventSignature(ev: KeyboardEvent): string {
  const key = normalizeEventKey(ev);
  const mods: string[] = [];
  if (ev.altKey) mods.push('alt');
  if (ev.ctrlKey || ev.metaKey) mods.push('mod');
  if (ev.shiftKey && /^[a-z]$/.test(key)) mods.push('shift');
  return [...mods, key].join('+');
}

/** Un champ de saisie a le focus → le clavier appartient à l'utilisateur. */
export function inTextField(): boolean {
  const el = typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null;
  if (!el) return false;
  if (el.isContentEditable) return true;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT';
}

/**
 * Les trois seules exceptions à la règle « en saisie, on ne capte rien » :
 * Échap (sortir), le plan Alt (notre espace de noms, qui ne produit aucun
 * caractère), et Ctrl/⌘+S — c'est précisément en train de saisir qu'on veut
 * enregistrer.
 */
export function allowedWhileTyping(signature: string): boolean {
  return signature === 'esc' || signature.startsWith('alt') || signature === 'mod+s';
}

// ── Catégories ─────────────────────────────────────────────────────────────

export const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  { key: 'essential', label: 'Essential' },
  { key: 'goto',      label: 'Go to' },
  { key: 'buyer',     label: 'Buyer' },
  { key: 'tools',     label: 'Tools' },
  { key: 'table',     label: 'Table' },
  { key: 'filters',   label: 'Filters' },
  { key: 'view',      label: 'View' },
  { key: 'editing',   label: 'Editing' },
];

const IN_BUYER  = 'in a buyer dossier';
const IN_TABLE  = 'in a table';
const IN_FILTER = 'in the filter panel';
const EDITING   = 'while editing';

// ── Catalogue ──────────────────────────────────────────────────────────────

export const SHORTCUTS: ShortcutDef[] = [
  // Essentiels purs
  { id: 'panel',  groups: ['essential'],            label: 'Keyboard shortcuts',              combo: ['?'] },
  { id: 'search', groups: ['essential'],            label: 'Search Qirin',                    combo: ['/'] },
  { id: 'close',  groups: ['essential', 'editing'], label: 'Close the panel, menu or dialog', combo: ['esc'] },

  // Menu latéral — mapping spatial : le chiffre EST la position dans la nav.
  { id: 'nav-home',         groups: ['essential', 'goto'], label: 'Home',         combo: ['alt', '1'], route: '/home' },
  { id: 'nav-messages',     groups: ['goto'],              label: 'Messages',     combo: ['alt', '2'] },
  { id: 'nav-analytics',    groups: ['goto'],              label: 'Analytics',    combo: ['alt', '3'] },
  { id: 'nav-buyers',       groups: ['essential', 'goto'], label: 'Buyers',       combo: ['alt', '4'], route: '/search' },
  { id: 'nav-contracts',    groups: ['goto'],              label: 'Contracts',    combo: ['alt', '5'] },
  { id: 'nav-applications', groups: ['goto'],              label: 'Applications', combo: ['alt', '6'] },

  // Destinations nommées hors menu latéral
  { id: 'goto-mana',          groups: ['essential', 'goto'], label: 'ManA — Manual Assessment', combo: ['alt', 'm'] },
  { id: 'goto-notifications', groups: ['goto'],              label: 'Notifications',            combo: ['alt', 'n'], route: '/notification-module' },
  { id: 'goto-watchlist',     groups: ['goto'],              label: 'Watchlist',                combo: ['alt', 'w'] },
  { id: 'goto-recent',        groups: ['goto'],              label: 'Recently viewed',          combo: ['alt', 'r'] },
  { id: 'goto-tasks',         groups: ['goto'],              label: 'My tasks',                 combo: ['alt', 't'] },
  { id: 'goto-back',          groups: ['goto'],              label: 'Previous buyer',           combo: ['alt', 'b'] },

  // Outils et réglages
  { id: 'tool-tag',           groups: ['essential', 'tools'], label: 'TAG configuration',    combo: ['alt', 'shift', 't'], route: '/tag-configuration' },
  { id: 'tool-admin',         groups: ['tools'],              label: 'Admin data',           combo: ['alt', 'shift', 'a'], route: '/admin-data' },
  { id: 'tool-grade-story',   groups: ['tools', 'buyer'],     label: 'Grade story',          combo: ['alt', 'shift', 'g'], route: '/grade-story' },
  { id: 'tool-release-notes', groups: ['tools'],              label: 'What’s new',           combo: ['alt', 'shift', 'r'], route: '/release-notes' },
  { id: 'tool-settings',      groups: ['tools'],              label: 'Settings',             combo: ['alt', 'shift', 's'] },
  { id: 'tool-act-as',        groups: ['tools'],              label: 'Act as another user',  combo: ['alt', 'shift', 'u'] },
  { id: 'tool-export',        groups: ['tools'],              label: 'Export current view',  combo: ['alt', 'shift', 'e'] },
  { id: 'tool-logout',        groups: ['tools'],              label: 'Log out',              combo: ['alt', 'shift', 'l'] },
  { id: 'help',               groups: ['essential', 'tools'], label: 'Help with Qirin',      combo: ['alt', 'shift', 'h'] },

  // Dossier acheteur — lettre seule, coupée dès qu'un champ a le focus.
  { id: 'buyer-grade',    groups: ['buyer'], label: 'Request a new grade',   combo: ['g'], context: IN_BUYER },
  { id: 'buyer-copy-id',  groups: ['buyer'], label: 'Copy the buyer ID',     combo: ['c'], context: IN_BUYER },
  { id: 'buyer-watch',    groups: ['buyer'], label: 'Add to the watchlist',  combo: ['w'], context: IN_BUYER },
  { id: 'buyer-edit',     groups: ['buyer'], label: 'Edit admin data',       combo: ['e'], context: IN_BUYER, route: '/admin-data' },
  { id: 'buyer-note',     groups: ['buyer'], label: 'Add a note',            combo: ['a'], context: IN_BUYER },
  { id: 'buyer-print',    groups: ['buyer'], label: 'Print the dossier',     combo: ['p'], context: IN_BUYER },
  { id: 'buyer-exposure', groups: ['buyer'], label: 'Open the exposure tab', combo: ['x'], context: IN_BUYER },

  // Tables — presque tout est natif, donc documenté sans être capté.
  { id: 'table-next-row',   groups: ['table'], label: 'Next row',                   combo: ['down'],          context: IN_TABLE, bind: false },
  { id: 'table-prev-row',   groups: ['table'], label: 'Previous row',               combo: ['up'],            context: IN_TABLE, bind: false },
  { id: 'table-open-row',   groups: ['table'], label: 'Open the selected row',      combo: ['enter'],         context: IN_TABLE, bind: false },
  { id: 'table-select-row', groups: ['table'], label: 'Select the row',             combo: ['space'],         context: IN_TABLE, bind: false },
  { id: 'table-extend',     groups: ['table'], label: 'Extend the selection',       combo: ['shift', 'down'], context: IN_TABLE, bind: false },
  { id: 'table-select-all', groups: ['table'], label: 'Select every row',           combo: ['mod', 'a'],      context: IN_TABLE, bind: false },
  { id: 'table-next-page',  groups: ['table'], label: 'Next page',                  combo: ['pgdn'],          context: IN_TABLE, bind: false },
  { id: 'table-prev-page',  groups: ['table'], label: 'Previous page',              combo: ['pgup'],          context: IN_TABLE, bind: false },
  { id: 'table-sort',       groups: ['table'], label: 'Sort by the focused column', combo: ['s'],             context: IN_TABLE },

  // Filtres
  { id: 'filter-open',  groups: ['filters'], label: 'Open the filter panel', combo: ['f'] },
  { id: 'filter-more',  groups: ['filters'], label: 'More criteria',        combo: ['m'] },
  { id: 'filter-apply', groups: ['filters'], label: 'Apply the filters',    combo: ['mod', 'enter'], context: IN_FILTER, bind: false },
  { id: 'filter-reset', groups: ['filters'], label: 'Reset every filter',   combo: ['alt', 'shift', 'x'] },
  { id: 'filter-save',  groups: ['filters'], label: 'Bookmark this search', combo: ['alt', 'shift', 'b'] },

  // Vue
  { id: 'view-sidenav',    groups: ['view'],          label: 'Collapse the side navigation', combo: ['alt', 'shift', 'n'] },
  { id: 'view-dark',       groups: ['view', 'tools'], label: 'Dark mode',                    combo: ['alt', 'shift', 'd'] },
  { id: 'view-density',    groups: ['view'],          label: 'Compact density',              combo: ['alt', 'shift', 'c'] },
  { id: 'view-zoom-in',    groups: ['view'],          label: 'Zoom in',                      combo: ['mod', '+'], bind: false },
  { id: 'view-zoom-out',   groups: ['view'],          label: 'Zoom out',                     combo: ['mod', '-'], bind: false },
  { id: 'view-zoom-reset', groups: ['view'],          label: 'Reset the zoom',               combo: ['mod', '0'], bind: false },
  { id: 'view-fullscreen', groups: ['view'],          label: 'Full screen',                  combo: ['f11'],      bind: false },

  // Édition
  { id: 'save',        groups: ['essential', 'editing'], label: 'Save changes',    combo: ['mod', 's'] },
  { id: 'edit-undo',   groups: ['editing'],              label: 'Undo',            combo: ['mod', 'z'] },
  { id: 'edit-redo',   groups: ['editing'],              label: 'Redo',            combo: ['mod', 'shift', 'z'] },
  { id: 'edit-submit', groups: ['editing'],              label: 'Submit the form', combo: ['mod', 'enter'], context: EDITING, bind: false },
];

// ── Dérivés pour le panneau et pour le dispatch ────────────────────────────

function toShortcut(d: ShortcutDef): Shortcut {
  return { id: d.id, label: d.label, keys: d.combo.map(keyLabel) as KeyCombo, context: d.context };
}

/** Vue du catalogue destinée à `<ds-shortcuts-panel>`, touches déjà résolues. */
export const SHORTCUT_GROUPS: ShortcutGroup[] = SHORTCUT_CATEGORIES.map((c) => ({
  key: c.key,
  label: c.label,
  shortcuts: SHORTCUTS.filter((d) => d.groups.includes(c.key)).map(toShortcut),
})).filter((g) => g.shortcuts.length > 0);

/** Index signature → définition, limité aux raccourcis réellement captés.
 *  Les doublons sont écartés : la première définition gagne. */
export const BOUND_SHORTCUTS: ReadonlyMap<string, ShortcutDef> = (() => {
  const map = new Map<string, ShortcutDef>();
  for (const d of SHORTCUTS) {
    if (d.bind === false) continue;
    const sig = comboSignature(d.combo);
    if (!map.has(sig)) map.set(sig, d);
  }
  return map;
})();

export const SHORTCUTS_BY_ID: ReadonlyMap<string, ShortcutDef> = new Map(
  SHORTCUTS.map((d) => [d.id, d]),
);

/**
 * Lettres qui portent au moins un raccourci capté. Le clavier de l'onglet
 * Layout les allume : on voit d'un coup d'œil quelle part du clavier travaille,
 * et où il reste de la place.
 */
export const SHORTCUT_LETTERS: ReadonlySet<string> = new Set(
  [...BOUND_SHORTCUTS.values()]
    .flatMap((d) => d.combo)
    .filter((t) => /^[a-z]$/.test(t)),
);
