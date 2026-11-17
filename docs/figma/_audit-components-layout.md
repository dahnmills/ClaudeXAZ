# Audit des composants de la librairie Layout (`bbgSPUChd18EVNGijjoZGn`), 2026-11-17

Audit en LECTURE SEULE. Aucune écriture dans Figma (ni liaison, ni renommage, ni publication), aucun commit. Navigateur non utilisé. Écrans (Home page, maquette 2865:10424, page `Layout`, écrans de `Search 🚧`) hors périmètre, sauf les composants publiables qui y vivent.

## Méthode

- Inventaire `COMPONENT` / `COMPONENT_SET` page par page (17 pages ; composants sur Drawer, Header, Modal, Scrollbar, ☠️Slot, Side Navigation, Page Title, Overlay, Search 🚧).
- Parcours de chaque maître (toutes variantes), sans descendre dans les instances imbriquées (leurs valeurs appartiennent à l'atome, comme dans les audits précédents) :
  - jetons : fills, strokes et épaisseurs, effets, 4 rayons, paddings et gap (gap ignoré en `SPACE_BETWEEN` ou avec moins de 2 enfants visibles), textes (style de texte ou variables taille / famille / graisse / interligne) ; collection de chaque variable liée (Semantic attendu, Foundation signalé) ;
  - composition : maître de chaque instance (librairie distante ou maître local), instances cassées ;
  - fonctionnel : propriétés non `VARIANT` sans aucun calque qui les référence (orphelines), calques masqués non pilotés par un booléen, mode d'auto-layout et dimensionnement des variantes ;
  - propreté : noms génériques (`Frame 12`, `Component 1`...), description, liens de documentation ;
  - validation : sections, bloc Versionning, en-tête 01 (version, statuts), sections To review.
- Publication vérifiée par `search_design_system` sur la librairie `[Components] Layout` (dernière publication : 2026-11-16 14:23).
- Dimensions lues sur les nœuds (API), jamais sur une image.
- Déjà tranché et non re-signalé comme nouveau (repris en « connu » quand c'est toujours faux) : liaisons différées des lots layout-1 et layout-2 (padding 12 et gap 72 de Header, gap 45 de Side Navigation, `Font/Family` des `.Item`, fonds Hover / Active du set parent et Active sélectionné en Foundation, backdrop Modal, padding 272, gaps 10, padding 20 de `.Footer`, rayons 1000 de Scrollbar, masques de Drawer Tabs) ; décalage d'icônes de Side Navigation (`_investigation-side-nav.md` : aucune correction) ; surcharges consommatrices (`_audit-overrides-prepublish-2.md` : aucun recoupement).

## Synthèse

Compteurs : **Tok** = propriétés à valeur brute ou liées hors Semantic (nouvelles + connues entre parenthèses) ; **Comp** = défauts de composition ; **Fonc** = propriétés orphelines, calques non pilotés, variantes incohérentes ; **Propre** = noms génériques + description manquante + lien de doc ; **Valid** = défauts de page / Versionning / statut ; **Code** = écarts flagrants avec Angular.

| Composant | nodeId | Publié | Tok | Comp | Fonc | Propre | Valid | Code | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| Header | 2390:1583 | oui | 0 (4) | 0 | 3 | 1 | 3 | 1 | à corriger |
| .Logo Qirin | 2290:9763 | non (privé) | 2 | 0 | 0 | 1 | 0 | 0 | à corriger |
| .Flyout Menu Content | 2674:19319 | non (privé) | 6 | 0 | 1 | 3 | 1 | 0 | à corriger |
| .☠️ Flyout Menu Content | 2673:13850 | non (privé) | 5 | 0 | 1 | 2 | 1 | 0 | à corriger (supprimer) |
| Side Navigation | 2083:6932 | oui | 0 (1) | 0 | 1 (1) | 5 | 2 | (1) | à corriger |
| .Side Navigation Item | 2083:7074 | non (privé) | 0 | 0 | (1) | 1 | (1) | (1) | OK (connu) |
| .Item (3 sets) | 2083:7003, 2083:7028, 2083:6958 | non (privé) | 0 (24) | 0 | 0 | 3 | 0 | 0 | OK (connu) |
| Company Information / Assessment / Tools | 2348:5725, 2366:935, 2368:2293 | **oui** | 12 | 0 | 1 | 15 | 3 | 1 | à corriger |
| Modal | 2256:1556 | oui | 1 (4) | **4** | 1 (2) | 1 | 2 | (2) | **bloquant** |
| .Modal Box | 2076:8048 | non (privé) | 0 | 0 | 0 | 1 | 0 | 0 | OK |
| Header (Modal) | 2076:7800 | oui | 0 | 0 | (1) | 2 | 0 | 0 | à corriger |
| Content (Modal) | 2076:7825 | oui | 0 | 0 | (1) | 2 | 0 | 0 | à corriger |
| Footer (Modal) | 2076:7806 | oui | 0 | 0 | 0 | 2 | 0 | (1) | à corriger |
| Scrollbar | 2076:9653 | oui | 2 (1) | 0 | 0 | 2 | 4 | 1 | à corriger |
| Drawer | 2471:14923 | oui | 0 (2) | 0 | 0 | 1 | 2 | (5) | à corriger |
| Drawer Header | 2465:5469 | oui | 0 | 0 | 0 | 3 | 1 | (2) | à corriger |
| Drawer Tabs | 2465:5321 | oui | 0 (9) | 0 | 1 | 2 | 1 | 1 | à corriger |
| .Footer (Drawer) | 2465:5673 | non (privé) | 0 (1) | 0 | 0 | 1 | 0 | 0 | OK (connu) |
| Component 1 | 2459:1427 | **oui** | 1 | 0 | 0 | 3 | 1 | 1 | **bloquant** |
| Frame 411 | 2457:6367 | **oui** | 235 | 1 | 0 | 102 | 1 | 1 | **bloquant** |
| Slot / .Swap element (déprécié) | 33:4843, 33:4838 | **oui** (Slot) | non audité | 0 | 0 | 2 | 2 | 1 | à corriger |
| Page Title | 4010:13 | oui | 2 | 0 | 0 | 1 | 3 | (1) | à corriger |
| Filter Drawer | 4015:1824 | oui | 0 | 0 | 0 | 1 | 3 | 0 | à corriger |
| Filter Section | 4013:132 | oui | 1 | 0 | 0 | 2 | 0 | 0 | à corriger |
| Spotlight | 4019:755 | oui | 2 | 0 | 0 | 1 | 3 | (1) | à corriger |
| Spotlight Row | 4019:562 | oui | 0 | 0 | 0 | 1 | 0 | 0 | OK |
| Shortcuts Panel | 4018:1029 | oui | 0 | 0 | 1 | 1 | 4 | 1 | à corriger |
| Keycap, Shortcut Row (copies locales) | 4017:324, 4017:349 | **oui** | non audité | **2** | 0 | 0 | 1 | 0 | **bloquant** |
| Composants de la page Search 🚧 (7) | 2611:1830, 3060:13603, 3060:12978, 3060:12993, 3060:13484, 3060:15929, 3060:16518 | **oui** (4 non préfixés) | non audité | 1 | 0 | 7 | 1 | 0 | à corriger |
| Collection locale `Layouts` (5 variables) | fichier | **oui** | 1 | 0 | 0 | 0 | 0 | 0 | à corriger |

Bilan : 30 lignes (40 maîtres) ; **4 bloquants** (Modal, Component 1, Frame 411, copies locales Keycap / Shortcut Row), 22 à corriger, 4 OK (dont 3 « OK, écarts connus »).

Les quatre composants « sans gabarit » du dernier passage : **Page Title, Filter Drawer, Spotlight et Shortcuts Panel ont maintenant un en-tête 01** (créé par layout-1, B1), Documentation et Do/Don't, mais **toujours aucun bloc Versionning**. Ils sont bien **publiés** dans `[Components] Layout` (2026-11-16) avec leur description : clés Page Title `15b5e617d6d17a3ff976d22db838bc0f9984d4aa`, Filter Drawer `64692d4700038c3fff885984f75dbe6cba21836b`, Spotlight `c6ac17c7e447eca149a7cc884d616abde5c1125b`, Shortcuts Panel `8594fa5129b5189d218c9e47e3642430702c53e4` (absentes de `components.json`, où `componentKey` vaut `null`).

## Constats transverses

1. **Aucun composant n'a de lien de documentation** (`documentationLinks` vide partout, y compris les 4 composants « ready »). Les liens ZeroHeight et Storybook ne vivent que dans les textes des en-têtes.
2. **Blocs Versionning jamais remplis** : Header 2290:7183, Side Navigation 2083:7406, Modal 2076:17623 et Scrollbar 2081:2121 contiennent encore le gabarit (« Draft, v.0.0.1, Sept. 30, 2024, Initial version for test »). Drawer, Page Title, Filter Drawer, Spotlight, Shortcuts Panel : pas de Versionning du tout. Les en-têtes 01 affichent 2.0.0 (Header, Side Navigation, Modal, Drawer, Scrollbar) contre 1.0.0 dans `components.json` (connu).
3. **Sections To review restantes** : Header 4073:1570, Side Navigation 4075:1888, Modal 4077:1753, Drawer 4080:1943, Page Title 4077:8164, Filter Drawer 4077:22551, Spotlight 4077:22552, Shortcuts Panel 4077:22553. Aucune ne contient de composant.
4. **Composants publiables qui n'ont rien à faire dans la librairie** (nom sans `.` ni `_`) : Component 1, Frame 411, Slot (page dépréciée), Keycap et Shortcut Row locaux, Company Information / Assessment / Tools, et 4 composants de l'écran Search (Topbox V2 - Variation 1, Search Bar, Standalone Dropdown, Results). Tous sont visibles dans la recherche de librairie.
5. **Collection de variables locale `Layouts`** (5 booléens de prototype : `Company Information/Open`, `Company Information/Selected`, `Assessment`, `Tools`, `Drawer Flyout`, portée `ALL_SCOPES`, publiée) : contraire à la règle « deux niveaux, jamais de collection créée pour un composant ».
6. **Noms trop génériques en librairie** : la librairie publie deux « Header » (la barre globale et l'en-tête de Modal 2076:7800), plus « Content » et « Footer » sans préfixe. Un designer qui cherche « Header » tombe sur les deux.
7. **Slots remplis de blanc brut** (#FFFFFF non lié) : Page Title `Icon` 4010:15 et `Actions` 4010:911, Filter Section `Body` 4013:109, Spotlight `Results` 4019:603 et `Options` 4019:704.
8. `search_design_system` liste encore un set **« Task »** dans `[Components] Layout` (mis à jour 2025-01-20) introuvable dans le fichier : entrée publiée fantôme à vérifier dans le panneau de publication.

## Détail par composant

Gravité : **B** bloquant, **H** haute, **M** moyenne, **F** faible. « Risque surcharges » = effet d'une correction sur les instances des fichiers consommateurs à la prochaine mise à jour.

### Header (2390:1583, page Header 2191:3044)
| # | Problème | Gravité | Correctif proposé | Risque surcharges |
|---|---|---|---|---|
| 1 | Connu, toujours vrai : `Menu Open=True` (2290:10021) rend la même barre que `False` (2390:1584), même arbre de 67 nœuds ; le menu ouvert est une instance Flyout Menu posée à côté du set. | H | Soit supprimer la propriété (le code n'a aucun input, `HeaderComponent` est vide), soit poser le Flyout Menu dans la variante True. | Supprimer la variante True casse les instances qui l'utilisent : basculer d'abord les instances sur False. |
| 2 | Valeur par défaut de la variante `Menu Open` = **True** (l'état fermé devrait être le défaut). | M | Mettre `Menu Open=False` en premier. | Aucun : le défaut ne touche pas les instances existantes. |
| 3 | 3 `Button Icon` masqués dans `Actions` de chaque variante (2290:9907, 2290:9913, 2290:9919 ; 2390:1599 à 1601), sans booléen : impossibles à afficher depuis le panneau de propriétés. | M | Booléens `Show action 4/5/6` (défaut False) ou suppression. | Aucun si défaut False. |
| 4 | Connu (différé) : padding 12 haut / bas / gauche de `Content` (2290:7714, 2390:1585), gap 72 de `Left` (2290:9885, 2390:1586). | F | Rien tant qu'aucun Semantic n'existe (12 et 72 : écart avec le code 8 / 40). | Lier plus tard effacerait les surcharges de ces paddings. |
| 5 | Versionning 2290:7183 gabarit vide ; version 2.0.0 contre 1.0.0 ; section To review 4073:1570. | M | Remplir le changelog, aligner la version, vider la section To review. | Aucun. |
| 6 | Pas de lien de doc. | F | Ajouter le lien ZeroHeight / Storybook. | Aucun. |

Composition OK : 10 Tab et 12 Button Icon d'Action, compte = Tab, logo = `.Logo Qirin` local qui imbrique `Allianz Compact` distant.

### .Logo Qirin (2290:9763), privé
- Gap 16 de `Reversed=False` 2290:9748 et `Reversed=True` 2290:9764 non lié ; `Measurement/Spacing/M` vaut 16 : liable sans écart. **F**. Risque : faible, 14 instances dans le fichier, aucune surcharge de gap relevée dans les audits précédents.
- Pas de description. **F**.

### .Flyout Menu Content (2674:19319) et .☠️ Flyout Menu Content (2673:13850), privés
- `.Flyout Menu Content` : paddings 8 / 32 de `Separator` (2673:19130, 2673:19127), traits 1 (2673:19131, 2673:19128), gap 14 de `Frame 28` (2673:19120), padding droit 32 de `Toggle` (2674:19313) non liés ; calque `Frame 28`. Il n'est utilisé par aucune variante de Header (le menu ouvert est un Flyout Menu d'Action). **M** : lier (Spacing S / XL, Border/Size/S ; 14 n'a pas de Semantic) ou supprimer s'il ne sert plus.
- `.☠️ Flyout Menu Content` : marqué mort, sans auto-layout, fill `foundation/color/grey/350` en direct sur `Label` 2673:13779, paddings 16 / 32 / 8 non liés. **F** : supprimer (privé, non publié, 0 risque).

### Side Navigation (2083:6932, page 2083:6930)
| # | Problème | Gravité | Correctif proposé | Risque surcharges |
|---|---|---|---|---|
| 1 | Calques `Frame 169` (2083:6934, 2083:6946) et `Frame 172` (2083:6944, 2083:6956). | M | Renommer (`List`, `Right border`). | Aucun sur les surcharges (elles suivent l'id). Mettre à jour le PLAYBOOK, qui demande de « masquer `Frame 172` » par son nom. |
| 2 | 3 `.Side Navigation Item` masqués dans Open=True (2083:6936, 2083:6941, 2083:6953) sans booléen. | F | Booléens ou suppression. | Aucun si défaut masqué. |
| 3 | Connu : défaut `Open=True` en Figma contre `collapsed=true` en code ; gap 45 différé. | F | Décision produit. | Aucun. |
| 4 | Versionning 2083:7406 vide, version 2.0.0, To review 4075:1888. Pas de lien de doc. | M | Remplir, aligner, vider. | Aucun. |

Jetons du set : tout lié en Semantic. Composition : `.Side Navigation Item` et les 3 groupes locaux.

### .Side Navigation Item (2083:7074) et .Item (2083:7003, 2083:7028, 2083:6958), privés
Rien de nouveau. Connus, toujours vrais : `Font/Family` non liée sur les 20 `Label` ; fonds Foundation `soft/blue/300` et `soft/blue/500` (2083:7011, 2083:7017) et `action/blue/700` (2083:7053, 2083:7059) faute de Semantic ; combinaison `Selected=False, Has Child=True` absente ; pas de 01 propre. Les 3 sets `.Item` n'ont pas de description (privés, F).

### Company Information, Assessment, Tools (2348:5725, 2366:935, 2368:2293)
| # | Problème | Gravité | Correctif proposé | Risque surcharges |
|---|---|---|---|---|
| 1 | **Publiés** (sets visibles en librairie) alors que ce sont des groupes de contenu propres à Buyer Summary, sans équivalent code. | H | Les rendre privés (préfixe `.`) ou les sortir de la librairie (composants locaux des fichiers de fonctionnalité). | Préfixer = dépublier : les instances consommatrices restent mais ne se mettent plus à jour. Vérifier les usages avant (5 instances dans le fichier, dont 4 hors page). |
| 2 | Gap 8 non lié sur les variantes et sur `Frame 174` (4 par set, 12 au total) ; `Spacing/S` vaut 8. | M | Lier à `Measurement/Spacing/S`. | Effacerait une surcharge de gap éventuelle (aucune relevée). |
| 3 | Calques `Frame 174` (2 par set) ; aucune description. | M | Renommer (`Children`), décrire. | Aucun. |
| 4 | Posés en vrac en haut de la page, hors section (connu de layout-1). Pilotés par la collection locale `Layouts`. | M | Ranger dans le bloc Atoms de Side Navigation. | Aucun (déplacement). |

### Modal (2256:1556, page 2076:782) : bloquant
| # | Problème | Gravité | Correctif proposé | Risque surcharges |
|---|---|---|---|---|
| 1 | **Chaque variante contient une instance masquée `.Modal Box/small` dont le maître 2244:5965 est supprimé** (nœud sans parent) : 2076:8368, 2256:1558, 2256:1705, 2614:627. Elles sont **exposées** (`isExposedInstance`), donc leurs propriétés apparaissent dans le panneau de toute instance de Modal. | B | Supprimer ces 4 instances masquées. | Aucun visuel (calque masqué) ; les surcharges portées sur ce calque disparaissent, sans effet. |
| 2 | Backdrop : style de peinture distant `Element Specific/Modal Background`, qui ne vient pas de la librairie Tokens Qirin (#000 à 35 %). | M | Identifier la librairie source ; à terme variable Semantic d'overlay (décision tokens, ne pas créer de variable ici). | Changer le style écrase les surcharges de fond (aucune relevée). |
| 3 | Connu, toujours vrai : `Size=xlarge` a la même boîte que `Large` (1080), le code donne 1280 ; défaut Small contre `medium` en code ; padding horizontal 272 non lié. | M | Boîte xlarge à 1280 (le cadre 1280 x 800 devient trop étroit : padding à revoir) ; défaut Medium. | Agrandir la boîte xlarge change le rendu des instances xlarge existantes. |
| 4 | Versionning 2076:17623 vide ; version 2.0.0 ; To review 4077:1753 (brouillons `Explo`, 2 instances isolées, `Vector 6`). | M | Remplir, vider. | Aucun. |

`.Modal Box` (2076:8048) : OK (Header, Content, Footer exposés).

### Header (2076:7800), Content (2076:7825), Footer (2076:7806) de Modal
- **Noms génériques publiés** (« Header », « Content », « Footer ») en concurrence avec la barre Header. **M**. Correctif : `Modal Header`, `Modal Content`, `Modal Footer`. Risque : aucun (renommer un composant garde la clé).
- Header : **propriété `Back` (BOOLEAN, défaut true) orpheline**, aucun calque Back dans l'en-tête (connu, toujours faux). **M**. Correctif : supprimer la propriété, ou dessiner le Back et le relier avec défaut **False** (défaut True afficherait le Back sur toutes les instances existantes).
- Content : slot fixe 716 px (connu), hauteur 460 fixe. Footer : icônes par défaut sur les boutons (connu).
- Pas de lien de doc. Descriptions présentes.

### Scrollbar (2076:9653, page 2081:2119)
| # | Problème | Gravité | Correctif proposé | Risque surcharges |
|---|---|---|---|---|
| 1 | Page non normalisée : deux en-têtes anciens hors section (2081:2141 intitulé « Modal » 1.0.0, 2081:2184 « Scrollbar » 2.0.0, Design Draft / Tech Draft), Versionning 2081:2121 gabarit, pas de Documentation ni de Do/Don't. | H | Normaliser avec le kit (Versionning, 01, Documentation, Do/Don't). | Aucun. |
| 2 | Absent de `components.json` alors que publié et utilisé par Modal Content et Drawer (15 instances). | M | Ajouter une entrée (atome privé ou public, à décider). | Aucun. |
| 3 | Padding 2 haut / bas et gap 10 non liés ; rayons 1000 (connu). | F | Laisser (pas de Semantic à 2 ni 10). | Aucun. |
| 4 | Pas de description. | M | Décrire. | Aucun. |

### Drawer (2471:14923, page 2457:2)
- Pas de Versionning (connu, toujours vrai), To review 4080:1943, pas de lien de doc. **M**.
- Gap 10 de `Content` (2465:5704, 2471:14928), connu différé.
- Écarts code connus (titre 18 / 700, Back par défaut, Tabs / Breadcrumb / Flyout / Type Flow sans input, gap d'en-tête).
- La page garde un nuage de brouillons hors section (8 `Side Panel (Details - V4)`, 35 vecteurs `Vector n`, textes d'annotation) **qui contient les deux composants publiés Component 1 et Frame 411** (voir plus bas). Le Slot déprécié y est instancié 17 fois.

### Drawer Header (2465:5469), Drawer Tabs (2465:5321), .Footer (2465:5673)
- Drawer Header et Drawer Tabs : **publiés sans description** ; Drawer Header a un calque `Frame 412` (2465:5429). **M**. Décrire, renommer. Risque nul.
- Drawer Tabs : un `Button Icon` masqué sans booléen (2459:2497) ; masques noirs et dégradés bruts (connu, ce sont des masques) ; slot `Tab Slot` vide par défaut (connu). **F**.
- `.Footer` : padding 20 (connu), pas de description (privé). **F**.
- Ces deux atomes publiés n'ont pas de section ni de doc propre : ils vivent dans les Atoms de l'en-tête Drawer. Les rendre privés (`.Drawer Header`, `.Drawer Tabs`) si on ne veut pas qu'ils soient posés seuls. Risque : dépublication, les instances consommatrices directes (à vérifier) ne se mettraient plus à jour.

### Component 1 (2459:1427) et Frame 411 (2457:6367) : bloquants
- **Publiés** (2026-11-06) avec des noms vides de sens, sans description. Component 1 = rangée de 6 Tab, gap 16 brut. Frame 411 = maquette de propriétés (356 x 1028) : **235 valeurs brutes** (fonds #F4F4F4, rayons 4, paddings 2 / 8, textes Allianz Neo 14 sans style) et **100 calques `Frame n`**.
- 0 instance dans le fichier. **B** : polluent la recherche de librairie.
- Correctif : supprimer (ou préfixer `_` et ranger en To review). Risque : un fichier consommateur qui les aurait instanciés garderait des composants « manquants » ; vérifier par la recherche d'instances de la librairie avant suppression (clés `a3529840626fee92f205c624af51673fbed36b8d`, `9ac683031522a2946d676108b14fe8b2b6e66afa`).

### Slot (33:4843) et .Swap element (33:4838), page ☠️Slot
- Page marquée DEPRECATED (texte 2671:12972), mais **Slot reste publié** (clé `f8a4fe08d140cd5308ac161f011b4b0c3bbda2fb`) et compte 35 instances dans le fichier (Drawer 17, Search 16, Layout 2), toutes dans des brouillons ou écrans. Remplacé par les slots natifs. **M**.
- Correctif : préfixer `.` ou `_` (dépublication) après avoir remplacé les instances par des slots natifs. Risque : instances consommatrices figées.

### Page Title (4010:13, page 4009:2)
| # | Problème | Gravité | Correctif proposé | Risque surcharges |
|---|---|---|---|---|
| 1 | Pas de Versionning ; statut Design « In review » ; Notes 4020:679 et `Examples` 4010:919 en To review 4077:8164. | M | Ajouter le Versionning, valider, vider. | Aucun. |
| 2 | Slots `Icon` 4010:15 et `Actions` 4010:911 remplis de #FFFFFF brut. | F | Retirer le fond (le slot doit être transparent) ou le lier à `Static/Background/Main/Primary`. | Une instance qui surcharge ce fond garde sa surcharge ; sinon le blanc disparaît derrière le contenu (contrôle visuel sur fond gris). |
| 3 | `componentKey` absent de `components.json` ; pas de lien de doc. | F | Reporter la clé `15b5e617...`, ajouter le lien. | Aucun. |

Jetons des textes et du conteneur : tous Semantic. Composition : Badge et Link distants, exposés. 9 propriétés, aucune orpheline. Code : badge en propriétés d'instance exposée contre `ng-content select="[slot=badge]"` en code (noté dans les Notes, acceptable).

### Filter Drawer (4015:1824), Filter Section (4013:132), page Overlay 4009:3
- Filter Drawer : jetons propres, composition propre (Drawer local exposé, Button d'Action ; dans les slots : Tab, Badge, Checkbox, Radio, Inline Edit, Divider, Button Icon distants, Filter Section locale). Pas de Versionning, In review, To review 4077:22551, pas de lien de doc. **M**.
- Filter Section : slot `Body` 4013:109 en #FFFFFF brut (**F**) ; **publiée** sous un nom générique alors que sa description dit « Local to Filter Drawer » (**M**) : la passer en `.Filter Section` si elle ne doit pas être posée seule (dépublication, vérifier les usages).

### Spotlight (4019:755), Spotlight Row (4019:562)
- Spotlight : slots `Results` 4019:603 et `Options` 4019:704 en #FFFFFF brut (**F**) ; pas de Versionning, In review, To review 4077:22552 (**M**). Composition propre (Icon Functional, Button Icon distants, Spotlight Row locale).
- Spotlight Row : OK (jetons, propriétés, description).

### Shortcuts Panel (4018:1029)
- Composition : les 12 rangées sont bien des Shortcut Row d'Action (B2 confirmé), Tab et Button Icon d'Action. Jetons propres. 3 propriétés reliées.
- Pas de Versionning ; Draft 0.2.0 ; To review 4077:22553 ; la note 4020:637 dit encore « Keycap is a new local atom » (périmée, connu, toujours faux). **M**.
- L'onglet Layout n'est pas dessiné alors que **Keyboard Map existe dans Action** (`6cd2ccd9cf9a5338d8b6cc1f2b1be06111bcf2b7`) : la description du panneau dit « not drawn here ». **F** : composer Keyboard Map dans un état ou un slot.
- Code : `open`, `groups`, `used`, `keyboard` sans équivalent (normal pour des données) ; pas de story (connu).

### Keycap (4017:324) et Shortcut Row (4017:349), section `Legacy - local copies` : bloquant
- **Publiés dans Layout sous les mêmes noms que les atomes d'Action** (Layout `59ff461b...` et `6a8c01e3...` contre Action `d40d368b...` et `efbf2302...`). Un designer peut poser la mauvaise copie. **B**.
- Instances locales restantes : 16 Keycap, 4 Shortcut Row (doc et Do/Don't de Shortcuts Panel), connu de B2, toujours vrai.
- Correctif : remplacer les 20 instances par les atomes d'Action, puis préfixer `_` (dépublication) ou supprimer. Risque : un fichier consommateur qui aurait instancié la copie Layout depuis le 16/11 garderait une copie figée ; vérifier avant.

### Composants de la page Search 🚧 (écran, hors librairie)
Topbox V2 - Variation 1 (2611:1830), Search Bar (3060:13603), Standalone Dropdown (3060:12993), Results (3060:15929) sont **publiés**, sans description ; `.Icons Standalone Dropdown`, `.Content`, `.Actions Results` sont privés. Standalone Dropdown est redessiné localement (30 instances) alors que c'est un atome à part entière. **M** : préfixer `_` ou déplacer dans le fichier Search ; ne pas les auditer comme composants de librairie.

### Collection locale `Layouts`
5 variables booléennes de prototype publiées, portée `ALL_SCOPES`. **M** : masquer de la publication (`hiddenFromPublishing`) ou supprimer si le prototype n'en dépend plus. Risque : les interactions de prototype des groupes de Side Navigation et du Drawer Flyout qui lisent ces variables cesseraient de fonctionner.

## Écarts code Angular flagrants (récapitulatif)

| Composant | Figma | Code | Statut |
|---|---|---|---|
| Header | variante Menu Open | aucun input | nouveau constat sur l'absence totale d'input |
| Side Navigation | Open, défaut True | `collapsed` model, défaut true | connu |
| Modal | Small par défaut, xlarge 1080 | medium par défaut, xlarge 1280 | connu, toujours faux |
| Modal Header | booléen Back orphelin | pas de Back | connu, toujours faux |
| Drawer | Tabs, Breadcrumb, Flyout, Type Flow, Back défaut true | `showBack` false, pas de tabs | connu |
| Scrollbar | composant publié | pas de composant code | nouveau |
| Company Information, Assessment, Tools | sets publiés | pas d'équivalent | connu |
| Shortcuts Panel | onglet Layout non dessiné | `ds-keyboard-map` | connu ; Keyboard Map existe dans Action |

## Corrections priorisées

1. **Modal** : supprimer les 4 instances masquées et exposées de `.Modal Box/small` (maître supprimé). Sans risque visuel.
2. **Dépublier ou supprimer les composants parasites** : Component 1, Frame 411, Keycap et Shortcut Row locaux (après remplacement des 20 instances locales par Action), Slot déprécié, les 4 composants de l'écran Search. Vérifier avant les instances consommatrices par clé.
3. **Renommer les parties de Modal** en `Modal Header`, `Modal Content`, `Modal Footer` (collision avec Header). Clés conservées.
4. **Modal Header `Back`** : supprimer la propriété ou la relier à un vrai calque avec défaut False.
5. **Header** : trancher `Menu Open` (supprimer ou dessiner le menu), défaut False ; booléens pour les 3 Button Icon masqués.
6. **Company Information, Assessment, Tools** : privatiser ou sortir de la librairie, lier les gaps 8 à `Spacing/S`, renommer `Frame 174`, ranger dans le bloc Atoms.
7. **Versionning** : créer le bloc pour Drawer, Page Title, Filter Drawer, Spotlight, Shortcuts Panel ; remplir ceux de Header, Side Navigation, Modal ; aligner les versions (2.0.0 contre 1.0.0).
8. **Scrollbar** : normaliser la page, décrire, l'ajouter à `components.json`.
9. **Descriptions et liens de doc** : Drawer Header, Drawer Tabs, Scrollbar, Company Information / Assessment / Tools ; lien de doc sur tous les composants publiés.
10. **Slots blancs** (Page Title, Filter Section, Spotlight) : retirer le fond brut.
11. **Renommages de calques** : `Frame 169` / `Frame 172` (Side Navigation, mettre à jour le PLAYBOOK), `Frame 412` (Drawer Header), `Frame 28` (.Flyout Menu Content).
12. **Collection `Layouts`** : masquer de la publication ou supprimer après contrôle du prototype.
13. **Sections To review** : vider les 8 sections ; corriger la note périmée de Shortcuts Panel.
14. Faible : lier le gap 16 de `.Logo Qirin` ; supprimer `.☠️ Flyout Menu Content` ; trancher `.Flyout Menu Content` ; vérifier l'entrée publiée « Task » ; reporter les clés et nodeIds manquants dans `components.json` (Header, Side Navigation, Modal, Drawer sans nodeId ; 4 nouveaux sans clé).

## Limites

- Les valeurs internes des instances imbriquées (atomes d'Action, Data Entry, Feedback, Icons) ne sont pas auditées : elles relèvent de leur librairie.
- Contenu des composants Search et de Slot / Keycap / Shortcut Row locaux non audité en détail (à retirer de la librairie).
- Usages consommateurs des composants à dépublier non comptés (seuls les usages internes au fichier Layout l'ont été).
