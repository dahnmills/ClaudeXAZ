# Audit des composants Figma : Data Entry (2026-11-17)

Audit en lecture seule de la librairie Data Entry (`1wVY9FfjONIX6us9JmIm7U`), tokens de référence dans `4TxqgJPVFZc4ZKw4JZ6OAn`. Aucune écriture dans Figma (ni renommage, ni liaison, ni publication), aucun commit.

## Méthode

- Lecture par `use_figma` de toutes les pages de composants (23 pages + `-> Label`, `-> Helper Text`, `Checklist`, `Status`, `Cover`), maîtres et atomes privés (`.`), toutes variantes parcourues. Dimensions lues dans l'API (largeur, hauteur, mode de dimensionnement), jamais sur une image.
- Critère 1 : fills, traits (couleur et épaisseur), effets, rayons, paddings, gaps, textes (taille, interligne, graisse, famille) non liés à une variable ou à un style ; liaisons vers une collection autre que `Semantic`.
- Critère 2 : instances imbriquées (distantes ou locales, page d'origine), vecteurs dessinés dans le maître.
- Critère 3 : propriétés non reliées à un calque, calques masqués non pilotés par un booléen, produit cartésien des variantes, doublons, dimensionnement des libellés.
- Critère 4 : noms par défaut (`Frame 14`, `Line`...), descriptions, liens de documentation.
- Critère 5 : bloc `Versionning` de chaque page, statut de publication (`getPublishStatusAsync`), sections « To review ».
- Critère 6 : inputs Angular de `src/app/shared/ui/<nom>/` comparés aux propriétés Figma.
- Tokens Semantic disponibles (lus dans la librairie Tokens) : Spacing None / XXS 2 / XS 4 / S 8 / M 16 / L 24 / XL 32 / 2XL 48 / 3XL 64 ; Radius None / XS 2 / S 4 / M 8 / L 16 / XL 32 / Round 100 ; **Border/Size None / S 1 / M 2 / L 4**. Les valeurs 6, 10, 12, 14, 26, 1000 n'ont pas de token.

Déjà tranché, non re-signalé : texte `Value` de `.Text` (Dropdown, 2046:818), taille 14 et interligne 20 laissés en dur volontairement (`_audit-overrides-prepublish-2.md`, vérifié : toujours en dur). Paddings de racine de Checkbox (25 instances) et d'Input Text (7) surchargés par les consommateurs : ne pas les lier.

## 1. Synthèse

Compteurs = nombre de constats par critère (1 Tokens, 2 Composition, 3 Fonctionnel, 4 Propreté, 5 Validé, 6 Code).

| Composant | nodeId | 1 | 2 | 3 | 4 | 5 | 6 | Verdict |
|---|---|---|---|---|---|---|---|---|
| Checkbox | 2043:2375 | 3 | 0 | 1 | 2 | 1 | 0 | à corriger |
| Checkbox Card | 2093:322 | 4 | 1 | 1 | 2 | 1 | 0 | à corriger |
| Date Range (+ `.Date`, `.Day`, `.Date Empty`, `Header`) | 2002:1305 | 0 | 0 | 1 | 1 | 1 | 1 | à corriger (mineur) |
| Dropdown (+ 15 atomes privés) | 2046:720 | 3 | 0 | 3 | 2 | 1 | 1 | **bloquant** |
| Dropdown Flyout Menu (+ `.Item`, `.Item Properties`) | 2049:5070 | 1 | 0 | 2 | 1 | 0 | 0 | à corriger |
| Input Text (+ atomes) | 2045:707 | 4 | 1 | 2 | 1 | 0 | 1 | à corriger |
| Input Email (+ atomes) | 2222:1310 | 5 | 1 | 2 | 0 | 0 | 0 | à corriger (grave) |
| Input Date (+ atomes) | 2222:1610 | 4 | 1 | 1 | 0 | 1 | 0 | à corriger |
| Input Search (+ atomes) | 2695:3344 | 4 | 2 | 1 | 1 | 1 | 0 | **bloquant** |
| Inline Edit | 2317:202 | 1 | 0 | 2 | 1 | 1 | 1 | à corriger |
| Radio | 2044:2569 | 4 | 0 | 1 | 0 | 1 | 0 | à corriger |
| Radio Card | 2093:217 | 4 | 1 | 1 | 2 | 2 | 1 | à corriger |
| Select Button | 2221:1490 | 1 | 1 | 2 | 1 | 0 | 0 | à corriger |
| Text Area (+ atomes) | 2330:847 | 5 | 0 | 2 | 1 | 2 | 0 | à corriger |
| Toggle | 2044:2853 | 5 | 0 | 0 | 1 | 1 | 0 | à corriger |
| Standalone Dropdown (+ `.Chevron`) | 3023:214 | 0 | 0 | 0 | 1 | 0 | 0 | OK |
| More Criteria | 3041:304 | 0 | 0 | 1 | 0 | 1 | 0 | OK (réserve) |
| Search Bar (+ `🆕 Tenant`) | 3047:427 | 2 | 1 | 0 | 0 | 0 | 0 | à corriger |
| Search Bar Home | 3098:3 | 0 | 0 | 0 | 1 | 1 | 0 | à corriger (mineur) |
| Search Bar Multi | 3102:849 | 0 | 0 | 0 | 0 | 1 | 0 | à corriger (mineur) |
| Tag Filter Chip | 3104:1454 | 0 | 0 | 0 | 0 | 2 | 0 | à corriger (mineur) |
| Grid Selection | 3105:59 | 0 | 0 | 0 | 0 | 1 | 0 | à corriger (mineur) |
| File Upload | 3107:851 | 0 | 0 | 0 | 0 | 1 | 0 | à corriger (mineur) |
| ☠️ Select Card (`User card`, `☠️ Users Card List`) | 2340:2236, 2340:2447 | 50+ | 3 | 1 | 30+ | 1 | 0 | **bloquant** (publié alors que condamné) |
| Task (page Checklist) | 1:92 | 5 | 0 | 0 | 2 | 1 | 0 | à corriger (publié à tort) |
| `.Label` (×2), `.Helper Text` (transverses) | 2045:742, 2583:3766, 2568:2019 | 1 | 0 | 1 | 2 | 0 | 0 | à corriger |

Bilan : 25 entrées, **3 bloquantes**, 15 à corriger, 6 à corriger pour la seule validation (Versionning absent), 1 OK (Standalone Dropdown) et 1 OK avec réserve (More Criteria). Les composants 🆕 de novembre (Standalone Dropdown, Search Bar, Search Bar Home / Multi, Tag Filter Chip, Grid Selection, File Upload, More Criteria) sont entièrement liés aux tokens : la dette est sur les composants historiques.

### Constats transverses

- **Versionning** : contrairement au dernier passage, le bloc existe maintenant sur 17 pages sur 23. Mais 5 pages ont encore le gabarit vide (`Draft · v.X.X.X · Month XX, XXXX · Update / Text`) alors que leur cadre Documentation affiche `Version : 1.0.0` : **Checkbox, Checkbox Card, Radio, Radio Card, Toggle**. 6 pages n'ont **aucun** Versionning : Search Bar Home, Search Bar Multi, Tag Filter Chip, Grid Selection, File Upload, ☠️ Select Card. Date Range et Inline Edit : `Ready v1.0.0`, « Date unknown ».
- **Page normalisée** : ordre Versionning | Component | Documentation | Do/Don't respecté partout où le Versionning existe, mais le cadre « Component » s'appelle encore `_Design system header` sur toutes les pages, et les maîtres sont rangés dans des cadres `Frame 4` / `Frame 8`.
- **Sections « To review »** : 19 restent (une par page historique + `Cover - To review`). La plupart ne contiennent que l'ancien `_Design system header` ; certaines ont des restes libres : Date Range (3161:3663 : `Vector 1`, `Vector 2`, `Frame 32/33/34`), Dropdown Flyout Menu (3165:4208 : un `FRAME` nommé `Icon Functional` (copie détachée), `Vector 1`, `Frame 38`), Radio Card (3162:4418 : `Frame 32`, instance `Modal`), Text Area (3172:642 : `Frame 32`).
- **Liens de documentation** : 0 sur 0 composant. Aucun `documentationLinks` renseigné dans tout le fichier (ZeroHeight ou Storybook).
- **Descriptions** : présentes sur tous les maîtres publics ; absentes sur les 15 atomes privés du Dropdown, `.Item`, `.Item Properties`, les deux `.Label`, `.Helper Text`, `User card`, `Users Card List`, `Task`.
- **Collections locales interdites** : le fichier contient deux collections de variables locales, `Data Entry Variables` (1 variable STRING `Value`) et `Collection` (1 COLOR, 2 modes), non masquées à la publication. Contraire à la règle « Foundation + Semantic seulement ».
- **Collection héritée `qrn`** : des liaisons pointent vers une collection distante `qrn` (clé `1a8f436cc576b88fbdbca098be095f73af7704f0`), qui n'est ni Foundation ni Semantic de Tokens (Input Email Active, Select Card).
- **Épaisseurs de trait** : les traits 1 et 2 ne sont liés nulle part dans les composants historiques alors que `Border/Size/S` (1) et `Border/Size/M` (2) existent.
- **Anneau de focus** : `Border Focus` en rayon 6 et trait 2 sur 9 composants, rayon sans token (6 = Radius S 4 + offset 2). À trancher une fois pour toutes (voir priorités).
- **Statut de publication** : modifications non publiées (`CHANGED`) sur Dropdown, Input Date, Input Search, Text Area, More Criteria, Tag Filter Chip, `☠️ Users Card List`.

## 2. Détail par composant

Gravité : B = bloquant, H = haute, M = moyenne, F = faible. Risque surcharges : effet d'une correction du maître sur les instances des fichiers consommateurs, d'après les deux audits de surcharges.

### Checkbox (2043:2375)
| Nœud | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| `Box` 2043:2377 (21 variantes) | trait 2 non lié | M | lier `Border/Size/M` | faible (aucune surcharge de trait relevée) |
| `Border Focus` 2043:2379 (18) | trait 2 non lié, rayon 6 sans token | M | trait `Border/Size/M` ; rayon : décision focus (P3) | faible |
| `Box/Frame 14` 2043:2391 | calque masqué non piloté, rayon 1000, nom par défaut | F | supprimer (reste d'essai) | nul |
| `Label` | texte non exposé en propriété TEXT (surcharge directe) | F | facultatif, cohérent avec Radio/Toggle | nul |
| Variantes | 21 sur 32 : Indeterminate seulement si Selected (voulu) ; Disabled × Error absent (3) | F | documenter comme voulu | nul |
| Page | Versionning gabarit vide (Draft v.X.X.X) contre Documentation 1.0.0 | M | remplir Ready v1.0.0 | nul |

### Checkbox Card (2093:322) et Radio Card (2093:217)
Structure identique, mêmes constats sur les deux.
| Nœud | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| racine 2093:323 / 2093:218 (4 var.) et Selected 2093:336 / 2093:231 (4) | traits 1 et 2 non liés | M | `Border/Size/S` et `/M` | faible |
| `Content/Main Content` 2093:327 / 2093:222 | gap 12 sans token | M | passer à M 16 ou S 8 selon le code (la SCSS fait foi) | moyen : vérifier les gaps surchargés de Radio Card (paddings et gap 16 liés au 1er audit) |
| `Aditionnal Content/Separator/Line` 2093:334 / 2093:229 | ligne redessinée, trait `#E6E6E6` et 1 en dur | H | remplacer par une instance `Divider` (Data Display) | moyen : les instances qui surchargent l'ancienne ligne perdent la surcharge (aucune relevée) |
| propriété `Aditionnal Content` | faute (`Additional`) | F | renommer la propriété (la clé reste, pas de casse) | nul |
| `Main Label`, `Sub Label` | textes non exposés en TEXT | F | facultatif | nul |
| Radio Card : code | input `tone` (RadioCardTone) sans équivalent Figma | M | ajouter la variante `Tone` ou retirer du code | nul |
| Page | Versionning gabarit vide ; Radio Card : restes dans « To review » | M | remplir, nettoyer | nul |

### Date Range (2002:1305)
| Nœud | Problème | Gravité | Correctif | Risque |
|---|---|---|---|---|
| `Header` 2002:811 | atome interne publié (`CURRENT`) sous le nom générique `Header`, concurrent du Header de Layout dans le panneau Assets | M | renommer `.Header` (privé) ou `Date Range Header` | nul (renommage) |
| Code | `showShortcuts`, `showTime`, `showFooter`, `selection` sans propriété Figma ; `Full Width` est une variante au lieu d'un booléen | F | ajouter au moins `Shortcuts` (booléen) | nul |
| Page | restes libres dans « To review » ; Versionning « Date unknown » | F | nettoyer, dater | nul |
Tokens : tout lié. Composition : `Button Icon` distant correct.

### Dropdown (2046:720) : bloquant
| Nœud | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| variante 2288:1056 `State=Read Only, Filtering=False, Property 3=True` | doublon de Read Only (2046:743), propriété parasite `Property 3` à option unique ; casse la grille de variantes (8 variantes, combinaisons incohérentes) | B | supprimer la variante après contrôle d'usage, ce qui retire `Property 3` | **élevé** : toute instance consommatrice sur 2288:1056 perd son maître. Chercher d'abord ses instances dans Search, Buyer Summary, Coverbook, Manual Underwriting, Layout ; les basculer sur 2046:743 |
| `Container` 2046:723 (8) | paddings haut/bas 6 sans token | M | décision P3 (6 en dur documenté, ou 4 + hauteur fixe 32 comme le code) | moyen, à recouper avec les 58 surcharges `Value` (non concernées) |
| `Container` 2046:731 (Active) | gap 10 sans token (code : 8) | M | `Spacing/S` | faible |
| `Border Focus` 2046:733 | rayon 6 | M | P3 | faible |
| `.Tags` 2046:798/804/810, `(+x more)` | graisse SemiBold non liée | F | lier `Font Weight/Semi Bold` | faible |
| `.Tags` 2046:798 `Frame 4` | nom par défaut | F | `List` | nul |
| Atomes privés | 3 `.Input Content`, 3 `.Value`, 3 `.Tags`, 2 `.Text` homonymes, sans description | M | suffixer (`.Input Content / Filled`...) ou fusionner en variantes ; décrire | nul (atomes non publiés) |
| `.Label` | Dropdown utilise `.Label` 2583:3766, Input Text 2045:742 : deux maîtres de libellé | M | voir transverses `.Label` | moyen |
| Code | `ds-select` n'a pas d'input `readonly` alors que Figma a `Read Only` | F | ajouter au code | nul |
| Publication | `CHANGED` | M | publier après correction | |

### Dropdown Flyout Menu (2049:5070)
| Nœud | Problème | Gravité | Correctif | Risque |
|---|---|---|---|---|
| `.Item Properties` 2049:5167, `.Item` Title 2049:5148 | paddings haut/bas 6 | M | P3 | moyen : `.Item` Type=Title surchargé (8, 18 instances, 1er audit), ne pas lier son padding sans recontrôle |
| `Focus` 2049:5170 / 2049:5146 | anneau de focus masqué sans booléen : état focus inatteignable | M | booléen `Focus` comme Checkbox | nul |
| `Frame 3/.Item` (10 masqués) | longueur de liste par masquage | F | acceptable, ou slot | nul |
| `Frame 3` 2049:5072 | nom par défaut | F | `List` | nul |

### Input Text (2045:707), Input Email (2222:1310), Input Date (2222:1610), Input Search (2695:3344)
Même gabarit, mêmes constats de tokens sur les quatre (6 variantes chacun).
| Nœud | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| `Container` (2045:710, 2222:1313, 2222:1613, 2695:3347) | trait 1 non lié | M | `Border/Size/S` | faible |
| `Container` | paddings haut/bas 6 | M | P3 | faible (racine non concernée) |
| `Container` Active | gap 10 (code 8) | M | `Spacing/S` | faible |
| `Border Focus` | trait 2, rayon 6 | M | `Border/Size/M` ; P3 | faible |
| **Input Email** `Container` Active 2222:1321 | trait lié à `qrn` `foundation/color/action/blue/600` (collection héritée, Foundation en direct) | H | relier au Semantic utilisé par Input Text Active | nul (couleur) |
| **Input Search** 2695:3344 | le component set s'appelle **`Input Date`** (la description commence par « Input Search. ») | B | renommer `Input Search` | nul (renommage, les instances gardent leur maître) |
| Input Search `.Input Content` 2695:3378 | l'icône de recherche passe par l'atome privé `.Append/Icon` de la page Input Date | M | atome `.Append` propre à Input Search | moyen : surcharges d'icône perdues si l'atome change |
| Input Text, Date, Search `.Input Content` | bouton d'effacement = glyphe `Close` posé nu ; Input Email utilise un `Button Icon` | M | `Button Icon` partout (composition stricte) | moyen |
| États Error | aucun message d'erreur ni `.Helper Text` sous le champ, alors que le code a `errorMessage` et que Dropdown / Text Area ont un booléen `Helper Text` | H | ajouter `.Helper Text` + booléen | faible (ajout) |
| `.Label` dans Input Text (2045:709, largeur FIXE 111) et Input Email (2222:1312, FIXE **40**) | un libellé plus long que la boîte déborde : la règle « jamais sur deux lignes » tient, mais la largeur ne suit pas | H | `.Label` en FILL (comme Text Area) | moyen : les instances qui ont surchargé la largeur gardent leur valeur |
| Input Text `.Append` 2045:739 | calque texte nommé `Text` | F | `Unit` | nul |
| Code | Input Text : `variant` (default / inline) sans équivalent Figma | F | documenter ou ajouter | nul |
| Publication | Input Date et Input Search `CHANGED` | M | publier | |
Libellé : `.Label` en SemiBold lié, `WIDTH_AND_HEIGHT` (pas de retour à la ligne) : règle respectée.

### Inline Edit (2317:202)
| Nœud | Problème | Gravité | Correctif | Risque |
|---|---|---|---|---|
| `Border Focus` 2317:216 | rayon 6 | M | P3 | faible |
| `Actions` (2 `Button Icon`) | pas de booléen pour masquer la suppression (code : `deletable`) | M | booléen `Deletable` | nul |
| propriété | nommée `Border Focus` (ailleurs `Focus`) | F | harmoniser en `Focus` | nul |
| `Value` | texte non exposé en TEXT | F | facultatif | nul |

### Radio (2044:2569)
| Nœud | Problème | Gravité | Correctif | Risque |
|---|---|---|---|---|
| `.Radio` 2044:2571 (14) | trait 2, rayon 1000 non liés | M | `Border/Size/M`, `Border/Radius/Round` | faible (rendu identique) |
| `Border Focus` 2044:2573 | trait 2, rayon 6 | M | idem + P3 | faible |
| Variantes | Disabled × Error absents (2) | F | documenter comme voulu | nul |
| Page | Versionning gabarit vide | M | remplir | nul |
Nota : `.Radio` est un calque, pas un composant ; Radio Card instancie bien `Radio` local.

### Toggle (2044:2853)
| Nœud | Problème | Gravité | Correctif | Risque |
|---|---|---|---|---|
| `🧬 Switch` 2044:2855 (16) | rayon 14 | M | `Border/Radius/Round` | faible |
| `🧬 Switch/Knob` 2044:2856 | rayon 1000 | M | `Border/Radius/Round` | faible |
| `🧬 Switch` (Selected, 4) | padding droit 26 : le bouton est placé par padding | M | alignement à droite au lieu du padding, ou `Spacing/XXS` | moyen : paddings 2 du Switch liés au 1er audit, ne pas toucher aux autres côtés |
| `Border Focus` 2044:2858 | trait 2, rayon 6 | M | idem | faible |
| `🧬 Switch` | émoji dans un nom de calque | F | `Switch` | nul |
| Page | Versionning gabarit vide | M | remplir | nul |

### Select Button (2221:1490)
| Nœud | Problème | Gravité | Correctif | Risque |
|---|---|---|---|---|
| racine 2221:1491 (4) | ombre portée en dur | M | style d'effet ou variables | faible |
| `Upload Document` 2221:1492 | glyphe posé nu, pas de propriété d'échange d'instance (seulement booléen `Icon`) ; code : input `icon` | H | `Icon Functional` + propriété INSTANCE_SWAP | moyen : les icônes changées à la main dans les consommateurs sont perdues |
| racine 160 × 106 FIXE | `Label` en `WIDTH_AND_HEIGHT` dans une boîte fixe : un libellé long déborde | M | hauteur HUG, libellé en `HEIGHT` + troncature | faible |
| `Frame 4` 2221:1493 | nom par défaut | F | `Text` | nul |
| `Sublabel` | SemiBold comme `Label` | F | vérifier contre la SCSS | nul |

### Text Area (2330:847)
| Nœud | Problème | Gravité | Correctif | Risque |
|---|---|---|---|---|
| `Container` 2329:495 | trait 1, paddings 6, gap 10 | M | comme les inputs | faible |
| `Border Focus` 2330:944 | trait 2, rayon 6 ; booléen `Border Focus` vrai par défaut | M | idem, défaut à faux | faible |
| `.Label` 2329:494 | pas de booléen `Label` (Input Text en a un ; code : `label` facultatif) | M | booléen `Label` | nul |
| `.Text Area Content` 2330:1059 / 2330:1144 | largeur FIXE 1576, deux sets homonymes | F | FILL, renommer | faible |
| Publication | `CHANGED` ; « To review » avec `Frame 32` | M | publier, nettoyer | |

### Standalone Dropdown (3023:214) : OK
Tout lié, `.Chevron` exposé. Seul point : `.Chevron` (3067:232) est posé à la racine de la page, hors de la section.

### More Criteria (3041:304) : OK avec réserve
Tout lié, compose Checkbox / Input Text / Text Area locaux et Tag / Button / Divider distants. Réserve : maître « écran » de 1376 px sans aucune propriété ni slot (le PLAYBOOK demande peu de propriétés mais des slots) ; titres de groupe en Bold. Modifications non publiées.

### Search Bar (3047:427) et `🆕 Tenant` (3028:361)
Search Bar : tout lié. `🆕 Tenant` : glyphe publié (`CURRENT`) dans Data Entry, vecteur dessiné, fill `#404040` en dur (H) : sa place est dans la librairie d'icônes, en `Icon Functional`, fill lié. Risque : les instances de `🆕 Tenant` dans les consommateurs devront être échangées.

### Search Bar Home (3098:3), Search Bar Multi (3102:849), Tag Filter Chip (3104:1454), Grid Selection (3105:59), File Upload (3107:851)
Tout lié, composition correcte (Button, Button Icon, Link, Badge, Divider, Chip, Flyout Menu distants ; Dropdown et Standalone Dropdown locaux). Seul manque : **aucun Versionning** sur leurs pages (M). Tag Filter Chip : `CHANGED`. Search Bar Home : cadre parent nommé `Case Component (Recent searches = false)`.

### ☠️ Select Card (`User card` 2340:2236, `☠️ Users Card List` 2340:2447) : bloquant
Page marquée « A migrer dans le fichier local », mais `User card` est **publié** (`CURRENT`) et `Users Card List` a des modifications en attente (`CHANGED`). Plus de 100 constats : paddings, rayons et gaps en dur, liaisons `qrn` (Foundation héritée), icônes redessinées en vecteurs (`ph:option`, `ic:baseline-plus`), illustration de 59 vecteurs à fills en dur, `Frame 225` à `Frame 240`, variante `Variant10`, aucune description. Correctif : migrer dans le fichier de fonctionnalité concerné puis dépublier. Risque : élevé pour tout consommateur qui l'instancie encore (à rechercher avant dépublication).

### Task (1:92, page Checklist)
Composant utilitaire de checklist publié (`CURRENT`) : fill `#FFFFFF`, trait 1, rayon 2, gap 4 en dur, `Frame 2`, `Line 2`. Correctif : préfixer `_` ou `.` pour le retirer de la publication. Risque nul.

### Transverses : `.Label` (2045:742, 2583:3766) et `.Helper Text` (2568:2019)
- Deux maîtres `.Label` : 2045:742 (avec `Optional` et `Remaining`, largeur FIXE 40 au maître) utilisé par Input Text, Input Email, Text Area ; 2583:3766 (sans `Remaining`, HUG) utilisé par Input Date, Input Search, Dropdown. Libellé SemiBold lié, pas de retour à la ligne : règle respectée sur les deux. Correctif : un seul maître (garder 2045:742 en HUG / FILL), décrire. Risque moyen : échanger le maître d'un `.Label` exposé fait perdre les surcharges de texte des libellés (« libellés `.Label` de Dropdown, valeur égale au maître » au 1er audit : sans effet visible).
- `.Helper Text` `Status=Positive` 2568:2018 : gap 3 au lieu de 4 (les 4 autres variantes à 4, non liées). Correctif : `Spacing/XS` sur les 5. Risque faible.

## 3. Corrections priorisées

1. **Dropdown, variante parasite 2288:1056** (`Property 3=True`) : rechercher ses instances dans les fichiers consommateurs, les basculer sur 2046:743, puis supprimer la variante. Ne pas faire l'inverse.
2. **Input Search** : renommer le set 2695:3344 de `Input Date` en `Input Search`, puis publier (renommage sans risque).
3. **☠️ Select Card** : rechercher les usages de `User card` / `Users Card List`, migrer en local, dépublier. Dans la foulée, retirer `Task` (1:92) et `🆕 Tenant` de la publication (Tenant vers la librairie d'icônes).
4. **Input Email Active 2222:1321** : remplacer la liaison `qrn` par le Semantic d'Input Text Active. Puis supprimer les collections locales `Data Entry Variables` et `Collection` après contrôle qu'aucun nœud ne les lie.
5. **Message d'erreur des inputs** : ajouter `.Helper Text` + booléen sur Input Text, Email, Date, Search (le code a `errorMessage`), et un booléen `Label` sur Text Area.
6. **`.Label` en FILL** dans Input Text et Input Email (FIXE 111 et 40), puis un seul maître `.Label`.
7. **Épaisseurs de trait** : lier les traits 1 / 2 à `Border/Size/S` / `M` sur Checkbox, Radio, Toggle, Checkbox Card, Radio Card, les 4 inputs, Text Area, Inline Edit (mêmes valeurs, aucune surcharge de trait relevée par les deux audits).
8. **Décision unique sur les valeurs hors grille** (P3) : paddings 6 des champs, gap 10, gap 12 des cartes, rayon 6 de l'anneau de focus, padding 26 du Toggle. Soit aligner sur le code (hauteur 32 fixe, padding 0 8, gap 8 ; outline 2 avec offset 1), soit garder en dur et le noter dans la Documentation. Ne rien créer dans Tokens.
9. **Rayons pleins** : 1000 et 14 vers `Border/Radius/Round` (Radio, Toggle).
10. **Composition** : séparateur des cartes en `Divider` ; effacement en `Button Icon` (Input Text, Date, Search) ; icône de Select Button en `Icon Functional` + INSTANCE_SWAP ; atome `.Append` propre à Input Search.
11. **Propriétés** : booléen `Focus` sur `.Item` / `.Item Properties` ; `Deletable` sur Inline Edit ; renommer `Border Focus` en `Focus` (Inline Edit, Text Area) et `Aditionnal Content` ; `Tone` sur Radio Card si le code le garde ; `Header` de Date Range rendu privé.
12. **Validation** : remplir les 5 Versionning vides (Checkbox, Checkbox Card, Radio, Radio Card, Toggle), créer les 6 manquants, dater Date Range et Inline Edit, renseigner les `documentationLinks` (ZeroHeight) des 23 maîtres, décrire les atomes privés.
13. **Propreté** : vider les 19 sections « To review » (restes de Date Range, Dropdown Flyout Menu, Radio Card, Text Area en priorité), renommer `_Design system header` en `Component`, `Frame 14` / `Frame 3` / `Frame 4` / `Line`, ranger `.Chevron` dans sa section.
14. **Publier** les composants `CHANGED` une fois les points 1 à 4 traités (Dropdown, Input Date, Input Search, Text Area, More Criteria, Tag Filter Chip), après un nouvel audit des surcharges limité aux liaisons posées.
