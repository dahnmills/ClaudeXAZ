# Policy color
**Status**: Design WIP · Tech Planned
A read-only round pill that shows a policy's color code (Green, Yellow, Orange, Red, U, N) as a letter, optionally followed by the color name.
Figma: [Components] Data Display › page Policy color (node 1655:14105) · Storybook: none · Code: none (no `shared/ui` component yet)

## Overview
Policy color is the policy counterpart of Grade: a 24 px (M) or 20 px (S) circle with the color's initial (G, Y, O, R) or a code (U, N), and an optional text label ("Green"). It is used in the policy topbox, where Page Header exposes it as `Grade`. Embed the Figma component frame on the Policy color page (`_Design system header` 1655:14072). There is no Storybook story to embed.

## When to use / When not to use
- Use when showing the color code of a policy in a topbox, a result row or a table cell.
- Use when the color must be readable without color perception (the letter is always shown).
- Use Color info (text label) when the code appears alone, outside a known column.
- Don't use when showing a buyer's credit grade → use Grade instead.
- Don't use when showing a workflow status (issued, cancelled) → use Badge instead.

## Anatomy
1. `Badge` frame: round pill (radius 16) filled with the policy color.
2. Letter (`Label` text): G, Y, O, R, U or N.
3. Color info (`Green` text): optional color name, controlled by `Color info`; not drawn for U and N.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Color | Variant | **Green**, Yellow, Orange, Red, U, N | To be defined | No code component. Meaning of U and N: To be defined. |
| Size | Variant | **M**, S | To be defined | M 24 px, S 20 px. |
| Color info | Boolean | **true**, false | To be defined | Shows the color name after the pill. |

Slots: none.
Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | To be defined (no code) | Default |

Read-only: no interactive state.

## Tokens
Figma bindings (no code yet):

| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Pill Green | fill | `--semantic-color-static-background-grade-2` (Figma `Grade/#2`) | `--foundation-color-green-400` |
| Pill Yellow | fill | `--semantic-color-static-background-grade-4` (Figma `Grade/#4`) | `--foundation-color-orange-200` |
| Pill Orange | fill | `--semantic-color-static-background-grade-6` (Figma `Grade/#6`) | `--foundation-color-orange-400` |
| Pill Red | fill | `--semantic-color-static-background-grade-7` (Figma `Grade/#7`) | `--foundation-color-red-400` |
| Pill U | fill | Figma `Color/Static/Background/Grade/NC-NA` (code equivalent `--semantic-color-static-background-grade-none`) | `--foundation-color-grey-300` |
| Pill N | fill | `--semantic-color-interactive-background-neutral-default`, with a black stroke (unbound) | `--foundation-color-white-1000` |
| Letter (Green, Yellow, Orange, U, N) | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Letter (Red) | color | `--semantic-color-static-text-subtle-primary` | `--foundation-color-white-1000` |
| Pill | radius | `--semantic-border-radius-l` | `--foundation-radius-16` |
| Pill to label | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Letter M / S | font size | `--semantic-font-text-style-size-l` / `--semantic-font-text-style-size-m` | `--foundation-font-size-16` / `--foundation-font-size-14` |

## Accessibility
- The letter is always visible, so the code survives color blindness and grayscale; keep Color info on when the context does not explain the letters.
- Target implementation: read-only text, not focusable, same pattern as Grade (`role="status"`).
- Contrast: the Red pill uses white text; all other pills use grey-900 text.

## Content guidelines
- Letters are fixed by the variant: G, Y, O, R, U, N.
- Color info uses the color name in English with a capital first letter ("Green").

## Do / Don't
- Do pair the pill with its letter. Don't draw a plain colored dot.
- Do use Policy color for policies and Grade for buyers. Don't mix the two scales in one column.

## Related components
Composes: none (primitive) · Used by: Page Header topbox (`.Topbox Content`, Data Type=Policy, exposed `Grade`)

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | To be defined | Version shown in the Figma header; the Figma changelog is a placeholder. |
| Docs | 2026-11-04 | First ZeroHeight page. |
