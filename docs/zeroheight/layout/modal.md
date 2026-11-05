# Modal
**Status**: Design To be defined · Tech In code
A blocking dialog over a dimmed backdrop, for a focused task that must be completed or dismissed before returning to the page.
Figma: [Components] Layout › component Modal (key `c81f6a2d522228de5c1ba82eb0240bc02fa658c4`; file not accessible, node To be defined) · Storybook: `Design System/Layout/Modal` › Medium · Code: `shared/ui/modal` (`ds-modal`, internals `ds-modal-header`, `ds-modal-content`, `ds-modal-footer`)

## Overview
The Modal is a 1280 × 800 frame in Figma holding a centered `.Modal Box`: grey header with the title and a close button, a white scrollable content area (460 px high by default), and a grey footer with a back action and the call-to-action buttons. Four sizes set the box width. Embed the Storybook story `Medium` and the Figma Modal set (variant `Size=Medium`).

## When to use / When not to use
- Use when the user must finish or cancel a task before going on (create, edit, review a record).
- Use when the task is self-contained and fits one box (scrolling content allowed).
- Use when a multi-step flow needs Back in the footer.
- Don't use when the page must stay usable during the task: → use Drawer instead.
- Don't use when you only ask to confirm or warn: → use Confirm Dialog (`ds-confirm-dialog`) instead.
- Don't use when the message is non-blocking feedback: → use Snackbar, Toaster or Functional Notice instead.

## Anatomy
1. Backdrop: full-viewport overlay; a click closes the modal (`closeOnBackdrop`).
2. `.Modal Box` (private, exposed): the dialog box, made of three exposed atoms. `.Modal Box/small` (private, exposed, hidden by default) is the variant drawn for small boxes; it holds the same Header, Content, Footer.
3. `Header` (exposed): `Headline Text` (title) and a close `Button Icon`; `Back` boolean. Code: `ds-modal-header` (title `h2`, `ds-button-icon` plain M with `close` icon).
4. `Content` (exposed): `Slot` for local content and a `Scrollbar` boolean. Code: `ds-modal-content` (fixed height, vertical scroll, styled scrollbar).
5. `Footer` (exposed): `Content` › `Back` and `Actions`; booleans `Back`, `Secondary CTA`, `Tertiary CTA`. Code: `ds-modal-footer` (back `ds-button` plain with `arrow-left`, then the `slot="actions"` buttons).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Size | Variant | **Small**, Medium, Large, xlarge | `size`: `'small' \| 'medium' \| 'large' \| 'xlarge'` (default `'medium'`) | Box width read in Figma: 400, 780, 1080, 1080. Code max-width: 400, 780, 1080, 1280. Figma default Small, code default medium. |
| Header › Back | Boolean | **true** | none in the header | Code puts Back in the footer (`showBack`). |
| Content › Slot | Slot | local content | default content | |
| Content › Scrollbar | Boolean | **true** | `contentHeight` (`'460px'`; `'auto'` removes the scroll) | |
| Footer › Back | Boolean | **true** | `showBack` (false), `backLabel` ('Back') | |
| Footer › Secondary CTA | Boolean | **true** | `slot="actions"` content | Buttons are composed by the consumer. |
| Footer › Tertiary CTA | Boolean | **true** | `slot="actions"` content | |
| none | | | `footer` (true) | Hides the whole footer. Not in Figma. |
| none | | | `open`, `title` (required), `closeOnBackdrop` (true), `closeOnEscape` (true), `suspended` (false) | Behavior only. |

Outputs: `closed`, `backClicked`.

Slots: Figma `Content › Slot` holds the local content of the modal. Code: default content (body) and `slot="actions"` (footer buttons).

Exposed nested instances: `.Modal Box` and `.Modal Box/small` on the Modal; `Header`, `Content`, `Footer` on `.Modal Box` (their booleans surface on the instance).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Open / closed | `[open]` (rendered only when open) | none |
| Suspended | `[suspended]="true"`: stays mounted but invisible, unreachable by keyboard, deaf to Escape, while a Confirm Dialog asks a question | none |
| With back | `[showBack]="true"` | Footer `Back=true` |
| Without footer | `[footer]="false"` | none |
| Button states | from `ds-button` / `ds-button-icon` | from Button / Button Icon |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Backdrop | background | `--semantic-color-overlay-backdrop` | none (raw `rgba(0, 0, 0, 0.35)`) |
| Backdrop | padding | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Box | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Box | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Box | box-shadow | `--semantic-shadow-modal` | `--foundation-shadow-bottom-500` |
| Box | max-height margin | `--semantic-measurement-spacing-3xl` | `--foundation-spacing-64` |
| Box | max-width | none (hard-coded px per size) | none |
| Header, Footer | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Header, Footer | border | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Header, Footer | outer radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Header | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Header title | font-size | none (Foundation used directly) | `--foundation-font-size-24` |
| Header title | weight, letter-spacing, color | `--semantic-font-text-style-font-weight-regular`, `--semantic-font-text-style-letter-spacing-none`, `--semantic-color-static-text-main-primary` | 400, 0, `grey-900` |
| Content | padding | `--semantic-measurement-spacing-l` / `--semantic-measurement-spacing-xl` | 24 / 32 |
| Content | gap | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Content scrollbar | track / thumb | `--semantic-color-static-background-main-secondary` / `--semantic-color-static-background-accent-tertiary`, `--semantic-border-radius-round` | `grey-050` / `grey-200` |
| Footer | padding, gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |

## Accessibility
- Host `role="dialog"`, `aria-modal="true"`, `aria-label` = the title; `aria-hidden` when closed or suspended.
- The box carries `dsFocusTrap` (CLAUDE.md): focus moves into the box on open, Tab loops inside, focus returns to the trigger on close.
- Escape closes one layer per press, the highest first: an open flyout inside the modal closes before the modal (`closeOnEscape`).
- The close button is labelled "Close". Never stack a Confirm Dialog on top of a visible modal: use `suspended`.

## Content guidelines
- Title: the task or the object ("Buyer details", "Edit criteria"); long titles are truncated with an ellipsis.
- Footer: primary action last (right), secondary and tertiary before it; Back on the left only in multi-step flows.

## Do / Don't
- Do pick the smallest size that fits the content. Don't use xlarge for a short form.
- Do suspend the modal while a Confirm Dialog asks a question. Don't open a dialog on top of a visible modal.
- Do keep one task per modal. Don't chain unrelated tasks inside one box.

## Related components
Composes: Button Icon, Button, Icon, Focus Trap · Used by: Buyer Summary, card builder lab, Grade story (TAG explanation, TRAM score), Portfolio management (update, upload), TAG configuration (import rules) · Related: Confirm Dialog (`ds-confirm-dialog`), a separate component

## Changelog
| Version | Date | Change |
|---|---|---|
| Docs | 2026-11-04 | First ZeroHeight page. |
| To be defined | To be defined | Figma changelog not accessible. |
