# Input Text
**Status**: Design Ready · Tech In code
A single-line field to enter and edit free text, with a label, optional prefix or suffix, and validation states.
Figma: [Components] Data Entry › page Input Text (node 2045:707) · Storybook: `Design System/Data Entry/Input Text` (`design-system-data-entry-input-text--default`) · Code: `shared/ui/input-text` (`ds-input-text`)

## Overview
Input Text is the base text field of the system: a semi-bold label above a 32px bordered container that holds the native input, with optional prepend (for example a dial code) and append (a unit or an icon) content. Input Email, Input Date, Input Search and Text Area follow the same anatomy. Embed the Storybook `Default` story (and `AllStates`) and the Figma component set `Input Text` (node 2045:707) from the `_Design system header` frame (2045:887). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use for short free-form values: names, references, cities, phone numbers.
- Use with a prepend or append when the value has a fixed prefix or unit (dial code, "m2").
- Use the `inline` variant when the field sits inside another component (Inline Edit).
- Don't use for long or multi-line text → use Text Area instead.
- Don't use for a choice among predefined values → use Dropdown or Radio instead.
- Don't use for dates → use Input Date or Date Range instead.
- Don't use for email addresses or search queries → use Input Email or Input Search instead.

## Anatomy
1. `.Label`: field label (semi-bold) with the optional "(optional)" mention and a `Remaining` counter (see the Label atom on the transverse Label page).
2. `Container`: the bordered box (1px border, 4px radius, 32px high).
3. `.Input Content`: the content row inside the container.
   - `.Prepend`: optional leading content, for example "+49" with a small `Dropdown` chevron.
   - Text: placeholder or value, with the `.Selector` caret when focused.
   - `.Append`: optional trailing content, `Type=Text` (a unit such as "m2") or `Type=Icon`.
4. Error message: in code only, shown under the container when `error` and `errorMessage` are set (Figma Input Text has no Helper Text atom, see Notes).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled, Read Only, Error | `disabled`, `readonly`, `error` | Hover is `:hover`, Active is `:focus-within`. |
| Label | Boolean | **True**, False | `label` (string) | Empty string hides the label. |
| `.Label` › Optional | Boolean (exposed) | **False**, True | `optional` | Renders "(optional)" after the label. |
| `.Label` › Remaining | Boolean (exposed) | **False**, True | none | Character counter not implemented on Input Text. |
| `.Input Content` › Filled | Variant (exposed) | **False**, True | `value` (model) | Placeholder versus value color. |
| `.Input Content` › Placeholder | Boolean (exposed) | **True**, False | `placeholder` | |
| `.Input Content` › Prepend | Boolean (exposed) | **True**, False | content projected with `slot="prepend"` | |
| `.Input Content` › Append | Boolean (exposed) | **True**, False | content projected with `slot="append"` | |
| `.Prepend` › Dropdown | Boolean | **True**, False | none | Prepend content is free in code. |
| `.Append` › Type | Variant | Icon, **Text** | none | Append content is free in code. |
| none | | | `inputmode` | `text`, `numeric`, `decimal`, `email`, `tel`, `url`, `search`, `none`. Code only. |
| none | | | `variant` | `default` or `inline` (no border, bottom line only). Code only, used by Inline Edit. |
| none | | | `errorMessage` | Text shown under the field in error. Code only. |

Slots: `prepend` (leading content, for example a dial code) and `append` (trailing unit or icon), via `ng-content select="[slot=prepend]"` / `[slot=append]`.
Exposed nested instances: `.Label` (Optional, Remaining) and `.Input Content` (Filled, Placeholder, Prepend, Append).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` on the container | State=Hover |
| Active (focus) | `:focus-within` on the container, 2px focus outline | State=Active |
| Disabled | `disabled` input, 40% opacity | State=Disabled |
| Read Only | `readonly` input (native `readOnly`) | State=Read Only |
| Error | `error` input, red border, `aria-invalid` | State=Error |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Label, Input | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Label, Input | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Label | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Label, Input | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Label, Input | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Optional, Input (placeholder) | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| Optional, Error msg | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Container | height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Container | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Container | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Container | border | `--semantic-color-interactive-border-medium-alt-default` | `--foundation-color-grey-500` |
| Container | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Container (hover) | border-color | `--semantic-color-interactive-border-medium-alt-hover` | `--foundation-color-grey-600` |
| Input | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |
| Container (focus-within) | border-color | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Container (focus-within) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Container | padding | `--semantic-measurement-spacing-none` | `--foundation-spacing-0` |
| Container, Container (hover) | border | `--semantic-border-size-none` | `--foundation-sizing-0` |
| Container | border-radius | `--semantic-border-radius-none` | `--foundation-radius-0` |
| Container | box-shadow | `--semantic-border-size-m` | `--foundation-sizing-2` |
| Container | box-shadow | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Input | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Container (error) | border-color | `--semantic-color-interactive-border-strong-negative-default` | `--foundation-color-red-300` |
| Error msg | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |
| Error msg | color | `--semantic-color-interactive-text-strong-negative-default` | `--foundation-color-red-300` |
| Container (readonly) | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Container (readonly, hover) | border-color | `--semantic-color-interactive-border-medium-alt-default` | `--foundation-color-grey-500` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- The visible label is a native `<label for>` bound to the input id.
- Error sets `aria-invalid="true"`; the message is announced with `role="alert"`. The message is not linked to the input with `aria-describedby`.
- Focus is visible: 2px outline in `--semantic-color-interactive-border-focus` around the container.
- Placeholder text is not a label: always provide `label` (or an accessible name from context for the inline variant).
- Read Only keeps the value focusable and readable; Disabled removes it from interaction.

## Content guidelines
- Label in semi-bold, sentence case, one line. Never wrap it on two lines and never truncate it: widen the field (grid span) or reorganize the row instead. Shorten it only if the meaning stays exact.
- Placeholder shows an example or format ("e.g. 113"), never the label again.
- Mark the minority case: if most fields are required, mark the optional ones with "(optional)".
- Error messages say what to do ("Enter a company name"), not only what is wrong.

## Do / Don't
- Do always show a visible label above the field. Don't rely on the placeholder as the only label.
- Do size the field to the expected value. Don't stretch a 5-digit postal code field to full width.
- Do use prepend and append for fixed units or prefixes. Don't ask users to type the unit.
- Do give the label the width it needs. Don't let a label wrap on two lines.

## Related components
Composes: none (atom; Figma uses the private `.Label` atom) · Used by: Inline Edit, More Criteria, Filter Drawer.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2193:2142 is still the empty template). |
