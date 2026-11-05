# [Components] Data Entry

Components that let users enter, choose and search data. Figma file `1wVY9FfjONIX6us9JmIm7U`. Code lives in `src/app/shared/ui`.

House rules for every form field: the label is semi-bold, never on two lines and never truncated (give the field the width it needs).

| Component | Status | Purpose |
|---|---|---|
| [Checkbox](checkbox.md) | Design Ready · Tech In code | Select one or several independent options, with an indeterminate state. |
| [Checkbox Card](checkbox-card.md) | Design Ready · Tech In code | Multi-selection among rich options presented as cards. |
| [Date Range](date-range.md) | Design Ready · Tech In code | Calendar panel to pick a date or a start and end date, on one or two months. |
| [Dropdown](dropdown.md) | Design Ready · Tech In code | Form field that opens a list to choose one value or several values as tags. |
| [Dropdown Flyout Menu](dropdown-flyout-menu.md) | Design Ready · Tech In code | The option list of dropdowns: single or multiple choice, flat or grouped. |
| [Inline Edit](inline-edit.md) | Design Ready · Tech In code | Edit a short value in place, with save, cancel and delete. |
| [Input Date](input-date.md) | Design Ready · Tech In code | Single-line field for one date. |
| [Input Email](input-email.md) | Design Ready · Tech In code | Single-line field for an email address. |
| [Input Search](input-search.md) | Design Ready · Tech In code | Single-line field to filter or search, with a clear button. |
| [Input Text](input-text.md) | Design Ready · Tech In code | The base single-line text field, with prepend and append. |
| [More Criteria](more-criteria.md) | Design New · Tech In code | Advanced buyer criteria panel opened from the Search Bar. |
| [Radio](radio.md) | Design Ready · Tech In code | Pick exactly one option from a small set. |
| [Radio Card](radio-card.md) | Design Ready · Tech In code | Single choice among emphasized options, or visual choice tiles. |
| [Search Bar](search-bar.md) | Design New · Tech In code | Master of scoped search bars: filters, query field and Search button. |
| [Select Button](select-button.md) | Design Ready · Tech In code | Compact icon-led selectable tile. |
| [Standalone Dropdown](standalone-dropdown.md) | Design New · Tech In code | Borderless text trigger for a menu or a single-choice list. |
| [Text Area](text-area.md) | Design Ready · Tech In code | Multi-line text field with helper text. |
| [Toggle](toggle.md) | Design Ready · Tech In code | On/off switch with immediate effect. |

## Private atoms (documented inside their parents)
- `.Label` (transverse page Label): field label with Optional and Remaining. Used by Input Text, Input Email, Input Date, Input Search, Text Area, Dropdown.
- `.Helper Text` (transverse page Helper Text): line under a field, Status Neutral, Informative, Negative, Warning, Positive, with an optional icon. Used by Text Area and Dropdown.
- Others: `.Input Content`, `.Prepend`, `.Append`, `.Selector`, `.Value`, `.Tags`, `.Text`, `.Item`, `.Item Properties`, `.Date`, `.Day`, `.Date Empty`, `.Resize Handle`, `.Text Area Content`, `.Chevron`.

## Not documented
- ☠️ Select Card: deprecated page.
- Auto Complete: on the WIP page, not published.
