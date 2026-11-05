# Progress Bar
**Status**: Design New · Tech In code
A thin horizontal bar showing a value out of 100: a score, a completion.
Figma: [Components] Data Display › page Progress Bar (node 2024:313) · Storybook: `Design System/Feedback/Progress Bar` › Default · Code: `shared/ui/progress-bar` (`ds-progress-bar`)

## Overview
Progress Bar draws a track and a fill whose length is the value. It comes in two heights (S 4 px, used for the Result Card score; M 8 px) and four tones (Brand, Positive, Warning, Negative). Embed the Storybook `Default` story (value 0.6) and the Figma component set frame (node 2024:313) on the page `🆕 Progress Bar`.

## When to use / When not to use
- Use when you show a bounded value (0 to 100 %) such as a score or a completion rate.
- Use when the number is shown next to the bar, so the bar reinforces a figure the user can read.
- Use when the progress of a loading step is unknown: the code `indeterminate` mode animates a sliding fill.
- Don't use when the bar alone would carry a status → pair it with text or use Badge instead.
- Don't use when the value has no upper bound or must be compared across series → use Chart instead.
- Don't use when you wait for a whole region to load → use Spinner or Skeleton Item instead.

## Anatomy
1. `Progress Bar` (frame): the track, full width, rounded.
2. `Fill`: the coloured part; it stretches, and its length is set by the right padding of the instance.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Size | Variant | **S** / M | `size: 's' \| 'm'` (default `'s'`) | S 4 px, M 8 px. |
| Tone | Variant | **Brand** / Positive / Warning / Negative | `tone: 'brand' \| 'positive' \| 'warning' \| 'negative'` (default `'brand'`) | |
| Value (no property) | Instance right padding | padding = width × (1 − value); default 60 % (240 wide, padding 96) | `value: number` (0 to 1, default 0) | Figma has no value property; code clamps the value between 0 and 1. |
| (not drawn) | | | `indeterminate: boolean` (default `false`) | Animated mode exists only in code. |

Slots: none.
Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Determinate | `value` set, `indeterminate` false | All variants |
| Indeterminate | `indeterminate` true: sliding fill, animation removed under `prefers-reduced-motion: reduce` | Not drawn |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Track | background | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Track | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Track S | height | `--semantic-measurement-sizing-xs` (Figma) | `--foundation-sizing-4` |
| Track M | height | `--semantic-measurement-sizing-s` (Figma) | `--foundation-sizing-8` |
| Fill (Brand) | background | `--semantic-color-interactive-background-medium-active` | `--foundation-color-blue-a-400` |
| Fill (Positive) | background | `--semantic-color-static-background-functional-positive` | `--foundation-color-green-500` |
| Fill (Warning) | background | `--semantic-color-static-background-functional-warning` | `--foundation-color-orange-400` |
| Fill (Negative) | background | `--semantic-color-static-background-functional-negative` | `--foundation-color-red-500` |

## Accessibility
- The host has `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="1"` and `aria-valuenow` set to the value; the three attributes are removed in indeterminate mode.
- The component has no accessible name input: label it from the context (visible number or text next to it). Accessible name: To be defined.
- Not focusable, no keyboard interaction.
- The indeterminate animation respects `prefers-reduced-motion`.
- Tone alone never carries meaning: show the value or a label next to the bar.

## Content guidelines
- Show the number next to the bar (for example "72 %" or the score).
- Keep the same size inside one list or card.

## Do / Don't
- Do: show the number next to it. Don't: use it alone to carry a status; pair it with text or a Badge.
- Do: use Positive, Warning or Negative only when the value itself has that meaning. Don't: pick a tone for decoration.
- Do: use S inside dense cards. Don't: mix S and M bars in the same list.

## Related components
Composes: none · Used by: Result Card (score)

## Changelog
| Version | Date | Change |
|---|---|---|
| v1.0.0 | November 3, 2026 | New: added from code (ds-progress-bar). Note: indeterminate mode not drawn. |
| Docs | 2026-11-04 | First ZeroHeight page. |

### Notes (Figma vs code)
- Code heights are hard-coded (4 px, 8 px); Figma binds `Measurement/Sizing/XS` and `Measurement/Sizing/S`.
- Value scale differs: code 0 to 1, Figma expressed as a percentage through padding.
- The indeterminate mode is code only.
- Storybook files it under Feedback, Figma under Data Display.
