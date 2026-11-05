# Toggle
**Status**: Design Ready · Tech In code
A switch that turns a single setting or feature on or off, with immediate effect.
Figma: [Components] Data Entry › page Toggle (node 2044:2853) · Storybook: `Design System/Data Entry/Toggle` (`design-system-data-entry-toggle--default`) · Code: `shared/ui/toggle` (`ds-toggle`)

## Overview
The toggle is a 40×20 track with a 16px knob that slides to the right when on, plus an optional label. It represents a binary state that takes effect as soon as it changes, such as enabling a rule or a notification. Embed the Storybook `Default` story (and `Interactive`) and the Figma component set `Toggle` (node 2044:2853) from the `_Design system header` frame (2044:2930). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use when a setting is binary (on or off) and applies immediately.
- Use to enable or disable a feature, a rule or a notification.
- Use in a table row to switch an item active or inactive.
- Don't use when the change only applies after a Save or Submit → use Checkbox instead.
- Don't use for more than two options → use Radio or Dropdown instead.
- Don't use to trigger an action (submit, delete) → use Button instead.

## Anatomy
1. `🧬 Switch`: the track (40×20, fully rounded) and the 16px knob.
2. `Label`: optional text on the right (Body L regular, 16px).
3. `Border Focus`: focus ring around the track, shown when `Focus` is on.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled | `state` (visual override), `disabled` | Hover and Active are CSS pseudo-classes in production. |
| Selected | Variant | **False**, True | `selected` | On state. Emits `(selectedChange)` with the new value. |
| Error | Variant | **False**, True | `error` | Red track. |
| Label | Boolean | **True**, False | `label` (string) | Empty string hides the label. |
| Focus | Boolean | **False**, True | none | In code, `:focus-visible` on the host draws the ring. |

Slots: none.
Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Off | `selected` false | Selected=False |
| On | `selected` true, knob moves 20px | Selected=True |
| Hover | `:hover` (Storybook: `state="Hover"`) | State=Hover |
| Active | `:active` (Storybook: `state="Active"`) | State=Active |
| Disabled | `disabled` input, 40% opacity | State=Disabled |
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
| Track (focus-visible) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Track | background-color | `--semantic-color-interactive-background-medium-alt-default` | `--foundation-color-grey-500` |
| Knob | background-color | `--semantic-color-interactive-background-neutral-default` | `--foundation-color-white-1000` |
| Track (hover) | background-color | `--semantic-color-interactive-background-medium-alt-hover` | `--foundation-color-grey-600` |
| Track (active) | background-color | `--semantic-color-interactive-background-medium-alt-active` | `--foundation-color-grey-700` |
| Track (disabled) | background-color | `--semantic-color-interactive-background-strong-alt-disabled` | `--foundation-color-grey-900` |
| Track (selected) | background-color | `--semantic-color-interactive-background-strong-default` | `--foundation-color-blue-a-500` |
| Track (hover, selected) | background-color | `--semantic-color-interactive-background-strong-hover` | `--foundation-color-blue-a-600` |
| Track (active, selected) | background-color | `--semantic-color-interactive-background-strong-active` | `--foundation-color-blue-a-700` |
| Track (error) | background-color | `--semantic-color-interactive-background-strong-negative-default` | `--foundation-color-red-300` |
| Track (hover, error) | background-color | `--semantic-color-interactive-background-strong-negative-hover` | `--foundation-color-red-400` |
| Track (active, error) | background-color | `--semantic-color-interactive-background-strong-negative-active` | `--foundation-color-red-500` |
| Track (disabled, error) | background-color | `--semantic-color-interactive-background-strong-negative-disabled` | `--foundation-color-red-300` |

Note: the track radius (`14px`) and the track and knob sizes (40×20, 16px) are raw values in the SCSS, not tokens.

## Accessibility
- The host carries `role="switch"`, `aria-checked`, `tabindex="0"` (removed when disabled) and `aria-disabled`.
- Keyboard: Space and Enter flip the switch.
- A toggle without a visible label (for example in a table cell) needs an accessible name from its context. `ds-toggle` has no `ariaLabel` input today.
- On and off must not rely on color only: the knob position also changes, and the label should name the setting.

## Content guidelines
- The label names the setting, not the state ("Email notifications", not "On").
- Sentence case, one line, never wrapped and never truncated.
- Do not add "On" / "Off" text next to the switch unless the context is ambiguous.

## Do / Don't
- Do apply the change as soon as the toggle flips. Don't pair a toggle with a Save button.
- Do label the setting the toggle controls. Don't use a toggle for a question that has two named answers (use Radio).
- Do confirm risky changes elsewhere (dialog). Don't use a toggle to delete or reset data.

## Related components
Composes: none (atom) · Used by: Table (row activation).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2193:2080 is still the empty template). |
