# Lot 2 + partie sûre du lot 3 : librairie Action (`xCeEJPn6fliEshuE9fnrqs`), 2026-11-17

Brief suivi : `docs/figma/_lot2-brief.md`. Écritures `use_figma` dans le seul fichier Action. Aucune publication, aucun commit,
aucune collection, aucun mode ni aucune variable créés (variables Semantic importées par clé depuis Tokens uniquement).

## Fait

### Button (44:558)
- **Hug** sur les 6 variantes `State=Default, Type=Primary` qui étaient en largeur fixe 95 px : 44:559, 309:1057, 750:1825,
  750:2149, 4067:1100, 4067:1110. Largeur obtenue : **96 px** (1 px de plus, la largeur naturelle du libellé, identique aux
  autres variantes Hug). Les variantes `Loading` restent en largeur fixe (voulu : la largeur est conservée pendant le chargement).
- **Booléen `Focus`** (`Focus#4129:0`, défaut false = rendu actuel) relié à `visible` du calque `Border Focus` des 96 variantes.
- **Plain Reversed** : paddings gauche / droite 16 liés à `qrn:foundation/size/s` reliés à `Measurement/Spacing/M` (16), 10 variantes
  (20 liaisons : 44:635, 309:2100, 44:666, 750:862, 309:2107, 750:864, 44:701, 309:2115, 44:737, 309:2124).
- Lot 3 sûr (verdict Button du relevé lot 1) : rayon 4 lié à `Border/Radius/S` sur les 160 racines ; trait 1 lié à `Border/Size/S`
  sur les 80 racines à bord ; gap 8 de `.Content` (168:1274, 3 variantes) lié à `Measurement/Spacing/S`.
- Contrôle par script : aucune autre dimension de variante n'a bougé (seules les 6 variantes passées en Hug, 95 vers 96).

### Foundation en direct et anciens styles de couleur vers Semantic (même valeur)
- Tab (57:231) : calque `Active` (57:263, 617:656, 617:900), `foundation/color/action/blue/700` #003781 vers
  `Color/Static/Background/Brand` #003781.
- Tile (615:84) : `Sub label` (615:90, 615:96, 615:102, 615:108), `foundation/color/action/blue/450` #008ed6 vers
  `Color/Interactive/Text/Medium/Active` #008ed6 ; fond Hover 615:115, style `Greyscale/050` #ececec vers
  `Color/Interactive/Background/Light/Alt/Hover` #ececec. Dimensions inchangées.
- Tag (102:558 et `.Options` 102:347, 102:494, 102:537) : 10 fonds `Chip` style `Secondary/Soft/Blue 150` #f1f9fa vers
  `Color/Interactive/Background/Light/Default` ; 2 `Label` style `Primary/Action/450` #008ed6 vers `Color/Interactive/Text/Medium/Active`.

### Auto-imports de la librairie elle-même vers les maîtres locaux
- Pagination `Style=Load More` : instance 53:2996 (copie publiée de Button Load More) échangée vers le maître local 53:8446.
  Libellé conservé. Largeur 157 vers 156 (le maître local fait 156, la copie publiée 157).
- Keyboard Map (951:150) : 3 instances distantes de Tag (951:155, 951:181, 951:190) échangées vers le Tag local 102:558,
  `Type=Select`. Libellés conservés, tailles inchangées, Keyboard Map toujours 900 x 104.

### Button Load More (53:8445) : cadre détaché vers instance de Button
- Les 5 cadres `Button` détachés supprimés (53:8447, 53:8450, 53:8453, 53:8456, 53:8459) et remplacés par des instances de Button
  `Type=Secondary, Tone=Accent` (4133:270, 4133:285, 4133:300, 4133:315, 4133:323), `.Content Icon=None`, libellé
  « Load more results », pleine largeur sur les variantes Loading (comme avant).
- **Changement visible, voulu par la demande** : le rendu suit maintenant le code (`ds-button` secondary accent) : bord 1 px noir
  au lieu de 2 px bleu, états Hover / Active / Loading de Button. Tailles : 156 x 32 (inchangé) ; Loading 157 x 32 (`Loading Ends`
  faisait 157 x 32,28).
- Le style de trait `Primary/Action/500` et le trait 2 brut disparaissent avec les cadres.

### Swap de l'ancien Link (171:3074, `b9493d2f…`) vers Link 688:4202 dans les maîtres
Fait AVANT le message STOP du coordinateur. Pas défait (ancien Link plus importable). Maîtres touchés et libellés :

| Maître | Instances échangées | Libellés (texte du calque `Label`) | Réglages posés |
|---|---|---|---|
| Breadcrumb 298:5526 | 7 : 298:5479 à 298:5485 | Home, Crumb (x5), Current page | Tone Neutral vers Accent ; Icon=Right + glyphe Chevron-Small Right sur les 6 premiers, Icon=None sur Current page ; Weight Regular (6) / Semi-Bold (1) |
| Pagination `.Options` 53:2954 | 17 : 196:1790, 196:1791, 53:2960 à 53:2968, 595:5050, 595:5049, 53:2974, 53:2975, 53:2981, 53:2982 | First, Back, 1, 2, ..., 15, 16, 17, ..., 20, 21, Next, Last (Classic) ; First, Back, Next, Last (Infinite, First et Last masqués) | Icon=None sur les numéros ; Icon=Left (First, Back) et Right (Next, Last) avec les glyphes Chevron-Double / Chevron-Small d'origine ; largeur fixe 24 et centrage conservés ; « 16 » Tone Neutral vers Accent |
| `.Options Select (Legacy)` 53:2983 | 5 : 196:1946, 196:1947, 53:2990, 595:5040, 595:5041 | First (masqué), Back (icône seule), 16, First (masqué), Back (icône seule) | Icon=Left + glyphe d'origine pour les icônes seules, libellé masqué |

- Dans les maîtres, positions et tailles des libellés identiques avant / après (comparaison par script ; Pagination comparée à sa
  copie publiée : 13 + 5 + 1 textes identiques, tailles 650 x 24 et 215 x 24 identiques ; Breadcrumb 514 x 24 identique).
- **Écart au brief** : `Icon=None` n'a pas été posé partout. L'ancien Link affichait des chevrons (crumbs, First / Back / Next / Last) :
  Icon=None les aurait effacés (vérifié : Pagination perdait 80 px).
- **Risque côté consommateurs (constat Feedback / Snackbar)** : dans l'ancien Link, le texte est dans `.Specs > Label` ; dans le
  nouveau, `Label` est enfant direct. Les libellés surchargés DANS LES FICHIERS CONSOMMATEURS sur ces instances risquent de
  revenir aux valeurs du maître (Home / Crumb / Current page, numéros de page) à la mise à jour de librairie. Relevé lot 1 :
  Breadcrumb cascade CS 7, Pagination via `.Options` 104 instances dans les librairies. À vérifier avant publication de Breadcrumb
  et de Pagination (ou publier et re-saisir).

### Versionning (gabarit cloné de Button 230:2229)
Créé à gauche (x 160), le reste de la section décalé de 554 px, section élargie à 6594 (4634 pour Crumb, sans cadre Component) :

| Section | Nouveau cadre | Version / statut (components.json) |
|---|---|---|
| Crumb (Breadcrumb 4043:5336) | 4134:485 | v1.0.0 Ready |
| Flyout Menu Item (4041:3161) | 4134:1027 | v1.0.0 Ready |
| Stepper (4044:1347) | 4134:1216 | v1.0.0 Ready |
| Keycap (4042:3206) | 4134:2310 | v0.2.0 Draft |
| Shortcut Keys (4043:965) | 4134:2356 | v0.2.0 Draft |
| Shortcut Row (4043:3278) | 4134:2389 | v0.2.0 Draft |
| Keyboard Map (4043:3617) | 4134:2422 | v0.2.0 Draft |
| Flag (4043:4202) | 4134:2455 | v1.0.0 In review |

Les 15 Versionning existants disaient déjà v1.0.0 Ready, conforme au JSON (aucun désaccord WIP / ready relevé).

### Liens de documentation (`documentationLinks`, ZeroHeight `p/<id6>`)
44 maîtres : Button, `.Content`, [Deprecated] Button (20fe33) ; Button Icon, `.Icon Functional` (64532a) ; Visual Button (828964) ;
Breadcrumb (80837a) ; Crumb (0405bc) ; Button Load More (72f9cd) ; Button Range (948da2) ; Button Split (61a7c2) ; Tag et ses 3
`.Options` (4114ba) ; Chip (030ec1) ; Flyout Menu, Flyout Legacy 1:20, `.Item` 1:56 (89e8ce) ; Flyout Menu Item (380978) ; Link,
`.Specs` 171:3065, [DEPRECATED] Link, `.Specs` 77:260, Link Legacy 689:4239 (52632d) ; Pagination, `.Options`, `.Options Select
(Legacy)` (4590c9) ; Segmented Control Item, `.Content` (374036) ; Tab, `.Options` (99e610) ; Tile (510534) ; Stepper, `.Stepper
Step` (825623) ; Keycap (1032c3) ; Shortcut Keys (49b237) ; Shortcut Row (164dda) ; Keyboard Map (91c535) ; Flag (756efd).
Les atomes privés et les sets legacy pointent vers la page de leur composant parent ou de remplacement.

### Descriptions ajoutées (manquantes)
Tag `.Options` 102:347, 102:494, 102:537 ; Tab `.Options` 160:131 ; Segmented `.Content` 302:1938 ; Pagination `.Options` 53:2954 ;
`.Specs` 171:3065 et 77:260 ; Flyout `.Item` 1:56 ; « Deprecated, use … » sur [Deprecated] Button 44:743, [DEPRECATED] Link 77:315,
Flyout Menu Legacy 1:20.

### Renommages
- Sets : `Tiles` vers `Tile` (615:84) ; `Flyout Item` vers `Flyout Menu Item` (507:996).
- 23 cadres `_Design system header` vers `Component` (230:2132, 235:1151, 296:4153, 298:4383, 53:8308, 720:472, 96:1337, 230:1756,
  456:153, 507:1018, 235:2154, 4085:682, 235:3074, 53:8170, 595:5302, 57:550, 615:158, 4080:378, 4087:1198, 4087:1341, 4087:1471,
  4087:1601, 4087:1731).
- Environ 730 calques `Frame n` / `Group n` / `Rectangle n` / `Text` renommés d'après leur contenu (`Changelog row`, `Version row`,
  `Status stack`, `Component canvas`, `Legend - …`, `Background panel`…), hors instances. Sur la page Button, une première passe
  trop large a aussi renommé quelques calques du doc kit (légendes d'anatomie, ex. « Container - Clickable surface… » devenu
  `Legend - Container`) ; noms corrigés, ids inchangés.
- `.Stepper Step` : les 14 textes `Text` deviennent `Label`. Cadre `Frame 1` de l'exploration (312:1333) : `Stepper exploration`.
- Page `   ↪ Stepper 🔴` renommée `Stepper` et sortie de la zone WIP (placée après Tile), le set étant publié et `ready`.

## Contrôles
- Instances cassées : 0 (pages Utility 483, Breadcrumb 172, Flyout Menu 239, Stepper 70, Pagination 255, Button Load More 56).
- Sections : aucun chevauchement, rien ne dépasse de sa section, 160 px entre cadres (Utility, Breadcrumb, Flyout Menu, Stepper).
- Dimensions des variantes comparées avant / après par script pour Button, Tile, Pagination, Breadcrumb, Keyboard Map, Load More.

## Suppressions (nodeId + nom)
- 53:8447 `Button` (cadre détaché, Load More State=Default)
- 53:8450 `Button` (Hover)
- 53:8453 `Button` (Active)
- 53:8456 `Button` (Loading Starts)
- 53:8459 `Button` (Loading Ends)

Aucune autre suppression : pas de section « To review » dans Action, aucun doublon ni orphelin signalé.

## Non fait, laissé (raison)
- **Tag, 36 cadres `Chip` détachés** (102:571, 101:30, 102:431, 102:530 et suivants) : le relevé lot 1 ne les juge pas sûrs (aucun
  verdict), Tag très surchargé chez les consommateurs. Listé, non recomposé.
- **Liaisons brutes hors Button** (lot 3, pas de verdict « sûr » au lot 1) : Button Icon (rayon 4, trait 1, trait des Primary lié
  à des tokens de fond), Visual Button (trait 1, ombres), Chip (trait 1 ; textes `Value` sans style), Segmented Control (trait 1),
  Tile (trait 1), Flyout Menu Item (`Label` sans style, trait Focus 2), Pagination (`X`, `of` sans style), Tag (textes `Label`,
  trait 1), fonds #ffffff bruts de Shortcut Row et Keyboard Map (`Static/Background/Main/Primary` existe).
- **Sans token de même valeur** (ne pas lier) : `Border Focus` de Button et Button Icon, trait 3 et rayon 9 ; Chip rayon 10000
  (`Border/Radius/Round` vaut 100) ; Tile `Sub Label` style `Secondary/Rich/Grey 500` #5a5360 (aucune Semantic #5a5360) ;
  Tile icône `Greyscale/500` dans l'instance (appartient à l'atome Icon).
- Flyout Menu Legacy 1:20, ancien Link 171:3074 (143 instances dans les cadres de documentation, Cover 4) : migration nécessaire,
  non touchés. [Deprecated] Button et [DEPRECATED] Link : non dépubliés (pas de verdict lot 1), description « Deprecated » posée.
- 34 calques `Vector` de Flag : géométrie des drapeaux, laissés.
- Écarts de code (Visual Button Selected, Button Split Disabled, Chip Type, Flyout Item Selectable / Shortcut, Link Accent vers
  Neutral, Tile icône exposée) : hors lot 2 pour Action.
- `docs/figma/STATUS.md` non mis à jour (laissé au coordinateur) ; README du doc kit et `page-kit.js` citent encore
  `_Design system header` comme nom de cadre (le kit passe par `headerId`, sans effet).
- Deux copies distantes importées pendant les contrôles (Pagination publiée 4132:659, Tag publié) : hors canevas, sans instance.

## À publier (par l'utilisateur)
Button (Hug, Focus, liaisons), Tab, Tile (renommé), Tag, Pagination, Button Load More (changement visible), Keyboard Map,
Breadcrumb (vérifier d'abord les libellés des Breadcrumb et Pagination consommateurs, voir le risque ci-dessus), Flyout Menu Item
(renommé), descriptions et liens de doc sur tous les sets publiés, Stepper.
