# Spacing and sizing
**Status**: Design Ready · Tech In code
Spacing, sizing and border-width tokens: one 4 px based scale for gaps, padding and fixed dimensions.
Figma: Tokens › collections Foundation and Semantic (file `4TxqgJPVFZc4ZKw4JZ6OAn`) · Code: `src/styles/_tokens.scss` (Foundation), `src/styles/_semantic.scss` (Semantic)

## Overview
Spacing tokens set padding and gaps between elements; Sizing tokens set fixed dimensions (icons, controls, tiles); Border Size tokens set stroke widths. The t-shirt names (XXS to 3XL) are the only values a component may use.

## Token tiers
Qirin has exactly two token tiers, and no other collection:

1. **Foundation** (core, Figma collection `Foundation`, 139 variables, one mode): raw values. CSS prefix `--foundation-`.
2. **Semantic** (Figma collection `Semantic`, 371 variables, mode `Default`): aliases to Foundation, named by role. CSS prefix `--semantic-`.

Components only consume **Semantic** tokens. A Semantic token always points to a Foundation token, never to a raw value. Naming rule: the Figma path is kept and converted to kebab-case, slashes become hyphens (`Color/Interactive/Background/Strong/Default` = `--semantic-color-interactive-background-strong-default`).

## Usage rules (from DESIGN.md)
- Density with hierarchy: dense is fine, cluttered is not. Whitespace separates signal from supporting detail.
- Card internal padding is 24 px (`--semantic-measurement-spacing-l`); use `noPadding` when the content manages its own rhythm.
- Buttons and inputs use 8 px by 16 px padding (`spacing-s` by `spacing-m`).
- Never hard-code a px value; if a value is missing, add it to Foundation and Semantic first.

## Semantic spacing
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-measurement-spacing-none` | `--foundation-spacing-0` | `0px` |
| `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` | `2px` |
| `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` | `4px` |
| `--semantic-measurement-spacing-s` | `--foundation-spacing-8` | `8px` |
| `--semantic-measurement-spacing-m` | `--foundation-spacing-16` | `16px` |
| `--semantic-measurement-spacing-l` | `--foundation-spacing-24` | `24px` |
| `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` | `32px` |
| `--semantic-measurement-spacing-2xl` | `--foundation-spacing-48` | `48px` |
| `--semantic-measurement-spacing-3xl` | `--foundation-spacing-64` | `64px` |
| `--semantic-measurement-size-tile` | `--foundation-spacing-104` | `104px` |

`--semantic-measurement-size-tile` aliases `--foundation-spacing-104` (104 px), which exists in code only: the Figma Foundation spacing scale stops at 96.

## Semantic sizing
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-measurement-sizing-none` | `--foundation-sizing-0` | `0px` |
| `--semantic-measurement-sizing-xxs` | `--foundation-sizing-2` | `2px` |
| `--semantic-measurement-sizing-xs` | `--foundation-sizing-4` | `4px` |
| `--semantic-measurement-sizing-s` | `--foundation-sizing-8` | `8px` |
| `--semantic-measurement-sizing-m` | `--foundation-sizing-16` | `16px` |
| `--semantic-measurement-sizing-l` | `--foundation-sizing-24` | `24px` |
| `--semantic-measurement-sizing-xl` | `--foundation-sizing-32` | `32px` |
| `--semantic-measurement-sizing-2xl` | `--foundation-sizing-48` | `48px` |
| `--semantic-measurement-sizing-3xl` | `--foundation-sizing-64` | `64px` |

## Border size
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-border-size-none` | `--foundation-sizing-0` | `0px` |
| `--semantic-border-size-s` | `--foundation-sizing-1` | `1px` |
| `--semantic-border-size-m` | `--foundation-sizing-2` | `2px` |
| `--semantic-border-size-l` | `--foundation-sizing-4` | `4px` |

## Foundation scales
### Spacing
| Foundation token (CSS var) | Value |
|---|---|
| `--foundation-spacing-0` | `0px` |
| `--foundation-spacing-1` | `1px` |
| `--foundation-spacing-2` | `2px` |
| `--foundation-spacing-4` | `4px` |
| `--foundation-spacing-8` | `8px` |
| `--foundation-spacing-16` | `16px` |
| `--foundation-spacing-24` | `24px` |
| `--foundation-spacing-32` | `32px` |
| `--foundation-spacing-40` | `40px` |
| `--foundation-spacing-48` | `48px` |
| `--foundation-spacing-56` | `56px` |
| `--foundation-spacing-64` | `64px` |
| `--foundation-spacing-72` | `72px` |
| `--foundation-spacing-80` | `80px` |
| `--foundation-spacing-88` | `88px` |
| `--foundation-spacing-96` | `96px` |
| `--foundation-spacing-104` | `104px` |

### Sizing
| Foundation token (CSS var) | Value |
|---|---|
| `--foundation-sizing-0` | `0px` |
| `--foundation-sizing-1` | `1px` |
| `--foundation-sizing-2` | `2px` |
| `--foundation-sizing-4` | `4px` |
| `--foundation-sizing-8` | `8px` |
| `--foundation-sizing-16` | `16px` |
| `--foundation-sizing-24` | `24px` |
| `--foundation-sizing-32` | `32px` |
| `--foundation-sizing-40` | `40px` |
| `--foundation-sizing-48` | `48px` |
| `--foundation-sizing-56` | `56px` |
| `--foundation-sizing-64` | `64px` |
| `--foundation-sizing-72` | `72px` |
| `--foundation-sizing-80` | `80px` |
| `--foundation-sizing-88` | `88px` |
| `--foundation-sizing-96` | `96px` |

## Do / Don't
- Do use `spacing-l` (24 px) inside cards and `spacing-m` (16 px) between related blocks. Don't invent intermediate values such as 12 px or 20 px.
- Do use Border Size S (1 px) for dividers and component borders. Don't use a thick colored left or right border as an accent stripe.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-11-04 | First ZeroHeight page. |
