# Button
**Status**: Design Ready · Tech In code
A button triggers an action on the current screen: submit, validate, open a flow, confirm a decision.
Figma: [Components] Action › page Button (node 44:558) · Storybook: `Design System/Action/Button` (id `design-system-action-button--primary`) · Code: `shared/ui/button` (`ds-button`)

## Overview
Button is the main call to action of the system. It comes in four types that set its weight on the page (Primary, Secondary, Tertiary, Plain) and in tones that change its color meaning (Default, Accent, Positive, Negative). Embed the Storybook story `Primary` as the live example, and the Figma component set `Button` (node 44:558) on the Button page as the visual reference.

## When to use / When not to use
- Use when the user starts an action that changes data or state (save, submit, validate, delete).
- Use a single Primary button for the main action of a screen, a card or a dialog.
- Use Secondary or Tertiary for the actions that sit next to the main one (cancel, back, export).
- Use Positive or Negative tone when the action is a decision whose outcome must be read at a glance (accept, refuse).
- Use Plain for a low-weight action placed inline with text or in a dense row.
- Don't use when the action only navigates to another page or anchor → use Link instead.
- Don't use when the action has no visible label, only an icon → use Button Icon instead.
- Don't use when the button must open a menu of related actions → use Button Split instead.
- Don't use when the user toggles between views or picks one option from a short set → use Segmented Control or Tab instead.
- Don't use for a filter or a selectable value → use Tag or Chip instead.

## Anatomy
1. `Button` (container): the clickable surface. Holds the background, the 1px border and the 4px radius. Height 32px (24px for Plain).
2. `.Content` (private atom): horizontal row with an optional icon and the label, gap 8px. Its `Icon` property places the icon on the left, on the right or removes it.
3. `Icon Functional` (inside `.Content`): the icon, swapped through the nested `🔗 Icon` instance (default glyph `Edit Pen`).
4. `Label` (text inside `.Content`): the action text, Body L regular (16px / 24px).
5. `Border Focus` (frame): the keyboard focus ring drawn around the container.
6. Spinner (Loading state only): replaces the content while the action runs. In code it is a `ds-spinner` (size `s`, tone `current`) centered over the hidden content, so the button keeps its width.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Type | Variant | **Primary**, Secondary, Tertiary, Plain | `type: 'primary' \| 'secondary' \| 'tertiary' \| 'plain'` (default `'primary'`) | Plain has no padding and a 24px height. |
| Tone | Variant | **Default**, Accent, Positive | `tone: 'default' \| 'accent' \| 'positive' \| 'negative'` (default `'default'`) | Code adds `negative`, which has no Figma variant. |
| Reversed | Variant | True, **False** | `reversed: boolean` (default `false`) | For use on dark or brand surfaces. |
| State | Variant | **Default**, Hover, Active, Disabled, Loading | Hover and Active: CSS. Disabled: `disabled: boolean`. Loading: `loading: boolean` | See States. |
| (none) | | | `fullWidth: boolean` (default `false`) | Code only: stretches the button to its container (used for "Load more"). No Figma property. |
| (none) | | | `clicked` (output, `void`) | Emitted on click, Enter and Space, never while disabled or loading. |

Slots: Figma has no slot on Button. In code, the default content projection is the label; `[slot=icon-left]` and `[slot=icon-right]` receive a `ds-icon`. Together they replace the Figma `.Content` › `Icon` property (Left, Right, None).

Exposed nested instances: `.Content` is exposed, so its `Icon` property (**Left**, Right, None) is set directly on the Button instance. The glyph itself is changed through the `🔗 Icon` swap of `Icon Functional`.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover` (skipped when disabled) | `State=Hover` |
| Active | `:active` (skipped when disabled) | `State=Active` |
| Focus | `:focus-visible`: 3px outline in the focus color, 2px offset | `Border Focus` layer (no dedicated variant) |
| Disabled | `disabled` input: sets `disabled` and `aria-disabled`, `tabindex=-1`, opacity 0.40, no pointer events | `State=Disabled` |
| Loading | `loading` input: content hidden, spinner shown, `aria-busy`, opacity 0.40, not clickable | `State=Loading` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` (32px) |
| Container (Plain) | height | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` (24px) |
| Container | horizontal padding | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` (16px) |
| Content | gap icon / label | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` (8px) |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` (4px) |
| Label | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` (16px) |
| Label | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` (400) |
| Label | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` (24px) |
| Focus ring | outline color | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Disabled, Loading | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` (0.40) |
| Primary Default | background / border (default, hover, active) | `--semantic-color-interactive-background-strong-{default,hover,active}`, `--semantic-color-interactive-border-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Primary | label | `--semantic-color-interactive-text-neutral-default` | `--foundation-color-white-1000` |
| Primary Accent | background / border | `--semantic-color-interactive-background-strong-alt-{default,hover,active}`, `--semantic-color-interactive-border-strong-alt-{default,hover,active}` | `--foundation-color-grey-900` / `-800` / `-700` |
| Primary Positive | background / border | `--semantic-color-interactive-background-strong-positive-{default,hover,active}`, `--semantic-color-interactive-border-strong-positive-{default,hover,active}` | `--foundation-color-green-500` / `-600` / `-700` |
| Primary Negative | background / border | `--semantic-color-interactive-background-strong-negative-{default,hover,active}`, `--semantic-color-interactive-border-strong-negative-{default,hover,active}` | `--foundation-color-red-300` / `-400` / `-500` |
| Primary Reversed | background / border | `--semantic-color-interactive-background-neutral-default`, `--semantic-color-interactive-border-neutral-default` | `--foundation-color-white-1000` |
| Primary Reversed | hover / active background and border | `--semantic-color-interactive-background-muted-{hover,active}`, `--semantic-color-interactive-border-muted-{hover,active}` | `--foundation-color-blue-a-025` / `-050` |
| Primary Reversed | label | `--semantic-color-interactive-text-strong-default` | `--foundation-color-blue-a-500` |
| Secondary Default | background | `--semantic-color-interactive-background-muted-{default,hover,active}` | `--foundation-color-white-1000` / `--foundation-color-blue-a-025` / `-050` |
| Secondary Default | border | `--semantic-color-interactive-border-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Secondary, Tertiary, Plain Default | label | `--semantic-color-interactive-text-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Secondary Accent | hover / active background | `--semantic-color-interactive-background-muted-alt-{hover,active}` | `--foundation-color-grey-050` / `-100` |
| Secondary, Tertiary, Plain Accent | label, border | `--semantic-color-interactive-text-strong-alt-{default,hover,active}`, `--semantic-color-interactive-border-strong-alt-{default,hover,active}` | `--foundation-color-grey-900` / `-800` / `-700` |
| Secondary Positive | background | `--semantic-color-interactive-background-light-positive-{default,hover,active}` | `--foundation-color-green-050` / `-100` / `-200` |
| Secondary Negative | background | `--semantic-color-interactive-background-light-negative-{default,hover,active}` | `--foundation-color-red-050` / `-100` / `-200` |
| Secondary, Tertiary, Plain Positive | label (and Secondary border) | `--semantic-color-interactive-text-strong-positive-{default,hover,active}`, `--semantic-color-interactive-border-strong-positive-{default,hover,active}` | `--foundation-color-green-500` / `-600` / `-700` |
| Secondary, Tertiary, Plain Negative | label (and Secondary border) | `--semantic-color-interactive-text-strong-negative-{default,hover,active}`, `--semantic-color-interactive-border-strong-negative-{default,hover,active}` | `--foundation-color-red-300` / `-400` / `-500` |
| Secondary, Tertiary, Plain Reversed | label (and Secondary border) | `--semantic-color-interactive-text-neutral-default`, `--semantic-color-interactive-border-neutral-default` | `--foundation-color-white-1000` |

Values written outside tokens in the SCSS: border width 1px, focus outline width 3px and offset 2px.

## Accessibility
- Role: the host element carries `role="button"` and `tabindex="0"`, so it is reachable with Tab.
- Keyboard: Enter and Space trigger `clicked`; Space does not scroll the page.
- Disabled: `disabled` and `aria-disabled="true"` are set, `tabindex` becomes -1, and no event is emitted.
- Loading: `aria-busy="true"` is set and the button is not clickable; the label stays in the DOM (hidden visually) so the width does not jump.
- Focus: visible ring of 3px in `--semantic-color-interactive-border-focus`, offset 2px, shown on keyboard focus only (`:focus-visible`).
- Label: always give a text label. If an icon alone carries the meaning, use Button Icon with its `ariaLabel`.
- Contrast: Positive and Negative tones must keep a text label; the color never carries the decision alone.

## Content guidelines
- Start with a verb that names the result: "Validate", "Export", "Create task".
- Keep it short: one to three words, on one line (the button does not wrap, `white-space: nowrap`).
- Sentence case: capital on the first word only.
- No final punctuation, except the ellipsis "…" while loading ("Submitting…").
- No em dash in labels.

## Do / Don't
- Do keep one Primary button per area; don't place two Primary buttons side by side.
- Do use Negative tone for destructive actions such as delete; don't use red for an action that is not destructive or a refusal.
- Do use Reversed on dark or brand backgrounds; don't put a Default button on the navy header.
- Do use the Loading state while a request runs; don't disable the button without telling the user why.

## Related components
Composes: Icon (`ds-icon` in the icon slots), Spinner (`ds-spinner`, Loading state) · Used by: Button Split, Confirm Dialog, Date Range, File Upload, Filter Drawer, Modal, More Criteria, Search Bar, Search Bar Multi, Search Bar Scoped, Widget Card.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Current version shown in the Figma header. The Versionning frame is still the empty template. |
| | | A `[Deprecated] Button` set (node 44:743, properties `Icon Left`, `Icon Right`) is kept on the page; do not use it. |
