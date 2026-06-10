---
name: Qirin Design System
description: Sober, dense, reliable UI system for Allianz Trade credit assessment
colors:
  brand-blue: "#003781"
  interactive-blue: "#007ab3"
  interactive-blue-bright: "#008ed6"
  ink: "#121212"
  ink-secondary: "#414141"
  ink-tertiary: "#767676"
  surface: "#ffffff"
  surface-secondary: "#f5f5f5"
  surface-tertiary: "#ececec"
  border-subtle: "#d9d9d9"
  positive: "#1e8927"
  negative: "#b0050c"
  warning: "#e08d05"
  informative: "#496ebd"
typography:
  display:
    fontFamily: "Allianz Neo, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: "56px"
    letterSpacing: "0px"
  headline:
    fontFamily: "Allianz Neo, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "0px"
  title:
    fontFamily: "Allianz Neo, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "24px"
    letterSpacing: "0px"
  body:
    fontFamily: "Allianz Neo, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  body-compact:
    fontFamily: "Allianz Neo, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0px"
  label:
    fontFamily: "Allianz Neo, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.5px"
rounded:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "16px"
  round: "100px"
spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"
components:
  button-primary:
    backgroundColor: "{colors.interactive-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.interactive-blue}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "24px"
  badge-info:
    backgroundColor: "{colors.informative}"
    textColor: "{colors.surface}"
    rounded: "{rounded.round}"
    padding: "2px 8px"
  input-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
---

# Design System: Qirin

## 1. Overview

**Creative North Star: "The Underwriter's Desk"**

Qirin is a working surface for credit professionals, not a showroom. It carries the calm authority of an Allianz Trade underwriter's desk: everything needed is in front of you, arranged so the eye finds the constraint that matters without hunting. The system earns trust through rigor — consistent spacing, a single confident blue, status that always says what it means — never through decoration. Density is deliberate: a screen can hold a 14-criteria rule or a full buyer dossier and still read in one pass, because hierarchy (scale, weight, whitespace) does the sorting, not the user.

This system explicitly rejects the generic-AI-SaaS look: no cream or sand body backgrounds, no decorative gradients, no gradient text, no hero-metric template, no endless identical card grids, no uppercase tracked eyebrow above every section. It equally rejects the opposite failure — the austere gray-on-gray spreadsheet with no hierarchy — and anything consumer or playful (pastels, mascots, emoji, casual tone). The register is product: design serves the task.

**Key Characteristics:**
- One confident brand blue, used where action or identity lives; never sprinkled.
- Density with hierarchy: dense is fine, cluttered is not.
- Status meaning is never color-only — always paired with a label or icon.
- Every value flows from Figma-backed tokens (Foundation → Semantic); no hardcoded styles.
- Allianz Neo throughout, weight contrast over multiple families.

## 2. Colors

A restrained palette: corporate blues for identity and action, a disciplined grey ramp for structure and text, and four functional colors reserved strictly for status.

### Primary
- **Brand Blue** (#003781): The Allianz navy. Identity surfaces — the global header, brand marks, the deepest interactive-active state. Anchors the system without appearing on most controls.
- **Interactive Blue** (#007ab3): The single action color. Primary buttons, links, selected states, focus accents. This is the one voice of "you can act here."
- **Interactive Blue Bright** (#008ed6): The lighter interactive tint for emphasis, focus rings, and lighter accents (BlueA/400).

### Secondary
- **Informative Blue** (#496ebd): A distinct slate-blue (BlueB) reserved for informational status (badges, notices), kept separate from the action blue so "information" never reads as "clickable."

### Neutral
- **Ink** (#121212): Primary text. Headings and body that must hit ≥4.5:1.
- **Ink Secondary** (#414141): Secondary text, supporting labels, descriptions.
- **Ink Tertiary** (#767676): Tertiary text, captions, "Any"/inactive criteria, placeholders — still ≥4.5:1 on white.
- **Surface** (#ffffff): Primary background for cards and content.
- **Surface Secondary** (#f5f5f5): Page background, table-header fills, the recessed plane behind white cards.
- **Surface Tertiary** (#ececec): Deeper fills, hover plates on neutral surfaces.
- **Border Subtle** (#d9d9d9): Default 1px dividers and component borders.

### Tertiary (Functional status — reserved, never decorative)
- **Positive** (#1e8927): Accept decisions, success, "fresh" data.
- **Negative** (#b0050c): Refuse decisions, errors, "old"/expired data.
- **Warning** (#e08d05): "Create task" / action-required decisions, outdated data, caution.

### Named Rules
**The One Blue Rule.** There is exactly one action color (Interactive Blue #007ab3). If something is blue, it is actionable or selected. Informational blue is a different hue (BlueB #496ebd) on purpose; do not blur the two.

**The Status-Earns-Its-Color Rule.** The four functional colors (positive, negative, warning, informative) are forbidden as decoration. A green element means "accepted"; a red element means "refused/error." Color always rides alongside a label or icon, never alone (color-blind + grayscale safety).

## 3. Typography

**Display / Body / Label Font:** Allianz Neo (with `sans-serif` fallback)

**Character:** One family, the Allianz corporate typeface, carried across the whole system. Hierarchy comes from weight (400 regular → 600 semi-bold → 700 bold) and a stepped size scale, not from competing typefaces. The result is unmistakably institutional and quiet.

### Hierarchy
- **Display** (700, 48px, 56px line): Reserved for the largest moments (hero/dashboard titles). Rare in this product-register tool.
- **Headline** (600, 24px, 28px line): Page titles, card section titles.
- **Title** (600, 20px, 24px line): Sub-section titles, prominent labels.
- **Body** (400, 16px, 24px line): Default reading text. Cap measure at 65–75ch.
- **Body Compact** (400, 14px, 20px line): The workhorse for dense surfaces — tables, rule criteria, property panels. Most data lives here.
- **Label** (600, 12px, 16px, 0.5px tracking): Eyebrow captions, column headers, badge text. Uppercase allowed only here and ≤4 words.

### Named Rules
**The Weight-Not-Family Rule.** Never reach for a second typeface to create hierarchy. Allianz Neo at 400/600/700 plus the size scale covers every level. More than one family reads as indecision.

**The Compact-Default Rule.** On data-dense surfaces (tables, rule cards, property lists), 14px Body Compact is the default, not 16px. Density is a feature here; reserve 16px Body for prose and empty states.

## 4. Elevation

Flat by default, tonal layering first. Depth is conveyed primarily by surface tone (Surface white cards on a Surface Secondary #f5f5f5 page) and 1px subtle borders, not by shadow. Shadows are a response to state or true floating, never an ambient default.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 2px 0 rgba(65,65,65,0.25)`): Resting lift for a card that needs to detach slightly, or the open/active state of an expandable row.
- **Tooltip** (`box-shadow: 0 1px 3px 0 rgba(65,65,65,0.40)`): Tooltips.
- **Popover** (`box-shadow: 0 2px 3px 0 rgba(65,65,65,0.45)`): Popovers, dropdown flyouts.
- **Flyout** (`box-shadow: 0 2px 4px 0 rgba(65,65,65,0.50)`): Flyout menus.
- **Modal** (`box-shadow: 0 4px 8px 0 rgba(65,65,65,0.50)`): Modal dialogs.
- **Elevation** (`box-shadow: 0 1px 4px rgba(18,43,84,0.16), 0 4px 16px rgba(18,43,84,0.12)`): Product floating surfaces (search bar, floating panels) — a softer navy-tinted double shadow.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat at rest, separated by tone and 1px borders. A shadow appears only when an element floats (modal, flyout, popover) or responds to state (a rule card opening). If a static card has a drop shadow for "depth," it is wrong — flatten it.

## 5. Components

### Buttons
- **Shape:** Subtly rounded (4px, `{rounded.sm}`).
- **Primary:** Interactive Blue (#007ab3) fill, white text, 8px×16px padding. The action.
- **Hover / Focus:** Hover deepens toward Brand Blue (#003781); focus shows a visible ring (Interactive Blue Bright #008ed6). Keyboard focus is never suppressed.
- **Secondary:** White fill, Interactive Blue text + border. **Tertiary / Plain:** text-only, for low-emphasis and in-row actions.

### Chips / Tags
- **Style:** Surface Secondary (#f5f5f5) fill, Ink text, fully rounded or 4px per type. `ds-chip` (static/filter/select) and `ds-badge` are distinct: chips are interactive filters/selections, badges are read-only status.
- **State:** Selected chips take the action blue; filter chips carry a remove affordance.

### Cards / Containers
- **Corner Style:** 4px (`{rounded.sm}`).
- **Background:** Surface white (#ffffff) on a Surface Secondary (#f5f5f5) page.
- **Shadow Strategy:** None at rest (see Elevation, Flat-At-Rest). Shadow only on open/active state.
- **Border:** 1px Border Subtle (#d9d9d9).
- **Internal Padding:** 24px default (`{spacing.lg}`); use `noPadding` when the content manages its own rhythm.

### Inputs / Fields
- **Style:** White fill, 1px Border Subtle, 4px radius. Allianz Neo.
- **Focus:** Border shifts to Interactive Blue + visible focus ring. Never a glow-only cue.
- **Error / Disabled:** Error border in Negative (#b0050c) with a message; disabled at 40% opacity, non-interactive.

### Navigation
- **Style:** Global header in Brand Blue (#003781) with white nav text; collapsible left side-nav (56px collapsed / 280px expanded) with icon + label. Active item carries Interactive Blue. Tabs (in `ds-page-header`) are signal-driven, underline + weight on the active tab.

### Badges (status — signature)
Read-only status pills (`ds-badge`) in five statuses: info, success, warning, error, neutral; light or strong variant. They are the primary carrier of grade/decision/risk meaning and always show a label, never color alone.

## 6. Do's and Don'ts

### Do:
- **Do** reference semantic tokens for every color, space, size, and radius (`var(--semantic-...)`). Foundation → Semantic → component is the only path.
- **Do** keep one action color: Interactive Blue (#007ab3) means "actionable/selected," full stop.
- **Do** pair every status color with a label or icon (grades, decisions, freshness) — meaning must survive grayscale and color-blindness.
- **Do** default to 14px Body Compact on dense surfaces (tables, rule cards, property panels); reserve 16px for prose.
- **Do** keep surfaces flat at rest; add shadow only for floating layers or state changes.
- **Do** create hierarchy with Allianz Neo weights (400/600/700) and the size scale.

### Don't:
- **Don't** use cream / sand / beige body backgrounds, decorative gradients, or gradient text (`background-clip: text`). The page background is Surface Secondary #f5f5f5 or white.
- **Don't** ship the hero-metric template or endless identical icon+heading+text card grids.
- **Don't** put a tiny uppercase tracked eyebrow above every section, or numbered `01/02/03` section markers as scaffolding.
- **Don't** fall into the austere gray-on-gray dense grid with no hierarchy — density without hierarchy is noise.
- **Don't** use glassmorphism, heavy shadows, non-functional bright colors, or gratuitous animation.
- **Don't** go consumer/playful: no pastels, mascot illustrations, emoji, or casual copy.
- **Don't** use `border-left`/`border-right` >1px as a colored accent stripe on cards or callouts.
- **Don't** introduce a second typeface for hierarchy — weight and scale do that job.
- **Don't** hardcode a hex or px value in any component; if a token is missing, add it to Foundation/Semantic first.
