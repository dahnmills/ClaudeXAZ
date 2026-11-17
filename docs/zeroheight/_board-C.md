# Do / Don't boards, lot C

Library [Components] Action (xCeEJPn6fliEshuE9fnrqs). Built with `docs/figma/doc-kit/board-kit.js` (`buildBoard`), same model as the Button board (997:979). Rules read from the ZeroHeight Usage tabs (pages 9166116, 9185884, 9185883, 9185886). All fills, gaps and text styles are bound to Tokens / Semantic (no token created). Not published.

## Segmented Control (page 302:2)
- Section `ZeroHeight · Segmented Control illustrations` 944:4474 (name unchanged), board frame 999:6756, 1740 x 1129, at x 3063, y 700 (Documentation frame 981:2651 right edge 2503, gap 560).
- Pairs: Number of segments (944:4475 / 944:4501), Disabled options (944:4535 / 944:4562).
- Text only: Role, Do "Use mode="radio" for a setting and mode="tabs" for a view switch." and Don't "Mix the two roles in the same control." (code and a11y difference, no visual).
- Placeholders: none.

## Tab (page 56:228)
- Section `ZeroHeight · Tab illustrations` 944:4797, board frame 999:8197, 1280 x 1321, at x 1367, y 2091 (Documentation 983:3251 right edge 807, gap 560).
- Pairs: Purpose (944:4798 / 944:4848), Width (944:4898 / 944:4964), Counter (944:5078 / 944:5128).
- Text only: none. Placeholders: none.

## Pagination (page 52:779)
- Section `ZeroHeight · Pagination illustrations` 944:5703, board frame 1001:1105, 1740 x 1170, at x 1812, y -301 (Documentation 985:1462 right edge 1252, gap 560).
- Pairs: Stable page size (944:5838 / 944:5931), Under the list (944:6030 / 944:6129). The ZeroHeight page has no h3 above these rules, so the titles come from `_dodont-figma-C.md`.
- Text only: none. Placeholders: none.

## Stepper (page 312:1332)
- No section existed and the page holds no component. New section `Do and Don't board - Stepper` 1001:3488 (hyphen, not a ZeroHeight illustrations section, no item-id attached), board frame 1001:3489, 1280 x 590, at x 0, y 0 (empty page, no Documentation frame, no header).
- Text only (4): Completed steps Do/Don't, Errors Do/Don't, exact ZeroHeight text. No pairs, so the empty "Pairs" frame was removed.

## Original nodeIds check
All 14 frames exist, none renamed, duplicated or recreated, only reparented into the board cards:
944:4475, 944:4501, 944:4535, 944:4562 (Segmented Control); 944:4798, 944:4848, 944:4898, 944:4964, 944:5078, 944:5128 (Tab); 944:5838, 944:5931, 944:6030, 944:6129 (Pagination).

## Deviations and notes
- The three sections moved from their old slot (header x + about 4200) to Documentation x + 1840, same y as the Documentation frame (which sits below the header). Gaps are exactly 560, no overlap on any page.
- `Versionning` frames sit to the LEFT of the first header on these pages (user objects, not moved).
- A tool connection drop happened during the Tab build; the build had completed, no duplicate board (one child in the section).
- Illustration frames keep their size (760 or 520 wide). Pagination and Segmented Control boards are 1740 wide because of the 760 frames; Tab is 1280.
- Quality loop: screenshots in `C:/Users/JDAHAN/AppData/Local/Temp/board-C/`. Pass 1 flagged an empty gap in the Stepper board (empty Pairs frame) and tight rows; fixed, pass 2 clean.
