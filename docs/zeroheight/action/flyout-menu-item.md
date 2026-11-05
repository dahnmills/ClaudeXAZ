# Flyout Menu Item
**Status**: Design Ready · Tech In code
One row of a Flyout Menu: an action or an option with an optional icon.
Figma: [Components] Action › page Flyout Menu (node 507:996, `Flyout Item`) · Storybook: `Design System/Internals/Flyout Menu Item` (id `design-system-internals-flyout-menu-item--default`) · Code: `shared/ui/flyout-menu` (`ds-flyout-menu-item`)

## Overview
Flyout Menu Item is a full-width row with a hover plate, an optional icon and a label. In code it also supports a keyboard shortcut and a selectable mode that shows a check mark in a fixed 20px slot. It is a sibling atom of Button and Link, not a wrapper: its full-width row and background states do not map to them. Embed the Storybook story `Default` as the live example, and the Figma component set `Flyout Item` (node 507:996) as the visual reference.

## When to use / When not to use
- Use inside a Flyout Menu, one per action or option.
- Use `icon` when the icons help the user scan the list; use it on all items or none.
- Use `selectable` and `selected` for a single choice inside a flyout.
- Use `shortcut` to show the keyboard shortcut of an action.
- Use the `[slot=icon]` content for a custom leading visual (a Flag, for example).
- Don't use outside a Flyout Menu → use Button or Link instead.
- Don't use for a multi-selection list with checkboxes → use Multi Select (Checkbox items) instead.
- Don't use for side navigation entries → use Side Nav Item instead.

## Anatomy
1. `Flyout Item` (container): full-width row, padding 8px 32px, gap 4px, white plate.
2. Check slot (code, selectable only): a 20px `check` icon always rendered, hidden when not selected, so the label never moves.
3. `Edit Compose` / `↳ Icon` (icon): optional 16px icon, swapped with the `↳ Icon` instance swap, shown with the `Icon` boolean.
4. `Label` (text): Body L regular, 16px / 24px, Grey/900.
5. Shortcut (code only): `ds-shortcut-keys` on the right, padding-left 16px.
6. `Focus` (frame): the focus ring, shown with the `Focus` boolean.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled | Hover, Active: CSS. Disabled: `disabled: boolean` | |
| Icon | Boolean | **true** | `icon: IconName \| null` (default `null`) | Defaults differ: icon shown in Figma, none in code. |
| ↳ Icon | Instance swap | **Edit Compose** | `icon` value, or `[slot=icon]` content | |
| Focus | Boolean | **false** | `:focus-visible` | Drawn by CSS. |
| (none) | | | `label: string` (required) | Label text. |
| (none) | | | `selectable: boolean`, `selected: boolean` (default `false`) | Code only on this set. The Figma model for the fixed check slot is `Dropdown Flyout Menu` (Data Entry), property `Selected` on `.Item Properties`. |
| (none) | | | `shortcut: KeyCombo` (default `[]`) | Code only. |
| (none) | | | `clicked` (output) | On click, Enter and Space, never while disabled. |

Slots: no Figma slot. In code, `[slot=icon]` accepts a custom leading element.

Exposed nested instances: none; the icon is changed through the `↳ Icon` instance swap.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover`: grey plate, blue label and icon | `State=Hover` |
| Active | `:active`: darker grey plate, darker blue | `State=Active` |
| Focus | `:focus-visible`: 2px inset outline | `Focus=true` |
| Selected | `selectable` + `selected`: check visible, `aria-selected="true"` | not on this set (see Data Entry `Dropdown Flyout Menu`) |
| Disabled | `disabled` input: `aria-disabled`, `tabindex=-1`, opacity 0.40 | `State=Disabled` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` (4px) |
| Container | padding | `--semantic-measurement-spacing-s` `--semantic-measurement-spacing-xl` | `--foundation-spacing-8` / `-32` |
| Container (selectable) | padding-left | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Container | background rest / hover / active | `--semantic-color-static-background-main-primary`, `--semantic-color-interactive-background-light-alt-hover`, `--semantic-color-interactive-background-light-alt-active` | `--foundation-color-white-1000`, `--foundation-color-grey-100`, `--foundation-color-grey-200` |
| Label, icon, check | color rest / hover / active | `--semantic-color-interactive-text-strong-alt-default`, `--semantic-color-interactive-text-strong-hover`, `--semantic-color-interactive-text-strong-active` | `--foundation-color-grey-900`, `--foundation-color-blue-a-600`, `--foundation-color-blue-a-700` |
| Label | font | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l`, `--semantic-font-text-style-font-weight-regular`, `--semantic-font-text-style-letter-spacing-none` | `--foundation-font-size-16`, `--foundation-font-line-height-24`, `--foundation-font-weight-regular`, `--foundation-font-letter-spacing-0` |
| Shortcut | padding-left | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Focus ring | outline color | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

Values written outside tokens in the SCSS: focus outline 2px with offset -2px.

## Accessibility
- Role: `menuitem`, or `option` with `aria-selected` when `selectable`.
- Keyboard: focusable (`tabindex="0"`), Enter and Space emit `clicked`.
- Disabled: `aria-disabled="true"`, `tabindex="-1"`.
- Selection: shown by a check mark in a fixed slot, not by color.
- The 2px focus ring is drawn inside the row so it is not clipped by the menu.

## Content guidelines
- Actions: verb first ("Duplicate", "Export to Excel"). Options: the value itself.
- One line per item, sentence case, no final punctuation.
- No em dash.

## Do / Don't
- Do keep the check mark slot for single choice; don't toggle a conditional icon to show selection.
- Do use icons on all items of a menu or on none; don't mix rows with and without icons.
- Do disable an item that is temporarily unavailable; don't hide it if the user expects to find it there.

## Related components
Composes: Icon (`ds-icon`), Shortcut Keys (`ds-shortcut-keys`) · Used by: Flyout Menu, Search Bar Multi, Search Bar Scoped, Select, Standalone Dropdown, Table.

## Changelog
| Version | Date | Change |
|---|---|---|
| 3.0.0 | date unknown | `Flyout Item` published as its own set with the slot version of Flyout Menu (version from the Figma header). Earlier private `.Item` (node 1:56) has the same properties. |
