# Opacity
**Status**: Design Ready · Tech In code
Opacity tokens: disabled state, overlay and transparency.
Figma: Tokens › collections Foundation and Semantic (file `4TxqgJPVFZc4ZKw4JZ6OAn`) · Code: `src/styles/_tokens.scss` (Foundation), `src/styles/_semantic.scss` (Semantic)

## Overview
Four opacity steps cover every need: fully opaque, disabled (40 %), overlay (35 %) and transparent.

## Token tiers
Qirin has exactly two token tiers, and no other collection:

1. **Foundation** (core, Figma collection `Foundation`, 139 variables, one mode): raw values. CSS prefix `--foundation-`.
2. **Semantic** (Figma collection `Semantic`, 371 variables, mode `Default`): aliases to Foundation, named by role. CSS prefix `--semantic-`.

Components only consume **Semantic** tokens. A Semantic token always points to a Foundation token, never to a raw value. Naming rule: the Figma path is kept and converted to kebab-case, slashes become hyphens (`Color/Interactive/Background/Strong/Default` = `--semantic-color-interactive-background-strong-default`).

## Semantic opacity
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-measurement-opacity-default` | `--foundation-opacity-100` | `1` |
| `--semantic-measurement-opacity-overlay` | `--foundation-opacity-35` | `0.35` |
| `--semantic-measurement-opacity-transparent` | `--foundation-opacity-0` | `0` |
| `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` | `0.40` |

Figma stores opacity as 0 to 100 (`Opacity/40` = 40); code stores it on the CSS 0 to 1 scale (`0.40`).

## Usage rules (from DESIGN.md)
- Disabled controls render at 40 % opacity and are non-interactive (`--semantic-measurement-opacity-disabled`).
- Modal and drawer backdrops: Figma uses `Measurement/Opacity/Overlay` (35 %); code uses `--semantic-color-overlay-backdrop` (`rgba(0, 0, 0, 0.35)`), the same strength expressed as a color.

## Foundation scale
| Foundation token (CSS var) | Value |
|---|---|
| `--foundation-opacity-0` | `0` |
| `--foundation-opacity-35` | `0.35` |
| `--foundation-opacity-40` | `0.40` |
| `--foundation-opacity-100` | `1` |

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-11-04 | First ZeroHeight page. |
