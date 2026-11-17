# Page kit, lot C (librairie Action `xCeEJPn6fliEshuE9fnrqs`), 2026-11-16

Normalisation par `docs/figma/doc-kit/page-kit.js` : une section par composant, sur une ligne
Versionning | `_Design system header` (01) | `Documentation · <Nom>` (02) | `Do/Don't` (03), 160 px de marge et d'écart.
Pour chaque page : `lost`, `miss` et `overlaps` vides. Aucun COMPONENT, COMPONENT_SET ni frame `do · / dont ·` modifié
(ni renommé, ni redimensionné). Rien publié, aucun token créé, pas de commit.

## Pagination (page 52:779)
- Section `Pagination` 4041:2653, 6594 × 4010. Documentation 4041:2654, Do/Don't 4041:2725.
- Sections Documentation : Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility.
- Sections Do/Don't : Stable page size, Under the list. 4 frames do/dont vérifiées (944:5838, 944:5931, 944:6030, 944:6129).
- To review (4041:2774) : 2e `_Design system header` « Documentation » 53:8208.
- Écarts et corrections : les frames font 760 px, plus qu'une demi-rangée, donc Do au-dessus du Don't. Le kit passait la rangée
  en vertical sans la remettre en hauteur auto : le Don't était coupé (seul son filet rouge dépassait). Corrigé sur les rangées
  1001:1113 et 1001:1134, et dans le kit. Description du Do/Don't ajustée (« what to do first, what to avoid just below »).

## Segmented Control (page 302:2)
- Section `Segmented Control` 4042:1986, 6594 × 4450. Documentation 4042:1987, Do/Don't 4042:2058.
- Sections Documentation : Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility.
- Sections Do/Don't : Number of segments, Disabled options, Rules without illustration. 4 frames do/dont vérifiées
  (944:4475, 944:4501, 944:4535, 944:4562), empilées (760 px).
- To review (4042:2111) : 2e `_Design system header` 595:5385.
- Écarts et corrections : la rangée « texte seul » (999:6806) avait été empilée à tort. Le test de largeur du kit
  (`/^(do|dont|anatomy)/`) attrapait aussi les cartes « Do card » / « Don't card ». Rangée remise côte à côte (cartes 776 px,
  comme Button Icon) et regex du kit corrigée (`/^(do|dont) ·|^anatomy/`).

## Tab (page 56:228)
- Section `Tab` 4043:3387, 6594 × 4586. Documentation 4043:3388, Do/Don't 4043:3459.
- Sections Documentation : Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility.
- Sections Do/Don't : Purpose, Width, Counter. 6 frames do/dont vérifiées (944:4798, 944:4848, 944:4898, 944:4964,
  944:5078, 944:5128), côte à côte (520 px).
- To review (4043:3512) : 2e `_Design system header` 57:633, et le cadre vide `Frame 4` 57:592 retiré du bloc Atoms.
- Écarts et corrections : dans l'en-tête, `.Options` (cadre 160:92) était posé sous Component sans titre, et le bloc
  Atoms (57:588) était masqué et vide. Bloc Atoms rendu visible, `.Options` rangé dedans (le jeu de composants n'est pas touché).

## Tile (page 615:77)
- Section `Tile` 4043:4562, 6594 × 4270. Documentation 4043:4563, Do/Don't 4043:4634.
- Sections Documentation : Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility.
- Sections Do/Don't : Icons, Row consistency. 4 frames do/dont vérifiées (944:6131, 944:6160, 944:6189, 944:6227), côte à côte (560 px).
- To review (4043:4683) : 2e `_Design system header` 615:299.
- Écarts : aucun. Le bloc Atoms de l'en-tête reste masqué (Tile n'a pas d'atome), comme dans le gabarit.

## Stepper (page 312:1332)
- Pas de composant, pas d'en-tête, pas de Versionning. Il y avait bien un doc kit `Documentation · Stepper` (988:21) : utilisé.
- Section `Stepper` 4044:1347, 4080 × 4016. Documentation 4044:1348, Do/Don't 4044:1406 (ligne : Documentation | Do/Don't).
- Sections Documentation : Figma WIP mockups, Properties, Tokens, Notes, Usage and accessibility.
- Section Do/Don't : Rules without illustration (4 règles texte seul en 2 rangées côte à côte). 0 frame do/dont (aucune n'existe).
  La section vide `Do and Don't board - Stepper` (1001:3488) a été supprimée par le kit.
- To review (4044:1443) : maquettes WIP orphelines `Frame 1` 312:1333.
- Écarts et corrections : sans en-tête, le kit ne trouve pas de logo. Logo cloné depuis l'en-tête Tab (57:556) dans les deux
  bandeaux. Description Documentation adaptée (pas d'Anatomy ni de States) : « WIP mockups, properties, tokens and usage of
  the Stepper, aligned with the code. No Figma component exists yet. »

## Corrections apportées à page-kit.js
1. `moveBoard` : une rangée passée en vertical reçoit `layoutSizingVertical = 'HUG'` (sinon le Don't est coupé).
2. `moveBoard` : la largeur la plus grande se mesure sur les seules frames `do · / dont · / anatomy`, plus sur les cartes.
3. `normalize` : si une rangée est empilée, la description du Do/Don't dit « what to do first, what to avoid just below »
   au lieu de « on the left / on the right ».
Note : un autre agent a ajouté en parallèle `primaryAxisSizingMode = 'AUTO'` en fin de `styleHeader`. C'est conservé, et
l'en-tête Pagination, traité avant cet ajout, était déjà en hauteur auto.
