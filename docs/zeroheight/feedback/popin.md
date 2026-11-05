# Popin
**Status**: Design Ready · Tech In code
A small modal dialog that asks the user to confirm, cancel or choose before an action goes on.
Figma: [Components] Feedback › page Popin (node 63:807) · Storybook: `Design System/Feedback/Popin` (id `design-system-feedback-popin--warning`) · Code: `shared/ui/confirm-dialog` (`ds-confirm-dialog`)

## Overview
Popin interrupts the flow with a 480px box on a dark backdrop: a status icon, a title, a short text and a footer with buttons. It is used before destructive or irreversible actions, and when leaving a page with unsaved work. In code it is `ds-confirm-dialog`, which carries `dsFocusTrap`. Embed the Storybook story `Danger` as the live example, and the Figma component `Popin` (node 63:807, a full 1280 x 800 frame with backdrop) as the visual reference. The description text in the Figma header is a placeholder copied from Checkbox and is not used here.

## When to use / When not to use
- Use before a destructive or irreversible action (Delete this rule?).
- Use when the user leaves a flow with unsaved changes, with a third choice (Discard, Save) through `secondaryLabel`.
- Use the info tone for an important message the user must acknowledge.
- Don't use for a task with a form or several steps → use Modal or Drawer instead.
- Don't use to confirm that an action succeeded → use Toaster or Snackbar instead.
- Don't use for information the user can read later → use Functional Notice instead.
- Don't use for contextual help next to an element → use Popover instead.

## Anatomy
1. `Popin` (Figma frame): the screen with the backdrop. Code: fixed full-screen host, backdrop `rgba(0, 0, 0, 0.35)`.
2. `.Spec` (private atom, exposed): the 480px box, white, 4px radius, modal shadow.
3. `Container`: title row and text, padding 24px 24px 0.
4. `.Icon` (private atom, exposed, `Type` Info, Success, Error, Warning): the status icon in a round tinted plate (padding 8px), glyph through `Icon Functional` (Figma default `Exclamation Triangle Outline`).
5. Title: 24px / 32px bold, letter-spacing 0.2px (code).
6. `.Content` (private atom, exposed, `Text` and `Slot` booleans, with a `Slot`): the text and an optional slot, indented 48px under the title in code.
7. `Button Icon` with `Close`: close button at the top right (16px from the edges).
8. `Footer`: grey band, padding 16px, gap 16px, with `Button` instances. In code: Cancel (Tertiary, Accent), optional secondary (Secondary), Confirm (Primary), each taking an equal width.
9. Deprecated: an older `.Spec` set (node 62:709, `Type` Slot, Warning, Information, Success, Error) and `.Icon` (node 301:1279) remain on the page under "Deprecated".

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| `.Icon` › Type | Variant (exposed) | Info, Success, Error, **Warning** | `tone: 'warning' \| 'danger' \| 'info'` (default `'warning'`) | Figma Error maps to code `danger`. Figma Success has no code tone. Code `danger` uses the same triangle glyph as `warning`. |
| `.Content` › Text | Variant (exposed) | **True**, False | default content projection | |
| `.Content` › Slot | Variant (exposed) | **True**, False | default content projection | Figma `Slot` for custom content. |
| (none) | | | `open: boolean` (default `false`) | Shows or hides the dialog. |
| (none) | | | `title: string` (required) | |
| (none) | | | `confirmLabel` (default `'Confirm'`), `cancelLabel` (default `'Cancel'`), `secondaryLabel` (default `''`) | Footer button labels; the secondary button shows only when labeled. |
| (none) | | | outputs `confirmed`, `cancelled`, `secondary`, `closed` | `closed` follows each of the others. |

Slots: Figma `.Content` has a `Slot`. In code, the default content projection fills the text area.

Exposed nested instances: `.Spec`, `.Icon` (`Type`), `.Content` (`Text`, `Slot`), `Icon Functional` (glyph).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Closed | `open=false`, `aria-hidden="true"` | not modeled |
| Open | `open=true`: backdrop, focus trapped in the box | the component |
| Cancelled | Cancel, close button, backdrop click or Escape | not modeled |
| Confirmed / Secondary | footer buttons | not modeled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Backdrop | background, padding | `--semantic-color-overlay-backdrop`, `--semantic-measurement-spacing-l` | raw value `rgba(0, 0, 0, 0.35)` (no Foundation alias), `--foundation-spacing-24` |
| Box | gap, background, radius, shadow | `--semantic-measurement-spacing-m`, `--semantic-color-static-background-main-primary`, `--semantic-border-radius-s`, `--semantic-shadow-modal` | `--foundation-spacing-16`, `--foundation-color-white-1000`, `--foundation-radius-4`, `--foundation-shadow-bottom-500` |
| Container | gap, padding | `--semantic-measurement-spacing-xxs`, `--semantic-measurement-spacing-l` | `--foundation-spacing-2`, `--foundation-spacing-24` |
| Title row | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Icon plate | padding, radius | `--semantic-measurement-spacing-s`, `--semantic-border-radius-round` | `--foundation-spacing-8`, `--foundation-radius-100` |
| Icon warning / danger / info | plate, glyph | `--semantic-color-static-background-subtle-functional-{warning,negative,informative}`, `--semantic-color-static-background-functional-{warning,negative,informative}` | orange-050 / orange-400, red-050 / red-500, blue-b-050 / blue-b-500 |
| Title | weight, color | `--semantic-font-text-style-font-weight-bold`, `--semantic-color-static-text-main-primary` | `--foundation-font-weight-bold`, `--foundation-color-grey-900` |
| Text | font, gap | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l`, `--semantic-font-text-style-font-weight-regular`, `--semantic-measurement-spacing-s` | `--foundation-font-size-16`, `--foundation-font-line-height-24`, `--foundation-font-weight-regular`, `--foundation-spacing-8` |
| Close | offset | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Footer | gap, padding, background | `--semantic-measurement-spacing-m`, `--semantic-color-static-background-main-secondary` | `--foundation-spacing-16`, `--foundation-color-grey-050` |

Values written outside tokens in the SCSS: box width 480px, title 24px / 32px and letter-spacing 0.2px, text indent 48px, z-index 1100. `--semantic-color-overlay-backdrop` is defined as a raw value instead of an alias to Foundation.

## Accessibility
- `role="alertdialog"` with `aria-modal="true"` and `aria-label` set to the title. The role is set twice (on the host and on the box).
- `dsFocusTrap`: focus moves into the box on open, Tab loops inside, focus returns to the trigger on close.
- Escape and the backdrop cancel the dialog. The close button has `ariaLabel="Close"`.
- The tone icon is paired with the title; the decision is carried by the button labels.

## Content guidelines
- Title: a question or a short statement of the consequence ("Delete this rule?").
- Text: one or two sentences that say what will happen and whether it can be undone.
- Buttons: verbs that name the outcome ("Delete", "Discard changes"), not "Yes" or "OK". Cancel stays "Cancel".
- Sentence case. No em dash. In English, no space before the question mark (the Storybook example "Delete this item ?" has one).

## Do / Don't
- Do name the action on the confirm button; don't write "Confirm" for a delete.
- Do keep the text short; don't use a Popin for long reading.
- Do use `secondaryLabel` when there are two valid exits; don't make Cancel mean "discard".

## Related components
Composes: Button (`ds-button`), Button Icon (`ds-button-icon`), Icon (`ds-icon`), Focus Trap (`dsFocusTrap`) · Used by: app pages (Admin Data, Search, Portfolio Management modals, TAG Configuration, Company Creation Wizard). Layout library: Modal for larger tasks.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
