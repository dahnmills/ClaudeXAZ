# Status et Cover, librairies Data Display et Layout (2026-11-16)

Modèles suivis (Action `xCeEJPn6fliEshuE9fnrqs`, lus sans modification) : page Status `602:1512` (cadre `4047:243`, structure relue nœud par nœud) et Cover `4056:2`. Kit : `docs/figma/doc-kit/page-kit.js` (helpers `paint`, `B`, `pad`, `rad`, `T`, `card`, `hero`, `section` recopiés à l'identique dans l'appel ; fichier non modifié).
Rien de publié, aucun commit, pas de MCP ZeroHeight, components.json non modifié. Aucun token, collection ni mode créé : tout est lié à `Tokens / Semantic` (`miss` vide sur les 4 constructions). Seules les pages Cover et Status ont été touchées (plus la création des pages Status et `---`). Fichier Layout : maquette 2865:10424, page Side Navigation et autres écrans non touchés.

## Data Display (`VpConH5AUGyCqtp8PMqj1i`)

### Pages
- Pas de page Status. Créées : `Status` **2180:2** après `Cover` et le `---` 1:79, puis `---` **2180:3** ; `Checklist` suit (même ordre qu'Action et Data Entry).
- Aucune ancienne Status, donc pas de section « Status - To review ».

### Status
- Section `Status` **2180:17** (0, 0, 2120 × 3431), cadre `Status - Data Display` **2180:18** (1800 × 3111), tableau **2180:82** (en-tête 48 + 27 lignes 56).
- Hero (fil d'Ariane Qirin Components → Data Display → Status, étiquette STATUS, carte Data : Updated 2026-11-16, Source components.json), Overview, Components, Legend, bandeau de marque.
- Badges : 149 instances de la librairie Feedback (`importComponentSetByKeyAsync('990a9ef2…')`, Light M, icône `Icon Functional` masquée, libellé remplacé).
- Liens NODE (27/27) vers les sections normalisées : Card 2161:4173, Widget Card 2161:23529, Table Row 2163:24422, Table Cell 2163:24557, Table Cell Header 2163:24683, Table Cell Selection 2163:24808, Table Cell Action 2163:24888, Collapsible Table 2163:25193, Topbox 2165:19999, Grade 2155:27828, Policy Color 2161:27007, Accordion 2164:23268, Timeline 2176:1735, Timeline Event 2177:1744, Identifier 2166:20025, Icon Tile 2161:23861, Progress Bar 2155:23865, List Widget et Newsfeed 2161:26295 (section List Item partagée), Chart 2163:25394, Pie Chart 2145:106, Action Card 2143:171, Page Header 2164:18974, Breadcrumbs - Topbox 2165:20132, Tabs - Topbox 2165:20212. Result Card et Policy Result Card : pas de section, lien vers le set Horizontal Card 680:6820 (celui du JSON).
- Logo : clone de `Header Q/First slot/Logo` 2007:54 (header Identifier).

Chiffres (ordre du JSON) : 27 composants (5 atomes, 8 molécules, 14 organismes) ; Ready 22, In review 2 (Pie Chart, Action Card), Draft 3 (Policy Color, Breadcrumbs - Topbox, Tabs - Topbox) ; ZeroHeight 2 pages hidden, 23 `drafted`, 2 sans doc ; Storybook 24 ; Code 25 Vibecoded, 2 None, 0 Dev ; Design 27 In Figma.

### Cover
- Cadre `Cover` **2181:3** (0, 0, 1280 × 640). « QIRIN COMPONENTS », titre « Data Display », phrase : « Read, compare and follow credit data at a glance, from a single grade to a full portfolio table. » Meta : STATUS Ready (Badge Success Strong M), VERSION 1.0.0.
- Visuel, vraies instances locales : Grade A2, A5, A8 (Automatic M) + Identifier ; Chart (clone de l'instance renseignée 2163:23969, l'instance par défaut a des slots vides) + Pie Chart ; List Item (date « 16 Nov 2026 - 09:30 ») + Icon Tile S Brand + Progress Bar Positive M.
- Logo : `Header Q/First slot/Logo` Inverted=True + Divider 1 × 40 + « Qirin » (comme Action).
- Ancienne cover : section `Cover - To review` **2181:2** (x 1680, 400 px à droite), contient `UX Workflow` 1:60 sans modification.

## Layout (`bbgSPUChd18EVNGijjoZGn`)

### Pages
- Pas de page Status. Créées : `Status` **4087:2** après `Cover` et le `---` 1:79, puis `---` **4087:3** ; `Checklist` suit.
- Aucune ancienne Status.

### Status
- Section `Status` **4087:17** (0, 0), cadre `Status - Layout` **4087:18** (1800 × 2271), tableau **4087:82** (en-tête 48 + 12 lignes 56). 74 badges (librairie Feedback, import par clé).
- Liens NODE (12/12) : Header 4073:1445, Side Navigation 4075:1767, Side Navigation Item 4075:1897, Page Title 4046:304, Modal 4077:1388, Modal Header 4077:1521, Modal Content 4077:1601, Modal Footer 4077:1681, Drawer 4080:1818, Filter Drawer 4047:3512, Spotlight 4048:3512, Shortcuts Panel 4049:3512. La page Side Navigation n'a été ni ouverte ni modifiée (lien seulement).
- Logo : clone de `Header Q/First slot/Logo` 2290:7252 (gabarit Header).

Chiffres : 12 composants (1 atome, 4 molécules, 7 organismes) ; Ready 8, In review 3 (Page Title, Filter Drawer, Spotlight), Draft 1 (Shortcuts Panel) ; ZeroHeight 4 pages hidden, 8 `drafted` ; Storybook 11 (Shortcuts Panel sans story) ; Code 12 Vibecoded, 0 Dev ; Design 12 In Figma.

### Cover
- Cadre `Cover` **4088:3** (0, 0, 1280 × 640). Titre « Layout », phrase : « Give every Qirin screen a clear frame: where people are, how they search, and modals and drawers that keep them in context. » Meta : STATUS Ready, VERSION 1.0.0.
- Logo : vraie instance `.Logo Qirin` Reversed=True (set local 2290:9763), c'est le composant du modèle MCP ; pas de reconstruction.
- Visuel, vraies instances locales : Page Title (« Buyer overview », ID et badge affichés) ; Spotlight Idle, mis à l'échelle 0,73 (largeur fixe 648 px, ne tient pas dans la carte de 472 px) ; Modal Header (« Edit buyer details ») + Modal Footer (Back, Cancel, Save ; CTA tertiaire masqué, icônes des boutons passées à `Icon=None`).
- Ancienne cover : section `Cover - To review` **4088:2** (x 1680), contient `UX Workflow` 1:60 sans modification.

## Écarts JSON / Figma

1. Result Card et Policy Result Card : aucun composant propre dans Figma, le JSON pointe les deux sur Horizontal Card 680:6820 (« replaces Result Card and Policy Result Card »). Horizontal Card n'est pas dans le JSON.
2. List Widget et Newsfeed pointent sur le seul composant `List Item` 2059:394 ; Table Row, Table Cell, Cell Header, Cell Selection, Cell Action partagent 1514:3369 ; Timeline et Timeline Event partagent 1491:927.
3. Breadcrumbs - Topbox et Tabs - Topbox : `figma.nodeId = null` (seulement `componentKey`), pas de code ni de story. Page Header est classé `category: layout` mais vit dans Data Display.
4. Layout : 8 composants sur 12 ont `figma.nodeId = null` (Header, Side Navigation, Side Navigation Item, Modal, Modal Header/Content/Footer, Drawer), avec un `componentKey` partagé (Side Navigation et son Item, Modal et ses 3 sous-composants). Les nœuds existent : Header 2390:1583, Modal 2256:1556, Modal Header 2076:7800, Footer 2076:7806, Content 2076:7825, Drawer 2471:14923.
5. Noms : JSON « Policy Color », Figma « Policy color » ; Modal Header / Content / Footer s'appellent « Header », « Content », « Footer » dans Figma.
6. Versions hors 1.0.0 : Policy Result Card 0.9.0, Policy Color 0.2.0, Breadcrumbs - Topbox et Tabs - Topbox 0.1.0, Shortcuts Panel 0.2.0. Les covers affichent 1.0.0 et Ready pour la librairie, comme Action.
7. Présents dans Figma, absents du JSON : Horizontal Card (680:6820), `.Favorite` (2074:1404, atome interne), Drawer Header 2465:5469, Drawer Tabs 2465:5321 (sans préfixe `.`), Filter Section, Spotlight Row (page Overlay). Data Display garde aussi Message Illustration en archive.
8. ZeroHeight : seuls les pageId (hidden) existent, aucune `url` ; pas de lien ZeroHeight dans les tableaux.

## Remarques techniques
- `importComponentSetByKeyAsync` sur les clés de Header, Modal et Drawer depuis le fichier Layout renvoie une copie distante (4086:18, 4086:89, 4086:120), invisible sur le canevas ; non utilisée, les covers prennent les maîtres locaux.
- Changer la variante `.Content` d'un Button invalide les ids des textes enfants : poser le texte avant le changement de variante (un premier essai a échoué puis a été annulé sans effet).

## Passes de capture

- Status Data Display : 2 passes (cadre entier, tableau à 100 %) : 27 lignes uniformes, badges sans icône, aucun texte sur deux lignes ni coupé.
- Status Layout : 2 passes (cadre entier, tableau à 100 %) : idem.
- Cover Data Display : 2 passes. Corrigé : le Chart par défaut n'affichait que la grille (slots vides), remplacé par une instance renseignée ; date d'exemple 2024 remplacée. Reste : un vide à droite de la carte des grades, accepté (même cas que le Segmented Control d'Action).
- Cover Layout : 2 passes. Corrigé : Spotlight débordait de sa carte (mis à l'échelle), libellés « Title » et « Label » remplacés, icônes crayon retirées des boutons, phrase réécrite (elle citait un header absent du visuel). Reste : le texte du Spotlight est petit à cause de l'échelle, lisible à 100 %, décoratif à 25 %.
- Titres lisibles en vignette à 25 % (64 px → 16 px). Aucun chevauchement sur les pages Cover et Status des deux fichiers.
