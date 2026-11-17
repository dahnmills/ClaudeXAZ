# Lot data-display-2 : librairie Data Display (`VpConH5AUGyCqtp8PMqj1i`), 2026-11-16

Composants : Table Row, Table Cell, Table Cell Header, Table Cell Selection, Table Cell Action (page `↳ Data Grid / Table` 8:40), Collapsible Table (page `↳ Collapsible Table` 909:1722). Modèle : Action > Button (4030:979). Kits : `doc-kit.js`, `board-kit.js`, `page-kit.js`. Rien publié, aucun commit, aucun MCP ZeroHeight, aucun token, collection ou mode créé, aucun composant, variante ou propriété créé, renommé ou supprimé. Pages interdites (Action Card, Pie Chart, Cover, Status, Card, Widget Card, Result Card, Policy Result Card, Icon Tile) non touchées. Captures de contrôle hors repo : `C:/Users/JDAHAN/AppData/Local/Temp/dd2/`.

## Correspondance composants code / Figma
| Composant (components.json) | Figma |
|---|---|
| Table Row (`ds-table-row`) | `Table Row` 1514:4330 (gabarit v2 1514:4275, utilisé par Coverbook) et `Table Row` 1514:3369 (posé dans le gabarit v1 39:14279, utilisé par Reject Management, cité par le .md). Deux sets publiés, mêmes propriétés. `Table Header Row` 1514:3452 (gabarit v1). |
| Table Cell (`ds-cell`) | `Table Cell` 1514:2514, atomes `.Table Cell Text` 1514:2198, `.Table Cell Slot` 1514:2193 |
| Table Cell Header (`ds-cell-header`) | `Table Header` 8:4237, `Header Selection` 1514:3515, `Header Flyout` 1514:3590 |
| Table Cell Selection (`ds-cell-selection`) | `Table Selection` 1514:2006 |
| Table Cell Action (`ds-cell-action`) | `Table Flyout` 1514:2000 |
| Collapsible Table (`ds-collapsible-table`) | `Collapsible Table` 1491:4803, `Collapsible Table Cell` 909:2473 et 973:469 (deux sets du même nom) |

## Étape 1 : vérification (tous composants)
- Avant toute liaison, contrôle en lecture des instances dans les maquettes : Coverbook (`NflKzgx17mOn2JPoFaqnjW`, pages Screens et Local components : 212 + 165 instances de Table Row v2 1514:4330, Table Header Row, Table Header, Header Flyout, Table Flyout), Reject Management (`zUzOSE77EjbShM9u7yLthB`, Screens et Local components : 3922 + 603 instances, dont Table Row 1514:3369, Table Cell, .Table Cell Text, Table Selection) et Search (`LBLqJmlPqXmx9qksCyYGPb` : aucune instance). Aucun override sur padding, gap, épaisseur de trait, opacité, rayon, fill ni propriété de texte : une liaison de même valeur ne peut écraser aucun override. Non contrôlés : Buyer Summary, Underwriting, Exposure.
- Signature de géométrie (positions absolues, tailles, opacité, paddings, gap, 4 rayons, traits, fills, segments de texte) par racine et sur ses instances du fichier, avant/après : identique pour les 14 racines.
- Captures `get_screenshot` des gabarits 1514:4275, 39:14279 et 909:18358 avant/après : md5 identiques (`8b2e577c…`, `a35ddb62…`, `dd96d9e9…`).
- Descriptions posées (une phrase d'usage tirée des .md) sur 1514:4330, 1514:3369, 1514:3452, 1514:2514, 1514:2193, 1514:2198, 8:4237, 1514:3515, 1514:3590, 1514:2006, 1514:2000, 1491:4803, 909:2473, 973:469.

## Disposition des pages
- Page `↳ Data Grid / Table` (8:40) : sections empilées à x 17000, 400 px d'écart (Table Row, Table Row - To review, Table Cell, Table Cell - To review, Table Cell Header, Table Cell Selection, Table Cell Action). Un seul gabarit `_Design system header` v2 (1514:4275) porte tous les composants v2 : il est en 01 de la section Table Row. Les sections Table Cell, Cell Header, Cell Selection et Cell Action n'ont pas de gabarit propre (règle : composant laissé en place, 02 et 03 normalisés). Signalé.
- Restent en place hors section (ils contiennent des COMPONENT, jamais en To review) : gabarit v1 `_Design system header` 39:14279 (contient le set publié `Table Row` 1514:3369, `Table Header Row` 1514:3452 et le tableau v1 : `Cell`, `☠️ Table Line`, `.Cell Type`, `.Line Data`…) et le set non publié `.Content Type` 74:4618 posé seul sur la page. `Checklist` 39:15278 laissé en place (gabarit de suivi, pas un brouillon).
- `lost`, `miss` et `overlaps` vides pour les 6 normalisations ; aucun chevauchement sur les deux pages au contrôle final.

## Table Row
- Section **2163:24422** (7189 x 4460). Documentation **2163:24423**, Do/Don't **2163:24494**. Header 01 : 1514:4275 (restylé, description remplie, Tech passé de « Not started » à « In code », version laissée à 2.0.0). Versionning 39:14360 (gabarit vide).
- Étape 1 (sets 1514:4330 et 1514:3369, `Table Header Row` 1514:3452) : posées : trait bas 1 vers `Border/Size/S` (4 variantes x 2 sets), opacité 0,4 de Disabled vers `Measurement/Opacity/Disabled` (2) ; Header Row : trait haut 1 vers `Border/Size/S`, trait bas 2 vers `Border/Size/M`. Couleurs déjà en Semantic. Différé : rien.
- Frames do/dont (560 x 200 : un tableau ne tient pas en 360) :

| Règle (texte exact, `table.md`, Do / Don't) | Frame | nodeId |
|---|---|---|
| Do : Keep one action menu per row at the end. | do · table-row · one action menu at the end | 2155:24633 |
| Don't : Put several icon buttons in a row. | dont · table-row · several icon buttons in a row | 2155:24792 |

- Vraies instances : Table Header Row, Table Row (Selection False), Table Header, Table Cell ; Button Icon (librairie Action, importé par clé) avec glyphes Edit Pen, Check, Move échangés dans le `🔗 Icon`. Les trois Button Icon sont regroupés dans un cadre auto-layout neutre (`Icon buttons`, sans fond) posé dans le slot de `.Table Cell Slot`, le slot d'instance refusant le passage en horizontal.
- Text only : aucune. Pas de frame anatomy (anatomie dans Documentation, sur une rangée remplie temporaire supprimée ensuite).
- To review : section **2163:24539** : 2e gabarit `_Design system header` « Documentation » 39:14317 (0 COMPONENT).

## Table Cell
- Section **2163:24557** (4080 x 3491). Documentation **2163:24558**, Do/Don't **2163:24629**. Pas de gabarit 01 ni de Versionning propres (signalé).
- Étape 1 (`Table Cell` 1514:2514, `.Table Cell Text` 1514:2198, `.Table Cell Slot` 1514:2193) : posées : padding 8 vers `Spacing/S` (Slot, 4 côtés) ; padding haut et bas 16 vers `Spacing/M`, gauche 8 vers `Spacing/S` (Text, 2 variantes) ; texte (4) : taille `Size/L`, interligne `Line Height/L`, interlettrage `Letter Spacing/None`, graisse `Bold` (1) et `Regular` (3), famille `Font/Family`. Différé : padding droit 20 (aucun Semantic à 20).

| Règle (texte exact, `table.md`) | Frame | nodeId |
|---|---|---|
| Do : Use cells of type Slot for Badge or Grade. | do · table-cell · slot cell for a badge | 2155:25351 |
| Don't : Restyle a text cell into a pill. | dont · table-cell · text cell styled as a pill | 2155:25524 |

- Do : Badge (librairie Feedback, Success « Active », Warning « Pending », icône masquée par `.Content Properties > Icon`) dans des cellules Slot. Don't : cellule Text dont le cadre `Content` reçoit en override un fond `Static/Background/Functional/Subtle/Positive`, un rayon `Border/Radius/Round` et un texte `Static/Text/Main/Functional/Positive` (instance non détachée).
- To review : section **2163:24674** : instance orpheline `Table Cell` 74:7714 (composant maître 74:4744 supprimé, posée seule sur la page).
- Troncature : le .md n'en dit rien ; le code tronque (`text-overflow: ellipsis`, `nowrap`) sans infobulle. Écart noté dans Notes (règle produit « colonne tronquée avec infobulle » à écrire dans `table.md`), aucune règle inventée dans la planche.

## Table Cell Header
- Section **2163:24683** (4080 x 4072). Documentation **2163:24684**, Do/Don't **2163:24755**. Pas de gabarit propre (signalé).
- Étape 1 (`Table Header` 8:4237, `Header Selection` 1514:3515, `Header Flyout` 1514:3590) : posées : padding 2 vers `Spacing/XXS` et 8 vers `Spacing/S` (16 variantes), gap 8 vers `Spacing/S` (12) ; opacité 0,4 vers `Opacity/Disabled` (7) ; texte Sub Title (16) : taille `Size/L`, interligne 20 vers `Line Height/M`, graisse `SemiBold`, interlettrage `None`, famille ; couleur Foundation directe `foundation/color/grey/500` (#414141) remplacée par `Color/Static/Text/Main/Secondary` (même valeur, 8). Différé : couleur Foundation `foundation/color/action/blue/450` (#008ED6) du Sub Title des colonnes triées (8) : aucun Semantic de texte à cette valeur (seuls un trait de focus et un fond, rôles différents). Rayons 4 de Header Flyout : portés par l'instance Button Icon, non touchés.

| Règle (texte exact, `table.md`) | Frame | nodeId |
|---|---|---|
| Do : Sort only columns where order means something. | do · table-cell-header · sort where order means something | 2155:25020 |
| Don't : Make every column sortable by default. | dont · table-cell-header · every column sortable | 2155:25182 |

## Table Cell Selection
- Section **2163:24808** (2120 x 3395). Documentation **2163:24809**. Pas de Do/Don't : le .md n'a aucune règle propre à la sélection (signalé). Pas de gabarit propre.
- Étape 1 (`Table Selection` 1514:2006) : rien en dur hors instances imbriquées (rayons de Checkbox, Toggle, Button Icon) ; description seule.

## Table Cell Action
- Section **2163:24888** (2120 x 3255). Documentation **2163:24889**. Pas de Do/Don't : la règle « one action menu per row » est sur Table Row (une frame ne vit que dans une planche). Pas de gabarit propre.
- Étape 1 (`Table Flyout` 1514:2000) : rien en dur hors Button Icon imbriqué ; description seule.

## Collapsible Table (page 909:1722)
- Section **2163:25193** (6635 x 4486). Documentation **2163:25194**, Do/Don't **2163:25265**. Header 01 : 909:18358 (restylé ; fil d'Ariane « Horizontal Card » corrigé en « Collapsible Table », description remplie, Tech « In code »). Pas de Versionning sur la page. Widget `lil todo` 1453:13531 laissé en place.
- Étape 1 (`Collapsible Table` 1491:4803, `Collapsible Table Cell` 909:2473 et 973:469) : posées : padding gauche et droit 8 et gap 8 vers `Spacing/S`, gap 4 vers `Spacing/XS`, texte Category (2) : taille, interligne, interlettrage, `Bold`, famille ; cellules : padding haut 8, gaps 8 et paddings 8 vers `Spacing/S`, gap 4 vers `Spacing/XS`, trait 1 du Separator vers `Border/Size/S` (4), textes Label et Value (taille, interligne, interlettrage, Bold ou Regular, famille). Différé : padding vertical 12 de Category (aucun Semantic à 12).

| Règle (texte exact, `collapsible-table.md`) | Frame | nodeId |
|---|---|---|
| Do : Open the most relevant category by default. | do · collapsible-table · most relevant category open (560 x 512) | 2155:27258 |
| Don't : Open every category on load. | dont · collapsible-table · every category open (560 x 512) | 2155:27365 |
| Do : Keep each category self-contained, with its own header row. | do · collapsible-table · own header row per category (560 x 366) | 2155:27583 |
| Don't : Split one record across categories. | dont · collapsible-table · record split across categories (560 x 366) | 2155:27723 |

- Fond des frames `Static/Background/Main/Primary` (la barre de catégorie est elle-même en Main/Secondary, invisible sur le fond imposé ; même exception que Skeleton Item). Lignes : rangées auto-layout neutres de vraies instances `Collapsible Table Cell` (Show Tooltip False), icône de tête masquée en override.
- To review : section **2163:25314** : 2e gabarit `_Design system header` « Demo » 909:18634 (0 COMPONENT).

## Contrôle visuel (2 passes)
- Passe 1 (frames et docs avant normalisation) : colonnes d'en-tête coupées (cadre `Wrapper` du Header Row fixé à 1455, passé en FILL) ; icônes des badges masquées, badges alignés à gauche ; trois Button Icon empilés (regroupés en rangée) ; tuiles d'états de Table Cell Header plus larges que leur colonne (instances réduites à 0,85, anneau recalé) ; repères d'anatomie 2 et 3 de Table Cell et 2 de Table Cell Action recalés sur leur cible ; barre de catégorie invisible sur fond gris (fonds passés en Main/Primary dans l'anatomie, les vignettes Open et les 4 frames).
- Passe 2 (sections finales) : descriptions Hero sur une ligne, textes non coupés, paires équilibrées, gabarits 01 remplis. Restent visibles et acceptés : repères Border Top / Border Bottom de Table Cell Header qui visent des bordures quasi invisibles à l'échelle ; vignettes Header Selection vides (le composant Figma est vide) ; infobulle « 12 months - DUNDPLUS / PUB » de l'atome Tooltip qui déborde à gauche du gabarit 909:18358 (existant, non modifié).

## Écarts Figma / code (dans les Notes des docs, non corrigés)
- Table Row : deux sets publiés homonymes (1514:4330 Coverbook, 1514:3369 Reject Management et .md) ; couleurs de rangée Interactive/Background/Muted/Alt/* (Figma) contre Static/Background/Main/* (code) ; bordure basse du header Border/Main/Primary 2 px contre Background/Accent/Primary ; focus et teinte « new » en code seulement ; version 2.0.0 (gabarit) contre 1.0.0 (components.json).
- Table Cell : padding droit 20 contre 24 ; texte Static/Text/Main/Primary contre Interactive/Text/Strong/Alt/Default (même gris) ; New True par défaut contre emphasized false ; troncature sans infobulle.
- Table Cell Header : Sub Title bleu Foundation non lié, Tertiary en code ; Header Selection sans case « tout sélectionner » ; Disabled en Figma seulement ; paddings 2 et 8 contre 0, 8 et 24.
- Table Cell Selection : poignée Button Icon bleue contre poignée grise ; disabled non dessiné ; défaut drag contre check.
- Table Cell Action : ni propriété ni menu dans Figma ; taille S en code seulement.
- Collapsible Table : padding 12 contre 8 et 16 ; Bold contre SemiBold ; rayon 0 contre Radius/S ; états en code seulement ; icône de tête toujours dessinée ; contraste de la catégorie sous 4,5:1 ; deux sets nommés `Collapsible Table Cell`.

## Points ouverts
- Fusion des deux sets `Table Row` et sort du gabarit v1 39:14279 (il porte encore des composants publiés et utilisés) : décision utilisateur.
- Gabarits 01 dédiés pour Table Cell, Cell Header, Cell Selection et Cell Action si l'on veut une section complète par composant.
- Règles Do/Don't à écrire pour Table Cell Selection et Table Cell Action, et règle de troncature avec infobulle à ajouter dans `table.md`.
- Dans l'appel Collapsible, `board-kit.js` a été collé sans deux utilitaires inutilisés (SP, MK) : comportement identique.
