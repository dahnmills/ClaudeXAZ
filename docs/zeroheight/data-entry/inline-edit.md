# Inline Edit
**Status**: Design Ready · Tech In code
Shows a value as text and lets users edit it in place, with save, cancel and optional delete actions.
Figma: [Components] Data Entry › page Inline Edit (node 2317:202) · Storybook: `Design System/Data Entry/Inline Edit` (`design-system-data-entry-inline-edit--default`) · Code: `shared/ui/inline-edit` (`ds-inline-edit`)

## Overview
Inline Edit displays a value with edit and delete icon buttons. Clicking edit swaps the text for an inline text field with save (check) and cancel (close) buttons; Enter saves, Escape cancels, and a short "saved" feedback follows a commit. Embed the Storybook `Default` story (and `Editing`, `Empty`) and the Figma component set `Inline Edit` (node 2317:202) from the `_Design system header` frame (2317:288). Note: the Figma header description is copied from Checkbox and the Tech badge shows "Draft".

## When to use / When not to use
- Use to rename an item where it is displayed (a board, a card, a filter set).
- Use for a single short value that is edited occasionally.
- Use when a full form or a modal would be heavier than the change.
- Don't use for several fields at once → use a form with Input Text in a Drawer or Modal instead.
- Don't use for long text → use Text Area instead.
- Don't use for a value picked from a list → use Dropdown instead.

## Anatomy
1. `Input Content`: the value text, and in edit mode the inline text field with the `.Selector` caret.
2. `Actions`: tertiary `Button Icon` instances (edit, delete with `Trash Outline` in display mode; save and cancel in edit mode).
3. Focus border: shown with `Border Focus`.

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| State | Variant | **Default**, Active, Hover, Disabled | `disabled`; edit mode is internal | Figma Active matches the editing mode in code. |
| Border Focus | Boolean | **False**, True | none | |
| none | | | `value` (model) | Saved value. |
| none | | | `placeholder` | Field placeholder in edit mode (default "Name"). |
| none | | | `emptyLabel` | Text shown when the value is empty (default "Untitled"). |
| none | | | `required` | Default true: an empty save shows "Name is required". |
| none | | | `deletable` | Shows the delete button (default true). |
| none | | | `ariaLabel`, `deleteAriaLabel` | Names of the edit and delete buttons. |
| none | | | outputs `(saved)`, `(cancelled)`, `(editStarted)`, `(deleted)` | |

Slots: none.
Exposed nested instances: the `Icon Functional` glyphs of the action buttons.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Default (display) | `editing` false | State=Default |
| Hover | `:hover` | State=Hover |
| Editing | edit button, internal `editing` signal | State=Active |
| Error | save with an empty value when `required` | not modeled |
| Saved | short feedback after commit (`ds-inline-edit--saved`, 1.2 s) | not modeled |
| Disabled | `disabled` input | State=Disabled |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| Host | border-radius | `--semantic-border-radius-s` | `--foundation-radius-4` |
| Host | inset | `--semantic-measurement-spacing-xs` | `--foundation-spacing-4` |
| Host | background | `--semantic-color-static-background-functional-subtle-positive` | `--foundation-color-green-050` |
| Host | opacity | `--semantic-measurement-opacity-transparent` | `--foundation-opacity-0` |
| Host | opacity | `--semantic-measurement-opacity-default` | `--foundation-opacity-100` |
| Display | grid-template-columns | `--semantic-measurement-sizing-none` | `--foundation-sizing-0` |
| Display | column-gap | `--semantic-measurement-spacing-l` | `--foundation-spacing-24` |
| Value, Editor | min-width | `--semantic-measurement-sizing-none` | `--foundation-sizing-0` |
| Value | color | `--semantic-color-static-text-main-primary` | `--foundation-color-grey-900` |
| Value | font-size | `--semantic-font-text-style-size-l` | `--foundation-font-size-16` |
| Value | font-weight | `--semantic-font-text-style-font-weight-regular` | `--foundation-font-weight-regular` |
| Value | line-height | `--semantic-font-text-style-line-height-l` | `--foundation-font-line-height-24` |
| Actions | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Host (disabled) | opacity | `--semantic-measurement-opacity-disabled` | `--foundation-opacity-40` |

## Accessibility
- Edit, delete, save and cancel are `ds-button-icon` with accessible names (`ariaLabel`, `deleteAriaLabel`, "Save", "Cancel").
- Keyboard: Enter saves and Escape cancels while editing.
- The required error comes from `ds-input-text` (`aria-invalid`, `role="alert"`).
- Give `ariaLabel` a specific name ("Rename board") rather than the default "Edit value".

## Content guidelines
- The empty label says what is missing ("Untitled"), never an empty space.
- Error message: "Name is required" (current code default, not configurable).
- Keep the edited value short enough to stay on one line.

## Do / Don't
- Do keep the value in place while editing. Don't move the field elsewhere on the page.
- Do confirm destructive delete in the parent. Don't delete on a single click without a way back.

## Related components
Composes: Input Text (`variant="inline"`), Button Icon, Icon · Used by: Filter Drawer, Card Builder Lab screen.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0 | date unknown | Initial version (the Figma Versionning frame 2317:421 is still the empty template). |
