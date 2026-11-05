# Button Load More
**Status**: Design Ready · Tech In code (through `ds-button`)
A full-width button under a list that loads the next batch of results in place.
Figma: [Components] Action › page Button Load More (node 53:8445) · Storybook: `Design System/Action/Button` story `Load More (full width)` (id `design-system-action-button--load-more`) · Code: `shared/ui/button` (`ds-button` with `type="secondary" tone="accent" [fullWidth]="true"`)

## Overview
Button Load More is the Infinite Scroll style of Pagination: the user stays on the page and appends more results. There is no dedicated code component; the pattern is a Button with the Secondary type, the Accent tone and `fullWidth`, and its `loading` state while results arrive. Embed the Storybook story `Load More (full width)` as the live example, and the Figma component set `Button Load More` (node 53:8445) as the visual reference.

## When to use / When not to use
- Use under a feed or a search result list read from top to bottom.
- Use when the total number of results matters less than the next few.
- Use the loading state while the next batch is fetched.
- Don't use when users need to reach a given page → use Pagination instead.
- Don't use for any action other than loading more of the same list → use Button instead.
- Don't use when all items fit on one screen → show them all instead.

## Anatomy
1. `Button` (frame): the full-width button with the label ("Load more results" in Figma).
2. Spinner (Loading states): shown while results load. In code, the `ds-spinner` of `ds-button`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Hover, Active, Loading Starts, Loading Ends | Hover, Active: CSS. Loading: `loading: boolean` on `ds-button` | Figma splits loading into two frames (start and end of the animation); code has one `loading` state. |
| (none) | | | `type="secondary"`, `tone="accent"`, `fullWidth` | The code recipe, from the `Load More (full width)` story. |

Slots: none.

Exposed nested instances: none.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `State=Default` |
| Hover | `:hover` | `State=Hover` |
| Active | `:active` | `State=Active` |
| Loading | `loading` input: label hidden, spinner, `aria-busy` | `State=Loading Starts`, `State=Loading Ends` |
| Focus | `:focus-visible` (from Button) | no variant |

## Tokens
See Button (Secondary type, Accent tone). No token of its own.

## Accessibility
- Same as Button: `role="button"`, Enter and Space, `aria-busy` while loading.
- After new results load, keep the focus on the button or move it to the first new item, so keyboard users do not lose their place.
- Announce the number of new results in a live region if the list does not make it obvious.

## Content guidelines
- Label: "Load more results" (Figma), or "Load more" plus the object ("Load more buyers").
- Loading label: "Loading…" (Storybook example).
- Sentence case, no em dash.

## Do / Don't
- Do place the button right after the last item; don't put it above the list.
- Do keep earlier results on screen; don't replace them with the new batch.

## Related components
Composes: Button (`ds-button`), Spinner · Used by: Pagination (Figma `Style=Infinite Scroll`).

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Current version shown in the Figma header. The Versionning frame is still the empty template. |
