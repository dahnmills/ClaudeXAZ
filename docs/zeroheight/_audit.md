# Audit relevé pendant la rédaction de la doc (2026-11-04)

Constats des agents qui ont croisé Figma, le code (`shared/ui`) et les tokens. Rien n'a été corrigé : c'est une liste à arbitrer.

## Bugs de code (rendu cassé)

| Composant | Problème |
|-----------|----------|
| Checkbox Card | `--semantic-color-interactive-background-main-default` n'existe pas : bordure sélectionnée et case cochée sans couleur |
| Button Range | `--semantic-measurement-spacing-2xs` n'existe pas (padding) |
| Visual Button | `--semantic-color-static-background-subtle-informative` n'existe pas (état sélectionné) |
| Functional Notice, Popover | `icon="close"` passé à `ds-button-icon`, qui n'a pas d'input `icon` : bouton fermer sans glyphe |
| Confirm Dialog | `role="alertdialog"` posé deux fois |

## Accessibilité

- Pas de `:focus-visible` : Checkbox Card, Select Button, Button Range, Pagination, Segmented Control, Tile.
- Clavier : Stepper (div cliquables sans rôle), Popover (pas de rôle, pas de focus, pas d'Escape), Tooltip (pas d'`aria-describedby`, pas d'Escape), Radio / Radio Card (pas de navigation aux flèches).
- Attributs manquants : `aria-expanded` sur Button Split et sur Toggle details de la Horizontal Card, `aria-controls` sur Accordion, nom accessible sur la Search Bar, Progress Bar, Chart, copie de l'Identifier, `ariaLabel` absent sur `ds-toggle`, erreur des champs non reliée par `aria-describedby`.
- Contraste : Grade `nc` (texte blanc sur grey-300).

## Règle de composition non respectée

`<button>` natif dans Pagination, Segmented Control, Input Search (clear), Topbox ; « × » en texte dans Chip ; checkbox / radio redessinés dans Checkbox Card et Radio Card ; pastille de grade redessinée dans Topbox.

## Valeurs en dur

Toggle (tailles, rayon 14 px), Checkbox (couleurs en TS), Icon Tile (rayon 5 px), Progress Bar, Chart, Side Navigation (largeurs), Modal (px et rgba), Toaster (largeur), Tooltip (ombre), bordures et anneaux de focus en 1 / 3 px un peu partout. `--semantic-color-overlay-backdrop` est une valeur rgba brute, pas un alias Foundation.

## Figma à ranger

- Link : les deux sets actuels (688:4202, 689:4239) ne sont pas publiés, seul `[DEPRECATED] Link` l'est, et Crumb utilise 688:4202.
- Noms par défaut : Spinner `Property 1`, Segmented Control `Component 1`, Dropdown variante `Property 3`.
- Textes copiés : set de la page Input Search nommé « Input Date », fil d'Ariane d'Input Email « Input Text », description d'Inline Edit = Checkbox, en-tête de Link « Flyout Menu ».
- Statuts incohérents : en-têtes « Draft / Not started » alors que la page Status ou le code disent Done.
- Changelogs vides presque partout (gabarit « v.X.X.X »).
- Tokens : typo `Subtle/Fuctional`, `Body/S/Semi Bold` relié à la mauvaise variable de line-height, pas de style d'ombre dans Tokens.
- Fichier Layout introuvable par les agents (clé à fournir) : pages Layout à compléter.

## Écarts Figma ↔ code notables (à trancher, pas des erreurs en soi)

Button sans ton Negative en Figma ; Badge `Style` = code `variant` ; Toaster action Button (Figma) vs Link (code) ; Dropdown un composant en Figma, deux en code (`ds-select`, `ds-multi-select`) ; Helper Text à 4 statuts en Figma, erreur seule en code ; Timeline et Pagination « infinite » modélisés différemment ; valeurs par défaut inversées (Side Navigation Open, Topbox data type, Modal size, positions Tooltip / Popover).
