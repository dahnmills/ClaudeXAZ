# Page kit, lot B (librairie Action `xCeEJPn6fliEshuE9fnrqs`)

Pages : Tag (101:2), Chip (456:152), Link (77:256), Breadcrumb (298:4382). 2026-11-16.
Toutes les sections suivent le modèle Button / Button Icon : Versionning | 01 Component | 02 Documentation | 03 Do/Don't, alignés en haut, 160 px de marge et d'écart. Sur chaque appel, `lost`, `miss` et `overlaps` sont revenus vides, sauf les chevauchements transitoires attendus sur Breadcrumb (voir plus bas).

## Tag (page 101:2)
- Section `Tag` : **4041:2779**, 6594 x 4186.
- 01 Component : `_Design system header` 230:1756 (restylé en place).
- Documentation · Tag : **4041:2780** (sections Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility).
- Do/Don't : **4041:2851** (sections Select tags, Filter tags, Statuses).
- Frames do/dont vérifiées : 6, aucune perdue.
- To review : section `Tag - To review` 4041:2904, qui contient le 2e gabarit « Documentation » 230:1849.
- Corrections :
  - Le gabarit gardait sa hauteur fixe (1254) alors que le Hero en ajoute : une bande grise apparaissait sous le contenu. Je l'ai passé en hauteur auto (1345). C'est un défaut du kit, corrigé dans `page-kit.js` (voir plus bas).
  - Les repères de l'anatomie (canvas 985:2090) étaient décalés de 181,5 px vers la gauche. Je les ai recalés (voir plus bas).

## Chip (page 456:152)
- Section `Chip` : **4042:3080**, 6594 x 4194.
- 01 Component : 456:153.
- Documentation · Chip : **4042:3081** (6 sections, mêmes titres que Tag).
- Do/Don't : **4042:3152** (Keep the set short, Statuses, Rules without illustration).
- Frames do/dont vérifiées : 4, aucune perdue.
- To review : `Chip - To review` 4042:3205, qui contient le 2e gabarit 456:289.
- Corrections :
  - Dans le gabarit, une boîte grise vide (Frame 9 456:196, emplacement d'atomes, sans contenu) suivait le composant. Je l'ai masquée, pas supprimée.
  - Les repères de l'anatomie (canvas 983:4118) ont été recalés de +181,5 px.

## Link (page 77:256)
- Section `Link` : **4043:3152**, 6594 x 4089. Les cadres Documentation, qui étaient à gauche du gabarit et à un autre y, sont maintenant dans la ligne.
- 01 Component : 235:3074.
- Documentation · Link : **4043:3153** (6 sections).
- Do/Don't : **4043:3224** (Navigate, do not act ; Links in paragraphs ; External links).
- Frames do/dont vérifiées : 6, aucune perdue.
- To review : `Link - To review` 4043:3277, qui contient le 2e gabarit 235:3165.
- Corrections : les repères de l'anatomie (canvas 976:1435) ont été recalés de +181,5 px.
- Écarts signalés, non corrigés (contenu, hors périmètre) :
  - Le gabarit contient deux sections titrées « Component ». La 2e porte un second COMPONENT_SET `Link` (689:4239 : 12 variantes State x Tone, sans description), à côté du set principal 688:4202. C'est à arbitrer (doublon ou ancien set ?).
  - Dans la frame do « External links » : le texte « Mark external links with the external input. » et l'icône crayon semblent faux (on attendrait « external icon » et l'icône lien externe). Je n'y ai pas touché, car la frame est visée par ZeroHeight.

## Breadcrumb et Crumb (page 298:4382)
La page porte deux composants. Il y a donc deux sections, empilées à 400 px d'écart.
- Section `Breadcrumb` : **4043:4775**, 6594 x 3366, en (0, 0).
  - Versionning 298:4437, 01 Component 298:4383.
  - Documentation · Breadcrumb : **4043:4776** (6 sections).
  - Do/Don't : **4043:4847** (End of the trail, Labels, Page actions).
  - Frames do/dont vérifiées : 6.
- Section `Crumb` : **4043:5336**, 4080 x 3345, en y = 3766. Pas de gabarit propre au Crumb : la section ne contient que 02 et 03.
  - Documentation · Crumb : **4043:5337** (6 sections).
  - Do/Don't : **4043:5400** (Current page, Rules without illustration).
  - Frames do/dont vérifiées : 2.
- To review : une section commune, renommée `Breadcrumb and Crumb - To review` (4043:5441, y = 7511). Elle contient le 2e gabarit « Documentation » 298:4457 et l'instance Crumb orpheline 688:246, qui traînait sur la page.
- Corrections :
  - Le COMPONENT_SET `Crumb` 705:4485 était un enfant direct du gabarit Breadcrumb, collé au bord gauche, hors de toute section. Je l'ai rangé dans une nouvelle sous-section `Frame Crumb` (4043:6140) du contenu du gabarit, au format des sections existantes : titre « Crumb », description d'une ligne, boîte grise 4043:6144. Le set garde son id, ses 2 variantes et ses propriétés : seul son parent change. **À valider par l'utilisateur.**
  - Les cadres 02 et 03 du Crumb n'avaient pas de logo : le repli par clé du kit n'a rien inséré. J'y ai ajouté un clone du logo du cadre Breadcrumb (4043:6145, 4043:6153).
- Chevauchements : l'appel Breadcrumb a signalé « Crumb x Breadcrumb » et « _Design system header x Breadcrumb ». Il s'agissait de l'instance orpheline et du 2e gabarit, encore en place à ce moment-là, rangés en review à l'appel suivant. L'état final ne présente aucun chevauchement.

## Kit (`docs/figma/doc-kit/page-kit.js`)
- **Défaut corrigé** : `styleHeader` passe désormais le gabarit en hauteur auto (`primaryAxisSizingMode='AUTO'`). Sans cela, un gabarit à hauteur fixe laisse le Hero repousser le contenu sous le fond (bande grise en bas). Constaté sur Tag.
- Pendant le lot, le fichier a été modifié en parallèle par un autre agent : recalage des repères d'anatomie dans `moveDoc`, repli logo par clé, `layoutSizingVertical='HUG'` des rangées en colonne. Tag, Chip et Link sont passés avant le recalage des repères : je les ai corrigés à la main avec le même décalage, mesuré sur les trois pages (le Tag, le Container Chip et le Link sont centrés, et leur repère 1 était 181,5 px à gauche du centre). Breadcrumb et Crumb ont bénéficié du correctif du kit.
- **À vérifier dans le kit** : le repli logo par clé (`importComponentByKeyAsync`) n'a rien inséré sur Crumb, sans erreur visible (le `try/catch` l'avale).

## Interdits respectés
Aucune frame `do · ...`, `dont · ...` ou `anatomy` n'a été renommée, dupliquée ou redimensionnée. Aucun COMPONENT ni aucune variante n'a été modifié (le set Crumb a seulement changé de parent). Rien n'a été supprimé hors des cadres du kit vidés et des sections ZeroHeight vides. Pas de publication, pas de token, pas de commit.
