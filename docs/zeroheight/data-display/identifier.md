# Identifier
**Status**: Design New · Tech In code
A read-only identifier (company ID, policy key) shown as a small chip, with an optional leading icon; when copyable, the whole chip copies the value.
Figma: [Components] Data Display › page Identifier (node 2009:105) · Storybook: `Design System/Data Display/Identifier` › Default · Code: `shared/ui/identifier` (`ds-identifier`)

## Overview
Identifier displays a value that users read, compare or paste into another tool. It has two kinds: static (`Copyable=False`) and copyable (`Copyable=True`), where the chip is a button that copies the value and confirms with a success snackbar ("<value> copied"). Embed the Storybook story `Default` (and `Copyable`) and the Figma frame `_Design system header` (2007:48) with the Identifier set.

## When to use / When not to use
- Use when showing an identifier that is read, compared or pasted: company ID, policy key, reference number.
- Use the copyable kind when users copy the value into another tool (for example the company ID on a buyer result).
- Use one identifier per value, next to the name it identifies.
- Don't use when the value is a status or a category → use Badge instead.
- Don't use when the value is a filter or a choice → use Tag instead.
- Don't use for free text, a name, a long label or a sentence → use plain text instead.

## Anatomy
1. `Identifier` container: 24 px high chip, 1 px border, 4 px radius, 8 px horizontal padding, 8 px gap.
2. `Leading icon`: exposed Icon Functional instance (16 px), shown with the `Icon` boolean; swap its glyph from the instance. Default glyph is the local `🆕 Hash` (not in NDBX Icons).
3. `Value`: text property, Body/S/Regular.
4. `Copy icon`: Icon Functional (16 px, copy glyph), shown with `Copyable`.
5. `Border Focus`: keyboard focus ring layer, shown with `Focus`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Value | Text | **137381425** | `value` (required, string) | |
| Icon | Boolean | True (**True**) / False | `icon` (`IconName \| null`, default `null`) | Figma shows the icon by default; code shows it only when an icon name is passed. Stories use `icon: 'hash'`. |
| Copyable | Boolean | **False** / True | `copyable` (boolean, default `false`) | Code renders a `<button>` when true, a `<span>` otherwise. |
| Focus | Boolean | **False** / True | none (`:focus-visible`) | Design-only toggle to show the focus ring. |
| State | Variant | **Default** / Hover | none (`:hover`) | Hover only applies to the copyable kind. |

Slots: none.

Exposed nested instances: `Leading icon` (Icon Functional): its `🔗 Icon` glyph swap surfaces on the Identifier instance.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | `copyable` false or true, at rest | `State=Default` |
| Hover (copyable only) | `.ds-identifier--copyable:hover` | `State=Hover` |
| Focus (copyable only) | `.ds-identifier--copyable:focus-visible` | `Focus=True` |
| Copied | Click: `navigator.clipboard.writeText`, then success snackbar "<value> copied" (error snackbar "Copy failed" on failure) | Described in the component description, not drawn |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | background | `--semantic-color-interactive-background-neutral-default` | `--foundation-color-white-1000` |
| Container | border color | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Container | border radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Container | padding, gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Container | height | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Container, Value | text color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Value | font family | `--semantic-font-family` | `--foundation-font-family` |
| Value | font size | `--semantic-font-text-style-size-s` | `--foundation-font-size-12` |
| Value | line height | `--semantic-font-text-style-line-height-l` (code) / `Line Height/S` (Figma) | `--foundation-font-line-height-24` (code) / 16 (Figma) |
| Copyable hover | background | `--semantic-color-static-background-main-alt-primary` | `--foundation-color-blue-a-025` |
| Copyable hover | text color | `--semantic-color-interactive-text-strong-default` | `--foundation-color-blue-a-500` |
| Copyable hover | border color | `--semantic-color-interactive-border-strong-default` | `--foundation-color-blue-a-500` |
| Copyable focus | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |

## Accessibility
- Static kind: a `<span>`, no role; the value is read as plain text.
- Copyable kind: a native `<button type="button">`, reachable with Tab and activated with Enter or Space. Its accessible name is the value text; the tooltip "Copy" (`dsTooltip`) is not part of the name. An explicit label such as "Copy <value>" is To be defined.
- Focus is visible (`:focus-visible` outline in the focus color).
- The copy result is announced through the snackbar (success tone with a check icon), not by color alone.
- Text contrast: grey-700 on white passes AA; hover blue-a-500 on blue-a-025 contrast is To be defined (not measured).

## Content guidelines
- Show the raw identifier exactly as users will paste it (no label inside the chip, no extra punctuation).
- Keep it short: one value. The name it identifies sits next to it, outside the chip.
- The tooltip reads "Copy"; the confirmation reads "<value> copied".

## Do / Don't
- Do: place one identifier next to the name it identifies (for example "137381425" after the company name). Don't: wrap a long label or a sentence ("Coface Deutschland GmbH, Mainz") in an Identifier.
- Do: make it copyable when users paste the value into another tool. Don't: make it copyable when the value is never reused.
- Do: use Badge for a status next to it. Don't: use an Identifier to show a status or a category.

## Related components
Composes: Icon (`ds-icon`), Tooltip (`dsTooltip`), Snackbar (`SnackbarService`) · Used by: Horizontal Card content (`ds-result-card`, `ds-policy-result-card`).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | November 3, 2026 | New: added from code (`ds-identifier`). Note: Hash glyph is local, not in NDBX Icons. |
| 1.0.0 (update) | To be defined | Focus is a boolean property (`Focus`), State keeps Default and Hover only. |
| Docs | 2026-11-04 | First ZeroHeight page. |

Notes (Figma and code gaps):
- Value line height: Figma binds `Font/Text Style/Line Height/S` (16 px, text style Body/S/Regular); code uses `--semantic-font-text-style-line-height-l` (24 px).
- Icon default: shown in Figma, absent in code unless `icon` is set.
- Static kind: Figma has no separate "static" visual; the static kind is `Copyable=False`, and Hover/Focus should only be used with `Copyable=True`.
