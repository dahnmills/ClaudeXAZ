# Do / Don't boards, batch D

Library [Components] Action (`xCeEJPn6fliEshuE9fnrqs`). Built with `docs/figma/doc-kit/board-kit.js` (`buildBoard`), in place in the sections `ZeroHeight · <Name> illustrations` (names and ids unchanged). Model: Button, 997:979. Rule texts are the exact ZeroHeight Usage texts (pages 9185885, 9185887, 9185766, 9185767). All bound to Tokens / Semantic (`miss` empty). Screenshots in `C:/Users/JDAHAN/AppData/Local/Temp/board-D/`.

## Tile (page 615:77), section 944:6130, board frame 999:6829, 1340 x 1030, at (9506, -1504)
Pairs: Icons (944:6131 / 944:6160), Row consistency (944:6189 / 944:6227). Text only: none. Placeholders: none.

## Visual Button (page 288:822), section 944:6668, board frame 999:7296, 1340 x 1230, at (7108, -221)
Pairs: Number of buttons (944:6669 / 944:6695), Description (944:6746 / 944:6764). Text only: none. Placeholders: none.

## Flyout Menu (page 1:3), section 944:7236, board frame 999:7492, 1340 x 1769, at (11871, -2404)
Pairs: Structure (944:7237 / 944:7276), Closing (944:7335 / 944:7368). Text only (page's "Single choice" rules, no frame): Do "Show the check mark in its fixed slot for single choice." / Don't "Add or remove an icon to show the selection: the label must not move."

## Flyout Menu Item (page 1:3), section 944:7432, board frame 999:7565, 1340 x 1449, at (13771, -2404)
Pairs: Icons (944:7433 / 944:7462), Unavailable items (944:7487 / 944:7510). Text only: Do "Keep the check mark slot for single choice." / Don't "Toggle a conditional icon to show selection."

## Original node ids check (getNodeByIdAsync after build)
All 16 exist with their original names, reparented into the board only: 944:6131, 944:6160, 944:6189, 944:6227, 944:6669, 944:6695, 944:6746, 944:6764, 944:7237, 944:7276, 944:7335, 944:7368, 944:7433, 944:7462, 944:7487, 944:7510.

## Deviations
- Flyout Menu page holds two Documentation frames (x 8191 and 10031, same y). The rule x = x_doc + 1840 would put the Flyout Menu board on top of "Documentation · Flyout Menu Item". Both boards are placed after the last Documentation frame instead: reading order header | Doc Flyout Menu | Doc Flyout Menu Item | board Flyout Menu | board Flyout Menu Item, 560 px gaps checked by script.
- Tile and Visual Button pages have no h3 rule headings: the topic titles (Icons, Row consistency, Number of buttons, Description) are invented groupings.
- `Versionning` sits to the LEFT of the headers on all three pages (user objects, not moved).
- Source frames keep their size (560 wide), so some stages look roomy (Flyout Menu "Closing" rows); not altered to keep ZeroHeight exports stable.
- The `use_figma` call for the Flyout page dropped its transport after finishing; the state was checked and both boards were complete (no rerun).
- Quality loop: 2 screenshot passes per board (full render, then geometry and id check); no layout defect found, no correction applied.
