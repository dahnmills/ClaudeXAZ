# Spinner
**Status**: Design Ready · Tech In code
A small rotating ring that shows that something is loading.
Figma: [Components] Feedback › page Spinner (node 264:10) · Storybook: `Design System/Feedback/Spinner` (id `design-system-feedback-spinner--default`) · Code: `shared/ui/spinner` (`ds-spinner`)

## Overview
Spinner is a 14px ring with a 270° arc that turns continuously. It signals a wait without saying how long. It is used alone in a small area, or inside Button and Toaster loading states. Embed the Storybook story `Default` as the live example, and the Figma component set `Spinner` (node 264:10) as the visual reference.

## When to use / When not to use
- Use for a short wait whose length is unknown (saving, fetching a small panel).
- Use inside a button while its action runs (Button `loading`).
- Use `tone="current"` on colored surfaces so the ring takes the text color.
- Don't use when the layout of the coming content is known → use Skeleton Item instead.
- Don't use when the progress can be measured → use Progress Bar instead.
- Don't use as the only feedback for a long background task → use Toaster with a loader instead.

## Anatomy
1. Ring (`Group 1`): a circle with a 2px stroke, three quarters in Grey/500 and one quarter in Grey/200, rotating once every 0.75s.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Property 1 | Variant | **Default**, Variant2, Variant3, Variant4 | CSS animation | The four Figma variants are rotation frames of the animation, not options. The property keeps the default name `Property 1`. |
| (none) | | | `size: 'xs' \| 's' \| 'm' \| 'l'` (default `'m'`) | 10, 14, 20 and 28px. Figma has one size, 14px (code `s`). |
| (none) | | | `tone: 'default' \| 'current'` (default `'default'`) | `current` uses `currentColor` for the arc. |

Slots: none.

Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Spinning | always animated while rendered | `Property 1` frames |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Ring | arc color (default tone) | `--semantic-color-static-background-accent-secondary` | `--foundation-color-grey-500` |
| Ring | track color (default tone) | `--semantic-color-static-background-accent-tertiary` | `--foundation-color-grey-200` |

Values written outside tokens in the SCSS: ring sizes 10, 14, 20, 28px, stroke 1.5px, 2px and 3px, `current` tone track `rgba(255, 255, 255, 0.3)`, duration 0.75s.

## Accessibility
- The host has `role="status"` and `aria-label="Loading"` (fixed, in English). The ring itself is `aria-hidden`.
- When the spinner sits in a Button, the Button also sets `aria-busy="true"`.
- No `prefers-reduced-motion` rule in the SCSS: the ring keeps turning for users who reduce motion.

## Content guidelines
- No text inside. If the wait needs words, put them next to the spinner ("Loading results…").

## Do / Don't
- Do use one spinner per loading area; don't show several spinners for one load.
- Do switch to Skeleton Item when you know the layout; don't use a spinner for a whole page of cards.

## Related components
Composes: none · Used by: Button (`loading`), Button Load More. Figma Toaster has a `Loading` option.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
