# Accordion
**Status**: Design WIP · Tech In code
A collapsible section: a clickable title row that shows or hides the content placed in its slot.
Figma: [Components] Data Display › page Accordion (node 281:546) · Storybook: `Design System/Data Display/Accordion` › Playground · Code: `shared/ui/accordion` (`ds-accordion`)

## Overview
Accordion lets a dense page keep secondary blocks folded until the user needs them. The title row carries the label and a chevron; the body is a slot that takes any local content (property lists, tables, text). Embed the Storybook story `Playground` (and `Tones`) and the Figma component frame on the Accordion page (`_Design system header` 1453:13668); the Demo frame (1453:13944) shows it in context.

## When to use / When not to use
- Use when a page holds several independent sections and users usually read one at a time.
- Use when secondary details must stay one click away without leaving the page.
- Use when a long list of groups must be scannable by title first.
- Don't use when the content is a table whose rows group under categories → use Collapsible Table instead.
- Don't use when the sections are dated events → use Timeline instead.
- Don't use when the user must compare all sections side by side → keep them open in Cards instead.
- Don't use to switch between views of the same object → use Tabs instead.

## Anatomy
1. `Container`: the accordion box.
2. `.Title` (exposed, private atom): the clickable row with `Labels` (`Label`, an optional `Separator` "-" and a second `Label`, both hidden by default) and the chevron `Icon Functional`. `.Title` has its own `Size` (M, S).
3. `Content` › `Slot`: the body, visible when `Open=True`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Open | Variant | **False**, True | `open` (model, two-way `[(open)]`, default `false`) | |
| Tone | Variant | **Default**, Alt | `tone: 'default' \| 'alt'` | Alt gives the title row a grey background. |
| State | Variant | **Default**, Hover, Active, Disabled | Hover, Active: CSS; Disabled: `disabled` input | |
| Slot | Slot | empty | default `<ng-content>` | Body content. |
| `.Title` › Size | Variant (exposed atom) | **M**, S | none | Code has a single size. |
| Title text | Text layer | "Label" | `title` (required) | The optional second label of `.Title` has no code input. |

Slots: `Slot`: any local content (Card `.Columns`, a table, text). Code: projected content.
Exposed nested instances: `.Title` (property `Size`).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | none | State=Default |
| Hover | `:hover` on the header button | State=Hover |
| Active | `:active` on the header button | State=Active |
| Focus | `:focus-visible` outline | Not drawn |
| Disabled | `disabled` input (native `disabled`, `aria-disabled`, 40 % opacity) | State=Disabled |
| Open | `open` model, `ds-accordion--open` class | Open=True |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Header | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Header | padding | `--semantic-measurement-spacing-s` `--semantic-measurement-spacing-m` | `--foundation-spacing-8` `--foundation-spacing-16` |
| Header | radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Header (Tone Alt) | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Header | background hover | `--semantic-color-interactive-background-light-alt-hover` | `--foundation-color-grey-100` |
| Header | background active | `--semantic-color-interactive-background-light-alt-active` | `--foundation-color-grey-200` |
| Header | focus outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Title | font size / weight / line height | `--semantic-font-title-size-s` / `--semantic-font-title-font-weight-m` / `--semantic-font-title-line-height-m` | `--foundation-font-size-20` / `--foundation-font-weight-semi-bold` / `--foundation-font-line-height-28` |
| Title | color | `--semantic-color-interactive-text-strong-alt-default` | `--foundation-color-grey-900` |
| Chevron | color | `--semantic-color-interactive-icon-strong-alt-default` | `--foundation-color-grey-900` |
| Body | padding | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Body | text color / size / line height | `--semantic-color-static-text-main-primary` / `--semantic-font-text-style-size-l` / `--semantic-font-text-style-line-height-l` | `--foundation-color-grey-900` / `--foundation-font-size-16` / `--foundation-font-line-height-24` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- The title row is a native `<button type="button">` with `aria-expanded` reflecting `open`.
- Keyboard: Tab to the row, Enter or Space toggles it. Focus is shown with a `:focus-visible` outline.
- Disabled: native `disabled` plus `aria-disabled`; the row is skipped by Tab.
- The body is removed from the DOM when closed (`@if`), so screen readers do not read hidden content. The button has no `aria-controls` link to the body.
- The chevron is decorative; the expanded state is conveyed by `aria-expanded`.

## Content guidelines
- Title: a short noun phrase naming the section ("Buyer information"), sentence case.
- Do not put the key information only in the body of a closed accordion: anything decision-critical stays visible.

## Do / Don't
- Do stack accordions of the same Tone in one list. Don't mix Default and Alt in the same group.
- Do open the first or most used section by default when it helps. Don't open all sections by default (use Cards instead).
- Do put local content in the slot. Don't detach the component to add content.

## Related components
Composes: Icon · Used by: page content (sections), alongside Card and Collapsible Table

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | To be defined | Version shown in the Figma header; the Figma changelog is a placeholder. |
| Docs | 2026-11-04 | First ZeroHeight page. |
