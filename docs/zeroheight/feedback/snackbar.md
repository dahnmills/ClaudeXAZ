# Snackbar
**Status**: Design Ready · Tech In code
A short, dark message at the bottom center of the screen that confirms a small action for two seconds.
Figma: [Components] Feedback › page Snackbar (node 124:34846) · Storybook: `Design System/Feedback/Snackbar` (id `design-system-feedback-snackbar--default`) · Code: `shared/ui/snackbar` (`ds-snackbar` + `SnackbarService`)

## Overview
Snackbar is lighter than a Toaster: one line of text on a dark plate, an optional icon and an optional link. It confirms quick, low-stakes actions (Copied, Saved) and goes away on its own. In code, `SnackbarService.show()` mounts one snackbar on the page body and replaces any snackbar already shown. Embed the Storybook story `Default` as the live example, and the Figma component `Snackbar` (node 124:34846) as the visual reference.

## When to use / When not to use
- Use to confirm a quick action whose result is obvious (Copied to clipboard, Added to favorites).
- Use the success or error tone when the outcome must read at a glance.
- Use the link to offer one follow-up (Undo, View).
- Don't use for a message with a title or a longer text → use Toaster instead.
- Don't use for information that must stay on screen → use Functional Notice instead.
- Don't use when the user must decide something → use Confirm Dialog (Popin) instead.

## Anatomy
1. `Snackbar` (plate): dark plate (Grey/900), 4px radius, padding 8px 16px, gap 8px, flyout shadow. 300 x 40px in Figma. In code fixed at the bottom center, 24px from the bottom.
2. `Frame 248`: the icon (`Icon Functional`, glyph `Check` in Figma, 16px `ds-icon` in code) and the text (Body L regular, white).
3. `Link` (exposed `.Specs`): the optional action. In code a `[slot=action]` content.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| (none) | | | `text: string` (required) | The message. |
| (none) | | | `tone: 'neutral' \| 'success' \| 'error'` (default `'neutral'`) | Code only: Figma has one dark version. |
| (none) | | | `icon: string \| null` (default `null`) | Figma shows a `Check` icon by default. |
| (none) | | | `SnackbarService.show(text, { tone, icon, duration })` (default `duration` 2000 ms), `dismiss()` | Only one snackbar at a time. |

Slots: no Figma slot. In code, `[slot=action]` takes a link or a button. The service cannot fill this slot: a snackbar raised with `SnackbarService.show()` has no action.

Exposed nested instances: `.Specs` of the `Link` (label, icon, weight, decoration).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Entering | 160ms fade and 8px rise | not modeled |
| Shown | until `duration` ends or `dismiss()` | the component |
| Success, Error | `tone` input | not modeled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Plate | gap, padding | `--semantic-measurement-spacing-s`, `--semantic-measurement-spacing-m` | `--foundation-spacing-8`, `--foundation-spacing-16` |
| Plate | radius, shadow | `--semantic-border-radius-s`, `--semantic-shadow-flyout` | `--foundation-radius-4`, `--foundation-shadow-bottom-400` |
| Plate neutral / success / error | background | `--semantic-color-static-background-accent-primary` / `--semantic-color-static-background-functional-positive` / `--semantic-color-static-background-functional-negative` | `--foundation-color-grey-900` / `--foundation-color-green-500` / `--foundation-color-red-500` |
| Text | color | `--semantic-color-static-text-subtle-primary` | `--foundation-color-white-1000` |
| Text | font | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-font-weight-regular`, `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16`, `--foundation-font-weight-regular`, `--foundation-font-line-height-24` |

Values written outside tokens in the SCSS: bottom offset 24px, z-index 10001, entrance 160ms and 8px. The component uses `ViewEncapsulation.None`.

## Accessibility
- The host has `role="status"`, so the message is announced politely.
- Two seconds is short for reading and for reaching the link with a keyboard; do not put an essential action in a snackbar, and raise `duration` when the text is longer.
- Success and error tones must keep a clear text; the color is a reinforcement only.
- White text on Grey/900, green-500 and red-500 plates.

## Content guidelines
- One short sentence or a past participle ("Copied", "Rule saved").
- Link label: one verb ("Undo").
- Sentence case, no final period for fragments, no em dash.

## Do / Don't
- Do use a snackbar for small confirmations; don't use it for errors that need an explanation (use Toaster).
- Do keep it to one line; don't write a paragraph.

## Related components
Composes: Icon (`ds-icon`) in code; Link and Icon Functional in Figma · Used by: app pages through `SnackbarService`.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
