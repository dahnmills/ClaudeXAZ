# Date Range
**Status**: Design Ready · Tech In code
A calendar panel to pick a single date or a start and end date, on one or two months.
Figma: [Components] Data Entry › page Date Range (node 2002:1305) · Storybook: `Design System/Data Entry/Date Range` (`design-system-data-entry-date-range--range-single-calendar`) · Code: `shared/ui/date-range` (`ds-date-range`)

## Overview
Date Range is the calendar picker of the system: a month header with previous and next buttons, a weekday row and a grid of days that marks the start, the days between and the end of the selection. The dual type shows two consecutive months side by side. In code it can also show quick shortcuts ("Last 7 days"), time inputs and an Apply / Cancel footer. Embed the Storybook `RangeSingleCalendar` story (and `RangeDualCalendar`, `Full`) and the Figma component set `Date Range` (node 2002:1305) from the `_Design system header` frame (2634:1269). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use to select a period with a start and an end date (reporting period, validity).
- Use the dual type when ranges often span two months.
- Use shortcuts (code) when users mostly pick common relative periods.
- Use in date mode (`selection="date"`) for one date when a visible calendar helps (weekday matters).
- Don't use for a single known date typed in a form → use Input Date instead.
- Don't use for a year or month only → To be defined (no dedicated component).

## Anatomy
1. `Calendar`: one month (two in Dual).
2. `Header`: month and year label ("June 2024") between two tertiary `Button Icon` (previous, next). In code the label is clickable and switches to a month grid, then a year grid.
3. `.Day`: weekday name (Sun to Sat).
4. `.Date`: a 40px day cell. `Type` = Default, Unique, Starting, Between, Ending; `State` = Default, Hover, Active, Disabled.
5. `.Date Empty`: blank 40px cell before the first day and after the last day of the month.
6. Code only: shortcuts list, time inputs and footer (Cancel, Apply).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Type | Variant | Dual, **Single** | `type` (`'single'`, `'dual'`) | |
| Full Width | Variant | **False**, True | `fullWidth` | |
| `.Date` › Type | Variant (atom) | Default, **Unique**, Starting, Between, Ending | computed from `startDate` / `endDate` | |
| `.Date` › State | Variant (atom) | **Default**, Hover, Active, Disabled | `:hover`, selection, `minDate` / `maxDate` | |
| none | | | `selection` (`'range'` default, `'date'`) | Range or single date. Code only. |
| none | | | `minDate`, `maxDate` | Days outside are disabled. Code only. |
| none | | | `showShortcuts`, `shortcuts` | Default shortcuts: Last hour, Last 24 hours, Last 7 days, Last 10 days, Custom. Code only. |
| none | | | `showTime` | Start and end time inputs. Code only. |
| none | | | `showFooter` | Cancel and Apply buttons, emits `(cancelled)` and `(applied)`. Code only. |
| none | | | `startDate`, `endDate` (models) | |

Slots: none.
Exposed nested instances: the two `Icon Functional` glyphs of the header buttons.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Day default | in-month day | `.Date` Type=Default |
| Day hover | `:hover`, and range preview while hovering after a start date | `.Date` State=Hover |
| Single date selected | `selection="date"` or start = end | `.Date` Type=Unique |
| Range start / between / end | `startDate`, `endDate` | `.Date` Type=Starting / Between / Ending |
| Day disabled | before `minDate` or after `maxDate` | `.Date` State=Disabled |
| Focus | `:focus-visible` on day and header buttons | not modeled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host, Shortcut item (+5) | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Host | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Host | border | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Host | border-radius | `--semantic-border-radius-m` | `--foundation-radius-8` |
| Shortcuts | border-right | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Shortcuts, Shortcut item (+3) | padding | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Shortcut item, Month label (+4) | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Shortcut item, Day | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |
| Shortcut item, Month label | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Shortcut item, Month label (+5) | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Shortcut item, Header (+3) | padding | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Shortcut item (hover), Day (hover) | background | `--semantic-color-interactive-background-light-hover` | `--foundation-color-blue-a-050` |
| Shortcut item (focus-visible) | outline | `--semantic-color-interactive-border-strong-default` | `--foundation-color-blue-a-500` |
| Shortcut item  active (active), Day  between | background | `--semantic-color-interactive-background-medium-default` | `--foundation-color-blue-a-200` |
| Calendars, Time row | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Calendar, Time group (+1) | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Month label, Weekday (+5) | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Month label | padding | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` |
| Month label, Day (hover) (+6) | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Month label (hover) | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Weekday | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Weekday | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Day (hover) | width | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Day (hover) | height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Day  disabled (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Day  unique, Day  starting (+3) | background | `--semantic-color-interactive-background-strong-default` | `--foundation-color-blue-a-500` |
| Day  unique, Day  starting (+3) | color | `--semantic-color-static-text-subtle-primary` | `--foundation-color-white-1000` |
| Day  unique (hover), Day  starting (+1) | background | `--semantic-color-interactive-background-strong-hover` | `--foundation-color-blue-a-600` |
| Day  between | background | `--semantic-color-interactive-background-medium-hover` | `--foundation-color-blue-a-300` |
| Months grid, Years grid | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Month cell, Year cell | height | `--semantic-measurement-spacing-2xl` | `--foundation-spacing-48` |
| Time row, Footer | border-top | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Time row | padding-top | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Time input | border | `--semantic-color-interactive-border-medium-alt-default` | `--foundation-color-grey-500` |
| Time input | background | `--semantic-color-interactive-background-neutral-default` | `--foundation-color-white-1000` |
| Time input | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Time input (focus-visible) | border-color | `--semantic-color-interactive-border-strong-default` | `--foundation-color-blue-a-500` |
| Time input (focus-visible) | box-shadow | `--semantic-color-interactive-background-light-active` | `--foundation-color-blue-a-100` |

## Accessibility
- Previous and next are `ds-button-icon` with names ("Previous month", "Next month", "Previous year", and so on).
- Days, months and years are native buttons, so Tab and Enter work. There is no arrow-key grid navigation and no `role="grid"`.
- Disabled days use the native `disabled` attribute.
- Shortcuts use `role="listbox"` / `role="option"` with `aria-selected`.
- The selected range is shown by shape and color; also echo the chosen dates in text near the trigger.

## Content guidelines
- Month labels in full ("June 2024"), weekdays in three letters (Sun, Mon...).
- Shortcut labels start with "Last" and a unit ("Last 7 days"); keep "Custom" last.
- Footer buttons: "Cancel" (secondary) and "Apply" (primary).

## Do / Don't
- Do use Dual when ranges usually cross a month boundary. Don't force users to page month by month for a 60-day range.
- Do set `minDate` / `maxDate` when dates outside are invalid. Don't let users pick an end date before the start date.
- Do show the footer when the range must be confirmed. Don't apply a half-selected range.

## Related components
Composes: Button Icon, Button, Icon · Used by: Notification Module screen. See also Input Date.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2634:1407 is still the empty template). |
