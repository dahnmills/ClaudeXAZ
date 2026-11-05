# Button Range
**Status**: Design WIP · Tech In code
A small square button that represents one step of a scale, used in groups to pick a value, several values or a range.
Figma: [Components] Action › page Button Range (node 720:445) · Storybook: `Design System/Action/Button Range` (id `design-system-action-button-range--default`) and `Design System/Action/Button Range Group` (id `design-system-action-button-range-group--range-mode`) · Code: `shared/ui/button-range` (`ds-button-range`, `ds-button-range-group`)

## Overview
Button Range is a 40 x 40px button with a short label (a number, a grade, a bucket). On its own it shows one of three statuses: default, selected (the ends of a range or a chosen value) and between (the steps inside a range). The code adds `ds-button-range-group`, which lays out the buttons and computes their status in `range`, `multi` or `single` mode. Embed the Storybook story `Button Range Group › RangeMode` as the live example, and the Figma component set `Button Range` (node 720:445) as the visual reference.

## When to use / When not to use
- Use to pick a range on a short ordered scale (grades 1 to 10, sensitivity levels, financial buckets).
- Use `multi` mode to pick several independent steps of a scale.
- Use `single` mode to pick one step when the scale must stay visible.
- Don't use for a long or continuous scale → use Input Text (number) or Date Range instead.
- Don't use for unordered options → use Tag (Select) or Checkbox instead.
- Don't use to switch views → use Segmented Control or Tab instead.

## Anatomy
1. `Button Range` (container): 40 x 40px square, 4px radius, light grey plate.
2. Label (text layer `1`): Body L, 16px / 24px; bold and white when selected or between.
3. Group (code, `ds-button-range-group`): a wrapping row with gap 4px and `role="group"`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Status | Variant | **Default**, Selected, Between | `status: 'default' \| 'selected' \| 'between'` (default `'default'`) | In a group, the status is computed from `value` and `mode`. |
| State | Variant | **Default**, Hover, Active, Disabled | Hover, Active: CSS. Disabled: `disabled: boolean` | |
| (none) | | | `label: string` (required) | The text layer. |
| (none) | | | `clicked` (output) | Click, Enter, Space. |
| Group (code only) | | | `options: { value, label, disabled? }[]` (required), `value: string[]`, `mode: 'multi' \| 'range' \| 'single'` (default `'range'`), `ariaLabel: string` | Outputs `valueChange` (new `string[]`) and `optionClicked`. No Figma counterpart. |

Slots: none.

Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover`, darker plate per status | `State=Hover` |
| Active | `:active`, darkest plate per status | `State=Active` |
| Focus | not styled in the SCSS (browser default only) | no variant |
| Disabled | `disabled` input: `aria-disabled`, `tabindex=-1`, opacity 0.40 | `State=Disabled` |
| Selected / Between | `status` input | `Status=Selected` / `Status=Between` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | width, height | `--semantic-measurement-sizing-xl` + `--semantic-measurement-sizing-s` | `--foundation-sizing-32` + `--foundation-sizing-8` (40px) |
| Container | horizontal padding | `--semantic-measurement-spacing-2xs` | not defined in `_semantic.scss` |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Label | font-size, line-height, letter-spacing | `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l`, `--semantic-font-text-style-letter-spacing-none` | `--foundation-font-size-16`, `--foundation-font-line-height-24`, `--foundation-font-letter-spacing-0` |
| Default | label, background rest / hover / active | `--semantic-color-interactive-text-strong-alt-default`, `--semantic-color-interactive-background-light-alt-{default,hover,active}` | `--foundation-color-grey-900`, `--foundation-color-grey-050` / `-100` / `-200` |
| Selected | background rest / hover / active | `--semantic-color-interactive-background-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Between | background rest / hover / active | `--semantic-color-interactive-background-medium-{default,hover,active}` | `--foundation-color-blue-a-200` / `-300` / `-400` |
| Selected, Between | label color, weight | `--semantic-color-interactive-text-neutral-default`, `--semantic-font-text-style-font-weight-bold` | `--foundation-color-white-1000`, `--foundation-font-weight-bold` |
| Group | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- Each step has `role="button"` and is in the tab order; Enter and Space activate.
- The group has `role="group"`; give it an `ariaLabel` that names the scale ("Grade range").
- The selected and between statuses are not exposed to assistive technology (no `aria-pressed`); the group should state the current value in text next to it.
- No visible focus style is defined in the SCSS.
- White bold text on Between (`blue-a-200`) is low contrast; check it against WCAG AA before using it for essential information.

## Content guidelines
- Labels are one to three characters (a number, a grade, a short bucket code).
- Keep the scale ordered from low to high, left to right.
- No em dash.

## Do / Don't
- Do use range mode for "from X to Y" choices on a short scale; don't use it for more than about a dozen steps.
- Do show the chosen range in text near the group; don't rely on the blue shades alone.

## Related components
Composes: none · Used by: Button Range Group, Filter Drawer.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. Not listed on the Status page of the Action file. |
