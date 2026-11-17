# Lib rollout, lot data-display-5 : librairie Data Display (`VpConH5AUGyCqtp8PMqj1i`)

Date : 2026-11-16. Modèle : Action > Button (4030:979). Kits : `doc-kit.js`, `board-kit.js`, `page-kit.js` (non modifiés).
Rien publié, aucun commit, aucun token, collection ni mode créé, aucun composant, variante ou propriété créé, renommé ou supprimé. Pas de MCP ZeroHeight.

## Méthode commune

- Pages trouvées par l'inventaire : `🆕 Progress Bar` (2024:47), `🆕 List Item` (2059:47), `🆕 Chart` (2060:47). Aucune autre page touchée.
- Chaque page avait un seul gabarit `_Design system header` + `Versionning`, sans 2e gabarit Do/Dont, sans section ZeroHeight ni brouillon : rien en To review.
- Liaisons : audit de tous les nœuds du set (paddings, gaps, rayons, fills, strokes, textes), liaison seulement quand un Semantic de même valeur existe, signature de géométrie avant / après (boîte absolue, paddings, gap, rayon, couleurs) sur le set et ses instances du fichier, annulation automatique en cas d'écart.
- Règles Do / Don't : section `## Do / Don't` du .md local, format « Do: X. Don't: Y. ». Texte gardé mot pour mot, seule la première lettre passe en majuscule (le bandeau de carte porte déjà Do / Don't). Les titres de groupe (`key`) sont choisis ici, le .md n'en a pas.
- Frames do/dont : 360 x 140, fond `Static/Background/Main/Secondary`, padding L, instances des vrais composants ; les libellés et chiffres sont des textes liés aux variables (famille, taille, interligne, graisse, couleur).
- Gabarit `_Design system header` ramené de 2395 à 1800 px après `normalize` (comme Action Card et Pie Chart au lot F), COMPONENT_SET non touché. Fil d'Ariane « 🆕 X » remplacé par « X », description remplacée par celle du .md.
- Pas de frame `anatomy` : le canevas Anatomy du cadre Documentation suffit.

## Progress Bar (page 2024:47)

- Section `Progress Bar` : **2155:23865** (6594 x 3638). Versionning 2024:256 | 01 header 2024:48 | 02 Documentation **2155:23866** | 03 Do/Don't **2155:23937**.
- `lost`, `miss`, `overlaps` vides ; doc kit et board `miss` vides. To review : rien.
- Liaisons : aucune à poser. Tout était déjà lié au Semantic (hauteurs Sizing/XS et S, rayons Radius/S, couleurs track et fills). Seule valeur en dur : le padding droit 96, qui EST la valeur du composant (aucun Semantic, à ne pas lier).
- Description posée sur le set 2024:313 (phrase d'usage + mode de réglage de la valeur).
- En-tête : description du .md, fil d'Ariane « Progress Bar ». Statut Design laissé « New » (c'est ce que dit le .md).

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Show the value, Do : "show the number next to it." | do · progress-bar · number next to it | 2154:22066 |
| Show the value, Don't : "use it alone to carry a status; pair it with text or a Badge." | dont · progress-bar · bar alone carries status | 2154:22072 |
| Tone, Do : "use Positive, Warning or Negative only when the value itself has that meaning." | do · progress-bar · tone from the value | 2154:22075 |
| Tone, Don't : "pick a tone for decoration." | dont · progress-bar · decorative tones | 2154:22086 |
| Size, Do : "use S inside dense cards." | do · progress-bar · s in dense cards | 2154:22102 |
| Size, Don't : "mix S and M bars in the same list." | dont · progress-bar · mixed sizes | 2154:22118 |

- Text only : aucune.
- Écarts (notes du cadre Documentation) : hauteurs en dur dans le code (4 / 8 px) alors que Figma lie Sizing/XS et S ; échelle 0 à 1 en code, pourcentage via padding en Figma ; mode indeterminate en code seulement ; Storybook sous Feedback, Figma sous Data Display ; pas de nom accessible en code.

## List Widget et Newsfeed : page List Item (2059:47)

- **Pas de .md propre** pour List Widget ni Newsfeed. Le Figma n'a qu'un composant, `List Item` (2059:394), qui porte les entrées des deux wrappers (`components.json` pointe les deux sur 2059:394 et sur `list-item.md`). Les règles viennent donc de `docs/zeroheight/data-display/list-item.md`, croisées avec le code `src/app/shared/ui/list-widget` et `newsfeed`. Une seule section, nommée `List Item` comme le composant Figma.
- Section `List Item` : **2161:26295** (6594 x 3801). Versionning 2059:256 | 01 header 2059:48 | 02 Documentation **2161:26296** | 03 Do/Don't **2161:26367**.
- `lost`, `miss`, `overlaps` vides ; doc kit et board `miss` vides. To review : rien.
- Liaisons : aucune à poser. Gaps (XS), textes Date et Excerpt (famille, taille, interligne, graisse, couleur) déjà en Semantic. Valeurs en dur restantes, non touchées : celles du Badge imbriqué (padding 4, gap 10, rayon 100) et le fond blanc du Link `Title`, qui viennent des composants des librairies Feedback et Action (cascade) ; aucune n'est un override local.
- Description posée sur le COMPONENT 2059:394.
- En-tête : description du .md (l'ancienne mêlait des règles Do / Don't), fil d'Ariane « List Item ».
- Anatomy : instance temporaire « news » (Show tags, Date icon, Excerpt, Badge ; deux Badges Positive et Important posés dans le slot Tags, icône coupée) clonée dans le canevas et dans la vignette News item, puis supprimée. Repères 1 et 3 tirés à l'horizontale vers la gauche (en vertical, ils tombaient sur le texte de l'extrait et du titre).

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Dividers, Do : "one Divider between items." | do · list-item · divider between items (360 x 180, 2 List Item + Divider) | 2155:26743 |
| Dividers, Don't : "add a Divider after the last item." | dont · list-item · divider after the last item (360 x 180) | 2155:26831 |
| Title and actions, Do : "make the whole title the link." | do · list-item · whole title is the link | 2155:26895 |
| Title and actions, Don't : "put actions (buttons, menus) in the item." | dont · list-item · actions in the item (List Item + 2 Button Icon Tertiary S de la librairie Action, glyphes Edit Pen et Duplicate) | 2155:26921 |
| Number of items, Do : "keep at most 3 items per small widget." | do · list-item · three items at most (360 x 240) | 2155:26960 |
| Number of items, Don't : "turn a widget list into a scrolling table." | dont · list-item · scrolling list (360 x 240, 6 items coupés par le cadre : le 4e est tronqué, rien de dessiné à la main) | 2155:27056 |

- Text only : aucune.
- Écarts (notes du cadre Documentation) : pas de `ds-list-item` en code, chaque wrapper n'utilise qu'une partie des propriétés ; `ds-newsfeed` n'affiche qu'une actu ; extrait Secondary / interligne 16 en Figma, Primary / interligne 20 et deux lignes en code ; letter-spacing M de la date dans `ds-list-widget` seulement ; statut par défaut du Badge Error en Figma, info en code.
- Divider : composant `Divider 0px padding` de la librairie (clé ef60f924…, celui du Versionning), pas l'ancienne clé 9498f5f5… de l'inventaire.

## Chart (page 2060:47)

- Skill `dataviz` lue avant les illustrations : une seule série par graphique, trait 2 px à extrémités rondes, points de 8 px avec anneau de 2 px couleur de surface, grille fine et discrète, libellés d'axe en couleur de texte (jamais la couleur de la série), couleur Brand seule (les tons fonctionnels sont réservés aux statuts).
- Section `Chart` : **2163:25394** (6594 x 3790). Versionning 2060:256 | 01 header 2060:48 | 02 Documentation **2163:25395** | 03 Do/Don't **2163:25466**.
- `lost`, `miss`, `overlaps` vides ; doc kit et board `miss` vides. To review : rien.
- Liaisons posées (2, 0 différence de signature sur 37 nœuds ; aucune instance de Chart dans le fichier) : padding bas 16 du slot `Y labels` vers `Measurement/Spacing/M`, dans les deux variantes (2060:293, 2060:318). Le reste (gaps XS, couleur des lignes de grille) était déjà en Semantic. Rien de différé.
- Description posée sur le set 2060:338.
- En-tête : description du .md (l'ancienne mêlait une règle Do / Don't), fil d'Ariane « Chart ».
- Illustrations : vraies instances de `Grid=Vertical` (2060:292) et `Grid=Both` (2060:317), slots remplis en local comme le prévoit le master (libellés X / Y en texte lié aux variables, courbe en vecteur lié à `Interactive/Background/Strong/Default` et `Border/Size/M`, points liés à `Sizing/S`). Le clipping du cadre `Main` est coupé sur chaque instance (sinon les points des extrémités sont tronqués) : override d'instance, master non touché.

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Series and grid, Do : "one series per chart, labels from the data." | do · chart · one series with data labels (exposition, Grid Vertical, 8 mois) | 2162:21229 |
| Series and grid, Don't : "draw grid lines in the local content; the master owns them." | dont · chart · grid lines in local content (3 traits plus foncés posés dans le slot Series) | 2162:21281 |
| Y axis, Do : "turn the Y axis on (Grid = Both) when the scale matters, as for Grade." | do · chart · y axis with grid both (Grade 1 à 9, axe inversé) | 2162:21340 |
| Y axis, Don't : "show a Y axis with a single label." | dont · chart · y axis with a single label | 2162:21409 |
| Inverted axis, Do : "use `invertY` for Grade so that the best grade sits on top." | do · chart · inverted axis for grade (libellés « 1 best » … « 9 worst ») | 2162:21470 |
| Inverted axis, Don't : "invert an axis without saying so in the labels." | dont · chart · inverted axis without labels (même courbe inversée, sans axe Y) | 2162:21539 |

- Text only : aucune. Dans la planche, `invertY` est écrit sans les accents graves du Markdown.
- Anatomy : clone de l'instance Grade (2162:21341) à l'échelle 1,8 ; repère 1 (Y labels) tiré à l'horizontale vers la gauche pour ne pas masquer le « 1 ».
- Écarts (notes du cadre Documentation) : nombre de lignes de grille fixe en Figma, piloté par les libellés en code ; tailles en dur dans le code (axe X 16 px, point 7 px et anneau 1,5 px, hauteur 160 px) ; pas d'entrée code pour la variante Grid ; les 5 libellés Y de 16 px remplissent le tracé de 80 px et ne tombent pas pile sur les lignes horizontales ; le cadre `Main` du master coupe son contenu ; pas de nom accessible en code ; pas de propriété Tone en Figma (couleur portée par la courbe locale).

## Décisions à prendre

1. List Widget et Newsfeed n'ont pas de page ZeroHeight ni de .md à eux : la page `list-item.md` les couvre. Faut-il garder une seule page « List Item » ou créer deux pages ?
2. Statut Design : les en-têtes affichent « New » (comme les .md), le cadre Documentation affiche « Ready » (state `ready` de `components.json`). À aligner.
3. Le cadre `Main` du master Chart coupe son contenu : passer `clipsContent` à false dans le master (changement de rendu, donc pas fait ici) ?
4. Tag du Versionning des trois pages : libellé « Update » alors que l'entrée est une création (« New »). Laissé tel quel.
5. En-têtes ramenés de 2395 à 1800 px, comme au lot F : à valider avec les autres pages de la librairie.
