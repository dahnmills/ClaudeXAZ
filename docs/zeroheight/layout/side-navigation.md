# Side Navigation
**Status**: Design To be defined · Tech In code
Collapsible left navigation for moving between the sections of a dossier or a product area.
Figma: [Components] Layout › component Side Navigation (key `7472d0df1c69d84a49701b96603fe096a864c6a6`; file not accessible, node To be defined) · Storybook: `Design System/Layout/Side Nav` › Default · Code: `shared/ui/side-nav` (`ds-side-nav`, `ds-side-nav-item`)

## Overview
The Side Navigation is a vertical rail on the left of the page: 56 px wide collapsed (icons only, a rail) and 280 px expanded (icon and label). A bottom item toggles between the two. Embed the Storybook story `Default` (and `WithPageLayout` for the shell context) and the Figma component set Side Navigation, variants `Open=True` and `Open=False`.

## When to use / When not to use
- Use when a page has several sections the user moves between often (for example a buyer dossier).
- Use when the navigation must stay visible while the content scrolls.
- Use when screen width matters: the rail keeps sections reachable in 56 px.
- Don't use when the choice is between top-level product areas: → use Header instead.
- Don't use when switching between 2 to 6 views of the same content: → use Tab (in Page Header) instead.
- Don't use when the items are actions, not destinations: → use Flyout Menu or Button instead.

## Anatomy
1. Items list (`Frame 169` in Figma): stack of `.Side Navigation Item`. Code: default content of `ds-side-nav`, a `role="menu"` container.
2. `.Side Navigation Item` (private): one destination. Properties `Selected` and `Has Child`; it exposes the nested `.Item`.
3. `.Item` (private, exposed): the row itself: icon (`Icon` boolean), label, optional `Expand` chevron (`Expandable` boolean), `State`, `Level` (0 or -1, the nesting level). Code: `ds-side-nav-item` with `slot="icon"` (a `ds-icon`) and the label as content.
4. Groups (`Open=True` only): collapsible groups (instances named Company Information, Assessment, Tools, with their own `Open` variant). Their component name is To be defined. Code: no group component.
5. `Bottom`: one `.Side Navigation Item` that opens or closes the panel (`panel-left` icon, "Open panel" / "Close panel").

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Open | Variant | **True**, False | `collapsed` (model, default `true`) | Inverted logic: `Open=True` = `collapsed=false`. Figma default is open, code default is collapsed. |
| `.Side Navigation Item` › Selected | Variant | False, **True** | `ds-side-nav-item` `selected` | Sets `aria-current="page"`. |
| `.Side Navigation Item` › Has Child | Variant | False, **True** | none | No sub-level support in code. |
| `.Item` › State | Variant | **Default**, Hover, Active, Disabled | `disabled`; `:hover` | Active has no code style. |
| `.Item` › Level | Variant | -1, **0** | none | Nesting level, not in code. |
| `.Item` › Icon | Boolean | **true** | `slot="icon"` content | |
| `.Item` › Expandable | Boolean | **true** | none | Chevron for groups. |

Slots: none in Figma. Code: `ds-side-nav` default content (items); `ds-side-nav-item` `slot="icon"` and default content (label).

Exposed nested instances: `.Item` inside `.Side Navigation Item` (surfaces `State`, `Level`, `Icon`, `Expandable`).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Collapsed / expanded | `[(collapsed)]` model, toggled by the bottom item | `Open=False` / `Open=True` |
| Selected | `[selected]="true"` | `Selected=True` |
| Hover | `:hover` (not on selected or disabled) | `State=Hover` |
| Active | none | `State=Active` |
| Focus | `:focus-visible` (outline) | To be defined |
| Disabled | `[disabled]="true"` (`aria-disabled`, `tabindex=-1`, 40 % opacity) | `State=Disabled` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Panel | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Panel | border-right | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Panel | width | none (hard-coded 280 px / 56 px) | none |
| Items list, bottom | gap, padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Bottom | border-top | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Item | height | none (Foundation used directly) | `--foundation-sizing-40` |
| Item | gap, padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Item | border-radius | `--semantic-border-radius-m` | `--foundation-radius-8` |
| Item | background / color | `--semantic-color-static-background-main-secondary` / `--semantic-color-static-text-main-secondary` | `grey-050` / `grey-700` |
| Item hover | background / color | `--semantic-color-static-background-main-alt-primary` / `--semantic-color-interactive-text-strong-default` | `blue-a-025` / `blue-a-500` |
| Item selected | background / color | `--semantic-color-interactive-background-strong-default` / `--semantic-color-interactive-text-neutral-default` | `blue-a-500` / `white-1000` |
| Item selected hover | background | `--semantic-color-interactive-background-strong-hover` | `--foundation-color-blue-a-600` |
| Item disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Item focus | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Item icon | width, height | `--semantic-measurement-sizing-l` | `--foundation-sizing-24` |
| Item label | font | `--semantic-font-text-style-size-l`, `-line-height-l`, `-font-weight-regular` | 16 / 24 / 400 |

## Accessibility
- Host `role="navigation"`; items list `role="menu"`; each item `role="menuitem"`, focusable (`tabindex=0`), activated with Enter and Space.
- The selected item carries `aria-current="page"`; a disabled item carries `aria-disabled` and leaves the tab order.
- The toggle carries `aria-expanded` and an `aria-label` ("Open panel" / "Close panel"). Collapsed, the label is hidden visually: icons must stay recognizable.
- Visible focus outline (`interactive-border-focus`). The label transition should respect reduced motion (not handled in code: To be defined).

## Content guidelines
- Short labels (1 to 3 words), the name of the section, not an action.
- Every item has an icon: in the collapsed rail it is the only cue.

## Do / Don't
- Do keep exactly one selected item. Don't use the selected style to show a hover or a recent visit.
- Do put the panel toggle at the bottom. Don't hide the toggle when the panel is expanded.
- Do use destinations only. Don't mix actions (Export, Delete) into the list.

## Related components
Composes: Side Navigation Item (`.Item`), Icon · Used by: the application shell, buyer dossier pages (Buyer Summary)

## Changelog
| Version | Date | Change |
|---|---|---|
| Docs | 2026-11-04 | First ZeroHeight page. |
| To be defined | To be defined | Figma changelog not accessible. |
