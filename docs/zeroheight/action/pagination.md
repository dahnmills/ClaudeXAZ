# Pagination
**Status**: Design Ready · Tech In code
Pagination lets the user move through a long list split into pages.
Figma: [Components] Action › page Pagination (node 53:2994) · Storybook: `Design System/Action/Pagination` (id `design-system-action-pagination--playground`) · Code: `shared/ui/pagination` (`ds-pagination`)

## Overview
Pagination sits under a table or a result list. Figma offers two styles: Classic (Back and Next links around the pages, in three layouts: Full, Select, Minimal) and Infinite Scroll (a "Load more results" button). The code offers `classic` (First, Back, page numbers, Next, Last) and `infinite` (Back, "N of M", Next). Embed the Storybook story `Playground` as the live example, and the Figma component set `Pagination` (node 53:2994) as the visual reference.

## When to use / When not to use
- Use under a table or a list that holds more items than one screen shows.
- Use the Full layout (code `classic`) when users jump to a specific page.
- Use the Minimal layout (code `infinite`) when users mostly go forward and back.
- Use the Infinite Scroll style (a Load more button) for feeds and search results read in order.
- Don't use for a short list that fits on one screen → show all items instead.
- Don't use to move through the steps of a flow → use Stepper instead.
- Don't use to switch between views → use Tab instead.

## Anatomy
1. `Pagination` (container): holds `.Options` (Classic) or a `Button Load More` (Infinite Scroll).
2. `.Options` (private atom, `Type` Full, Select, Minimal):
   - `Back` frame: `Link` instances with a left chevron (First and Back).
   - `Pages` frame: page number links (Full), a `Dropdown` plus "of" and the last page (Select), or "1 of 32" text (Minimal).
   - `Next` frame: `Link` instances with a right chevron (Next and Last).
3. `Button Load More` (Infinite Scroll): label "Load more results".
4. Ellipsis (code): "…" between page groups when there are more than 7 pages.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Style | Variant | Infinite Scroll, **Classic** | `style: 'classic' \| 'infinite'` (default `'classic'`) | Names do not match: Figma Infinite Scroll is a Load more button; code `infinite` is Back, "N of M", Next (Figma Classic with `.Options` Minimal). Load more is built in code with `ds-button` `fullWidth` (see Button Load More). |
| `.Options` › Type | Variant (exposed) | Full, Select, **Minimal** | `classic` = Full, `infinite` = Minimal | Select (page dropdown) has no code equivalent. |
| (none) | | | `page: number` (default `1`), `total: number` (required) | 1-based current page and page count. |
| (none) | | | `siblings: number` (default `1`) | Pages shown on each side of the current page in `classic`. |
| (none) | | | `showFirstLast: boolean` (default `true`) | First and Last links in `classic`. |
| (none) | | | `pageChange` (output, `number`) | The requested page. |

Slots: none.

Exposed nested instances: `.Options` (property `Type`) and the `.Specs` of the Back and Next `Link` instances (label, icon, weight).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | default |
| Hover, Active | `:hover`, `:active` on each link | on the Link set |
| Current page | `page` input: `aria-current="page"`, Grey/900 semi-bold | page link styled as current |
| Disabled | First and Back on page 1, Next and Last on the last page: `disabled`, opacity 0.40 | Link `State=Disabled` |
| Focus | no `:focus-visible` style in the SCSS (browser default) | no variant |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Container, links | font | `--semantic-font-family`, `--semantic-font-text-style-size-l`, `--semantic-font-text-style-line-height-l` | `--foundation-font-family`, `--foundation-font-size-16`, `--foundation-font-line-height-24` |
| Link | gap icon / label | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Link | weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` |
| Link | color rest / hover / active | `--semantic-color-interactive-text-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Current page, count | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Ellipsis | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- The host has `role="navigation"` and `aria-label="Pagination"`.
- The current page has `aria-current="page"`.
- Unavailable links are `disabled` with `aria-disabled` and out of the tab order.
- The ellipsis is `aria-hidden`.
- Page buttons are labeled by their number only; add context in the surrounding text (for example "Page 3 of 21").
- No visible focus style is defined; the browser default ring applies.

## Content guidelines
- Labels are fixed in code: "First", "Back", "Next", "Last", "N of M".
- Load more label: "Load more results" (Figma).
- No em dash.

## Do / Don't
- Do keep the page size stable while the user pages; don't change the number of items per page between pages.
- Do keep pagination under the list it controls; don't place it far from the content.

## Related components
Composes: Icon (`ds-icon` chevrons) in code; Link, Dropdown (Select layout) and Button Load More in Figma · Used by: no other DS component.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Current version shown in the Figma header. The Versionning frame is still the empty template. |
