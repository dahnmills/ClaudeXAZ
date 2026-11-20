# Figma, page « Edit flow » (44:2) : rapport

Fichier `XW7jVtIa6UWRTqKMDqOF5D`, page `44:2` uniquement. Les autres pages n'ont été que lues (page `1:4` clonée en
lecture, original intact). Aucune librairie modifiée, aucune variable ni collection créée, rien de publié, rien de commité.
Le flow suit `benchmark-edit-flow.md` (recommandations P1, quelques P2 signalés) et le compromis d'emphase validé par
l'utilisateur le 20/11 à 13 h 35.

## Organisation

Sept Sections numérotées empilées (200 px entre elles), puis la Section des composants locaux. Dans chaque Section :
en-tête (Title/H1 + description), puis une rangée d'écrans de 1280 px, 560 px entre deux écrans. Au-dessus de chaque
écran, son étiquette (numéro + titre + une phrase) ; entre deux écrans, une flèche de parcours avec l'action de
l'utilisateur ; sous chaque écran, à 48 px, un cadre Notes (640 px, liste numérotée). Annotations natives courtes
(numéro + titre) sur les nœuds clés ; elles tombent dans les 560 px libres à droite, sous la ligne des flèches. Contrôle
par script : aucun chevauchement de calques dans les Sections, écarts de 560 px vérifiés, 480 px libres à droite du
dernier écran.

Écrans : 1280 x 800, sauf 2.2 (894, menu entier visible), 4.1 et 4.2 (900, format 2 x 2 entier) et 7.x (1440, pour
voir la rangée des cards de statut). Le bas d'un écran de 800 est la limite du viewport (le board défile) ; le board
lui-même reste un rectangle net dans chaque clone.

## Écrans et nodeIds

| Étape | Section | Écrans |
|---|---|---|
| 1 · Boards | `53:12058` | 1.1 Sélecteur ouvert `53:12062` · 1.2 Menu du board `53:13699` · 1.3 Manage boards `53:15676` · 1.4 New board `53:17009` · 1.5 Confirmation de suppression `53:18113` |
| 2 · Edit | `56:10263` | 2.1 Mode édition + barre d'outils V1 `56:10267` · 2.2 Menu d'emphase (Auto) `56:11931` · 2.3 Tous les formats (More) `56:13791` · 2.4 Card retirée, Undo `59:5857` · 2.5 Cancel avec changements `59:7909` |
| 3 · Add a card | `61:8001` | 3.1 Galerie par question métier + recherche `61:8005` · 3.2 Détail : aperçu réel en carrousel, 14 formats, emphase `61:10416` · 3.3 Card posée dans le trou `62:8255` · 3.4 Glissée depuis la galerie `62:10665` |
| 4 · Resize | `64:9501` | 4.1 Poignée, accroche 2 x 2 `64:9505` · 4.2 Relâché, voisines décalées `64:11540` |
| 5 · Card detail | `66:10544` | 5.1 Titre en lien `66:10548` · 5.2 Panneau : tableau, source, date, CSV, page complète `66:12441` |
| 6 · States | `69:11764` | 6.1 Chargement progressif (squelettes) `69:11768` · 6.2 Erreur + Retry, vide daté, Outdated, date du board `69:13809` |
| 7 · Automatic status background | `72:12617` | 7.1 Deux fonds auto avec raison `72:12621` · 7.2 Masquer ou forcer `72:14518` · 7.3 Fond masqué, statut gardé `72:16407` |

Contenu marquant :
- **1** : templates d'abord (Common, Credit Assessment, Credit Underwriting) puis My boards ; menu du board à côté du
  sélecteur (Add card, Reset layout, Refresh data, New board, Duplicate, Rename désactivé sur un template, Manage boards) ;
  drawer Manage boards (Reset to template / Duplicate pour les templates, Rename en place / Duplicate / Delete pour les
  boards perso, badge Current) ; New board : nom présélectionné « Copy of Common », départ Copy of the current board
  (présélectionné), les trois templates, Empty board ; suppression confirmée « Delete "Q4 renewal review"? Its 11 cards... ».
- **2** : la barre d'outils de la board devient la barre d'édition (indice, compteur de changements, Add card, Undo,
  Reset layout, Cancel, Done) ; barre flottante V1 au survol (1×1 / 2×1 / 2×2 / More, Emphasis, poignée, Duplicate,
  Remove) ; menu d'emphase en deux groupes : Emphasis (None, Subtle, Strong) et Status background (Auto from thresholds,
  Hide for this buyer, Force Warning, Force Problem) ; More = grille des 14 formats en 4 groupes ; Remove sans question,
  trou → place « Add a card here, Fits 1 × 1 » + toast Undo ; Cancel avec changements → « Discard 3 changes? »
  (Keep editing / Discard changes).
- **3** : drawer non modal à droite, board visible ; ouvert depuis le trou, liste filtrée « Fits 1 × 1 » ; groupes =
  questions métier du catalogue (`CATALOG_GROUPS`), lignes question + nom court + ligne de donnée + vignette du format,
  badge « On board » ; détail avec la vraie card du buyer, carrousel (flèches, pagination 14 points, « Recommended »),
  puces des 14 formats, emphase (radio None / Subtle / Strong) ; pose dans le trou, anneau qui s'efface en 700 ms, la
  galerie revient à la liste ; glisser depuis la galerie (P2) avec place fantôme « Drop here, position 3 of 18 ».
- **4** : poignée 24 x 24, place fantôme accrochée à 2 x 2, étiquette du format (Tooltip inversé) ; relâché : Payments
  2 x 2, News descend d'une rangée, Risk figures et Limit review suivent, Notes passe en fin de board, l'espace libre de
  fin est une place « Add a card here » (5 x 2) : le board reste un rectangle en édition.
- **5** : titre souligné au survol ; drawer avec valeur clé, Download CSV, Open full page, tableau Period / Exposure /
  Share of limit (8 périodes, cohérent avec `EXPOSURE_TREND` et « +232 000 since May 24 »), source et date.
- **6** : squelettes à la taille finale, titres gardés, deux cards déjà chargées ; « Data as of 20 Nov 2026, 09:42 »
  dans la barre ; Payments en erreur (Functional Notice + Retry), Financials « No financial statements received as of
  20 Nov 2026 » + lien, Limit left « Outdated » + « As of 03 Nov 2026 », Overdues = vide « rien à signaler » déjà daté.
- **7** : Sanctions (Problem, fond plein rouge) et Limit review (Warning, fond pâle) sont les deux fonds automatiques,
  chacun avec sa ligne de raison (« Auto: open hit since 28 Oct », « Auto: review due within 30 days ») ; Overdues
  « On track » garde son libellé sans fond (pas de vert) ; Grade Strong et Exposure Subtle restent l'emphase manuelle ;
  7.2 menu Auto coché, « Hide for this buyer » en survol ; 7.3 fond retiré, Warning et raison gardés, « Background
  hidden by you, 20 Nov » + « Show again ».

## Composants

Librairies (instances) : Header, Side Navigation, Page Header (via le clone du board 1:4), Button, Button Icon, Dropdown,
Dropdown Flyout Menu (sélection unique, coche dans l'emplacement fixe), Flyout Menu (slot) + Flyout Menu Item, Divider,
Drawer (Simple), Modal (Small), Input Text, Radio Card, Radio, Tag (Filter), Badge, Toaster (Action Undo), Functional
Notice, Skeleton Item, Table Header, Table Cell, Link, Tooltip, Icon Functional + glyphes NDBX (Move, Duplicate, Trash
Outline, Plus, Star Outline, Undo, Refresh, Download, Clock Outline, Ellipsis Vertical, Pen, Check, Close, flèches).

Composants locaux (Section `51:3654`, descriptions « Local · ») : `Toolbar size` `51:3659` (Selected False/True, texte
Label), `Card toolbar` `51:3660` (barre flottante V1, mêmes tokens que `.bs-toolbar`), `Edit bar` `51:3705` (textes
Hint et Changes), `Flow arrow` `51:3808` (texte Action), `Add slot` `51:3817` (texte Fit), `Ghost place` `51:3825`
(textes Label, Detail). Base de travail : `Base · Board 1280` `56:8880`, instantané du board `8:8034` pris à 13 h 45 (le
board de 1:4 changeait pendant la passe de finition de l'autre agent) ; tous les écrans des étapes 2 à 7 en sont des
clones, ceux de l'étape 1 sont des clones directs pris quelques minutes plus tôt (même état visible).

Audit : aucun tiret cadratin ; tous les textes créés ont un style Tokens ; toutes les couleurs créées sont reliées aux
variables Semantic, sauf le voile des deux Modal, fourni tel quel par la librairie Layout.

## Propositions (sans token ou à valider)

1. Hauteurs libres de 894, 900 et 1440 px pour certains écrans (voir plus haut).
2. Vignettes de format de la galerie : unité de 8 px et écart de 2 px dans une tuile de 40 px ; points de pagination 6 px.
3. Anneau « card ajoutée » : 4 px autour de la card ; décalages de la card glissée (+32, +28) : illustration du geste.
4. Tiret pointillé `4 / 4` de Add slot et Ghost place (repris du board 1:4) : pas de token.
5. Poignée de redimensionnement : glyphe SVG local (deux traits), aucun glyphe de coin dans NDBX Icons.
6. La grille des formats (2.3) remplace la liste du code (`ds-flyout-menu-item` sélectionnables, 14 lignes, 700 px de
   haut, trop pour l'écran) : à trancher, la grille garde les puces de la barre d'outils.
7. Espace libre en fin de board après un redimensionnement : montré comme place d'ajout en édition ; au Done, proposer de
   le combler ou de compacter (à valider).

## Doutes et écarts

- Pas de ton Negative pour Button en librairie : « Delete board » et « Discard changes » sont en Primary.
- Pas de variante Disabled pour la puce de format locale : le format désactivé avec sa raison est décrit dans les notes,
  pas dessiné.
- La recherche de la galerie est un Input Text sans icône (pas d'Input Search trouvé dans les librairies).
- « .Item » du Dropdown Flyout Menu n'est pas publié : la liste des formats n'a pas pu être montée avec ses items.
- Le board de référence porte maintenant des emphases (Strong, Subtle, Positive, Negative strong, Warning) posées par
  l'autre agent ; en 7.x, Overdues est ramené à un fond neutre pour respecter « au plus deux fonds auto, pas de vert ».
  Sur les autres étapes, Overdues garde le fond vert pâle de la page 1:4 : à aligner si le compromis s'applique partout.
- Les flèches de parcours sont des instances locales (pas de connecteurs en mode Design).
