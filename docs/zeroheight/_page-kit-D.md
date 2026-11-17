# Lot D : pages normalisées (librairie Action `xCeEJPn6fliEshuE9fnrqs`)

Kit utilisé : `docs/figma/doc-kit/page-kit.js` (2026-11-16). Pour chaque composant, `lost` et `miss` sont vides. Les seuls `overlaps` signalés pendant la passe étaient transitoires (cadre doc kit du composant suivant, supprimé à l'appel d'après). Contrôle final : aucun chevauchement sur les deux pages.

## Page Flyout Menu (1:3)

Inventaire des gabarits `_Design system header` :
- `507:1018` : version 1.0.0, contient `Flyout Menu` 507:833 (Slot, v3.0.0, la référence selon la note 1 du doc) et, en Atoms, `Flyout Item` 507:996. C'est le 01 Component de Flyout Menu.
- `235:2154` : Legacy 2.0.0, contient l'ancien set `Flyout Menu` 1:20 (# Items 1 à 7) et le privé `.Item` 1:56.
- `235:2290` : ancien cadre Do / Dont (doublon).

### Flyout Menu
- Section `Flyout Menu` **4041:3035** (-626, -2404 ; 6594 x 3658) : Versionning 235:2333 | 01 `_Design system header` 507:1018 (restylé en place) | Documentation **4041:3036** | Do/Don't **4041:3107**.
- Sections doc : Anatomy, Properties, States and variants, Tokens, Notes, Usage and accessibility. Sections Do/Don't : Structure, Closing, Rules without illustration.
- Frames do/dont vérifiées (id, nom, taille 560 x 460 inchangés) : 944:7237, 944:7276, 944:7335, 944:7368.
- Section ZeroHeight 944:7236 vidée puis supprimée, cadre doc kit 983:1341 vidé puis supprimé.
- **To review** `Flyout Menu - To review` **4041:3160** (sous la ligne, à 400 px) : 235:2154 (Legacy 2.0.0) et 235:2290 (ancien Do / Dont).

### Flyout Menu Item
- Section `Flyout Menu Item` **4041:3161** (-626, 5194 ; 4080 x 4143), 400 px sous To review : Documentation **4041:3162** | Do/Don't **4041:3225**. Pas de 01 Component ni de Versionning propres : le composant `Flyout Item` 507:996 vit dans les Atoms du gabarit de Flyout Menu.
- Sections doc : les 6 habituelles. Sections Do/Don't : Icons, Unavailable items, Rules without illustration.
- Frames do/dont vérifiées (560 x 300) : 944:7433, 944:7462, 944:7487, 944:7510.
- Section ZeroHeight 944:7432 et cadre doc kit 983:1750 supprimés une fois vides.

### Décisions à prendre (Flyout)
1. **Legacy 2.0.0 (235:2154)** : je l'ai rangé en To review parce que ce n'est pas le gabarit de référence. Il porte encore les composants 1:20 et 1:56, qui restent publiés tant que leurs consommateurs ne sont pas migrés (note 1). Trois options : le garder en To review, lui créer une section `Flyout Menu - Legacy 2.0.0`, ou le remettre dans la rangée de Flyout Menu.
2. **01 Component de Flyout Menu Item** : faut-il sortir `Flyout Item` 507:996 dans un gabarit à lui ? Il est aujourd'hui en Atoms du gabarit Flyout Menu. Je ne l'ai pas fait, pour ne pas toucher aux composants.
3. Bloc Component du gabarit 507:1018 : le maître Slot 507:833 s'affiche comme une barre vide (slot sans contenu). C'était déjà le cas avant, je n'y ai pas touché (COMPONENT). Ajouter une instance d'exemple à côté du maître serait plus parlant.

## Page Utility (950:2)

Pas de gabarit d'en-tête ni de Versionning : il n'y a donc **pas de cadre 01 Component**. Le cadre `Utility sections` 950:3 (0, 0 ; 1160 x 2748), qui contient les composants, reste à sa place sans modification. Les 5 sections sont empilées à sa droite (x = 1560), avec 400 px entre elles.

| Composant | Section | Documentation | Do/Don't | Frames do/dont vérifiées | ZeroHeight + doc kit supprimés |
|---|---|---|---|---|---|
| Keycap | 4042:3206 (y 0) | 4042:3207 | 4042:3270 | 963:114, 963:124, 963:129, 963:139 (360 x 140) | 963:145, 981:1847 |
| Shortcut Keys | 4043:965 (y 3921) | 4043:966 | 4043:1029 | 964:111, 964:123, 964:130, 964:140 (360 x 140) | 964:144, 981:5377 |
| Shortcut Row | 4043:3278 (y 7625) | 4043:3279 | 4043:3342 | 966:499, 966:542, 966:576, 966:605 (600 x 220) | 966:634, 981:6365 |
| Keyboard Map | 4043:3617 (y 12235) | 4043:3618 | 4043:3681 | 967:1176, 967:1258, 967:1361, 967:1477 (1020 x 240) | 967:1560, 981:8654 |
| Flag | 4043:4202 (y 16704) | 4043:4203 | 4043:4266 | 965:128, 965:148, 965:170, 965:189 (360 x 140) | 965:198, 982:1514 |

Rien n'est rangé en To review sur cette page. Sections Do/Don't : Keycap (Label content, Key size), Shortcut Keys (Number of keys, Sequences), Shortcut Row (Where to use it, Label and leader), Keyboard Map (Rows drawn, Layout source, Shortcuts and layout, Rules without illustration), Flag (Name next to the flag, Size, Rules without illustration).

### Décisions à prendre (Utility)
1. **01 Component absent pour les 5 composants.** Deux options : créer un `_Design system header` par composant et y déplacer la sous-section correspondante de `Utility sections` (Keycap section 950:4, Shortcut Keys section 950:45, Shortcut Row section 951:6, Keyboard Map section 951:147, Flag section 952:102), ou garder `Utility sections` comme planche commune.
2. Keyboard Map, illustrations : le tag `QWERTZ (` est coupé dans les frames do/dont. C'est le défaut connu de la note 4 du doc (Tag picker de 423 px dans un cadre latéral de 360 px). Il se corrige sur le composant, pas sur la page.

## Corrections après les captures (2 passes)
- Logo absent des cadres 02 et 03 quand il n'y a pas de gabarit (Flyout Menu Item et les 5 composants Utility) : j'ai ajouté une instance du logo `Header Q/First slot/Logo` en tête du fil d'Ariane (12 cadres).
- Descriptions du Hero qui passaient sur deux lignes avec un mot orphelin. Quand le chemin Code est long, la carte Resources s'élargit. J'ai mis des formulations plus courtes de même sens : « Usage rules of the X on ZeroHeight: ... » et « ... usage of the X, aligned with the code. » Cadres concernés : Flyout Menu (03), Flyout Menu Item (02 et 03), Shortcut Row (03), Keyboard Map (02).
- Keyboard Map, rangées passées en colonne (frames de 1020 px) : les cartes vides « No Do/Don't illustrated » gardaient 379 px de haut. Elles sont maintenant ajustées à leur contenu (66 px).
- Flag, « Rules without illustration » : la carte Don't seule n'occupait que la moitié de la rangée. Elle prend maintenant toute la largeur et l'espaceur est masqué (rien n'est supprimé).

## Défauts du kit corrigés dans `page-kit.js`
- Logo sans gabarit : `normalize` accepte maintenant `O.logoId`, l'id d'une instance du logo prise sur n'importe quelle page (par exemple 507:1024 sur Flyout Menu). L'import par clé échoue sur ce logo de librairie (`Component with key ... not found`).
- Descriptions du Hero : après la construction, une description qui passe sur deux lignes est remplacée par une formulation plus courte de même sens.
- Rangée passée en colonne : les enfants sont en HUG vertical (le correctif était déjà présent sur disque quand j'ai voulu l'ajouter).
