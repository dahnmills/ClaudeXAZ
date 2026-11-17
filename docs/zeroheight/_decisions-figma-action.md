# Décisions appliquées dans Figma Action (`xCeEJPn6fliEshuE9fnrqs`), 2026-11-16

Rien publié, aucun token créé, pas de commit. Écrit en anglais dans Figma, sans tiret cadratin.

## 1. Button (page 44:554, set 44:558)
- Tone=Negative ajouté : 40 variantes (5 états x 4 types x Reversed True/False), clonées depuis Tone=Positive puis reliées aux 16 Semantic `Color/Interactive/{Background,Border,Text,Icon}/Strong/Negative/{Default,Hover,Active,Disabled}` (51 liaisons Positive remplacées, 0 restante). Libellés SemiBold conservés (Figma fait foi).
- Les Reversed (fonds `Reversed/Alt`, `Neutral`) suivent le même modèle que Positive : fond blanc, texte rouge.
- Rangement : bloc Negative sous la grille existante (colonne de gauche), comme Button Icon empile ses tons. Bande noire Reversed clonée (`Frame 29 - Negative` 4067:1604), bandes ramenées à 303 px (l'ancienne laissait 200 px de noir vide). Set 1599 x 717 devient 1599 x 1165.
- Contrôle : signature des 120 variantes existantes (positions, tailles, padding, rayon, fills) identique avant/après (hash 384333560). Instances du set dans le fichier : 46 avant, 46 après (Button 35, Button Split 4, Cover 3, Flyout Menu 3, Tag 1).

## 2. Segmented Control (page 302:2, set 302:2197)
- Options non sélectionnées (12 variantes Selected=False) reliées aux tokens du code (`segmented-control.component.scss`) : trait `Color/Interactive/Border/Strong/Alt/Default`, libellé `Color/Static/Text/Main/Primary`, icône `Color/Static/Icon/Main/Primary`, fond `Color/Static/Background/Main/Primary` au repos, `Color/Interactive/Background/Light/Hover` au survol, `.../Light/Active` à l'appui. Disabled : couleurs de repos + opacité 0.40 du calque (comme le code, plus de double atténuation). 48 liaisons changées, aucune ancienne liaison bleue restante. Sélectionné inchangé.
- Set renommé `Component 1` en `Segmented Control Item` (il porte un segment, pas le groupe). Renommer ne touche pas au lien des instances : 28 instances avant, 28 après (Cover 3, page Segmented Control 25).
- Signature des 24 variantes (positions, tailles, padding, rayon, opacité) identique avant/après (hash 302679400).

## 3. Tab (page 56:228, set 57:231)
- Libellé des 12 variantes Selected=True : style de texte `Body/L/Bold` remplacé par `Body/L/Regular` (le même que les onglets non sélectionnés), graisse liée à `Font/Text Style/Font Weight/Regular`. Comme `.ds-tab__label` (toujours regular). Le compteur (calque `9`, Bold) n'est pas touché.
- Signature : seule la largeur des 12 variantes sélectionnées change, 68 à 67 px (texte Regular plus étroit), positions identiques. Changement attendu. Instances : 40 avant, 40 après (Cover 3, page Tab 37).

## 4. Pagination (page 52:779, set 53:2994, atome `.Options` 53:2954)
- Noms alignés sur l'input `style` de `ds-pagination` : `.Options` Type `Full` devient `Classic` (First, Back, pages, Next, Last) et `Minimal` devient `Infinite` (Back, N of M, Next). Set Pagination : `Style=Classic` montre maintenant `.Options Type=Classic` (il montrait Minimal), nouvelle variante `Style=Infinite` (4071:805, `.Options Type=Infinite`). L'ancienne `Style=Infinite Scroll` (bouton Load more) est renommée `Style=Load More` pour ne plus se confondre avec `infinite` du code : ce n'est pas `ds-pagination` mais le motif Button Load More, à trancher (sortir du set ou garder).
- Option Select retirée du composant, non détruite : la variante 53:2983 (1 instance, aperçu « Tile Select » 985:1832 de la Documentation) est sortie du set et rangée dans la section `Pagination - Legacy` (4071:804, sous la section Pagination, fond Warning subtil), renommée `.Options Select (Legacy)`, avec une description « do not use ». Même id, l'instance reste liée.
- Page courante : la page « 16 » de `Type=Classic` (instance Link 53:2964, renommée `Current page`) passe en Tone=Neutral, gris `#121212` SemiBold, comme `.ds-pagination__link--current`. Elle est au milieu (15 16 17) comme le calcul `siblings` du code.
- Instance de la Cover (4056:237) : passée de `Style=Classic` à `Style=Infinite` pour garder son rendu (Back, 1 of 32, Next), sinon elle aurait affiché la version complète.
- Instances : 16 avant, 16 après, toutes liées (Load More 1, Classic 4, Infinite 1, `.Options` Classic 7, Infinite 2, Select 1), plus l'instance interne de la nouvelle variante. Description du set renseignée.
- Non traité (hors décision) : l'ellipse `...` reste un Link bleu (code : texte gris `aria-hidden`), écarts 24/16 px entre blocs (code 16 partout).

## 6. Link, 2e set `Link` 689:4239 (page 77:256)
- `getInstancesAsync` sur ses 12 variantes : **0 instance** dans ce fichier (l'audit B pensait que Breadcrumb en dépendait : ce n'est plus le cas ; Pagination utilise un 3e set `Link` 171:3074, 33 instances, non touché).
- Déplacé dans une nouvelle section `Link - Legacy` (4074:1428), sous la section Link, fond Warning subtil. Même id, variantes identiques (signature vérifiée), description « Legacy » ajoutée. Le bloc vide « Component » qui le portait dans l'en-tête (Frame 8 689:4234) est masqué, pas supprimé : l'en-tête passe de 3469 à 3043 px.
- Limite : `getInstancesAsync` ne voit pas les fichiers consommateurs de la librairie. Si le set est publié, des maquettes externes peuvent encore l'utiliser.

## 5. Stepper (page 312:1332, section 4044:1347)
- Cadre 01 Component créé : `_Design system header` 4080:378, cloné du gabarit Tile (615:158, même Hero que Button), composant cloné retiré aussitôt. Textes : Stepper, description, version 1.0.0, Design Ready, Tech In code. Rangée : 01 (x 160) | Documentation · Stepper 4044:1348 | Do/Don't 4044:1406, 160 px d'écart (section 4080 à 6040 px de large). La section « Stepper - Explo (draft) » 4044:1443 n'est pas touchée.
- Atome `.Stepper Step` 4081:430 (bloc Atoms de l'en-tête, rendu visible) : Status (Upcoming, Unlocked, Current, Completed, Current Completed, Error, Warning, les 7 statuts de `StepStatus`) x Orientation (Vertical, Horizontal), 14 variantes. Propriétés : `Connector` (booléen, à couper sur la dernière étape), `Index` et `Label` (texte).
  - Vertical, d'après `stepper.component.scss` : marqueur 24 (Sizing/L, Radius/Round), anneau 2 px (Border/Size/M) Subtle/Tertiary (upcoming), Interactive/Background/Medium/Default (unlocked), Strong/Default + point 8 (current), fond Strong + coche 14 blanche (completed), double anneau blanc puis bleu (current-completed : trait extérieur `Static/Background/Main/Primary` + cercle `Ring` 32 px Sizing/XL), icônes 24 erreur et alerte (Functional Negative, Warning). Index Body/S/Regular Tertiary, libellé 14/24 SemiBold (variables Size/M, Line Height/L, Weight/SemiBold), ligne de statut 16 px réservée (Completed vert, Error, Warning). Connecteur 1 px Subtle/Tertiary, écart 8 (Spacing/S).
  - Horizontal, d'après la maquette « Sub text and number + status » : étape de 156 px, piste marqueur + connecteur (bleu `Interactive/Border/Strong/Default` après une étape terminée, gris sinon), texte dessous (Index Body/S, libellé Body/L/Regular, statut), écarts 4 (Spacing/XS). Mêmes marqueurs et statuts que le vertical (les libellés « In progress », « Pending » de la maquette ne sont pas repris : le code n'affiche rien pour ces statuts).
  - Vraies instances : `Icon Functional` (NDBX Web) avec swap NDBX Icons `Check`, `Close Circle Outline`, `Exclamation Triangle Outline`. Pas de Badge : le code affiche le statut en texte.
- Composant `Stepper` 4083:368 (bloc Component) : Orientation=Vertical (4083:288) et Orientation=Horizontal (4083:326), 4 instances exposées de `.Stepper Step` (Completed, Current, Upcoming, Upcoming sans connecteur). Descriptions renseignées sur les deux sets.
- Écarts restants, à noter côté doc : hauteur d'étape fixe 70 px (le code passe à 56 px sur la dernière, ce qui ne change que le blanc du bas), valeurs 70, 156 et 14 (coche) sans Semantic de même valeur ; erreur ou alerte sur l'étape courante (double anneau coloré du code) non modélisées ; l'horizontal n'existe pas dans le code.

## 7. Cadres 01 Component manquants
Méthode : clone d'un `_Design system header` déjà restylé (Hero identique à Button : bandeau bleu clair, filet de marque, étiquette « 01 COMPONENT », carte Status, bandeau bas), puis suppression immédiate des COMPONENT_SET clonés (aucun composant dupliqué), textes réécrits (fil d'Ariane, titre, description d'après `components.json`, version, tags Design / Tech). Chaque 01 est posé à x 160 de sa section, Documentation et Do/Don't décalés de 1960 px (160 px d'écart), pas de Versionning sur ces pages.

| Composant | Page | Section | 01 Component | Contenu du bloc Component | Statut affiché |
|---|---|---|---|---|---|
| Flyout Menu Item | 1:3 | 4041:3161 | 4085:682 (clone de 507:1018) | 4 instances de `Flyout Item` 507:996 (Default, Hover, Active, Disabled), le maître reste dans les Atoms de Flyout Menu (vérifié : parent 507:1091, variantes inchangées) | 1.0.0, Ready, In code |
| Keycap | 950:2 | 4042:3206 | 4087:1198 | maître 950:24 déplacé | 0.2.0, Draft, In code |
| Shortcut Keys | 950:2 | 4043:965 | 4087:1341 | maître 950:64 déplacé | 0.2.0, Draft, In code |
| Shortcut Row | 950:2 | 4043:3278 | 4087:1471 | maître 951:110 déplacé | 0.2.0, Draft, In code |
| Keyboard Map | 950:2 | 4043:3617 | 4087:1601 | maître 951:150 déplacé | 0.2.0, Draft, In code |
| Flag | 950:2 | 4043:4202 | 4087:1731 | maître 952:165 déplacé | 1.0.0, In review, In code |

- Utility : les 5 maîtres gardent leur id et leurs variantes. Le cadre `Utility sections` 950:3, vidé de ses composants, est retiré (il ne gardait que les titres, descriptions et notes « Properties », déjà repris dans les Documentation). Les 5 sections sont recalées à x 0 et réempilées à 400 px d'écart, aucun chevauchement. Instances avant/après identiques : Keycap 276, Shortcut Keys 30, Shortcut Row 17, Keyboard Map 6, Flag 16.
- Le bloc Atoms du gabarit est masqué sur ces 6 en-têtes (aucun atome à montrer), comme sur Tile.

## 8. Notes des cadres Documentation
- **Button** (4033:979) : note 1 devient « Label weight: SemiBold. Fixed in Figma, code pending (ds-button is still regular 400). » ; note 2 réduite à « fullWidth exists in code only. ». Propriété Tone : valeur `Negative` ajoutée, note « Same values in Figma and code. ». États : tuile `Negative` (instance Tone=Negative) ajoutée à « Types and tones ». Tokens : ligne `Negative background` (`.../Strong/Negative/Default`).
- **Button Range** (4043:4081) : note 2 « Between: Figma is the reference (medium blue plate, dark label Text/Strong/Alt). Fixed in Figma, code pending (...white bold label, text-neutral). » ; note 3 reformulée (contraste du blanc tant que le code n'a pas suivi). Tokens : ligne « Selected and Between label » scindée en `Selected label` (Text/Neutral) et `Between label` (Text/Strong/Alt, « code pending »).
- **Segmented Control** (4042:1987) : notes 1 à 3 (couleurs de repos, hover/active, double atténuation) retirées, notes renumérotées 1 à 3, mention « Component 1 » remplacée par le nouveau nom. Ligne de tokens « Border (code, rest) » devient « Border (rest) ».
- **Tab** (4043:3388) : note sur la graisse du sélectionné retirée, 6 notes renumérotées.
- **Pagination** (4041:2654) : note 1 réécrite (Load More dans le set, décision ouverte), note 2 réduite à l'ellipse. Propriétés : Style = Classic, Infinite, Load More ; `.Options > Type` = Classic, Infinite (Select retiré, « moved to Pagination - Legacy »). Légendes des tuiles et texte d'anatomie alignés (Classic, Infinite, Select (Legacy), Style Load More, page courante en gris).
- **Stepper** (4044:1348) : description du Hero, section « Horizontal explorations », propriétés (`.Stepper Step > Status` avec les noms Figma, nouvelles lignes Orientation et Connector/Index/Label, lignes code seul « (code only) »), jeton de la coche (`Color/Static/Icon/Subtle/Primary`). Notes : horizontal Figma seul, erreur ou alerte sur l'étape courante non modélisée, hauteur 70/56 ; note sur les brouillons à reconstruire retirée.

## Contrôles
- Deux passes de capture par page touchée (Button, Button Range, Segmented Control, Tab, Pagination, Link, Stepper, Flyout Menu, Utility), plus un contrôle scripté par page : en-têtes, débordement des sections, chevauchements. Résultat final : aucun chevauchement, sections Button, Button Range et Stepper agrandies pour contenir leurs cadres.
- Incident corrigé : l'en-tête de Segmented Control (595:5302) avait une mise en page figée (Content dessiné sous le Hero, Atoms superposés, hauteur 863 au lieu de 1402). Relancé en réécrivant son `itemSpacing`, rendu correct à la 2e passe. Je n'ai pas trouvé de lien avec le renommage du set ; signalé au cas où le défaut existe ailleurs.
- Aucune instance cassée ni détachée : comptes avant/après identiques sur Button (46, plus 1 instance Negative créée dans la Documentation), Segmented Control (28), Tab (40), Pagination (16), Utility (345). Flyout Item : 99 instances après, dont les 4 créées dans le nouvel en-tête (pas de comptage avant, maître non touché).

## Décisions encore ouvertes
1. Pagination `Style=Load More` : garder dans le set ou retirer (le code le fait avec `ds-button`).
2. Stepper horizontal : à coder ou à garder Figma seul ; erreur ou alerte sur l'étape courante (anneau coloré) à modéliser si besoin.
3. Code à suivre : graisse SemiBold de `ds-button`, libellé Between de `ds-button-range`.
4. Link 689:4239 rangé en Legacy (0 instance ici) : à supprimer quand on sera sûr qu'aucun fichier consommateur ne l'utilise.
