# Do / Don't Figma illustrations, batch D

Library [Components] Action (`xCeEJPn6fliEshuE9fnrqs`). Additive only. Model: section 930:1069 (Button). Sections are 1360 wide, white (Semantic Static Background Main Primary), frames grey (Main Secondary), gaps bound to the same spacing variables as the model. Frames are 560 x 200 (Tile), 560 x 300 (Visual Button, Flyout Menu Item), 560 x 460 (Flyout Menu) because the real components are larger than a Button. All content is real instances. The Title and Separator rows of the Flyout Menu are the private `.Item` variants of Data Entry `Dropdown Flyout Menu`.

Placement is 560 px or more to the right of (or below) the existing content of each page.

## Tile (page 615:77), section 944:6130 at (5746, -1504)
| ZH rule | Frame | nodeId |
|---|---|---|
| Do: icon clearly matches the label | do · tile · icon matches label | 944:6131 |
| Don't: reuse the same icon for several tiles | dont · tile · same icon | 944:6160 |
| Do: keep all tiles of a row the same size | do · tile · same size | 944:6189 |
| Don't: mix Tiles and Visual Buttons in one choice | dont · tile · mixed with visual button | 944:6227 |

Skipped: none.

## Visual Button (page 288:822), section 944:6668 at (3348, -221)
| ZH rule | Frame | nodeId |
|---|---|---|
| Do: two to four side by side | do · visual button · two to four | 944:6669 |
| Don't: long grid | dont · visual button · long grid | 944:6695 |
| Do: description that helps choose | do · visual button · helpful description | 944:6746 |
| Don't: repeat the title in the description | dont · visual button · repeated title | 944:6764 |

Skipped: none.

## Flyout Menu (page 1:3), section 944:7236 at (6271, -2404)
| ZH rule | Frame | nodeId |
|---|---|---|
| Do: group long menus with section titles | do · flyout menu · section titles | 944:7237 |
| Don't: more than about seven actions without structure | dont · flyout menu · long flat list | 944:7276 |
| Do: close the menu after an action runs | do · flyout menu · one open at a time (approximation: a single open menu under its trigger; closing is behavior) | 944:7335 |
| Don't: two flyouts open at once | dont · flyout menu · two open at once | 944:7368 |

Skipped: Single choice pair (Do: check mark in its fixed slot / Don't: icon added for the selection). The Action library has no check-mark item (the Data Entry `.Item Type=Select` is a checkbox). Needs a Flyout Item with a selectable state first.

## Flyout Menu Item (page 1:3, no own page), section 944:7432 at (6271, -684)
| ZH rule | Frame | nodeId |
|---|---|---|
| Do: icons on all items or none | do · flyout menu item · icons on all | 944:7433 |
| Don't: mix rows with and without icons | dont · flyout menu item · mixed icons | 944:7462 |
| Do: disable an unavailable item | do · flyout menu item · disabled kept | 944:7487 |
| Don't: hide it | dont · flyout menu item · unavailable hidden | 944:7510 |

Skipped: Single choice pair (same reason as Flyout Menu). The "unavailable hidden" frame shows the menu without the item; the contrast with the Do frame carries the rule, add a caption in ZeroHeight.
