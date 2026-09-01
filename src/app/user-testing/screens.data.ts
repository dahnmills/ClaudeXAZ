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
  { path: 'home', label: 'Home', hint: 'Product home', version: { ...V1 } },
  { path: 'accordion', label: 'With Accordion', hint: 'Accordion variant', version: { ...V1 } },
  { path: 'modal', label: 'With Modal', hint: 'Modal variant', version: { ...V1 } },
  { path: 'filters', label: 'Filters', hint: 'Search filters', version: { ...V1 } },
  { path: 'search', label: 'Search', hint: 'Company search', version: { major: 1, minor: 0, patch: 1 } },
  { path: 'admin-data', label: 'Admin Data', hint: 'Admin data editing', version: { major: 1, minor: 0, patch: 1 } },
  { path: 'tag-configuration', label: 'TAG Configuration', hint: 'Auto-grading rules', version: { major: 1, minor: 0, patch: 3 } },
  { path: 'grade-story', label: 'Grade Story', hint: 'Grading narrative', version: { ...V1 } },
  { path: 'spotlight', label: 'Spotlight', hint: 'Featured item', version: { major: 1, minor: 1, patch: 0 } },
  { path: 'notification-module', label: 'Notification Module', hint: 'Notification center', version: { ...V1 } },
  { path: 'buyer-summary/137381425', label: 'Buyer Summary', hint: 'Buyer profile', version: { ...V1 } },
  { path: 'maintenance', label: 'Maintenance', hint: 'Product downtime state', version: { ...V1 } },
  { path: 'loading', label: 'Loading', hint: 'Initial app loading state', version: { ...V1 } },
];

export function versionLabel(v: ScreenVersion): string {
  return `v${v.major}.${v.minor}.${v.patch}`;
}
