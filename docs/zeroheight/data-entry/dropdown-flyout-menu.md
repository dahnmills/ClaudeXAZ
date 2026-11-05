# Dropdown Flyout Menu
**Status**: Design Ready · Tech In code
The floating option list opened by a Dropdown or a Standalone Dropdown, for single or multiple choice, flat or grouped.
Figma: [Components] Data Entry › page Dropdown (node 2049:5070) · Storybook: `Design System/Action/Flyout Menu` and `Design System/Internals/Flyout Menu Item` · Code: `shared/ui/flyout-menu` (`ds-flyout-menu`, `ds-flyout-menu-item`, `ds-flyout-menu-title`)

## Overview
The Dropdown Flyout Menu is the list of options under a dropdown field. Single choice shows a fixed 20px check slot on each item; multiple choice shows a checkbox per item and an optional "Select all". Options can be grouped under section titles and the list scrolls past its maximum height. In code there is no dedicated "dropdown flyout" component: dropdowns compose the shared `ds-flyout-menu` and `ds-flyout-menu-item` (with `selectable` and `selected`). Embed the Storybook `Flyout Menu` stories and the Figma component set `Dropdown Flyout Menu` (node 2049:5070) from the `_Design system header` frame (2049:578). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use as the option list of a Dropdown or a Standalone Dropdown.
- Use the multi-select variant with checkboxes when several options can be chosen.
- Use groups with section titles when options fall into clear families.
- Don't use for a list of actions (Edit, Delete) → use the Flyout Menu of the Action library instead.
- Don't use as a free-floating panel with mixed content → use Popover instead.
- Don't show a single-choice item with a conditional icon: use the fixed 20px check slot (`selectable` / `selected`).

## Anatomy
1. `Frame 3`: the floating panel (white, shadow, scroll area with an optional `Scrollbar`).
2. Select all row (multi-select only, `Select All`).
3. Group title (`.Item` Type=Title, "Section Headline"), shown with `Group Title`.
4. `.Item`: one row, `Type` = Default, Select, Title or Separator.
5. `.Item Properties` (private atom): the content of a row, with an `Icon` slot (fixed 20px, the check when `Selected`), the `Label` and a `Focus` frame. `State` = Default, Hover, Active, Disabled.
6. `Checkbox` instances in multi-select rows.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Multi-Select | Variant | False, **True** | single: `ds-flyout-menu-item [selectable]="true"`; multi: `ds-checkbox` rows (in `ds-multi-select`) | |
| Grouped | Variant | **True**, False | `ds-flyout-menu-title` between items | |
| Group Title | Boolean | **True**, False | `ds-flyout-menu-title [label]` | |
| Scrollbar | Boolean | **True**, False | CSS overflow on the host list | |
| Select All | Boolean | **True**, False | none | Not implemented in `ds-multi-select`. |
| `.Item Properties` › Selected | Boolean (atom) | **True**, False | `selected` | Check shown in the fixed icon slot. |
| `.Item Properties` › State | Variant (atom) | **Default**, Hover, Active, Disabled | `:hover`, `:active`, `disabled` | |
| `.Item` › Type | Variant (atom) | **Default**, Select, Title, Separator | `ds-flyout-menu-item`, `ds-flyout-menu-title` | Separator code equivalent: To be defined. |
| none | | | `label` (required), `icon`, `shortcut` | Item content in code. `icon` is replaced by the check slot when `selectable`. |
| none | | | `(clicked)` | |

Slots: `ds-flyout-menu-item` accepts projected content with `slot="icon"` (for example a `ds-flag`).
Exposed nested instances: the `Checkbox` of each multi-select row.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | `.Item Properties` State=Default |
| Hover | `:hover` | State=Hover |
| Active | `:active` | State=Active |
| Disabled | `disabled` input, `aria-disabled` | State=Disabled |
| Selected | `selectable` + `selected`, `aria-selected` | Selected=True |

## Tokens
To be defined: the tokens live in the shared Flyout Menu (`shared/ui/flyout-menu/*.scss`), documented with the Action library. The Figma documentation frame (2049:969) lists the item colors: Selected / Default, Selected / Hover, Selected / Pressed, Not Selected / Hover, using the old "fundation / color / action / blue" and "soft / blue" names (#007AB3, #006192, #003781, #F1F9FA, #E6F4F6).

## Accessibility
- `ds-flyout-menu` has `role="menu"`. Items take `role="option"` with `aria-selected` when `selectable`, else `role="menuitem"`; `aria-disabled` when disabled. Titles have `role="presentation"`.
- The parent dropdown wraps the list in `role="listbox"` (and `aria-multiselectable="true"` for multi-select).
- Escape closes the list (handled by the parent dropdown).
- Selection is not color-only: the check mark or the checkbox shows it.

## Content guidelines
- Item labels are short, one line, sentence case.
- Section titles name the family in one or two words.
- "Select all" stays the first row when present.

## Do / Don't
- Do reserve the 20px check slot on every single-choice item so labels stay aligned. Don't show an icon only on the selected item.
- Do group long lists with section titles. Don't create a group for a single option.

## Related components
Composes: Checkbox, Icon, Scrollbar · Used by: Dropdown (`ds-select`, `ds-multi-select`), Standalone Dropdown, Search Bar, Tag Filter Chip, Table.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2193:2407 is still the empty template). |
