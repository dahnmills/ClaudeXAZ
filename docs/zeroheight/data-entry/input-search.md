# Input Search
**Status**: Design Ready · Tech In code
A single-line field to type a search or filter query, with a search icon and a clear button.
Figma: [Components] Data Entry › page Input Search (node 2695:3344) · Storybook: `Design System/Data Entry/Input Search` (`design-system-data-entry-input-search--playground`) · Code: `shared/ui/input-search` (`ds-input-search`)

## Overview
Input Search follows the Input Text anatomy (optional semi-bold label, 32px bordered container) with a search icon and, in code, a clear button that appears once a value is typed. It filters lists in place (a flyout, a table, a list of BUs). Embed the Storybook `Playground` story (and `States`) and the Figma component set on the Input Search page (node 2695:3344) from the `_Design system header` frame (2695:3311). Note: in Figma the component set on this page is still named "Input Date", and its header description is copied from Input Date; the Figma header also shows Tech "Draft".

## When to use / When not to use
- Use to filter a visible list or table as the user types.
- Use inside a flyout to narrow a long option list (for example "Search a BU").
- Use for a simple, single-field search in a panel or a page section.
- Don't use for the main multi-criteria search of a page → use Search Bar instead.
- Don't use to choose from a short closed list → use Dropdown instead.
- Don't use for regular free text input → use Input Text instead.

## Anatomy
1. `.Label`: optional field label (semi-bold) with "(optional)".
2. `Container`: bordered box (1px border, 4px radius, 32px high).
3. `.Input Content`: text (placeholder "Search" or value, `.Selector` caret) and `.Append/Icon` (20px icon).
4. Code only: a leading `search` icon, and a trailing clear button (`close` icon) shown when the field has a value.
5. Error message: in code only, under the container.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled, Read Only, Error | `disabled`, `readonly`, `error` | |
| Label | Boolean | **True**, False | `label` (string) | Most uses inside flyouts have no label. |
| `.Label` › Optional | Boolean (exposed) | **False**, True | `optional` | |
| `.Input Content` › Filled | Variant (exposed) | **False**, True | `value` (model) | In code, Filled also shows the clear button. |
| `.Input Content` › Placeholder | Boolean (exposed) | **True**, False | `placeholder` | Code default "Search…". |
| `.Append/Icon` | Exposed instance | icon swap | none | Code places the search icon at the start, not as an append. |
| none | | | `errorMessage` | Code only. |
| none | | | `(cleared)` output | Emitted when the clear button empties the field. Code only. |

Slots: none.
Exposed nested instances: `.Label`, `.Input Content` (Filled, Placeholder) and `.Append/Icon`.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` on the container | State=Hover |
| Active (focus) | `:focus-within` on the container | State=Active |
| Disabled | `disabled` input | State=Disabled |
| Read Only | `readonly` input | State=Read Only |
| Error | `error` input, `aria-invalid` | State=Error |
| Filled | `value` not empty, clear button visible | Filled=True |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Label, Input | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Label, Input | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Label | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Label, Input | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Label, Input (+1) | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Optional, Icon search (+2) | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
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
- Native `type="search"` input. When `label` is empty (typical in flyouts) the input has no accessible name other than its placeholder: provide a label or an accessible name from context.
- The clear button has `aria-label="Clear"`. It is a native `<button>` in code rather than `ds-button-icon` (see Notes in the final report).
- Error sets `aria-invalid`; the message uses `role="alert"`.
- Visible 2px focus outline on the container.

## Content guidelines
- Placeholder says what can be searched ("Search a BU"), in sentence case.
- If a label is shown: semi-bold, one line, never wrapped or truncated.
- Show an explicit "No match" message in the filtered list when nothing matches.

## Do / Don't
- Do filter results as the user types when the list is local. Don't require a Search button for a local filter.
- Do keep the clear button so users can reset in one click. Don't clear the query silently when the list changes.

## Related components
Composes: `ds-icon` (search, close) · Used by: Search Bar (`ds-search-bar-scoped`, BU filter flyout), Tag Filter Chip.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2695:3399 is still the empty template). |
