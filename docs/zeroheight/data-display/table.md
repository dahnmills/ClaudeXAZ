# Table
**Status**: Design WIP · Tech In code
Rows and columns of comparable records, with optional selection, sorting and a row action menu.
Figma: [Components] Data Display › page Data Grid / Table (node 1514:3369, Table Row; header frame 1514:4275) · Storybook: `Design System/Data Display/Table/Table Row` › FullTable · Code: `shared/ui/table` (`ds-table-row`, `ds-cell`, `ds-cell-header`, `ds-cell-selection`, `ds-cell-action`)

## Overview
Table v2 is built from slot-based rows: a `Table Header Row` and `Table Row`s whose cells go in a Slot, framed by optional selection and flyout columns. In code the same parts are separate components composed by the consumer (`ds-table-row` wraps `ds-cell-header`, `ds-cell`, `ds-cell-selection`, `ds-cell-action`). Embed the Storybook story `FullTable` and the Figma frame `_Design system header` 1514:4275 (version 2.0.0).

## When to use / When not to use
- Use when users compare many records on the same attributes (buyers, policies, tasks).
- Use when rows need bulk selection (checkbox) or reordering (drag handle).
- Use when columns must be sortable.
- Use when each row has secondary actions grouped in a kebab menu.
- Don't use when there are only a few label/value pairs → use Card `.Columns` or Properties Panel instead.
- Don't use when rows group under collapsible categories → use Collapsible Table instead.
- Don't use when each record needs a rich preview → use Horizontal Card instead.

## Anatomy
1. `Table Header Row`: `Header Selection` (exposed, optional), `Slot` of `Table Header` cells, `Header Flyout` (exposed, optional).
2. `Table Header`: column title, optional sub title, sort indicator (`Sorting`).
3. `Table Row`: `Table Selection` (exposed, optional), `Slot` of `Table Cell`s, `Table Flyout` (exposed, optional).
4. `Table Cell`: `Type=Text` (`.Table Cell Text`, one or two lines, `New` bold) or `Type=Slot` (`.Table Cell Slot`, any content such as a Badge or a Grade).
5. `Table Selection`: drag handle (Button Icon), Checkbox and/or Toggle.
6. `Table Flyout`: the kebab Button Icon that opens the row menu.
7. `Header Selection`: blank or select-all column header (`Single` / `Double`). `Header Flyout`: blank header above the flyout column.
8. Borders: each cell carries a top and bottom border.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Table Row › State | Variant | **Default**, Hover, Active, Disabled | `ds-table-row` `state` (`default` / `active` / `disabled`), `interactive` | Hover is the `:hover` pseudo-class when `interactive=true`. |
| Table Row › Selection | Boolean | **True**, False | add a `ds-cell-selection` | |
| Table Row › Action | Boolean | **True**, False | add a `ds-cell-action` | |
| Table Row › Slot | Slot | cells | `<ng-content />` | |
| none | | | `ds-table-row` `new` (boolean) | Code adds a "new row" tint and bold cells; Figma has `New` on `.Table Cell Text` only. |
| Table Header Row › Header Selection | Boolean | **True**, False | `ds-cell-header` `type="selection"` | |
| Table Header Row › Header Flyout | Boolean | **True**, False | `ds-cell-header` `type="action"` | |
| Table Header › State | Variant | **Default**, Hover, Active, Disabled | `:hover`, `:focus-visible` when `sortable` | No disabled input in code. |
| Table Header › Sorting | Variant | **None**, Default, Asc, Desc | `sortable`, `sortDirection` (`asc` / `desc` / null) | `Default` = sortable, not sorted. |
| Table Header › Sub Title | Boolean | True, **False** | `subTitle` (string or null) | |
| none | | | `title`, `align` (`left` / `right` / `center`) | |
| Table Cell › Type | Variant | Slot, **Text** | `ds-cell` with projected content | `size` (`s` / `m`), `align`, `emphasized` in code. |
| .Table Cell Text › New | Variant | **True**, False | `emphasized` | Bold text. |
| .Table Cell Text › Second Line | Boolean | **True**, False | project two lines | |
| Table Selection › Checkbox / Drag and Drop / Toggle | Variant (each True/False) | default **Drag and Drop=True** only | `control` (`drag` / `check` / `toggle` / `drag-check` / `drag-toggle`, default `check`) | Code default differs from Figma default. |
| none | | | `checked`, `toggleValue`, `disabled`, `ariaLabel`, `size` | outputs `checkedChange`, `toggleChange`, `dragStart` |
| Header Selection › Type | Variant | **Single**, Double | `allSelected`, `allIndeterminate` | output `allSelectedChange` |
| none | | | `ds-cell-action` `size`, `ariaLabel` ("Row actions") | Menu content in `slot="menu"`; outputs `menuOpened`, `menuClosed`. |

Slots: `Table Header Row › Slot` takes `Table Header` cells; `Table Row › Slot` takes `Table Cell`s; `.Table Cell Slot › Slot` takes any cell content.

Exposed nested instances: `Header Selection`, `Header Flyout` (in the header row); `Table Selection`, `Table Flyout` (in the row).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Row default | `state="default"` | `State=Default` (Interactive/Background/Muted/Alt/Default) |
| Row hover | `:hover` with `interactive=true` | `State=Hover` |
| Row focus | `:focus-visible` with `interactive=true` (row gets `tabindex=0`) | Not drawn |
| Row active (current row) | `state="active"` | `State=Active` |
| Row disabled | `state="disabled"` (opacity 40 %, `aria-disabled`) | `State=Disabled` (opacity 40 %) |
| Row new | `new` input | `.Table Cell Text New=True` |
| Header sorted | `sortDirection="asc"` or `"desc"` (`aria-sort`) | `Sorting=Asc` / `Desc` |
| Selection disabled | `ds-cell-selection` `disabled` | To be defined |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Row | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Row | border-bottom | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Row hover | background-color | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Row active / new | background-color | `--semantic-color-static-background-main-alt-primary` | `--foundation-color-blue-a-025` |
| Row disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Row, header, drag focus | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Cell | padding (M) | `--semantic-measurement-spacing-m` (vertical), `--semantic-measurement-spacing-s` (left), `--semantic-measurement-spacing-l` (right) | `--foundation-spacing-16`, `-8`, `-24` |
| Cell | padding (S, vertical) | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Cell text | font-size / line-height | `--semantic-font-text-style-size-l` / `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16` / `--foundation-font-line-height-24` |
| Cell text | color | `--semantic-color-interactive-text-strong-alt-default` | `--foundation-color-grey-900` |
| Cell emphasized / new | font-weight | `--semantic-font-text-style-font-weight-bold` | `--foundation-font-weight-bold` |
| Header | border-top / border-bottom | `--semantic-color-static-border-subtle-tertiary` / `--semantic-color-static-background-accent-primary` | `--foundation-color-grey-200` / `--foundation-color-grey-900` |
| Header title | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Header subtitle, sort icon | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| Sort icon (desc) | color | `--semantic-color-interactive-text-strong-default` | `--foundation-color-blue-a-500` |
| Selection | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Action menu | top / right | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |

## Accessibility
- Roles: `ds-table-row` is `role="row"`, `ds-cell`, `ds-cell-selection` and `ds-cell-action` are `role="cell"`, `ds-cell-header` is `role="columnheader"` with `aria-sort`. Wrap rows in a container with `role="table"` (or `grid`) and a label.
- Keyboard: an interactive row is focusable (`tabindex=0`) and activates with Enter and Space; disabled rows are skipped and carry `aria-disabled`.
- Select-all checkbox has the label "Select all rows"; give each row checkbox an `ariaLabel` naming the record.
- The drag handle is `role="button"` labelled "Drag to reorder"; offer a non-drag alternative for reordering.
- The kebab action needs an `ariaLabel` (default "Row actions"); the menu closes on outside click.
- The new-row tint is doubled by bold text, so it does not rely on color alone.

## Content guidelines
- Column titles: short nouns, sentence case; put the unit in the sub title (for example "EUR").
- Right-align numbers (`align="right"`), left-align text.

## Do / Don't
- Do keep one action menu per row at the end. Don't put several icon buttons in a row.
- Do sort only columns where order means something. Don't make every column sortable by default.
- Do use cells of type Slot for Badge or Grade. Don't restyle a text cell into a pill.

## Related components
Composes: Checkbox, Toggle, Button Icon, Icon, Flyout Menu, Badge, Grade, Tag · Used by: Reject Management, search results, Collapsible Table content.

Notes: `Cell`, `☠️ Table Line`, `Table Header` 33:1985 and the `.Line Data` / `.Cell Type` / `.Cell Properties` atoms belong to the v1 table (header 39:14279, version 1.0.0) and are replaced by the v2 components above.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | To be defined | Version shown in the Figma header 1514:4275; the Figma changelog (Versionning 39:14360) is a placeholder. |
| Docs | 2026-11-04 | First ZeroHeight page. |
