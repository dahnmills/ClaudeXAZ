# Standalone Dropdown
**Status**: Design New · Tech In code
A text trigger, without a field or a border, that opens a menu or a single-choice list for light choices next to content.
Figma: [Components] Data Entry › page 🆕 Standalone Dropdown (node 3023:214) · Storybook: `Design System/Action/Standalone Dropdown` (`design-system-action-standalone-dropdown--default`) · Code: `shared/ui/standalone-dropdown` (`ds-standalone-dropdown`)

## Overview
Standalone Dropdown is a 32px text trigger with an optional leading icon, a label and a chevron. Without options it only emits a click and the screen opens what it needs (actions menu, panel). With options it carries a single-choice list (Dropdown Flyout Menu, Multi-Select=False): one flyout open at a time, closed on outside click and Escape, the selected option ticked in a fixed slot so labels never move. An empty label shows the selected option. Embed the Storybook `Default` story (and `OptionsAlignedEnd`) and the Figma component set `Standalone Dropdown` (node 3023:214) from the `_Design system header` frame (3022:801). Note: in Storybook it is filed under Action, while Figma places it in Data Entry.

## When to use / When not to use
- Use for a secondary choice that changes how content is shown (Group by, Sort, Search in), placed right above or beside that content.
- Use as a filter trigger inside a Search Bar.
- Use without options as a light trigger for an actions menu or a panel.
- Don't use for a form value the user must fill → use Dropdown (Select) instead; Standalone Dropdown has no label, error or helper text.
- Don't use for a main action → use Button instead.
- Don't use for multiple selection → use Dropdown (multi-select) instead.

## Anatomy
1. `Leading icon`: optional `Icon Functional` (exposed, glyph swappable), shown with `Icon`. In code, `icon` or projected content with `slot="icon"` (for example a `ds-flag`).
2. `Label`: the trigger text (text property, default "Group by").
3. `Chevron` › `Chevron icon`: the `.Chevron` private atom (exposed), down when closed, up when open; its color follows the Tone.
4. `Border Focus`: focus ring, shown with `Focus`.
5. Flyout (code, with options): a Dropdown Flyout Menu under the trigger, aligned on the start or end edge.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Tone | Variant | **Accent**, Default | `tone` (`'accent'` default, `'default'`) | Accent is grey, Default is blue. |
| State | Variant | **Default**, Hover, Active, Disabled | `disabled`; Hover and Active are pseudo-classes | |
| Label | Text | **"Group by"** | `label` | Empty label in code shows the selected option label. |
| Icon | Boolean | **False**, True | `icon` (IconName or null) or `slot="icon"` | |
| Focus | Boolean | **False**, True | none (`:focus-visible`) | |
| `.Chevron` › Open | Variant (exposed) | **False**, True | internal `open` state | Chevron rotates 180° when open. |
| `.Chevron` › Tone | Variant (atom) | Default, Accent | follows `tone` | Set to match the dropdown Tone. |
| `Leading icon` | Exposed instance | glyph swap (`Icon Functional`) | `icon` | |
| none | | | `options` (`SelectOption[]`), `value` (model) | Single-choice list. Empty: trigger only. |
| none | | | `flyoutAlign` (`'start'`, `'end'`) | `end` opens the list toward the left. |
| none | | | `(clicked)`, `(selectionChange)` | |

Slots: `icon` (code: projected leading content such as a flag). No Figma slot.
Exposed nested instances: `Leading icon` (Icon Functional: glyph) and `Chevron icon` (`.Chevron`: Open).

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | no input | State=Default |
| Hover | `:hover` | State=Hover |
| Active | `:active` | State=Active |
| Disabled | `disabled` input, `aria-disabled`, `tabindex="-1"` | State=Disabled |
| Focus | `:focus-visible`, 3px focus outline | Focus=True |
| Open | list open (`ds-standalone-dropdown--open`), chevron up | `.Chevron` Open=True |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Host, Chevron | height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |
| Host | color | `--semantic-color-interactive-text-strong-default` | `--foundation-color-blue-a-500` |
| Host | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Host | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Host | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |
| Host | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Host (hover) | color | `--semantic-color-interactive-text-strong-hover` | `--foundation-color-blue-a-600` |
| Host (active) | color | `--semantic-color-interactive-text-strong-active` | `--foundation-color-blue-a-700` |
| Host | color | `--semantic-color-interactive-text-strong-alt-default` | `--foundation-color-grey-900` |
| Host (hover) | color | `--semantic-color-interactive-text-strong-alt-hover` | `--foundation-color-grey-800` |
| Host (active) | color | `--semantic-color-interactive-text-strong-alt-active` | `--foundation-color-grey-700` |
| Host (focus-visible) | outline | `--semantic-color-interactive-border-focus` | `--foundation-color-blue-a-400` |
| Host (focus-visible), Chevron | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |
| Flyout | top | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Chevron | width | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` |

## Accessibility
- The host has `role="button"`, `tabindex="0"` and `aria-disabled` when disabled. With options it adds `aria-haspopup="listbox"` and `aria-expanded`.
- Keyboard: Enter and Space open or close; Escape closes. Arrow-key navigation inside the list is not built in.
- List items are `ds-flyout-menu-item` with `role="option"` and `aria-selected`; the selected option shows a check.
- With an icon only and an empty label (no selected option), the trigger has no accessible name: always show a label.

## Content guidelines
- Keep the label short and say what the choice changes ("Group by: Stage").
- Sentence case, one line, never truncated.
- Option labels short and parallel.

## Do / Don't
- Do place it right above or beside the content it changes. Don't put it far from that content.
- Do use it for light, reversible display choices. Don't use it for a required form value ("Country *"): it has no label, error or helper text.
- Do keep the check in its fixed slot. Don't add an icon only to the selected option.

## Related components
Composes: Icon, `.Chevron`, Dropdown Flyout Menu (`ds-flyout-menu`, `ds-flyout-menu-item`) · Used by: Search Bar (`ds-search-bar-scoped`, `ds-search-bar-multi`), Portfolio Management, TAG Configuration and Search V2 screens.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | November 3, 2026 | Added from code (`ds-standalone-dropdown`). Note: its list reuses Dropdown Flyout Menu, no new item. |
