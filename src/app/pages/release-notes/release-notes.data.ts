export type ReleaseCategory = 'feature' | 'fix' | 'design' | 'content';

export interface ReleaseNote {
  id: string; // stable slug, used in the /release-notes/:id detail route
  date: string; // 'YYYY-MM-DD'
  category: ReleaseCategory;
  screens: string[]; // paths into SCREENS; empty array = meta/harness change
  title: string;
  description: string;
  changes: string[]; // itemized breakdown, shown in the entry's detail view
}

export const CATEGORY_LABELS: Record<ReleaseCategory, string> = {
  feature: 'Feature',
  fix: 'Fix',
  design: 'Design',
  content: 'Content',
};

// Newest first. Prepend a new entry here at every push that changes a Qirin
// screen or feature. Meta/harness work (hub, prototype listing, isolated
// listing, the release notes system itself, dev inspector, Echo widget) is
// out of scope for this changelog — it's about Qirin, not the test harness.
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    id: 'translate-qirin-screens-to-english',
    date: '2026-08-20',
    category: 'content',
    screens: ['search', 'admin-data', 'tag-configuration'],
    title: 'Translate Search, Admin Data, and TAG Configuration to English',
    description:
      'Replaced the remaining French copy on the screens buyers and analysts actually use: search, admin data editing, and TAG configuration.',
    changes: [
      'Translated the "Recent searches" label in the search flyout',
      'Translated the "Transports aériens réguliers" activity/trade-sector label in Admin Data',
      'Translated the "Liquidation simplifiée" status reason and the history month abbreviations in TAG Configuration',
      'Fixed a broken confirmation string ("Chose an option :" → "Choose an option:") in TAG Configuration',
    ],
  },
];
