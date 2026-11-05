# Drawer
**Status**: Design To be defined · Tech In code
A panel that slides in from the right edge to hold a secondary task (filters, details) without leaving the page.
Figma: [Components] Layout › component Drawer (key `413684a36328011d3e9d4a452107c914f8440d5b`; file not accessible, node To be defined) · Storybook: `Design System/Layout/Drawer` › Default · Code: `shared/ui/drawer` (`ds-drawer`)

## Overview
The Drawer is a fixed panel on the right of the viewport (388 px wide: 6 × Sizing 3XL + Sizing XS, capped at the viewport width) with a header (close, optional back, title), a scrollable body and a footer for actions. It follows "One view, one job": secondary actions live in drawers or modals, not on the primary surface. Embed the Storybook story `Default` (title "Filters", footer Cancel / Apply) and the Figma Drawer set.

## When to use / When not to use
- Use when the user refines or inspects something while keeping the page in view (filters, side details).
- Use when the task has several fields and actions (Cancel / Apply in the footer).
- Use when a flow needs sub-views: `showBack` adds a back affordance.
- Don't use when the task must block the page until answered: → use Modal instead.
- Don't use when you ask a single yes or no question: → use Confirm Dialog instead.
- Don't use when the content is a short hint: → use Tooltip or Popover instead.

## Anatomy
1. Panel (`<aside>`): white surface with the modal shadow.
2. Header: close row (`ds-button-icon` plain, accent, `close` icon; optional back `ds-button-icon` with `arrow-left`) then the title (`h2`). Figma lists a separate `Drawer Header` component (key `0031ca91d55192b93ec67665db84479e413540db`); its properties are To be defined.
3. Body: projected content (everything except `slot="footer"`). Figma lists a `Content` component (key `cd784681866bd31e947e1847faae3a8b49b8e32a`, Slot and Scrollbar booleans, shared with Modal).
4. Footer: projected `slot="footer"` (buttons).
5. Figma also lists `Drawer Tabs` (component set, key `c8e4b1186bb37afd2dc2320a34fa2ab75c187ff5`): tabs inside the drawer. No code equivalent.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| To be defined | To be defined | To be defined | `open` (boolean, false) | Figma properties not readable. |
| To be defined | To be defined | To be defined | `title` (required string) | |
| To be defined | To be defined | To be defined | `showBack` (false), `backLabel` ('Back') | |
| To be defined | To be defined | To be defined | `closeOnEscape` (true) | |

Outputs: `closed` (close button or Escape), `back` (back button).

Slots: code has the default slot (body) and `slot="footer"`. Figma slots To be defined.

Exposed nested instances: To be defined.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Open / closed | `[open]` (slide transform, 320 ms) | To be defined |
| With back | `[showBack]="true"` | To be defined |
| Button states | from `ds-button-icon` | from Button Icon |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | top, right, bottom | `--semantic-measurement-spacing-none` | `--foundation-spacing-0` |
| Panel | width | `--semantic-measurement-sizing-3xl` × 6 + `--semantic-measurement-sizing-xs` | `sizing-64`, `sizing-4` |
| Panel | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Panel | box-shadow | `--semantic-shadow-modal` | `--foundation-shadow-bottom-500` |
| Header | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Header | padding | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Title | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Title | font | `--semantic-font-title-size-s`, `-font-weight-m`, `-line-height-m`, `-letter-spacing-none` | 20 / 600 / 28 / 0 |
| Body | min-height | `--semantic-measurement-sizing-none` | `--foundation-sizing-0` |

## Accessibility
- The panel is `role="dialog"` with `aria-modal="false"` and `aria-label` = the title: the page stays usable behind it.
- Closed, the panel is `aria-hidden` and out of the tab order (`tabindex=-1`).
- Escape closes the drawer (`closeOnEscape`). The close button label is "Close"; the back button uses `backLabel`.
- `dsFocusTrap` is not applied (the drawer is not modal): moving focus into the panel on open and back to the trigger on close is To be defined.
- Motion: the slide has no reduced-motion alternative in code (To be defined).

## Content guidelines
- Title: the name of the task or object ("Filters"), not a sentence.
- Footer: the primary action on the right ("Apply"), the dismissive action before it ("Cancel").

## Do / Don't
- Do keep one task per drawer. Don't stack a drawer on another drawer.
- Do put the decisive actions in the footer. Don't put Apply in the header.
- Do keep the page visible and usable. Don't use the drawer to force a decision: use a Modal.

## Related components
Composes: Button Icon, Icon, Button (footer, by the consumer) · Used by: Filter Drawer (`ds-filter-drawer`), Buyer Summary page

## Changelog
| Version | Date | Change |
|---|---|---|
| Docs | 2026-11-04 | First ZeroHeight page. |
| To be defined | To be defined | Figma changelog not accessible. |
