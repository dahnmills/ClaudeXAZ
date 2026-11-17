# Lot 2 (et partie sûre du lot 3) : librairie Data Display (`VpConH5AUGyCqtp8PMqj1i`), 2026-11-17

Brief : `docs/figma/_lot2-brief.md`. Rien publié, aucun commit, aucun token, collection ou mode créé. Chaque écriture sur un
maître est faite dans un seul `use_figma` avec signature avant / après (boîtes absolues, couleurs résolues, polices, tailles,
interlignes) sur le maître et toutes ses instances du fichier ; un écart lève une erreur et annule l'appel entier.

## Fait

### Dépublication des obsolètes (préfixe `.` + description « Deprecated… use X »)
Clés conservées, dimensions vérifiées identiques. Ancien Cell 38:13911 et les deux Table Row **non touchés** (migrations).

| nodeId | Ancien nom | Nouveau nom |
|---|---|---|
| 424:18949 | Topbox | `.☠️ Topbox` |
| 338:6573 | [☠️] Topbox | `.☠️ Topbox (first version)` |
| 1131:9417 / 1131:7830 / 1630:16043 | Topbox V2 - Variation 1 / 2 / 4 | `.☠️ Topbox V2 - Variation 1 / 2 / 4` |
| 1445:9407 | topbox2026--usertesting | `.☠️ topbox2026--usertesting` |
| 1134:14617 / 1167:18974 | Data / Data V2 | `.☠️ Data` / `.☠️ Data V2` |
| 256:1468 | Tabs | `.☠️ Tabs (old Topbox)` |
| 33:1985 | Table Header (ancienne table) | `.☠️ Table Header (first table)` |
| 55:2722 | ☠️ Table Line | `.☠️ Table Line` |
| 909:5838 / 909:3041 | ☠️ Collapsible Table / Row | `.☠️ Collapsible Table` / `.☠️ Collapsible Table Row` |
| 381:171 | ☠️ Timeline | `.☠️ Timeline` |
| 381:483 | Frame 243 | `.☠️ Timeline layout helper` |
| 381:491 | Frame 245 | `.☠️ Timeline Event content` |
| 679:5294 | Row (Horizontal Card v0) | `.☠️ Row (first Horizontal Card)` |
| 1:92 | Task (Checklist) | `.Task` |

### Renommages
- Sets mal nommés : Widget Card 1325:10443 (« Card » vers `Widget Card`), Collapsible Table Cell 973:469 vers `.Collapsible Table Info`
  (dépublié, reste imbriqué dans 909:2473), Row 679:5381 vers `Row - Collapsible`, Row 680:5246 vers `Row - Select`.
- 18 cadres `_Design system header` vers `Component` (toutes les pages).
- Calques génériques des maîtres vivants (même nom dans toutes les variantes d'un set) : `.Layout` (Frame 15 / 16 vers Header),
  `.Columns` (Frame 33 vers Pair, x12), `.Missing Data` (Header, Message), `.Company Profile` (Loading identifiers), `.Topbox Content`
  (Policy line / identity, Buyer line / identity, Separator), `.Data` (Value and icon, Edited content, Value wrapper, Value box),
  Timeline Line (Dash line), Timeline Title (Status dot, x5). Page Timeline : Frame 241 vers `Timeline Event and atoms`.
  Page Horizontal Card : Frame 331 vers `Legacy atoms`, Frame 332 vers `Row example`, 2e en-tête vers `Demo`.

### Sections To review supprimées (aucune ne contenait de COMPONENT)
| Section | Contenu supprimé |
|---|---|
| 2163:24539 Table Row - To review | 39:14317 (2e gabarit) |
| 2163:24674 Table Cell - To review | 74:7714 (instance orpheline Table Cell) |
| 2163:25314 Collapsible Table - To review | 909:18634 (gabarit « Demo ») |
| 2164:19099 Page Header - To review | 1709:18695 (anatomie annotée), 1712:20297, 1712:20498, 1712:19867, 1712:19880, 1712:19870, 1712:19874, 1712:20658 |
| 2155:27953 Grade - To review | 1460:3222 (2e gabarit), 1517:13490 (instance Grade) |
| 2161:27128 Policy color - To review | 1655:14301 (2e gabarit), 1659:14392 à 1659:14404 (6 textes, 6 rectangles) |
| 2164:23397 Accordion - To review | 1453:14933 (2e gabarit), 1453:13944 (gabarit « Demo ») |
| 2176:1856 Timeline - To review | 1491:2576 (2e gabarit), instances 515:18626, 381:2669, 381:477, 381:482, 381:485, 381:486, frames 381:478, 381:487 |
| 2166:20150 Identifier - To review | 2007:276 (2e gabarit) |

À noter : `layout/page-header.md` embarquait 1709:18695 et `accordion.md` citait 1453:13944 : ces deux renvois sont à retirer
(ou à restaurer depuis l'historique Figma si l'utilisateur veut garder ces cadres).
Aussi supprimée : la section vide `Archives` 1891:19767 de la page Topbox.

### Pages normalisées
- **Topbox** : les 62 nœuds d'exploration (sections Deprecated, Current Version, Section 1, Useberry, Final - overlay, Version
  finale, Déclinaison policies, Proto Layout, vecteurs, captures, notes Useberry, 16 composants dépubliés ou privés) sont
  déplacés tels quels (mêmes coordonnées, mêmes ids) sur la page `Archives` 1452:1720, qui était vide. La page Topbox ne garde
  que les 4 sections Page Header, Topbox, Breadcrumbs - Topbox, Tabs - Topbox.
- **Horizontal Card** : une section `Horizontal Card` 2215:1479 : Versionning 1453:13637 | Component 680:9920 (restylé, bandeau
  Hero 2215:1475) | Demo 680:12350 | Type=Slot · Notes 2046:1393 | Legacy atoms 679:14531. `.Favorite` 2074:1404 (qui chevauchait
  la note) rangé dans le cadre des atomes 680:9973. Pas de Documentation ni de Do/Don't (aucun doc kit pour ce composant).
- Contrôle final sur toutes les pages : aucun chevauchement, aucun débordement de section.

### Versionning et statuts (alignés sur `components.json`)
- 12 blocs créés (copie du bloc de Grade, posés en tête de ligne à 160 px, cadres existants décalés d'autant) : Card 2218:1644,
  Widget Card 2218:1676, Table Cell 2218:4144, Table Cell Header 2218:4175, Table Cell Selection 2218:4206, Table Cell Action
  2218:4237, Collapsible Table 2218:4857, Page Header 2218:6659, Topbox 2218:6690, Breadcrumbs - Topbox 2218:6721 (v0.1.0 Draft),
  Tabs - Topbox 2218:6766 (v0.1.0 Draft), Timeline Event 2218:7900. Les autres : v1.0.0 Ready, « Date unknown », « Initial version. ».
- Gabarits remplis : Table Row 39:14360 (v1.0.0 Ready), Horizontal Card 1453:13637 (v1.0.0 Ready, November 3, 2026).
- Étiquette WIP vers Ready (JSON `ready`) : Versionning Grade 1460:3202, Accordion 1453:13979, Timeline 1491:2556.
- En-têtes 01, statut Design : WIP vers Ready (Card, Table, Collapsible Table, Page Header, Horizontal Card, Grade, Accordion,
  Timeline), WIP vers Draft (Policy color), WIP vers In review (Action Card, Pie Chart). Horizontal Card : Tech « Not started »
  vers « In code », description remplie. Versions d'en-tête 2.0.0 vers 1.0.0 (Widget Card 1448:11021, Table 1514:4275) ;
  titre et fil d'Ariane de Widget Card « Card » vers « Widget Card ».

### Liens et descriptions
- `documentationLinks` posés sur 38 maîtres publiés : Action Card et Pie Chart vers ZeroHeight (43b236, 11c6d1), les autres vers
  leur page Storybook (`components.json`), Storybook racine pour Policy color, Breadcrumbs - Topbox, Tabs - Topbox.
- 47 descriptions ajoutées (atomes privés de Card, de la table, du Topbox, de Horizontal Card, des archives ; Row - Collapsible /
  Select ; ancien Cell 38:13911 marqué « Deprecated, migrate to Table Cell » ; Popin Message), hôtes relevés par instance.

### Variante ajoutée : Header Selection 1514:3515
Booléen `Select all` (défaut false, rendu actuel inchangé). Single : instance Checkbox 2213:2580 ; Double : `Wrapper` 2213:2584
(Left vide 44 px, Right avec la case). Position de la case identique à Table Selection (18,18 en Single, 56,18 en Double).
Description mise à jour.

### Liaisons de même valeur
- `qrn` vers Semantic : Table Header 8:4237 (8 textes `Sub Title` masqués, blue/450 #008ED6 vers
  `Interactive/Text/Medium/Active`), `.Key Info` 354:4379 (2 fonds blancs vers `Static/Background/Main/Primary`), `.Topbox Content`
  1704:15147 (1 fond blanc, idem). 0 écart de signature.
- Foundation vers Semantic : `.Title` d'Accordion 720:56, interligne `Font/Line Height/24` vers `Font/Text Style/Line Height/L`.
- Styles de texte : seuls les `Copy/Medium (16)/Regular | Semibold | Bold` ont un équivalent exact (16 / 24 / 0) : vers
  `Body/L/Regular | Semi Bold | Bold` sur `.Title` + `.Missing Data` (3), Grade (20), Policy color (4), `.Topbox Content` (2),
  `.Data` (6). 0 écart.

## Gris #5B5B5B -> #414141 (décision utilisateur 2026-11-17 15:15)
- `qrn` `foundation/color/grey/450` (#5B5B5B) relié à `Color/Static/Text/Main/Secondary` (#414141) dans `.Columns` 415:2129,
  `.Layout` 354:4468 et `.Label` 354:4711 : 222 nœuds, tous des remplissages de texte (aucun fond ni trait concerné, rien laissé).
  Le chiffre de 444 de l'audit comptait chaque liaison deux fois. Changement visible voulu : texte un peu plus foncé.
- Contrôle : boîtes absolues identiques sur les 3 maîtres et leurs 36 instances du fichier, 0 instance cassée.
- Il reste des liaisons vers `qirin--variables` dans le fichier, le désabonnement n'est donc pas encore possible :
  - Timeline Line 381:236 : #DC3149 (44), aucun Semantic de cette valeur ;
  - ancienne table `.Content Type` 74:4618 (4, migration), `.☠️ Collapsible Table Row` (4), `.☠️ Row` (2) ;
  - page Archives (explorations Topbox, environ 300) ;
  - dans les maîtres de Card (Card, `.Action`, `.Key Info`, `.Columns`, `.Settings`…) : environ 500 liaisons portées par des
    instances imbriquées d'autres librairies (Button, Skeleton, Tag, Grade publié : grey/050, grey/025, blue/600, grey/500,
    light/tag/…). Elles appartiennent à ces atomes et ne se corrigent pas ici.

## Non fait / laissé (raison)
- **Swap de l'ancien Link dans List Item 2059:394 : fait puis défait** (avant le STOP du coordinateur). Le libellé de l'ancien Link
  est sous `.Specs` (Link > .Specs > Label), celui du nouveau directement sous le Link : les 17 libellés surchargés des
  instances de ce fichier sont revenus à « ManA - Grade Transfer ». Maître remis sur l'ancien Link (Tone=Neutral, icône masquée
  comme avant), les 17 libellés rétablis, dimensions identiques (maître 280 x 48, Title 159 x 24). Rien n'a atteint les
  consommateurs (pas de publication). Le swap demande une migration (Buyer Summary 42 libellés).
- **Grade `5ac10c1b` de `.Company Profile` 565:23887 : non remplacé.** Le Grade étranger ne rend pas comme le Grade local
  (pastille 29,128,103 contre 26,117,33 ; score #414141 contre #121212) : le swap change le visuel. Décision utilisateur.
- **Timeline Line 381:236 `light/tag/label/error-reverse` #DC3149 (44)** : aucun Semantic de cette valeur.
- `qrn` restant aussi sur l'ancienne table (`.Content Type` 74:4618, grey/500 et grey/300, migration), `.☠️ Collapsible Table
  Row` (blanc x4), `.☠️ Row` (blue/600 x2) et les explorations archivées. **Désabonnement de `qirin--variables` impossible** tant
  que ces liaisons existent (et l'API ne permet pas de désabonner : action à faire dans l'interface).
- Styles hors Tokens sans équivalent exact (interlettrage 0,2 ou 0,5 contre 0 dans Tokens) : `Copy/Small (14)/*` (Grade 43,
  Policy color 10, Timeline, `.Data`…), `Copy/X-Small (12)/*`, `Copy/Large (18)/Semibold` (`.Title` de Card, 3),
  `Headline/X-Small` (`.Page Title`), `foundation-h2` (`.Title` d'Accordion). Les styles Inter (`Display xs/xl`, `Text xl`) des
  gabarits de doc ne sont pas des maîtres.
- Glyphes 🆕 Hash / Grid / Contract / File Text / File New : `Shape` #404040, aucun Semantic identique (#414141).
- Slot déprécié imbriqué (Card Type=Slot, `.Settings`, Timeline Event) : non touché (migration). Instances orphelines restantes
  1510:2640, 55:2403, 74:4626 : dans l'ancienne table (migration).
- Doublons de l'ancienne table (`.Content Type` 74:4618 et 38:11003, `.Cell Properties` 8:4196 et 1512:3518) : laissés (zone de
  migration de l'ancien Cell). `.Action` en double sur Horizontal Card (680:5224, 679:10724) : laissé.
- Timeline Title 381:422 et Timeline Line 381:236 : décrits « Private atom » mais publiés ; non préfixés (usage hors fichier non
  compté au lot 1).
- Popin Message 639:19362 (page ☠️ Message Illustration) : publié, hors liste du lot 1 ; seulement décrit.
- Pastilles de nom de page (Topbox 🔴🔴, Policy color 🔴🔴, Timeline 🟠) non modifiées.
- Gabarit v1 de la table 39:14279 (Design WIP, Tech Not started) : laissé, il porte l'ancienne table.

## Écarts signalés (Figma disait autre chose que le JSON, JSON appliqué)
- Grade, Accordion, Timeline, Card, Table, Collapsible Table, Page Header, Horizontal Card : Figma WIP, JSON `ready`.
- Policy color : en-tête WIP, JSON `draft`. Action Card, Pie Chart : WIP, JSON `in-review`.
- Widget Card et Table : en-tête 2.0.0, JSON 1.0.0. Horizontal Card : la note de la page cite une 1.1.0 (4 novembre), JSON 1.0.0.

## À publier (par l'utilisateur)
Data Display : dépublications (18 composants), renommages (Widget Card, Row - Collapsible / Select, `.Collapsible Table Info`),
Header Selection (`Select all`), liaisons Semantic et styles Body/L (Table Header, `.Key Info`, `.Topbox Content`, Grade, Policy
color, `.Title`, `.Missing Data`, `.Data`, `.Title` d'Accordion), liens de documentation et descriptions.
