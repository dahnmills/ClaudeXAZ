# Do / Don't Figma : nouveaux composants Layout (fileKey bbgSPUChd18EVNGijjoZGn)

Additif, rien publié, aucun node existant modifié, aucun token créé. Sections posées sur la page du composant, à 560 px sous le contenu existant (Overlay : sections empilées en x = 0). Frames fond Static/Background/Main/Secondary, section fond Static/Background/Main/Primary, espacement Measurement/Spacing/L (variables liées). Instances des vrais composants.

Détachements volontaires (copies dans mes frames uniquement, pour ajouter un élément interdit) : `dont · page-title · several links in the action` (Page Title détaché), `dont · filter-drawer · third tab` (Drawer, Drawer Tabs détachés), `dont · filter-drawer · destructive action in footer` (Filter Drawer détaché).

## Page Title (page 4009:2, ZH 9186063) : section 4024:3533 `ZeroHeight · Page Title illustrations`
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Keep the title short. | do · page-title · short title | 4024:3534 |
| Don't : Repeat the title in the Page Header. | dont · page-title · title repeated in header | 4024:3566 |
| Do : Use a real label for the action link. | do · page-title · real action label | 4024:3700 |
| Don't : Stack several links in the action. | dont · page-title · several links in the action | 4024:3723 |
Sautées : aucune.

## Filter Drawer (page Overlay 4009:3, ZH 9186064) : section 4026:627 `ZeroHeight · Filter Drawer illustrations`
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Use one control per section. | do · filter-drawer · one control per section | 4026:628 |
| Don't : Add a third tab. | dont · filter-drawer · third tab | 4026:754 |
| Do : Keep Apply as the single primary action. | do · filter-drawer · single primary action | 4026:1101 |
| Don't : Put destructive actions in the footer. | dont · filter-drawer · destructive action in footer | 4026:1203 |
Sautées : aucune. Notes : le Button n'a pas de Tone négatif (Default, Accent, Positive), le bouton "Delete all" du don't est un Secondary Accent ; dans ce don't, "Clear all" est retiré (le pied ne tient pas à 4 boutons). Frames 3 et 4 : tiroir rogné sur le pied.

## Spotlight (page Overlay 4009:3, ZH 9186066) : section 4027:967 `ZeroHeight · Spotlight illustrations`
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Show at most four rows. | do · spotlight · four rows at most | 4027:968 |
| Do : Show the ID with a copy action. | do · spotlight · id with copy action | 4027:1062 |
Sautées (comportement, pas dessinable) : "Don't : Keep it open after the user selects a row." et "Don't : Break arrows, Enter or Escape."

## Shortcuts Panel (page Overlay 4009:3, ZH 9186069) : section 4028:1094 `ZeroHeight · Shortcuts Panel illustrations`
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Light up the shortcuts the user already used. | do · shortcuts-panel · used shortcuts lit | 4028:1095 |
| Don't : Add a title or a search field. | dont · shortcuts-panel · title and search field | 4028:1336 |
| Do : Keep one category per tab. | do · shortcuts-panel · one category per tab | 4028:1614 |
| Don't : Block the page behind the panel. | dont · shortcuts-panel · blocks the page | 4028:1833 |
Sautées : aucune. Notes : le don't "blocks the page" utilise un Scrim (rectangle, fond Icon/Main/Primary, opacité liée à Measurement/Opacity/Overlay) sur un Page Header ; le don't "title and search" utilise Page Title + Input Text.
