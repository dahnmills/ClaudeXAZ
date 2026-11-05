# Badge (counter)
**Status**: Design Ready · Tech Planned
A small red disc with a number that flags how many new or pending items sit behind an element.
Figma: [Components] Feedback › first page Badge (node 257:5, component named `Badge`) · Storybook: none (closest: `Design System/Action/Tab` story `WithCounter`) · Code: none standalone (implemented inside `ds-tab` as the `counter` input)

## Overview
The counter badge is a 12 x 12px red disc with a white number, placed on the corner of a tab, an icon or a menu entry. Figma publishes it as a separate component also named `Badge`, on its own page. There is no `ds-` component for it: Tab draws its own counter. Embed the Figma component `Badge` (node 257:5) as the visual reference, and the Tab story `WithCounter` for the coded behavior.

## When to use / When not to use
- Use to show a count of new or pending items on a navigation element (tab, side nav entry, icon).
- Use when the count is small and the user only needs to know "how many".
- Don't use for a status label → use Badge instead.
- Don't use for a count inside text or a table cell → write the number in text instead.
- Don't use for a change without a count → use the change dot of Tab instead.

## Anatomy
1. `Badge` (container): 12 x 12px, round radius, no padding, red fill.
2. `Wrapper` (frame): centers the number.
3. Number (text `9`): white, 12px.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| (none) | | | Tab: `counter: number \| null`, `counterStyle: 'badge' \| 'inline'`, `counterStrong: boolean` | No property in Figma; edit the number text. Only Tab implements it in code. |

Slots: none.

Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | static | default |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | fill (Figma `Color/Static/Background/Functional/Signal`) | `--semantic-color-static-background-functional-signal` | `--foundation-color-red-300` |
| Container | radius (Figma `Border/Radius/Round`) | `--semantic-border-radius-round` | `--foundation-radius-100` |
| Container | padding, gap (Figma `Measurement/Spacing/None`) | `--semantic-measurement-spacing-none` | `--foundation-spacing-0` |
| Number | color (Figma `Color/Static/Text/Subtle/Primary`) | `--semantic-color-static-text-subtle-primary` | `--foundation-color-white-1000` |

Tokens read from the Figma variable bindings. In Tab's SCSS the same colors are used, with a 16px size and a 4px padding written outside tokens.

## Accessibility
- The number alone means little to a screen reader: the host element must say what is counted ("Tasks, 3 pending"). Tab renders its counter with `aria-label="counter"` only.
- Red is used as a signal, not a status; the number carries the information.

## Content guidelines
- Numbers only.
- Rule for large counts (overflow such as "99+"): To be defined.

## Do / Don't
- Do show the counter only when the count is above zero; don't show "0".
- Do keep the counter on navigation elements; don't use it as a status.

## Related components
Composes: none · Used by: Tab (Figma `Badge Wrapper`, code `counter`).

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. The documentation frame on this page is a placeholder copied from Radio. |
