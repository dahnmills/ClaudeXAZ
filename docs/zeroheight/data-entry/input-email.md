# Input Email
**Status**: Design Ready · Tech In code
A single-line field dedicated to email addresses, with the browser email keyboard and validation.
Figma: [Components] Data Entry › page Input Email (node 2222:1310) · Storybook: `Design System/Data Entry/Input Email` (`design-system-data-entry-input-email--playground`) · Code: `shared/ui/input-email` (`ds-input-email`)

## Overview
Input Email shares the anatomy and states of Input Text (semi-bold label, 32px bordered container), with a native `type="email"` input and an optional trailing icon. Embed the Storybook `Playground` story (and `States`) and the Figma component set `Input Email` (node 2222:1310) from the `_Design system header` frame (2222:1277). The Figma header still shows Tech "Draft", and its breadcrumb still reads "Input Text".

## When to use / When not to use
- Use when the value is an email address (contact, notification recipient).
- Use when you want the email keyboard on touch devices and email format validation.
- Don't use for any other free text → use Input Text instead.
- Don't use for several addresses at once → To be defined (no multi-email component).
- Don't use to search people by email → use Input Search instead.

## Anatomy
1. `.Label`: field label (semi-bold) with the optional "(optional)" mention.
2. `Container`: bordered box (1px border, 4px radius, 32px high).
3. `.Input Content`: text (placeholder "email@domain.com" or value, `.Selector` caret when focused) and `.Append` (a 20px icon).
4. Error message: in code only, under the container.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled, Read Only, Error | `disabled`, `readonly`, `error` | Hover is `:hover`, Active is `:focus-within`. |
| Label | Boolean | **True**, False | `label` (string) | |
| `.Label` › Optional | Boolean (exposed) | **False**, True | `optional` | |
| `.Input Content` › Filled | Variant (exposed) | **False**, True | `value` (model) | |
| `.Input Content` › Placeholder | Boolean (exposed) | **True**, False | `placeholder` | |
| `.Input Content` › Append | Boolean (exposed) | **True**, False | content projected with `slot="append"` | Code has no default icon. |
| none | | | `errorMessage` | Code only. |

Slots: `prepend` and `append` (content projection, same as Input Text). Figma only models Append.
Exposed nested instances: `.Label` and `.Input Content` (Filled, Placeholder, Append).

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
| Optional, Input (placeholder) | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
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
- Native `<label for>` bound to the `type="email"` input.
- Error sets `aria-invalid`; the message uses `role="alert"` but is not linked with `aria-describedby`.
- Visible 2px focus outline on the container.
- Do not rely on the browser's native validation bubble as the only error feedback: set `error` and `errorMessage`.

## Content guidelines
- Label: "Email" or "Email address", semi-bold, one line, never wrapped or truncated.
- Placeholder shows the format ("email@domain.com"), not the label.
- Error message gives the fix: "Enter an email address like name@domain.com".

## Do / Don't
- Do use Input Email for every email value so the right keyboard and validation apply. Don't use Input Text for emails.
- Do validate on blur or submit. Don't show an error while the user is still typing.

## Related components
Composes: none (atom; Figma uses the private `.Label` atom) · Used by: no other design system component (showcase page only).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2222:1371 is still the empty template). |
