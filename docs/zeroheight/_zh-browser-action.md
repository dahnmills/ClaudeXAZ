# ZeroHeight, librairie Action : validation dans le navigateur (2026-11-16)

Relecture page par page dans l'éditeur (Playwright, styleguide 138794). Pages laissées masquées, rien publié.
Patron de référence : Button (4 onglets Overview, Usage, Specs, Code and accessibility ; règles Do/Don't toutes illustrées).

Consigne élargie (alignement complet sur le patron, suppression/remplacement de blocs) : BLOQUÉE. Les deux tentatives de restructuration (réécriture du contenu d'un onglet, puis suppression de l'encadré de statut de Button Icon) ont été refusées par le contrôle de permissions de Claude Code ("Modify Shared Resources"), la consigne étant arrivée par l'agent coordinateur et non par l'utilisateur. Aucun bloc n'a été supprimé. Il faut une autorisation directe de l'utilisateur (ou une règle de permission) pour reprendre ce volet. La suite de la relecture reste sur le périmètre initial (lecture, captures, liens et corrections de texte sûres). Captures d'origine : `.playwright-mcp/orig/` et `.playwright-mcp/shot-<slug>-<n>.jpg`.

| # | Page | Onglets | Règles avec / sans image | Corrections faites | État |
|---|------|---------|--------------------------|--------------------|------|
| 1 | Button | 4/4 | 9 / 0 | aucune | Prête à démasquer |
| 2 | Button Icon | 4/4 | 4 / 2 | 5 liens internes (Related components) | À revoir |
| 3 | Button Split | 4/4 | 2 / 2 | aucune | À revoir |
| 4 | Button Load More | 4/4 | 4 / 0 | 1 lien interne (Pagination, Code) | Prête à démasquer |
| 5 | Button Range | 4/4 | 4 / 0 | 1 lien interne (Filter Drawer, Code) | Prête à démasquer (Design WIP) |
| 6 | Visual Button | 4/4 | 4 / 0 | aucune | À revoir (mineur) |
| 7 | Link | 4/4 | 6 / 0 | 3 liens internes (Code) | À revoir (mineur) |
| 8 | Crumb | 4/4 | 2 / 2 | 2 liens internes (Code) | À revoir |
| 9 | Breadcrumb | 4/4 | 6 / 0 | 4 liens internes (Usage, Code) | Prête à démasquer |
| 10 | Tab | 4/4 | 6 / 0 | 2 liens internes (Code) | Prête à démasquer |
| 11 | Segmented Control | 4/4 | 4 / 2 | aucune | À revoir |
| 12 | Tag | | | non relue (session ZeroHeight expirée) | À faire |
| 13 | Chip | | | non relue | À faire |
| 14 | Tile | | | non relue | À faire |
| 15 | Flyout Menu | | | non relue | À faire |
| 16 | Flyout Menu Item | | | non relue | À faire |
| 17 | Pagination | | | non relue | À faire |
| 18 | Stepper | | | non relue | À faire |
| 19 | Keycap | | | non relue | À faire |
| 20 | Shortcut Keys | | | non relue | À faire |
| 21 | Shortcut Row | | | non relue | À faire |
| 22 | Keyboard Map | | | non relue | À faire |
| 23 | Flag | | | non relue | À faire |

## Détail par page

### 1. Button (20fe33-button)
- Onglets : Overview, Usage, Specs, Code and accessibility. Introduction remplie, aucun placeholder, aucune image cassée, aucun tiret cadratin.
- Overview : 4 types illustrés, tableau "Pick the right component" avec 5 liens internes (Link, Button Icon, Button Split, Segmented Control, Tag), états illustrés.
- Usage : 4 groupes de règles, 9 règles illustrées avec description, sections Placement et Writing the label.
- Remarques mineures (non bloquantes) : le schéma d'anatomie porte 3 repères pour 4 éléments listés (Focus ring sans repère) ; aucun lien Storybook sur la page (le patron n'en a pas, donc pas exigé ailleurs).
- État : Prête à démasquer.

### 2. Button Icon (64532a-button-icon)
- Onglets : 4/4. Introduction remplie, aucune image cassée, aucun tiret cadratin, lien Storybook présent (story Default).
- Correction faite (vérifiée après rechargement) : Usage > Related components, "Button Split", "File Upload", "Search Bar Multi", "Shortcuts Panel", "Spotlight" transformés en liens internes. Les autres composants cités (Confirm Dialog, Date Range, Drawer, Modal, Popover, Table, etc.) n'ont pas encore de page.
- Points restants :
  - Règle "Unusual icons" (Do + Don't) sans image : le cadre Figma n'existe pas (Tooltip absent de la librairie Action, voir `_dodont-figma-A.md`).
  - Overview pas au format du patron Button : encadré "Status: Design Ready... Figma... Code..." en texte, titre "Overview" répété sous l'onglet Overview, pas de tableau "Pick the right component".
  - Specs : pas de schéma d'anatomie (Button en a un) ; tableaux Variants et Tokens très longs (copie du .md), lourds par rapport au patron.
  - Fil d'Ariane "Components / Button icon" (minuscule) alors que le titre est "Button Icon" : nom de navigation à harmoniser (non touché).
- État : À revoir.

### 3. Button Split (61a7c2-button-split)
- Onglets : 4/4. Introduction remplie (avec "Also searched as"), aucune image cassée, aucun tiret cadratin, lien Storybook présent, liens internes déjà en place (Button, Button Icon, Flyout Menu, Segmented Control). "Dropdown" reste en texte : la page n'existe pas encore.
- Overview au bon format (4 variantes illustrées, tableau "Pick the right component", tableau des états).
- Points restants :
  - Règle "Keep the main action as the most used one" (Do + Don't) sans image : pas de cadre Figma (règle jugée non dessinable, `_dodont-figma-A.md`).
  - Overview, dernier paragraphe : note interne "Visuals: the Figma component set (node 69:1883) is not returned by the ZeroHeight library listing..." visible par les lecteurs ; à supprimer (non supprimé : suppression de bloc).
  - Overview : "Status: Design Ready, Tech In code." écrit dans le paragraphe d'introduction (le patron ne l'a pas).
  - Specs : pas de schéma d'anatomie.
  - Fil d'Ariane "Button split" en minuscule.
- État : À revoir.

### 4. Button Load More (72f9cd-button-load-more)
- Onglets : 4/4. Introduction remplie, 5 états illustrés, tableau "Pick the right component", 4 règles illustrées et cohérentes, lien Storybook (story Load More), aucune image cassée, aucun tiret cadratin.
- Correction faite (vérifiée après rechargement) : Code and accessibility, "Used by Pagination" : "Pagination" transformé en lien interne.
- Remarques mineures (non bloquantes) : "Status: Design Ready, Tech In code (through ds-button)." dans le paragraphe d'Overview ; Specs sans schéma d'anatomie ; "Loading..." écrit avec trois points alors que Button recommande l'ellipse "…" (texte repris de Storybook, laissé) ; fil d'Ariane "Button load more" en minuscule.
- État : Prête à démasquer.

### 5. Button Range (948da2-button-range)
- Onglets : 4/4. Introduction remplie, 4 statuts illustrés, tableau "Pick the right component" (liens Tag, Segmented Control, Tab), 4 règles illustrées, deux liens Storybook (Range Group et Button Range), aucune image cassée, aucun tiret cadratin.
- Correction faite (vérifiée après rechargement) : Code and accessibility, "Used by Button Range Group and Filter Drawer" : "Filter Drawer" lié à sa page.
- Remarques : Design encore WIP (le dire à l'utilisateur avant de démasquer) ; l'accessibilité documente deux faiblesses réelles du composant (pas de focus visible, contraste du blanc sur Between) ; "Input Text", "Date Range", "Checkbox" en texte (pages absentes) ; Specs sans schéma d'anatomie ; "Status: Design WIP, Tech In code." dans le paragraphe d'Overview ; fil d'Ariane "Button range" en minuscule.
- État : Prête à démasquer (sous réserve du statut Design WIP).

### 6. Visual Button (828964-visual-button)
- Onglets : 4/4. Introduction remplie, 4 états illustrés, tableau "Pick the right component" (liens Button, Tile), 4 règles illustrées et lisibles, lien Storybook, aucune image cassée, aucun tiret cadratin.
- Corrections : aucune nécessaire côté liens ("Radio Card", "Checkbox Card" : pages absentes).
- Points restants : Overview, encadré "Status: ... The description text in the Figma header is a placeholder copied from Radio and is not used here." : note interne visible des lecteurs (présente aussi dans le .md, donc non retouchée) ; Specs sans schéma d'anatomie ; fil d'Ariane "Visual button" en minuscule.
- État : À revoir (mineur, une phrase interne à retirer).

### 7. Link (52632d-link)
- Onglets : 4/4. Introduction remplie, 5 états illustrés, tableau "Pick the right component" (liens Button, Button Icon, Breadcrumb, Tab), 3 groupes de règles avec titres h3 comme Button (6 règles illustrées), lien Storybook, aucune image cassée, aucun tiret cadratin.
- Correction faite (vérifiée après rechargement) : Code and accessibility, "Used by ..." : "Action Card", "Crumb", "Page Title" liés à leurs pages.
- Points restants :
  - Règle "External links", image Do : le lien "Company registry" porte l'icône par défaut (crayon Edit Pen) au lieu d'une icône de lien externe ; l'illustration contredit la règle. Cadre Figma à corriger puis image à resynchroniser.
  - Usage, "Use inline inside a sentence or a property value (see the policy)." : "(see the policy)" n'a pas de sens pour le lecteur (exemple interne), à reformuler.
  - Specs sans schéma d'anatomie.
- État : À revoir (mineur).

### 8. Crumb (0405bc-crumb)
- Onglets : 4/4. Introduction remplie, 2 variantes illustrées, tableau "Pick the right component" (liens Breadcrumb, Link, Stepper), lien Storybook, aucune image cassée, aucun tiret cadratin.
- Correction faite (vérifiée après rechargement) : Code and accessibility, "Composes Link ... Used by Breadcrumb" : "Link" et "Breadcrumb" liés.
- Points restants :
  - Règle "Route on the clicked output" (Do + Don't) sans image : règle de code, pas de cadre Figma ; à illustrer par un extrait de code ou à déplacer dans Code and accessibility.
  - Image Don't "Mark several crumbs as current" : rendu "Buyers > Acme Corp Policy", les deux libellés courants se collent et la faute n'est pas lisible.
  - Overview, état Disabled : "(the two stack, about 0.16 rendered; kept as is, to decide)" : note de travail visible des lecteurs.
  - "Status: Design Ready, Tech In code." dans le paragraphe d'Overview ; Specs sans schéma d'anatomie ; pas de groupes de règles titrés (h3) comme sur Button.
- État : À revoir.

### 9. Breadcrumb (80837a-breadcrumb)
- Onglets : 4/4. Introduction remplie, visuel du composant, tableau "Pick the right component" (liens Tab, Stepper), 6 règles illustrées et justes, lien Storybook, aucune image cassée, aucun tiret cadratin.
- Corrections faites (vérifiées après rechargement) : Usage, "use Page Title alone instead" : "Page Title" lié ; Code and accessibility, "Composes Crumb, Link, ... Button Icon" : les trois liés.
- Remarques mineures : "Side Nav" en texte (page absente) ; "Status: Design Ready, Tech In code." dans le paragraphe d'Overview ; règles sans titres de groupe (h3) contrairement à Button ; Specs sans schéma d'anatomie.
- État : Prête à démasquer.

### 10. Tab (99e610-tab)
- Onglets : 4/4. Introduction remplie, 4 variantes illustrées, tableau "Pick the right component" (liens Segmented Control, Stepper, Link, Tag, Chip), 3 groupes de règles titrés (Purpose, Width, Counter) comme Button, 6 règles illustrées, lien Storybook, aucune image cassée, aucun tiret cadratin.
- Correction faite (vérifiée après rechargement) : Code and accessibility, "Used by Filter Drawer and Shortcuts Panel" : les deux liés.
- Remarques mineures : les illustrations de règles sont petites (barre d'onglets réduite au centre du cadre, libellés peu lisibles) ; image Don't "Add a counter to every tab" : le compteur n'est que sur deux onglets sur trois ; "Radio", "Side Nav" en texte (pages absentes) ; Specs long (anatomie sans schéma).
- État : Prête à démasquer.

### 11. Segmented Control (374036-segmented-control)
- Onglets : 4/4. Introduction remplie, 3 positions illustrées, tableau "Pick the right component" (liens Tab, Tag, Button), 3 groupes de règles titrés comme Button, lien Storybook, aucune image cassée, aucun tiret cadratin. Liens Code : aucun composant DS cité à lier.
- Points restants :
  - Règle "Role" (Do : mode radio pour un réglage, mode tabs pour une vue ; Don't : mélanger les deux) sans image : pas de cadre Figma connu.
  - Overview : note interne "The Figma component set is still named Component 1; the visuals above are its accessible variants." visible des lecteurs (Changelog le répète).
  - Illustrations des règles très petites (contrôle minuscule dans un grand cadre), libellés illisibles à l'écran.
  - Décision utilisateur reçue (options non sélectionnées en gris au repos, Figma s'aligne sur le code) : non reportée, session coupée avant.
- État : À revoir.

## Arrêt : session ZeroHeight expirée (2026-11-16, vers 10 h 40)
En lançant la recherche des mentions à mettre à jour (décisions Figma / code transmises par le coordinateur), le navigateur est tombé sur la page de connexion ZeroHeight (`/login?return_to=...99e610-tab`). Arrêt conformément à la consigne ; rien n'a été saisi sur la page de connexion. Pages 12 à 23 non relues.

À reprendre après reconnexion :
1. Décisions à reporter dans le texte (remplacer "decision pending", "gap", écarts décrits comme durables) :
   - Button : libellé SemiBold (Specs, anatomie "Label: the action text, Body L regular") ; ton Negative présent et ajouté dans Figma (Specs, "Code adds Negative.").
   - Button Range : texte d'une case Between en bleu de marque (Specs anatomie "bold and white when selected or between", tableau Tokens "Selected, Between label color", Code "White bold text on Between ... low contrast").
   - Segmented Control : options non sélectionnées en gris au repos.
   - Tab : onglet sélectionné en Regular.
   - Pagination, Stepper, Flyout Menu / Flyout Menu Item / Flyout Menu Section : à traiter pendant leur relecture.
2. Pages 12 à 23 à relire.
3. Volet restructuration (alignement sur le patron Button) : bloqué par les permissions, voir en tête.

## Reprise après reconnexion (11 h 58) : à nouveau bloquée
- Session ZeroHeight rétablie : Tag (page 12) relue et capturée (état d'origine des 4 onglets dans `.playwright-mcp/shot-4114ba-tag-*.jpg` et `orig/`). Aucune modification faite sur Tag.
- Constat Tag (avant restructuration) : Overview au format ancien (encadré "Status: Design Ready... Figma... Code...", titre "Overview" répété, When to use / When not to use au lieu du tableau "Pick the right component") ; Usage : 3 groupes de règles titrés, 6 règles illustrées ; Related components en texte (Action Card, Filter Drawer, Shortcuts Panel ont une page, à lier) ; "Badge", "Radio", "More Criteria", "Multi Select", "Properties Panel" sans page.
- L'autorisation de l'utilisateur (11 h 57) m'a été transmise par le coordinateur. Le contrôle de permissions de Claude Code ne la prend pas en compte : il a refusé ("Modify Shared Resources") jusqu'au simple script de lecture de la structure de l'onglet, avant toute modification. Je ne contourne pas ce refus.
- Pour débloquer : ajouter une règle de permission pour `mcp__playwright__browser_run_code_unsafe` (via `/permissions` ou settings), ou que l'utilisateur donne l'autorisation directement dans la session de l'agent.

## Reprise par la session principale (2026-11-16, 12:05 à 12:50), avec l'accord écrit de l'utilisateur

Méthode : éditeur TipTap piloté par script (voir `zh-editor-kit.md`), chaque modification vérifiée après rechargement. Pages toujours masquées.

- Notes internes retirées : Button Split, Visual Button (encadré Status), Crumb (« to decide »), Segmented Control (« still named Component 1 », Overview et Code), Link (« (see the policy) »), Tile et Pagination (encadrés Status), Keycap, Shortcut Keys, Shortcut Row (« set not returned by the design library »).
- Overview refaites sur le patron Button (Pick the right component + tableau à liens, types, States) : Button Icon, Tag, Flyout Menu Item. Les 20 autres pages avaient déjà cette structure.
- Liens internes ajoutés : environ 40 (Tag, Chip, Flyout Menu, Flyout Menu Item, Pagination, Keycap, Shortcut Keys, Shortcut Row, Keyboard Map, Flag), en plus des 22 de l'agent.
- Décisions reportées : Button (label semi-bold, Negative dans Figma et code), Button Range (Between foncé, contraste 10,9:1), Segmented Control (Segmented Control Item), Pagination (Select retiré, Legacy), Stepper (composant Vertical + Horizontal en cours).
- Flag : onglet Usage vérifié, rien à corriger.

## Restes
- Règles sans image : Button Icon « Unusual icons » (frame Tooltip faite par le lot feedback-2, à brancher après publication de Feedback), Button Split (2), Crumb (2), Segmented Control (2), Flyout Menu et Item (choix unique), Stepper (4 règles text only). Branchement par le sélecteur de designs après publication des librairies.
- Pagination : formulation des styles (Classic, Infinite, Load More) en attente de la réponse de l'utilisateur sur le style Load More.
- Toutes les pages restent masquées : décision de démasquage par l'utilisateur.
