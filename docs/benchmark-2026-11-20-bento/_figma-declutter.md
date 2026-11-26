# Figma Bento, icônes et désencombrement (2026-11-26)

Fichier `XW7jVtIa6UWRTqKMDqOF5D`. Retour utilisateur : décalages d'icônes ; fichier trop annoté, à rendre « fait par un
designer » (mémoire `figma-human-scale`). Rien publié, aucune mise à jour de librairie acceptée, aucune librairie
modifiée, rien commité. Captures : `captures/figma-declutter/` (avant/après par page, zooms des défauts).

## 1. Audit des icônes

Script sur Mockups, Card kit, Board 1024 fold et l'archive Edit flow (1 865 instances visibles Icon Functional, Button
Icon, .Swatch) : centrage dans un conteneur à enfant unique (écart > 0,5 px), centre de l'icône contre la ligne de texte
voisine dans la même rangée, taille, rognage par un parent qui coupe, décalage du tracé dans sa grille. Puis captures
zoomées (x2 à x4) du header, de la topbox, de la barre du board, de la barre d'édition, de la barre d'outils de card,
des drawers Boards, Add a card et New board, du toaster et de cartes à statut, delta et timeline.

Résultat : centrage et alignement sur la ligne de texte justes partout au script (0 écart > 0,5 px dans le contenu
local) ; pas de rognage hors viewport voulu (écrans 800 px). Tailles : 16, 24 et 12 px ; les 12 px sont les flèches
`.Delta` et les icônes de statut en ligne, comme le code (`[size]="12"`).

### Corrigé dans le fichier

| Où | Défaut | Correction |
|---|---|---|
| Mockups, barre d'édition de « Edit mode, just duplicated », « Resize a card », « Add a card » (6 instances : `121:12806`, `121:12815`, `121:14832`, `121:14833`, `123:11441`, `123:11442`) | Undo et Redo en Button Icon `Size=M` (40 x 40, icône 24) à côté de boutons de 32 : boîtes plus hautes que la rangée, icônes plus grosses que le plus d'Add card. Le code met `ds-button-icon` taille s (32) et `ds-icon` 16. | `Size=S` (32 x 32, icône 16), glyphes Undo et Redo conservés. La barre fait 32 comme en lecture ; les écrans 06 et 07 passent de 2224 à 2216 px comme les autres, poignée de coin et étiquette « 2 × 2 » remontées de 8 px avec leur card, rangées 3 et 4 de la page remontées de 8 px (200 px entre rangées tenus). |

Captures : `mock-06-editbar-zoom-before.png`, `mock-06-editbar-zoom-after.png`, `mock-06-edit-after.png`.

### Défauts de librairie (non modifiés, à corriger à part)

| # | Composant | Librairie | Écart mesuré | Capture |
|---|---|---|---|---|
| 1 | Header (`39e53ceff3e2…`, `Menu Open=False`) | [Layout] | Libellés de navigation et menu utilisateur (« John Doe » + chevron) centrés à y 28, logo et boutons Search, Help, Bell centrés à y 32 : **4 px** entre « John Doe » et les icônes voisines. Sur tous les écrans (Mockups, 1024 fold, archive). | `lib-header-icons-zoom.png` |
| 2 | `.Card Toolbar` (`2243:204`) | [Components] Data Display | Poignée de déplacement en Icon Functional **24 px** (boîte 24) entre des boutons à icône 16 (pastille, dupliquer, supprimer) ; le code met `move` en 16. Centrage vertical juste (centre 17 sur 34). | `lib-card-toolbar-zoom.png` |
| 3 | Functional Notice (`5360fd6cdf3f…`, Medium, sans titre, une ligne) | [Components] Feedback | Icône 24 alignée en haut d'une ligne de texte de 20 : centre de l'icône **2 px** sous celui du texte (bandeau de l'archive `246:15128`). | `lib-functional-notice-zoom.png` |
| 4 | Glyphes Undo et Redo | NDBX Icons | Tracé décalé vers le bas dans sa grille : marge haute 4,9 px, basse 2,0 px à 16 px, soit **1,45 px** (2,2 px à 24). | `mock-06-editbar-zoom-after.png` |
| 5 | Glyphe Policy Process (rail de Side Navigation) | NDBX Icons | Tracé **1,5 px** à droite du centre de sa grille 24. Mineur. | |

À noter, ni librairie ni fichier : dans le drawer Boards (écran Manage boards), la coche du board ouvert est centrée sur
la rangée de deux lignes (nom + « 18 cards, open »), donc 14 px sous la ligne du nom. La maquette suit le code
(`.bm-row` en `align-items: center`) ; à corriger dans le code si l'on veut la coche sur la ligne du nom
(`mock-05-boards-check-zoom.png`).

## 2. Désencombrement

Tous les textes retirés sont copiés mot pour mot dans `_figma-notes-archive.md` (les décisions sont aussi dans
`_figma-card-kit.md`, `_figma-mockups.md`, `_figma-feedback-2026-11-25.md`).

### Card kit

- Sections renommées, sans numéro : Widget Card, Sizes, States, Emphasis, Content atoms, Common board, Future ideas,
  Gallery tiles ; titre court identique dans l'en-tête.
- Retirés : 7 cadres Notes, 8 paragraphes d'intro, 2 lignes « Since 24 Nov 2026 », le sous-titre de Gallery tiles,
  6 pastilles numérotées (anatomie, Common board), 2 annotations « see Notes » (boards 06 et 07), 8 légendes de niveau
  d'emphase, 15 descriptions d'atomes, 4 libellés de groupe et 14 cotes de Sizes (le titre de chaque card dit déjà
  « 1 × 1 »), 3 en-têtes de colonne de States. 68 calques supprimés au total.
- Gardés et raccourcis : noms de rangée (états, niveaux, atomes : « Key Figure », « List row »...), étiquettes des
  vitrines (« Widget Card, 12 variants », « .Card Header », « .Status », « .Card Footer », « Example, 2 × 2 Subtle with
  footer », « Library atoms », « Local atoms »), sous-titre « Sample data, not validated » de Future ideas, et les
  7 annotations Sample data en version courte (« Sample data: DSO trend, invoices »...).
- Espacements : 160 px de marge, 64 px sous le titre, 16 px entre un nom de rangée et ses cards (le nom de la rangée Edit
  est au-dessus de la barre d'outils), 400 px entre sections ; la colonne droite de Content atoms rapprochée à 240 px
  (le vide des notes est fermé). Composants, variantes et cards inchangés.

### Read me

Une page courte : couverture (titre, une phrase, mini board, Status et Updated 2026-11-26 ; Source et Route retirés),
puis deux cartes : **Pages** (Mockups, Card kit, Board - 1024 fold, Archive, une ligne chacune, liens conservés) et
**Library and status** (lien vers [Components] Data Display, statut en une phrase). Retirés : légende des emphases et
crédits (Prototype, Data, Benchmark, Team).

### Mockups

0 annotation et rien de technique dans les textes (déjà le cas). Titres d'écrans raccourcis, sans numéro ni « · » :

| Avant | Après |
|---|---|
| 01 · Common · Read | Common board |
| 02 · Credit Assessment · Read | Credit Assessment board |
| 03 · Credit Underwriting · Read | Credit Underwriting board |
| 04 · Board selector open | Board selector open |
| 05 · Manage boards | Manage boards |
| 06 · Copy of Common · Edit mode, just duplicated | Edit mode, just duplicated |
| 07 · Copy of Common · Resize by the corner | Resize a card |
| 08 · Copy of Common · Add a card, gallery open | Add a card |
| 09 · Board loading | Board loading |
| 10 · Card in error and empty card | Card error and empty card |
| 11 · Common · Read · 1920 | Common board at 1920 |
| 12 · New board, from a template | New board from a template |
| 13 · New board, from an existing board | New board from a board |

### Board 1024 fold et archive Edit flow

Non touchées : aucun défaut d'icône propre au fichier (seuls les défauts de librairie 1 et 3 y apparaissent).

## 3. Contrôles

- Card kit : 0 texte avec « · » ou « — », 0 texte sans style, 0 peinture SOLID non liée hors instances de librairie,
  0 chevauchement entre éléments d'une section, 0 élément hors de sa section, 7 annotations (Sample data seulement).
- Read me : 0 « · », textes stylés et liés (le libellé du lien reprend le style et la couleur des liens de page).
- Mockups : 0 annotation, 0 texte technique, 200 px entre rangées d'écrans, barres de 32 px partout.
- Captures avant/après relues : Read me, Card kit (8 sections), écrans 06, 07, 08.

## Écarts

1. Les variantes Reversed des atomes restent blanches sur le fond gris des sections (Widget Card, Content atoms) :
   défaut antérieur (`_figma-card-kit.md`, écart 5), non traité ici.
2. Les maîtres `Local · Thumb / *` apparaissent avec un contour sombre dans les captures de la section Gallery tiles,
   alors que leur trait est lié à Border/Subtle/Tertiary : rendu du maître, déjà visible avant.
3. Les rapports `_figma-mockups.md` et `_figma-card-kit.md` citent les anciens numéros d'écrans et de sections : la
   table ci-dessus fait la correspondance.
