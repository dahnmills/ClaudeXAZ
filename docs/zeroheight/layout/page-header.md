# Page Header
**Status**: Design WIP · Tech In code
The top block of a page under the global Header: object topbox, breadcrumbs, page title with its actions, and tabs.
Figma: [Components] Data Display › page Topbox (node `1709:15404`, key `659acf912d814d5afd4958b3659e72813e6ca115`) · Storybook: `Design System/Layout/Page Header` › Full · Code: `shared/ui/page-header` (`ds-page-header`)

## Overview
The Page Header stacks up to four optional bands: the `.Topbox` (the buyer or policy the page is about), the breadcrumbs, the page title row with its actions, and the tabs, with a bottom border. It lives in the Data Display library (page Topbox) although it is part of the page layout. Embed the Storybook story `Full` and the Figma anatomy frame (`_Design system header` node `1709:18695`).

## When to use / When not to use
- Use when a page needs a title, its position in the hierarchy (breadcrumbs) and its main actions.
- Use when the page is about one buyer or one policy: turn on the Topbox.
- Use when the page has several views of the same object: turn on Tabs.
- Don't use when you need product-level navigation: → use Header instead.
- Don't use when you need section navigation inside a long dossier: → use Side Navigation instead.
- Don't use when the title belongs to a card or a modal: → use the Card title or the Modal header instead.

## Anatomy
From the Figma anatomy frame: Topbox, Breadcrumb, Page Title, Tabs, Header border bottom.
1. `.Topbox` (private, exposed; boolean `Topbox`): full-width band holding `.Topbox Content` (private, exposed). `.Topbox Content` has `Data Type` Policy or Buyer and booleans `High Risk`, `SRU`, `Sanction`. Buyer: background, buyer icon, grade, buyer name, buyer ID, flags, CTA "More details". Policy: background, policy icon, policy name, color (Policy color), policy ID, CTA "Dropdown policy". Code: `slot="topbox"` (`ds-topbox`).
2. `Breadcrumbs - Topbox` (exposed; boolean `Breadcrumb`): wraps `.Topbox Breadcrumbs` (private) with a `Crumb` slot; the last crumb is the current page. Code: `slot="breadcrumbs"` (`ds-breadcrumbs` + `ds-crumb`).
3. `.Page Title` (private, exposed): the page title `Label` and `.Topbox Actions` (private, exposed; boolean `Actions`) with a primary action, a secondary action (Button) and additional actions in a flyout (Button Icon). Code: `slot="title"` (`ds-page-title`).
4. `Tabs - Topbox` (exposed; boolean `Tabs`): wraps `.Topbox Tabs` (private) with a `Tab` slot; one tab is current. Code: `slot="tabs"` (`ds-tab`).
5. Bottom border.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Topbox | Boolean | **true** | `topbox` (true) | |
| Breadcrumb | Boolean | **true** | `breadcrumb` (true) | |
| Tabs | Boolean | **true** | `tabs` (true) | |
| `.Page Title` › Actions | Boolean | **true** | `ds-page-title` `actionLabel` (one link) | Figma: 2 Buttons + Button Icon flyout. The Storybook story puts its links and kebab in `ds-breadcrumbs slot="actions"` instead. |
| `.Topbox Content` › Data Type | Variant | **Policy**, Buyer | `ds-topbox` `dataType` ('buyer') | Defaults differ. |
| `.Topbox Content` › High Risk, SRU, Sanction | Boolean | **true** | `ds-topbox` `highRisk`, `sru`, `sanction` (false) | Defaults differ. |

Slots: `Crumb` (in `.Topbox Breadcrumbs`): Crumb instances, local to the file. `Tab` (in `.Topbox Tabs`): Tab instances. Code slots: `topbox`, `breadcrumbs`, `title`, `tabs`.

Exposed nested instances: `.Topbox` (and its `.Topbox Content`: Data Type, High Risk, SRU, Sanction, the exposed `Grade` / Policy color), `Breadcrumbs - Topbox`, `.Page Title` (and `.Topbox Actions`), `Tabs - Topbox`.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Bands on or off | `topbox`, `breadcrumb`, `tabs` inputs | Booleans Topbox, Breadcrumb, Tabs |
| No topbox | breadcrumbs become first child and get a 16 px top padding | `Topbox=false` |
| Current tab, crumb | `ds-tab [selected]`, `ds-crumb currentPage` | Tab and Crumb atoms |
| Interactive states | from the atoms (Button, Link, Tab, Crumb) | from the atoms |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | side gutter (`--ds-page-header-gutter`) | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Host | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Host | border-bottom | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Host | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Breadcrumbs (first child) | padding-top | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` |
| Tabs | gap | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |

## Accessibility
- `ds-page-header` adds no role; landmarks and headings come from the composed atoms (`ds-page-title` renders the title as the page `h1`; the breadcrumbs semantics come from `ds-breadcrumbs`).
- Tabs follow the Tab atom keyboard behavior.
- Topbox flags (High Risk, SRU, Sanction) are text labels, never color alone.

## Content guidelines
- Page title: the name of the page or of the object ("Current page" is the placeholder).
- Breadcrumbs: from the product area to the current page; the last crumb is not a link.
- At most one primary action, one secondary action, the rest in the flyout.

## Do / Don't
- Do turn bands off with the booleans. Don't detach the instance to remove a band.
- Do keep tabs for views of the same object. Don't use tabs to reach another object.
- Do put the page actions on the title row. Don't scatter page actions inside the content.

## Related components
Composes: Topbox, Breadcrumbs, Crumb, Page Title, Tab, Button, Button Icon, Grade, Policy color · Used by: Search, Buyer Summary, TAG configuration, Portfolio management, Admin data and the other shell pages

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | To be defined | Figma `_Design system header` shows Version 1.0.0, Design WIP, Tech Not started (outdated: the component is in code). Changelog entries To be defined. |
| Docs | 2026-11-04 | First ZeroHeight page. |
