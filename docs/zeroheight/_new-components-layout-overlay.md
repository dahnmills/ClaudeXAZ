# New components in [Components] Layout (Page Title + Overlay)

File: [Components] Layout, fileKey `bbgSPUChd18EVNGijjoZGn`. Built 2026-11-06, additive only (no existing node touched, library not published: the keys below become importable after publication). All fills, strokes, paddings, gaps, radii and text styles are bound to Semantic variables and styles of the Tokens library; no token, collection or mode created. Pages added: `Page Title` (4009:2) and `Overlay` (4009:3).

## Existing under another name (not created)

| Code | Figma equivalent | Verdict |
|------|------------------|---------|
| `ds-flyout` (rounded container with shadow, content composed by the consumer) | Flyout Menu (Action, component `84a8ec3ed08331f3cf5d08222a02cad5dcb53d74`, node 507:833, content in a slot; the Legacy set `5d1147ac…` 1:20 with `# Items` must not be used) | Same role. Not created. Renaming to decide: code `ds-flyout` vs Figma `Flyout Menu`. |
| `ds-flyout-item` (title, reference, emphasized, badge slot) | Flyout Menu Item (`.Item`, node 507:996) | Already marked "covered by ds-flyout-menu-item" in components.json. Not created. `reference`, `emphasized` and the badge slot have no Figma property. |
| `ds-flyout-section` (label, icon, highlighted) | Flyout Menu Title (node 507:833) | Same role (group title row). Not created. `icon` and `highlighted` have no Figma property. |
| `ds-keyboard-map` | none | Internal of Shortcuts Panel, not drawn (see gaps). |

Rename decision for the user: align code names on Figma (`ds-flyout-menu*`) or the reverse. Nothing was changed on either side.

## Page Title (Layout)

- Set/component: component `Page Title`, node `4010:13`, key `15b5e617d6d17a3ff976d22db838bc0f9984d4aa` (page `Page Title` 4009:2, examples frame 4010:919).
- Size: 1160 wide (fill in a page), min height 40, gap Spacing/M.
- Properties: Title (text, "Current page"), ID (text, "12345678"), Show ID (false), Show Badge (false), Show Action (false), Show Icon (false), Show Actions (false), slots `Icon` and `Actions`. Exposed instances: Badge (Warning, Light, M, label "Open") and Link (Icon Right, chevron-down glyph, label "More details").
- Composes: Badge, Link (Action), Icon Functional + Chevron-Small Down glyph. Title uses text style Title/H2 (20/28 semi bold), ID and separator Body L Regular, colors Text/Main/Secondary and Tertiary.
- Gaps with code: the badge slot of the code is covered by swapping the exposed Badge; badge icon hidden (the code badge has no icon); the action link margin-left (Spacing/M) is a padded wrapper.

## Filter Drawer (Overlay)

- Set `Filter Drawer`, node `4015:1824`, key `64692d4700038c3fff885984f75dbe6cba21836b`. Variants: `Tab=Filters` (4015:1221), `Tab=Saved` (4015:1656). 388 x 800.
- Local helper: `Filter Section`, set `4013:132`, key `6c1b108f1b9a801b08d83b91224da2aeb1bdbe18`. Variant `Open` False/True; props Title (text), Show count (boolean, exposed Badge Info Strong S), slot `Body` (Open=True, default: Checkbox rows).
- Composes: Drawer (Footer off, Scroll off, Back and Breadcrumb off; tabs and content injected in its slots), Tab, Filter Section, Divider, Checkbox, Radio, Inline Edit, Button (Plain "Clear all", Secondary "Save my filters", Primary "Apply"). Footer frame uses Background/Subtle/Secondary and a top Border/Subtle/Secondary stroke, as in code; shadow is the library Drawer effect style.
- Defaults: title "Filters", tabs "Filters" and "Saved filters", example sections Status (open, count 1) and Country (closed).
- Gaps with code: inline counters on tabs (the Figma Tab has a dot Badge only); the 10 filter control types (checkbox list shown, others go in the Body slot); empty states ("No filters available", "No saved filters"); delete animation; code Section horizontal padding (Spacing/M) is dropped because the Drawer content slot already insets 16 px; the Drawer shadow is moved to the wrapper so the footer shares it.

## Spotlight (Overlay)

- Set `Spotlight`, node `4019:755`, key `c6ac17c7e447eca149a7cc884d616abde5c1125b`. Variants `State`: Idle (4019:563), Results (4019:583), Empty (4019:661), Filter (4019:694). Panel 512 wide (648 in Filter, where the bubbles merge into the bar), bubbles 56 x 56, radius Border/Radius/L.
- Local helper: `Spotlight Row`, set `4019:562`, key `434fc4f0ff9e6f4ff42494a21513a32122fd66ed`. Variant `Active` False/True; props Name, ID, Show ID, Show icon, exposed Icon instance. Slots on the Spotlight: `Results` (Results) and `Options` (Filter).
- Composes: Icon Functional (Search, Close, Duplicate, File Text, Globe, local Hash glyph), Button Icon (Plain, S) for clear.
- Defaults: placeholder "Quick search", filter placeholder "Filter countries", empty message "No result for “Amazon”".
- Gaps with code: glass blur, liquid morph and goo filter (flat Background/Main/Primary surface with the Drawer shadow), Flag atom absent from Figma (country rows have no flag), group labels Suggestions and Recent, ghost completion, maxResults (4 rows drawn).

## Shortcuts Panel (Overlay)

- Component `Shortcuts Panel`, node `4018:1029`, key `8594fa5129b5189d218c9e47e3642430702c53e4`. 1280 wide, docked bottom, not modal.
- Local atoms: `Keycap` set `4017:324` key `59ff461b2bf4ecd461e5ffb9c06597599fe54eed` (Tone Default/Accent, text Label); `Shortcut Row` set `4017:349` key `6a8c01e34416b8c07a9e663d0cc069fe3feb87fd` (Used False/True, props Label, Context, Show context, Show key 2, Show key 3, exposed Key instances).
- Properties: Note (text "Copied"), Show note (false), Show layout tab (true). Exposed: Close Button Icon (Tertiary, S).
- Composes: Tab (9 tabs filling the width, "Go to" selected), Button Icon, Shortcut Row, Keycap. Three columns of four rows; the first row is Used.
- Gaps with code: the Layout tab keyboard map (ds-keyboard-map, internal molecule) is not drawn; Keycap accent text uses Interactive/Text/Neutral because the white static token has no Figma equivalent; the panel does not switch categories (swap the rows); no story exists in code.

## ZeroHeight draft pages

### Page Title
Usage: the heading of a page, under the Page Header. Shows the page name, an optional identifier, a status badge and one action link.
Variants: none. Booleans show or hide the ID, the badge, the action, a leading icon slot and a trailing actions slot.
Do: one Page Title per page; keep the title short; put page-level buttons in the Actions slot.
Do not: stack several links in the action; repeat the title in the Page Header.
Anatomy: icon slot, title, separator and ID, badge, action link, actions slot.
Accessibility: renders the page `h1`; the action link needs a real label and chevron is decorative.
Code: `ds-page-title`. Figma: Layout, page Page Title.

### Filter Drawer
Usage: a Drawer preset to build filters, apply them and save sets for later.
Variants: Tab = Filters (collapsible sections, Clear all, Save my filters, Apply) or Saved (radio rows, rename and delete).
Do: one control per section; keep "Apply" as the single primary action.
Do not: add a third tab or put destructive actions in the footer.
Anatomy: Drawer header, tabs, content (sections and dividers), footer.
Accessibility: inherits the Drawer focus trap (`dsFocusTrap`); tablist for the tabs; sections are buttons with `aria-expanded`; saved rows are focusable and apply on Enter or Space.
Code: `ds-filter-drawer`. Figma: Layout, page Overlay.

### Spotlight
Usage: quick search palette opened with Cmd or Ctrl + K to jump to a buyer or an application.
Variants: State = Idle, Results, Empty, Filter (country or search field bubble open).
Do: show at most four rows; show the ID with a copy action; keep arrows, Enter and Escape working.
Do not: use it as a filter form or keep it open after a selection.
Anatomy: search bar, clear button, dropdown rows, empty message, two filter bubbles.
Accessibility: `role="dialog"` with label "Quick search"; keyboard navigation of rows; copy button has an aria-label; honors reduced motion.
Code: `ds-spotlight`. Figma: Layout, page Overlay.

### Shortcuts Panel
Usage: a cheat sheet of keyboard shortcuts docked at the bottom of the window, opened with `?`.
Variants: none; category chosen with tabs; optional Layout tab for the keyboard map.
Do: keep one category per tab; light up shortcuts the user already used.
Do not: add a title or a search field; block the page behind it.
Anatomy: chrome row (note and close), tabs, three-column body of Shortcut Rows with Keycaps.
Accessibility: `role="region"` labelled "Keyboard shortcuts", not a dialog, so no focus trap; Escape closes; rows are activatable; close button labelled.
Code: `ds-shortcuts-panel`. Figma: Layout, page Overlay.
