# Page kit, lot F (2026-11-16)

Kit : `docs/figma/doc-kit/page-kit.js`. Pour chaque composant : `lost` = [], `miss` = [], `overlaps` = [] en fin de lot.
Collection Semantic de la librairie Tokens disponible dans les deux fichiers.
Le kit a été modifié sur disque pendant le lot par un autre chantier (recalage des marqueurs d'anatomie, empilement de toutes
les rangées Do/Don't, cartes en hauteur hug). Mes pages ont été normalisées avec la version précédente, puis mises à niveau à la
main pour donner le même résultat (voir « Corrections »). Je n'ai rien changé dans le kit.

## Data Display (`VpConH5AUGyCqtp8PMqj1i`)

### Action Card
- Page `2117:2` (🆕 Action Card). Section `Action Card` **2143:171** (6594 × 4546, même largeur que Button).
- Rangée : Versionning 2119:73 | `_Design system header` **2119:23** (vrai gabarit, contient le COMPONENT_SET 2117:1081) | Documentation **2143:172** | Do/Don't **2143:243**.
- Sections Documentation : Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility.
- Sections Do/Don't : Link label, Selectable cards, Rules without illustration.
- Frames do/dont vérifiées (id, nom et taille inchangés) : 2124:65 do · clear link label, 2124:81 dont · click here label, 2124:97 do · radio group with name (400 × 392).
- Supprimés : doc kit 2127:105 vidé, section ZeroHeight 2124:64 vide. To review : rien.
- Corrections : le gabarit faisait 2395 px de large, ramené à 1800 px comme Button (description en largeur auto puis FILL, le COMPONENT_SET n'est pas touché). Marqueurs d'anatomie décalés de +181 px (le canevas est passé de 762 à 1124 px de large et le contenu est centré).

### Pie Chart
- Page `2118:95` (🆕 Pie Chart). Section `Pie Chart` **2145:106** (6594 × 4091).
- Rangée : Versionning 2120:54 | `_Design system header` **2120:4** | Documentation **2145:107** | Do/Don't **2145:178**.
- Écart : le gabarit contient un COMPONENT seul (2118:177, sans variantes), pas de COMPONENT_SET. Je l'ai quand même pris comme headerId puisque c'est le vrai gabarit de la page.
- Sections Documentation : les 6 sections standard. Sections Do/Don't : Legend, Tooltip, Rules without illustration.
- Frames do/dont vérifiées : 2125:71 do · legend with values, 2125:89 dont · colour only, 2125:97 do · tooltip and text (400 × 260).
- Supprimés : doc kit 2133:67, section ZeroHeight 2125:70. To review : rien.
- Corrections : gabarit 2395 ramené à 1800 px, marqueurs d'anatomie +181 px.

## Layout (`bbgSPUChd18EVNGijjoZGn`)
Seules les pages Page Title (`4009:2`) et Overlay (`4009:3`) ont été touchées. La maquette 2865:10424 et les autres pages n'ont pas bougé.
**Aucun des 4 composants n'a de gabarit `_Design system header` ni de Versionning** : les composants restent en place,
la section ne contient que Documentation et Do/Don't, et le Hero n'a pas de logo (je n'en ai pas fabriqué).

### Page Title
- Page `4009:2`. Section `Page Title` **4046:304** à x 1560 (4080 × 4235), à droite du composant.
- Documentation **4046:305** (6 sections) | Do/Don't **4046:370** (Title, Action link).
- Frames do/dont vérifiées : 4024:3534, 4024:3566, 4024:3700, 4024:3723 (600 × 220).
- Laissés en place : COMPONENT 4010:13, Examples 4010:919, Notes / Page Title 4020:679.
- Supprimés : doc kit 4033:252, section ZeroHeight 4024:3533. To review : rien.
- Corrections : marqueurs d'anatomie +181 px. Les marqueurs 1 et 2 (Row, Icon slot) ne se voient pas sur le canevas : c'était déjà le cas dans le doc kit.

### Filter Drawer (page Overlay)
- Page `4009:3`. Section `Filter Drawer` **4047:3512** à x 4464, y 0 (4080 × 5459).
- Documentation **4047:3513** | Do/Don't **4047:3578** (Sections and tabs, Footer actions : rangées côte à côte, frames de 520 px).
- Frames do/dont vérifiées : 4026:628, 4026:754, 4026:1101, 4026:1203 (520 × 440).
- Supprimés : doc kit 4035:2287, section ZeroHeight 4026:627. Correction : marqueurs d'anatomie +181 px.

### Spotlight (page Overlay)
- Section `Spotlight` **4048:3512** à y 5859, 400 px sous Filter Drawer (4080 × 5342).
- Documentation **4048:3513** | Do/Don't **4048:3576** (Results, Record ID, Rules without illustration).
- Frames do/dont vérifiées : 4027:968 do · four rows at most, 4027:1062 do · id with copy action (760 × 320). Rangées en colonne, rien ne dépasse des 1800 px.
- Supprimés : doc kit 4035:3085, section ZeroHeight 4027:967.
- Corrections : en colonne, les cartes vides « Missing dont » (4042:3578, 4042:3592) gardaient 459 px de haut. Toutes les cartes empilées passent en hauteur hug, comme dans le kit à jour (66 px pour les cartes vides). Marqueurs d'anatomie +181 px.

### Shortcuts Panel (page Overlay)
- Section `Shortcuts Panel` **4049:3512** à y 11601, 400 px sous Spotlight (4080 × 4970).
- Documentation **4049:3513** | Do/Don't **4049:3576** (Panel content, Tabs and page).
- Frames do/dont vérifiées : 4028:1095, 4028:1336, 4028:1614, 4028:1833 (1320 × 520). Rangées en colonne, 1320 < 1576 px de boîte, rien ne déborde.
- Supprimés : doc kit 4035:3763, section ZeroHeight 4028:1094.
- Corrections : cartes empilées en hauteur hug, marqueurs d'anatomie +181 px.
- Laissés en place sur Overlay : COMPONENT_SET Filter Section, Filter Drawer, Keycap, Shortcut Row, Spotlight Row, Spotlight, COMPONENT Shortcuts Panel, et les 3 cadres `Notes / X`.

## Décisions à prendre
1. Créer un gabarit `_Design system header` (01 Component, avec Versionning) pour Page Title, Filter Drawer, Spotlight et Shortcuts Panel. On pourra ensuite relancer `styleHeader` et le placer en tête de chaque section. Sans gabarit, le Hero de Documentation et de Do/Don't n'a pas de logo.
2. Les cadres `Notes / X` des pages Layout (4020:679, 4020:625, 4020:632, 4020:637) recoupent la section Notes de la Documentation. Je les ai laissés près des composants. Faut-il les ranger en To review ?
3. Pie Chart : c'est un COMPONENT seul, pas un set. On le garde comme ça ?
4. Gabarits Data Display ramenés de 2395 à 1800 px pour s'aligner sur Button : à valider.
5. Atomes locaux sur Overlay (Filter Section, Keycap, Shortcut Row, Spotlight Row) : ils n'ont pas de section à eux. Faut-il leur en donner une ?
