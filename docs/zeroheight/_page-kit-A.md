# Page kit, lot A (librairie Action `xCeEJPn6fliEshuE9fnrqs`), 2026-11-16

Pages normalisées avec `docs/figma/doc-kit/page-kit.js` : une section au nom du composant, sur une ligne `Versionning | _Design system header (01) | Documentation · <Nom> (02) | Do/Don't (03)`, 160 px de marge et d'écart, alignés en haut. Pour chaque page, `lost`, `miss` et `overlaps` sont revenus vides. Rien n'a été publié, aucun token créé, aucun commit.

## Visual Button (page 288:822)
- Section `Visual Button` **4041:2909**, 6594 × 4104. Documentation **4041:2910** (1800 × 3784), Do/Don't **4041:2981** (1800 × 1774). Header 01 : 296:4153, Versionning : 296:4227.
- Sections Documentation : Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility. Sections Do/Don't : Number of buttons, Description.
- Frames do/dont vérifiées : 4 (944:6669, 944:6695, 944:6746, 944:6764), id et taille 560 × 300 inchangés.
- To review : section `Visual Button - To review` 4041:3030, qui contient le 2e `_Design system header` 296:4247 (titre « Documentation », ancien Do/Dont en doublon).
- Corrections : la description Do/Don't passait sur 2 lignes (le mot « right. » restait seul), raccourcie en « ... do on the left, avoid on the right. ». Les marqueurs Anatomy étaient décalés de 181 px vers la gauche (stage élargi) et ont été recalés.

## Button Load More (page 53:8307)
- Section `Button Load More` **4042:1451**, 6594 × 3555. Documentation **4042:1452** (1800 × 3235), Do/Don't **4042:1523** (1800 × 1694). Header 01 : 53:8308, Versionning : 53:8389.
- Sections Documentation : les 6 sections standard. Sections Do/Don't : Placement, Earlier results.
- Frames do/dont vérifiées : 4 (944:5200, 944:5238, 944:5276, 944:5314), 360 × 260.
- To review : section `Button Load More - To review` 4042:1572, qui contient le header doublon 53:8346.
- Corrections : la carte Resources est large (chemin de code long), donc les deux descriptions Hero passaient sur 2 lignes. Raccourcies : Documentation devient « Anatomy, properties, states, tokens and usage, aligned with the code. » et Do/Don't « Usage rules of the Button Load More on ZeroHeight: do on the left, avoid on the right. ». Marqueurs Anatomy recalés de 181 px.

## Button Range (page 720:437)
- Section `Button Range` **4043:4080**, 6594 × 4126. Documentation **4043:4081** (1800 × 3806), Do/Don't **4043:4152** (1800 × 2100). Header 01 : 720:472, Versionning : 720:569.
- Sections Documentation : les 6 sections standard. Sections Do/Don't : Length of the scale, Reading the range.
- Frames do/dont vérifiées : 4 (944:5351 360 × 140, 944:5391 820 × 140, 944:5453 360 × 180, 944:5498 360 × 140), tailles inchangées.
- To review : section `Button Range - To review` 4043:4201, qui contient le header doublon 720:526.
- Corrections :
  - la frame Don't de 820 px a fait passer la 1re règle en colonne, mais la 2e restait côte à côte (planche incohérente). Les deux règles sont maintenant empilées, Do au-dessus du Don't.
  - les cartes empilées gardaient leur hauteur fixe : la carte Don't de « Reading the range » avait un vide de 40 px en bas. Elles sont passées en hauteur auto.
  - les descriptions Hero sur 2 lignes ont été raccourcies : Documentation comme sur Load More, Do/Don't devient « Usage rules, as shown on ZeroHeight: what to do first, what to avoid just below. ».

## Button Split (page 69:447)
- Section `Button Split` **4043:6018**, 6594 × 3800. Documentation **4043:6019** (1800 × 3480), Do/Don't **4043:6090** (1800 × 1434). Header 01 : 96:1337, Versionning : 96:1434.
- Sections Documentation : les 6 sections standard. Sections Do/Don't : Menu items, Rules without illustration (comme sur Button Icon).
- Frames do/dont vérifiées : 2 (944:4589, 944:4635), 360 × 260.
- To review : section `Button Split - To review` 4043:6139, qui contient le header doublon 96:1391.
- Corrections : aucune. Les descriptions tiennent sur une ligne et les marqueurs Anatomy sont bien placés (le correctif du kit était déjà en place).

## Défauts du kit (page-kit.js)
1. **Marqueurs Anatomy décalés** : le stage est centré et s'élargit en passant de 1280 à 1800 px, mais les pins, leaders et targets, en position absolue, restaient sur place. Un autre agent a corrigé le kit pendant mon lot (ancrage sur le premier enfant en flux dans `moveDoc`). Visual Button et Load More, traités avant ce correctif, ont été recalés à la main. **Button (4030:979) et Button Icon (4040:1005) présentent probablement le même décalage** : je n'y ai pas touché, à vérifier.
2. **Correction faite dans `moveBoard`** : dès qu'une rangée passe en colonne, toutes les paires Do/Don't de la planche sont empilées, et les cartes empilées passent en hauteur auto. Les rangées de règles sans illustration ne bougent pas, et la description automatique « what to do first, what to avoid just below » devient exacte sur toute la planche.
3. **Point ouvert** : la description Hero par défaut passe sur 2 lignes dès que la carte Resources est large (chemin de code long). Je l'ai corrigé au cas par cas en passant `boardDesc` ou en éditant le texte. Le kit pourrait raccourcir automatiquement le texte quand il dépasse 30 px de haut.
