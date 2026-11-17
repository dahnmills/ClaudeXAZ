# Lot feedback-1 : librairie Feedback (`fH3vmSNZR8r0sU3kN455CD`), 2026-11-16

Composants : Badge, Badge (counter), Skeleton Item, Spinner, Toaster. Modèle : Action > Button (4030:979). Kits : `doc-kit.js`, `board-kit.js`, `page-kit.js` (copies exactes). Rien publié, aucun commit, aucun token, collection ou mode créé, aucun composant, variante ou propriété créé, renommé ou supprimé. Pages des autres agents, Cover et Status non touchées. Captures de contrôle hors repo : `C:/Users/JDAHAN/AppData/Local/Temp/fb1/`.

## Méthode de vérification de l'étape 1
- Signature de géométrie (positions absolues, tailles, opacité, paddings, gap, 4 rayons, épaisseur de trait, fills et strokes, texte) par racine (variantes + instances du fichier), hash avant/après.
- Capture `get_screenshot` du gabarit `_Design system header` de la page (qui contient le composant et des instances), avant/après, comparée par md5.
- Badge : instances du fichier Action vérifiées en lecture (pages Status 602:1512 : 139 instances ; Cover 0:1 : 1 instance) : leurs overrides ne portent que sur width/height, visible et texte, aucun sur padding, rayon ou fill. Les liaisons posées ont la même valeur résolue, donc rien ne bouge à la publication.

## Badge (page 140:2)
- Section `Badge` **560:532** (6594 x 4289). Documentation **560:533**, Do/Don't **560:604**. Header 01 : 141:65, Versionning : 141:218.
- Étape 1 (sets 141:98 Badge, 141:139 .Badge, 141:151 et 141:162 .Content Properties) :
  - posées : padding horizontal 4 vers `Measurement/Spacing/XS` (10 variantes S + .Content), 8 vers `Spacing/S` (10 variantes M), rayons 100 vers `Border/Radius/Round` (80 coins, 20 variantes), padding 2 et gap 2 vers `Spacing/XXS` (Frame 28 de .Content Properties) ; texte Label des 4 variantes de .Content Properties : variable legacy `qrn / light/tag/Color/label/info` (#FFFFFF) remplacée par `Color/Static/Text/Subtle/Primary` (même valeur).
  - différé : gap 10 des 20 variantes (aucun Semantic à 10, un seul enfant, sans effet visible) ; fills et vecteurs des icônes imbriquées (`🔗 Icon`, dont un `qrn foundation/color/grey/500`) : ils appartiennent au composant Icon, pas à Badge.
  - description posée sur 141:98.
  - vérification : capture du header identique au md5 près. Signature : le hash global a changé parce que l'autre agent a créé des instances de Badge sur ses pages entre les deux mesures (75 puis 83 instances) ; pour les 4 composants suivants la signature a été prise dans le même périmètre et elle est identique.
- Frames do/dont (section ZeroHeight vidée puis supprimée par le kit, frames reparentées) :

| Règle (texte exact, `badge.md`) | Frame | nodeId |
|---|---|---|
| Do : Keep the label to one or two words. | do · badge · one or two words | 547:820 |
| Don't : Write a sentence in a badge. | dont · badge · sentence in a badge | 547:843 |
| Do : Use the status color that matches the meaning. | do · badge · warning for attention | 547:854 |
| Don't : Use Error for an attention-only message (use Warning). | dont · badge · error for attention | 547:874 |
| Do : Use Neutral for states without judgment. | do · badge · neutral without judgment | 547:894 |
| Don't : Use Info as a default decoration. | dont · badge · info as decoration | 547:914 |

- Text only : aucune. Pas de frame anatomy (l'anatomie est dans Documentation).
- To review : section `Badge - To review` **560:657** : 2e header « Documentation » 141:173 (ancien Do/Dont, libellé « Tag ») et `Frame 3` 222:2435 (planches de couleurs en hex, brouillon). Aucun COMPONENT dedans.
- Header 01 rempli : description (l'ancienne commençait par « Tag, is a small element… »), statuts Design Ready, Tech In code. Version laissée à 2.0.0.

## Badge (counter) (page 257:2)
- Section `Badge (counter)` **560:811** (6594 x 3263). Documentation **560:812**, Do/Don't **560:883**. Header 01 : 336:4339, Versionning : 336:7547.
- Étape 1 (COMPONENT 257:5) : posées : padding 2 du Wrapper vers `Spacing/XXS` ; texte du nombre : taille vers `Font/Text Style/Size/S`, interlettrage 0,5 vers `Letter Spacing/M`, graisse vers `Font Weight/Bold`, famille vers `Font/Family`. Différé : interligne 12 (aucun Semantic à 12). Description posée. Signature identique, capture identique.
- Frames do/dont : vraies instances de Tab (librairie Action, importée par clé) et du compteur.

| Règle (texte exact, `badge-counter.md`) | Frame | nodeId |
|---|---|---|
| Do : Show the counter only when the count is above zero. | do · badge-counter · only above zero | 549:587 |
| Don't : Show "0". | dont · badge-counter · zero shown | 549:647 |
| Do : Keep the counter on navigation elements. | do · badge-counter · on navigation | 549:697 |
| Don't : Use it as a status. | dont · badge-counter · used as a status | 549:747 |

- To review : section **560:932** : 2e header 336:7567 (doc copiée de Radio).
- Header 01 rempli : description (elle valait « Badge »), Design Ready, Tech Planned. Titre du header laissé à « Badge » (nom Figma du composant).

## Skeleton Item (page 117:2)
- Section `Skeleton Item` **562:85** (6594 x 3226). Documentation **562:86**, Do/Don't **562:157**. Header 01 : 337:9503, Versionning : 337:12711.
- Étape 1 (set 117:5, COMPONENT .Animation 117:4) : posées : rayons 4 vers `Border/Radius/S` (8 coins) ; dégradé de .Animation : 3 arrêts liés à `qrn foundation/color/grey/050` et `grey/025`, 1 arrêt en dur, tous reliés à `Color/Static/Background/Main/Tertiary` (0 % et 100 %) et `Main/Secondary` (25 % et 65 %), mêmes valeurs. Description posée. Signature identique, capture identique.
- Frames do/dont, fond `Static/Background/Main/Primary` (décision : la barre est elle-même en Main/Secondary, invisible sur le fond imposé ; même exception que `anatomy.bg` de Tile). Mêmes fonds blancs pour les vignettes States de la doc.

| Règle (texte exact, `skeleton-item.md`) | Frame | nodeId |
|---|---|---|
| Do : Mirror the real layout with skeleton items. | do · skeleton-item · mirror the real layout | 549:62 |
| Don't : Show a generic block that does not match. | dont · skeleton-item · generic block | 549:72 |
| Do : Replace the whole skeleton at once when data arrives. | do · skeleton-item · whole card loading | 549:76 |
| Don't : Mix loaded and skeleton rows in one card. | dont · skeleton-item · loaded and skeleton rows mixed | 549:98 |

- To review : section **562:206** : 2e header 337:12731.
- Header 01 rempli : description (texte de Popover copié), Ready / In code. Titre et fil d'Ariane du header restent « Skeleton ».

## Spinner (page 14:2)
- Section `Spinner` **561:708** (6594 x 3287). Documentation **561:709**, Do/Don't **561:780**. Header 01 : 337:8903, Versionning : 337:9017.
- Étape 1 (set 264:10) : tout était déjà lié au Semantic, seule la description a été posée. Signature identique, capture identique.

| Règle (texte exact, `spinner.md`) | Frame | nodeId |
|---|---|---|
| Do : Use one spinner per loading area. | do · spinner · one spinner per area | 549:153 |
| Don't : Show several spinners for one load. | dont · spinner · several spinners for one load | 549:158 |
| Do : Switch to Skeleton Item when you know the layout. | do · spinner · skeleton when layout is known (360 x 180, fond Main/Primary) | 549:180 |
| Don't : Use a spinner for a whole page of cards. | dont · spinner · spinner for a page of cards (360 x 180, fond Main/Primary) | 549:200 |

- To review : section **561:829** : 2e header 337:9037.
- Header 01 rempli : description (texte de Popover copié), Ready / In code.

## Toaster (page 124:848)
- Section `Toaster` **561:471** (6594 x 4531). Documentation **561:472**, Do/Don't **561:543**. Header 01 : 337:2514, Versionning : 337:2651.
- Étape 1 (set 125:1116) : posées : padding 16 vers `Spacing/M`, 24 vers `Spacing/L`, gap 16 vers `Spacing/M`, rayons 4 vers `Border/Radius/S` (16 coins), trait 1 vers `Border/Size/S` (4 variantes) ; texte de contenu (4) : taille `Size/L`, interligne `Line Height/L`, interlettrage `Letter Spacing/None`, graisse `Regular`, famille. Différé : gap 10 du cadre Action ; vecteur `Path` #006192 dans le Button imbriqué (appartient à Button). Description posée. Signature identique, capture identique.
- Frames do/dont en 400 px de large (le toast fait 352 px), hauteurs égales par paire.

| Règle (texte exact, `toaster.md`) | Frame | nodeId |
|---|---|---|
| Do : Use a toast for the result of the action the user just did. | do · toaster · result of the user action | 548:315 |
| Don't : Use it for unrelated system news. | dont · toaster · unrelated system news | 548:333 |
| Do : Keep errors with a way out (Retry, a link). | do · toaster · error with a way out | 548:353 |
| Don't : Show an error toast with no next step. | dont · toaster · error with no next step | 548:373 |
| Do : Show one toast per action. | do · toaster · one toast per action (400 x 304) | 548:393 |
| Don't : Stack several toasts for one event. | dont · toaster · stacked toasts for one event (400 x 304) | 548:411 |

- To review : section **561:596** : 2e header 337:2671 et une instance isolée de Button Icon (131:2124, posée seule au-dessus de la page, aucun usage).
- Header 01 rempli : description (texte de Checkbox copié), Ready / In code.

## Résultats du kit (les 5 pages)
`miss` vide pour buildDoc, buildBoard et normalize ; `lost` vide (24 frames do/dont, ids et noms intacts) ; `overlaps` vide. Six sections Documentation par page (Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility).

## Contrôle visuel (2 passes par composant)
- Passe 1 : skeletons invisibles sur fond gris (fonds passés en Main/Primary) ; onglets collés dans les frames du compteur (gap `Spacing/L`) ; libellé du badge « phrase » plus large que la frame (raccourci) ; repères d'anatomie hors cible sur Badge (1), compteur (1) et Spinner (1, 2) : recalés sur le corps du composant.
- Passe 2 : sections complètes, headers remplis, planche Toaster zoomée : textes non coupés, descriptions Hero sur une ligne, cartes équilibrées.

## Écarts Figma / code (dans les Notes des docs, non corrigés)
- Badge : taille par défaut M (Figma) / s (code) ; padding 4 en S et 8 en M (Figma) / 8 partout (code) ; badge sans libellé sans équivalent code ; version 2.0.0 (header, changelog) / 1.0.0 (components.json) ; défaut Icon False dans le .md / icône affichée par défaut dans Figma.
- Compteur : composant nommé `Badge` dans Figma ; pas de `ds-` (dessiné par Tab, 16 px, padding 4 hors tokens) ; règle de débordement (99+) non définie.
- Skeleton Item : largeur 394 px (Figma) / 100 % (code) ; styles inline hors tokens ; pas de `prefers-reduced-motion`.
- Spinner : arc Icon/Main/Tertiary (Figma) / Background/Accent/Secondary (code), piste idem ; une taille Figma (14) / défaut m (20) en code ; pas de `prefers-reduced-motion`.
- Toaster : statut par défaut Success (Figma) / info (code) ; action en Button (Figma) / ds-link (code) ; états d'entrée et de sortie seulement en code.

## Points ouverts
- Les cadres `Versionning` restent les gabarits vides (« Changelog Draft v.X.X »), non remplis faute de changelog daté.
- Titre du header Skeleton (« Skeleton ») et du compteur (« Badge ») laissés tels quels.
- Les liens ZeroHeight sont des textes sans URL (pages non publiées).
