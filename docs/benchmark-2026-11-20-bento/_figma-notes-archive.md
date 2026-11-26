# Figma Bento, textes retirés du fichier (2026-11-26)

Fichier `XW7jVtIa6UWRTqKMDqOF5D`. Textes longs retirés lors du désencombrement (`_figma-declutter.md`), copiés ici
mot pour mot pour ne rien perdre. Les décisions qu'ils décrivent sont aussi dans `_figma-card-kit.md`,
`_figma-mockups.md` et `_figma-feedback-2026-11-25.md`.

## Card kit

### 01 Master

Intro : One library master for every card of the Buyer Summary V2 board: Widget Card ([Components] Data Display).
Emphasis and State are the only variants; the size is free (the card resizes to the 14 formats); the content goes in
the Content slot, built with the library and local content atoms of section 05. Header and footer are private atoms,
exposed on the instance.

Ligne : Since 24 Nov 2026 this section shows instances of the published library [Components] Data Display: Widget Card
and its private atoms. The former local master Bento Card is replaced everywhere in this file.

Notes (pastilles 1 à 4 sur l'anatomie 2 x 2 Subtle) :

1. .Card Header: the business question as title (the short title in 1 column), optional info icon, unit and Plain
   Button Icon. Never on two lines in 1 column.
2. .Status: icon + label, never the colour alone. The reason is a visible second line of .Card Header (Reason, 12 px
   regular, secondary text): on by default for Warning and Problem, mandatory on the 2 automatic backgrounds, off for
   On track. Never in a tooltip. In 1x1, it replaces the context line of the key figure.
3. Content slot: fill it with the library atoms (Key Figure, Sparkline, Bullet Graph, Stacked Bar, Group Heading) and
   the local atoms (List row, Timeline item...). Gap S between atoms, the slot fills the card: nothing may overflow the
   bottom edge.
4. .Card Footer, off by default: the date of the data when it differs from the board date, or one Link (See figures,
   Open all jobs).
5. Properties kept minimal: Emphasis and State (variants), Content (slot), Footer (boolean); header and footer are
   exposed instances. Size is not a variant: resize the instance to N x 180 + (N - 1) x 16.
6. Variants: 8 Emphasis x Default, and None only for Loading, Empty, Error and Edit (12 instead of 40). A loading,
   empty, failing or edited card never shows its emphasis colour, so the cross product would only add weight.
7. Padding M (16), gap S (8), radius Border/Radius/M (8). One border language: None and Subtle keep a 1 px
   Border/Subtle/Tertiary edge; Negative, Warning and Positive subtle get a full 1 px border in the tone
   (Border/Main/Functional/<tone>, Border/Size/S), no accent bar (DESIGN.md). Warning follows the Badge convention:
   Text and Icon/Main/Functional/Warning on Background/Functional/Subtle/Warning, white on Background/Functional/Warning
   (DS contrast exception).

### 02 Sizes

Intro : Size is not a variant: resize the instance. One unit is 180 px at 1280 (1160 = 6 x 180 + 5 x 16), the gutter
is Spacing/M. A card N columns wide is N x 180 + (N - 1) x 16, same rule for rows. The slot is left empty here.

Notes :

1. Grid at 1280: 1280 - 56 (rail) - 2 x 32 (margins) = 1160 = 6 x 180 + 5 x 16. Columns and rows are square, the
   gutter is Spacing/M. At 1920 (8 columns) the unit is 211, at 1024 (4 columns) 214: same formula.
2. Title: the business question from 2 columns wide, the short title in 1 column (Grade, Limit left, Jobs to do). A
   1-column title never wraps.
3. Square and horizontal cards hold a key figure first; vertical cards hold a list (jobs, news, notes); blocks hold a
   chart or a table with its key figure.
4. Bottom edge: the board always forms a rectangle; a card that grows shows more real data (more rows, a chart), never
   empty space. Free cells are closed by stretching a list card.
5. Proposition: the unit (180, 211, 214) and the card sizes have no token, they are layout values computed from the
   grid (question 2 of the benchmark).
6. Fold: when the board loses columns a card drops to a smaller format and hides content before squeezing it. 1x1
   never folds. 2x1 to 1x1 (rate and bar). 3x1 to 2x1 without the trend, then 1x1. 4x1 to 2x1 (decision and bullet).
   2x2 to 1x2 (history kept, bullet dropped). 3x3 to 2x3, then 1x3. 1x2 and 1x3 unchanged (link to the rest). 1x4 to
   1x3 (3 latest). 3x2 to 2x2, then 1x2. 2x3 to 1x3 (key figures only). 4x2 to 2x2 (top 3 policies and others). 4x3 to
   2x3 (table only). Full width stays full width: 6x1 at 1280, 8x1 at 1920, 4x1 at 1024 with fewer indicators.

### 03 States

Intro : Default, Loading, Empty, Error and Edit, shown on the same card (How much limit is left?) at 1 x 1, 2 x 1 and
2 x 2. Loading keeps the title and draws the skeleton at the final size; Empty says the fact and its date; Error keeps
the card in place with a Retry.

Notes :

1. Default: the key figure first, then its bound, then as many facts as the card holds. 1 column: short title, rounded
   value (3.45 M), no unit.
2. Loading: title kept, skeleton drawn at the final size (value, context, bar, then the rest). Several cards load one
   by one; the board keeps its shape.
3. Empty: never a blank card. The fact and its date, with a link to the history or details when there is one
   (Local - Empty hint).
4. Error: library Functional Notice (Low, Error) with the source that failed, and a Tertiary Retry button. The rest of
   the board stays usable.
5. Edit: the V1 floating toolbar (.Card Toolbar of the library) sits across the top edge, centred: sizes 1 x 1 / 2 x 1
   / 2 x 2 / More, Background (colour swatch showing the current background, never a star), drag handle, duplicate,
   remove. Wider than a 1-column card: keep 120 px between cards on specs.
6. States show on Emphasis None only: a loading, empty, failing or edited card does not show its emphasis colour.

### 04 Emphasis

Intro : The levels of the page Emphasis levels, as the Emphasis variant: None, Subtle and Strong are manual
highlights; the status tones are computed from the business thresholds (at most 2 automatic backgrounds per board, the
analyst can hide or force them). No full green. Status is always icon + label.

Légendes par niveau (raccourcies dans le fichier) :

- None : Default card, no background. A status label can still show without a background (here: Score stable, no status).
- Subtle : Manual highlight, pale blue tint and neutral 1 px edge, no label. 1 or 2 per board.
- Strong : Manual highlight, navy, reversed atoms. 1 per board, the main card.
- Negative subtle : Problem, pale: the automatic Problem background forced to pale by the analyst.
- Negative strong : Problem, full red: an open blocking fact (sanction hit). Automatic, at most 1 per board.
- Warning subtle : Warning, pale: a threshold close to be met (review due in less than 30 days). Automatic.
- Warning strong : voir le texte d'origine ci-dessous.
- Positive subtle : On track, pale green: forced only (by default On track keeps its label without background).

Notes :

1. Manual emphasis: None (default), Subtle (pale blue tint + neutral 1 px edge, 1 or 2 per board), Strong (navy, the
   one main card). No label, no star: the background alone says the emphasis. Chosen with the Background button of the
   card toolbar in edit mode, a colour swatch showing the current background.
2. Status tones are computed from the thresholds of buyer-summary-v2.status.ts, never picked by hand: Problem (red),
   Warning (orange), On track (green). The 2 most urgent get a background, the others keep icon + label.
3. No Positive strong: full green is never used (white on green is 4.50, at the limit). On track stays a label, or pale
   green when forced.
4. On Strong, Negative strong and Warning strong, use the Reversed=True variant of every atom (white content). Warning
   follows the Badge: orange 400 label and icon on pale orange (subtle), white on orange 400 (strong). Measured 2.48 and
   2.63 to 1: a contrast exception owned by the DS, the status is never the colour alone (icon + label).
5. Never Text/Main/Tertiary on a tint (3.7 to 4.3 to 1): the atoms use Text/Main/Secondary for context.

### 05 Content atoms

Intro : The pieces that go in the Content slot: the library atoms of [Components] Data Display (Key Figure, Sparkline,
Bullet Graph, Stacked Bar, Group Heading) and the local components of this file (Local - ...), built on library
instances where they exist (List Item, Progress Bar, Grade, Link, Badge, Divider, Icon). Each one is shown normal
(Emphasis None) and Reversed (Emphasis Strong). Edit the texts in the instance; nothing is detached.

Ligne : Since 24 Nov 2026 Key Figure, Sparkline, Bullet Graph, Stacked Bar and Group Heading are instances of the
published library [Components] Data Display. The other atoms stay local to this file.

Notes :

1. The library atoms (Key Figure, Sparkline, Bullet Graph, Stacked Bar, Group Heading) and the local components
   (description Local - ...) have a Reversed variant for navy and red backgrounds, except Task item and News item: they
   wrap the library List Item, which has no reversed look, and lists never sit on a full background.
2. Atoms stack in the Content slot with gap S. Put a card width on them with Fill; never resize a layer inside an atom.
3. Library first: List Item (tasks, news), Progress Bar (bands), Grade, Badge, Link, Divider and Icon Functional are
   library instances inside the atoms, never redrawn.
4. .Delta: Key Figure carries the library one; the local .Delta is shared by Timeline item, Mini table row and Grade
   chip. One place for the arrow, the tone and the reversed colours.
5. Charts with axes stay the library Chart (slots Series, X labels, Y labels). Sparkline and Bullet graph have a Plot
   slot, pre-filled: redraw the line or move the marker and resize the fill inside the slot of each instance; frame,
   legend and tokens stay in the atom. Code: ds-sparkline and ds-bullet-graph, driven by data.
6. Proposition: mini table columns are 64 px and the Change column 56 px (layout values without token).

### 06 Today

Intro : The 18 cards of the Common template (buyer-summary-v2.boards.ts) at 1280, placed as packCards does, rebuilt
only with Widget Card (library), the library atoms and the local atoms. Data of buyer-summary-v2.data.ts and facts.ts
for Immobilière du Marais (137381425, grade A3), board date 20 Nov 2024.

Annotation du board : « 1 to 5 - Common board rebuilt with the kit, see Notes ».

Notes :

1. Same 18 cards, formats and order as the Common template; 60 cells of 60, the board ends on a clean bottom edge
   (6 x 10 grid of 180, gutter Spacing/M).
2. Emphasis as in the code (Auto): Grade Strong and Exposure Subtle are manual, Limit left Subtle; the two automatic
   backgrounds are pale, Sanctions (Problem, Negative subtle) and Limit review (Warning, Warning subtle), each with its
   visible reason. Jobs to do shows its computed Warning and reason without background (cap of 2). Overdues keeps On
   track as a label, without background or reason.
3. Only Widget Card (library), the library atoms and the local atoms are used: no custom frame inside a card except
   Columns (two or more stacks of atoms side by side).
4. Gaps with the code: the charts with axes of Grade, Exposure and Financials are left out (library Chart with local
   Series, not rebuilt here); Jobs shows 6 of 8 tasks, the code fits as many as the height allows. Density: 15 % of
   empty space per card is a Qirin rule (blocking), 25 % per column is a balance check (not blocking), fixed by moving
   or resizing, never by adding data. Exposure: the sparkline fills its column, the bound legend is off (the limit is
   in column 2).
5. Card dates show only when they differ from the board date (20 Nov 2024): Grade 12 Jul 2024, Financials 30 Jun 2024,
   Coverage 11 Nov 2024.

### 07 Future

Intro : Ideas of future contents, each titled by the business question it answers and composed only with Widget Card
(library), the library atoms and the local atoms: if an idea needs a new atom, the kit is not complete yet. Data are
plausible and consistent with Immobilière du Marais (137381425, A3); values that do not exist in the mocks carry a
Sample data annotation and are listed in the Notes. People and third-party companies have generic names.

Annotation du board : « 1 to 5 - Eleven future cards, kit only, see Notes ».

Annotations « Sample data » d'origine (raccourcies dans le fichier) :

- Payment history : DSO trend (-4 days), invoice count
- Sector comparison : sector rank, peers, sector medians, outlook
- Group and owners : shareholders, beneficial owner, group grade, group limit
- Contacts : contact names (generic), broker, last exchange
- Documents : document list, KYC renewal date
- Debt maturity : maturities by year, average rate, covenant
- Tenants : occupancy, tenants, leases, vacancy, buildings

Notes :

1. Eleven ideas on a 6 x 6 board, clean bottom edge: payment history, external ratings, claims (Empty state), sector
   comparison, alerts, group and owners, contacts, documents, debt maturity, tenants, renewals.
2. Every card uses only Widget Card (library), the library atoms and the local atoms. Sparkline and Bullet Graph carry
   a Plot slot: the line is redrawn and the marker moved in the slot of each instance. Group Heading is available for
   cards with 2 groups or more.
3. From the mocks: ratings (EXTERNAL_RATINGS), claims (none), news, decisions, policies, jobs, notes, payment months,
   financials, CFO appointment (30 Sep 2024), refinancing of 40 M, green loan of 15 M, Lyon joint venture.
4. Invented for the exploration, to validate before any use (one Sample data annotation per card, filterable in Dev
   Mode): Payment history (DSO trend, invoices), Sector comparison (rank, peers, medians, outlook), Group and owners
   (shareholders, beneficial owner, group grade and limit), Contacts (names, broker), Documents (list, KYC date), Debt
   maturity (maturities, rate, covenant), Tenants (occupancy, tenants, leases, vacancy, buildings). Status: to confirm
   in the Qirin sources, none exists today. People and third parties are generic (Person A, Tenant 1, Broker A).
5. Status backgrounds are not used here on purpose: none of these facts meets a threshold of
   buyer-summary-v2.status.ts. Sector comparison is a manual Subtle highlight.

### 08 Gallery vignettes

Sous-titre : Local components, feedback of 25 Nov 2026.

Intro : Seven schematic thumbnails (figure, curve, bars, list, table, gauge, key figures) and the tile that shows them
in the gallery: thumbnail, short name, blue check in a circle at the top right when the card is already on the board
(as in the code, commit 80b0b891). No value, no description, no format and no emphasis choice: a click puts the card on
the board in its default format, the card toolbar changes it afterwards.

## Read me

### Cover

Sous-titre : One dense Bento board that answers the analyst’s questions about a buyer, with 14 card formats, emphasis
levels and a grid that refolds from 1920 to 1024 px.

### What is in this file

- Board - 1024 fold : The board refolded on 4 columns at 1024 px, with its notes. Cards are exploration frames.
- Card kit : Widget Card from the library [Components] Data Display: master, sizes, states, emphasis, content atoms,
  the Common board and future ideas.
- Mockups : 13 clean screens of the board: templates in read with Duplicate to edit, selector, Boards drawer, your own
  board in edit, resize, gallery, loading, error, 1920, New board from a template or a board. Library instances only.
- Archive - Edit flow (outdated) : Archived on 25 Nov 2026: this step by step flow no longer reflects the product (card
  details, Highlighted, Reset, editable templates were removed). See Mockups.

### Emphasis levels

- None : Default for every card.
- Subtle : Pale blue and a neutral edge: a card to look at first. No star, the star means favourite.
- Strong : Navy, one card per board: the key question.
- On track : Label and check icon; pale green only when forced.
- Warning : Pale orange, 1 px orange edge and a triangle icon.
- Problem : Pale red, 1 px red edge and an error icon.
- Problem, strong : Full red: a blocking item to clear.
- Règle : Never the colour alone: every status shows an icon and a label.

### Credits and sources

- Prototype : Angular route #/buyer-summary-v2, branch main, commit 78c78543.
- Data : buyer-summary-v2.data.ts: Immobilière du Marais, 137381425, grade A3, amounts in USD.
- Benchmark : docs/benchmark-2026-11-20-bento: direction A, ordered mosaic.
- Libraries : Qirin Tokens, Action, Data Entry, Data Display, Feedback and Layout. Cards: Widget Card, Key Figure,
  Sparkline, Bullet Graph, Stacked Bar and Group Heading from [Components] Data Display. Nothing detached.
- Team : Qirin design system team, credit underwriting.
- Status : Exploration. Card kit and Mockups use the library Widget Card only; Board - 1024 fold and the archived Edit
  flow keep their exploration frames.
