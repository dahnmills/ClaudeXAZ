# Lot layout-2 : librairie Layout (`bbgSPUChd18EVNGijjoZGn`), 2026-11-16

Composants : Modal, Modal Header, Modal Content, Modal Footer (page Modal 2076:782), Drawer (page Drawer 2457:2). Modèle : Action > Button (4030:979). Kits : `doc-kit.js`, `board-kit.js`, `page-kit.js` (copies exactes). Rien publié, aucun commit, aucun MCP ZeroHeight, aucun token, collection ou mode créé, aucun composant, variante ou propriété créé, renommé ou supprimé. Maquette cible (2865:10424), pages Header, Side Navigation, Page Title, Overlay et autres non touchées. Captures de contrôle hors repo : `C:/Users/JDAHAN/AppData/Local/Temp/lay2/`.

## Étape 1 (Modal et Drawer, en un passage)

### Liaisons posées (même valeur résolue)
- Modal : Header 2076:7800 (padding 16 vers `Spacing/M`, 32 vers `Spacing/XL`, gap 24 vers `Spacing/L`, rayons haut 4 vers `Border/Radius/S`, trait bas 1 vers `Border/Size/S`) ; titre 2076:6788 : taille liée à `Core/Font/Size/24` (collection hors Semantic) remplacée par `Font/Title/Size/M` (24) ; Footer 2076:7806 (rayons bas 4 vers `Radius/S`, trait haut 1 vers `Size/S`, cadre 2076:6797 padding et gap 16 vers `Spacing/M`, cadre 2184:382 gap 16 vers `Spacing/M`) ; Content 2076:7825 (padding 24 vers `Spacing/L`, 32 vers `Spacing/XL`, gap 24 vers `Spacing/L`).
- Drawer : variantes Simple 2465:5788 et Flow 2471:14924 (rayons gauche 4 vers `Radius/S`), Top Part (padding et gap 16 vers `Spacing/M`), Content (padding 16 vers `Spacing/M`) ; atome Drawer Header 2465:5469 (padding 16 vers `M`, gap 4 vers `XS`, gap 8 vers `S` ; titre : taille 18 vers `Font/Title/Size/XS`, interligne 24 vers `Font/Title/Line Height/S`, interlettrage 0,2 vers `Font/Title/Letter Spacing/S`) ; Drawer Tabs (4 variantes : padding 16 vers `M`, gap 8 vers `S`, Mask padding 16 vers `M`) ; .Footer 2465:5673 (rayons bas 4 vers `Radius/S`, trait haut 1 vers `Size/S`, Actions padding horizontal et gap 16 vers `Spacing/M`).
- Descriptions posées sur Modal 2256:1556, .Modal Box 2076:8048, Header 2076:7800, Content 2076:7825, Footer 2076:7806, Drawer 2471:14923.

### Différé
- Fond du backdrop Modal (#000 à 35 %, 4 variantes) : aucun Semantic de couleur Overlay ; l'opacité d'une peinture ne se lie pas à `Measurement/Opacity/Overlay`.
- Padding horizontal 272 des variantes Modal, gaps 10 (Footer > Content, slots, Drawer Content), padding 20 de .Footer > Actions, gap 269 de Drawer Header > Actions : aucun Semantic de même valeur.
- Rayons 1000 de la Scrollbar (Round vaut 100, valeur différente) ; graisse 700 du titre Drawer Header (aucun Semantic à 700) ; rectangles noirs et dégradés du masque de Drawer Tabs (masques, pas des couleurs).
- Tout ce qui appartient aux instances imbriquées (Button, Button Icon, Scrollbar, Flyout Menu) : rien n'est lié dessus, la cascade reste aux atomes.

### Incident et correction (à connaître pour les lots suivants)
- Le premier passage a aussi lié des propriétés sur les instances imbriquées (Button, Button Icon, Scrollbar, Header/Content/Footer dans .Modal Box, Drawer Header et Tabs dans Drawer) : chaque liaison y devient une surcharge qui couperait la cascade depuis l'atome. Retirer la liaison (`setBoundVariable(k, null)`) laisse une surcharge brute : j'ai donc fait `resetOverrides()` sur ces 25 instances puis rétabli leurs surcharges d'origine (tailles, positionnement absolu, alignements, interactions, textes, propriétés des items de Flyout, paddings 4 des Button Icon S des onglets).
- `resetOverrides()` a aussi effacé les permutations d'icône imbriquées (non listées dans `overrides`) : rétablies à la main d'après la capture « avant » et les brouillons de la page Drawer : Close (2024:3446) sur le bouton de fermeture du Header et des deux variantes Drawer, Arrow Left (2184:1331) sur Back du Footer et de Drawer Header, Chevron-Small Down (2457:7082) à côté du titre Drawer Header, Chevron-Small Left / Right (2459:549 / 2458:508) sur les flèches de Drawer Tabs.

### Vérification
- Captures du gabarit Modal 2076:17777 et Drawer 2465:6993, avant / après, comparées pixel à pixel : Drawer identique au md5 près ; Modal : 33 pixels d'anticrénelage sur le libellé Back de l'atome Footer, dont l'export à 2x est octet pour octet identique à celui du Footer de .Modal Box (lui-même inchangé) : bruit de rendu, pas un changement.
- Signature de géométrie (positions absolues, tailles, paddings, gaps, rayons, traits, fills, textes) avant / après : identique pour les 4 variantes Modal, Drawer Flow, Drawer Tabs Left / Center / Right et Drawer Simple (6 instances) ; différente pour les autres racines, dont les instances vivent aussi sur la page Overlay où l'autre agent travaille (nombre d'instances passé de 78 à 90 pendant la mesure, et une instance orpheline hors page). Pour .Modal Box (10 instances, toutes sur la page Modal) la signature diffère sans écart visible : les brouillons (section Explo, 2 instances Modal isolées) ont été contrôlés en capture, rendu normal. Écart noté, non expliqué.

## Modal (page 2076:782)
- Section `Modal` **4077:1388** (9622 x 6413) : Versionning 2076:17623 | header 01 2076:17777 (restylé) | Documentation **4077:1389** | Do/Don't **4077:1460**. `lost`, `miss`, `overlaps` vides.
- Header 01 rempli : description (« Component description » avant), badges Design Ready et Tech In code (Draft / Draft avant). Version laissée à 2.0.0 (components.json : 1.0.0, écart dans les Notes).
- Frames do/dont (fond `Static/Background/Main/Secondary`, 400 x 260 : le Modal est un cadre 1280 x 800, réduit à 0,3 ; vraies instances de Modal et d'Input Text de la librairie Data Entry, boutons sans icône via `.Content > Icon = None`) :

| Règle (texte exact, `modal.md`) | Frame | nodeId |
|---|---|---|
| Do : Pick the smallest size that fits the content. | do · modal · smallest size that fits | 4069:701 |
| Don't : Use xlarge for a short form. | dont · modal · xlarge for a short form | 4069:759 |
| Do : Suspend the modal while a Confirm Dialog asks a question. | do · modal · suspended under a confirm dialog | 4069:817 |
| Don't : Open a dialog on top of a visible modal. | dont · modal · dialog on top of a modal | 4069:875 |

- Text only : « Keep one task per modal. » / « Chain unrelated tasks inside one box. » (non dessinable sans contexte métier).
- Pas de Confirm Dialog dans Figma : la question est figurée par un Modal Small « Discard changes? » (noté dans la doc).
- Pas de frame anatomy (l'anatomie est dans Documentation, sur .Modal Box).

## Modal Header, Modal Content, Modal Footer (page 2076:782)
- Les trois COMPONENT (Header 2076:7800, Content 2076:7825, Footer 2076:7806) vivent dans le header 01 de Modal (bloc « Atoms ») : ils y restent (un objet qui contient des COMPONENT ne bouge pas). Leur section ne contient donc que la Documentation (même cas que « page sans gabarit »).
- Section `Modal Header` **4077:1521**, Documentation **4077:1522**.
- Section `Modal Content` **4077:1601**, Documentation **4077:1602**.
- Section `Modal Footer` **4077:1681**, Documentation **4077:1682**.
- Empilées sous `Modal` à 400 px d'écart. Pas de Do/Don't : `modal.md` ne porte aucune règle propre à ces parties.
- Canevas d'anatomie et vignettes en `Static/Background/Main/Primary` pour Header et Footer (gris sur gris sinon).
- To review : section `Modal - To review` **4077:1753**, sous la pile : 2e header « Documentation » 2076:17643 (ancien Do/Dont), section `Explo` 2290:6617 (essais de Modal à panneau bleu), 2 instances Modal isolées 3188:644 et 2509:651, `Vector 6` 2509:716. Aucun COMPONENT dedans.

## Drawer (page 2457:2)
- Section `Drawer` **4080:1818** (6040 x 4690) : header 01 2465:6993 (restylé) | Documentation **4080:1819** | Do/Don't **4080:1890**. Pas de cadre `Versionning` sur la page (signalé). `lost`, `miss` vides.
- Header 01 rempli : description, badges Ready / In code (Draft / Draft avant). Version 2.0.0 laissée.
- Frames do/dont (360 x 360, Drawer Simple réduit à 0,42, Tabs, Scroll, Flyout et Back éteints, titre « Filters », pied Cancel / Apply ; le Button Apply du don't est une vraie instance du Button Primary de la librairie Action posée sur l'en-tête) :

| Règle (texte exact, `drawer.md`) | Frame | nodeId |
|---|---|---|
| Do : Keep one task per drawer. | do · drawer · one task per drawer | 4070:3093 |
| Don't : Stack a drawer on another drawer. | dont · drawer · drawer stacked on a drawer | 4070:3163 |
| Do : Put the decisive actions in the footer. | do · drawer · decisive actions in the footer | 4070:3284 |
| Don't : Put Apply in the header. | dont · drawer · apply in the header | 4070:3345 |

- Text only : « Keep the page visible and usable. » / « Use the drawer to force a decision: use a Modal. » (il faudrait une page derrière, donc un dessin).
- To review : section `Drawer - To review` **4080:1943** : 2e header « Documentation » 2667:10083 (avec un Drawer annoté de propriétés, brouillon). Aucun COMPONENT dedans.
- Laissés en place, signalés : le nuage de brouillons au-dessus du header (8 cadres `Side Panel (Details - V4)`, une quarantaine de vecteurs et textes d'annotation, onglets isolés, une instance Drawer et une Drawer Header isolées) contient deux COMPONENT, `Component 1` 2459:1427 et `Frame 411` 2457:6367 : il ne part pas en To review. Les seuls `overlaps` de la page sont entre ces brouillons, aucun avec les sections du lot.

## Écarts Figma / code (dans les Notes des docs, non corrigés)
- Modal : taille par défaut Small (Figma) / medium (code) ; xlarge 1080 (Figma) / 1280 (code) ; Footer Back affiché par défaut (Figma) / `showBack` false sur ds-modal mais true sur ds-modal-footer ; booléen Header > Back relié à aucun calque ; backdrop sans token Semantic (Figma) et rgba brut (code) ; `footer`, `suspended`, `closeOnBackdrop`, `closeOnEscape` en code seulement ; pas de Confirm Dialog dans Figma ; variante Small : Back et bouton Tertiary se chevauchent dans le pied (400 px trop étroit).
- Modal Header : taille du titre Semantic (Figma) / Foundation 24 en direct (code) ; gap 24 (Figma) / 16 (code).
- Modal Content : slot fixe 716 px, ne suit pas la largeur de la boîte en Small et xlarge ; rayons de Scrollbar 1000 (Figma) / Round (code).
- Modal Footer : gap 10 sans token ; icônes par défaut sur les boutons du pied Figma.
- Drawer : titre 18 / 700 / 0,2 (Figma) / Title S 20 / 600 (code) ; Tabs, Breadcrumb, Flyout, Type Flow en Figma seulement ; Back par défaut vrai (Figma) / faux (code) ; fermeture hors de l'en-tête (Figma) / dans la rangée d'en-tête (code) ; Content est un cadre propre, pas le Content partagé avec Modal que dit `drawer.md` ; gap d'en-tête 4 (Figma) / 8 (code) ; pas de focus trap (non modal), focus à l'ouverture et retour à la fermeture « To be defined » ; Tab Slot vide par défaut (le repère Drawer Tabs vise une rangée vide).

## Contrôle visuel (2 passes)
- Passe 1 : vignettes d'états Modal géantes (min-height calculée avant le rescale, recalculée) ; Header et Footer invisibles sur le canevas gris (canevas et vignettes passés en blanc) ; slot de contenu des illustrations plus large que la boîte Small (Fill posé dans l'instance) ; boutons des illustrations avec icône crayon (Icon = None).
- Passe 2 : sections complètes Modal, Modal Footer et Drawer : repères d'anatomie sur leur cible, pas de texte coupé, descriptions Hero sur une ligne, planches équilibrées.

## Points ouverts
- Signature .Modal Box différente sans écart visible (voir étape 1).
- Les deux règles Do de Drawer (« one task », « decisive actions ») ont des illustrations presque identiques : à différencier si l'utilisateur le souhaite (contenu dans le slot).
- Versionning Modal non rempli (pas de changelog daté) ; pas de Versionning sur la page Drawer.
- Liens ZeroHeight sans URL (pages non publiées, ids non connus).
