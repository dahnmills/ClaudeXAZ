# Select Button
**Status**: Design Ready · Tech In code
A compact, icon-led button that users select or deselect to pick one or several predefined options.
Figma: [Components] Data Entry › page Select Button (node 2221:1490) · Storybook: `Design System/Data Entry/Select Button` (`design-system-data-entry-select-button--playground`) · Code: `shared/ui/select-button` (`ds-select-button`)

## Overview
Select Button is a 160px wide tile with an icon, a label and an optional sub label. It gives immediate visual feedback when selected (blue border). Embed the Storybook `Playground` story (and `States`) and the Figma component set `Select Button` (node 2221:1490) from the `_Design system header` frame (2221:1137). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use for a small set of options that are easier to recognize with an icon (document types, channels).
- Use in compact layouts where cards would take too much room.
- Use for single or multiple selection; the parent decides which.
- Don't use when options need a description and extra content → use Radio Card or Checkbox Card instead.
- Don't use to trigger an action → use Button instead.
- Don't use for a view switch → use Segmented Control or Tabs instead.

## Anatomy
1. Icon: a 24px icon at the top (Figma nested instance `Upload Document`).
2. `Frame 4` › Label: option name.
3. `Frame 4` › Sublabel: optional secondary line.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled | `disabled` | Hover and Active are pseudo-classes. |
| Selected | Variant | **False**, True | `selected` | The parent toggles it on `(clicked)`. |
| Sub Label | Boolean | **True**, False | `sublabel` (string) | |
| Icon | Boolean | **True**, False | `icon` (IconName, default `file`) | Code always renders an icon; there is no way to hide it. Figma has no instance swap property for the glyph. |
| none | | | `label` (required) | |

Slots: none.
Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` | State=Hover |
| Active | `:active` | State=Active |
| Disabled | `disabled` input | State=Disabled |
| Selected | `selected` input, `aria-pressed="true"` | Selected=True |
| Focus | browser default outline (no focus style in the SCSS) | not modeled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Host | padding | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Host | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Host | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Host | border | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Host | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Host | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Host (hover) | border-color | `--semantic-color-interactive-border-medium-alt-hover` | `--foundation-color-grey-600` |
| Host (hover) | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Host (active) | border-color | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Host (selected) | border-color | `--semantic-color-interactive-border-strong-default` | `--foundation-color-blue-a-500` |
| Host (selected) | background | `--semantic-color-interactive-background-light-default` | `--foundation-color-blue-a-025` |
| Icon (selected) | color | `--semantic-color-interactive-text-strong-default` | `--foundation-color-blue-a-500` |
| Host (selected, hover) | border-color | `--semantic-color-interactive-border-strong-hover` | `--foundation-color-blue-a-600` |
| Host (selected, hover) | background | `--semantic-color-interactive-background-light-hover` | `--foundation-color-blue-a-050` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Icon, Sublabel | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Label | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Label | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Label | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Label | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Sublabel | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Sublabel | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |

## Accessibility
- The host carries `role="button"`, `aria-pressed` (selected state), `tabindex="0"` (removed when disabled) and `aria-disabled`.
- Keyboard: Space and Enter emit `(clicked)`.
- The icon is decorative; the label gives the accessible name.
- No dedicated focus style in the SCSS: the browser default outline is the only focus cue.

## Content guidelines
- Label: one to three words, sentence case, one line.
- Sub label: a short qualifier (a format, a count), not a sentence.
- Pick icons that match the label meaning; never an icon without a label.

## Do / Don't
- Do keep all buttons of a set the same size. Don't mix buttons with and without sub labels in one row.
- Do say in the group label if several choices are allowed. Don't let users guess single or multiple selection.

## Related components
Composes: `ds-icon` · Used by: no other design system component (showcase page only).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2221:1275 is still the empty template). |
