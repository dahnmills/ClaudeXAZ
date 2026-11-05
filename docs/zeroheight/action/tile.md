# Tile
**Status**: Design WIP · Tech In code
A square, selectable button with an icon and a short label, used to pick a type or a category.
Figma: [Components] Action › page Tile (node 615:84, set named `Tiles`) · Storybook: `Design System/Action/Tile` (id `design-system-action-tile--playground`) · Code: `shared/ui/tile` (`ds-tile`)

## Overview
Tile is a 104 x 104px button with a centered icon above a label. It toggles between selected and not selected, so a row of tiles works as a visual picker. Embed the Storybook story `States` as the live example, and the Figma component set `Tiles` (node 615:84) as the visual reference.

## When to use / When not to use
- Use to choose a type or a category where an icon helps recognition (buyer type, entity type).
- Use in a row of three to six tiles of the same size.
- Use when the choice must stay visible after it is made.
- Don't use when the option needs a description → use Visual Button or Radio Card instead.
- Don't use for a plain action → use Button or Button Icon instead.
- Don't use for many options or long labels → use Dropdown (Select) instead.

## Anatomy
1. `Tiles` (container): 104 x 104px, padding 8px, gap 4px, 4px radius, light grey plate.
2. `Icon` (`Icon Functional`, glyph `User-Business` by default): 24px, Grey/700, blue when selected.
3. `Content` › label: Body M semi-bold, 14px / 20px, Grey/900.
4. Sub label (Figma, `Sub Label` boolean): a second line under the label. No code equivalent.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Selected | Variant | **False**, True | `selected: boolean` (default `false`) | Written to `aria-pressed`. |
| State | Variant | **Default**, Hover, Active, Disabled | Hover, Active: CSS. Disabled: `disabled: boolean` | |
| Sub Label | Boolean | **false** | none | Code gap: no sub label input. |
| (none) | | | `label: string` (required) | |
| (none) | | | `icon: IconName` (default `'user'`) | Figma swaps the glyph in `Icon`. |
| (none) | | | `clicked` (output) | Click, Enter, Space. |

Slots: none.

Exposed nested instances: none (the icon glyph is changed through the `Icon` instance).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover`: light blue plate | `State=Hover` |
| Active | `:active`: darker blue plate | `State=Active` |
| Selected | `selected` input: lightest blue plate, blue icon, `aria-pressed="true"` | `Selected=True` |
| Disabled | `disabled` input: `aria-disabled`, out of tab order, opacity 0.40 | `State=Disabled` |
| Focus | no `:focus-visible` style in the SCSS (browser default) | no variant |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | width, height | `--semantic-measurement-size-tile` | `--foundation-spacing-104` (104px) |
| Container | gap, padding | `--semantic-measurement-spacing-xs`, `--semantic-measurement-spacing-s` | `--foundation-spacing-4`, `--foundation-spacing-8` |
| Container | radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Container | background rest / hover / active | `--semantic-color-static-background-main-secondary`, `--semantic-color-interactive-background-light-{hover,active}` | `--foundation-color-grey-050`, `--foundation-color-blue-a-050` / `-100` |
| Selected | background | `--semantic-color-interactive-background-light-default` | `--foundation-color-blue-a-025` |
| Selected | icon color | `--semantic-color-interactive-text-strong-default` | `--foundation-color-blue-a-500` |
| Icon | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Label | font, color | `--semantic-font-family`, `--semantic-font-text-style-size-m`, `--semantic-font-text-style-font-weight-semi-bold`, `--semantic-font-text-style-line-height-m`, `--semantic-color-static-text-main-primary` | `--foundation-font-size-14`, `--foundation-font-weight-semi-bold`, `--foundation-font-line-height-20`, `--foundation-color-grey-900` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- `role="button"` with `aria-pressed` that reflects `selected`; Enter and Space toggle through `clicked`.
- Disabled tiles are out of the tab order and carry `aria-disabled`.
- Wrap a set of tiles in a labeled group (for example a `fieldset` with a legend) so the choice has a name.
- Selected differs from hover only by a lighter blue plate and a blue icon; check that the selected state is distinguishable without color.
- No visible focus style is defined; the browser default ring applies.

## Content guidelines
- One or two words, on one line inside 104px.
- Sentence case, no final punctuation, no em dash.

## Do / Don't
- Do use an icon that clearly matches the label; don't reuse the same icon for several tiles.
- Do keep all tiles of a row the same size; don't mix Tiles and Visual Buttons in one choice.

## Related components
Composes: Icon (`ds-icon`) · Used by: no other DS component.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. Not listed on the Status page of the Action file. |
