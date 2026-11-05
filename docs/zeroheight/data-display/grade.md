# Grade
**Status**: Design WIP · Tech In code
A read-only pill that shows a buyer's credit grade (1 to 10), whether it is manual or automatic, and optionally its numeric score.
Figma: [Components] Data Display › page Grade (node 628:17016) · Storybook: `Design System/Data Display/Grade` › Playground · Code: `shared/ui/grade` (`ds-grade`)

## Overview
Grade is the signature risk carrier of Qirin: a colored pill reading "M4" or "A7" (type letter plus grade), followed by the score in brackets, for example "(4.00)". Colors run from dark green (1) to dark red (10), and N/C or N/A grades are grey. Embed the Storybook story `Playground` (and `Palette` for the full scale) and the Figma component frame on the Grade page (`_Design system header` 1460:3070).

## When to use / When not to use
- Use when showing a buyer's grade in a topbox, a result card, a table cell or a property panel.
- Use when the user must tell a manual grade (M) from an automatic one (A) at a glance.
- Use when the score adds precision to the grade (Score on).
- Don't use when showing a policy's color code → use Policy color instead.
- Don't use when showing a generic status (accepted, refused, pending) → use Badge instead.
- Don't use when the value is a trend over time → use Chart instead.

## Anatomy
1. `Badge` frame (pill): fully rounded container whose fill is the grade color.
2. Type letter (`M` or `A`) and grade number (`Label` texts), or `N/C` / `N/A`.
3. Score (`(1.00)` text): optional, controlled by `Score`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Type | Variant | Automatic, **Manual**, N/C, N/A | `type: 'automatic' \| 'manual' \| 'nc' \| 'na'` (default `'manual'`) | Pill prefix: A, M, N/C, N/A. |
| Grade | Variant | **1** to 10, `-` | `grade: 1...10 \| null` | `-` is used with N/C and N/A. |
| Size | Variant | **M**, S | `size: 's' \| 'm'` (default `'m'`) | M 24 px high, S 20 px high. |
| Score | Boolean | **true**, false | `score: number \| null` | Code shows the score when a number is passed, formatted with 2 decimals in brackets. |

Slots: none.
Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | none (read-only) | Default |

Grade is not interactive: no hover, focus or disabled state.

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Pill | radius | `--semantic-border-radius-round` | `--foundation-radius-100` |
| Pill | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Pill | letter spacing | `--semantic-font-text-style-letter-spacing-s` | `--foundation-font-letter-spacing-0-2` |
| Pill grade 1 | background | `--semantic-color-static-background-grade-1` | `--foundation-color-green-600` |
| Pill grade 2 | background | `--semantic-color-static-background-grade-2` | `--foundation-color-green-400` |
| Pill grade 3 | background | `--semantic-color-static-background-grade-3` | `--foundation-color-green-300` |
| Pill grade 4 | background | `--semantic-color-static-background-grade-4` | `--foundation-color-orange-200` |
| Pill grade 5 | background | `--semantic-color-static-background-grade-5` | `--foundation-color-orange-300` |
| Pill grade 6 | background | `--semantic-color-static-background-grade-6` | `--foundation-color-orange-400` |
| Pill grade 7 | background | `--semantic-color-static-background-grade-7` | `--foundation-color-red-400` |
| Pill grade 8 | background | `--semantic-color-static-background-grade-8` | `--foundation-color-red-600` |
| Pill grade 9 | background | `--semantic-color-static-background-grade-9` | `--foundation-color-red-700` |
| Pill grade 10 | background | `--semantic-color-static-background-grade-10` | `--foundation-color-red-900` |
| Pill N/C, N/A | background | `--semantic-color-static-background-grade-none` | `--foundation-color-grey-300` |
| Pill text (1 to 3, 7 to 10) | color | `--semantic-color-static-text-subtle-primary` | `--foundation-color-white-1000` |
| Pill text (4 to 6, N/A) | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Score | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Size M | font size / line height | `--semantic-font-text-style-size-l` / `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16` / `--foundation-font-line-height-24` |
| Size S | font size / line height | `--semantic-font-text-style-size-m` / `--semantic-font-text-style-line-height-m` | `--foundation-font-size-14` / `--foundation-font-line-height-20` |
| Host | font weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |

## Accessibility
- The host has `role="status"`. Its text ("M4 (4.00)") is the accessible content: the grade is never carried by color alone.
- Not focusable, no keyboard interaction.
- Contrast: white text is used on dark grades and grey-900 text on the yellow and orange grades (4 to 6) so the label stays readable.

## Content guidelines
- Always show the type letter: "M4" or "A4", never "4" alone.
- Score: two decimals in brackets, "(4.00)".
- N/C (not calculated) and N/A (not available) replace the number; do not add a score to them.

## Do / Don't
- Do use Size S in table cells and dense lists. Don't use Size M inside a 14 px text line.
- Do keep the Score on when the user compares close grades. Don't round or reformat the score.
- Do use Grade for buyer risk. Don't recolor a Badge to imitate a grade.

## Related components
Composes: none (primitive) · Used by: Page Header topbox (`.Topbox Content`, exposed `Grade`), Card `.Company Profile`, Data Grid / Table content type Grade

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | To be defined | Version shown in the Figma header; the Figma changelog is a placeholder. |
| Docs | 2026-11-04 | First ZeroHeight page. |
