# Lib rollout, lot data-entry-4 : Inline Edit, Date Range, Search Bar, More Criteria

Fichier `[Components] Data Entry` (`1wVY9FfjONIX6us9JmIm7U`), 2026-11-16. Modèle : Action > Button (section 4030:979). Aucun token, collection ni mode créé ; aucun composant, variante ou propriété créé, renommé ou supprimé ; rien détaché, rien publié, pas de commit, pas de MCP ZeroHeight.

Règles Do / Don't : section `## Do / Don't` des .md locaux, au format « Do X. Don't Y. ». Le texte de chaque règle est repris tel quel, avec seulement la majuscule initiale (« Do keep the value in place » devient « Keep the value in place »). Les .md n'ont pas de titres h3 : les rubriques de la planche (`key`) sont des titres courts écrits par moi.

## 1. Inline Edit (page `2317:198`)

- Section `Inline Edit` : `3160:3476` (Versionning `2317:421` | 01 Component `2317:288` | Documentation `3160:3477` | Do/Don't `3160:3548`). `lost`, `miss`, `overlaps` vides.
- To review : `3160:3597` (`Inline Edit - To review`), contient le 2e gabarit `_Design system header` « Documentation » `2317:441` (textes copiés de Checkbox).

### Liaisons posées (COMPONENT_SET `2317:202`)
- `Text` gap 4 vers Spacing/XS (x4), `Actions` gap 8 vers Spacing/S (x4), `Actions` padding gauche/droite 4 vers Spacing/XS (x4).
- `Input Content` (Active) trait bas 1 vers Border/Size/S.
- `Border Focus` : trait 2 vers Border/Size/M (4 côtés) ; couleur Foundation `foundation/color/action/blue/450` remplacée par Semantic `Color/Interactive/Border/Focus` (même valeur résolue, BlueA/400).
- Vérification : signature de 33 nœuds avant/après, 0 différence ; capture du set avant/après identique (md5 06818f81...).
- Description posée : « Shows a value as text and lets users rename it in place (a board, a card, a filter set), with save, cancel and optional delete; not for several fields, long text or a value picked from a list. »

### Différé
- Rayon 6 de `Border Focus` : aucun Semantic de valeur 6.
- Gap 8 de `Input Content` : un seul enfant, gap sans effet, non lié.
- Couleur de texte : Figma `Interactive/Text/Strong/Alt/*`, code `static-text-main-primary` (signalé en note, non corrigé).

### Frames do / dont (section ZeroHeight vidée et supprimée par le kit)
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Keep the value in place while editing. | do · inline-edit · value edited in place | 3158:7499 |
| Don't : Move the field elsewhere on the page. | dont · inline-edit · field moved elsewhere | 3158:7536 |

Text only : « Confirm destructive delete in the parent. » (Do) et « Delete on a single click without a way back. » (Don't) : comportement (confirmation dans le parent, retour arrière), pas de Modal ni de confirmation dans cette librairie.
Pas de frame anatomy : l'anatomie est dans la Documentation.

### Écarts et décisions
- Gabarit 01 : description (copiée de Checkbox) remplacée par celle du .md ; badges Design « Done » vers « Ready », Tech « Draft » vers « In code » (Status Success), d'après components.json et le .md.
- Versionning (gabarit vide) rempli d'après le changelog du .md : v1.0.0, « Date unknown », « Added », « Initial version. », tag « Ready » ; la 2e entrée vide du modèle est masquée (pas supprimée).
- Notes de la Documentation : Active Figma montre Save + Delete, le code Save + Cancel ; Error et Saved non modélisés ; rayon 6 du focus ; écart de couleur de texte ; espacement valeur / actions (code gap L, Figma bord droit).
- Lien ZeroHeight : « Not published yet (draft) », aucune page ZH (components.json : `pageId` null).
- Frame dont : libellé Input Text « Board name » en semi-bold, sur une ligne.

## 2. Date Range (page `2001:2968`)

- Section `Date Range` : `3161:3538` (Versionning `2634:1407` | 01 Component `2634:1269` | Documentation `3161:3539` | Do/Don't `3161:3610`). `lost`, `miss`, `overlaps` vides.
- To review : `3161:3663` (`Date Range - To review`) : 2e gabarit `_Design system header` « Documentation » `2634:1427` (textes de Checkbox), brouillons en vrac à gauche de la page : 3 instances Date Range `2844:468`, `2844:585`, `2844:703`, vecteurs `2844:583`, `2844:584`, frames `2844:700`, `2844:701`, `2844:702`. Aucun ne contient de COMPONENT (vérifié).

### Liaisons posées
- `Date Range` (`2002:1305`) : gap 24 des 8 cadres `Calendar` (en-tête / grille) vers Spacing/L.
- `.Date` (`2002:797`) : rayons 4 vers Radius/S sur les coins non nuls des 20 variantes (Unique 4 coins, Starting gauche, Ending droite), 32 liaisons.
- Descriptions posées (étaient vides) : `Date Range` (« Calendar panel to pick a reporting or validity period (start and end date) or a single date, on one month (Single) or two (Dual); for one known date typed in a form, use Input Date. »), `.Date`, `.Date Empty`, `.Day`, `Header` (une phrase chacun, sous-éléments privés).
- Vérification : signature de 511 + 41 + 4 + 2 + 1 nœuds avant/après, 0 différence ; captures du set et de `.Date` identiques (md5 ddc369f6..., 28f9faca...).

### Différé
- Gap 10 de `.Date` et `.Date Empty` : aucun Semantic de valeur 10.
- Écarts Figma / code laissés tels quels et notés dans la Documentation : rayon du panneau (Figma S 4, code M 8) ; espacements (Figma 24 entre mois et entre en-tête et grille, code M 16 et S 8) ; libellé du mois (Figma Bold Secondary, code semi-bold Primary) ; jours de semaine (Figma 16 Tertiary, code 14 Secondary).

### Frames do / dont
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Use Dual when ranges usually cross a month boundary. | do · date-range · dual across months (680 x 432, Dual : juin 24 au 5 juillet, 2e mois réécrit en July 2024 avec la vraie grille de juillet) | 3158:8797 |
| Don't : Force users to page month by month for a 60-day range. | dont · date-range · long range in one month (Single, plage qui sort du mois) | 3158:9060 |
| Do : Set `minDate` / `maxDate` when dates outside are invalid. | do · date-range · min and max dates (jours 21 à 30 Disabled) | 3158:9192 |

Text only : « Let users pick an end date before the start date. » (Don't : une plage inversée ne se lit pas sur la grille, essai dessiné puis abandonné, frame retirée avant toute liaison ZH), « Show the footer when the range must be confirmed. » (Do) et « Apply a half-selected range. » (Don't) : le pied Cancel / Apply n'existe qu'en code, pas dans le composant Figma.
Sur la planche, les backticks de `minDate` / `maxDate` sont retirés (mise en forme Markdown, pas du texte). Rubriques : « Long ranges », « Valid dates ».

### Écarts et décisions
- Gabarit 01 : description (le seul mot « Date Range ») remplacée par celle du .md ; badges « Done » vers « Ready », « Draft » vers « In code ».
- Versionning rempli d'après le changelog du .md (v1.0.0, Date unknown, Added, Initial version., tag Ready), 2e entrée vide masquée.
- Note Documentation : les deux mois de Dual affichent « June 2024 » dans le composant.

## 3. Search Bar (page `3047:93`, le maître historique, distinct de Search Bar Home et Multi)

- Section `Search Bar` : `3161:8605` (Versionning `3047:188` | 01 Component `3047:94` | Documentation `3161:8606` | Do/Don't `3161:8677`). `lost`, `miss` vides. Pas de To review (un seul gabarit sur la page).
- `overlaps` : le composant `🆕 Tenant` (`3028:361`, glyphe local utilisé par le filtre BU) était posé sur la page à (0, 400) et se trouvait sous la nouvelle section. Il contient un COMPONENT, donc jamais en To review : il est laissé sur la page, simplement déplacé sous la section (0, 4836). Contrôle refait : 0 chevauchement. À signaler.

### Liaisons
- `Search Bar` (`3047:427`) : déjà entièrement lié au Semantic (paddings, gaps, rayons M, trait S, couleurs). Rien posé.
- Différé : remplissage `#404040` du vecteur de `🆕 Tenant` : le Semantic le plus proche (`Static/Icon/Main/Secondary`) vaut `#414141`, pas la même valeur résolue.
- Description : déjà présente et complète (usage, slots, code), conservée telle quelle.
- Vérification : aucune modification du composant, donc pas de signature à comparer.

### Frames do / dont (1456 px de large : la barre fait 1392, comme les frames de Search Bar Multi)
Instances réelles : `Search Bar` (slots Filters et Options remplis dans l'instance avec `Standalone Dropdown`, `Divider` et `Button` Tertiary Accent avec le glyphe Filter), `Input Text`, `Button`.

| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Put scope and filters in the Filters slot and options in the Options slot. | do · search-bar · filters and options in slots | 3158:4073 |
| Don't : Rebuild the field or the Search button. | dont · search-bar · field and button rebuilt (Input Text + Button posés à côté) | 3158:4170 |
| Do : Keep Search disabled until the search is valid. | do · search-bar · search disabled until valid (pays manquant, Search Disabled) | 3158:4199 |
| Don't : Let users submit and fail on a missing country. | dont · search-bar · submit without a country (même barre, Search actif) | 3158:4328 |
| Do : Keep the bar on one line. | do · search-bar · bar on one line | 3158:4425 |
| Don't : Wrap filters on a second row. | dont · search-bar · filters on a second row | 3158:4540 |

Aucune règle text only. Rubriques : « Slots », « Search button », « One line ». Planche en colonne (Do au-dessus du Don't), frames trop larges pour deux colonnes.

### Écarts et décisions
- Version : components.json dit 0.9.0 (utilisé dans Documentation et Do/Don't, comme le veut la consigne), le gabarit 01, le Versionning et le changelog du .md disent 1.0.0. À trancher.
- Statut Design « New » (gabarit et .md), components.json dit `ready`.
- Notes Documentation : padding et gap Figma L (24) contre M (16) en code ; slots libres en Figma, compositions fixes Buyers / Policies en code ; erreur de champ et champ désactivé non modélisés ; champ de requête sans nom accessible en code ; glyphe Tenant non lié.
- Le ton du Standalone Dropdown porte des noms inversés en Figma (Tone=Default est bleu, Accent est noir) ; j'ai pris la variante bleue, qui correspond au rendu du code (`tone` par défaut `accent`, bleu).

## 4. More Criteria (page `3041:93`)

- Section `More Criteria` : `3165:4213` (Versionning `3041:188` | 01 Component `3041:94` | Documentation `3165:4214` | Do/Don't `3165:4285`). `lost`, `miss`, `overlaps` vides. Pas de To review.

### Liaisons
- `More Criteria` (`3041:304`) : déjà entièrement lié au Semantic (paddings M / XL, gaps S / M / L / XL, rayon M, trait S, couleurs, ombre en style d'effet). Rien posé, rien différé.
- Description : déjà présente et complète, conservée.

### Frames do / dont (1456 px de large)
Instances réelles : `Search Bar` (slots remplis), `More Criteria`, `Button`, `Tooltip` (Feedback, déjà importé dans le fichier par la page Search Bar Multi), rectangle de voile lié à `Static/Background/Accent/Primary` et à l'opacité `Measurement/Opacity/Overlay`.

| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Keep the panel attached under the Search Bar. | do · more-criteria · attached under the bar | 3158:5065 |
| Don't : Open it as a modal. | dont · more-criteria · opened as a modal (panneau centré sur un voile) | 3158:5277 |
| Do : Reflect the number of criteria in use on the bar button. | do · more-criteria · count on the bar button (« More criteria (2) ») | 3158:5497 |
| Do : Disable the entry point for a Company ID search. | do · more-criteria · entry disabled for company id (bouton Disabled + Tooltip « Not available for a Company ID search », texte du code) | 3158:5594 |
| Don't : Open it for that search type. | dont · more-criteria · opened for company id | 3158:5700 |

Text only : « Hide active criteria when the panel closes. » (Don't) : un état caché ne se dessine pas.
Rubriques : « Placement », « Criteria in use », « Company ID search ».

### Écarts et décisions
- Libellés des champs (Street address, City, Region / State, Postal code / ZIP, Phone number) : semi-bold, sur une ligne, dans le composant comme dans les frames.
- Notes Documentation : titre Figma 16 SemiBold contre Title XS 18 en code ; ombre en style d'effet (pas de variable) ; un seul état modélisé ; légendes de rangée en texte simple et Échap non géré en code ; orthographe « Provisionnal » reprise de la donnée.
- Statut Design « New » (gabarit et .md), components.json dit `ready`.

## Synthèse

- 4 pages normalisées, chacune en une section (Versionning | 01 | 02 | 03), `lost` / `miss` / `overlaps` vides partout (Search Bar après déplacement du composant Tenant).
- 17 frames do / dont créées (2 + 3 + 6 + 5), toutes en vraies instances ; 7 règles text only.
- Liaisons : Inline Edit 22, Date Range 40 ; Search Bar et More Criteria déjà liés. 0 différence de géométrie, captures identiques.
- À trancher par l'utilisateur : version de Search Bar (0.9.0 contre 1.0.0) ; statut Design « New » contre `ready` (Search Bar, More Criteria) ; écarts Figma / code listés dans chaque cadre Notes ; position du composant `🆕 Tenant` sur la page Search Bar.
- Rien publié, pas de commit, pas de ZeroHeight.
