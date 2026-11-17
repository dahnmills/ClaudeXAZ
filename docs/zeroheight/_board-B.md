# Do / Don't boards, lot B (Link, Crumb, Breadcrumb, Chip, Tag)

Fichier `[Components] Action` (xCeEJPn6fliEshuE9fnrqs). Chaque section `ZeroHeight · <Nom> illustrations` est transformee en place en planche (cadre interne `Do and Don't board`), via `docs/figma/doc-kit/board-kit.js`. Position: x = x(Documentation) + 1280 + 560, meme y que le cadre Documentation (ecart de 560 verifie par script). Tout lie aux variables Semantic, aucun token cree, rien de publie.

| Composant | Section (nodeId) | Cadre planche | Position x,y | Taille |
|---|---|---|---|---|
| Link | 944:4682 | 999:7227 | 1704, 2932 | 1280 x 1261 |
| Crumb | 944:6266 | voir section | 1840, 3732 | 1280 x 778 |
| Breadcrumb | 944:7086 | voir section | 1840, 6572 | 1280 x 1261 |
| Chip | 946:594 | voir section | 1840, 2981 | 1280 x 1129 |
| Tag | 946:1107 | 1001:303 | 1840, 3695 | 1280 x 1261 |

## Regles
- Link: 3 paires (Navigate, do not act / Links in paragraphs / External links).
- Crumb: 1 paire (Current page: 944:6267 / 944:6293). Text only: "Route on the clicked output." (Do) et "Rely on href alone: the default navigation is prevented." (Don't), sans item-id ZH.
- Breadcrumb: 3 paires (End of the trail, Labels, Page actions).
- Chip: 2 paires (Keep the set short, Statuses). Text only: "Use the filter type to show a removable applied filter." (Do) et "Use a select chip that the user cannot see as removable." (Don't): le composant Figma ne modelise pas le type filter.
- Tag: 3 paires (Select tags, Filter tags, Statuses).
- Aucun placeholder pointille (pas de Do sans Dont).

## Verification des nodeIds d'origine
Les 24 frames existent encore, memes noms, memes ids (verifie par getNodeByIdAsync): 
Link 944:4689 944:4701 944:4710 944:4725 944:4740 944:4752; Crumb 944:6267 944:6293; Breadcrumb 944:7093 944:7119 944:7142 944:7162 944:7182 944:7210; Chip 946:595 946:604 946:648 946:676; Tag 946:1108 946:1166 946:1214 946:1234 946:1252 946:1280.

## Ecarts
- Premier appel en erreur de syntaxe (accolade mal recopiee dans mon collage, le fichier board-kit.js du repo est correct); relance OK. Un appel parallele a ete coupe (transport), les builds etant relancables, l'etat a ete verifie.
- Les cadres Documentation de Link sont a x=-136, a gauche du gabarit d'en-tete (x=317, y tres different): ordre de lecture de la page Link non strictement gauche-droite, non touche. Versionning inchange.
- Pages Breadcrumb: Crumb et Breadcrumb ont deux planches empilees verticalement (memes x), chacune a la hauteur de son cadre Documentation.
- Le glyphe d'icone de lien externe reste celui par defaut (Edit Pen), voir _dodont-figma-B.md.
- Boucle qualite: 2 passes (capture planche, controle ids, positions, ecarts), aucun texte coupe, aucune frame trop large.
