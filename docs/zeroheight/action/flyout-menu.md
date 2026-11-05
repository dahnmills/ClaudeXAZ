# Flyout Menu
**Status**: Design Ready · Tech In code
A floating list of actions or options that opens from a trigger (button, dropdown, more icon).
Figma: [Components] Action › page Flyout Menu (node 507:833, slot version 3.0.0; node 1:20, item-count version 2.0.0) · Storybook: `Design System/Action/Flyout Menu` (id `design-system-action-flyout-menu--four-actions`) · Code: `shared/ui/flyout-menu` (`ds-flyout-menu`)

## Overview
Flyout Menu is the white floating panel that lists Flyout Menu Items. It is the common surface behind "more" menus, the Button Split menu and the option lists of Select, Multi Select and Standalone Dropdown. Figma holds two versions: version 3.0.0 is a container with a `Slot` that receives Flyout Items; version 2.0.0 fixes the number of items (1 to 7). Embed the Storybook story `FourActions` as the live example, and the Figma component `Flyout Menu` (node 507:833) as the visual reference.

## When to use / When not to use
- Use to group secondary actions behind a "more" Button Icon or a Button Split.
- Use as the option list of a dropdown control.
- Use with section titles (`ds-flyout-menu-title`) when actions fall into groups.
- Use with selectable items for a single choice in a flyout (check mark in a fixed 20px slot).
- Don't use for the primary action of a screen → use Button instead.
- Don't use for rich content with text, image or several actions → use Popover instead.
- Don't use to show a short hint on hover → use Tooltip instead.
- Don't use when the user must fill a form → use Modal or Drawer instead.

## Anatomy
1. `Flyout Menu` (container): white panel, 4px radius, flyout shadow, vertical padding 8px, min width 196px in code.
2. `Slot` (version 3.0.0): receives `Flyout Item` instances. In version 2.0.0, a fixed stack of `.Item` instances (private atom) set by `# Items`.
3. Items: `Flyout Item` (see its own page) or `.Item` (private, same properties as Flyout Item).
4. Section title (code only): `ds-flyout-menu-title`, bold 16px label on white, padding 6px top and bottom, 16px left.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Slot (v3.0.0) | Slot | Flyout Item instances | default content projection | Put `ds-flyout-menu-item` and `ds-flyout-menu-title` elements inside `ds-flyout-menu`. |
| # Items (v2.0.0) | Variant | **7**, 6, 5, 4, 3, 2, 1 | none | In code the number of items is the number of children. |
| (none) | | | none | `ds-flyout-menu` has no input. Opening, positioning and "one open flyout at a time" are handled by the trigger (`single-open-flyout.ts` contract: `closeFlyout`, `claimFlyout`, `releaseFlyout`). |

Slots: `Slot` (v3.0.0) takes Flyout Items. In code the default projection takes items and titles.

Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Open | rendered by the trigger component when open | the component itself |
| Item states | on each `ds-flyout-menu-item` (hover, active, focus, disabled, selected) | on `Flyout Item` / `.Item` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` (4px) |
| Container | box-shadow | `--semantic-shadow-flyout` | `--foundation-shadow-bottom-400` (0 2px 4px 0 rgba(65,65,65,0.50)) |
| Container | vertical padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` (8px) |
| Title | padding | `--semantic-measurement-spacing-xs` + `--semantic-measurement-spacing-xxs` (6px), `--semantic-measurement-spacing-m` | `--foundation-spacing-4` + `--foundation-spacing-2`, `--foundation-spacing-16` |
| Title | font | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l`, `--semantic-font-text-style-font-weight-bold`, `--semantic-font-text-style-letter-spacing-none` | `--foundation-font-size-16`, `--foundation-font-line-height-24`, `--foundation-font-weight-bold`, `--foundation-font-letter-spacing-0` |
| Title | color, background | `--semantic-color-static-text-main-primary`, `--semantic-color-static-background-main-primary` | `--foundation-color-grey-900`, `--foundation-color-white-1000` |

Values written outside tokens in the SCSS: min-width 196px.

## Accessibility
- The container has `role="menu"`. Items are `role="menuitem"`, or `role="option"` with `aria-selected` when `selectable`.
- When items are selectable, the list semantically behaves as a listbox; the consumer (Select, Standalone Dropdown) should set `role="listbox"` on its list.
- Each item is focusable (`tabindex="0"`) and activates with Enter and Space. Arrow key navigation, Escape to close and focus return to the trigger are the trigger's job.
- Section titles have `role="presentation"`.
- Only one flyout is open at a time in the document (single-open contract).

## Content guidelines
- Item labels start with a verb for actions ("Duplicate rule", "Export to Excel"), or name the value for options.
- One line per item; keep labels short.
- Sentence case, no final punctuation.
- Order items by frequency, with destructive actions last.
- No em dash.

## Do / Don't
- Do group long menus with section titles; don't list more than about seven actions without structure.
- Do show the check mark in its fixed slot for single choice; don't add or remove an icon to show the selection (the label must not move).
- Do close the menu after an action runs; don't keep two flyouts open at once.

## Related components
Composes: Flyout Menu Item (`ds-flyout-menu-item`), Flyout Menu Title (`ds-flyout-menu-title`) · Used by: Multi Select, Search Bar Multi, Search Bar Scoped, Select, Standalone Dropdown, Table, Tag Filter Chip.

## Changelog
| Version | Date | Change |
|---|---|---|
| 3.0.0 | date unknown | Slot version: `Flyout Menu` (node 507:833) with a `Slot` and the published `Flyout Item` set (node 507:996). Version from the Figma header. |
| 2.0.0 | date unknown | `Flyout Menu` with `# Items` 1 to 7 (node 1:20) built on the private `.Item`. The Versionning frame is still the empty template. |
