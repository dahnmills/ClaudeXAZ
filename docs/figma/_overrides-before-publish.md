# Libellés de Link avant publication (relevé du 2026-11-17)

Relevé en LECTURE SEULE (aucune écriture Figma, aucune mise à jour de librairie acceptée). Contexte : dans les maîtres,
l'ancien Link `b9493d2f…` (set 171:3074, texte dans `.Specs > Label`) a été remplacé par le Link `77367a8f…` (set 688:4202,
texte dans `Label`) dans Snackbar (Feedback 124:34846), Breadcrumb (Action 298:5526), Pagination `.Options` 53:2954 et
`.Options Select (Legacy)` 53:2983. À la mise à jour de librairie, un libellé surchargé chez un consommateur reviendrait à la
valeur du maître.

- Données machine : `docs/figma/_overrides-before-publish.json`
- Script de repose (ne pas exécuter avant publication et mise à jour) : `docs/figma/restore-link-labels.js`

## Clés relues dans les maîtres

| Composant | Fichier, nodeId | Clé |
|---|---|---|
| Snackbar | Feedback 124:34846 | `c398cab3efd7eae1c3f1d2d7ae62d81b6ed65ac4` |
| Breadcrumb | Action 298:5526 | `955f4ed585e92b7a35ef2efe4ecd083514754dd8` |
| Pagination (set) | Action 53:2994 | `99702f1c1c48a38ed526ccb14a712205b95f7ee4` |
| `.Options` (set) | Action 53:2954 | `9310e8a078ca348cc5547c7e3554394d0ddb994f` |
| `.Options Select (Legacy)` | Action 53:2983 | `7cdcd73ef5d7c505aa5b42498f95ca3c846b14ee` |

`components.json` n'a pas de `componentKey` pour Snackbar ni Pagination (valeur `null`) : clés relues dans les maîtres.
Les nodeIds des Link dans les maîtres sont inchangés par le swap (Breadcrumb 298:5479 à 298:5485, `.Options` 196:1790…,
Snackbar 124:34810) : chez le consommateur, l'id de l'instance de Link (`I<instance>;298:5479`) reste stable, seul le calque
texte change (`…;.Specs;Label` vers `…;Label`).

## Méthode

`use_figma` page par page (125 pages), calques masqués inclus. Une instance est retenue si la clé de son set (ou de son
composant) est l'une des cinq ci-dessus, y compris imbriquée dans un composant local ou distant. Filet par nom (Snackbar,
Breadcrumb, Pagination, `.Options`) retenu seulement s'il contient un Link : il n'a rien ajouté (les `.Options` de Tab et Tag
ne contiennent pas de Link). Surcharges lues sur `overrides` de l'instance et de ses instances parentes. Contrôle croisé :
chaque Link ancien non retenu est rattaché à son conteneur, et les totaux par fichier retombent sur ceux du lot 1
(`_audit-lot1-consumers.md`).

## Résultat par fichier

| Fichier | Pages | Instances | Libellés | Où sont les anciens Link non concernés |
|---|---|---|---|---|
| Coverbook `NflKzgx17mOn2JPoFaqnjW` | 7 | 0 | 0 | 50 dans `.Content Type` |
| Reject Management `zUzOSE77EjbShM9u7yLthB` | 7 | 0 | 0 | 19 : Resolution notice 14, Correction modal footer 2, directs 3 |
| Manual Underwriting `9EXkGvyk2yGF9qFpRpV0Ey` | 7 | 0 | 0 | 8 : Modal content / Send 7, direct 1 |
| Search `LBLqJmlPqXmx9qksCyYGPb` | 7 | 0 | 0 | 63 : Result / Policy content 48, Buyer content 9, directs 6 |
| Buyer Summary `0ZjZu0OjHdzGowm3hliM2M` | 8 | 0 | 0 | 42 dans List Item |
| Exposure Card `5OVzA6FZD7o8aGtfK5qo7g` | 1 | 0 | 0 | aucun |
| Component Status `wqlQIlGhJmMCfgc2XD1Umm` | 9 | **1** | **7** | 171 dans `.Content Type` |
| showcase `FS7qNdQx4Qyo9CkBgIWRMi` | 1 | 0 | 0 | aucun |
| Layout `bbgSPUChd18EVNGijjoZGn` | 17 | 0 | 0 | 22 : Card 20, directs 2 |
| Data Display `VpConH5AUGyCqtp8PMqj1i` | 25 | **1** | **7** | 26 : List Item 20, Crumb 5, direct 1 |
| Data Entry `1wVY9FfjONIX6us9JmIm7U` | 36 | 0 | 0 | aucun |

**Aucune instance de Snackbar, de Pagination, de `.Options` ni de `.Options Select (Legacy)`** dans ces 11 fichiers.
Deux instances de Breadcrumb, 14 libellés, **aucun texte surchargé** (champ `characters` absent des surcharges).

### Component Status, page Action (6:3)

Instance `I13:7094;1514:4333;13:7167;38:13892;28:21770;38:11041;1498:3458;13:7224` (« Preview / Breadcrumb »), dans
Component Status / Action / Table outline / Table / Row / Breadcrumb / Slot / Cell / Preview / .Cell Type / .Cell Properties /
Content / .Content Type / Slot / Preview / Preview slot. Visible, aucune propriété de composant, surcharges de l'instance :
`height`, `name`, `width`.

| Link (`<instance>;…`) | Variante actuelle | Texte (`.Specs/Label`) | Visible |
|---|---|---|---|
| 298:5479 | State=Default, Tone=Neutral | Home | oui |
| 298:5480 | State=Default, Tone=Neutral | Crumb | oui |
| 298:5481 | State=Default, Tone=Neutral | Crumb | oui |
| 298:5482 | State=Default, Tone=Neutral | Crumb | oui |
| 298:5483 | State=Default, Tone=Neutral | Crumb | oui |
| 298:5484 | State=Default, Tone=Neutral | Crumb | oui |
| 298:5485 | State=Default, Tone=Default | Current page | oui |

Textes = valeurs du maître, identiques avant et après le swap : rien ne devrait bouger. Le script le vérifie.

### Data Display, page Archives (1452:1720)

Instance `1704:17329` (Breadcrumb, dans `Frame 210`), visible, surcharges `height`, `width`. Les 7 Link (298:5479 à 298:5485,
mêmes variantes) affichent tous **« Label »**, sans surcharge : l'instance est restée sur une ancienne version publiée de
Breadcrumb. Après mise à jour, elle prendra Home / Crumb / Current page, ce qui est le rendu attendu. Marquée
`skipByDefault` dans le JSON et le script (à reposer seulement avec `INCLUDE_SKIPPED = true`).

## notification-module et spotlight

Aucun fichier Figma de ce nom dans `docs/figma` : `notification-module` est une page Angular
(`src/app/pages/notification-module`) et `spotlight` un composant (`src/app/shared/ui/spotlight`, maître Figma Spotlight
4019:755 dans Layout). La page Layout et tout le fichier Layout ont été parcourus : aucune Snackbar. L'alerte du lot 2
(« coverbook, notification-module, spotlight ») ne se vérifie dans aucun fichier Figma relevé.

## Hors périmètre

- Les fichiers des librairies Action et Feedback elles-mêmes (pages de documentation des maîtres) n'ont pas été relevés.
- Les autres consommateurs de l'ancien Link (List Item, `.Content Type`, Resolution notice, Result / Policy content…) ne sont
  pas touchés par ce swap : leurs maîtres pointent encore `b9493d2f…`.

## Repose après publication

1. Publier Action et Feedback, accepter la mise à jour dans Component Status (et Data Display).
2. `use_figma` sur le fichier, corps = `restore-link-labels.js`, `FILE_KEY` réglé, `DRY_RUN = true` : lire `changed` et
   `problems` (« Encore l'ancien Link » = mise à jour non acceptée).
3. Si le diff est juste, relancer avec `DRY_RUN = false`.
