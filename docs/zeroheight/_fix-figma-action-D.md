# Correctifs Figma Action (lot D)

Date : 2026-11-06. Librairie `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`). Changements non cassants uniquement : chaque liaison pointe vers le Semantic existant de meme valeur resolue (assertion dans le script avant chaque liaison, aucun ecart releve).

## 1. Corrige

| Composant | Liaisons | Detail |
|---|---|---|
| Tile (615:84) | 0 liaison, description | Gap et rayon etaient deja lies. Description renseignee. |
| Visual Button (296:4137) | 4 variantes x (4 paddings + gap + 4 rayons + fond) = 40 | Padding 8 -> Spacing/S, gap 4 -> Spacing/XS, rayon 4 -> Border/Radius/S, fond blanc -> Color/Static/Background/Main/Primary (blanc). Description. |
| Flyout Menu v3 (507:833) | 6 | Padding vertical 8 -> Spacing/S, rayon 4 -> Border/Radius/S. Description. |
| Flyout Item (507:996) | 4 variantes x (4 paddings + gap) = 20, plus 1 fond | Padding 8/32 -> Spacing/S et XL, gap 4 -> Spacing/XS. Fond Disabled blanc brut -> `Background/Reversed/Alt/Default` (meme variable que Default, blanc). Description. |

Descriptions courtes en anglais, avec lien code (`ds-tile`, `ds-visual-button`, `ds-flyout-menu`, `ds-flyout-menu-item`).

## 2. Differe

- Opacite Disabled 0,4 (Tile, Visual Button, Flyout Item) : la cle de `Measurement/Opacity/Disabled` n'est pas dans `docs/figma/tokens-keys.md`. Decision/action : relever la cle puis lier (valeur identique 0,4).
- Tile : fill brut `#ECECEC` (Hover non selectionne), `#5A5360` du `Sub label`, blue/450 Foundation direct, variables heritees Greyscale/*, styles `Copy/*` : aucun Semantic de meme valeur identifie avec certitude ; decision hover gris ou bleu requise.
- Visual Button : ombre locale (Default/Hover/Disabled), 160 vs 240 px, plaque d'icone, bordure repos, hover, Selected/Focus, graisse du sous-libelle : decisions visibles.
- Flyout Menu : doublon v2.0.0 (1:20), 7 variantes `# Items`, doublon `.Item` (1:56) : suppression interdite, a decider apres migration. Valeur preferee du Slot non posee.
- Flyout Item : nom de propriete `↳ Icon` (renommage interdit), style de texte du libelle (Body/L/Regular, change potentiellement le rendu), icone Disabled `Static/Icon`, coche de selection, raccourci, fond hover grey-050 vs grey-100.
- Renommage des calques internes (`Frame 4`, `Content` double) : non fait, surcharge possible non verifiee dans les maquettes.
- Proprietes TEXT `Label`, icone exposee, `Focus` : ajouts non faits dans ce lot (a faire avec les decisions ci-dessus).

## 3. Verification

- Valeurs resolues relevees avant liaison : XS=4, S=8, XL=32, Radius/S=4, Background/Main/Primary=#FFFFFF ; chaque liaison a ete conditionnee a l'egalite avec la valeur du noeud (0 SKIP).
- Capture `get_screenshot` apres de Visual Button (795 x 146, 4 variantes intactes). Pas de capture avant prise (tout est parti d'un meme lot), la non-regression repose sur l'egalite des valeurs resolues, pas sur une comparaison de pixels.
- Comptage d'instances avant/apres : non concluant (l'API renvoie 0 pour la page chargee, les instances des autres pages ne sont pas chargees) ; aucun noeud n'a ete cree, supprime ni detache, donc le nombre d'instances n'a pas pu changer.
