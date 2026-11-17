# Planche Do / Don't, lot F (Data Display + Layout)

Construit avec `docs/figma/doc-kit/board-kit.js` (buildBoard), EN PLACE dans chaque section `ZeroHeight · <Nom> illustrations` (nom et nodeId de section inchanges). Regles lues sur les pages ZeroHeight masquees (get-page, format editor, onglet Usage). Rien publie, aucun token cree, tout lie aux variables Semantic. Captures de controle dans `C:/Users/JDAHAN/AppData/Local/Temp/board-F/`.

Position : x = x(cadre Documentation) + 1280 + 560, y = y(cadre Documentation). Ecart de 560 px verifie, aucun chevauchement (les trois planches Overlay sont en colonne, chacune alignee sur son cadre Documentation).

| Composant | Fichier | Section / planche (cadre interne) | Position (x, y) | Taille | Paires | Text only | Placeholder (pointille) |
|---|---|---|---|---|---|---|---|
| Action Card | VpConH5AUGyCqtp8PMqj1i | 2124:64 (2138:165) | 5340, 0 | 1280 x 1633 | Link label (2124:65 / 2124:81) ; Selectable cards (Do 2124:97) | Dont "Put several links or buttons inside one card." | Dont de Selectable cards |
| Pie Chart | VpConH5AUGyCqtp8PMqj1i | 2125:70 (2139:100) | 5340, 0 | 1280 x 1369 | Legend (2125:71 / 2125:89) ; Tooltip (Do 2125:97) | Dont "Animate or blink the parts." | Dont de Tooltip |
| Page Title | bbgSPUChd18EVNGijjoZGn | 4024:3533 (4041:304) | 5240, 0 | 1420 x 1070 | Title (4024:3534 / 4024:3566) ; Action link (4024:3700 / 4024:3723) | aucune | aucun |
| Filter Drawer | bbgSPUChd18EVNGijjoZGn | 4026:627 (4042:3512) | 6540, 0 | 1280 x 1510 | Sections and tabs (4026:628 / 4026:754) ; Footer actions (4026:1101 / 4026:1203) | aucune | aucun |
| Spotlight | bbgSPUChd18EVNGijjoZGn | 4027:967 (4042:3560) | 6540, 4678 | 1740 x 1489 | Results (Do 4027:968) ; Record ID (Do 4027:1062) | Dont "Keep it open after the user selects a row." ; Dont "Break arrows, Enter or Escape." | Dont de Results et de Record ID |
| Shortcuts Panel | bbgSPUChd18EVNGijjoZGn | 4028:1094 (4042:3619) | 6540, 9255 | 2860 x 1670 | Panel content (4028:1095 / 4028:1336) ; Tabs and page (4028:1614 / 4028:1833) | aucune | aucun |

Les titres de rubrique (Link label, Legend, Results...) n'existent pas dans les pages ZeroHeight (les regles sont sous un seul h2 "Best practices") : ils ont ete choisis pour regrouper les paires. Les textes de regles sont les textes exacts de ZeroHeight.

## Verification des nodeIds d'origine (getNodeByIdAsync apres build)
Tous presents, noms inchanges :
- Action Card : 2124:65, 2124:81, 2124:97
- Pie Chart : 2125:71, 2125:89, 2125:97
- Page Title : 4024:3534, 4024:3566, 4024:3700, 4024:3723
- Filter Drawer : 4026:628, 4026:754, 4026:1101, 4026:1203
- Spotlight : 4027:968, 4027:1062
- Shortcuts Panel : 4028:1095, 4028:1336, 4028:1614, 4028:1833
Les 4 sections gardent leur nom exact. Cadres Documentation, composants et gabarits non touches.

## Ecarts et remarques
- Controle qualite : un screenshot par planche (lu et critique), puis une passe de verification structurelle (ids, positions). Aucune correction visuelle necessaire, donc pas de seconde capture.
- Frames larges : Shortcuts Panel (frames de 1320) donne une planche de 2860 de large ; Spotlight (760) 1740 ; Page Title 1420. Les frames gardent leur taille d'origine pour ne pas changer les ratios d'export ZeroHeight.
- Spotlight : deux Do sans Dont donnent deux grands cartes pointillees ; les deux Dont sont en text only (comportement non dessinable).
- Les Dont text only (Action Card, Pie Chart) ne sont pas appariees a un Do : elles restent dans le groupe "Rules without illustration".
- Pas de gabarit `_Design system header` ni `Versionning` sur les pages Layout (Page Title, Overlay) ; sur les pages Data Display ils existent, `Versionning` est a x = 0 (a gauche de l'en-tete), non deplace.
- Pages Overlay : les cadres Documentation sont a x = 4700 et la planche a 6540 ; la planche Spotlight (y 4678) ne chevauche pas celle de Filter Drawer (fin a y 1510).
- Le kit a ete colle sans le bloc `extras` ni `hyperlink` (non utilises ici).
