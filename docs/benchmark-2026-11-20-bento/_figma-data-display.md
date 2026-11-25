# Figma, Widget Card 2.0 dans Data Display : rapport (2026-11-23)

Librairie `[Components] Data Display` (`VpConH5AUGyCqtp8PMqj1i`). Source lue en lecture seule : page Card kit `78:20` du
fichier Bento `XW7jVtIa6UWRTqKMDqOF5D` (et `Card toolbar` `51:3660` de la page Edit flow), dans son état mis à jour par
l'autre agent (liseré retiré, raison dans `.Card Header`, slots `Plot`, Group heading). Rien publié, rien modifié dans
Bento, aucune variable, collection ni style créé, rien commité.

## Méthode

Le Plugin API ne copie pas d'un fichier à l'autre : chaque maître a été sérialisé dans Bento (structure, auto-layout,
variables par clé, styles de texte par clé, instances de librairie par clé, surcharges d'instance, propriétés et
références) puis reconstruit à l'identique dans Data Display. Les captures avant/après ont été comparées côte à côte
(Delta et Widget Card 2.0 identiques au pixel près, après une correction : le ton du `.Status` imbriqué, que la
sérialisation n'avait pas relevé, a été reposé sur les 5 variantes de statut).

## Pages et sections

| Page | id | Section | id | Contenu |
|---|---|---|---|---|
| `🆕 Widget Card 2.0` (après `🆕 Chart`) | `2240:117` | `Widget Card 2.0` | `2249:451` | Versionning `2249:517` - 01 Component `2249:452` - 02 Documentation `2250:474` - 03 Do/Don't `2251:682` |
| `🆕 Data viz` | `2253:117` | `Data viz` | `2253:118` | 01 Component `2253:119` : chaque atome, une card None et une card Strong |

Gabarit : `page-kit.js` (`shell`, `section`), logo cloné du gabarit Widget Card (`1448:11027`), Versionning cloné de
`2218:1676` (v2.0.0, 23 Nov 2026, pastille WIP). Documentation : Anatomy, Properties, Formats (1x1 à 4x2), States, Notes.
Do/Don't : 3 règles (titre sur une ligne, dire pourquoi, jamais de card vide), frames `do · ...` / `dont · ...`.

## Maître Widget Card 2.0 (`2244:1293`)

- 12 variantes : Emphasis None `2244:237`, Subtle `2244:279`, Strong `2244:309`, Negative subtle `2244:353`, Warning
  subtle `2244:384`, Positive subtle `2244:414`, Negative strong `2244:445`, Warning strong `2244:474` (State Default) ;
  Loading `2244:503`, Empty `2244:548`, Error `2244:589`, Edit `2244:1229` (Emphasis None).
- Propriétés : `Emphasis`, `State` (variantes), `Content#2244:0` (slot), `Footer#2244:13` (booléen, off).
  `.Card Header` et `.Card Footer` exposés.
- Taille libre, 376 x 376 par défaut. Padding Spacing/M, gap Spacing/S, rayon Border/Radius/M, bord Border/Size/S.
- Niveaux subtle : teinte + bord 1 px complet dans le ton (Q4 validée, plus de liseré 4 px). Subtle : bord neutre + étoile.
- Raison : 2e ligne de `.Card Header`, activée sur Negative subtle, Warning subtle, Negative strong, Warning strong (Q1).
- Warning selon le Badge (passe 4). Edit : `.Card Toolbar` à cheval sur le bord haut, centrée.

### Atomes internes (préfixe « . », non publiés)

| Atome | id | Propriétés |
|---|---|---|
| `.Card Header` | `2243:1034` | Title, Info, Status, Unit, Unit text, Action, Reason, Reason text ; Reversed ; `.Status` exposé |
| `.Status` | `2241:217` | Tone (Highlighted, On track, Warning, Problem) x Reversed |
| `.Card Footer` | `2241:1130` | Date text ; Type (Date, Link) x Reversed ; Link exposé |
| `.Delta` | `2240:210` | Delta text ; Direction x Tone x Reversed (12) ; exposé dans Key Figure |
| `.Empty Hint` | `2243:1065` | Message, Icon, Link ; Reversed (contenu de State Empty) |
| `.Card Toolbar` | `2243:204` | aucune (reconstruit : pas d'équivalent en librairie) ; ombre = style Shadows/Bottom/400 |
| `.Toolbar Size` | `2243:203` | Label ; Selected |

## Atomes génériques (à publier, page Data viz)

| Atome | id | Propriétés |
|---|---|---|
| Key Figure | `2245:463` | Value, Unit, Unit text, Delta, Context, Context text ; Reversed |
| Sparkline | `2245:472` | Plot (slot pré-rempli : série + point final) ; Reversed |
| Bullet Graph | `2245:487` | Legend, Bound, Plot (slot pré-rempli : Fill + Marker) ; Reversed |
| Stacked Bar | `2245:524` | Legend ; Reversed |
| Group Heading | `2245:531` | Label, Meta, Meta text ; Reversed |

Descriptions renseignées (usage, propriétés, code) sur les 13 maîtres.

## Ancienne Widget Card

`1325:10443` renommée `Widget Card (deprecated)`, description = consigne de migration. Rien supprimé, rien détaché.
9 instances dans le fichier (page Card) ; les usages dans les autres fichiers ne sont pas lisibles par le Plugin API.

## Recouvrements (rien créé)

- List row : pas d'équivalent publié (Properties Panel n'existe qu'en code ; `.Content` de Card est privé). Non créé,
  reste local à Bento : à trancher (question 1).
- Mini table row : recouvre Table Row + Table Cell + Table Header Row (publiés). Non créé.
- Progress : recouvre Progress Bar (publié, « with the number shown next to it »). Non créé.
- Empty hint : c'est le contenu de State Empty du maître : atome interne `.Empty Hint`, non publié.
- Task item, News item, Timeline item, Grade chip : non créés (locaux à Bento).

## Écarts avec le kit Bento

1. Noms : `Bento Card` -> `Widget Card 2.0` ; `Local · X` -> `Key Figure`, `Sparkline`, `Bullet Graph`, `Stacked Bar`,
   `Group Heading` ; `Local · Empty hint` -> `.Empty Hint` ; `Card toolbar` -> `.Card Toolbar` ; `Toolbar size` ->
   `.Toolbar Size`.
2. Sparkline `Last value` et Bullet Graph `Marker` : booléens retirés. Figma refuse de lier une propriété à un calque
   du contenu par défaut d'un slot ; le point et le repère se masquent ou se suppriment dans le slot.
3. Ombre de `.Card Toolbar` : style d'effet de librairie Shadows/Bottom/400 (même valeur que le kit, qui l'avait en brut).
4. Variantes du set Widget Card 2.0 en auto-layout 4 colonnes (Spacing M / XL) au lieu de positions libres.
5. Raison dans `.Card Header` (2e ligne) et non dans `.Status`, comme le kit mis à jour (le message de coordination
   la plaçait dans `.Status`) : à confirmer (question 2).
6. Textes des cadres de doc en Inter à tailles fixes (convention du page-kit, comme les autres pages de la librairie) ;
   tous les textes des composants et des contenus de doc sont en styles Tokens.

Contrôle « zéro valeur brute » sur les 13 maîtres : 0 peinture non reliée, 0 texte sans style, 0 effet brut, 0
espacement ou rayon non relié, 0 tiret cadratin (textes et descriptions).

## À re-pointer dans Bento après publication

- `Bento Card` (101 instances) -> Widget Card 2.0 (variantes une à une, mêmes noms de propriétés).
- `.Card Header`, `.Status`, `.Card Footer`, `.Delta` : suivent le maître (ne pas les re-pointer à part).
- `Local · Key figure`, `Local · Sparkline`, `Local · Bullet graph`, `Local · Stacked bar`, `Local · Group heading` ->
  Key Figure, Sparkline, Bullet Graph, Stacked Bar, Group Heading (relever les textes surchargés avant : les chemins de
  calques changent pour Sparkline et Bullet Graph, mémoire figma-nested-swap-overrides).
- `Local · Empty hint` (State Empty) et `Card toolbar` (State Edit) : remplacés par le maître.
- Restent locaux : Key figure row, List row, Mini table row, Progress, Task item, News item, Timeline item, Grade chip.

## Questions

1. List row : l'ajouter en librairie (pas d'équivalent publié) ou attendre un Properties Panel Figma ?
2. Raison : la garder dans `.Card Header` (kit actuel) ou la déplacer dans `.Status` ?
3. Nom publié : `Widget Card 2.0` (brief) ou `Widget Card` avec version 2.0 (recherche Q7) ?
4. Déclarer Key Figure, Sparkline, Bullet Graph, Stacked Bar et Group Heading comme instances préférées du slot Content
   (possible après publication) ?

## Passe 6 (variantes Reversed lisibles dans la doc)

Pages `🆕 Widget Card 2.0` (cadre 01 Component `2249:452`, section Private atoms) et `🆕 Data viz` (`2253:119`). Rien
publié, rien commité, aucune variable ni style créé.

- Chaque set qui a un Reversed est posé dans un cadre `Showcase - <atome>` (sans fond) avec, derrière le groupe
  Reversed=True, un fond `Reversed background` relié à Color/Static/Background/Brand (comme les cards Strong), rayon
  Border/Radius/M, et l'étiquette « Reversed » (Body/S/Semi Bold, Color/Static/Text/Subtle/Primary) en bas à gauche.
- Widget Card 2.0 : `.Card Header` `2279:856`, `.Status` `2279:859`, `.Card Footer` `2279:862`, `.Delta` `2279:865`,
  `.Empty Hint` `2279:868`. Data viz : Key Figure `2279:1150`, Sparkline `2279:1153`, Bullet Graph `2279:1156`, Stacked
  Bar `2279:1159`, Group Heading `2279:1162`.
- Composants inchangés (styles, propriétés, variantes). Seule exception, la disposition de deux sets : `.Status` et
  `.Delta` alternaient Default et Reversed ; leurs variantes Reversed=True sont passées en fin de set et la largeur du set
  ajustée (392 et 966 px) pour former une rangée Default puis une rangée Reversed. L'ordre des valeurs de propriétés ne
  change pas, les instances ne bougent pas.
- Contrôle : 0 peinture non reliée, 0 texte sans style, rayons reliés, 0 tiret cadratin sur les nœuds créés ; aucun
  variant Default sous un fond foncé. Captures vérifiées : Private atoms et Content de Data viz.

## Passe 7 (nom publié Widget Card, instances préférées du slot)

Réponses de l'utilisateur aux 4 questions. Rien publié, rien commité, Bento non touché.

- Nom (Q3) : component set `2244:1293` renommé `Widget Card` ; page `🆕 Widget Card` (`2240:117`), section `Widget
  Card` (`2249:451`), cadre `Documentation · Widget Card`, frames `do · Widget Card - ...` / `dont · Widget Card - ...`.
  Fils d'Ariane et titre des 3 cadres de doc : « Widget Card », pastille Version 2.0.0 (déjà en place) ; Versionning
  v2.0.0 inchangé. Textes d'intro (Private atoms, Documentation, Do/Don't, Data viz `2253:157`) et descriptions des 6
  atomes internes et de Key Figure : « Widget Card 2.0 » -> « Widget Card ». Description du maître : « Board widget
  card, v2.0.0: replaces Widget Card (deprecated). ». Les instances suivent le nom du maître. Plus aucune occurrence de
  « Widget Card 2.0 » sur les pages Widget Card, Data viz et Card.
- Ancienne `1325:10443` : nom inchangé `Widget Card (deprecated)`, description = « Deprecated (2026-11): migrate to
  Widget Card 2.0.0 for every new board widget. Migration: place Widget Card ... ».
- Collision de nom : le seul composant publié nommé exactement « Widget Card » est l'ancienne (`987bbbe7...`), dont le
  renommage en `(deprecated)` n'est pas encore publié. Publier les deux ensemble, sinon deux « Widget Card » coexistent
  dans la librairie. Aucun autre composant local de ce nom.
- Raison (Q2) : la doc dit bien 2e ligne de `.Card Header` (Anatomy, Properties, Notes) ; rien changé.
- List row (Q1) : reste local à Bento, rien créé.
- Instances préférées (Q4) : posées par `editComponentProperty('Content#2244:0', { preferredValues })`, l'API l'accepte
  sur un SLOT avant publication : Key Figure, Sparkline, Bullet Graph, Stacked Bar, Group Heading (COMPONENT_SET par
  clé). `allowPreferredValuesOnly` laissé à false (Progress Bar, Table Row et contenu local restent permis). Description
  du slot : « Preferred: Key Figure, Sparkline, Bullet Graph, Stacked Bar, Group Heading. Other content allowed. »
- Captures vérifiées : en-tête (`Qirin Components -> Widget Card -> Component`, Version 2.0.0) et cadre 01 Component.

## Passe 8 (4 écarts de construction relevés au re-pointage de Bento)

Écarts signalés par `_figma-repoint.md` (section 1), corrigés dans les maîtres. Rien publié (accord utilisateur à
demander), Bento et la librairie Layout non touchés, rien commité. Propriétés, noms de calques et structure inchangés :
seuls `textAutoResize` et `layoutSizing` bougent, les surcharges des instances restent valides.

| # | Maître | Calques | Avant | Après |
|---|---|---|---|---|
| 1 | `.Card Header` (`2243:1034`), 2 variantes | `Title row` > `Unit` (`2243:999`, `2243:1022`) | `textAutoResize = NONE`, 23 px fixes (« EUR k » coupé) | `WIDTH_AND_HEIGHT` (largeur auto) |
| 2 | Widget Card (`2244:1293`), 12 variantes | `.Card Footer` | `layoutAlign = INHERIT`, largeur fixe | `layoutSizingHorizontal = FILL` (`STRETCH`) |
| 3 | Widget Card, Loading / Empty / Error | slot `Content` (`2244:525`, `2244:570`, `2244:611`, masqué par défaut) | `FIXED` x `FIXED`, `layoutGrow = 0` | `FILL` x `FILL`, `layoutGrow = 1`, comme les autres états |
| 4 | Group Heading (`2245:531`), 2 variantes | `Meta` (`2245:527`, `2245:530`) | `textAutoResize = NONE`, 76 px fixes | `WIDTH_AND_HEIGHT` |

Vérification : 20 instances de test posées à côté de la page Widget Card (formats 1x1 180 x 180, 2x1 376 x 180, 2x2
376 x 376, 3x2 572 x 376 ; états Default, Strong, Loading, Empty, Error ; pied affiché, Unit « EUR k », Group Heading
avec Meta « 128 movements this year » dans le slot), puis supprimées (0 restante). Mesures : Unit 31 px en entier ;
pied à la largeur intérieure de la card sur tous les formats (même largeur que `.Card Header`) ; slot Content rendu
visible en Loading, Empty et Error (corps d'état masqué) : 290 px, la même hauteur qu'en Default ; Meta 129 px en
entier. Captures vérifiées : cadre 01 Component (`2249:452`) et page Data viz (`2253:119`), rendu inchangé.

Contrôle « zéro valeur brute » sur les 8 maîtres de la page Widget Card et sur Group Heading (hors cadre de set et
intérieur des instances d'autres librairies) : 0 peinture non reliée, 0 texte sans style, 0 effet brut, 0 espacement
non relié. Restent, hérités de maîtres d'autres librairies et non modifiés ici : rayon 4 de Button Icon (`Action`, et
les 3 boutons de `.Card Toolbar`) et `itemSpacing` du Functional Notice de l'état Error (Feedback, réparti en
space-between).

Après publication, côté Bento : les surcharges de compensation (largeur de Unit et de Meta, sizing du pied et du slot)
peuvent être réinitialisées ; à faire par un passage dédié, avec relevé avant et après.

### Signalé, non corrigé : voile du Modal (librairie Layout `bbgSPUChd18EVNGijjoZGn`)

Le voile du maître Modal (`2256:1556`) est une peinture noire brute à 35 %. Aucune couleur sémantique de voile n'existe
dans Tokens (Semantic publié : pas de Color/Overlay ; Foundation n'expose que 6 variables). Token adéquat existant :
**Semantic `Measurement/Opacity/Overlay`** (35 %, clé `ad43f78e3ae00bf22accc617d33951dc9065d269`, code
`--semantic-measurement-opacity-overlay` -> `--foundation-opacity-35`), à lier à l'opacité du calque voile, la peinture
passant à 100 % reliée au noir Foundation (`--foundation-color-black-000`) s'il est disponible dans Figma. Le code a le
même écart : `--semantic-color-overlay-backdrop: rgba(0, 0, 0, 0.35)` (brut, `_semantic.scss` l. 648). Créer une
couleur Semantic de voile serait une création de token : décision utilisateur.
