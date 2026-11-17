# Audit des composants Figma : librairie Feedback

Lecture seule, fichier `[Components] Feedback` (`fH3vmSNZR8r0sU3kN455CD`), tokens `4TxqgJPVFZc4ZKw4JZ6OAn`, session du 2026-11-17. Aucune écriture Figma, aucun commit. Scripts `use_figma` en lecture (parcours de chaque variante, liaisons de variables, styles, propriétés, surcharges d'instances imbriquées), dimensions lues sur les nœuds par l'API (aucune mesure sur image).

Déjà tranché dans `docs/zeroheight/_audit-overrides-prepublish-2.md`, non re-signalé : l'instance `Notice` 31:4053 (Reject Management) à re-surcharger après publication (`paddingBottom` 0), les 28 `.Content Properties` en gap 0 (sans effet). Écarts déjà notés dans `components.json` (Toaster action Button contre Link, Popin Success sans ton code, propriété Spinner `Property 1`) : rappelés en une ligne, pas recomptés comme nouveaux.

Légende : **OK**, **À corriger**, **Bloquant** (empêche un usage correct ou propage une erreur visible dans les fichiers consommateurs). Gravité H (haute), M (moyenne), B (basse).
Critères : C1 tokens, C2 composition, C3 fonctionnel, C4 propreté, C5 validé, C6 écart code.

## Constats transverses

| # | Constat | Gravité | Correctif |
|---|---|---|---|
| T1 | **Styles de texte hors librairie Tokens.** Le fichier Tokens ne publie que `Title/*`, `Body/*`, `Display/*`. Cinq styles utilisés viennent d'une ancienne librairie : `Copy/Small (14)/Semibold` et `Copy/Medium (16)/Semibold` (Badge), `Headline/Medium (🖥26 📱24)/Bold Mobile` et `foundation-text-paragraph` (Popin), `foundation-h4` (Toaster, Functional Notice), `Copy/Small (14)/Regular` (Functional Notice). Trois d'entre eux (`Copy/*`, `Headline/*`) ne résolvent même plus leur police (`fontName` indéfini). Aucune variable liée dans ces styles. | H | Remplacer par les styles Tokens de même valeur : `foundation-h4` (16/24 SemiBold) vers `Body/L/Semi Bold`, `foundation-text-paragraph` (16/24 Regular) vers `Body/L/Regular`, `Copy/Small (14)/Regular` (14/20) vers `Body/M/Regular`, `Headline/Medium` (24/32 Bold) vers `Title/H2` ou `H3` selon valeur, `Copy/*/Semibold` vers `Body/M/Semi Bold` et `Body/L/Semi Bold` (voir Badge, décision code d'abord). |
| T2 | **Styles d'effet hors librairie Tokens.** `Shadows/Bottom/800` (0 8 24, 35 %) sur Popin et Snackbar, `Shadows/Bottom/400` (0 4 4, 25 %) sur Toaster : le fichier Tokens n'a aucun style d'effet ni variable d'ombre. Le code a `--semantic-shadow-*` (tooltip, popover, flyout, snackbar, modal). | M | Décider où vivent les ombres (styles d'effet dans Tokens, sans nouvelle collection). En attendant, garder les styles existants : ils sont au moins partagés. Le Tooltip (T3) doit au minimum s'y aligner. |
| T3 | **Aucun lien de documentation** (`documentationLinks` vide) sur les 10 composants publiés et les 10 atomes privés. Descriptions présentes sur les 10 composants publiés ; absentes sur `.Badge`, les deux `.Content Properties`, `.Animation`, l'ancien `.Spec` 62:709 et l'ancien `.Icon` 301:1279. | M | Ajouter le lien ZeroHeight de chaque page (`components.json` > `zeroheight.url`) ; description `Private atom of ...` sur les atomes privés. Aucun risque de surcharge. |
| T4 | **Sections « To review » partout** (10 pages sur 10) : ancien `_Design system header` avec des textes de gabarit copiés d'autres composants (« Radio buttons allow users... », « The checkbox allows... », liens Supernova et `qirin.zeroheight.com/tag`). Restes : `Ellipse 1` (Popin, 42:560), instance `Button Icon` (Toaster, 131:2124), `Frame 3` (Badge, 222:2435). | M | Supprimer les sections « To review » après contrôle qu'aucun maître n'y vit (vérifié : aucun composant dedans). Aucun risque de surcharge. |
| T5 | **Versionning incohérent avec `components.json`** (tous `1.0.0 ready`) : Ready v1.0.0 renseigné pour Popin, Tooltip, Popover, Snackbar, Functional Notice ; **gabarit vide** (`Draft · v.X.X.X · Month XX, XXXX`) pour Badge (counter), Toaster, Spinner, Skeleton Item ; **Badge** affiche `Draft · v.2.0.0 · May 28, 2024`. | H | Remplir les blocs (Ready, v1.0.0, date, Added / Documented) comme sur Tooltip ; ou repasser `components.json` en Draft si ces composants ne sont pas validés. |
| T6 | **Calques génériques** : `Frame 28` (Badge), `Text` (cadre, Popin, Toaster), `Frame 248` (Snackbar), `Frame 37`, `Rectangle 1`, `Group`, `Vector` (Popover), `Group 1`, `Ellipse 1`, `Ellipse 2` (Spinner). | B | Renommer (`Content`, `Arrow`, `Illustration`, `Track`, `Arc`). Renommer un calque de maître ne casse pas les surcharges (elles suivent l'id). |
| T7 | **Foundation via les atomes imbriqués** : `foundation/color/action/blue/500` sur le glyphe `Color` des `Button` (Popin `.Spec`, Popover `.Action`, Toaster) et `foundation/color/grey/500` sur l'icône de Badge Neutral Light M. Le premier vient du maître Button (audit Action, T4) ; le second est une surcharge propre à Feedback (voir Badge B2). | M / B | Corriger dans Action (déjà listé) ; Badge : voir B2. |
| T8 | **Pages** : deux pages nommées `Badge` (257:2 contient Badge (counter)), `Functionnal Notice` (faute), `Spinner ` (espace final), trois pages WIP vides (`Progress Bar`, `Progress Circle`, `Contextual Help`). Normalisation Versionning, Component (`_Design system header`), Documentation, Do/Don't : **présente sur les 10 pages**. | B | Renommer `Badge (counter)`, `Functional Notice`, `Spinner`. Aucun risque. |
| T9 | **Deux arbres Semantic doublons** utilisés côte à côte : `Color/Static/Background/Functional/Subtle/*` et `Color/Static/Background/Subtle/Fuctional/*` (faute « Fuctional », mêmes valeurs, les deux existent en code). Badge Light mélange les deux (Warning sur `Subtle/Fuctional`, les autres sur `Functional/Subtle`), Popin et Toaster sont sur `Subtle/Fuctional`. | B | Choisir un arbre (recommandé `Functional/Subtle`, sans faute) et rebrancher. Liaison couleur vers couleur de même valeur : sans risque de surcharge. |

Points vérifiés sans écart : aucune variable, collection ni style local dans Feedback ; toutes les instances imbriquées sont des instances de librairie distantes (Icon Functional, Button, Button Icon, Link) ou des atomes privés locaux, aucune instance cassée ; aucun booléen ni propriété orpheline (toutes les propriétés sont reliées à un calque) ; gradient de `.Animation` (Skeleton) entièrement lié ; Popover et Toaster liés au Semantic sur toutes les couleurs propres.

## Synthèse par composant

| Composant | nodeId | Verdict | C1 | C2 | C3 | C4 | C5 | C6 |
|---|---|---|---|---|---|---|---|---|
| Badge | 141:98 | À corriger | 2 | 1 | 0 | 3 | 2 | 1 |
| Badge (counter) | 257:5 | À corriger | 1 | 0 | 0 | 2 | 2 | 0 |
| Popin | 63:807 | **Bloquant** | 4 | 1 | 3 | 3 | 1 | 1 |
| Tooltip | 119:4038 | À corriger | 1 | 0 | 1 | 1 | 1 | 1 |
| Popover | 121:12614 | À corriger | 4 | 1 | 2 | 3 | 1 | 1 |
| Toaster | 125:1116 | À corriger | 2 | 0 | 1 | 2 | 2 | 0 |
| Snackbar | 124:34846 | À corriger | 2 | 0 | 1 | 2 | 1 | 1 |
| Functional Notice | 154:2271 | **Bloquant** | 2 | 0 | 4 | 3 | 1 | 1 |
| Spinner | 264:10 | À corriger | 0 | 0 | 2 | 2 | 2 | 1 |
| Skeleton Item | 117:5 | À corriger | 0 | 0 | 0 | 2 | 2 | 0 |
| **Total** | | 0 OK, 8 à corriger, 2 bloquants | 18 | 3 | 14 | 23 | 15 | 7 |

Aucun composant n'est OK, principalement à cause de T3 (lien de doc), T4 (To review) et T5 (Versionning). Sans ces trois points transverses, Skeleton Item serait OK.

## Détail par composant

### 1. Badge (set 141:98, page 140:2)

Propriétés : Status (Info, Warning, Success, Error, Neutral), Style (Light, Strong), Size (S, M) : 20 variantes, grille complète. Atome exposé `.Content Properties` (Icon, Label en variantes ; 141:162 pour S, 141:151 pour M). Couleurs, paddings, rayons (`Border/Radius/Round`) et gaps tous liés au Semantic.

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| B1 | Libellé en style `Copy/Small (14)/Semibold` (S) et `Copy/Medium (16)/Semibold` (M), ancienne librairie, police non résolue (T1). **Code : 14/20 Regular pour les deux tailles** (`badge.component.scss`, doc `badge.md` ligne 23). Écart Figma / code flagrant sur graisse et taille M. | H | Trancher d'abord (source de vérité Figma : passer le code en semi-bold, et M en 16/24 ; ou aligner Figma sur 14 Regular). Puis lier le texte à `Body/M/Semi Bold` / `Body/L/Semi Bold` (ou `Body/M/Regular`). | Moyen : changer le style du `Label` sur le maître change le rendu de 126 instances locales et de toutes les instances consommatrices qui ne surchargent pas la police (le premier audit n'en relève aucune sur `Label`). |
| B2 | `Status=Neutral, Style=Light, Size=M` : glyphe de l'icône surchargé en `foundation/color/grey/500` (nœud `I141:128;141:158;216:396;2323:339`), alors que S utilise `Color/Static/Icon/Main/Primary`. | M | Rebrancher la surcharge sur `Color/Static/Icon/Main/Primary`. | Faible : liaison couleur ; une instance consommatrice qui aurait elle-même surchargé l'icône garde sa surcharge. |
| B3 | Deux sets homonymes `.Content Properties` (141:151 M, 141:162 S), sans description : le swap d'instance propose les deux sous le même nom. | B | Renommer `.Content Properties S` / `.Content Properties M`, ajouter une description. | Aucun (renommage). |
| B4 | `.Badge` (141:139, Size S/M) : set privé sans description, contient une instance de Badge avec rayon surchargé. Rôle non documenté (gabarit de doc ?). | B | Décrire ou supprimer s'il ne sert qu'à la doc (2 instances locales). | Aucun (non publié, préfixe `.`). |
| B5 | Calque `Frame 28` (T6), Versionning `Draft v.2.0.0 May 28, 2024` (T5), `Frame 3` dans To review (T4), pas de lien doc (T3). | M | Voir transverses. | Aucun. |
| B6 | Code : `variant` contre propriété Figma `Style` (déjà dans `components.json`) ; `label` requis en code, en Figma le texte vit dans `.Content Properties` (pas de propriété texte, conforme au PLAYBOOK). | B | Rien à faire, documenté. | n/a |

### 2. Badge (counter) (composant 257:5, page 257:2)

Pastille 12 x 12, texte `9` Allianz Neo Bold 12, liée à `Background/Functional/Signal`, `Radius/Round`, `Spacing/XXS`, taille, famille, graisse, interlettrage.

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| BC1 | Interligne du texte `9` en dur (12) : seule propriété typographique non liée. | B | Lier à la variable Semantic de line-height correspondante si elle vaut 12, sinon laisser (aucune variable à créer). | Faible : 3 instances locales, usage consommateur via Tab seulement. |
| BC2 | Composant nommé `Badge`, comme le set 141:98 ; page nommée `Badge` aussi. Ambigu dans le panneau Assets. | M | Renommer le composant `Badge Counter` et la page `Badge (counter)`. | Aucun (renommage, clé conservée). |
| BC3 | Versionning gabarit vide (T5), To review (T4), lien doc (T3). | M | Voir transverses. | Aucun. |

### 3. Popin (composant 63:807, page 41:2) : **Bloquant**

`Popin` = fond 1280 x 800 + instance exposée `.Spec` (328:3934, boîte 480 px) qui expose `.Icon` (328:3948, Type Info/Success/Error/Warning) et `.Content` (328:4212, Text / Slot). `Popin` et `.Spec` n'ont **aucune propriété**.

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| P1 | **Ancien `.Spec` (set 62:709, 5 variantes) et ancien `.Icon` (set 301:1279) encore dans la section publiée**, sans description, 221 et 32 valeurs brutes (paddings 24 / 16 / 48, gaps 4 / 8 / 16, rayons 4 / 100). 62:709 : 0 instance ; 301:1279 : 5 instances, toutes dans 62:709. Doublons morts des atomes 328:3934 / 328:3948. | H | Supprimer 62:709 puis 301:1279 (vérifier d'abord dans les fichiers consommateurs qu'aucune instance détachée n'y renvoie ; atomes `.` non publiés). | Aucun côté publication (préfixe `.`, pas de clé publiée utilisée). |
| P2 | Styles de texte hors Tokens : titre `Headline/Medium (🖥26 📱24)/Bold Mobile` (24/32, police non résolue), texte `foundation-text-paragraph` (16/24) ; ombre `Shadows/Bottom/800` (T1, T2). | H | Titre vers le style Tokens de même valeur, texte vers `Body/L/Regular`. | Moyen : 1 instance locale ; consommateurs à relire (Reject Management, Coverbook) avant publication, seule la police change si les valeurs sont égales. |
| P3 | Fond : fill noir `#000000` à 35 % en dur ; paddings racine 78 / 179 en dur pour centrer la boîte. | M | Lier la couleur à un Semantic de fond d'overlay existant (opacité `Measurement/Opacity/Overlay` existe) ; centrer par alignement auto-layout au lieu des paddings. | Moyen : lier les paddings écrase une surcharge de padding consommatrice ; aucune relevée dans les deux audits. Préférer supprimer les paddings (alignement centre) plutôt que les lier. |
| P4 | Aucune propriété sur `Popin` ni `.Spec` : titre, bouton secondaire, bouton de fermeture et texte se règlent en ouvrant les instances imbriquées. Le code a `secondaryLabel` optionnel, `cancelLabel`, `tone`. | M | Ajouter sur `.Spec` des booléens `Secondary action` et `Close` (afficher/masquer), garder les textes en surcharge directe (PLAYBOOK). | Faible : ajouter un booléen ne touche pas aux surcharges existantes. |
| P5 | Racine fixe 1280 x 800 (conforme à la règle Modal 1280 x 800) ; `.Spec` largeur fixe 480, hauteur hug : tient au changement de texte. | OK | n/a | n/a |
| P6 | Cadre `Text` (nom générique), `Ellipse 1` dans To review, lien doc. | B | T4, T6. | Aucun. |
| P7 | Code : tons `warning / danger / info` contre Figma `Info / Success / Error / Warning` (déjà noté). | M | Décision à prendre (rappel). | n/a |

### 4. Tooltip (set 119:4038, page 119:3357)

Position (8 valeurs) x Reversed : 16 variantes, identiques aux 8 positions du code. Couleurs, paddings, rayons et typographie (taille, interligne, famille, graisse, interlettrage) liés au Semantic.

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| TT1 | Ombre `DROP_SHADOW` 0 0 4, noir 25 % en dur sur les 16 variantes, sans style d'effet ; le code utilise `drop-shadow(0 0 2px rgba(0,0,0,.25))` et le Semantic `--semantic-shadow-tooltip` (bottom-200). | M | Appliquer le style d'effet partagé retenu en T2 (après décision), sinon aligner le flou sur 2 comme le code. | Faible : aucune surcharge d'effet relevée sur Tooltip (21 instances locales). |
| TT2 | Texte `Content` en largeur auto sans largeur max : un libellé long ne passe jamais à la ligne. Le code plafonne à 320 px (`max-width`). | M | Racine `maxWidth` 320 et texte en `FILL` / hauteur auto. | Faible : les instances gardent leur texte ; seules celles de plus de 320 px passeront à la ligne (souhaité). |
| TT3 | To review, lien doc. | M | T3, T4. | Aucun. |

### 5. Popover (set 121:12614, page 119:3358)

Position (12) x Reversed : 24 variantes, identiques aux 12 positions du code. Booléens `Illustration` et `Actions` ; atome exposé `.Action` (121:13151, booléen `Secondary Action`, deux Button). Textes en `Title/H3` et `Body/L/Regular` (Tokens).

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| PO1 | Illustration `undraw_vibe-coding_mjme 1` copiée en dur dans les 24 variantes (120 calques chacune, 1 944 fills hex bruts : `#e6e6e6`, `#f2f2f2`, `#090814`, `#3f3d56`, `#ffb6b6`...). | M | La remplacer par une instance (composant d'illustration ou slot) avec instance swap ; les couleurs d'illustration ne relèvent pas des tokens. | Moyen : remplacer le calque change son id ; les instances consommatrices qui ont surchargé l'illustration (aucune relevée) perdraient la surcharge. |
| PO2 | Flèche : `Indicator` > `Frame 37` > `Rectangle 1` (carré tourné de 45°, rayon 2 et trait 1 en dur, 24 fois) ; trait 1 en dur sur `Wrapper` (24 fois) ; gap racine -1 en dur (chevauchement de la flèche). | M | Lier les traits à `Border/Size/S`, le rayon à `Border/Radius/XS` si sa valeur est 2 ; gap -1 : laisser en dur (pas de token négatif). Renommer `Arrow`. | Faible : aucune surcharge de trait ou de rayon relevée sur Popover (15 instances locales) ; à relire dans les consommateurs avant publication. |
| PO3 | Bouton de fermeture `Button Icon` toujours visible, non piloté ; titre non masquable. Le code a `dismissible` (défaut true) et `title` optionnel. | M | Ajouter les booléens `Close` et `Title`. | Faible (ajout de propriété). |
| PO4 | Deux textes nommés `Title` (titre et corps) ; largeur racine fixe 487 sans maximum, le code a `max-width: 400px` (valeur en dur côté code). | B | Renommer le corps `Body` ; aligner la largeur (400 ou 487) entre Figma et code. | Renommage : aucun. Largeur : moyen, les instances non surchargées changent de largeur. |
| PO5 | To review, lien doc, `Group` / `Vector` génériques. | B | T3, T4, T6. | Aucun. |

### 6. Toaster (set 125:1116, page 124:848)

Status (Info, Success, Warning, Error, comme le code) ; booléens `Title`, `Loading`, `Action`. Couleurs, paddings, rayons, traits (`Border/Size/S`) liés.

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| TO1 | Titre en `foundation-h4` (ancienne librairie) ; ombre `Shadows/Bottom/400` (T1, T2). Le corps est lié aux variables (correct). | H | Titre vers `Body/L/Semi Bold` (même valeur 16/24 SemiBold). | Faible : valeurs identiques ; 17 instances locales. |
| TO2 | Racine largeur fixe 352 et barre `Loader` (315 x 4, sans auto-layout) en largeur fixe : si on élargit une instance, la barre ne suit pas. | M | Barre en `FILL` dans un parent auto-layout. | Faible : la largeur de la barre n'est pas surchargée (aucune relevée). |
| TO3 | Versionning gabarit vide (T5), instance `Button Icon` orpheline dans To review, cadre `Text`, lien doc. | M | T3 à T6. | Aucun. |
| TO4 | Code : action en `ds-link` contre `Button` Figma (déjà noté). | M | Rappel, décision en attente. | n/a |

### 7. Snackbar (composant 124:34846, page 124:29805)

Plaque `Background/Accent/Primary`, icône `Icon Functional`, texte lié aux variables, `Link` distant.

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| S1 | **Aucune propriété** : l'icône et le lien ne se masquent pas, alors que le Versionning annonce « optional icon and optional link » et que le code a `icon` (optionnel) et `tone` (`neutral / success / error`). | H | Booléens `Icon` et `Link` ; propriété `Tone` si les tons code sont validés côté design. | Faible (ajout de propriétés). |
| S2 | Gap racine 80 en dur entre texte et lien (aucun Semantic de cette valeur). | M | Passer en `SPACE_BETWEEN` ou en gap lié à un Semantic existant. | Moyen : changer le gap du maître écrase les instances qui l'ont surchargé (aucune relevée sur les 6 instances locales). |
| S3 | Ombre `Shadows/Bottom/800` hors Tokens (T2) ; code `--semantic-shadow-flyout`, alors qu'un `--semantic-shadow-snackbar` (bottom-800) existe. | B | Code : utiliser `--semantic-shadow-snackbar`. | n/a |
| S4 | `Frame 248`, To review, lien doc. | B | T3, T4, T6. | Aucun. |

### 8. Functional Notice (set 154:2271, page 124:944) : **Bloquant**

Emphasis (High, Medium, Low) x Status (Default, Info, Success, Warning, Error) ; booléens `Close`, `Title`. Couleurs, paddings, rayons liés.

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| F1 | **Grille incomplète : 12 variantes sur 15.** High et Medium n'ont pas `Default` ; Low n'a pas `Success`. Le code accepte les 15 combinaisons (`status` 5 x `emphasis` 3). Choisir High + Default dans le panneau donne une variante inexistante. | H | Ajouter High/Default, Medium/Default, Low/Success (ou restreindre le code et documenter). | Aucun (ajout de variantes). |
| F2 | `Emphasis=High, Status=Info` (variante par défaut) diffère des 11 autres : racine en HUG au lieu de FIXED, alignement MIN au lieu de SPACE_BETWEEN, gap 425 en dur ; le bouton de fermeture n'est donc pas calé à droite quand le texte change. | H | Aligner sur les autres variantes (FIXED + SPACE_BETWEEN, gap sans effet). | Moyen : les instances High/Info non surchargées en largeur prendront la largeur du maître (1 224) ; relire les consommateurs (Search, Reject Management, Coverbook). |
| F3 | En Low, `Title` est masqué sans lien au booléen et il n'y a pas de `Button Icon` : les booléens `Title` et `Close` sont sans effet sur 4 variantes. Le code permet `title` et `dismissible` en Low. | M | Soit relier `Title` et ajouter le bouton en Low, soit documenter que Low n'a ni titre ni fermeture (et le refléter dans le code). | Faible. |
| F4 | Styles hors Tokens : titre `foundation-h4`, texte `Copy/Small (14)/Regular` (T1). | H | Titre vers `Body/L/Semi Bold`, texte vers `Body/M/Regular` (valeurs identiques). | Faible : valeurs égales ; l'instance 31:4053 (padding) n'est pas concernée. |
| F5 | Texte `Title` en largeur fixe (178, 434) dans certaines variantes Medium / Low au lieu de FILL. | B | Passer en FILL. | Faible. |
| F6 | **Page non normalisée** : hors sections, restent `Frame 1` à `Frame 3`, deux maquettes `ADT v2 - New ADT`, `ManA - Financial info`, `Vector 1` à `Vector 6`, textes `Inner block`, `Inner page`, `Top fixed`. Page nommée `Functionnal Notice`. | M | Déplacer ces maquettes d'usage dans une section « Examples » ou les supprimer ; renommer la page. | Aucun (aucun maître dedans). |
| F7 | Code : `dismissible` défaut false contre `Close` défaut true en Figma. | B | Aligner le défaut. | Changer le défaut Figma : les instances non surchargées perdent la croix. Préférer changer le code. |

### 9. Spinner (set 264:10, page 14:2)

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| SP1 | Variantes `Property 1` = `Default`, `Variant2`, `Variant3`, `Variant4` : ce sont les 4 images de l'animation (prototype Smart Animate après 1 ms), pas des choix d'usage. Une seule taille (14 x 14) ; le code a `size` `xs / s / m / l` et `tone` `default / current`. | H | Renommer la propriété `Frame` (ou masquer l'animation dans un atome `.Animation`) et ajouter `Size` et `Tone` au niveau public. | Moyen : renommer une propriété de variante casse les surcharges de variante dans les consommateurs si la valeur change ; garder les valeurs, ne changer que le nom de propriété, puis vérifier les 12 instances locales et le Button Loading (audit Action T8). |
| SP2 | `Group 1` avec `Ellipse 1` / `Ellipse 2`, variantes sans auto-layout (acceptable pour une forme) ; couleurs liées (`Icon/Subtle/Tertiary`, `Icon/Main/Tertiary`), trait 1 en dur. | B | Renommer `Track` / `Arc`, retirer le groupe. | Faible. |
| SP3 | Versionning gabarit vide, To review, lien doc. | M | T3 à T5. | Aucun. |

### 10. Skeleton Item (set 117:5, page 117:2)

State `Start` / `End` (animation du reflet), 394 x 12, rayon `Border/Radius/S`, fond `Background/Main/Secondary`, atome `.Animation` (117:4) au gradient entièrement lié. Le code expose `height` et `radius` libres (chaînes en px par défaut, à vérifier côté code mais hors périmètre Figma).

| # | Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|---|
| SK1 | `.Animation` sans description. | B | Description `Private atom of Skeleton Item`. | Aucun. |
| SK2 | Versionning gabarit vide, To review, lien doc. | M | T3 à T5. | Aucun. |

## Corrections priorisées

Sans risque de surcharge (à faire en premier, en un lot) :
1. **Remplir les blocs Versionning** de Badge, Badge (counter), Toaster, Spinner, Skeleton Item (T5), ou repasser leur état en Draft dans `components.json`.
2. **Supprimer l'ancien `.Spec` 62:709 et l'ancien `.Icon` 301:1279** de la page Popin (P1).
3. **Supprimer les 10 sections « To review »** et les restes (`Ellipse 1`, `Button Icon`, `Frame 3`) ; nettoyer les maquettes hors section de la page Functional Notice (T4, F6).
4. **Ajouter les variantes manquantes de Functional Notice** (High/Default, Medium/Default, Low/Success) (F1).
5. **Ajouter les propriétés manquantes** : Snackbar `Icon` / `Link` (S1), Popover `Close` / `Title` (PO3), Popin `.Spec` `Secondary action` / `Close` (P4).
6. Liens de documentation et descriptions des atomes privés (T3), renommages de calques et de pages (T6, T8, B3, BC2).

Avec risque modéré (relire les consommateurs juste avant, puis publier) :
7. **Remplacer les styles de texte hérités** par les styles Tokens de même valeur : Toaster, Functional Notice, Popin (TO1, F4, P2). Pour Badge, **trancher d'abord l'écart code / Figma** (14 Regular contre 14 / 16 SemiBold) (B1).
8. **Réaligner `Functional Notice` High/Info** sur les autres variantes (F2).
9. Tooltip : ombre partagée et largeur max 320 (TT1, TT2) ; Toaster : barre `Loader` en FILL (TO2).
10. Spinner : renommer `Property 1`, ajouter `Size` / `Tone` (SP1), en vérifiant le Button Loading.
11. Popover : illustration en instance, traits et rayon de flèche liés (PO1, PO2) ; Snackbar : gap 80 (S2) ; Popin : fond et centrage (P3).
12. Décider où vivent les ombres (T2) et l'arbre Semantic doublon `Subtle/Fuctional` (T9) ; Badge Neutral Light M (B2) et interligne du compteur (BC1).
