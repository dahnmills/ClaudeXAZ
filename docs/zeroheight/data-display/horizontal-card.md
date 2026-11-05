# Horizontal Card
**Status**: Design New · Tech In code
A generic full-width list row for search results and history lists (buyers, policies, drafts) that expands like an accordion to show details.
Figma: [Components] Data Display › page Horizontal Card (node 680:6820, Type=Slot variants 2045:1326 and 2045:1539) · Storybook: `Design System/Data Display/Result Card` › Closed (also `Design System/Data Display/Policy Result Card` › Issued) · Code: `shared/ui/result-card` (`ds-result-card`), `shared/ui/policy-result-card` (`ds-policy-result-card`)

## Overview
The master owns the structure and the rules that must stay identical from one list to another: padding, border, the Open border color, the Favorite and Toggle details actions at the same place, and the divider above Details. The feature file owns the content and drops it in the slots Leading, Content, Trailing, Extra actions and Details. Its only structural variant is `Open` (False, True). Embed the Storybook stories `Result Card › Closed` and `Result Card › Open`, and the Figma frame `🆕 Type=Slot · Documentation` (2046:1393) with the set.

## When to use / When not to use
- Use when listing search results or history entries where each row is one object (buyer, policy, draft).
- Use when each row needs a short summary and expandable details on demand.
- Use when rows share the same actions (favorite, toggle details, an optional extra action such as "+ Create").
- Don't use when the data is tabular and compared column by column → use Table instead.
- Don't use when the content is a free group of sections with no object identity → use Accordion instead.
- Don't use for a dashboard tile or a widget → use Card or Card with Slot (Widget Card) instead.
- Don't rebuild the card frame or its actions in a local component → put local content in the slots.

## Anatomy
1. Container (`Type=Slot`): vertical, white background, 1 px border, 4 px radius, 16 px top and bottom padding, 8 px gap.
2. `Main` row (horizontal, 16 px side padding, 24 px gap):
   1. `Leading` slot: the object tile (Icon Tile).
   2. `Content` slot: name line and second line (for example name, city, Identifier, address).
   3. `Trailing` slot: score, badge, date, history date (32 px gap).
   4. `Actions` (8 px gap):
      1. `Extra actions` slot, shown with `Show extra actions` (for example "+ Create"; keep a 24 px spacer when it does not apply).
      2. `Favorite`: exposed private atom `.Favorite` (plain Button Icon, star outline or filled) with its own `Favorited` property.
      3. `Toggle details`: Button Icon (chevron down or up).
3. `Divider` (Open=True only), above Details.
4. `Details` slot (Open=True only, 16 px side padding, 24 px gap): Card `.Columns` with Layout Horizontal.

Private atoms on the page: `.Favorite` (2074:1404) is current. `Row`, `.Order`, `.Data`, `.Tags`, `.Action`, `. Outcome`, `. Tendancy` belong to the older `Type=Collapsible` and `Type=Select` variants.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Open | Variant | **False** / True | `open` (boolean, default `false`) | Open=True adds the Divider and the Details slot, and switches the border to the strong interactive blue. Code emits `toggled` when Toggle details is clicked; the page owns the state. |
| Type | Variant | Select / **Collapsible** / Slot | none | Use `Slot`: it is the current generic master. `Collapsible` and `Select` are earlier fixed-content variants (Row atoms); the default is still `Collapsible`. |
| Show extra actions | Boolean | **False** / True | none (content projected or built in) | `ds-result-card` always renders an "Add" Button Icon, hidden (`visibility`) when the company exists. |
| Leading | Slot | Icon Tile | built in (`ds-icon-tile` size m) | |
| Content | Slot | name line + second line | built from `data` (`ResultCardData` / `PolicyResultData`) | |
| Trailing | Slot | score, badge, date | built in (score + `ds-progress-bar`); extra meta through `<ng-content select="[slot=meta]">` | |
| Extra actions | Slot | e.g. + Create | built in (`added` output) | |
| Details | Slot | Card `.Columns`, Layout Horizontal | built in (`ds-properties-panel`, 3 columns, flat) | |
| Favorited (on exposed `.Favorite`) | Variant | **False** / True | `favorited` (boolean) | Set on the card instance; no card-level variant. Code emits `starred`. |
| Size | removed | none | `size` (`'s' \| 'm'`, default `'m'`) | Removed from Figma; code still has a compact `s` (8 px padding) for history lists. |

Code inputs with no Figma property: `data` (required), `internal` (`ds-result-card`: forces Info provider "ES"), `today` (`ds-policy-result-card`). Outputs: `toggled`, `added`, `starred`, `opened` (`ds-result-card`); `toggled`, `starred`, `opened` (`ds-policy-result-card`).

Slots: Leading (object tile), Content (name and second line), Trailing (score, badge, dates), Extra actions (optional extra action), Details (columns of label and value).

Exposed nested instances: `.Favorite` (property `Favorited`).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Closed | `open` false | `Open=False` |
| Open | `open` true, host class `ds-result-card--open` (strong blue border, divider and details) | `Open=True` |
| Favorited | `favorited` true (filled star, favorite color) | `.Favorite` `Favorited=True` |
| Not existing (buyer) | `data.exists` false: name not a link, favorite and toggle disabled, Add visible | To be defined (not drawn on the Slot master) |
| Hover, focus of actions | Provided by `ds-button-icon` and `ds-link` | Provided by the nested atoms |

## Tokens
Figma bindings on the container: fill `Color/Interactive/Background/Neutral/Default`, stroke `Color/Interactive/Border/Strong/Default` (Open=True), radius `Border/Radius/S`, stroke `Border/Size/S`, vertical padding `Measurement/Spacing/M`, gap `Measurement/Spacing/S`. Code (`ds-result-card`):

| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | background | `--semantic-color-interactive-background-neutral-default` | `--foundation-color-white-1000` |
| Container (closed) | border color | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Container (open) | border color | `--semantic-color-interactive-border-strong-default` | `--foundation-color-blue-a-500` |
| Container | border radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Container | padding | `--semantic-measurement-spacing-m` (size s: `-s`) | `--foundation-spacing-16` (8) |
| Container | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Main | gap | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Trailing | gap | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Actions | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Name line | font size, weight, line height | `--semantic-font-text-style-size-l`, `-font-weight-semi-bold`, `-line-height-l` | 16 px, 600, 24 px |
| Name | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| City | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| Address | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Score value | font size, line height | `--semantic-font-text-style-size-s`, `-line-height-s` | 12 px, 16 px |
| Favorite (on) | icon color | `--semantic-color-static-icon-favorite` | `--foundation-color-orange-300` |
| Details | padding, gap | `--semantic-measurement-spacing-m`, `-spacing-l` | 16 px, 24 px |

## Accessibility
- The row is not a single interactive element: each action is its own control (`ds-link` on the name, `ds-button-icon` for Add, Favorite and Toggle details), reachable with Tab.
- Required labels: Favorite `ariaLabel` "Favorite" or "Unfavorite"; Toggle details "Toggle details"; Add "Add". Tooltips explain disabled actions ("Create the company first to add it to favorites").
- The hidden Add button gets `tabindex="-1"` and `aria-hidden="true"` so it stays out of the tab order while keeping its place.
- Toggle details does not expose `aria-expanded` or `aria-controls` in code: To be defined.
- Open state is shown by the chevron direction and the blue border, never by color alone.

## Content guidelines
- One content component per object type in the feature file (buyer, policy, draft), dropped in the slots.
- Content slot: the name first (semi-bold, the link to the object), then secondary information (city, identifier, address).
- Keep a 24 px spacer in Extra actions when the action does not apply, so Favorite and Toggle stay aligned down the list.

## Do / Don't
- Do: build a local content component per object type and place it in the slots. Don't: rebuild the card frame or the actions in a local component.
- Do: set `Favorited` on the exposed `.Favorite` of the instance. Don't: detach the card to change the star.
- Do: use `Type=Slot`. Don't: start new work from `Type=Collapsible` or `Type=Select`.

## Related components
Composes: Icon Tile, Identifier, Progress Bar, Button Icon, Link, Tooltip, Divider, Card `.Columns` (Figma) / Properties Panel (code) · Used by: Search results and history lists (Search V2).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | November 3, 2026 | Type=Slot added for the Search V2 file (replaces Result Card and Policy Result Card). |
| 1.0.0 (update) | To be defined | `Favorited` variant replaced by the exposed `.Favorite` atom; `Size` variant removed. Open is the only structural variant. |
| Docs | 2026-11-04 | First ZeroHeight page. |

Notes (Figma and code gaps):
- Figma `_Design system header` still reads Design WIP, Tech Not started; the Type=Slot documentation frame reads Design New, Tech In code.
- The Type=Slot documentation frame still mentions "S for Size S" padding, although Size has been removed.
- Code keeps `size` (`s`, `m`); Figma has no Size.
- Code has two components (`ds-result-card`, `ds-policy-result-card`) with built-in content; Figma has one slot-based master.
- Default variant in Figma is `Type=Collapsible`, not `Type=Slot`.
