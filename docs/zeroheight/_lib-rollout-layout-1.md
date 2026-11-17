# Lot layout-1 : librairie Layout (`bbgSPUChd18EVNGijjoZGn`), 2026-11-16

Composants : Header, Side Navigation, Side Navigation Item, puis décisions utilisateur B1 à B3 (Page Title, Filter Drawer, Spotlight, Shortcuts Panel). Modèle : Action > Button (4030:979). Kits `doc-kit.js`, `board-kit.js`, `page-kit.js` collés tels quels. Rien publié, aucun commit, aucun token, collection ou mode créé, aucun composant, variante ou propriété créé, renommé ou supprimé. Maquette cible (2865:10424) et pages Home page, Search, Layout, Drawer, Modal non éditées (voir toutefois le recalage d'icônes de Side Navigation). Captures de contrôle hors repo : `C:/Users/JDAHAN/AppData/Local/Temp/lay1/`.

## Méthode de vérification de l'étape 1
- Signature dans le même appel que la liaison : lignes triées (id, position absolue, taille, opacité, paddings, gap, 4 rayons, épaisseurs de trait, fills, strokes, texte) de chaque set ET de toutes ses instances du fichier (`getInstancesAsync`, écrans Search et Home page compris), avant puis après, diff ligne à ligne. Toute liaison qui produit un diff est annulée dans le même appel.
- Chaque liaison n'est posée que si la valeur résolue du Semantic est égale à la valeur en place (contrôle à l'exécution).
- Capture `get_screenshot` du set ou du gabarit avant/après, comparée au pixel (petit décodeur PNG en node, `pngdiff.js`).
- La collection Semantic n'a qu'un mode (Default) : aucune bascule de mode possible dans les fichiers consommateurs.

## Header (page 2191:3044)
- Section `Header` **4073:1445** (6594 x 3930). 01 Component = gabarit 2290:7246 (restylé, Hero), Documentation **4073:1446**, Do/Don't **4073:1517**. Versionning 2290:7183 (laissé vide, pas de changelog daté).
- Étape 1 (set 2390:1583, 2 variantes, 26 instances dans le fichier : Layout 2, Search 20, Home page 4) :
  - posées (8) : `Content` padding droit 16 vers `Measurement/Spacing/M` ; gap `Menu` 24 et gap `Shortcuts` 24 vers `Spacing/L` ; gap `Actions` 8 vers `Spacing/S` (x 2 variantes). Fond déjà lié à `Color/Static/Background/Brand`.
  - différé : padding 12 (haut, bas, gauche) et gap `Left` 72 : aucun Semantic à ces valeurs. Paddings et rayons des instances imbriquées (Tab, Button Icon, Logo) : propriété des atomes, non touchés.
  - description posée sur 2390:1583.
  - vérification : diff lié / délié dans le même appel = 0 ligne sur 1814 (set + 26 instances). Capture du set identique (md5 identique). Un premier hash global avait différé : cause = ordre non déterministe de `getInstancesAsync` (lignes non triées) ; avec lignes triées, 0 différence.
- Frames do/dont (1320 x 140 : la barre fait 1280, largeur imposée par le composant ; la planche passe en colonne, Do au-dessus du Don't) :

| Règle (texte exact, `header.md`) | Frame | nodeId |
|---|---|---|
| Do mark exactly one area as selected. | do · header · one area selected | 4065:587 |
| Don't select two items or none on a page that belongs to an area. | dont · header · two areas selected (Tab Tools en Selected True) | 4065:679 |
| Do keep shortcuts to the 3 icons drawn at Size M. | do · header · three icon shortcuts | 4065:786 |
| Don't add text buttons in the shortcuts zone. | dont · header · text buttons in shortcuts (2 Button d'Action, Reversed, posés dans la bande) | 4065:878 |
| Do use the reversed atoms on the blue band. | do · header · reversed atoms | 4065:1004 |
| Don't place default (non-reversed) atoms on Brand Blue. | dont · header · default atoms on brand blue (Tab Tone Default, Button Icon Reversed False) | 4065:1096 |

- Text only : aucune. Pas de frame anatomy (anatomie dans la Documentation).
- To review : section `Header - To review` **4073:1570** : 2e gabarit `_Design system header` 2290:7203 (copié de Modal, « Do / Dont » vide), 2 instances `.Logo Qirin` (3287:15052, 3287:15053), 2 textes `Application Name` (3287:15072, 3287:15073), une instance `.Flyout` isolée (2390:1010). Aucun COMPONENT dedans.
- 01 rempli : description, Design Ready, Tech In code (badges Success). Version laissée à 2.0.0.
- Écarts (Notes de la doc) : padding 12/16/12/12 (Figma) contre 8/16/8/8 (code) ; gap logo/menu 72 contre 40 ; gap des icônes 8 contre 4 ; le `.Item` du .md correspond aux instances Tab d'Action dans Figma ; Menu Open sans input code ; version 2.0.0 contre 1.0.0 ; aria-label en français ; **Menu Open=True rend la même barre que False** : le menu ouvert est une instance Flyout Menu (2673:18485) posée par-dessus le set, pas un calque de la variante.

## Side Navigation (page 2083:6930)
- Section `Side Navigation` **4075:1767** (6594 x 4726), posée en y 2300 sous les 3 sets de groupes. 01 = gabarit 2083:7469, Documentation **4075:1768**, Do/Don't **4075:1839**. Versionning 2083:7406.
- Étape 1 (sets 2083:6932 Side Navigation, 2083:7074 .Side Navigation Item, et les 3 `.Item` internes 2083:6958, 2083:7028, 2083:7003 : 439 liaisons au total, détail des `.Item` dans la section suivante) :
  - Side Navigation : fonds des variantes, de `Frame 169` et de `Bottom` : `qrn foundation/color/grey/025` remplacé par `Color/Static/Background/Main/Secondary` ; paddings et gaps 8 vers `Spacing/S` ; trait haut de `Bottom` (#D9D9D9 en dur) vers `Color/Static/Border/Subtle/Tertiary`, épaisseur 1 vers `Border/Size/S` ; `Frame 172` (filet droit, `grey/100`) vers `Static/Border/Subtle/Tertiary` (comme le code).
  - différé : gap 45 des variantes (space between, aucun Semantic).
  - description posée sur 2083:6932.
  - vérification : appliqué groupe par groupe (8 groupes), diff lié / non lié = 0 sur 6670 lignes pour chaque groupe.
- **Écart de rendu à signaler** : les deux premiers essais de liaison ont échoué en cours de script (police mixte, puis propriété `fontFamily` absente des TEXT), en laissant des liaisons partielles, et un 3e essai a été annulé. Ces écritures ont déclenché un recalcul de mise en page des instances imbriquées : les icônes des items (instances `Icon Functional` dans `.Item`) se sont recalées d'environ 1,5 px en x et 0,5 px en y (de 1669,55 à 1668 par exemple), dans le set et dans ses instances du fichier (écrans Search et Home page compris). Ce n'est pas la valeur liée qui bouge (diff lié / non lié = 0 ensuite) : c'est une mise en page périmée que Figma a recalculée, et que n'importe quelle édition du maître aurait recalculée aussi. Capture du gabarit : 2085 px différents, tous dans la zone des icônes. Pas d'annulation propre possible ; à valider par l'utilisateur.
- Frames do/dont (360 x 440 et 360 x 180, vraies instances de Side Navigation et de .Side Navigation Item) :

| Règle (texte exact, `side-navigation.md`) | Frame | nodeId |
|---|---|---|
| Do put the panel toggle at the bottom. | do · side-navigation · toggle at the bottom (instance ramenée à 400 px de haut) | 4066:648 |
| Don't hide the toggle when the panel is expanded. | dont · side-navigation · toggle hidden when open (Bottom masqué) | 4066:844 |
| Do use destinations only. | do · side-navigation · destinations only | 4066:1040 |
| Don't mix actions (Export, Delete) into the list. | dont · side-navigation · actions in the list | 4066:1082 |

- To review : section `Side Navigation - To review` **4075:1888** : 2e gabarit 2083:7426 (« Documentation » vide) et un vecteur isolé `Shape` 3132:14492.
- Non rangés, à signaler : les 3 COMPONENT_SET de groupes `Company Information` 2348:5725, `Assessment` 2366:935, `Tools` 2368:2293 restent en vrac en haut à gauche de la page (ils contiennent des composants, donc jamais en To review ; aucun équivalent code).
- 01 rempli : description, Ready / In code. Version laissée à 2.0.0.

## Side Navigation Item (même page)
- Section `Side Navigation Item` **4075:1897** (4080 x 4475), 400 px sous le To review de Side Navigation. Documentation **4075:1898**, Do/Don't **4075:1969**. **Pas de 01 propre** : le set `.Side Navigation Item` 2083:7074 et ses `.Item` sont dans le bloc Atoms du gabarit de Side Navigation (2083:7469) ; laissés en place, 02 et 03 normalisés seuls (décision utilisateur pour les pages sans gabarit). Logo du fil d'Ariane : instance temporaire du logo, supprimée ensuite.
- Étape 1 : `.Side Navigation Item` : fond blanc en dur vers `Static/Background/Main/Primary`. `.Item` (3 sets, 20 variantes) : padding gauche 32 (Level -1) vers `Spacing/XL` ; rayons 8 vers `Border/Radius/M` ; opacité 0,4 vers `Measurement/Opacity/Disabled` ; `Content` paddings et gap 8 vers `Spacing/S`, rayons vers `Radius/M` ; gap de `Label` et padding droit de `Icon` 8 vers `Spacing/S` ; fonds non sélectionnés (`grey/025`, `050`, `100`) vers `Interactive/Background/Light/Alt/Default`, `Hover`, `Active`, `Disabled` ; sélectionnés (`action/blue/500`, `600`) vers `Interactive/Background/Strong/Default`, `Hover`, `Disabled` ; set parent (`soft/blue/150`) vers `Interactive/Background/Light/Default` et `Disabled` ; textes #414141 vers `Static/Text/Main/Secondary`, blancs (`neutral/white`) vers `Interactive/Text/Neutral/<State>`, #007AB3 (`action/blue/500`) vers `Static/Text/Main/Alt/Primary` ; taille, interligne, interlettrage, graisse vers `Font/Text Style/*` (L, Regular, None).
  - différé : `Font/Family` (non posée : contrôle d'égalité famille / variable non concluant) ; graisse des libellés du set parent 2083:7003 (pas Regular) ; gap 10 (aucun Semantic) ; Active sélectionné `action/blue/700` #003781 (seul Semantic de même valeur : `Static/Background/Brand`, de sens différent ; `Interactive/Background/Strong/Active` vaut #075994) ; Hover #E6F4F6 et Active #CFE9EE du set parent (aucun Semantic).
  - description posée sur 2083:7074.
- Frames do/dont :

| Règle (texte exact, `side-navigation.md`) | Frame | nodeId |
|---|---|---|
| Do keep exactly one selected item. | do · side-navigation-item · one selected item | 4066:1125 |
| Don't use the selected style to show a hover or a recent visit. | dont · side-navigation-item · two selected items | 4066:1167 |

- Décision : le .md est commun aux deux composants ; la règle de sélection (niveau item) est sur la planche de l'item, les règles toggle et destinations sur celle de Side Navigation. ZeroHeight vise les frames par id, la page ZH unique les retrouve toutes.
- Écarts (Notes) : hover gris (Figma) contre teinte bleue et texte strong (code) ; Has Child, Level, Expandable sans input code ; Active sans style code ; focus non dessiné ; 3 variantes sur 4 (Selected False + Has Child True absente) ; hauteur 40 sans Semantic.

## Résultats du kit (3 composants)
`miss` vide (buildDoc, buildBoard, normalize) ; `lost` vide (12 frames do/dont, ids et noms intacts) ; `overlaps` vide sur les deux pages. Six sections Documentation par composant.

## B1. Cadres 01 Component créés (Page Title, Filter Drawer, Spotlight, Shortcuts Panel)
- Gabarit : clone du `_Design system header` de Side Navigation (2083:7469, déjà restylé avec le Hero de `styleHeader`), puis suppression du bloc Atoms et du set cloné du bloc Component : 0 COMPONENT restant dans chaque clone avant son déplacement. Textes posés : fil d'Ariane, titre, description, version (components.json), statuts (Design In review ou Draft en Warning, Tech In code en Success).

| Composant | 01 créé | Maîtres rangés dans le bloc Component (id et taille inchangés) | Section |
|---|---|---|---|
| Page Title | 4077:7123 | Page Title 4010:13 | 4046:304 (6040 x 4235) |
| Filter Drawer | 4077:7343 | Filter Drawer 4015:1824, Filter Section 4013:132 (sous-composant) | 4047:3512 (6040 x 5459) |
| Spotlight | 4077:7550 | Spotlight 4019:755, Spotlight Row 4019:562 (sous-composant) | 4048:3512 (6040 x 5342) |
| Shortcuts Panel | 4077:7757 | Shortcuts Panel 4018:1029 | 4049:3512 (6040 x 4970) |

- Rangée : 01 | Documentation | Do/Don't, 160 px de marge et d'écart (aucune de ces pages n'a de Versionning). Sur Overlay, les 3 sections et leurs To review sont réempilées à 400 px d'écart ; aucun chevauchement.
- Décision : Filter Section et Spotlight Row (sous-composants utilisés dans les slots) rangés dans le bloc Component de leur parent plutôt que laissés en vrac.

## B2. Keycap et Shortcut Row : la librairie Action fait foi
- Clés Action lues : Shortcut Row `efbf23025fd16479af0be1470e5be6eb8aff1007` (951:110), Keycap `d40d368b4459c7f69af2e9c23d85978aa4706f20` (950:24) ; la rangée Action imbrique Shortcut Keys (950:64).
- Shortcuts Panel 4018:1029 : 12 instances de la Shortcut Row locale passées par `swapComponent` sur `State=Default, Used=<valeur d'origine>` d'Action (`importComponentSetByKeyAsync`). Surcharges reportées explicitement car la structure diffère : Label, Context, Show context, Used, libellés des touches (Alt + chiffre ou lettre) sur Key 1 / Key 2 de l'instance imbriquée Shortcut Keys, Wide True pour « Alt », Show key 3 et Show then à False ; largeur FILL conservée (368). Les Keycap locales étaient imbriquées dans ces rangées : remplacées avec elles.
- Capture avant/après : équivalente. Écart : la touche « Alt » d'Action fait 24 px (Wide, largeur fixe) contre 25 px (hug) dans la copie locale, d'où un décalage de 1 px des touches et du pointillé (4781 px différents, tous dans les rangées). Panneau 1280 x 282 inchangé.
- Maîtres locaux rangés dans la section `Legacy - local copies` **4077:22554** (page Overlay, x 0) : Keycap 4017:324, Shortcut Row 4017:349. Non supprimés.
- Instances locales restantes : Keycap 16 (6 dans les maîtres locaux Shortcut Row, 8 dans des instances de la Shortcut Row locale, 2 directes dans la Documentation de Shortcuts Panel) ; Shortcut Row 4 (2 directes dans la Documentation, 2 imbriquées dans des instances du Do/Don't de Shortcuts Panel). Non remplacées : hors du maître Shortcuts Panel, et dans des cadres de doc et des frames do/dont que je n'ai pas modifiés sans accord.

## B3. Cadres Notes rangés en To review

| Cadre | Section To review |
|---|---|
| Notes / Page Title 4020:679 (et le cadre `Examples` 4010:919, 2 instances d'exemple) | Page Title - To review 4077:8164 |
| Notes / Filter Drawer 4020:625 | Filter Drawer - To review 4077:22551 |
| Notes / Spotlight 4020:632 | Spotlight - To review 4077:22552 |
| Notes / Shortcuts Panel 4020:637 | Shortcuts Panel - To review 4077:22553 |

Remarque : la note de Shortcuts Panel dit encore « Keycap is a new local atom » : périmée depuis B2.

## Contrôle visuel (2 passes)
- Passe 1 : frames Header plus larges que la demi-colonne (planche passée en colonne) ; Don't « toggle hidden » où la liste descendait (space between sans Bottom : instance remise en alignement haut) ; tuile Menu Open True sans flyout (légende corrigée, note 8 ajoutée) ; légende Has Child True corrigée (parent de la page courante, bleu clair).
- Passe 2 : sections complètes Header, Side Navigation, Side Navigation Item, Page Title, Overlay, et en-tête 01 de Filter Drawer zoomé : textes non coupés, descriptions Hero sur une ligne, même look que Button.

## Points ouverts
- Recalage de 1,5 px des icônes de Side Navigation (voir plus haut) : à valider.
- Side Navigation Item sans 01 propre (ses maîtres sont dans les Atoms de Side Navigation) ; groupes Company Information, Assessment, Tools en vrac sur la page.
- Instances restantes des copies locales Keycap / Shortcut Row dans la doc de Shortcuts Panel.
- Versionning de Header et Side Navigation non remplis (pas de changelog daté) ; liens ZeroHeight sans URL (pages non publiées).
