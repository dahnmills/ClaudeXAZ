# Lib rollout, lot data-display-4 : Grade, Policy Color, Accordion, Timeline, Timeline Event

Fichier `[Components] Data Display` (`VpConH5AUGyCqtp8PMqj1i`), 2026-11-16. Modèle : Action > Button (section 4030:979). Aucun token, collection ni mode créé ; aucun composant, variante ou propriété créé, renommé ou supprimé ; rien détaché, rien publié, pas de commit, pas de MCP ZeroHeight.

Règles Do / Don't : section `## Do / Don't` des .md locaux, au format « Do X. Don't Y. ». Texte repris tel quel, seule la majuscule initiale change (« Do use Size S... » devient « Use Size S... »). Les .md n'ont pas de titres h3 : les rubriques de la planche (`key`) sont des titres courts écrits par moi.

Méthode étape 1 : script unique de liaison (paddings, gaps, rayons, épaisseurs de trait, et pour les textes SANS style de texte : famille, taille, interligne, interlettrage, graisse) vers le Semantic de même valeur, avec signature de géométrie avant/après (position absolue, taille, paddings, gap, 4 rayons, trait, opacité, fills et strokes résolus, police, taille, interligne, interlettrage, texte) sur tous les nœuds du set ET de toutes ses instances du fichier (`getInstancesAsync`). Les nœuds situés dans des instances imbriquées ne sont jamais liés (pas d'override). Capture du set avant/après comparée par md5. Les textes qui portent un style de texte local (`Copy/...`) sont laissés à leur style.

Constat outil : un `use_figma` en erreur est annulé en entier (aucune écriture partielle).

## 1. Grade (page `628:17015`)

- Section `Grade` : `2155:27828` (Versionning `1460:3202` | 01 Component `1460:3070` | Documentation `2155:27829` | Do/Don't `2155:27900`). `lost`, `miss`, `overlaps` vides.
- To review : `2155:27953` (`Grade - To review`) : 2e gabarit `_Design system header` « Documentation » `1460:3222` (textes de Checkbox) et une instance Grade isolée `1517:13490` posée entre Versionning et l'en-tête. Aucun ne contient de COMPONENT.

### Liaisons posées (COMPONENT_SET `628:17016`, 44 variantes)
- Gap 4 vers Spacing/XS (44) ; paddings gauche/droite 8 (Size M) vers Spacing/S (44) et 4 (Size S) vers Spacing/XS (44) ; rayons 16 de la pastille vers Border/Radius/L (176 coins).
- 23 textes sans style (libellés SemiBold 16) : Font/Family, Text Style/Size/L, Line Height/L, Letter Spacing/None, Font Weight/SemiBold.
- Couleurs : déjà liées au Semantic (Grade/#1 à #10, NC-NA, textes). Aucune liaison Foundation trouvée.
- Vérification : signature de 273 nœuds (set + 32 instances du fichier, dont celles des autres pages) avant/après : 0 différence ; capture du set avant/après identique octet pour octet (md5 `8eacfe5b...`). Aucun rendu changé, donc rien ne bouge dans Buyer Summary ni Manual Underwriting (et rien n'est publié).
- Description posée (était vide) : « Read-only pill that shows a buyer's credit grade (M or A plus 1 to 10, or N/C, N/A) with an optional score, in topboxes, result cards and table cells; not for a policy color (use Policy color) or a generic status (use Badge). »

### Différé
- 63 textes à style de texte local (`Copy/Medium (16)/Regular`, `Copy/Small (14)/Semibold`, `Copy/Small (14)/Regular`) : laissés au style, non liés.
- Rayon 5 et trait violet du COMPONENT_SET (cadre de travail Figma) : non concernés.
- Variable `Grade/NC-NA` : liée sur N/C et N/A, mais la librairie Tokens ne publie plus que `Grade/None` (même gris). Pas re-liée (ce n'est pas un passage Foundation vers Semantic) ; signalé en note.

### Frames do / dont
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Use Size S in table cells and dense lists. | do · grade · size s in table cells | 2155:21020 |
| Don't : Use Size M inside a 14 px text line. | dont · grade · size m in a text line | 2155:21039 |
| Do : Keep the Score on when the user compares close grades. | do · grade · score kept to compare | 2155:21047 |
| Don't : Round or reformat the score. | dont · grade · score rounded (« (4) », « (4.4) ») | 2155:21060 |
| Do : Use Grade for buyer risk. | do · grade · grade for buyer risk | 2155:21073 |
| Don't : Recolor a Badge to imitate a grade. | dont · grade · badge recolored as a grade (vrai Badge Feedback, fond en override Grade/#4, icône masquée) | 2155:21079 |

Aucune règle text only. Pas de frame anatomy (anatomie dans la Documentation). Rubriques : « Size », « Score », « Buyer risk only ».

### Écarts et décisions
- Gabarit 01 : « Component description » remplacé par la description du .md ; badge Tech « Not started » vers « In code » (Success). Design laissé « WIP » (gabarit et .md d'accord), alors que components.json dit `ready` : à trancher.
- Versionning rempli : v1.0.0, « Date unknown », « Added », « Initial version. », tag « WIP » (Warning) ; 2e entrée du modèle masquée (pas supprimée).
- Notes Documentation : rayon L (Figma) contre Round (code) ; padding Size S XS en Figma, S en code ; graisse SemiBold Figma contre regular code et styles de texte locaux ; score figé par variante en Figma ; contraste N/C du code (blanc sur grey-300) ; statut WIP contre ready ; variable NC-NA.
- Lien ZeroHeight : « Not published yet (draft) » (components.json : `pageId` null).

## 2. Policy color (page `1655:14071`, Draft)

- Section `Policy color` : `2161:27007` (Versionning `1655:14281` | 01 Component `1655:14072` | Documentation `2161:27008` | Do/Don't `2161:27079`). `lost`, `miss`, `overlaps` vides.
- To review : `2161:27128` (`Policy color - To review`) : 2e gabarit « Documentation » `1655:14301` (textes de Checkbox) et 12 brouillons de nuancier en vrac (6 textes `background-color:#...` `1659:14392`, `14394`, `14396`, `14398`, `14401`, `14403` et 6 rectangles `1659:14393`, `14395`, `14397`, `14400`, `14402`, `14404`). Aucun ne contient de COMPONENT.

### Liaisons posées (COMPONENT_SET `1655:14105`, 12 variantes, 0 instance dans le fichier)
- Gap 4 vers Spacing/XS (12) ; rayons 16 vers Border/Radius/L (48 coins) ; paddings 4 vers Spacing/XS (10) et 8 vers Spacing/S (4) ; trait 1 de la pastille N vers Border/Size/S (8 côtés).
- 6 lettres sans style (SemiBold 16) : Font/Family, Text Style/Size/L, Line Height/L, Letter Spacing/None, Font Weight/SemiBold.
- Couleurs déjà en Semantic (Grade/#2, #4, #6, #7, NC-NA, Interactive/Background/Neutral/Default, textes).
- Vérification : signature de 45 nœuds avant/après : 0 différence ; capture identique (md5 `04ae3d1a...`).
- Description posée (était vide) : « Read-only round pill that shows a policy's color code as a letter (G, Y, O, R, U, N), with the color name as an option, in the policy topbox, result rows and table cells; not for a buyer's grade (use Grade) or a workflow status (use Badge). »

### Différé
- Trait noir `#000000` de la pastille N : aucun Semantic de cette valeur (`Static/Border/Main/Primary` vaut `#121212`).
- 14 textes à style local (`Copy/...`, noms de couleur et lettres S) : laissés au style.
- `Grade/NC-NA` sur U : même constat que Grade (la librairie publie `Grade/None`).

### Frames do / dont
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Pair the pill with its letter. | do · policy-color · letter in the pill | 2161:4299 |
| Don't : Draw a plain colored dot. | dont · policy-color · plain colored dot (vraies instances, lettre vidée en override, Color info off) | 2161:4318 |
| Do : Use Policy color for policies and Grade for buyers. | do · policy-color · policy and grade in their own columns | 2161:4337 |
| Don't : Mix the two scales in one column. | dont · policy-color · scales mixed in one column | 2161:4371 |

Aucune règle text only. Rubriques : « Letter », « Policy or buyer ».

### Écarts et décisions
- Gabarit 01 : fil d'Ariane « Grade » corrigé en « Policy color » ; description du .md ; Tech « Not started » vers « In code » (le composant `ds-policy-color` existe, sans story) ; Design « WIP » laissé.
- Version : components.json dit 0.2.0 (draft), le gabarit disait 1.0.0 : gabarit et Versionning alignés sur 0.2.0 (« Date unknown », « Added », « Initial version, draft. », tag « Draft » Warning, 2e entrée masquée). À confirmer.
- Notes Documentation : code sans story et page ZH qui dit encore « Tech Planned » ; défauts différents (code `none` / `s` / `showName` false, Figma Green / M / Color info True) ; noms Unknown / No color seulement en code ; trait noir non lié ; NC-NA ; paddings inégaux (4 sur la plupart, 8 sur deux pastilles) ; version.
- Lien Storybook : « No story yet ».

## 3. Accordion (page `281:540`)

- Section `Accordion` : `2164:23268` (Versionning `1453:13979` | 01 Component `1453:13668` | Documentation `2164:23269` | Do/Don't `2164:23340`). `lost`, `miss`, `overlaps` vides.
- To review : `2164:23397` (`Accordion - To review`) : 2e gabarit « Documentation » `1453:14933` (textes de Checkbox) et le gabarit « Demo » `1453:13944` (Accordion avec Horizontal Card dans le slot, cité par le .md comme frame à embarquer). Aucun ne contient de COMPONENT. À signaler : le Demo n'est pas un brouillon, mais il n'a pas de place dans la section normalisée ; à replacer si l'utilisateur le veut sur la page.

### Liaisons posées (COMPONENT_SET `281:546`, 16 variantes, et `.Title` `720:65`, 2 variantes)
- Rayons 4 vers Border/Radius/S (72 coins) ; paddings 8 vers Spacing/S (68) et 4 vers Spacing/XS (4) ; gaps 8 vers Spacing/S (2).
- `.Title` : fond blanc en dur des 2 variantes vers `Static/Background/Main/Primary` ; 4 textes masqués (`Separator`, 2e `Label`) `#414141` vers `Static/Text/Main/Secondary` (même valeur résolue, vérifiée).
- Opacité 0,4 des 4 variantes Disabled vers `Measurement/Opacity/Disabled` (40).
- Vérification : signature de 342 nœuds (sets + 20 instances du fichier) avant/après, 0 différence ; idem pour les fonds et l'opacité ; captures du set et de `.Title` identiques (md5 `c8d1c13b...`, `c2c5dc78...`).
- Descriptions posées (étaient vides) : Accordion (« Collapsible section: a clickable title row that shows or hides the local content placed in its slot, for independent page sections read one at a time; not for dated events (use Timeline), grouped table rows (use Collapsible Table) or switching views (use Tabs). ») et `.Title` (atome privé).

### Différé
- Gaps 10 (`Container`, `Content`, `Slot`, variantes, `.Title`) : aucun Semantic à 10.
- Textes du titre : styles locaux `Title/H2`, `foundation-h2`, `Title/H3`, laissés au style.
- Glyphe du chevron (`Shape`, non lié) : appartient au composant Icon.
- Défaut de structure signalé, non corrigé : la variante `State=Default, Open=False, Tone=Alt` a son `Container` FIXED à 797 px (FILL ailleurs), donc une instance plus étroite coupe le chevron. Dans mes frames et dans la Documentation, override `Container` en Fill sur l'instance.

### Frames do / dont
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Stack accordions of the same Tone in one list. | do · accordion · same tone in one list | 2163:24177 |
| Don't : Mix Default and Alt in the same group. | dont · accordion · default and alt mixed | 2163:24214 |
| Do : Open the first or most used section by default when it helps. | do · accordion · first section open (360 x 376) | 2163:24251 |
| Don't : Open all sections by default (use Cards instead). | dont · accordion · all sections open (360 x 376) | 2163:24304 |
| Do : Put local content in the slot. | do · accordion · local content in the slot (lignes de texte posées dans le SLOT de l'instance) | 2163:24389 |

Text only : « Detach the component to add content. » (Don't) : dessiner un composant détaché est précisément interdit par la consigne. Rubriques : « One tone per group », « Open by default », « Slot content ».

### Écarts et décisions
- Gabarit 01 : description du .md ; Tech « Not started » vers « In code » ; Design « WIP » laissé (components.json : `ready`).
- Versionning : v1.0.0, « Date unknown », « Added », « Initial version. », tag « WIP », 2e entrée masquée.
- Notes Documentation : variante Alt fermée en largeur fixe ; ton Alt bleu clair en Figma contre gris en code ; padding du titre S partout en Figma contre S / M en code, gaps 10 sans token ; styles de texte locaux contre Title S en code ; Size S et 2e libellé sans équivalent code, focus non dessiné, pas d'`aria-controls` ; statut.

## 4. Timeline (page `381:44`, partagée avec Timeline Event)

- Section `Timeline` : `2176:1735` (Versionning `1491:2556` | 01 Component `1491:2424` | Documentation `2176:1736` | Do/Don't `2176:1807`), posée en (-5036, 2756). `lost`, `miss`, `overlaps` vides.
- To review : `2176:1856` (`Timeline - To review`) : 2e gabarit « Documentation » `1491:2576` et 8 brouillons en vrac : instances `515:18626` (☠️ Timeline), `381:2669`, `381:477`, `381:482` (Timeline Event), `381:485`, `381:486` (Accordion), frames `381:478` (Frame 246) et `381:487` (Frame 242). Aucun ne contient de COMPONENT (vérifié).
- Laissés sur la page hors section (contiennent des COMPONENT, jamais en To review) : `Frame 241` `381:110` (maîtres Timeline Event, Timeline Line, Timeline Title et le set déprécié `☠️ Timeline` 381:171), et les COMPONENT `Frame 243` `381:483` et `Frame 245` `381:491` (aides de mise en page). À signaler : les maîtres de Timeline Event n'ont pas de gabarit `_Design system header`.

### Liaisons posées (sets `1491:927` Timeline, `381:438` Timeline Event, `381:236` Timeline Line, `381:422` Timeline Title ; le set déprécié n'est pas touché)
- Espacements : gaps vers Spacing/M (12), S (15), XS (10), XXS (15), XL (1) ; paddings 8 vers Spacing/S (8) ; rayons 4 vers Radius/S (8 coins) ; traits 1 et 2 vers Border/Size/S (36) et M (4) ; 5 textes du jour sans style vers Font/Family, Size/S, Line Height/L, Letter Spacing/None, Font Weight/Regular.
- Couleurs en dur vers le Semantic de même valeur (vérifiée à la résolution) : `#1e8927` vers Background/Functional/Positive (21) et Text/Main/Functional/Positive (1) ; `#496ebd` vers Background/Functional/Informative (21) et Text/Main/Functional/Informative (1) ; `#414141` vers Icon/Main/Secondary (21, points et traits Neutral) et Text/Main/Secondary (20) ; `#ffffff` vers Background/Main/Primary (2) et Text/Subtle/Primary (5) ; `#f5f5f5` vers Background/Main/Secondary (2).
- Vérification : signature de 894 nœuds (4 sets + 39 instances du fichier) avant/après, 0 différence (deux passes : espacements, puis couleurs) ; captures identiques du set Timeline (md5 `0b2a8ef8...`) et de `Frame 241` (md5 `0c3bbb9e...`).
- Descriptions posées (étaient vides) sur les 4 sets.

### Différé
- Rouge Error `#e4003a` (en dur) et `#dc3149` (variable `qrn light/tag/label/error-reverse`, d'une autre librairie), orange Warning `#d87b02` : aucun Semantic de même valeur (Functional Negative `#b0050c`, Warning `#e08d05`). Laissés tels quels.
- Ligne `#999999` du séparateur, ligne `#e6e6e6` du commentaire : aucun Semantic de même valeur.
- Gaps 10 (`Separator`, `Slot`), gap 60 des `Row`, padding gauche 10 de `Date`, rayons 1000 des cercles : aucun Semantic.
- Textes à style local (`Copy/Small (14)/Bold`, `Regular`, `Copy/X-Small (12)/Semibold`) laissés au style.

### Frames do / dont (section `ZeroHeight · Timeline illustrations` vidée et supprimée par le kit)
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Pick the status from the event's real outcome. | do · timeline · status from the real outcome | 2169:877 |
| Don't : Color events for decoration. | dont · timeline · status as decoration | 2169:915 |
| Do : Keep event details in the folded body. | do · timeline · short title, details folded | 2169:953 |
| Don't : Put long text in the title. | dont · timeline · long text in the title (titre long qui pousse le chevron hors du groupe) | 2169:978 |

Instances Timeline Open=False redimensionnées à 312 (Category en Fill), statut et titre en override sur `Timeline Title`. Aucune règle text only. Rubriques : « Status », « Title ».

### Écarts et décisions
- Gabarit 01 : description du .md, Tech « Not started » vers « In code », Design « WIP » laissé (components.json : `ready`). Versionning : v1.0.0, « Date unknown », « Added », « Initial version. », tag « WIP », 2e entrée masquée.
- Anatomie : instance temporaire de Timeline ouverte avec un Timeline Event dans le slot, clonée par le kit puis supprimée.
- Notes Documentation : couleurs Error / Warning en dur ; séparateur non lié ; modèle différent (Figma : groupe avec statut et titre, code : chaque événement) ; défauts (Open True / Error contre false / neutral) ; couleur de titre (Secondary contre Primary) ; styles locaux ; set déprécié et aides laissés hors section ; statut.

## 5. Timeline Event (même page, pas de gabarit d'en-tête)

- Section `Timeline Event` : `2177:1744` (Documentation `2177:1745` | Do/Don't `2177:1816`), posée en (-5036, 9315), 400 px sous `Timeline - To review`. `lost`, `miss`, `overlaps` vides. Pas de Versionning ni de 01 : décision utilisateur appliquée (composant laissé en place dans `Frame 241`, 02 et 03 normalisés). Logo du fil d'Ariane pris sur l'en-tête de Timeline (`1491:2430`).
- `normalize` appelé avec la même logique que `page-kit.js`, sans la branche `styleHeader` (aucun en-tête), à signaler si le kit doit gérer ce cas tel quel.
- Liaisons et vérification : voir Timeline (sets `381:438`, `381:236`, `381:422` traités dans la même passe). Descriptions posées.

### Frames do / dont (819 x 476 : l'événement fait 771 px de large)
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Set `isLast` on the final event so the line stops. | do · timeline-event · line stops at the last event (couche `Dash` masquée en override sur le dernier événement) | 2170:1193 |
| Don't : Leave a line hanging below the last event. | dont · timeline-event · line hanging below the last event | 2170:1408 |

Backticks retirés sur la planche. Rubrique : « Last event ». Planche en colonne (frames trop larges). Un premier essai avec la variante `Content=Slot` (placeholder violet `.Swap element`) a été supprimé avant toute liaison ZH et refait en `Content=Default`.

### Écarts et décisions
- Notes Documentation : couleurs Error (en dur et variable `qrn`) et Warning sans Semantic ; ligne `#e6e6e6` et padding 10 ; `Content=Slot` = placeholder `.Swap element`, pas un slot natif ; variante Error de Timeline Line haute de 51 px contre 214 ; propriétés propres au code (title, status, open, disabled, isLast, pas de date) ; contenu par défaut en lorem ipsum ; statut.
- Anatomie : repère 3 (ligne) passé en repère de légende seule, la ligne Error étant trop courte pour séparer les pastilles 2 et 3.

## Synthèse

- 5 composants, 4 pages : 5 sections normalisées, `lost` / `miss` / `overlaps` vides partout. 4 sections To review (Grade, Policy color, Accordion, Timeline), aucune avec un COMPONENT.
- Étape 1 : 0 différence de signature et captures identiques (md5) sur tous les sets, dont Grade (32 instances du fichier). Rien publié : Buyer Summary et Manual Underwriting ne bougent pas.
- 21 frames do / dont créées en vraies instances (Grade 6, Policy color 4, Accordion 5, Timeline 4, Timeline Event 2) ; 1 règle text only (Accordion, détacher le composant).
- À trancher par l'utilisateur : statut Design « WIP » contre `ready` (Grade, Accordion, Timeline) ; version Policy color alignée sur 0.2.0 ; variable `Grade/NC-NA` absente de la librairie (Grade/None) ; couleurs Error / Warning de Timeline sans Semantic ; variante Accordion Alt fermée en largeur fixe ; place du gabarit Demo d'Accordion (mis en To review) ; absence d'en-tête pour Timeline Event.
