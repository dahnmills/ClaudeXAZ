# Text Area
**Status**: Design Ready · Tech In code
A multi-line field to enter longer free text, such as an address or a comment.
Figma: [Components] Data Entry › page Text Area (node 2330:847) · Storybook: `Design System/Data Entry/Textarea` (`design-system-data-entry-textarea--default`) · Code: `shared/ui/textarea` (`ds-textarea`)

## Overview
Text Area extends the Input Text anatomy to several lines: a semi-bold label, a bordered resizable container and a helper text line under it (information, error or character count such as "0/5000"). Embed the Storybook `Default` story (and `Error`) and the Figma component set `Text Area` (node 2330:847) from the `_Design system header` frame (2330:531). The Figma header still shows Tech "Draft".

## When to use / When not to use
- Use for text that can span several lines: comments, notes, street addresses.
- Use when the expected length is unknown or long (with a character limit if needed).
- Don't use for a short single-line value → use Input Text instead.
- Don't use for structured values (dates, emails, numbers) → use Input Date, Input Email or Input Text with `inputmode`.
- Don't use to edit a short value in place → use Inline Edit instead.

## Anatomy
1. `.Label`: field label (semi-bold), with the optional "(optional)" mention and the `Remaining` counter.
2. `Container`: bordered box holding `.Text Area Content`.
3. `.Text Area Content`: placeholder or value (`Content` variant), with the `.Selector` caret when focused.
4. `.Resize Handle`: the 11px corner grip to resize the field vertically.
5. `.Helper Text`: line under the field, with an icon and a status (Neutral, Informative, Negative, Warning, Positive). See the transverse Helper Text page.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled, Read Only, Error | `disabled`, `readonly`, `error` | |
| Helper Text | Boolean | **True**, False | `errorMessage` (error only) | Code only renders an error message; other helper statuses are not implemented. |
| Border Focus | Boolean | **True**, False | none | In code focus is `:focus-within`. |
| `.Text Area Content` › Content | Variant (exposed) | Value, **Placeholder** | `value` (model), `placeholder` | |
| `.Label` | Exposed instance | Optional, Remaining | `label`, `optional` | Remaining counter not implemented in code. |
| `.Helper Text` › Status | Variant (exposed) | **Neutral**, Informative, Negative, Warning, Positive | `error` maps to Negative | |
| `.Helper Text` › Icon | Boolean (exposed) | **True**, False | none | |
| none | | | `rows` | Initial height in lines (default 3). Code only. |

Slots: none.
Exposed nested instances: `.Label`, `.Text Area Content` and `.Helper Text`.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` on the container | State=Hover |
| Active (focus) | `:focus-within` on the container | State=Active |
| Disabled | `disabled` input | State=Disabled |
| Read Only | `readonly` input | State=Read Only |
| Error | `error` input, `aria-invalid`, message with `role="alert"` | State=Error |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Label, Input | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Label, Input | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Label | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Label, Input | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Label, Input | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Optional | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| Optional, Error msg | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` |
| Container | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Container | border | `--semantic-color-interactive-border-medium-alt-default` | `--foundation-color-grey-500` |
| Container | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Container (hover) | border-color | `--semantic-color-interactive-border-medium-alt-hover` | `--foundation-color-grey-600` |
| Input | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |
| Container (focus-within) | border-color | `--semantic-color-interactive-border-strong-active` | `--foundation-color-blue-a-700` |
| Container (focus-within) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Container (error) | border-color | `--semantic-color-interactive-border-strong-negative-default` | `--foundation-color-red-300` |
| Error msg | line-height | `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` |
| Error msg | color | `--semantic-color-interactive-text-strong-negative-default` | `--foundation-color-red-300` |
| Container (readonly) | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- Native `<label for>` bound to a native `<textarea>`.
- Error sets `aria-invalid`; the message uses `role="alert"`, not linked with `aria-describedby`.
- If a character limit is shown, announce it in text ("0/5000"), not only by color.
- Visible focus on the container.

## Content guidelines
- Label semi-bold, one line, never wrapped or truncated.
- Placeholder gives an example of the expected content, not instructions that disappear on typing.
- Helper text stays one short sentence.

## Do / Don't
- Do size the field to the expected text (use `rows`). Don't use a one-row text area for long comments.
- Do show the limit when there is one. Don't cut the text silently at the limit.

## Related components
Composes: none (atom; Figma uses the private `.Label`, `.Helper Text` and `.Resize Handle` atoms) · Used by: More Criteria (Street address).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2330:629 is still the empty template). |
