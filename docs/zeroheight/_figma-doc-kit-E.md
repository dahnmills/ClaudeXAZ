# Doc kit applied to Data Entry (new components)

File `[Components] Data Entry` (`1wVY9FfjONIX6us9JmIm7U`), 2026-11-06. Kit: `docs/figma/doc-kit/doc-kit.js`. Nothing published, no component, variant, property, token or `ZeroHeight · ... illustrations` section touched.

Kit extensions made for this batch (backward compatible, saved in `doc-kit.js`): `anatomy.props` and `states[].props` (set component properties on the instance, matched by name before `#id`), `states[].scale` (rescale a wide instance), `states[].clone` (clone an instance that carries slot content, used for the six Grid Selection layouts), `anatomy.wide` (vertical panel, legend in 3 columns, for the 1400 px Search Bar Multi).

Placement: each doc frame is at x = 2400, y = 0 on its page, 1280 wide. Annotated content ends at x = 1840 (`ZeroHeight` sections), so the gap is 560 px, no overlap.

No old flat `Documentation · <Nom>` frame existed on these five pages, so nothing was deleted. The pages have no `Versionning` frame (only `_Design system header`), so there is no changelog frame to fill.

## Frames

| Component | Page | Doc frame | Banner | Anatomy | Properties | States | Tokens | Notes | Usage |
|---|---|---|---|---|---|---|---|---|---|
| Search Bar Home | `3098:2` | `3122:2` | `3122:10` | `3122:98` | `3122:312` | `3122:387` | `3122:487` | `3122:589` | `3122:619` |
| Search Bar Multi | `3102:2` | `3122:650` | `3122:652` | `3122:701` | `3122:957` | `3122:1042` | `3122:1729` | `3122:1832` | `3122:1857` |
| Tag Filter Chip | `3104:1002` | `3124:15` | `3124:23` | `3124:98` | `3124:323` | `3124:399` | `3124:739` | `3124:861` | `3124:894` |
| Grid Selection | `3105:2` | `3124:924` | `3124:926` | `3124:975` | `3124:1043` | `3124:1113` | `3124:1382` | `3124:1502` | `3124:1531` |
| File Upload | `3107:2` | `3124:1561` | `3124:1563` | `3124:1612` | `3124:1702` | `3124:1783` | `3124:1938` | `3124:2048` | `3124:2073` |

`miss` (variables not found) was empty for Home and Multi. For the other three the response was lost (transport drop) but the frames were built; a scan found no swatch or text without a variable binding.

## Template frames (`_Design system header`)

Header ids: Home `3099:23`, Multi `3103:498`, Tag Filter Chip `3104:1455`, Grid Selection `3106:2`, File Upload `3107:852`.

Filled: breadcrumb page title without the new-page emoji (`3099:33`, `3103:508`, `3104:1465`, `3106:12`, `3107:862`); File Upload version `1.0.0` to `0.1.0` (`3107:865`, from `components.json`). Descriptions, Design `New` and Tech `In code` tags, and the Properties notes were reviewed against the code and kept: they are accurate.

## Content truth (code first)

Versions come from `components.json`: Home, Multi, Tag Filter Chip, Grid Selection 1.0.0, File Upload 0.1.0. Tags: Design `New`, Tech `In code`, ZeroHeight `Draft (hidden)`. Storybook links point to the docs path of each story; File Upload has no story (stated on the card). ZeroHeight links are the hidden pages given in the brief.

## Gaps kept visible in the Notes of each frame

- Search Bar Home: scss uses Foundation spacing (8, 16, 4) instead of Semantic aliases; row padding 2 px literal; elevation token vs effect style `Shadows/Bottom/400`; flyout stacked in Figma vs absolute in code; `components.json` has no Figma node and Design false.
- Search Bar Multi: dropdown widths 160/200/124 in Figma vs 142/167/108 in code; Hash and Aa glyphs missing (File Text stand-in); filled query, clear button, phone prefix, Flag, tooltips, flyouts not drawn; fixed error-offset widths; `components.json` calls it superseded.
- Tag Filter Chip: `searchable` became the Flyout value; sample options are local; No match state, 6-row scroll limit and hover rows not drawn; `placeholder` not a Figma property; Field fixed at 320 px; only the Field trigger sets `aria-haspopup`/`aria-expanded` in code (the Chip trigger sets neither).
- Grid Selection: code reads `--semantic-color-interactive-background-subtle-default`, which does not exist in `_semantic.scss` (selected fill is unset in the browser); Figma uses `Interactive/Background/Light/Default`. 2 px border and 80 px miniature height are literals. Card is full width in code, 160 px in Figma. No `aria-pressed` on the selected card.
- File Upload: `opacity: 0.5` literal in the scss vs `Measurement/Opacity/Disabled` (0.40) in Figma; dashed border is a raw value on both sides; single sample file row; rejections have no visual state; `components.json` still says draft, no story, no Figma.

## Fixed after art-direction critique

- Pass 1 (screenshots of every section): the 1400 px Search Bar Multi could not fit the side-by-side anatomy panel at readable scale, so the kit got a `wide` mode (instance at 0.75, legend in 3 columns) and states use `scale 0.8` in one column. Home states use `scale 0.8` in two columns. Grid layouts use `clone` with `scale 0.85` to fit six tiles. File Upload states use two columns so the 480 px instance is not scaled.
- Pass 2: anatomy targets moved off text (Home markers 4, 7, 8), Tag Filter Chip marker 3 centred on the chevron, File Upload marker 5 pin moved below the dashed border (leader extended by 16 px), Home token cell mark `E` replaced by `fx`. Breadcrumb titles cleaned in the five templates.
- Remaining minor points: some targets sit on text by design (labels, placeholder), Grid Selection anatomy is large at scale 4 because the card is 160 px wide.
