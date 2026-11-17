# Status page, Action library (Figma)

Fichier `xCeEJPn6fliEshuE9fnrqs`, page Status `602:1512`. Construit le 2026-11-16 avec `docs/figma/doc-kit/page-kit.js` (shell + section).

## Ids

| Nœud | Id |
|------|----|
| Section « Status » | `4047:242` (x -82, y -159, 2120 × 3319) |
| Cadre « Status - Action » | `4047:243` (1800 × 2999, 160 px de marge) |
| Tableau « Table » | `4047:328` (1 en-tête 48 px + 25 lignes 56 px) |
| Section « Status - To review » | `4047:2387` (y 3560, 400 px sous la nouvelle section) |
| Ancien « Frame 1 » (déplacé, intact) | `612:3765` |

Contenu : Hero (fil d'Ariane Qirin Components → Action → Status, étiquette STATUS, titre, description, carte « Data » : Updated 2026-11-16, Source components.json), Overview (5 cartes chiffres), Components (tableau 9 colonnes), Legend (5 cartes), bandeau de marque.
Statuts : vraies instances de Badge de la librairie Feedback (`importComponentSetByKeyAsync('990a9ef2…')`, la clé est celle du component set ; `importComponentByKeyAsync` échoue), Style Light, Size M, icône placeholder masquée (calque `Icon Functional` invisible), texte du Label remplacé. 139 instances.
Variables : tout est lié à `Tokens / Semantic`, aucune variable manquante, aucun token, collection ni mode créé.

## Chiffres (calculés depuis components.json)

- 25 composants : 20 Action (`figma.fileKey = xCeEJPn6fliEshuE9fnrqs`) + 5 Utility.
- Ready 19, Draft 5 (Flyout Menu Title, Keycap, Shortcut Keys, Shortcut Row, Keyboard Map), In review 1 (Flag).
- ZeroHeight : 18 pages créées (pageId renseigné), toutes `hidden`, 0 publiée. 2 `drafted` sans page (Button Range Group, Flyout Menu Title). 5 Utility sans documentation.
- Storybook : 20 stories (vibecodedUrl). Absents : Flyout Menu Title et les 4 Keycap / Shortcut / Keyboard Map.
- Code : 25 vibecoded, 0 dev.

Règles d'affichage : Design = `availability.design` ; Code = Dev si `dev`, sinon Vibecoded ; ZeroHeight = Published / Hidden si pageId, Drafted si `drafted` sans page, sinon None.

## Composants absents du JSON

Aucun : les 5 composants Utility (Keycap, Shortcut Keys, Shortcut Row, Keyboard Map, Flag) sont dans le JSON, mais sans `figma` ni `figmaLibrary` (catégorie `other`).

## Écarts

1. Utility : le JSON dit `availability.design = false` et `figma.nodeId = null`, alors que les 5 composants existent sur la page Utility `950:2` (Keycap `950:24`, Shortcut Keys `950:64`, Shortcut Row `951:110`, Keyboard Map `951:150`, Flag `952:165`). Le tableau affiche la valeur du JSON (Design « None ») mais les noms portent un lien vers ces nœuds. À corriger dans components.json (via sync-status).
2. Stepper : `figma.nodeId = null` (le composant est en WIP, page `312:1332`). Seul nom sans lien.
3. Button Range Group partage le nœud de Button Range (`720:445`), Flyout Menu Title celui de Flyout Menu (`507:833`) : les liens pointent vers le composant parent.
4. Segmented Control : le component set `302:2197` s'appelle « Component 1 » dans Figma.
5. ZeroHeight : seul Button a une `url` dans le JSON, les 17 autres pages n'ont que `pageId`. Pas de lien ZeroHeight dans le tableau.
6. Composant `.Row` (`612:3150`) : il n'est plus sur la page (parent nul, nœud hors arbre), ses 15 instances sont toutes dans Frame 1. Rien à déplacer ; il reste à l'état actuel.
7. Kit : la ligne `return` de `pageKit()` a été étendue dans l'appel (T, AL, B, pad, rad, card, sp) pour construire cartes, tableau et légende. Le fichier page-kit.js n'est pas modifié.

## Vérifications

Deux passes de capture : la première montrait l'icône placeholder des badges et un texte coupé dans la légende Code (« Angular prototype code » devenu « Prototype code ») ; corrigé. Hauteurs de ligne uniformes (48 / 56), aucun texte sur deux lignes, aucun chevauchement entre sections de la page.
