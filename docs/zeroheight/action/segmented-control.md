# Segmented Control
**Status**: Design Ready · Tech In code
A row of joined segments where exactly one is selected, to switch a view or set a value.
Figma: [Components] Action › page Segmented Control (node 302:2197, set named `Component 1`) · Storybook: `Design System/Action/Segmented Control` (id `design-system-action-segmented-control--playground`) · Code: `shared/ui/segmented-control` (`ds-segmented-control`)

## Overview
Segmented Control shows two to five mutually exclusive options side by side, with the selected one filled in blue. In code it has two modes: `tabs` (default) to switch a view, and `radio` to set a value in a form, with arrow keys and disabled options still announced. Figma models one segment (position First, Middle or Last) that you repeat to build the control. Embed the Storybook story `Playground` as the live example, and the Figma component set `Component 1` (node 302:2197) as the visual reference.

## When to use / When not to use
- Use to switch between two to five views of the same data (List, Chart).
- Use `mode="radio"` for a setting with few options that must all stay visible (Monthly, Quarterly, Yearly).
- Use with `describedBy` to explain why an option is disabled.
- Use icons when they help, on all segments or none.
- Don't use for more than about five options or long labels → use Dropdown (Select) instead.
- Don't use for page-level navigation between sections → use Tab instead.
- Don't use when several options can be on at once → use Tag (Select) or Checkbox instead.
- Don't use to run actions → use Button instead.

## Anatomy
1. Segment (`Component 1`): one option, 32px high, padding 0 16px, 1px Grey/900 border. `Position` sets the rounded corners (First: left, Last: right, Middle: none).
2. `.Content` (private atom, exposed): optional icon and label, `Icon` Left, Right or None; glyph swapped through `🔗 Icon`.
3. Label: Body L semi-bold, 16px / 24px.
4. Group (code): `ds-segmented-control`, segments joined in a row, `role="tablist"` or `role="radiogroup"`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Position | Variant | **First**, Middle, Last | computed from the option index | Code adds a `single` position when there is one option. |
| Selected | Variant | **False**, True | `selected: string` (value of the selected option) | |
| State | Variant | **Default**, Hover, Active, Disabled | Hover, Active: CSS. Disabled: `disabled: boolean` (all) or `option.disabled` (one) | |
| `.Content` › Icon | Variant (exposed) | **Left**, Right, None | `option.icon`, `option.iconPos: 'left' \| 'right'` | No icon when `option.icon` is not set. |
| (none) | | | `options: { value, label, icon?, iconPos?, disabled? }[]` (required) | The segments. |
| (none) | | | `mode: 'tabs' \| 'radio'` (default `'tabs'`) | Code only. |
| (none) | | | `ariaLabel: string`, `describedBy: string` | Group name and the id of the text that explains a disabled option. |
| (none) | | | `selectedChange` (output, `string`) | New selected value. |

Slots: none.

Exposed nested instances: `.Content` (property `Icon`; glyph through `🔗 Icon`).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover` on a non-selected segment: light blue plate; on the selected one: darker blue | `State=Hover` |
| Active | `:active` | `State=Active` |
| Selected | `selected` value: blue plate, white label, `aria-selected` (tabs) or `aria-checked` (radio) | `Selected=True` |
| Disabled | `disabled` or `option.disabled`: opacity 0.40, `aria-disabled`. In tabs mode also `disabled`; in radio mode the option stays focusable for screen readers | `State=Disabled` |
| Focus | no `:focus-visible` style in the SCSS (browser default) | no variant |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Group | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Segment | gap, height | `--semantic-measurement-spacing-xs`, `--semantic-measurement-spacing-xl` | `--foundation-spacing-4`, `--foundation-spacing-32` |
| Segment | padding | `--semantic-measurement-spacing-none` `--semantic-measurement-spacing-m` | `--foundation-spacing-0` / `-16` |
| Segment | border, background, label color | `--semantic-color-interactive-border-strong-alt-default`, `--semantic-color-static-background-main-primary`, `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900`, `--foundation-color-white-1000`, `--foundation-color-grey-900` |
| Segment | font | `--semantic-font-text-style-size-l`, `--semantic-font-text-style-font-weight-semi-bold`, `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16`, `--foundation-font-weight-semi-bold`, `--foundation-font-line-height-24` |
| Segment | hover / active background | `--semantic-color-interactive-background-light-{hover,active}` | `--foundation-color-blue-a-050` / `-100` |
| First, Last, single | corner radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Selected | background, border | `--semantic-color-interactive-background-strong-default` | `--foundation-color-blue-a-500` |
| Selected | label | `--semantic-color-interactive-text-neutral-default` | `--foundation-color-white-1000` |
| Selected | hover / active background and border | `--semantic-color-interactive-border-strong-{hover,active}` | `--foundation-color-blue-a-600` / `-700` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

Values written outside tokens in the SCSS: border 1px. The selected hover and active backgrounds use Border tokens.

## Accessibility
- `mode="tabs"`: host `role="tablist"`, segments `role="tab"` with `aria-selected`; disabled segments are `disabled`.
- `mode="radio"`: host `role="radiogroup"`, segments `role="radio"` with `aria-checked`; only the selected segment is a tab stop; arrow keys move and select, skipping disabled options; a disabled option stays announced with `aria-disabled`.
- Give the group an `ariaLabel` that names the setting or the view.
- Use `describedBy` to point to the text that explains a disabled option.
- No visible focus style is defined; the browser default ring applies.
- Selection is shown by a filled plate and a white label, not by a hue alone.

## Content guidelines
- One or two words per segment, same grammatical form for all.
- Labels never wrap; keep all segments on one line.
- Sentence case, no final punctuation, no em dash.

## Do / Don't
- Do use `mode="radio"` for a setting and `mode="tabs"` for a view switch; don't mix the two roles.
- Do keep two to five segments; don't squeeze long labels into it.
- Do explain a disabled option with `describedBy`; don't leave the user guessing why it is off.

## Related components
Composes: Icon (`ds-icon`) · Used by: Portfolio Management (select portfolio modal, app page), no other DS component.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Current version shown in the Figma header. The Versionning frame is still the empty template. The Figma set is still named `Component 1`. |
