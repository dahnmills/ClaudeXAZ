# Chip
**Status**: Design Ready · Tech In code
A rounded pill that shows a value the user can select, toggle or remove.
Figma: [Components] Action › page Chip (node 456:438) · Storybook: `Design System/Action/Chip` (id `design-system-action-chip--select`) · Code: `shared/ui/chip` (`ds-chip`)

## Overview
Chip is a pill-shaped control with a single label. In Figma it models a selectable chip (selected or not, in two sizes). The code adds a `type` input so the same atom also covers a read-only chip and a removable filter chip. Embed the Storybook story `Select` as the live example, and the Figma component set `Chip` (node 456:438) as the visual reference.

## When to use / When not to use
- Use when the user toggles one value among a short set of quick filters or options.
- Use the filter type to show an applied filter that the user can remove.
- Use the static type to show a value in pill form, with no interaction.
- Use size S in dense areas (table toolbars, cards), size M elsewhere.
- Don't use when the value shows a status (accepted, refused, pending) → use Badge instead.
- Don't use for the square, small filter and selection tags of filter panels → use Tag instead.
- Don't use when one option out of several must stay selected to switch a view or a setting → use Segmented Control instead.
- Don't use to run an action → use Button instead.

## Anatomy
1. `Chip` (container): pill with a 1px border and round radius. 32px high in size M, 24px in size S.
2. `Value` (text): the label, semi-bold, 14px in M and 12px in S.
3. Close mark (code only, filter type): a "×" after the label, the click target to remove the chip.
4. Icon slots (code only): `[slot=icon-left]` and `[slot=icon-right]` for an optional `ds-icon`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Selected | Variant | **False**, True | `selected: boolean` (default `false`) | Used by `type="select"`; written to `aria-pressed`. |
| Size | Variant | **M**, S | `size: 's' \| 'm'` (default `'m'`) | |
| State | Variant | **Default**, Hover, Active, Disabled | Hover, Active: CSS. Disabled: `disabled: boolean` | |
| (none) | | | `type: 'static' \| 'filter' \| 'select'` (default `'static'`) | Code only. Figma models only the selectable chip. Static has no hover and no tab stop. |
| (none) | | | `label: string` (required) | Maps to the Figma `Value` text layer. |
| (none) | | | `activated` (output) | Emitted by `select` chips on click, Enter, Space. |
| (none) | | | `removed` (output) | Emitted by `filter` chips on click, Enter, Space. |

Slots: no Figma slot. In code, `[slot=icon-left]` and `[slot=icon-right]` accept a `ds-icon`.

Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover` (filter and select only, skipped when disabled) | `State=Hover` |
| Active | `:active` (filter and select only) | `State=Active` |
| Focus | `:focus-visible`: 2px outline, 2px offset | no variant |
| Selected | `selected` input (`aria-pressed="true"` on select chips) | `Selected=True` |
| Disabled | `disabled` input: `aria-disabled`, no tab stop, opacity 0.40 | `State=Disabled` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` (4px) |
| Container | border-radius | `--semantic-border-radius-round` | `--foundation-radius-100` (100px) |
| Container | border color (default, hover, active) | `--semantic-color-interactive-border-strong-alt-{default,hover,active}` | `--foundation-color-grey-900` / `-800` / `-700` |
| Container | background | `--semantic-color-interactive-background-neutral-default` | `--foundation-color-white-1000` |
| Label | color default | `--semantic-color-interactive-text-strong-alt-default` | `--foundation-color-grey-900` |
| Label | color hover / active | `--semantic-color-interactive-text-strong-alt-active` / `-alt-hover` | `--foundation-color-grey-700` / `-800` |
| Label | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Label | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` (600) |
| Label | letter-spacing | `--semantic-font-text-style-letter-spacing-l` | `--foundation-font-letter-spacing-1` (1px) |
| Label | line-height | `--semantic-font-text-style-line-height-s` | `--foundation-font-line-height-16` (16px) |
| Size S | height, padding, font-size | `--semantic-measurement-sizing-l`, `--semantic-measurement-spacing-s`, `--semantic-font-text-style-size-s` | `--foundation-sizing-24`, `--foundation-spacing-8`, `--foundation-font-size-12` |
| Size M | height, padding, font-size | `--semantic-measurement-sizing-xl`, `--semantic-measurement-spacing-m`, `--semantic-font-text-style-size-m` | `--foundation-sizing-32`, `--foundation-spacing-16`, `--foundation-font-size-14` |
| Selected | background and border (default, hover, active) | `--semantic-color-interactive-background-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Selected | label | `--semantic-color-interactive-text-neutral-{default,hover,active}` | `--foundation-color-white-1000` |
| Close mark | padding-left | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` (2px) |
| Focus ring | outline color | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

Values written outside tokens in the SCSS: border 1px, focus outline 2px and offset 2px, close mark font-size 16px. The hover and active label colors are swapped on purpose to match Figma (alt active on hover, alt hover on press).

## Accessibility
- Role: `role="button"` on the host. Select chips expose `aria-pressed` (true or false).
- Keyboard: select and filter chips are in the tab order (`tabindex="0"`); Enter and Space activate. Static chips are not focusable.
- Disabled: `aria-disabled="true"` and removed from the tab order.
- Filter chips: the "×" is `aria-hidden`; the whole chip is the remove control. Add the action to the label context (for example "Country: France, remove") when the screen does not make it clear.
- Focus: 2px ring on `:focus-visible`.

## Content guidelines
- One to three words, on one line.
- Sentence case. No final punctuation.
- Write the value, not a sentence ("France", "Last 30 days").
- No em dash.

## Do / Don't
- Do keep the set of chips short and scannable; don't use chips for a list of twenty options (use a Dropdown).
- Do use the filter type to show a removable applied filter; don't use a select chip that the user cannot see as removable.
- Do use Badge for statuses; don't color a chip to mean accepted or refused.

## Related components
Composes: Icon (`ds-icon`, optional slots) · Used by: Tag Filter Chip.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Current version shown in the Figma header. The Versionning frame is still the empty template. |
