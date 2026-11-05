# Crumb
**Status**: Design Ready · Tech In code
One level of a breadcrumb: a link to a parent page, or the name of the current page.
Figma: [Components] Action › page Breadcrumb (node 705:4485) · Storybook: `Design System/Action/Crumb` (id `design-system-action-crumb--default`) · Code: `shared/ui/crumb` (`ds-crumb`)

## Overview
Crumb is the item that Breadcrumb repeats. A parent crumb is a neutral Link followed by a chevron; the current crumb is plain text with `aria-current="page"`. Embed the Storybook story `Default` as the live example, and the Figma component set `Crumb` (node 705:4485) as the visual reference.

## When to use / When not to use
- Use inside a Breadcrumb, one per hierarchy level.
- Use `currentPage` on the last crumb.
- Use `disabled` when a parent level exists but the user cannot open it.
- Don't use alone in a page → use Link instead.
- Don't use outside a breadcrumb trail → use Link or Button instead.
- Don't use for steps of a flow → use Stepper instead.

## Anatomy
1. `Link` (instance of the Link set, `Tone=Accent`, `Icon=Right`, `Font Weight=Regular`): the label and its link behavior. In code a `ds-link` with `tone="neutral"`, `size="m"`, `weight="regular"`.
2. Chevron (`Chevron-Small Right`, 16px): separator after a parent crumb. In code a `ds-icon name="chevron-right"` that inherits the label color.
3. Current label (code): a `span` with `aria-current="page"`, semi-bold, blue, no chevron.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Current Page | Variant | True, **False** | `currentPage: boolean` (default `false`) | |
| (none) | | | `label: string` (required) | Label text. |
| (none) | | | `href: string` (default `'#'`) | Destination of a parent crumb. |
| (none) | | | `disabled: boolean` (default `false`) | Code only, no Figma variant (the Link set has `State=Disabled`). |
| (none) | | | `clicked` (output) | Emitted on click; the default navigation is prevented, so the parent handles routing. |

Slots: none.

Exposed nested instances: none (the `Link` instance is not exposed on Crumb).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `Current Page=False` |
| Hover, Active, Focus | from `ds-link` (`:hover`, `:active`, `:focus-visible`) | on the Link set |
| Current page | `currentPage` input | `Current Page=True` |
| Disabled | `disabled` input: opacity 0.40, link disabled | not modeled on Crumb |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` (4px) |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Current label | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Current label | font-size, line-height | `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16`, `--foundation-font-line-height-24` |
| Current label | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` (600) |
| Current label | letter-spacing | `--semantic-font-text-style-letter-spacing-none` | `--foundation-font-letter-spacing-0` |
| Current label | color | `--semantic-color-interactive-text-strong-default` | `--foundation-color-blue-a-500` |

Values written outside tokens in the SCSS: height 20px. Parent crumb colors come from Link (neutral tone).

## Accessibility
- Parent crumb: native link through `ds-link`, reachable with Tab, Enter follows it.
- Current crumb: `aria-current="page"`, not focusable.
- The chevron is decorative.
- Because `clicked` prevents the default navigation, the parent must route on `clicked` or the link does nothing.

## Content guidelines
- Use the exact title of the target page.
- Keep the label short, on one line.
- No em dash.

## Do / Don't
- Do mark only the last crumb as current; don't mark several crumbs as current.
- Do route on `clicked`; don't rely on `href` alone, since the default navigation is prevented.

## Related components
Composes: Link (`ds-link`), Icon (`ds-icon`) · Used by: Breadcrumb (`ds-breadcrumbs`).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown on the Breadcrumb page header. The Versionning frame is still the empty template. |
