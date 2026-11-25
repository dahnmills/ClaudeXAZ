# Figma, page « Mockups » : rapport (2026-11-23)

Fichier `XW7jVtIa6UWRTqKMDqOF5D`, nouvelle page `Mockups` (`118:3983`). Maquettes propres, sans annotation, Notes, flèche ni
légende (contrôle : 0 annotation sur la page). Les pages Board, Edit flow et Card kit ont servi de source par clonage,
aucun original n'a été modifié en dehors de la passe 5 du Card kit. Rien publié, rien commité.

## Écrans

Grille : colonnes de 1480 px (1280 + 200), rangées séparées de 200 px sous l'écran le plus haut. Aucun chevauchement entre
écrans, aucun enfant hors de son écran (contrôle par script).

| # | Écran | nodeId | Position | Taille |
|---|---|---|---|---|
| 1 | 01 · Common · Read | `118:3984` | 0, 0 | 1280 x 2216 |
| 2 | 02 · Credit Assessment · Read | `120:2022` | 1480, 0 | 1280 x 1628 |
| 3 | 03 · Credit Underwriting · Read | `120:5517` | 2960, 0 | 1280 x 1432 |
| 4 | 04 · Board selector open | `121:4027` | 0, 2416 | 1280 x 2216 |
| 5 | 05 · Manage boards | `121:7240` | 1480, 2416 | 1280 x 800 |
| 6 | 06 · Edit mode | `121:12141` | 2960, 2416 | 1280 x 2224 |
| 7 | 07 · Resize by the corner | `121:14819` | 4440, 2416 | 1280 x 2224 |
| 8 | 08 · Add a card, gallery open | `123:11428` | 0, 4840 | 1280 x 800 |
| 9 | 09 · Card detail | `123:14475` | 1480, 4840 | 1280 x 800 |
| 10 | 10 · Board loading | `125:13563` | 2960, 4840 | 1280 x 2216 |
| 11 | 11 · Card in error and empty card | `125:18053` | 4440, 4840 | 1280 x 1628 |
| 12 | 12 · Common · Read · 1920 | `125:20848` | 0, 7256 | 1920 x 1845 (passe 2) |

## Construction

- **Shell** : clone de `Board · 1280 · Read` (`8:8034`) et de `Board · 1920 · 8 columns` (`8:9907`) : Header, Side
  Navigation, Page Header (topbox Immobilière du Marais, A3, fil d'Ariane, titre) en instances de librairie. Libellé de la
  topbox aligné sur le code : « View full properties ».
- **Barre du board (lecture)** : « Data as of 20 Nov 2024, 09:42 », Edit board, Manage boards (Button Secondary, glyphe
  Setting Filled), sélecteur Dropdown au nom du board.
- **Cards** : uniquement des instances du maître `Bento Card` (`91:577`) et des atomes locaux du Card kit. Board 1 = clone
  de la grille Today (`97:2340`) ; boards 2 et 3 recomposés avec les positions de `packCards` (calculées en exécutant
  `bento-layout.ts` sur `TEMPLATES`), 42 et 36 cellules pleines, aucun trou.
- **Emphases du code** (`lookOf`, `autoBackgrounds`) : Common = Grade Strong, Exposure et Limit left Subtle, fonds auto
  Sanctions (Problem pâle) et Limit review (Warning pâle), Jobs Warning sans fond, Overdues On track en libellé. Credit
  Assessment = Grade Strong, fonds auto Sanctions (Problem) et Overdues (On track pâle). Credit Underwriting = Exposure
  Strong, fonds auto Limit review et Jobs to do (Warning), Overdues On track en libellé, Limit left sans emphase.
- **Cards construites** (données de `buyer-summary-v2.data.ts`) : Ext. rating 1x1 (EXTERNAL_RATINGS), Payments 3x2 (bandes,
  DSO, meilleur mois, tracé mensuel PAYMENT_MONTHS redessiné dans le slot Plot), Claims 1x1 (état Empty, message du code),
  Decisions 3x2 (12 décisions) et 3x1 (8 décisions), Exposure 3x2 Strong (part de chaque police, POLICIES), Grade 2x2,
  By policy 4x2, Jobs 1x3, Financials 3x3, Company 3x1.
- **4** : menu du sélecteur (Dropdown Flyout Menu, templates puis My boards), sélecteur en état Active.
- **5** : drawer Manage boards (clone Edit flow 1.3), nombres de cards du code (18 / 12 / 12), ligne de renommage
  remplacée par une ligne normale « Q4 renewal review ». Viewport 1280 x 800.
- **6** : barre d'édition reconstruite comme le code : indice, Add card (Secondary, Plus), Undo (Button Icon Secondary),
  Redo (désactivé), Reset layout (Tertiary), « 1 change », Cancel (Secondary), Done (Primary). Payments en `State=Edit`
  (barre d'outils V1) avec la poignée de coin au survol.
- **7** : comportement du code (`resizeMove`) : la card prend le format en direct et le board se replace sans combler
  (`packCards(..., settle=false, fill=false)`). Payments passe en 2x2, les voisines se décalent, poignée et étiquette
  « 2 × 2 » au coin. Les deux cellules vides sont celles du code pendant le geste (pas de place « Add a card here » tant que
  le redimensionnement dure).
- **8** : galerie (clone Edit flow 3.1) ouverte depuis Add card : filtre « Fits 1 × 1 » retiré, liste du catalogue
  (`CATALOG`) par question métier, vignette au format recommandé, badge On board pour les cards du board. Viewport 800.
- **9** : drawer de détail Exposure (clone Edit flow 5.2) aligné sur le code : périodes MONTHS (May 23 à Jul 24),
  « Exposure, USD », source « Policy administration, data of 20 Nov 2024, in USD. », lien « Open the exposure details »,
  bouton CSV masqué (absent du code). Viewport 800.
- **10** : chargement progressif dans l'ordre de lecture : Grade et Exposure chargées, les 16 autres en `State=Loading`
  (titre gardé, squelettes à la taille finale, sans statut ni pied).
- **11** : Credit Assessment, Ext. rating en `State=Error` (« No answer from the rating provider. » + Retry, le seul cas
  d'erreur du code) et Claims en état vide.
- **12** : Common sur 8 colonnes de 211 px, positions de `packCards` à 8 colonnes (Jobs 1x5, Notes 1x5, Coverage 2x3,
  By policy 4x2) ; les cards hautes reçoivent les éléments suivants des mocks (8 tâches, 14 notes, 5 actualités, 3 décisions,
  7 changements de grade).

## Vérifications

Captures de chaque écran relues : aucun texte coupé, aucun débordement de slot (contrôle par script sur toutes les cards),
0 peinture non reliée hors instances de librairie, 0 texte sans style, 0 tiret cadratin, aucune date 2026 restante.

## Écarts

1. Écrans 5, 8 et 9 en 1280 x 800 (viewport, drawer de 800 de la librairie) : le bas du board est coupé par le bord de
   l'écran, comme dans l'app. Les autres écrans montrent le board entier.
2. Card kit 06 met Sanctions en Negative strong ; le code calcule un fond pâle : les maquettes suivent le code.
3. Ext. rating en erreur à 1x1 : la notice du code ne tenait pas (Retry coupé). Padding de la Functional Notice ramené à
   Spacing/S sur cette instance. À reporter dans le code : erreur trop haute pour une card 1x1.
4. Vide restant à 1920 : Coverage 2x3 (environ 35 %, COVER_HISTORY n'a que 6 lignes) et Jobs 1x5 (8 tâches sur 8) ; le
   code a la même limite de données. Rien n'a été inventé pour remplir.
5. Payments 2x2 (écran 7) et 3x2 (écrans 2 et 11) : le tracé mensuel est dessiné à la main dans le slot Plot (12 valeurs
   de PAYMENT_MONTHS).
6. Decisions en Timeline item (2x1, 3x2) ou List row (3x1) : le code affiche aussi le montant et un badge par décision.
7. Le drawer Manage boards garde la présentation de l'Edit flow (actions en icônes, badge Current) plutôt que les boutons
   Open / Duplicate du code.
8. L'étiquette de format et la barre d'outils de card débordent légèrement hors de leur card (au-dessus du bord haut,
   sous le coin), comme dans le code.

## Passe 2 (2026-11-24) : report du commit 8a0938e8

Dispositions recalculées en exécutant `packCards` (`bento-layout.ts`) sur les `TEMPLATES` du commit (6 colonnes à 1280,
8 à 1920). Credit Assessment et Credit Underwriting à 1280 : aucune position ne change. Rien publié, rien commité.

### Disposition

- **Common 1280** (écrans 01, 04, 05, 06, 08, 09, 10) : Notes 1x2 -> 1x5 (col 6, rangées 5 à 9, 12 notes sur 14),
  By policy 4x3 -> 3x3 (col 3 à 5, rangées 7 à 9). Les autres cards gardent leur place. Sur 01, 04, 05, 06, 08 et 09 les
  trois cards modifiées (Notes, By policy, Decisions) sont des clones de celles de 01 ; sur 10 les squelettes suivent le
  nouveau format.
- **By policy 3x3** : une seule colonne comme le code : chiffre clé, rangée de 3 faits (Granted limits, Used, Largest
  share), tableau des 6 polices et total, « Limit movements » (2 derniers mouvements).
- **07 Resize** (`packCards(..., settle=false, fill=false)`, Payments 2x2) : Company (2,6), Notes 1x1 (5,6),
  Sanctions (6,6), Limit review (1,7), Decisions (2,7), By policy 3x2 (4,7), Coverage (1,8). Le code laisse 5 cellules
  vides pendant le geste (rangée 8 col 3, rangée 9 col 3 à 6) : la maquette les montre, le board se referme au lâcher.
  By policy 3x2 = chiffre clé + tableau.
- **12 Common 1920** : 7 rangées au lieu de 8, écran ramené à 1920 x 1845. Jobs 1x4 (8 tâches, toutes visibles),
  Notes 1x2 (8,3) avec 5 notes, Decisions (2,5), By policy 3x2 (4,5) (chiffre clé, 3 faits, tableau), Coverage 2x2 (7,5)
  enrichie des faits du code (Requested, Decided, By) et de l'en-tête « Request history », Company (2,6), At a glance
  rangée 7.

### Contenu

- **Decisions 2x1** (Common, écrans 01, 04 à 09 et Card kit 06 Today) : les 2 décisions puis « 13 older decisions »
  (style Body S, couleur de contexte), comme le code. Le tiers vide a disparu.
- **Decisions en 3 colonnes** (02 et 11 en 3x2, 03 en 3x1) : chaque décision sur 2 lignes, date + Badge d'issue (S,
  Light, sans icône) puis libellé + montant à droite ; remplissage par rangée comme le code ; 12 décisions et
  « 3 older decisions » en 3x2, 4 décisions et « 11 older decisions » en 3x1.
- **Claims 1x1** (02, 03, 11) : `State=Default`, unité USD, Empty hint « No claim filed » (glyphe Check Circle Outline,
  sans lien), puis Open 0, Claims, 24 m 0, Checked 20 Nov 2024 calés en bas (cadre `Counts`, gap Spacing/None, aligné en
  bas).
- **Erreur 1x1** (11, Ext. rating) : Functional Notice sans padding (Spacing/None), message en Body/S/Regular, fond de la
  notice retiré (le code n'en montre pas à cette taille) ; message sur 2 lignes et Retry visibles.

### Vérifications

Contrôle par script sur les 12 écrans : aucune cellule vide hors écran 07 (5 cellules voulues, voir plus haut), aucun
chevauchement de cards ni d'écrans, aucun slot qui déborde, 0 texte sans style, 0 tiret cadratin. Captures relues
(01, 02, 03, 07, 10, 11, 12) et comparées à `captures/fix-after-*.png`. Vide par card ≤ 15 % sur les cards modifiées
(Notes 1x5 4 %, By policy 3x3 4 %, Decisions 2x1 2 %, Decisions 3x2 7 %, 3x1 8 %, Claims 2 %, Coverage 1920 8 %,
By policy 1920 5 %).

### Fermeture des écarts (même passe)

- **At a glance** (01, 04 à 09 en 1280, 12 en 1920) : une instance de l'atome local Sparkline sous Grade, Exposure et
  Score, les trois colonnes qui ont une courbe dans le code (GRADE_HISTORY sur 1 à 10 inversé, EXPOSURE_TREND,
  SCORE_TREND sur 70 à 90). Tracé redessiné dans le slot Plot, point final 8 x 8. Grade en
  Color/Static/Icon/Main/Functional/Positive, les deux autres en Icon/Brand. Hauteur 20 en 1280 (la plus haute
  colonne remplit le slot, 1 % de vide), 40 en 1920 (13 %). Les cards de 04 à 09 sont des clones de celle de 01.
- **Notes 1x5** (01, 04, 05, 06, 08, 09) : 12 notes puis « 2 more notes », la ligne tient (894 / 902). Notes 1x2 de
  Credit Assessment (02, 11) : « 11 more notes » ajoutée (9 % de vide, avant 16 %).
- **Decisions 2x1 à 1920** : 2 décisions et « 13 older decisions » calée en bas (cadre `More row`, aligné en bas), les
  trois décisions ne laissaient pas la place à la ligne.
- **Pastilles Grip** (06, 07) : blanc relié à Color/Static/Background/Main/Primary.
- **Cards clairsemées à 1920** (déjà en passe 1, 17 à 28 % de vide) : une ligne des faits du code ajoutée en fin de
  liste (facts.ts : Highest limit sur Exposure, Granted sur Limit left, Invoices sur Payments, Updated sur Score,
  Policies sur Risk figures et Limit review, Status sur Sanctions, Company ID en tête de Company, Claims, 24 m et
  l'événement du 09 Sep 2022 sur Overdues). Toutes à 15 % ou moins.

Contrôle final par script sur toute la page : 0 peinture SOLID non reliée (instances comprises), 0 texte sans style,
0 tiret cadratin, aucun chevauchement d'écrans, aucun slot qui déborde, aucune card hors chargement et erreur au-delà
de 15 % de vide (les cards à pied « Data of » ont leur pied calé en bas). Seul board à trous : 07, les 5 cellules du
geste en cours. Captures relues : 01, 02, 03, 06, 07, 10, 11, 12.

### Écarts restants

1. Decisions 2x1 reste en Timeline item (date, puis libellé et issue) ; le code met date, libellé et Badge sur une ligne.
