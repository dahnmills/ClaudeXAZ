# List Item
**Status**: Design New · Tech In code
One entry of a list in a board widget: a task (Job to do), a note (Notepad) or a news item (Newsfeed).
Figma: [Components] Data Display › page List Item (node 2059:394) · Storybook: `Design System/Data Display/List Widget` › JobToDo (also `Design System/Data Display/Newsfeed` › Default) · Code: `shared/ui/list-widget` (`ds-list-widget`), `shared/ui/newsfeed` (`ds-newsfeed`)

## Overview
List Item stacks a title link, a meta line (date with an optional clock icon, and a status Badge on the right), an optional Tags slot above the title and an optional Excerpt below. In code there is no standalone item: the item markup lives inside `ds-list-widget` (repeated items) and `ds-newsfeed` (one news item), both wrapped in Widget Card. Embed the Storybook `JobToDo` story and the Figma component frame (node 2059:394) on the page `🆕 List Item`.

## When to use / When not to use
- Use when a board widget lists short entries that each open somewhere: tasks, notes, news.
- Use when each entry has a date and, optionally, one status.
- Use for a news item with sentiment tags and a short excerpt.
- Don't use when entries need several actions → use Table Row instead.
- Don't use when you show label and value pairs → use Card (`.Columns`) instead.
- Don't use when the entry is a rich result with figures → use Horizontal Card instead.

## Anatomy
1. `Tags` (slot, hidden by default): sentiment Badges above the title (news).
2. `Title` (exposed instance of `Link`): neutral, underlined, semi-bold link; the whole title is the link. Edit its text on the instance.
3. `Meta` (frame): 
   1. `Date group`: optional `Date icon` (`Icon Functional`, clock) and the `Date` text.
   2. `Badge` (exposed instance of `Badge`): status on the right.
4. `Excerpt` (text, hidden by default): one or two lines of summary.
Items are separated by a Divider (placed between items in the list, not inside the item).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Show tags | Boolean | True / **False** | `ds-newsfeed` `tags: NewsfeedTag[]` (shown when not empty) | Not available in `ds-list-widget`. |
| Tags | Slot | Badges | `ds-newsfeed` `tags` (`{ label, status? }`, status default `neutral`) | |
| Date icon | Boolean | True / **False** | `ds-newsfeed` `dateIcon: IconName` (default `clock`, always shown with a date) | `ds-list-widget` never shows the icon. |
| Date | Text | **11 nov 2024 - 16:42** | `ListWidgetItem.date` / `ds-newsfeed` `date` | Hidden in code when empty. |
| Badge | Boolean | **True** / False | `ListWidgetItem.badge` (`{ label, status? }`, status default `info`) | Not available in `ds-newsfeed`. |
| Excerpt | Boolean | True / **False** | `ds-newsfeed` `excerpt` (shown when not empty) | Not available in `ds-list-widget`. |
| Excerpt text | Text | Yesterday, someone bought an electric ca… | `ds-newsfeed` `excerpt` | |
| (title) | Exposed Link text | | `ListWidgetItem.label` / `ds-newsfeed` `headline` (+ `href`) | |

Code-only inputs on the wrappers: `title` (widget title), `items` (list widget), `actionIcon` and `actionAriaLabel` (list widget), `externalLink` (both); outputs `itemClicked` (list widget), `headlineClicked` (newsfeed), `actionClicked` (both).

Slots: `Tags`: sentiment Badges only.
Exposed nested instances: `Title` (Link: text, tone neutral, underline), `Badge` (Badge: label, status).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Always | Component |
| Title hover, active, focus | Provided by `ds-link` (`:hover`, `:active`, `:focus-visible`) | Link states (Action library) |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| List | gap between items | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Item | gap title to meta | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Meta row | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Date | font-size / line-height | `--semantic-font-text-style-size-s` / `--semantic-font-text-style-line-height-s` | `--foundation-font-size-12` / `--foundation-font-line-height-16` |
| Date (list widget) | letter-spacing | `--semantic-font-text-style-letter-spacing-m` | `--foundation-font-letter-spacing-0-5` |
| Date | color | `--semantic-color-static-text-main-tertiary` | `--foundation-color-grey-500` |
| News content | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Tags, news meta | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Excerpt | font-size / line-height | `--semantic-font-text-style-size-s` / `--semantic-font-text-style-line-height-m` | `--foundation-font-size-12` / `--foundation-font-line-height-20` |
| Excerpt | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |

Title, Badge and Divider take their tokens from Link, Badge and Divider.

## Accessibility
- The title is a real link (`ds-link`): reachable with Tab, activated with Enter, visible focus ring from the Link atom.
- The status Badge always shows a label: the status is never color-only.
- The clock icon is decorative next to the date text.
- The widget header action button needs a meaningful label (`actionAriaLabel`, default "Open").

## Content guidelines
- Title: the task, note or headline in plain words; one line where possible.
- Date format as in the source: "11 nov 2024 - 16:42".
- Excerpt: one short sentence, cut with an ellipsis.
- At most 3 items per small widget.

## Do / Don't
- Do: one Divider between items. Don't: add a Divider after the last item.
- Do: make the whole title the link. Don't: put actions (buttons, menus) in the item.
- Do: keep at most 3 items per small widget. Don't: turn a widget list into a scrolling table.

## Related components
Composes: Link, Badge, Icon, Divider (between items), Widget Card (code wrapper) · Used by: Buyer Summary board widgets (Job to do, Notepad, Newsfeed)

## Changelog
| Version | Date | Change |
|---|---|---|
| v1.0.0 | November 3, 2026 | New: added from code (ds-list-widget). Note: also used by ds-newsfeed. |
| Docs | 2026-11-04 | First ZeroHeight page. |

### Notes (Figma vs code)
- Figma has one List Item component; code has no standalone `ds-list-item`. Each wrapper supports a subset: `ds-list-widget` = title, date, badge; `ds-newsfeed` = tags, title, date with icon, excerpt.
- `ds-newsfeed` renders a single news item, not a list.
