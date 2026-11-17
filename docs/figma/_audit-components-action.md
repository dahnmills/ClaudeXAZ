# Audit des composants Figma, librairie Action (`xCeEJPn6fliEshuE9fnrqs`), 2026-11-17

Audit en LECTURE SEULE. Aucun nœud modifié, aucune liaison, aucun renommage, aucune publication, pas de commit. Scripts `use_figma` de lecture uniquement (parcours des maîtres, `boundVariables`, `componentPropertyDefinitions`, `componentPropertyReferences`, `getMainComponentAsync`, `detachedInfo`, `getPublishStatusAsync`).

Déjà tranché et non re-signalé (voir `docs/zeroheight/_decisions-figma-action.md`, `_audit-overrides-prepublish-2.md`) : Tone=Negative de Button, couleurs et nom de Segmented Control Item, graisse du Tab sélectionné, refonte de Pagination (Classic / Infinite / Load More, Select en Legacy), Link 689:4239 en Legacy, construction du Stepper, cadres 01 Component manquants, décisions ouvertes (Load More dans le set, Stepper horizontal, code à suivre).

## Méthode et limites

- 17 pages de composants lues (Button à Utility), plus Cover et Status (sans composant). Pour chaque set ou composant isolé : toutes les variantes, tous les nœuds du maître, sans descendre dans les instances imbriquées (elles appartiennent à leur atome).
- Critère 1 (tokens) : fills et strokes SOLID sans variable ni style, épaisseur de trait, rayons, paddings, gap (hors `SPACE_BETWEEN`), effets, textes sans style de texte ni variables. Collections trouvées : `Semantic` (attendu) et `qrn` (collection Foundation, nommée `qrn:foundation/...`). Toute liaison `qrn` dans un composant est un Foundation en direct.
- Critère 3 (fonctionnel) : propriétés jamais référencées par un calque, calques masqués non pilotés, matrice des variantes, largeur fixe sur des variantes à texte, états comparés à `src/app/shared/ui/<nom>/`.
- Limites : les surcharges des fichiers consommateurs ne sont pas relues ici (voir les deux audits de surcharges) ; l'estimation du risque de surcharge s'appuie sur ces audits. Aucun composant n'a de lien de documentation (`documentationLinks` vide partout) : c'est compté une fois en synthèse, pas répété dans chaque fiche.

## Tableau de synthèse

Compteurs = nombre de problèmes distincts par critère (T tokens, C composition, F fonctionnel, P propreté, V validation et page, Code écart avec Angular). Verdict : OK, à corriger, bloquant.

| Composant | nodeId | Variantes | T | C | F | P | V | Code | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| Button | 44:558 | 160 | 3 | 0 | 3 | 0 | 0 | 0 | à corriger |
| Button Icon | 12:145 | 256 | 3 | 0 | 0 | 0 | 0 | 0 | à corriger |
| Visual Button | 296:4137 | 4 | 3 | 1 | 1 | 1 | 0 | 1 | à corriger |
| Breadcrumb | 298:5526 | 1 | 0 | 1 | 0 | 0 | 1 | 0 | **bloquant** |
| Crumb | 705:4485 | 2 | 0 | 0 | 0 | 0 | 1 | 0 | OK |
| Button Load More | 53:8445 | 5 | 2 | 1 | 1 | 0 | 0 | 0 | à corriger |
| Button Range | 720:445 | 12 | 0 | 0 | 1 | 0 | 0 | 0 | OK |
| Button Split | 69:1883 | 4 | 0 | 0 | 0 | 0 | 0 | 1 | à corriger |
| Tag (+ 3 `.Options`) | 102:558 | 3 (+17) | 3 | 1 | 1 | 1 | 0 | 0 | **bloquant** |
| Chip | 456:438 | 16 | 3 | 0 | 1 | 0 | 0 | 1 | à corriger |
| Flyout Menu | 507:833 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | **bloquant** (clé) |
| Flyout Item | 507:996 | 4 | 2 | 0 | 1 | 1 | 1 | 1 | à corriger |
| Link | 688:4202 | 288 | 0 | 0 | 1 | 0 | 1 | 1 | **bloquant** (clé, set supprimé) |
| Pagination (+ `.Options`) | 53:2994 | 3 (+2) | 1 | 2 | 1 | 1 | 0 | 0 | **bloquant** |
| Segmented Control Item | 302:2197 | 24 | 1 | 0 | 1 | 1 | 0 | 0 | à corriger |
| Tab | 57:231 | 24 | 2 | 0 | 1 | 1 | 0 | 0 | à corriger |
| Tile (« Tiles ») | 615:84 | 8 | 3 | 0 | 2 | 2 | 0 | 1 | à corriger |
| Stepper (+ `.Stepper Step`) | 4083:368 | 2 (+14) | 0 | 0 | 0 | 1 | 2 | 0 | à corriger |
| Keycap | 950:24 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | OK |
| Shortcut Keys | 950:64 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | OK |
| Shortcut Row | 951:110 | 8 | 1 | 0 | 0 | 0 | 0 | 0 | à corriger |
| Keyboard Map | 951:150 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | à corriger |
| Flag | 952:165 | 7 | 0 | 0 | 0 | 1 | 0 | 0 | OK (couleurs nationales assumées) |
| Legacy / Deprecated publiés (5 sets) | voir § 18 | | 1 | 0 | 1 | 1 | 1 | 0 | à corriger |

Totaux : 23 composants actifs + 5 sets legacy. OK : 6. À corriger : 13 (+ legacy). Bloquant : 5 (Breadcrumb, Link, Pagination, Tag, Flyout Menu).

Transverse :
- **Aucune** instance cassée (`getMainComponentAsync` résolu partout) et **aucun** token Foundation en direct hors de 4 composants (Button Plain Reversed, Tab, Tile, `.Specs` du Link déprécié).
- **0 lien de documentation** sur les 40 maîtres (critère 4, à poser partout, sans risque : `documentationLinks` ne touche pas aux instances).
- Pages normalisées (Versionning | Component | Documentation | Do/Don't) : 15 pages complètes. Sans Versionning : Crumb, Flyout Menu Item, Stepper, les 5 composants Utility (choix de la session du 16/11, à confirmer). Aucune section « To review » restante.
- Tous les textes des maîtres sont en redimensionnement automatique (aucun `NONE`, aucune troncature).

---

## Détail par composant

Gravité : **B** bloquant, **M** majeur (à corriger avant la prochaine publication), **m** mineur. Risque : effet, à la publication, sur les surcharges des fichiers consommateurs.

### 1. Button (44:558, page 44:554)

| # | Problème | Nœuds | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|---|
| 1.1 | Rayon 4 non lié sur la racine des 160 variantes | ex. 44:559 | M | Lier `Border/Radius/S` (4 coins) | Moyen : premier lien d'une valeur brute. Écrase une surcharge de rayon éventuelle. Faire d'abord un relevé des surcharges `cornerRadius` de Button dans les consommateurs (les audits n'en citent pas, seulement « Button Plain 8 ») |
| 1.2 | Épaisseur de trait 1 non liée sur 80 racines (types avec bord) | ex. 44:559 | M | Lier `Border/Size/S` (ou le Semantic 1 px existant) | Faible : les audits ne relèvent aucune surcharge de trait sur Button |
| 1.3 | `Border Focus` : trait 3 et rayon 9 bruts, calque masqué dans 96 variantes **sans propriété** : l'anneau de focus est inaccessible (Button Icon a un booléen `Focus`, Button non) | 44:564 | M | Ajouter un booléen `Focus` relié à `visible` de `Border Focus` (comme Button Icon), lier trait et rayon | Nul pour l'ajout du booléen (défaut false = rendu actuel). Liaisons : aucun consommateur ne surcharge un calque masqué |
| 1.4 | Paddings gauche / droite 16 liés à `qrn:foundation/size/s` (Foundation en direct) sur 10 variantes `Type=Plain, Reversed=True` | 44:635 et 9 autres | M | Relier à `Measurement/Spacing/M` (même valeur, comme les autres Plain) | Nul : remplacement à valeur égale (règle des audits). Les 8 surcharges « Button Plain » des consommateurs restent |
| 1.5 | Largeur FIXE (95 px) sur 6 variantes `State=Default, Type=Primary` dont la variante par défaut 44:559 (Default/Accent/Positive Reversed False, Positive et Negative Reversed True) : changer le libellé ne redimensionne pas le bouton, alors que les 92 autres variantes à libellé sont en Hug | 44:559, 309:1057, 750:1825, 750:2149, 4067:1100, 4067:1110 | M | Passer la racine en Hug horizontal | Faible et plutôt bénéfique : une instance redimensionnée à la main garde sa largeur ; une instance non redimensionnée se recale sur son libellé |
| 1.6 | `.Content` (168:1274) : gap 8 non lié (3 variantes) ; `Label` non exposé en propriété TEXT et icône sans propriété d'échange (on passe par l'instance exposée) | 168:1273 | m | Lier `Measurement/Spacing/S` ; facultatif : propriété TEXT `Label` et INSTANCE_SWAP sur l'icône | Gap : faible (`.Content` non publié, mais les surcharges `.Content` des vignettes existent, à l'échelle). TEXT : nul si la valeur par défaut reste « Label » |

Composition OK : 128 instances `.Content` exposées, 32 `Spinner` (Feedback). Écart code : `fullWidth` code seul, déjà documenté.

### 2. Button Icon (12:145)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 2.1 | Rayon 4 non lié sur les 256 racines | 12:146 | M | `Border/Radius/S` | Moyen, même remarque que 1.1 |
| 2.2 | Trait 1 non lié (96 racines) ; `Border Focus` trait 3 et rayon 9 bruts (192) | 12:146, 12:148 | M | Lier épaisseur et rayon | Faible |
| 2.3 | Le trait de 16 variantes Primary est lié à des tokens de **fond** (`Interactive/Background/Main/...`, `.../Main/Alt/...`) | ex. 12:146 | m | Relier aux `Interactive/Border/Main/...` de même valeur | Nul (couleur, même valeur) |

Fonctionnel OK : booléen `Focus` relié (192 calques), matrice complète 256/256, icône exposée. `.Icon Functional` (12:498) sans auto-layout, acceptable pour un conteneur d'icône.

### 3. Visual Button (296:4137)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 3.1 | Trait 1 non lié (4) ; ombre DROP_SHADOW brute sur 2 variantes ; style d'effet `Shadows/Bottom/400` (ancien style, pas un token) sur Active | 296:4136, 296:4133 | M | Lier le trait ; ombre : style d'effet de la librairie Tokens, si elle en publie un, sinon garder et documenter | Faible |
| 3.2 | Icône = instance directe `Upload Document` (glyphe) au lieu de `Icon Functional` avec propriété d'échange : on ne peut pas changer l'icône proprement | 295:4042 | M | Remplacer par `Icon Functional` + INSTANCE_SWAP exposée | Moyen : les consommateurs qui ont échangé le glyphe perdent leur choix si le calque change de composant. Garder le nom de calque et vérifier les surcharges avant |
| 3.3 | `Label` et `Sublabel` non exposés en TEXT ; calque `Frame 4` | 295:3925 | m | Propriétés TEXT, renommer `Content` | Nul |
| 3.4 | Code : `tone` (default, accent) et `selected` existent dans `ds-visual-button`, absents de Figma (seul `State`) | | M | Ajouter `Selected` (et `Tone` si validé) | Nul (ajout de variantes) |

### 4. Breadcrumb (298:5526) et Crumb (705:4485)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 4.1 | Breadcrumb contient 7 instances du set `Link` **171:3074, retiré du canevas** (parent nul, statut UNPUBLISHED) au lieu du Link courant 688:4202 (Crumb, lui, utilise bien 688:4202). Le maître n'est plus modifiable ni visible, ses consommateurs ne recevront jamais de mise à jour | 298:5485 | **B** | Reconstruire Breadcrumb avec des instances de `Crumb` (705:4485), comme `ds-breadcrumbs` compose `ds-crumb` | Élevé : les textes surchargés des crumbs dans les consommateurs sont portés par les instances de Link 171:3074. Les remplacer change les identifiants de sous-nœuds : relevé des Breadcrumb consommateurs et re-saisie à prévoir |
| 4.2 | Breadcrumb en statut CHANGED (modifs non publiées) | | m | Publier après 4.1 | |
| 4.3 | Pages : Crumb n'a pas de Versionning ; Breadcrumb n'a aucune propriété (ni nombre d'étapes ni booléens) | | m | Ajouter booléens d'affichage des crumbs ou slot | Nul |

### 5. Button Load More (53:8445)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 5.1 | Le bouton interne de chaque variante est un **cadre détaché** d'un composant de librairie (clé `5e3ce382…`, ancien Button) au lieu d'une instance de `Button` (Secondary, Accent) | 53:8447 (x5) | M | Remplacer par une instance `Button` Type=Secondary Tone=Accent pleine largeur (c'est ce que fait le code) | Moyen : libellé surchargé (« Load more results ») à re-saisir sur les instances consommatrices si le calque change |
| 5.2 | Trait 2 non lié ; style de trait `Primary/Action/500` (ancien style de couleur, pas une variable) | 53:8447, 53:8456 | M | Disparaît avec 5.1 | idem |
| 5.3 | `Label` non exposé en TEXT | 53:8448 | m | Propriété TEXT | Nul |

Rappel : son maintien dans Pagination reste une décision ouverte (non re-tranchée ici).

### 6. Button Range (720:445)

Tokens OK (0 valeur brute), matrice 12/12. **m** : le libellé `1` n'est pas une propriété TEXT (720:447). Focus non modélisé, comme le code (documenté). Verdict OK.

### 7. Button Split (69:1883)

Tokens et composition OK (instances exposées de Button et Button Icon). **M (code)** : `ds-button-split` a `reversed` et `disabled`, Figma n'a que `Open` et `Type` : pas d'état désactivé ni de version Reversed. Correctif : variantes `Disabled` (et `Reversed` si utile). Risque nul (ajout).

### 8. Tag (102:558) et ses `.Options` (102:347, 102:494, 102:537)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 8.1 | 36 cadres `Chip` **détachés** d'un composant de librairie (clé `3ff90657…`) dans Tag et les trois `.Options`, au lieu d'une instance de `Chip` (456:438) ou d'un atome | 102:571, 101:30, 102:431, 102:530 | **B** | Recomposer : instance de l'atome (Chip ou un `.Pill` interne) | Élevé : Tag est très surchargé dans les consommateurs (libellés). Changer la structure interne réinitialise les surcharges du sous-arbre ; relevé préalable obligatoire |
| 8.2 | Styles de couleur anciens (`Secondary/Soft/Blue 150`, `Primary/Action/450`) au lieu de variables Semantic | 102:431, 102:367 | M | Variables Semantic équivalentes | Nul (couleur) |
| 8.3 | 18 textes `Label` à styles mixtes, sans style ni variable ; trait 1 brut (4) | 101:29, 102:430, 102:434 | M | Style `Body/M/...` ou variables taille / interligne / graisse | Moyen : liaison `fontSize` / `lineHeight` sur un texte surchargé (cas déjà vu sur Dropdown `Value`) ; vérifier les surcharges de texte avant |
| 8.4 | `.Options` x3 sans description ; libellé non exposé en TEXT | | m | Décrire, propriété TEXT | Nul |

Écart code (défaut Filter vs select, Dropdown) déjà documenté.

### 9. Chip (456:438)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 9.1 | Rayon 10000 brut (16) | 456:439 | M | `Border/Radius/Round` (utilisé par Stepper) | Faible |
| 9.2 | 16 textes `Value` sans style (SemiBold 14 et 12) | 456:440, 456:475 | M | Styles de texte ou variables | Moyen (texte surchargé) |
| 9.3 | Trait 1 brut (8) | 456:441 | m | `Border/Size/S` | Faible |
| 9.4 | `Value` non exposé en TEXT | | m | Propriété TEXT | Nul |
| 9.5 | Code : `type` static / filter / select dans `ds-chip`, absent de Figma | | M | Propriété `Type` (ou acter que Tag porte ce rôle) | Nul |

### 10. Flyout Menu (507:833) et Flyout Item (507:996)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 10.1 | **Clé** : `components.json` et `PLAYBOOK.md` donnent `5d1147ac…` pour Flyout Menu. C'est la clé du set **Legacy 2.0.0** (1:20, publié). La v3 507:833 a la clé `84a8ec3e…`. Les fichiers montés d'après la doc ont importé l'ancien menu | | **B** | Corriger `components.json`, `PLAYBOOK.md`, `qirin-figma-inventory.md` ; relever les instances de 1:20 dans les consommateurs et les échanger | Échange 1:20 vers 507:833 : structure différente (variantes `# Items` contre slot), surcharges perdues, re-montage à la main |
| 10.2 | Flyout Item : `Label` sans style de texte (mixte, 16) ; `Focus` trait 2 brut | 507:999, 507:1000 | M | Style `Body/L/Regular`, lier le trait | Moyen (texte), faible (trait) |
| 10.3 | Code : `selectable`, `selected` (coche dans un emplacement fixe 20 px) et `shortcut` existent dans `ds-flyout-menu-item`, absents de Flyout Item | | M | Booléens `Selectable` / `Selected` et instance exposée `Shortcut Keys` | Nul (ajout, défaut false) |
| 10.4 | Nom du set toujours `Flyout Item` alors que la section et `components.json` disent Flyout Menu Item (décision du 16/11) ; `Label` non exposé en TEXT ; pas de Versionning sur sa page | | m | Renommer le set (le lien des instances tient, vérifié pour Segmented Control) | Nul |

### 11. Link (688:4202)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 11.1 | **Clé** : `components.json` donne `b9493d2f…`, clé du set `Link` **171:3074, retiré du canevas** (parent nul, UNPUBLISHED) et encore utilisé par **143 instances** du fichier (Breadcrumb 7, Pagination `.Options` 17 et `.Options Select (Legacy)` 5, le reste dans les cadres Documentation et Do/Don't). Le Link courant 688:4202 a la clé `77367a8f…` (CURRENT). La remarque de `components.json` (« les deux sets courants ne sont pas publiés ») est périmée | 171:3074 | **B** | Corriger la clé ; remplacer les 143 instances de 171:3074 par 688:4202 (Tone/Size/Weight à reporter) ; ne supprimer 171:3074 qu'ensuite | Élevé côté consommateurs : toute maquette qui a importé `b9493d2f…` pointe un composant retiré, sans mise à jour possible. Relevé à faire dans Search, Buyer Summary, Coverbook, Reject Management, Manual Underwriting |
| 11.2 | `Label` non exposé en TEXT (288 variantes) | 688:2475 | m | Propriété TEXT | Nul si défaut « Label » |
| 11.3 | Code : `tone` = default / **neutral** / reversed ; Figma = Default / **Accent** / Reversed. `underline` booléen côté code, variante `Text Decoration` côté Figma (acceptable) ; `external` absent de Figma | | M | Renommer l'option `Accent` en `Neutral` si c'est bien le même rendu (la légende de la doc le dit déjà) | Nul : renommer une option de variante garde les instances (même mécanisme que les renommages Pagination) |

Tokens : 0 valeur brute, 0 Foundation. `.Specs` 171:3065 : propriété TEXT `Label` **orpheline** (0 calque relié), pas de description.

### 12. Pagination (53:2994) et `.Options` (53:2954)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 12.1 | 17 instances de Link 171:3074 (retiré) dans `.Options` (et 5 dans `.Options Select (Legacy)`) | 595:5049 | **B** | Échanger vers Link 688:4202, Tone Default / Neutral | Moyen : les numéros de page surchargés sont des textes de ces instances |
| 12.2 | `Style=Load More` contient une instance **distante** de `Button Load More` : copie publiée de cette même librairie (clé de set `ee0d2c72…` = 53:8445 local). Auto-import : les modifs du maître local n'y arrivent qu'après publication et mise à jour | 53:2996 | M | Échanger vers le maître local 53:8445 | Faible (même composant, mêmes propriétés) |
| 12.3 | Textes `X` et `of` sans style (mixtes, 16) | 53:2979, 53:2978 | m | Style `Body/L/Regular` | Faible |
| 12.4 | `.Options` sans description ; textes non exposés | | m | Décrire | Nul |

### 13. Segmented Control Item (302:2197)

- **M** Trait 1 brut sur les 24 racines (302:2196) : lier `Border/Size/S`. Risque faible.
- **m** `.Content` (302:1938) sans description, `Label` non exposé en TEXT, 4 icônes masquées non pilotées (variantes Icon None).
- Pas de composant « groupe » (le code compose plusieurs segments) : acceptable, à documenter.

### 14. Tab (57:231)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 14.1 | Calque `Active` lié à `qrn:foundation/color/action/blue/700` (Foundation en direct, 6 calques) | 57:263 | M | Semantic de même valeur | Nul (couleur, même valeur) |
| 14.2 | Masque : fill dégradé et noir bruts (48) | 365:1241, 365:1240 | m | Acceptable pour un masque (alpha seulement), à documenter | Nul |
| 14.3 | Calque `Active` masqué dans 12 variantes sans propriété | 57:239 | m | Supprimer s'il ne sert pas, sinon le piloter | Nul |
| 14.4 | `.Options` (160:131) sans description, sans auto-layout | | m | Décrire | Nul |

Propriétés toutes reliées (Dropdown 24, Mask 24, Badge 48, Label 24). Écarts code (icône, compteur, `fill`, `changed`) déjà documentés.

### 15. Tile (615:84)

| # | Problème | Nœuds | Gravité | Correctif | Risque |
|---|---|---|---|---|---|
| 15.1 | `Sub label` lié à `qrn:foundation/color/action/blue/450` (8) ; styles de couleur anciens `Secondary/Rich/Grey 500` (4) et `Greyscale/050` (fond Hover) | 615:90, 615:120, 615:115 | M | Variables Semantic | Nul (couleur) |
| 15.2 | Trait 1 brut (8) | 615:85 | m | `Border/Size/S` | Faible |
| 15.3 | Icône non exposée (pas d'INSTANCE_SWAP) alors que `ds-tile` a un input `icon` ; `Label` et `Sub label` non exposés en TEXT | 615:87, 615:89 | M | Exposer l'icône, propriétés TEXT | Nul |
| 15.4 | Set nommé `Tiles` (code `ds-tile`) ; calques `Sub label` / `Sub Label` incohérents | | m | Renommer `Tile` | Nul |
| 15.5 | Code : pas de sous-libellé dans `ds-tile`, booléen `Sub Label` en Figma | | m | Documenter ou ajouter au code | Nul |

### 16. Stepper (4083:368) et `.Stepper Step` (4081:430)

Tokens 0 brut, propriétés toutes reliées, matrice 14/14 (construit le 16/11, non re-signalé).
- **M (V)** Page toujours dans la zone `WIP` et nommée `↪ Stepper 🔴`, alors que le set est publié (CURRENT) et le Hero affiche Ready / In code. `components.json` : `nodeId` nul (mettre 4083:368).
- **m** Calque générique `Text` (x14, 4081:271) ; section `Stepper - Explo (draft)` contient `Frame 1` (312:1333). Pas de Versionning.

### 17. Utility : Keycap, Shortcut Keys, Shortcut Row, Keyboard Map, Flag

- Keycap (950:24), Shortcut Keys (950:64) : propres (0 brut, propriétés reliées). OK.
- **M** Shortcut Row (951:110) : fond `#ffffff` brut sur `Label group` (8 variantes, 951:10). Lier `Static/Background/Main/Primary` ou retirer le fond s'il est inutile. Risque nul.
- **M** Keyboard Map (951:150) : 6 fonds `#ffffff` bruts (`Keys`, `Row 1-3`, `Side`, `Picker`) ; 3 instances **distantes** de `Tag` (copie publiée de ce même fichier, clé de set `0543a49f…` = 102:558 local). Échanger vers le Tag local. Risque faible.
- Flag (952:165) : couleurs nationales et traits bruts assumés par sa description (non tokenisés, comme le code). **m** : 34 calques `Vector` et 3 `Group` génériques.
- Statuts cohérents avec `components.json` (0.2.0 Draft, Flag 1.0.0 In review). Pas de Versionning sur ces pages.

### 18. Sets legacy et dépréciés encore publiés

| Set | nodeId | Statut | Problèmes |
|---|---|---|---|
| `[Deprecated] Button` | 44:743 | CURRENT | sans description ; combinaison `Icon Left=True, Icon Right=True` absente |
| `[DEPRECATED] Link` | 77:315 | CURRENT | sans description ; `.Specs` 77:260 lié à 6 couleurs `qrn:foundation/...` (48 + 16 + 16 calques), textes sans style, gap 8 brut ; combinaisons Icon Left + Right absentes |
| `Flyout Menu` Legacy 2.0.0 | 1:20 | CURRENT | sans description, porte la clé documentée comme « Flyout Menu » (voir 10.1) ; `.Item` 1:56 : paddings 8 / 32, gap 4, rayon 4 bruts |
| `Link` Legacy | 689:4239 | CURRENT | traité le 16/11, rien de plus |
| `Link` 171:3074 | hors canevas | UNPUBLISHED | voir 11.1 |

Correctif : description « Deprecated, use … » sur chaque set publié (risque nul), puis dépublication quand les consommateurs auront migré. Ne pas lier les tokens de ces sets.

---

## Liste priorisée des corrections

1. **Clés dans la doc** (risque nul, Figma intact) : `components.json`, `PLAYBOOK.md`, `qirin-figma-inventory.md`. Link = `77367a8f128498576f030e35e042f9434514056a` (pas `b9493d2f…`), Flyout Menu = `84a8ec3ed08331f3cf5d08222a02cad5dcb53d74` (pas `5d1147ac…`, qui est le Legacy). Stepper : `nodeId` 4083:368. Remarque Link périmée.
2. **Relevé consommateurs avant toute retouche** : instances de Link `b9493d2f…` (171:3074) et de Flyout Menu Legacy `5d1147ac…` dans les 5 fichiers de fonctionnalités et Layout.
3. **Link 171:3074 retiré** : échanger ses 143 instances internes (Breadcrumb, Pagination `.Options`, Legacy) vers Link 688:4202 ; Breadcrumb à recomposer en instances de Crumb. Publier Breadcrumb, Pagination.
4. **Tag** : remplacer les 36 cadres `Chip` détachés par une instance d'atome, puis styles de couleur anciens vers Semantic et styles de texte des `Label`. Relevé des surcharges Tag avant.
5. **Button** : variantes Primary Default en Hug (6), booléen `Focus` (anneau inaccessible), Plain Reversed `qrn` vers `Measurement/Spacing/M`.
6. **Foundation en direct vers Semantic, même valeur** (risque nul) : Tab `Active`, Tile `Sub label`, Button Plain Reversed ; styles de couleur anciens de Tile, Tag, Button Load More.
7. **Auto-imports de la librairie elle-même** : Pagination `Style=Load More` et Keyboard Map (`Tag`) vers les maîtres locaux.
8. **Button Load More** : cadre détaché vers instance de Button Secondary Accent.
9. **Rayons et traits bruts** (après relevé des surcharges de rayon) : Button, Button Icon (rayon 4, trait 1, focus 3 / 9), Chip (Round), Segmented Control, Tile, Visual Button, Flyout Item ; fonds `#ffffff` de Shortcut Row et Keyboard Map.
10. **Textes sans style** : Chip `Value`, Flyout Item `Label`, Pagination `X` / `of` (vérifier d'abord les surcharges de taille et d'interligne, cas Dropdown `Value`).
11. **Écarts code** : Visual Button `Selected` (+ `Tone`), Button Split `Disabled` / `Reversed`, Chip `Type`, Flyout Item `Selectable` / `Selected` / `Shortcut`, Link `Accent` vers `Neutral`, Tile icône exposée.
12. **Propreté** : liens de documentation sur les 40 maîtres, descriptions des `.Options` / `.Content` / `.Specs` et des sets dépréciés, propriétés TEXT pour les libellés, renommages (`Tiles`, `Flyout Item`, `Frame 4`, `Text`, vecteurs de Flag), propriété orpheline `Label` de `.Specs` 171:3065, sortir le Stepper de la zone WIP.
