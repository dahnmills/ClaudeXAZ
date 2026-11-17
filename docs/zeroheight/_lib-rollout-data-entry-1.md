# Lib rollout, lot data-entry-1 : librairie Data Entry (`1wVY9FfjONIX6us9JmIm7U`)

Date : 2026-11-16. Modèle : Action > Button (4030:979). Kits : `doc-kit.js`, `board-kit.js`, `page-kit.js` (non modifiés).
Rien publié, aucun commit, aucun token, collection ni mode créé, aucun composant, variante ou propriété créé, renommé ou supprimé.

## Méthode commune

- Liaisons : script de liaison avec signature de géométrie (position absolue, taille, paddings, gap, 4 rayons, fills, strokes) sur tous les nœuds des sets de la page ET sur toutes leurs instances du fichier (`getInstancesAsync`), avant / après. Annulation automatique prévue si une différence apparaît. Capture du bloc Component avant / après comparée par md5.
- Valeurs liées : paddings et gaps non nuls à 2 / 4 / 8 / 16 / 24 / 32 / 48 / 64 (Spacing XXS à 3XL), rayons à 2 / 4 / 8 / 16 / 32 (Radius XS à XL). Les couleurs et les textes étaient déjà liés à des Semantic (aucune liaison Foundation directe trouvée). Les 0 et les épaisseurs de trait ne sont pas liés (comme sur Button). Le COMPONENT_SET lui-même (cadre de présentation, trait violet 9747ff) n'est pas touché.
- Règles Do / Don't : section `## Do / Don't` du .md local, texte exact de chaque phrase (le « Do » / « Don't » initial est gardé). Le .md n'a pas de titre h3 par règle : les titres de groupe (`key`) sont choisis ici.
- En-tête `_Design system header` et `Versionning` : remplis (description du .md, Design Ready, Tech In code, changelog v1.0.0 du 2026-11-16).
- Aucune frame `anatomy` : le canvas Anatomy du cadre Documentation suffit (rien à faire lire à ZeroHeight).

## Input Text (page 2044:3104)

- Section `Input Text` : 3158:6593 (6594 x 4640). Versionning 2193:2142 | 01 header 2045:887 | 02 Documentation 3158:6594 | 03 Do/Don't 3158:6665.
- To review : section `Input Text - To review` 3158:6722, contient le 2e gabarit `_Design system header` 2045:997 (ancien Do/Dont, vérifié sans COMPONENT).
- `lost`, `miss`, `overlaps` vides. Doc kit `miss` vide, board `miss` vide.
- Liaisons posées (53, 0 différence de signature sur 230 nœuds dont 41 instances, capture md5 identique) : padding 8 vers Spacing/S (12), gap 2 vers XXS (6), gap 4 vers XS (7), gap 8 vers S (4), rayons 4 vers Radius/S (24 coins).
- Différé (aucun Semantic de même valeur) : padding vertical 6 du Container (12), gap 10 d'un Container, rayon 6 du cadre `Border Focus`.
- Descriptions posées : Input Text 2045:707, `.Append` 2045:737, `.Input Content` 2045:745 et 2045:759, `.Prepend` 2045:732, `.Selector` 2045:735.

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Visible label, Do : "Do always show a visible label above the field." | do · input-text · visible label | 3156:3030 |
| Visible label, Don't : "Don't rely on the placeholder as the only label." | dont · input-text · placeholder as label | 3156:3043 |
| Field width, Do : "Do size the field to the expected value." | do · input-text · sized to the value | 3156:3056 |
| Field width, Don't : "Don't stretch a 5-digit postal code field to full width." | dont · input-text · postal code full width | 3156:3090 |
| Units and prefixes, Do : "Do use prepend and append for fixed units or prefixes." | do · input-text · prepend and append | 3156:3107 |
| Units and prefixes, Don't : "Don't ask users to type the unit." | dont · input-text · unit typed in the value | 3156:3147 |
| Label on one line, Do : "Do give the label the width it needs." | do · input-text · label on one line | 3156:3164 |
| Label on one line, Don't : "Don't let a label wrap on two lines." | dont · input-text · label on two lines | 3156:3177 |

- Text only : aucune.
- Écarts et décisions :
  - Le Don't « label on two lines » montre volontairement un libellé sur deux lignes (c'est l'objet de la règle). Partout ailleurs les libellés sont en semi-bold, sur une ligne.
  - Anatomy : instance passée de l'échelle 3 à 2 (elle débordait du canvas), repères recalés.
  - Notes du cadre Documentation : Disabled (opacité 40 % en code, couleurs Disabled en Figma) ; Remaining, Dropdown du Prepend et Type de l'Append en Figma seulement ; inputmode, variant inline et errorMessage en code seulement ; deux sets `.Input Content` en double sur la page (2045:745, 2045:759) ; message d'erreur non relié par aria-describedby.
  - Versionning à gauche de l'en-tête, comme sur Button.

## Input Email (page 2222:1276)

- Section `Input Email` : 3160:3661 (6594 x 4511). Versionning 2222:1371 | 01 header 2222:1277 | 02 Documentation 3160:3662 | 03 Do/Don't 3160:3733.
- To review : section `Input Email - To review` 3160:3782, contient le 2e gabarit `_Design system header` 2222:1391 (sans COMPONENT).
- `lost`, `miss`, `overlaps` vides ; doc kit et board `miss` vides.
- Liaisons posées (52 mesures, 0 différence de signature sur 136 nœuds dont 10 instances) : padding 8 vers Spacing/S (12), gaps 2 / 4 / 8 vers XXS (6) / XS (2) / S (4), rayons 4 vers Radius/S (28 coins).
- Couleurs Foundation directes (ancienne collection `foundation/color/...`) remplacées par le Semantic de même valeur (12) : fonds du Container en Default, Hover, Active, Disabled, Error vers `Interactive/Background/Neutral/*` ; traits Default et Read Only vers `Interactive/Border/Medium/Alt/Default`, Hover vers `.../Alt/Hover`, Disabled vers `.../Alt/Disabled` ; `Border Focus` vers `Interactive/Border/Focus` ; texte Filled (2 sets `.Input Content`) vers `Static/Text/Main/Secondary`. Capture md5 du gabarit identique avant / après.
- Différé : trait Active encore lié à Foundation `action/blue/600` (0, 97, 146) ; le seul Semantic de cette valeur est `Interactive/Border/Strong/Hover` (mauvais rôle) et Input Text utilise `Strong/Active` (7, 89, 148), donc un changement de rendu. Trait Error en dur (220, 49, 73), aucun Semantic de cette valeur (`Strong/Negative/Default` = 225, 45, 60). Padding vertical 6, gap 10, rayon 6 de `Border Focus` : pas de Semantic.
- Descriptions posées : Input Email 2222:1310, `.Input Content` 2222:1346 et 2222:1360, `.Append` 2222:1343.

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Validation timing, Do : "Do validate on blur or submit." | do · input-email · no error while typing (état Active, saisie en cours, sans erreur) | 3159:3010 |
| Validation timing, Don't : "Don't show an error while the user is still typing." | dont · input-email · error while typing (état Error sur une saisie partielle) | 3159:3034 |

- Text only : "Do use Input Email for every email value so the right keyboard and validation apply." et "Don't use Input Text for emails." (Input Text et Input Email sont identiques à l'image, la règle ne se dessine pas).
- Écarts : notes du cadre Documentation (bordure Active et Error ci-dessus, icône Append sans équivalent par défaut en code, prepend en code seulement, errorMessage en code seulement, deux sets `.Input Content` en double). Fil d'Ariane de l'en-tête forcé à « Input Email » (le .md le signalait en « Input Text »).

## Input Date (page 2222:1576)

- Section `Input Date` : 3161:5674 (6594 x 4462). Versionning 2222:1671 | 01 header 2222:1577 | 02 Documentation 3161:5675 | 03 Do/Don't 3161:5746.
- To review : section `Input Date - To review` 3161:5799, contient le 2e gabarit `_Design system header` 2222:1691 (sans COMPONENT).
- `lost`, `miss`, `overlaps` vides ; doc kit et board `miss` vides.
- Liaisons posées (48, 0 différence de signature sur 197 nœuds dont 24 instances, capture md5 identique) : padding 8 vers Spacing/S (12), gaps 2 / 4 / 8 vers XXS (6) / XS (2) / S (4), rayons 4 vers Radius/S (24 coins). Couleurs : toutes déjà en Semantic.
- Différé : padding vertical 6 du Container, gap 10, rayon 6 de `Border Focus` (pas de Semantic).
- Descriptions posées : Input Date 2222:1610, `.Input Content` 2222:1646 et 2222:1660, `.Append/Icon` 2222:1643.

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| One field per date, Do : "Do use one Input Date per single date." | do · input-date · one field per date | 3160:8460 |
| One field per date, Don't : "Don't use two Input Date fields for a range (use Date Range)." | dont · input-date · two fields for a range | 3160:8477 |
| Typing a known date, Do : "Do let users type the date." | do · input-date · typed date (état Active, saisie en cours) | 3160:8511 |

- Text only : "Don't force them through the picker for known dates." (le sélecteur est celui du navigateur, absent de Figma). Carte pointillée en face du Do « Typing a known date ».
- Écarts (notes du cadre Documentation) : icône calendrier optionnelle en Figma, toujours affichée en code ; placeholder DD/MM/YYYY en Figma, dd/mm/yyyy en code (ignoré par le champ natif), valeur yyyy-mm-dd ; pas de sélecteur en Figma ; errorMessage en code seulement ; deux sets `.Input Content` en double. Le `.Label` de cette page n'expose que Optional (pas de Remaining, contrairement à Input Text).

## Input Search (page 2610:2131)

- Section `Input Search` : 3165:3928 (6594 x 4560). Versionning 2695:3399 | 01 header 2695:3311 | 02 Documentation 3165:3929 | 03 Do/Don't 3165:4000.
- To review : section `Input Search - To review` 3165:4053, contient le 2e gabarit `_Design system header` 2695:3419 (sans COMPONENT).
- `lost`, `miss`, `overlaps` vides ; doc kit et board `miss` vides.
- Liaisons posées (54, 0 différence de signature sur 168 nœuds dont 12 instances, capture md5 identique) : padding 8 vers Spacing/S (12), gaps 2 / 4 / 8 vers XXS (6) / XS (2) / S (10), rayons 4 vers Radius/S (24 coins). Couleurs : déjà en Semantic.
- Différé : padding vertical 6, gap 10, rayon 6 de `Border Focus` (pas de Semantic).
- Descriptions posées : set 2695:3344 (commence par « Input Search. » puisque le set porte encore le nom « Input Date »), `.Input Content` 2695:3378 et 2695:3390.
- En-tête : la description était celle d'Input Date (« Date input fields allow users... »), remplacée par celle du .md.

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Local filter, Do : "Do filter results as the user types when the list is local." | do · input-search · live filter (360 x 180 : champ actif + 2 résultats en texte lié aux variables) | 3161:8731 |
| Local filter, Don't : "Don't require a Search button for a local filter." | dont · input-search · search button for a local filter (360 x 180, instance Button de la librairie Action, icône retirée via `.Content`) | 3161:8761 |
| Clear button, Do : "Do keep the clear button so users can reset in one click." | do · input-search · clear button | 3161:8801 |

- Text only : "Don't clear the query silently when the list changes." (un effacement silencieux ne se voit pas sur une image fixe). Carte pointillée en face du Do « Clear button ».
- Écarts et décisions :
  - Le COMPONENT_SET de la page s'appelle toujours « Input Date » : non renommé (interdit), signalé dans les notes.
  - Anatomy : instance Active passée en Filled pour montrer le bouton d'effacement, repères 3 à 5 recalés.
  - Notes : icône de recherche à la fin en Figma, au début en code ; bouton d'effacement natif en code (pas `ds-button-icon`) ; errorMessage et `cleared` en code seulement ; nom accessible absent sans libellé ; deux sets `.Input Content` en double.

## Text Area (page 2329:471)

- Section `Text Area` : 3172:517 (6594 x 5360). Versionning 2330:629 | 01 header 2330:531 | 02 Documentation 3172:518 | 03 Do/Don't 3172:589.
- To review : section `Text Area - To review` 3172:642, contient le 2e gabarit `_Design system header` 2330:649 et le brouillon `Frame 32` 2573:244 (annotations de tokens sur 6 instances, flèches ; aucun COMPONENT).
- `lost`, `miss`, `overlaps` vides ; doc kit et board `miss` vides.
- Liaisons posées (45, 0 différence de signature sur 294 nœuds dont 33 instances, capture md5 identique) : padding 8 vers Spacing/S (12), gaps 4 / 2 vers XS (8) / XXS (1), rayons 4 vers Radius/S (24 coins). Couleurs : déjà en Semantic.
- Différé : padding vertical 6 et gap 10 du Container (6 chacun), rayon 6 de `Border Focus`.
- Descriptions posées : Text Area 2330:847, `.Text Area Content` 2330:1059 et 2330:1144, `.Resize Handle` 2329:491.
- En-tête : la description générique (« A text area is a component that allows u... ») remplacée par celle du .md.

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Field height, Do : "Do size the field to the expected text (use rows)." | do · text-area · sized to the text (360 x 200) | 3168:227 |
| Field height, Don't : "Don't use a one-row text area for long comments." | dont · text-area · one row for a long comment (instance ramenée à une rangée de 36 px par redimensionnement de l'instance, Container en FILL) | 3168:248 |
| Character limit, Do : "Do show the limit when there is one." | do · text-area · limit shown (compteur Remaining « 90/500 » + helper Neutral « Up to 500 characters. ») | 3168:269 |

- Text only : "Don't cut the text silently at the limit." Carte pointillée en face du Do « Character limit ».
- Écarts et décisions :
  - Texte de règle : les backticks Markdown de `rows` sont retirés (« (use rows) »), le reste est exact.
  - Anatomy : échelle 1,2 (l'instance fait 515 px), repères recalés (3 vers le bas dans le champ, 4 sur la poignée).
  - Notes : Helper Text à 5 statuts en Figma, seul le message d'erreur en code ; Remaining et Border Focus en Figma seulement ; `rows` en code seulement ; nommage Text Area / ds-textarea / Textarea ; message d'erreur non relié par aria-describedby ; deux sets `.Text Area Content` en double.

## Décisions à prendre (lot data-entry-1)

1. Renommer le COMPONENT_SET « Input Date » de la page Input Search en « Input Search » (non fait : renommage interdit par la consigne).
2. Fusionner les sets `.Input Content` (ou `.Text Area Content`) en double sur chacune des 5 pages.
3. Input Email : aligner le trait Active (Foundation blue 600) et le trait Error (rouge en dur) sur Input Text (`Border/Strong/Active`, `Border/Strong/Negative/Default`) : changement de rendu léger, donc différé.
4. Padding vertical 6, gap 10 et rayon 6 de `Border Focus` récurrents sur les 5 champs : aucun Semantic, à trancher (passer à 4 / 8 ou créer des tokens, hors périmètre).
5. Les libellés de règles du .md commencent par « Do » / « Don't » : à garder tels quels sur ZeroHeight ou à épurer, selon la version publiée.
