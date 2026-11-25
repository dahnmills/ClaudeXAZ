# Figma, re-pointage de Bento sur la librairie Data Display et ménage du fichier (2026-11-24)

Fichier Bento `XW7jVtIa6UWRTqKMDqOF5D`. Librairie `[Components] Data Display` (`VpConH5AUGyCqtp8PMqj1i`) publiée le
2026-11-24. Rien modifié dans la librairie, rien publié, rien commité. Captures dans `captures/repoint/`.

## 1. Méthode

Chaque card a été traitée une par une, section par section (Card kit) puis écran par écran (Mockups) :

1. Relevé par script de toute la card : pour chaque calque, chemin complet (noms normalisés, `Bento Card` = `Widget Card`,
   `Local · Key figure` = `Key Figure`, etc.), visibilité, taille, position, textes, style de texte (clé), remplissages et
   traits (clé de variable), variables liées, auto-layout, `layoutSizing`, `layoutGrow` / `layoutAlign`, `textAutoResize`,
   propriétés d'instance, contenu des slots `Content` et `Plot`. Export PNG de la card.
2. `swapComponent` de la card vers la variante de même nom de Widget Card, puis des atomes du slot (Key Figure, Sparkline,
   Bullet Graph, Stacked Bar, Group Heading), en relisant l'arbre après chaque swap.
3. Réapplication des surcharges perdues (propriétés, visibilités, textes, sizing, tailles, positions), nouveau relevé,
   diff, nouvel export PNG comparé octet par octet au premier.

Le contenu des slots survit au swap (noms de slot identiques). Booléens retirés en librairie (`Marker` du Bullet Graph,
`Last value` de la Sparkline) : la visibilité du calque dans le slot est reprise par la réapplication.

### Trois pièges trouvés en route

- **Écarts de construction de la librairie** (rien corrigé dans la librairie, compensé par surcharge sur chaque instance) :
  `.Card Header` > `Unit` en `textAutoResize = NONE` (la locale était en largeur auto : « EUR k » se coupait sur
  Financials) ; `.Card Footer` en `layoutAlign = INHERIT` au lieu de `STRETCH` (le pied ne suit plus la largeur de la
  card) ; slot `Content` en `layoutGrow = 0` sur Loading, Empty et Error (ne remplit plus la hauteur) ; Group Heading >
  `Meta` en `textAutoResize = NONE`. **À corriger dans Data Display** ; les surcharges pourront alors être réinitialisées.
- **Swap imbriqué** (mémoire figma-nested-swap-overrides) : un `.Status` ou un `.Card Footer` dont la variante avait été
  changée sur la card locale restait une instance du maître LOCAL dans la Widget Card (même nom, donc invisible au diff).
  Détecté par un contrôle « instance locale structurelle dans une instance de librairie » : 40 cas sur Mockups
  (`.Status` x 19, `.Card Footer` x 21) et 14 sur Card kit (dont 6 `.Delta` dans Key Figure), re-pointés avec la même
  méthode, diff vide, pixels identiques.
- Card kit 06, Sanctions 1x1 : la dernière ligne (« 28 Oct 2024 ») dépassait le slot de 2 px (défaut antérieur, présent
  avant le swap). Corrigé comme la règle du kit et la page Mockups : en 1x1 la raison remplace la ligne de contexte
  (`Context` du Key Figure éteint).

## 2. Résultat du re-pointage

| Page | Lot | Cards | Diff | Pixels |
|---|---|---|---|---|
| Card kit | 01 Master (anatomie) | 1 | vide | identiques |
| Card kit | 02 Sizes | 14 | vide | identiques |
| Card kit | 03 States | 15 | vide | 12 identiques, 3 Edit : écart d'anticrénelage de la barre d'outils (ombre et contenu identiques au relevé) |
| Card kit | 04 Emphasis | 16 | vide | identiques |
| Card kit | 05 Content atoms | 28 | vide | identiques |
| Card kit | 06 Today | 18 | vide après correction du sizing | 17 identiques, Limit review : anticrénelage |
| Card kit | 07 Future | 11 | vide | 10 identiques, Payment history : anticrénelage |
| Mockups | 01 à 12 | 198 | vide | 195 identiques, 3 à l'anticrénelage près |

Comparaison des captures de section avant/après (seuil 30 sur 765) : 0 pixel différent sur Card kit 02, 03, 04, 06, 07 et
Mockups 02, 04 à 09, 11 ; 1 à 2 pixels sur Mockups 01, 03, 10, 12 (point final d'une sparkline). Fichiers
`captures/repoint/kit-*-before|after.png`, `mock-*-before|after.png`.

Atomes swappés sur Mockups : 277 (Key Figure 167, Sparkline 37, Bullet Graph 28, Stacked Bar 9, Group Heading 13, plus
leurs doublons de chargement) en plus des 198 cards.

## 3. Card kit, sections 01 et 05

- **01 · Master** (`92:418`) : titre « Widget Card, the master (library) », description réécrite, ligne
  `Line · Library components` (`164:5392`). Le set local est remplacé par le cadre `Library · Widget Card (12 variants)`
  (12 instances, une par variante ; rangées espacées de Spacing/3XL pour que la barre d'outils Edit ne touche pas la
  rangée du dessus). `.Card Header`, `.Status` et `.Card Footer` montrés en instances des atomes privés de la librairie
  (`164:5260`, `164:5303`, `164:5355`). Anatomie renommée `Anatomy · Widget Card 2x2`. Note 3 réécrite. Texte isolé « a »
  (`87:22702`, sans rôle) supprimé.
- **05 · Content atoms** (`96:1417`) : titre « Content atoms, library and local », ligne `168:4786`. Colonne de droite en
  deux groupes : « Library atoms ([Components] Data Display), instances » (Key Figure `167:7823`, Sparkline `167:7846`,
  Bullet Graph `167:7855`, Stacked Bar `167:7870`, Group Heading `167:7907`, chacun normal et Reversed), puis « Local
  atoms of this file (masters) » (Key figure row, List row, Task item, News item, Timeline item, Mini table row, Progress,
  Grade chip, Empty hint, et `.Delta` déplacé depuis 01). Libellés de la vitrine « Key Figure (library) » etc. ; notes 1
  et 4 réécrites.
- Textes qui citaient Bento Card réécrits : 06 (`97:2338`, `100:3337`), 07 (`102:3327`, `104:3808`).
- **02 · Sizes** : note 6 « Fold » ajoutée (`167:7915`), reprise des règles de repli par format des pages Formats
  supprimées (seule information propre à ces pages).

## 4. Supprimé (l'historique de versions Figma permet de revenir)

| Élément | id | Raison |
|---|---|---|
| Maître `Bento Card` (12 variantes) | `91:577` | remplacé par Widget Card, 0 instance |
| `.Card Header`, `.Status`, `.Card Footer` locaux | `79:136`, `79:87`, `79:173` | utilisés seulement par Bento Card, 0 instance |
| `Local · Key figure`, `Local · Sparkline`, `Local · Bullet graph`, `Local · Stacked bar`, `Local · Group heading` | `84:176`, `84:262`, `84:218`, `84:255`, `115:4909` | remplacés par les atomes de la librairie, 0 instance |
| Page `Formats · squares and horizontals` (avec `99 · To review · duplicates` `50:3786`, anciens 3x2 et 4x2 A6) | `1:2` | exploration sur une grille de 172 px et deux niveaux (Normal / Highlight), remplacée par Card kit 02 et 04 ; 16 instances de Widget Card (deprecated), toutes sur cette page ; les règles de repli sont reprises en note 6 de Card kit 02 |
| Page `Formats · verticals and blocks` | `1:3` | idem (cadres custom, grille 172 px) |
| Page `Board · 1280` (avec `99 · To review · old edit screen` `55:6118`) | `1:4` | board en cadres custom remplacé par Mockups 01 et Card kit 06 (disposition à jour du commit 8a0938e8) ; annotations couvertes par les notes de Card kit 02, 04 et 06 ; capture `deleted-board-1280.png` |
| Section `01 · Board at 1920 px, 8 columns` | `58:8846` | remplacée par Mockups 12 (packCards recalculé) ; capture `deleted-board-1920.png` |
| Page `Emphasis levels` | `29:2` | échelle, options de bleu pâle (option D à liseré 4 px, abandonnée en passe 5) et board d'exemple remplacés par Card kit 04 ; captures `deleted-emphasis-*.png` |

Aucune section 99 n'a été créée pour les maîtres (consigne mise à jour).

## 5. Gardé, et pourquoi

| Élément | Raison |
|---|---|
| Page `Read me` (`0:1`) | mise à jour : sommaire des 4 pages restantes avec liens, légende des niveaux alignée sur la règle actuelle (bord 1 px, plus de liseré, sur les pastilles et la mini-board de la couverture), crédits avec lien vers Data Display, date 2026-11-24 |
| Page `Board · 1024 fold` (`1:5`, ex Board · 1920), section `01 · Fold at 1024 px, 4 columns` (`58:8876`) | seul board à 4 colonnes du fichier, notes de repli uniques ; 18 cartes en cadres custom (pas d'instance à re-brancher), dit dans la description de section |
| Page `Edit flow` (`44:2`) | 23 étapes annotées sans équivalent ailleurs (menu du board, nouveau board, suppression, menu Emphasis, More, Undo, Cancel, détail de card, ghost place, fonds automatiques Hide / Force) ; 395 cartes en cadres custom, aucune instance de maître local ni de Widget Card (deprecated) |
| Composants locaux de Edit flow : `Toolbar size`, `Card toolbar`, `Edit bar`, `Flow arrow`, `Add slot`, `Ghost place` | tous utilisés dans Edit flow (`.Card Toolbar` de la librairie est privé) |
| Atomes locaux du Card kit : Key figure row, List row, Task item, News item, Timeline item, Mini table row, Progress, Grade chip, Empty hint, `.Delta` | pas d'équivalent publié, tous utilisés (Card kit et Mockups) |

## 6. Contrôle final

- 0 instance des maîtres locaux remplacés (supprimés après contrôle d'usage sur Card kit et Mockups ; les autres pages n'en
  avaient pas). 0 instance de maître local structurelle dans une instance de librairie.
- 0 instance de Widget Card (deprecated) dans le fichier (les 16 étaient sur la page Formats supprimée).
- Widget Card : 115 instances sur Card kit, 198 sur Mockups.
- 0 peinture SOLID non reliée et 0 texte sans style hors instances de librairie, contenus de slot compris, sur Card kit,
  Mockups, Read me et Board · 1024 fold. Sur Edit flow, les fonds et traits par défaut des 8 sections étaient bruts :
  fond relié à Static/Background/Main/Tertiary (comme Card kit), trait retiré ; reste le voile des 2 Modal, qui vient du
  maître Modal de la librairie (noir 35 % brut, à signaler à la librairie).
- 0 texte coupé dans une card (les seuls textes rognés de Mockups sont les libellés du rail replié et du fil d'Ariane de
  la topbox, internes aux instances de librairie, comme avant). 0 titre de card sur deux lignes.
- Densité : inchangée par construction (diff vide et pixels identiques sur toutes les cards). Seule card modifiée,
  Sanctions de Card kit 06, mesurée comme son double de Mockups 01.
- 0 tiret cadratin dans les textes écrits.

## 7. Points ouverts

1. Corriger dans Data Display les 4 écarts de construction (section 1), puis réinitialiser les surcharges de sizing.
2. Edit flow (395 cartes) et Board · 1024 fold (18 cartes) restent en cadres custom : les convertir en Widget Card est un
   travail de recomposition (contenu à reconstruire en atomes), pas un re-pointage. À décider.
3. Les variantes Reversed des atomes de la librairie, en 01 et 05, sont blanches sur le fond gris de la section (même
   écart que l'ancien kit) : elles se lisent dans les cards Strong de la vitrine 05.

## Passe 2 (2026-11-24) : mise à jour Data Display 2.0.1 et retrait des surcharges compensatoires

Librairie republiée le 2026-11-24 à 10:21 (« Widget Card 2.0.1 », passe 8 de `_figma-data-display.md`). Pages
touchées : Card kit (`78:20`) et Mockups (`118:3983`) seulement. Edit flow et Board · 1024 fold : aucune instance de
Widget Card, Group Heading ou `.Card Header` (contrôlé), rien modifié. Librairie non modifiée, rien publié, rien commité.
Captures dans `captures/repoint2/` (`kit-01|03|05|06|07-before|after.png`, `mock-01` à `mock-12-before|after.png`).

### 1. Mise à jour des instances

- Par Figma web (navigateur Playwright), Assets > Review library updates, page Card kit, boutons **Update** de
  `[Components] Data Display` seulement : Widget Card puis Group Heading (les deux seuls éléments listés). Feedback,
  Action, Tokens, qirin--variables et NDBX Icons laissés en attente. La mise à jour par élément s'applique au fichier :
  la page Mockups n'avait plus de mise à jour Data Display ensuite, et la vue « toutes les pages » n'en liste aucune.
- Par l'API, les 2 instances isolées de `.Card Header` de Card kit 01 (`164:5261`, `164:5282`, vitrine des atomes privés,
  hors Widget Card) restaient sur l'ancienne version : `swapComponent` vers la variante de même nom de la nouvelle version
  (même clé). Seul écart : `Unit` en largeur auto (le correctif), surcharges `name` et propriétés identiques.
- Résultat, clé et `remote` vérifiés sur chaque instance imbriquée des cards : Widget Card `163f191a` (set `178:4771`) x
  115 + 198, `.Card Header` `1353cf0d` (`178:4768`) x 117 + 198, Group Heading `7027535f` (`178:9547`) x 8 + 15 ; les
  autres atomes Data Display (`.Status`, `.Card Footer`, `.Delta`, `.Empty Hint`, `.Card Toolbar`, `.Toolbar Size`, Key
  Figure, Sparkline, Bullet Graph, Stacked Bar) sont tous `remote = true` sur leur clé de librairie et sans mise à jour en
  attente. 0 instance locale d'un atome de la librairie dans une card. Restent locaux, comme prévu : les atomes du
  fichier (List row, Timeline item, Mini table row, Grade chip, Task item, News item, Progress, Key figure row, Empty
  hint) et `.Delta` local (dans ces atomes, et 10 fois posé seul dans le slot d'une card sur chaque page).

### 2. Relevé avant/après, méthode

Relevé par script de chaque Widget Card (115 sur Card kit, 198 sur Mockups), en trois empreintes :
**S** (arbre complet : type, visibilité, taille, position, sizing, textes, style de texte, clé et propriétés de chaque
instance, contenu des slots), **O** (liste des surcharges, chemin + champs, hors champs compensatoires), **P** (export PNG
de la card, octet par octet). Champs compensatoires exclus de S et O : `Unit` et `Meta` (`textAutoResize`, taille),
`.Card Footer` (`layoutAlign`, taille, `counterAxisSizingMode`), slot `Content` (`layoutAlign`, `layoutGrow`, taille).
Trois relevés : avant, après mise à jour, après retrait.

Après la mise à jour : S et O identiques partout ; P identique sauf 3 cards (anticrénelage, S identique) : la variante
Warning subtle de la vitrine Library de Card kit 01 (`164:4816`, sans surcharge, elle suit le maître corrigé), Limit
review 1x1 de Card kit 06 (`98:3173`) et de Mockups 12 (`125:22386`).

### 3. Retrait des surcharges compensatoires

Surcharges relevées avant retrait :

| Surcharge | Card kit | Mockups |
|---|---|---|
| `Unit` : `textAutoResize` | 103 | 198 |
| `.Card Footer` : `layoutAlign` | 103 | 198 |
| `.Card Footer` : `width`, `height`, `counterAxisSizingMode` | 6 | 21 |
| slot `Content` : `layoutGrow` (+ `layoutAlign`) | 10 | 17 |
| Group Heading > `Meta` : `textAutoResize` | 6 (3 cards) | 15 (14 cards) |

Le Plugin API ne retire pas une surcharge champ par champ (réécrire la valeur du maître garde la surcharge) :
`removeOverrides()` sur la plus petite instance qui la porte, puis réapplication de tout le reste, relevé avant :
propriétés, variante des instances imbriquées (un swap de variante n'apparaît pas dans `overrides` et saute aussi : par
exemple le pied `Type=Link`), textes et segments, style de texte, remplissages reliés, variables liées (`paddingTop` du
Group Heading), taille, nom, annotations, positionnement.

- `.Card Header` (Unit) et `.Card Footer` : 90 cards sur Card kit (dont 3 avec Group Heading), 181 sur Mockups (dont 13 avec Group Heading).
- Group Heading du slot (Meta) : réinitialisé seul, padding relié et taille réappliqués.
- Slot `Content` : la surcharge est portée par la card elle-même, donc card entière réinitialisée puis tout réappliqué
  (le contenu du slot survit) : 10 cards sur Card kit (Loading, Empty, Error de 03 et Claims 1x1 Empty de 07), 17 sur
  Mockups (16 Loading de 10, Ext. rating Error de 11). Sur 18 d'entre elles, le drapeau `layoutPositioning` (valeur AUTO
  dans une grille) avait disparu ; reposé (ABSOLUTE puis AUTO), cellule, taille et ordre identiques.
- 12 cards de la vitrine Library (Card kit 01) : aucune surcharge, rien à faire.

Résultat : 0 surcharge compensatoire restante, sauf `counterAxisSizingMode` sur 27 pieds `Type=Link` (6 Card kit, 21
Mockups). Elle est recréée par Figma à chaque changement de variante Date vers Link (16 px puis 20 px de haut), valeur
AUTO égale au maître : ce n'est plus une taille posée à la main. Valeurs relevées après : Unit « USD » 23 px, « USD k »
32 px, en entier ; Meta 38 à 95 px, en entier ; pieds à la largeur intérieure de la card ; slots des états Loading,
Empty, Error en FILL.

### 4. Contrôle

| Page | Cards | S (structure, textes, visibilités) | O (autres surcharges) | P (pixels de la card) |
|---|---|---|---|---|
| Card kit | 115 | identique 115/115 | identique 115/115 | identique 113/115 (2 anticrénelages ci-dessus) |
| Mockups | 198 | identique 198/198 | identique 198/198 | identique 197/198 (1 anticrénelage ci-dessus) |

- Captures avant/après (`captures/repoint2/`) : Card kit 01, 03, 05, 06, 07 et Mockups 02, 03, 05 à 11 identiques à
  l'octet ; Mockups 01, 04 et 12 : 1 pixel différent chacun, écart inférieur au seuil de 30 sur 765.
- Aucun texte coupé, densité inchangée : par construction (S identique sur toutes les cards : tailles, positions et textes
  au dixième de pixel près), et vérifié sur les captures.
- 0 valeur brute dans le contenu des slots (peintures SOLID non reliées : 0, textes sans style : 0, les deux pages).
- Écart de méthode : la mise à jour est passée par l'interface Figma (le Plugin API importe la nouvelle version mais ne
  remplace pas l'ancienne copie) ; 2 instances isolées seulement ont été basculées par `swapComponent`.

### 5. Point ouvert

- Les 27 `counterAxisSizingMode` des pieds Link ne disparaîtront que si le pied Link devient la variante par défaut, ou
  si la librairie expose le type de pied comme propriété de la card (changement de librairie, non fait).
