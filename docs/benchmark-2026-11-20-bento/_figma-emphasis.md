# Figma, page « Emphasis levels » (29:2) : rapport

Fichier `XW7jVtIa6UWRTqKMDqOF5D`, page `29:2` uniquement. Aucune librairie modifiée, aucune variable créée, rien de
publié, rien de commité. La page `1:4` n'a été que lue (l'écran du board y est cloné, l'original est intact).

## Nœuds

| Bloc | nodeId | Position | Taille |
|---|---|---|---|
| Emphasis scale (9 niveaux x 1x1 + 2x1 + contrastes) | `35:122` | x 0, y 0 | 1408 x 2198 |
| Pale blue on the page · problem and fix | `37:60` | x 0, y 2398 | 1336 x 552 |
| Board · 1280 · Emphasis example (clone de `8:8034`) | `39:2685` (grille `39:2695`) | x 1968, y 0 | 1280 x 2020 |
| Notes · Emphasis usage rule | `43:890` | x 3688, y 0 | 480 x 738 |

Rangées de l'échelle (rangée, 1x1, 2x1) : None `35:135` / `35:141` / `35:155` ; Subtle brand `35:198` / `35:204` / `35:218` ;
Strong brand `35:267` / `35:273` / `35:286` ; Negative subtle `35:329` / `35:335` / `35:349` ; Negative strong
`35:397` / `35:403` / `35:416` ; Warning subtle `35:459` / `35:465` / `35:479` ; Warning strong `35:529` / `35:535` /
`35:548` ; Positive subtle `35:593` / `35:599` / `35:613` ; Positive strong `35:662` / `35:668` / `35:681`.

Espacement : 560 px entre l'échelle et le board, 440 px entre le board et Notes, 200 px entre l'échelle et le bloc bleu pâle.

## Tokens utilisés (tous Semantic existants, préfixe `Color/Static/`)

| Niveau | Fond | Liseré (4 px, `Border/Size/L`) | Textes / icônes |
|---|---|---|---|
| None | `Background/Main/Primary` + bord `Border/Subtle/Tertiary` | aucun | Text/Main/Primary, contexte Text/Main/Tertiary, icône Icon/Main/Secondary |
| Subtle brand | `Background/Main/Alt/Secondary` (blue A 050) | `Border/Brand` | Text/Main/Primary, valeur et statut Text/Brand, contexte Text/Main/Secondary, Icon/Brand |
| Strong brand | `Background/Brand` | aucun | Text/Subtle/Primary, contexte Text/Subtle/Tertiary, Icon/Subtle/Primary |
| Negative subtle | `Background/Functional/Subtle/Negative` | `Border/Main/Functional/Negative` | statut Text/Main/Functional/Negative, icône Icon/Main/Functional/Negative, contexte Text/Main/Secondary |
| Negative strong | `Background/Functional/Negative` | aucun | Text/Subtle/Primary, contexte Text/Subtle/Tertiary |
| Warning subtle | `Background/Functional/Subtle/Warning` | `Border/Main/Functional/Warning` | tout en Text/Main/Primary, icône Icon/Main/Primary, contexte Text/Main/Secondary |
| Warning strong | `Background/Functional/Warning` | aucun | tout en Text/Main/Primary et Icon/Main/Primary |
| Positive subtle | `Background/Functional/Subtle/Positive` | `Border/Main/Functional/Positive` | statut Text/Main/Primary, icône Icon/Main/Functional/Positive, contexte Text/Main/Secondary |
| Positive strong | `Background/Functional/Positive` | aucun | tout en Text/Subtle/Primary |

Rayon `Border/Radius/M`, padding `Spacing/M`, styles Body/M/Semi Bold (titre), Body/S/Semi Bold (statut), Title/H2
(valeur, 20 px semi-bold, compte comme grand texte), Body/S/Regular (contexte). Icônes : `Icon Functional` + glyphes NDBX
Check, Exclamation Circle Filled, Exclamation Triangle Filled, Check Circle Checked Filled.

Remarque de nommage : dans le fichier Tokens, `Background/Subtle/Primary` vaut blanc (comme `_semantic.scss`) : ce n'est
pas un bleu pâle. Les bleus pâles sont `Background/Main/Alt/Primary|Secondary|Tertiary` et
`Background/Functional/Subtle/Informative` (blue B 050). Il existe aussi un doublon `Background/Subtle/Fuctional/*`
(faute de frappe dans Figma), non utilisé ici.

## Contrastes mesurés (WCAG 2.2, valeurs résolues, arrondi par défaut)

Page = `Background/Main/Secondary` (grey 050). Seuils : 4,5:1 texte, 3:1 valeur 20 px semi-bold et icônes.

| Niveau | Carte / page | Liseré / page | Titre | Statut | Icône | Valeur | Contexte |
|---|---|---|---|---|---|---|---|
| None | 1,09 (bord) | n/a | 18,73 | 18,73 | 10,20 | 18,73 | 4,54 |
| Subtle brand | 1,13 | 10,33 | 15,16 | 9,12 | 9,12 | 9,12 | 8,26 |
| Strong brand | 10,33 | n/a | 11,26 | 11,26 | 11,26 | 11,26 | 7,98 |
| Negative subtle | 1,10 | 6,70 | 15,52 | 6,05 | 6,05 | 15,52 | 8,45 |
| Negative strong | 6,70 | n/a | 7,30 | 7,30 | 7,30 | 7,30 | 5,17 |
| Warning subtle | 1,02 | 2,41 (décoratif) | 17,64 | 17,64 | 17,64 | 17,64 | 9,61 |
| Warning strong | 2,41 | n/a | 7,12 | 7,12 | 7,12 | 7,12 | 7,12 |
| Positive subtle | 1,04 | 4,13 | 16,43 | 16,43 | 3,95 | 16,43 | 8,95 |
| Positive strong | 4,13 | n/a | 4,50 | 4,50 | 4,50 | 4,50 | 4,50 |

Combinaisons écartées et corrigées (affichées en « Fixed » dans chaque étiquette) :
- Text/Main/Tertiary sur toutes les teintes : 3,68 (bleu), 3,76 (rouge), 3,99 (vert), 4,28 (orange) : remplacé par Text/Main/Secondary.
- Text/Main/Functional/Warning sur orange pâle : 2,47 ; icône orange : 2,47 : remplacés par Text/Main/Primary et Icon/Main/Primary ; l'orange reste dans le fond et le liseré.
- Text/Main/Functional/Positive sur vert pâle : 3,95 (texte 12 px) : remplacé par Text/Main/Primary ; l'icône verte reste (3,95, au-dessus de 3:1).
- Blanc sur orange plein : 2,63 ; Text/Main/Secondary sur orange : 3,88 : tout en Text/Main/Primary (7,12).
- Text/Subtle/Tertiary sur vert plein : 3,19 : remplacé par Text/Subtle/Primary (4,50, juste au seuil).

## Bleu pâle confondu avec la page (benchmark : 1,02:1)

Bloc `37:60`, cinq options montrées avec la même card : A teinte actuelle Alt/Primary sans bord (1,02, et contexte
tertiaire 4,25 : rejeté) ; B teinte plus foncée Alt/Secondary seule (1,13 : rejeté) ; C Alt/Secondary + bord 1 px
Border/Brand (10,33, mais se lit comme sélection ou focus : rejeté) ; **D Alt/Secondary + liseré gauche 4 px
Border/Brand (Border/Size/L), 10,33 contre la page et 9,12 contre la card : retenu** ; E page blanche (1,24, et toutes les
cards blanches dépendraient de leur bord : rejeté). Le même liseré, dans la couleur du ton, sert à tous les niveaux subtle.

## Board 1280 (`39:2685`)

Clone de l'écran de lecture de la page `1:4`, mêmes contenus et formats, 16 cards, 54 cellules, grille 1160 x 1748 (bord bas
net, 9 rangées). Niveaux appliqués :
- Strong brand : Grade 3x2 (highlight existant, `39:2696`).
- Subtle brand : Limit left 1x1 (`39:2789`), à côté du Grade.
- Positive subtle : Overdues 1x2 (`39:2831`), 0 ouvert ; le Badge Success Light (pastille verte sur fond vert, invisible,
  texte 3,95) est remplacé par icône + libellé `42:888`.
- Warning subtle : Limit review 1x1 (`40:884`, rangée 5 colonne 5), revue annuelle de la limite due le 02 Dec 2024 (tâche
  des mocks).
- Negative strong : Sanctions 1x1 (`40:894`, rangée 5 colonne 6), 1 hit à lever, homonyme, preuve demandée (note et tâche des mocks).
- Ces deux key infos remplacent Risk figures et Notepad (1x1) de la page 1:4.

## Recommandations

1. Adopter l'échelle : None par défaut ; Subtle = teinte + liseré 4 px du ton ; Strong = fond plein.
2. Par board de 16 cards : 1 strong brand (highlight), au plus 1 strong negative (bloquant), 1 à 2 subtle brand, 3 à 4 cards de statut.
3. Strong warning et strong positive : non utilisés sur un board (orange plein = alarme, vert plein à 4,50 seulement).
4. Statut toujours icône + libellé ; jamais Text/Main/Tertiary sur une teinte.
5. Le choix de l'emphase brand se fait dans la barre d'outils flottante de la card en édition (contrôle « emphase », décision
   de 11 h 39) ; le ton de statut suit la règle de données de la card. Cette page ne montre pas d'état d'édition.

## Propositions et doutes

- Liseré 4 px : largeur liée à `Border/Size/L` ; c'est un usage nouveau de ce token (épaisseur d'accent), à valider.
- Le liseré orange (2,41 contre la page) est sous 3:1 : décoratif, le statut est porté par l'icône et le libellé.
- Données : l'exposition est à 31 % de la limite dans les mocks, elle ne justifie pas un warning ; le warning porte donc sur
  la revue de limite due le 02 Dec 2024. Si l'on veut un warning d'exposition, il faut une règle (seuil) et une donnée proche de la limite.
- Librairie Feedback : les badges Warning (orange sur orange pâle 2,47, blanc sur orange 2,63) et Success Light (3,95)
  échouent en AA texte ; à corriger dans la librairie (non touchée ici).
- Les key infos sont des frames construites (pas de composant local) : à transformer en propriété `Emphasis` du maître Card
  quand l'échelle sera validée.
- Valeur 20 px semi-bold traitée comme grand texte (600 assimilé à gras), à confirmer.
