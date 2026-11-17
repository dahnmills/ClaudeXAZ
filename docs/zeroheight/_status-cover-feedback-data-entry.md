# Status et Cover, librairies Feedback et Data Entry (2026-11-16)

Modèles suivis (Action `xCeEJPn6fliEshuE9fnrqs`, lu sans modification) : page Status `602:1512` (cadre `4047:243`) et Cover `4056:2`. Kit : `docs/figma/doc-kit/page-kit.js` (helpers + `shell()` + `section()` recopiés à l'identique, ligne `return` étendue dans l'appel comme pour Action ; fichier non modifié).
Rien de publié, aucun commit, pas de MCP ZeroHeight, components.json non modifié. Aucun token, collection ni mode créé : tout est lié à `Tokens / Semantic` (`miss` vide sur les 4 constructions, aucun fill ni texte non lié sur les covers). Seules les pages Cover et Status ont été touchées (plus la création des pages Status et `---`).

## Feedback (`fH3vmSNZR8r0sU3kN455CD`)

### Pages
- Il n'y avait pas de page Status. Créées : `Status` **593:2** juste après `Cover` et le `---` existant (15:2), puis un séparateur `---` **593:3** (même ordre que dans Action : Cover, ---, Status, ---).
- Aucune ancienne Status, donc pas de section « Status - To review ».

### Status
- Section `Status` **593:4** (0, 0), cadre `Status - Feedback` **593:5** (1800 × 2159), tableau **593:84** (en-tête 48 + 10 lignes 56).
- Hero (fil d'Ariane Qirin Components → Feedback → Status, étiquette STATUS, carte Data : Updated 2026-11-16, Source components.json), Overview, Components, Legend, bandeau de marque.
- Badges : 64 instances. Dans ce fichier, `importComponentSetByKeyAsync` renvoie la copie publiée (remote) du Badge : les 64 instances ont été basculées (`swapComponent`) sur le set local `Badge` 141:98, libellés conservés, icône `Icon Functional` masquée. 0 instance remote restante.
- Liens NODE des noms vers les sections normalisées : Badge 560:532, Badge (counter) 560:811, Skeleton Item 562:85, Spinner 561:708, Toaster 561:471, Snackbar 557:349, Functional Notice 574:1794, Tooltip 566:187, Popover 580:1012, Popin 587:482.
- Logo : librairie Logo non activée, instance `Header Q/First slot/Logo` clonée depuis le header 336:4345 (page Badge counter).

Chiffres (components.json, `figma.fileKey` = Feedback) : 10 composants (4 atomes, 6 molécules) ; Ready 10, Draft 0, In review 0 ; ZeroHeight 0 page (10 `drafted`, Markdown seul) ; Storybook 10 ; Code 10 Vibecoded, 0 Dev ; Design 10 In Figma.

### Cover
- Cadre `Cover` **596:2** (0, 0, 1280 × 640). « QIRIN COMPONENTS », titre « Feedback », phrase : « Badges, notices, toasters and tooltips: every signal that tells people what is happening in Qirin. » Meta : STATUS Ready (Badge Success Strong M), VERSION 1.0.0.
- Visuel, vraies instances locales : 4 Badge Light (In review, Approved, Pending, Rejected), Functional Notice Medium Info (« Policy under review »), Toaster Success (« Changes saved », action « Undo ») + Tooltip Left (« Just now »).
- Logo : clone de 336:4345 passé en `Inverted=True`, Divider 1 × 40, « Qirin ».
- Ancienne cover : section `Cover - To review` **596:203** (x 1680, 400 px à droite), contient `Frame 1` 334:4299 sans modification.

## Data Entry (`1wVY9FfjONIX6us9JmIm7U`)

### Pages
- Pas de page Status (la page `Checklist` 1:80 est la checklist de composant, avec le set `Task` 1:92 : non touchée). Créées : `Status` **3180:2** après `Cover` et le `---` 1:79, puis `---` **3180:3** ; `Checklist` suit.
- Aucune ancienne Status, donc pas de section « Status - To review ».

### Status
- Section `Status` **3180:4** (0, 0), cadre `Status - Data Entry` **3180:5** (1800 × 2943), tableau **3180:88** (en-tête 48 + 24 lignes 56). 134 instances de Badge (librairie Feedback, import par clé, icône masquée).
- Ordre : les 19 historiques puis les 5 nouveaux (ordre du JSON).
- Liens NODE : Input Text 3158:6593, Input Email 3160:3661, Input Date 3161:5674, Input Search 3165:3928, Text Area 3172:517, Checkbox 3158:9910, Radio 3160:787, Toggle 3160:4568, Select et Multi Select 3165:2103 (section Dropdown partagée), Dropdown Flyout Menu 3165:4082, Standalone Dropdown 3160:1222, Inline Edit 3160:3476, Date Range 3161:3538, Checkbox Card 3161:5028, Radio Card 3162:4293, Select Button 3158:3704, Search Bar 3161:8605, More Criteria 3165:4213, Search Bar (home) 3137:338, Search Bar Multi 3144:1252, Tag Filter Chip 3146:702, Grid Selection 3148:296, File Upload 3150:264.
- Logo : clone de `Header Q/First slot/Logo` 2045:893 (header Input Text).

Chiffres : 24 composants (19 historiques + 5 nouveaux ; 17 molécules, 7 organismes) ; Ready 19, In review 4 (Search Bar (home), Search Bar Multi, Tag Filter Chip, Grid Selection), Draft 1 (File Upload) ; ZeroHeight 5 pages, toutes hidden, 19 `drafted` ; Storybook 23 (File Upload sans story) ; Code 24 Vibecoded, 0 Dev ; Design 24 In Figma.

### Cover
- Cadre `Cover` **3181:2** (0, 0, 1280 × 640). Titre « Data Entry », phrase : « Fields, dropdowns, checkboxes and search bars: every control people use to enter, pick or find data in Qirin. » Meta : STATUS Ready, VERSION 1.0.0.
- Visuel, vraies instances locales : Input Text (« Buyer name ») + Dropdown (« Country ») ; Checkbox, Radio, Toggle sélectionnés ; Select Button sélectionné (« Upload », « PDF or CSV ») ; Tag Filter Chip Filled (« Status · 2 ») + Standalone Dropdown (« Group by »).
- Ancienne cover : section `Cover - To review` **3181:231** (x 1680), contient `Frame 5` 2694:3174 sans modification.

## Écarts JSON / Figma

Présents dans Figma, absents du JSON :
- Feedback : aucun composant publié. Les pages WIP `Progress Bar` 15:3, `Progress Circle` 15:4 et `Contextual Help` 85:2 sont vides (aucun composant).
- Data Entry : `Header` 2002:811 (page Date Range, en-tête de calendrier interne au Date Range, sans préfixe `.`) ; `🆕 Tenant` 3028:361 (glyphe local de la page Search Bar) ; page `☠️ Select Card` : `User card` 2340:2236 et `☠️ Users Card List` 2340:2447 (dépréciés) ; `Task` 1:92 (page Checklist, outil de suivi). Pages `Helper Text`, `Label` et `Auto Complete` (WIP) : aucun composant public.

Présents dans le JSON, absents de Figma : aucun. Select et Multi Select pointent tous deux sur le set unique `Dropdown` 2046:720.

Autres écarts :
1. Noms : JSON « Search Bar (home) » contre Figma « Search Bar Home » (le tableau affiche le nom JSON) ; JSON « Popin » a l'id `confirm-dialog` ; le set de « Badge (counter) » s'appelle « Badge » (257:5) ; le set de la page Input Search s'appelle « Input Date » (2695:3344).
2. Versions hors 1.0.0 : Multi Select 0.3.0, Search Bar 0.9.0, File Upload 0.1.0. La cover affiche 1.0.0 et Ready pour la librairie, comme Action (qui a aussi des Draft).
3. ZeroHeight : aucune page pour Feedback ; pour Data Entry, seuls les 5 nouveaux ont un `pageId` (hidden), sans `url`. Pas de lien ZeroHeight dans les tableaux.
4. Spinner : variantes nommées `Property 1=Default/Variant2/...` (nommage par défaut Figma).

## Passes de capture

- Status Feedback : 2 passes (cadre entier, puis tableau zoomé après bascule des badges en local) : colonnes alignées, aucun texte sur deux lignes, icônes masquées.
- Status Data Entry : 2 passes (cadre entier, tableau zoomé) : 24 lignes uniformes, badges lisibles, aucune coupure.
- Cover Feedback : 3 passes. Corrigé : textes Lorem ipsum et « Title » des instances remplacés, vide à droite du Toaster comblé par un Tooltip. Reste : un vide à droite des badges, accepté (même cas que le Segmented Control d'Action).
- Cover Data Entry : 2 passes (taille réelle, puis 50 %). Corrigé : libellés « Label », « Placeholder », « Sublabel » remplacés par des textes réels. Titre lisible en vignette, cartes équilibrées.
- Aucun chevauchement sur les pages Cover et Status des deux fichiers.
