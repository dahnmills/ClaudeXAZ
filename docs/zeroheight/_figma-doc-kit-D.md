# Kit de documentation Figma, lot D

Date : 2026-11-06. Fichier `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`). Kit : `docs/figma/doc-kit/doc-kit.js`. Captures de contrôle : `C:/Users/JDAHAN/AppData/Local/Temp/doc-kit-D/` (hors repo). Aucun composant, variante, propriété ni section `ZeroHeight · ... illustrations` modifié. `miss` vide sur les 4 builds.

## Cadres créés (1280 de large, variables Semantic, instances réelles)

| Composant | Page | Cadre | Position | Hauteur |
|---|---|---|---|---|
| Tile | 615:77 | `Documentation · Tile` 977:1884 | (7666, -1504) | 3195 |
| Visual Button | 288:822 | `Documentation · Visual Button` 981:7517 | (5268, -221) | 3065 |
| Flyout Menu | 1:3 | `Documentation · Flyout Menu` 983:1341 | (8191, -2404) | 2649 |
| Flyout Menu Item | 1:3 | `Documentation · Flyout Menu Item` 983:1750 | (10031, -2404) | 3025 |

Tous à 560 px ou plus du dernier élément de leur page (sections illustrations comprises).

## Gabarits remplis (texte, tags, liens, changelog ; version et statuts d'après `components.json`)

| Page | Cadre | nodeId |
|---|---|---|
| Tile | Component header | 615:158 |
| Tile | Documentation header | 615:299 |
| Tile | Versionning | 615:342 |
| Visual Button | Component header | 296:4153 |
| Visual Button | Documentation header | 296:4247 |
| Visual Button | Versionning | 296:4227 |
| Flyout Menu | Component header v3 (Flyout Menu et Flyout Item) | 507:1018 |
| Flyout Menu | Component header v2 (legacy) | 235:2154 |
| Flyout Menu | Documentation header | 235:2290 |
| Flyout Menu | Versionning | 235:2333 |

Corrections de contenu : description copiée de Radio remplacée (Visual Button, deux cadres), "Supernova" remplacé par ZeroHeight, fil d'Ariane "Tab" corrigé en "Flyout Menu", tags Warning/Error des gabarits remplacés par Ready / In code. Textes Do / Dont : légendes seulement (les exemples sont dans les sections `ZeroHeight · ... illustrations`).

## Anciens cadres supprimés (après validation des nouveaux)

`Documentation - Tile` 960:924, `Documentation - Visual Button` 960:5627, `Documentation - Flyout Menu` 961:1831, `Documentation - Flyout Menu Item` 961:2081.

## Décisions à confirmer

- Version : 1.0.0 partout (components.json). Le header Flyout Menu v3 affichait 3.0.0, Tile 2.0.0 : remplacés. Le header legacy v2 (235:2154) affiche "Legacy 2.0.0", tags Legacy et No code.
- Un seul gabarit Documentation et un seul Versionning pour Flyout Menu et Flyout Menu Item : liens du gabarit = Flyout Menu. Liens Item (ZH p/380978, Storybook Internals) présents dans le cadre `Documentation · Flyout Menu Item`.
- Menu : l'ancrage et les états utilisent des instances temporaires de Flyout Menu dont le slot est rempli d'instances de Flyout Item (supprimées ensuite, les clones restent dans le cadre).

## Écarts restants (repris dans les Notes de chaque cadre, jamais cachés)

- Tile : hover/active gris (Figma) contre bleu (code), bordure 1 px, padding 0 contre 8, Sub Label sans input code, pas de focus des deux côtés, styles `Copy/*`, `#5A5360`, blue/450 Foundation, opacité 0,4 non liée, nom du set `Tiles`.
- Visual Button : 160 contre 240 px, padding/gap/rayon (Figma lié à S, XS, Radius S ; code L, M, Radius M), plaque d'icône 48 px absente de Figma, bordure et hover différents, `:active` absent du code, Selected et Focus absents de Figma, `tone` mort, sous-libellé semi-bold contre regular, ombre locale, pas de propriété TEXT ni swap d'icône.
- Flyout Menu : doublon v2.0.0 (1:20) et `.Item` (1:56) conservés, Slot sans valeur préférée (17 px vide dans l'en-tête), titre et séparateur absents du composant, min-width 196 non tokenisé.
- Flyout Menu Item : hover grey-050 contre grey-100, noms de familles de couleurs différents, icône par défaut, coche/raccourci/slot icône code seulement, libellé sans propriété ni style, propriété `    ↳ Icon`, opacité Disabled sur les enfants.
- Pas de variable Figma pour la taille Tile, le min-width du menu, ni l'ombre (style d'effet) : indiqué dans la colonne "Figma variable".

## Corrigé après critique (au moins 2 passes par composant)

- Tile : le logo cloné était tout le cadre fil d'Ariane (texte en double, trop grand) : remplacé par l'instance `Header Q/First slot/Logo`. Fond du canevas d'anatomie identique à la plaque (conteneur invisible) : canevas passé en blanc. Repère du libellé décalé hors du texte. Descriptions du gabarit raccourcies (chevauchement du bloc Status), changelog raccourci (texte coupé dans Versionning).
- Visual Button : repère du libellé remonté pour viser le texte ; libellés de ressources du gabarit mis en HUG et liens en FILL (Storybook coupé en "Story book :" et débordant).
- Flyout Menu Item : survol invisible (plaque grey-050 sur fond grey-050) : états remontés dans une instance de Flyout Menu blanche, focus par la propriété Focus du composant ; repères Icône et Libellé déplacés sur le bord de l'élément.
- Flyout Menu : liens du gabarit alignés à gauche après retour à la ligne.
- Kit : option `anatomy.bg`, instances clonées acceptées (`MK`), notes ajoutées au README.
