# Badge
**Status**: Design WIP · Tech In code
A small pill that gives a short status message with a color and, optionally, an icon.
Figma: [Components] Feedback › page Badge (node 141:98) · Storybook: `Design System/Feedback/Badge` (id `design-system-feedback-badge--default`) · Code: `shared/ui/badge` (`ds-badge`)

## Overview
Figma description: "a small element that allow you to transmit a short message with a status." Badge shows the state of an object (accepted, pending, refused, draft) in five statuses and two styles: Light (tinted background, colored text) and Strong (solid background, white text). It is read-only. Embed the Storybook story `LightStatuses` as the live example, and the Figma component set `Badge` (node 141:98) as the visual reference.

## When to use / When not to use
- Use to show the status of an item in a table, a card or a header (Accepted, Refused, Pending).
- Use Light in dense lists and tables; use Strong when the status must stand out (one per area).
- Use with an icon when the status must read without color (grayscale, color blindness).
- Use Neutral for a status that carries no judgment (Draft, Archived).
- Don't use for a clickable filter or value → use Tag or Chip instead.
- Don't use for a count on a tab or an icon → use Badge (counter) instead.
- Don't use for a message that needs a sentence → use Functional Notice instead.
- Don't use for a temporary confirmation after an action → use Toaster or Snackbar instead.

## Anatomy
1. `Badge` (container): pill with a round radius, padding 0 8px. 20px high in S, 24px in M (code).
2. `.Badge` (private atom, `Size` S or M): wraps the badge for each size.
3. `.Content Properties` (private atom, exposed, one set per size): an optional `Icon Functional` (glyph swapped through `🔗 Icon`, default `Move`) and the `Label`, gap 2px. Its `Icon` and `Label` properties show or hide each part.
4. Label: 14px regular, line-height 20px, letter-spacing 0.2px (code, both sizes).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Status | Variant | Error, **Info**, Neutral, Success, Warning | `status: 'info' \| 'warning' \| 'success' \| 'error' \| 'neutral'` (default `'info'`) | |
| Style | Variant | **Light**, Strong | `variant: 'light' \| 'strong'` (default `'light'`) | Figma `Style` is named `variant` in code. |
| Size | Variant | S, **M** | `size: 's' \| 'm'` (default `'s'`) | Defaults differ: M in Figma, S in code. |
| `.Content Properties` › Icon | Variant (exposed) | True, **False** | `[slot=icon]` content | |
| `.Content Properties` › Label | Variant (exposed) | **True**, False | `label: string` (required) | Code always renders the label; an icon-only badge (`Label=False`) has no code equivalent. |

Slots: no Figma slot. In code, `[slot=icon]` takes a `ds-icon`.

Exposed nested instances: `.Content Properties` (properties `Icon`, `Label`; glyph through `🔗 Icon`).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Badge is static, no interactive state | default |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | radius | `--semantic-border-radius-round` | `--foundation-radius-100` |
| Container | horizontal padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Content | gap | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` |
| Label | font | `--semantic-font-family`, `--semantic-font-text-style-size-m`, `--semantic-font-text-style-font-weight-regular`, `--semantic-font-text-style-line-height-m`, `--semantic-font-text-style-letter-spacing-s` | `--foundation-font-family`, `--foundation-font-size-14`, `--foundation-font-weight-regular`, `--foundation-font-line-height-20`, `--foundation-font-letter-spacing-0-2` |
| Light Info | background / text, icon | `--semantic-color-static-background-subtle-functional-informative` / `--semantic-color-static-text-main-functional-informative`, `--semantic-color-static-icon-main-functional-informative` | `--foundation-color-blue-b-050` / `--foundation-color-blue-b-500` |
| Light Warning | background / text, icon | `--semantic-color-static-background-subtle-functional-warning` / `--semantic-color-static-text-main-functional-warning`, `--semantic-color-static-icon-main-functional-warning` | `--foundation-color-orange-050` / `--foundation-color-orange-400` |
| Light Success | background / text, icon | `--semantic-color-static-background-subtle-functional-positive` / `--semantic-color-static-text-main-functional-positive`, `--semantic-color-static-icon-main-functional-positive` | `--foundation-color-green-050` / `--foundation-color-green-500` |
| Light Error | background / text, icon | `--semantic-color-static-background-subtle-functional-negative` / `--semantic-color-static-text-main-functional-negative`, `--semantic-color-static-icon-main-functional-negative` | `--foundation-color-red-050` / `--foundation-color-red-500` |
| Light Neutral | background / text, icon | `--semantic-color-static-background-accent-tertiary` / `--semantic-color-static-text-main-primary`, `--semantic-color-static-icon-main-primary` | `--foundation-color-grey-200` / `--foundation-color-grey-900` |
| Strong (all) | text, icon | `--semantic-color-static-text-subtle-primary`, `--semantic-color-static-icon-subtle-primary` | `--foundation-color-white-1000` |
| Strong Info / Warning / Success / Error | background | `--semantic-color-static-background-functional-{informative,warning,positive,negative}` | `--foundation-color-blue-b-500`, `--foundation-color-orange-400`, `--foundation-color-green-500`, `--foundation-color-red-500` |
| Strong Neutral | background | `--semantic-color-static-background-accent-primary` | `--foundation-color-grey-900` |

Values written outside tokens in the SCSS: heights 20px (S) and 24px (M).

## Accessibility
- The host has `role="status"` and `aria-label` set to the label. Note that `role="status"` is a live region: many badges on one page can create noisy announcements when they change.
- The label is always present, so the status never relies on color alone. Add an icon for critical statuses.
- Light Warning text (`orange-400` on `orange-050`) is low contrast; check it against WCAG AA (4.5:1) before using it for essential text, or use Strong.

## Content guidelines
- Figma rules: "Use short messages inside the tag", "Do not use full sentences".
- One or two words: "Accepted", "Pending review".
- Sentence case, no final punctuation, no em dash.
- Use the same word for the same status across the product.

## Do / Don't
- Do keep the label to one or two words; don't write a sentence in a badge.
- Do use the status color that matches the meaning; don't use Error for an attention-only message (use Warning).
- Do use Neutral for states without judgment; don't use Info as a default decoration.

## Related components
Composes: Icon (`ds-icon`, optional) · Used by: Checkbox Card, Filter Drawer, List Widget, Newsfeed, Page Title, Policy Result Card, Radio Card, Search Bar, Topbox.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | May 28, 2024 | Adding new size, now have S and M. |
| 2.0.0 | May 28, 2024 | Refacto. Conditional properties: rework of the component so we can use conditional atoms. |
