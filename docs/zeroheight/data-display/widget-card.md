# Widget Card
**Status**: Design New · Tech In code
A card shell for board widgets: an optional title bar with actions above free content (chart, list, figures).
Figma: [Components] Data Display › page Card (node 1325:10443, component `Card` with Slot) · Storybook: `Design System/Data Display/Widget Card` › Figures · Code: `shared/ui/widget-card` (`ds-widget-card`)

## Overview
Widget Card wraps one board widget of the Buyer Summary. In Figma it is the `Card` component with a Slot: the content is local to the file and goes in the Slot, the kebab Button Icon stays top-right, and `Header=True` shows the title and a separator. In code it composes `ds-card` (with `noPadding`), a title, actions (`ds-button`, `ds-button-icon`), a `ds-divider` and projected content. Embed the Storybook story `Figures` and the Figma component 1325:10443.

## When to use / When not to use
- Use when a board widget needs a title, an action (open, menu) and free content.
- Use when the content is a chart, a short list or a block of figures.
- Use when users can rename the widget (project a `ds-inline-edit` in `slot="title"`).
- Don't use when the block is plain label/value data → use Card `Type=Default` (`.Columns`) instead.
- Don't use when the content is a full table → use Table inside a Card with `noPadding` instead.
- Don't use when the content must expand and collapse → use Accordion instead.

## Anatomy
1. Container: the Card box (border, 4 px radius).
2. `Header` (shown with `Header=True`): `Title row` with the exposed `.Title` (edit its text on the instance) and a `Separator`.
3. `Slot`: free content (chart, list, figures).
4. `Button Icon`: the action at top-right, level with the title (kebab or external link).
In code: `__title` (h3), `__actions` (optional "see figures" plain accent `ds-button`, then a plain accent `ds-button-icon`), `ds-divider`, `__body` (projected content).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Header | Boolean | True, **False** | `title` (required string), `slot="title"` | Code always renders the title bar; there is no header-less mode. |
| Button | Boolean | **True**, False | `externalLink` (boolean, true) | Icon set by `actionIcon` (default `export-share`), label by `externalAriaLabel` (default "Open"). |
| Slot | Slot | local content | default `<ng-content />` | |
| none | | | `seeFigures` (boolean, false), `seeFiguresLabel` ("see figures") | Plain accent text button. Not drawn in Figma. |
| none | | | outputs `seeFiguresClicked`, `externalClicked` | |

Slots: `Slot` takes the widget content. In code, the default projection is the body and `slot="title"` replaces the title text.

Exposed nested instances: `.Title` (title text, `Subtitle`, `Vertical`) inside the header.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | none | Header=False or True |
| Action hover / active / focus | Provided by `ds-button-icon` and `ds-button` | Provided by Button Icon |
| Loading | To be defined (no input) | Not drawn |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | background, border, radius | from `ds-card` (see Card) | |
| Inner | padding | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Inner | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Header | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Title | font-size / line-height | `--semantic-font-text-style-size-l` / `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16` / `--foundation-font-line-height-24` |
| Title | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Title | letter-spacing | `--semantic-font-text-style-letter-spacing-s` | `--foundation-font-letter-spacing-0-2` |
| Title | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Actions | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Figma container | radius / stroke | `Border/Radius/S` / `Color/Static/Border/Subtle/Tertiary` | Radius/4 / Grey/200 |

## Accessibility
- The title is an `h3`: check the heading level fits the page outline.
- The icon action needs an explicit `externalAriaLabel` describing the destination ("Open grade history"), not the generic default.
- Content in the body keeps its own semantics (chart text alternative, list markup).

## Content guidelines
- Title: short noun phrase, sentence case, one line.
- "see figures" label: lowercase verb phrase as in the default; keep it under three words.

## Do / Don't
- Do put one widget per card. Don't stack two titled blocks in one Widget Card.
- Do keep the action at top-right. Don't add more than one icon action; use a kebab menu for several.
- Do draw local content in the Slot. Don't detach the master to change the frame.

## Related components
Composes: Card, Button, Button Icon, Icon, Divider, Inline Edit (title slot) · Used by: Buyer Summary boards, Chart, List Widget, Newsfeed.

## Changelog
| Version | Date | Change |
|---|---|---|
| To be defined | 2026-11 | Figma description: "🆕 Header · New · 2026-11": optional header for board widgets (Header=True). |
| Docs | 2026-11-04 | First ZeroHeight page. |
