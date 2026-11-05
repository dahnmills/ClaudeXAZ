# Dropdown
**Status**: Design Ready · Tech In code
A form field that opens a list of predefined options to choose one value, or several values shown as tags.
Figma: [Components] Data Entry › page Dropdown (node 2046:720) · Storybook: `Design System/Data Entry/Select` (`design-system-data-entry-select--default`) and `Design System/Data Entry/Multi Select` (`design-system-data-entry-multi-select--some`) · Code: `shared/ui/select` (`ds-select`) and `shared/ui/multi-select` (`ds-multi-select`)

## Overview
Dropdown (also called select menu) shows a semi-bold label, a 32px bordered field with the current value or placeholder and a chevron, and an optional helper text. Clicking the field opens a Dropdown Flyout Menu under it. Figma models single and multiple selection in one component (the `.Value` atom switches between Text and Tags); code splits them into `ds-select` (one value) and `ds-multi-select` (tags with "(+x more)"). Embed the Storybook `Select / Default` and `Multi Select / Some` stories and the Figma component set `Dropdown` (node 2046:720) from the `_Design system header` frame (2046:1110). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use when there are many options (more than about 5) and only one is selected (for example a country).
- Use the multi-select form (tags) when several values can be chosen from a long list.
- Use when the list is familiar and does not need to be compared side by side.
- Don't use for two or three options → use Radio, Segmented Control or Toggle instead.
- Don't use for a dropdown trigger without a field look (in a bar, a toolbar) → use Standalone Dropdown instead.
- Don't use for free text with suggestions → To be defined (Auto Complete is still WIP in Figma).
- Don't use for actions → use a Button with a Flyout Menu instead.

## Anatomy
1. `.Label`: semi-bold field label, with Optional and Remaining options (transverse Label atom).
2. `Container`: bordered field (1px border, 4px radius).
3. `.Input Content`: the value area.
   - `.Value`: `Type=Text` (a single `.Text` value), `Type=Tags` (`.Tags`: Tag instances and a "(+x more)" counter) or `Type=Slot`.
   - Placeholder when nothing is selected.
   - `.Append`: the chevron icon, `Open=False` (down) or `Open=True` (up).
4. `.Helper Text`: line under the field with a status (Neutral, Informative, Negative, Warning, Positive).
5. Dropdown Flyout Menu: the option list, opened under the field (documented on its own page).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled, Read Only, Error | `disabled`, `error` | Hover is `:hover`, Active is `:focus-within`. Read Only is not implemented in code. |
| Filtering | Variant | True, **False** | none | Typing to filter the list is not implemented in `ds-select` / `ds-multi-select`. |
| Property 3 | Variant | True (only value) | none | Unnamed leftover property in Figma, no meaning documented. |
| Label | Boolean | **True**, False | `label` (string) | |
| Helper Text | Boolean | **False**, True | `errorMessage` (error only) | Other helper statuses not implemented. |
| `.Label` › Optional | Boolean (exposed) | **False**, True | none | No `optional` input on select. |
| `.Input Content` › Filled | Variant (exposed) | **False**, True | `value` (model) | `string` for `ds-select`, `string[]` for `ds-multi-select`. |
| `.Input Content` › Placeholder | Boolean (exposed) | **True**, False | `placeholder` | |
| `.Append` › Open | Variant (exposed) | **False**, True | internal `open` state | Chevron up when open (multi-select). |
| `.Value` › Type | Variant (atom) | **Text**, Tags, Slot | `ds-select` (Text) or `ds-multi-select` (Tags) | Slot has no code equivalent. |
| `.Tags` › More | Boolean (atom) | **True**, False | `maxVisible` (multi-select) | "(+x more)" counter when tags overflow. |
| none | | | `options` (required) | `{ value, label, disabled? }[]`. |
| none | | | `variant` (multi-select: `default`, `inline`), `icon` | Inline variant without border for bars. Code only. |
| none | | | `(selectionChange)` (select) | |

Slots: none in code. `.Value Type=Slot` in Figma for custom value content.
Exposed nested instances: `.Label`, `.Input Content`, `.Append` and `.Helper Text`.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` | State=Hover |
| Active / open | `:focus-within`, flyout open | State=Active, `.Append` Open=True |
| Disabled | `disabled` input | State=Disabled |
| Read Only | not implemented | State=Read Only |
| Error | `error` input, `aria-invalid`, message under the field | State=Error |
| Filled | a value is selected | `.Input Content` Filled=True |

## Tokens
`ds-select`:
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Label, Field | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Label, Field | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Label | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Label, Field | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Label, Field | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Container | height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Container | border | `--semantic-border-size-s` | `--foundation-sizing-1` |
| Container | border | `--semantic-color-interactive-border-strong-alt-default` | `--foundation-color-grey-900` |
| Container | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Container (hover) | border-color | `--semantic-color-interactive-border-strong-alt-hover` | `--foundation-color-grey-800` |
| Container (open) | border-color | `--semantic-color-interactive-border-strong-default` | `--foundation-color-blue-a-500` |
| Container (focus-within) | outline | `--semantic-border-size-m` | `--foundation-sizing-2` |
| Container (focus-within) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Container (focus-within) | outline-offset | `--semantic-border-size-s` | `--foundation-sizing-1` |
| Field | padding | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Field | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Value  placeholder, Chevron | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Chevron | right | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Flyout | top | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Container (error) | border-color | `--semantic-color-interactive-border-strong-negative-default` | `--foundation-color-red-300` |
| Error msg | color | `--semantic-color-static-text-main-functional-negative` | `--foundation-color-red-500` |
| Error msg | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Error msg | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |

`ds-multi-select`:
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Label, More (+2) | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Label, Placeholder | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Label, More | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Label, Placeholder | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Label, More | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Container | height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Container, Options | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Container, Tags | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Container | border | `--semantic-color-interactive-border-medium-alt-default` | `--foundation-color-grey-500` |
| Container | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Container (focus-visible) | border-color | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Container (focus-visible) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Icon | color | `--semantic-color-static-icon-main-tertiary` | `--foundation-color-grey-500` |
| Value | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Value, Error msg | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Value | gap | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` |
| More, Error msg | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| More | line-height | `--semantic-font-text-style-line-height-s` | `--foundation-font-line-height-16` |
| More | letter-spacing | `--semantic-font-text-style-letter-spacing-s` | `--foundation-font-letter-spacing-0-2` |
| Placeholder | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| Chevron | color | `--semantic-color-static-icon-main-secondary` | `--foundation-color-grey-700` |
| Flyout | top | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Options | max-height | `--semantic-measurement-sizing-3xl` | `--foundation-sizing-64` |
| Options | padding | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Container (error) | border-color | `--semantic-color-interactive-border-strong-negative-default` | `--foundation-color-red-300` |
| Placeholder (error) | color | `--semantic-color-static-text-main-functional-negative` | `--foundation-color-red-500` |
| Error msg | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |
| Error msg | color | `--semantic-color-interactive-text-strong-negative-default` | `--foundation-color-red-300` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- `ds-select`: the field is a native button with `aria-haspopup="listbox"` and `aria-expanded`; the label is a `<label for>`. Options are `ds-flyout-menu-item` with `role="option"` and `aria-selected`. Escape and an outside click close the list. Arrow-key navigation inside the list is not built in.
- `ds-multi-select`: the field has `role="combobox"`, `aria-expanded`, `aria-labelledby` (label), `aria-disabled`, `aria-invalid`; the list is a `role="listbox"` with `aria-multiselectable="true"` made of `ds-checkbox`. Each tag has a "Remove …" accessible name.
- Error messages use `role="alert"`.
- Only one dropdown is open at a time on the page (shared single-open registry).

## Content guidelines
- Label: semi-bold, sentence case, one line, never wrapped or truncated.
- Placeholder invites the choice ("Select a country"); it is not a label.
- Option labels are short, unique and sorted in a predictable order (alphabetical or by frequency).
- With tags, keep the "(+x more)" counter rather than wrapping tags on several lines.

## Do / Don't
- Do use a dropdown for long, familiar lists. Don't hide two options behind a dropdown.
- Do keep the selected value visible in the field. Don't reset the value when the list closes.
- Do show the "(+x more)" counter when tags overflow. Don't let tags push the field to two lines.

## Related components
Composes: Dropdown Flyout Menu (code: `ds-flyout-menu` + `ds-flyout-menu-item`), Tag and Checkbox (multi-select), Icon · Used by: Search Bar (`ds-search-bar-scoped` uses `ds-multi-select`), Filter Drawer, and many screens (Admin Data, Buyer Summary, Search, TAG Configuration).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2193:2376 is still the empty template). |
