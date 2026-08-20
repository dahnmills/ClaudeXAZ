export interface ScreenVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface Screen {
  path: string;
  label: string;
  hint: string;
  version: ScreenVersion;
}

const V1: ScreenVersion = { major: 1, minor: 0, patch: 0 };

export const SCREENS: Screen[] = [
  { path: 'home', label: 'Home', hint: 'Accueil du produit', version: { ...V1 } },
  { path: 'accordion', label: 'With Accordion', hint: 'Variante accordéon', version: { ...V1 } },
  { path: 'modal', label: 'With Modal', hint: 'Variante modale', version: { ...V1 } },
  { path: 'filters', label: 'Filters', hint: 'Filtres de recherche', version: { ...V1 } },
  { path: 'search', label: 'Search', hint: 'Recherche d\'entreprises', version: { ...V1 } },
  { path: 'admin-data', label: 'Admin Data', hint: 'Édition des données admin', version: { ...V1 } },
  { path: 'tag-configuration', label: 'TAG Configuration', hint: 'Règles d\'auto-grading', version: { ...V1 } },
  { path: 'grade-story', label: 'Grade Story', hint: 'Récit de notation', version: { ...V1 } },
  { path: 'spotlight', label: 'Spotlight', hint: 'Mise en avant', version: { ...V1 } },
  { path: 'notification-module', label: 'Notification Module', hint: 'Centre de notifications', version: { ...V1 } },
  { path: 'buyer-summary/137381425', label: 'Buyer Summary', hint: 'Dossier acheteur', version: { ...V1 } },
];

export function versionLabel(v: ScreenVersion): string {
  return `v${v.major}.${v.minor}.${v.patch}`;
}
