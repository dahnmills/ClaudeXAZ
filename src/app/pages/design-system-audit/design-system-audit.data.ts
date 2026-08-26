/**
 * Snapshot des audits du 2026-08-25/26 (portability + cartography). Pas un
 * scan live : toute évolution du DS depuis cette date ne sera pas reflétée
 * ici tant que le fichier n'est pas régénéré à la main.
 */

export type ComponentStatus = 'core' | 'niche' | 'orphan' | 'duplicate' | 'internal';

export interface DsComponentEntry {
  /** Nom affiché, ex. "Button". */
  name: string;
  /** Dossier dans shared/ui. */
  folder: string;
  /** Catégorie Storybook (2e segment du title) ou catégorie déduite. */
  category: string;
  /** Titre Storybook exact (meta.title), null si aucune story. */
  storybookTitle: string | null;
  /** false si la story existe mais n'a pas le tag 'autodocs' (lien moins fiable). */
  hasAutodocs: boolean;
  /** Nombre exact de pages consommatrices, quand l'audit l'a compté précisément. */
  usageCount: number | null;
  /** Pages nommées, quand connu (sinon null = non détaillé dans l'audit). */
  usagePages: string[] | null;
  status: ComponentStatus;
  note?: string;
  /** Dossier du composant jumeau, pour les doublons. */
  duplicateOf?: string;
}

export const DS_COMPONENTS: DsComponentEntry[] = [
  // ── Core : forte adoption, story OK ─────────────────────────────────────
  { name: 'Icon', folder: 'icon', category: 'Foundation', storybookTitle: 'Design System/Foundation/Icon', hasAutodocs: true, usageCount: 119, usagePages: null, status: 'core' },
  { name: 'Input Text', folder: 'input-text', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Input Text', hasAutodocs: true, usageCount: 78, usagePages: null, status: 'core' },
  { name: 'Button', folder: 'button', category: 'Action', storybookTitle: 'Design System/Action/Button', hasAutodocs: true, usageCount: 56, usagePages: null, status: 'core' },
  { name: 'Tab', folder: 'tab', category: 'Action', storybookTitle: 'Design System/Action/Tab', hasAutodocs: true, usageCount: 39, usagePages: null, status: 'core' },
  { name: 'Select', folder: 'select', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Select', hasAutodocs: true, usageCount: 36, usagePages: null, status: 'core' },
  { name: 'Flyout Menu Item', folder: 'flyout-menu', category: 'Internals', storybookTitle: 'Design System/Internals/Flyout Menu Item', hasAutodocs: true, usageCount: 36, usagePages: null, status: 'core' },
  { name: 'Button Icon', folder: 'button-icon', category: 'Action', storybookTitle: 'Design System/Action/Button Icon', hasAutodocs: true, usageCount: 32, usagePages: null, status: 'core' },
  { name: 'Crumb', folder: 'crumb', category: 'Action', storybookTitle: 'Design System/Action/Crumb', hasAutodocs: true, usageCount: 29, usagePages: null, status: 'core' },
  { name: 'Cell Header', folder: 'table', category: 'Data Display/Table', storybookTitle: 'Design System/Data Display/Table/Cell Header', hasAutodocs: true, usageCount: 29, usagePages: null, status: 'core' },
  { name: 'Properties Panel', folder: 'properties-panel', category: 'Data Display', storybookTitle: 'Design System/Data Display/Properties Panel', hasAutodocs: true, usageCount: 23, usagePages: null, status: 'core' },
  { name: 'Cell', folder: 'table', category: 'Data Display/Table', storybookTitle: 'Design System/Data Display/Table/Cell', hasAutodocs: true, usageCount: 22, usagePages: null, status: 'core' },
  { name: 'Modal', folder: 'modal', category: 'Layout', storybookTitle: 'Design System/Layout/Modal', hasAutodocs: true, usageCount: 21, usagePages: null, status: 'core' },
  { name: 'Badge', folder: 'badge', category: 'Feedback', storybookTitle: 'Design System/Feedback/Badge', hasAutodocs: true, usageCount: 15, usagePages: null, status: 'core' },
  { name: 'Link', folder: 'link', category: 'Action', storybookTitle: 'Design System/Action/Link', hasAutodocs: true, usageCount: 14, usagePages: null, status: 'core' },
  { name: 'Flyout Menu', folder: 'flyout-menu', category: 'Action', storybookTitle: 'Design System/Action/Flyout Menu', hasAutodocs: true, usageCount: 13, usagePages: null, status: 'core' },
  { name: 'Card', folder: 'card', category: 'Data Display', storybookTitle: 'Design System/Data Display/Card', hasAutodocs: true, usageCount: 12, usagePages: null, status: 'core' },
  { name: 'Widget Card', folder: 'widget-card', category: 'Data Display', storybookTitle: 'Design System/Data Display/Widget Card', hasAutodocs: true, usageCount: 11, usagePages: null, status: 'core' },
  { name: 'Page Header', folder: 'page-header', category: 'Layout', storybookTitle: 'Design System/Layout/Page Header', hasAutodocs: true, usageCount: 9, usagePages: null, status: 'core' },
  { name: 'Breadcrumbs', folder: 'breadcrumbs', category: 'Action', storybookTitle: 'Design System/Action/Breadcrumbs', hasAutodocs: true, usageCount: 9, usagePages: null, status: 'core' },
  { name: 'Table Row', folder: 'table', category: 'Data Display/Table', storybookTitle: 'Design System/Data Display/Table/Table Row', hasAutodocs: true, usageCount: 8, usagePages: null, status: 'core' },
  { name: 'Page Title', folder: 'page-title', category: 'Layout', storybookTitle: 'Design System/Layout/Page Title', hasAutodocs: true, usageCount: 8, usagePages: null, status: 'core' },
  { name: 'Checkbox', folder: 'checkbox', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Checkbox', hasAutodocs: true, usageCount: 7, usagePages: null, status: 'core' },

  // ── Usage ponctuel légitime (1-2 pages) ─────────────────────────────────
  { name: 'Standalone Dropdown', folder: 'standalone-dropdown', category: 'Action', storybookTitle: 'Design System/Action/Standalone Dropdown', hasAutodocs: true, usageCount: 1, usagePages: ['topbox (démo)'], status: 'niche' },
  { name: 'Side Nav', folder: 'side-nav', category: 'Layout', storybookTitle: 'Design System/Layout/Side Nav', hasAutodocs: true, usageCount: 1, usagePages: ['topbox (démo)'], status: 'niche' },
  { name: 'Logo', folder: 'logo', category: 'Foundation', storybookTitle: 'Design System/Foundation/Logo', hasAutodocs: true, usageCount: 1, usagePages: ['topbox (démo)'], status: 'niche' },
  { name: 'Header', folder: 'header', category: 'Layout', storybookTitle: 'Design System/Layout/Header', hasAutodocs: true, usageCount: 1, usagePages: ['topbox (démo)'], status: 'niche' },
  { name: 'Segmented Control', folder: 'segmented-control', category: 'Action', storybookTitle: 'Design System/Action/Segmented Control', hasAutodocs: true, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche' },
  { name: 'Pie Chart', folder: 'pie-chart', category: 'Data Display', storybookTitle: 'Design System/Data Display/Pie Chart', hasAutodocs: true, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche' },
  { name: 'Newsfeed', folder: 'newsfeed', category: 'Data Display', storybookTitle: 'Design System/Data Display/Newsfeed', hasAutodocs: true, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche' },
  { name: 'Drawer', folder: 'drawer', category: 'Layout', storybookTitle: 'Design System/Layout/Drawer', hasAutodocs: false, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche', note: "Story sans tag 'autodocs' — lien vers la story Default plutôt que la page docs." },
  { name: 'Input Search', folder: 'input-search', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Input Search', hasAutodocs: true, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche' },
  { name: 'Grid Selection', folder: 'grid-selection', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Grid Selection', hasAutodocs: true, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche' },
  { name: 'Chart', folder: 'chart', category: 'Data Display', storybookTitle: 'Design System/Data Display/Chart', hasAutodocs: true, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche' },
  { name: 'Grade', folder: 'grade', category: 'Data Display', storybookTitle: 'Design System/Data Display/Grade', hasAutodocs: true, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche' },
  { name: 'Button Split', folder: 'button-split', category: 'Action', storybookTitle: 'Design System/Action/Button Split', hasAutodocs: true, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche' },
  { name: 'Spotlight', folder: 'spotlight', category: 'UI', storybookTitle: 'UI/Spotlight', hasAutodocs: true, usageCount: 1, usagePages: ['buyer-summary'], status: 'niche', note: "Titre Storybook hors taxonomie 'Design System/*' — incohérence de nommage." },
  { name: 'Search Bar Multi', folder: 'search-bar-multi', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Search Bar Multi', hasAutodocs: true, usageCount: 1, usagePages: ['search'], status: 'niche' },
  { name: 'More Criteria', folder: 'more-criteria', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/More Criteria', hasAutodocs: true, usageCount: 1, usagePages: ['search'], status: 'niche' },
  { name: 'Result Card', folder: 'result-card', category: 'Data Display', storybookTitle: 'Design System/Data Display/Result Card', hasAutodocs: true, usageCount: 1, usagePages: ['search'], status: 'niche' },
  { name: 'Date Range', folder: 'date-range', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Date Range', hasAutodocs: true, usageCount: 1, usagePages: null, status: 'niche' },
  { name: 'Search Bar', folder: 'search-bar', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Search Bar', hasAutodocs: true, usageCount: 1, usagePages: ['home'], status: 'niche', note: "Confirmé distinct de Search Bar Multi (vérifié à la main, pas un doublon)." },
  { name: 'Action Card', folder: 'action-card', category: 'Data Display', storybookTitle: 'Design System/Data Display/Action Card', hasAutodocs: true, usageCount: 1, usagePages: ['admin-data'], status: 'niche', note: "Corrigé le 2026-08-26 — l'audit initial le listait orphelin (0 usage), mais il est bien utilisé (variant selectable) dans admin-data.component.html:118, sélecteur d'activité." },
  { name: 'Filter Drawer', folder: 'filter-drawer', category: 'Layout', storybookTitle: 'Design System/Layout/Filter Drawer', hasAutodocs: true, usageCount: 2, usagePages: null, status: 'niche' },
  { name: 'Radio Card', folder: 'radio-card', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Radio Card', hasAutodocs: true, usageCount: 2, usagePages: null, status: 'niche' },
  { name: 'Stepper', folder: 'stepper', category: 'Navigation', storybookTitle: 'Design System/Navigation/Stepper', hasAutodocs: true, usageCount: 2, usagePages: ['company-creation-wizard', 'company-edit-wizard'], status: 'niche' },
  { name: 'Tag Filter Chip', folder: 'tag-filter-chip', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Tag Filter Chip', hasAutodocs: true, usageCount: 1, usagePages: ['tag-configuration (via rule-modal)'], status: 'niche', note: "Promu depuis pages/tag-configuration/components/ le 2026-08-26 — était déjà bien construit, juste jamais déplacé." },

  // ── Chip vs Tag vs Badge : distincts dans Figma — pas un doublon, ne pas fusionner ──
  { name: 'Chip', folder: 'chip', category: 'Action', storybookTitle: 'Design System/Action/Chip', hasAutodocs: true, usageCount: 1, usagePages: ['tag-filter-chip (interne)'], status: 'internal', note: "L'audit initial le comparait à Tag sur la seule API (props/ARIA similaires) — mais Chip, Tag et Badge sont 3 composants distincts dans Figma. Source de vérité = Figma, pas le code : pas une fusion à faire, malgré la ressemblance de surface." },
  { name: 'Tag', folder: 'tag', category: 'Action', storybookTitle: 'Design System/Action/Tag', hasAutodocs: true, usageCount: null, usagePages: ['properties-panel (interne)', 'action-card (interne)'], status: 'internal' },

  // ── Select Button / Tile : requalifié — pas un doublon (specs visuelles distinctes) ──
  { name: 'Select Button', folder: 'select-button', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Select Button', hasAutodocs: true, usageCount: 0, usagePages: null, status: 'orphan', note: "L'audit initial le classait doublon de Tile (API similaire), mais leurs specs visuelles sont distinctes : Select Button = rectangle 160px bordé + sous-label optionnel ; Tile = carré fixe 104×104 sans bordure. Probablement deux composants Figma différents, pas un doublon. Orphelin (0 usage) reste vrai." },
  { name: 'Tile', folder: 'tile', category: 'Action', storybookTitle: 'Design System/Action/Tile', hasAutodocs: true, usageCount: 0, usagePages: null, status: 'orphan', note: 'Voir Select Button — requalifié, pas un doublon.' },

  // ── Orphelins : construits, storyés, jamais adoptés ─────────────────────
  { name: 'Timeline Event', folder: 'timeline', category: 'Internals', storybookTitle: 'Design System/Internals/Timeline Event', hasAutodocs: true, usageCount: 0, usagePages: null, status: 'orphan' },
  { name: 'Toggle', folder: 'toggle', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Toggle', hasAutodocs: true, usageCount: 0, usagePages: null, status: 'orphan' },
  { name: 'Popover', folder: 'popover', category: 'Feedback', storybookTitle: 'Design System/Feedback/Popover', hasAutodocs: true, usageCount: 0, usagePages: null, status: 'orphan' },
  { name: 'Flyout (panel de base)', folder: 'flyout', category: 'Layout', storybookTitle: 'Design System/Layout/Flyout', hasAutodocs: true, usageCount: 0, usagePages: null, status: 'orphan', note: 'Flyout Menu (qui l’utilise en interne) est bien adopté — seul le panel de base, utilisé directement, ne l’est pas.' },

  // ── Composés internes (utilisés uniquement via un autre composant DS) ───
  { name: 'Flyout Item', folder: 'flyout', category: 'Internals', storybookTitle: 'Design System/Internals/Flyout Item', hasAutodocs: true, usageCount: null, usagePages: null, status: 'internal' },
  { name: 'Flyout Section', folder: 'flyout', category: 'Internals', storybookTitle: 'Design System/Internals/Flyout Section', hasAutodocs: true, usageCount: null, usagePages: null, status: 'internal' },
  { name: 'Icon Tile', folder: 'icon-tile', category: 'Foundation', storybookTitle: 'Design System/Foundation/Icon Tile', hasAutodocs: true, usageCount: null, usagePages: ['result-card (interne)', 'action-card (interne)'], status: 'internal' },
  { name: 'Modal Content', folder: 'modal', category: 'Internals', storybookTitle: 'Design System/Internals/Modal Content', hasAutodocs: true, usageCount: null, usagePages: null, status: 'internal' },
  { name: 'Modal Header', folder: 'modal', category: 'Internals', storybookTitle: 'Design System/Internals/Modal Header', hasAutodocs: true, usageCount: null, usagePages: null, status: 'internal' },
  { name: 'Modal Footer', folder: 'modal', category: 'Internals', storybookTitle: 'Design System/Internals/Modal Footer', hasAutodocs: true, usageCount: null, usagePages: null, status: 'internal' },
  { name: 'Side Nav Item', folder: 'side-nav', category: 'Internals', storybookTitle: 'Design System/Internals/Side Nav Item', hasAutodocs: true, usageCount: null, usagePages: ['side-nav (interne)'], status: 'internal' },

  // ── Reste du catalogue : jamais mentionné dans les audits (pas de souci signalé) ──
  { name: 'Accordion', folder: 'accordion', category: 'Data Display', storybookTitle: 'Design System/Data Display/Accordion', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Button Range', folder: 'button-range', category: 'Action', storybookTitle: 'Design System/Action/Button Range', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Button Range Group', folder: 'button-range', category: 'Action', storybookTitle: 'Design System/Action/Button Range Group', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Checkbox Card', folder: 'checkbox-card', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Checkbox Card', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Collapsible Table', folder: 'collapsible-table', category: 'Data Display', storybookTitle: 'Design System/Data Display/Collapsible Table', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: "Sa story écrit à la main un tableau HTML de tokens CSS bruts pour documenter les «Design Tokens» — pas d'addon partagé derrière, risque de drift avec les vrais tokens." },
  { name: 'Popin (Confirm Dialog)', folder: 'confirm-dialog', category: 'Feedback', storybookTitle: 'Design System/Feedback/Popin', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Divider', folder: 'divider', category: 'Foundation', storybookTitle: 'Design System/Foundation/Divider', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Flag', folder: 'flag', category: 'Foundation', storybookTitle: 'Design System/Foundation/Flag', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Functional Notice', folder: 'functional-notice', category: 'Feedback', storybookTitle: 'Design System/Feedback/Functional Notice', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Inline Edit', folder: 'inline-edit', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Inline Edit', hasAutodocs: false, usageCount: null, usagePages: null, status: 'niche', note: "Non détaillé dans l’audit. Story sans tag 'autodocs' — lien vers la story Default plutôt que la page docs." },
  { name: 'Input Date', folder: 'input-date', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Input Date', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Input Email', folder: 'input-email', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Input Email', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'List Widget', folder: 'list-widget', category: 'Data Display', storybookTitle: 'Design System/Data Display/List Widget', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Pagination', folder: 'pagination', category: 'Action', storybookTitle: 'Design System/Action/Pagination', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Progress Bar', folder: 'progress-bar', category: 'Feedback', storybookTitle: 'Design System/Feedback/Progress Bar', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Radio', folder: 'radio', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Radio', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Cell Action', folder: 'table', category: 'Data Display/Table', storybookTitle: 'Design System/Data Display/Table/Cell Action', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Cell Selection', folder: 'table', category: 'Data Display/Table', storybookTitle: 'Design System/Data Display/Table/Cell Selection', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Textarea', folder: 'textarea', category: 'Data Entry', storybookTitle: 'Design System/Data Entry/Textarea', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Timeline', folder: 'timeline', category: 'Data Display', storybookTitle: 'Design System/Data Display/Timeline', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Toaster', folder: 'toaster', category: 'Feedback', storybookTitle: 'Design System/Feedback/Toaster', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche' },
  { name: 'Tooltip', folder: 'tooltip', category: 'Feedback', storybookTitle: 'Design System/Feedback/Tooltip', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Topbox', folder: 'topbox', category: 'Layout', storybookTitle: 'Design System/Layout/Topbox', hasAutodocs: true, usageCount: 1, usagePages: ['topbox (démo)'], status: 'niche' },
  { name: 'Visual Button', folder: 'visual-button', category: 'Action', storybookTitle: 'Design System/Action/Visual Button', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche', note: 'Non détaillé dans l’audit.' },
  { name: 'Snackbar', folder: 'snackbar', category: 'Feedback', storybookTitle: 'Design System/Feedback/Snackbar', hasAutodocs: true, usageCount: null, usagePages: null, status: 'niche' },
];

export interface MutualizationTarget {
  title: string;
  description: string;
  occurrences: string[];
  effort: 'faible' | 'moyen' | 'élevé';
  /** En pause sur décision produit — cf. note. Pas abandonné, juste pas priorisé. */
  onHold?: string;
}

export const MUTUALIZATION_TARGETS: MutualizationTarget[] = [
  {
    title: 'Wizard shell',
    description: "Structure complète dupliquée à l'identique : .wizard__cols/steps/panel/row/card/group/footer, même ds-stepper, même footer Back/Next, mêmes types de step (adresse, contacts, activités...). Jamais extrait en molécule ds-wizard.",
    occurrences: [
      'pages/search/company-creation-wizard/company-creation-wizard.component.html',
      'pages/admin-data/company-edit-wizard/company-edit-wizard.component.html',
    ],
    effort: 'élevé',
    onHold: "Mis en pause le 2026-08-26 — on ne mutualise aucun des 3 patterns pour le moment.",
  },
  {
    title: 'Clickable option row',
    description: "Icône + label + info secondaire, cliquable — recodé 3× indépendamment. 2 des 3 vivent déjà dans le DS sans se connaître.",
    occurrences: [
      'shared/ui/search-bar/search-bar.component.html (flyout item)',
      'shared/ui/spotlight/spotlight.component.html (row)',
      'pages/search/search.component.html (recent-search row)',
    ],
    effort: 'moyen',
    onHold: "Mis en pause le 2026-08-26 — on ne mutualise aucun des 3 patterns pour le moment.",
  },
  {
    title: 'Empty state',
    description: 'Icône + message + CTA optionnel, même forme répétée sans atome partagé.',
    occurrences: [
      'pages/search/search.component.html (×4)',
      'pages/tag-configuration/tag-configuration.component.html (×2)',
    ],
    effort: 'moyen',
    onHold: "Mis en pause le 2026-08-26 — on ne mutualise aucun des 3 patterns pour le moment.",
  },
  {
    title: 'Boutons natifs dans buyer-summary',
    description: "L'audit initial supposait ~17 <button> natifs réutilisables tels quels (ds-tab, ds-tile, ds-radio-card, ds-checkbox-card, ds-button-icon, ds-segmented-control). Vérifié CSS par CSS le 2026-08-26 : chaque bouton a un style bespoke délibéré (bordures dashed sur les CTA, dimensions/indicateur différents de ds-tab, formes propres pour les pickers de taille/layout/bloc). Aucun n'est un remplacement au pixel sans changer le rendu — même schéma que Select Button/Tile.",
    occurrences: ['pages/buyer-summary/buyer-summary.component.html'],
    effort: 'moyen',
    onHold: "Décision du 2026-08-26 : on ne force pas ces boutons vers des atomes DS sans vérification Figma/visuelle au préalable — risque de changement de rendu.",
  },
  {
    title: 'Upload de fichier',
    description: "<input type=\"file\"> natif — vrai trou, aucun atome file-upload n'existe dans le DS.",
    occurrences: ['pages/tag-configuration/components/import-rules-modal.component.html'],
    effort: 'moyen',
  },
];

export interface OrphanCandidate {
  /** Dossier du composant orphelin (clé vers DsComponentEntry.folder). */
  orphanFolder: string;
  orphanName: string;
  /** true si un site d'adoption plausible a été trouvé dans pages/**. */
  candidateFound: boolean;
  site?: string;
  description?: string;
  caveat?: string;
}

// Recherche du 2026-08-26 : pour chaque orphelin, y a-t-il un pattern natif
// dans pages/** qui pourrait raisonnablement l'adopter ? Vérifié CSS par CSS
// avant de suggérer quoi que ce soit — après le coup Select Button/Tile, une
// ressemblance de forme ne suffit pas, il faut un vrai match visuel.
export const ORPHAN_CANDIDATES: OrphanCandidate[] = [
  {
    orphanFolder: 'flyout',
    orphanName: 'Flyout (panel de base)',
    candidateFound: true,
    site: 'pages/buyer-summary/buyer-summary.component.html:96-126 (.bs-toolbar) et :603-620 (.bs-cv-toolbar)',
    description: "Les deux toolbars flottantes de buyer-summary réinventent à la main exactement le chrome de ds-flyout — même token --semantic-shadow-flyout, même border-radius. Le match le plus littéral des 5.",
    caveat: "ds-flyout est role=\"dialog\" avec min-width 290px, pensé pour un menu déroulant — ces toolbars sont compactes, déclenchées au survol/sélection, pas par un cycle ouverture/fermeture. Adapter l'atome (ou accepter le mismatch de largeur/sémantique) avant de swapper.",
  },
  {
    orphanFolder: 'action-card',
    orphanName: 'Action Card',
    candidateFound: true,
    site: 'pages/hub/hub.page.html:12-34 (.zone)',
    description: "Les tuiles du hub (icône + eyebrow/titre + description + CTA fléché) ont quasiment la même forme que le variant standard de ds-action-card.",
    caveat: "hub.page est délibérément hors-DS (couleurs hex en dur, palette --accent par tuile, police Bricolage Grotesque, animation de survol propre). Swap = perdre ce theming à moins d'étendre l'atome. Déjà correctement utilisé ailleurs (admin-data, variant selectable) — ce n'est plus un vrai orphelin.",
  },
  {
    orphanFolder: 'toggle',
    orphanName: 'Toggle',
    candidateFound: false,
    description: "Aucun switch on/off natif trouvé dans pages/**. Tous les contrôles booléens repérés utilisent déjà ds-checkbox correctement.",
  },
  {
    orphanFolder: 'popover',
    orphanName: 'Popover',
    candidateFound: false,
    description: "Aucun panel avec flèche + en-tête + bouton fermer trouvé dans pages/**. Le near-miss le plus proche (.nm-datefield__panel dans notification-module) n'a ni flèche ni en-tête — c'est un wrapper de positionnement pour ds-date-range, pas un popover.",
  },
  {
    orphanFolder: 'timeline',
    orphanName: 'Timeline Event',
    candidateFound: false,
    description: "Aucun rail chronologique (points + ligne + header collapsible) trouvé. history-row.component (tag-configuration) est une ligne de tableau à plat, pas une timeline — forcer le match serait artificiel.",
  },
];

export function storybookSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
