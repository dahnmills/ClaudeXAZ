# Design system Qirin : état global

Mise à jour : 2026-11-16 10:30. Sources : `docs/components-status/components.json` (106 composants de librairie, 63 locaux aux écrans exclus), rapports `docs/zeroheight/_page-kit-*.md`, `docs/SESSION-RESUME.md`. À tenir à jour à chaque jalon.

## 1. Progression par étape (106 composants de librairie)

| Étape | Fait | % | Commentaire |
|---|---|---|---|
| Dessiné dans Figma | 104 | 98 % | Manquent Focus Trap (directive sans visuel, ne se dessine pas) et Properties Panel (retiré le 2026-11-04 au profit de Card `.Columns`) |
| Codé dans le prototype (vibecodé) | 104 | 98 % | Manquent Breadcrumbs - Topbox et Tabs - Topbox (Figma seulement) |
| Storybook (version vibecodée) | ~95 | ~90 % | Storybook publié sur GitHub Pages, pas encore déclaré dans ZeroHeight |
| Figma propre (tokens Semantic liés, descriptions) | ~25 | ~25 % | Fait sur Action (environ 1 960 liaisons) ; autres librairies non auditées |
| Page Figma normalisée (01 Component, 02 Documentation, 03 Do/Don't) | 34 | 32 % | Fait le 2026-11-16 : Action complète + 16 nouveaux composants |
| Planche Do/Don't | 34 | 32 % | Mêmes composants ; règles non dessinables en cartes « text only » |
| Page ZeroHeight | 35 | 33 % | Toutes MASQUÉES, aucune publiée |
| Livré par les devs | 0 | 0 % | Version dev pas commencée |

## 2. Progression par librairie

| Librairie | Composants | Figma | Code | Page Figma normalisée | Page Status | ZeroHeight |
|---|---|---|---|---|---|---|
| Action (+ page Utility) | 20 + 5 | ✅ | ✅ | ✅ 23 pages | 🔄 en cours | ✅ 19 + 5 (masquées) |
| Data Entry | 19 + 5 nouveaux | ✅ | ✅ | 🟡 5 nouveaux seulement | ⬜ | 🟡 5 nouveaux seulement |
| Data Display | 25 + 2 nouveaux | ✅ (2 Topbox sans code) | 🟡 | 🟡 2 nouveaux seulement | ⬜ | 🟡 2 nouveaux seulement |
| Feedback | 10 | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| Layout et overlay | 8 + 4 nouveaux | ✅ | ✅ | 🟡 4 nouveaux (sans 01 Component) | ⬜ | 🟡 4 nouveaux, sans visuel (synchro Layout cassée) |
| Tokens (Foundation, Semantic) | | ✅ | ✅ | | | 🟡 Foundation : Spacing & layout, Accessibility (masquées) |

Légende : ✅ fait, 🟡 partiel, 🔄 en cours, ⬜ à faire.

## 3. Ce qui manque

**Pages ZeroHeight (71 composants sans page)**
- Data Entry (19) : Input Text, Input Email, Input Date, Input Search, Text Area, Checkbox, Radio, Toggle, Select, Multi Select, Dropdown Flyout Menu, Standalone Dropdown, Inline Edit, Date Range, Checkbox Card, Radio Card, Select Button, Search Bar, More Criteria.
- Data Display (25) : Card, Widget Card, Table Row, Table Cell, Table Cell Header, Table Cell Selection, Table Cell Action, Collapsible Table, Topbox, Result Card, Policy Result Card, Grade, Policy Color, Accordion, Timeline, Timeline Event, Identifier, Icon Tile, Progress Bar, List Widget, Newsfeed, Chart, Page Header, Breadcrumbs - Topbox, Tabs - Topbox.
- Feedback (10) : Badge, Badge (counter), Skeleton Item, Spinner, Toaster, Snackbar, Functional Notice, Tooltip, Popover, Popin.
- Layout (8) : Header, Side Navigation, Side Navigation Item, Modal, Modal Header, Modal Content, Modal Footer, Drawer.
- Action (2) : Button Range Group, Flyout Menu Title (draft).
- Autres : Icon, Logo, Divider, Flyout, Flyout Item, Flyout Section (à rapprocher de Flyout Menu), Focus Trap.

**Pages Figma à normaliser (doc kit + Do/Don't + nouveau look)** : les 62 composants historiques de Data Entry, Data Display, Feedback et Layout.

**Pages Status** : Data Entry, Data Display, Feedback, Layout (Action en cours, sert de modèle).

**Code** : Breadcrumbs - Topbox, Tabs - Topbox.

## 4. À revoir ou à décider (utilisateur)

**Figma : structure**
1. Cadre 01 Component absent (pas de gabarit d'en-tête) : Flyout Menu Item, Keycap, Shortcut Keys, Shortcut Row, Keyboard Map, Flag (dans `Utility sections`), Page Title, Filter Drawer, Spotlight, Shortcuts Panel. En créer un sur le modèle des autres ?
2. Sections « To review » à valider avant suppression (anciens 2es gabarits « Documentation », brouillons, gabarit Legacy 2.0.0 de Flyout Menu 235:2154, maquettes WIP du Stepper).
3. Doublons : Link a un 2e set 689:4239 ; Keycap et Shortcut Row existent en local dans Layout et dans Action ; Flyout, Flyout Item, Flyout Section contre Flyout Menu et Flyout Menu Item (renommage).
4. Crumb (set 705:4485) rangé dans une sous-section « Crumb » de la page Breadcrumb : à valider.
5. Pie Chart et Search Bar Home sont des COMPONENT sans set ; Stepper n'a pas de composant Figma.
6. Versionning absent : Data Entry, Layout, Stepper, Utility.
7. Data Display ramené de 2395 à 1800 px de large : à valider.
8. Défauts sur composants : maître Slot vide affiché dans Flyout Menu, tag « QWERTZ ( » coupé dans Keyboard Map, icône de la frame do « External links » de Link.
9. Gabarit utilisateur : titres en Inter et valeurs brutes (non liées aux tokens), contenu en Allianz Neo.

**Figma et code : écarts visuels (7 décisions de la passe Action, toujours ouvertes)**
Button SemiBold ou Regular ; ton Negative (Figma ou retiré du code) ; couleur du texte Between ; Segmented Control au repos bleu ou gris ; Tab sélectionné Bold ou Regular ; noms de styles et Select de Pagination ; orientation du Stepper.

**ZeroHeight**
- Toutes les pages sont masquées : à relire puis démasquer.
- Librairie Layout : ZeroHeight ne voit pas les nouveaux composants (synchro à réparer côté ZH).
- Storybook à déclarer dans ZeroHeight (action utilisateur).
- Pages de présentation (Welcome, Why Qirin, What's inside, Principles) : captures des 6 features à ajouter, puis remplacer les pages visibles.
- Pages de test 8352976 et 9167232 à supprimer à la main.
- Crédits du MCP : limiter les appels, piste Playwright dans le navigateur (test sur une page masquée à faire).

**Accessibilité**
- Text/Main/Tertiary sous AA : 3,8:1 sur Background Main/Tertiary, 4,2:1 sur Secondary.
- Card d'exposition : jaune, orange et gris sous 3:1.

**Autres chantiers en attente**
- Fusion de `feat/exposure-cards` ; changelog Reject Management ; URL du dossier Figma « Qirin Local Library » ; hypothèses Manual Underwriting à confirmer avec le métier.
- Code et outillage non commités (corrections a11y Action, hook pre-commit, commande /sync-status).

## 5. Actions utilisateur bloquantes
1. Publier les librairies Action, Data Entry, Data Display, Layout (les maquettes et ZeroHeight ne voient les changements qu'après).
2. Valider les sections « To review ».
3. Trancher les décisions du §4.

## 6. Prochaines étapes proposées
0. (Demande utilisateur du 2026-11-16, à faire après les publications) Passe de vérification des composants Figma, toutes librairies : noms de calques propres, NOMS DES PAGES nettoyés (sans emoji ni marques provisoires : 🆕, 🔴, « ↪ », etc.) et tokens Semantic partout où il faut (spacing, radius, colors, texte). Attention : renommer un calque interne ou lier une valeur brute sur un maître peut casser les surcharges des instances dans les fichiers consommateurs ; auditer les surcharges avant (méthode : `docs/zeroheight/_audit-overrides-prepublish.md`).
1. Pages Status des 4 autres librairies (sur le modèle Action).
2. Normaliser les 62 pages Figma historiques (doc kit + planche Do/Don't + nouveau look), librairie par librairie, en commençant par Feedback (10 composants).
3. Pages ZeroHeight des 71 composants manquants, via le navigateur si le test Playwright est concluant.
4. Démasquer ZeroHeight par familles après relecture.
