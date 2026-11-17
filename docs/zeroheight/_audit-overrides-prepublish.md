# Audit des surcharges avant publication des librairies Figma (2026-11-16)

Audit en lecture seule. Rien n'a été écrit dans aucun fichier Figma, aucun commit.

Risque mesuré : sur un maître de librairie, lier pour la première fois une valeur brute (padding, gap, rayon, trait, texte) écrase, à la publication, la surcharge de cette même propriété sur les instances des fichiers consommateurs (test du lot data-display-1). Remplacer une Foundation par la Semantic de même valeur ne pose pas ce problème et n'est pas compté ici. Les liaisons de couleur non plus (la peinture est surchargée en bloc, override conservé d'après le même test).

## 0. Liaisons « valeur brute vers Semantic » posées sur les maîtres

Sources : `_fix-figma-action-A` à `D`, `_decisions-figma-action`, `_lib-rollout-feedback-1`, `feedback-2`, `data-entry-1` à `4`, `data-display-1`, `_page-kit-A` à `F`.
Les `_page-kit-*` ne posent aucune liaison sur un maître (mise en page des sections seulement).
**Lots encore en cours** (rapports partiels, lus mais non définitifs) : `data-display-2` (Table), `data-display-3` (Topbox, Page Header, Identifier), `data-display-4` (Grade et Policy color faits, Accordion et Timeline à venir), `data-display-5`. Les liaisons qu'ils annoncent déjà sont listées en fin de tableau Data Display.

### Action (`xCeEJPn6fliEshuE9fnrqs`)
| Composant | Propriétés liées depuis une valeur brute |
|---|---|
| Button (44:558) | paddings 16 (M), gap 8 (S). Rayons : liaison annulée (Button Split). |
| Button Icon (12:145) | padding 8 (S), gap 8 (S) |
| Button Load More (53:8445) | rayon 4, paddings 16 / 4 / 8, gap 8 |
| Button Range (720:445) | rayon 4, padding 2 |
| Link (688:4202), Breadcrumb (298:5526) | gap 4 |
| Chip (456:438) | gap 8, paddings 16 / 8 / 4 |
| Tag (102:558), `.Options` Filter / Select / Static | gaps et paddings 4 / 8, rayons 4 |
| Segmented Control Item (302:2197), `.Content` 302:1938 | paddings 16 / 4, gap 8, rayon 4 |
| Tab (57:231), `.Options` 160:131 | gap 4, rayon 9999 vers Round (badge). Style du libellé sélectionné changé (Bold vers Regular) |
| Pagination (53:2994), `.Options` 53:2954 | gaps 24 / 16 / 8 / 2 |
| Visual Button (296:4137) | paddings 8, gap 4, rayons 4 |
| Flyout Menu v3 (507:833) | padding vertical 8, rayon 4 |
| Flyout Item (507:996) | paddings 8 / 32, gap 4 |
| Stepper, `.Stepper Step` | composants créés aujourd'hui, aucun consommateur |

### Feedback (`fH3vmSNZR8r0sU3kN455CD`)
| Composant | Propriétés liées depuis une valeur brute |
|---|---|
| Badge (141:98), `.Badge`, `.Content Properties` (141:151, 141:162) | paddings 4 / 8, rayons 100 vers Round, padding et gap 2 ; **gap racine des variantes `.Content Properties` lié à XXS** (constaté dans la librairie, non lié dans la version publiée) |
| Badge (counter) (257:5) | padding 2 ; texte : taille, interlettrage, graisse, famille |
| Skeleton Item (117:5) | rayons 4 |
| Toaster (125:1116) | paddings 16 / 24, gap 16, rayons 4, trait 1 ; texte de contenu : taille, interligne, interlettrage, graisse, famille |
| Snackbar (124:34846) | paddings 8 / 16, rayon 4, gap 8, texte |
| Tooltip (119:4038) | paddings 4 / 8, rayon 4, texte |
| Functional Notice (154:2271) | **paddings et gaps 16 (M)**, rayon 4, titres (texte) |
| Popover (121:12614), `.Action` | paddings 16 / 24, gaps 24 / 8 / 4, rayon 4 |
| Popin (63:807), `.Spec`, `.Icon`, `.Content` | gaps, paddings, rayon, retrait 48, textes de `.Content` |

### Data Entry (`1wVY9FfjONIX6us9JmIm7U`)
| Composant | Propriétés liées depuis une valeur brute |
|---|---|
| Input Text, Input Email, Input Date, Input Search (+ `.Append`, `.Prepend`, `.Selector`, `.Input Content`) | padding 8, gaps 2 / 4 / 8, rayons 4 |
| Text Area (+ atomes) | padding 8, gaps 4 / 2, rayons 4 |
| Radio (2044:2569) | gaps 8, rayons 4 du Dot |
| Toggle (2044:2853) | gaps 8, paddings 2 du Switch |
| Checkbox Card (2093:322) | padding haut 2, gaps 8, texte `Main Label` |
| Radio Card (2093:217) | paddings et gap 16, rayons 4, padding haut 2, gaps 8, texte `Main Label` |
| Select Button (2221:1490) | padding 8, gap 4, rayon 4, traits 1 / 2 |
| Standalone Dropdown (3023:214) | trait 4 de `Border Focus` |
| Dropdown (2046:720) + `.Input Content`, `.Append`, `.Value`, `.Tags`, `.Text` | gaps 2 / 4 / 8, padding 8, rayons 4, traits 1 / 2 ; **textes de `.Tags` / `.Text` : famille, taille (M), interligne** |
| Dropdown Flyout Menu (2049:5070), `.Item Properties`, `.Item` | paddings 8 / 4 / 32 / 16, gaps 4, rayons 4, traits 2 / 1 |
| Inline Edit (2317:202) | gaps 4 / 8, padding 4, traits 1 / 2 |
| Date Range (2002:1305), `.Date` (2002:797) | gap 24, rayons 4 |
| Checkbox, Search Bar, More Criteria | aucune (couleurs ou déjà liés) |

### Data Display (`VpConH5AUGyCqtp8PMqj1i`)
| Composant | Propriétés liées depuis une valeur brute |
|---|---|
| Card, Widget Card (data-display-1) | **aucune** : toutes les liaisons numériques ont été différées (seuls rayons Foundation vers Semantic et couleurs) |
| Icon Tile, Progress Bar, List Item | aucune |
| Grade (628:17016), en cours | gap 4, paddings 8 / 4, rayons 16, textes sans style |
| Policy color (1655:14105), en cours | gap 4, rayons 16, paddings 4 / 8, trait 1, textes sans style |
| Table, Topbox, Page Header, Identifier, Accordion, Timeline | lots en cours : état relu dans la librairie pour les nœuds surchargés (voir section 1) |

## Méthode

- Fichiers : Search, Buyer Summary, Coverbook, Reject Management, Manual Underwriting, Exposure Card (toutes les pages) ; Layout : page `Home page` (contient la maquette cible 2865:10424 et 3 autres écrans) et page `Search 🚧` (écrans). Pages de composants du Layout non auditées, ni `Checklist` / `Cover`.
- Pour chaque instance la plus externe, lecture de `instance.overrides`. Champs retenus : paddings, `itemSpacing`, `counterAxisSpacing`, rayons, traits, `fontSize`, `lineHeight`, `letterSpacing`, `fontName`. Les surcharges de texte remontent aussi comme `styledTextSegments` : pour ces textes, comparaison des valeurs avec le nœud correspondant du maître (copie publiée).
- Propriétaire de la surcharge = instance la plus proche (le nœud lui-même s'il est une instance). Seules les instances de composants distants sont gardées (les instances de composants locaux qui contiennent des atomes de librairie sont couvertes).
- Croisement : les identifiants d'instance pointent les nœuds de la librairie. Chaque nœud surchargé a été relu **dans la librairie** (liaison actuelle) et **dans la copie publiée du consommateur** (liaison avant publication) : seule une liaison présente dans la librairie et absente de la version publiée est un risque.
- Vignettes réduites (pages Overview) : instances à `scaleFactor` 0,155. Les tailles de texte réduites (2,48 au lieu de 16) viennent de l'échelle, pas d'une surcharge. Preuve : le libellé de `.Item Properties` (Flyout) est déjà lié à Size/L dans la version publiée et la vignette reste à 2,48. Classées sans risque.

## 1. Risques réels

| Fichier | Page | Cadre | Composant (librairie) | Propriété surchargée | Valeur surchargée | Liaison dans la librairie | Effet à la publication |
|---|---|---|---|---|---|---|---|
| Reject Management | Local components | Section `Resolution notice` (48:4069), composant local `Resolution notice`, instance `Notice` 31:4053 | Functional Notice, Emphasis=Medium, Status=Info (Feedback) | `paddingBottom` | 0 | `Measurement/Spacing/M` (16) sur les 4 paddings, posée par feedback-2 (non liée dans la version publiée) | le bas de la notice reprend 16 px, dans le composant local et donc sur tous les écrans qui l'utilisent |
| Search (Layout) | Search 🚧 | `Frame 2` (2591:1118), 24 instances (ex. 2591:1137) | Dropdown > `.Text` > `Value` (Data Entry, nœud 2046:818) | `fontSize`, `lineHeight` (surcharge par variables Size/L et Line Height/L) | 16 / 24 | `Font/Text Style/Size/M` (14), `Line Height/M` (20), posées par data-entry-3 (la version publiée ne lie que la couleur) | la valeur saisie du champ passe de 16 à 14 si la surcharge est écrasée (probable) |
| Search (Layout) | Search 🚧 | `Proto Layout` 2613:5512, 2 instances | idem Dropdown `.Text` `Value` | `fontSize`, `lineHeight` | 16 / 24 | idem | idem |
| Buyer Summary | Local components | `Board pieces` (I19:1848) | idem Dropdown `.Text` `Value` | `fontSize`, `lineHeight` | 16 / 24 | idem | idem, propagé aux écrans |
| Coverbook | Local components | `Covers toolbar` (I16:1973) | idem Dropdown `.Text` `Value` | `fontSize`, `lineHeight` | 16 / 24 | idem | idem, propagé aux écrans |
| Manual Underwriting | Local components | `UW modal contents` (I32:1763) | idem Dropdown `.Text` `Value` | `fontSize`, `lineHeight` | 16 / 24 | idem | idem, propagé aux écrans |
| Search (Layout) | Search 🚧 | `Frame 2` (16), `Search V2.0` 3016:11477 (5), `Proto Layout` 2706:12233, 2984:10237, 3136:15508 (2 chacun), 2613:5512 (1) : 28 instances | `.Content Properties` Icon=False, Label=True (Feedback, Badge) | `itemSpacing` (racine) | 0 | `Measurement/Spacing/XXS` (2), absente de la version publiée | aucun effet visible : un seul enfant visible (l'icône est masquée), le gap ne s'applique pas |

Total : 87 surcharges de champ recoupent une liaison nouvelle ; 59 ont un effet visible (1 Functional Notice, 58 sur le texte de Dropdown, soit 29 nœuds).

Points à surveiller, sans risque aujourd'hui car la propriété n'est pas liée dans la librairie au moment de l'audit (lots en cours ou liaisons différées) :
- Widget Card (`Card` 1325:10443), `itemSpacing` racine surchargé à 8 : 16 instances dans `Home page` du Layout, dont 4 dans la **maquette cible 2865:10424**, et 4 dans `Proto Layout` 2719:8954 (Search 🚧). Slot de Widget Card, paddings 16 / 8 et gap 16 : 3 instances (`Block card`, Reject Management). Ces liaisons ont été différées par data-display-1 : elles doivent le rester.
- Page Header (1709:15404), `itemSpacing` et `paddingTop` racine surchargés à 16 : 4 instances (`Reject Management shell`). Lot data-display-3 en cours.
- `.Topbox Content`, texte `ID` (1699:15010, 1699:14989), `fontName` JetBrains Mono : 2 (Buyer Summary), 7 (Coverbook), 3 (Manual Underwriting). Lot data-display-3 en cours : ne pas lier la famille de ce texte.
- Toaster, texte de contenu (330:1036), lié aujourd'hui : surcharge `fontName` Regular dans Reject Management (States, `Loading and empty`) égale à la nouvelle valeur du maître (Regular), et vignettes réduites de Buyer Summary : sans effet.

## 2. Surcharges sans recoupement (sans risque), en volume

569 surcharges de champ retenu sur des composants distants dans le périmètre, dont 87 recoupent une liaison (section 1) et **482 ne recoupent aucune liaison nouvelle** :
- ~150 sur des vignettes réduites des pages Overview (échelle, pas une vraie surcharge) ;
- ~110 paddings de racine non liés dans la librairie : Tab (2, 24 instances), Button Plain (8, 8 instances), Checkbox (16, 25 instances), Input Text (16, 7), `.Item` Type=Title (8, 18), Action Bar du Header (librairie Layout, non concernée) ;
- ~40 gaps et paddings de Widget Card et Page Header (voir « à surveiller ») ;
- ~180 surcharges de texte sur des nœuds non liés ou déjà liés avant aujourd'hui : `.Current` / `.Trail` des Crumb du Topbox (ancienne librairie), `.Input Content` `Value` (déjà lié, surcharge Regular égale au maître), libellés `.Label` de Dropdown (valeur égale au maître), messages de Functional Notice (style local `Copy/Small`, non liés), `ID` du Topbox, `Label` (Type=Value) des cards de Spotlight ;
- 1 padding droit de Progress Bar (Search, Local components), non lié (data-display-5).
Exposure Card : aucune surcharge retenue.

## 3. Recommandation par librairie

- **Action** : publiable tel quel. Aucune surcharge consommatrice ne recoupe une liaison posée aujourd'hui (paddings de Button Plain et de Tab non liés, libellé `.Content` déjà lié avant).
- **Feedback** : publiable, avec **1 instance à re-surcharger après publication** : Reject Management, page Local components, composant local `Resolution notice`, instance `Notice` (31:4053), remettre `paddingBottom` à 0. Les 28 `.Content Properties` (gap 0) peuvent être laissées : aucun effet visible.
- **Data Entry** : **annuler avant publication** les liaisons `fontSize` et `lineHeight` du texte `Value` de l'atome `.Text` du Dropdown (2046:818), ou accepter de re-surcharger 29 nœuds dans 5 fichiers (Layout Search 26, Buyer Summary 1, Coverbook 1, Manual Underwriting 1, ces trois derniers dans des composants locaux). L'annulation est la voie sûre : la surcharge des consommateurs passe elle-même par des variables (Size/L), son sort à la publication n'est pas garanti. Le reste de Data Entry est publiable tel quel.
- **Data Display** : lot data-display-1 publiable tel quel (aucune liaison numérique posée). Grade et Policy color : aucune surcharge consommatrice. Lots data-display-2 à 5 encore en cours : avant publication, ne pas lier le gap et le padding racine de Page Header, le gap racine et les paddings du Slot de Widget Card, ni la famille du texte `ID` de `.Topbox Content` ; relancer cet audit sur les liaisons finales de ces lots.

Limites : la librairie Layout et les lots non listés plus haut n'ont pas été croisés ; les pages de composants du fichier Layout sont hors périmètre ; le sort d'une surcharge portée par une variable (cas Dropdown) face à une nouvelle liaison du maître n'a pas été testé.
