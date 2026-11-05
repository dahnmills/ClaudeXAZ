# Card
**Status**: Design WIP · Tech In code
A white, bordered container that groups one coherent block of information on a grey page.
Figma: [Components] Data Display › page Card (node 354:4525) · Storybook: `Design System/Data Display/Card` › Default · Code: `shared/ui/card` (`ds-card`)

## Overview
Card is the base surface of Qirin screens: white background, 1 px subtle border, 4 px radius, flat at rest. In Figma the set ships ready-made card types (figures, company profile, key info, empty state, redirect, slot); in code `ds-card` is only the box and the content is projected. Embed the Storybook story `Default` and the Figma frame `_Design system header` (node 1448:11021, version 2.0.0).

## When to use / When not to use
- Use when a block of related data (a label/value panel, a figure, a company profile) needs its own surface on the Surface Secondary page.
- Use when several blocks sit side by side in a grid and each must read as a unit.
- Use `Type=Empty State` when a block has no data, so the grid keeps its rhythm.
- Use `Type=Key Info` for one headline figure with its label and an optional action.
- Don't use when the content is a board widget with a title bar and actions → use Widget Card (Figma `Card` with Slot) instead.
- Don't use when the content is a list of rows → use Table instead.
- Don't use when the content is a collapsible section → use Accordion or Collapsible Table instead.
- Don't use a card inside a card to create depth: use spacing and a divider.

## Anatomy
1. Container (the variant frame): background, border, radius and 24 px padding (`Type=Default`, `Empty State`, `Company Profile`).
2. `.Columns` (exposed): label/value panel with a header (`.Title`, `.Action`, separator) and 1 to 4 columns of rows. Properties `# Columns` (1/2/3/4), `Layout` (Vertical/Horizontal/Mixed), `Loading` (skeleton rows).
3. `.Title`: title and optional subtitle (`Subtitle` boolean, `Vertical` True/False/with tag). `.Title (loading)` is its skeleton.
4. `.Action`: one or two Button Icon instances (`Secondary` boolean, `Multiple` True/False). `.Action (loading)` is its skeleton.
5. `.Key Info`: optional left visual (`.Left`, Icon or Currency), a value (`.Content`, Text/Tag/Link), a label and an `.Action`. Properties `Left`, `Actions`, `Hightlighted`, `Loading`.
6. `.Company Profile`: product icon, name, subtitles and a Grade (booleans `Subtitle`, `Grade`; `Loading`).
7. `.Missing Data`: title, actions, separator and the "No data available" message (`Actions`, `Loading`).
8. `.Settings`: illustration, text and a Button, used by `Type=Redirect` (`Reversed`, `Align` Left/Right, `Loading`).
9. `.Layout`, `.Label`, `.Content`, `.Left (loading)`: internal building blocks of the types above.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Type | Variant | Redirect, Company Profile, Key Info, Slot, Empty State, **Default** | none | Code has no types: the content of each type is composed by the consumer inside `ds-card`. |
| Action | Boolean | **True**, False | none | Shows the action atom. In code, project a `ds-button-icon`. |
| none | | | `noPadding` (boolean, false) | Removes the 24 px padding when the content manages its own rhythm. Figma `Type=Slot`, `Redirect` and `Key Info` have 0 padding. |
| none | | | `loading` (boolean, false) | Sets `aria-busy`. Figma models loading on each atom (`Loading` variant). |
| none | | | `elevated` (boolean, false) | Adds the card shadow (open or active state). Not in Figma. |
| none | | | `tone` (`default` / `positive` / `negative`) | Marks a pending addition or removal. Not in Figma. |

Slots: `Type=Slot` holds a free `Content` frame. In code the default `<ng-content />` is the only slot.

Exposed nested instances: `.Columns` (`# Columns`, `Layout`, `Loading`) on `Type=Default`; `.Company Profile` (`Subtitle`, `Grade`, `Loading`); `.Missing Data` (`Actions`, `Loading`); `.Key Info` (`Left`, `Actions`, `Hightlighted`, `Loading`); `.Settings` (`Reversed`, `Align`, `Loading`). Inside them, `.Title` and `.Action` are exposed too.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | none | Container at rest, no shadow |
| Loading | `loading` input (`aria-busy="true"`); skeletons are projected by the consumer | `Loading=True` on each atom (Skeleton Item) |
| Elevated | `elevated` input | Not drawn |
| Positive / Negative tone | `tone` input | Not drawn |
| Empty | Compose the empty message | `Type=Empty State` (`.Missing Data`) |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Container | border | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Container | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Container | padding | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Elevated | box-shadow | `--semantic-shadow-card` | `--foundation-shadow-bottom-100` |
| Tone positive | background / border-color | `--semantic-color-static-background-functional-subtle-positive` / `--semantic-color-static-border-main-functional-positive` | `--foundation-color-green-050` / `--foundation-color-green-500` |
| Tone negative | background / border-color | `--semantic-color-static-background-functional-subtle-negative` / `--semantic-color-static-border-main-functional-negative` | `--foundation-color-red-050` / `--foundation-color-red-500` |

## Accessibility
- `ds-card` is a plain container with no role; give the block a heading inside it so it is reachable by heading navigation.
- `loading` sets `aria-busy="true"`; announce the end of loading through the content itself.
- Actions inside the card are `ds-button-icon` with a mandatory `ariaLabel`.
- Tone colors never carry meaning alone: pair them with a label (for example a `ds-badge`).
- Border grey-200 on white is decorative; the content provides the contrast.

## Content guidelines
- Title: a noun phrase naming the block ("Buyer information", "Risk"). Sentence case.
- Labels and values in Body M; keep values on one line where possible.
- Empty state: say what is missing ("No data available"), not why the system failed.

## Do / Don't
- Do keep cards flat at rest. Don't add a drop shadow for depth; use `elevated` only for an open or active state.
- Do use `noPadding` when the content has its own padding (a table, a chart). Don't nest a padded card in a padded card.
- Do use the same card type for every block of one grid. Don't mix a Key Info card and a full panel card on the same row without a reason.

## Related components
Composes: Button Icon, Skeleton Item, Grade, Badge, Link, Icon, Divider · Used by: Widget Card, Properties Panel, result and policy cards, Buyer Summary boards.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | To be defined | Version shown in the current Figma header (frame 1448:11021); a 1.0.0 header and a DEPRECATED frame remain on the page. The Figma changelog is a placeholder. |
| Docs | 2026-11-04 | First ZeroHeight page. |
