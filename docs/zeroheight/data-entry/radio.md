# Radio
**Status**: Design Ready · Tech In code
Lets users pick exactly one option from a small set of mutually exclusive choices.
Figma: [Components] Data Entry › page Radio (node 2044:2569) · Storybook: `Design System/Data Entry/Radio` (`design-system-data-entry-radio--default`) · Code: `shared/ui/radio` (`ds-radio`)

## Overview
The radio is a 20px circle with an 8px inner dot when selected, and an optional label on its right. Radios always come in groups: selecting one deselects the others, and a selected radio cannot be unselected by clicking it again. Embed the Storybook `Default` story (and `Group` for a full set) and the Figma component set `Radio` (node 2044:2569) from the `_Design system header` frame (2044:2631). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use when users must choose one option, and only one, from 2 to about 6 visible choices.
- Use when all options should be visible at once so users can compare them.
- Use for settings applied on submit, such as a payment method or a scope choice.
- Don't use when users can select several options → use Checkbox instead.
- Don't use for a single on/off setting applied immediately → use Toggle instead.
- Don't use when the list is long (more than about 6 options) → use Dropdown instead.
- Don't use when each option needs a description, a badge or a preview → use Radio Card instead.

## Anatomy
1. `.Radio`: the 20px circle with a 2px border. Shows the 8px dot when selected.
2. `Label`: optional text on the right (Body L regular, 16px).
3. `Border Focus`: focus ring around the circle, shown when `Focus` is on.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled | `state` (visual override), `disabled` | Hover and Active are CSS pseudo-classes in production. |
| Selected | Variant | **False**, True | `selected` | Emits `(selectedChange)` with `true` only; the group owns deselection. |
| Error | Variant | **False**, True | `error` | Red border and red dot. |
| Label | Boolean | **True**, False | `label` (string) | Empty string hides the label. |
| Focus | Boolean | **False**, True | none | In code, `:focus-visible` on the host draws the ring. |

Slots: none.
Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` (Storybook: `state="Hover"`) | State=Hover |
| Active | `:active` (Storybook: `state="Active"`) | State=Active |
| Disabled | `disabled` input, 40% opacity | State=Disabled |
| Selected | `selected` input | Selected=True |
| Error | `error` input | Error=True |
| Focus | `:focus-visible` on the host | Focus=True |

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
| Circle (focus-visible) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Circle | border | `--semantic-color-interactive-border-strong-alt-default` | `--foundation-color-grey-900` |
| Circle | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Dot, Dot (selected) | background-color | `--semantic-color-interactive-icon-strong-default` | `--foundation-color-blue-a-500` |
| Circle (hover) | border-color | `--semantic-color-interactive-border-strong-alt-hover` | `--foundation-color-grey-800` |
| Circle (active) | border-color | `--semantic-color-interactive-border-strong-alt-active` | `--foundation-color-grey-700` |
| Circle (selected) | border-color | `--semantic-color-interactive-border-strong-default` | `--foundation-color-blue-a-500` |
| Circle (hover, selected) | border-color | `--semantic-color-interactive-border-strong-hover` | `--foundation-color-blue-a-600` |
| Dot (hover, selected) | background-color | `--semantic-color-interactive-icon-strong-hover` | `--foundation-color-blue-a-600` |
| Circle (active, selected) | border-color | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Dot (active, selected) | background-color | `--semantic-color-interactive-icon-strong-active` | `--foundation-color-blue-a-700` |
| Circle (error) | border-color | `--semantic-color-interactive-border-strong-negative-default` | `--foundation-color-red-300` |
| Dot (error, selected) | background-color | `--semantic-color-interactive-icon-strong-negative-default` | `--foundation-color-red-300` |
| Circle (hover, error) | border-color | `--semantic-color-interactive-border-strong-negative-hover` | `--foundation-color-red-400` |
| Dot (hover, error, selected) | background-color | `--semantic-color-interactive-icon-strong-negative-hover` | `--foundation-color-red-400` |
| Circle (active, error) | border-color | `--semantic-color-interactive-border-strong-negative-active` | `--foundation-color-red-500` |
| Dot (active, error, selected) | background-color | `--semantic-color-interactive-icon-strong-negative-active` | `--foundation-color-red-500` |

## Accessibility
- The host carries `role="radio"`, `aria-checked`, `tabindex="0"` (removed when disabled) and `aria-disabled`.
- Keyboard: Space and Enter select the radio. Arrow-key navigation inside a group is not provided by `ds-radio`: wrap the group in an element with `role="radiogroup"` and an accessible name. For a setting with arrow keys and roving focus, `ds-segmented-control mode="radio"` already implements the full pattern.
- A radio with no visible label needs an accessible name from its context.
- Error must come with a text message in the form, not color alone.

## Content guidelines
- Labels are short, parallel in structure and in sentence case.
- One line only (`white-space: nowrap`): never wrap and never truncate a label.
- Order options logically (most common first, or natural order such as small to large).
- Preselect a sensible default when one exists.

## Do / Don't
- Do give the group a visible label that states the question. Don't leave a group of radios without context.
- Do keep the options mutually exclusive. Don't add a radio that overlaps another option.
- Do preselect the safest option when a default exists. Don't preselect a choice with consequences the user has not read.

## Related components
Composes: none (atom) · Used by: Radio Card (Figma), Action Card, Filter Drawer.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2193:2111 is still the empty template). |
