# Figma, retours utilisateur du 2026-11-25 : rapport

Spec : `_feedback-2026-11-25.md` (5 points). Fichiers : librairie `[Components] Data Display` (`VpConH5AUGyCqtp8PMqj1i`)
et Bento (`XW7jVtIa6UWRTqKMDqOF5D`). Rien publié, aucune mise à jour de librairie acceptée, rien commité.
Captures : `captures/figma-fb25/`.

## A. Librairie Data Display (point 3) : prête à publier

### Vérification avant changement

- `.Status` (`2241:217`) : Tone = Highlighted, On track, Warning, Problem ; **Highlighted est la valeur par défaut** et le
  ton de toutes les instances `.Status` masquées des 12 variantes de Widget Card.
- Usages visibles de Highlighted : 2 dans la librairie (les variantes Subtle `2244:279` et Strong `2244:309`), **29 dans
  Bento** (page Mockups : Grade Strong, Exposure Subtle, Limit left Subtle sur les écrans 01 à 11). Les autres fichiers
  ne sont pas lisibles par le Plugin API.
- Conclusion : la valeur **ne peut pas être retirée** sans casser ces instances. Elle est gardée, masquée et dépréciée.

### Changements (`🆕 Widget Card`, `2240:117`)

| Élément | Changement |
|---|---|
| Widget Card, variantes `Emphasis=Subtle` (`.Card Header` `2244:281`) et `Emphasis=Strong` (`2244:310`) | `Status` de `.Card Header` passé à false : plus d'étiquette Highlighted ni d'étoile. Aucune propriété renommée ni supprimée. |
| Description du set `2244:1293` | Ajout : pas d'étiquette ni d'étoile d'emphase manuelle, le fond Subtle ou Strong suffit ; `.Status` seulement pour les statuts calculés. |
| Description de `.Status` | Tones On track, Warning, Problem ; Highlighted déprécié (25 Nov 2026), gardé pour ne pas casser les instances, à ne plus utiliser. |
| Description de `.Card Header` | `.Status` : statuts calculés seulement, jamais Highlighted. |
| Doc, Anatomy (item 2) | `.Status` = statut calculé (On track, Warning, Problem), « No emphasis label, no star. » |
| Doc, Properties | Emphasis : « The background alone says the emphasis: no label, no star. » ; `.Card Header` : Status actif par défaut sur Negative, Warning et Positive, Reason sur Negative et Warning ; None, Subtle et Strong sans statut. |
| Doc, Notes | Note Reason sans Highlighted ; nouvelle note « Emphasis (decision of 25 Nov 2026) » (`2288:889`) qui explique la valeur gardée pour compatibilité. |
| Do/Don't | 4e règle « Background says the emphasis » (`2288:890`) : Do = card Subtle sans étiquette ; Don't = la même avec Highlighted et l'étoile. |

Point 5 sur la librairie (pages `🆕 Widget Card` et `🆕 Data viz` `2253:117`, textes, textes des composants et
descriptions) : aucun « · » trouvé, rien à changer (seuls des noms de calques en contiennent, non renommés).

Captures : `lib-widget-card-component.png` (Subtle et Strong sans statut), `lib-widget-card-documentation.png`,
`lib-widget-card-dodont-emphasis.png`.

## B. Bento, page Mockups (`118:3983`)

### Point 1 : écran 9 supprimé, grille resserrée

`09 · Card detail` (`123:14475`) supprimé. Rangée 3 recalée (200 px entre écrans) et numérotation suivie :

| Avant | Après | nodeId | Position |
|---|---|---|---|
| 10 · Board loading | 09 · Board loading | `125:13563` | 1480, 4840 |
| 11 · Card in error and empty card | 10 · Card in error and empty card | `125:18053` | 2960, 4840 |
| 12 · Common · Read · 1920 | 11 · Common · Read · 1920 | `125:20848` | 0, 7256 |

Aucun autre lien vers le détail sur la page (pas de « See figures » ni « View data » visibles). Capture :
`mockups-page-grid.png`.

### Point 2 : écran 08 « Add a card » en vignettes

- Drawer (instance de librairie) gardé : recherche (Input Text, placeholder « Search cards » comme le code), puis 6 groupes
  courts du `CATALOG_GROUPS` du code : Risk, Exposure, Payments, Company, Follow-up, Overview, en grille de 3 colonnes
  (gaps Spacing/S liés).
- 20 vignettes (`CATALOG`) : miniature schématique selon `thumb` (figure, line, bars, list, table, gauge, kpis), sans
  valeur ni description, et le nom court (`short`). Plus de question métier, de ligne de valeur, de format ni d'emphase.
- Marque discrète « déjà sur le board » : une coche grise après le nom (18 cards du board Common) ; Ext. rating et Claims
  n'en ont pas.
- Nouveaux composants locaux (page Card kit, section `08 · Gallery vignettes` `225:4868`, 560 px sous la section 07) :
  `Local · Thumb / Figure`, `/ Line`, `/ Bars`, `/ List`, `/ Table`, `/ Gauge`, `/ Key figures` (`225:4786` à `225:4841`)
  et `Local · Gallery tile` (`225:4856`) avec 3 propriétés : `Name` (texte), `On board` (booléen), `Thumb` (instance swap,
  valeurs préférées = les 7 miniatures). Formes, fonds, bords, rayons, gaps et paddings liés aux tokens Semantic.
- Captures : `mockups-08-add-a-card.png`, `cardkit-08-gallery-vignettes.png`.

### Point 4 : écran 05 « Manage boards »

- Templates en haut (Common « Current », Credit Assessment, Credit Underwriting) : seulement « Open » (Button Tertiary)
  sur les modèles non ouverts ; plus de Reset to template ni de Duplicate, ni renommage ni suppression.
- My boards en dessous (Watchlist follow-up, Q4 renewal review) : Open, Rename, Delete ; plus de Duplicate.
- Bouton « New board » retiré du drawer (voir écart 3). Pas de flèches (il n'y en avait pas dans la maquette).
- Capture : `mockups-05-manage-boards.png`.

### Point 5 : « · » remplacés par « - »

Textes seulement, styles conservés (remplacement caractère par caractère), aucun calque renommé :
Mockups 13 (tous dans l'ancienne galerie, remplacée), Read me 4, Edit flow 38 (textes seulement, rien d'autre touché),
Card kit 33, Board · 1024 fold 0. Contrôle final : **0 « · » dans les textes de tout le fichier**.

### Point 3 dans Bento

Non fait, comme demandé : aucune instance surchargée pour cacher Highlighted (voir « Reste à faire »).

## Contrôles

- Mockups : 0 texte avec « · », 0 tiret cadratin, 0 annotation, aucun chevauchement d'écrans.
- 0 valeur brute (peinture SOLID non liée, texte sans style, padding ou gap non lié) sur toute la page Mockups hors
  intérieur des instances de librairie (contenus de slot compris), et sur les 8 nouveaux composants locaux.
- Captures relues : 05, 08, grille de la page, section Card kit 08, doc Widget Card.

## Écarts et choix à valider

1. **Pas de captures `fb25-*.png` du code** au moment du travail (seul `buyer-summary-v2.data.ts` était modifié, avec
   `CATALOG_GROUPS`, `ThumbKind` et `CATALOG`) : la galerie suit la spec et ces données. À réaligner sur les captures
   quand elles arrivent (dessin des miniatures, forme de la marque On board).
2. Toutes les vignettes ont la même taille (le format n'est plus montré, conforme à la spec). Le groupe Risk (4 cards) et
   Exposure (6) remplissent 2 rangées : Risk laisse 2 cases vides sur sa 2e rangée.
3. **Création d'un board perso** : le sélecteur de board (code et écran 04) n'a pas d'entrée « New board » ; la seule
   création existait dans le drawer. Retirée du drawer comme le demande la spec : il n'y a donc plus de point d'entrée
   dans les maquettes. À décider (ajouter « New board » au sélecteur ?).
4. Les états survol et focus des vignettes ne sont pas dessinés (le code doit fournir focus visible et nom accessible
   complet : nom + ce que la card montre, champ `shows`).
5. La barre d'outils de card (`.Card Toolbar`, état Edit) garde son icône étoile (bascule d'emphase) : la spec dit que
   l'emphase se change avec cette barre, donc gardée ; à confirmer si l'étoile doit aussi disparaître de là.
6. Les descriptions des composants locaux Bento gardent le préfixe de convention « Local · » (descriptions, pas des
   textes) ; à changer si la règle doit s'y appliquer aussi.
7. La page Edit flow garde son étape « Step 5 - Card detail » (page non touchée hors textes).

## Reste à faire après publication de Data Display

1. Bento : accepter la mise à jour de la librairie, puis vérifier les 29 cards Subtle et Strong (Grade, Exposure,
   Limit left des écrans 01 à 11, et les exemples de Card kit) : si `Status` de leur `.Card Header` est surchargé à true
   sur l'instance (les surcharges du re-pointage portent sur `componentProperties`), le repasser à false par script ;
   relever avant et après, captures 01 à 11.
2. Vérifier ensuite qu'aucune instance n'utilise plus `Tone=Highlighted` (Bento et autres fichiers abonnés), puis retirer
   les 2 variantes Highlighted de `.Status` et la mention dans la note de doc et dans le cadre Private atoms ; republier.
3. Réaligner l'écran 08 et l'écran 05 sur les captures du code quand elles existent.
4. Trancher les écarts 3 et 5.

## Passe 2 (2026-11-25) : mise à jour Data Display et réalignement sur le code (commit 80b0b891)

Data Display republiée le 2026-11-25 à 09:33. Pages touchées : Card kit (`78:20`) et Mockups (`118:3983`) seulement.
Edit flow et Board 1024 fold non touchées, librairie non modifiée, rien publié, rien commité. Captures :
`captures/figma-fb25/pass2/mock-01` à `mock-11-before|after.png`.

### 1. Mise à jour de la librairie

Figma web (navigateur Playwright), Assets > Manage libraries > Updates : bouton **Update** de Widget Card sous
`[Components] Data Display` seulement (seul élément listé). Feedback (Badge), Action (Crumb), Tokens (Semantic) et NDBX
Icons laissés en attente. Contrôle avec « Show updates for all pages » : plus aucune mise à jour Data Display dans le
fichier. Widget Card des cards : set `163f191a` (`remote`), clé de variante relevée sur `118:5209`.

### 2. Highlighted et étoile : relevé avant/après

Relevé par script de chaque Widget Card (180 sur Mockups, 115 sur Card kit) : valeur `Status` de `.Card Header`,
visibilité et ton de `.Status`, champs surchargés de `.Card Header`, et trois empreintes (arbre complet, arbre hors
`.Status` et hors propriété `Status`, liste des surcharges).

- Avant : 26 cards Subtle ou Strong sur Mockups (11 Strong, 15 Subtle) et 24 sur Card kit montraient Highlighted et
  l'étoile ; `Status` = true **hérité de la variante**, jamais surchargé (la surcharge `componentProperties` de
  `.Card Header` porte sur les textes Title, Unit, Reason). Rien à repasser à false par script.
- Après la mise à jour : ces 50 cards ont `Status` = false et `.Status` masqué (elles suivent le maître). Liste des
  surcharges identique sur les 295 cards. Les 130 autres cards de Mockups et 91 de Card kit : empreintes identiques.
  Seul écart hors `.Status` sur les 50 cards : le titre de `.Card Header` reprend la largeur libérée (ex. 511 px au lieu
  de 427 sur Exposure 3x1), taille de card inchangée.
- Statuts calculés gardés : Warning, Problem, On track (9 Negative subtle, 9 Warning subtle, 2 Positive subtle et les
  cards None à statut, inchangés).
- Card kit, textes qui décrivaient l'étoile réécrits : label Subtle de 04 (`95:1150`) et note 1 de 04 (`95:1793`,
  « No label, no star: the background alone says the emphasis »). Vitrine `Library · .Status` de 01 (`164:5303`) : les 2
  instances `Tone=Highlighted` (normal et Reversed, `164:5304`, `164:5328`) retirées, restent On track, Warning, Problem.

### 3. Écrans réalignés sur le code

**05 · Manage boards** (`121:7240`, drawer `121:7826`), d'après `buyer-summary-v2.component.html` et
`fb25-boards-1280.png` :

- Titre du drawer « Boards » (au lieu de « Manage boards »). Sections « Templates » puis « Your boards » (au lieu de
  « My boards »), titres en Body/M/Semi Bold, texte principal ; 24 px (Spacing/L) entre les sections.
- Ligne : emplacement de coche fixe de 20 px à gauche (Spacing/XXS + icône 16 px + Spacing/XXS), coche bleue sur le
  board ouvert (Common), nom en bleu interactif, « 18 cards, open » ; badge « Current » retiré. Pas de marge latérale
  (Spacing/None), actions espacées de Spacing/XS.
- Templates : « Open » seulement, absent sur le modèle ouvert.
- Your boards : le nom est un **Inline Edit** (Data Entry, crayon visible, suppression interne masquée comme
  `[deletable]="false"`), puis « Open » et la corbeille ; le bouton Rename séparé est retiré.
- Bouton « New board » (Secondary, icône plus) rétabli sous Your boards, 8 px au-dessus (Spacing/S) : dans le code il
  ouvre la vue de création (nom du board, « Start from » un des 3 modèles ou « Empty board »). L'écart 3 de la passe 1
  est donc levé : le point d'entrée existe dans le drawer.

**08 · Add a card** (`123:11428`, drawer `123:14248`), d'après `fb25-gallery-1280.png` et `bento-thumb.component.*` :

- Groupes, ordre et noms des 20 vignettes déjà conformes à `CATALOG_GROUPS` et `CATALOG` (vérifié), coches « on board »
  conformes au board Common (18 cards ; Ext. rating et Claims sans coche).
- Ajouts : ligne d'aide « Click a card to add it, or drag it onto the board. » sous la recherche (Body/M/Regular,
  secondaire) ; titres de groupe en Body/M/Semi Bold, texte principal.
- Maître `Local · Gallery tile` (`225:4856`) : padding Spacing/XS, nom en Body/S/Semi Bold, marque « on board » =
  glyphe NDBX **Check Circle Outline** bleu (Interactive/Icon/Strong/Default) sur fond blanc rond, en position absolue
  en haut à droite de la miniature (8 px du bord de la vignette), au lieu de la coche grise après le nom.
- Les 7 miniatures `Local · Thumb / *` (`225:4786` à `225:4841`) redessinées comme `app-bento-thumb` : 4:3 (112 x 84),
  fond Background/Main/Primary, bord Border/Subtle/Tertiary 1 px, rayon M, padding S, gap XS ; formes grises
  Icon/Main/Tertiary (marques) et Icon/Subtle/Tertiary (reste), plus de bleu marine ; titre à l'opacité Overlay. Figure
  (gros chiffre + 2 lignes), Line (aire sous une courbe montante, ligne de base 2 px), Bars (6 barres 2-3-2-4-3-4 quarts,
  les pleines foncées), List (4 rangées point + ligne, séparées), Table (en-tête foncé + 3 rangées, 1re colonne
  double), Gauge (demi-anneau aux deux tiers + ligne), Key figures (3 tuiles sur Background/Main/Secondary). Texte de la
  section 08 du Card kit et description du maître mis à jour.

**06 · Edit mode, 07 · Resize, 08** : « Reset layout » retiré de la barre d'édition (absent du code) ; la barre est
maintenant Add card, Undo, Redo, « 1 change », Cancel, Done, comme `bento-bar__actions`.

**Menu d'emphase** (« Subtle background » / « Strong background ») : aucun écran de Mockups ne l'ouvre, rien à aligner.
L'icône étoile de la barre d'outils de card reste (le code la garde comme bouton Emphasis).

### 4. Contrôles

- Mockups : 0 « Highlighted » visible (26 avant), 0 « · », 0 tiret cadratin, 0 « Reset layout », 0 chevauchement
  d'écrans.
- 0 valeur brute (peinture SOLID non liée, texte sans style, padding ou gap non lié) sur Mockups hors intérieur des
  instances de librairie (contenus de slot compris), et sur la section 08 du Card kit (maîtres redessinés). Card kit :
  0 « · », 0 « Highlighted » visible.
- 0 texte tronqué ni de hauteur insuffisante sur Mockups ; aucun nom de board ni de vignette sur deux lignes.
- Captures avant/après comparées pixel à pixel (seuil 30 sur 765) : écarts limités aux étiquettes Highlighted des
  en-têtes (01 à 04, 09 à 11 : 470 à 1 410 px, rangées y 259 à 273 et 459 à 469), à la barre d'édition (06, 07) et aux
  drawers (05, 08). Captures 05, 06 et 08 relues à l'oeil.

### 5. Reste ouvert

1. Vérifier les autres fichiers abonnés à Data Display avant de retirer `Tone=Highlighted` de `.Status` (Bento n'en
   affiche plus aucune ; les instances masquées des cards gardent ce ton dans le maître).
2. Les états survol et focus des vignettes (fond et dessin bleus dans le code) ne sont pas dessinés.
3. Les séparateurs Divider des lignes de Manage boards font 320 px dans un contenu de 356 px (défaut antérieur de
   l'instance Divider, non touché).

## Passe 3 (2026-11-25) : retours `_feedback-2026-11-25b.md` (code 0ede8976, fond de page 78c78543)

Rien publié, aucune mise à jour de librairie acceptée, rien commité. Pages non touchées : Board 1024 fold ; Edit flow
seulement archivée (voir B.5). Captures : `captures/figma-fb25/pass3/` (lib-*, mock-*-before|after, mock-12, mock-13,
cardkit-06-before|after).

### A. Librairie Data Display (`VpConH5AUGyCqtp8PMqj1i`) : prête à publier

- **Icône** : aucune icône pot de peinture ni remplissage dans NDBX Icons ni A1 Icons (`search_design_system` : paint
  bucket, bucket, paint, fill, palette, contrast, color, brush, background ; seuls Color Picker (pipette), Text
  Formatting Color et Overarching approchent, aucun ne dit « fond »). La librairie d'icônes n'est pas modifiée.
- **Glyphe interne** `.Glyph Paint Bucket` (`2293:886`, page `🆕 Widget Card`, section Private atoms) : grille 24 px
  comme les glyphes NDBX, une forme pleine `Shape` (contour du tracé `paint-bucket` de `icon.component.ts`, trait 2 sur
  24, soit 1,33 px à 16 px comme les autres glyphes), contraintes Scale, remplissage lié à
  Color/Interactive/Icon/Strong/Default ; la couleur réelle vient du calque `Color` de l'Icon Functional, comme pour
  toutes les icônes. Description : à déplacer dans la librairie d'icônes puis à re-swapper.
- **`.Card Toolbar`** (`2243:204`) : le `🔗 Icon` du bouton (Star Outline) est swappé sur ce glyphe ; calque `Emphasis`
  renommé **`Background`** (`2243:953`, libellé accessible du code). La barre n'a pas de propriété de composant, rien
  d'autre de renommé ; le swap ne change pas le chemin des calques (même `🔗 Icon` dans le même Icon Functional), les
  surcharges des consommateurs restent valides. Description de la barre mise à jour. La variante Widget Card
  `State=Edit` (`2244:1258`) et la doc State Edit (`2250:876`) suivent le maître.
- La propriété de variante `Emphasis` de Widget Card **n'est pas renommée** : non visible, nom aligné sur l'input
  `emphasis` du code, et la renommer toucherait toutes les instances.
- **Doc** : Anatomy item 5 `.Card Toolbar` (`2293:1143`) ; note « Background button (decision of 25 Nov 2026) »
  (`2293:1146`) ; Do/Don't, 5e règle **« Never a star for the emphasis »** (`2293:1209`) : Do = barre avec le pot de
  peinture, Don't = même barre avec une étoile (seule étoile volontaire, en contre-exemple).
- **Contrôle étoiles** : page Data viz, 0 étoile visible. Page Widget Card, restent visibles seulement les 2
  variantes `Tone=Highlighted` dépréciées de `.Status` (vitrine du set, gardées pour compatibilité, cf. passe 1) et les
  deux Don't. 0 chevauchement sur la page.

### B. Bento (`XW7jVtIa6UWRTqKMDqOF5D`)

1. **Modèles en lecture** (01, 02, 03, 04, 09, 10, 11 : Common, Credit Assessment, Credit Underwriting) : « Edit board »
   devient **« Duplicate to edit »** (icône NDBX Duplicate, calque renommé), comme `currentBoard().builtin` dans le code.
2. **Board perso** : 05 a « Copy of Common » ouvert, barre Edit board + **Duplicate** (nouveau bouton, icône Duplicate)
   + Manage boards + sélecteur « Copy of Common ». 06, 07, 08 renommés « Copy of Common - ... » dans le nom du cadre ;
   06 montre l'état juste après Duplicate to edit, comme `fb25b-02` : toaster Success « Board duplicated / You are
   editing “Copy of Common”, one of your boards » (Toaster Feedback, bas droite du viewport), Undo désactivé, pas de
   compteur. 07 garde « 1 change ». Texte d'aide des barres d'édition 06 à 08 : « ...the format and the background. »
   (code). 04 : la liste du sélecteur suit 05 (Q4 renewal review devient Copy of Common).
3. **Nouveaux écrans** (drawer, comme le code : vue `create` du drawer Boards, flèche retour, footer) :
   - `12 · New board, from a template` (`245:21730`, x 4440, y 4840, rangée 3 après 10, à 200 px) : « Start from »
     (Body L Semi Bold), 3 **Radio Card** (Data Entry ; A template sélectionnée, An existing board, Empty board,
     sous-libellés du code), **Template** (Dropdown, Credit Underwriting), **Board name** (Input Text rempli « Copy of
     Credit Underwriting »), ligne de description (Body S, secondaire : `newBoardSummary()` + « The new board opens in
     edit mode. »), footer Cancel (Tertiary) + Create board (Primary), sans icône. Calé sur `fb25b-07`.
   - `13 · New board, from an existing board` (`245:24697`, x 2120, y 7256, à 200 px de 11) : An existing board
     sélectionnée, **Board to copy** = Copy of Common, nom « Copy of Copy of Common », « 18 cards, as saved. ... ». Calé
     sur `fb25b-06`.
4. **05 Manage boards** aligné sur `fb25b-04` et `fb25b-05` : Templates Common, Credit Assessment, Credit Underwriting,
   chacun « Open », sans coche ; Your boards : Watchlist follow-up (Inline Edit, Open, corbeille) puis **Copy of Common**
   (coche, nom bleu dans l'Inline Edit, « 18 cards, open », sans Open, corbeille) ; New board. Pas de Duplicate par
   ligne, pas de flèches, pas de Reset.
5. **Edit flow archivée** (décision utilisateur) : page renommée « Archive - Edit flow (outdated 2026-11-25) », mise
   en dernière position ; bandeau Functional Notice Warning Medium (`246:15128`, 1224 px, x 0, y -256, 200 px au-dessus
   de la 1re section) : « Outdated: this flow no longer reflects the product (card details, Highlighted, Reset,
   editable templates were removed on 25 Nov 2026). See the Mockups page. » Rien d'autre modifié ni supprimé.
   Read me : entrée renommée « Archive - Edit flow (outdated) », texte d'archive, placée en dernier (lien conservé) ;
   Mockups « 13 clean screens ... » ; légende Subtle « No star, the star means favourite. » (elle disait « and a
   star ») ; date 2026-11-25, commit 78c78543 ; ligne Status.
6. **Fond des écrans** (correction utilisateur) : les 11 écrans de Mockups passent de Background/Main/Secondary à
   **Background/Main/Primary** (12 et 13 en héritent) ; Card kit 06 et 07 `Board background` (`97:2339`, `102:3328`)
   aussi. Fonds internes des cards et des vignettes non touchés (les 3 tuiles de `Local · Thumb / Key figures` restent
   en Secondary, c'est le dessin de la vignette). Contrôle : 0 Main/Secondary en fond d'écran sur Mockups.
7. **Card kit** : textes 03 (`94:1441`) et 04 (`95:1793`) : la barre a « Background (paint bucket, never a star) »,
   référence à `.Card Toolbar` de la librairie au lieu de la page Edit flow. Les 4 barres d'outils (01 Master, 03 Edit
   x3) et celle de l'écran 06 gardent l'étoile **tant que Data Display n'est pas publiée** (instances de librairie,
   rien surchargé).

### Contrôles

- Mockups : 0 chevauchement (marge 200 px), 0 « · » dans les textes, 0 tiret cadratin, 0 valeur brute (peinture,
  texte sans style, padding ou gap non lié, hors intérieur des instances de librairie, contenus de slot compris), 0
  texte tronqué ou débordant. « Edit board » reste seulement sur 05, 12, 13 (board perso). Étoile visible : 1 (barre
  de 06, librairie). Card kit : 0 « · ».
- Captures relues : 01, 02, 05, 06, 08, 12, 13, Card kit 06, doc Widget Card (anatomy, State Edit, Do/Don't).

### Écarts

1. Radio Card (Data Entry) : `Sub Label` est en largeur fixe (103 px) dans le maître ; surchargé en Fill sur les 6
   instances de 12 et 13. À corriger dans le maître (Fill), puis retirer les surcharges.
2. Le code a un bouton « Change card type » (icône switch) dans la barre de card, absent de `.Card Toolbar`. Non
   ajouté (hors demande).
3. Les sous-libellés des Radio Card passent sur deux lignes à 356 px (style du maître plus grand que dans le code).
4. Divider des lignes de Manage boards toujours à 320 px (passe 2, reste 3).

### Reste à faire après publication de Data Display

1. Bento : accepter la mise à jour **Widget Card / .Card Toolbar** seulement ; vérifier que les barres de Card kit 01
   et 03 et de l'écran 06 montrent le pot de peinture et que `Background` n'a perdu aucune surcharge ; captures.
2. Ajouter un pot de peinture à la librairie d'icônes (NDBX / A1 Icons), puis swapper `.Card Toolbar` dessus et
   supprimer `.Glyph Paint Bucket` ; republier.
3. Retirer `Tone=Highlighted` de `.Status` quand plus aucun fichier abonné ne l'utilise (passe 2, reste 1).
