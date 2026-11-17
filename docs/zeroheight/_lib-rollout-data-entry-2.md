# Lib rollout, lot data-entry-2 : Data Entry (`1wVY9FfjONIX6us9JmIm7U`)

Composants : Checkbox, Radio, Toggle, Checkbox Card, Radio Card. Modèle : librairie Action, pages Button (section 4030:979) et Button Icon. Rien publié, aucun commit, aucun MCP ZeroHeight, aucun token, collection ou mode créé. Aucun composant, variante ou propriété créé, renommé ou supprimé.

Conventions communes au lot :
- Règles Do / Don't : section « Do / Don't » du .md local (pas d'onglet Usage structuré dans ces .md). Chaque puce « Do X. Don't Y. » donne deux règles ; le texte retenu est celui du .md, sans le « Do » / « Don't » initial (porté par le bandeau de la carte), première lettre en capitale.
- Frames do/dont : 360 de large (504 pour les cards, qui font 440), hauteur 140 mini, fond `Static/Background/Main/Secondary`, paddings `Spacing/L` / `Spacing/XL`, gap `Spacing/S`, vraies instances : composant de la page, `.Label` (2583:3766, libellé de champ, SemiBold, une ligne) et Button de la librairie Action (import par clé). Les deux frames d'une même règle ont la même hauteur (cartes alignées).
- Pas de frame `anatomy` : atomes simples, l'anatomie est dans la section Anatomy de la Documentation (instance agrandie + repères).
- Vérification étape 1 : signature de géométrie (position, taille, opacité, paddings, gaps, rayons, couleurs résolues, style de texte) avant/après sur chaque set : 0 différence ; captures du set avant/après identiques octet pour octet (md5) pour Radio, Toggle, Checkbox Card, Radio Card ; Checkbox : signature seule avant (capture après seulement, contrôlée à l'œil).
- Toggle : le brief annonçait l'absence de .md, mais `docs/zeroheight/data-entry/toggle.md` existe (rédigé, cohérent avec le code `src/app/shared/ui/toggle`). Il a servi de source, recoupé avec le code (inputs `selected`, `error`, `disabled`, `label`, `state`, output `selectedChange`).

## Checkbox (page 2043:1929, set 2043:2375)

- Section `Checkbox` : **3158:9910** ; Documentation · Checkbox : **3158:9911** ; Do/Don't : **3158:9982** ; `_Design system header` 2043:2037 (restylé, 01) ; Versionning 2043:2075. To review : section **3158:10035** (2e gabarit `_Design system header` « Documentation » 2043:2490, sans composant).
- Liaisons posées : 18 traits `Border Focus` Foundation `action/blue/450` vers `Color/Interactive/Border/Focus` ; 1 fond Foundation `action/blue/500` (cadre `Frame 14`, variante Default/Selected/Indeterminate) vers `Color/Interactive/Background/Strong/Default` (même valeur #007ab3). Le reste (gap, rayons, textes, couleurs) était déjà en Semantic.
- Différé : rayon 6 de `Border Focus` (aucun Semantic à 6) ; rayon 1000 de `Frame 14` (Round = 100). `Frame 14` (8 x 2, présent dans une seule variante) ressemble à un reste : signalé, non supprimé.
- Description du set : « Lets users select one or several independent options, with checked, unchecked and indeterminate states. »

| Règle (texte du .md) | Frame | nodeId |
|---|---|---|
| Do : Use the indeterminate state on a parent that has some, not all, children selected. | do · checkbox · indeterminate parent | 3158:3528 |
| Don't : Use it as a third "unknown" value. | dont · checkbox · indeterminate as unknown | 3158:3553 |
| Do : Group related checkboxes under a field label. | do · checkbox · group under a field label | 3158:3564 |
| Don't : Use one checkbox for mutually exclusive choices. | dont · checkbox · mutually exclusive choices | 3158:3585 |

- Text only : Do « Keep the label clickable with the box. » / Don't « Place a separate text next to an unlabeled box. » (le rendu est identique, seule la zone cliquable change).
- Écarts notés dans la Documentation : en-tête Figma « Tech : Draft » alors que ds-checkbox est en code ; couleurs cochées posées en TS (`checkedColor()`) ; rayon 6 de Border Focus ; `Frame 14` résiduel ; Focus booléen Figma vs `:focus-visible`, `ariaLabel` code seul.
- Contrôle visuel : 3 passes (frames, Documentation seule, page normalisée + Do/Don't zoomé). Correction : hauteurs des paires égalisées (168) pour aligner les légendes.

## Radio (page 2044:2568, set 2044:2569)

- Section `Radio` : **3160:787** ; Documentation · Radio : **3160:788** ; Do/Don't : **3160:859** ; header 2044:2631 (restylé) ; Versionning 2193:2111. To review : section **3160:912** (2e gabarit « Documentation » 2044:2764, sans composant).
- Liaisons posées : 14 gaps de variante 8 vers `Spacing/S` ; 12 traits `Border Focus` Foundation `action/blue/450` vers `Color/Interactive/Border/Focus` ; 28 rayons 4 du `Dot` vers `Border/Radius/S`.
- Différé : rayon 1000 de `.Radio` (Round = 100, valeur différente) ; rayon 6 de `Border Focus`.
- Description du set : « Lets users pick exactly one option from a small set of mutually exclusive choices. »

| Règle (texte du .md) | Frame | nodeId |
|---|---|---|
| Do : Give the group a visible label that states the question. | do · radio · group with a question label | 3158:3867 |
| Don't : Leave a group of radios without context. | dont · radio · group without context | 3158:3885 |
| Do : Keep the options mutually exclusive. | do · radio · mutually exclusive options | 3158:3900 |
| Don't : Add a radio that overlaps another option. | dont · radio · overlapping options | 3158:3918 |
| Do : Preselect the safest option when a default exists. | do · radio · safest option preselected | 3158:3936 |
| Don't : Preselect a choice with consequences the user has not read. | dont · radio · risky option preselected | 3158:3950 |

- Text only : aucune.
- Écarts notés : en-tête « Tech : Draft » ; pas de navigation aux flèches dans `ds-radio` (role="radiogroup" à poser par l'écran) ; rayons 1000 et 6 en dur ; Focus booléen Figma vs `:focus-visible`.
- Contrôle visuel : 3 passes (frames, Documentation, page normalisée + Do/Don't zoomé). Hauteurs des paires égalisées avant la planche.

## Toggle (page 2044:2851, set 2044:2853)

- Section `Toggle` : **3160:4568** ; Documentation · Toggle : **3160:4569** ; Do/Don't : **3160:4640** ; header 2044:2930 (restylé) ; Versionning 2193:2080. To review : section **3160:4697** (2e gabarit « Documentation » 2044:3025, sans composant).
- Source : `toggle.md` existe (le brief disait l'inverse), recoupé avec `src/app/shared/ui/toggle`.
- Liaisons posées : 16 gaps de variante 8 vers `Spacing/S` ; 28 paddings 2 du `🧬 Switch` vers `Spacing/XXS` ; 12 traits `Border Focus` Foundation `action/blue/450` vers `Color/Interactive/Border/Focus`.
- Différé : gap 10 et padding droit 26 du Switch (position du knob), rayon 14 du Switch, rayon 1000 du Knob, rayon 6 de Border Focus (aucun Semantic de même valeur).
- Description du set : « A switch that turns a single setting or feature on or off, with immediate effect. »

| Règle (texte du .md) | Frame | nodeId |
|---|---|---|
| Do : Apply the change as soon as the toggle flips. | do · toggle · change applies at once | 3158:4000 |
| Don't : Pair a toggle with a Save button. | dont · toggle · paired with a save button | 3158:4012 |
| Do : Label the setting the toggle controls. | do · toggle · label names the setting | 3158:4052 |
| Don't : Use a toggle for a question that has two named answers (use Radio). | dont · toggle · two named answers | 3158:4058 |
| Don't : Use a toggle to delete or reset data. | dont · toggle · delete or reset data | 3158:4067 |

- Text only : Do « Confirm risky changes elsewhere (dialog). » (aucune boîte de dialogue dans cette librairie ; la paire « Risky changes » montre une carte pointillée côté Do).
- Écarts notés : en-tête « Tech : Draft » ; rayon 14 et tailles 40 x 20 / 16 en dur (Figma et SCSS) ; position du knob par paddings 2 / 26 et gap 10 ; pas d'input `ariaLabel` ; Focus booléen Figma.
- Contrôle visuel : 3 passes (frames, Documentation, Do/Don't normalisé). Hauteurs des paires égalisées.

## Checkbox Card (page 2093:710, set 2093:322)

- Section `Checkbox Card` : **3161:5028** ; Documentation · Checkbox Card : **3161:5029** ; Do/Don't : **3161:5100** ; header 2193:2438 (restylé) ; Versionning 2193:2571. To review : section **3161:5153** (2e gabarit « Documentation » 2193:2591, sans composant).
- Liaisons posées : 8 paddings haut 2 du `Selector` vers `Spacing/XXS` ; 16 gaps 8 (`Content`, `Aditionnal Content`) vers `Spacing/S` ; `Main Label` (8) : taille, interligne, graisse Bold, interlettrage liés aux Semantic `Font/Text Style/*` (police inchangée, Allianz Neo Bold).
- Différé : gap 12 de `Main Content`, gaps 10 de `Selector`, `Separator`, `Slot`, trait du séparateur #e6e6e6 (aucun Semantic de même valeur) ; propriétés de l'instance `Badge` non touchées (elles viennent du composant Badge, librairie Feedback).
- Description du set : « A selectable card that combines a checkbox with a label, a description and optional content, for multi-selection among rich options. »

| Règle (texte du .md) | Frame | nodeId |
|---|---|---|
| Do : Keep cards in a set the same width and structure. | do · checkbox-card · same width and structure | 3158:4874 |
| Don't : Mix cards with and without sub labels in one group. | dont · checkbox-card · mixed sub labels | 3158:4915 |
| Do : Use the badge for status or count. | do · checkbox-card · badge for status or count | 3158:4956 |
| Don't : Use it as decoration. | dont · checkbox-card · badge as decoration | 3158:4977 |
| Do : Make the whole card clickable. | do · checkbox-card · whole card clickable | 3158:4998 |
| Don't : Add a second button inside the card. | dont · checkbox-card · second button inside | 3158:5021 |

- Text only : aucune. Le Don't « second button » place un Button Secondary (librairie Action) dans le `Slot` de l'instance.
- Écarts notés : token code `--semantic-color-interactive-background-main-default` non défini (bordure sélectionnée et case cochée sans couleur dans le navigateur) ; case redessinée en SVG au lieu de `ds-checkbox` ; aucun style de focus ; `Aditionnal Content` et `Slot` Figma seuls (orthographe gardée) ; `Sub Label` du composant en largeur FIXE 103 px (un texte plus long passe sur deux lignes, les illustrations le passent en HUG sur l'instance) ; valeurs 12 / 10 / #e6e6e6 en dur ; en-tête « Tech : Draft ».
- Contrôle visuel : 4 passes. Corrections : vignettes d'états coupées (cartes de 440 dans des tuiles de 230) passées en 2 colonnes pleine largeur ; repère Badge déplacé sous la pastille (il masquait le texte) ; hauteurs des paires égalisées.

## Radio Card (page 2093:50, set 2093:217)

- Section `Radio Card` : **3162:4293** ; Documentation · Radio Card : **3162:4294** ; Do/Don't : **3162:4365** ; header 2193:2686 (restylé) ; Versionning 2193:2781. To review : section **3162:4418** : 2e gabarit « Documentation » 2193:2801 et trois brouillons laissés sur la page (instance Radio Card 2915:103, instance Modal 2915:387, `Frame 32` 2915:1243 avec Dropdown + Flyout). Aucun ne contient de COMPONENT (vérifié avant déplacement).
- Liaisons posées : 8 variantes : paddings 16 (x4) et gap 16 vers `Spacing/M`, rayons 4 vers `Border/Radius/S` (32) ; 8 paddings haut 2 du `Selector` vers `Spacing/XXS` ; 16 gaps 8 (`Content`, `Aditionnal Content`) vers `Spacing/S` ; `Main Label` (8) : taille, interligne, graisse, interlettrage vers `Font/Text Style/*`. Instances de Radio Card dans le fichier (1, le brouillon 2915:103) : rayon, padding et gap inchangés après liaison.
- Différé : gap 12 de `Main Content`, gaps 10 (`Selector`, `Separator`, `Slot`), trait #e6e6e6 (aucun Semantic de même valeur).
- Description du set : la phrase d'usage « A selectable card for choosing one option among visually emphasized, mutually exclusive choices. » a été placée AVANT la description existante (note 🆕 Show selector / Show label), conservée telle quelle.

| Règle (texte du .md) | Frame | nodeId |
|---|---|---|
| Do : Preselect the recommended option when there is one. | do · radio-card · recommended option preselected | 3158:6418 |
| Don't : Leave a required choice without guidance. | dont · radio-card · required choice without guidance | 3158:6460 |
| Do : Keep all cards of a set the same structure. | do · radio-card · same structure in a set | 3158:6501 |
| Don't : Mix tiles and text cards in one group. | dont · radio-card · tiles mixed with text cards | 3158:6543 |

- Text only : Do « Use `tone` only when the choice carries a decision meaning (accept, refuse). » / Don't « Use it as decoration. » (`tone` n'existe qu'en code).
- Le Don't « tiles mixed » montre une vraie tuile : instance avec Show selector, Show label, Sub Label et Tag à False, icône Clock Outline (librairie) dans le `Slot`.
- Écarts notés : gap carte 16 en Figma, 8 en code ; `tone` code seul ; Show selector / Show label / Aditionnal Content Figma seuls (tuile = `ds-grid-selection` en code) ; slot code limité à `slot="meta"` ; cercle redessiné au lieu de `ds-radio` ; focus non modélisé ; valeurs 12 / 10 / #e6e6e6 ; en-tête « Tech : Draft ».
- Contrôle visuel : 3 passes. Corrections : vignettes d'états en 2 colonnes pleine largeur (cartes de 440), repère Badge sous la pastille, hauteurs des paires égalisées.

## Bilan

- 5 pages normalisées, chacune en UNE section (Versionning | 01 Component | 02 Documentation | 03 Do/Don't), 160 px de marge et d'écart ; `lost`, `miss`, `overlaps` vides partout. Sections `ZeroHeight · X illustrations` vidées et supprimées par le kit.
- 25 frames do/dont créées (Checkbox 4, Radio 6, Toggle 5, Checkbox Card 6, Radio Card 4), 6 règles text only. Aucune frame do/dont préexistante sur ces pages.
- Points à trancher par l'utilisateur : badges « Tech : Draft » des en-têtes (laissés, components.json dit vibecoded / dev planned) ; rayons 1000 (Round vaut 100) et 6 ; gaps 10 / 12 et trait #e6e6e6 des cards ; `Frame 14` résiduel de Checkbox ; `Sub Label` fixe à 103 px dans Checkbox Card / Radio Card ; token code manquant de Checkbox Card ; écart de gap 16 / 8 de Radio Card.
- Non fait (hors brief) : changelog des cadres `Versionning` (gabarits vides), textes des en-têtes.
