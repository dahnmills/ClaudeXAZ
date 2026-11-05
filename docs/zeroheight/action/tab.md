# Tab
**Status**: Design Ready · Tech In code
A tab switches between views of the same content without leaving the page.
Figma: [Components] Action › page Tab (node 57:231) · Storybook: `Design System/Action/Tab` (id `design-system-action-tab--default`) · Code: `shared/ui/tab` (`ds-tab`)

## Overview
Tab is one item of a tab bar: a label with an underline indicator that shows the selected view. It can carry a counter badge, a change dot and a dropdown chevron. The tab does not manage the group: the parent lays the tabs out and tracks which one is selected. Embed the Storybook story `Default` as the live example, and the Figma component set `Tab` (node 57:231) as the visual reference.

## When to use / When not to use
- Use when the content splits into peer sections that the user reads one at a time.
- Use when switching views must keep the user on the same page and context.
- Use the counter to show how many items a view holds (for example open tasks).
- Use Reversed in a dark or brand header.
- Don't use for a setting or a single choice inside a form → use Segmented Control (`mode="radio"`) or Radio instead.
- Don't use for sequential steps that the user completes in order → use Stepper instead.
- Don't use to go to another page → use Link or Side Nav instead.
- Don't use to filter a list by values → use Tag or Chip instead.

## Anatomy
1. `Tab` (container): 32px high, no own padding (spacing comes from the parent).
2. `Content` (frame): optional icon, `Label`, optional counter and optional `.Options` chevron, gap 4px.
3. `Label` (text): Body L regular, 16px / 24px.
4. `Badge Wrapper` with a `Badge` instance: the counter, shown with the `Badge` boolean.
5. `.Options` (private atom, `Open` False or True): the dropdown chevron, shown with the `Dropdown` boolean.
6. `Border Selected` (frame): the 4px indicator under the tab, colored when selected.
7. `Mask` (frame): an overlay shown with the `Mask` boolean.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Tone | Variant | **Default**, Accent, Reversed | `tone: 'default' \| 'accent' \| 'reversed'` (default `'default'`) | |
| Selected | Variant | False, **True** | `selected: boolean` (default `false`) | Defaults differ: True in Figma, false in code. |
| State | Variant | **Default**, Hover, Active, Disabled | Hover, Active: CSS. Disabled: `disabled: boolean` | |
| Label | Text | **"Label"** | default content projection | |
| Badge | Boolean | **true** | `counter: number \| null` (default `null`) | The counter shows when `counter` is not null. Code adds `counterStyle: 'badge' \| 'inline'` and `counterStrong: boolean`. |
| Dropdown | Boolean | **true** | `chevron: boolean` (default `false`) | Defaults differ. |
| `.Options` › Open | Variant (exposed) | **False**, True | none | Code has no open state on the chevron. |
| Mask | Boolean | **false** | none | No code equivalent. |
| (none) | | | `icon: boolean` (default `false`) | Code only: renders `[slot=icon]` or `[slot=icon-left]` before the label. |
| (none) | | | `changed: boolean` (default `false`) | Code only: red dot that flags a changed view. |
| (none) | | | `fill: boolean` (default `false`) | Code only: the tab takes an equal share of the parent width. |
| (none) | | | `clicked` (output) | Emitted on click, Enter and Space, never while disabled. |

Slots: no Figma slot. In code: default projection for the label, `[slot=icon]` or `[slot=icon-left]` for an icon (with `icon=true`), `[slot=badge]` for a custom badge.

Exposed nested instances: `.Options` is exposed (property `Open`). The `Badge` instance in `Badge Wrapper` is not exposed.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover`: label and indicator take the hover color | `State=Hover` |
| Active | `:active` | `State=Active` |
| Focus | `:focus-visible`: 3px outline, 2px offset, 2px radius | no variant |
| Selected | `selected` input: `aria-selected="true"`, indicator visible | `Selected=True` |
| Disabled | `disabled` input: `aria-disabled`, opacity 0.40 | `State=Disabled` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` (32px) |
| Content | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` (4px) |
| Label | font | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-font-weight-regular`, `--semantic-font-text-style-line-height-l` | `--foundation-font-family`, `--foundation-font-size-16`, `--foundation-font-weight-regular`, `--foundation-font-line-height-24` |
| Default tone | label color rest / hover / active | `--semantic-color-static-text-main-primary`, `--semantic-color-interactive-text-strong-hover`, `--semantic-color-interactive-text-strong-active` | `--foundation-color-grey-900`, `--foundation-color-blue-a-600`, `--foundation-color-blue-a-700` |
| Default tone | selected label | `--semantic-color-interactive-text-strong-default` | `--foundation-color-blue-a-500` |
| Default tone | indicator default / hover | `--semantic-color-interactive-border-strong-default` / `-hover` | `--foundation-color-blue-a-500` / `-600` |
| Accent tone | label rest / hover / active | `--semantic-color-static-text-main-primary`, `--semantic-color-interactive-text-strong-alt-hover`, `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-900`, `-800`, `-700` |
| Accent tone | selected label, indicator | `--semantic-color-interactive-text-strong-alt-default`, `--semantic-color-interactive-border-strong-alt-default` | `--foundation-color-grey-900` |
| Reversed tone | label, indicator | `--semantic-color-interactive-text-neutral-default` | `--foundation-color-white-1000` |
| Reversed tone | label hover / active | `--semantic-color-static-border-subtle-secondary` / `-tertiary` | `--foundation-color-grey-050` / `-200` |
| Counter (badge) | background | `--semantic-color-static-background-functional-signal` | `--foundation-color-red-300` |
| Counter (badge) | text color, weight | `--semantic-color-static-text-subtle-primary`, `--semantic-font-text-style-font-weight-bold` | `--foundation-color-white-1000`, `--foundation-font-weight-bold` (700) |
| Counter (inline) | font-size, line-height | `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16`, `--foundation-font-line-height-24` |
| Change dot | size, color, radius | `--semantic-measurement-sizing-s`, `--semantic-color-static-background-functional-signal`, `--semantic-border-radius-round` | `--foundation-sizing-8`, `--foundation-color-red-300`, `--foundation-radius-100` |
| Focus ring | outline color | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

Values written outside tokens in the SCSS: indicator height 4px and radius 2px 2px 0 0, counter badge min-width and height 16px, padding 0 4px, radius 9999px, font-size 12px and line-height 16px, focus outline 3px, offset 2px, radius 2px. The Reversed active comment says Grey/100 while the token resolves to Grey/200.

## Accessibility
- Role: `role="tab"` on the host, `aria-selected` reflects `selected`. The parent must carry `role="tablist"` and link each tab to its panel (`aria-controls`, `role="tabpanel"`).
- Keyboard: roving tab stop, only the selected tab has `tabindex="0"`, the others -1. Enter and Space emit `clicked`. Arrow key navigation between tabs is the parent's job (not in the atom).
- Disabled: `aria-disabled="true"`.
- Counter: rendered with `aria-label="counter"`; give the parent tab label enough context so the number is meaningful ("Tasks, 3").
- Selection is shown by the indicator bar and the label color, not by color alone.

## Content guidelines
- One or two words per tab, on one line.
- Sentence case, no final punctuation.
- Use nouns that name the view ("Overview", "Limits", "History").
- No em dash.

## Do / Don't
- Do keep tabs for peer views of one object; don't use them as a step-by-step flow.
- Do keep the number of tabs small enough to fit on one line; don't let the tab bar wrap.
- Do use the counter for actionable counts; don't add a counter to every tab.

## Related components
Composes: Icon (`ds-icon` chevron and icon slot), Badge (Figma `Badge Wrapper`) · Used by: Filter Drawer, Shortcuts Panel.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Current version shown in the Figma header. The Versionning frame is still the empty template. |
