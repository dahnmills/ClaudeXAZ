# Figma doc kit, lot C : Segmented Control, Tab, Pagination, Stepper

Fichier [Components] Action (`xCeEJPn6fliEshuE9fnrqs`). Date : 2026-11-06. Kit : `docs/figma/doc-kit/doc-kit.js`. Contenu = code (`src/app/shared/ui/*`, etat de l'arbre de travail), `components.json`, rapports `_audit-figma-action-C.md` et `_fix-figma-action-C.md`. Les 4 cadres : `miss` vide, composants montres en vraies instances, variables Semantic uniquement, aucun token cree.

## Cadres de documentation (nouveaux)

| Composant | Page | Cadre | Position | Ancien cadre supprime |
|---|---|---|---|---|
| Segmented Control | `302:2` | `981:2651` (1280 x 3681) | x 1223, y 700 (578 px sous le gabarit le plus proche) | `960:343` |
| Tab | `56:228` | `983:3251` (1280 x 3477) | x -473, y 2091 (560 px) | `960:4654` |
| Pagination | `52:779` | `985:1462` (1280 x 2975) | x -28, y -301 (560 px) | `961:902` |
| Stepper (WIP, sans composant) | `312:1332` | `988:21` (1280 x 3066) | x -798, y 1342 (560 px sous `Frame 1`) | `962:654` |

Les anciens cadres ont ete supprimes apres validation des nouveaux. Les cadres intermediaires de test crees par moi (`976:2650`, `982:2929`, `984:582`) ont aussi ete retires. Rien d'autre supprime, aucune section `ZeroHeight · ... illustrations`, composant, variante ou propriete touches.

Stepper : pas de gabarit `_Design system header` / `Versionning` sur la page WIP (rien a remplir). Pas d'anatomie ni d'etats (aucune instance possible). Le cadre montre une copie recadree de `Frame 1` (`312:1333`, originale intacte) puis proprietes, tokens, notes, usage.

## Gabarits remplis

| Page | Header composant | Header documentation | Versionning |
|---|---|---|---|
| Segmented Control | `595:5302` (version 1.0.0 au lieu de 2.0.0, description, tags Ready / In code) | `595:5385` (description, liens ZeroHeight + Storybook cliquables, Do / Dont avec instances) | `595:5428` (v1.0.0, 3 novembre 2026, Added + Documented) |
| Tab | `57:550` | `57:633` | `57:676` (v1.0.0, 8 septembre 2026) |
| Pagination | `53:8170` | `53:8208` | `53:8251` (v1.0.0, 8 septembre 2026) |

Fil d'Ariane deja correct. Dans les headers de documentation, le bloc Ressources a ete elargi a 560 px (labels en hug, valeurs alignees a gauche) pour eviter les retours a la ligne verticaux. Le mot « Ressources » du gabarit n'a pas ete corrige (texte du gabarit).

## Corrige apres critique visuelle (au moins 2 passes par composant)

- Segmented Control : repere 5 (rayon) superpose a la pastille, repere 1 deplace sur le coin haut droit ; vignette « Selected » en doublon retiree ; groupe Position remplace par une seule vignette de 3 segments joints (First, Middle, Last) car les trois vignettes separees etaient quasi identiques ; lien Code raccourci (retour a la ligne) ; tags du header composant passes de « Draft » a Ready / In code ; blocs Do / Dont centres comme sur Button.
- Tab : le compteur Figma est hors des bornes de l'instance (absolute) : repere 3 recale a droite, reperes 3/4 passes au-dessus pour ne plus chevaucher l'indicateur ; logo du fil d'Ariane corrige (instance et non cadre `Logo`) ; Do / Dont avec Badge et Dropdown desactives par override d'instance.
- Pagination : reperes recales sur les vraies positions (Back, Next, points de suspension, pages) apres mesure ; layouts Full / Minimal / Select / Load more en vignettes.
- Stepper : recadrage de la copie de `Frame 1` (marge gauche vide), pastille « Completed check » : la variable `Static/Text/Main/Reversed` n'existe pas en Figma, remplacee par `Static/Text/Subtle/Primary` (blanc) avec mention explicite.

## Ecarts restants (repris dans les Notes de chaque cadre, rien de cache)

- Segmented Control : repos bleu (Figma) vs gris (code) ; hover/active non selectionne (fond blanc vs plaque bleu clair) ; disabled attenue deux fois ; gap icone 8 ou 10 vs 4 ; set encore nomme `Component 1`, pas de groupe, pas de Position Single ; mode tabs/radio, describedBy, disabled par option seulement en code ; pas de focus dans Figma ni dans le code.
- Tab : Bold du selectionne en Figma, Regular en code ; defauts Selected/Badge/Dropdown ; compteur 12 px absolu (Figma) vs pastille 16 px en ligne (code) ; changed, icon, fill, focus 3 px seulement en code, Mask et `.Options` Open seulement en Figma ; indicateur au survol, rayon, disabled double ; 3 fills blue/700 Foundation restants ; valeurs brutes dans le SCSS.
- Pagination : noms Classic / Infinite Scroll inverses par rapport au code, Select sans code ; page courante et ellipsis non distinctes en Figma ; gaps 24/16/8 vs 16 ; `<button>` natifs au lieu de `ds-link` ; disabled et focus absents de Figma (le code a maintenant un focus 2 px) ; textes « of » sans style, 23 fills bruts dans `.Options`.
- Stepper : aucun composant Figma, 4 maquettes horizontales vs code vertical, 7 statuts code vs 3 montres, cotes et connecteur differents, calques `Frame N`, faute « Aditionnal info », valeurs brutes dans le SCSS.
- Pages ZeroHeight `tab.md`, `pagination.md`, `stepper.md` : certaines lignes disent encore « aucun focus visible » alors que le code a maintenant `:focus-visible` (et `role` sur Stepper). Les cadres Figma suivent le code ; les `.md` sont a resynchroniser (non modifies ici).

Captures de controle : `C:/Users/JDAHAN/AppData/Local/Temp/doc-kit-C/` (hors repo).
