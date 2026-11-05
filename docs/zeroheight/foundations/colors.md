# Colors
**Status**: Design Ready · Tech In code
Color tokens: a restrained palette with corporate blues for identity and action, a grey ramp for structure and text, and four functional colors reserved for status.
Figma: Tokens › collections Foundation and Semantic (file `4TxqgJPVFZc4ZKw4JZ6OAn`) · Code: `src/styles/_tokens.scss` (Foundation), `src/styles/_semantic.scss` (Semantic)

## Overview
Every color in a component comes from a Semantic token, which aliases a Foundation ramp step. Interactive tokens carry the four interaction states (default, hover, active, disabled); Static tokens are for surfaces, text, borders and icons that do not react. Embed the Tokens library color page and link to the Storybook token stories where available (none identified).

## Token tiers
Qirin has exactly two token tiers, and no other collection:

1. **Foundation** (core, Figma collection `Foundation`, 139 variables, one mode): raw values. CSS prefix `--foundation-`.
2. **Semantic** (Figma collection `Semantic`, 371 variables, mode `Default`): aliases to Foundation, named by role. CSS prefix `--semantic-`.

Components only consume **Semantic** tokens. A Semantic token always points to a Foundation token, never to a raw value. Naming rule: the Figma path is kept and converted to kebab-case, slashes become hyphens (`Color/Interactive/Background/Strong/Default` = `--semantic-color-interactive-background-strong-default`).

## Usage rules (from DESIGN.md)
- **The One Blue Rule.** Interactive Blue (`blue-a-500`, #007ab3) is the single action color: primary buttons, links, selected states, focus accents. If something is blue, it is actionable or selected.
- **Informative is a different hue.** Informational status uses BlueB (`blue-b-500`, #496ebd) so that "information" never reads as "clickable".
- **Brand Blue** (`blue-a-800`, #003781) is for identity surfaces: the global header, brand marks, the deepest interactive-active state.
- **The Status-Earns-Its-Color Rule.** Positive (green-500 #1e8927), Negative (red-500 #b0050c), Warning (orange-400 #e08d05) and Informative (blue-b-500) are never decorative and always ride with a label or icon.
- **Surfaces.** White (`static-background-main-primary`) cards on a Surface Secondary (`static-background-main-secondary`, #f5f5f5) page. No cream, sand or beige backgrounds, no gradients.
- **Text.** Ink #121212 for primary text, #414141 secondary, #767676 tertiary (still 4.5:1 on white).

## Foundation palette
| Ramp | 025 | 050 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| blue-a | #f1f9fa | #d9eaf2 | #b7ddf0 | #86cff4 | #55c0f6 | #008ed6 | #007ab3 | #006192 | #075994 | #003781 | #002c66 |
| blue-b | n/a | #ecf0f8 | #dae2f1 | #b5c5e3 | #90a8d5 | #6b8bc7 | #496ebd | #3a5ba2 | #365496 | #243966 | #1e2d52 |
| grey | n/a | #f5f5f5 | #ececec | #d9d9d9 | #c2c2c2 | #999999 | #767676 | #5b5b5b | #414141 | #262626 | #121212 |
| green | n/a | #e8f3e9 | #c4e3c7 | #9bcfa0 | #61b367 | #45a54a | #1e8927 | #1a7521 | #1a6120 | #17501d | #113b15 |
| red | n/a | #fce4e8 | #fcbac2 | #f16472 | #e12d3c | #c51322 | #b0050c | #8d070b | #75060a | #630306 | #430a0c |
| orange | n/a | #fdf8e9 | #fcecbb | #fddb72 | #efbe25 | #e08d05 | #d87b02 | #ae6405 | #894f01 | #693c02 | #513005 |

Black and white: `--foundation-color-black-000` `#000000`, `--foundation-color-white-1000` `#ffffff`.

## Semantic: Interactive
Emphasis families: **strong** (filled primary), **medium**, **light**, **muted** (low emphasis), **neutral**; `-alt` is the dark grey variant (Tone Alt), `-negative` and `-positive` are the functional tones.

### Background
Pattern: `--semantic-color-interactive-background-{emphasis}-{state}`. Cells show the Foundation alias (without the `--foundation-color-` prefix) and its value.

| Emphasis | Default | Hover | Active | Disabled |
|---|---|---|---|---|
| strong | `blue-a-500` #007ab3 | `blue-a-600` #006192 | `blue-a-700` #075994 | `blue-a-500` #007ab3 |
| strong-alt | `grey-900` #121212 | `grey-800` #262626 | `grey-700` #414141 | `grey-900` #121212 |
| strong-negative | `red-300` #e12d3c | `red-400` #c51322 | `red-500` #b0050c | `red-300` #e12d3c |
| strong-positive | `green-500` #1e8927 | `green-600` #1a7521 | `green-700` #1a6120 | `green-500` #1e8927 |
| medium | `blue-a-200` #86cff4 | `blue-a-300` #55c0f6 | `blue-a-400` #008ed6 | `blue-a-200` #86cff4 |
| medium-alt | `grey-500` #767676 | `grey-600` #5b5b5b | `grey-700` #414141 | `grey-500` #767676 |
| light | `blue-a-025` #f1f9fa | `blue-a-050` #d9eaf2 | `blue-a-100` #b7ddf0 | `blue-a-025` #f1f9fa |
| light-alt | `grey-050` #f5f5f5 | `grey-100` #ececec | `grey-200` #d9d9d9 | `grey-050` #f5f5f5 |
| light-negative | `red-050` #fce4e8 | `red-100` #fcbac2 | `red-200` #f16472 | `red-050` #fce4e8 |
| light-positive | `green-050` #e8f3e9 | `green-100` #c4e3c7 | `green-200` #9bcfa0 | `green-050` #e8f3e9 |
| muted | `white-1000` #ffffff | `blue-a-025` #f1f9fa | `blue-a-050` #d9eaf2 | `white-1000` #ffffff |
| muted-alt | `white-1000` #ffffff | `grey-050` #f5f5f5 | `grey-100` #ececec | `white-1000` #ffffff |
| neutral | `white-1000` #ffffff | `white-1000` #ffffff | `white-1000` #ffffff | `white-1000` #ffffff |

### Text
Pattern: `--semantic-color-interactive-text-{emphasis}-{state}`. Cells show the Foundation alias (without the `--foundation-color-` prefix) and its value.

| Emphasis | Default | Hover | Active | Disabled |
|---|---|---|---|---|
| strong | `blue-a-500` #007ab3 | `blue-a-600` #006192 | `blue-a-700` #075994 | `blue-a-500` #007ab3 |
| strong-alt | `grey-900` #121212 | `grey-800` #262626 | `grey-700` #414141 | `grey-900` #121212 |
| strong-negative | `red-300` #e12d3c | `red-400` #c51322 | `red-500` #b0050c | `red-300` #e12d3c |
| strong-positive | `green-500` #1e8927 | `green-600` #1a7521 | `green-700` #1a6120 | `green-500` #1e8927 |
| medium | `blue-a-200` #86cff4 | `blue-a-300` #55c0f6 | `blue-a-400` #008ed6 | `blue-a-200` #86cff4 |
| medium-alt | `grey-500` #767676 | `grey-600` #5b5b5b | `grey-700` #414141 | `grey-500` #767676 |
| light | `blue-a-025` #f1f9fa | `blue-a-050` #d9eaf2 | `blue-a-100` #b7ddf0 | `blue-a-025` #f1f9fa |
| light-alt | `grey-050` #f5f5f5 | `grey-100` #ececec | `grey-200` #d9d9d9 | `grey-050` #f5f5f5 |
| light-negative | `red-050` #fce4e8 | `red-100` #fcbac2 | `red-200` #f16472 | `red-050` #fce4e8 |
| light-positive | `green-050` #e8f3e9 | `green-100` #c4e3c7 | `green-200` #9bcfa0 | `green-050` #e8f3e9 |
| muted | `white-1000` #ffffff | `blue-a-025` #f1f9fa | `blue-a-050` #d9eaf2 | `white-1000` #ffffff |
| muted-alt | `white-1000` #ffffff | `grey-050` #f5f5f5 | `grey-100` #ececec | `white-1000` #ffffff |
| neutral | `white-1000` #ffffff | `white-1000` #ffffff | `white-1000` #ffffff | `white-1000` #ffffff |

### Border
Pattern: `--semantic-color-interactive-border-{emphasis}-{state}`. Cells show the Foundation alias (without the `--foundation-color-` prefix) and its value.

| Emphasis | Default | Hover | Active | Disabled |
|---|---|---|---|---|
| strong | `blue-a-500` #007ab3 | `blue-a-600` #006192 | `blue-a-700` #075994 | `blue-a-500` #007ab3 |
| strong-alt | `grey-900` #121212 | `grey-800` #262626 | `grey-700` #414141 | `grey-900` #121212 |
| strong-negative | `red-300` #e12d3c | `red-400` #c51322 | `red-500` #b0050c | `red-300` #e12d3c |
| strong-positive | `green-500` #1e8927 | `green-600` #1a7521 | `green-700` #1a6120 | `green-500` #1e8927 |
| medium | `blue-a-200` #86cff4 | `blue-a-300` #55c0f6 | `blue-a-400` #008ed6 | `blue-a-200` #86cff4 |
| medium-alt | `grey-500` #767676 | `grey-600` #5b5b5b | `grey-700` #414141 | `grey-500` #767676 |
| light | `blue-a-025` #f1f9fa | `blue-a-050` #d9eaf2 | `blue-a-100` #b7ddf0 | `blue-a-025` #f1f9fa |
| light-alt | `grey-050` #f5f5f5 | `grey-100` #ececec | `grey-200` #d9d9d9 | `grey-050` #f5f5f5 |
| light-negative | `red-050` #fce4e8 | `red-100` #fcbac2 | `red-200` #f16472 | `red-050` #fce4e8 |
| light-positive | `green-050` #e8f3e9 | `green-100` #c4e3c7 | `green-200` #9bcfa0 | `green-050` #e8f3e9 |
| muted | `white-1000` #ffffff | `blue-a-025` #f1f9fa | `blue-a-050` #d9eaf2 | `white-1000` #ffffff |
| muted-alt | `white-1000` #ffffff | `grey-050` #f5f5f5 | `grey-100` #ececec | `white-1000` #ffffff |
| neutral | `white-1000` #ffffff | `white-1000` #ffffff | `white-1000` #ffffff | `white-1000` #ffffff |

Other border tokens:

| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` | `#008ed6` |

### Icon
Pattern: `--semantic-color-interactive-icon-{emphasis}-{state}`. Cells show the Foundation alias (without the `--foundation-color-` prefix) and its value.

| Emphasis | Default | Hover | Active | Disabled |
|---|---|---|---|---|
| strong | `blue-a-500` #007ab3 | `blue-a-600` #006192 | `blue-a-700` #075994 | `blue-a-500` #007ab3 |
| strong-alt | `grey-900` #121212 | `grey-800` #262626 | `grey-700` #414141 | `grey-900` #121212 |
| strong-negative | `red-300` #e12d3c | `red-400` #c51322 | `red-500` #b0050c | `red-300` #e12d3c |
| strong-positive | `green-500` #1e8927 | `green-600` #1a7521 | `green-700` #1a6120 | `green-500` #1e8927 |
| medium | `blue-a-200` #86cff4 | `blue-a-300` #55c0f6 | `blue-a-400` #008ed6 | `blue-a-200` #86cff4 |
| medium-alt | `grey-500` #767676 | `grey-600` #5b5b5b | `grey-700` #414141 | `grey-500` #767676 |
| light | `blue-a-025` #f1f9fa | `blue-a-050` #d9eaf2 | `blue-a-100` #b7ddf0 | `blue-a-025` #f1f9fa |
| light-alt | `grey-050` #f5f5f5 | `grey-100` #ececec | `grey-200` #d9d9d9 | `grey-050` #f5f5f5 |
| light-negative | `red-050` #fce4e8 | `red-100` #fcbac2 | `red-200` #f16472 | `red-050` #fce4e8 |
| light-positive | `green-050` #e8f3e9 | `green-100` #c4e3c7 | `green-200` #9bcfa0 | `green-050` #e8f3e9 |
| muted | `white-1000` #ffffff | `blue-a-025` #f1f9fa | `blue-a-050` #d9eaf2 | `white-1000` #ffffff |
| muted-alt | `white-1000` #ffffff | `grey-050` #f5f5f5 | `grey-100` #ececec | `white-1000` #ffffff |
| neutral | `white-1000` #ffffff | `white-1000` #ffffff | `white-1000` #ffffff | `white-1000` #ffffff |

## Semantic: Static
### Background
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-color-static-background-brand` | `--foundation-color-blue-a-800` | `#003781` |
| `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` | `#ffffff` |
| `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` | `#f5f5f5` |
| `--semantic-color-static-background-main-tertiary` | `--foundation-color-grey-100` | `#ececec` |
| `--semantic-color-static-background-main-alt-primary` | `--foundation-color-blue-a-025` | `#f1f9fa` |
| `--semantic-color-static-background-main-alt-secondary` | `--foundation-color-blue-a-050` | `#d9eaf2` |
| `--semantic-color-static-background-main-alt-tertiary` | `--foundation-color-blue-a-100` | `#b7ddf0` |
| `--semantic-color-static-background-subtle-primary` | `--foundation-color-white-1000` | `#ffffff` |
| `--semantic-color-static-background-subtle-secondary` | `--foundation-color-grey-050` | `#f5f5f5` |
| `--semantic-color-static-background-subtle-tertiary` | `--foundation-color-blue-a-025` | `#f1f9fa` |
| `--semantic-color-static-background-subtle-functional-positive` | `--foundation-color-green-050` | `#e8f3e9` |
| `--semantic-color-static-background-subtle-functional-negative` | `--foundation-color-red-050` | `#fce4e8` |
| `--semantic-color-static-background-subtle-functional-warning` | `--foundation-color-orange-050` | `#fdf8e9` |
| `--semantic-color-static-background-subtle-functional-informative` | `--foundation-color-blue-b-050` | `#ecf0f8` |
| `--semantic-color-static-background-functional-positive` | `--foundation-color-green-500` | `#1e8927` |
| `--semantic-color-static-background-functional-negative` | `--foundation-color-red-500` | `#b0050c` |
| `--semantic-color-static-background-functional-warning` | `--foundation-color-orange-400` | `#e08d05` |
| `--semantic-color-static-background-functional-informative` | `--foundation-color-blue-b-500` | `#496ebd` |
| `--semantic-color-static-background-functional-signal` | `--foundation-color-red-300` | `#e12d3c` |
| `--semantic-color-static-background-functional-subtle-positive` | `--foundation-color-green-050` | `#e8f3e9` |
| `--semantic-color-static-background-functional-subtle-negative` | `--foundation-color-red-050` | `#fce4e8` |
| `--semantic-color-static-background-functional-subtle-warning` | `--foundation-color-orange-050` | `#fdf8e9` |
| `--semantic-color-static-background-functional-subtle-informative` | `--foundation-color-blue-b-050` | `#ecf0f8` |
| `--semantic-color-static-background-functional-subtle-signal` | `--foundation-color-red-100` | `#fcbac2` |
| `--semantic-color-static-background-accent-primary` | `--foundation-color-grey-900` | `#121212` |
| `--semantic-color-static-background-accent-secondary` | `--foundation-color-grey-500` | `#767676` |
| `--semantic-color-static-background-accent-tertiary` | `--foundation-color-grey-200` | `#d9d9d9` |
| `--semantic-color-static-background-grade-1` | `--foundation-color-green-600` | `#1a7521` |
| `--semantic-color-static-background-grade-2` | `--foundation-color-green-400` | `#45a54a` |
| `--semantic-color-static-background-grade-3` | `--foundation-color-green-300` | `#61b367` |
| `--semantic-color-static-background-grade-4` | `--foundation-color-orange-200` | `#fddb72` |
| `--semantic-color-static-background-grade-5` | `--foundation-color-orange-300` | `#efbe25` |
| `--semantic-color-static-background-grade-6` | `--foundation-color-orange-400` | `#e08d05` |
| `--semantic-color-static-background-grade-7` | `--foundation-color-red-400` | `#c51322` |
| `--semantic-color-static-background-grade-8` | `--foundation-color-red-600` | `#8d070b` |
| `--semantic-color-static-background-grade-9` | `--foundation-color-red-700` | `#75060a` |
| `--semantic-color-static-background-grade-10` | `--foundation-color-red-900` | `#430a0c` |
| `--semantic-color-static-background-grade-none` | `--foundation-color-grey-300` | `#c2c2c2` |

Grade backgrounds (`grade-1` to `grade-10`, `grade-none`) are reserved for the Grade component scale.

### Text
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-color-static-text-brand` | `--foundation-color-blue-a-800` | `#003781` |
| `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` | `#121212` |
| `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` | `#414141` |
| `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` | `#767676` |
| `--semantic-color-static-text-main-reversed` | `--foundation-color-white-1000` | `#ffffff` |
| `--semantic-color-static-text-main-alt-primary` | `--foundation-color-blue-a-500` | `#007ab3` |
| `--semantic-color-static-text-main-alt-secondary` | `--foundation-color-blue-a-600` | `#006192` |
| `--semantic-color-static-text-main-alt-tertiary` | `--foundation-color-blue-a-700` | `#075994` |
| `--semantic-color-static-text-main-functional-positive` | `--foundation-color-green-500` | `#1e8927` |
| `--semantic-color-static-text-main-functional-negative` | `--foundation-color-red-500` | `#b0050c` |
| `--semantic-color-static-text-main-functional-warning` | `--foundation-color-orange-400` | `#e08d05` |
| `--semantic-color-static-text-main-functional-informative` | `--foundation-color-blue-b-500` | `#496ebd` |
| `--semantic-color-static-text-subtle-primary` | `--foundation-color-white-1000` | `#ffffff` |
| `--semantic-color-static-text-subtle-secondary` | `--foundation-color-grey-050` | `#f5f5f5` |
| `--semantic-color-static-text-subtle-tertiary` | `--foundation-color-grey-200` | `#d9d9d9` |
| `--semantic-color-static-text-subtle-functional-positive` | `--foundation-color-green-050` | `#e8f3e9` |
| `--semantic-color-static-text-subtle-functional-negative` | `--foundation-color-red-050` | `#fce4e8` |
| `--semantic-color-static-text-subtle-functional-warning` | `--foundation-color-orange-050` | `#fdf8e9` |
| `--semantic-color-static-text-subtle-functional-informative` | `--foundation-color-blue-b-050` | `#ecf0f8` |

### Border
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-color-static-border-brand` | `--foundation-color-blue-a-800` | `#003781` |
| `--semantic-color-static-border-main-primary` | `--foundation-color-grey-900` | `#121212` |
| `--semantic-color-static-border-main-secondary` | `--foundation-color-grey-700` | `#414141` |
| `--semantic-color-static-border-main-tertiary` | `--foundation-color-grey-500` | `#767676` |
| `--semantic-color-static-border-main-functional-positive` | `--foundation-color-green-500` | `#1e8927` |
| `--semantic-color-static-border-main-functional-negative` | `--foundation-color-red-500` | `#b0050c` |
| `--semantic-color-static-border-main-functional-warning` | `--foundation-color-orange-400` | `#e08d05` |
| `--semantic-color-static-border-main-functional-informative` | `--foundation-color-blue-b-500` | `#496ebd` |
| `--semantic-color-static-border-subtle-primary` | `--foundation-color-white-1000` | `#ffffff` |
| `--semantic-color-static-border-subtle-secondary` | `--foundation-color-grey-050` | `#f5f5f5` |
| `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` | `#d9d9d9` |
| `--semantic-color-static-border-subtle-functional-positive` | `--foundation-color-green-050` | `#e8f3e9` |
| `--semantic-color-static-border-subtle-functional-negative` | `--foundation-color-red-050` | `#fce4e8` |
| `--semantic-color-static-border-subtle-functional-warning` | `--foundation-color-orange-050` | `#fdf8e9` |
| `--semantic-color-static-border-subtle-functional-informative` | `--foundation-color-blue-b-050` | `#ecf0f8` |

### Icon
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-color-static-icon-brand` | `--foundation-color-blue-a-800` | `#003781` |
| `--semantic-color-static-icon-main-primary` | `--foundation-color-grey-900` | `#121212` |
| `--semantic-color-static-icon-main-secondary` | `--foundation-color-grey-700` | `#414141` |
| `--semantic-color-static-icon-main-tertiary` | `--foundation-color-grey-500` | `#767676` |
| `--semantic-color-static-icon-main-functional-positive` | `--foundation-color-green-500` | `#1e8927` |
| `--semantic-color-static-icon-main-functional-negative` | `--foundation-color-red-500` | `#b0050c` |
| `--semantic-color-static-icon-main-functional-warning` | `--foundation-color-orange-400` | `#e08d05` |
| `--semantic-color-static-icon-main-functional-informative` | `--foundation-color-blue-b-500` | `#496ebd` |
| `--semantic-color-static-icon-subtle-primary` | `--foundation-color-white-1000` | `#ffffff` |
| `--semantic-color-static-icon-subtle-secondary` | `--foundation-color-grey-050` | `#f5f5f5` |
| `--semantic-color-static-icon-subtle-tertiary` | `--foundation-color-grey-200` | `#d9d9d9` |
| `--semantic-color-static-icon-subtle-functional-positive` | `--foundation-color-green-050` | `#e8f3e9` |
| `--semantic-color-static-icon-subtle-functional-negative` | `--foundation-color-red-050` | `#fce4e8` |
| `--semantic-color-static-icon-subtle-functional-warning` | `--foundation-color-orange-050` | `#fdf8e9` |
| `--semantic-color-static-icon-subtle-functional-informative` | `--foundation-color-blue-b-050` | `#ecf0f8` |

### Overlay and favorite
| Semantic token (CSS var) | Foundation alias | Value |
|---|---|---|
| `--semantic-color-overlay-backdrop` | none (raw value) | `rgba(0, 0, 0, 0.35)` |
| `--semantic-color-static-icon-favorite` | `--foundation-color-orange-300` | `#efbe25` |

## Figma and code differences
- Figma `Color/Static/Background/Subtle/Fuctional/*` (typo "Fuctional") maps to code `--semantic-color-static-background-subtle-functional-*`.
- Figma `Color/Static/Background/Grade/#1` to `#10` map to code `--semantic-color-static-background-grade-1` to `-10`.
- Figma `Color/Interactive/Icon/Featured/*` (Orange/300, hover and active Orange/200) has no code equivalent; code uses `--semantic-color-static-icon-favorite` (orange-300) for the favorite star.
- Code only: `--semantic-color-static-text-main-reversed` (white) and `--semantic-color-overlay-backdrop` (raw `rgba(0, 0, 0, 0.35)`, not aliased; Figma has `Measurement/Opacity/Overlay` = 35 instead).

## Do / Don't
- Do use `interactive-*-strong-*` for the one primary action of a view. Don't use blue for decoration or for informational status.
- Do pair a functional color with a label or icon. Don't encode status by color alone.
- Do take the color from a Semantic token. Don't reference a Foundation token or a hex value in a component.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-11-04 | First ZeroHeight page, generated from `_semantic.scss` and checked against the Figma Semantic collection. |
