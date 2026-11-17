# Lib rollout, lot data-entry-3 : librairie Data Entry (`1wVY9FfjONIX6us9JmIm7U`)

Date : 2026-11-16. Modèle : Action > Button (4030:979). Kits : doc-kit.js, board-kit.js, page-kit.js (non modifiés).
Rien publié, aucun commit, pas de MCP ZeroHeight. Aucun composant, variante, propriété, token, collection ni mode créé, renommé ou supprimé.

## Périmètre et pages (inventaire Figma)

| Composant du lot | Page Figma | Composant Figma | .md |
|---|---|---|---|
| Select + Multi Select | Dropdown (2045:2045) | set `Dropdown` 2046:720 (un seul composant pour les deux) | dropdown.md (couvre les deux) |
| Dropdown Flyout Menu | Dropdown (2045:2045) | set `Dropdown Flyout Menu` 2049:5070 | dropdown-flyout-menu.md |
| Standalone Dropdown | 🆕 Standalone Dropdown (3022:800) | set `Standalone Dropdown` 3023:214 | standalone-dropdown.md |
| Select Button | Select Button (2220:909) | set `Select Button` 2221:1490 | select-button.md |

- Pas de .md propre à Select ni à Multi Select : `dropdown.md` les couvre (Figma a un seul `Dropdown`, le code en a deux, `ds-select` et `ds-multi-select`). Pas de page Figma Select ou Multi Select : une seule section `Dropdown` les documente, le code des deux composants est dans le spec.
- Règles Do / Don't : la section `## Do / Don't` des .md (une ligne « Do X. Don't Y. » par règle). Texte repris tel quel, sans le mot « Do » / « Don't » en tête (porté par le bandeau de la carte). Titre de la rubrique (`key`) : nom court choisi par moi, les .md n'en donnent pas.
- Statut ZeroHeight : `drafted` dans components.json, aucune page ZeroHeight créée pour ces composants (lien ZeroHeight = « Page not created yet »).

## Select Button (page 2220:909)

- Section `Select Button` **3158:3704** : Versionning 2221:1275 | 01 `_Design system header` 2221:1137 (restylé) | Documentation **3158:3705** | Do/Don't **3158:3776**. `lost`, `miss`, `overlaps` vides.
- To review `Select Button - To review` **3158:3830** : 2221:1295 (2e gabarit « Documentation », ancien Do / Dont vide, sans COMPONENT).
- Liaisons posées (set 2221:1490, 8 variantes) : padding 8 vers Spacing/S (32), gap 4 vers Spacing/XS (8), rayon 4 vers Radius/S (32 coins), contour 1 vers Border/Size/S et 2 vers Border/Size/M (32 côtés). Couleurs et textes déjà liés au Semantic, aucune liaison Foundation trouvée. Signature de géométrie identique avant/après, capture identique. 0 instance du set dans le fichier.
- Différé : aucun.
- Description du set : posée (usage + `ds-select-button`).
- Frames do/dont (section ZeroHeight vidée par le kit, frames reparentées dans 03) :

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Do : Keep all buttons of a set the same size. | do · select-button · same size | 3156:2578 |
| Don't : Mix buttons with and without sub labels in one row. | dont · select-button · mixed sub labels | 3156:2604 |
| Do : Say in the group label if several choices are allowed. | do · select-button · group label says single or multiple | 3156:2630 |
| Don't : Let users guess single or multiple selection. | dont · select-button · selection type left to guess | 3156:2657 |
| (Autre illustration) Anatomy | anatomy · select-button | 3156:2956 |

- Text only : aucune.
- Gabarits remplis : statut Design Done vers Ready, Tech Draft vers In code ; Versionning (template vide) rempli : Ready, v1.0.0, Added « Initial version (date unknown). », Documented.
- Écarts (dans Notes du 02) : libellé bleu en Figma au repos (Interactive/Text/Strong) contre Static/Text/Main/Primary en code ; padding 8 partout en Figma contre 16/8 en code ; contour 2 px sélectionné en Figma contre 1 px en dur dans le SCSS, couleur de contour au repos différente ; Disabled par couleurs Disabled (Figma) contre opacité (code) ; pas de focus ni en Figma ni en code ; icône toujours rendue en code, pas de swap de glyphe en Figma.
- Frames illustrées en 520 px de large (3 boutons de 160 px).

## Standalone Dropdown (page 3022:800)

- Section `Standalone Dropdown` **3160:1222** : Versionning 3022:1249 | 01 `_Design system header` 3022:801 (restylé) | Documentation **3160:1223** | Do/Don't **3160:1294**. `lost`, `miss`, `overlaps` vides.
- To review `Standalone Dropdown - To review` **3160:1352** : 3022:1101 (2e gabarit « Documentation », sans COMPONENT).
- **Signalé** : le set `.Chevron` (3067:232, atome privé, contient des COMPONENT) était posé à même la page sur le Versionning (32, 192). Il ne peut pas aller en To review : déplacé hors de la section, à gauche (-304, 160), sans autre changement. À ranger dans un bloc Atoms du 01 si on le veut (comme Button).
- Liaisons posées : contour 4 du cadre `Border Focus` vers Border/Size/L (8 variantes, 32 côtés). Le reste (gap, rayons, largeur du chevron, couleurs, textes) était déjà lié au Semantic. Aucune liaison Foundation. Signature identique avant/après sur le set, `.Chevron` et 188 instances (pages Search Bar, Search Bar Multi, More Criteria, Filters).
- Différé : aucun.
- Description du set : remplacée par une phrase d'usage (l'ancienne commençait par « New · 2026-11 · » et listait les tons) ; `.Chevron` gardé tel quel (déjà une description d'usage).
- Frames do/dont :

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Do : Place it right above or beside the content it changes. | do · standalone-dropdown · next to the content it changes | 3158:9459 |
| Don't : Put it far from that content. | dont · standalone-dropdown · far from the content | 3158:9486 |
| Do : Use it for light, reversible display choices. | do · standalone-dropdown · light display choice | 3158:9522 |
| Don't : Use it for a required form value ("Country *"): it has no label, error or helper text. | dont · standalone-dropdown · required form value | 3158:9548 |
| Do : Keep the check in its fixed slot. | do · standalone-dropdown · check in its fixed slot | 3158:9574 |
| Don't : Add an icon only to the selected option. | dont · standalone-dropdown · icon only on the selected option | 3158:9679 |
| (Autre illustration) Anatomy | anatomy · standalone-dropdown | 3158:9778 |

- Text only : aucune. Listes de résultats dessinées en texte (style Body, variables Semantic) : pas de composant de ligne de liste dans Data Entry. Don't « icon only » : instance de Dropdown Flyout Menu (Multi-Select=False) dont le cadre Icon des options non choisies est masqué par override (rien de détaché).
- Gabarits : header (New / In code) et Versionning (v1.0.0, 3 novembre 2026) déjà remplis, non touchés.
- Écarts (Notes du 02) : anneau de focus 4 px (Figma) contre 3 px (code) ; options, value, flyoutAlign et libellé vide = option choisie en code seulement ; contenu projeté `slot="icon"` sans équivalent Figma ; Storybook range le composant sous Action.
- Contrôle visuel : repère du chevron recalé (la pastille sur le sommet du chevron le faisait lire comme une coche) ; cartes Do/Don't d'une même rangée alignées en bas (Illustration en FILL), même correctif que le lot E.

## Dropdown = Select + Multi Select (page 2045:2045)

- Section `Dropdown` **3165:2103** (-1936, -3019) : Versionning 2193:2407 | 01 `_Design system header` 2046:1110 (restylé) | Documentation **3165:2104** | Do/Don't **3165:2175**.
- To review `Dropdown - To review` **3165:2233** (400 px sous la section) : 2046:1204 (2e gabarit « Documentation » de Dropdown) et 3008:817 (instance de Dropdown posée seule sur la page, brouillon).
- Page partagée avec Dropdown Flyout Menu : sections empilées à 400 px (Dropdown, son To review, Flyout, son To review). `lost`, `miss` vides ; `overlaps` vide après la 2e normalisation (la 1re signalait seulement les cadres Flyout pas encore rangés).
- Versionning : les deux cadres étaient des gabarits vides. Le .md attribue 2193:2376 à Dropdown et 2193:2407 au Flyout, mais sur la page 2193:2407 est à côté du header Dropdown : j'ai suivi la position (2193:2407 pour Dropdown, 2193:2376 pour le Flyout). À corriger dans les .md si l'inverse était voulu. Remplis : Ready, v1.0.0, Added « Initial version (date unknown). », Documented.
- Header : Design Done vers Ready, Tech Draft vers In code.
- Liaisons posées (set 2046:720 + atomes `.Input Content` x3, `.Append`, `.Value` x3, `.Tags` x3, `.Text` x2) : gap 2 vers Spacing/XXS (8), padding 8 vers Spacing/S (16), gaps 8 vers Spacing/S (9) et 4 vers Spacing/XS (3), rayons 4 vers Radius/S (32 coins), contours 1 et 2 vers Border/Size/S et M (40 côtés) ; 7 textes sans style des atomes `.Tags` / `.Text` liés à Font/Family, Text Style/Size/M et Line Height/S ou M. Aucune liaison Foundation. Signature identique sur les sets et 100 instances.
- Différé (pas de Semantic de même valeur) : padding vertical 6 et gap 10 du `Container` (8 variantes), gap 10 de `.Append`, rayon 6 de `Border Focus` (8 variantes). Gaps 62 / 22 de `.Tags` : SPACE_BETWEEN, laissés.
- Description du set : posée (usage, `ds-select` et `ds-multi-select`).
- Frames do/dont :

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Do : Use a dropdown for long, familiar lists. | do · dropdown · long familiar list | 3160:8540 |
| Don't : Hide two options behind a dropdown. | dont · dropdown · two options hidden | 3160:8638 |
| Do : Keep the selected value visible in the field. | do · dropdown · value kept after closing | 3160:8736 |
| Don't : Reset the value when the list closes. | dont · dropdown · value reset after closing | 3160:8874 |
| Do : Show the "(+x more)" counter when tags overflow. | do · dropdown · more counter for overflow | 3160:9001 |
| Don't : Let tags push the field to two lines. | dont · dropdown · tags on two lines | 3160:9054 |
| (Autre illustration) Anatomy | anatomy · dropdown | 3161:3691 |

- Text only : aucune. Frames « value kept / reset » en 640 px (liste ouverte et champ fermé côte à côte). Don't « two lines » : `List` des tags passée en WRAP et `Container` en HUG par override d'instance (rien de détaché). Libellés de champ : `.Label` du composant (semi-bold, une ligne).
- Écarts (Notes du 02) : un composant Figma pour deux composants de code (multi-select en 0.3.0) ; bordure et placeholder différents entre Figma, `ds-select` et `ds-multi-select` ; Read Only, Filtering, Slot et statuts de helper en Figma seulement, « Property 3 » propriété résiduelle ; valeurs brutes 6 / 10 ; texte de valeur en tailles mixtes 14/16.

## Dropdown Flyout Menu (page 2045:2045)

- Section `Dropdown Flyout Menu` **3165:4082** (-1936, 3900) : Versionning 2193:2376 | 01 `_Design system header` 2049:578 (restylé) | Documentation **3165:4083** | Do/Don't **3165:4154**. `lost`, `miss`, `overlaps` vides.
- To review `Dropdown Flyout Menu - To review` **3165:4208** : 2049:969 (2e gabarit « Documentation », il porte l'ancienne liste de couleurs en noms Foundation), 2862:1431 (cadre `Icon Functional` isolé), 2862:1444 (`Vector 1`), 2862:1487 (`Frame 38`, essai Dropdown + liste). Aucun ne contient de COMPONENT.
- Header : Design Done vers Ready, Tech Draft vers In code ; description du header corrigée (c'était le texte du Dropdown copié).
- Liaisons posées (sets 2049:5070, `.Item Properties` 2049:5154, `.Item` 2049:5143) : paddings 8 / 4 / 32 / 16 vers Spacing/S, XS, XL, M, gaps 4 vers Spacing/XS (12), rayons 4 vers Radius/S (16), contours 2 et 1 vers Border/Size/M et S (29). **Foundation remplacé** : fond du panneau `foundation/color/neutral/white` vers Color/Static/Background/Main/Primary (4 variantes), contours `Focus` `foundation/color/action 2/blue/450` vers Color/Interactive/Border/Focus (7), même valeur résolue vérifiée. Signature identique sur les sets et 134 instances.
- Différé : padding vertical 6 des lignes (`.Item Properties` 4 états, `.Item` Title) et gap 10 du cadre Icon : pas de Semantic à 6 ni à 10.
- Description du set : posée (usage, coche dans l'emplacement fixe de 20 px, `ds-flyout-menu` + `ds-flyout-menu-item`).
- Frames do/dont :

| Règle (.md, texte exact) | Frame | nodeId |
|---|---|---|
| Do : Reserve the 20px check slot on every single-choice item so labels stay aligned. | do · dropdown-flyout-menu · check slot on every item | 3161:4514 |
| Don't : Show an icon only on the selected item. | dont · dropdown-flyout-menu · icon only on the selected item | 3161:4596 |
| Do : Group long lists with section titles. | do · dropdown-flyout-menu · groups with section titles | 3161:4678 |
| Don't : Create a group for a single option. | dont · dropdown-flyout-menu · group for a single option | 3161:4767 |
| (Autre illustration) Anatomy | anatomy · dropdown-flyout-menu | 3161:4853 |

- Text only : aucune. Choix unique : coche dans l'emplacement fixe de 20 px (`Selected` de `.Item Properties`) ; le Don't masque le cadre Icon des options non choisies par override, pour montrer les libellés qui sautent.
- Écarts (Notes du 02) : pas de composant « dropdown flyout » en code (composition `ds-flyout-menu` + `ds-flyout-menu-item`), Storybook sous Action ; padding de ligne 6 (Figma) contre 8 / 32 (code) ; survol Neutral/Hover (Figma) contre Light/Alt/Hover (code) ; Select All et Separator sans code ; Scrollbar placé hors du panneau ; liaisons Foundation corrigées.

## Contrôle visuel (toutes pages)

- 2 passes au moins par composant (frames, Documentation, planche, section complète).
- Corrigé : repères d'anatomie posés sur les vraies bornes des calques (le placement par fractions du kit traversait les textes) dans les 4 cadres 02 et les 4 frames anatomy ; ombres de liste coupées (colonnes en clipsContent) ; compteur « (+3 more) » qui chevauchait un tag (tag raccourci) ; cartes d'une rangée Do/Don't alignées en bas (hauteur de rangée = carte la plus haute, Illustration en FILL), sur Standalone Dropdown, Dropdown et Flyout ; descriptions du Hero du Flyout sur deux lignes (chemin Code raccourci dans Resources, formulation courte).
- Toutes les frames do/dont/anatomy gardent leur id, leur nom et leur taille d'origine (contrôlé par script après normalisation).

## À décider

1. `.Chevron` (Standalone Dropdown) : laisser hors section, ou l'ajouter dans un bloc Atoms du 01 ?
2. Versionning de la page Dropdown : confirmer l'attribution par position (2193:2407 Dropdown, 2193:2376 Flyout), contraire au .md.
3. Valeurs brutes 6 et 10 (Dropdown, Flyout) : créer des Semantic n'est pas permis ; à aligner sur 8 ou 4 dans une refonte, ou garder en dur.
4. Pas de page ZeroHeight pour ces 5 composants : les règles viennent des .md locaux, à reprendre telles quelles à la création des pages.
