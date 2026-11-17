# New Data Entry components created in Figma

File `[Components] Data Entry` (`1wVY9FfjONIX6us9JmIm7U`), 2026-11-06. Additive only: five new pages after `🆕 Search Bar`, no existing node touched. The library is NOT published: the keys below become importable after the manual publish. Each page reuses the documentation header clone (breadcrumb, status Design New / Tech In code, Component section, Properties notes frame).

All fills, strokes, paddings, gaps and radii are bound to Semantic variables, text to the Body styles, elevation to `Shadows/Bottom/400`. No token created.

Common gaps: hover, focus and `:active` states of the atoms come from the atoms themselves (Button, Chip, Checkbox, Dropdown); typed values, tooltips and scroll behaviour are code behaviours not drawn.

## 1. Search Bar Home (code `ds-search-bar`)

- Page `🆕 Search Bar Home` (`3098:2`), component `3098:3`, key `4488ded6ca6d1c15221dfd62b780bda31e214ccf`. Single component, not a set.
- Properties: `Placeholder` (text, default `Search…`), `Recent searches` (boolean, default false = flyout hidden), `Recent items` (slot, 3 sample rows); exposed instances `Search button` (Button Primary) and `Advanced search link` (Link S Semi-Bold, arrow right).
- Composes: Icon Functional (search, clock, arrow-right), Button, Badge (S Light, icon off), Divider, Link.
- Existing check: the already published `Search Bar` (`b084316c...`) is the scoped bar (code `ds-search-bar-scoped`), different chrome (radius M, height 64, filter slots). Not reused.
- Gaps vs code: row padding 2px/4px mapped to Spacing/None and XS; shadow `semantic-shadow-elevation` mapped to `Shadows/Bottom/400`; filled value not drawn; the flyout is stacked under the bar (absolute in code); `Escape`/outside click are code only.

## 2. Search Bar Multi (code `ds-search-bar-multi`)

- Page `🆕 Search Bar Multi` (`3102:...`), set `3102:849`, key `3c9ee117b211c623682e8d639cb5159ee7919221`, 10 variants.
- Properties: `Type` = Company ID (default) / ID / Name / Phone / Manager (structure: country and ID Type slots appear per type, placeholder follows); `Error` = False (default) / True (red panel on required empty fields, "This field is required" under each).
- Exposed instances: `Search type dropdown`, `Country dropdown`, `ID type dropdown` (Standalone Dropdown), `More criteria button` (Button Tertiary Accent, filter glyph), `Search button` (Button Primary, Disabled by default).
- Composes: Standalone Dropdown, Divider (rotated 90), Icon Functional, Button.
- Gaps vs code: dropdown widths 160/200/124 instead of 142/167/108 (Allianz Neo labels truncated otherwise); filled query, clear button, phone prefix, Flag in Country, tooltips, flyouts not drawn; Hash and Aa glyphs missing in NDBX, the File Text glyph stands in for the type icons (hash, aa) and the ID dropdown; Error message offsets use fixed slot widths.

## 3. Tag Filter Chip (code `ds-tag-filter-chip`)

- Page `🆕 Tag Filter Chip`, set `3104:1454`, key `0e87ad6d6ff74ce3fd3b807dce6daab712a6be78`, 12 variants.
- Properties: `Variant` = Chip (default) / Field; `Flyout` = Closed (default) / Open / Open with search; `Filled` = False (default) / True. The `searchable` input became a Flyout value because a boolean cannot be bound to a layer inside an instance slot.
- Exposed: trigger instance (`Chip` or `Field` = Dropdown).
- Composes: Chip (Selected on Filled), Dropdown (label, "Any" placeholder, Active when open), Flyout Menu (slot) with Checkbox rows, Input Search.
- Gaps: sample options Active/Pending/Closed are local content; "No match" empty state, 6-row scroll limit and the `placeholder` input (text of the Dropdown, default "Any") are not parametrised; Field fixed at 320 px, Chip flyout 240 px.

## 4. Grid Selection (code `ds-grid-selection`)

- Page `🆕 Grid Selection`, set `3105:59`, key `2a6cb7322e6e0143a22105a84661c241ad09ad6e`, 4 variants.
- Properties: `State` = Default / Hover, `Selected` = False / True, `Label` (text, default `4 equal`), `Layout preview` (slot, default 4x2 grid of 8 blocks).
- Doc frame shows the six card-builder layouts (4 equal, Mixed 6, Large left, Large right, 2x2, Tall left) as instances with a GRID frame in the slot.
- Composes: no atom (the card is its own primitive); preview blocks use Static/Background/Main/Tertiary.
- Gaps: `selected` background `semantic-color-interactive-background-subtle-default` does not exist in Figma, `Interactive/Background/Light/Default` used (closest). Hover is a Figma variant only to show the border.

## 5. File Upload (code `ds-file-upload`)

- Page `🆕 File Upload`, set `3107:851`, key `5ebea90f1120327ae7758823f662e7627fb1ae91`, 3 variants.
- Properties: `State` = Default / Dragging / Full (Full covers quota reached and disabled: Opacity/Disabled, Browse disabled); `Files` (boolean, default false = list hidden); `Hint` (text, default `XLSX or CSV • less than 5MB • up to 1 file`); exposed `Browse button` (Button Plain) and `Remove button` (Button Icon Plain S).
- Composes: Icon Functional (File Text local glyph, trash), Button, Button Icon.
- Gaps: dashed stroke pattern 4/4 is a raw value (no variable exists); file row is a single sample (name, size texts overridden per use); rejection reasons have no visual state (screen owns the message).

## Draft ZeroHeight pages (about 15 lines each, to adapt)

### Search Bar Home
1. Usage: the single free-text bar at the top of the home page. One per page.
2. Anatomy: search icon, field, primary Search button; optional Recent searches flyout.
3. Recent searches (boolean): 3 recent rows (clock, label, Badge), then an Advanced search link.
4. Placeholder (text): describe what is searched ("Search for a buyer").
5. Do: keep one bar, keep the label of the button short.
6. Don't: add filters here, use Search Bar (scoped) instead.
7. A11y: field labelled "Search", listbox role on the flyout, Enter submits, Escape closes.
8. Rows are options: arrow keys and Enter select, focus ring from the atoms.
9. Code: `ds-search-bar` (`placeholder`, `buttonLabel`, `recentSearches`, `advancedSearchHref`).

### Search Bar Multi
1. Usage: searches by identifier, name, phone or manager (Search v1).
2. Type changes the bar: Company ID has no country, ID adds Country then ID Type, Phone needs a country.
3. Search stays Disabled until the query is valid; More criteria is Disabled for Company ID.
4. Error: the required fields turn red with "This field is required" below.
5. Do: keep the order Type, Country, ID Type, query, actions.
6. Don't: use it for scoped searches, use Search Bar.
7. A11y: each dropdown is a labelled button, errors are text plus colour (not colour alone), disabled controls keep a reason in a tooltip.
8. Code: `ds-search-bar-multi` (`type`, `country`, `idType`, `query`, `criteriaCount`).

### Tag Filter Chip
1. Usage: multi-select filter in a filter bar (Chip) or a form (Field).
2. Chip shows "Label" or "Label · count" when active; Field shows the picked labels or "Any".
3. Flyout: a list of checkboxes; Open with search for long reference lists (NACE, legal forms).
4. Search is chosen field by field, never by an option-count threshold.
5. Do: use Chip in filter bars, Field in grids of dropdowns.
6. Don't: use it for a single choice, use Dropdown.
7. A11y: trigger has `aria-haspopup="listbox"` and `aria-expanded`; Escape closes; checkboxes are keyboard operable.
8. Code: `ds-tag-filter-chip` (`label`, `options`, `selected`, `variant`, `placeholder`, `searchable`).

### Grid Selection
1. Usage: pick a board grid layout in the Buyer Summary card builder.
2. A card shows a miniature of the layout and its name; Selected has a strong border.
3. Show 4 to 6 cards side by side, a single one selected.
4. Do: keep miniatures on the same 4-column grid.
5. Don't: use it for generic choices, use Radio Card.
6. A11y: each card is a button; expose the selected one with `aria-pressed` and keep the label visible.
7. Code: `ds-grid-selection` (`layout`, `selected`, `selectedChange`).

### File Upload
1. Usage: attach files with type, size and count limits.
2. States: Default, Dragging (file over the zone), Full (quota reached or disabled).
3. The hint always states the limits; Browse opens the native picker.
4. Retained files list name, size and a Remove button.
5. Do: show the limits before the user drops; let the screen display errors (Notice or helper text).
6. Don't: use it as a plain button.
7. A11y: Browse and Remove are real buttons with labels; the drop zone is not the only way to add a file.
8. Code: `ds-file-upload` (`accept`, `acceptLabel`, `maxSizeMb`, `maxFiles`, `disabled`, `files`, `rejected`).
