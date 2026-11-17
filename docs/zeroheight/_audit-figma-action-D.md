# Audit Figma Action (lot D) : Tile, Visual Button, Flyout Menu, Flyout Menu Item

Date : 2026-11-06. Mission en lecture seule (Figma, ZeroHeight, code). Librairie `[Components] Action`, fileKey `xCeEJPn6fliEshuE9fnrqs`.
Objectif : composants Figma PROPRES (variables Semantic, auto-layout, peu de variantes, propriétés exposées) et ISO avec le composant Angular.

Méthode : lecture des nœuds par l'API plugin (liaisons de variables, auto-layout, styles) et `get_variable_defs` pour les valeurs résolues, comparaison avec `src/app/shared/ui/<nom>/` et `docs/zeroheight/action/<nom>.md`. Pas de mesure sur PNG.

Légende : sens du correctif = F (corriger Figma), C (corriger le code), D (corriger la doc), F+C (décision à trancher puis aligner les deux côtés). Sévérité : Haute (visible ou bloquant pour l'iso), Moyenne, Basse.

## Synthèse

| Composant | nodeId | Verdict |
|---|---|---|
| Tile (set `Tiles`) | 615:84 | A CORRIGER |
| Visual Button | 296:4137 | A CORRIGER |
| Flyout Menu (v3.0.0 composant + slot) | 507:833 | A CORRIGER |
| Flyout Menu (v2.0.0 set `# Items`) | 1:20 | A CORRIGER (à retirer) |
| Flyout Menu Item (set `Flyout Item`) | 507:996 | A CORRIGER |
| `.Item` (set privé, doublon de Flyout Item) | 1:56 | A CORRIGER (à retirer) |

Constats transverses à tous les composants du lot :
1. Aucune description renseignée sur aucun set ou composant (`description` vide). Les en-têtes `_Design system header` portent le texte, pas le composant.
2. Les tokens couleur utilisés dans Figma (familles `Reversed/Alt`, `Text/Main`, `Icon/Main`, `Border/Muted/Alt`) n'existent pas sous ce nom dans `src/styles/_semantic.scss`, qui utilise d'autres familles (`light-alt`, `text-strong-alt`, `static-background-main-*`). Les valeurs peuvent coïncider (hover de Flyout Item : texte `#006192` des deux côtés) mais la correspondance par nom est cassée, donc l'iso se vérifie à la main et se dégrade à chaque évolution d'un token. Correctif de fond : aligner les noms (ou ajouter les alias manquants dans `_semantic.scss`) sans créer de collection ni de token dans Tokens (règle ds-token-rules) : relier chaque composant au même Semantic des deux côtés.
3. Espacements, gaps et rayons jamais liés à des variables dans Flyout Menu, Flyout Item et Visual Button (valeurs 8, 32, 4 en dur). Seul Tile lie son gap et son rayon.
4. Opacité Disabled à 0,4 écrite en dur (non liée à `Measurement/Opacity/Disabled`) sur Tile, Visual Button et Flyout Item.
5. Aucun composant n'a de propriété TEXT pour le libellé ni d'instance exposée (`isExposedInstance`) : le texte et l'icône se surchargent à la main sur chaque instance.

---

## 1. Tile (`Tiles`, set 615:84, page Tile 615:77)

Verdict : A CORRIGER.

Structure Figma : 8 variantes `State` (Default/Hover/Active/Disabled) x `Selected` (False/True), propriété booléenne `Sub Label`. Chaque variante : cadre 104 x 104 auto-layout horizontal, padding 0, contenant `Content` (vertical, gap 4 lié `Measurement/Spacing/XS`) avec `Icon` (instance `Icon Functional`, `Type=Monochrome`, glyphe `User-Business`) et `Content` (Label + Sub label).

### Propriété et propreté Figma

| Point | Constat | Sévérité | Correctif |
|---|---|---|---|
| Description | vide | Basse | F : renseigner |
| Propriétés | `Selected` en variante (8 variantes). Acceptable (change fills, strokes et couleurs), mais aucune propriété TEXT `Label`, aucun swap d'icône, `Icon` non exposé | Moyenne | F : ajouter TEXT `Label`, exposer l'instance `Icon` (`isExposedInstance`) ou un INSTANCE_SWAP |
| Nommage calques | deux calques nommés `Content` imbriqués ; `Sub label` (Selected=True) et `Sub Label` (Selected=False) : casse différente | Basse | F : `Content` (colonne) et `Text` ; un seul nom pour le sous-libellé |
| Variantes redondantes | `Selected=False` Hover et Active ne sont pas dans le même schéma de tokens que `Selected=True` (voir iso) | Moyenne | F |
| Styles de texte | `Copy/Small (14)/Semibold` et `Copy/X-Small (12)/Regular` : styles hérités hors échelle `Body/*`. Résolus : poids 400, interlettrage 0,2 alors que le style s'appelle Semibold | Haute | F : utiliser `Body/M/Semi Bold` (14/20) pour le libellé ; le sous-libellé en `Body/S/Regular` |
| Couleur en dur | `Sub label` en Selected=False : fill brut `#5A5360` (4 variantes) | Haute | F : lier à un Semantic texte secondaire |
| Foundation direct | `Sub label` en Selected=True : `foundation/color/action/blue/450` (Foundation, hors Semantic) | Haute | F : lier à un Semantic |
| Couleur en dur | `Selected=False, State=Hover` : fill brut `#ECECEC` (pas de variable, les 3 autres états sont liés) | Haute | F : lier à un Semantic |
| Variables héritées | `Greyscale/050`, `Greyscale/500` détectées via `get_variable_defs` (Selected=False Hover) : variables d'une ancienne collection | Moyenne | F : remplacer par Semantic |
| Opacité | Disabled 0,4 écrit en dur sur le cadre | Moyenne | F : lier `Measurement/Opacity/Disabled` |
| Padding | 0 sur toutes les variantes (le contenu est centré par le cadre de 104 px) | Basse | voir iso |
| Auto-layout | présent partout sauf l'intérieur de l'instance d'icône (normal) | OK | |
| Détachement / doublon | aucun | OK | |

### Iso Figma vs code (`tile/`)

| Sujet | Figma | Code | Sens du manque | Sévérité | Correctif |
|---|---|---|---|---|---|
| Fond repos non sélectionné | `Background/Light/Alt/Default` (grey-050 `#F5F5F5`) | `static-background-main-secondary` (grey-050) | valeur identique, token différent | Basse | F+C : même token |
| Bordure | trait 1 px (`Border/Light/Alt/*` ou `Light/*`) | aucune | manque dans le code | Haute | C : ajouter `border: 1px solid` sur les tokens `interactive-border-light(-alt)-*`, ou F : retirer. À trancher |
| Hover non sélectionné | fill `#ECECEC` (grey-100), trait `#ECECEC` | `interactive-background-light-hover` = bleu `#D9EAF2` | valeur différente | Haute | F+C : décider gris ou bleu |
| Active non sélectionné | `Light/Alt/Active` (gris) | `interactive-background-light-active` (bleu `#B7DDF0`) | valeur différente | Haute | F+C |
| Couleur du libellé non sélectionné | `Text/Strong/Alt/*` (gris `#262626` au hover) | `static-text-main-primary` fixe (grey-900), pas de changement au hover | valeur différente | Moyenne | C : suivre les tokens Figma |
| Couleur de l'icône non sélectionnée | `Icon/Strong/Alt/*` | `static-text-main-secondary` (grey-700) | valeur différente | Moyenne | C ou F |
| Padding | 0 | `spacing-s` (8 px) | valeur différente | Basse | F : 8 px lié, pour que le contenu reste dans 104 px |
| Disabled | opacité 0,4 | `opacity-disabled` (0,4) | identique | OK | lier le token côté Figma |
| Focus | aucune variante, aucune propriété | aucun `:focus-visible` (anneau navigateur) | manque des deux côtés | Haute (a11y) | F+C : ajouter booléen `Focus` (cadre `Border/Focus`, comme Button Icon) et `:focus-visible` |
| Sub label | booléen `Sub Label` (masqué par défaut) | aucun input | manque dans le code | Moyenne | C : `subLabel = input<string>('')` ou retirer du Figma |
| Icône par défaut | `User-Business` | `'user'` | glyphe différent | Basse | C ou F : aligner (doc dit les deux) |
| Libellé | texte `Label` | `label` requis | OK | | |
| Tailles | 104 x 104 | `--semantic-measurement-size-tile` (104) | identique | OK | |
| États Hover/Active/Disabled/Selected | présents | présents | OK | | |

### Doc `docs/zeroheight/action/tile.md`
- Suit le code, pas Figma, sur plusieurs points : annonce « padding 8px » pour `Tiles` alors que Figma vaut 0 ; « Grey/700 / Grey/900 » alors que Figma utilise `Text/Strong/Alt`. Elle note bien `Sub Label` comme écart. Sévérité Moyenne, correctif D après décision sur la bordure et le hover.
- Ne mentionne pas la bordure 1 px de Figma ni les deux variables héritées. A compléter (D).

---

## 2. Visual Button (set 296:4137, page Visual Button 288:822)

Verdict : A CORRIGER.

Structure Figma : 4 variantes `State`, booléens `Icon` et `Sub Label`. Cadre 160 x 106, vertical, padding 8, gap 4, centré ; enfants : instance `Upload Document` (32 x 32) et `Frame 4` (Label + Sublabel).

### Propriété et propreté Figma

| Point | Constat | Sévérité | Correctif |
|---|---|---|---|
| Description | vide (le texte de l'en-tête est un copier-coller de Radio, d'après la doc) | Moyenne | F |
| Propriétés | pas de TEXT `Label` ni `Sub label`, pas de swap d'icône (instance `Upload Document` figée, ni `Icon Functional`), pas d'`Selected` | Haute | F : TEXT x2, INSTANCE_SWAP ou instance `Icon Functional` exposée, `Selected` |
| Nommage calques | `Frame 4` ; `Sublabel` vs `Label` ; états `Hover`, `Active` mais tokens nommés `Pressed` | Moyenne | F : `Content`, `Sub label` |
| Fond | fill blanc brut `#FFFFFF` sur les 4 variantes | Haute | F : `Color/Static/Background/Main/Primary` |
| Espacement | padding 8 et gap 4 non liés | Haute | F : lier `Measurement/Spacing/*` |
| Rayon | 4 non lié | Haute | F : lier `Border/Radius/*` |
| Ombre | `DROP_SHADOW` locale (non liée à un style) sur Default, Hover et Disabled ; seul Active utilise le style `Shadows/Bottom/400` | Haute | F : style d'effet ou aucune ombre en repos |
| Opacité | Disabled 0,4 en dur | Moyenne | F : lier le token |
| Trait intérieur de l'icône | stroke blanc brut sur le vecteur `Vector` (dans la librairie d'icône) | Basse | F : fait partie du glyphe, à signaler à la librairie d'icônes |
| Auto-layout | présent | OK | |
| Texte | styles `Body/L/Semi Bold` et `Body/M/Semi Bold` liés aux variables de police | OK | voir iso pour le poids |

### Iso Figma vs code (`visual-button/`)

| Sujet | Figma | Code | Sens du manque | Sévérité | Correctif |
|---|---|---|---|---|---|
| Largeur | 160 px | 240 px (en dur dans le SCSS) | valeur différente | Haute | F+C : trancher puis tokeniser |
| Padding | 8 | `spacing-l` (24) | valeur différente | Haute | F+C |
| Gap | 4 | `spacing-m` (16) | valeur différente | Haute | F+C |
| Rayon | 4 | `border-radius-m` (8) | valeur différente | Haute | F+C |
| Icône | 32 x 32, sans plaque, fixe | plaque 48 x 48 (en dur), rayon s, fond `background-main-alt-primary`, `[slot=icon]` | valeur différente et plaque absente de Figma | Haute | F+C |
| Bordure repos | `Border/Muted/Alt/Default` (blanc `#FFFFFF`) | `static-border-subtle-tertiary` (grey-200 `#D9D9D9`) | valeur différente | Haute | F+C |
| Hover | bordure grey-050, icône et libellé `Main/Hover` (`#006192`) | bordure `border-strong-default` bleu + ombre `shadow-card` | valeur différente | Haute | F+C |
| Active | style `Shadows/Bottom/400`, bordure `Pressed` | aucun style `:active` | manque dans le code | Moyenne | C |
| Selected | absent | `selected` (fond informatif, bordure bleue) ; le token `background-subtle-informative` n'existe pas dans `_semantic.scss` | manque dans Figma et token cassé | Haute | F : variante ou booléen ; C : corriger le token |
| Focus | absent | `:focus-visible` outline 3 px, offset 2 px (en dur) | manque dans Figma | Moyenne | F : booléen `Focus` |
| Tone | absent | `tone` default/accent sans aucun style associé | code mort | Basse | C : retirer |
| Sous-libellé | Body M Semi Bold, couleur `Text/Main/Tertiary` (`#767676`) | Body M Regular, `text-main-secondary` (grey-700) | valeur différente | Moyenne | F+C |
| Couleur du libellé | `Interactive/Text/Main/*` qui change à chaque état | `static-text-main-primary` fixe | valeur différente | Moyenne | F+C |
| Disabled | opacité 0,4 | `opacity-disabled` | identique | OK | lier côté Figma |
| Valeurs en dur dans le SCSS | | `240px`, `48px`, `1px`, `3px`, `2px` | | Moyenne | C : tokens |

### Doc `visual-button.md`
- Suit le code et signale déjà : 160 px Figma contre 240 px code, pas de `selected` Figma, `tone` sans style, pas d'`:active` code. Bonne, mais écrit « sub label Body M regular » alors que Figma est Semi Bold ; ne signale pas le fond blanc brut, les liaisons manquantes (padding, gap, rayon) ni l'ombre locale. A compléter (D).

---

## 3. Flyout Menu (page Flyout Menu 1:3)

Deux versions cohabitent sous le même nom `Flyout Menu` :
- v3.0.0 : composant `Flyout Menu` (507:833) avec un `Slot` (propriété `Slot#507:0`, aucune `preferredValues`).
- v2.0.0 : set `Flyout Menu` (1:20) avec `# Items` de 1 à 7 (7 variantes), qui empile des instances de `.Item`.

Verdict : A CORRIGER.

### Propriété et propreté Figma

| Point | Constat | Sévérité | Correctif |
|---|---|---|---|
| Doublon | deux composants nommés `Flyout Menu` (set 1:20 et composant 507:833) | Haute | F : retirer la v2.0.0 (dépréciée) une fois les consommateurs migrés, ou la renommer `Flyout Menu (deprecated)` |
| Variantes | `# Items` = 7 variantes pour un nombre d'enfants : contraire à « peu de variantes » ; le slot le remplace | Haute | F : supprimer |
| Slot | `Slot` sans valeur préférée ; vide, il mesure 196 x 1 | Moyenne | F : définir `Flyout Item` comme valeur préférée |
| Description | vide | Basse | F |
| Padding vertical 8, horizontal 0 | non liés à des variables | Haute | F : lier `Measurement/Spacing/S` |
| Rayon 4 | non lié | Haute | F : lier `Border/Radius/S` |
| Fond | lié `Color/Static/Background/Main/Primary` | OK | |
| Ombre | style `Shadows/Bottom/400` | OK | |
| Auto-layout | vertical, présent | OK | |
| Titre de section | absent de ce composant (existe seulement dans `Dropdown / .Item Type=Title`, Data Entry) | Moyenne | voir iso |

### Iso Figma vs code (`flyout-menu/flyout-menu.component.*`)

| Sujet | Figma | Code | Sens du manque | Sévérité | Correctif |
|---|---|---|---|---|---|
| Largeur minimale | 196 (mesure du composant) | `min-width: 196px` en dur | identique, non tokenisé | Basse | C : token ou F : propriété |
| Padding / rayon / ombre / fond | 8 0 / 4 / Bottom/400 / blanc | `spacing-s` 0 / `radius-s` / `shadow-flyout` / `main-primary` | identique, mais seul le code est lié aux tokens | Moyenne | F : lier |
| `overflow: hidden` | non modélisable | présent | n/a | Basse | n/a |
| Titre de section | absent (dans Data Entry) | `ds-flyout-menu-title` : bold 16, padding 6 16 | manque dans Figma | Moyenne | F : ajouter un atome titre exposé ou référencer celui de Data Entry |
| Séparateur | absent | `ds-divider` | manque dans Figma | Basse | F |
| Variantes | `# Items` 1 à 7 | aucune (nombre d'enfants libre) | variantes inutiles côté Figma | Haute | F : supprimer |
| Rôles a11y | n/a | `role="menu"` | n/a | | |

### Doc `flyout-menu.md`
- Suit bien les deux versions, la composition et le contrat `single-open-flyout.ts`. Écarts : ne dit pas que padding, rayon et min-width ne sont pas liés côté Figma ; le titre de section est noté « code only » alors que l'atome existe dans Data Entry (`Dropdown / .Item Type=Title`). Sévérité Basse, correctif D.

---

## 4. Flyout Menu Item (set `Flyout Item`, 507:996) et doublon `.Item` (1:56)

Verdict : A CORRIGER. `Flyout Item` (507:996) et `.Item` (1:56) ont exactement les mêmes propriétés et la même construction : un des deux est de trop.

Structure Figma : 4 variantes `State` ; booléens `Icon` et `Focus` ; INSTANCE_SWAP `↳ Icon` (défaut `Edit Compose`). Cadre horizontal, padding 8 32, gap 4, contenant l'icône 16 px, `Label` (16/24) et le cadre `Focus` masqué (trait 2 px `Border/Focus`).

### Propriété et propreté Figma

| Point | Constat | Sévérité | Correctif |
|---|---|---|---|
| Doublon | `.Item` (1:56, privé, utilisé par la v2.0.0 de Flyout Menu) et `Flyout Item` (507:996) identiques | Haute | F : retirer `.Item` avec la v2.0.0 |
| Description | vide | Basse | F |
| Nommage de propriété | `    ↳ Icon` avec quatre espaces et une flèche en tête de nom | Moyenne | F : `Icon swap` ou `Icon glyph` |
| Label non lié | pas de propriété TEXT `Label` | Moyenne | F : TEXT exposé |
| Style de texte | le libellé n'a ni style de texte ni variable de police (famille et style mixtes), seulement taille 16 et interligne 24 | Haute | F : appliquer `Body/L/Regular` |
| Padding 8 / 32, gap 4 | non liés (valeurs en dur) | Haute | F : `Spacing/S`, `Spacing/XL`, `Spacing/XS` |
| Fond Disabled | fill brut blanc `#FFFFFF`, alors que les autres états sont liés à `Background/Reversed/Alt/*` | Haute | F : lier |
| Opacité Disabled | 0,4 posé sur l'icône et le libellé séparément, en dur ; couleur de l'icône `Static/Icon/Main/Primary` alors que les autres états utilisent `Interactive/Icon/Main/*` | Moyenne | F : opacité sur le cadre, liée au token ; icône sur `Interactive/Icon` |
| Nommage des tokens | `Reversed/Alt` pour un fond qui est le blanc par défaut (nom trompeur, pas de correspondance dans le code) | Moyenne | F+C |
| Focus | booléen + cadre : conforme au pattern Button Icon | OK | |
| Auto-layout | présent | OK | |
| Largeur | 218 en variante, 196 en instance dans le menu : remplissage horizontal OK | OK | |

### Iso Figma vs code (`flyout-menu-item.component.*`)

| Sujet | Figma | Code | Sens du manque | Sévérité | Correctif |
|---|---|---|---|---|---|
| Fond repos | `Background/Reversed/Alt/Default` (blanc) | `static-background-main-primary` | valeur identique, token différent | Basse | F+C |
| Fond hover | `Reversed/Alt/Hover` = `#F5F5F5` (grey-050) | `light-alt-hover` = grey-100 `#ECECEC` | valeur différente | Haute | F+C : le commentaire du SCSS dit « Grey/050 → Grey/100 hover » |
| Fond active | `Reversed/Alt/Pressed` | `light-alt-active` (grey-200) | à confirmer (valeur Pressed non relevée) | Moyenne | vérifier |
| Couleur libellé hover | `Text/Main/Hover` = `#006192` | `text-strong-hover` = blue-a-600 `#006192` | identique | OK | |
| Couleur libellé repos | `Text/Main/Alt/Default` | `text-strong-alt-default` (grey-900) | token différent | Basse | F+C |
| Icône | 16 px, présente par défaut (`Icon=true`, `Edit Compose`) | 16 px, absente par défaut (`icon=null`) | défaut différent | Moyenne | F ou C : aligner (doc le note) |
| Coche de sélection (`selectable`, `selected`) | absente (existe dans Data Entry `Dropdown Flyout Menu`) | emplacement fixe 20 px, `aria-selected` | manque dans Figma | Haute | F : propriété `Selectable` + atome `.Check` exposé (ou réutiliser le modèle Data Entry) |
| Raccourci clavier (`shortcut`) | absent | `ds-shortcut-keys` à droite | manque dans Figma | Moyenne | F : slot ou booléen `Shortcut` |
| Icône personnalisée (`[slot=icon]`) | via INSTANCE_SWAP seulement | slot de contenu (Flag, etc.) | partiel | Basse | F : slot |
| Disabled | opacité 0,4 en enfants | opacité 0,4 sur l'hôte, `pointer-events: none` | rendu équivalent | OK | lier le token |
| Focus | cadre 2 px `Border/Focus` | `outline: 2px`, `outline-offset: -2px` (en dur) | équivalent | OK | C : tokeniser 2 px |
| Padding | 8 32 | `spacing-s` `spacing-xl` | identique | OK | F : lier |
| Gap | 4 | `spacing-xs` | identique | OK | F : lier |
| Libellé | 16/24, Regular | `size-l`, `line-height-l`, regular | identique | OK | F : style de texte |

### Doc `flyout-menu-item.md`
- Suit le code et le dit (défauts d'icône divergents, coche et raccourci « code only »). Écarts : annonce « tokens Foundation grey-100 / grey-200 » pour hover et active alors que Figma est à grey-050 au hover ; le nom Figma `Flyout Item` diffère du nom code `ds-flyout-menu-item` (sans règle de correspondance écrite). Ne mentionne pas le doublon `.Item`. Correctif D.

---

## Plan de correction proposé

Du côté Figma (priorité haute) :
1. Lier à Semantic tout ce qui est brut ou Foundation : Tile (`Sub label`, hover non sélectionné), Visual Button (fond, padding, gap, rayon, ombre), Flyout Menu (padding, rayon), Flyout Item (padding, gap, fond Disabled), opacité Disabled partout.
2. Remplacer les styles `Copy/*` de Tile par `Body/M/Semi Bold` et `Body/S/Regular`, et styler le libellé de Flyout Item en `Body/L/Regular`.
3. Retirer `Flyout Menu` v2.0.0 et `.Item` (doublons), après migration des consommateurs.
4. Ajouter les propriétés manquantes : TEXT `Label` partout, instance d'icône exposée (Tile, Visual Button), `Focus` (Tile, Visual Button), `Selected` (Visual Button), `Selectable` + coche et raccourci (Flyout Item).
5. Descriptions renseignées sur les 4 composants.

Décisions à prendre avant d'aligner (F+C) : dimensions de Visual Button (160/240, padding 8/24, gap 4/16, rayon 4/8, plaque d'icône 48), hover/active de Tile non sélectionné (gris Figma ou bleu code), bordure 1 px de Tile, hover de Flyout Item (grey-050 ou grey-100).

Du côté code : ajouter `:focus-visible` à Tile, `subLabel` à Tile (ou le retirer de Figma), `:active` à Visual Button, retirer l'input mort `tone` de Visual Button, remplacer le token inexistant `static-background-subtle-informative`, tokeniser `240px`, `48px`, `196px`, `2px/3px`.
