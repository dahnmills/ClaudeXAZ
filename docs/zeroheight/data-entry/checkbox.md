# Checkbox
**Status**: Design Ready · Tech In code
Lets users select one or several independent options, with checked, unchecked and indeterminate states.
Figma: [Components] Data Entry › page Checkbox (node 2043:2375) · Storybook: `Design System/Data Entry/Checkbox` (`design-system-data-entry-checkbox--default`) · Code: `shared/ui/checkbox` (`ds-checkbox`)

## Overview
The checkbox is a 20px square box with an optional text label on its right. It supports multi-selection in forms, filter lists and table selection, and an indeterminate state for "some children selected" parents. Embed the Storybook `Default` story and the Figma component set `Checkbox` (node 2043:2375) from the Component section of the `_Design system header` frame (2043:2037). Note: the Figma header still shows the Tech badge as "Draft", while the component is implemented in code.

## When to use / When not to use
- Use when users can select several independent options from a list.
- Use when a single option is a yes/no opt-in that is applied on submit (for example "Extend country search").
- Use when a parent option summarizes a group of child options (indeterminate state).
- Use in table rows and headers to select records for bulk actions.
- Don't use when only one option can be chosen in a group → use Radio instead.
- Don't use when the change applies immediately (a setting switched on or off) → use Toggle instead.
- Don't use when each option needs a description or a badge → use Checkbox Card instead.
- Don't use when the choices are many and space is short → use Dropdown (multi-select) instead.

## Anatomy
1. `Box`: the 20px square, 2px border, 4px radius. Holds the check mark or the indeterminate dash.
2. `Label`: optional text on the right of the box (Body L regular, 16px).
3. `Border Focus`: focus ring drawn around the box when `Focus` is on.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled | `state` (visual override for Storybook), `disabled` | Hover and Active are CSS pseudo-classes in production; `state` only forces the look. |
| Selected | Variant | **False**, True | `checked` | Two-way via `(checkedChange)`. |
| Indeterminate | Variant | **False**, True | `indeterminate` | Rendered only when `checked` is also true. Emits `(indeterminateChange)`. |
| Error | Variant | **False**, True | `error` | Red border, red fill when checked. |
| Label | Boolean | **True**, False | `label` (string) | Empty string hides the label. Use `ariaLabel` when there is no visible label. |
| Focus | Boolean | **False**, True | none | Figma toggle only; in code focus is `:focus-visible`. |

Slots: none.
Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` on the box | State=Hover |
| Active | `:active` (Storybook: `state="Active"`) | State=Active |
| Disabled | `disabled` input, 40% opacity, `aria-disabled` | State=Disabled |
| Checked | `checked` input | Selected=True |
| Indeterminate | `checked` + `indeterminate` inputs | Indeterminate=True |
| Error | `error` input | Error=True |
| Focus | `:focus-visible` | Focus=True |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host, Container | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Host | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Host | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Host | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Host | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |
| Host | letter-spacing | `--semantic-font-text-style-letter-spacing-none` | `--foundation-font-letter-spacing-0` |
| Host | color | `--semantic-color-interactive-text-strong-alt-default` | `--foundation-color-grey-900` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Box | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Box | border | `--semantic-color-interactive-border-strong-alt-default` | `--foundation-color-grey-900` |
| Box | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Box (hover) | background-color | `--semantic-color-interactive-background-light-alt-hover` | `--foundation-color-grey-100` |
| Box  checked (checked, hover) | background-color | `--semantic-color-interactive-background-strong-hover` | `--foundation-color-blue-a-600` |
| Box  indeterminate (indeterminate, hover) | border-color | `--semantic-color-interactive-border-strong-hover` | `--foundation-color-blue-a-600` |
| Box (focus-visible) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Check, Indeterminate | color | `--semantic-color-static-text-subtle-primary` | `--foundation-color-white-1000` |

Note: the checked background and border colors are set from the component TypeScript (`checkedColor()`, `checkedBorderColor()`), not the SCSS. They use `--semantic-color-interactive-background-strong-default` / `-hover` / `-active`, `--semantic-color-interactive-border-strong-default`, and the `-negative-` equivalents in error.

## Accessibility
- The host carries `role="checkbox"`, `tabindex="0"` (removed when disabled) and `aria-checked` (`"mixed"` when indeterminate).
- Keyboard: Space and Enter toggle the box.
- A checkbox without a visible label must receive `ariaLabel` (for example a table header "Select all rows").
- Disabled sets `aria-disabled="true"` and removes the box from the tab order.
- Status is not color-only: the error state must come with a message in the parent form.

## Content guidelines
- Labels are short, in sentence case, and describe the option, not the action ("Extend country search", not "Click to extend").
- The label stays on one line (`white-space: nowrap`): never wrap it on two lines and never truncate it. Give the row the width it needs.
- Avoid negative labels ("Don't send"): users should check to get something, not to avoid it.

## Do / Don't
- Do use the indeterminate state on a parent that has some, not all, children selected. Don't use it as a third "unknown" value.
- Do group related checkboxes under a field label. Don't use one checkbox for mutually exclusive choices.
- Do keep the label clickable with the box. Don't place a separate text next to an unlabeled box.

## Related components
Composes: none (atom) · Used by: Checkbox Card (Figma only, see Checkbox Card), Dropdown Flyout Menu (multi-select items), Multi Select (`ds-multi-select`), More Criteria, Filter Drawer, Tag Filter Chip, Table selection cells.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2043:2075 is still the empty template). |
