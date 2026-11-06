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
  /** Catégorie de la feature : les écrans d'une même catégorie sont groupés sous son titre. */
  category?: string;
}

const V1: ScreenVersion = { major: 1, minor: 0, patch: 0 };

export const SCREENS: Screen[] = [
  { path: 'home', label: 'Home', hint: 'Product home', version: { ...V1 } },
  { path: 'accordion', label: 'With Accordion', hint: 'Accordion variant', version: { ...V1 } },
  { path: 'modal', label: 'With Modal', hint: 'Modal variant', version: { ...V1 } },
  { path: 'filters', label: 'Filters', hint: 'Search filters', version: { ...V1 } },
  { path: 'search', label: 'Search', hint: 'Company search', version: { major: 1, minor: 1, patch: 3 } },
  { path: 'search-v2', label: 'Search V2', hint: 'Buyers and policies', version: { major: 1, minor: 0, patch: 1 } },
  { path: 'admin-data', label: 'Admin Data', hint: 'Admin data editing', version: { major: 1, minor: 1, patch: 3 } },
  { path: 'tag-configuration', label: 'TAG Configuration', hint: 'Auto-grading rules', version: { major: 1, minor: 2, patch: 3 } },
  { path: 'portfolio-management', label: 'Portfolio Management', hint: 'Buyer portfolios per owner', version: { major: 1, minor: 2, patch: 0 } },
  { path: 'grade-story', label: 'Grade Story', hint: 'Grading narrative', version: { ...V1 } },
  { path: 'spotlight', label: 'Spotlight', hint: 'Featured item', version: { major: 1, minor: 1, patch: 0 } },
  { path: 'notification-module', label: 'Notification Module', hint: 'Notification center', version: { major: 1, minor: 2, patch: 1 } },
  { path: 'buyer-summary/137381425', label: 'Buyer Summary', hint: 'Buyer profile', version: { major: 1, minor: 0, patch: 2 } },
  { path: 'maintenance', label: 'Maintenance', hint: 'Product downtime state', version: { ...V1 } },
  { path: 'loading', label: 'Loading', hint: 'Initial app loading state', version: { ...V1 } },
  { path: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', hint: 'Shortcut reference panel', version: { ...V1 } },
  { path: 'card-builder-lab', label: 'Card Builder Lab', hint: 'Custom card builder redesign', version: { major: 1, minor: 0, patch: 1 } },
  { path: 'coverbook/buyer/4421706', label: 'Coverbook - Buyer', hint: 'Buyer covers: credit limits and grade based covers', version: { major: 1, minor: 0, patch: 2 } },
  { path: 'coverbook/policy/2590417133', label: 'Coverbook - Policy', hint: 'Policy covers: credit limits and grade based covers', version: { major: 1, minor: 0, patch: 3 } },
  { path: 'manual-underwriting/4421706', label: 'Manual Underwriting', hint: 'Answer a credit limit request: cards, completion and sending', version: { major: 1, minor: 0, patch: 3 } },
  { path: 'reject-management', label: 'Reject Management', hint: 'Rejects by category, in a table', version: { major: 1, minor: 1, patch: 3 }, category: 'Reject Management' },
];

export function versionLabel(v: ScreenVersion): string {
  return `v${v.major}.${v.minor}.${v.patch}`;
}
