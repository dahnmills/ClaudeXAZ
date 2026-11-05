# Elevation (shadows)
**Status**: Design Ready · Tech In code
Shadow tokens: surfaces are flat at rest; a shadow appears only when an element floats or responds to state.
Figma: Tokens › collections Foundation and Semantic (file `4TxqgJPVFZc4ZKw4JZ6OAn`) · Code: `src/styles/_tokens.scss` (Foundation), `src/styles/_semantic.scss` (Semantic)

## Overview
Depth comes first from surface tone (white cards on a #f5f5f5 page) and 1 px subtle borders. Shadows are reserved for floating layers (tooltip, popover, flyout, modal, snackbar) and for state (an open card or row).

## Token tiers
Shadows follow the same two tiers: Foundation `--foundation-shadow-bottom-*` (raw box-shadow values) and Semantic `--semantic-shadow-*` (role aliases). In Figma, shadows are effect styles (`Shadows/Bottom/100` to `Shadows/Bottom/800`); they are not variables and they are not defined in the Tokens file (the published `Shadows/Bottom/400` style key is `3aa40b207e3dbeb82e7947cc955316d69a750a41`).

## Semantic shadows
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-shadow-flyout` | `--foundation-shadow-bottom-400` | `0 2px 4px 0 rgba(65, 65, 65, 0.50)` |
| `--semantic-shadow-popover` | `--foundation-shadow-bottom-300` | `0 2px 3px 0 rgba(65, 65, 65, 0.45)` |
| `--semantic-shadow-tooltip` | `--foundation-shadow-bottom-200` | `0 1px 3px 0 rgba(65, 65, 65, 0.40)` |
| `--semantic-shadow-modal` | `--foundation-shadow-bottom-500` | `0 4px 8px 0 rgba(65, 65, 65, 0.50)` |
| `--semantic-shadow-card` | `--foundation-shadow-bottom-100` | `0 1px 2px 0 rgba(65, 65, 65, 0.25)` |
| `--semantic-shadow-snackbar` | `--foundation-shadow-bottom-800` | `0 8px 24px 0 rgba(65, 65, 65, 0.35)` |
| `--semantic-shadow-elevation` | `--foundation-shadow-elevation` | `0 1px 4px 0 rgba(18, 43, 84, 0.16), 0 4px 16px 0 rgba(18, 43, 84, 0.12)` |

## Usage (from DESIGN.md)
| Semantic token | Use for |
|---|---|
| `--semantic-shadow-card` | Resting lift for a card that must detach slightly, or the open or active state of an expandable row. |
| `--semantic-shadow-tooltip` | Tooltips. |
| `--semantic-shadow-popover` | Popovers, dropdown flyouts. |
| `--semantic-shadow-flyout` | Flyout menus. |
| `--semantic-shadow-modal` | Modal dialogs. |
| `--semantic-shadow-snackbar` | Snackbar and floating bars. |
| `--semantic-shadow-elevation` | Product floating surfaces (search bar, floating panels): softer navy-tinted double shadow. |

**The Flat-At-Rest Rule.** A static card with a drop shadow "for depth" is wrong: flatten it.

## Foundation shadows
| Foundation token (CSS var) | Value |
|---|---|
| `--foundation-shadow-bottom-100` | `0 1px 2px 0 rgba(65, 65, 65, 0.25)` |
| `--foundation-shadow-bottom-200` | `0 1px 3px 0 rgba(65, 65, 65, 0.40)` |
| `--foundation-shadow-bottom-300` | `0 2px 3px 0 rgba(65, 65, 65, 0.45)` |
| `--foundation-shadow-bottom-400` | `0 2px 4px 0 rgba(65, 65, 65, 0.50)` |
| `--foundation-shadow-bottom-500` | `0 4px 8px 0 rgba(65, 65, 65, 0.50)` |
| `--foundation-shadow-bottom-800` | `0 8px 24px 0 rgba(65, 65, 65, 0.35)` |
| `--foundation-shadow-elevation` | `0 1px 4px 0 rgba(18, 43, 84, 0.16), 0 4px 16px 0 rgba(18, 43, 84, 0.12)` |

## Do / Don't
- Do use a shadow on a modal, flyout or popover. Don't add a shadow to a resting card.
- Do use the Semantic role token (`shadow-modal`). Don't pick a Foundation step by eye.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-11-04 | First ZeroHeight page. |
