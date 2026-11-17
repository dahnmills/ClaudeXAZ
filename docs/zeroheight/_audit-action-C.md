# Audit Action C : segmented-control, tab, stepper, pagination

Verification en lecture seule du code, des stories et de components.json. Seuls les .md de action/ ont été modifiés. Tous les tokens cités existent dans `_semantic.scss`. Aucun tiret cadratin. Ids de story cohérents avec les titres (`--playground`, `--default`) et avec `components.json`.

## segmented-control : OK
Inputs, mode tabs/radio, rôles ARIA, tokens et valeurs en dur (border 1px) conformes au code. Aucun écart.

## tab
Corrigés :
- Contre-valeur en dur non documentée : opacité 0.35 de l'indicateur au survol d'un onglet non sélectionné (ajoutée).
- a11y : `aria-label="changed"` du point de changement (ajouté).
- Output `clicked` : la doc disait "jamais quand disabled", or seul le CSS (`pointer-events: none`) bloque le clic (reformulé).
À décider :
- Bug code dans `tab.component.ts` : le host `(click)` est `!disabled() && selected.set ? null : clicked.emit()`. `selected.set` n'existe pas sur un input signal, donc le clic émet toujours (même disabled en appel programmatique, et sur l'onglet déjà sélectionné). À corriger dans le code si voulu.
- Pas de navigation aux flèches ni `aria-controls` dans l'atome (déjà documenté comme rôle du parent).
- Valeurs en dur dans le SCSS (badge 16px, 12px, 9999px, 4px) déjà listées, pas de token équivalent.

## stepper
Corrigés :
- `navigableUpTo` : les étapes completed, current, error, warning sont cliquables quel que soit l'index (ajouté).
- Tokens manquants : couleur du libellé upcoming, libellé cliquable au survol, texte de statut "Completed" (`--semantic-color-static-background-functional-positive`, utilisé comme couleur de texte alors qu'un token `static-text-main-functional-positive` existe).
À décider :
- Code : remplacer le token background par `--semantic-color-static-text-main-functional-positive` pour le statut Completed.
- a11y du code : étapes en `div` cliquables sans rôle ni clavier (documenté, mais bloquant WCAG AA).
- components.json donne `state: ready` alors que la doc dit Design WIP ; catégorie `navigation` (json, Storybook) contre dossier `action` (docs) : à harmoniser.
- Lignes 16px/24px et min-height 56/70px en dur (listées).

## pagination
Corrigés :
- Survol : soulignement non documenté (ajouté).
- Page courante non cliquable (`pointer-events: none`) (ajouté).
À décider :
- Boutons natifs au lieu de `ds-button`/`ds-link` (déjà dans le commentaire json), pas de style focus-visible, boutons de page sans `aria-label` explicite ("Page 3").
- components.json `usedBy: 0` alors que `design-system-components` l'affiche (page de démo, probablement voulu).
