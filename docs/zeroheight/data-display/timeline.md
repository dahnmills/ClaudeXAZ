# Timeline
**Status**: Design WIP · Tech In code
A collapsible, status-colored group of dated events, read from top to bottom like a history.
Figma: [Components] Data Display › page Timeline (node 1491:927) · Storybook: `Design System/Data Display/Timeline` › Default · Code: `shared/ui/timeline` (`ds-timeline`, `ds-timeline-event`)

## Overview
Timeline shows what happened to a buyer or a policy over time. In Figma, a Timeline is a collapsible category (status dot, title, separator, chevron) whose slot holds Timeline Events; each event pairs a date marker (month and day on a vertical line) with its data columns and a comment. In code, `ds-timeline` is the vertical list and each `ds-timeline-event` is a collapsible item with a status dot. Embed the Storybook story `Default` and the Figma component frame on the Timeline page (`_Design system header` 1491:2424).

## When to use / When not to use
- Use when showing the dated history of an entity (policy created, renewal proposed, claim opened).
- Use when each event has a status that matters (error, warning, success, info, neutral).
- Use when events have details that can stay folded until needed.
- Don't use when the sections are not dated or ordered → use Accordion instead.
- Don't use when comparing values across many rows and columns → use Data Grid / Table instead.
- Don't use for a sequence of steps the user must complete → use Stepper instead.

## Anatomy
1. `Category`: the header row of a Timeline.
   1. `Timeline Title` (exposed): status dot (`Ellipse 6`) and `Title` text; property `Status`.
   2. `Separator`: horizontal line filling the row.
   3. `Chevron-Small Up` icon: open or close.
2. `Events` › `Slot`: holds Timeline Event instances.
3. `Timeline Event` (sub-component, `Content` Default or Slot):
   1. `Timeline Line` (exposed): month (`APR`), day in a circle (`16`) and a vertical line (`Dash`) down to the next event; property `Status`.
   2. `Data`: label and value `Columns`, a `Separator` and a `Comment` block; with `Content=Slot` the data area is free local content.

## Variants and properties
Timeline (1491:927):

| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Open | Variant | False, **True** | `ds-timeline-event` › `open` (model, default `false`) | Figma opens a whole group; code opens one event. Defaults differ. |
| State | Variant | **Default**, Hover, Active, Disabled | Hover, Active: CSS; Disabled: `disabled` input on `ds-timeline-event` | |
| Slot | Slot | empty | `ds-timeline` default `<ng-content>` (events) | |

Timeline Title (381:422) and Timeline Line (381:236):

| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Status | Variant | **Error**, Warning, Success, Info, Neutral | `ds-timeline-event` › `status: 'error' \| 'warning' \| 'success' \| 'info' \| 'neutral'` (default `'neutral'`) | Defaults differ. |
| Title text | Text layer | "Title" | `ds-timeline-event` › `title` (required) | |
| Date (month, day) | Text layers | "APR", "16" | none | Code does not render dates. |

Timeline Event (381:438):

| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Content | Variant | **Default**, Slot | projected content of `ds-timeline-event` | Code body is always free content. |
| (last event) | none | none | `isLast` (hides the descending line) | Code only. |

Slots: Timeline `Slot` takes Timeline Event instances; Timeline Event `Content=Slot` takes local content.
Exposed nested instances: `Timeline Title` (Status) in Timeline; `Timeline Line` (Status) in Timeline Event.

Notes: `☠️ Timeline` (381:171) is the deprecated version without a native slot; `Frame 243` and `Frame 245` are layout helpers, not components to use.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | none | State=Default |
| Hover | `:hover` on the event header button | State=Hover |
| Active | `:active` on the event header button | State=Active |
| Focus | `:focus-visible` outline | Not drawn |
| Disabled | `disabled` input (native `disabled`, `aria-disabled`, 40 % opacity) | State=Disabled |
| Open | `open` model, `ds-timeline-event--open` class | Open=True |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Event | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Rail | padding top | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Line | width | `--semantic-measurement-spacing-xxs` | `--foundation-spacing-2` |
| Line | color | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Dot Error | background | `--semantic-color-static-background-functional-negative` | `--foundation-color-red-500` |
| Dot Warning | background | `--semantic-color-static-background-functional-warning` | `--foundation-color-orange-400` |
| Dot Success | background | `--semantic-color-static-background-functional-positive` | `--foundation-color-green-500` |
| Dot Info | background | `--semantic-color-static-background-functional-informative` | `--foundation-color-blue-b-500` |
| Dot Neutral | background | `--semantic-color-static-background-accent-secondary` | `--foundation-color-grey-500` |
| Main | padding bottom | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Header | padding | `--semantic-measurement-spacing-xs` `--semantic-measurement-spacing-s` | `--foundation-spacing-4` `--foundation-spacing-8` |
| Header | radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Header | background hover / active | `--semantic-color-interactive-background-light-alt-hover` / `-active` | `--foundation-color-grey-100` / `--foundation-color-grey-200` |
| Header | focus outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Title | font size / weight / line height | `--semantic-font-text-style-size-l` / `--semantic-font-text-style-font-weight-semi-bold` / `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16` / `--foundation-font-weight-semi-bold` / `--foundation-font-line-height-24` |
| Title | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Chevron | color | `--semantic-color-interactive-icon-strong-alt-default` | `--foundation-color-grey-900` |
| Body | padding | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Body | text color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Event (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- `ds-timeline` has `role="list"`; each `ds-timeline-event` has `role="listitem"`.
- Each event header is a native `<button type="button">` with `aria-expanded`; Enter or Space toggles it, focus is shown with `:focus-visible`.
- Disabled events use native `disabled` plus `aria-disabled`.
- The status dot is color only: the event title (and, in Figma, the date) must state what happened; add the status in text when it matters.
- Closed bodies are removed from the DOM.

## Content guidelines
- Title: what happened, in a few words, past tense or noun phrase ("Policy created", "Claim opened").
- Order events from newest to oldest or oldest to newest, and keep the same order across the product (order rule: To be defined).
- Date: month abbreviation and day, as drawn in Figma ("APR", "16"); full date format: To be defined.

## Do / Don't
- Do pick the status from the event's real outcome. Don't color events for decoration.
- Do set `isLast` on the final event so the line stops. Don't leave a line hanging below the last event.
- Do keep event details in the folded body. Don't put long text in the title.

## Related components
Composes: Icon · Used by: entity history sections (pages); related to Accordion (same open and close pattern)

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | To be defined | Version shown in the Figma header; the Figma changelog is a placeholder. |
| Docs | 2026-11-04 | First ZeroHeight page. |
