# Icon Tile
**Status**: Design New · Tech In code
A square tile holding one icon, placed at the start of a result or a list row to say what kind of object it is.
Figma: [Components] Data Display › page Icon Tile (node 2020:358) · Storybook: `Design System/Foundation/Icon Tile` › Default · Code: `shared/ui/icon-tile` (`ds-icon-tile`)

## Overview
Icon Tile is a decorative, non-interactive square that frames a single glyph (for example Grid for a buyer, a document for a policy). It comes in three sizes (S 32, M 40, L 56) and three tones (Brand, Neutral, Subtle). Embed the Storybook `Default` story and the Figma component set frame (node 2020:358) on the page `🆕 Icon Tile`.

## When to use / When not to use
- Use when a row or result needs a quick visual cue of the object type (buyer, policy, document).
- Use when several rows of the same list need the same leading visual: one tile per row, same size down a list.
- Use inside Result Card, Policy Result Card and Action Card as the leading visual.
- Don't use when the icon must be clickable → use Button Icon instead.
- Don't use when the icon carries a status meaning → use Badge instead (status is never color-only).
- Don't use when you only need an inline glyph next to text → use Icon instead.

## Anatomy
1. `Icon Tile` (frame): the square container, filled with the tone background, radius from the size.
2. `Icon` (exposed instance of `Icon Functional`): the glyph, centred; swap it from the exposed instance (16 px in S, 24 px in M and L).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Size | Variant | **S** / M / L | `size: 's' \| 'm' \| 'l'` (default `'m'`) | Figma default is S, code default is M. S 32 px, M 40 px, L 56 px. |
| Tone | Variant | **Brand** / Neutral / Subtle | `tone: 'brand' \| 'neutral' \| 'subtle'` (default `'brand'`) | |

Slots: none in Figma. In code the glyph is projected content (`<ng-content />`): pass a `<ds-icon>` and set its size yourself (16 for S, 24 for M and L to match Figma).

Exposed nested instances: `Icon` (`Icon Functional`): swap the glyph (`🔗 Icon` instance swap). Local glyphs drawn on the page for icons missing from NDBX Icons: `🆕 Grid` (buyer), `🆕 Contract`, `🆕 File Text`, `🆕 File New` (policy). They are assets to swap into the Icon, not components to use on their own; replace them with NDBX glyphs once those exist.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Always; the tile is static | All variants |

No hover, focus or disabled state: the tile is not interactive.

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Tile (Brand) | background | `--semantic-color-static-background-main-alt-primary` | `--foundation-color-blue-a-025` |
| Glyph (Brand) | color | Figma `Color/Interactive/Icon/Strong/Default`; code `--semantic-color-interactive-text-strong-default` | `--foundation-color-blue-a-500` |
| Tile (Neutral) | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Glyph (Neutral) | color | Figma `Color/Static/Icon/Main/Secondary`; code `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Tile (Subtle) | background | `--semantic-color-static-background-accent-tertiary` | `--foundation-color-grey-200` |
| Glyph (Subtle) | color | Figma `Color/Static/Icon/Main/Primary`; code `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Tile S, M | border-radius | `--semantic-border-radius-s` (Figma) | `--foundation-radius-4` |
| Tile L | border-radius | `--semantic-border-radius-m` (Figma) | `--foundation-radius-8` |

## Accessibility
- The host carries `aria-hidden="true"`: the tile is decorative and is skipped by screen readers. The object type must also be stated in text in the row (title, label).
- Not focusable, no keyboard interaction.
- Glyph contrast on its tile: Brand blue-a-500 on blue-a-025, Neutral grey-700 on grey-050, Subtle grey-900 on grey-200.

## Content guidelines
- One glyph per tile, chosen by object type, and kept consistent across the product (Grid = buyer, document = policy).
- No text, number or letter inside the tile.

## Do / Don't
- Do: one tile per row, same size down a list. Don't: mix S and M tiles in the same list.
- Do: keep the tile as a static leading visual. Don't: use it as a button; it is not clickable.
- Do: pick the tone for the context (Brand in results). Don't: use the tone to carry a status.

## Related components
Composes: Icon · Used by: Result Card, Policy Result Card, Action Card, Recent search card (Search page)

## Changelog
| Version | Date | Change |
|---|---|---|
| v1.0.0 | November 3, 2026 | New: added from code (ds-icon-tile). Note: Grid glyph is local, not in NDBX. |
| Docs | 2026-11-04 | First ZeroHeight page. |

### Notes (Figma vs code)
- Code M uses a hard-coded 5 px radius; Figma uses `Border/Radius/S` (4 px). No 5 px token exists.
- Code sizes (32, 40, 56 px) and the S and L radii are hard-coded or read from Foundation tokens (`--foundation-radius-4`, `--foundation-radius-8`) instead of Semantic tokens.
- Code colors the glyph with Text tokens; Figma binds Icon tokens. Values are identical.
- Default size differs: Figma S, code M.
