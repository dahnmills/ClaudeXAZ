# Doc kit F : Action Card, Pie Chart, Page Title, Filter Drawer, Spotlight, Shortcuts Panel

Kit : `docs/figma/doc-kit/doc-kit.js`, reference Button `971:1014` (Action file). All frames are 1280 wide, bound to Tokens / Semantic (no token, collection or mode created), `miss` empty for the builds checked (Action Card, Pie Chart, Page Title). Nothing published. Component data comes from the code, `components.json` and the reports `_new-components-data-display.md` and `_new-components-layout-overlay.md`. Status used on every page: Design WIP (components exist but the library is not published), Tech In code, ZeroHeight Draft (hidden).

## Frames built

| Component | File / page | Doc frame | Position | Height |
|---|---|---|---|---|
| Action Card | Data Display, page `2117:2` | `2127:105` | x 3500, y 0 | 3505 |
| Pie Chart | Data Display, page `2118:95` | `2133:67` | x 3500, y 0 | 3014 |
| Page Title | Layout, page `4009:2` | `4033:252` | x 3400, y 0 | 3208 |
| Filter Drawer | Layout, page Overlay `4009:3` | `4035:2287` | x 4700, y 0 | 4378 |
| Spotlight | Overlay | `4035:3085` | x 4700, y 4678 | 4277 |
| Shortcuts Panel | Overlay | `4035:3763` | x 4700, y 9255 | 3860 |

Distance to annotated elements: more than 560 px on every page (rightmost element of Overlay ends at x 4064, the frames start at 4700).

## Template frames (`_Design system header`, `Versionning`)

- Action Card: header `2119:23`, Versionning `2119:73`. Filled: breadcrumb "Action Card" (emoji removed), Design badge Warning "WIP", Tech Success "In code", changelog v1.0.0 "November 6, 2026" (Added / Documented), tag "New", long lines wrapped (they were clipped).
- Pie Chart: header `2120:4`, Versionning `2120:54`. Same treatment, changelog "Donut of up to 5 parts in a Segments slot, Tooltip boolean".
- Page Title, Filter Drawer, Spotlight, Shortcuts Panel: these pages have no `_Design system header` nor `Versionning` frame (only components, examples, `Notes / ...` frames and the ZeroHeight illustration sections). Nothing to fill and I did not create any. The doc frame carries the version and status.

## Old flat frames deleted

None. No `Documentation · <Nom>` frame created by an agent existed on these six pages. Nothing else deleted. No component, variant, property or `ZeroHeight · ... illustrations` section touched.

## Remaining gaps (kept in the Notes block of each frame)

- Action Card: hover shadow and focus ring not drawn (no shadow style for `--semantic-shadow-card`); code selected background `--semantic-color-static-background-subtle-informative` does not exist (real token is `subtle-functional-informative`, Figma uses it); width 320 fixed in Figma; code Standard uses `--foundation-spacing-16/8`; no Standard + Selected.
- Pie Chart: Figma Tooltip is the DS atom with arrow, code a plain block; hover opacity 0.7 and tone brand not drawn; `size` and `thickness` have no Figma property; tooltip offset not bound; SVG `role="img"` without accessible name input.
- Page Title: badge slot of the code has no Figma slot; badge icon hidden; action link margin is a padded wrapper; `min-height: 40px` literal in SCSS; hyphen separator decision; Page Header also draws a title.
- Filter Drawer: no inline tab counters; only Checkbox list drawn out of 10 control types; empty states and delete animation not drawn; section padding dropped; code SCSS uses undefined `--semantic-measurement-spacing-2xs`.
- Spotlight: glass blur, morph, goo not drawn; Flag atom absent; group labels and ghost completion not drawn; maxResults not a property; story title outside the Design System taxonomy.
- Shortcuts Panel: keyboard map (Layout tab) not drawn; Keycap accent text uses `Interactive/Text/Neutral`; no category switching; no story; version 0.2.0.
- `components.json` still says `figma: null` and `design: false` for all six (stale since the Figma components exist). Not edited here.
- The Layout pages have no logo instance, so the doc breadcrumb has no logo there (Data Display pages have it).

## Corrected after critique (at least 2 passes each)

- Action Card: marker 3 pointed to empty space and marker 4 crossed the description text; both moved onto the text with leaders in free zones. Tokens row "gap" split Standard (Spacing S) and Selectable (Spacing XXS). Versionning text clipped and tag said "Update": wrapped and set to "New". Header Design badge said "New": set to "WIP".
- Pie Chart: Tooltip was off in the anatomy, turned on and canvas heightened so the pin fits; marker 6 moved from the text to the tooltip edge; marker 1 pointed at a ring seam then at empty space, turned into a legend-only marker (the slot is invisible). State tiles had different heights: slot bottom padding (Spacing 3XL) on both so they align.
- Page Title: Show Action boolean was not set (prefix match with Show Actions), fixed; anatomy instance resized to 430 and scaled 1.3 so the ID, badge and action show; markers computed from real node positions.
- Filter Drawer: markers 4 to 6 stayed at the center (slot content ids differ), repositioned by name; marker 4 covered the Filters tab, moved to the chevron; marker 3 first crossed "Saved filters", then placed below it.
- Shortcuts Panel: tab marker pin sat on row labels, moved above the tabs; keycap marker was left at the center, placed on the Keys of the last row of column 2; note and close pins separated with dx.
- Spotlight: markers checked on Results state, no change needed after screenshot.

## Method notes

Kit pasted in each `use_figma` call; Show booleans set by exact property name (before `#`), because `Show Action` is a prefix of `Show Actions`. A script error rolls back the whole call, so patches were done in separate calls.
