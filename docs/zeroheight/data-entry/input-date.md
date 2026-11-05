# Input Date
**Status**: Design Ready · Tech In code
A single-line field to type or pick one date in a standard format, with a calendar icon.
Figma: [Components] Data Entry › page Input Date (node 2222:1610) · Storybook: `Design System/Data Entry/Input Date` (`design-system-data-entry-input-date--playground`) · Code: `shared/ui/input-date` (`ds-input-date`)

## Overview
Input Date follows the Input Text anatomy (semi-bold label, 32px bordered container) with a date value and a trailing calendar icon. In code it wraps a native `type="date"` input, so the date picker is the browser's. Embed the Storybook `Playground` story (and `States`) and the Figma component set `Input Date` (node 2222:1610) from the `_Design system header` frame (2222:1577). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use when users enter one date (an effective date, a birth date, a deadline).
- Use when the date is known and can be typed faster than picked.
- Don't use for a start and end date → use Date Range instead.
- Don't use for a relative period ("last 7 days") → use Date Range with shortcuts instead.
- Don't use for a year or a month alone → To be defined (no dedicated component).

## Anatomy
1. `.Label`: field label (semi-bold) with the optional "(optional)" mention.
2. `Container`: bordered box (1px border, 4px radius, 32px high).
3. `.Input Content`: text (placeholder "DD/MM/YYYY" or value, `.Selector` caret) and `.Append/Icon` (20px calendar icon).
4. Error message: in code only, under the container.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled, Read Only, Error | `disabled`, `readonly`, `error` | |
| Label | Boolean | **True**, False | `label` (string) | |
| `.Label` › Optional | Boolean (exposed) | **False**, True | `optional` | |
| `.Input Content` › Filled | Variant (exposed) | **False**, True | `value` (model, string) | Native date value (`yyyy-mm-dd`). |
| `.Input Content` › Placeholder | Boolean (exposed) | **True**, False | `placeholder` | Code default `dd/mm/yyyy`; the browser date input may ignore it. |
| `.Input Content` › Append | Boolean (exposed) | **True**, False | none | The calendar icon is always shown in code. |
| none | | | `errorMessage` | Code only. |

Slots: none.
Exposed nested instances: `.Label` and `.Input Content` (Filled, Placeholder, Append, with `.Append/Icon`).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` on the container | State=Hover |
| Active (focus) | `:focus-within` on the container | State=Active |
| Disabled | `disabled` input | State=Disabled |
| Read Only | `readonly` input | State=Read Only |
| Error | `error` input, `aria-invalid` | State=Error |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Label, Input | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Label, Input | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Label | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Label, Input | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Label, Input | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Optional, Icon | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| Optional, Error msg | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Container | height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Container | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Container | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Container | border | `--semantic-color-interactive-border-medium-alt-default` | `--foundation-color-grey-500` |
| Container | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Container (hover) | border-color | `--semantic-color-interactive-border-medium-alt-hover` | `--foundation-color-grey-600` |
| Container (focus-within) | border-color | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Container (focus-within) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Input | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |
| Error msg | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |
| Error msg | color | `--semantic-color-interactive-text-strong-negative-default` | `--foundation-color-red-300` |
| Container (error) | border-color | `--semantic-color-interactive-border-strong-negative-default` | `--foundation-color-red-300` |
| Container (readonly) | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Container (readonly, hover) | border-color | `--semantic-color-interactive-border-medium-alt-default` | `--foundation-color-grey-500` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- Native `<label for>` bound to a native `type="date"` input, which brings the browser's keyboard support for day, month and year segments.
- The calendar `ds-icon` is decorative.
- Error sets `aria-invalid`; the message uses `role="alert"`, not linked with `aria-describedby`.
- State the expected format in the label or placeholder when the browser does not render a native picker.

## Content guidelines
- Label names the date ("Effective date"), semi-bold, one line, never wrapped or truncated.
- Format shown as DD/MM/YYYY (Figma placeholder).
- Error messages name the constraint ("Enter a date after 01/01/2024").

## Do / Don't
- Do use one Input Date per single date. Don't use two Input Date fields for a range (use Date Range).
- Do let users type the date. Don't force them through the picker for known dates.

## Related components
Composes: `ds-icon` (calendar) · Used by: no other design system component (showcase page only). See also Date Range.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2222:1671 is still the empty template). |
