# Collapsible Table
**Status**: Design WIP · Tech In code
A category bar that expands to reveal a table (or any tabular content) grouped under it.
Figma: [Components] Data Display › page Collapsible Table (node 1491:4803) · Storybook: `Design System/Data Display/Collapsible Table` › Playground · Code: `shared/ui/collapsible-table` (`ds-collapsible-table`)

## Overview
Collapsible Table groups rows under a named category that the user can open and close, so long tables stay scannable. In Figma the set has a category header (title and chevron) and a Slot for the rows; header and data cells come from `Collapsible Table Cell`. In code the header is a native button and the content is projected. Embed the Storybook story `Playground` and the Figma frame `_Design system header` 909:18358.

## When to use / When not to use
- Use when a long table splits into meaningful categories (for example by period or by type).
- Use when users usually need one category at a time.
- Use when a category count or label must stay visible while the rows are hidden.
- Don't use when there is a single group → use Table instead.
- Don't use when the content is prose or free content → use Accordion instead.
- Don't use when events are ordered in time → use Timeline instead.

## Anatomy
1. `Category`: the header bar (`Container` with `Category Title` and an `Icon Functional` chevron).
2. `Slot`: the rows (header row and data rows built with `Collapsible Table Cell`).
3. `Collapsible Table Cell`: a cell `Type=Header` or `Data`, with a `Label`, an optional exposed info `Tooltip` (nested `Collapsible Table Cell` 973:469, `Tooltip` False/True) and an optional navigation affordance (`Navigation`, `Show Navigation`), plus a `Separator`.
In code: `__header` (button with optional `__icon`, `__category` text and `__chevron`) and `__body` (projected content, rendered only when open).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Open | Variant | **True**, False | `open` (model, default false) | Two-way: `[(open)]`. Default differs: open in Figma, closed in code. |
| Slot | Slot | rows | `<ng-content />` | |
| none | | | `category` (required string) | Header label. |
| none | | | `icon` (icon name, optional) | Leading icon, not in Figma. |
| none | | | `disabled` (boolean, false) | Not drawn in Figma. |
| Collapsible Table Cell › Type | Variant | **Header**, Data | none | Cells are not a code component: project a table. |
| Collapsible Table Cell › Navigation | Variant | True, **False** | none | |
| Collapsible Table Cell › Show Navigation | Boolean | **True**, False | none | |
| Collapsible Table Cell › Show Tooltip | Boolean | **True**, False | none | Shows the info icon with a Tooltip. |

Slots: `Slot` holds the table rows.

Exposed nested instances: `Tooltip` (the info-icon cell, property `Tooltip` False/True) inside `Collapsible Table Cell`.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Closed / open | `open` model, toggled by click | `Open=False` / `True` |
| Hover | `:hover` on the header | Not drawn |
| Active | `:active` on the header | Not drawn |
| Focus | `:focus-visible` on the header | Not drawn |
| Disabled | `disabled` input (opacity 40 %) | Not drawn |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Header | padding | `--semantic-measurement-spacing-s` `--semantic-measurement-spacing-m` | `--foundation-spacing-8` `--foundation-spacing-16` |
| Header | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Header hover | background | `--semantic-color-interactive-background-light-alt-hover` | `--foundation-color-grey-100` |
| Header active | background | `--semantic-color-interactive-background-light-alt-active` | `--foundation-color-grey-200` |
| Header focus | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Category | font-size / line-height | `--semantic-font-text-style-size-l` / `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16` / `--foundation-font-line-height-24` |
| Category | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Category | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| Icon, chevron | color | `--semantic-color-interactive-icon-strong-alt-default` | `--foundation-color-grey-900` |
| Body | background / color | `--semantic-color-static-background-main-primary` / `--semantic-color-static-text-main-primary` | `--foundation-color-white-1000` / `--foundation-color-grey-900` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- The header is a native `button` with `aria-expanded`; Enter and Space toggle it.
- Disabled sets `disabled` and `aria-disabled`.
- Consider linking the header to the body with `aria-controls` (not set in code today).
- The body is removed from the DOM when closed, so hidden rows are not read.
- The category text is grey-500 on grey-050: check it reaches 4.5:1, or use a darker text token.

## Content guidelines
- Category label: a short noun phrase, sentence case; add a count in the label when useful.
- Keep the same columns in every category of one page.

## Do / Don't
- Do open the most relevant category by default. Don't open every category on load.
- Do keep each category self-contained, with its own header row. Don't split one record across categories.

## Related components
Composes: Icon, Tooltip, Table (projected) · Used by: To be defined.

Notes: `☠️ Collapsible Table` (909:5838) and `☠️ Collapsible Table Row` (909:3041) are deprecated. The Figma header text still reads "Horizontal Card" in its breadcrumb.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | To be defined | Version shown in the Figma header; the page has no Versionning frame. |
| Docs | 2026-11-04 | First ZeroHeight page. |
