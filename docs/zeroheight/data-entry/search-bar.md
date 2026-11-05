# Search Bar
**Status**: Design New · Tech In code
The master of every scoped search bar: a 64px container with filter slots, a free-text field and the Search button.
Figma: [Components] Data Entry › page 🆕 Search Bar (node 3047:427) · Storybook: `Design System/Data Entry/Search Bar Scoped` (`design-system-data-entry-search-bar-scoped--buyers`) · Code: `shared/ui/search-bar-scoped` (`ds-search-bar-scoped`)

## Overview
Search Bar owns the container (border, radius M, height 64), the free-text field (search icon, query, clear button) and the Search button. Scope and filters go in the Filters slot, options in the Options slot: each feature file places its own scoped composition (Buyers, Policies). `Filled=True` shows the value color and the clear button. In code, `ds-search-bar-scoped` implements both compositions (Buyers and Policies) with their rules. Embed the Storybook `Buyers` and `Policies` stories and the Figma component set `Search Bar` (node 3047:427) from the `_Design system header` frame (3047:94).

## When to use / When not to use
- Use as the main search entry of a page that searches across objects (buyers, policies).
- Use when the search needs a scope or filters next to the query.
- Use with the More Criteria panel for optional buyer criteria.
- Don't use to filter a local list → use Input Search instead.
- Don't rebuild the field or the Search button in a local component → put your filters in the Filters and Options slots.
- Don't put form fields with labels in the bar → use a form or More Criteria instead.

## Anatomy
1. `Filters` (slot): scope and filter triggers, built from `Standalone Dropdown` (Buyers or Policies; search type; country; ID type; BU).
2. `Field`: `Search icon`, the query text (`Query`), and `Clear` (shown when Filled).
3. `Divider`: vertical separators between parts.
4. `Options` (slot): options such as "Search in", Status (multi-select) or the "More criteria" tertiary button with its count.
5. `Search`: the primary `Button` (exposed; set it Disabled until the search is valid).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Filled | Variant | **False**, True | `query` (model) not empty | True shows the value color and the clear button. |
| Query | Text | **"Search"** | `query` (model); placeholder computed from scope and type | |
| Filters | Slot | free content | `scope`, `type`, `country`, `idType`, `buCode` (models) | Code renders fixed Buyers or Policies compositions, not a projected slot. |
| Options | Slot | free content | `policyCriteria` (model), `criteriaCount` | Same. |
| `Search` (exposed Button) | Exposed instance | Button properties (State Disabled) | internal `searchValid`; emits `(searchClicked)` | |
| none | | | `(moreCriteriaClicked)` | Buyers only, disabled for a Company ID search. |

Slots: `Filters` (scope and filter dropdowns), `Options` (options and the More criteria button).
Exposed nested instances: `Search` (Button) and `.Content` (button content).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Empty | `query` empty, placeholder shown | Filled=False |
| Filled | `query` not empty, clear button shown | Filled=True |
| Search disabled | `searchValid` false (missing query, country or ID type) | exposed Search, State=Disabled |
| Field error | after a submit attempt: "This field is required" under the slot | not modeled |
| Field disabled | phone search without a country | not modeled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | background | `--semantic-color-interactive-background-neutral-default` | `--foundation-color-white-1000` |
| Host | border | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Host | border-radius | `--semantic-border-radius-m` | `--foundation-radius-8` |
| Host, Flyout search (+1) | padding | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Content | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Flyout, Slot  error (error) (+1) | top | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Flyout, Error msg | top | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Divider | height | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Divider  error adjacent (error-adjacent) | margin-top | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Divider  error adjacent (error-adjacent) | margin-bottom | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Divider  error adjacent (error-adjacent) | background | `--semantic-color-static-border-main-functional-negative` | `--foundation-color-red-500` |
| Slot  error (error) | bottom | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Slot  error (error) | left | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Slot  error (error) | right | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Slot  error (error) | background | `--semantic-color-static-background-subtle-functional-negative` | `--foundation-color-red-050` |
| Error msg, Phone prefix (+2) | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Error msg, Flyout empty | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Error msg, Flyout empty | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |
| Error msg, Input (error) (+1) | color | `--semantic-color-static-text-main-functional-negative` | `--foundation-color-red-500` |
| Field | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Field icon (disabled), Phone prefix (+1) | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| Field icon (error) | color | `--semantic-color-static-icon-main-functional-negative` | `--foundation-color-red-500` |
| Phone prefix, Input | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Phone prefix, Input | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Field icon | color | `--semantic-color-static-icon-main-tertiary` | `--foundation-color-grey-500` |
| Input | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Flyout search, Flyout empty | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Flyout search | border-bottom | `--semantic-border-size-s` | `--foundation-sizing-1` |
| Flyout search | border-bottom | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Flyout search | margin-bottom | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Flyout options | max-height | `--semantic-measurement-sizing-3xl` | `--foundation-sizing-64` |
| Flyout empty | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Bu slot | width | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Bu slot | width | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |

## Accessibility
- Filter triggers are `ds-standalone-dropdown`, options are `ds-flyout-menu-item`, the clear and Search actions are `ds-button-icon` ("Clear") and `ds-button`.
- Enter in the query field submits.
- The query is a native `<input>` with a placeholder but no label or `aria-label`: add an accessible name.
- The inline errors ("This field is required") are plain text, not linked to the field with `aria-describedby` and not announced.
- Disabled triggers explain why with a tooltip ("Select a country before choosing an ID Type").

## Content guidelines
- Placeholder states what to type for the current type ("Enter a company name", "Policy name or number, insured, broker, Company ID").
- Filter labels show the current value ("All BUs", "Select a country").
- Keep the Search button label "Search".

## Do / Don't
- Do put scope and filters in the Filters slot and options in the Options slot. Don't rebuild the field or the Search button.
- Do keep Search disabled until the search is valid. Don't let users submit and fail on a missing country.
- Do keep the bar on one line. Don't wrap filters on a second row.

## Related components
Composes: Standalone Dropdown, Dropdown Flyout Menu (`ds-flyout-menu`), Input Search, Multi Select, Button, Button Icon, Divider, Flag, Tooltip, Icon · Used by: Search V2 screen; opens More Criteria. Replaces Search Bar Scoped in Figma.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | November 3, 2026 | Added: slot master for the search bar. Note: replaces Search Bar Scoped. |
