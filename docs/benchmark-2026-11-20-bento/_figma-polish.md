# Figma, passe de finition (2026-11-20)

Fichier « Qirin · Buyer Summary V2 (Bento) », `XW7jVtIa6UWRTqKMDqOF5D`. Pages traitées : 0:1, 1:2, 1:3, 1:4, 1:5, 29:2. La page Edit flow (44:2) n'a pas été touchée, aucune librairie n'a été modifiée, rien n'a été publié, rien n'a été commité.

## Conventions communes (toutes les pages)

- Au niveau racine, il n'y a que des Sections Figma, nommées « NN · Sujet ». Leur fond est lié à `Color/Static/Background/Main/Tertiary`. Elles se lisent de gauche à droite puis de haut en bas, avec 200 px entre deux sections.
- Dans chaque section :
  - 160 px de marge intérieure ;
  - en haut, un `Section header` : Title en Display/S/Bold, Description en Body/L/Regular, 960 px de large ;
  - 160 px sous le header commencent les blocs, avec 160 px entre blocs et 560 px entre écrans annotés.
- Annotations :
  - pastilles `Marker · N` de 24 px (rayon Round, fond Interactive/Background/Strong, chiffre blanc) ;
  - annotations natives courtes, 12 mots au plus ;
  - cadre `Notes · <sujet>` de 480 px, à 440 px à droite de l'écran, avec des items `Note · N` reprenant la même pastille.
- Nommage :
  - cards : `Card · <KINDS.short> · <format>[ · <emphase>]` ;
  - parties : Header, Title, Unit, Status, Tools, Key figure, Value, Delta, Context, Chart / Line, Chart / Point, Chart / Bars, Chart / Axis, Chart / Grid, Legend / Item, Table / Header, Table / Row, Table / Total, Facts, Fact, Footer, Link, Divider.
- Données et libellés repris de `buyer-summary-v2.data.ts` :
  - titres KINDS : la question à partir de 2 colonnes, le titre court en 1 colonne ;
  - libellés EMPHASES : Highlighted, On track, Warning, Problem ;
  - grade A3 partout ; Jobs to do à 8 tâches (2 high, 3 medium, 3 low).
- Contrôle par script final, sur les 6 pages :
  - aucun nœud hors section ;
  - aucune section à moins de 200 px d'une autre ;
  - aucun enfant hors de sa section ;
  - 0 groupe et 0 nom générique en dehors des calques internes d'instances de librairie.

## Read me (0:1)

La page était vide. Elle contient désormais la section `00 · Read me` (50:3799, 1600 x 1654).

- **`Cover` 50:3800**, 1280 x 640, sur le modèle des covers Search et Action :
  - fond Static/Background/Brand, padding et gap Spacing/3XL, rayon L ;
  - colonne `Identity` : logo Qirin (instance `.Logo Qirin` Reversed=True), eyebrow « QIRIN PROTOTYPE · BENTO EXPLORATION », titre « Buyer Summary V2 » en Display/L/Bold, objectif en une phrase ;
  - `Meta` : STATUS (Badge Info Strong « Exploration », sans icône), UPDATED 2026-11-20, SOURCE main · 91867644, ROUTE #/buyer-summary-v2 ;
  - `Visual · mini board` : 9 tuiles posées sur un fond de board (Background/Main/Secondary). Elles reprennent les emphases et les données du code : Grade A3, Exposure et Limit left en subtle, Payments 94 %, Overdues On track, Sanctions Problem strong, Limit review Warning, Score 82, 8 jobs.
- **`Guide` 51:4931**, 3 cards blanches (padding XL, rayon M, trait Border/Subtle/Tertiary) :
  - `Card · Pages` : lien vers chaque page (hyperlien interne) et une ligne de description ;
  - `Card · Emphasis legend` : 7 niveaux avec pastille de couleur et usage, et la règle « never the colour alone » ;
  - `Card · Credits` : prototype, données, benchmark, librairies, équipe, statut.
- Tout est lié aux variables Semantic et aux styles de texte Tokens.

## Formats (1:2 et 1:3)

Le niveau racine ne contient que des sections : fond Static/Background/Main/Tertiary, 200 px entre sections, lecture de gauche à droite puis de haut en bas. Dans chaque section : `Section header` à 160/160 (Display/S/Bold + Body/L/Regular, 960 px) ; 160 px plus bas, `Variants` (Normal et Highlight à 560 px d'écart, libellés `Variant · Normal` / `Variant · Highlight`) ; `Notes · <format>` à 160 px à droite. Chaque section est redimensionnée sur son contenu plus 160 px.

**Page 1:2** (cadre racine 8:11264 dissous)

| Rangée | Sections |
|---|---|
| 1 | `00 · Read first` 50:3790 : 5 cartes `Rule · Grid / Titles / Normal and highlight / Fold / Markers` |
| 2 | `01 · 1x1 · Square` 50:3758, `02 · 2x2 · Square` 50:3762, `03 · 3x3 · Large square` 50:3766 (venue de 1:3 ; l'ancienne section vide 27:1327 est supprimée) |
| 3 | `04 · 2x1 · Horizontal` 50:3770, `05 · 3x1` 50:3774, `06 · 4x1` 50:3778, `07 · Full width · Horizontal` 50:3782 |
| 4 | `99 · To review · duplicates` 50:3786 : anciens 3x2 et 4x2 en grade A6, cards suffixées « · Old », non supprimées |

**Page 1:3**

| Rangée | Sections |
|---|---|
| 1 | `00 · Read first` 51:5034 |
| 2 | `01 · 1x2 · Vertical` 10:1893, `02 · 1x3` 25:3331, `03 · 1x4` 25:3674 |
| 3 | `04 · 3x2 · Block` 26:5026, `05 · 2x3` 26:4739, `06 · 4x2` 27:998, `07 · 4x3` 17:1096 |

Les anciens cadres `Content` (padding 64) sont retirés. Les descriptions sont réécrites : taille, sujet, contenu, repli à 2 et 1 colonne.

**Données alignées sur buyer-summary-v2.data.ts**
- 1x1 « Score », « Stable since Jan 24 ».
- 2x2 « Is the latest request covered? », historique COVER_HISTORY (11 Nov 2024 Approved, 14 Mar 2024 Partial, 02 Oct 2023 Approved), « Request history », C. Morel, « View all requests ».
- 2x1 « Does the buyer pay on time? », légende On time / 1 to 30 days / 30+ days.
- 3x1 « How much are we exposed? », « +232 000 since May 24 ».
- 4x1 « Is the latest request covered? ».
- Full width « Where does the buyer stand? » : A6 passé en A3 (instance Grade, normal et highlight), « Up from A4 » en ton Positive, libellés On time, Overdue, Latest cover.
- 1 colonne (KINDS.short) : Overdues, Jobs to do, News.
- Jobs : 8 open jobs, « 2 high, 3 medium, 3 low », barre recalculée, « Open all jobs (8) ».
- News : « Open newsfeed (10) ».
- 4x3 : taux mensuels PAYMENT_MONTHS (barres et tableau recalculés), meilleur et pire mois.
- Déjà conformes : 3x2 (A3, GRADE_CHANGES), 2x3 (FINANCIALS), 4x2 (POLICIES).

**Renommages** (environ 330 calques) : cards `Card · <short> · <format>` (+ `· Highlight`) ; Header, Title, Tools, Key figure, Delta label, Divider ; Chart / Point, Chart / Sparkline, Chart / Line, Chart / Grid line · vertical|horizontal, Chart / Bars, Chart / Bar · X, Chart / Year · X, Chart / Month · X ; Bar / Track, Bar / Fill ; Table / Header, Table / Row · X, Table / Total.

**Annotations** : sur la card normale de chaque section, une annotation native courte (« 1 to 4 · Anatomy: question, figure, micro-viz, fold ») avec 560 px libres à droite ; pastilles `Marker · 1..4` (titre, chiffre clé, micro-visualisation, coin haut droit) ; cadre Notes de 480 px avec 4 notes numérotées.

**Contrôle par script** : rien hors section, aucun chevauchement, aucun nom générique, aucun remplissage ni trait non lié, rien ne sort d'une card, aucun titre sur deux lignes, marges de 160 px tenues (pastilles exceptées).

**Restant**
1. Pastilles à cheval sur le bord gauche des cards (12 px dans la marge) au lieu de -12/-12, qui masquait la première lettre des titres.
2. Grille : les pages Formats restent en colonne de 172 px (brief), le board 1280 est en 180 px. C'est écrit dans la carte « Grid ».
3. 2x1 : la barre empilée frôle le bouton menu de la Widget Card, rien n'est coupé.
4. Valeurs supposées absentes des mocks : 4x1 « Requested 04 Nov 2024 », « Valid until 11 Nov 2025 » ; 1x2 « No change vs Oct 24 » et bande 12 mois ; 4x3 nombre de factures, « +2 pts », délai moyen ; 3x3 « +17.6 % vs May 24 ».
5. Il reste des textes sans style, uniquement dans les instances de librairie (Badge, Grade).
6. Section 99 à supprimer après accord.
7. Deux constructions de cards : instances Widget Card sur 1:2, cadres custom sur 1:3. À unifier quand le maître Card aura une propriété Emphasis.

## Board · 1280 (1:4)

**Organisation**
- `01 · Board at 1280 px` 55:6082 (0, 0, 2520 x 2792) : Section header, puis l'écran 8:8034 `Board · 1280 · Read`, 440 px libres, et le cadre `Notes · Board at 1280 px` 55:6086 (480 px).
- `99 · To review · old edit screen` 55:6118 (x 2720) : l'ancien écran 20:1521, renommé `Board · 1280 · Edit (old)`, est déplacé tel quel avec une phrase d'explication. Son menu Move before/after contredit la règle du glisser-déposer seul, et le flux d'édition est sur la page Edit flow. Ses données restent celles d'avant (16 cards). À supprimer après accord.

**Grille**
- Grille 8:9104, renommée `Board` : 6 colonnes x 10 rangées de 180 px, gouttière Spacing/M, 60 cellules occupées sur 60.
- L'écran passe à 1280 x 2216, hauteur automatique.
- Le placement est identique à packCards :

| Card | Format | Position |
|---|---|---|
| Grade (Strong) | 3x2 | r1c1 |
| Exposure (Subtle) | 3x1 | r1c4 |
| Limit left (Subtle) | 1x1 | r2c4 |
| Payments | 2x1 | r2c5 |
| Overdues (On track) | 1x2 | r3c1 |
| Financials | 2x3 | r3c2 |
| Jobs to do | 1x4 | r3c4 |
| News | 2x2 | r3c5 |
| Score | 1x1 | r5c1 |
| Risk figures | 1x1 | r5c5 |
| Notes (étirée) | 1x2 | r5c6 |
| Company | 2x1 | r6c1 |
| Sanctions (Problem, strong, nouvelle 51:5038) | 1x1 | r6c3 |
| Limit review (Warning, nouvelle 51:5054) | 1x1 | r6c5 |
| Decisions | 2x1 | r7c1 |
| By policy (étirée) | 4x3 | r7c3 |
| Coverage | 2x2 | r8c1 |
| At a glance | pleine largeur | r10 |

**Emphases et statuts**
- Le statut est une icône plus un libellé, comme dans le code : Highlighted, On track, Warning, Problem.
- Le badge « None open », illisible sur fond vert, devient une icône plus un libellé.
- Text/Main/Tertiary est remplacé par Secondary sur toutes les teintes.

**Données**
- Jobs : 8 tâches, barre 2 / 3 / 3, « Due 11 Nov », « + 2 more jobs ».
- News : « 5 more in the newsfeed ».
- Notes : 14 notes, dont 3 affichées.
- Company en 2x1 : 4 faits.
- By policy en 4x3 : chiffre clé 1 548 000 avec 3 faits, puis les 12 « Limit movements » (POLICY_MOVES). La note fausse « Share bar scaled to the largest share (40 %) » est supprimée.
- Sanctions : 1 hit, List EU, Screened 28 Oct 2024.
- Limit review : 02 Dec, Last review 12 Jun 2024, Owner C. Morel.

**Annotations**
- Pastilles `Marker · 1` à `· 5` et annotations natives courtes, avec au moins 392 px entre deux nœuds annotés.
- Sujets : grille et ordre de remplissage, emphases, Notes étirée, By policy étirée, bord bas et barre d'outils.

**Renommages**
- Cards : `Card · <short> · <format>[ · emphase]`.
- Rule devient Divider (38 calques) ; Key value et Key row deviennent Key figure (16).
- Tableau : Table / Header, Table / Row · n, Table / Total.
- Meta devient Unit.
- Environ 300 textes nommés d'après leur contenu sont renommés selon leur rôle : Value, Context, Label, Cell, Tick, Note text.

**Contrôle par script** : propre, sauf la piste « Progress Bar · 0 % » de Payments, qui dépasse d'environ 1 px. C'est une instance de librairie : invisible, mais non corrigée.

**Restant**
- Code en cours de modification par un autre chantier :
  - `data.ts` est modifié sans commit (types claims et external-rating) ;
  - `buyer-summary-v2.boards.ts` est nouveau, avec une emphase « auto » sur Limit, Overdues, Sanctions et Limit review ;
  - le serveur 4450 affichait l'erreur TS2739, donc l'app n'a pas été capturée.
  - Le board suit DEFAULT_CARDS tel qu'il est aujourd'hui : à revérifier après la fusion.
- Paddings : 16 px partout, alors que le code passe à 16 / 24 à partir de 3 colonnes.
- Icônes de statut : 16 px, contre 12 dans le code.
- Sanctions et Limit review : construites à partir de Risk figures, non clonées depuis 29:2 (page modifiée en parallèle).

## Board · 1920 (1:5)

**Organisation**

| Section | nodeId | Contenu |
|---|---|---|
| `01 · Board at 1920 px, 8 columns` | 58:8846 (0, 0, 3160 x 2648) | écran `Board · 1920 · 8 columns` 8:9907, Notes 58:8850, 4 pastilles |
| `02 · Fold at 1024 px, 4 columns` | 58:8876 (3360, 0, 2264 x 4028) | écran `Board · 1024 · 4 columns` 26:917, Notes 58:8880, 5 pastilles |

L'ancien cadre `Notes · grid and fold` (27:2802) est supprimé. Son texte est repris, mis à jour et réparti dans les deux nouveaux cadres Notes.

**Board 1920** (grille 8:10250, 8 x 8, colonnes de 211 px)
- Disposition exacte de packCards : 18 cards, 64 cellules sur 64.
- `Limit · 4x1` (21:3059) est supprimée. Trois cards neuves sont ajoutées : Limit left 1x1 Subtle (53:6307), Sanctions 1x1 Problem strong (53:6329) et Limit review 1x1 Warning (53:6351).
- Les emphases du code s'affichent par icône et libellé.
- Les boutons « Card options » sont retirés : le code n'a pas de menu en lecture. Les unités suivent le code (USD, USD k).
- Données :
  - Jobs : 8 tâches.
  - Notes 1x5 : 13 notes et « 1 more note ».
  - Company 2x1 : 6 faits.
  - Decisions 2x1 : 3 lignes et « 12 older decisions ».
  - Coverage 2x3 : exposition contre la couverture (77 %), courbe, 6 demandes.
  - By policy 4x2 : sans courbe, comme dans le code sous 3 rangées.
- Les liens de pied absents du code sont remplacés par du contenu réel.

**Board 1024** (grille 26:927, 4 x 14, colonnes de 214 px)
- Reconstruit en clonant les cards du 1920, sur la disposition 4 colonnes du code : 56 cellules sur 56, 14 rangées au lieu de 15.
- Cards propres au repli :
  - Notes 1x1 ;
  - Decisions 3x1 ;
  - Payments 2x2 (26:3293, mois par mois) ;
  - Coverage 2x2 (26:3237) ;
  - At a glance 4x1 (26:5027), qui garde 4 indicateurs sur 7.

**Renommages**
- 234 calques renommés.
- Graphiques : Line devient Chart / Line, Sparkline devient Chart / Sparkline, Stacked bar devient Chart / Bars, Bullet graph devient Chart / Bullet, Grid line devient Chart / Grid.
- Légendes : Rectangle devient Swatch.
- Row devient Meta, Fact, Outcome ou Cell selon son rôle ; Key value devient Key figure ; Text devient Note text, Event text ou Headline selon son rôle.

**Restant**
1. Jobs to do garde environ 400 px vides en 1x5 (1920) et environ 100 px en 1x4 (1024) : le code étire la card, mais il n'y a que 8 tâches.
2. Quelques détails du template diffèrent encore :
   - Overdues affiche « 0 total overdue » au lieu de « None open » ;
   - la légende de Payments reste en ligne ;
   - Financials garde la courbe avant le tableau.
3. L'étoile de Strong est en blanc : `icon-favorite` n'a pas d'équivalent en variable.
4. Le badge Success Light « Closed » sur la teinte verte se lit mal : il faudrait icône et libellé.
5. Valeur clé à 28 px dans le code à partir de 2 colonnes : pas de style Tokens, Title/H2 est gardé.
6. Le liseré subtle n'est pas homogène : les cards clonées ont `strokesIncludedInLayout`, les trois neuves non. L'écart est invisible.

## Emphasis levels (29:2)

Sections sur une ligne, 200 px d'écart : `01 · Emphasis scale` 53:15296 (0, 0, 2648 x 2666 : Scale 35:122 + Notes 53:15300) ; `02 · Pale blue on the page` 53:15321 (2848, 0, 2524 x 1020 : Options 37:60 + Notes 53:15325) ; `03 · On a board` 53:15333 (5572, 0, 2520 x 2596 : Board 39:2685 + Notes 53:15337).

- Chaque section : marge 160, Section header (Display/S/Bold + Body/L, 960 px), 160 px avant le bloc, 440 px libres, cadre Notes au format commun. Anciens titres internes (35:123, 37:61, 37:62) passés dans les headers. Scale et Options gardent leur fond Background/Main/Secondary (contrastes mesurés dessus). Ancien Notes 43:890 remplacé par 53:15337, contenu repris et mis à jour.
- Annotations : pastilles `Marker · N` (01 : lignes Subtle, Problem, Warning strong ; 02 : option D ; 03 : Grade, Exposure, Overdues, Limit review, Sanctions), mêmes numéros dans les Notes. Annotations natives courtes sur 35:198, 35:329, 35:529 ; une seule sur le parent pour 37:60 et 39:2685 (les cards du board n'ont pas 440 px libres à droite).
- Cohérence code : niveaux renommés comme EMPHASES (None, Subtle, Strong, Problem, Problem strong, Warning, Warning strong, On track, On track strong) ; en-tête titre à gauche, icône + statut à droite (Highlighted, Problem, Warning, On track) ; Star Filled sur Subtle et Strong ; cards 2x1 restructurées (Header puis Body Main | Details) ; titres KINDS (Sanctions, Limit review, Exposure, Overdues) ; données sanction « 1 hit to clear, namesake suspected » et revue « 02 Dec, annual review of the 5.00 M limit, in 12 days ».
- Board 39:2685 : emphases du code (Grade Strong, Exposure passé en Subtle, Limit left Subtle, Overdues On track, Limit review Warning, Sanctions Problem strong). Jobs to do : 8 jobs, barre 2 / 3 / 3, légende « 2 high, 3 medium, 3 low », 7 visibles + « + 1 more job ». Grade A3 partout.
- Renommages : cards `Card · <short> · <format> · <emphase>` (ex. `Card · Sanctions · 1x1 · Problem, strong`, `Card · By policy · 4x2`, `Card · News · 2x2`) ; `Top` devient `Header` ; `Level · Subtle · brand` devient `Level · Subtle` ; 39:3134 `Group` devient `Label` ; 39:3259 `Text` vide devient `Status · empty` ; parties du Jobs : `Segment · High`, `Legend / High`, `Badge · Priority`.
- Contrôle par script : rien hors section, 0 groupe, 0 nom générique hors instances de librairie, aucun contenu hors padding (34 cards), 440 px libres à droite des nœuds annotés.

Restant : le board d'exemple garde 16 cards (Limit review et Sanctions à la place de Risk figures et Notes) alors que le code en a 18 ; contextes repris du code en minuscule ; noms `Vector` dans les instances de librairie (Header, Topbox), non renommables ; cartes de la section 02 gardent le statut « Headroom » (illustration de fond).

## Problèmes transverses à arbitrer

1. **Code en mouvement.** Un autre chantier a modifié `buyer-summary-v2.data.ts` sans commit (types claims et external-rating) et ajouté `buyer-summary-v2.boards.ts` (emphase « auto » sur Limit, Overdues, Sanctions et Limit review). Le serveur 4450 était en erreur TS2739, l'app n'a donc pas pu être capturée. Les boards suivent DEFAULT_CARDS tel qu'il est aujourd'hui : à revérifier après la fusion.
2. **Board d'exemple de 29:2.** Il garde 16 cards : il faudra y recloner le board aligné de la page 1:4.
3. **Unité de grille.** Les pages Formats sont en 172 px (brief), le board 1280 en 180 px, le 1920 en 211 px et le 1024 en 214 px. Ce choix est documenté dans les Notes.
4. **Deux constructions de cards.** Sur 1:2 ce sont des instances Widget Card, ailleurs des cadres custom. À unifier quand le maître Card aura une propriété Emphasis.
5. **Écarts de détail avec le code.** Paddings à 16 px (le code passe à 24 px à partir de 3 colonnes), icônes de statut à 16 px (12 px dans le code), pas de style 24 ou 28 px semi-bold pour les valeurs clés, pas de `tnum`.
6. **Sections « 99 · To review ».** Sur 1:2, les doublons 3x2 et 4x2 de l'ancienne page, encore en grade A6. Sur 1:4, l'ancien écran Edit avec son menu Move. À supprimer après accord.
7. **Pastilles des pages Formats.** Elles sont à cheval sur le bord gauche des cards et non à -12/-12, pour ne pas masquer la première lettre du titre.
8. **Calques `Vector` internes** aux instances de librairie (Header, Topbox) : non renommables depuis ce fichier.

