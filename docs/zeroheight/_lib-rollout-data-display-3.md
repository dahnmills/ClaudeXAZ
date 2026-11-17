# Lib rollout, lot data-display-3 : librairie Data Display (`VpConH5AUGyCqtp8PMqj1i`)

Date : 2026-11-16. Modèle : Action > Button (4030:979). Kits : doc-kit.js, board-kit.js, page-kit.js (non modifiés).
Rien publié, aucun commit, pas de MCP ZeroHeight. Aucun composant, variante, propriété, token, collection ni mode créé, renommé ou supprimé.

## Périmètre et pages (inventaire Figma)

| Composant du lot | Page Figma | Composant Figma | .md |
|---|---|---|---|
| Page Header | ↳ Topbox (224:2) | COMPONENT `Page Header` 1709:15404 | layout/page-header.md |
| Topbox | ↳ Topbox (224:2) | COMPONENT `.Topbox` 1704:15463 (+ set `.Topbox Content` 1704:15147) | data-display/topbox.md |
| Breadcrumbs - Topbox | ↳ Topbox (224:2) | COMPONENT 1709:14760 (+ `.Topbox Breadcrumbs` 1704:16742) | aucun (Draft, Figma seul) |
| Tabs - Topbox | ↳ Topbox (224:2) | COMPONENT 1709:14841 (+ `.Topbox Tabs` 1704:15827) | aucun (Draft, Figma seul) |
| Identifier | 🆕 Identifier (2007:47) | set `Identifier` 2009:105 | data-display/identifier.md |

- Les quatre composants de la page Topbox sont tous dans UN seul gabarit `_Design system header` (1709:18015) : Page Header en « Components », les autres en « Atoms » (avec `.Page Title` 1709:15118 et `.Topbox Actions` 1709:16085). Le gabarit n'est pas découpé.
- Page Topbox très chargée (explorations, sections `Deprecated`, `Current Version` avec l'ancien set `Topbox` 424:18949, `Section 1`, `Useberry`, `Final - overlay`, `Archives`...) : inventoriée, rien touché hors des objets du lot.

## Étape 1 (liaisons), page Topbox

- Liaisons posées sur les composants maîtres (aucune sur les instances) :
  - `Page Header` 1709:15404 : contour bas 1 vers Border/Size/S.
  - `.Topbox` 1704:15463 : padding 4 vers Spacing/XS, 16 vers Spacing/M.
  - `.Topbox Content` 1704:15147 (2 variantes) : gaps 8 vers Spacing/S (4 cadres) ; texte Label / Buyer #414141 vers Static/Text/Main/Secondary ; 7 séparateurs (épaisseur 1 vers Border/Size/S, #D9D9D9 vers Static/Border/Subtle/Tertiary) ; 2 puces ID (padding et gap 8 vers Spacing/S, rayon 4 vers Radius/S, contour 1 vers Border/Size/S, fond blanc vers Static/Background/Main/Primary, contour vers Static/Border/Subtle/Tertiary) ; cadre Actions (padding 8 vers S, gap 16 vers M, rayon 4 vers Radius/S).
  - `.Page Title` 1709:15118 : padding 24 vers Spacing/L, Label #414141 vers Static/Text/Main/Secondary. `.Topbox Actions` 1709:16085 : gap 16 vers Spacing/M.
  - `Tabs - Topbox` 1709:14841 : padding 24 vers Spacing/L. `.Topbox Tabs` 1704:15827 : padding 16 vers Spacing/M, gap 32 vers Spacing/XL (cadre et slot `Tab`).
  - `Breadcrumbs - Topbox` 1709:14760 : padding 24 vers Spacing/L. `.Topbox Breadcrumbs` 1704:16742 : gap 4 vers Spacing/XS (cadre et slot `Crumb`).
  - Aucune liaison Foundation directe sur les maîtres (celle vue au premier balayage était sur une instance imbriquée).
- Incident corrigé : la liaison des paddings de `.Topbox Tabs` et du gap du slot `Crumb` a effacé deux surcharges d'instance (padding 0 sur l'instance `.Topbox Tabs` 1709:14775 dans Tabs - Topbox, gap 0 sur l'instance de page `.Topbox Breadcrumbs` 1704:16745) : onglets décalés de 16 px. Valeurs d'origine retrouvées par recherche de signature (0 et 0) et remises en surcharge.
- Vérification : signature de géométrie (position, taille, opacité, paddings, gaps, rayons, contours, fills, interlignes) sur 63 racines (9 maîtres + 54 instances, toutes sur cette page) : 0 différence après correction. Captures avant/après de 1709:18015, 1709:18695 et 1745:14265 : identiques octet pour octet (md5).
- Différé : texte ID de `.Topbox Content` (#5B5B5B, Menlo 12/24) : aucun Semantic de couleur #5B5B5B, et la police Menlo n'est pas chargeable par les outils (liaison taille / interligne impossible sans elle). Glyphe # (vecteur, trait 2 #5B5B5B) : même raison. Textes à style de texte (Label, Buyer, titre) : style conservé, seule la couleur liée. Gaps 577 / 582 / 876 / 399 : cadres en SPACE_BETWEEN, pas des valeurs réelles.
- Descriptions posées (vides avant) : Page Header, `.Topbox`, `.Topbox Content`, Breadcrumbs - Topbox, Tabs - Topbox.

## Page Header (page Topbox 224:2)

- Section `Page Header` **2164:18974** : 01 `_Design system header` 1709:18015 (restylé, contient aussi tous les atomes) | Documentation **2164:18975** | Do/Don't **2164:19046**. `lost`, `miss`, `overlaps` vides (hors chevauchements préexistants des explorations : vecteurs 826:*, 1518:*, 1704:163xx sur des Proto Layout, non touchés).
- Pas de Versionning sur la page (signalé, rien créé).
- To review `Page Header - To review` **2164:19099** : 1709:18695 (2e gabarit, anatomie annotée, sans COMPONENT ; le .md l'embarque par son id, inchangé) + ses 7 annotations posées à même la page (1712:20297, 1712:20498, 1712:19867, 1712:19880, 1712:19870, 1712:19874, 1712:20658), déplacées avec le même décalage pour rester sur le gabarit.
- Gabarit 01 : description « Component description » remplacée, Tech « Not started » passé à « In code » (Badge Success).
- Frames do/dont :

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Do : Turn bands off with the booleans. | do · page-header · bands off with booleans | 2155:23991 |
| Don't : Detach the instance to remove a band. | non dessinable (il faudrait une copie détachée, interdite) : carte « No Don't illustrated » | aucun |
| Do : Keep tabs for views of the same object. | do · page-header · tabs for views of the same object | 2155:24100 |
| Don't : Use tabs to reach another object. | dont · page-header · tabs to reach another object | 2155:24249 |
| Do : Put the page actions on the title row. | do · page-header · actions on the title row | 2155:24392 |
| Don't : Scatter page actions inside the content. | dont · page-header · actions scattered in content | 2155:24501 |

- Text only : aucune. Frames 808 px de large : Page Header ne descend pas sous ~760 px sans chevauchement du contenu Topbox.
- Écarts (Notes du 02) : gouttière 24 (Figma) contre 32 (code) ; bande Topbox Tertiary contre main-secondary ; actions Figma 2 Buttons + flyout contre un `actionLabel` en code ; défauts Data Type / drapeaux différents ; `.Page Title` fixe à 1280 dans Page Header (une instance plus étroite exige `.Page Title` en Fill par surcharge, sinon actions coupées : trouvé en dessinant) ; gap 0 entre bandes en Figma contre 16 en code ; wrappers Breadcrumbs / Tabs - Topbox Figma seuls ; ancien statut Tech « Not started ».

## Topbox (page Topbox 224:2)

- Section `Topbox` **2165:19999** (400 px sous Page Header) : Documentation **2165:20000** | Do/Don't **2165:20071**. `lost`, `miss` vides.
- **Signalé** : pas de 01 propre. `.Topbox` et `.Topbox Content` sont dans le gabarit 01 de Page Header (« Atoms ») ; décision utilisateur appliquée (composant laissé en place, 02 et 03 normalisés).
- Frames do/dont :

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Do : Show the topbox through Page Header (`Topbox=true`). | do · topbox · shown through page header | 2155:26279 |
| Don't : Place a free-standing topbox above a custom header. | dont · topbox · free-standing above a custom header | 2155:26388 |
| Do : Keep at most one primary action in the strip. | do · topbox · one action in the strip | 2155:26437 |
| Don't : Add several buttons: secondary actions go to the Page Title actions. | dont · topbox · several buttons in the strip | 2155:26483 |
| Do : Show critical flags only when true. | do · topbox · flags only when true | 2155:26634 |
| Don't : Show a flag as disabled or greyed out. | dont · topbox · flag shown greyed out | 2155:26680 |

- Text only : aucune. Le Don't « several buttons » montre la variante Policy avec ses Button / Button Icon masqués rendus visibles (surcharge, rien détaché) ; le Don't « greyed out » met SRU et Sanction à 40 % d'opacité. Le « custom header » est du texte (variables Semantic). Les backticks de `Topbox=true` sont retirés dans la carte (mise en forme markdown).
- Écarts (Notes du 02) : bande Tertiary contre main-secondary ; padding latéral 16 contre 32 ; texte ID non lié (voir différé) ; défauts différents ; pastille de grade redessinée et `<button>` natif en code (règle de composition) ; `actionType` chevron et `expanded` en code seulement ; boutons cachés dans la variante Policy.

## Breadcrumbs - Topbox (page Topbox 224:2)

- Section `Breadcrumbs - Topbox` **2165:20132** : Documentation **2165:20133** seule. Pas de 01 (composant dans le 01 de Page Header), pas de .md donc ni règle ni 03.
- Statut affiché : Design Draft, Tech « Missing (Figma only) », ZeroHeight None, version 0.1.0 (components.json). Liens : aucun composant Angular, aucune story, aucune page. La doc dit qu'aucun comportement code n'existe ; en code la rangée est le slot `breadcrumbs` de `ds-page-header` rempli par `ds-breadcrumbs`.

## Tabs - Topbox (page Topbox 224:2)

- Section `Tabs - Topbox` **2165:20212** : Documentation **2165:20213** seule. Même situation que Breadcrumbs - Topbox (Draft, Figma seul, pas de .md, pas de 03).
- Écart noté : `.Topbox Tabs` porte un padding 16, ramené à 0 par surcharge dans Tabs - Topbox.

## Identifier (page 🆕 Identifier 2007:47)

- Section `Identifier` **2166:20025** : Versionning 2007:256 | 01 `_Design system header` 2007:48 (restylé) | Documentation **2166:20026** | Do/Don't **2166:20097**. `lost`, `miss`, `overlaps` vides.
- To review `Identifier - To review` **2166:20150** : 2007:276 (2e gabarit « Documentation », ancien Do / Dont avec 2 instances d'Identifier, sans COMPONENT).
- **Signalé** : le COMPONENT `🆕 Hash` 2009:59 était posé à même la page sous le gabarit 01 ; il ne peut pas aller en To review : déplacé à gauche de la section, sans autre changement.
- Liaisons : contour 2 du cadre `Border Focus` vers Border/Size/M (2 variantes, 8 côtés). Le reste était déjà lié au Semantic. Signature identique (set + 2 instances), captures 2007:48 et 2007:276 identiques. Différé : aucun.
- Description du set : remplacée par une phrase d'usage (l'ancienne commençait par « New · 2026-11 · »).
- Frames do/dont :

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Do : place one identifier next to the name it identifies (for example "137381425" after the company name). | do · identifier · next to the name it identifies | 2157:73 |
| Don't : wrap a long label or a sentence ("Coface Deutschland GmbH, Mainz") in an Identifier. | dont · identifier · long label in the chip | 2157:89 |
| Do : make it copyable when users paste the value into another tool. | do · identifier · copyable when pasted elsewhere | 2157:101 |
| Don't : make it copyable when the value is never reused. | dont · identifier · copyable value never reused | 2157:114 |
| Do : use Badge for a status next to it. | do · identifier · badge for the status | 2157:127 |
| Don't : use an Identifier to show a status or a category. | dont · identifier · status in an identifier | 2157:166 |

- Text only : aucune. Frames 360 x 140. Badge (Success, Icon=False) instancié depuis le composant publié.
- Écarts (Notes du 02) : interligne 16 (Figma) contre 24 (code) ; icône visible par défaut en Figma, absente en code ; pas de visuel « static » propre ; glyphe Hash local ; état « copied » (snackbar) code seul ; librairie publiée encore à 4 variantes (components.json).

## Décisions et limites

- Pas de frame `anatomy · ...` : l'anatomie est dans chaque 02 (et l'anatomie annotée de l'utilisateur 1709:18695 reste en To review).
- Kits non modifiés sur disque. Seule adaptation à l'appel : `styleHeader` ignore les polices introuvables (Menlo) au chargement, sinon `normalize` échouait sur le texte ID des instances Topbox.
- Rien publié : les écrans des fichiers de fonctionnalités ne bougent qu'à la publication, et leur rendu ne changera pas (valeurs liées identiques, surcharges restaurées).
- Sections de la page Topbox empilées en x 17066 à partir de y -20000 (zone libre au-dessus des explorations) : Page Header, Topbox, Breadcrumbs - Topbox, Tabs - Topbox, puis To review, 400 px d'écart.
- Contrôle visuel : 2 passes par section ; repères d'anatomie de Page Header déplacés dans les zones vides (ils tombaient sur les textes), vignettes d'états d'Identifier réduites (puces coupées par la tuile), vignettes à une colonne passées en Fill, carte Do « badge » passée sur deux lignes (débordement).
