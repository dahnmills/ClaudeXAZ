# Audit des composants de la librairie Data Display (`VpConH5AUGyCqtp8PMqj1i`), 2026-11-17

Audit en LECTURE SEULE. Aucune écriture dans Figma (ni liaison, ni renommage, ni publication), aucun commit. Navigateur non utilisé. Dimensions lues sur les nœuds par l'API, jamais sur une image.

## Méthode

- Inventaire `COMPONENT` / `COMPONENT_SET` page par page (16 pages de composants, plus Checklist, Status, Archives et `☠️ Message Illustration`).
- Pour chaque maître (toutes variantes), sans descendre dans les instances imbriquées (leurs valeurs appartiennent à l'atome) :
  - jetons : fills, strokes et épaisseurs, effets, 4 rayons, paddings, gap (ignoré en `SPACE_BETWEEN` ou avec moins de 2 enfants), textes (style de texte, sinon variables taille / interligne / famille / graisse) ;
  - **origine** de chaque variable par la clé de sa collection : `Tokens / Semantic` (`8c30654c…`) attendu ; `Tokens / Foundation` (`d1ad3782…`) signalé ; `qirin--variables / qrn` (`1a8f436c…`), ancienne librairie hors Tokens, signalé ; origine de chaque style de texte comparée à la liste des 35 styles du fichier Tokens (`Title/*`, `Body/*`, `Display/*`) ;
  - composition : maître et clé de chaque instance, comparés à `qirin-figma-inventory.md`, à `PLAYBOOK.md` et aux audits Action et Layout ;
  - fonctionnel : propriétés non `VARIANT` sans calque qui les référence (aucune trouvée), calques masqués non pilotés, combinaisons de variantes, dimensionnement des variantes racines ;
  - propreté : noms génériques, description, liens de documentation ;
  - validation : sections, en-tête 01 (`_Design system header`), bloc `Versionning`, sections `To review`.
- Publication vérifiée par `search_design_system` sur `[Components] Data Display` (dernière publication : 2026-11-16 14:22).
- Code : inputs relevés dans `src/app/shared/ui/<nom>/`.
- Déjà tranché et non re-signalé comme nouveau (`_audit-overrides-prepublish-2.md`) : laisser **non liés** le gap et le padding haut de Page Header, la famille du texte `ID` de `.Topbox Content`, le padding droit 96 de Progress Bar, le gap racine et les paddings du Slot de Widget Card. Les points relevés dans les cadres « Note » des pages (doublon Table Row, Frame 243 / 245, écarts de statut Figma / ZeroHeight / `components.json`) sont repris comme « connus » parce qu'ils sont toujours faux.

## Synthèse

Compteurs = défauts distincts (une même propriété répétée sur N variantes compte 1) ; entre parenthèses, les défauts déjà connus. **Tok** jetons, **Comp** composition, **Fonc** fonctionnel, **Propre** noms / description / lien, **Valid** page / Versionning / statut, **Code** écart flagrant avec Angular.

| Composant | nodeId | Publié | Tok | Comp | Fonc | Propre | Valid | Code | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| Card | 354:4525 | oui | 19 | 2 | 0 | 1 | 2 | (1) | à corriger |
| Atomes privés de Card (13 sets) | 354:4461, 354:4711, 354:4379, 354:4371, 354:4362, 354:4406, 354:4468, 415:2129, 565:18709, 565:23887, 354:4455, 565:23170, 565:23169, 565:24990 | non | ~145 | 2 | 2 | 8 | 0 | 0 | **bloquant** |
| Widget Card (nommé « Card ») | 1325:10443 | oui | 2 | 0 | 0 | 2 | 1 | 0 | à corriger |
| Table Row (2 sets identiques) | 1514:3369, 1514:4330 | **oui, les 2** | 0 | 0 | (1) | 1 | 1 | (1) | **bloquant** |
| Table Cell + `.Table Cell Text` / `.Slot` | 1514:2514, 1514:2198, 1514:2193 | oui | 1 | 0 | 0 | 2 | 2 | 1 | à corriger |
| Table Header | 8:4237 | oui | 1 | 0 | 0 | 2 | 2 | 0 | à corriger |
| Table Header Row, Header Selection, Header Flyout | 1514:3452, 1514:3515, 1514:3590 | oui | 0 | 0 | 2 | 1 | 1 | 0 | à corriger |
| Table Selection, Table Flyout | 1514:2006, 1514:2000 | oui | 0 | 0 | 0 | 1 | 1 | 0 | OK (Valid) |
| Ancienne table (Table Header, Cell, ☠️ Table Line + 10 atomes) | 33:1985, 38:13911, 55:2722, 74:4618… | **oui** (3) | 12 | 4 | 1 | 5 | 1 | 0 | **bloquant** |
| Collapsible Table | 1491:4803 | oui | 1 | 0 | 0 | 1 | 1 | 0 | à corriger |
| Collapsible Table Cell (2 sets même nom) | 909:2473, 973:469 | oui, les 2 | 0 | 0 | 0 | 2 | 0 | 0 | à corriger |
| ☠️ Collapsible Table, ☠️ Collapsible Table Row | 909:5838, 909:3041 | **oui** | 11 | 1 | 0 | 2 | 1 | 0 | à corriger (dépublier) |
| Page Header | 1709:15404 | oui | 0 | 0 | 0 | 1 | 2 | 0 | à corriger (Valid) |
| `.Topbox`, `.Topbox Content`, `.Page Title`, `.Topbox Actions`, `.Topbox Tabs`, `.Topbox Breadcrumbs` | 1704:15463, 1704:15147, 1709:15118, 1709:16085, 1704:15827, 1704:16742 | non | 6 (1) | 3 | 1 | 9 | 0 | 0 | à corriger |
| Tabs - Topbox, Breadcrumbs - Topbox | 1709:14841, 1709:14760 | oui | 0 | 0 | 0 | 1 | 2 | 0 | OK (Valid) |
| Anciens Topbox publiés (Topbox, [☠️] Topbox, Topbox V2 - Variation 1/2/4, topbox2026--usertesting, Data, Data V2, Tabs, `.Item`…) | 424:18949, 338:6573, 1131:9417, 1131:7830, 1630:16043, 1445:9407, 1134:14617, 1167:18974, 256:1468, 256:1431 | **oui** (10) | >300 | 2 | 1 | >200 | 3 | 0 | **bloquant** |
| Horizontal Card | 680:6820 | oui | 0 | 0 | 1 | 1 | 4 | 0 | à corriger |
| Row (×3) et atomes de Horizontal Card | 679:5381, 680:5246, 679:5294, 679:5489, 679:13831, 679:10724, 680:5224, 679:16240, 679:5514, 679:5509, 2074:1404 | **oui** (Row ×3) | ~40 | 0 | 2 | 12 | 0 | 0 | à corriger |
| Grade | 628:17016 | oui | 3 | 0 | 0 | 1 | (1) | 0 | à corriger |
| Policy color | 1655:14105 | oui | 4 | 0 | 0 | 1 | 2 (1) | 0 | à corriger |
| Accordion + `.Title` | 281:546, 720:65 | oui | 4 | 0 | 0 | 1 | 1 (1) | 1 | à corriger |
| Timeline | 1491:927 | oui | 0 | 0 | 0 | 1 | (1) | 0 | OK (connu) |
| Timeline Title, Timeline Line (privés mais publiés) | 381:422, 381:236 | **oui** | 7 | 0 | 0 | 4 | 0 | 0 | à corriger |
| Timeline Event | 381:438 | oui | 5 | 2 | 1 | 3 | 1 | 0 | **bloquant** |
| ☠️ Timeline, Frame 243, Frame 245 | 381:171, 381:483, 381:491 | **oui** | 6 | 2 | 0 | 5 | (1) | 0 | à corriger (dépublier) |
| Identifier | 2009:105 | oui | 0 | 0 | 0 | 1 | 1 | 1 | OK |
| Glyphes locaux (Hash, Grid, Contract, File Text, File New) | 2009:59, 2020:291, 2030:341, 2030:349, 2030:357 | oui | 5 | (5) | 0 | 0 | 0 | 0 | à corriger |
| Icon Tile | 2020:358 | oui | 0 | 0 | 0 | 1 | 0 | 0 | OK |
| Progress Bar | 2024:313 | oui | 0 (1) | 0 | 0 | 1 | 0 | (1) | OK (connu) |
| List Item | 2059:394 | oui | 0 | **1** | 0 | 1 | 0 | 0 | **bloquant** |
| Chart | 2060:338 | oui | 0 | 0 | 0 | 1 | 0 | 1 | OK |
| Pie Chart | 2118:177 | oui | 0 | 0 | 0 | 1 | 0 | 0 | OK |
| Action Card | 2117:1081 | oui | 0 | 0 | 0 | 1 | 0 | 0 | OK |
| Task (page Checklist) | 1:92 | **oui** | non audité | 0 | 0 | 2 | 1 | 0 | à corriger (dépublier) |

Bilan : 34 lignes (≈ 110 maîtres) ; **7 bloquants** (atomes de Card, Table Row en double, ancienne table, anciens Topbox publiés, Timeline Event, List Item, et transversalement les dépendances `qirin--variables` / styles hérités), 20 à corriger, 7 OK.

Aucune propriété de composant orpheline (booléens, textes, swaps et slots sont tous reliés à un calque) et aucune instance cassée (maître introuvable) dans les maîtres audités. Aucun lien de documentation (`documentationLinks`) sur **aucun** composant de la librairie.

## Constats transverses

### T1. Dépendance à l'ancienne librairie `qirin--variables` (collection `qrn`), hors Tokens. Gravité : majeure
Le fichier est abonné à `qirin--variables` (collections `qrn`, `Semantic` et `Foundation` homonymes de celles de Tokens). Seule `qrn` est utilisée. Liaisons relevées (Foundation en direct, et d'une librairie qui n'est pas la source de vérité) :

| Composant | Variable `qrn` | Nombre |
|---|---|---|
| `.Columns` 415:2129 (contenu de Card Type=Default) | `foundation/color/grey/450` | 432 |
| `.Layout` 354:4468 | `foundation/color/grey/450` | 10 |
| `.Key Info` 354:4379 | `foundation/color/neutral/white` | 4 |
| `.Label` 354:4711 | `foundation/color/grey/450` | 2 |
| Table Header 8:4237 | `foundation/color/action/blue/450` | 16 |
| `.Topbox Content` 1704:15147 | `foundation/color/neutral/white` | 2 |
| Timeline Line 381:236 | `light/tag/label/error-reverse` | 44 |
| Row 679:5294 (Horizontal Card) | `foundation/color/action/blue/600` | 2 |
| `.Content Type` 74:4618, ☠️ Collapsible Table Row 909:3041, `.Item` 256:1431, Data 1134:14617, topbox2026 1445:9407, Topbox V2 - Variation 1 | grey/500, grey/300, white, grey/050, grey/100, blue/600, blue/700 | 37 |

Correctif : remplacer par le Semantic Tokens de même valeur (gris 450 = texte secondaire, blanc = fond principal, bleu 450 / 600 = interactif). Puis désabonner le fichier de `qirin--variables`. Risque sur les surcharges : faible pour un remplacement couleur vers couleur de même valeur (les audits de surcharge ne comptent pas les liaisons de couleur) ; vérifier d'abord que la valeur résolue est identique.

### T2. Styles de texte hors Tokens. Gravité : majeure
Les styles `Copy/…`, `Headline/X-Small (🖥20 📱18)/Semibold` et `foundation-h2` ne sont pas dans Tokens (qui n'a que `Title/*`, `Body/*`, `Display/*`). Utilisés par : Grade (63 textes), Policy color (14), `.Title` de Card (5), `.Missing Data` (1), `.Cell Properties` 1512:3518 (2), `.Page Title` (1), `.Topbox Content` (2), `.Data` de Horizontal Card (6), Timeline Line (5), Timeline Title (5), Timeline Event (14), Frame 245 (32), `.Title` d'Accordion (`foundation-h2` ×4) et les anciens Topbox.
Correctif : mapper `Copy/Medium (16)/X` vers `Body/L/X`, `Copy/Small (14)/X` vers `Body/M/X`, `Copy/X-Small (12)/X` vers `Body/S/X`, `Copy/Large (18)` et `Headline/X-Small` vers `Title/H3` ou `Title/H4` selon la valeur, `foundation-h2` vers `Title/H2`, **après comparaison valeur par valeur** (taille, interligne, interlettrage). Risque : changer le style d'un texte du maître se propage ; les consommateurs qui ont surchargé la taille, la graisse ou l'interligne de ces textes gardent leur surcharge, les autres voient le rendu changer si les valeurs diffèrent. Faire un audit de surcharges dédié avant (comme `_audit-overrides-prepublish-2.md`).

### T3. Composants hérités ou retirés imbriqués. Gravité : bloquante pour List Item et Timeline Event, majeure ailleurs

| Maître hôte | Instance | Clé | Problème |
|---|---|---|---|
| List Item 2059:394 | Link | `b9493d2f…` | Link 171:3074 **retiré du canevas et dépublié** (audit Action, 11.1). Le Link courant est `77367a8f…` (688:4202), déjà utilisé par Action Card |
| Card 354:4525 (Type=Slot), `.Settings` 354:4406 (×8), Timeline Event 381:438, ☠️ Timeline, ☠️ Collapsible Table | Slot | `f8a4fe08…` | Slot de Layout **déprécié** (audit Layout), à remplacer par un slot natif |
| Table Header 33:1985, `.Content Type` 74:4618 | Slot local 33:4843 | `d4ee4118…` | maître **sans parent** (hors canevas), encore référencé |
| Timeline Event 381:438, Frame 245, `.Topbox Details` | Data Display 👔 | `7bc7072b…` | ancien composant d'une autre librairie, absent de l'inventaire |
| `.Company Profile` 565:23887 | Grade | `5ac10c1b…` | **autre** Grade que celui du fichier (`0a9375b0…`) |
| `.Topbox Content` 1704:15147 | Grade, Policy color | `0a9375b0…`, `8d192e17…` | copie **publiée** des maîtres du même fichier (instance « distante » de soi-même) : les modifications locales n'y arrivent qu'après publication |
| `.Topbox Content` 1704:15147 | Flyout Menu | `5d1147ac…` | variante **Legacy** (audit Action : courant `84a8ec3e…`) |
| `.Topbox Content` | Summary | `6eb43788…` | source non identifiée (absente de l'inventaire) |
| `.Content Type` 74:4618 | Tag, Link | `c0e3e762…`, `0f7a542a…` | ni le Tag courant (`0543a49f…`) ni le Link courant |
| `.Content` 354:4371 (Card) | Link | `0f7a542a…` | idem |
| `.Header Type` 28:21695 vs `.Selection` | Checkbox | `df6100fe…` vs `0473a114…` | deux Checkbox différents dans la même table |
| Card, `.Content` | Edit Compose | `78cfb27a…` | source non identifiée |

Correctif : échanger chaque instance sur le maître (swap) vers le composant courant. Risque sur les surcharges : un swap sur le maître conserve les surcharges des consommateurs seulement si les calques gardent le même nom (Link : vérifier le nom du calque libellé entre `b9493d2f` et `77367a8f`) ; sinon les libellés surchargés reviennent au texte par défaut. Lister les instances consommatrices de List Item avant.

### T4. Composants obsolètes ou de travail encore publiés. Gravité : bloquante (pollution du panneau Assets)
Publiés le 2026-11-16 ou avant, sans description, avec valeurs brutes et noms génériques : Topbox 424:18949 (11 variantes produit, `a archiver`), [☠️] Topbox 338:6573, Topbox V2 - Variation 1 / 2 / 4, topbox2026--usertesting 1445:9407, Data 1134:14617, Data V2 1167:18974, Tabs 256:1468, Table Header 33:1985 (même nom que le Table Header courant 8:4237), Cell 38:13911, ☠️ Table Line, ☠️ Collapsible Table, ☠️ Collapsible Table Row, ☠️ Timeline, Frame 243, Frame 245, Row 679:5294, Task 1:92 (page Checklist). Deux sets « Table Row », deux « Collapsible Table Cell », deux « Card », deux « Table Header » portent le même nom publié.
Correctif : préfixer d'un `.` ou `_` (ce qui les dépublie) ou les supprimer, après comptage des instances dans les fichiers consommateurs. Risque : dépublier laisse les instances existantes en place mais figées ; supprimer un maître encore utilisé crée des instances orphelines. Renommer un composant gardé ne touche pas aux surcharges (clé inchangée).

### T5. Pages et validation
- Pages non normalisées : **Horizontal Card** (aucune section, bloc `Versionning` du gabarit non rempli « v.X.X.X / Month XX, XXXX », cadre racine `Frame 331`), **Topbox** (13 sections dont `Section 1`, `Useberry`, `Version finale - validee avec CM`, `Archives` vide, notes de test utilisateur en calque texte), **Card** (sections Card et Widget Card sans `Versionning`, cadre `DEPRECATED` dans la section Card, pas de section `To review`).
- Sections sans bloc `Versionning` : Card, Widget Card, Table Cell, Table Cell Header, Table Cell Selection, Table Cell Action, Collapsible Table, Page Header, Topbox, Breadcrumbs - Topbox, Tabs - Topbox, Timeline Event. Les sections Table Cell Header / Selection / Action n'ont pas non plus d'en-tête 01.
- Bloc `Versionning` de Table Row : gabarit non rempli (« v.X.X.X »).
- Sections `To review` restantes : Table Row, Table Cell, Collapsible Table, Page Header (contient `Vector 29/33/34`, `Group 4/5/6/7` en vrac), Grade (contient une copie de `Grade`), Policy color (rectangles nommés `background-color:#f2d23d;`, `Rectangle 1…6`), Accordion, Timeline (☠️ Timeline, Timeline Event ×3, Accordion ×2, `Frame 242`, `Frame 246`), Identifier.
- Statuts : `Versionning` dit WIP (Grade, Accordion, Timeline) ou Draft (Policy color, 0.2.0) alors que `components.json` dit `ready` (Grade, Accordion, Timeline) : déjà noté dans les cadres Note des pages, toujours faux. Pastilles de page 🔴🔴 (Topbox, Policy color) et 🟠 (Timeline).
- Pie Chart : **confirmé** `COMPONENT` sans set (2118:177), placé dans un cadre `Examples` à côté d'une instance exemple. Aucune variante n'est nécessaire : à garder tel quel (le passer en set n'apporte rien et changerait la structure publiée).

## Détail par composant

### Card (354:4525), set publié `1d68f180…`
| Problème | Gravité | Correctif | Risque surcharges |
|---|---|---|---|
| Rayons 4 bruts sur la racine (3 variantes) et sur `Content` | moyenne | lier à `Border/Radius/S` (Semantic) | élevé si des consommateurs ont surchargé le rayon ; à auditer |
| Paddings 24 bruts (racine, `Content`), et **25** haut / bas sur une variante | moyenne | lier 24 à `Measurement/Spacing/L` ; corriger 25 en 24 | élevé : les écrans posent souvent du padding sur Card ; audit de surcharges obligatoire |
| Épaisseur de trait 1 brute (racine ×3, `Content`) | faible | lier au Semantic d'épaisseur | faible |
| Type=Slot utilise le Slot déprécié `f8a4fe08…` ; `Edit Compose` d'origine inconnue | majeure | slot natif ; identifier Edit Compose | moyen : le contenu posé dans l'ancien Slot par les consommateurs serait perdu, migrer écran par écran |
| Pas de `Versionning`, cadre `DEPRECATED` dans la section | faible | ajouter le bloc, sortir le cadre | nul |
| Code : `tone` / `loading` / `elevated` / `noPadding` contre `Type` (6) + `Action` | connu | déjà dans `components.json` | nul |

### Atomes privés de Card. Bloquant
- `.Columns` 415:2129 (le contenu de Card Type=Default, 15 variantes) : **1 972 propriétés de texte brutes** (24 distinctes : `Item` 16 / interligne 16 / Allianz Neo / Regular, `Value` 16 / 20 / Bold…, aucun style de texte), 432 liaisons `qrn` grey/450, gaps 4 / 10 / 16 / 24 bruts (320 occurrences), `Separator/Line` #e6e6e6 brut (61), calques `Frame 33`, `Line`. 9 combinaisons manquantes (`4 / Horizontal`, `Mixed` sauf 2 colonnes) : à documenter si voulu.
- `.Layout` 354:4468 : 24 textes bruts, gaps 16 / 4, paddings 24, trait 1, `Separator/Line` #e6e6e6, `Frame 15`, `Frame 16`.
- `.Key Info` 354:4379 : paddings 24, gaps 16 / 4, 20 textes bruts (graisse Light), fond en dégradé non lié, fond `.Left` surchargé #018fd7 à 20 %. Options de variante **`Hightlighted`, `Hightlighted3`, `Hightlighted4`** (faute et options sans sens), 4 combinaisons `Loading=True` manquantes.
- `.Left` 354:4362 : fond #018fd7 à 20 % et vecteur `foundation:dollar/Vector` #018fd7 bruts, texte `Label` à famille / graisse mixtes.
- `.Settings` 354:4406 : **illustration unDraw vectorisée** (`undraw_charts_re_5qe9 1`, 132 vecteurs aux couleurs brutes #3f3d56, #ff6584, #ffb8b8…, 8 variantes), paddings 24, gap 16, fond en dégradé.
- `.Missing Data` 565:18709 : icône à fond #b71e3f à 5 %, rayons 100, padding 8, gaps 16 / 10, `Frame 15`, `Frame 17`.
- `.Company Profile` 565:23887 : 12 textes bruts (24 Bold, 16), rayon 8, gaps 8 / 16 / 4, `Frame 31`, **Grade d'une autre librairie** (`5ac10c1b…`).
- `.Title` 354:4461 : styles `Copy/Large (18)/Semibold`, `Copy/Medium (16)/Semibold` (hors Tokens), gap 4. `.Content` 354:4371 : texte 24 Bold brut, Link `0f7a542a…`. `.Label` 354:4711 : 8 textes bruts, `qrn`. `.Action`, `.Action (loading)`, `.Title (loading)` : gaps 4 / 2 bruts.

Correctif : lier textes et espacements aux Semantic Tokens, remplacer l'illustration par un composant d'illustration (ou une image) hors du maître, renommer `Hightlighted*`. Risque : **élevé**, c'est le cœur de toutes les cartes des fichiers de fonctionnalités (Buyer Summary, Coverbook, Manual Underwriting…) ; un audit de surcharges ciblé sur `.Columns` et `.Layout` est indispensable avant toute liaison de taille / interligne de texte.

### Widget Card (1325:10443), composant publié `987bbbe7…`
- Nom publié **« Card »**, identique au set Card : renommer `Widget Card` (risque nul, clé inchangée).
- Trait 1 brut sur la racine, `Header/Separator/Line` #e6e6e6 brut : lier au Semantic (couleur : risque faible).
- Pas de `Versionning` ; « Figma header shows version 2.0.0, components.json says 1.0.0 » (Note 2, toujours vrai).
- Ne pas lier le gap racine ni les paddings du Slot (déjà tranché).

### Table Row (1514:3369 et 1514:4330). Bloquant (connu, toujours faux)
- Deux sets publiés identiques (`a358c00c…` et `4a0ebfc7…`), mêmes propriétés et même description (Note 1 de la page). Choisir celui qu'utilisent les fichiers consommateurs, dépublier l'autre.
- Jetons et composition : propres (Semantic uniquement, Table Selection et Table Flyout locaux).
- `Versionning` : gabarit non rempli.
- Code : `ds-table-row` a `new` et `interactive` ; Figma n'a que `State` (teinte de nouvelle ligne et anneau de focus seulement en code, Note 4).
- Risque : dépublier le mauvais set fige les instances qui l'utilisent ; compter les instances des deux clés d'abord.

### Table Cell (1514:2514) et atomes
- `.Table Cell Text` 1514:2198 : padding droit 20 brut (pas de Semantic 20 évident : à arbitrer). Calques `Wraper` (faute) et `Wrapper` / `Text`.
- Sections Table Cell / Cell Header / Cell Selection / Cell Action : pas de `Versionning`, les trois dernières sans en-tête 01.
- Code : `ds-cell` a `size` (s / m), `align`, `emphasized` ; le Table Cell Figma n'a que `Type` (Slot / Text) et `New`. Taille S absente du nouveau jeu de table (elle existait dans l'ancien `.Cell Properties`).

### Table Header (8:4237), set publié `09f1bad0…`
- 16 liaisons `qrn` `foundation/color/action/blue/450` (indicateur de tri) : passer au Semantic interactif.
- Nom publié partagé avec l'ancien Table Header 33:1985 (`66f68059…`).

### Table Header Row (1514:3452), Header Selection (1514:3515), Header Flyout (1514:3590)
- **Header Selection** : `Type=Single` et `Type=Double` ne contiennent que `Border Top` / `Border Bottom`, **aucune case à cocher**, alors que la description annonce « blank or select-all checkbox » et que `ds-cell-header` a `allSelected` / `allIndeterminate`. Ajouter l'instance Checkbox (Data Entry, clé courante) pilotée par un booléen. Risque : faible (ajout).
- Header Flyout : calque `Button Icon` masqué non piloté (en-tête vide voulu) : supprimer le calque ou le piloter.

### Ancienne table (Table Header 33:1985, Cell 38:13911, ☠️ Table Line 55:2722 et atomes privés). Bloquant
- Trois maîtres publiés sans description ; atomes `.Content Type` ×2 (74:4618 à la racine de la page, 38:11003), `.Cell Properties` ×2 (8:4196, 1512:3518), `.Selection` ×2, `.Cell Type`, `.Line Data`, `.Header Type`, `.Cell Action`, `.Cell Selection`.
- Slot local 33:4843 **hors canevas** encore référencé ; Tag / Link / Checkbox d'anciennes clés ; `qrn` grey/500 et grey/300 ; paddings 8 / 16 / 20 bruts ; textes `Text` à famille mixte.
- Correctif : dépublier (préfixe) puis supprimer après vérification d'usage. Risque : instances consommatrices figées.

### Collapsible Table (1491:4803) et cellules
- `Category` padding haut / bas 12 brut : à lier si un Semantic 12 existe, sinon laisser et noter (les autres paddings ont été liés par data-display-2).
- Deux sets publiés « Collapsible Table Cell » (909:2473 cellule, 973:469 icône info) : renommer le second en `.Collapsible Table Info` (dépublié) ou `Collapsible Table Info`. Risque nul pour un renommage.
- ☠️ Collapsible Table / Row : publiés, Slot déprécié, `qrn` white, 11 valeurs brutes : dépublier.
- Page : pas de `Versionning`.

### Page Header (1709:15404) et atomes du Topbox
- Page Header, Tabs - Topbox, Breadcrumbs - Topbox : propres (Semantic). Sections Page Header / Topbox / Breadcrumbs / Tabs sans `Versionning` ; Breadcrumbs et Tabs sans en-tête 01 ni Do/Don't. Section `Page Header - To review` encombrée de `Vector` / `Group` en vrac.
- `.Topbox Content` 1704:15147 : calques `Frame 212 / 213 / 214 / 215`, `Line 3 / 4`, vecteurs `tabler:hash/Vector` (le glyphe Hash est redessiné ici au lieu d'utiliser `🆕 Hash`) ; texte `ID` en Menlo brut (famille : ne pas lier, déjà tranché ; taille 12 / interligne 24 bruts restent) ; `Copy/Medium (16)/Bold` ×2 ; `qrn` white ×2 ; Grade et Policy color en copie publiée de soi-même, Flyout Menu Legacy, Summary d'origine inconnue ; `Button`, `Button Icon`, `Flyout Menu` masqués sans booléen alors que le code a `actionType` (`button` / `chevron`).
- `.Page Title` 1709:15118 : `Headline/X-Small (🖥20 📱18)/Semibold` (hors Tokens), pas de description.
- Risque : **les surcharges `ID` (JetBrains Mono, 9 instances) et le gap / padding haut de Page Header ne doivent pas être liés** (audit de surcharges). Remplacer Grade / Policy color par les maîtres locaux est sans effet visuel (même composant), mais un swap sur le maître réinitialise les propriétés choisies par les consommateurs si les variantes ne correspondent pas : garder les mêmes valeurs de variante.

### Anciens Topbox publiés. Bloquant
Topbox 424:18949 (fond #ffffff et trait #d9d9d9 bruts, paddings 16 / 32, variantes `a archiver`, `API - My Agenda`…), Topbox V2 - Variation 1 / 2 / 4 (≈ 150 valeurs brutes, 68 noms génériques, Menlo), topbox2026--usertesting (45 `Frame`, `qrn`), Data 1134:14617 (39 noms génériques, groupes, glyphes iconify `cuida:warning-outline` redessinés), Data V2, Tabs 256:1468 et `.Item` 256:1431 (ombre brute, rayons 2 / 4, 21 liaisons `qrn`). Tous publiés, aucun avec description. Dépublier ou supprimer ; la page Topbox devrait ne garder que Page Header et ses parties.

### Horizontal Card (680:6820), set publié `f217735c…`
- Maître propre (37 liaisons Semantic, Divider, Button Icon, `.Favorite` exposé).
- Combinaisons `Select / Open=True` et `Collapsible / Open=True` absentes : `Open` ne s'applique qu'à `Type=Slot` ; soit l'expliquer dans la description, soit faire de `Open` un booléen.
- Page non normalisée (voir T5), statut 🟢🟢 trompeur. Dernière publication du set : 2026-11-04, alors que la description et `.Favorite` 2074:1404 sont plus récents : **republier** après revue.
- Row 679:5381 et 680:5246 (Type Select / Collapsible) : rayons 8, traits 1 / 2, paddings 16 / 8, gaps 16 / 8 bruts. Row 679:5294 : non utilisé par Horizontal Card mais publié, fond #ffffff brut, `qrn` blue/600, `Frame 283…286`. Trois sets publiés s'appellent « Row ».
- `.Data` 679:5489 : `Frame 225 / 282 / 327 / 328 / 329`, `Text` ×6, fond #f4f4f4 brut, rayon 4, styles `Copy/Medium (16)/*`. `.Order`, `.Action` ×2 : paddings 12 / 16, rayons 8, gap 10 bruts, texte `.Order` brut.

### Grade (628:17016), set publié `0a9375b0…`
- 683 liaisons Semantic, aucune valeur brute ; mais **63 textes en styles `Copy/*`** hors Tokens (T2).
- 44 variantes sur 88 combinaisons : cohérent (la note `-` ne vaut que pour N/C et N/A).
- Statut : WIP en `Versionning`, `ready` en JSON (Note 6, toujours vrai).

### Policy color (1655:14105), set publié `8d192e17…`
- 176 liaisons Semantic ; trait `Badge` #000000 brut (×2) ; 14 textes en `Copy/*`.
- Version 0.2.0 Draft cohérente avec `components.json` ; page 🔴🔴 ; section `To review` remplie de rectangles de travail aux couleurs brutes nommés en CSS.

### Accordion (281:546) et `.Title` (720:65)
- Accordion : gap 10 de `Container` brut (×9) ; à arbitrer (pas de Semantic 10).
- `.Title` : `foundation-h2` (×4, style hors Tokens) et une liaison **Foundation en direct** `Font/Line Height/24` ; `Size` M / S sur `.Title` sans équivalent dans `ds-accordion`.
- Statut WIP / `ready` (connu).

### Timeline (1491:927), Timeline Title (381:422), Timeline Line (381:236)
- Timeline : propre (Semantic, chevrons NDBX).
- Timeline Line : 44 liaisons `qrn` `light/tag/label/error-reverse`, padding gauche 10, rayon 1000 brut, calques `Ellipse` (cadre), `Line 1`, `Copy/X-Small (12)/Semibold`.
- Timeline Title : calque `Ellipse 6`, `Copy/Small (14)/Bold`.
- Ces deux atomes sont décrits « Private atom » mais **publiés** (nom sans `.`) : préfixer d'un `.` s'ils ne doivent pas être posés seuls. Risque : préfixer dépublie, les instances directes éventuelles se figent (vérifier qu'il n'y en a que dans Timeline et Timeline Event).

### Timeline Event (381:438). Bloquant
- Composition : `Data Display 👔` (`7bc7072b…`, ancienne librairie, masqué sans booléen) et Slot déprécié (`f8a4fe08…`) pour `Content=Slot`.
- Gap 60 brut, `Separator/Line` #e6e6e6 brut, calques `Line`, `Text`, 14 textes `Copy/Small (14)/*`.
- Pas de `Versionning` dans sa section.
- Correctif : remplacer `Data Display 👔` par un `Properties Panel` / texte local lié, et l'ancien Slot par un slot natif. Risque moyen : le contenu posé dans l'ancien Slot par les consommateurs serait perdu.

### Identifier (2009:105), glyphes locaux
- Identifier : propre (75 Semantic, `Body/S/Regular`, Icon Functional). Code : `State=Hover` et booléen `Focus` sans input (états CSS en code) : acceptable.
- Glyphes `🆕 Hash`, `🆕 Grid`, `🆕 Contract`, `🆕 File Text`, `🆕 File New` : remplissage `Shape` #404040 brut. Ils sont posés dans `Icon Functional` : sans liaison au Semantic d'icône, la couleur ne suit pas le thème. Lier `Shape` au Semantic icône. Absence de NDBX déjà notée dans les `Versionning`. Risque : faible (couleur).

### Icon Tile (2020:358), Progress Bar (2024:313), Chart (2060:338), Pie Chart (2118:177), Action Card (2117:1081)
- Icon Tile, Progress Bar, Action Card : propres. Progress Bar : padding droit 96 laissé brut volontairement ; mode `indeterminate` du code non dessiné (noté).
- Chart : `Grid` Vertical / Both contre `showGrid` booléen, `showDots` et `invertY` sans équivalent Figma.
- Pie Chart : COMPONENT sans set confirmé, voir T5.
- Action Card : `Standard / Selected=True` absent, cohérent (`Selected` ne vaut que pour Selectable).

### List Item (2059:394). Bloquant
- Propre côté jetons (Semantic, `Body/S/Regular`), mais l'instance **Link `b9493d2f…` pointe le Link retiré et dépublié** 171:3074. Échanger vers `77367a8f…`. Risque : vérifier que le calque libellé porte le même nom pour conserver les libellés surchargés.

## Corrections priorisées

1. **List Item** : swap du Link `b9493d2f…` vers `77367a8f…` sur le maître (vérifier le nom du calque libellé). Puis contrôler les autres librairies pour la même clé.
2. **Table Row en double** : compter les instances des clés `a358c00c…` et `4a0ebfc7…` dans les fichiers consommateurs, dépublier celle qui reste marginale.
3. **Composants obsolètes publiés** (T4, ≈ 20 maîtres : anciens Topbox, Data / Data V2, Tabs, ancienne table, ☠️, Frame 243 / 245, Row 679:5294, Task) : préfixer pour dépublier, après comptage d'usage ; renommer les homonymes gardés (Widget Card, Collapsible Table Info).
4. **Timeline Event** et **Card Type=Slot / `.Settings`** : remplacer le Slot déprécié par un slot natif et `Data Display 👔` par du contenu lié ; migrer les écrans consommateurs qui ont posé du contenu dans l'ancien Slot.
5. **Collection `qrn`** (T1) : remplacer les ≈ 550 liaisons par les Semantic Tokens de même valeur (priorité `.Columns`, Table Header, Timeline Line), puis désabonner `qirin--variables`.
6. **Atomes de Card** (`.Columns`, `.Layout`, `.Key Info`, `.Company Profile`) : audit de surcharges dédié, puis styles de texte Tokens et Semantic d'espacement ; sortir l'illustration unDraw de `.Settings` ; renommer `Hightlighted*` ; Grade `5ac10c1b…` vers le Grade local.
7. **Styles de texte hors Tokens** (T2) : table de correspondance valeur par valeur, puis Grade, Policy color, Timeline, `.Page Title`, `.Title` d'Accordion (et sa liaison Foundation `Font/Line Height/24`).
8. **`.Topbox Content`** : Grade et Policy color locaux au lieu de la copie publiée, Flyout Menu courant, glyphe `🆕 Hash` au lieu du vecteur redessiné, calques renommés, booléen pour les actions masquées. Ne pas toucher à la famille du texte `ID`.
9. **Header Selection** : ajouter la case à cocher select-all pilotée par booléen.
10. **Card set** : rayons, paddings (dont le 25 parasite) et traits vers Semantic, après audit de surcharges (risque élevé sur le padding).
11. **Pages** : normaliser Horizontal Card et Topbox, ajouter les blocs `Versionning` manquants (12 sections), remplir celui de Table Row, vider les sections `To review`, aligner les statuts WIP / Draft avec `components.json`, republier Horizontal Card.
12. **Code** (faible) : décider de la taille S de Table Cell, du `Size` de `.Title` d'Accordion, des options de Chart ; ajouter un lien de documentation (ZeroHeight ou Storybook) sur chaque composant publié.
