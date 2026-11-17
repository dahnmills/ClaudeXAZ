# Do / Don't Figma : nouveaux composants Data Display (fileKey VpConH5AUGyCqtp8PMqj1i)

Modèle : sections `ZeroHeight · <Composant> illustrations` de la librairie Action (voir `_dodont-figma-A.md`). Frames 400 de large (hauteur commune par section), fond Secondary, instances des vrais composants, couleurs et espacements liés aux variables Semantic existantes (aucun token créé). Sections posées à 560 px sous le contenu de la page. Rien publié, aucun nœud existant modifié.

## Action Card (page 2117:2, ZH 9186061) : section 2124:64 `ZeroHeight · Action Card illustrations`
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Give the link a clear label such as "Start a search". | do · action-card · clear link label | 2124:65 |
| Don't : Use "Click here" as the link label. | dont · action-card · click here label | 2124:81 |
| Do : Wrap a group of Selectable cards in a radio group with a name. | do · action-card · radio group with name | 2124:97 |
Sautée : "Don't : Put several links or buttons inside one card." (une instance ne peut pas recevoir de liens supplémentaires sans détacher le composant ou dessiner à la main).

## Pie Chart (page 2118:95, ZH 9186062) : section 2125:70 `ZeroHeight · Pie Chart illustrations`
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Add a legend or text with the values next to the chart. | do · pie-chart · legend with values | 2125:71 |
| Don't : Rely on color alone to tell the parts apart. | dont · pie-chart · colour only | 2125:89 |
| Do : Give the same information as text when a tooltip carries it. | do · pie-chart · tooltip and text | 2125:97 |
Sautée : "Don't : Animate or blink the parts." (mouvement, non représentable sur une frame statique).

Note : les pastilles de légende (ellipses) et les lignes de texte sont locales (taille liée à Spacing M, couleurs liées aux tons Functional du Donut, style Body M Regular), la librairie n'ayant pas de composant de légende.
