# Corrections Figma Action (lot C) : non cassantes

Fichier [Components] Action (`xCeEJPn6fliEshuE9fnrqs`). Base : `_audit-figma-action-C.md`. Aucun nom, propriete, variante, dimension ou couleur modifie. Aucune variable creee. Les calques dans des instances imbriquees n'ont pas ete touches (pas d'override cree).

## Segmented Control (set `302:2197`, `.Content` `302:1938`)
1. Corrige : 155 bindings. Padding 16 (L/R) lie a `Measurement/Spacing/M`, padding 4 (T/B) a `Spacing/XS`, gap 8 a `Spacing/S`, rayon 4 (First/Last) a `Border/Radius/S`. Description renseignee.
2. Differe : gap 10 (aucun Semantic a 10, 24 occurrences) ; nom `Component 1`, groupe, repos bleu/gris, hover/active, disabled double, Position Single, focus, texte Label expose (decisions visibles ou renommage).
3. Verification : valeur resolue avant/apres identique a chaque binding, largeur/hauteur des noeuds inchangees (0 ecart), 24 instances de `.Content` avant/apres.

## Tab (set `57:231`, `.Options` `160:131`)
1. Corrige : 144 bindings. Gap 4 lie a `Spacing/XS` (48 calques), rayon 9999 lie a `Border/Radius/Round` (24 badges 12 px, rendu identique car plafonne a la demi-taille). Calque `Active` (masque) : 6 fills `foundation/.../blue/600` remplaces par `Color/Interactive/Border/Strong/Hover` (#006192) et 3 fills blue/650 par `Border/Strong/Active` (#075994), valeurs identiques. Description renseignee.
2. Differe : gap 10 (pas de Semantic) ; 3 fills `blue/700` (#003781) sans Semantic equivalent ; graisse Bold/Regular, defauts Selected/Dropdown/Badge, position du compteur, indicateur au survol, Changed, icone, focus, Mask, disabled double.
3. Verification : valeur resolue identique, dimensions inchangees, 25 instances de `.Options` avant/apres. Capture apres seulement (node `57:231`, 1063 x 312), pas de capture avant prise : l'absence de changement repose sur les comparaisons de valeurs.

## Stepper (page `312:1332`)
1. Corrige : rien (aucun composant, que des maquettes libres `Frame N`).
2. Differe : construction du composant `Stepper Step` + `Stepper`, orientation horizontale/verticale, 7 statuts, noms de calques, faute « Aditionnal info » (decisions produit et reconstruction).
3. Verification : sans objet.

## Pagination (set `53:2994`, `.Options` `53:2954`)
1. Corrige : 14 bindings. Gaps 24 / 16 / 8 / 2 lies a `Spacing/L`, `M`, `S`, `XXS` (set + `.Options`). Description renseignee.
2. Differe : noms de styles Classic/Infinite, type Select, page courante, ellipsis cliquable, gaps differents du code, Load more dans le set, booleen first/last, disabled, textes « of », fills bruts de `.Options` (23, hors Semantic, a traiter avec l'atome Link).
3. Verification : valeurs resolues identiques, dimensions inchangees, 1 instance de `.Options` avant/apres.
