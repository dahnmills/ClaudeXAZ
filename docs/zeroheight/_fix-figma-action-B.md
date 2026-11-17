# Correctifs Figma Action B : Link, Crumb, Breadcrumb, Chip, Tag

Date : 2026-11-06. Fichier `xCeEJPn6fliEshuE9fnrqs`. Changements non cassants uniquement. Aucune variable, collection ou mode creee. Aucun renommage, aucune suppression, aucun detachement, pas de publication.

## 1. Corrige

Liaisons de gap et padding (XS 4, S 8, M 16) et de rayon 4 (Border/Radius S), hors calques internes aux instances.

| Composant | Noeud | Liaisons | Description |
|-----------|-------|----------|-------------|
| Link | 688:4202 | 288 (gap 4 vers Spacing/XS) | oui |
| Crumb | 705:4485 | 0 (gaps propres a l'instance Link) | oui |
| Breadcrumb | 298:5526 | 1 (gap 4 vers XS) | oui |
| Chip | 456:438 | 80 (gap 8 S, padding 16/8/4 M/S/XS) | oui |
| Tag, .Options Filter 102:347 | 102:558, 102:347 | 16 + 112 (gap/padding 4/8, rayons 4 vers Radius S) | oui (sur Tag) |
| .Options Select 102:494 | 102:494 | 128 | non (hors perimetre) |
| .Options Static 102:537 | 102:537 | 16 | non |

Total : 641 liaisons. Descriptions en anglais, courtes, avec lien code `ds-link`, `ds-crumb`, `ds-breadcrumbs`, `ds-chip`, `ds-tag`.

## 2. Differe (decision ou valeur sans equivalent exact)

- Rayon Chip 10000 : `Border/Radius/Round` vaut 100 (pas la meme valeur resolue). Rendu identique tant que la hauteur est inferieure a 200, mais non lie par regle de prudence. Decision : accepter Round (100) pour le Chip.
- Styles de texte Chip (SemiBold 14/12, interligne 16/14, espacement 1) et Tag/.Options : les styles Body/M/Semi Bold (14, interligne 20, espacement 0) et Body/S/Semi Bold (12, interligne 16) changeraient la hauteur et l'espacement. Decision : accepter le changement de rendu (a valider visuellement) ou garder.
- Couleurs brutes restantes : fills blancs sur Breadcrumb et Tag (7 et 2), fills #F1F9FA sur Tag Select (8+) et #008ED6 sur Tag Filter (2), traits violets (cadres de set). Aucun Semantic verifie de meme valeur, rien change. A confirmer au cas par cas.
- T5 (noms Main/Alt/Pressed) : les variables liees portent les memes cles que les `Strong`, `Strong/Alt`, `Active` actuels (ex. `0c1630...` = Background/Strong/Default). Seul l'ancien nom est en cache dans le fichier, pas de re-liaison utile. Le rafraichissement viendra de la librairie Tokens.
- Tous les ecarts structurels de l'audit (Icon en booleens, Accent vs Neutral, defaut Font Weight, Type du Chip, croix, Static du Tag en instance de .Options, 3 `.Options` a renommer, doublons et `[DEPRECATED] Link`, Breadcrumb sur Crumb et slot, Disabled du Crumb, defaut Tag Filter vs Select, Active vs Pressed) : non touches, decisions visibles.
- Calques morts masques dans Tag, orientation verticale du Chip : non touches.

## 3. Verification

- Chaque liaison : valeur lue apres liaison identique a la valeur avant (0 ecart sur 641).
- Largeur et hauteur de tous les noeuds de chaque composant comparees avant/apres : 0 difference.
- Captures get_screenshot du set Chip avant/apres : fichiers PNG identiques octet a octet (md5 identique). Capture Tag avant prise, apres non rejouee (meme methode de liaison, geometrie inchangee).
- Nombre d'instances : aucune creation, suppression ou remplacement de noeud, donc inchange. Aucun comptage global a l'echelle du fichier n'a ete fait.
