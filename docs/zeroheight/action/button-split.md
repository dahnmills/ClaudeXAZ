# Button Split
**Status**: Design Ready · Tech In code
A main action button joined to a chevron button that opens a menu of related actions.
Figma: [Components] Action › page Button Split (node 69:1883) · Storybook: `Design System/Action/Button Split` (id `design-system-action-button-split--default`) · Code: `shared/ui/button-split` (`ds-button-split`)

## Overview
Button Split puts the most frequent action on the left and the alternatives behind a chevron on the right. It composes a Button and a Button Icon with the same type and tone, and opens a menu placed under it. Embed the Storybook story `Default` as the live example, and the Figma component set `Button Split` (node 69:1883) as the visual reference.

## When to use / When not to use
- Use when one action is the default and two or more variants of it exist (Export as PDF, Export as Excel).
- Use when space allows only one button but several related actions must stay reachable.
- Use the Secondary type when the split action is not the main action of the area.
- Don't use when there is only one action → use Button instead.
- Don't use when the actions are unrelated to each other → use a "more" Button Icon with a Flyout Menu instead.
- Don't use to choose a value or a view → use Dropdown or Segmented Control instead.

## Anatomy
1. `Button` (exposed instance): the main action, with its `.Content` (icon and label).
2. `Right` (exposed `Button Icon` instance): the chevron toggle, `Chevron-Small Down` (up when open in code).
3. Menu (code, `[slot=menu]`): the content shown under the group when open, usually a `ds-flyout-menu`; min width 200px, 4px below the button.
4. Group (code): a `div` with `role="group"` that joins both parts; the toggle has a 1px left border.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Type | Variant | **Primary**, Secondary | `type: ButtonType` (default `'primary'`) | Code accepts all Button types (`tertiary`, `plain` too); Figma models Primary and Secondary only. |
| Open | Variant | **False**, True | internal `menuOpen` signal | Not an input: toggled by the chevron, closed on outside click and Escape. |
| (none) | | | `tone: ButtonTone` (default `'default'`) | Passed to both parts. Figma sets it through the exposed instances. |
| (none) | | | `reversed: boolean`, `disabled: boolean`, `loading: boolean` | Passed to both parts (`loading` only to the main button). |
| (none) | | | `primaryClicked` (output) | Main button click. |
| (none) | | | `toggleClicked` (output, `boolean`) | Emits the new open state. |

Slots: no Figma slot. In code: default projection is the main label, `[slot=icon-left]` an icon in the main button, `[slot=menu]` the menu content.

Exposed nested instances: `Button` (and its `.Content`: `Icon` Left, Right, None), `Right` (Button Icon: State, Type, Size, Tone, Reversed, Focus), `Icon Functional` of the toggle.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `Open=False` |
| Open | chevron click: `menuOpen` true, chevron turns up, menu shown | `Open=True` |
| Hover, Active, Focus | from Button and Button Icon | on the exposed instances |
| Disabled | `disabled` input on both parts, opacity 0.40 | through the exposed instances |
| Loading | `loading` input on the main button | through the exposed `Button` (`State=Loading`) |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Toggle | width, height | `--semantic-measurement-spacing-xl` | `--foundation-spacing-32` (32px) |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

Values written outside tokens in the SCSS: toggle left border 1px, menu offset 4px, menu min-width 200px. Colors come from Button and Button Icon.

## Accessibility
- The two parts sit in a `role="group"`; each part is a full button with its own focus.
- The toggle has `ariaLabel="Toggle menu"` written in the component; it does not expose `aria-expanded` or `aria-haspopup`. Add them, or a more specific label, if the menu content needs it.
- Escape closes the menu. Focus is not moved into the menu by the component.
- Click outside closes the menu.

## Content guidelines
- The main label names the default action with a verb ("Export").
- Menu items name the variants ("Export as PDF").
- One line, sentence case, no final punctuation, no em dash.

## Do / Don't
- Do keep the main action as the most used one; don't put a rare action on the main part.
- Do keep menu items close variants of the main action; don't mix unrelated actions in the menu.

## Related components
Composes: Button (`ds-button`), Button Icon (`ds-button-icon`), Icon (`ds-icon`), usually Flyout Menu in the menu slot · Used by: no other DS component.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Current version shown in the Figma header. The Versionning frame is still the empty template. |
