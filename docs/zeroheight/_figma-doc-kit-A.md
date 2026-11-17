# Doc kit Figma, lot A (Button Icon, Button Split, Button Load More, Button Range)

Fichier `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`), 2026-11-06. Kit : `docs/figma/doc-kit/doc-kit.js`, reference de qualite : Button (`971:1014`). Aucun composant, variante, propriete, token ni section `ZeroHeight · ... illustrations` modifie. Rien publie. Captures de controle dans `C:/Users/JDAHAN/AppData/Local/Temp/doc-kit-A/` (hors repo).

## Cadres construits (buildDoc, `miss` vide pour les 4)

| Composant | Page | Cadre `Documentation · <Nom>` | Position | Ancien cadre plat supprime |
|---|---|---|---|---|
| Button Icon | `12:118` | `977:3293` (1280 x 3439) | x 3068, y -3788 | `960:2106` |
| Button Split | `69:447` | `981:4868` (1280 x 2783) | x -683, y -892 | `960:4151` |
| Button Load More | `53:8307` | `981:5764` (1280 x 2502) | x 2615, y -703 | `960:5359` |
| Button Range | `720:437` | `981:6955` (1280 x 3039) | x 5388, y -646 | `960:6459` |

Chaque nouveau cadre a ete construit a droite (>= 560 px), valide par capture, puis l'ancien a ete supprime et le nouveau place a sa position exacte. Ecart au cadre voisin : 560 px sur les 4 pages. Les instances montrees sont de vrais `createInstance()` de COMPONENT de variante.

## Gabarits remplis (autorise)

| Composant | `_Design system header` (composant) | `_Design system header` (documentation) | `Versionning` |
|---|---|---|---|
| Button Icon | `235:1151` | `235:1303` | `235:1346` |
| Button Split | `96:1337` | `96:1391` | `96:1434` |
| Button Load More | `53:8308` | `53:8346` | `53:8389` |
| Button Range | `720:472` | `720:526` | `720:569` |

Contenu : description, version 1.0.0 (components.json, la valeur 2.0.0 du gabarit Button Icon est corrigee), fil d'Ariane, tags Design = Ready et Tech = In code (Success), Tech de Load More = `Via Button` (Info, pas de composant de code propre), liens ZeroHeight et Storybook cliquables, description et legendes Do / Dont avec exemples clones depuis les sections illustrations (Button Icon `944:3971`/`944:4006`, Split `944:4635` pour le Dont, Load More `944:5200`/`944:5238`, Range `944:5453`/`944:5498`), changelog (tag Ready, version, date lastChange de components.json : 2026-09-08, Range 2026-05-27, entree Added et Documented 2026-11-06).

Sur Button Split le cadre Do du gabarit contenait deja des exemples dessines (quatre Button Split avec menus) : conserves, mon clone en double a ete retire. Seul le cadre Dont recoit `983:2408`.

## Ecarts Figma / code / ZeroHeight repris dans Notes (jamais caches)

- Button Icon : `Pressed` (Figma) contre `:active` (code) ; taille M (40) et Plain S (16) en `--foundation-spacing-*` direct dans le SCSS ; rayon Plain 4 contre 0 ; description du set dit « S 24 » alors que S fait 32 ; rayons 4 et 9 (anneau) non lies ; trait Primary lie a un token Background/Main (audit I1).
- Button Split : types Primary/Secondary seulement dans Figma ; Tone, Reversed, Disabled, Loading seulement via les instances ; menu non dessine dans `Open=True` ; jonction (rayons internes) ; tokens du Secondary du toggle differents ; toggle ignore le clic pendant `loading` sans etre dessine desactive ; 200 px, 4 px et 1 px en dur dans le SCSS. `aria-expanded` est present dans le code (corrige depuis la note de components.json).
- Button Load More : pas de composant de code (`selector` null, recette `ds-button` secondary accent fullWidth) ; cadre redessine a la main (bordure 2 px, fills Neutral) contre Button Secondary Accent (1 px) ; largeur 156 fixe contre 100 % ; deux frames Loading contre un etat ; libelle `Load more results` contre `Load more` ; pas de variante Focus ; cadre interne nomme `Button`.
- Button Range : pas de focus (Figma et SCSS) ; texte Between sombre dans Figma, blanc gras dans le code ; blanc sur blue-a-200 a faible contraste ; groupe sans composant Figma, sans `aria-pressed` ; graisse Default heritee ; calque texte nomme `1` ; Disabled = opacite + fills dans Figma, opacite seule dans le code.
- Divergence ZeroHeight : `button-range.md` annonce `Design WIP`, components.json dit `ready` (statut Design Ready utilise, source unique). A arbitrer.
- Divergence components.json : l'entree `button-range` mentionne `spacing-2xs` inexistant, le SCSS utilise maintenant `spacing-xxs` (la doc et le cadre Figma disent `xxs`).

## Corrige apres critique (au moins 2 passes par composant)

- Button Icon : description du bandeau a 2 lignes avec un mot orphelin, raccourcie ; ligne de tokens « Size S and Plain M » avec une seule pastille 32, scindee en deux lignes (32 et 24) avec zebrage recalcule ; Resources du gabarit : label « Storybook : » coupe en « Storyb / ook », rendu sur une ligne.
- Button Split : repere 3 (Chevron) pose a cote du chevron, deplace sur l'icone.
- Button Load More : Resources du gabarit cassees (label coupe lettre par lettre, bloc qui debordait), corrigees (bloc aligne a droite, largeur au contenu).
- Button Range : l'instance d'anatomie (Default) etait invisible sur le fond gris, remplacee par Selected ; tuiles du statut Default passees sur fond blanc pour voir la plaque ; note Between reformulee apres lecture du rendu (texte sombre, pas la couleur de marque).
- Les 4 changelogs : texte « Added » qui ne revenait pas a la ligne (deborde de la carte), passe en hauteur auto avec largeur Fill ; premiere ecriture decalee d'une ligne (le titre Changelog avait ete ecrase), reparee.

## Limites

- Les largeurs de colonnes viennent du kit (nombres de mise en page, pas de variables).
- Les exemples Do / Dont sont des clones des illustrations ZeroHeight : ils ne suivent pas une modification ulterieure de ces illustrations.
- Le kit n'a pas ete modifie ; les corrections ci-dessus sont des retouches des cadres produits.
