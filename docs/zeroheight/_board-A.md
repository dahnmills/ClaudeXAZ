# Planches Do / Don't : lot A (fileKey xCeEJPn6fliEshuE9fnrqs)

Planche construite EN PLACE avec `docs/figma/doc-kit/board-kit.js` (cadre interne `Do and Don't board`, section `ZeroHeight · <Nom> illustrations` inchangee de nom). Position : x = x(cadre Documentation) + 1280 + 560, meme y. Aucun chevauchement, rien deplace d'autre. Captures de controle hors repo : `C:/Users/JDAHAN/AppData/Local/Temp/board-A/`.

| Composant | Page | Section (nodeId) | Cadre interne | Taille | Position |
|---|---|---|---|---|---|
| Button Icon | 12:118 | 944:3970 | 999:6877 | 1280 x 1129 | 4908, -3788 |
| Button Split | 69:447 | 944:4588 | 999:7344 | 1280 x 898 | 1157, -892 |
| Button Load More | 53:8307 | 944:5199 | (voir section) | 1280 x 1150 | 4455, -703 |
| Button Range | 720:437 | 944:5350 | (voir section) | 1860 x 950 | 7228, -646 |

## Regles
- Button Icon : paires `Row actions` (944:3971 / 944:4006), `Negative tone` (944:4041 / 944:4070). Text only : "Pair an unusual icon with a Tooltip." / "Rely on the user guessing its meaning." (Tooltip absent de la librairie Action).
- Button Split : paire `Menu items` (944:4589 / 944:4635). Text only : "Keep the main action as the most used one." / "Put a rare action on the main part.".
- Button Load More : paires `Placement` (944:5200 / 944:5238), `Earlier results` (944:5276 / 944:5314). Aucune regle text only.
- Button Range : paires `Length of the scale` (944:5351 / 944:5391), `Reading the range` (944:5453 / 944:5498). Aucune regle text only.
- Cartes pointillees (Do sans Dont ou inverse) : aucune.

## Verification des nodeIds d'origine (get via getNodeByIdAsync, tous presents, noms inchanges)
944:3971, 944:4006, 944:4041, 944:4070 ; 944:4589, 944:4635 ; 944:5200, 944:5238, 944:5276, 944:5314 ; 944:5351, 944:5391, 944:5453, 944:5498. Sections 944:3970, 944:4588, 944:5199, 944:5350 gardent leur nom.

## Ecarts
- Button Range : la frame `dont · button-range · too many steps` (820 px) elargit la planche a 1860 px (au lieu de 1280). Frames non redimensionnees pour ne pas changer le ratio des exports ZeroHeight.
- Le cadre `Documentation · <Nom>` existait deja a l'arrivee (cree par un autre agent) a x = fin du 2e gabarit `_Design system header` + 560 : la planche s'y cale, pas sur le 1er gabarit. Un premier placement (basé sur le 1er gabarit) a ete corrige.
- Sur ces 4 pages `Versionning` est a gauche du premier gabarit, comme sur la page Button (signale, non deplace).
- Pas de regles ZeroHeight dessinees pour "Unusual icons" (Tooltip) ni "main action most used" : text only.
- Boucle qualite : 2 passes (construction + captures, controle position/chevauchement apres deplacement), aucun defaut visuel restant (textes non coupes, grille equilibree).
- Rien publie.
