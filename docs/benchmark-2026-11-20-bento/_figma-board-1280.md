# Figma, page « Board · 1280 » (1:4) : rapport

Fichier `XW7jVtIa6UWRTqKMDqOF5D`, page `1:4` uniquement. Rien de publié, aucune librairie modifiée, rien de commité.

## Écrans

| Écran | nodeId | Position | Taille |
|---|---|---|---|
| Board · 1280 · Read | `8:8034` | x 0, y 0 | 1280 x 2020 |
| Board · 1280 · Edit | `20:1521` | x 1840 (560 px d'écart), y 0 | 1280 x 2020 |

Structure (les deux écrans) : `Header` (instance Layout, Menu Open=False) > `Body` > `Side Navigation` (Open=False,
`Right border` masqué, trait droit relié à Background/Main/Tertiary) + `Main` > `Page Header` (Topbox + Breadcrumb,
Tabs off ; Immobilière du Marais, 137381425, grade A3 automatique ; fil Home > Buyers > Immobilière du Marais >
Buyer Summary ; titre Buyer Summary) > `Content` (padding M / XL / XL / XL, gap M) > `Board toolbar` + `Board`.

- Lecture, toolbar : `Edit board` (Button Secondary, icône Filter à la place de sliders) puis le sélecteur de board
  `Common` (Dropdown) le plus à droite.
- Édition, toolbar : astuce (icône Move + « Drag a card to move it. Use its menu to change its format or highlight
  it. ») à gauche, `Reset layout` (Tertiary) et `Done` (Primary) à droite, comme dans le code.

## Grille

- Board de lecture `8:9104`, board d'édition `20:1531` : frames auto-layout GRID, 6 colonnes x 9 lignes, pistes fixes.
- **Unité recalculée : 180 px** (et pas 172) pour remplir exactement l'espace utile : 1280 - 56 (rail) - 2 x 32 (XL)
  = 1160 = 6 x 180 + 5 x 16. Lignes carrées de 180, gouttières liées à Spacing/M. Une card NxM = N x 180 + (N - 1) x 16.
- Bord bas propre : 16 cards, 54 cellules sur 54, aucun trou, la dernière rangée est la card pleine largeur. Board
  1160 x 1748, rectangle net dans les deux écrans (vérifié par script).
- Ordre et formats repris de `DEFAULT_CARDS` (`buyer-summary-v2.data.ts`), direction A, premier emplacement libre :

| # | Card (titre) | Format | Ligne, colonne | nodeId lecture |
|---|---|---|---|---|
| 1 | How risky is this buyer? (**highlight**, marine) | 3x2 | 1, 1 | `12:2638` |
| 2 | How much are we exposed? | 3x1 | 1, 4 | `12:2731` |
| 3 | Limit left | 1x1 | 2, 4 | `12:2767` |
| 4 | Does the buyer pay on time? | 2x1 | 2, 5 | `12:2780` |
| 5 | Overdues | 1x2 | 3, 1 | `14:794` |
| 6 | Is the company financially sound? | 2x3 | 3, 2 | `14:855` |
| 7 | Jobs to do | 1x4 | 3, 4 | `14:997` |
| 8 | What is said about the company? | 2x2 | 3, 5 | `14:1106` |
| 9 | Score | 1x1 | 5, 1 | `16:2181` |
| 10 | Risk figures | 1x1 | 5, 5 | `16:2202` |
| 11 | Notes | 1x1 | 5, 6 | `16:2218` |
| 12 | Who is this company? | 3x1 | 6, 1 | `16:2229` |
| 13 | What did we decide lately? | 2x1 | 6, 5 | `16:2257` |
| 14 | Which policies carry the exposure? | 4x2 | 7, 1 | `16:2350` |
| 15 | Is the latest request covered? | 2x2 | 7, 5 | `16:2539` |
| 16 | Where does the buyer stand? | 6x1 (pleine largeur) | 9, 1 | `16:2663` |

Formats présents : carrés 1x1 et 2x2 ; horizontaux 2x1, 3x1, pleine largeur ; verticaux 1x2, 1x4 ; blocs 3x2, 2x3, 4x2.

## Contenu des cards

Données de `buyer-summary-v2.data.ts` et des `*Facts` du composant : grade A3 (historique 4,4,5,4,4,4,4,3, changements
Jul 24 / Nov 23 / Sep 23), exposition 1 548 000 (31 % des 5 000 000 accordés, tendance 8 périodes), 3.45 M disponibles,
94 % à l'heure avec bandes 94 / 6 / 0, overdues 0 et dernier retard Sep 23, financials 7 lignes x 3 exercices +
variation + courbe du CA sur 5 ans, 6 jobs par échéance, 5 actualités, score 82 / 100 stable, 72 limites, 3 notes,
fiche société, 4 décisions, 6 polices (total 1 548 000 / 5 000 000), couverture 2 000 000 approuvée + historique, et
6 tuiles de synthèse. Titre = question métier à partir de 2 colonnes, titre court en 1 colonne, unité à droite.
Chaque chiffre clé porte un contexte ou un delta (flèche + texte, vert seulement si le sens est bon).

Instances de librairie dans les cards : Grade, Badge (icône masquée), Progress Bar, Divider, Link (Open all jobs),
Icon Functional (glyphes NDBX). Custom (autorisé par l'assouplissement de 10 h 48) : sparklines, courbes avec axes,
barres d'overdue, barre de répartition des priorités, tableaux, toutes reliées aux variables Semantic et aux styles
de texte Tokens (Title/H2 pour les valeurs, Body M/S Regular et Semi Bold ailleurs). Audit : 0 remplissage non lié.

## Mode édition (`20:1521`)

- Chaque card porte `Card tools` en haut à droite : poignée (icône Move) + Button Icon Secondary S (Ellipsis
  Vertical). L'en-tête réserve 64 px (Spacing/3XL) ; en 1 colonne, l'unité est masquée pour garder le titre entier.
- **Glisser** : « Does the buyer pay on time? » (`23:1407`) est soulevée au-dessus de la grille, ombre
  `Shadows/Bottom/400` (celle des composants Layout), bord Interactive/Border/Strong, décalée comme si elle suivait le
  pointeur. Place de dépôt `23:1437` en 2x1 (ligne 2, colonnes 4 et 5) : bord pointillé Static/Border/Main/Tertiary,
  fond Background/Main/Alt/Primary, « Drop here, Position 3 of 16 ». La voisine « Limit left » est décalée en colonne 6.
- **Menu ouvert** sur la card Grade (`23:1479`, Flyout Menu v3 + Flyout Menu Item) : bouton en état Pressed ; groupe
  Move (Move before et Move to start désactivés car c'est la première card, Move after en survol, Move to end),
  séparateur, groupe Card (Format: 3 × 2, Remove highlight).

## Propositions (valeurs sans token ou décisions à valider)

1. Rayon des cards : Border/Radius/M (8 px), validé par l'utilisateur à 11 h 18, appliqué partout (place de dépôt comprise).
2. Unité de grille 180 px et largeur de colonne, tailles des cards : dimensions de layout sans token (question 2 du benchmark).
3. Hauteurs de graphiques (200, 150, 72 px...), largeurs de colonnes de tableau (56, 64, 96, 150 px...), largeur du menu 240 px : valeurs de mise en page.
4. Tiret pointillé de la place de dépôt `dashPattern 4 / 4` : pas de token.
5. Décalage de la card portée (+96, +56 px) : illustration du geste, pas une valeur de code.
6. Valeur clé en Title/H2 (20 px semi-bold) : il n'existe pas de style 24 px semi-bold (Title/H1 est 24 px Regular).

## Doutes

- « Edit board » utilise l'icône Filter : pas de glyphe sliders dans NDBX Icons. Format utilise Add Table (pas de glyphe grid).
- Pas de « Flyout Menu Title » en librairie : titres de groupe Move / Card faits en texte Body S Semi Bold.
- Chiffres tabulaires non réglés (Allianz Neo `tnum` à confirmer, question 8).
- Le sélecteur de board n'est pas dans la toolbar du code actuel (seulement Edit board) : ajouté parce que demandé.
- Le champ ID de la topbox passe en JetBrains Mono (Menlo absent), comme dans les autres fichiers.
- Écart d'un pixel de rendu possible sur quelques barres et graphiques de largeur fixe (148, 344 px) : invisible, non coupé.
- Données « (?) » du benchmark reprises telles quelles du fichier de mocks (motifs de grade, polices, exercices).
