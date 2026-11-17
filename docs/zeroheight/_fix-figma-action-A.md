# Corrections Figma Action (lot A), non cassantes

Fichier `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`), 2026-11-06. Aucune variable, collection ni mode creee. Aucun renommage, aucune suppression, aucune publication.

## 1. Corrige

| Composant | Bindings poses | Description |
|---|---|---|
| Button (`44:558`) | 300 : padding 16 vers Spacing/M, gap 8 vers Spacing/S (rayons voir "differe") ; 72 traits `Border Focus` : Foundation `action/blue/450` remplace par Semantic `Color/Interactive/Border/Focus` (meme valeur resolue) | oui |
| Button Icon (`12:145`) | 576 : padding 8 vers Spacing/S, gap 8 vers Spacing/S ; 192 traits `Border Focus` remplaces par Semantic Border/Focus | oui |
| Button Split (`69:1883`) | 0 (ses valeurs viennent des instances Button et Button Icon, donc cascade) | oui |
| Button Load More (`53:8445`) | 30 : rayon 4 vers Radius/S, padding 16/4/8 vers Spacing/M, XS, S, gap 8 vers Spacing/S | oui |
| Button Range (`720:445`) | 36 : rayon 4 vers Radius/S, padding 2 vers Spacing/XXS | oui |
| `.Content` (`168:1274`), `.Icon Functional` (`12:498`) | 0 | oui |

## 2. Differe (decision ou risque de casse)

- Rayons de Button et Button Icon: la liaison a Radius/S a ete posee puis ANNULEE. Elle remettait a 4 les coins joints (0 en override) des instances de Button Split (rendu change). Les valeurs restent 4 en dur. A traiter avec la refonte du Split (S4 de l'audit) ou en la liant a une variante dediee.
- Rayon 9 du cadre `Border Focus` (Button, Button Icon) et gap 10 de Button Range: aucun Semantic de meme valeur, rien change.
- Graisse SemiBold/Regular (T5), ton Negative (B1), `fullWidth` (B5), renommage Pressed vers Active (T6), booleen `Focus` (T7), spinner en instance (T8), sous-composants Load More (L1 a L3), Split S1 a S7, Range R1/R4/R6/R7, double attenuation Disabled (B11), jeu `[Deprecated] Button`: decisions visibles ou renommages, non touches.
- Fills Reversed Foundation et glyphes d'icone (T4): non retrouves en Foundation direct dans les variantes (seul le trait de focus l'etait); aucun changement.
- Calques internes anonymes (`Group 1`, `Ellipse 1`): non renommes (variante Loading, risque d'override).
- Nombre d'instances par rapport a l'etat initial: non compte avant, mais rien n'a ete supprime ni detache.

## 3. Verification

- Signature de geometrie (position, taille, opacite, paddings, gaps, rayons, fills, strokes) avant/apres sur les 5 sets: 0 difference.
- Captures get_screenshot avant/apres, comparees par md5: Button Range identique; Button Split avait change apres liaison des rayons (cause trouvee), puis identique octet pour octet apres l'annulation.
- Instances (getInstancesAsync, ce fichier): Button 28, Button Icon 12, Split 4, `.Content` 123, Load More 0, Range 0.
- Limite: les maquettes d'autres fichiers ne sont pas controlees; elles ne bougent qu'a la publication de la librairie (non faite).
