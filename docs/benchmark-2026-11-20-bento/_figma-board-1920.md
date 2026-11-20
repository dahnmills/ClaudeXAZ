# Figma, page « Board · 1920 » (1:5) : rapport

Fichier `XW7jVtIa6UWRTqKMDqOF5D`, page `1:5` uniquement. Rien publié, aucune librairie modifiée.

## Contenu de la page

| Nœud | Id | Position |
|---|---|---|
| Écran `Buyer Summary V2 · 1920 · 8 columns` | `8:9907` | x 0, 1920 x 2072 |
| Grille `Board grid · 8 columns` (GRID, 8 x 8) | `8:10250` | 1800 x 1800 |
| Écran `Buyer Summary V2 · 1024 · 4 columns` | `26:917` | x 2480 (560 px d'écart), 1024 x 3706 |
| Grille `Board grid · 4 columns` (GRID, 4 x 15) | `26:927` | 904 x 3434 |
| Cadre `Notes · grid and fold` | `27:2802` | x 4064, 480 px de large |

Shell (instances Layout et Action) : Header `Menu Open=False` (`8:9908`, Content passé en FILL pour couvrir 1920 et 1024),
Side Navigation `Open=False` (`8:10000`, « Right border » masqué, trait droit Border/Subtle/Tertiary sur l'instance),
Page Header (`8:10092` : Topbox Buyer « Immobilière du Marais », grade A3 automatique, 137381425, High risk / SRU / Sanction,
« View full properties » ; fil Home > Buyers > Immobilière du Marais > Buyer Summary ; titre « Buyer Summary » ; Tabs et actions
masqués), rangée `Board actions` : Button secondary « Edit board » (`8:10202`) + Dropdown « Credit Underwriting » (`8:10220`).

## Board 1920 (direction A, 16 cards, 0 cellule libre, bord bas plat)

Ordre de la liste (premier emplacement libre) : Grade, Limit, Exposure, Jobs, Decisions, Financials, Policies, Notepad,
Newsfeed, Risk figures, Coverage, Overdues, Payment, Score, Identity, At a glance. Titres et données repris de
`buyer-summary-v2.data.ts` (KINDS, GRADE_CHANGES, FINANCIALS, JOBS, NEWS, NOTES, DECISIONS, POLICIES, COVER_HISTORY...).

| Card | Format | Id 1920 | Id 1024 | Contenu |
|---|---|---|---|---|
| How risky is this buyer? (highlight) | 3x2 | `21:2948` | `26:2962` | Grade A3, delta « Upgraded from A4 », score 82 / 100, graphe 8 mois Y inversé, 4 derniers changements |
| How much limit is left? | 4x1 | `21:3059` | `26:3081` | Available 3 452 000, bullet utilisé / accordé, détail 4 lignes, sparkline 8 mois |
| How much are we exposed? | 3x1 | `21:3108` | `26:3124` | 1 548 000, +17.6 % vs May 24, courbe 8 points |
| Risk figures | 1x1 | `21:3156` | `26:3221` | 72 limites, highest limit, notre exposition |
| What is said about the company? | 2x2 | `21:3177` | `26:3185` | 5 actualités avec badge de tonalité, source, date |
| Overdues | 1x2 | `21:3310` | `26:3038` | 0, état « No overdue », 4 lignes, série mensuelle à zéro |
| Notes | 1x2 | `23:1959` | `26:3161` | 3 notes, date et auteur |
| Is the latest request covered? | 2x2 | `23:2008` | `26:3237` | Approved, demandé / accordé, bullet, historique 4 demandes |
| Does the buyer pay on time? | 2x1 | `23:2158` | `26:3293` | 94 %, barre empilée 3 tranches, légende, faits |
| Who is this company? | 3x1 | `23:2198` | `26:3328` | 8 faits sur 2 rangées de 4 |
| Decisions | 1x3 | `23:2234` | `26:3359` | 8 décisions, badge, montant, date |
| Jobs to do | 1x3 | `23:2413` | `26:3520` | 6 tâches, répartition des priorités, échéances |
| Score | 1x1 | `23:2548` | `26:3581` | 82 / 100, Stable, barre, sparkline |
| Is the company financially sound? | 2x3 | `25:850` | `26:3423` | Turnover + gearing, courbe 5 ans, tableau 7 lignes x 3 exercices |
| Which policies carry the exposure? (grand bloc) | 4x3 | `25:969` | `26:3601` | 4 chiffres clés, barre empilée 5 segments, tableau 6 polices + total, courbe 8 mois |
| Where does the buyer stand? | 8x1 | `25:1247` | `26:5027` (4x1) | 7 indicateurs avec micro-viz ; 4 sur 7 à 1024 |

## Repli à 1024 (4 colonnes)

Même liste repackée : 15 rangées, 0 cellule libre, bord bas plat. Tous les formats restent identiques (3x et 4x tiennent
dans 4 colonnes, 4x1 et 4x3 prennent toute la largeur), seule la pleine largeur devient 4x1 et masque 3 indicateurs. Le
repli à 2 et 1 colonne (benchmark section 4) est écrit dans le cadre Notes, pas dessiné.

## Contrôles

- Script d'audit sur les 32 cards : aucun descendant hors de la zone de padding (rien de coupé, pas de défilement interne).
- Captures relues : pas de libellé coupé ni sur deux lignes dans les titres, highlight en blanc sur marine (11,27:1).
- Couleurs, espacements, rayons, épaisseurs liés aux variables Semantic ; textes en styles Tokens (Title/H2, H3, H4,
  Body M/S). Instances : Header, Side Navigation, Page Header, Crumb, Button, Dropdown, Button Icon, Icon Functional
  (glyphes NDBX), Badge, Grade, Link.

## Modernisation et propositions (valeurs à valider)

- Rayon des cards : Border/Radius/M (8 px), validé par l'utilisateur à 11 h 18.
- Padding : Spacing/M (16) en 1 colonne, Spacing/L (24) à partir de 2 colonnes (règle du benchmark 3.4).
- Valeurs géométriques sans token, propositions : hauteur des sparklines (20 à 112 px), hauteur du graphe de grade
  (262 px), largeur des colonnes de tableaux (48 à 150 px), largeur fixe des colonnes internes (190 à 300 px), bullet
  graph de 16 px (piste) / 8 px (mesure) / 2 px (repère), pastille de légende 8 px, point de fin de courbe 8 px.
- Chiffres tabulaires (`tnum`) : non activables par l'API, à régler dans Figma ou en code.
- Palette de la barre par police : Icon/Brand, Interactive/Background/Strong, Background/Main/Alt/Tertiary et Secondary,
  Border/Main/Tertiary. À confirmer comme rampe catégorielle.

## Doutes

- **Unité de colonne** : le brief fixe 172 px, mais la page doit montrer la grille responsive. J'ai suivi le benchmark
  (section 4) : 211 px à 1920 (board 1800 px) et 214 px à 1024 (board 904 px). Avec 172 px, le board 1920 ne ferait que
  1488 px, avec 312 px vides à droite. Si l'unité fixe de 172 px est voulue, il faut redimensionner la grille et les cards.
- 16 cards au lieu d'environ 18 : le catalogue de `data.ts` compte 16 sujets, et une card = une question. J'ai évité les
  doublons.
- Les icônes « Upgraded / Downgrade » suivent le sens du grade (une flèche vers le haut veut dire amélioration), sans couleur.
- La Dropdown n'a pas d'état « rempli » : le texte du placeholder est passé en Text/Main/Primary sur l'instance.
- Les graphiques sont dessinés à la main (vecteurs liés aux variables), pas en instances `Chart` de la librairie,
  conformément à l'assouplissement de 10 h 48.
