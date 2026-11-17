# Page kit, lot E : librairie Data Entry (`1wVY9FfjONIX6us9JmIm7U`)

Date : 2026-11-16. Kit : `docs/figma/doc-kit/page-kit.js`. Référence : Action > Button (4030:979).
Collection Semantic de la librairie Tokens disponible : oui. Sur les 5 pages, `lost`, `miss` et `overlaps` sont vides.

## Constats communs

- Les 5 pages ont un vrai gabarit `_Design system header` (logo `Header Q/First slot/Logo`, fil d'Ariane, bloc Component). Il a été restylé en place en 01 Component. Le logo de 02 et 03 est cloné depuis ce gabarit.
- Aucune page n'a de cadre `Versionning` : la ligne commence donc par le header (écart avec Button, à créer si on le veut).
- Aucun 2e gabarit ni brouillon : aucune section `To review` créée, rien n'a été rangé.
- Les sections `ZeroHeight · X illustrations` ont été vidées puis supprimées par le kit. Toutes les frames do/dont sont présentes avec le même id et la même taille.
- Search Bar Home : le gabarit contient un COMPONENT seul (3098:3), pas un COMPONENT_SET. C'est bien le composant de la page, je l'ai donc traité comme headerId.

## Corrections du kit (page-kit.js)

1. `moveDoc` : les repères d'Anatomy (Pin, Leader, Target, en position absolue) ne suivaient pas quand le canvas centré s'élargit (1214 à 1640 px) : ils se retrouvaient à 181 px de leur cible. Le kit mémorise désormais la position du premier enfant en flux et décale les repères du même écart. Premier jet avec `it.findAll?` : plantait sur un nœud TEXT, corrigé en `'findAll' in it`.
2. Rangées Do/Don't passées en colonne : la hauteur restait fixe et la carte Don't était coupée. Un autre agent avait déjà corrigé le même point en parallèle (`r.layoutSizingVertical='HUG'`), j'ai gardé sa version.
3. Non intégré au kit, appliqué par script sur les pages en rangée horizontale (Tag Filter Chip, Grid Selection, File Upload) : la hauteur de la rangée est alignée sur la carte la plus haute, et les cartes et l'Illustration passent en FILL. Les légendes s'alignent alors en bas, et l'illustration Do de File Upload (286 px) ne déborde plus sur le bandeau. À reporter dans `moveBoard` si on valide.

## Search Bar Home (page 3098:2)

- Section `Search Bar Home` : 3137:338 (6040 × 4169)
- 01 header : 3099:23 ; 02 Documentation : 3137:339 ; 03 Do/Don't : 3137:410
- Sections Documentation : Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility
- Sections Do/Don't : One bar, scoped correctly ; Labels
- Frames do/dont vérifiées (4) : 3111:139, 3111:346, 3111:157, 3111:264 (800 px de large). Les rangées passent en colonne (800 > demi-largeur). La description de 03 est réécrite en conséquence (« what to do first, what to avoid just below »).
- Corrigé à la main : hauteur des rangées en colonne, cartes « Missing dont » en HUG, repères Anatomy recalés de +181 px.
- Écarts : le repère 9 (Section label) figure dans la légende sans marqueur sur le canvas (déjà absent dans le doc kit). Les libellés IMMO DU MARAIS, AMAZON et EASYJET dépassent de leur parent dans le COMPONENT : je n'y ai pas touché.

## Search Bar Multi (page 3102:2)

- Section `Search Bar Multi` : 3144:1252 (6040 × 4900)
- 01 header : 3103:498 ; 02 Documentation : 3144:1253 ; 03 Do/Don't : 3144:1324
- Sections Do/Don't : Field order and scope ; Disabled controls ; Errors
- Frames do/dont vérifiées (4) : 3113:613, 3113:801, 3113:694, 3113:746 (1560 px). Rangées en colonne. Il reste 120 px de marge de chaque côté du cadre de 1800 px, donc rien ne déborde. Dans la carte, la frame empiète de 17 px sur le padding de l'Illustration (1560 dans 1526 utiles), sans être coupée.
- Écart : le repère 9 (Error message) est dans la légende sans marqueur.

## Tag Filter Chip (page 3104:1002)

- Section `Tag Filter Chip` : 3146:702 (6040 × 4686)
- 01 header : 3104:1455 ; 02 Documentation : 3146:703 ; 03 Do/Don't : 3146:774
- Sections Do/Don't : Chip, field and choice type ; Search on long lists
- Frames do/dont vérifiées (4) : 3115:363, 3115:515, 3115:394, 3115:454 (720 px), en rangée Do | Don't.
- Écart : le repère 8 (Chip trigger) est dans la légende sans marqueur (la variante Chip n'est pas dessinée sur le canvas).

## Grid Selection (page 3105:2)

- Section `Grid Selection` : 3148:296 (6040 × 4568)
- 01 header : 3106:2 ; 02 Documentation : 3148:297 ; 03 Do/Don't : 3148:368
- Sections Do/Don't : Layout previews ; Selection and label
- Frames do/dont vérifiées (4) : 3116:568, 3116:753, 3116:626, 3116:675 (720 × 204), en rangée.
- Écart : le repère 5 (Selected state) est dans la légende sans marqueur, ce qui est logique pour un état.

## File Upload (page 3107:2)

- Section `File Upload` : 3150:264 (6040 × 4222)
- 01 header : 3107:852 ; 02 Documentation : 3150:265 ; 03 Do/Don't : 3150:336
- Sections Do/Don't : Hint and browse ; Errors and purpose
- Frames do/dont vérifiées (4) : 3117:354, 3117:413, 3117:372, 3117:432 (640 px), en rangée.
- Écarts : la version affichée est 0.1.0 (1.0.0 sur les 4 autres pages), c'est la valeur reprise du doc kit. Le repère 6 (File row) est dans la légende sans marqueur.

## Décisions à prendre

1. Créer un cadre `Versionning` pour ces 5 composants, comme sur Button ?
2. Reporter dans `moveBoard` l'alignement des cartes d'une rangée (point 3 ci-dessus) ?
3. File Upload : version 0.1.0 voulue, ou à passer en 1.0.0 ?
4. Ajouter les marqueurs absents (repères 8 et 9 des légendes) dans les canvas d'Anatomy ?
5. Bloc Component de Search Bar Home et Search Bar Multi : le contenu est calé à gauche et la moitié droite de la boîte reste vide. Je l'ai laissé tel quel : c'est le gabarit, et la composition est la même que sur Button.
