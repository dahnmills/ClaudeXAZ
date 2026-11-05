# Radio Card
**Status**: Design Ready · Tech In code
A selectable card for choosing one option among visually emphasized, mutually exclusive choices.
Figma: [Components] Data Entry › page Radio Card (node 2093:217) · Storybook: `Design System/Data Entry/Radio Card` (`design-system-data-entry-radio-card--playground`) · Code: `shared/ui/radio-card` (`ds-radio-card`)

## Overview
Radio Card presents each choice as a bordered card with a radio selector, a main label, a sub label, an optional badge and optional additional content. Selecting one card deselects the others. With the selector and label turned off and a preview placed in the slot, it becomes a visual choice tile (for example the board layout picker of Buyer Summary). Embed the Storybook `Playground` story (and `States`) and the Figma component set `Radio Card` (node 2093:217) from the `_Design system header` frame (2193:2686). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use when users choose one option and each option needs a description.
- Use for decisions that deserve emphasis (a scope, a mode, a template).
- Use as a visual tile with a preview in the slot (selector and label off).
- Don't use when several options can be chosen → use Checkbox Card instead.
- Don't use for short plain options → use Radio instead.
- Don't use for a compact switch between views → use Segmented Control instead.

## Anatomy
1. `Selector`: holds a `Radio` instance on the left (hidden with `Show selector` off).
2. `Content` › `Main Content`: `Main Label` (hidden with `Show label` off), `Sub Label` and a `Badge`.
3. `Aditionnal Content`: separator and a `.Content Properties` row (private atom, Icon and Label variants).
4. `Slot`: free content area, used for previews.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled | `disabled` | Hover and Active are pseudo-classes. |
| Selected | Variant | **False**, True | `selected` | Emits `(selectedChange)` with `true`. |
| Sub Label | Boolean | **True**, False | `sublabel` (string) | |
| Tag | Boolean | **True**, False | `badge` (string) | Rendered as `ds-badge` info, strong, s. |
| Aditionnal Content | Boolean | **True**, False | none | Not implemented in code. |
| Show selector | Boolean | **True**, False | none | New 2026-11 in Figma. Visual tile mode is `ds-grid-selection` in code. |
| Show label | Boolean | **True**, False | none | New 2026-11 in Figma. Code always renders `label` (required). |
| Slot | Slot | free content | `slot="meta"` (right edge only) | Code slot is a trailing meta area, not a full content slot. |
| none | | | `tone` | `default`, `success`, `warning`, `error`: color of the selected state. Code only. |

Slots: `Slot` (Figma) for custom content or a preview. Code exposes `[slot=meta]` for a value shown on the right edge of the card.
Exposed nested instances: `.Content Properties` (Icon, Label). The nested `Radio` and `Badge` are not exposed.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` | State=Hover |
| Active | `:active` | State=Active |
| Disabled | `disabled` input, 40% opacity | State=Disabled |
| Selected | `selected` input, blue border and background (or the `tone` color) | Selected=True |
| Focus | `:focus-visible` | not modeled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Host | padding | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Host | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Host, Circle | border | `--semantic-color-interactive-border-strong-alt-default` | `--foundation-color-grey-900` |
| Host | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Host | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Host (hover) | border-color | `--semantic-color-interactive-border-medium-alt-hover` | `--foundation-color-grey-600` |
| Host (active), Host (selected, active) (+1) | border-color | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Host (selected), Circle (selected) | border-color | `--semantic-color-interactive-background-strong-default` | `--foundation-color-blue-a-500` |
| Host (selected) | background | `--semantic-color-static-background-main-alt-primary` | `--foundation-color-blue-a-025` |
| Host (selected, hover), Circle (selected, hover) | border-color | `--semantic-color-interactive-border-strong-hover` | `--foundation-color-blue-a-600` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Host (focus-visible) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Host (selected), Host (selected, hover) (+1) | border-color | `--semantic-color-static-border-main-functional-positive` | `--foundation-color-green-500` |
| Host (selected) | background | `--semantic-color-static-background-subtle-functional-positive` | `--foundation-color-green-050` |
| Host (selected), Host (selected, hover) (+1) | border-color | `--semantic-color-static-border-main-functional-warning` | `--foundation-color-orange-400` |
| Host (selected) | background | `--semantic-color-static-background-subtle-functional-warning` | `--foundation-color-orange-050` |
| Host (selected), Host (selected, hover) (+1) | border-color | `--semantic-color-static-border-main-functional-negative` | `--foundation-color-red-500` |
| Host (selected) | background | `--semantic-color-static-background-subtle-functional-negative` | `--foundation-color-red-050` |
| Dot (selected) | background | `--semantic-color-static-text-main-functional-positive` | `--foundation-color-green-500` |
| Dot (selected) | background | `--semantic-color-static-text-main-functional-warning` | `--foundation-color-orange-400` |
| Dot (selected) | background | `--semantic-color-static-text-main-functional-negative` | `--foundation-color-red-500` |
| Dot | width | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Dot | height | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Dot | background | `--semantic-color-interactive-background-strong-default` | `--foundation-color-blue-a-500` |
| Dot (selected, hover) | background | `--semantic-color-interactive-border-strong-hover` | `--foundation-color-blue-a-600` |
| Dot (selected, active) | background | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Body | gap | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` |
| Label | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Label | font-weight | `--semantic-font-text-style-font-weight-bold` | `--foundation-font-weight-bold` |
| Label | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Label | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Sublabel | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Sublabel | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |
| Sublabel | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |
| Sublabel | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |

## Accessibility
- The host carries `role="radio"`, `aria-checked`, `tabindex="0"` (removed when disabled) and `aria-disabled`.
- Keyboard: Space and Enter select the card. Arrow-key navigation is not built in: wrap the set in `role="radiogroup"` with an accessible name.
- In visual tile mode (no visible label), give each tile an accessible name.
- The `tone` color must not be the only meaning carrier: keep the label explicit.

## Content guidelines
- Main label: short, sentence case, one line.
- Sub label explains the consequence of the choice in one or two short lines.
- Badge: one or two words.

## Do / Don't
- Do preselect the recommended option when there is one. Don't leave a required choice without guidance.
- Do keep all cards of a set the same structure. Don't mix tiles and text cards in one group.
- Do use `tone` only when the choice carries a decision meaning (accept, refuse). Don't use it as decoration.

## Related components
Composes: Radio and Badge in Figma; in code `ds-badge` (the radio circle is redrawn, not `ds-radio`) · Used by: Grid Selection (visual equivalent in code), screens such as Admin Data, TAG Configuration and Portfolio Management.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.1 | November 2026 | Added `Show selector` and `Show label` to build visual choice tiles with the Slot (from the component description). |
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2193:2781 is still the empty template). |
