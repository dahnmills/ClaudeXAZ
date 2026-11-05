# Functional Notice
**Status**: Design Ready · Tech In code
An inline message block that stays on the page to inform, warn or report an error about the content around it.
Figma: [Components] Feedback › page Functionnal Notice (node 154:2271) · Storybook: `Design System/Feedback/Functional Notice` (id `design-system-feedback-functional-notice--playground`) · Code: `shared/ui/functional-notice` (`ds-functional-notice`)

## Overview
Functional Notice is placed in the flow of a page, a card or a modal. It has a status (Info, Success, Warning, Error, Default) and three emphasis levels: High (solid color), Medium (tinted with a border) and Low (text and icon only, one line). It can carry a title and a close button. The Figma page shows three placements: "Top fixed", "Inner page" and "Inner block". Embed the Storybook story `Matrix` as the live example, and the Figma component set `Functional Notice` (node 154:2271) as the visual reference. The description text in the Figma header is a placeholder copied from Popover and is not used here.

## When to use / When not to use
- Use to explain a constraint or a consequence before the user acts (this import replaces existing rules).
- Use to report a problem that stays true until it is fixed (data outdated, missing document).
- Use High for page-level messages at the top, Medium inside a page or a modal, Low next to a field or inside a dense block.
- Use `dismissible` when the message is informative and the user may hide it.
- Don't use to confirm an action that just happened → use Toaster or Snackbar instead.
- Don't use for the status of one item → use Badge instead.
- Don't use when the user must answer before going on → use Confirm Dialog (Popin) instead.
- Don't use for an error on one form field → use the field's error state instead.

## Anatomy
1. `Wrapper` (container): row with gap 8px and 4px radius; padding 8px 16px (High, Medium), 4px 0 (Low).
2. `Icon Functional` (exposed): status icon (Figma default `Info Filled`); 20px in High and Medium, 16px in Low (code).
3. Body: `Title` (Body L semi-bold, shown with `Title`) and message (Body L regular), gap 4px. Low never shows a title.
4. `Button Icon` with `Close` glyph: the close button, shown with `Close`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Emphasis | Variant | **High**, Medium, Low | `emphasis: 'high' \| 'medium' \| 'low'` (default `'high'`) | |
| Status | Variant | Default, **Info**, Success, Warning, Error | `status: 'info' \| 'success' \| 'warning' \| 'error' \| 'default'` (default `'info'`) | Figma variants: High and Medium have Info, Success, Warning, Error; Low has Info, Default, Warning, Error. Code styles Low Success too, and Default only in Low. |
| Title | Boolean | **true** | `title: string` (default `''`) | Shown when not empty and emphasis is not Low. |
| Close | Boolean | **true** | `dismissible: boolean` (default `false`) | Defaults differ. Emits `dismissed`; the parent removes the notice. |
| (none) | | | `message: string` (default `''`) | Body text; extra content can be projected. |

Slots: no Figma slot. In code, the default content projection is added under the message (links, lists).

Exposed nested instances: `Icon Functional` (glyph swap). The `Button Icon` is not exposed.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Shown | rendered | default |
| Dismissed | close click emits `dismissed`; the parent hides it | not modeled |
| Close button states | from Button Icon | on Button Icon |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | gap, radius | `--semantic-measurement-spacing-s`, `--semantic-border-radius-s` | `--foundation-spacing-8`, `--foundation-radius-4` |
| High, Medium | padding | `--semantic-measurement-spacing-s` `--semantic-measurement-spacing-m` | `--foundation-spacing-8` / `-16` |
| Low | padding | `--semantic-measurement-spacing-xs` 0 | `--foundation-spacing-4` |
| Body | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Title, message | font | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l`, `--semantic-font-text-style-font-weight-semi-bold` / `-regular` | `--foundation-font-size-16`, `--foundation-font-line-height-24`, `--foundation-font-weight-semi-bold` / `-regular` |
| High | text, icon | `--semantic-color-static-text-subtle-primary` | `--foundation-color-white-1000` |
| High Info / Warning | background | `--semantic-color-static-background-functional-informative` / `-warning` | `--foundation-color-blue-b-500` / `--foundation-color-orange-400` |
| High Success / Error | background | `--semantic-color-interactive-background-strong-positive-default` / `-negative-default` | `--foundation-color-green-500` / `--foundation-color-red-300` |
| Medium (per status) | background, border, text and icon | `--semantic-color-static-background-subtle-functional-*`, `--semantic-color-static-border-main-functional-*`, `--semantic-color-static-text-main-functional-*` | Info: blue-b-050 / blue-b-500; Success: green-050 / green-500; Warning: orange-050 / orange-400; Error: red-050 / red-500 |
| Low (per status) | text and icon | `--semantic-color-static-text-main-functional-{informative,positive,warning,negative}` | blue-b-500, green-500, orange-400, red-500 |
| Low Default | text and icon | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |

Values written outside tokens in the SCSS: Medium border 1px. High Success and Error use Interactive tokens (strong positive and negative), while High Info and Warning use Static functional tokens; High Error is red-300, Medium Error is red-500.

## Accessibility
- The notice has no ARIA role in code. For a message that appears after load (an error), wrap it in a live region or add `role="alert"` (error) or `role="status"` (info) in the parent.
- The status is carried by an icon and text, not by color alone.
- The close button has `ariaLabel="Dismiss"`. In code it is given `icon="close"`, but `ds-button-icon` has no `icon` input (it expects a projected `ds-icon`), so the close button renders without a visible glyph.
- High Warning (white text on orange-400) is low contrast; check it against WCAG AA before using it for long text.

## Content guidelines
- Title: optional, a few words that name the issue ("Outdated data").
- Message: one or two sentences that say what is true and what to do. Low: one line only.
- Sentence case. No em dash.

## Do / Don't
- Do use one notice per issue near the content it concerns; don't stack several notices at the top of a page.
- Do use High for page-level and Medium for in-content messages; don't use High inside a small card.
- Do tell the user what to do next; don't only describe the problem.

## Related components
Composes: Icon (`ds-icon`), Button Icon (`ds-button-icon`, close) · Used by: app pages and modals (TAG Configuration modals, Portfolio Management upload modal, Card Builder lab).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
