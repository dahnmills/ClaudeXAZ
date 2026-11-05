# Tooltip
**Status**: Design Ready · Tech In code
A small label that appears on hover or focus to name or explain an element.
Figma: [Components] Feedback › page Tooltip (node 119:4038) · Storybook: `Design System/Feedback/Tooltip` (id `design-system-feedback-tooltip--on-hover`) · Code: `shared/ui/tooltip` (`ds-tooltip` + directive `[dsTooltip]`)

## Overview
Figma description: "Tooltips provide users with additional contextual information or guidance when interacting with interface elements. They appear upon hover or focus, presenting brief, helpful content without cluttering the interface. The component is available in two variants: the default dark background, ideal for general use, and the Reversed variant with a white background, ensuring optimal readability on darker surfaces." In code, put the `dsTooltip` directive on the trigger; it creates the tooltip on the page body and positions it. Embed the Storybook story `OnHover` as the live example, and the Figma component set `Tooltip` (node 119:4038) as the visual reference.

## When to use / When not to use
- Use to name an icon-only control (Button Icon) with the same words as its `ariaLabel`.
- Use to give a short reason why a control is disabled (the directive also works on a wrapper around a disabled control).
- Use to show the full value of a truncated text.
- Use Reversed on dark surfaces.
- Don't use for content with a title, an image or actions → use Popover instead.
- Don't use for information the user needs to complete a task → show it on the page (helper text, Functional Notice) instead.
- Don't use on touch-only interactions, where hover does not exist → use Popover or visible text instead.

## Anatomy
1. `Content` (frame): the label on a dark plate (Grey/900, white text), padding 4px 8px, 4px radius, Body M (14px / 20px). Max width 320px in code; longer text wraps.
2. `Indicator` (frame): the 8 x 4px arrow that points to the trigger, on the side opposite to the position.
3. Shadow: drop shadow `0 0 2px rgba(0, 0, 0, 0.25)` in code.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Position | Variant | **Top Right**, Top Center, Top Left, Bottom Right, Bottom Center, Bottom Left, Left, Right | `dsTooltipPosition` / `position: 'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right' \| 'left' \| 'right'` (default `'top-center'`) | Defaults differ: Top Right in Figma, top-center in code. |
| Reversed | Variant | **False**, True | `dsTooltipReversed` / `reversed: boolean` (default `false`) | |
| (none) | | | `dsTooltip` / `text: string` (required) | The `Content` text. |
| (none) | | | `dsTooltipDelay: number` (default `1000` ms) | Hover delay. Focus shows it at once. |

Slots: none.

Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Hidden | default | not modeled |
| Shown on hover | `mouseenter` after `dsTooltipDelay` | the component |
| Shown on focus | `focusin` on the trigger or inside it, no delay | the component |
| Hidden again | `mouseleave`, `focusout`, click on the trigger | not modeled |
| Flipped | the directive flips top and bottom, and clamps left and right, when the tooltip would leave the viewport | not modeled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Content | padding | `--semantic-measurement-spacing-xs` `--semantic-measurement-spacing-s` | `--foundation-spacing-4` / `-8` |
| Content | radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Content (default) | background, text, arrow | `--semantic-color-static-background-accent-primary`, `--semantic-color-static-text-subtle-primary` | `--foundation-color-grey-900`, `--foundation-color-white-1000` |
| Content (Reversed) | background, text, arrow | `--semantic-color-static-background-main-primary`, `--semantic-color-static-text-main-primary` | `--foundation-color-white-1000`, `--foundation-color-grey-900` |
| Content | font | `--semantic-font-family`, `--semantic-font-text-style-size-m`, `--semantic-font-text-style-line-height-m`, `--semantic-font-text-style-letter-spacing-s` | `--foundation-font-size-14`, `--foundation-font-line-height-20`, `--foundation-font-letter-spacing-0-2` |
| Content | max-width | `--semantic-measurement-sizing-3xl` x 5 | `--foundation-sizing-64` x 5 (320px) |

Values written outside tokens in the SCSS: drop shadow `0 0 2px rgba(0, 0, 0, 0.25)`, arrow 4px borders, arrow offset 8px, z-index 10000, gap to trigger 4px (directive). DESIGN.md lists a different tooltip shadow (`0 1px 3px 0 rgba(65,65,65,0.40)`).

## Accessibility
- The tooltip has `role="tooltip"` and opens on keyboard focus, not only on hover.
- The directive removes the native `title` of the trigger, so there is no double tooltip.
- The tooltip is not linked to its trigger with `aria-describedby`, and Escape does not close it. For an icon-only control, the `ariaLabel` of Button Icon must carry the same text so screen reader users get it.
- `pointer-events: none`: the user cannot hover or select the tooltip text.

## Content guidelines
- A few words, one line when possible ("Copy reference", "Only admins can delete").
- No title, no link, no action inside.
- Sentence case, no final period for fragments, no em dash.

## Do / Don't
- Do repeat the `ariaLabel` of an icon button in its tooltip; don't write a different text.
- Do explain why a control is disabled; don't use a tooltip to hide essential instructions.
- Do keep it short; don't write a paragraph (use Popover).

## Related components
Composes: none · Used by: app pages through the `dsTooltip` directive (on Button Icon, truncated text, disabled controls).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
