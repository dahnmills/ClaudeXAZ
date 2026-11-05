# Tag
**Status**: Design Ready · Tech In code
A small, square-cornered label used to show, select or remove a filter value.
Figma: [Components] Action › page Tag (node 102:558) · Storybook: `Design System/Action/Tag` (id `design-system-action-tag--select-default`) · Code: `shared/ui/tag` (`ds-tag`)

## Overview
Tag shows a short value on a light blue plate. It has three types: Static (read-only), Filter (an applied filter with a close part on the right) and Select (a value the user turns on and off, with a check mark when selected). Embed the Storybook story `SelectDefault` as the live example, and the Figma component set `Tag` (node 102:558) as the visual reference.

## When to use / When not to use
- Use Select for multi-choice filter values in a filter panel or a criteria list.
- Use Filter to list the filters already applied, each removable on its own.
- Use Static to show a value or a category in a compact, read-only way.
- Use when the value is short and many tags appear side by side.
- Don't use when the value is a status (accepted, refused, pending) → use Badge instead.
- Don't use for pill-shaped quick toggles → use Chip instead.
- Don't use when only one option can be active → use Segmented Control or Radio instead.
- Don't use to navigate → use Link instead.

## Anatomy
1. `Tag` (container): holds one `.Options` instance that changes with `Type`.
2. `.Options` (private atom, one per type):
   - Filter `.Options` (node 102:347, `State`, `Type` Default or Dropdown): two joined plates, the label on the left and a close icon (`Close` glyph) on the right.
   - Select `.Options` (node 102:494, `State`, `Selected`): one plate with the label, a check icon and a 1px blue border when selected.
   - Static `.Options` (node 102:537, no property): one plate with the label.
3. Label (text): semi-bold 14px, line-height 16px.
4. `Icon Functional`: close (Filter) or check (Select), 12px in code.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| Type | Variant | Static, **Filter**, Select | `type: 'static' \| 'filter' \| 'select'` (default `'select'`) | Defaults differ: Filter in Figma, select in code. |
| `.Options` › State | Variant (exposed) | **Default**, Hover, Active, Disabled | Hover, Active: CSS. Disabled: `disabled: boolean` | On Filter and Select. |
| `.Options` › Selected | Variant (exposed, Select only) | **False**, True | `selected: boolean` (default `false`) | Written to `aria-pressed`. |
| `.Options` › Type | Variant (exposed, Filter only) | **Default**, Dropdown | none | Code gap: no Dropdown filter tag in code. |
| (none) | | | `label: string` (required) | The label text. |
| (none) | | | `toggled` (output) | Select tags, on click, Enter, Space. |
| (none) | | | `removed` (output) | Filter tags, on click, Enter, Space. |

Slots: none, in Figma and in code.

Exposed nested instances: `.Options` is exposed, so its `State`, `Selected` (Select) and `Type` (Filter) are set from the Tag instance.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default | Rest state | `.Options` `State=Default` |
| Hover | `:hover` (Filter: right plate only; Select: whole plate) | `State=Hover` |
| Active | `:active` | `State=Active` |
| Focus | `:focus-visible`: 3px outline, 2px offset | no variant |
| Selected | `selected` input on Select tags (check icon, blue border) | `Selected=True` |
| Disabled | `disabled` input: `aria-disabled`, no tab stop, opacity 0.40 | `State=Disabled` |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Label | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Label | font-size | `--semantic-font-text-style-size-m` | `--foundation-font-size-14` (14px) |
| Label | font-weight | `--semantic-font-text-style-font-weight-semi-bold` | `--foundation-font-weight-semi-bold` (600) |
| Label | line-height | `--semantic-font-text-style-line-height-s` | `--foundation-font-line-height-16` (16px) |
| Label | letter-spacing | `--semantic-font-text-style-letter-spacing-s` | `--foundation-font-letter-spacing-0-2` (0.2px) |
| Plate | gap | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` (4px) |
| Plate | padding | `--semantic-measurement-spacing-xs` `--semantic-measurement-spacing-s` | `--foundation-spacing-4` / `-8` |
| Plate | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` (4px) |
| Plate | background default / hover / active | `--semantic-color-static-background-main-alt-{primary,secondary,tertiary}` | `--foundation-color-blue-a-025` / `-050` / `-100` |
| Label, icon | color default / hover / active | `--semantic-color-interactive-text-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Select selected | border color default / hover / active | `--semantic-color-interactive-border-strong-{default,hover,active}` | `--foundation-color-blue-a-500` / `-600` / `-700` |
| Focus ring | outline color, radius | `--semantic-color-interactive-border-focus`, `--semantic-border-radius-s` | `--foundation-color-blue-a-400`, `--foundation-radius-4` |
| Disabled | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

Values written outside tokens in the SCSS: border 1px, focus outline 3px and offset 2px. The plate backgrounds use Static tokens while the states are interactive.

## Accessibility
- Role: `role="button"` on the host. Select tags expose `aria-pressed`.
- Keyboard: Filter and Select tags are in the tab order; Enter and Space activate (Space does not scroll). Static tags are not focusable.
- Disabled: `aria-disabled="true"`, out of the tab order.
- Filter: the close icon is decorative; the whole tag removes the filter. Give the group a visible title so the user knows the tags are applied filters.
- Selection is shown by a check icon and a border, not only by color.

## Content guidelines
- One to three words. Write the value, not a sentence.
- Sentence case, no final punctuation.
- Keep each tag on one line.
- No em dash.

## Do / Don't
- Do use Select tags for multi-choice filters; don't use them when only one value can be active.
- Do use Filter tags to show what is applied; don't hide the remove action in a menu.
- Do use Badge for statuses; don't use a Tag to say accepted or refused.

## Related components
Composes: Icon (`ds-icon`: close, check) · Used by: Action Card, Filter Drawer, More Criteria, Multi Select, Properties Panel, Shortcuts Panel.

## Changelog
| Version | Date | Change |
|---|---|---|
| 2.0.0 | date unknown | Current version shown in the Figma header. The Versionning frame is still the empty template. |
