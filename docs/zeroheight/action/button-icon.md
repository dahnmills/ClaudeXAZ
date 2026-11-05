# Button Icon
**Status**: Design Ready · Tech In code
A square button that carries an action with an icon only, for compact toolbars, rows and close buttons.
Figma: [Components] Action › page Button Icon (node 12:145) · Storybook: `Design System/Action/Button Icon` (id `design-system-action-button-icon--default`) · Code: `shared/ui/button-icon` (`ds-button-icon`)

## Overview
Button Icon has the same types and tones as Button, without a text label. It is the default control for repeated, well-known actions (close, edit, more, delete) where a label would cost too much space. Embed the Storybook story `Default` as the live example, and the Figma component set `Button Icon` (node 12:145) as the visual reference.

## When to use / When not to use
- Use when the icon is universally understood (close, edit, delete, more, copy).
- Use when space is tight: table rows, card headers, toolbars, dialog close.
- Use when the same action repeats on many items and a label would add noise.
- Use Plain for an icon placed inline, without a visible frame.
- Don't use when the action needs words to be understood → use Button instead.
- Don't use when the icon navigates to another page → use Link (with an icon slot) instead.
- Don't use when the button opens a list of actions next to a main action → use Button Split instead.
- Don't use for a large selectable surface with an icon and a label → use Tile or Visual Button instead.

## Anatomy
1. `Button Icon` (container): square clickable surface with background, 1px border and 4px radius. 32 x 32px in size S, 40 x 40px in size M.
2. `Icon Functional` (exposed instance): the glyph, swapped through `🔗 Icon` (default glyph `Edit Pen`).
3. `Border Focus` (frame): the keyboard focus ring, shown with the `Focus` boolean.
4. `.Icon Functional` (private atom, Size S or M): sizes the icon wrapper for each button size. Do not use it alone.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Type | Variant | **Primary**, Secondary, Tertiary, Plain | `type: 'primary' \| 'secondary' \| 'tertiary' \| 'plain'` (default `'primary'`) | Plain has no padding and no border: 16 x 16px in S, 24 x 24px in M. |
| Tone | Variant | **Default**, Accent, Positive, Negative | `tone: 'default' \| 'accent' \| 'positive' \| 'negative'` (default `'default'`) | Same set in Figma and code. |
| Size | Variant | **S**, M | `size: 's' \| 'm'` (default `'s'`) | |
| Reversed | Variant | True, **False** | `reversed: boolean` (default `false`) | On dark or brand surfaces. |
| State | Variant | **Default**, Hover, Pressed, Disabled | Hover: `:hover`. Pressed: `:active`. Disabled: `disabled: boolean` | Figma names the pressed state `Pressed` here, `Active` on Button. |
| Focus | Boolean | **false** | `:focus-visible` | Not an input: the ring is drawn by CSS on keyboard focus. |
| (none) | | | `ariaLabel: string` (required) | Code only, mandatory: the accessible name of the button. |
| (none) | | | `clicked` (output, `void`) | Emitted on click, Enter and Space, never while disabled. |

Slots: no Figma slot. In code, the default content projection receives the icon (`<ds-icon>`).

Exposed nested instances: `Icon Functional` is exposed, so the glyph is swapped from the Button Icon instance through `🔗 Icon`.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover` (skipped when disabled) | `State=Hover` |
| Pressed | `:active` (skipped when disabled) | `State=Pressed` |
| Focus | `:focus-visible`: 3px outline in the focus color, 2px offset | `Focus=true` |
| Disabled | `disabled` input: `disabled`, `aria-disabled`, `tabindex=-1`, opacity 0.40, no pointer events | `State=Disabled` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container S | width, height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` (32px) |
| Container M | width, height | (none, foundation used directly) | `--foundation-spacing-40` (40px) |
| Container Plain S | width, height | (none, foundation used directly) | `--foundation-spacing-16` (16px) |
| Container Plain M | width, height | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` (24px) |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` (4px) |
| Focus ring | outline color | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` (0.40) |
| Primary Default | background, border (default, hover, active) | `--semantic-color-interactive-background-strong-{default,hover,active}`, `--semantic-color-interactive-border-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Primary | icon color | `--semantic-color-interactive-text-neutral-default` | `--foundation-color-white-1000` |
| Primary Accent | background, border | `--semantic-color-interactive-background-strong-alt-*`, `--semantic-color-interactive-border-strong-alt-*` | `--foundation-color-grey-900` / `-800` / `-700` |
| Primary Positive | background, border | `--semantic-color-interactive-background-strong-positive-*`, `--semantic-color-interactive-border-strong-positive-*` | `--foundation-color-green-500` / `-600` / `-700` |
| Primary Negative | background, border | `--semantic-color-interactive-background-strong-negative-*`, `--semantic-color-interactive-border-strong-negative-*` | `--foundation-color-red-300` / `-400` / `-500` |
| Primary Reversed | background, border | `--semantic-color-interactive-background-neutral-default`, `--semantic-color-interactive-border-neutral-default` | `--foundation-color-white-1000` |
| Secondary Default | background | `--semantic-color-interactive-background-muted-{default,hover,active}` | `--foundation-color-white-1000` / `--foundation-color-blue-a-025` / `-050` |
| Secondary Accent | hover, active background | `--semantic-color-interactive-background-muted-alt-{hover,active}` | `--foundation-color-grey-050` / `-100` |
| Secondary Positive | background | `--semantic-color-interactive-background-light-positive-default` | `--foundation-color-green-050` |
| Secondary Negative | background | `--semantic-color-interactive-background-light-negative-default` | `--foundation-color-red-050` |
| Secondary, Tertiary, Plain | icon color per tone | `--semantic-color-interactive-text-strong-*`, `-strong-alt-*`, `-strong-positive-*`, `-strong-negative-*` | blue-a-500/600/700, grey-900/800/700, green-500/600/700, red-300/400/500 |
| Reversed (all but Primary) | icon color | `--semantic-color-interactive-text-neutral-default` | `--foundation-color-white-1000` |

Values written outside tokens in the SCSS: border width 1px, focus outline width 3px and offset 2px. Size M uses `--foundation-spacing-40` directly (no Semantic token resolves to 40px). Plain S uses `--foundation-spacing-16` directly although `--semantic-measurement-spacing-m` resolves to the same value.

## Accessibility
- Role: `role="button"` on the host, `tabindex="0"` (or -1 when disabled).
- Name: `ariaLabel` is required by the code (`input.required`) and written to `aria-label`. It must describe the action ("Close", "Edit criteria"), not the icon.
- Keyboard: Enter and Space trigger `clicked`.
- Disabled: `disabled` and `aria-disabled="true"`, out of the tab order, no event.
- Focus: 3px ring, `--semantic-color-interactive-border-focus`, offset 2px, on `:focus-visible`.
- Add a Tooltip with the same text as `ariaLabel` when the icon is not obvious to sighted users.

## Content guidelines
- `ariaLabel`: a verb plus the object when the context is not obvious ("Delete rule", "Close panel"). Sentence case, no final punctuation.
- One icon per button, from the `ds-icon` registry. Do not combine an icon with text inside Button Icon.
- No em dash in labels or tooltips.

## Do / Don't
- Do pair an unusual icon with a Tooltip; don't rely on the user guessing its meaning.
- Do use Tertiary or Plain for repeated row actions; don't stack several Primary icon buttons in one row.
- Do use Negative tone for destructive actions only; don't use it to draw attention.

## Related components
Composes: Icon (`ds-icon`, projected content) · Used by: Button Split, Confirm Dialog, Date Range, Drawer, File Upload, Functional Notice, Inline Edit, Modal, More Criteria, Policy Result Card, Popover, Result Card, Search Bar Multi, Search Bar Scoped, Shortcuts Panel, Spotlight, Table, Widget Card.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Current version shown in the Figma header. The Versionning frame is still the empty template. |
