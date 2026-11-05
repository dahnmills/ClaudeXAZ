# Link
**Status**: Design Ready · Tech In code
A text link that takes the user to another page, a section or an external resource.
Figma: [Components] Action › page Link (node 688:4202) · Storybook: `Design System/Action/Link` (id `design-system-action-link--default`) · Code: `shared/ui/link` (`ds-link`)

## Overview
Link is the navigation control of the system: it moves the user somewhere, it does not run an action. It can sit inline in a sentence or stand alone, with an optional icon before or after the label. Embed the Storybook story `Default` as the live example, and the Figma component set `Link` (node 688:4202, frame "Link (no condition)") as the visual reference.

## When to use / When not to use
- Use when the click opens another page, a detail view or an anchor.
- Use inline inside a sentence or a property value ("see the policy").
- Use for an external resource, with `external` so it opens in a new tab.
- Use the Accent (neutral) tone for secondary navigation, such as breadcrumb crumbs.
- Use Reversed on dark or brand surfaces.
- Don't use when the click runs an action (save, delete, submit) → use Button instead.
- Don't use with an icon and no label → use Button Icon instead.
- Don't use for the path to the current page → use Breadcrumb instead.
- Don't use to switch between views of the same content → use Tab instead.

## Anatomy
1. `Link` (container): inline row, gap 4px between icon and label.
2. `Icon Functional` (optional): the icon, placed on the left or on the right through the `Icon` property; glyph swapped through `🔗 Icon` (default `Edit Pen`).
3. `Label` (text): the link text, Body L (16px / 24px) in size M, Body M (14px / 20px) in size S.
4. Focus ring: drawn by CSS around the anchor on keyboard focus (no Figma layer on this set).

Two other sets live on the page: a `Link` set built on the private atom `.Specs` (node 689:4239, properties `State` and `Tone` Neutral, Default, Reversed, with `.Specs` exposing `Label`, `Size`, `Icon`, `Weight`, `Decoration`), and `[DEPRECATED] Link` (node 77:315). `.Specs` is private and must not be used alone.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Tone | Variant | **Default**, Accent, Reversed | `tone: 'default' \| 'neutral' \| 'reversed'` (default `'default'`) | Figma `Accent` maps to code `neutral` (grey text). The Crumb uses `Tone=Accent` in Figma and `tone="neutral"` in code. |
| Size | Variant | **M**, S | `size: 'm' \| 's'` (default `'m'`) | |
| Font Weight | Variant | **Semi-Bold**, Regular | `weight: 'regular' \| 'semi-bold'` (default `'regular'`) | Defaults differ: Semi-Bold in Figma, regular in code. |
| Text Decoration | Variant | **None**, Underline | `underline: boolean` (default `false`) | |
| Icon | Variant | **Left**, Right, None | slots `[slot=icon-left]`, `[slot=icon-right]` | In code the icon is projected; no slot content means `None`. |
| State | Variant | **Default**, Hover, Active, Disabled | Hover, Active: CSS. Disabled: `disabled: boolean` | |
| (none) | | | `href: string` (default `'#'`) | Code only: destination. |
| (none) | | | `external: boolean` (default `false`) | Code only: adds `target="_blank"` and `rel="noopener noreferrer"`. |

Slots: no Figma slot. In code, the default content projection is the label; `[slot=icon-left]` and `[slot=icon-right]` receive a `ds-icon`.

Exposed nested instances: none on set 688:4202. On set 689:4239, `.Specs` is exposed and surfaces `Label`, `Size`, `Icon`, `Weight`, `Decoration`.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover` on the anchor (skipped when disabled) | `State=Hover` |
| Active | `:active` on the anchor (skipped when disabled) | `State=Active` |
| Focus | `:focus-visible`: 3px outline, 2px offset, 2px radius | no variant |
| Disabled | `disabled` input: `href` removed, `aria-disabled="true"`, `tabindex=-1`, opacity 0.40 | `State=Disabled` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Label M | font-size, line-height | `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16`, `--foundation-font-line-height-24` |
| Label S | font-size, line-height | `--semantic-font-text-style-size-m`, `--semantic-font-text-style-line-height-m` | `--foundation-font-size-14`, `--foundation-font-line-height-20` |
| Label | font-weight | `--semantic-font-text-style-font-weight-regular`, `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-regular` (400), `--foundation-font-weight-semi-bold` (600) |
| Label | font-family | `--semantic-font-family` | `--foundation-font-family` (Allianz Neo) |
| Anchor | gap icon / label | (none, foundation used directly) | `--foundation-spacing-4` (4px) |
| Default tone | color (default, hover, active) | `--semantic-color-interactive-text-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Neutral tone | color default | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Neutral tone | color hover | `--semantic-color-interactive-text-strong-alt-hover` | `--foundation-color-grey-800` |
| Neutral tone | color active | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Reversed tone | color (all states) | `--semantic-color-interactive-text-neutral-default` | `--foundation-color-white-1000` |
| Focus ring | outline color | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` (0.40) |

Values written outside tokens in the SCSS: focus outline 3px, offset 2px, focus radius 2px. The Neutral tone mixes Static and Interactive tokens for its three states.

## Accessibility
- Renders a native `<a>` with `href`, so it is announced as a link and reachable with Tab.
- Keyboard: Enter follows the link (native behavior).
- Disabled: `href` is removed, `aria-disabled="true"` and `tabindex="-1"` are set.
- External: `target="_blank"` with `rel="noopener noreferrer"`. Tell the user in the label or with an icon that a new tab opens.
- Focus: visible ring on `:focus-visible`.
- Color: the Default tone relies on the blue color to read as a link; use `underline` when the link sits in a block of body text.

## Content guidelines
- The label says where the link goes ("View policy", "Buyer details"), never "click here".
- Keep it short and on one line when it stands alone.
- Sentence case, no final punctuation.
- No em dash in labels.

## Do / Don't
- Do use Link to navigate; don't use it to trigger a save or a delete.
- Do underline links that sit inside paragraphs; don't rely on color alone in running text.
- Do mark external links with `external`; don't open a new tab without saying so.

## Related components
Composes: Icon (`ds-icon` in the icon slots) · Used by: Action Card, Crumb, List Widget, Newsfeed, Page Title, Policy Result Card, Properties Panel, Result Card, Search Bar, Toaster.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Version shown in the page header (the header still reads "Flyout Menu", copied from another page). The Versionning frame is still the empty template. |
