# Lot 2 (et partie sûre du lot 3) : librairie Feedback

Fichier `[Components] Feedback` (`fH3vmSNZR8r0sU3kN455CD`), session du 2026-11-17. Brief : `docs/figma/_lot2-brief.md`.
Rien publié, aucun commit, aucune collection, mode ni variable créé. Aucune autre librairie ni fichier de fonctionnalité touché.
Contrôle après chaque page : tailles de toutes les variantes et instances du fichier comparées avant / après par script (aucun écart hors ceux listés), 0 instance cassée (Popin, Functional Notice relus), sections sans chevauchement (les sections ont seulement rétréci, sauf l'en-tête Functional Notice qui reste dans sa section).

## Fait

### Suppressions (nodeId + nom)
| Page | nodeId | Nœud |
|---|---|---|
| Popin | 62:709 | `.Spec` ancien (COMPONENT_SET, 5 variantes, 0 instance) |
| Popin | 301:1279 | `.Icon` ancien (COMPONENT_SET, 5 instances, toutes dans 62:709) |
| Popin | 106:8538 | cadre `Frame 4` qui contenait les deux sets ci-dessus |
| Popin | 328:4064 | titre « Deprecated » de l'en-tête |
| Popin | 587:607 | section `Popin - To review` (106:8292 `_Design system header`, 42:560 `Ellipse 1`) |
| Badge | 560:657 | section `Badge - To review` (141:173 `_Design system header`, 222:2435 `Frame 3`) |
| Badge (counter) | 560:932 | section `Badge (counter) - To review` (336:7567) |
| Toaster | 561:596 | section `Toaster - To review` (337:2671, instance orpheline `Button Icon` 131:2124) |
| Spinner | 561:829 | section `Spinner - To review` (337:9037) |
| Skeleton | 562:206 | section `Skeleton Item - To review` (337:12731) |
| Tooltip | 566:317 | section `Tooltip - To review` (119:3587) |
| Popover | 580:1137 | section `Popover - To review` (120:210) |
| Snackbar | 557:470 | section `Snackbar - To review` (337:3034) |
| Functional Notice | 574:1919 | section `Functional Notice - To review` (337:6361) |
| Functional Notice | 124:945, 124:25239, 124:25380 | `Frame 1`, `Frame 2`, `Frame 3` (exemples de placement hors section) |
| Functional Notice | 124:5097, 124:25448, 124:27294 | maquettes `ADT v2 - New ADT` (x2), `ManA - Financial info` |
| Functional Notice | 124:29802, 124:29803, 124:29804 | textes `Inner block`, `Inner page`, `Top fixed` |
| Functional Notice | 124:25237, 124:25238, 124:29798 à 124:29801 | `Vector 1` à `Vector 6` (flèches) |

Aucun COMPONENT dans ces nœuds (vérifié avant chaque suppression). Les 26 instances de l'ancien `Data Display 👔` relevées au lot 1 sur la page Functional Notice partent avec les maquettes.

### Versionning (aligné sur `components.json` : 1.0.0, ready)
- Toaster 337:2651, Spinner 337:9017, Skeleton Item 337:12711, Badge (counter) 336:7547 : gabarit vide rempli (étiquette Ready, v1.0.0, date `lastChange`, Added + description, Documented « Anatomy, properties, states, tokens and usage rules (November 16, 2026). »). Dates : Toaster 11 sept., Spinner et Skeleton 8 sept., compteur 17 nov. 2026 (valeur du JSON).
- Badge 141:218 : **Figma disait Draft v.2.0.0 (28 mai 2024), le JSON dit 1.0.0 ready** : écrit Ready et v1.0.0 ; date et historique (« Adding new size », « Refacto ») conservés. À trancher : version 2.0.0 réelle ou 1.0.0.

### Propriétés et variantes ajoutées (défaut = comportement actuel)
- Popin `.Spec` 328:3934 : booléens `Secondary action` (bouton Tertiary 328:3946) et `Close` (Button Icon 328:3943), défaut true. L'instance `.Spec` du Popin est exposée, donc visibles depuis Popin.
- Popover 121:12614 : booléens `Close` (Button Icon, 24 variantes) et `Title` (titre, 24 variantes), défaut true.
- Snackbar 124:34846 : booléens `Icon` (Icon Functional) et `Link`, défaut true.
- Functional Notice 154:2271, grille complète 15/15 :
  - `Emphasis=Low, Status=Success` 625:2771 : copie exacte de Low/Default (dont le rendu est déjà vert, check).
  - `Emphasis=High, Status=Default` 625:2738 : copie de High/Info, fond `Background/Accent/Primary` (surface sombre neutre).
  - `Emphasis=Medium, Status=Default` 625:2746 : copie de Medium/Info, fond `Background/Main/Secondary`, texte `Text/Main/Secondary` (comme le Default du code en Low), icône `Icon/Main/Secondary`.
  - **High/Default et Medium/Default sont des propositions** : ni Figma ni le code ne définissent ces deux rendus (le code n'a de style Default qu'en Low). À valider.
  - Variante par défaut inchangée (High/Info reste la première).

### Functional Notice High/Info réalignée (154:2267)
`primaryAxisSizingMode` AUTO vers FIXED, alignement MIN vers SPACE_BETWEEN, comme les 11 autres. Largeur 1224 et hauteur 76 inchangées ; gap 425 laissé (sans effet en SPACE_BETWEEN, comme les autres variantes). Risque déjà noté au lot 1 : une instance High/Info non surchargée en largeur chez un consommateur prendra 1224.

### Styles de texte hérités vers Tokens (même valeur, vérifiée nœud par nœud)
- Toaster : 4 titres `foundation-h4` vers `Body/L/Semi Bold` (131:1878, 330:1035, 131:1896, 131:1914).
- Functional Notice : 15 titres `foundation-h4` vers `Body/L/Semi Bold` (dont les 3 nouvelles variantes).
- Popin : 2 textes `foundation-text-paragraph` du `.Content` vers `Body/L/Regular` (328:4209, 328:4219).
- Badge : traité ensuite, voir « Badge aligné sur le code ».

### Swap de l'ancien Link dans Snackbar
124:34810 : `b9493d2f` vers Link `77367a8f`, variante `State=Default, Tone=Reversed, Icon=None, Size=M, Font Weight=Regular, Text Decoration=Underline` (même police 16/24 Regular, soulignement de l'ancien, 44 x 24 identique, libellé « Action »).
**Écart constaté** : les libellés surchargés des instances n'ont PAS été conservés (sur la page : « Undo » et « View » repassés à « Action »). Je les ai reposés à la main (555:412, 555:424, tailles revenues à 250 et 321). Retour en arrière impossible (l'ancien Link n'est plus importable). Conséquence à la publication : chez les consommateurs de Snackbar (coverbook, notification-module, spotlight), une instance dont le libellé du lien est surchargé reviendra à « Action » : à relire juste après publication.

### Lot 3 sûr : liaisons
- Popover : 48 traits de 1 px (Wrapper et flèche, 24 variantes) liés à `Border/Size/S` (vaut 1). Tailles identiques.
- Spinner : aucun trait visible (rien à lier).

### Liens de documentation et descriptions
Aucune page ZeroHeight publiée pour Feedback (`zeroheight.pageId` null partout) : lien Storybook du composant sur les 10 maîtres publiés (Badge, Badge Counter, Popin, Tooltip, Popover, Toaster, Snackbar, Functional Notice, Spinner, Skeleton Item).
Descriptions ajoutées : `.Badge` 141:139, `.Content Properties S` 141:162, `.Content Properties M` 141:151, `.Animation` 117:4 (les atomes de Popin et Popover en avaient déjà).

### Renommages
- Composants et sets : `Badge` 257:5 vers `Badge Counter` ; `.Content Properties` 141:162 / 141:151 vers `.Content Properties S` / `M`.
- Pages : `Badge` 257:2 vers `Badge (counter)`, `Spinner ` vers `Spinner`, `Functionnal Notice` vers `Functional Notice`.
- Calques de maîtres : Badge `Frame 28` vers `Content` ; Popin et Toaster `Text` vers `Message` ; Snackbar `Frame 248` vers `Message` ; Popover `Frame 37` vers `Arrow`, `Rectangle 1` vers `Arrow shape`, 2e texte `Title` vers `Body` (24 variantes) ; Spinner `Group 1` vers `Ring`, `Ellipse 1` vers `Track`, `Ellipse 2` vers `Arc` (mêmes noms dans les 4 variantes, Smart Animate préservé).
- Gabarits des 10 pages : `_Design system header` vers `Component` ; dans Versionning `Frame 16/27/19/18` vers `Title`, `Release header`, `Version row`, `Date and type` ; dans l'en-tête `Version`, `Status`, `Status list`, `Design status`, `Tech status`, `Body`, `Component section`, `Atoms`, `Atoms section`, `Canvas`.

## Non fait / laissé (raison)
- Popin titre `Headline/Medium (🖥26 📱24)/Bold Mobile` (24/32 Bold, interlettrage 0,2, police non résolue) : aucun style Tokens de même valeur (`Title/H1` = 24/32 Regular, interlettrage 0). Non lié.
- Functional Notice messages `Copy/Small (14)/Regular` (14/20, interlettrage 0,2, police non résolue) : `Body/M/Regular` a un interlettrage 0. Non lié (15 nœuds).
- Badge : icône Neutral Light M en `qrn foundation/color/grey/500` (#414141) : le Semantic voisin `Icon/Main/Primary` vaut #121212, pas de même valeur, non touché ; interligne 12 du compteur (aucun Semantic à 12).
- Spinner : `Property 1` non renommé (Button Loading en dépend), `Size` / `Tone` non ajoutés.
- Ombres (Popin, Snackbar, Toaster, Tooltip) : décision en attente, non touchées.
- Valeurs sans token exact, non liées : Snackbar gap 80, Tooltip gap 10, Toaster gap 10 du cadre Action, Popover gap -1 / 10 et rayon de flèche 2/0/0/0, Popin fond #000 35 %, paddings 179 / 78 et gaps 10.
- Popin : le set `.Content` (1616 px) dépasse de 40 px le cadre Atoms (1576 utiles) et est rogné ; préexistant, non corrigé.
- Functional Notice F3 / F5 (Title sans lien en Low, textes en largeur fixe) et Low/Default vert : hors liste du lot 2.
- Calques génériques restants : illustration undraw du Popover (`Group`, `Vector`), cadres `Text` des légendes des Documentation (créés par le kit).

## Badge aligné sur le code
Décision utilisateur du 2026-11-17 (15 h 15) : le libellé de Badge suit le code (`badge.component.scss` : size-m, line-height-m, font-weight-regular, letter-spacing-s, pour S et M). Changement visible voulu.
- `Body/M/Regular` vaut 14/20 Regular mais avec un interlettrage 0, alors que le code a `letter-spacing-s` (0,2). Le style ne correspond donc pas exactement : j'ai retiré les styles hérités et lié les variables directement, `Font/Family`, `Font/Text Style/Size/M`, `Line Height/M`, `Font Weight/Regular`, `Letter Spacing/S`.
- Nœuds : 141:166 et 141:172 (`.Content Properties S`, ex `Copy/Small (14)/Semibold`), 141:154 et 141:159 (`.Content Properties M`, ex `Copy/Medium (16)/Semibold`). Les 20 variantes de Badge en héritent.
- Valeurs : S 14/20 SemiBold 0,2 devient 14/20 Regular 0,2 ; M 16/24 SemiBold 0 devient 14/20 Regular 0,2.
- Les variantes restent en Hug sur les deux axes. Dimensions avec le libellé « Draft » et l'icône : S 65 x 20 avant, 64 x 20 après ; M 71 x 24 avant, 66 x 24 après. Les mêmes sur les 5 statuts et les 2 styles. Les valeurs « avant » sont calculées à partir de la largeur mesurée du texte dans l'ancienne et la nouvelle typo ; l'étiquette du Versionning confirme l'écart de 5 px en M (61 puis 56 px).
- Hauteur M restée à 24 : l'axe vertical de `.Content Properties M` est en taille fixe à 24, le texte de 20 px y est centré. Je ne l'ai pas modifié.
- 0 instance cassée sur la page. Les badges des pages de doc et les instances consommatrices vont rétrécir à la publication.
- Non touchés, comme demandé : icône Neutral Light M (`grey/500`), interligne du compteur.

## À publier (par l'utilisateur)
Librairie Feedback. Points à relire juste après : libellés de lien des Snackbar chez les consommateurs ; largeur des instances High/Info de Functional Notice (Search, Reject Management, Coverbook) ; instance `Notice` 31:4053 de Reject Management (déjà connue) ; validation des rendus High/Default et Medium/Default.
