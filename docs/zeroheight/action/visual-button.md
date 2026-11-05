# Visual Button
**Status**: Design Ready · Tech In code
A large clickable card with an icon, a title and a short description, used to start one of a few distinct paths.
Figma: [Components] Action › page Visual Button (node 296:4137) · Storybook: `Design System/Action/Visual Button` (id `design-system-action-visual-button--default`) · Code: `shared/ui/visual-button` (`ds-visual-button`)

## Overview
Visual Button gives each option of a choice a large target with an illustration icon and a sub label, so the user can compare options before clicking. It typically appears in a "what do you want to create" modal. Embed the Storybook story `Group` as the live example, and the Figma component set `Visual Button` (node 296:4137) as the visual reference. The description text in the Figma header is a placeholder copied from Radio and is not used here.

## When to use / When not to use
- Use when the user picks one of two to four distinct paths at the start of a flow (new set from scratch, from a template).
- Use when each option needs a short explanation to be chosen well.
- Use in a modal or an empty state where space allows large targets.
- Don't use for a regular action in a toolbar or a form → use Button instead.
- Don't use for a selectable option inside a form that stays on screen → use Radio Card or Checkbox Card instead.
- Don't use for a compact icon choice → use Tile instead.

## Anatomy
1. `Visual Button` (container): white card, 1px subtle border, 8px radius, padding 24px, gap 16px. 240px wide in code (160px in Figma).
2. Icon (`Upload Document` instance in Figma, shown with `Icon`): 48 x 48px plate on light blue with a blue icon. In code, `[slot=icon]`.
3. `Frame 4` (content): the title (Body L semi-bold) and the sub label (Body M regular, Grey/700), gap 2px. The sub label is shown with `Sub Label`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Disabled | Hover: `:hover`. Disabled: `disabled: boolean` | No `:active` style in the SCSS. |
| Icon | Boolean | **true** | `[slot=icon]` content | The icon plate is always rendered in code. |
| Sub Label | Boolean | **true** | `description: string` (default `''`) | The description shows only when not empty. |
| (none) | | | `title: string` (required) | Title text. |
| (none) | | | `selected: boolean` (default `false`) | Code only: blue border and informative background. No Figma variant. |
| (none) | | | `tone: 'default' \| 'accent'` (default `'default'`) | Code only; adds a class but no style is defined for it. |
| (none) | | | `clicked` (output) | Click, Enter, Space. |

Slots: no Figma slot. In code, `[slot=icon]` takes a `ds-icon`.

Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover`: blue border and card shadow | `State=Hover` |
| Active | no specific style | `State=Active` |
| Focus | `:focus-visible`: 3px outline, 2px offset | no variant |
| Selected | `selected` input | not modeled |
| Disabled | `disabled` input: `disabled`, `aria-disabled`, `tabindex=-1`, opacity 0.40 | `State=Disabled` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | gap, padding | `--semantic-measurement-spacing-m`, `--semantic-measurement-spacing-l` | `--foundation-spacing-16`, `--foundation-spacing-24` |
| Container | border, radius, background | `--semantic-color-static-border-subtle-tertiary`, `--semantic-border-radius-m`, `--semantic-color-static-background-main-primary` | `--foundation-color-grey-200`, `--foundation-radius-8`, `--foundation-color-white-1000` |
| Container hover | border, shadow | `--semantic-color-interactive-border-strong-default`, `--semantic-shadow-card` | `--foundation-color-blue-a-500`, `--foundation-shadow-bottom-100` |
| Container selected | background, border | `--semantic-color-static-background-subtle-informative`, `--semantic-color-interactive-border-strong-default` | not defined in `_semantic.scss`, `--foundation-color-blue-a-500` |
| Icon plate | radius, background, icon color | `--semantic-border-radius-s`, `--semantic-color-static-background-main-alt-primary`, `--semantic-color-interactive-text-strong-default` | `--foundation-radius-4`, `--foundation-color-blue-a-025`, `--foundation-color-blue-a-500` |
| Content | gap | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` |
| Title | font, color | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l`, `--semantic-font-text-style-font-weight-semi-bold`, `--semantic-color-static-text-main-primary` | `--foundation-font-size-16`, `--foundation-font-line-height-24`, `--foundation-font-weight-semi-bold`, `--foundation-color-grey-900` |
| Description | font, color | `--semantic-font-text-style-size-m`, `--semantic-font-text-style-line-height-m`, `--semantic-font-text-style-font-weight-regular`, `--semantic-color-static-text-main-secondary` | `--foundation-font-size-14`, `--foundation-font-line-height-20`, `--foundation-font-weight-regular`, `--foundation-color-grey-700` |
| Focus ring | outline color | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

Values written outside tokens in the SCSS: width 240px, border 1px, icon plate 48 x 48px, focus outline 3px and offset 2px.

## Accessibility
- `role="button"`, in the tab order; Enter and Space emit `clicked`.
- The accessible name is the whole content (title and description); keep the title first and short.
- Disabled: `disabled`, `aria-disabled="true"`, out of the tab order.
- `selected` is visual only (no `aria-pressed`); if the choice persists on screen, use Radio Card instead.

## Content guidelines
- Title: the name of the path, two to four words ("Buyer profile").
- Description: one short sentence that says what happens ("Create a new buyer entity from scratch.").
- Sentence case. No em dash.

## Do / Don't
- Do offer two to four Visual Buttons side by side; don't build a long grid of them.
- Do write a description that helps the user choose; don't repeat the title in it.

## Related components
Composes: Icon (`ds-icon` in the icon slot) · Used by: TAG Configuration new set choice modal (app page), no other DS component.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
