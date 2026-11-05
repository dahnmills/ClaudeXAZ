# Typography
**Status**: Design Ready · Tech In code
Type tokens and text styles: one family (Allianz Neo), hierarchy by weight and a stepped size scale.
Figma: Tokens › collections Foundation and Semantic (file `4TxqgJPVFZc4ZKw4JZ6OAn`) · Code: `src/styles/_tokens.scss` (Foundation), `src/styles/_semantic.scss` (Semantic)

## Overview
Allianz Neo is carried across the whole system. Hierarchy comes from weight (400 regular, 600 semi-bold, 700 bold) and size, never from a second typeface. Figma publishes 35 text styles (Title, Body, Display) bound to the Semantic font variables.

## Token tiers
Qirin has exactly two token tiers, and no other collection:

1. **Foundation** (core, Figma collection `Foundation`, 139 variables, one mode): raw values. CSS prefix `--foundation-`.
2. **Semantic** (Figma collection `Semantic`, 371 variables, mode `Default`): aliases to Foundation, named by role. CSS prefix `--semantic-`.

Components only consume **Semantic** tokens. A Semantic token always points to a Foundation token, never to a raw value. Naming rule: the Figma path is kept and converted to kebab-case, slashes become hyphens (`Color/Interactive/Background/Strong/Default` = `--semantic-color-interactive-background-strong-default`).

## Text styles (Figma)
All letter spacing is 0. Each Title style also exists as "- Uppercase".

| Figma text style | Weight | Size / line height (px) | Bound Semantic variables |
|---|---|---|---|
| Title/H1 | Regular | 24/32 | Title Size M, Line Height L, Font Weight S |
| Title/H2 | Semi Bold | 20/28 | Title Size S, Line Height M, Font Weight M |
| Title/H3 | Semi Bold | 18/24 | Title Size XS, Line Height 24, Font Weight M |
| Title/H4 | Semi Bold | 16/20 | Title Size XXS, Line Height XS, Font Weight M |
| Body/L/Regular, Semi Bold, Bold (+ Underline) | 400 / 600 / 700 | 16/24 | Text Style Size L, Line Height L |
| Body/M/Regular, Semi Bold, Bold (+ Underline) | 400 / 600 / 700 | 14/20 | Text Style Size M, Line Height M |
| Body/S/Regular, Semi Bold, Bold (+ Underline) | 400 / 600 / 700 | 12/16 | Text Style Size S, Line Height S |
| Display/L/Regular, Semi Bold, Bold | 400 / 600 / 700 | 64/72 | Display Size L, Line Height L |
| Display/M/Regular, Semi Bold, Bold | 400 / 600 / 700 | 48/56 | Display Size M, Line Height M |
| Display/S/Regular, Semi Bold, Bold | 400 / 600 / 700 | 32/40 | Display Size S, Line Height S |

In code there is no typography mixin file: components set `font-family`, `font-size`, `font-weight` and `line-height` from the Semantic tokens below. The global body default is Body M Regular (14/20).

## Usage rules (from DESIGN.md)
- **The Weight-Not-Family Rule.** Never reach for a second typeface. Allianz Neo at 400, 600 and 700 plus the size scale covers every level.
- **The Compact-Default Rule.** On dense surfaces (tables, rule cards, property lists) Body M (14 px) is the default; reserve Body L (16 px) for prose and empty states.
- Labels, column headers and badge text use 12 px semi-bold; uppercase is allowed only there and at most 4 words.
- Form field labels are semi-bold (`--semantic-font-text-style-font-weight-semi-bold`) at size L, and never wrap to two lines (CLAUDE.md).
- Cap prose measure at 65 to 75 characters.

## Semantic font tokens
### Family
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-font-family` | `--foundation-font-family` | `'Allianz Neo', sans-serif` |

### Display
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-font-display-size-s` | `--foundation-font-size-32` | `32px` |
| `--semantic-font-display-size-m` | `--foundation-font-size-48` | `48px` |
| `--semantic-font-display-size-l` | `--foundation-font-size-64` | `64px` |
| `--semantic-font-display-font-weight-s` | `--foundation-font-weight-regular` | `400` |
| `--semantic-font-display-font-weight-m` | `--foundation-font-weight-semi-bold` | `600` |
| `--semantic-font-display-font-weight-l` | `--foundation-font-weight-bold` | `700` |
| `--semantic-font-display-line-height-s` | `--foundation-font-line-height-40` | `40px` |
| `--semantic-font-display-line-height-m` | `--foundation-font-line-height-56` | `56px` |
| `--semantic-font-display-line-height-l` | `--foundation-font-line-height-72` | `72px` |
| `--semantic-font-display-letter-spacing-none` | `--foundation-font-letter-spacing-0` | `0px` |
| `--semantic-font-display-letter-spacing-s` | `--foundation-font-letter-spacing-0-2` | `0.2px` |

### Title
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-font-title-size-xxs` | `--foundation-font-size-16` | `16px` |
| `--semantic-font-title-size-xs` | `--foundation-font-size-18` | `18px` |
| `--semantic-font-title-size-s` | `--foundation-font-size-20` | `20px` |
| `--semantic-font-title-size-m` | `--foundation-font-size-24` | `24px` |
| `--semantic-font-title-size-l` | `--foundation-font-size-28` | `28px` |
| `--semantic-font-title-size-xl` | `--foundation-font-size-32` | `32px` |
| `--semantic-font-title-font-weight-s` | `--foundation-font-weight-regular` | `400` |
| `--semantic-font-title-font-weight-m` | `--foundation-font-weight-semi-bold` | `600` |
| `--semantic-font-title-line-height-xs` | `--foundation-font-line-height-20` | `20px` |
| `--semantic-font-title-line-height-s` | `--foundation-font-line-height-24` | `24px` |
| `--semantic-font-title-line-height-m` | `--foundation-font-line-height-28` | `28px` |
| `--semantic-font-title-line-height-l` | `--foundation-font-line-height-32` | `32px` |
| `--semantic-font-title-letter-spacing-none` | `--foundation-font-letter-spacing-0` | `0px` |
| `--semantic-font-title-letter-spacing-s` | `--foundation-font-letter-spacing-0-2` | `0.2px` |

### Text style (body and UI)
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-font-text-style-size-s` | `--foundation-font-size-12` | `12px` |
| `--semantic-font-text-style-size-m` | `--foundation-font-size-14` | `14px` |
| `--semantic-font-text-style-size-l` | `--foundation-font-size-16` | `16px` |
| `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` | `400` |
| `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` | `600` |
| `--semantic-font-text-style-font-weight-bold` | `--foundation-font-weight-bold` | `700` |
| `--semantic-font-text-style-line-height-s` | `--foundation-font-line-height-16` | `16px` |
| `--semantic-font-text-style-line-height-m` | `--foundation-font-line-height-20` | `20px` |
| `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` | `24px` |
| `--semantic-font-text-style-letter-spacing-none` | `--foundation-font-letter-spacing-0` | `0px` |
| `--semantic-font-text-style-letter-spacing-s` | `--foundation-font-letter-spacing-0-2` | `0.2px` |
| `--semantic-font-text-style-letter-spacing-m` | `--foundation-font-letter-spacing-0-5` | `0.5px` |
| `--semantic-font-text-style-letter-spacing-l` | `--foundation-font-letter-spacing-1` | `1px` |

## Foundation scales
### Size
| Foundation token (CSS var) | Value |
|---|---|
| `--foundation-font-size-12` | `12px` |
| `--foundation-font-size-14` | `14px` |
| `--foundation-font-size-16` | `16px` |
| `--foundation-font-size-18` | `18px` |
| `--foundation-font-size-20` | `20px` |
| `--foundation-font-size-24` | `24px` |
| `--foundation-font-size-28` | `28px` |
| `--foundation-font-size-32` | `32px` |
| `--foundation-font-size-40` | `40px` |
| `--foundation-font-size-48` | `48px` |
| `--foundation-font-size-64` | `64px` |

### Weight
| Foundation token (CSS var) | Value |
|---|---|
| `--foundation-font-weight-thin` | `100` |
| `--foundation-font-weight-extra-light` | `200` |
| `--foundation-font-weight-light` | `300` |
| `--foundation-font-weight-regular` | `400` |
| `--foundation-font-weight-medium` | `500` |
| `--foundation-font-weight-semi-bold` | `600` |
| `--foundation-font-weight-bold` | `700` |
| `--foundation-font-weight-extra-bold` | `800` |
| `--foundation-font-weight-black` | `900` |

### Line height
| Foundation token (CSS var) | Value |
|---|---|
| `--foundation-font-line-height-16` | `16px` |
| `--foundation-font-line-height-20` | `20px` |
| `--foundation-font-line-height-24` | `24px` |
| `--foundation-font-line-height-28` | `28px` |
| `--foundation-font-line-height-32` | `32px` |
| `--foundation-font-line-height-40` | `40px` |
| `--foundation-font-line-height-56` | `56px` |
| `--foundation-font-line-height-64` | `64px` |
| `--foundation-font-line-height-72` | `72px` |

### Letter spacing
| Foundation token (CSS var) | Value |
|---|---|
| `--foundation-font-letter-spacing-0` | `0px` |
| `--foundation-font-letter-spacing-0-2` | `0.2px` |
| `--foundation-font-letter-spacing-0-5` | `0.5px` |
| `--foundation-font-letter-spacing-1` | `1px` |

## Figma and code differences
- DESIGN.md describes a "Headline" at 600, 24/28 and a "Title" at 600, 20/24; the Figma styles are Title/H1 Regular 24/32 and Title/H2 Semi Bold 20/28. Figma is the source of truth.
- `--foundation-font-size-40` exists in code only (no `Font/Size/40` in Figma); `Font/Line Height/64` exists in both.
- Figma `Body/S/Semi Bold` binds its line height to `Font/Text Style/Size/L` (16) instead of `Line Height/S` (16): same value, wrong variable.
- Figma Semantic `Font/Text Style/Font Weight/SemiBold` is written `semi-bold` in code.

## Do / Don't
- Do use Body M for table cells and property values. Don't set dense data in 16 px.
- Do create emphasis with Semi Bold. Don't use italics or a second family for emphasis.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-11-04 | First ZeroHeight page. |
