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
    id: 'spotlight-filter-bubbles',
    date: '2026-09-01',
    category: 'feature',
    screens: ['spotlight'],
    title: 'Spotlight: filter bubbles and a liquid-glass morph',
    description:
      'The quick-search palette gains two filter bubbles alongside the bar (country, and which field is searched — name or ID), in the manner of macOS Spotlight. Opening one makes the bar swallow the bubbles and grow into its panel; closing it makes the material split back into bubbles.',
    changes: [
      'Added two filter bubbles next to the search bar: country (flag) and searched field (Aa / ID). Filtering by country narrows the results; switching to ID searches the identifier instead of the name',
      'Opening a bubble morphs rather than fades: the bar absorbs the bubbles, widens, and its panel reveals the option list by growing downward. The magnifier is replaced by the category icon, which becomes a back chevron on hover',
      'Closing a bubble plays a liquid fission: the bar\'s right edge stays stretched, a mass inflates out of it and detaches through a thinning neck, then splits into the bubbles — no fade anywhere in the sequence, and the icons only appear once the bubbles are stable',
      'While a country panel is open the bar filters that list instead of the corpus, and the business query typed beforehand is restored on close',
      'Reworked the palette\'s glass material (translucency, specular edge, layered drop shadow) so the bar, the bubbles and the morphing material read as one surface',
      'The whole choreography collapses to instant state changes under prefers-reduced-motion',
    ],
  },
  {
    id: 'loading-screen',
    date: '2026-08-31',
    category: 'feature',
    screens: ['loading'],
    title: 'Add an initial app loading screen',
    description:
      'A full-screen loading state for the app\'s first load: the Qirin mark connects to a device with a chase-dot animation, settling on "Connecting" once ready, with rotating usage tips underneath.',
    changes: [
      'Added the loading screen: mark and computer icon animate together once, then settle centered with the "Connecting" status',
      'Added rotating usage tips (search, buyer dossiers, filters, TAG rule reordering, notifications, release notes), paused under prefers-reduced-motion',
      'Added `markOnly` to `ds-logo` and `indeterminate` to `ds-progress-bar`, and a `monitor` icon to the shared icon registry',
      'Added to the screen catalogue and the isolated-universe listing so it can be tested standalone',
    ],
  },
  {
    id: 'tag-configuration-promote-filter-chip',
    date: '2026-08-26',
    category: 'fix',
    screens: ['tag-configuration'],
    title: 'TAG Configuration: internal refactor, no visible change',
    description:
      'The multi-select filter field used in the rule modal (Sensitivity, NACE, Legal form, etc.) was promoted from a page-local component into the shared design system, and a missing color token used by the stepper was defined.',
    changes: [
      'Renamed the multi-select filter field component from `tag-filter-chip` to `ds-tag-filter-chip` and moved it into shared/ui — same markup, same styling, zero visible change',
      'Defined the previously-missing `--semantic-color-static-text-main-reversed` token (was silently falling back to a hardcoded #fff in the stepper) — same resolved color, just no longer a silent gap',
    ],
  },
  {
    id: 'maintenance-screen',
    date: '2026-08-25',
    category: 'feature',
    screens: ['maintenance'],
    title: 'Add a maintenance screen',
    description:
      'A full-screen "Qirin is down" state for planned outages: no navigation, no shell — when the product is unavailable there is nowhere else to send the user.',
    changes: [
      'Added the maintenance screen with the product\'s brand blue, Allianz Neo type, and a bespoke abstract network illustration',
      'No header, side-nav, links, or buttons — the page is intentionally a dead end',
      'Added to the screen catalogue and the isolated-universe listing so it can be tested standalone',
    ],
  },
  {
    id: 'tag-configuration-rule-card-fill-layout',
    date: '2026-08-20',
    category: 'design',
    screens: ['tag-configuration'],
    title: 'TAG Configuration: fill-width rule columns, reordered',
    description:
      'The rule list header now uses the row\'s full width instead of a fixed pixel layout, and shows two criteria that used to be hidden in the expanded detail.',
    changes: [
      'Changed the rule row header from fixed 150px columns to fill columns that scale with the available width',
      'Reordered columns: Sensitivity, Exposure, New autograde, Last checked autograde, Current valid grade, Valid grade type, Valid grade freshness',
      'Removed NACE from the header row (still shown in the expanded "Other" section)',
      'Promoted valid grade type and freshness from the expanded detail into the header row; removed the now-duplicated rows from the detail panel',
      'Reserved a fixed width for the decision/status badges so they always dock at the same position against the row\'s actions divider, regardless of label length',
    ],
  },
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
