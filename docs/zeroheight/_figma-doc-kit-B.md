# Figma doc kit, lot B : Link, Crumb, Breadcrumb, Chip, Tag

Date : 2026-11-06. Fichier `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`). Kit : `docs/figma/doc-kit/doc-kit.js` (reference : Button, cadre 971:1014). Captures de controle : `C:/Users/JDAHAN/AppData/Local/Temp/doc-kit-B/` (hors repo). Aucun composant, variante, propriete ni section `ZeroHeight · ... illustrations` modifie. Aucun token cree, rien de publie. `miss` vide pour les 5 cadres (Link, Tag : retour direct ; Crumb, Breadcrumb, Chip : reponse perdue par le transport, variables verifiees apres coup, 0 manquante).

## Cadres Documentation (kit)

| Composant | Page | Cadre | Position (x, y) | Taille | Ancien cadre supprime |
|---|---|---|---|---|---|
| Link | Link 77:256 | 976:1359 | -136, 2932 | 1280 x 3070 | 960:3553 |
| Crumb | Breadcrumb 298:4382 | 981:7961 | 0, 3732 | 1280 x 2280 | 960:6154 |
| Breadcrumb | Breadcrumb 298:4382 | 981:8272 | 0, 6572 | 1280 x 2305 | 961:215 |
| Chip | Chip 456:152 | 983:4065 | 0, 2981 | 1280 x 3103 | 961:2497 |
| Tag | Tag 101:2 | 985:2037 | 0, 3695 | 1280 x 3093 | 962:238 |

Les anciens cadres n'ont ete supprimes qu'apres validation visuelle du nouveau. Chaque nouveau cadre est a plus de 560 px des elements annotes (sections ZeroHeight, gabarits) et ne chevauche rien.

## Gabarits remplis

| Page | `_Design system header` (composant) | `_Design system header` (documentation) | `Versionning` |
|---|---|---|---|
| Link | 235:3074 (nom, version 1.0.0, description, tags Ready / In code) | 235:3165 (fil d'Ariane, version, description, liens ZeroHeight et Storybook, regle et exemples Do / Dont avec instances Link) | 235:3208 (Ready, v1.0.0, 8 septembre 2026) |
| Breadcrumb (+ Crumb) | 298:4383 | 298:4457 (usage, regle, exemples Do / Dont avec instances Crumb) | 298:4437 (v1.0.0, 2 juin 2026) |
| Chip | 456:153 | 456:289 (exemples Do / Dont avec instances Chip) | 456:332 (v1.0.0, 21 octobre 2026) |
| Tag | 230:1756 | 230:1849 (exemples Do / Dont avec instances Tag) | 230:1892 (v1.0.0, 8 septembre 2026) |

Versions et statuts viennent de `components.json` (tous 1.0.0, design Ready, tech In code, ZeroHeight Draft hidden). Liens : Storybook `dahnmills.github.io/ClaudeXAZ/storybook`, ZeroHeight pages masquees (Link 52632d, Crumb 0405bc, Breadcrumb 80837a, Chip 030ec1, Tag 4114ba). La page Breadcrumb n'a qu'un jeu de gabarits pour deux composants : il est rempli au nom de Breadcrumb, le changelog et la description citent Crumb.

## Ecarts Figma / code laisses visibles (cadre Notes de chaque doc)

- Link : defaut Font Weight (Semi-Bold Figma, regular code), ton Accent (Figma) = neutral (code) avec tokens Static / Interactive melanges, Icon en variante (288 variantes), gap lie en Figma et `--foundation-spacing-4` en code, focus sans token, sets annexes dont `[DEPRECATED] Link` (seul publie).
- Crumb : Disabled absent de Figma, Breadcrumb Figma n'utilise pas Crumb, Crumb dans le cadre de header, commentaire scss cite le noeud inexistant 1709:14619.
- Breadcrumb : 7 Link fixes, pas de slot ni de zone d'actions, nom pluriel du selecteur, `Breadcrumbs - Topbox` non verifie.
- Chip : Type (static, filter, select) et icones seulement en code, rayon 10000 non lie (Round = 100), texte sans style, hover / active inverses volontairement copies par le code, pas de Focus, mise en page verticale. Note : la croix du filtre est desormais un `ds-icon` dans le code (working tree), `components.json` (commentaire) est donc perime.
- Tag : defaut Filter (Figma) contre select (code), Static non instance de `.Options`, trois `.Options` homonymes, Dropdown absent du code, fills bruts (#F1F9FA, #008ED6), focus sans token, `role=button` sur tous les types dont static.

## Corrige apres critique

- Link : ancrage trop petit (instance x5/3 plus grande), marqueur 1 qui visait du vide (repositionne sur le bord bas du conteneur) ; Do / Dont vides remplis avec des instances Link ; changelog tronque raccourci.
- Breadcrumb : marqueur 3 du separateur qui tombait sur le "C" suivant (recale sur le chevron) ; libelle "Storybook :" du gabarit qui passait sur 3 lignes (largeur HUG).
- Chip : marqueur 2 dont la pastille mordait le contour (remonte) ; titre "Documentation" ecrase par erreur puis restaure ; anneau de focus a rayon Round au lieu de S.
- Tag : libelle "000" du composant remplace par "Label" dans les instances de la doc ; anneau de focus redimensionne apres changement de largeur.

## Points restants

- Les exemples Do / Dont ne sont pas des cadres de la section `ZeroHeight · ... illustrations` (non touchees).
- Le fond de la 2e boite du gabarit Chip (emplacement Atoms) reste vide : c'est le gabarit d'origine.
- Tailles de colonnes du kit (150, 330, 250, 390, 420) : nombres de mise en page sans variable, comme sur Button.
