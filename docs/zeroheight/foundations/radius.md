# Radius
**Status**: Design Ready · Tech In code
Corner radius tokens: subtly rounded by default (4 px), fully rounded for pills.
Figma: Tokens › collections Foundation and Semantic (file `4TxqgJPVFZc4ZKw4JZ6OAn`) · Code: `src/styles/_tokens.scss` (Foundation), `src/styles/_semantic.scss` (Semantic)

## Overview
Radius tokens give every container and control its corner style. Buttons, inputs and cards use S (4 px); badges and pills use Round.

## Token tiers
Qirin has exactly two token tiers, and no other collection:

1. **Foundation** (core, Figma collection `Foundation`, 139 variables, one mode): raw values. CSS prefix `--foundation-`.
2. **Semantic** (Figma collection `Semantic`, 371 variables, mode `Default`): aliases to Foundation, named by role. CSS prefix `--semantic-`.

Components only consume **Semantic** tokens. A Semantic token always points to a Foundation token, never to a raw value. Naming rule: the Figma path is kept and converted to kebab-case, slashes become hyphens (`Color/Interactive/Background/Strong/Default` = `--semantic-color-interactive-background-strong-default`).

## Semantic radius
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-border-radius-none` | `--foundation-radius-0` | `0px` |
| `--semantic-border-radius-xs` | `--foundation-radius-2` | `2px` |
| `--semantic-border-radius-s` | `--foundation-radius-4` | `4px` |
| `--semantic-border-radius-m` | `--foundation-radius-8` | `8px` |
| `--semantic-border-radius-l` | `--foundation-radius-16` | `16px` |
| `--semantic-border-radius-xl` | `--foundation-radius-32` | `32px` |
| `--semantic-border-radius-round` | `--foundation-radius-100` | `100px` |

## Usage rules (from DESIGN.md)
- Buttons, inputs, cards and containers: `--semantic-border-radius-s` (4 px).
- Badges and pill-shaped chips: `--semantic-border-radius-round`.
- No value outside the scale (for example, a 5 px radius has no token: use S).

## Foundation scale
| Foundation token (CSS var) | Value |
|---|---|
| `--foundation-radius-0` | `0px` |
| `--foundation-radius-2` | `2px` |
| `--foundation-radius-4` | `4px` |
| `--foundation-radius-8` | `8px` |
| `--foundation-radius-16` | `16px` |
| `--foundation-radius-32` | `32px` |
| `--foundation-radius-100` | `100px` |

## Do / Don't
- Do keep one radius per component family (S for boxes). Don't mix 4 px and 8 px corners inside the same card.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-11-04 | First ZeroHeight page. |
