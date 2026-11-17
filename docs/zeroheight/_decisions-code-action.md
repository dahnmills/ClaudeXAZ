# Décisions Action appliquées au code (16 nov. 2026)

Le code s'aligne sur Figma pour Button et Button Range. Pour Segmented Control, Tab, Pagination, Stepper et les noms Flyout, c'est Figma qui suit : aucun changement de code, seule la doc consigne la décision. Rien n'a été commité.

## Code modifié

| Fichier | Changement | Token |
|---|---|---|
| `src/app/shared/ui/button/button.component.scss` | libellé Regular (400) vers SemiBold (600), commentaire d'en-tête mis à jour | `--semantic-font-text-style-font-weight-semi-bold` (alias `--foundation-font-weight-semi-bold`, 600) |
| `src/app/shared/ui/button-range/button-range.component.scss` | texte du Between : blanc vers `Text/Strong/Alt`, graisse bold conservée | `--semantic-color-interactive-text-strong-alt-default` (alias `--foundation-color-grey-900`, #121212) |
| `src/app/pages/release-notes/release-notes.data.ts` | entrée `action-buttons-figma-2026-11-16` (catégorie design) ajoutée en tête, prête pour le hook pre-push | sans objet |

Le correctif de padding déjà présent dans `button-range.component.scss` (`spacing-xxs`) est conservé.

Point à connaître : `Text/Strong/Alt` n'est pas une couleur de marque. Dans `_semantic.scss` comme dans Figma, il vaut Grey/900, la même couleur que le texte du Default. L'audit (R1) le qualifiait de « couleur de marque » à tort. J'ai appliqué le token Figma tel quel. Le texte du Between ne change pas de couleur au survol ni à l'activation, comme pour le Default.

## Contraste du Between (WCAG 2.x)

| Fond Between | Texte Grey/900 (nouveau) | Texte blanc (ancien) |
|---|---|---|
| repos `blue-a-200` #86cff4 | 10,92:1 | 1,71:1 |
| survol `blue-a-300` #55c0f6 | 9,15:1 | 2,05:1 |
| actif `blue-a-400` #008ed6 | 5,21:1 | 3,60:1 |

AA passe dans les trois états (4,5:1 requis). L'ancien rendu échouait partout.

## Effet de cascade du SemiBold

Mesuré dans Edge (playwright-core), page Reject Management : chaque bouton prend 1 à 2 px de large (Filter 69 vers 70, Manage columns 178 vers 179, Save my filters 134 vers 136), la hauteur reste 32 px (24 px en Plain). Balayage de 12 écrans (home, search, search-v2, tag-configuration, portfolio-management, reject-management, admin-data, buyer-summary, manual-underwriting, coverbook, filters, modal) : aucun `ds-button` ne déborde ni ne passe sur deux lignes.

## Documentation

- `docs/zeroheight/action/button.md` : libellé Body L semi-bold, ligne de token font-weight, section « Design decisions ».
- `docs/zeroheight/action/button-range.md` : anatomie, tokens séparés Selected et Between, contraste chiffré à la place de l'avertissement, section « Design decisions ».
- `docs/zeroheight/action/segmented-control.md`, `tab.md`, `pagination.md`, `stepper.md` : section « Design decisions » (Figma suit le code ; Stepper reste vertical, horizontal plus tard). Dans `pagination.md`, j'ai aussi retiré une contradiction laissée par la passe précédente (deux lignes Focus opposées, ligne Disabled perdue, phrase « no visible focus style »).
- `docs/zeroheight/action/flyout-menu.md`, `flyout-menu-item.md` : noms Flyout Menu, Flyout Menu Item, Flyout Menu Section ; le changelog garde le nom historique `Flyout Item`.
- `docs/components-status/scripts/build-components.js` : noms affichés de `ds-flyout`, `ds-flyout-item`, `ds-flyout-section` passés à Flyout Menu, Flyout Menu Item, Flyout Menu Section ; commentaire et ligne `name-differs` de `flyout-menu-item` mis à jour. `extract-code.js` puis `build-components.js` relancés : `components.json` régénéré (75 mismatches).

À noter : le tableau de statut affiche maintenant deux lignes « Flyout Menu » et deux lignes « Flyout Menu Item » (les composants `ds-flyout-menu*` et la base `ds-flyout*`), distinguées par leur sélecteur. Le composant `ds-flyout-menu-title` garde le nom « Flyout Menu Title ».

## Vérification

- `npx ng build --configuration production` : OK, initial total 1,91 Mo (sous le budget de 2 Mo). Avertissements préexistants seulement (budgets SCSS de buyer-summary et card-builder-lab, html2canvas non ESM).
- Tests unitaires : aucun fichier `.spec.ts` pour Button ni Button Range, rien à lancer.
- Captures (Edge, 1280 x 800, serveur `ng serve --port 4450`, Storybook local absent), dans `%TEMP%\decisions-action\` :
  - `before-button-range-group.png`, `after-button-range-group.png` (catalogue `/design-system-components`, plage 2 à 5 : 3 et 4 passent de blanc à Grey/900)
  - `before-reject-management.png`, `after-reject-management.png`
  - `before-search.png`, `after-search.png`
- Le module playwright-core de `%TEMP%\figma-ref` était vide (dossiers sans fichiers) : réinstallé au même endroit, hors du dépôt.
