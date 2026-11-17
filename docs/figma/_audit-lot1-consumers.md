# Lot 1 : relevé des instances à risque dans les fichiers consommateurs (2026-11-17)

Relevé en LECTURE SEULE par `use_figma` (aucune modification, aucun swap, aucune publication). Préalable du lot 3 du plan
`_audit-components-SYNTHESE.md`. Section « Lot 0 fait » en fin de document.

## Méthode

- 13 fichiers parcourus page par page (`page.loadAsync`), calques masqués inclus (`skipInvisibleInstanceChildren = false`).
  Consommateurs : Coverbook `NflKzgx17mOn2JPoFaqnjW`, Reject Management `zUzOSE77EjbShM9u7yLthB`, Manual Underwriting
  `9EXkGvyk2yGF9qFpRpV0Ey`, Search `LBLqJmlPqXmx9qksCyYGPb`, Buyer Summary `0ZjZu0OjHdzGowm3hliM2M`, Exposure Card
  `5OVzA6FZD7o8aGtfK5qo7g`, Component Status `wqlQIlGhJmMCfgc2XD1Umm`, showcase `FS7qNdQx4Qyo9CkBgIWRMi`. Librairies : Action,
  Data Entry, Data Display, Feedback, Layout.
- Pour chaque instance : clé du composant principal et clé de son set, comparées à la liste à risque (clés relues dans les maîtres,
  tableau ci-dessous). Chaque occurrence est classée **directe** (posée dans le fichier ou dans un composant local) ou **via X**
  (sous une instance de X). Attention : « via Table Row / Table Header Row » désigne du contenu que le consommateur a posé dans
  les slots natifs de la rangée (vérifié sur Coverbook), pas un défaut du maître.
- Surcharges : propriété `overrides` des instances de Card, `.Columns`, `.Layout`, `.Key Info`, `.Company Profile`, Button,
  Checkbox, Input Text ; seuls les champs de mise en forme sont comptés (padding, gap, rayons, trait, fills, effets, style et
  propriétés de texte, variables liées, largeur / hauteur). Le texte (`characters`), la visibilité et les propriétés de composant
  ne sont pas comptés : une liaison de jeton ne les touche pas.

## Clés à risque (relues dans Figma)

| Composant | Fichier, nodeId | Clé |
|---|---|---|
| Link ancien (retiré du canevas) | Action 171:3074 | `b9493d2f368c2be7b05432781ca275cc35a896f3` |
| Link courant | Action 688:4202 | `77367a8f128498576f030e35e042f9434514056a` |
| Flyout Menu Legacy (`# Items`) | Action 1:20 | `5d1147ac0e38f8f0c1dc9e3f24e12925e60d5631` |
| Flyout Menu v3 (slot) | Action 507:833 | `84a8ec3ed08331f3cf5d08222a02cad5dcb53d74` |
| Dropdown, variante parasite `Property 3=True` | Data Entry 2288:1056 | `d98df6d202114e11838bf4e6b525128c595e1153` (set `9274a067…`) |
| Table Row (A) | Data Display 1514:3369 | `4a0ebfc7c3621aad424814ee2dfda9ccbd185a81` |
| Table Row (B) | Data Display 1514:4330 | `a358c00cb4507714ae6ea9a891b661576abaf309` |
| User card / ☠️ Users Card List | Data Entry 2340:2236 / 2340:2447 | `c06302804a75e73e421ebadee2a9bcda3bbbe3c6` / `b6500e2edce0374dea111dc7d50ec9cc26135500` |
| Task | Data Entry 1:92 / Data Display 1:92 | `51ecbe4734199a3ef3d94ad06b120a12acd650c8` / `2f027c08678b71c902b7bcab15e61cbcc228402f` |
| 🆕 Tenant | Data Entry 3028:361 | `3b8985ea7c65d13b00e52a0c1780f1347261545f` |
| Cell (ancienne table) | Data Display 38:13911 | `c84e60cc51130fe13dea6a35e2f52e86dee3f471` |
| Autres obsolètes Data Display | Topbox 424:18949 `96237ddd…`, [☠️] Topbox 338:6573 `c3b2b042…`, Topbox V2 Variation 1 / 2 / 4 `852686b8…` / `c5183e4b…` / `575529e5…`, Data `2ff83d9e…`, Data V2 `815500c5…`, topbox2026--usertesting `9fe3a9cd…`, Tabs 256:1468 `048c4280…`, Table Header 33:1985 `66f68059…`, ☠️ Table Line `ae302bf4…`, Row 679:5294 `c751d4e1…`, Collapsible Table Cell 973:469 `861b2340…`, ☠️ Collapsible Table `d1252184…`, ☠️ Collapsible Table Row `3f2a6c67…`, ☠️ Timeline `f9792212…`, Frame 243 `5ff5d888…`, Frame 245 `94f2c4ef…` | |
| Parasites Layout | Component 1 2459:1427 `a3529840…`, Frame 411 2457:6367 `9ac68303…`, Keycap 4017:324 `59ff461b…`, Shortcut Row 4017:349 `6a8c01e3…`, Slot déprécié 33:4843 `f8a4fe08d140cd5308ac161f011b4b0c3bbda2fb`, écran Search : Topbox V2 - Variation 1 `afd2d124…`, Search Bar `4b812fcc…`, Standalone Dropdown `2a36725e…`, Results `ffd9fe5d…` ; Company Information `a596f58d…`, Assessment `84e56de8…`, Tools `95cd0f25…` | |
| Grade d'une autre librairie | (instancié dans `.Company Profile`) | `5ac10c1bdb2527f31e60956e4785bf5301b8acc7` (le Grade local est `0a9375b0…`) |

## Tableau clé à risque x fichier (nombre d'instances)

Colonnes : Cov = Coverbook, RM = Reject Management, MU = Manual Underwriting, Sea = Search, BS = Buyer Summary, Exp = Exposure
Card, CS = Component Status, Show = showcase, puis les 5 librairies (Act, DE, DD, Fb, Lay). Case vide = 0.

| Clé à risque | Cov | RM | MU | Sea | BS | Exp | CS | Show | Act | DE | DD | Fb | Lay |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Link ancien `b9493d2f` | 50 | 19 | 8 | 63 | 42 | | 178 | | 151 | | 33 | 11 | 22 |
| Flyout Menu Legacy `5d1147ac` | 21 | 3 | 8 | | 2 | | 1 | | 3 | | 23 | | 16 |
| Dropdown 2288:1056 `d98df6d2` | | | | | | | | | | | | | |
| Table Row A 1514:3369 `4a0ebfc7` | | 540 | | | | | | | | | | | |
| Table Row B 1514:4330 `a358c00c` | 272 | | | | | | 106 | 7 | | | 17 | | |
| User card `c0630280` | | | | | | | | | | 30 | | | |
| Users Card List `b6500e2e` | | | | | | | | | | | | | |
| Task (DE) `51ecbe47` | | | | | | | | | | 11 | | | |
| Task (DD) `2f027c08` | | | | | | | | | | | 21 | | |
| 🆕 Tenant `3b8985ea` | | | | 9 | | | | | | | | | |
| Cell ancien 38:13911 `c84e60cc` | 2 634 | | | | | | 1 456 | | | | | 60 | |
| Topbox 424:18949 | | | | | | | | | | | 5 | 1 | 20 |
| Topbox V2 Var 1 / 2 / 4 (DD) | | | | | | | | | | | 13 / 8 / 1 | | |
| Data V2 | | | | | | | | | | | 5 | | |
| Tabs 256:1468 | | | | | | | | | | | 40 | 1 | 20 |
| Table Header 33:1985 | | | | | | | | | | | 1 | | |
| Collapsible Table Cell 973:469 | | | | | | | | | | | 34 | | |
| ☠️ Timeline / Frame 243 / Frame 245 | | | | | | | | | | | 3 / 2 / 1 | | |
| Data, Data V1, topbox2026, [☠️] Topbox, Row 679:5294, ☠️ Table Line, ☠️ Collapsible Table / Row | | | | | | | | | | | | | |
| Component 1 / Frame 411 | | | | | | | | | | | | | 3 / 0 |
| Keycap / Shortcut Row (copies Layout) | | | | | | | | | | | | | 20 / 4 |
| Slot déprécié `f8a4fe08` | | | | | 26 | | 2 | | | 2 | 61 | 3 | 59 |
| Composants écran Search (Layout) | | | | | | | | | | | | | 41 |
| Company Information / Assessment / Tools | | | | | | | 2 / 2 / 2 | | | | | | 5 / 5 / 5 |
| Grade `5ac10c1b` | | | | | | | | | | | 5 | | 25 |

Hors liste, relevés au passage : ancienne librairie `Data Display 👔` (`7bc7072b…`) DD 63 (`.Topbox Details` 40, Timeline 23) et
Feedback 26 (page Functional Notice, hors maître) ; ancien Link `0f7a542a…` DD 3, Feedback 1 ; ancien Checkbox `df6100fe…` DD 27,
Feedback 1 ; ancien Tag `c0e3e762…` une instance par page de documentation dans les 5 librairies (en-tête de page, hors maître).
Exposure Card : 86 instances, aucune à risque.

## Détails par fichier

### Coverbook
- **Cell ancien 38:13911** : Overview 432, Screens 612, States 798, Specs 279, Local components 513. Ce sont des cellules que le
  fichier a posées dans les slots de Table Row / Table Header Row, depuis les 4 composants locaux `Covers table / Buyer credit
  limits`, `Buyer grade based covers`, `Policy credit limits`, `Policy grade based covers`. Ex. `I25:2685;1514:3474;25:2726`.
- **Table Row B** : 272 (48 directes dans Local components, ex. 25:2825, 25:2960, 25:3081 ; le reste via les 4 tables locales).
- **Link ancien** : 50, tous sous `.Content Type` de l'ancien Cell (chaîne Cell > `.Cell Type` > `.Cell Properties` > `.Content Type` > Link).
- **Flyout Legacy** : 21 ; 14 via `.Topbox Content` (Page Header de Data Display), 7 via le composant local `Row menu` (instance
  directe 21:1915).

### Reject Management
- **Table Row A** : 540, toutes issues du composant local `Rejects table` (30 instances directes, ex. 25:1926, 25:2050, 25:2141).
- **Link ancien** : 19, issus de 3 instances directes dans les composants locaux `Resolution notice` (31:4135) et `Correction modal
  footer` (47:4052, 47:4172).
- **Flyout Legacy** : 3, issus d'une instance directe 25:4949 dans `Rejects table`.

### Manual Underwriting
- **Link ancien** : 8, issus de l'instance directe 32:1842 du composant local `Modal content / Send`.
- **Flyout Legacy** : 8, issus de 6 instances directes du composant local `UW card menu` (21:292, 21:344, 21:355...).

### Search
- **Link ancien** : 63, issus de 6 instances directes dans `Result / Policy content` et `Result / Buyer content` (49:2904,
  49:2949, 49:2989...).
- **🆕 Tenant** : 9, glyphe posé dans `Icon Functional` (1 dans Local components).

### Buyer Summary
- **Link ancien** : 42, tous via **List Item** (calque `Title` du maître List Item de Data Display) : se corrige sur le maître.
- **Flyout Legacy** : 2 directes (Screens 28:7911, Specs 95:3337).
- **Slot déprécié** : 26, via `Drawer` et `Drawer Tabs` (calques `Content Slot` et `Tabs Slot`). La version **publiée** du Drawer
  porte encore l'ancien Slot alors que le maître local du fichier Layout ne l'a plus : la prochaine mise à jour de librairie
  acceptée dans Buyer Summary remplacera ces calques, avec risque de perdre le contenu posé dedans (`Drawer · Boards`,
  `Drawer · New board`).

### Component Status
- **Cell ancien** 1 456 et **Table Row B** 106 (directes, ex. 13:7094, 14:5954) : le générateur
  `docs/components-status/figma-scripts/lib.js` importe `row` = `a358c00c…` et `cell` = `c84e60cc…`.
- **Link ancien** 178 : 171 sous `.Content Type` de l'ancien Cell, 7 via Breadcrumb.
- Slot déprécié 2 (via Drawer), Company Information / Assessment / Tools 2 chacun (via Side Navigation), Flyout Legacy 1.

### Showcase
- **Table Row B** : 7, posées dans le slot d'une Card. Rien d'autre.

### Librairies entre elles
- **Action** : Link ancien dans Breadcrumb (7 dans le maître, 14 via), Pagination (`.Options` 17 et `.Options Select (Legacy)`
  5 dans les maîtres, 104 via), Cover 4. Flyout Legacy : page Button Split 944:4619, 944:4665 et page Flyout Menu 983:1601, hors maître.
- **Data Entry** : Slot déprécié dans le maître `.Value` du Dropdown (2288:821, 2293:1002) ; User card 30 dans Users Card List ;
  Task 11 (Checklist). Variante 2288:1056 : 0 instance nulle part.
- **Data Display** : List Item (Link ancien, 1 dans le maître 2059:406, 19 via) ; `.Topbox Content` et Topbox V2 Variation 1 portent le
  Flyout Legacy (23) ; Grade `5ac10c1b` dans `.Company Profile` (5) ; Slot déprécié dans Card / `.Settings` (12), Timeline (16),
  ☠️ Collapsible Table (2), page Topbox (31) ; Table Row B 17 (exemples de doc, ex. 2160:2208), **Table Row A 0** ; ancien Cell 0
  (n'existe que chez les consommateurs) ; Collapsible Table Cell 973:469 : 33 via le Collapsible Table Cell 909:2473 (sert de sous-cellule).
- **Feedback** : Link ancien dans le maître Snackbar (124:34810) et 6 via ; page WIP Contextual Help : Cell ancien 60, Link 4,
  Topbox 1, Tabs 1 ; Slot 3.
- **Layout** : Drawer (Slot 17 hors maître, Flyout Legacy 13 hors maître et 1 dans le maître Drawer, Component 1 3 via Slot) ;
  page Layout et écran Search 🚧 (Topbox DD 20, Tabs 20, Slot 38, Grade `5ac10c1b` 21, composants de l'écran Search 41) ;
  Home page (Link ancien 18, Grade 4, Slot 4) ; Overlay (Keycap copie 20, Shortcut Row copie 4) ; Side Navigation (Company
  Information / Assessment / Tools 1 dans le maître chacun, 4 via).

## Surcharges relevées (ce qu'écraserait ou non le lot 3)

| Atome | Instances (consommateurs) | Avec surcharge de mise en forme | Champs surchargés |
|---|---|---|---|
| Card `1d68f180` | BS 98, Sea 20, CS 1 | BS 85, Sea 8 | BS : largeur / hauteur seulement. **Search : 8 instances du composant local (49:3160, 49:3510, 49:3689...) surchargent `fills`, `strokes`, `strokeStyleId`, variables liées** à la racine |
| `.Columns` `f0a9b21c` | BS 98, Sea 20, CS 1 | BS 2, Sea 7 | largeur / hauteur seulement |
| `.Layout`, `.Key Info`, `.Company Profile` | 0 | 0 | aucune instance chez les consommateurs |
| Button `ba6612f7` | ~1 930 (tous fichiers) | ~120 | largeur / hauteur (racine), `fills` de sous-calques (icône, libellé) |
| Checkbox `0473a114` | RM 605, MU 11, Show 8, CS 11 | RM 63, MU 2, Show 1 | largeur / hauteur seulement |
| Input Text `c88876bc` | RM 18, MU 77, BS 8, Sea 8, Show 1, CS 1 | RM 15, MU 20, BS 2 | largeur / hauteur ; `strokes` de sous-calque (RM 7, ex. `43:4055`) ; `fills` de sous-calque (MU 6, ex. 50:2228) |

**Aucune surcharge de padding, gap, rayon, épaisseur de trait, style de texte, taille, famille ou interligne** sur ces atomes, dans
aucun fichier consommateur. Les surcharges de largeur / hauteur ne sont pas touchées par une liaison de jeton.

## Verdicts pour les corrections du lot 3

| Correction du lot 3 | Verdict | Détail |
|---|---|---|
| Swap du Link ancien vers 688:4202 dans les maîtres (Breadcrumb, Pagination `.Options` et `.Options Select (Legacy)`, List Item, Snackbar) | **sûr** pour les textes, à condition de régler `Icon=None` | Le calque texte s'appelle `Label` dans les deux sets : les libellés surchargés sont conservés. Le nouveau set a `Icon=Left` par défaut. Cascade : BS 42, CS 7, DD 12 |
| Retrait du Link 171:3074 (après le swap des maîtres) | **migration nécessaire** : 10 instances directes dans des composants locaux | RM 3 (31:4135, 47:4052, 47:4172), MU 1 (32:1842), Search 6 (`Result / Policy content`, `Result / Buyer content`). Plus la chaîne de l'ancien Cell (Cov 50, CS 171), traitée avec le Cell |
| Flyout Menu Legacy vers v3 | **migration nécessaire**, pas un simple swap (v3 = composant à slot, sans `# Items`) | 11 instances directes chez les consommateurs : Cov 1 (21:1915), RM 1 (25:4949), MU 6 (`UW card menu`), BS 2 (28:7911, 95:3337), CS 1 ; dans les maîtres : `.Topbox Content` (cascade Cov 14), Topbox V2 Variation 1 (DD), Drawer (Layout, 1) |
| Supprimer la variante Dropdown 2288:1056 | **sûr** | 0 instance dans les 13 fichiers |
| Dépublier un des deux Table Row | **migration nécessaire** dans tous les cas | A 1514:3369 : RM seul (540, depuis 30 instances du composant local `Rejects table`). B 1514:4330 : Cov 272, CS 106, showcase 7, doc DD 17. Garder B et basculer les 30 instances de `Rejects table` (propriétés identiques) est le chemin le plus court |
| Dépublier Select Card (User card, Users Card List) | **sûr** | 0 hors Data Entry (30 internes à Users Card List) |
| Dépublier Task (Data Entry, Data Display) | **sûr** | 0 hors librairies |
| Sortir 🆕 Tenant de Data Entry | **migration nécessaire** : 9 instances dans Search | glyphe posé dans `Icon Functional` (1 dans Local components) |
| Dépublier / supprimer l'ancien **Cell** 38:13911 (ancienne table) | **migration nécessaire, la plus lourde** | Cov 2 634 (contenu des slots de Table Row, depuis 4 composants locaux `Covers table / …`), CS 1 456 (générées par `lib.js`, à corriger avant), Feedback 60 (page WIP). À ne pas faire avant d'avoir recomposé ces tables avec Table Cell 1514:2514 |
| Dépublier les autres obsolètes de Data Display (Topbox, Topbox V2, Data, Data V2, Tabs, topbox2026, ☠️, Table Header 33:1985, Table Line, Row 679:5294, Frame 243 / 245) | **sûr** pour les 8 fichiers consommateurs | utilisés seulement dans les librairies : Data Display (pages Topbox, Timeline), Layout (écrans Search 🚧 et Layout), Feedback (Contextual Help WIP). Les instances y restent figées |
| Renommer Collapsible Table Cell 973:469 | **sûr** (renommage, clé conservée) | sert de sous-cellule au Collapsible Table Cell 909:2473 (33) : ne pas le supprimer |
| Remplacer `Data Display 👔` (`7bc7072b`) | **sûr** pour les consommateurs | DD 63, Feedback 26, aucun consommateur |
| Dépublier Component 1, Frame 411, copies Keycap / Shortcut Row, composants de l'écran Search | **sûr** pour les consommateurs | 0 hors Layout ; dans Layout, basculer d'abord Keycap 20 et Shortcut Row 4 vers Action, Component 1 a 3 instances dans un Slot de brouillon |
| Dépublier le Slot déprécié `f8a4fe08` | **migration nécessaire** | BS 26 (via le Drawer publié : publier Layout remplace `Content Slot` / `Tabs Slot`, vérifier le contenu de `Drawer · Boards` et `Drawer · New board`), CS 2, maîtres DE (`.Value` du Dropdown, 2), DD (Card / `.Settings`, Timeline Event, ☠️ Collapsible Table), Feedback 3, écrans Layout 59 |
| Privatiser Company Information / Assessment / Tools | **sûr** | imbriqués dans Side Navigation (CS 2 chacun via Side Navigation) ; un atome privé imbriqué reste fonctionnel |
| Grade `5ac10c1b` vers le Grade local dans `.Company Profile` | **sûr** | 0 chez les consommateurs (`.Company Profile` n'y est pas instancié) ; écrans Layout 25 se mettront à jour |
| Liaisons Semantic sur Card (rayon 4, padding 24 / 25, trait 1) et ses atomes | **sûr** | aucune surcharge de rayon, padding ou épaisseur ; les 8 Cards de Search gardent leur trait et leur fond surchargés (la nouvelle liaison de couleur ne les atteindra pas, sans rien casser) |
| Styles de texte Tokens et Semantic d'espacement sur `.Columns`, `.Layout`, `.Key Info`, `.Company Profile` | **sûr** | `.Columns` : largeur / hauteur seulement ; les trois autres ne sont pas instanciés chez les consommateurs. Les textes surchargés (`characters`) sont conservés |
| Rayon, trait, padding vers Semantic sur Button, Checkbox, Input Text | **sûr** | seules les tailles et les couleurs de sous-calques sont surchargées ; Input Text : 7 traits surchargés dans RM (garderont leur couleur) |

## Limites
- Le classement « via » ne distingue pas un calque du maître d'un contenu de slot : les cas ambigus ont été vérifiés à la main
  (Cell dans Table Row = contenu de slot ; Link dans List Item = calque du maître ; Slot dans Drawer = calque du maître publié).
- Les surcharges `characters`, visibilité et propriétés de composant ne sont pas comptées.
- Les écrans des librairies (Layout Home page et Search 🚧, pages Topbox de Data Display) sont comptés mais hors périmètre consommateur.

## Lot 0 fait (doc seulement, aucune écriture Figma)

Clés et nodeIds lus dans Figma en lecture seule (Action, Layout). Fichiers modifiés, non commités :

- `docs/components-status/scripts/build-components.js` : préfixes `link` = `77367a8f`, `flyout-menu` = `84a8ec3e` ; nouvelles clés
  `page-title` `15b5e617…`, `filter-drawer` `64692d47…`, `spotlight` `c6ac17c7…`, `shortcuts-panel` `8594fa51…`, `scrollbar`
  `7ffc29a3…` ; nodeIds Header 2390:1583, Side Navigation 2083:6932, Modal 2256:1556, Drawer 2471:14923 ; nouvelle entrée
  `scrollbar` (Layout 2076:9653, Figma seulement) ; commentaires Link et Flyout Menu mis à jour.
- `docs/components-status/components.json` : régénéré (`extract-code.js` puis `build-components.js`), 107 composants de
  librairie ; aucune clé `b9493d2f` ni `5d1147ac` complète ; les 11 entrées vérifiées portent la bonne clé et le bon nodeId.
- `docs/components-status/README.md` : 106 devient 107 composants.
- `docs/figma/qirin-figma-inventory.md` : clés Link et Flyout Menu corrigées, table « Layout : clés et nodeIds » ajoutée.
- `docs/figma/PLAYBOOK.md` : clé Flyout Menu corrigée, Link, Page Title, Filter Drawer, Spotlight, Shortcuts Panel, Scrollbar ajoutés.
- `docs/zeroheight/_new-components-layout-overlay.md` : référence Flyout Menu corrigée.
- `docs/components-status/figma-scripts/lib.js` : clé `link` corrigée (le prochain rafraîchissement du fichier Component Status
  posera le Link courant ; les 178 anciens restent jusque-là). `row` (`a358c00c…`) et `cell` (ancien Cell `c84e60cc…`) laissés tels
  quels : à revoir au lot 3 avant toute suppression de l'ancien Cell.

Mentions restantes des anciennes clés, volontaires : avertissements abrégés dans l'inventaire et les commentaires de
`components.json`, journal `docs/SESSION-RESUME.md`, rapports d'audit.
