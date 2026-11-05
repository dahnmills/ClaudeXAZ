# Toaster
**Status**: Design Ready · Tech In code
A temporary message in the bottom right corner that confirms the result of an action or reports a problem.
Figma: [Components] Feedback › page Toaster (node 125:1116) · Storybook: `Design System/Feedback/Toaster` (id `design-system-feedback-toaster--playground`) · Code: `shared/ui/toaster` (`ds-toaster-container` + `ToasterService`)

## Overview
A toast appears after an action (saved, exported, failed), stays a few seconds with a loader bar that counts down, then disappears. It can hold a title, a text and one action. In code, toasts are raised with `ToasterService.show()` and rendered by one `ds-toaster-container` placed once in the app shell. Embed the Storybook story `Playground` as the live example, and the Figma component set `Toaster` (node 125:1116) as the visual reference. The description text in the Figma header is a placeholder copied from Checkbox and is not used here.

## When to use / When not to use
- Use to confirm an action that the user just did and that has no visible result on screen (Exported, Rule duplicated).
- Use to report a failure of a background action, with a retry action when it helps.
- Use the action to offer a quick follow-up (Undo, View).
- Don't use for a short confirmation without status color → use Snackbar instead.
- Don't use for a message that must stay until the user acts → use Functional Notice or Confirm Dialog (Popin) instead.
- Don't use for an error on a form field → show the error on the field instead.
- Don't use for a status of an item → use Badge instead.

## Anatomy
1. `Toaster` (card): 352px wide, padding 16px 24px, gap 16px, 4px radius, 1px functional border, subtle functional background, flyout shadow.
2. `Icon` (`Icon Functional`, 24px): status icon (Figma default `Success Filled`; code `check-circle`, `info-circle`, `warning-triangle`, `error-circle`).
3. `Content` (frame): optional title (Body L semi-bold), text (Body L regular) and optional action.
4. Action: a `Button` instance in Figma (with its `.Content` exposed); a semi-bold `ds-link` in code, aligned to the right.
5. `Loader` (frame): 4px bar at the bottom in the status color, shown with `Loading`, that shrinks over the toast duration.
6. Container (code): `ds-toaster-container`, fixed 24px from the bottom and right, stacks toasts upward with a gap of 8px.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Status | Variant | **Success**, Info, Warning, Error | `show(text, { tone })`, `tone: 'success' \| 'info' \| 'warning' \| 'error'` (default `'info'`) | Defaults differ: Success in Figma, info in code. |
| Title | Boolean | **true** | `show(text, { title })` | Title shown only when given. |
| Action | Boolean | **true** | `show(text, { actionLabel }, onAction)` | Clicking the action runs the callback and dismisses the toast. |
| Loading | Boolean | **true** | `show(text, { duration })` (default `5000` ms) | The loader bar is shown when `duration > 0`; `duration: 0` keeps the toast until `dismiss()`. |
| (none) | | | `show()` returns an id; `dismiss(id)`, `clear()` | Service API. |

Slots: none.

Exposed nested instances: `.Content` of the action `Button` (icon position and label).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Entering | 220ms slide and fade from the right | not modeled |
| Counting down | loader bar animation over `duration` | `Loading=true` |
| Dismissed | timer end, action click, `dismiss()` or `clear()` | not modeled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | offset, gap | `--semantic-measurement-spacing-l`, `--semantic-measurement-spacing-s` | `--foundation-spacing-24`, `--foundation-spacing-8` |
| Card | gap, padding | `--semantic-measurement-spacing-m`, `--semantic-measurement-spacing-l` | `--foundation-spacing-16`, `--foundation-spacing-24` |
| Card | radius, border width | `--semantic-border-radius-s`, `--semantic-border-size-s` | `--foundation-radius-4`, `--foundation-sizing-1` |
| Card | shadow | `--semantic-shadow-flyout` | `--foundation-shadow-bottom-400` |
| Card (base) | background, border, text | `--semantic-color-static-background-main-primary`, `--semantic-color-static-border-subtle-tertiary`, `--semantic-color-static-text-main-primary` | `--foundation-color-white-1000`, `--foundation-color-grey-200`, `--foundation-color-grey-900` |
| Success | background / border, icon, loader | `--semantic-color-static-background-subtle-functional-positive` / `--semantic-color-static-border-main-functional-positive`, `--semantic-color-static-background-functional-positive` | `--foundation-color-green-050` / `--foundation-color-green-500` |
| Info | background / border, icon, loader | `--semantic-color-static-background-subtle-functional-informative` / `--semantic-color-static-border-main-functional-informative`, `--semantic-color-static-background-functional-informative` | `--foundation-color-blue-b-050` / `--foundation-color-blue-b-500` |
| Warning | background / border, icon, loader | `--semantic-color-static-background-subtle-functional-warning` / `--semantic-color-static-border-main-functional-warning`, `--semantic-color-static-background-functional-warning` | `--foundation-color-orange-050` / `--foundation-color-orange-400` |
| Error | background / border, icon, loader | `--semantic-color-static-background-subtle-functional-negative` / `--semantic-color-static-border-main-functional-negative`, `--semantic-color-static-background-functional-negative` | `--foundation-color-red-050` / `--foundation-color-red-500` |
| Title, text | font | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l`, `--semantic-font-text-style-font-weight-semi-bold` / `-regular` | `--foundation-font-size-16`, `--foundation-font-line-height-24`, `--foundation-font-weight-semi-bold` / `-regular` |
| Action | margin-top | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` |
| Loader | height | `--semantic-measurement-sizing-xs` | `--foundation-sizing-4` |

Values written outside tokens in the SCSS: toast width 352px (declared once as `$toast-width`), z-index 2000, entrance animation 220ms and 16px slide.

## Accessibility
- The container has `aria-live="polite"`; each toast has `role="status"`, so new toasts are announced without moving focus.
- Toasts disappear after 5 seconds by default. Users who need more time cannot pause them (no hover pause in code); use `duration: 0` for messages that carry an action the user must not miss.
- There is no close button; a toast with `duration: 0` must be dismissed by its action or by the app.
- The status icon is paired with text; do not rely on the color alone.

## Content guidelines
- Title: optional, two to four words ("Rule duplicated").
- Text: one short sentence that says what happened and, for errors, what to do next.
- Action label: one verb ("Undo", "Retry", "View").
- Sentence case. No em dash.

## Do / Don't
- Do use a toast for the result of the action the user just did; don't use it for unrelated system news.
- Do keep errors with a way out (Retry, a link); don't show an error toast with no next step.
- Do show one toast per action; don't stack several toasts for one event.

## Related components
Composes: Icon (`ds-icon`), Link (`ds-link`) in code; Button (action) and Icon Functional in Figma · Used by: app pages through `ToasterService`.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
