# Principles
**Status**: Design Ready · Tech In code
The composition rules every Qirin component, screen and Figma file follows.
Figma: Tokens, [Components] Action, Data Display, Data Entry, Feedback, Layout · Code: `src/app/shared/ui` (Angular 19, standalone components, SCSS)

## Overview
Qirin is "The Underwriter's Desk": a sober, dense, reliable working surface for credit professionals. The rules below keep it consistent: Figma is the source of truth, every value comes from a token, and larger components are built from the existing atoms so that a change to an atom cascades everywhere.

## 1. Figma is the source of truth
- The Figma libraries (Tokens, Components, Layout) define visuals, property names and tokens. The code follows Figma, never the other way round.
- Figma and code may model a component differently (Figma uses fewer variants, booleans, exposed nested atoms and slots). Each component page documents the Figma model and gives the code mapping.

## 2. No hard-coded values
- Every color, spacing, size, radius, opacity, shadow and font value references a Semantic token (`var(--semantic-...)`). No hex, no px, no inline `style=""`.
- Two token tiers only: **Foundation** (raw values, `--foundation-...`) and **Semantic** (role aliases to Foundation, `--semantic-...`). Components consume Semantic tokens; a Semantic token always aliases a Foundation token.
- Naming: the Figma path in kebab-case, slashes become hyphens (`Measurement/Spacing/M` = `--semantic-measurement-spacing-m`).
- If a token is missing, add it to Foundation and Semantic (in Figma first), then use it.

## 3. Strict composition
Molecules and organisms compose the existing atoms instead of re-implementing them. Inside `shared/ui`, outside the atom itself:

| Don't use | Use instead |
|---|---|
| Native `<button>`, `<a>`, `<input>`, `<textarea>`, `<select>` | `ds-button`, `ds-button-icon`, `ds-link`, `ds-input-text` |
| Inline `<svg>` | `ds-icon` (add the path to the registry if missing) |
| A styled `<span>` or `<div>` pill | `ds-badge` (read-only status) or `ds-tag` (filter, selection) |
| A box rebuilt with background + border + radius | `ds-card` (exceptions with their own style: Modal, Flyout, Snackbar, Tooltip, Topbox) |
| Rewritten `:hover`, `:active`, `:focus-visible`, `:disabled` styles an atom already provides | The atom |

Only the underlying atom may use the native element: Button uses `<button>`, Link `<a>`, Input Text `<input>`, Icon, Flag and Logo `<svg>`.

Legitimate sibling atoms (not wrappers): Crumb wraps `ds-link`; Flyout Menu Item, Side Nav Item, Tab and Standalone Dropdown stay parallel atoms because their full-width rows with background states do not map to Link or Button.

Atoms to reuse systematically:

| Visual pattern | Atom |
|---|---|
| Inline navigable text | `ds-link` (tones default, neutral, reversed) |
| Call to action | `ds-button` |
| Icon-only button | `ds-button-icon` (`ariaLabel` required) |
| Status pill | `ds-badge` (info, warning, success, error, neutral) |
| Interactive tag | `ds-tag` (static, filter, select) |
| Icon | `ds-icon` |
| Card container | `ds-card` (`noPadding` for custom content) |
| Label and value list | `ds-properties-panel` |
| Dropdown menu item | `ds-flyout-menu-item` |
| Side navigation item | `ds-side-nav-item` |

## 4. Atoms, slots and local content
- Figma components prefixed with "." (for example `.Content`, `.Action`, `.Title`) are **private atoms**: they build the parent and are never used on their own in production work. In code they become internal elements or BEM modifiers, not standalone components.
- Library masters stay generic and expose **slots** for content. The content placed in a slot is local to the consuming file (a chart series, a table cell, the actions of a header), not a new library component.
- Keep component properties minimal: expose the nested atom (`isExposedInstance`) so its own properties (tone, text, icon) are set on the instance, instead of duplicating them as parent properties.
- Before creating a component, check the existing library and its internal atoms.

## 5. States
| Figma state | Implementation |
|---|---|
| Hover, Active, Focus | CSS only: `:hover`, `:active`, `:focus-visible` |
| Disabled | `disabled` input + `[attr.disabled]` + `:disabled` styles |
| Error | `error` input + `--error` modifier |
| Read only | `readonly` input + `[attr.readonly]` |

Purely visual states stay in CSS; states that change behavior or structure become inputs. Props in, events out: no business logic in UI components.

## 6. Accessibility
- WCAG 2.1 AA: body text at least 4.5:1, large text 3:1, visible focus, full keyboard navigation, correct ARIA roles.
- Status is never color-only: always a label or an icon with it.
- Every modal carries `dsFocusTrap`: focus moves into the box on open, Tab loops inside, focus returns to the trigger on close.
- `ds-segmented-control`: `mode="tabs"` to switch a view, `mode="radio"` for a setting.
- Reduced-motion alternatives for any animation.

## 7. Content
- Form field labels are semi-bold and never wrap to two lines: give the field the width it needs instead of truncating.
- No em dash in any text (interface, comments, documentation): use a colon, comma, period or parentheses. A lone dash may mark an empty value in a table cell.
- Tone: professional, precise, efficient. No emoji, no casual copy.

## Do / Don't
- Do compose `ds-card`, `ds-badge` and `ds-button` in a new organism. Don't rebuild a bordered box or a pill with a styled `div`.
- Do expose a nested atom and let the instance set its properties. Don't add a parent property that only forwards a child property.
- Do take every value from a Semantic token. Don't hard-code a px or hex value, even "just once".

## Changelog
| Version | Date | Change |
|---|---|---|
| Docs | 2026-11-04 | First ZeroHeight page, summarised from CLAUDE.md, DESIGN.md and PRODUCT.md. |
