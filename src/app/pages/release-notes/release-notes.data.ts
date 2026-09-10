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
// out of scope for this changelog: it's about Qirin, not the test harness.
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    id: 'tag-configuration-copy-currency',
    date: '2026-09-10',
    category: 'fix',
    screens: ['tag-configuration'],
    title: 'TAG Configuration: a copied threshold keeps its own currency',
    description:
      'Review pass over the whole screen. A set copied from another country was showing its exposure thresholds in the currency of the country it landed in, while the message above the list said the opposite: nothing had been converted. The amount now reads with the currency it was typed in, until someone types a new one.',
    changes: [
      'A threshold copied from another country reads with its original currency on the card and in the rule window, with a line saying it was not converted',
      'Typing the amount again puts it back in the currency of the country, and the count of thresholds left to review drops by one',
      'The message above a copied draft counts only the thresholds still in the other currency, so it stops asking for work already done',
      'Escape now closes the menu of a history line, as it already did on a rule card',
      'One French rule filters on a French legal form, so copying the French set into Norway shows the legal-form warning as well, not only the currency one',
      'Wording with a single rule reads "1 rule carries" and "1 rule filters", instead of the plural verb',
      'In the rule window, a helper line sits under its field without pushing it out of line with the rest of the row, and the one under Freshness stays on once a manual grade is picked',
    ],
  },
  {
    id: 'portfolio-management',
    date: '2026-09-10',
    category: 'feature',
    screens: ['portfolio-management'],
    title: 'Portfolio Management: who holds which buyers',
    description:
      'New screen listing the buyer portfolios, one line per holder. A file can be dropped to reassign buyers in bulk, and a portfolio can be reworked buyer by buyer in a two-column window. The page can also be narrowed to a single portfolio, the way Agenda is switched from one agenda to another. A buyer belongs to one portfolio at a time, so every move says where the buyer came from.',
    changes: [
      'The list gives the holder and the number of buyers held, both sortable, with a per-line menu for "View details" and "Update portfolio"',
      'Checkboxes down the left select lines, the header box selects or clears the whole list, and the count sits above the table',
      '"Upload portfolios" takes an Excel file in two steps: drop the file, then confirm the buyers the file would take away from someone else. Nothing is applied before that confirmation',
      'The confirmation only reports what needs a decision, one red band per buyer with its current and requested portfolio. The reason is written once above the list, not repeated on every line',
      '"Update portfolio" opens the portfolio on the left and the rest of the buyer base on the right. Both columns search on name or on ID, sort three ways, and can be narrowed to what changed',
      'Adding a buyer turns the line green and marks it "New", removing one turns it red and marks it "Removed". Put a buyer back where it started and the line goes plain again',
      'Nothing is applied until "Update", which stays switched off while nothing has moved. Leaving with pending moves asks first',
      'After an update, the message says what happened, including the buyers taken from another portfolio',
      '"Select another portfolio" sits at the right of the page title, where Agenda offers the same move. It opens a directory of the thirteen users and the six teams, searched on login, name, team or country, and narrowed by country in both tabs',
      'Picking a line and asking to switch opens a confirmation naming the holder and the size of the portfolio. Nothing changes before that answer, and cancelling leaves the directory open where it was',
      'Once switched, the page title carries the holder, the table shows that portfolio alone, a band above it says how many portfolios are hidden, and one link brings the whole list back',
      'The portfolio being viewed carries a "Current" badge in the directory and cannot be picked again. A holder with no portfolio yet says so instead of showing an empty table',
      'Switching scope clears the selection, so the header checkbox never picks up lines that are no longer on screen',
      'The two columns of "Update portfolio" drop the sort by buyer ID and gain a sort by status: what changed comes first, the additions on the left, the removals on the right, alphabetical inside each group',
      'Eight portfolios instead of one, held across several teams and countries, so the directory has something to show and the dropped file has somewhere to take buyers from',
    ],
  },
  {
    id: 'tag-configuration-second-review',
    date: '2026-09-08',
    category: 'design',
    screens: ['tag-configuration'],
    title: 'TAG Configuration: searchable references, clearer verdicts, honest reordering',
    description:
      'Second round of review notes on the auto-grading rules. The two fields fed by a reference list can now be searched instead of scrolled. The three verdicts say which of the two grades wins. The evaluation order is written above the list, where the list is read. And moving a rule while a filter is on now actually moves it on screen.',
    changes: [
      'NACE and Legal form open with a search box: type "62" or "program", both find the same sector. The list is back in full the next time you open it',
      'The sector list carries the fifty-odd realistic codes it will have in production, not five',
      'The verdicts are named after the grades in play: "Accept AUG" (the new autograde becomes the valid grade), "Keep MAG" (the new autograde is discarded, the manual grade stays valid), "Create task" (send to manual review before applying). Same colours, same meaning',
      'An exported rule set now carries the codes the API speaks, ACCEPT / REFUSE / CREATE_TASK, instead of display words',
      '"(no grade)" left the two autograde criteria, where an absent autograde is read as OLD anyway. It stays on the current valid grade, the one case nothing else catches',
      'The freshness of the valid grade only opens up for a manual grade. Tick Automatic as well and it greys out, saying why, and its value returns to "Any" instead of being saved out of sight',
      'One permanent line above the list: "Rules are evaluated top to bottom, the first match decides." Under a filter, its right-hand side counts what is hidden',
      'Move up / Move down work on the list you see: a rule lands next to its visible neighbour, the toast gives the position it actually reached, and the two entries grey out on the first and last visible rule',
      'The three-dot menu of a rule now closes on Escape, not only on a click outside',
    ],
  },
  {
    id: 'header-not-dimmed-while-editing',
    date: '2026-09-08',
    category: 'design',
    screens: ['tag-configuration'],
    title: 'The header stops looking disabled while you edit',
    description:
      'While a draft was open, the top bar was faded out but still clickable, and the account menu, being part of it, inherited the fade: you could read the page through it. Faded meant nothing, so the fade is gone. What you can use is shown at full strength, and what actually takes you off the draft still asks before it does.',
    changes: [
      'The header keeps its full opacity while a draft is open, like the side nav next to it, which was never faded in the first place',
      'The account menu and the "?" menu are opaque again: no more page showing through the options',
      'Nothing in the navigation is switched off: the keyboard reference and the account menu stay reachable while editing, which is exactly when they are wanted',
      'Leaving a modified draft still asks the three-way question. Opening a menu is not leaving, so it does not ask',
      'Fixed at the root what was patched at the surface: the fade created a stacking context, which is why the account menu used to slide under the toolbar buttons',
    ],
  },
  {
    id: 'no-em-dashes-in-the-copy',
    date: '2026-09-08',
    category: 'content',
    screens: ['tag-configuration', 'search', 'buyer-summary/137381425', 'keyboard-shortcuts'],
    title: 'Interface copy without em dashes',
    description:
      'The long dash is gone from every text the product shows. It read as machine-written, and a colon, a comma or a full stop says the same thing while sounding like someone wrote it. One use survives: the lone dash that marks an empty value in a table cell.',
    changes: [
      'Field hints, empty states, menu labels and toast messages read with ordinary punctuation: "No field yet. Pick from the catalogue below.", "Small (1x1)", "Draft (not validated)"',
      'The card sizes of the buyer summary, the shortcut names of the reference panel and the copy notices of TAG configuration were rewritten the same way',
      'A lone dash still means "no value" in a table cell or a date range: that one is a symbol, not prose',
    ],
  },
  {
    id: 'tag-configuration-drafts-and-history',
    date: '2026-09-08',
    category: 'feature',
    screens: ['tag-configuration'],
    title: 'TAG Configuration: a draft you own, a history you can act on',
    description:
      'A rule set in progress is now a draft that survives leaving the screen, and it is saved only when you say so. A notice above the rules says which version you are reading and since when, every version in the history carries its own actions, and the rule simulation, which simulated nothing, is gone.',
    changes: [
      'Drafts persist per country: leave the screen, come back, resume where you left off. Nothing is saved automatically: the banner says so, and Save draft sits in the toolbar',
      'Leaving a modified draft asks the real question: keep editing, discard the changes, or save the draft and leave. Switching country while editing goes through the same question',
      'A notice above the rule list says what you are reading: the active version with its number, the date it was validated and its author, plus a word on a draft in progress if there is one. Read-only countries say so there too, instead of in a banner. The page title stays bare, like everywhere else',
      'The actions read from right to left, from the one that moves the work forward to the quiet ones. While editing: Export, Set parameters, Save draft, Create rule, Validate rules. While reading: Export, Edit rules, Create new set',
      'Freshness and the TRANS-NA-EXCL codes are grouped under a Set parameters menu: they are values of the set, not settings of the page',
      'On the page of the active set, Edit rules and Create new set are both greyed out while a draft exists, and both say why on hover, pointing to the same place: the draft is waiting in the History tab. Neither button moves elsewhere, they carry two different intentions: carry on with what exists, or start from something else',
      'Delete draft sits where the draft is: in the banner while you edit it, and in the menu of its history row. The page of the active set no longer offers it',
      'Validating a draft now asks for confirmation and states what it does: the draft becomes the active set, the previous version is archived and stays in the history',
      'Export JSON is available in every state: in the toolbar while reading, while editing, and on each version of the history',
      'Each history row carries its own actions behind a menu, per status: a draft can be resumed or deleted, the active version edited, an archived version reused as a new set. Opening one for edit brings you back to the Configuration tab',
      'The rule creation and edit form opens on the evaluation position: a rule can be placed anywhere in the order, and it is inserted there instead of landing at the end. It is also the only way to move a rule while a filter is active',
      'Legal forms became a national list: a SARL is not offered in Norway. A set copied from another country keeps its foreign legal forms, since dropping them would widen the rule, and flags them on the affected rules',
      'Starting a new set from a previous one now lists the sets of every country, current country first, and warns before copying: what the amounts are denominated in, which legal forms do not exist here. No amount is converted for you',
      'Norway replaces Northern Europe: a country has a currency (NOK) and a legal-form list, a region has neither',
      'Removed the rule simulation and the version comparison modal, which produced random numbers; removed the per-rule Valid / N/C badge, which was decided by nothing; removed "(no role)" from Company role',
      '"Any" now reads the same everywhere: greyed in the collapsed row and in the expanded one, and the exposure operator shows ≤ in both the list and the form',
      'The rule columns hold their position from one row to the next: the decision badge has a reserved width, so a "Create task" no longer squeezes the seven criteria, and labels and values sit on two shared lines, never three',
      'Each criterion column is now as wide as what it has to show: "Last checked autograde" gets the room it needs instead of the same share as "Sensitivity", so nothing is cut down to 1280px, in reading as in editing',
      'Long option lists (grades, NACE, legal forms) scroll inside their own box instead of being cut off by the form around them',
      'Opening one dropdown closes the one already open; the account menu no longer slides under the toolbar buttons while editing',
      'Field labels are semi-bold across the whole design system, and a field label never wraps onto a second line: the two comparison fields of the rule form take the width of two columns instead',
      'A confirmation no longer piles up on top of the rule form: the form steps aside while the question is asked, and comes back untouched, scroll position and typing included, if you keep editing',
    ],
  },
  {
    id: 'notification-module-search-footer',
    date: '2026-09-07',
    category: 'design',
    screens: ['notification-module'],
    title: 'Notification Module: the search form gets a footer',
    description:
      'The vertical rule and the column of actions beside the fields are gone. The eight criteria now take the full width of the card, and a rule running from edge to edge closes them off: under it, Include copies on the left, Reset and Search on the right.',
    changes: [
      'The four filters and the four ID fields spread over the whole card: four equal columns instead of four narrowed by a right-hand column',
      'Replaced the vertical rule by a horizontal one that goes from one edge of the card to the other: what is under it applies to the eight criteria at once, and a rule stopping short of the edges would only have looked like a gap between two blocks',
      'Include copies, Reset and Search moved into that footer, on a single line',
      'Under 1180px the grid falls back to two columns; the footer already fits on one line at that width, so it does not move',
    ],
  },
  {
    id: 'notification-module-search-groups',
    date: '2026-09-03',
    category: 'design',
    screens: ['notification-module'],
    title: 'Notification Module: the criteria, then what you do with them',
    description:
      'The eight criteria stay one grid, four filters above and four identifiers below, column against column, and a vertical rule now closes that grid on the right. What sits beyond the rule is not a ninth criterion: Include copies on the filters\' line, Reset and Search on the identifiers\' line.',
    changes: [
      'The four filters and the four ID fields share one grid, so each field of the bottom row lines up with the one above it',
      'Added the vertical rule at the end of the grid, spanning both rows, and the column beyond it: the option on the first line, the actions on the second',
      'The checkbox and the two buttons sit on the very axis of the field boxes of their row, whatever their own height: the column\'s cells take the height of a field, and centre what they hold',
      'Added Reset, which clears the eight criteria, the date range and the checkbox. Disabled rather than hidden while there is nothing to clear, so the Search button never shifts',
      'The filters now read "All statuses" / "All" / "All types" as placeholders instead of pre-selected values: a filter that is not set looks like a filter that is not set',
      'Under 1180px the grid falls back to two columns, the rule goes away and the option and the actions move under the fields, the actions staying flush right',
    ],
  },
  {
    id: 'keyboard-shortcuts',
    date: '2026-09-03',
    category: 'feature',
    screens: ['keyboard-shortcuts'],
    title: 'Keyboard shortcuts and their reference panel',
    description:
      'The product answers to the keyboard: Alt-based combinations jump between sections, open tools and drive the table. The « ? » button in the header now opens a help menu, and its "Keyboard shortcuts" entry docks a reference panel at the bottom of the page: read the combination, or click the line to run it on the spot.',
    changes: [
      'Added the « ? » header menu (same mechanics as the account menu) with two entries: "Help with Qirin" and "Keyboard shortcuts", the latter showing its own `?` shortcut',
      'Added the reference panel docked at the bottom of the window: categories as full-width tabs, and `label ····· [Alt][M]` rows in three roomy columns',
      'The panel keeps the same height whatever the tab, so the page underneath never jumps when you browse categories',
      'The panel does not trap focus and has no backdrop, so it stays open while you try a shortcut, and the row you just fired reports back inside the panel rather than under it',
      'Clicking a row runs the shortcut, exactly as typing it would; a shortcut already tried is marked, so the panel doubles as a learning surface',
      'Catalogued 65 shortcuts across 8 categories (essentials, go to, tools, table, buyer, view, filters, editing). The navigation ones are wired: Alt+M opens ManA, Alt+B buyers, and so on; the rest report that they are not wired in this prototype yet',
      'Shortcuts are matched on the letter printed on your key, not on its position: Alt+M is the key marked M whether the layout is QWERTY, AZERTY or QWERTZ. Digits stay position-based, since AZERTY prints symbols on its top row',
      'Shortcuts stay inert while typing in a field, apart from a small allow-list (Escape, the panel itself)',
      'New design-system atoms: `ds-keycap` and `ds-shortcut-keys` (a rendered key combination), `ds-shortcut-row`, `ds-shortcuts-panel`. `ds-tab` gained `fill` for evenly-spread tab strips, `ds-flyout-menu-item` gained `shortcut` so a menu entry can teach its own combination, and a `keyboard` icon joined the registry',
    ],
  },
  {
    id: 'notification-module-search-always-open',
    date: '2026-09-03',
    category: 'design',
    screens: ['notification-module'],
    title: 'Notification Module: the whole search form, always open',
    description:
      'The "More criteria" disclosure is gone, and its second row of fields is now permanently visible and aligned with the first. Eight criteria on screen, in one grid, nothing to unfold before searching.',
    changes: [
      'Removed the "More criteria" toggle and the divider underneath it: Policy ID, Extension ID, Buyer ID and Notification ID are always shown',
      'Both rows now share one grid, so the second row\'s fields line up with the four above them instead of being offset',
      '"Include copy" and the Search button stay on the first row, and the second row stops at the end of the fields rather than running under them',
    ],
  },
  {
    id: 'spotlight-filter-bubbles',
    date: '2026-09-01',
    category: 'feature',
    screens: ['spotlight'],
    title: 'Spotlight: filter bubbles and a liquid-glass morph',
    description:
      'The quick-search palette gains two filter bubbles alongside the bar (country, and which field is searched, name or ID), in the manner of macOS Spotlight. Opening one makes the bar swallow the bubbles and grow into its panel; closing it makes the material split back into bubbles.',
    changes: [
      'Added two filter bubbles next to the search bar: country (flag) and searched field (Aa / ID). Filtering by country narrows the results; switching to ID searches the identifier instead of the name',
      'Opening a bubble morphs rather than fades: the bar absorbs the bubbles, widens, and its panel reveals the option list by growing downward. The magnifier is replaced by the category icon, which becomes a back chevron on hover',
      'Closing a bubble plays a liquid fission: the bar\'s right edge stays stretched, a mass inflates out of it and detaches through a thinning neck, then splits into the bubbles, with no fade anywhere in the sequence, and the icons only appear once the bubbles are stable',
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
      'Renamed the multi-select filter field component from `tag-filter-chip` to `ds-tag-filter-chip` and moved it into shared/ui: same markup, same styling, zero visible change',
      'Defined the previously-missing `--semantic-color-static-text-main-reversed` token (was silently falling back to a hardcoded #fff in the stepper): same resolved color, just no longer a silent gap',
    ],
  },
  {
    id: 'maintenance-screen',
    date: '2026-08-25',
    category: 'feature',
    screens: ['maintenance'],
    title: 'Add a maintenance screen',
    description:
      'A full-screen "Qirin is down" state for planned outages: no navigation, no shell. When the product is unavailable there is nowhere else to send the user.',
    changes: [
      'Added the maintenance screen with the product\'s brand blue, Allianz Neo type, and a bespoke abstract network illustration',
      'No header, side-nav, links, or buttons: the page is intentionally a dead end',
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
