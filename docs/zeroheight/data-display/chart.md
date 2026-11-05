# Chart
**Status**: Design New · Tech In code
A line chart frame for board widgets (Grade, Exposure): grid lines, optional Y axis, X labels and one series.
Figma: [Components] Data Display › page Chart (node 2060:338) · Storybook: `Design System/Data Display/Chart` › Grade · Code: `shared/ui/chart` (`ds-chart`)

## Overview
In Figma, Chart is a master that owns the grid; the data is local and goes in the `Series` slot, with the labels in the `X labels` and `Y labels` slots. In code, `ds-chart` draws the line, dots, grid and axis labels from a `data` array. Embed the Storybook `Grade` story and the Figma component set frame (node 2060:338) on the page `🆕 Chart`.

## When to use / When not to use
- Use when you show how one value evolves over time inside a board widget (grade history, exposure).
- Use when the trend matters more than exact values.
- Use with the Y axis on (Grid = Both) when the reader needs the scale, as in the Grade widget.
- Don't use when you show one value out of 100 → use Progress Bar instead.
- Don't use when exact values must be read or compared → use Table instead.
- Don't use when you show parts of a whole → use Pie Chart (`ds-pie-chart`) instead.

## Anatomy
1. `Y labels` (slot, hidden unless `Y axis` is on): scale labels, top to bottom.
2. `Main` (frame):
   1. `Plot`: `Vertical lines` (8 grid lines; plus 5 horizontal lines with Grid = Both) and the `Series` slot holding the curve.
   2. `X labels` (slot): labels under the plot, left to right.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Grid | Variant | **Vertical** / Both | `showGrid: boolean` (default `true`) + label counts | Code draws one vertical line per X label and one horizontal line per Y label; Figma has fixed counts (8 vertical, 5 horizontal). |
| Y axis | Boolean | True / **False** | `yLabels: string[]` (axis shown when not empty) | |
| Y labels | Slot | Text labels | `yLabels` | |
| Series | Slot | Local curve | `data: number[]` (required), `tone`, `showDots` | |
| X labels | Slot | Text labels | `xLabels: string[]` | |
| (none) | | | `min`, `max: number \| null` | Explicit Y bounds, else data min and max. |
| (none) | | | `invertY: boolean` (default `false`) | Lowest value on top (Grade: 1 = best, on top). |
| (none) | | | `height: number` (default 160 px) | |
| (none) | | | `tone: 'brand' \| 'positive' \| 'warning' \| 'negative'` (default `'brand'`) | Line and dot color. |
| (none) | | | `showDots: boolean` (default `true`) | |

Slots: `Y labels` and `X labels` take text from the data; `Series` takes the local curve. The grid belongs to the master: never draw it in the local content.
Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Always; the chart is static | Both variants |

No hover, tooltip or focus state in code.

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | gap (Y axis to plot) | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Line, dots (Brand) | stroke / background | `--semantic-color-interactive-background-strong-default` | `--foundation-color-blue-a-500` |
| Line, dots (Positive) | stroke / background | `--semantic-color-static-background-functional-positive` | `--foundation-color-green-500` |
| Line, dots (Warning) | stroke / background | `--semantic-color-static-background-functional-warning` | `--foundation-color-orange-400` |
| Line, dots (Negative) | stroke / background | `--semantic-color-static-background-functional-negative` | `--foundation-color-red-500` |
| Grid lines | stroke | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Dot ring | border color | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| X axis | margin-top | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Axis labels | font-size / line-height | `--semantic-font-text-style-size-s` / `--semantic-font-text-style-line-height-s` | `--foundation-font-size-12` / `--foundation-font-line-height-16` |
| Axis labels | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |

## Accessibility
- The host has `role="img"`; the SVG itself is `aria-hidden`. There is no input for an accessible name or a text alternative: To be defined. Until then, state the key figure in text in the widget.
- Axis labels are visible text.
- Not focusable, no keyboard interaction.
- The tone is never the only carrier of meaning; the widget title says what is plotted.

## Content guidelines
- One series per chart.
- Labels come from the data (dates, grade values); keep them short (for example month abbreviations).

## Do / Don't
- Do: one series per chart, labels from the data. Don't: draw grid lines in the local content; the master owns them.
- Do: turn the Y axis on (Grid = Both) when the scale matters, as for Grade. Don't: show a Y axis with a single label.
- Do: use `invertY` for Grade so that the best grade sits on top. Don't: invert an axis without saying so in the labels.

## Related components
Composes: none · Used by: Widget Card / Card with Slot (Buyer Summary Grade and Exposure widgets), card builder lab

## Changelog
| Version | Date | Change |
|---|---|---|
| v1.0.0 | November 3, 2026 | New: added from code (ds-chart). Note: Series and labels are local. |
| Docs | 2026-11-04 | First ZeroHeight page. |

### Notes (Figma vs code)
- Grid line counts: fixed in Figma (8 vertical, 5 horizontal), driven by label counts in code.
- Code has hard-coded sizes: X axis height 16 px, dot 7 px with a 1.5 px ring, default height 160 px. No tokens.
- Figma `Grid` variant has no direct code input; `showGrid` turns the whole grid on or off.
