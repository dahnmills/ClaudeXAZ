# Header
**Status**: Design To be defined · Tech In code
The global application bar of Qirin: brand logo, main navigation, shortcut actions and the user account, on the brand blue band.
Figma: [Components] Layout › component Header (key `39e53ceff3e27048d193a6a0e8d87a6337f410d5`; file not accessible, node To be defined) · Storybook: `Design System/Layout/Header` › Qirin · Code: `shared/ui/header` (`ds-header`)

## Overview
The Header sits at the top of every screen of the shell, 64 px high, full width. It identifies the product (Logo Qirin, reversed) and carries the top-level navigation (Home, Buyers, Policies, Tools, Configuration in the Storybook story), a few icon shortcuts (search, help, notifications) and the account entry. Embed the Storybook story `Qirin` and the Figma component set Header (variant `Menu Open=False`).

## When to use / When not to use
- Use when building any page of the Qirin application shell.
- Use when you need the top-level navigation between product areas.
- Use when global shortcuts (search, help, notifications) and the account must stay reachable from every page.
- Don't use when you need navigation inside a dossier or a page: → use Side Navigation or Tab instead.
- Don't use when you need a page title, breadcrumbs or page actions: → use Page Header instead.
- Don't use when the content is a modal flow: → use Modal or Drawer instead (the Header stays behind them).

## Anatomy
1. `Content` › `Left` › `Logo Qirin` (Logo atom, `Reversed=True`): product identity. Code: slot `logo` (`ds-logo [reversed]="true"`).
2. `Content` › `Left` › `Menu`: row of `.Item` atoms, one per product area. `.Item` (private) has `State` (Default, Hover, Active, Disabled), `Selected`, `Reversed`, `Expandable` (chevron, opens a menu) and a `Focus` boolean. Code: slot `tabs` (`ds-tab tone="reversed"`), wrapped in a `<nav role="tablist">`.
3. `Content` › `Shortcuts` › `Actions`: up to 6 `Button Icon` (Type Tertiary, Reversed True; 3 visible at Size M, 3 hidden at Size S). Code: slot `actions` (`ds-button-icon type="tertiary" [reversed]="true"`).
4. `Content` › `Shortcuts` › `Account`: an `.Item` (Expandable True) showing the user name. Code: slot `account`.
5. `.Flyout` (only in `Menu Open=True`): the menu opened from an expandable item.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Menu Open | Variant | **True**, False | none | True adds the `.Flyout` below an expandable item. In code the menu is composed by the consumer; `ds-header` has no inputs. |

Slots: Figma has no slot property; content is set through the nested `.Item` and `Button Icon` instances. Code exposes four content slots: `logo`, `tabs`, `actions`, `account`.

Exposed nested instances: none flagged as exposed on the Header set. Nested atoms: Logo Qirin (`Reversed`), `.Item` (`State`, `Selected`, `Reversed`, `Expandable`, `Focus`), Button Icon (`Type`, `Size`, `Reversed`, `Tone`).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Selected area | `[selected]="true"` on the `ds-tab` of the current area | `.Item` `Selected=True` |
| Hover / Active | `:hover` / `:active` on `ds-tab` and `ds-button-icon` (atom states) | `.Item` `State=Hover` / `Active` |
| Focus | `:focus-visible` on the atoms | `.Item` `Focus=True` |
| Disabled | `disabled` on the atom | `.Item` `State=Disabled` |
| Menu open | composed by the consumer (flyout) | `Menu Open=True` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | height | `--semantic-measurement-sizing-3xl` | `--foundation-sizing-64` |
| Host | background | `--semantic-color-static-background-brand` | `--foundation-color-blue-a-800` |
| Host | color | `--semantic-color-interactive-text-neutral-default` | `--foundation-color-white-1000` |
| Left (logo to menu) | gap | none (Foundation used directly) | `--foundation-spacing-40` |
| Menu items | gap | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Right (actions to account) | gap | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Actions | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |

## Accessibility
- Host has `role="banner"`. The navigation is a `<nav role="tablist" aria-label="Navigation principale">` (label in French in code: to be translated or aligned).
- Every shortcut `ds-button-icon` needs an `ariaLabel` (mandatory on the atom).
- Keyboard and focus come from the atoms (`ds-tab`, `ds-button-icon`): visible focus is never suppressed.
- Contrast: white text on Brand Blue #003781 passes WCAG AA.

## Content guidelines
- One word per area where possible (Home, Buyers, Policies, Tools, Configuration).
- Shortcuts are icon-only: the `ariaLabel` is the visible meaning, write it as the action ("Search", "Help", "Notifications").
- The account entry shows the user name.

## Do / Don't
- Do mark exactly one area as selected. Don't select two items or none on a page that belongs to an area.
- Do keep shortcuts to the 3 icons drawn at Size M. Don't add text buttons in the shortcuts zone.
- Do use the reversed atoms on the blue band. Don't place default (non-reversed) atoms on Brand Blue.

## Related components
Composes: Logo, Tab (`.Item` in Figma), Button Icon, Flyout Menu · Used by: the application shell (with Side Navigation and Page Header)

## Changelog
| Version | Date | Change |
|---|---|---|
| Docs | 2026-11-04 | First ZeroHeight page. |
| To be defined | To be defined | Figma changelog not accessible. |
