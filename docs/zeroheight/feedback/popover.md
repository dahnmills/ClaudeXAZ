# Popover
**Status**: Design Ready · Tech In code
A floating panel anchored to an element that shows contextual content, with an optional title, illustration and actions.
Figma: [Components] Feedback › page Popover (node 121:12614) · Storybook: `Design System/Feedback/Popover` (id `design-system-feedback-popover--playground`) · Code: `shared/ui/popover` (`ds-popover`)

## Overview
Figma description: "Popovers display contextual content or actions in an overlay panel triggered by user interaction, such as clicking or tapping an element. They are ideal for providing additional information, detailed descriptions, or quick-access options without navigating away from the current page. Popovers can be dismissed easily, ensuring a smooth and uninterrupted user experience." In code, `ds-popover` draws the panel and its arrow; opening, placement next to the trigger and closing are handled by the parent. Embed the Storybook story `Playground` as the live example, and the Figma component set `Popover` (node 121:12614) as the visual reference.

## When to use / When not to use
- Use to show more detail about an element on click, without leaving the page (definition of a score, survey invite).
- Use with one or two actions when the content leads to a choice (Answer the survey, Later).
- Use Reversed (dark) to stand out from a light page, for example for onboarding hints.
- Don't use for a short label on hover → use Tooltip instead.
- Don't use for a list of actions → use Flyout Menu instead.
- Don't use for a task that needs a form or a decision that blocks → use Modal or Confirm Dialog (Popin) instead.
- Don't use for a page-level message → use Functional Notice instead.

## Anatomy
1. `Indicator` (frame): the arrow that points to the trigger (6px in code), placed by `Position`.
2. `Wrapper` (panel): white plate, 1px subtle border, 8px radius, padding 16px, gap 8px, popover shadow. 240px to 400px wide in code.
3. `Illustration` (frame, shown with `Illustration`): an image at the top (Figma example from undraw).
4. `Content Wrapper` › `Content`: the title (Body L semi-bold) and the text (Body L regular, Grey/700). Figma example: "Help us improve Qirin !".
5. `Button Icon` with `Close` glyph: the close button (code: shown when `dismissible`).
6. `.Action` (private atom, exposed, shown with `Actions`): two `Button` instances; the second one is shown with `Secondary Action`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Position | Variant | **Top Left**, Top Center, Top Right, Bottom Left, Bottom Center, Bottom Right, Right Top, Right Center, Right Bottom, Left Top, Left Center, Left Bottom | `position: 'top-left' \| … \| 'left-bottom'` (12 values, default `'bottom-left'`) | Same 12 positions; defaults differ (Top Left in Figma). The position only places the arrow; the parent places the panel. |
| Reversed | Variant | **False**, True | `reversed: boolean` (default `false`) | Dark panel (Grey/900). |
| Actions | Boolean | **true** | `[slot=actions]` content | |
| `.Action` › Secondary Action | Boolean (exposed) | **true** | content of `[slot=actions]` | |
| Illustration | Boolean | **false** | none | Code gap: no illustration slot; project it in the default content if needed. |
| (none) | | | `title: string` (default `''`) | |
| (none) | | | `dismissible: boolean` (default `true`) | Shows the close button; emits `closed`. Figma has no boolean for it. |

Slots: no Figma slot. In code: default projection for the body, `[slot=actions]` for buttons.

Exposed nested instances: `.Action` (property `Secondary Action`) and the `.Content` of its two Buttons; `Icon Functional` of the close button.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Open | rendered by the parent | the component |
| Closed | close click emits `closed`; the parent removes it | not modeled |
| Reversed | `reversed` input | `Reversed=True` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Panel | gap, padding | `--semantic-measurement-spacing-s`, `--semantic-measurement-spacing-m` | `--foundation-spacing-8`, `--foundation-spacing-16` |
| Panel | radius, shadow | `--semantic-border-radius-m`, `--semantic-shadow-popover` | `--foundation-radius-8`, `--foundation-shadow-bottom-300` |
| Panel | background, border, text | `--semantic-color-static-background-main-primary`, `--semantic-color-static-border-subtle-tertiary`, `--semantic-color-static-text-main-primary` | `--foundation-color-white-1000`, `--foundation-color-grey-200`, `--foundation-color-grey-900` |
| Panel (Reversed) | background, text | `--semantic-color-static-background-accent-primary`, `--semantic-color-static-text-subtle-primary` | `--foundation-color-grey-900`, `--foundation-color-white-1000` |
| Header | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Title | font | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-font-weight-semi-bold`, `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16`, `--foundation-font-weight-semi-bold`, `--foundation-font-line-height-24` |
| Content | color (default / Reversed) | `--semantic-color-static-text-main-secondary` / `--semantic-color-static-text-subtle-secondary` | `--foundation-color-grey-700` / `--foundation-color-grey-050` |
| Arrow | color, offset | `--semantic-color-static-background-main-primary`, (none, foundation used directly) | `--foundation-color-white-1000`, `--foundation-spacing-16` |

Values written outside tokens in the SCSS: min-width 240px, max-width 400px, border 1px, arrow 6px. The arrow stays white in Reversed (no Reversed arrow color).

## Accessibility
- The popover has no ARIA role, does not move focus and does not trap it; Escape does not close it. If it holds actions, give it `role="dialog"` with a label, move focus into it and return focus to the trigger on close (see `dsFocusTrap`).
- The trigger should expose `aria-expanded` and `aria-controls`.
- The close button has `ariaLabel="Close"`. In code it is given `icon="close"`, but `ds-button-icon` has no `icon` input, so the close button renders without a visible glyph.

## Content guidelines
- Title: short, names the topic.
- Text: two or three sentences at most.
- Actions: one main action (verb) and an optional secondary one ("Later").
- Sentence case. No em dash.

## Do / Don't
- Do open a popover on click; don't open it on hover (use Tooltip).
- Do keep one popover open at a time; don't chain popovers.
- Do give the user a way to close it; don't leave a popover that only closes by reloading.

## Related components
Composes: Button Icon (`ds-button-icon`, close) in code; Button (`.Action`) and Button Icon in Figma · Used by: no other DS component.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
