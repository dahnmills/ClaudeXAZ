# Audit Figma Action (lot A) : propreté et ISO code

Lecture seule, fichier `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`), session du 2026-11-06. Aucune écriture Figma, ZeroHeight ou code.
Légende côté de correction : F = corriger Figma, C = corriger le code, D = corriger la doc, F+C = décision à trancher.
Sévérité : H (bloquant pour l'ISO), M, B (basse).

## Constats transverses (valables pour les 5 composants)

| # | Constat | Sév. | Correction |
|---|---|---|---|
| T1 | Aucun des composants n'a de description (`description` vide sur tous les sets, `.Content` et `.Icon Functional` compris). | M | F : renseigner une description (rôle, quand l'utiliser, lien page ZeroHeight). |
| T2 | Rayons, paddings et gaps jamais liés à des variables dans les variantes (Button 192 rayons, 90+90 paddings, 120 gaps non liés ; Button Icon 448 rayons, 192 paddings ; idem Split, Load More, Range). Les valeurs sont justes (4, 16, 8) mais en dur. | H | F : lier aux Semantic existants : Border/Radius/S, Measurement/Spacing (2XS, S, M). Aucune variable à créer. |
| T3 | Cadre `Border Focus` : trait lié à `foundation/color/action/blue/450` (Foundation direct, pas Semantic) et rayon 9 en dur, sur Button, Button Icon, Split (via instances). Le code utilise `--semantic-color-interactive-border-focus`. | H | F : relier le trait à Color/Interactive/Border/Focus (ou son nom Semantic équivalent) ; lier le rayon. |
| T4 | Glyphes d'icône (`Shape`, `Color`) avec fills non liés ou liés à Foundation (`foundation/color/neutral/white`, `action/blue/500`, `blue/600`, `blue/650` sur la variante Reversed). Fills Reversed liés à Foundation : 48 + 18 + 12 + 18 occurrences sur Button. | H | F : relier aux Semantic Interactive Icon/Text (Neutral, Muted/Alt). |
| T5 | Typographie : le texte est lié aux variables de taille, interligne et graisse (SemiBold) mais pas à un style de texte (`textStyleId` vide sur la plupart des calques ; Range et Load More ont un style). Figma = SemiBold, code Button = `font-weight: regular` (400). La doc Button dit « Body L regular ». | H | F+C : trancher. La source de vérité étant Figma, passer `.ds-button` en `--semantic-font-text-style-font-weight-semi-bold` (et corriger la doc). |
| T6 | Nom de l'état enfoncé : `Active` (Button, Button Range, Load More) contre `Pressed` (Button Icon). | M | F : unifier sur `Active` (le code est `:active`) ; mettre à jour les instances. |
| T7 | Le focus n'est pas modélisé de la même façon : Button n'a pas de propriété `Focus` (le cadre `Border Focus` existe, masqué, sans booléen), Button Icon a le booléen `Focus`, Range n'a ni cadre ni style de focus (code idem). | M | F : ajouter le booléen `Focus` au Button (comme Button Icon) et à Button Range ; C : ajouter `:focus-visible` à `ds-button-range`. |
| T8 | La variante `Loading` contient un calque `Group 1` avec `Ellipse 1`, `Ellipse 2` (noms génériques, groupes libres, fills non liés), 24 groupes et 72 calques mal nommés sur Button. Le spinner devrait être une instance du composant Spinner. | M | F : remplacer par une instance du composant Spinner (taille S, tone current), supprimer les groupes. |
| T9 | Le code est à jour de la doc ZeroHeight sur les écarts connus (Negative, fullWidth, Loading, Focus), les pages `docs/zeroheight/action/*.md` les listent déjà. Les écarts ci-dessous sont à fermer, pas seulement à documenter. | B | D : retirer les mentions d'écart une fois corrigés. |

## 1. Button (set `44:558`, page `44:554`)

Verdict : A CORRIGER.

Propriétés Figma : State (Default, Hover, Active, Disabled, Loading), Type (Primary, Secondary, Tertiary, Plain), Reversed (True/False, en variante), Tone (Default, Accent, Positive). 120 variantes. Atome imbriqué `.Content` exposé (set `168:1274`, propriété `Icon` Left/Right/None). Set `[Deprecated] Button` (`44:743`) toujours dans la page.

| # | Écart | Figma | Code | Sév. | Correction |
|---|---|---|---|---|---|
| B1 | Ton Negative | absent | `tone: 'negative'` présent (classes Primary, Secondary, Tertiary, Plain) | H | F : ajouter Tone=Negative (tokens Negative existent côté Button Icon) ou C : retirer. Recommandé : F (Button Icon l'a déjà). |
| B2 | Reversed en variante | 2 valeurs x 120 | `reversed` boolean | M | F : Reversed est une structure de couleur, acceptable ; à documenter. Alternative : réduire le set (120 variantes) en mode de variable. |
| B3 | Loading | variante dédiée `State=Loading` (opacité 0.4, fill Disabled, spinner 14x14, pas de `.Content`) | `loading` + spinner superposé, contenu masqué, opacité 0.40, largeur conservée | M | F : spinner en instance du composant Spinner ; garder la largeur du contenu (96 px constatés, OK). |
| B4 | Poids de police | SemiBold lié | 400 | H | voir T5. |
| B5 | `fullWidth` | absent | `fullWidth: boolean` | M | F : ajouter un booléen `Full width` (ou documenter que Load More le couvre). |
| B6 | Plain | 24 px de haut, padding 0, largeur 64 | 24 px, padding 0 | OK | ISO. |
| B7 | Dimensions, rayon, gap | 32 px, radius 4, padding 16, gap 8 | `spacing-xl`, `radius-s`, `spacing-m`, `spacing-s` | OK | valeurs ISO, mais non liées côté Figma (T2). |
| B8 | Icône par défaut et slots | `.Content` avec `Icon Functional` (par défaut Edit Pen) | slots `[slot=icon-left]` et `[slot=icon-right]` | OK | ISO fonctionnel. Pas de propriété Label texte exposée sur le set (le libellé est dans `.Content`) : F : exposer une propriété texte `Label` via le `.Content` pour éviter d'ouvrir l'instance. |
| B9 | Set déprécié | `[Deprecated] Button` encore présent (3 variantes, fills Foundation) | n/a | B | F : retirer ou déplacer hors de la page publiée une fois les usages migrés. |
| B10 | Hover/Active de Tertiary et Plain | l'état Hover Tertiary se vérifie via la couleur du texte uniquement | idem (`color` seule) | OK | ISO. |
| B11 | Disabled | opacité 0.40 sur le composant, fill et trait `Disabled` + opacité (double atténuation) | opacité 0.40 seule sur l'hôte | M | F : choisir une seule atténuation (fill Disabled sans opacité, ou opacité seule). Sinon rendu plus pâle que le code. |

Doc `button.md` : suit globalement (liste Negative, fullWidth, Loading, `.Content`). Erreurs à corriger : « Body L regular » (Figma SemiBold, voir T5).

## 2. Button Icon (set `12:145`, page `12:118`)

Verdict : A CORRIGER.

Propriétés Figma : State (Default, Hover, Pressed, Disabled), Type (4), Size (S, M), Reversed, Tone (Default, Accent, Positive, Negative), booléen `Focus`. 256 variantes. Instance `Icon Functional` exposée. Atome `.Icon Functional` (set `12:498`, Size S/M).

| # | Écart | Figma | Code | Sév. | Correction |
|---|---|---|---|---|---|
| I1 | Trait du Primary | lié à `Color/Interactive/Background/Main/*` (un token Background utilisé comme bordure) | `border-strong-*` | M | F : relier à `Color/Interactive/Border/Main/*`. |
| I2 | Nom d'état | `Pressed` | `:active` | M | voir T6. |
| I3 | Taille M | 40 x 40 avec icône 24 | 40 x 40 (`foundation-spacing-40`, token Foundation direct dans le SCSS) | M | C : utiliser un Semantic (`measurement-sizing`/`spacing`) au lieu de `--foundation-spacing-40` et `--foundation-spacing-16` dans `button-icon.component.scss`. |
| I4 | Plain | S 16x16, M 24x24, rayon 4 | S 16, M 24, `border-radius: 0` | B | F ou C : aligner le rayon (Figma 4, code 0). Sans effet visuel (fond transparent). |
| I5 | Hover/Active manquants dans le code | présents pour toutes les tonalités | Primary Reversed : hover seul, Secondary Positive/Negative : hover seul, Plain Positive/Negative : hover seul, pas de `:active` | M | C : compléter les états `:active` et Reversed (le code est incomplet par rapport à Figma). |
| I6 | `Focus` | booléen Figma | `:focus-visible` CSS | OK | décision documentée. |
| I7 | `ariaLabel` | n/a | obligatoire | OK | code seul, normal. |
| I8 | Icône par défaut | exposée, Edit Pen | contenu projeté | OK | |

Doc `button-icon.md` : suit (liste Pressed contre Active, Focus booléen, `.Icon Functional`).

## 3. Button Split (set `69:1883`, page `69:447`)

Verdict : A CORRIGER.

Propriétés Figma : Open (False/True), Type (Primary/Secondary). 4 variantes. Instances exposées `Button` et `Right` (Button Icon). Pas de Tone, Reversed, State propres : tout passe par les instances.

| # | Écart | Figma | Code | Sév. | Correction |
|---|---|---|---|---|---|
| S1 | Types | Primary, Secondary | tous les types de Button | M | F : ajouter Tertiary et Plain (ou C : limiter à primary/secondary). Recommandé C : Split plain/tertiary n'a pas de sens visuel (séparateur). |
| S2 | Nom du second élément | `Right` (Primary) mais `Button Icon` (Secondary) : nommage incohérent | `ds-button-split__toggle` | M | F : renommer en `Toggle` dans les deux variantes. |
| S3 | Trait du toggle | Primary : trait lié au fond Main ; Secondary : `Border/Main/Default` alors que le bouton principal utilise `Border/Muted/Default` ; fond Secondary `Background/Reversed/Default` | secondary : fond muted, bordure strong | M | F+C : vérifier que le Secondary de Figma (fond Reversed, bord Muted) correspond au Secondary de Button du code (fond Muted, bord Strong) ; probable incohérence de tokens entre le Split Figma et le Button Secondary. |
| S4 | Rayons de la jonction | rayons conservés sur les deux parties (coins droits du bouton principal non annulés dans la variante) | coins internes à 0, `border-right-width: 0` | M | F : annuler les rayons internes (coins côté jonction) pour être ISO. |
| S5 | Chevron haut/bas | variante `Open=True` | `chevron-up`/`chevron-down` | OK | |
| S6 | Tone, Reversed, Disabled, Loading | via les instances | inputs `tone`, `reversed`, `disabled`, `loading` | M | F : exposer `Tone` et `Reversed` (propriétés de l'instance imbriquée) au niveau du set pour supprimer le passage par deux instances. |
| S7 | Menu ouvert | non dessiné (juste le chevron) | slot `[slot=menu]` sous le groupe, 200 px mini, 4 px d'écart | M | F : ajouter un slot Menu dans `Open=True` (Flyout Menu) pour que le Figma montre l'état ouvert complet. |
| S8 | Valeurs en dur | Border Focus (T3), fills Foundation (T4), radius 9 | min-width 200 px et `top: calc(100% + 4px)` écrits en px dans le SCSS | H | F : T2 à T4 ; C : tokens pour 200 px et 4 px dans le SCSS (règle « aucune valeur en dur »). |

Doc `button-split.md` : suit, y compris l'écart Types et le comportement `loading`.

## 4. Button Load More (set `53:8445`, page `53:8307`)

Verdict : A CORRIGER (composant Figma sans équivalent code autonome).

Propriétés Figma : State (Default, Hover, Active, Loading Starts, Loading Ends). 5 variantes. Un cadre `Button` imbriqué (156 x 32) contenant `Label` (« Load more results ») ; pas d'instance du composant Button.

| # | Écart | Figma | Code | Sév. | Correction |
|---|---|---|---|---|---|
| L1 | Composition | cadre `Button` redessiné à la main (pas une instance de Button), padding 4/16/4/16, bordure 2 px, fond `Background/Neutral/*`, texte `Text/Main/*` SemiBold | pas de composant : `ds-button type="secondary" tone="accent" fullWidth` (bordure 1 px, bord `strong-alt`, texte `strong-alt`) | H | F : remplacer le cadre par une instance de Button (Type=Secondary, Tone=Accent), avec largeur Fill. C'est le seul moyen d'être ISO et de cascader. |
| L2 | Largeur | 156 px fixe | `width: 100%` (fullWidth) | H | F : largeur Fill (pas de 156). |
| L3 | États Loading | `Loading Starts` et `Loading Ends` (animation en 2 images, 157 px de large, trait RAW non lié, `Circle` et `Path` non liés, padding 8) | un seul état `loading` | M | F : un seul `Loading` (instance Spinner + Button Loading) ; fusionner les deux images. |
| L4 | Valeurs en dur | rayon 4, paddings, gap non liés ; trait RAW sur Loading | n/a | H | F : T2. |
| L5 | Doublon | un composant parallèle à Button | n'existe pas dans le code | M | F+C : soit retirer le set et documenter le pattern (Button Secondary Accent Full width), soit en faire un composant mince (Button imbriqué exposé). Recommandé : instance exposée de Button dans un set à 1 propriété `Loading`. |
| L6 | Texte par défaut | « Load more results » | « Load more » (story) | B | D ou C : harmoniser. |
| L7 | Description et nommage | `Button` (nom de cadre identique au composant), pas de description | | B | F : T1, renommer le cadre. |

Doc `button-load-more.md` : suit (pattern, Loading Starts/Ends, code via `ds-button`). Les couleurs réellement différentes (Neutral, 2 px) ne sont pas signalées.

## 5. Button Range (set `720:445`, page `720:437`)

Verdict : A CORRIGER (léger). Doc : statut Design WIP.

Propriétés Figma : State (Default, Hover, Active, Disabled), Status (Default, Selected, Between). 12 variantes. Texte `1` (calque nommé comme son contenu).

| # | Écart | Figma | Code | Sév. | Correction |
|---|---|---|---|---|---|
| R1 | Texte du Between | `Text/Strong/Alt/*` (couleur de marque, comme Default) | `color: text-neutral-default` (blanc) | H | F+C : trancher (Between sur fond Medium : blanc ou texte de marque ?). Les deux côtés doivent rendre pareil. |
| R2 | Graisse | Regular (Default), Bold (Selected, Between) | `font-weight: bold` (Selected, Between), Default non fixé (hérité) | B | C : fixer `regular` pour Default pour ne pas hériter. |
| R3 | Dimensions | 40 x 40, padding 2, gap 10 | `sizing-xl + sizing-s` = 40, padding `spacing-2xs`, pas de gap | B | OK sur le 40 ; F : gap 10 inutile (un seul enfant), le supprimer. |
| R4 | Focus | aucun cadre, aucun booléen | aucun style | M | F+C : ajouter `Focus` (T7) ; accessibilité clavier sans indicateur visible. |
| R5 | Rayons et paddings | non liés | tokens | H | F : T2. |
| R6 | Nom du calque texte | `1` | n/a | B | F : renommer `Label`, ajouter une propriété texte `Label`. |
| R7 | Groupe | n'existe pas en Figma | `ds-button-range-group` (options, mode, value) | M | F : composant maître `Button Range Group` avec Slot, ou documenter l'absence. La doc la signale déjà. |
| R8 | Disabled | opacité 0.4 + fills `Disabled` | opacité 0.40 seule | M | voir B11. |

Doc `button-range.md` : suit (écarts Group, Focus, `Between` signalés). À ajouter : le texte du Between (R1).

## Synthèse

| Composant | nodeId | Verdict | Écarts H | Écarts M | Écarts B |
|---|---|---|---|---|---|
| Button | `44:558` | A CORRIGER | 4 (T2 à T5 + B1) | 6 | 2 |
| Button Icon | `12:145` | A CORRIGER | 3 (T2 à T4) | 6 | 2 |
| Button Split | `69:1883` | A CORRIGER | 2 | 6 | 0 |
| Button Load More | `53:8445` | A CORRIGER | 4 | 3 | 2 |
| Button Range | `720:445` | A CORRIGER | 2 | 3 | 3 |

Aucun des 5 n'est PROPRE : les variantes sont raisonnables, les couleurs sont majoritairement liées à des Semantic, mais rayons, espacements et focus ne le sont pas, et le trait Foundation direct revient dans les 3 composants à focus.

## Ordre de correction conseillé

1. T2, T3, T4 sur Button et Button Icon : relier rayons, paddings, gaps, focus et fills Reversed aux Semantic existants (aucun token à créer). Cascade ensuite sur Split, Load More, Range.
2. Trancher T5 (SemiBold) et B1 (Negative) : décisions de design avant tout.
3. T6, T7, T8 : renommer Pressed en Active, booléen `Focus`, instance Spinner.
4. L1 à L3 : refaire Load More en instance de Button.
5. Code : compléter `:active` Button Icon (I5), tokens Foundation du SCSS (I3, S8), focus Range (R4).
6. Mettre à jour les 5 pages ZeroHeight (D) une fois les écarts fermés.
