# Documentation Figma Action (lot A)

Fichier `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`), 2026-11-06. Ajouts uniquement: un cadre `Documentation · <Nom>` (1280 px, auto-layout) par page, place a droite du dernier element de la page (x = bord droit max + 560 px, y = haut de la page). Aucun cadre, composant, variante ou section existant modifie. Aucune variable creee, aucune publication. Tout est lie aux variables et styles de texte existants (Spacing, Radius, Border/Size, Color/Static/*, Title, Body). Les composants montres sont de vraies instances des sets de la page.

## Contenu de chaque cadre
En-tete (nom, statut, description, liens code, Storybook, ZeroHeight en draft), Anatomy (instance + liste numerotee courte), Properties Figma/Angular, States and variants (instances), Tokens (variable Figma + custom property CSS), Notes (ecarts connus), Usage and accessibility (3 lignes).

## Par composant
| Composant | Page | Cadre ajoute | Existait deja | Instances montrees |
|---|---|---|---|---|
| Button | `44:554` | `959:860` | 2 cadres `_Design system header` (`230:2132`, `230:2186`), `Versionning` (`230:2229`), section ZeroHeight illustrations (`930:1069`), tous avec texte modele non rempli | 10 |
| Button Icon | `12:118` | `960:2106` | idem (`235:1151`, `235:1303`, `235:1346`, `944:3970`) | 10 |
| Button Split | `69:447` | `960:4151` | idem, modele non rempli | 4 |
| Button Load More | `53:8307` | `960:5359` | idem, modele non rempli (le titre du second cadre dit deja "Button Load More" sur la page Button: voir ecarts) | 5 |
| Button Range | `720:437` | `960:6459` | idem, modele non rempli | 8 |

Verification: capture de chaque cadre, aucun debordement, aucun chevauchement, texte lisible. Etat Focus de Button Icon montre via le booleen `Focus`.

## Ecarts restants
- Les cadres modeles existants (description "Component description", statuts Draft/Draft, liens `qirin.zeroheight.com/tag`, changelog `v.X.X.X`) n'ont pas ete remplis: la regle du lot interdit de modifier l'existant. Le second cadre `_Design system header` de la page Button (`230:2186`) affiche "Button Load More" dans son fil d'Ariane: erreur de copie a corriger. A faire en un tour dedie si l'utilisateur l'autorise.
- Les notes de chaque cadre reprennent les ecarts de `_audit-figma-action-A.md` encore ouverts (graisse SemiBold/regular, Negative et fullWidth code seul, Loading sans instance Spinner, booleen Focus absent sur Button et Range, Pressed/Active, rayons non lies, Split: types, nommage Right, jonction, menu non dessine, Load More: bouton redessine et largeur 156, Range: texte Between, groupe sans equivalent Figma).
- Constat nouveau: la description du set Button Icon dit "S 24" alors que les variantes S font 32 px.
- Tokens: les noms Figma (Main, Reversed, Strong/Positive) ne se superposent pas toujours aux noms CSS (strong, muted). Le tableau Tokens donne les deux colonnes sans pretendre a un mapping 1 pour 1 la ou le doute existe (Secondary: bordure Muted cote Figma, strong cote code).
- Annotations natives Figma non posees: l'anatomie est une liste numerotee a cote de l'instance (pas de callouts sur des noeuds).
- Pages ZeroHeight toujours masquees: statut "draft" indique.
