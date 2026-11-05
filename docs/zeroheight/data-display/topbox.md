# Topbox
**Status**: Design WIP · Tech In code
A one-line identity strip that names the buyer or policy a page is about, with its grade, identifier, critical flags and one action.
Figma: [Components] Data Display › page Topbox (node 1704:15463, `.Topbox`; content atom `.Topbox Content` 1704:15147) · Storybook: `Design System/Layout/Topbox` › BuyerFull · Code: `shared/ui/topbox` (`ds-topbox`)

## Overview
The Topbox sits at the very top of a Page Header and keeps the current entity (buyer or policy) visible while the user works in the page below. In Figma it is a private atom (`.Topbox`) consumed through the `Topbox` boolean of Page Header; it is not placed on its own. Embed the Storybook story `BuyerFull` and the Figma Page Header anatomy frame (node 1709:18695), which annotates both the Buyer and the Policy topbox.

## When to use / When not to use
- Use when a page is scoped to one buyer or one policy and the user must keep its identity in view.
- Use when the entity has a grade, a policy color or critical flags (High Risk, SRU, Sanction) that condition every decision on the page.
- Use when one entry point to the full entity details is needed ("View full details", policy dropdown).
- Don't use when the page is a list or a search: there is no single entity → use Page Header without Topbox.
- Don't use when you need a page title with actions → use Page Header (`.Page Title`) instead.
- Don't use when showing the entity's full properties → use Card with `.Columns` instead.

## Anatomy
1. `.Topbox`: full-width band (1280 x 40 in Figma) that hosts the content; exposes `.Topbox Content`.
2. `.Topbox Content` › `Icon Product` (Buyer) or `Summary` icon (Policy): what kind of entity it is.
3. Label (`Buyer` / `Label` text): entity name.
4. `Grade` (exposed): a Grade instance for a buyer (`Type=Manual, Grade=4, Size=M` by default), a Policy color instance for a policy.
5. Separator lines between groups.
6. `ID`: hash glyph plus identifier text.
7. Flags (Buyer only): three `Badge` instances (`Status=Error, Style=Light, Size=M`), each preceded by a separator, toggled by `High Risk`, `SRU`, `Sanction`.
8. `Actions`: a Plain `Button` (Buyer: Tone Accent, "View full details"; Policy: dropdown CTA, with hidden extra Button, Button Icon and Flyout Menu).

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Data Type (`.Topbox Content`) | Variant | **Policy**, Buyer | `dataType: 'policy' \| 'buyer'` (default `'buyer'`) | Defaults differ: Figma Policy, code buyer. |
| High Risk | Boolean | **true**, false | `highRisk` (default `false`) | Buyer variant only. |
| SRU | Boolean | **true**, false | `sru` (default `false`) | Buyer variant only. |
| Sanction | Boolean | **true**, false | `sanction` (default `false`) | Buyer variant only. |
| Label text | Text layer | "Label" | `label` (required) | |
| ID text | Text layer | "ID" | `id` (default `''`, hidden when empty) | |
| Grade (exposed instance) | Instance | Grade / Policy color | `grade: string \| null`, `gradeColor: 'grade-1'...'grade-10' \| 'grade-none'` | Code draws its own pill, it does not compose `ds-grade`. |
| Action | Button instance | Plain Button | `actionLabel`, `actionIcon`, `actionIconPosition`, `actionType: 'button' \| 'chevron'`, `expanded`; output `actionClicked` | `actionType='chevron'` (toggle) has no Figma equivalent. |
| (icon) | Instance | Icon Product / Summary | `icon: IconName` (default `'users'`) | |

Slots: none.
Exposed nested instances: `.Topbox Content` (from `.Topbox`), and inside it `Grade` (Grade or Policy color, with their own Type, Grade, Color, Size properties).

Notes: the legacy `Topbox` set (424:18949, Type = Generic, Buyer CI main, Conf/ADT Parameters, and others), `Topbox V2 - Variation 1/2/4`, `topbox2026--usertesting` and `[☠️] Topbox` on the same page are earlier explorations or deprecated: do not use them.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | none | Default |
| Action hover | `:hover` on `.ds-topbox__action` / `.ds-topbox__chevron` | Inherited from Button |
| Action active | `:active` | Inherited from Button |
| Action focus | `:focus-visible` (focus outline) | Inherited from Button |
| Expanded (chevron) | `expanded` input, `ds-topbox--expanded` class | Not drawn |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | background | `--semantic-color-static-background-main-secondary` | `--foundation-color-grey-050` |
| Host | padding | `--semantic-measurement-spacing-xs` / `--semantic-measurement-spacing-xl` | `--foundation-spacing-4` / `--foundation-spacing-32` |
| Main group | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Icon | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Label | font size / line height | `--semantic-font-text-style-size-l` / `--semantic-font-text-style-line-height-l` | `--foundation-font-size-16` / `--foundation-font-line-height-24` |
| Label | font weight | `--semantic-font-text-style-font-weight-bold` | `--foundation-font-weight-bold` |
| Label | color | `--semantic-color-static-text-main-secondary` | `--foundation-color-grey-700` |
| Grade pill | radius | `--semantic-border-radius-l` | `--foundation-radius-16` |
| Grade pill | font weight / color | `--semantic-font-text-style-font-weight-semi-bold` / `--semantic-color-static-text-main-primary` | `--foundation-font-weight-semi-bold` / `--foundation-color-grey-900` |
| ID chip | background | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| ID chip | border | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| ID chip | radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| ID chip | text color / size | `--semantic-color-static-text-main-tertiary` / `--semantic-font-text-style-size-s` | `--foundation-color-grey-500` / `--foundation-font-size-12` |
| Action | text color | `--semantic-color-interactive-text-strong-alt-default` (hover `-hover`, active `-active`) | `--foundation-color-grey-900` (`-800`, `-700`) |
| Action | background hover / active | `--semantic-color-interactive-background-light-alt-hover` / `-active` | `--foundation-color-grey-100` / `--foundation-color-grey-200` |
| Action | focus outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |

## Accessibility
- The action is a native `<button type="button">`; in chevron mode it carries `aria-expanded` and `aria-label` (falls back to "Toggle details").
- The hash glyph is `aria-hidden`; the identifier is read as plain text.
- Flags are Badges with a text label (HIGH RISK, SRU, SANCTION): status is never color only.
- The grade pill must keep its letter and number visible; its color alone is not meaningful.
- Contrast: label grey-700 on grey-050 is above 4.5:1; check the grade pill text against each grade color.

## Content guidelines
- Label: the entity's legal name as stored, no truncation of meaning.
- ID: the business identifier exactly as users search for it.
- Flags: uppercase short labels, as shown in Figma (HIGH RISK, SRU, SANCTION).
- Action label: a verb phrase, "View full details".

## Do / Don't
- Do show the topbox through Page Header (`Topbox=true`). Don't place a free-standing topbox above a custom header.
- Do keep at most one primary action in the strip. Don't add several buttons: secondary actions go to the Page Title actions.
- Do show critical flags only when true. Don't show a flag as disabled or greyed out.

## Related components
Composes: Icon, Grade, Policy color, Badge, Divider, Button · Used by: Page Header

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | To be defined | Version shown in the Figma header (Page Header doc frame); the Figma changelog is a placeholder. |
| Docs | 2026-11-04 | First ZeroHeight page. |
