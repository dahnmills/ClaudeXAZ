# Checkbox Card
**Status**: Design Ready · Tech In code
A selectable card that combines a checkbox with a label, a description and optional content, for multi-selection among rich options.
Figma: [Components] Data Entry › page Checkbox Card (node 2093:322) · Storybook: `Design System/Data Entry/Checkbox Card` (`design-system-data-entry-checkbox-card--playground`) · Code: `shared/ui/checkbox-card` (`ds-checkbox-card`)

## Overview
Checkbox Card presents each option as a bordered card with a checkbox selector, a main label, a sub label, an optional badge and an optional additional content area. The whole card is the hit area. Embed the Storybook `Playground` story (and `States`) and the Figma component set `Checkbox Card` (node 2093:322) from the `_Design system header` frame (2193:2438). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use when users can select several options and each option needs a description.
- Use when options must stand out visually (features, plans, scopes).
- Use when an option carries a status or count shown as a badge.
- Don't use for plain lists of short options → use Checkbox instead.
- Don't use when only one option can be selected → use Radio Card instead.
- Don't use for a compact icon-led choice → use Select Button instead.

## Anatomy
1. `Selector`: holds a `Checkbox` instance (label off) on the left.
2. `Content` › `Main Content`:
   - `Main Label`: option title.
   - `Sub Label`: description under the title.
   - `Badge`: status pill (Info, Strong, S by default).
3. `Aditionnal Content`: separator line and a `.Content Properties` row (private atom with Icon and Label variants) for extra details.
4. `Slot`: free content area inside the card.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled | `disabled` | Hover and Active are pseudo-classes. |
| Selected | Variant | **False**, True | `checked` | Emits `(checkedChange)`. |
| Sub Label | Boolean | **True**, False | `sublabel` (string) | Empty string hides it. |
| Tag | Boolean | **True**, False | `badge` (string) | Rendered as `ds-badge` status info, strong, size s. Figma names it "Tag" but places a Badge. |
| Aditionnal Content | Boolean | **True**, False | none | Not implemented in code. |
| Slot | Slot | free content | none | Not implemented in code (no `ng-content`). |
| none | | | `label` (required) | Main label text. |

Slots: `Slot` (Figma only) for custom content inside the card.
Exposed nested instances: `.Content Properties` (Icon True/False, Label True/False). The nested `Checkbox` and `Badge` are not exposed.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default, Selected=False |
| Hover | `:hover` | State=Hover |
| Active | `:active` | State=Active |
| Disabled | `disabled` input, 40% opacity | State=Disabled |
| Selected | `checked` input, blue border | Selected=True |
| Focus | browser default focus outline (no `:focus-visible` style in the SCSS) | not modeled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Host | padding | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Host | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Host, Box | border | `--semantic-color-interactive-border-strong-alt-default` | `--foundation-color-grey-900` |
| Host | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Host | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Host (hover) | border-color | `--semantic-color-interactive-border-medium-alt-hover` | `--foundation-color-grey-600` |
| Host (active), Host (checked, active) (+1) | border-color | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Host (checked), Box (checked) | border-color | `--semantic-color-interactive-background-main-default` | none: token missing from `_semantic.scss` |
| Host (checked) | background | `--semantic-color-static-background-main-alt-primary` | `--foundation-color-blue-a-025` |
| Host (checked, hover), Box (checked, hover) | border-color | `--semantic-color-interactive-border-strong-hover` | `--foundation-color-blue-a-600` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Box | border-radius | `--semantic-border-radius-xs` | `--foundation-radius-2` |
| Box (checked) | background | `--semantic-color-interactive-background-main-default` | none: token missing from `_semantic.scss` |
| Box (checked, hover) | background | `--semantic-color-interactive-border-strong-hover` | `--foundation-color-blue-a-600` |
| Box (checked, active) | background | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Body | gap | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` |
| Label | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Label | font-weight | `--semantic-font-text-style-font-weight-bold` | `--foundation-font-weight-bold` |
| Label | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Label | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Sublabel | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Sublabel | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |
| Sublabel | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |
| Sublabel | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |

Warning: `--semantic-color-interactive-background-main-default` (selected border and checked box fill) is not defined in `_semantic.scss`, so these declarations resolve to nothing in the browser. The intended value per the SCSS comment is #007ab3 (`--semantic-color-interactive-background-strong-default`).

## Accessibility
- The host carries `role="checkbox"`, `aria-checked`, `tabindex="0"` (removed when disabled) and `aria-disabled`.
- Keyboard: Space and Enter toggle the card.
- The accessible name comes from the card text content; keep the main label first.
- There is no dedicated focus style in the SCSS: the browser default outline is the only focus cue.
- Group the cards under a visible question and, for a set, a `role="group"` with a name.

## Content guidelines
- Main label: short, sentence case, one line.
- Sub label: one or two short lines that explain the consequence of the option.
- Badge text: one or two words, never a sentence.

## Do / Don't
- Do keep cards in a set the same width and structure. Don't mix cards with and without sub labels in one group.
- Do use the badge for status or count. Don't use it as decoration.
- Do make the whole card clickable. Don't add a second button inside the card.

## Related components
Composes: Checkbox and Badge in Figma; in code `ds-badge` (the checkbox box is redrawn with an inline SVG, not `ds-checkbox`) · Used by: no other design system component (showcase page only).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2193:2571 is still the empty template). |
