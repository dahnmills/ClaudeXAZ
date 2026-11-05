# More Criteria
**Status**: Design New · Tech In code
The advanced buyer criteria panel opened from the Search Bar, to refine a buyer search by status, options and address.
Figma: [Components] Data Entry › page 🆕 More Criteria (node 3041:304) · Storybook: `Design System/Data Entry/More Criteria` (`design-system-data-entry-more-criteria--default`) · Code: `shared/ui/more-criteria` (`ds-more-criteria`)

## Overview
More Criteria is a panel attached under the Search Bar. It holds a header ("More criteria", Clear all, close), a divider and three rows: Status (select tags Active, Closed, Provisionnal), Options (Extend country search) and Address (street, city, region or state, postal code, phone). The number of criteria in use is shown as a count on the "More criteria" button of the bar. Embed the Storybook `Default` story and the Figma component `More Criteria` (node 3041:304) from the `_Design system header` frame (3041:94).

## When to use / When not to use
- Use under the buyer Search Bar to add optional criteria that do not fit in the bar.
- Use when the criteria are secondary and most searches do not need them.
- Don't use for a Company ID search → the button is disabled ("Not available for a Company ID search").
- Don't use on the Policies scope → all policy criteria live in the Search Bar itself.
- Don't use as a generic filter panel for lists → use Filter Drawer instead.
- Don't detach it from the bar (it must stay attached under it).

## Anatomy
1. `Header`: title "More criteria", a plain accent `Button` "Clear all" (refresh icon) and a plain accent `Button Icon` (close).
2. `Divider`.
3. `Body`:
   - Status row: row label (uppercase caption "STATUS") and `Tag` instances in select mode (Active, Closed, Provisionnal).
   - Options row: a `Checkbox` "Extend country search".
   - Address row: a `Text Area` "Street address" and a grid of four `Input Text` (City, Region / State, Postal code / ZIP, Phone number).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| none | | | `value` (model, `MoreCriteriaValues`) | `{ statuses, extendCountry, street, city, region, zip, phone }`. |
| none | | | `(cleared)` | Emitted by Clear all, after the value is reset. |
| none | | | `(closed)` | Emitted by the close button. |

Figma has no component property: it is a single component (one state: the empty panel).
Slots: none.
Exposed nested instances: `.Content` and `Icon Functional` (header buttons), the `.Options` of each status Tag, and the `.Label` / `.Input Content` / `.Text Area Content` of the Text Area and each Input Text, so each field can be filled on the instance.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Empty | `value` = `emptyMoreCriteria()` | the only state modeled |
| With criteria | any field filled or tag selected | not modeled |
| Field states | inherited from Tag, Checkbox, Text Area, Input Text | see each atom |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | background | `--semantic-color-interactive-background-neutral-default` | `--foundation-color-white-1000` |
| Host | border | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Host | border-radius | `--semantic-border-radius-m` | `--foundation-radius-8` |
| Host | padding-top | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Host | padding-bottom | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Host | box-shadow | `--semantic-shadow-flyout` | `--foundation-shadow-bottom-400` |
| Header, Body | padding | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Header, Actions (+2) | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Title, Label | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Title | font-size | `--semantic-font-title-size-xs` | `--foundation-font-size-18` |
| Title | font-weight | `--semantic-font-title-font-weight-m` | `--foundation-font-weight-semi-bold` |
| Title | line-height | `--semantic-font-title-line-height-s` | `--foundation-font-line-height-24` |
| Title | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Divider | margin | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Body | gap | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Row | gap | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Label | font-weight | `--semantic-font-text-style-font-weight-bold` | `--foundation-font-weight-bold` |
| Label | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Label | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |
| Label | letter-spacing | `--semantic-font-text-style-letter-spacing-s` | `--foundation-font-letter-spacing-0-2` |
| Label | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| Chips | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Street | gap | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` |

The flyout shadow is `Shadows/Bottom/400` in Figma.

## Accessibility
- The title is an `<h3>`.
- Clear all is a `ds-button`; close is a `ds-button-icon` with `aria-label="Close"`.
- Every field has a visible label (`ds-textarea`, `ds-input-text`, `ds-checkbox`); status tags are `ds-tag type="select"` with their own selected state.
- The row captions (Status, Options, Address) are plain text, not `<label>` or group names: wrap each row in a named group if screen-reader context is needed.
- Escape to close is not handled by the component.

## Content guidelines
- Row captions are uppercase and short (one word), the only place where uppercase is allowed.
- Field labels are semi-bold and on one line; the address grid gives each field the width its label needs.
- The status label "Provisionnal" reproduces the source data spelling.

## Do / Don't
- Do keep the panel attached under the Search Bar. Don't open it as a modal.
- Do reflect the number of criteria in use on the bar button. Don't hide active criteria when the panel closes.
- Do disable the entry point for a Company ID search. Don't open it for that search type.

## Related components
Composes: Tag (select), Checkbox, Text Area, Input Text, Button, Button Icon, Divider, Icon · Used by: Search (Search and Search V2 screens), opened from Search Bar.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | November 3, 2026 | Added from code (`ds-more-criteria`). Note: single state, the empty panel. |
