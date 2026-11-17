# Planches Do / Don't : Data Entry lot E (fileKey 1wVY9FfjONIX6us9JmIm7U)

Chaque section `ZeroHeight · <Nom> illustrations` (nom inchange) est devenue la planche EN PLACE, via `docs/figma/doc-kit/board-kit.js` (cadre interne `Do and Don't board`). Position : x = 4240 (= 2400 + 1280 + 560), y = 0, meme axe que `Documentation · <Nom>`. Aucun cadre `Versionning` sur ces pages. Rien publie, aucun token cree, `miss` vide partout.

| Composant | Page | Section (planche) | Cadre interne | Taille |
|---|---|---|---|---|
| Search Bar Home | 3098:2 | 3111:438 | 3129:332 | 1820 x 1263 |
| Search Bar Multi | 3102:2 | 3113:877 | 3130:1246 | 1706 x 1880 |
| Tag Filter Chip | 3104:1002 | 3115:562 | 3130:1990 | 1660 x 1266 |
| Grid Selection | 3105:2 | 3116:802 | 3130:2320 | 1660 x 1038 |
| File Upload | 3107:2 | 3117:491 | 3130:2618 | 1500 x 1142 |

## Regles (texte exact ZeroHeight, relu via get-page editor)
Les 20 regles ont une image. Aucune "text only".

- Search Bar Home. "One bar, scoped correctly" : Do 3111:139 + Don't 3111:346. "Labels" : Do 3111:157 (placeholder) et Do 3111:264 (bouton court), chacun avec carte pointillee (pas de Don't).
- Search Bar Multi (colonne unique, Do au-dessus du Don't). "Field order and scope" : Do 3113:613 + Don't 3113:801. "Disabled controls" : Do 3113:694 + pointillee. "Errors" : Do 3113:746 + pointillee.
- Tag Filter Chip. "Chip, field and choice type" : Do 3115:363 + Don't 3115:515. "Search on long lists" : Do 3115:394 + Don't 3115:454.
- Grid Selection. "Layout previews" : Do 3116:568 + Don't 3116:753. "Selection and label" : Do 3116:626 + Don't 3116:675.
- File Upload. "Hint and browse" : Do 3117:354 + Don't 3117:413. "Errors and purpose" : Do 3117:372 + Don't 3117:432.

## Verification des nodeIds d'origine (getNodeByIdAsync, apres build)
Les 20 existent encore, noms inchanges, aucune frame dupliquee ou recreee :
3111:139, 3111:157, 3111:264, 3111:346, 3113:613, 3113:694, 3113:746, 3113:801, 3115:363, 3115:394, 3115:454, 3115:515, 3116:568, 3116:626, 3116:675, 3116:753, 3117:354, 3117:372, 3117:413, 3117:432.

## Ecarts et decisions
- Les ZH n'ont pas de titre h3 par regle (juste "Best practices") : les titres de groupe (`key`) sont choisis ici, et les paires Do / Don't sont appariees par theme (le Don't n'est pas toujours l'oppose exact du Do).
- Search Bar Multi : les frames font 1560 px de large. Ajout au kit d'un mode `stack: true` (Do au-dessus du Don't) pour ne pas porter la planche a plus de 3200 px. Kit mis a jour (board-kit.js v1.1).
- Search Bar Home : frames de 800 px, planche a 1820 px (plus large que les 1280 du modele Button), tailles d'origine gardees pour ne pas changer le ratio des exports ZeroHeight.
- Cartes pointillees (Home x2, Multi x2) : hautes dans les rangees a deux colonnes de Home, car alignees sur la hauteur du Do.
- Essai de faire remplir la hauteur par l'illustration puis la legende : rangees collapsees, annule. Les cartes d'une meme rangee ont des legendes avec du blanc dessous quand l'autre carte est plus haute (Tag Filter Chip, File Upload), accepte.
- Captures de controle dans C:/Users/JDAHAN/AppData/Local/Temp/board-E/ (hors repo), 3 passes pour Home, 2 pour les autres.
