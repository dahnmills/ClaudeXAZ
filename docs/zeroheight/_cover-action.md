# Cover de la librairie Action (2026-11-16)

Fichier : Action `xCeEJPn6fliEshuE9fnrqs`, page Cover `0:1`. Rien de publié, rien de commité, vignette du fichier non choisie.

## Modèle suivi

Covers des fichiers MCP, lues en lecture seule : Search `LBLqJmlPqXmx9qksCyYGPb` (7:85), Coverbook `NflKzgx17mOn2JPoFaqnjW` (3:287), Reject Management `zUzOSE77EjbShM9u7yLthB` (3:2).
Structure commune, reprise à l'identique :

- Cadre local `Cover` 1280 × 640 (aucune instance de composant Cover de Layout), auto-layout horizontal, padding et gap `Measurement/Spacing/3XL`, fond `Color/Static/Background/Brand`.
- Colonne `Identity` (SPACE_BETWEEN) : `Logo Qirin` en haut, `Heading` (Eyebrow 14 SemiBold, Title Display L 64/72 Bold, Subtitle 16/24) au milieu, `Meta` en bas (libellés 12 SemiBold + valeurs 16 SemiBold, badge de statut Success Strong).
- Colonne `Visual` 520 px : cartes blanches (`Static/Background/Main/Primary`, `Border/Radius/L`, padding L/M), centrée verticalement.
- Typo Allianz Neo liée à `Font/Family`, `Font/Text Style/*`, `Font/Display/*` ; textes en `Color/Interactive/Text/Neutral/Default` comme le modèle.

## Nouvelle cover

- Cadre `Cover` **4056:2** en (0, 0).
- Contenu : eyebrow « QIRIN COMPONENTS », titre « Action », sous-titre « 19 action components and 5 utilities, from buttons to pagination. »
- Meta : STATUS badge « Ready » (Badge Success Strong M, librairie Feedback), VERSION 1.0.0, UPDATED 2026-11-16, LINKS : deux instances `Link` (Tone Reversed, Underline) « Storybook » et « ZeroHeight » avec hyperliens.
- Visual : vraies instances des composants locaux d'Action : Button (Primary, Secondary, Tertiary, icône retirée) + Button Icon ; Tab (3, Overview sélectionné) ; Segmented Control (Day, Week, Month) ; Chip (Open, Closed) + Pagination Classic.
- Tout est lié aux variables `Tokens / Semantic` importées par nom (`figma.teamLibrary`). Aucun token, collection ni mode créé.

## Ancienne cover

Section **4056:305** « Cover - To review » en x = 1680 (400 px à droite de la cover), 2080 × 2360. Elle contient les deux anciens cadres, déplacés sans modification : `UX Workflow` 59:317 (1600 × 960) et `Frame 1` 611:2972 (1920 × 1080).

## Écarts avec le modèle

1. **Logo** : le composant `Logo Qirin` (set `d4206ee4…`) n'est pas accessible depuis le fichier Action (import refusé, introuvable par la recherche). Reproduit avec la même structure : instance `Header Q/First slot/Logo` Inverted=True (le logo de la page Status) + Divider 1 × 40 + « Qirin » 24/32 (`Font/Title/Size/M`, `Font/Title/Line Height/L`). À remplacer par l'instance `Logo Qirin` Reversed=True si la librairie qui la porte est activée dans Action.
2. **SOURCE remplacé par LINKS** : le modèle affiche « main · hash » ; ici les liens Storybook et ZeroHeight demandés. Pas de hash de commit affiché.
3. **Statut « Ready »** au lieu de « Ready for dev » (vocabulaire du tableau Status de la librairie).
4. **Interligne des libellés** : `Font/Text Style/Line Height/S` (16), alors que le modèle lie par erreur la line height à `Font/Text Style/Size/L`. Rendu identique.

## Champs laissés en exemple

Aucun : les covers MCP n'ont pas de noms de personnes ni d'équipe.

## Passes de capture

1. Mot « Qirin » trop petit (variable de taille absente), onglets collés, chip « Closed » coupé, icônes crayon sur tous les boutons. Corrigé : taille Title M, gap `Spacing/L` entre onglets, icônes retirées (Button, Segmented Control), chips déplacés sur la rangée de la pagination.
2. Équilibre conforme à Search (texte à gauche, quatre cartes à droite), titre lisible en vignette. Reste : un vide à droite du Segmented Control, accepté.
