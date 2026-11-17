# Investigation : décalage des icônes de Side Navigation (Layout `bbgSPUChd18EVNGijjoZGn`), 2026-11-16

Contexte : rapport `_lib-rollout-layout-1.md`, section Side Navigation. Après deux scripts plantés et un troisième annulé, les icônes des items ont semblé bouger d'environ 1,5 px en x et 0,5 px en y (exemple cité : 1669,55 vers 1668). Rien publié, aucun commit, aucune écriture dans Figma pendant cette investigation (lectures seules, Layout compris). Modal, Drawer et la maquette 2865:10424 non touchés.

## Conclusion courte
- **L'état actuel de Layout est identique à la version publiée**, telle que la rendent les fichiers de fonctionnalités (Buyer Summary). Écart mesuré : 0,001 px au plus, rendu 1x identique au pixel.
- **Ce qui a bougé, c'était l'ancien état local de Layout, pas la version publiée** : la géométrie du booléen `Color` des icônes était un cache périmé, recalculé par les écritures du 16/11.
- **Aucune correction nécessaire**, aucune faite. Publier ne décalera rien dans les fichiers consommateurs.

## 1. Mesures

### Référence : Buyer Summary `0ZjZu0OjHdzGowm3hliM2M` (lecture seule)
Search `LBLqJmlPqXmx9qksCyYGPb` ne contient aucune instance de Side Navigation : son shell utilise les `.Item` de Header. Buyer Summary en contient 17 sur Screens, 6 sur Specs et 6 sur Overview, **toutes en Open=False**. Aucune instance Open=True dans les fichiers de fonctionnalités. Instance mesurée : `I21:26;15:3969` (dans `Board · Common` 21:26, 56 x 836).

### Comparaison (coordonnées relatives au coin de la Side Navigation, en px)

| Item (glyphe) | Boîte Icon, Layout 2083:6945 | Boîte Icon, référence | Vecteur, Layout | Vecteur, référence | Libellé (x, y, l, h) | Content |
|---|---|---|---|---|---|---|
| House | 16, 16, 24 x 24 | identique | 18,417 ; 18,013 ; 19,165 x 19,987 | identique | 48, 16, 39 x 24 (les deux) | 8, 8, 40 x 40 (les deux) |
| Mail Outline | 16, 64 | identique | 18 ; 68 ; 20 x 16 | identique | 48, 64 | 8, 56 |
| Grade story | 16, 112 | identique | 18,337 ; 118,3 ; 19,663 x 11,375 | identique | 48, 112 | 8, 104 |
| User-Business | 16, 160 | identique | 19 ; 163 ; 18 x 18 | identique | 48, 160 | 8, 152 |
| Policy Process | 16, 208 | identique | 20 ; 209 ; 19,039 x 22 | identique | 48, 208 | 8, 200 |
| L2R | 16, 256 | identique | 19 ; 259 ; 19 x 17,975 | identique | 48, 256 | 8, 248 |
| Side Panel Left (toggle) | 16, 696 (réf. 796, instance étirée à 836) | même position dans son item | 18 ; 700 | 18 ; 800 | 48, 696 / 796, 82 x 24 | 8, 688 / 788 |

Seule différence trouvée : la boîte du booléen `Color` vaut 17,999 dans Layout contre 18 dans la référence (Mail Outline, User-Business), et 19,165 contre 19,166 (House). Bruit de 0,001 px, sous le seuil de 0,01 px.

### Toutes les variantes et les groupes
Contrôle des invariants sur tout le fichier Layout (offset du vecteur dans la boîte 24 x 24, et boîte `Color` égale à la boîte du vecteur à 0,01 px près) :
- page Side Navigation : 106 icônes `Icon Functional` (set Side Navigation Open=True et Open=False, `.Side Navigation Item`, les 3 sets `.Item` 2083:6958, 2083:7028, 2083:7003, groupes Company Information 2348:5725, Assessment 2366:935, Tools 2368:2293, frames do/dont et doc). **0 écart.** Offsets constants par glyphe : Mail Outline 2 ; 4 (65 occurrences), House 2,417 ; 2,013, Grade story 2,337 ; 6,3, User-Business 3 ; 3, Policy Process 4 ; 1, L2R 3 ; 3, Side Panel Left 2 ; 4.
- page Search (Layout) : 133 icônes dans 19 instances Side Navigation, **0 écart**. 14 icônes à x fractionnaire (,67) : les instances 2613:3989 et 2613:4245 sont posées à x = 1151,67 et 2550,67 dans leur écran. Placement antérieur, sans lien avec l'incident.
- page Home page : aucune instance de Side Navigation ni de ses sous-composants.
- Open=True (2083:6933) : mêmes boîtes (16, 16 + 48 n) et mêmes offsets de glyphe qu'Open=False. Libellés en x = 48. Pas de référence publiée Open=True à comparer, mais la structure `.Item` est la même que celle d'Open=False, qui est vérifiée.

### Rendu
- Capture 1x de la référence (`21:26`, recadrée sur la barre) contre la capture 1x de Layout 2083:6945 : rangées Mail, Grade story, L2R et toggle **identiques au pixel**. Policy Process : 1 pixel à 12/255 (anticrénelage). Les rangées House et User-Business diffèrent seulement parce que la référence a User-Business en Selected (surcharge d'instance), pas à cause de la géométrie.
- Export PNG x4 du `Content` de chaque item : octets identiques pour Grade story, L2R et Side Panel Left. Pour les 4 autres, écarts de l'ordre de 0,0007 px dans les chemins SVG (exemple Mail : `M20.9993 4.00024` contre `M21 4.00029`).

## 2. Comparaison au code
`src/app/shared/ui/side-nav/side-nav-item.component.scss` et `side-nav.component.scss` :
- item : hauteur 40 (`--foundation-sizing-40`), padding 0 8 (`spacing-s`), gap 8. Figma : Content 40 de haut, padding 8, gap 8.
- colonne icône : 24 x 24 (`--semantic-measurement-sizing-l`), contenu centré. Figma : boîte Icon 24 x 24, glyphe à sa place dans le viewBox 24.
- panneau : padding 8 (`spacing-s`). Donc icône à x = 8 + 8 = 16 et libellé à 16 + 24 + 8 = 48, comme dans Figma (Layout et référence).
- toggle : `ds-icon` en 20 dans le code, boîte 24 dans Figma (écart antérieur, hors incident).
Le rendu actuel de Layout est cohérent avec le code ; l'ancien état périmé (icônes à +1,55 px) ne l'était pas.

## 3. Cause
Le maître `Icon Functional / Type=Monochrome` (librairie Icons, 2024:252) contient le glyphe par défaut **Edit Pen**, dont le booléen `Color` occupe 3,546 ; 3,545 ; 16,909 x 16,909. Dans les instances, le glyphe est remplacé (Mail Outline, House, etc.), et la boîte du booléen doit être recalculée à partir du nouveau glyphe (Mail Outline : 2 ; 4 ; 20 x 16).

Dans Layout, ce recalcul n'avait pas été fait : les `Color` gardaient la géométrie d'Edit Pen. Le décalage cité correspond exactement à cette différence :
- x : 3,546 moins 2 = **1,546 px** (1669,55 vers 1668 pour une boîte posée à 1666) ;
- y : 3,545 moins 4 = **-0,455 px** (le « 0,5 px » du rapport).

Les écritures du 16/11 sur les maîtres (liaisons partielles puis annulation) ont invalidé la mise en page des instances imbriquées, et Figma a recalculé les booléens. Ce n'est ni une contrainte, ni un `layoutSizing`, ni une taille non entière : boîtes Icon en 24 x 24 FIXED, contraintes MIN/MIN, glyphe en SCALE/SCALE, tout est inchangé. Les fichiers de fonctionnalités affichaient déjà la géométrie juste : ils recalculent le booléen de leur côté, ce qui explique que la référence corresponde à l'état actuel, pas à l'ancien.

Les captures `sidenav-before.png` / `sidenav-after.png` du lot layout-1 (2085 px différents, tous dans la zone des icônes) montrent donc un rattrapage du cache local, pas un changement de la version publiée.

## 4. Correction
Aucune. Revenir à l'ancien rendu de Layout serait revenir à un cache faux, que ni le code ni les fichiers de fonctionnalités ne reflètent. L'état actuel redonne déjà le rendu de référence à 0,01 px près (0,001 px mesuré).

## 5. Captures (hors repo, `C:/Users/JDAHAN/AppData/Local/Temp/snv/`)
- `before-crop.png` / `after-crop.png` : zoom x3 des captures du lot layout-1 avant et après le recalcul (le Mail est à environ 1,5 px plus à droite avant).
- `ref-top.png` : référence Buyer Summary, barre Open=False, zoom x4.
- `lay-top.png` : Layout 2083:6945 actuel, même cadrage, zoom x4. Glyphes à la même place ; seule la sélection diffère (surcharge de l'instance de référence).
- `ref-board.png`, `lay-after.png` : captures 1x sources ; `cmp.js` et `crop.js` : scripts de comparaison.

## Risque restant
- Publication : pas de décalage attendu dans les fichiers de fonctionnalités. À la mise à jour de la librairie, l'écart sera au plus 0,001 px (bruit de chemin).
- Le même cache périmé peut subsister ailleurs dans Layout (autres pages, autres icônes `Icon Functional` imbriquées : Header, Modal, Drawer, non contrôlés ici) et se recaler de 1,5 px à la prochaine édition d'un maître. Ce serait alors un recalage local vers le rendu déjà publié, pas une régression.
- Écart antérieur à noter : toggle en 20 px dans le code contre 24 dans Figma.
