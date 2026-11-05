# Breadcrumb
**Status**: Design Ready · Tech In code
A breadcrumb shows where the current page sits in the hierarchy and lets the user go back to a parent level.
Figma: [Components] Action › page Breadcrumb (node 298:5526) · Storybook: `Design System/Action/Breadcrumbs` (id `design-system-action-breadcrumbs--default`) · Code: `shared/ui/breadcrumbs` (`ds-breadcrumbs`)

## Overview
Figma description: "Breadcrumbs offer users a clear visual path to understand their current position within the site's hierarchy, helping them easily backtrack or jump to previous levels. They are especially useful in complex navigation structures, enhancing the user's orientation by providing contextual landmarks." The breadcrumb is a row of Crumb items; the last one is the current page. In code it can also hold page actions on the right. Embed the Storybook story `Default` as the live example, and the Figma component `Breadcrumb` (node 298:5526) as the visual reference.

## When to use / When not to use
- Use on pages that sit two or more levels deep (Buyers › Buyer › Policy).
- Use when users arrive on a detail page from search or a link and need the path back.
- Use the actions area (code) for page-level links and a "more" button aligned with the trail.
- Don't use on a top-level page with no parent → use Page Title alone instead.
- Don't use to switch between peer views of the same object → use Tab instead.
- Don't use to show the steps of a flow → use Stepper instead.
- Don't use as the main navigation → use Side Nav instead.

## Anatomy
1. `Breadcrumb` (container): horizontal row. In code: a trail area (20px high, fills the width, clips overflow) and an actions area on the right (32px high, gap 16px, hidden when empty).
2. `Crumb` items: each item is a `Link` instance followed by a chevron (`Chevron-Small Right`). In Figma the component holds 7 `Link` instances with their `.Specs` exposed; hide the ones you do not need. In code each item is a `ds-crumb`.
3. Current page: the last crumb, not a link, without chevron.
4. Actions (code only, `[slot=actions]`): links or icon buttons for the page.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| (none) | | | none | The Figma `Breadcrumb` is a single component without properties. Depth is set by showing or hiding the `Link` layers. |
| `.Specs` of each `Link` | Exposed instance | Label, Size, Icon, Weight, Decoration | `ds-crumb` `label` | Set the text of each crumb from the instance. |

Slots: no Figma slot. In code: default projection takes the `ds-crumb` items; `[slot=actions]` takes page actions (`ds-link`, `ds-button-icon`).

Exposed nested instances: 7 `.Specs` (one per `Link`), so each label is edited from the Breadcrumb instance.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | default |
| Item hover, active, focus | handled by each `ds-crumb` (through `ds-link`) | on the `Link` set |
| Current page | last `ds-crumb` with `currentPage` | `Crumb` `Current Page=True` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Container | gap trail / actions | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` (16px) |
| Actions | gap | `--semantic-measurement-spacing-m` | `--foundation-spacing-16` (16px) |

Values written outside tokens in the SCSS: container min-height 32px, trail height 20px, actions height 32px. Item tokens are documented on Crumb and Link.

## Accessibility
- The host has `role="navigation"` and `aria-label="Breadcrumb"`.
- The current crumb carries `aria-current="page"` and is not a link.
- Each parent crumb is a real `<a>` (through `ds-link`), reachable with Tab.
- Chevrons are decorative icons.

## Content guidelines
- Use the page or object name as the label, the same as its page title.
- Sentence case for sections; keep the case of proper names (company names can be upper case, as in the data).
- Keep the trail on one line; the trail clips rather than wraps.
- No em dash.

## Do / Don't
- Do end the trail with the current page; don't make the current page a link.
- Do keep labels identical to the page titles they point to; don't rename levels in the trail.
- Do put page actions in the actions area; don't mix action links inside the trail.

## Related components
Composes: Crumb (`ds-crumb`), Link (`ds-link`), Icon (`ds-icon` chevron), Button Icon (in actions) · Used by: app pages (Buyer Summary, Search, Admin Data, Portfolio Management, TAG Configuration and others), no other DS component. Figma Data Display publishes a related `Breadcrumbs - Topbox` component.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Version shown in the Figma header. The Versionning frame is still the empty template. |
