# Audit des composants Figma : synthèse des 5 librairies (2026-11-17)

Audit en lecture seule, rien n'a été modifié dans Figma. Détail par librairie :
`_audit-components-action.md`, `_audit-components-data-entry.md`, `_audit-components-data-display.md`,
`_audit-components-feedback.md`, `_audit-components-layout.md`.

## Bilan

| Librairie | OK | À corriger | Bloquants | Points saillants |
|---|---|---|---|---|
| Action | 6 | 12 | 5 (Breadcrumb, Link, Pagination, Tag, Flyout Menu) | clés Link et Flyout Menu fausses dans la doc, 36 Chip détachés dans Tag, Button sans focus |
| Data Entry | 2 | 21 | 3 (Dropdown, Input Search, Select Card) | variante parasite Dropdown, Input Search nommé « Input Date », erreurs sans message |
| Data Display | 7 | 20 | 7 | ~550 liaisons vers l'ancienne librairie `qrn`, ~20 maîtres obsolètes publiés, atomes de Card pleins de valeurs brutes |
| Feedback | 0 | 8 | 2 (Popin, Functional Notice) | styles de texte et ombres hérités, propriétés absentes face au code |
| Layout | 4 | 22 | 4 | Modal avec instances orphelines, parasites publiés, noms en conflit (deux « Header ») |

Sain partout : aucune instance cassée, aucune propriété orpheline (hors Modal `Back`).

## Constats transverses

1. **Aucun lien de documentation** sur aucun composant des 5 librairies.
2. **Versionning** vide, faux ou absent sur une grande partie des pages ; statuts Figma (WIP, Draft) en désaccord avec `components.json` (ready).
3. **Sections « To review »** encore remplies : Feedback 10, Data Entry 19, Data Display 9, Layout 8 (Action 0).
4. **Ancienne librairie de variables `qirin--variables` (collection `qrn`)** encore utilisée : Data Display (~550 liaisons), Action (4 composants), Data Entry (Input Email).
5. **Styles de texte hors Tokens** (`Copy/*`, `Headline/*`, `foundation-*`) : Feedback, Data Display ; ombres venant d'un autre fichier (Tokens n'a aucun style d'ombre).
6. **Collections locales publiées** contraires à la règle des tokens : `Data Entry Variables`, `Collection` (Data Entry), `Layouts` (Layout).
7. **Ancien Link 171:3074** (dépublié, hors canevas) encore imbriqué : Breadcrumb, Pagination (Action), List Item (Data Display).
8. **Composants obsolètes ou parasites publiés** : Data Display (~20), Layout (Component 1, Frame 411, copies Keycap / Shortcut Row, Slot, composants Search), Data Entry (Select Card, Task, Tenant).
9. **Écarts de propriétés avec le code** : Visual Button, Button Split, Chip, Flyout Item, Snackbar, Spinner, Popover, inputs (message d'erreur), Modal xlarge.

## Plan par lots

### Lot 0 : doc seulement (risque nul, Figma intact)
- Corriger les clés dans `components.json`, PLAYBOOK, `qirin-figma-inventory.md` : Link `77367a8f128498576f030e35e042f9434514056a`, Flyout Menu `84a8ec3ed08331f3cf5d08222a02cad5dcb53d74`.
- Ajouter les clés et nodeIds manquants (Page Title, Filter Drawer, Spotlight, Shortcuts Panel, Header, Side Navigation, Modal, Scrollbar).

### Lot 1 : relevé dans les fichiers consommateurs (lecture seule, préalable obligatoire)
Compter les instances, dans les fichiers de fonctionnalités et entre librairies, de : Link `b9493d2f…`, Flyout Menu Legacy `5d1147ac…`, variante Dropdown 2288:1056, les deux Table Row, Select Card / User card, les composants à dépublier (Data Display, Layout), et les surcharges sur les atomes de Card.

### Lot 2 : nettoyage sans risque de surcharge
- Supprimer : sections To review (46), anciens `.Spec` / `.Icon` de Popin, instances orphelines `.Modal Box/small` de Modal.
- Renommer : Input Search (set nommé « Input Date »), Modal Header / Content / Footer, calques « Frame n » (mettre à jour le PLAYBOOK pour `Frame 172`).
- Remplir ou créer les blocs Versionning, aligner les statuts avec `components.json`.
- Ajouter les liens de documentation (ZeroHeight) et les descriptions des atomes privés.
- Ajouter variantes et booléens manquants : Functional Notice (3 variantes), Snackbar, Popover, Button `Focus`, `.Helper Text` des inputs, Header Selection select-all.
- Foundation en direct vers Semantic de même valeur (Tab, Tile, Button Plain Reversed, Input Email).

### Lot 3 : corrections avec risque, après le lot 1
- Échanger l'ancien Link vers 688:4202 (Breadcrumb, Pagination, List Item) ; recomposer Tag avec de vrais Chip ; Pagination et Keyboard Map sur les maîtres locaux.
- Supprimer la variante Dropdown parasite (après bascule des instances), dépublier les parasites et obsolètes, puis les collections locales.
- Remplacer les liaisons `qrn` et les styles de texte hérités par les Tokens de même valeur.
- Rayons, traits et paddings bruts vers Semantic (Button, Button Icon, Chip, Data Entry, Card) : audit de surcharges dédié pour les atomes de Card.
- Spinner : renommer `Property 1`, ajouter Size / Tone (vérifier Button Loading).

### Lot 4 : décisions de l'utilisateur
- Badge : code 14 Regular ou Figma 14 / 16 SemiBold.
- Valeurs hors grille de Data Entry (paddings 6, gaps 10 et 12, anneau de focus 6, Toggle 26) : aligner sur le code ou garder.
- Où vivent les ombres (Tokens n'en a pas).
- Header `Menu Open` : supprimer ou dessiner ; Modal xlarge 1080 ou 1280 comme le code.
- Écarts de propriétés avec le code : Figma suit le code, ou l'inverse, composant par composant.

Chaque lot se termine par une publication des librairies touchées, faite par l'utilisateur ou avec son feu vert.
