# Lot data-display-1 : librairie Data Display (`VpConH5AUGyCqtp8PMqj1i`), 2026-11-16

Composants : Card, Widget Card, Result Card, Policy Result Card, Icon Tile. Modèle : Action > Button (4030:979), regardé en capture avant toute écriture. Kits : `doc-kit.js`, `board-kit.js`, `page-kit.js` (copies exactes, non modifiés). Rien publié, aucun commit, pas de MCP ZeroHeight, aucun token, collection ou mode créé, aucun composant, variante ou propriété créé, renommé ou supprimé, rien détaché. Pages Action Card, Pie Chart, Cover, Status et pages des autres agents non touchées. Captures de contrôle hors repo : `C:/Users/JDAHAN/AppData/Local/Temp/dd1/`.

## Méthode de l'étape 1 (Card très utilisée : aucun rendu ne doit changer)

Expérience faite sur des instances temporaires (supprimées, maîtres restaurés à l'identique) avant toute liaison :
- **Valeur brute liée pour la première fois** (padding 24 du Slot de Widget Card) : l'override brut d'une instance (0) est **écrasé** par la liaison (24). Même mécanisme que les rayons de Button Split. Les fichiers de fonctionnalités ne sont pas vérifiables d'ici, donc **toutes les liaisons numériques nouvelles (paddings, gaps, rayons, textes) sont différées** pour Card et Widget Card.
- **Liaison Foundation remplacée par le Semantic de même valeur** (rayon `foundation/size/3xs` vers `Border/Radius/S`) : l'override brut de l'instance (0) est **conservé**. Remplacement appliqué.
- **Couleur liée dans la peinture** : l'override de fills d'une instance (rouge) est **conservé** (la peinture est surchargée en bloc). Liaisons de couleur appliquées.
- Signature de géométrie (position absolue, taille, opacité, 4 paddings, gap, 4 rayons, trait, fills et strokes résolus, texte) sur les 59 COMPONENT des 16 racines de la page Card et leurs 187 instances du fichier (2 797 nœuds) : **0 différence**. Captures `get_screenshot` avant / après du bloc Component (355:10337), des Atoms (355:10367) et de Widget Card (1448:11053) : md5 identiques.

## Card (page Card 84:8393, set 354:4525)

- Section `Card` **2161:4173** (6635 x 10968). 01 header **355:10305** | 02 Documentation **2161:4174** | 03 Do/Don't **2161:4245**. Pas de Versionning sur la page. `lost`, `miss` vides ; `overlaps` vide après déplacement du libellé.
- Étape 1, posées : 89 coins de rayon `foundation/size/3xs` vers `Border/Radius/S` ; peintures : fonds 255 vers `Static/Background/Main/Primary` (17), traits 217 vers `Static/Border/Subtle/Tertiary` (8), textes 65 vers `Static/Text/Main/Secondary` (287), 118 vers `Text/Main/Tertiary` (3), 18 vers `Text/Main/Primary` (2), blanc vers `Text/Subtle/Primary` (2), 0,122,179 (`action/blue/500`, libellé devise) vers `Text/Main/Alt/Primary` (1), fonds 217 vers `Background/Accent/Tertiary` (3), 245 vers `Background/Main/Secondary` (1), cadre Icon de .Company Profile 65 vers `Icon/Main/Secondary` (1).
- Différé : paddings 24 / 25, gaps 4 / 8 / 10 / 16 / 24, rayons bruts 4 / 8 / 100, graisses et tailles de texte (risque d'écraser les overrides des fichiers de fonctionnalités, voir méthode) ; libellés de ligne `grey/450` (91,91,91, 222 textes : seul Semantic de cette valeur = `Interactive/.../Medium/Alt/Hover`, mauvais rôle) ; séparateurs 230,230,230 (66 traits, aucun Semantic) ; fond et vecteur 1,143,215 de .Left (aucun Semantic, opacité 20 %) ; fond 183,30,63 à 5 % de .Missing Data ; illustration undraw de .Settings (dessin, non concernée).
- Description posée sur 354:4525 (elle était vide).
- Header 01 rempli : description (« Component description »), Tech « In code » (était « Not started »), Design WIP gardé. Le cadre rouge de dépréciation (Frame 34, 1448:13415) a été recadré sur la hauteur du Content (il débordait sous le bandeau après restyle). Le libellé `DEPRECATED` (1448:13416) est rangé dans la section, au-dessus du header.

| Règle (texte exact, `card.md`) | Frame | nodeId |
|---|---|---|
| Do keep cards flat at rest. | do · card · flat at rest | 2154:22135 |
| Don't add a drop shadow for depth; use `elevated` only for an open or active state. | dont · card · drop shadow for depth | 2154:22181 |
| Do use `noPadding` when the content has its own padding (a table, a chart). | do · card · no padding for padded content | 2154:22227 |
| Don't nest a padded card in a padded card. | dont · card · padded card in padded card | 2154:22251 |
| Do use the same card type for every block of one grid. | do · card · same type in a grid | 2154:22316 |
| Don't mix a Key Info card and a full panel card on the same row without a reason. | dont · card · mixed types on a row | 2154:22412 |

- Frames 520 x 300 (une card fait 339 à 376 px de large), fond `Static/Background/Main/Secondary`, vraies instances : Type=Default (.Columns en Layout Horizontal pour ne pas couper le contenu), Key Info, Widget Card. Le Don't « drop shadow » porte une ombre brute en override d'instance (aucun style d'ombre dans Tokens).
- Text only : aucune. Pas de frame anatomy. To review : rien (pas de 2e gabarit ni de brouillon).
- Écarts (Notes de la doc) : six Types Figma / ds-card simple boîte ; noPadding, loading, elevated, tone (dont `subtle`) en code seulement ; paddings non liés (différé) ; grey/450 et séparateurs 230 sans Semantic ; **header du set marqué DEPRECATED alors que le set est la Card publiée utilisée partout**, et card.md désigne le header 2.0.0 (1448:11021, Card with Slot) comme header de Card : à trancher par l'utilisateur.

## Widget Card (page Card 84:8393, COMPONENT `Card` 1325:10443)

- Section `Widget Card` **2161:23529** (6635 x 4095), 400 px sous la section Card. 01 header **1448:11021** | 02 Documentation **2161:23530** | 03 Do/Don't **2161:23601**. `lost`, `miss`, `overlaps` vides.
- Étape 1, posées (même passe que Card, signature commune) : fond du composant et du SLOT vers `Static/Background/Main/Primary`. Différé : padding 24 du Slot (expérience : écraserait les overrides, 41 cards dans Buyer Summary), gap 10 du Separator (aucun Semantic), trait 230 du séparateur (aucun Semantic).
- Description : déjà une phrase d'usage (« 🆕 Header · New · 2026-11 · Optional header for board widgets... »), laissée telle quelle.
- Header 01 rempli : description, Design « New » (Info), Tech « In code ». Titre et fil d'Ariane du header restent « Card » (nom Figma), version 2.0.0 laissée (components.json : 1.0.0, noté).

| Règle (texte exact, `widget-card.md`) | Frame | nodeId |
|---|---|---|
| Do put one widget per card. | do · widget-card · one widget per card | 2154:22483 |
| Don't stack two titled blocks in one Widget Card. | dont · widget-card · two titled blocks | 2154:22538 |
| Do keep the action at top-right. | do · widget-card · action top-right | 2154:22639 |
| Do draw local content in the Slot. | do · widget-card · local content in the slot | 2154:22680 |

- Frames 520 x 460, instances Header=True, Slot rempli d'instances `.Columns` (en-tête interne masqué), `.Title`, Icon Tile et de textes locaux liés aux variables. Hauteur de l'instance passée en hug (sinon le contenu était coupé à 248).
- Text only : « Don't add more than one icon action; use a kebab menu for several. » (le Button Icon n'est pas un slot : une 2e icône demanderait de détacher) ; « Don't detach the master to change the frame. » (un détachement ne se montre pas avec une vraie instance).
- To review : rien.
- Écarts (Notes) : nom Figma `Card` / `ds-widget-card` ; version 2.0.0 / 1.0.0 ; Header=False par défaut en Figma, barre de titre toujours rendue en code ; titre Text/Main/Secondary (Figma) / Primary (code) ; padding de Slot non lié ; seeFigures en code seulement.

## Result Card et Policy Result Card

- **Aucune page ni aucun composant dans le fichier** : l'inventaire des 20 pages n'a rien trouvé, `components.json` pointe les deux vers `680:6820` = **Horizontal Card** (page `Horizontal Card 🟢🟢`, hors lot), dont la description dit « replaces Result Card and Policy Result Card » (v1.0.0, 2026-11-03). Rien fait dans Figma (pas de composant à documenter, et Horizontal Card relève d'un autre agent).
- **Pas de .md** pour ces deux composants. Règles construites depuis le code (`shared/ui/result-card`, `shared/ui/policy-result-card`), à reprendre sur la page Horizontal Card ou dans une future page ZeroHeight :
  - Do : une rangée pleine largeur par objet (buyer, police, draft), même enveloppe et même rangée d'actions pour un buyer et une police. Don't : refaire une enveloppe de carte locale pour un nouveau type d'objet.
  - Do : garder le nom en vrai lien (focus clavier, aperçu au survol) ; la page décide de la navigation (`opened`). Don't : rendre le nom cliquable quand l'objet n'existe pas encore ou n'a pas de Company ID (`canOpen` faux).
  - Do : première lecture courte (nom, statut, clé, produit et assuré, date utile), le reste au dépliage (`open`, `toggled`). Don't : afficher les sections de détail repliées quand il n'y a aucune donnée (`hasDetails`).
  - Do : `size="s"` pour les listes d'historique, `m` pour les résultats. Don't : mélanger les deux tailles dans une liste.
  - Do : Icon Tile en visuel de tête. Code : `data`, `open`, `size`, `favorited`, `internal` (Result Card, force le provider « ES »), `today` (Policy Result Card) ; sorties `toggled`, `added`, `starred`, `opened`.
  - Écart : components.json donne à Policy Result Card la description de Result Card et la version 0.9.0.

## Icon Tile (page 🆕 Icon Tile 2020:47, set 2020:358)

- Section `Icon Tile` **2161:23861** (7189 x 3959). Versionning **2020:256** | 01 header **2020:48** | 02 Documentation **2161:23862** | 03 Do/Don't **2161:23933**. `lost`, `miss` vides ; `overlaps` vide après rangement des glyphes.
- Étape 1 : tout était déjà lié au Semantic (rayons S / M, trois fonds de ton). Rien posé. Différé : remplissage 64,64,64 des 4 glyphes locaux (🆕 Grid, Contract, File Text, File New), aucun Semantic de cette valeur (65,65,65 est `Text/Main/Secondary`). Description existante gardée (« New · 2026-11 · Square tile holding one icon... », déjà une phrase d'usage).
- Les 4 COMPONENT de glyphes, posés à plat sur la page, sont rangés dans la section `Icon Tile` sous Versionning (ils contiennent des COMPONENT, donc jamais en To review).
- Header 01 et Versionning déjà remplis par l'utilisateur : non modifiés.

| Règle (texte exact, `icon-tile.md`) | Frame | nodeId |
|---|---|---|
| Do: one tile per row, same size down a list. | do · icon-tile · same size down a list | 2155:21543 |
| Don't: mix S and M tiles in the same list. | dont · icon-tile · mixed sizes in a list | 2155:21568 |
| Do: keep the tile as a static leading visual. | do · icon-tile · static leading visual | 2155:21593 |
| Do: pick the tone for the context (Brand in results). | do · icon-tile · brand tone in results | 2155:21603 |
| Don't: use the tone to carry a status. | dont · icon-tile · tone as status | 2155:21622 |

- Frames 360 x 200, vraies instances d'Icon Tile (glyphe permuté vers 🆕 Contract pour les polices) et textes liés aux variables.
- Text only : « Don't: use it as a button; it is not clickable. » (un état cliquable ne se dessine pas sans inventer un état que le composant n'a pas).
- To review : rien.
- Écarts (Notes) : rayon 5 px en M (code) / 4 ; tailles et rayons en dur ou Foundation dans le code ; glyphe en tokens Text (code) / Icon (Figma) ; taille par défaut S (Figma) / m (code) ; glyphes locaux à 64,64,64.

## Contrôle visuel (2 passes par composant)

- Passe 1 : contenu de Card Type=Default coupé en bas (.Columns Vertical) : passé en Layout Horizontal dans les frames et la doc ; Widget Card coupée à 248 px : instance et Slot en hug, frames passées de 360 à 460 de haut ; en-têtes `.Columns` dupliquant le titre du widget : masqués ; Key Info dans un widget (card dans une card, contraire à la règle Card) : remplacé ; repères 2 et 3 de l'anatomie Widget Card sur le titre : remontés, 3 recalé sur le kebab ; cadre rouge DEPRECATED débordant sous le header : recadré.
- Passe 2 : sections complètes des deux pages, planches zoomées : textes non coupés, descriptions Hero sur une ligne, cartes équilibrées.
- Limite connue : la tuile Brand (241,249,250) se lit mal sur le fond imposé Main/Secondary des frames ; fond gardé selon la consigne.

## Points ouverts

1. Statut du set Card : header marqué DEPRECATED mais set publié et utilisé partout ; card.md, lui, appelle « header de Card » le 2.0.0 qui contient Card with Slot.
2. Liaisons numériques de Card et Widget Card : à poser seulement après vérification des overrides dans les fichiers de fonctionnalités, ou à la prochaine version majeure.
3. Result Card / Policy Result Card : pas de composant Figma, règles ci-dessus à porter sur la page Horizontal Card.
