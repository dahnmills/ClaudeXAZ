# Lib rollout, lot feedback-2 (librairie Feedback `fH3vmSNZR8r0sU3kN455CD`, 2026-11-16)

Modèle : librairie Action, pages Button (section 4030:979) et Button Icon (section 4040:1005). Kits : `docs/figma/doc-kit/doc-kit.js`, `board-kit.js`, `page-kit.js` (non modifiés).
Rien publié, aucun commit, aucun MCP ZeroHeight, aucun token, collection ni mode créé. Aucun composant, variante ni propriété créé, renommé ou supprimé. Pages touchées : Snackbar, Functionnal Notice, Tooltip, Popover, Popin. Cover, Status et les pages de l'autre lot (Badge, Badge counter, Skeleton, Spinner, Toaster) non touchées.

Méthode de liaison (étape 1) : script unique par composant, nœuds propres du composant seulement (les instances imbriquées gardent les valeurs de leur propre composant). Paddings / gaps (hors 0 et hors `SPACE_BETWEEN`) vers `Measurement/Spacing/*`, rayons uniformes vers `Border/Radius/*`, remplissages et traits sans variable vers le Semantic de même valeur selon le rôle (texte, fond, icône, bordure), textes (famille, taille, interligne, graisse, interlettrage) vers `Font/*`. Contrôle : signature de géométrie avant / après (position, taille, paddings, gap, rayon, visibilité, fills, propriétés de texte) et capture avant / après comparée au pixel.

## Snackbar (page `124:29805`)
- Section `Snackbar` **557:349** (6594 x 3481) : Versionning 337:3014 | `_Design system header` **337:2980** (contient le COMPONENT 124:34846) | Documentation **557:350** | Do/Don't **557:421**.
- To review : section `Snackbar - To review` **557:470** avec le 2e gabarit `_Design system header` 337:3034 (ancien Do / Dont, texte de Radio en placeholder, sans composant).
- Liaisons posées (11) : padding 8 / 16 vers Spacing/S et M, rayon 4 vers Radius/S, gap 8 de `Frame 248` vers Spacing/S, texte vers Font/Family, Text Style/Size/L, Line Height/L, Font Weight/Regular, Letter Spacing/None. Description posée. Signature : 0 différence, capture identique (md5).
- Différé : gap 80 entre message et lien (aucun Semantic de 80) ; ombre (style d'effet, pas de variable).
- Frames do / dont (section ZeroHeight devenue la planche, puis rangées dans Do/Don't) :

| Règle ZeroHeight (texte exact) | Frame | nodeId |
|---|---|---|
| Small confirmations, Do : Use a snackbar for small confirmations. | do · snackbar · small confirmation | 555:411 |
| Small confirmations, Don't : Use it for errors that need an explanation (use Toaster). | dont · snackbar · error that needs an explanation | 555:423 |
| One line, Do : Keep it to one line. | do · snackbar · one line | 555:435 |
| One line, Don't : Write a paragraph. | dont · snackbar · paragraph (360 x 200, instance élargie à 320 px, texte en retour à la ligne) | 555:447 |

- Text only : aucune.
- Gabarits remplis : en-tête (titre « Badge » / « Badge » en placeholder remplacé par Snackbar et sa description, statuts Done / Draft remplacés par Ready / In code comme dans components.json), Versionning (Ready, v1.0.0, 26 août 2026, Added / Documented).
- Écarts notés dans Documentation : gap 80 en Figma contre 8 en code ; tons success / error en code seulement ; texte placeholder « This a a snackbar » ; valeurs hors tokens du SCSS.
- Contrôle visuel : 2 passes (section entière, zoom anatomie). Repères d'anatomie sur leur cible.

## Tooltip (page `119:3357`)
- Section `Tooltip` **566:187** (6594 x 3859) : Versionning 119:3567 | `_Design system header` **119:3429** (contient le COMPONENT_SET 119:4038) | Documentation **566:188** | Do/Don't **566:259**.
- To review : section `Tooltip - To review` **566:317** avec le 2e gabarit 119:3587 (ancien Do / Dont, sans composant).
- Liaisons posées (192, 16 variantes) : padding 4 / 8 vers Spacing/XS et S, rayon 4 vers Radius/S, texte vers Font/Family, Text Style/Size/M, Line Height/M, Font Weight/Regular, Letter Spacing/S (0,2). Couleurs déjà liées au Semantic. Description posée. Signature : 0 différence, capture identique (md5).
- Différé : gap 10 des cadres `Indicator` et `Content` (aucun Semantic de 10).
- Frames do / dont :

| Règle ZeroHeight (texte exact) | Frame | nodeId |
|---|---|---|
| Same words as the label, Do : Repeat the ariaLabel of an icon button in its tooltip. | do · tooltip · same words as the aria label | 560:69 |
| Same words as the label, Don't : Write a different text. | dont · tooltip · different words from the aria label | 560:87 |
| Disabled controls, Do : Explain why a control is disabled. | do · tooltip · explains a disabled control | 560:101 |
| Disabled controls, Don't : Use a tooltip to hide essential instructions. | dont · tooltip · hides essential instructions (360 x 200) | 560:125 |
| Short text, Do : Keep it short. | do · tooltip · short text | 560:143 |
| Short text, Don't : Write a paragraph (use Popover). | dont · tooltip · paragraph (360 x 240, instance à 280 px) | 560:156 |

- **Frame pour Button Icon (librairie Action), règle « Unusual icons » : Do : Pair an unusual icon with a Tooltip.** → `do · button-icon · unusual icon with tooltip` **560:169** (Button Icon Tertiary, glyphe No Filter de la librairie Assets, tooltip « Clear all filters »). Rangée dans la planche Tooltip, groupe « Other illustrations ». La règle Don't (« Rely on the user guessing its meaning ») reste sans frame.
- Instances utilisées : Tooltip (local), Button Icon et Button (librairie Action, déjà présents dans le fichier), glyphes Copy et No Filter (Assets, importés par clé), Info Outline (repris de Functional Notice). Libellés « ariaLabel » et « Amount » : textes liés aux variables Font et Color.
- Text only : aucune.
- Gabarits : statuts Ready / In code, titre conservé, description Figma d'origine conservée ; Versionning rempli (Ready, v1.0.0, 6 novembre 2026).
- Écarts notés dans Documentation : **nommage des positions inversé** (Figma nomme le côté de la flèche : Top = flèche en haut, infobulle sous le déclencheur ; le code nomme le côté de l'infobulle : top-center = au-dessus). Figma Bottom Center = code top-center. Défauts différents (Top Right / top-center). Gap 10 sans token, ombre, pas d'aria-describedby ni d'Escape. Les frames do / dont utilisent la variante Bottom Center (infobulle au-dessus, comme le défaut du code).
- Contrôle visuel : 3 passes (frames, section entière, zoom États). Correction : vignettes d'états recalées à 4 par rangée (5 + 3 au départ après normalisation).

## Functional Notice (page `124:944`, « Functionnal Notice »)
- Section `Functional Notice` **574:1794** (6594 x 5002), posée à x -458, y 3661 (sous les exemples de placement) : Versionning 337:6341 | `_Design system header` **337:3133** (contient le COMPONENT_SET 154:2271) | Documentation **574:1795** | Do/Don't **574:1866**.
- To review : section `Functional Notice - To review` **574:1919** avec le 2e gabarit 337:6361 (sans composant).
- Laissés en place (contenu utilisateur, pas des brouillons) : exemples de placement `Frame 1` 124:945, `Frame 2` 124:25239, `Frame 3` 124:25380, maquettes `ADT v2 - New ADT` 124:5097 et 124:25448, `ManA - Financial info` 124:27294, textes Top fixed / Inner page / Inner block, flèches Vector 1 à 6. `overlaps` ne signale que les paires de vecteurs de ces flèches (préexistantes), aucun chevauchement avec la section.
- Liaisons posées (130, 12 variantes) : paddings et gaps 16 vers Spacing/M, rayon 4 vers Radius/S, titres vers Font/Family, Text Style/Size/L, Line Height/L, Font Weight/SemiBold, Letter Spacing/None. Description posée. Signature : 0 différence, capture identique (md5).
- Différé : gap 425 de la variante High Info (valeur sans token, probablement accidentelle) ; textes de message à segments mixtes (non liés, sautés par sécurité) ; couleurs de titre #1a6120 et #d87b02 (aucun Semantic de même valeur) ; cadre du set (padding 20, rayon 5, trait violet #9747ff de Figma).
- Frames do / dont :

| Règle ZeroHeight (texte exact) | Frame | nodeId |
|---|---|---|
| One notice per issue, Do : Use one notice per issue near the content it concerns. | do · functional-notice · one notice near the content (360 x 220) | 569:1536 |
| One notice per issue, Don't : Stack several notices at the top of a page. | dont · functional-notice · stacked notices at the top (360 x 260) | 569:1557 |
| Emphasis, Do : Use High for page-level and Medium for in-content messages. | do · functional-notice · medium inside a card (360 x 220) | 569:1604 |
| Emphasis, Don't : Use High inside a small card. | dont · functional-notice · high inside a small card (360 x 220) | 569:3825 |
| Next step, Do : Tell the user what to do next. | do · functional-notice · says what to do next (360 x 180) | 569:3834 |
| Next step, Don't : Only describe the problem. | dont · functional-notice · only describes the problem (360 x 180) | 569:3851 |

- Instances : Functional Notice (local), Card `Type=Slot` (librairie Data Display, placeholder `.Swap element` échangé contre la notice, Action off). Textes d'en-tête de bloc liés aux variables Font et Color.
- Text only : aucune.
- Gabarits : titre « Functionnal Notice » corrigé en « Functional Notice » (titre et fil d'Ariane, nom de page inchangé) ; description placeholder copiée de Popover remplacée ; statuts Ready / In code ; Versionning rempli (8 septembre 2026).
- Écarts notés dans Documentation : **variante Low / Default rendue en vert** (tokens Positive, icône check) alors que le code Default est gris ; paddings 16 partout et gap 16 en Figma contre 8 / 16 et 4 / 0 en code, Low teinté en Figma ; défauts Close / dismissible différents ; glyphe de fermeture absent en code (`icon="close"` sur ds-button-icon) ; pas de slot en Figma ; tokens Interactive pour High Success / Error en code.
- Contrôle visuel : 3 passes. Corrections : repère d'anatomie 3 déplacé sur le titre ; vignettes d'états recalées en pleine largeur (2, 2, 4 par rangée).

## Popover (page `119:3358`)
- Section `Popover` **580:1012** (6594 x 5191) : Versionning 120:190 | `_Design system header` **120:76** (contient le COMPONENT_SET 121:12614 et l'atome `.Action` 121:13151) | Documentation **580:1013** | Do/Don't **580:1084**.
- To review : section `Popover - To review` **580:1137** avec le 2e gabarit 120:210 (sans composant).
- Liaisons posées (850 utiles, 24 variantes + `.Action`) : paddings 16 / 24 vers Spacing/M et L, gaps 24 / 8 / 4 vers Spacing/L, S, XS, rayon 4 vers Radius/S ; textes déjà liés. Descriptions posées (Popover, `.Action`). Signature : 0 différence, capture identique (md5).
- **Incident corrigé** : le script a aussi lié 303 remplissages de vecteurs de l'illustration undraw à `Static/Icon/Brand` et `Static/Icon/Subtle/Primary`. En voulant les retirer, j'ai d'abord délié 888 remplissages, dont 585 que le designer avait déjà liés à ces mêmes variables. J'ai donc reposé la liaison sur les 888 (même règle par couleur que l'existant). État final = existant + 303 vecteurs de même couleur liés à la même variable que leurs voisins. Capture identique à l'état initial. À revoir si l'on préfère une illustration sans variables.
- Différé : gap -1 des variantes Top Left / Bottom Left, gap 10 d'`Indicator`, rayon 2/0/0/0 de la flèche, couleurs de l'illustration sans Semantic (#cccccc, #e6e6e6, #3f3d56...), cadre du set.
- Frames do / dont (560 px de large : le Popover fait 487 px) :

| Règle ZeroHeight (texte exact) | Frame | nodeId |
|---|---|---|
| One at a time, Do : Keep one popover open at a time. | do · popover · one popover open (560 x 320) | 577:488 |
| One at a time, Don't : Chain popovers. | dont · popover · chained popovers (560 x 520) | 577:529 |
| A way to close it, Do : Give the user a way to close it. | do · popover · close button (560 x 300) | 577:597 |
| A way to close it, Don't : Leave a popover that only closes by reloading. | dont · popover · no way to close (560 x 300, Actions off, bouton de fermeture masqué par override) | 577:628 |

- Text only : « Open a popover on click. » (Do) et « Open it on hover (use Tooltip). » (Don't) : interaction, pas dessinable sans curseur.
- Instances : Popover (local), Button Icon Tertiary (Action) avec glyphe Info Outline comme déclencheur, `.Action` avec libellés « View details » (primaire) / « Later ».
- Gabarits : titre et description Figma d'origine conservés, statuts Ready / In code, Versionning rempli (8 septembre 2026).
- Écarts notés dans Documentation : Position nomme le côté de la flèche ; défauts Top Left / bottom-left ; rayon 4 et gaps 24 en Figma contre 8 et 8 en code ; pas de slot d'illustration en code, pas de booléen de fermeture en Figma ; glyphe de fermeture absent en code ; **Reversed bleu en Figma** (Background/Functional/Informative) contre sombre en code (ajouté en note 6).
- Contrôle visuel : 3 passes. Corrections : libellés des actions inversés (primaire = action principale) ; vignettes d'états en 3 par rangée pleine largeur ; bloc « Atoms » de l'en-tête dont l'auto-layout n'était pas recalculé (titre et boîte superposés) : relancé par un aller-retour du gap, aucune valeur changée.

## Popin (page `41:2`)
- Section `Popin` **587:482** (6594 x 4584), posée à x -739, y 2523 : Versionning 106:8272 | `_Design system header` **106:8139** (contient le COMPONENT Popin 63:807, les atomes `.Spec` 328:3934, `.Icon` 328:3948, `.Content` 328:4212 et le bloc Deprecated 62:709 / 301:1279) | Documentation **587:483** | Do/Don't **587:554**.
- To review : section `Popin - To review` **587:607** avec le 2e gabarit 106:8292 et `Ellipse 1` 42:560 (cercle isolé à x 7896, brouillon). Aucun composant dedans.
- Liaisons posées (28) : `.Spec` gap 16 et rayon 4, `Container` padding 24 et gap 8, `Content` gap 4, `Title` gap 8, `Footer` padding 16, `Action` padding et gap 16, `.Icon` Warning padding 8, `.Content` gap 4 et retrait 48 (Spacing/2XL), textes du `.Content` vers Font/*. Descriptions posées (Popin, `.Spec`, `.Icon`, `.Content`). Signature : 0 différence. Capture : Popin à 1 pixel près ; planche des atomes avec un liseré d'anticrénelage (max 15/255) sur le bord du Slot, **identique après avoir retiré toutes les liaisons du `.Content`**, donc pas causé par elles : liaisons conservées.
- Différé : fond du Popin (#000 à 35 %, aucun Semantic) ; paddings 179 / 78 et gap 10 du cadre Popin ; gap 10 du Footer et des cadres Text ; titre à segments mixtes ; sets Deprecated non traités.
- **Incident corrigé** : pour forcer un recalcul d'auto-layout, j'ai réécrit le gap de tous les cadres de l'en-tête, ce qui a retiré les liaisons de gap. Reposées : les 4 de l'étape 1 (`Container` S, `Content` XS, `Title` S, `Action` M), les mêmes sur l'instance `.Spec` du Popin (I328:4362;…), et celles du kit (`Hero` 3XL, `Step` S). Les autres cadres (gabarit, Deprecated) n'avaient aucune liaison de gap avant (vérifié sur le gabarit jumeau 106:8292 et le Versionning) ; ils gardent leurs valeurs. Effet de bord : quelques sous-calques d'instance portent un override de gap égal à la valeur du maître (ex. `.Content/Text` 10).
- Frames do / dont (560 px de large : la boîte fait 480 px) :

| Règle ZeroHeight (texte exact) | Frame | nodeId |
|---|---|---|
| Name the action, Do : Name the action on the confirm button. | do · popin · named confirm action (560 x 300) | 583:237 |
| Name the action, Don't : Write "Confirm" for a delete. | dont · popin · confirm for a delete (560 x 300) | 583:275 |
| Short text, Do : Keep the text short. | do · popin · short text (560 x 300) | 583:313 |
| Short text, Don't : Use a Popin for long reading. | dont · popin · long reading (560 x 460) | 583:347 |

- Text only : « Use secondaryLabel when there are two valid exits. » (Do) et « Make Cancel mean "discard". » (Don't) : le Footer Figma n'a que deux boutons, un troisième ne peut pas être ajouté à une instance.
- Instances : `.Spec` (local) avec `.Icon` Error ou Warning, `.Content` Slot False, libellés Cancel / Delete / Confirm / Leave.
- Gabarits : description placeholder copiée de Checkbox remplacée ; statuts Ready / In code ; Versionning rempli (6 novembre 2026).
- Écarts notés dans Documentation : Error Figma = danger code (glyphe triangle partagé), Success sans ton code ; fond du backdrop sans Semantic et `--semantic-color-overlay-backdrop` en valeur brute ; gap Footer 10 contre 16 ; retrait 48 brut dans le SCSS ; Popin = cadre 1280 x 800 ; sets Deprecated ; `role="alertdialog"` posé deux fois.
- Contrôle visuel : 3 passes. Corrections : vignettes « Dialog » ramenées à 352 px de haut (la hauteur minimale avait été calculée avant la mise à l'échelle), vignettes en pleine largeur.

## Bilan
- 5 sections normalisées, `lost`, `miss` vides partout ; `overlaps` vide sauf les flèches préexistantes de la page Functional Notice.
- 24 frames do / dont créées (Snackbar 4, Tooltip 6 + 1 pour Button Icon, Functional Notice 6, Popover 4, Popin 4), 4 règles text only (Popover 2, Popin 2). Aucune frame `anatomy · …` : l'anatomie est dans chaque Documentation (repères numérotés).
- Frame pour la règle Button Icon « Unusual icons » : **560:169** (`do · button-icon · unusual icon with tooltip`, page Tooltip).
- Points à trancher par l'utilisateur : nommage des positions Tooltip / Popover (côté de la flèche en Figma, côté du panneau en code) ; Low / Default vert de Functional Notice ; Reversed bleu de Popover ; liaisons de l'illustration Popover ; gaps et paddings Figma différents du code (Snackbar 80, Functional Notice 16, Popover 24, Popin Footer 10).
- Kits non modifiés. Deux limites relevées dans le kit, corrigées à la main : après normalisation, les vignettes d'états gardent la largeur calculée pour 1280 px (rangées incomplètes) ; la hauteur minimale des aperçus est calculée avant `rescale`.
