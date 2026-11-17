# Audit Action A (button, button-icon, button-split, button-load-more, button-range)

Verification 2026-11-06, lecture du code, des stories et de components.json.

## button : corrige
- Etat Loading : le code passe aussi `disabled`, `aria-disabled` et `tabindex=-1` (via `isInactive`). Tableau States et section Accessibility corriges.
- Reste OK : inputs, defauts, tokens (tous existent), story id `design-system-action-button--primary`.

## button-icon : OK
Inputs, defauts, tokens, `ariaLabel` requis, story id `design-system-action-button-icon--default` verifies.

## button-split : corrige
- Loading : `onToggle` ignore aussi le clic du chevron pendant le chargement (chevron non grise). Ligne States corrigee.
- A decider : `aria-expanded` / `aria-haspopup` absents sur le chevron (deja documente et deja dans components.json). Correction de code, pas de doc.
- Story id `design-system-action-button-split--default` OK.

## button-load-more : OK
Pas de composant propre (recette `ds-button` secondary + accent + fullWidth). Story `LoadMore` (nom "Load More (full width)") id `design-system-action-button--load-more` OK. Maillage index.md et pagination.md OK. components.json : `selector: null`, coherent.

## button-range : OK
- Le token `--semantic-measurement-spacing-2xs` (padding horizontal) n'existe pas dans `_semantic.scss` : deja signale dans la doc et dans components.json. A decider : le definir ou le retirer du SCSS (code).
- Pas de style focus-visible et pas de `aria-pressed` : deja documente.
- Les stories `Button Range` et `Button Range Group` ont des ids coherents avec la doc.
- Les stories utilisent des `style=""` inline (AllStates, Sizes) : hors perimetre doc, a noter cote code.

## Transverses
Aucun tiret cadratin dans les 5 pages. Aucune valeur en dur hors celles deja listees (1px, 3px, 2px, 4px, 200px). Le champ components.json pour button-range-group pointe vers button-range.md (voulu).
