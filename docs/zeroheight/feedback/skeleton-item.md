# Skeleton Item
**Status**: Design Ready · Tech In code
A grey placeholder bar with a moving shimmer that holds the place of content while it loads.
Figma: [Components] Feedback › page Skeleton (node 117:5) · Storybook: `Design System/Feedback/Skeleton Item` (id `design-system-feedback-skeleton-item--text-lines`) · Code: `shared/ui/skeleton-item` (`ds-skeleton-item`)

## Overview
Skeleton Item is the building block of loading states: stack several items to draw the shape of a card, a row or a text block before data arrives. The shimmer moves from left to right to show that loading is in progress. Embed the Storybook story `CardPlaceholder` as the live example, and the Figma component set `Skeleton Item` (node 117:5) as the visual reference.

## When to use / When not to use
- Use when the layout of the coming content is known (cards, tables, property lists).
- Use for loads that take more than a moment, so the page does not jump when data arrives.
- Use lines of different widths to suggest text.
- Don't use for a short action inside a button → use the Button loading state (Spinner) instead.
- Don't use when the layout of the result is unknown → use Spinner instead.
- Don't use for a progress that can be measured → use Progress Bar instead.

## Anatomy
1. `Skeleton Item` (container): 12px high bar (one text line), 4px radius, Grey/050 fill. 394px wide in Figma, 100% in code.
2. `.Animation` (private atom, 151px wide): the light gradient band that moves across the bar. In code an `::after` gradient that slides from -100% to 150% in 1.5s.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Start**, End | CSS animation | The two Figma variants are the start and end frames of the shimmer. |
| (none) | | | `width: string` (default `'100%'`) | Any CSS length. |
| (none) | | | `height: string` (default `'12px'`) | 12px matches one text line in Figma. |
| (none) | | | `radius: string` (default `'4px'`) | `'50%'` for a round avatar. |

Slots: none.

Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Loading (animated) | always animated while rendered | `State=Start` to `State=End` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Bar | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Shimmer | gradient stops (0%, 100%) | `--semantic-color-static-background-main-tertiary` | `--foundation-color-grey-100` |
| Shimmer | gradient stops (25%, 65%) | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |

Values written outside tokens: the default `height` (12px) and `radius` (4px) are input strings, and width, height and radius are applied as inline styles on the host by the component. Animation duration 1.5s.

## Accessibility
- Each item is `aria-hidden="true"`: screen readers ignore it. The container that is loading should carry `aria-busy="true"` and a text alternative ("Loading buyer details").
- The shimmer is not disabled for users who prefer reduced motion (no `prefers-reduced-motion` rule in the SCSS).

## Content guidelines
- No text inside. Match the number and length of lines to the content that will appear.

## Do / Don't
- Do mirror the real layout with skeleton items; don't show a generic block that does not match.
- Do replace the whole skeleton at once when data arrives; don't mix loaded and skeleton rows in one card.

## Related components
Composes: none · Used by: Buyer Summary (app page). Card exposes a `Loading` property in Figma (`.Columns`).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
