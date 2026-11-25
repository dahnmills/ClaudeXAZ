# Brief : Widget Card 2.0 dans la librairie Data Display (2026-11-23)

Accord utilisateur : « go Data Display ». Librairie Data Display `VpConH5AUGyCqtp8PMqj1i` (contient déjà Card, Table, Task,
Widget Card). Source : page Card kit `78:20` du fichier Bento `XW7jVtIa6UWRTqKMDqOF5D` (maître Bento Card `91:577`, ids et
règles dans `_figma-card-kit.md`, passes 1 à 4). Recherche : `research-card-kit-questions.md` (question 7 surtout, puis 2 et 3).

## À faire dans Data Display
1. Inspecter d'abord : pages, organisation (mémoire figma-component-page-layout : une section par composant,
   Versionning | Component | Documentation | Do/Don't, kit docs/figma/doc-kit/page-kit.js), Widget Card existante (nom,
   propriétés, nombre d'usages si lisible), Progress Bar, Properties Panel, Table Row, variables et styles déjà importés.
2. Le Plugin API ne copie pas de nœud d'un fichier à l'autre : RECONSTRUIRE à l'identique (mêmes structures, tokens,
   propriétés, variantes) en lisant le maître Bento par use_figma (lecture seule sur Bento).
   - Maître **Widget Card 2.0** : 12 variantes (Emphasis 8 en Default ; Loading, Empty, Error, Edit en None), slot Content,
     booléen Footer, atomes internes `.Card Header`, `.Status`, `.Card Footer`, `.Delta` (préfixe « . », non publiés).
     Taille libre (auto-layout), préréglages des formats documentés. Warning = convention Badge (passe 4). Le liseré
     4 px des Subtle est GARDÉ tel quel pour l'instant (question encore ouverte côté utilisateur), le noter.
     Edit utilise la barre d'outils de card : si `Local · Card toolbar` n'a pas d'équivalent en librairie, la reconstruire
     en atome interne `.Card Toolbar`.
   - Atomes génériques PUBLIÉS : Key figure (avec .Delta), Sparkline, Bullet graph, Stacked bar, Group heading (nouveau :
     12 px semi-bold, texte secondaire, une ligne, voir recherche Q3). Sparkline et Bullet graph avec un slot `Plot`
     pré-rempli (recherche Q2). Variante Reversed comme dans le kit.
   - List row, Mini table row, Progress, Empty hint : vérifier le recouvrement avec Properties Panel, Table Row,
     Progress Bar, état Empty du maître. Ne créer que s'il n'y a pas d'équivalent ; sinon le dire.
   - Task item, News item, Timeline item, Grade chip : NE PAS créer (restent locaux à Bento).
3. Ancienne Widget Card : la renommer « Widget Card (deprecated) » et mettre dans sa description la consigne de migration
   vers Widget Card 2.0. Ne rien supprimer, ne pas détacher ses instances.
4. Page / section Widget Card 2.0 dans le style des pages composants (Component, Documentation courte, Do/Don't),
   descriptions de composants renseignées (usage, propriétés).
5. NE PAS PUBLIER (le Plugin API ne publie pas ; publication = étape séparée, accord utilisateur). Ne pas toucher au fichier
   Bento (re-pointage après publication). Aucune variable créée, tokens Semantic et styles de texte Tokens uniquement,
   zéro valeur brute (script de contrôle), textes en anglais, aucun tiret cadratin.
6. Vérifier par captures (variantes, atomes, page). Rapport : docs/benchmark-2026-11-20-bento/_figma-data-display.md
   (ids, propriétés, écarts avec le kit Bento, recouvrements trouvés, liste de ce qui sera à re-pointer dans Bento après
   publication). Ne pas commiter. Réponse finale courte.
