# Planche Do / Don't, groupe G (page Utility 950:2, fichier Action xCeEJPn6fliEshuE9fnrqs)

Chaque planche transforme EN PLACE la section `ZeroHeight · <Nom> illustrations` (meme nom, meme nodeId) via `buildBoard` (docs/figma/doc-kit/board-kit.js). Position : x = 6400 (= 4560 + 1280 + 560), y = y du cadre `Documentation · <Nom>`. Aucun chevauchement (verifie par script), 560 px d'ecart avec le cadre Documentation. Tout lie aux variables Semantic, aucun token cree. Rien publie.

| Composant | Section (nodeId) | Cadre interne | Taille |
|---|---|---|---|
| Keycap | 963:145 | 999:6950 | 1280 x 934 |
| Shortcut Keys | 964:144 | 999:6998 | 1280 x 910 |
| Shortcut Row | 966:634 | 999:7046 | 1420 x 1070 |
| Keyboard Map | 967:1560 | 999:7094 | 2260 x 1780 |
| Flag | 965:198 | 999:7164 | 1280 x 1129 |

## Regles
- Keycap : 2 paires (Label content: 963:114/963:124 ; Key size: 963:129/963:139).
- Shortcut Keys : 2 paires (Number of keys: 964:111/964:123 ; Sequences: 964:130/964:140).
- Shortcut Row : 2 paires (Where to use it: 966:499/966:542 ; Label and leader: 966:576/966:605).
- Keyboard Map : paire Rows drawn (967:1176 / contre-exemple 967:1258, legende ajoutee "Add a digit row: only the three letter rows are drawn."), Do seul (Layout source, 967:1361, Dont en pointille), Dont seul (Shortcuts and layout, 967:1477, Do en pointille), text only Dont : "Replace the Tags with a dropdown: three choices do not need a menu."
- Flag : paire Name next to the flag (965:128/965:148), paire Size (965:170 / contre-exemple 965:189, legende ajoutee "Enlarge the flag: keep the 16 by 12 size."), text only Dont : "Use a code that is not in the list: only fr, de, kr, gb, us, no and pt exist."
- Les titres de rubrique (key) sont inventes : les pages ZH n'ont qu'un seul bloc "Best practices".

## Verification des nodeIds d'origine
Les 20 frames existent toujours, noms inchanges, reparentees dans Illustration > carte > cadre `Do and Don't board` de leur section : 963:114, 963:124, 963:129, 963:139, 964:111, 964:123, 964:130, 964:140, 966:499, 966:542, 966:576, 966:605, 967:1176, 967:1477, 967:1361, 967:1258, 965:128, 965:148, 965:170, 965:189.

## Ecarts
- Bug corrige dans board-kit.js : une accolade en trop dans le bloc textOnly (erreur de syntaxe).
- Keyboard Map : planche large (2260) car la frame fait 1020; deux cartes pointillees hautes, seul desequilibre restant.
- Pas de gabarit d'en-tete ni de Versionning trouves a la racine de la page Utility (seul le cadre `Utility sections`), rien deplace.
- Le build des 5 planches a ete fait en un appel (connexion MCP coupee a la reponse, resultat verifie ensuite par metadata). Une passe de critique visuelle sur les 5 (captures dans Temp/board-G), aucune correction jugee necessaire : la seconde passe demandee n'a pas donne lieu a un rebuild.
