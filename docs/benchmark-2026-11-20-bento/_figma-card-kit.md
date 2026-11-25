# Figma, page « Card kit » : rapport (2026-11-23)

Fichier `XW7jVtIa6UWRTqKMDqOF5D`, nouvelle page `Card kit` (`78:20`). Les autres pages n'ont été que lues (la
`Local · Card toolbar` de la page Edit flow est instanciée, pas modifiée). Rien en librairie, rien publié, aucune
variable ni collection créée, rien de commité.

## Sections (une colonne, x 0, 560 px entre sections)

| Section | nodeId | y | Taille | Contenu |
|---|---|---|---|---|
| 01 · Master | `92:418` | 0 | 4608 x 2312 | set Bento Card, 4 atomes imbriqués, anatomie 2x2 + pastilles 1 à 4, Notes `92:513` |
| 02 · Sizes | `93:477` | 2872 | 4476 x 3452 | 14 formats en 4 groupes, slot vide, cotes sous chaque card, Notes `93:840` |
| 03 · States | `94:589` | 6884 | 2492 x 3344 | 5 états x 3 tailles (1x1, 2x1, 2x2), card « How much limit is left? », Notes `94:1420` |
| 04 · Emphasis | `95:1048` | 10788 | 1956 x 3432 | 8 niveaux x 1x1 et 2x1, données réelles, Notes `95:1788` |
| 05 · Content atoms | `96:1417` | 14780 | 3964 x 5860 | chaque atome dans une card None et une card Strong (Reversed), maîtres des atomes à droite, Notes `96:2930` |
| 06 · Today | `97:2335` | 21200 | 2464 x 2584 | board Common 1280 refait (18 cards), grille `97:2340`, Notes `100:3324` |
| 07 · Future | `102:3324` | 24344 | 2464 x 1800 | 11 idées sur une grille 6 x 6 `102:3329`, Notes `104:3799` |

Chaque section : fond Static/Background/Main/Tertiary, marge 160, `Section header` (Display/S/Bold + Body/L/Regular, 960 px),
blocs 160 px plus bas, cadre `Notes · <sujet>` (480 px, pastilles `Marker · N`) à 440 px à droite du bloc. Annotations
natives courtes sur le set (01), le board Today et le board Future ; les 440 px libres à droite sont tenus.

## Maître `Bento Card` (`91:577`, local)

- Variantes (12) : `Emphasis` = None, Subtle, Strong, Negative subtle, Warning subtle, Positive subtle, Negative strong,
  Warning strong, en `State=Default` ; et `Emphasis=None` seul pour `State` = Loading, Empty, Error, Edit.
  Produit croisé écarté (40 variantes) : une card en chargement, vide, en erreur ou en édition ne montre pas son emphase.
- Propriétés : `Emphasis`, `State` (variantes), `Content` (slot, `createSlot`), `Footer` (booléen, off). `.Card Header` et
  `.Card Footer` sont des instances exposées.
- Taille libre : 376 x 376 par défaut, la card se redimensionne ; règle N x 180 + (N - 1) x 16 (section 02).
- Padding Spacing/M, gap Spacing/S, rayon Border/Radius/M, None = bord 1 px Border/Subtle/Tertiary (Border/Size/S) ;
  niveaux subtle = liseré 4 px (Border/Size/L) dans la couleur du ton ; couleurs de la page Emphasis levels.
- Loading : titre gardé, 4 Skeleton Item (45 % x Sizing/L, 80 % x Sizing/S, 100 % x Sizing/XS, reste).
  Empty : `Local · Empty hint`. Error : Functional Notice (Low, Error, sans titre ni fermeture) + Button Tertiary Retry
  (icône Refresh). Edit : `Local · Card toolbar` (`51:3660`) à cheval sur le bord haut, centrée, clip désactivé.

Variantes : None `91:208`, Subtle `91:222`, Strong `91:249`, Negative subtle `91:275`, Warning subtle `91:302`,
Positive subtle `91:329`, Negative strong `91:356`, Warning strong `91:382`, Loading `91:408`, Empty `91:433`,
Error `91:459`, Edit `91:504`.

### Atomes imbriqués (préfixe « . », exposés)

| Atome | nodeId | Variantes | Propriétés |
|---|---|---|---|
| `.Card Header` | `79:136` | Reversed | Title (texte), Info, Status, Unit, Action (booléens), Unit text |
| `.Status` | `79:87` | Tone (Highlighted, On track, Warning, Problem) x Reversed | Reason (booléen), Reason text |
| `.Card Footer` | `79:173` | Type (Date, Link) x Reversed | Date text ; Link exposé (libellé) |
| `.Delta` | `84:153` | Direction (Up, Down) x Tone (Good, Bad, Neutral) x Reversed | Delta text |

## Atomes de contenu locaux (`Local · …`, section 05)

| Atome | nodeId | Variantes | Propriétés / instances de librairie |
|---|---|---|---|
| Key figure | `84:176` | Reversed | Value, Unit, Unit text, Delta, Context, Context text ; `.Delta` exposé |
| Key figure row | `84:203` | Reversed | Fact 4 (booléen) |
| Bullet graph | `84:218` | Reversed | Marker, Legend, Bound |
| Stacked bar | `84:255` | Reversed | Legend |
| Sparkline | `84:262` | Reversed | Last value |
| List row | `84:269` | Reversed | Label, Value |
| Task item | `90:269` | aucune | Divider ; List Item (librairie) exposé, Badge |
| News item | `90:320` | aucune | Divider ; List Item (librairie) exposé, Badge |
| Timeline item | `90:399` | Reversed | Date, Text, Delta, Line ; `.Delta` exposé |
| Mini table row | `90:450` | Type (Header, Row, Total) x Reversed | Col 3, Change ; `.Delta` exposé |
| Progress | `90:463` | Reversed | Label, Value ; Progress Bar (librairie) exposé |
| Grade chip | `90:488` | Reversed | Context, Context text, Delta ; Grade (librairie) exposé |
| Empty hint | `90:515` | Reversed | Message, Icon, Link ; Link (librairie) exposé |

Instances de librairie utilisées : Icon Functional + glyphes NDBX, Button Icon, Button, Link, Badge, Progress Bar, Grade,
List Item, Divider, Skeleton Item, Functional Notice. Audit final : 101 instances de Bento Card, aucun contenu hors slot,
aucun titre sur deux lignes, aucun texte sans style Tokens, aucun remplissage de texte non relié, aucun tiret cadratin,
aucun nœud hors section, rien à la racine de la page hors sections.

## 06 · Today

Board Common (`TEMPLATES[0]`), 6 x 10 cellules de 180, gouttière Spacing/M, 60 cellules sur 60, bord bas net, ordre et
positions de packCards (rapport de finition). Emphases du code : Grade Strong, Exposure et Limit left Subtle, Sanctions
Negative strong et Limit review Warning subtle (les deux fonds automatiques), Overdues « On track » en libellé sans fond.
Dates de card seulement quand elles diffèrent du board (Grade, Financials, Coverage).

## 07 · Future (11 idées)

Historique de paiements (3x1), notations externes (2x1), sinistres (1x1, état Empty), comparaison sectorielle (2x2,
Subtle), alertes (1x3), groupe et actionnaires (2x2), contacts (1x2), documents (2x1), échéancier de dette (3x2),
locataires (3x2), renouvellements (3x1). Aucun nouvel atome n'a été nécessaire.

## Écarts

1. Graphiques avec axes (Grade, Exposure, Financials du code) non refaits dans Today : la librairie Chart demande une
   courbe locale dans son slot Series ; la Sparkline locale a une série fixe (forme de l'exposition).
2. Le repère du Bullet graph ne se déplace pas sur une instance (position non surchargeable) : en 07, les médianes sont
   dites dans la légende et le repère est masqué. Piste : variante ou atome de repère, à trancher.
3. Warning : convention du Badge, exception de contraste assumée par le DS (passe 4).
4. Task item et News item sans Reversed (List Item de librairie sans version inversée).
5. Les variantes Reversed des maîtres sont blanches sur le fond gris de la section : elles se lisent dans les cards
   Strong de la section 05.
6. Jobs to do montre 5 tâches sur 8 en 1x4 (le code en montre autant que la hauteur le permet).
7. Icônes de statut en 16 px (12 dans le code), comme les autres pages du fichier.
8. Données inventées en 07, listées dans `Notes · Future` (DSO, rang sectoriel, actionnaires, contacts, échéancier,
   occupation, locataires) : à valider avant tout usage.

## Propositions de tokens (rien créé)

- Unité de grille 180 px (211 à 1920, 214 à 1024) et tailles de cards : valeurs de layout sans token.
- Colonnes du Mini table row : 64 px, colonne Change 56 px.
- Liseré 4 px sur Border/Size/L : usage d'accent nouveau de ce token (déjà relevé sur la page Emphasis).

## Passe 2 (densité, 06 et 07)

Règle : moins de ~15 % de vide par card, mesuré par script (bas du contenu du slot contre la hauteur du slot,
colonne la plus haute pour les cards à colonnes). Avant : 13 cards au-dessus de 15 % sur 06 (jusqu'à 30 %) et 9 sur 07
(jusqu'à 44 %). Après : toutes entre 1 et 14 %, aucun débordement (Claims est en état Empty, non mesuré).

- 06 Today, contenu réel des mocks ajouté par atomes existants :
  - Grade : Progress du score, sector score, lowest score.
  - Limit left : Policies. Payments : DSO, Average delay. Score : 12 months ago. Risk figures : Exposure.
  - Overdues : second événement (18 Sep 2023, retard de 42 000), le doublon Claims a été retiré.
  - Financials : Turnover, 5 years ; Next accounts.
  - Jobs : 6e tâche (FY 2024 interim accounts). News : 4e article (refinancement de 40 M).
  - Sanctions : Screened. Limit review : Last review. Coverage : demande du 02 Apr 2022.
  - By policy : 2 mouvements de limite de plus, et l'usage de la limite par police (6 Progress, champ `used`).
  - At a glance : une ligne de fait par colonne.
- 07 Future :
  - Tenants : 3 faits, échéancier des baux (Mini table, 38 locataires, 100 % du loyer).
  - Debt : cashflow, prochaine échéance, part due sous 2 ans (Progress), covenant de gearing.
  - Owners : bénéficiaire effectif, pays, grade du groupe.
  - Contacts : dernier échange. Alerts : 2 événements de plus (le compteur passe à 6).
  - Renewals : la Task item (badge Medium isolé à droite) est remplacée par 2 Timeline item, et une ligne est ajoutée à chaque colonne.
  - Payment history, ratings et sector : une ligne ou une jauge de plus.
- Aucun format ni placement n'a changé : les deux boards restent des rectangles sans trou.
- Les notes de 06 et 07 sont à jour, et la liste des données inventées de 07 est complétée.
- Colonnes encore sous-remplies dans une card dense (au-dessus de 15 % pour leur colonne seule) : Grade, gauche 23 %. Exposure, 3e colonne 27 %. Debt, gauche 23 %. Tenants, gauche 22 %. Glance, Overdue et Score 24 %.

## Passe 3 (Warning en orange foncé et orange clair)

Retour utilisateur : le Warning noir est remplacé par la convention des autres tons. Il y a désormais du foncé sur clair
en subtle et du clair sur foncé en strong.

- **Warning subtle** : fond Background/Functional/Subtle/Warning (Orange 050). L'icône et le libellé du `.Status`
  (Tone=Warning, Reversed=False) sont en orange foncé, ainsi que le liseré d'accent. Les textes neutres sont inchangés
  (Primary, Secondary), comme sur les autres subtle.
- **Warning strong** : fond orange foncé. Titre, icônes, statut, pied, contenu et Link sont en orange clair
  (Color/Static/Text/Subtle/Functional/Warning et Icon/Subtle/Functional/Warning = Orange 050). Les filets et pistes
  sont en Border/Main/Functional/Warning (Orange 400, décoratif).
- **Nouvelle valeur `Reversed=Warning`** sur `.Status`, `.Card Header`, `.Card Footer`, `.Delta` et les 11 atomes qui
  avaient un Reversed. Ces variantes sont des clones de `Reversed=True` recolorés, et leurs atomes imbriqués sont passés
  en Warning. J'ai rétabli les références de propriétés : le clonage les avait perdues.
- **Instances** : le maître `Emphasis=Warning strong` utilise Header, Status et Footer en Warning. Les deux cards
  Warning strong de 04 ont été recréées (`108:4366`, `108:4410`) avec des atomes Reversed=Warning : plus aucune
  surcharge Text/Main/Primary. Il n'y avait aucun Warning en 03, 06 ou 07, sauf Limit review (06), qui est en subtle et
  a suivi le maître automatiquement.
- **Contrastes mesurés** sur toutes les cards Warning (maître, 04, 06) : minimum 6,22:1 pour les textes et les icônes.
- **Notes** 01 (note 7) et 04 (libellé du niveau, note 4) mises à jour. Captures vérifiées : 01, 03, 04, 06.

Cette passe est remplacée par la passe 4 : son orange foncé brut et ses propositions de tokens sont annulés.

## Passe 4 (Warning selon la convention du Badge)

Décision utilisateur : l'orange est une **exception de contraste assumée par le DS** et suit le Badge (badge.component.scss,
Badge de la librairie Feedback). C'est une règle du DS, pas un défaut à corriger.

- **Warning subtle** (= Badge light) : fond Color/Static/Background/Functional/Subtle/Warning. Libellé du statut en
  Color/Static/Text/Main/Functional/Warning, icône en Color/Static/Icon/Main/Functional/Warning, liseré en
  Color/Static/Border/Main/Functional/Warning. Les textes neutres sont inchangés.
- **Warning strong** (= Badge strong) : fond Color/Static/Background/Functional/Warning. Tout le contenu est blanc :
  Text/Subtle/Primary et Icon/Subtle/Primary, avec les variantes Reversed=True, comme Negative strong. Le contexte
  Text/Subtle/Tertiary passe en Subtle/Primary sur les 3 cards Warning strong (maître `91:382`, cards 04 `108:4366`,
  `108:4410`).
- **Variantes `Reversed=Warning`** supprimées : 26 variantes, sur `.Status`, `.Card Header`, `.Card Footer`, `.Delta` et
  les 11 atomes. Avant la suppression, 8 instances ont été repassées en Reversed=True.
- **Les 4 nœuds en #894F01** sont reliés aux tokens :

| Nœud | Token |
|---|---|
| `91:382` | Background/Functional/Warning |
| `91:328` | Border/Main/Functional/Warning |
| `79:61` | Text/Main/Functional/Warning |
| `I79:56;216:400` | Icon/Main/Functional/Warning |

- **Contrôle « zéro valeur brute »** : 0 peinture SOLID non reliée sur la page, hors calques internes des instances de
  librairie, et 0 occurrence de #894F01. Les traits par défaut des 7 sections, qui n'étaient pas reliés, ont été retirés.
- **Contrastes mesurés** : Warning subtle 2,48:1 (libellé et icône orange 400 sur 050) ; Warning strong 2,63:1 (blanc sur
  orange 400). Ce sont les valeurs du Badge, l'exception est assumée par le DS. Le statut reste porté par une icône et
  un libellé, jamais par la couleur seule.
- Les propositions de tokens Warning Strong sont retirées. Notes 01 (note 7) et 04 (libellé du niveau, note 4) mises à
  jour. Captures 01 et 04 vérifiées.

## Questions

1. Garder 12 variantes (états sur None seulement) ou ouvrir Loading et Edit sur toutes les emphases ?
2. `.Status` porte la raison en option : dans le code elle est en infobulle ; faut-il la montrer par défaut sur les deux
   fonds automatiques ?
3. Sparkline et repère du Bullet graph : en faire des variantes de données (forme montante, plate, descendante) ou
   renvoyer vers la Chart de librairie dès qu'il faut des données réelles ?
4. Faut-il un atome « en-tête de bloc » (libellé de groupe, ex. « Limit movements ») ? Il manque dans Today et a été
   contourné.

## Passe 5 (recommandations validées, research-card-kit-questions.md)

Page `Card kit` (`78:20`) seulement. Rien publié, aucune variable ni collection créée, rien de commité.

- **Q1, raison visible.** `.Card Header` (`79:136`) passe en deux rangées : `Title row` (titre, info, `.Status`, unité,
  action) puis `Reason` (Body/S/Regular, Text/Main/Secondary ; Text/Subtle/Primary en Reversed), propriétés `Reason`
  (booléen) et `Reason text`. Allumée par défaut sur les variantes Negative subtle, Warning subtle, Negative strong et
  Warning strong du maître (`91:276`, `91:303`, `91:357`, `91:383`), éteinte sur On track. La raison en ligne de `.Status`
  et ses deux propriétés sont supprimées (un seul mécanisme, aucune instance ne l'utilisait). En 06 Today, Jobs to do
  montre son Warning calculé (« 2 high-priority tasks past due ») sans fond (plafond de 2) ; en 1x1, la raison remplace la
  ligne de contexte (Sanctions, Limit review).
- **Q3, `Local · Group heading`** (`115:4909`, variantes Reversed False / True) : Label (Body/S/Semi Bold, Text/Main/Secondary,
  Subtle/Tertiary en Reversed), Meta (booléen + texte, régulier, à droite), une ligne. Posé dans By policy (06) : « Limit
  movements · 5 latest » et « Limit used · by policy » (libellés des barres raccourcis au nom du titulaire), padding haut
  Spacing/S en plus du gap S (soit M au-dessus). Vitrine en 05 (`115:5396`, `115:5485`), section 05 agrandie de 568 px,
  06 et 07 décalées d'autant (écarts de 560 px tenus).
- **Q4, liseré supprimé.** Les 4 variantes subtle perdent `Accent bar` ; bord complet 1 px (Border/Size/S) en
  Border/Main/Functional/Negative, Warning, Positive ; Subtle garde le bord neutre Border/Subtle/Tertiary. Notes 01 et 04
  et libellé de la section 04 mis à jour.
- **Q2, slot `Plot`.** `Local · Sparkline` (`84:262`) : slot `Plot#114:0` (série + dernier point, contraintes Scale).
  `Local · Bullet graph` (`84:218`) : le cadre `Track` devient le slot `Plot#114:6` (piste reliée Border/Radius/Round,
  hauteur Measurement/Sizing/S, avec Fill et Marker). Une seule propriété de slot par set, partagée par les deux
  variantes. Descriptions des deux sets réécrites (code : `ds-sparkline`, `ds-bullet-graph`). L'écart 2 (repère figé) est levé.
- **Q5, Exposure.** La sparkline remplit la 3e colonne (Fill), la borne « 5.00 M » de la légende est masquée (le plafond est
  déjà en colonne 2) : la légende tient sur une ligne. Colonnes : 21 %, 0 %, 0 % de vide (contrôle à 25 % par colonne).
  Aucune donnée ajoutée. Note 06 : « 15 % par card (règle Qirin, bloquante), 25 % par colonne (contrôle) ».
- **Q6, données inventées.** Catégorie d'annotation `Sample data` (orange, `115:4`) ; une annotation par card de 07 à
  données inventées (Payment history, Sector comparison, Group and owners, Contacts, Documents, Debt maturity, Tenants).
  Sous-titre de section « Illustrative data, not validated » (Body/L/Semi Bold). Noms génériques : Family shareholders,
  Investment fund A, Person A, Person B, Broker A, Tenant 1 (BHV, Roussel, Seine Capital, A. Fontaine, Lumière Courtage
  retirés). Notes 07 (2 et 4) réécrites. Les agences de notation et les analystes C. Morel et J. Petit viennent des mocks
  du code et sont gardés.

Contrôles : 0 peinture SOLID non reliée hors instances de librairie, 0 texte sans style, 0 tiret cadratin ; aucune card
Default de la page dont le contenu dépasse le slot (contrôle par script). Captures vérifiées : maître 01, 04, 05 (vitrine),
06, 07.

Écart relevé : en 06 Today, Sanctions est en Negative strong alors que le code calcule un fond pâle (auto = Negative subtle,
`lookOf`). Laissé tel quel dans le kit ; la page Mockups suit le code. Les annotations `Sample data` sont posées sur des cards
voisines dans la grille : en Dev Mode, leurs bulles peuvent couvrir la card de droite.

## Passe 6 (06 Today aligné sur le code)

- Sanctions (`98:3115`) passe de Negative strong à **Negative subtle**, comme `lookOf` (Auto = fond pâle) et la page
  Mockups (écran Common `118:3984`) : `.Card Header`, `.Status` et les atomes du slot (Key figure, 2 List row) en
  Reversed=False ; calque renommé `Card · Sanctions · 1x1 · Problem`. Tous les textes résolvent sur des tokens Main.
- Les 17 autres cards de 06 ont été comparées à Common (emphase, statut, raison) : identiques, rien changé.
- Note de 06 (`100:3333`) réécrite : les deux fonds automatiques sont pâles (Sanctions Negative subtle, Limit review
  Warning subtle). L'écart de la passe 5 est levé. Page Mockups non touchée. Capture de la grille `97:2340` vérifiée.
