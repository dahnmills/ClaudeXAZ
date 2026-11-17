# Audit des surcharges avant publication, 2e passe (2026-11-16)

Audit en lecture seule. Rien n'a été écrit dans aucun fichier Figma, aucun commit. Le travail en cours sur le décalage des icônes de Side Navigation (fichier Layout) n'a pas été touché.

Même risque que le premier audit (`_audit-overrides-prepublish.md`) : sur un maître de librairie, lier pour la première fois une valeur brute écrase, à la publication, la surcharge de cette propriété sur les instances des fichiers consommateurs. Les remplacements Foundation vers Semantic de même valeur et les liaisons de couleur ne sont pas comptés.

## 0. Périmètre : liaisons posées par les lots terminés après le premier audit

| Lot | Librairie | Composants et liaisons numériques ou de texte posées depuis une valeur brute |
|---|---|---|
| data-display-2 | Data Display | Table Row (traits 1 / 2, opacité), Table Cell (paddings 8 / 16, textes), Table Header, Header Selection, Header Flyout (paddings 2 / 8, gap 8, textes), Collapsible Table et ses cellules (paddings, gaps, trait du Separator, textes) |
| data-display-3 | Data Display | Page Header (trait bas 1 seulement), `.Topbox` (paddings 4 / 16), `.Topbox Content` (gaps, séparateurs, puces ID, Actions), `.Page Title` (padding 24), `.Topbox Actions`, `Tabs - Topbox`, `.Topbox Tabs`, `Breadcrumbs - Topbox`, `.Topbox Breadcrumbs`, Identifier (trait 2). Texte `ID` différé (non lié) |
| data-display-4 | Data Display | Grade (gap, paddings, rayons, 23 textes), Policy color, Accordion (rayons, paddings, gaps, opacité), Timeline, Timeline Event, Timeline Line, Timeline Title (gaps, paddings, rayons, traits, textes du jour) |
| data-display-5 | Data Display | Chart : padding bas 16 du slot `Y labels`. Progress Bar et List Item : aucune |
| layout-1 | Layout | Header (padding droit 16, gaps 24 / 8), Side Navigation (paddings, gaps 8, trait 1 de `Bottom`), `.Side Navigation Item` et `.Item` (padding 32, rayons 8, paddings et gaps 8, textes) |
| layout-2 | Layout | Modal Header, Content, Footer (paddings, gaps, rayons, traits ; titre Core 24 vers Title/Size/M), Drawer, Drawer Header (titre : taille, interligne, interlettrage), Drawer Tabs, `.Footer` |

Confirmation demandée : **les liaisons `fontSize` et `lineHeight` du texte `Value` de `.Text` (Dropdown, Data Entry, 2046:818) sont bien annulées.** Relu dans la librairie : le nœud ne porte plus que `fills` (Static/Text/Main/Primary) et `fontFamily` (Font/Family), valeurs 14 / 20 en dur, comme la version publiée. Aucun consommateur ne surcharge la famille.

## Méthode

Identique au premier audit :
- Fichiers et pages : Search, Buyer Summary, Coverbook, Reject Management, Manual Underwriting (toutes les pages ; Cover et Changelog par comptage, n'y figurent que des textes de Badge Feedback et de Card, hors lots), Exposure Card (page unique) ; Layout : `Home page` (dont la maquette cible 2865:10424) et `Search 🚧`.
- Pour chaque instance la plus externe : `instance.overrides`, champs paddings, `itemSpacing`, `counterAxisSpacing`, rayons et coins, traits et côtés, `fontSize`, `lineHeight`, `letterSpacing`, `fontName` ; pour les textes surchargés en `styledTextSegments`, comparaison de ces quatre valeurs avec le nœud du maître (copie publiée).
- Propriétaire = instance la plus proche. Composants distants seulement, sauf dans le fichier Layout où les maîtres Layout locaux sont aussi lus (liaisons actuelles du maître local).
- Croisement : l'identifiant de sous-nœud (dernier segment) pointe le nœud de la librairie ; relecture de ses liaisons actuelles dans la librairie (Data Display, Layout, Data Entry, Action), et de la copie publiée côté consommateur (correspondance par chemin de noms).
- Vignettes réduites (`scaleFactor` 0,155, pages Overview) : classées sans risque, comme au premier audit.

## 1. Risques réels

**Aucun.** Aucune surcharge consommatrice ne recoupe une liaison posée par data-display-2 à 5, layout-1 ou layout-2.

Détail des surcharges qui touchent un composant des lots, toutes vérifiées dans la librairie :

| Fichier | Page | Cadre | Composant (librairie) | Propriété | Valeur surchargée | Liaison actuelle dans la librairie | Verdict |
|---|---|---|---|---|---|---|---|
| Reject Management | Local components | `Reject Management shell` (16:11688), 4 instances | Page Header 1709:15404 (Data Display) | `itemSpacing`, `paddingTop` | 16 / 16 | aucune (seul le trait bas est lié) | sans risque, ne pas lier ces deux propriétés |
| Coverbook | Local components | `Coverbook shell` (12:6887), 4 | `.Topbox Content`, texte `ID` 1699:15010 / 1699:14989 | `fontName` | JetBrains Mono | aucune (différé par data-display-3) | sans risque, ne pas lier la famille |
| Buyer Summary | Local components | `Buyer Summary shell` (15:5169), 2 | idem `ID` 1699:15010 | `fontName` | JetBrains Mono | aucune | sans risque |
| Manual Underwriting | Local components | `UW page shell` (28:2201), 3 | idem `ID` 1699:15010 | `fontName` | JetBrains Mono | aucune | sans risque |
| Search | Local components | `Result / Score` (49:3128), instance 49:3130 | Progress Bar Size=S, Tone=Brand 2024:297 | `paddingRight` | 29 | aucune (96 en dur, à ne pas lier) | sans risque |
| Layout | Search 🚧 | `Spotlight buyer` (2706:10913), instance 2706:10922 | Side Navigation Open=False 2083:6945 (maître local) | `strokeRightWeight` | 1 | aucune sur la racine (layout-1 a lié le trait de `Bottom`, pas celui de la racine) | sans risque, valeur égale au maître |
| Coverbook, Reject Mgmt, Manual Underwriting, Buyer Summary | Overview | vignettes 0,155 | `.Topbox Content`, `.Page Title`, Modal Header titre 2076:6788, Drawer Header titre 2465:5430 | taille, interligne, interlettrage | valeurs réduites par l'échelle | liées (Modal Header : Core/Font/Size/24 publiée, remplacée par Title/Size/M, même valeur) | sans risque (échelle) |

Aucune instance de Table, Collapsible Table, Identifier, Grade, Policy color, Accordion, Timeline, Chart, List Item, Header, Modal ou Drawer ne porte de surcharge sur un champ retenu hors vignettes. Dans le fichier Layout, aucune instance de Header, Modal, Drawer, Page Title ou `.Item` de Side Navigation ne surcharge un champ retenu : la comparaison avec les maîtres locaux ne relève donc rien (et les signatures avant/après de layout-1 confirment qu'aucune surcharge n'a été effacée en local).

Point hors périmètre relevé au passage (sans lien avec la publication) : dans la **maquette cible 2865:10424**, le libellé du Button Primary « Search » (instance 2865:10463, `.Content` > `Label`, Action 168:1298) est surchargé en `SemiBold Italic`. La graisse est déjà liée dans la version publiée : la publication ne change rien, mais l'italique semble accidentel.

## 2. Surcharges sans recoupement, en volume

659 surcharges de champ retenu relevées dans le périmètre (mêmes pages qu'au premier audit) :
- **42 sur des composants Data Display des lots 2 à 5** : 8 Page Header, 9 `fontName` du texte `ID` (Coverbook 4, Buyer Summary 2, Manual Underwriting 3), 1 Progress Bar, 24 en vignettes réduites (Coverbook Overview). Aucune ne recoupe une liaison.
- **33 sur des composants Layout** : 32 en vignettes réduites (titres de Modal Header et de Drawer Header, pages Overview de Reject Management, Coverbook, Manual Underwriting, Buyer Summary), 1 trait de Side Navigation (égal au maître).
- **58 sur le texte `Value` de Dropdown** (Layout Search 52, Buyer Summary 2, Coverbook 2, Manual Underwriting 2) : sans risque depuis l'annulation des liaisons (section 0).
- **35 sur Widget Card** (`Card` racine, gap 8 : Home page 16 dont 4 dans la maquette cible, Search 🚧 4 ; Slot de `Block card`, Reject Management : 15) : toujours non liés dans la librairie, doivent le rester.
- **1 Functional Notice** (Reject Management, 31:4053, `paddingBottom` 0) : risque du premier audit, toujours présent.
- **Le reste (environ 490)** : surcharges déjà classées au premier audit (Tab 2, Checkbox 16, Button Plain 8, Input Text 16, `.Item` Type=Title 8, `.Content Properties` de Badge, `.Label` et `.Current` / `.Trail`, Action Bar, cartes de Spotlight, vignettes de `.Content` de Button), plus l'italique de la maquette cible.
Exposure Card : aucune surcharge retenue.

## 3. Recommandation par librairie (lots de cette passe)

- **Data Display (lots 2 à 5)** : **publiable tel quel.** Garder non liés le gap et le padding haut de Page Header, la famille du texte `ID` de `.Topbox Content`, le padding droit de Progress Bar, le gap racine et les paddings du Slot de Widget Card.
- **Layout (lots 1 et 2)** : **publiable tel quel** côté surcharges. Seul point en suspens, hors de cet audit : le recalage de 1,5 px des icônes de Side Navigation, en cours d'analyse par un autre agent.
- **Data Entry** : l'annulation des liaisons du texte `Value` (2046:818) est confirmée, les 29 nœuds surchargés (58 champs) sont protégés. Plus rien à faire avant publication.

## 4. Synthèse des 5 librairies (deux audits réunis)

| Librairie | Verdict | Action |
|---|---|---|
| Action | publiable tel quel | aucune. Facultatif : retirer l'italique du bouton « Search » de la maquette cible (sans lien avec la publication) |
| Feedback | publiable, **1 instance à re-surcharger après publication** | Reject Management, Local components, `Resolution notice`, instance `Notice` 31:4053 : remettre `paddingBottom` à 0. Les 28 `.Content Properties` (gap 0) peuvent rester (aucun effet visible) |
| Data Entry | publiable tel quel | liaisons `fontSize` / `lineHeight` de `Value` 2046:818 annulées (vérifié) |
| Data Display | publiable tel quel | lots 1 à 5 : aucune liaison recoupée. Ne pas lier les propriétés listées en section 3 |
| Layout | publiable tel quel | aucune surcharge recoupée, ni sur les consommateurs ni sur les écrans du fichier Layout ; reste la décision sur le décalage d'icônes de Side Navigation |

Limites : les pages de composants du fichier Layout et ses pages `Checklist` / `Cover` ne sont pas auditées ; Cover et Changelog des fichiers de fonctionnalités vus par comptage seulement (textes de Badge et de Card, hors lots) ; le sort d'une surcharge portée par une variable face à une nouvelle liaison du maître n'a toujours pas été testé, mais plus aucun cas n'en dépend.
