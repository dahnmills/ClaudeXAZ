# Lot 2 + partie sûre du lot 3 : librairie Layout (`bbgSPUChd18EVNGijjoZGn`), 2026-11-17

Brief suivi : `docs/figma/_lot2-brief.md`, accord utilisateur du 2026-11-17 15:15. Écritures `use_figma` dans le seul fichier
Layout, sur les composants de librairie et leurs pages de documentation. Maquette cible (2865:10424), pages `Layout`, `Home page`
et écrans de `Search 🚧` non touchés (seuls les noms des 4 composants de l'écran Search ont changé). Aucune publication, aucun
commit, aucune collection, aucun mode ni aucune variable créés (Spacing/S importée par clé depuis Tokens). Aucun swap d'instance.

## Fait

### Modal (2256:1556, page 2076:782)
- 4 instances masquées et exposées `.Modal Box/small` (maître 2244:5965 supprimé) supprimées. Dimensions des 4 variantes et des
  boîtes inchangées (1280 x 800 ; 400 / 780 / 1080 / 1080 x 596).
- Renommés (clés conservées) : `Header` 2076:7800 vers **Modal Header**, `Content` 2076:7825 vers **Modal Content**, `Footer`
  2076:7806 vers **Modal Footer**.
- Calques de doc `Frame 56-59` (étiquettes des atomes) vers `Label - Modal Box / Header / Footer / Content`.

### Header (2390:1583, page 2191:3044)
- Booléens **`Show action 4`, `Show action 5`, `Show action 6`** (défaut false = rendu actuel) reliés à `visible` des 3 Button Icon
  masqués de `Actions` dans les deux variantes (2290:9907, 2290:9913, 2290:9919 ; 2390:1599, 2390:1600, 2390:1601). Variantes
  toujours 1280 x 64. `Menu Open` non touché (décision en attente).
- `.Flyout Menu Content` : `Frame 28` 2673:19120 vers `Items`.

### Side Navigation (2083:6932, page 2083:6930)
- `Frame 169` 2083:6934 et 2083:6946 vers `List` ; `Frame 172` 2083:6944 et 2083:6956 vers **`Right border`**. PLAYBOOK mis à jour
  (consigne du rail : masquer `Right border`, ex `Frame 172`).
- **Company Information, Assessment, Tools rendus privés** : `.Company Information` 2348:5725, `.Assessment` 2366:935, `.Tools`
  2368:2293 (dépubliés ; imbriqués dans Side Navigation, ils y restent fonctionnels). Descriptions ajoutées.
- Gaps 8 liés à `Measurement/Spacing/S` (valeur vérifiée 8) : 12 nœuds (variantes 2348:5706, 2348:5986, 2366:936, 2366:946,
  2368:2294, 2368:2300 ; cadres 2348:5865, 2348:5988, 2366:938, 2366:948, 2368:2296, 2368:2302). Ces 6 `Frame 174` deviennent
  `Children`. Dimensions des variantes et de Side Navigation inchangées.

### Drawer (page 2457:2)
- `Frame 412` 2465:5429 de Drawer Header vers `Title row`.
- Descriptions ajoutées : Drawer Header 2465:5469, Drawer Tabs 2465:5321, `.Footer` 2465:5673.
- `Component 1` 2459:1427 (2 instances dans les brouillons `Side Panel (Details - V4)` 2459:1049 et 2459:1079, via un Slot)
  **non supprimé, rendu privé** : `_Tabs row (draft)` + description.

### Overlay (page 4009:3), Page Title (4009:2), Search
- Copies locales rendues privées SANS remplacer leurs instances : `_Keycap (local copy)` 4017:324 et `_Shortcut Row (local copy)`
  4017:349, description « ne pas utiliser, prendre l'atome d'Action ». Instances conservées (liste plus bas).
- Spotlight 4019:755 : fond blanc brut retiré des slots `Results` 4019:603 et `Options` 4019:704 (leur parent `Panel` est blanc,
  lié en variable : rendu identique ; Spotlight toujours 744 x 780).
- Écran Search, 4 composants rendus privés (préfixe `_`, description « local au Search screen ») : `_Topbox V2 - Variation 1`
  2611:1830, `_Search Bar` 3060:13603, `_Standalone Dropdown` 3060:12993, `_Results` 3060:15929. Leurs 41 instances d'écran
  restent en place.

### Slot (33:4843, page ☠️Slot)
- Instances non migrées. Description « Deprecated: use a native slot instead… (Buyer Summary 26, via the Drawer) » sur Slot,
  description Deprecated sur `.Swap element` 33:4838.

### Collection `Layouts`
- `hiddenFromPublishing = true` (non supprimée, 5 variables intactes : le prototype continue de les lire).

### Versionning (aligné sur `components.json`)
| Composant | Cadre | Statut / version / date |
|---|---|---|
| Header | 2290:7183 (rempli) | Ready, v1.0.0, September 8, 2026 |
| Side Navigation | 2083:7406 (rempli) | Ready, v1.0.0, September 8, 2026 |
| Modal | 2076:17623 (rempli) | Ready, v1.0.0, November 3, 2026 (mention du renommage des parties) |
| Scrollbar | 2081:2121 (rempli) | Draft, v0.1.0, November 17, 2026 (pas de `lastChange` dans le JSON) |
| Drawer | 4121:5964 (créé) | Ready, v1.0.0, July 9, 2026 |
| Page Title | 4122:4112 (créé) | In review, v1.0.0, September 10, 2026 |
| Filter Drawer | 4122:3798 (créé) | In review, v1.0.0, September 8, 2026 |
| Spotlight | 4122:3844 (créé) | In review, v1.0.0, September 8, 2026 |
| Shortcuts Panel | 4122:3877 (créé) | Draft, v0.2.0, September 8, 2026 |

Les Versionning créés sont des clones du gabarit de Header, posés à x 160 ; le reste de la section est décalé de 554 px et la section
élargie à 6594. Contenu : Added + description du JSON, Documented « Anatomy, properties, states, tokens and usage rules. ».
**Désaccord signalé** : les en-têtes 01 de Header, Side Navigation, Modal, Drawer et Scrollbar affichaient 2.0.0 ; écrit 1.0.0
(0.1.0 pour Scrollbar) comme le JSON. À trancher si 2.0.0 était voulu.

### Scrollbar : page normalisée
- Section `Scrollbar` 4123:200 créée : Versionning | Component (ex `_Design system header` 2081:2184, restylé avec le kit : Hero,
  pastille 01, version 0.1.0, description). Description du composant 2076:9653 ajoutée (atome Figma seul, pas de composant Angular).
- Pas de Documentation ni de Do/Don't (aucun contenu source) : à créer avec le doc kit si on garde l'atome public.

### Liens de documentation (`documentationLinks`)
- ZeroHeight : Page Title (67bb7a), Filter Drawer et Filter Section (90fb55), Spotlight et Spotlight Row (54d83f), Shortcuts Panel
  (04b0e6) ; copies locales Keycap (1032c3) et Shortcut Row (164dda) vers les pages des atomes d'Action.
- Storybook (pas de page ZeroHeight) : Header, `.Logo Qirin`, `.Flyout Menu Content` ; Side Navigation, `.Company Information`,
  `.Assessment`, `.Tools` ; `.Side Navigation Item` et les 3 `.Item` (page internals) ; Modal, `.Modal Box`, Modal Header / Content
  / Footer (pages internals) ; Drawer, Drawer Header, Drawer Tabs, `.Footer` ; Scrollbar et Slot (racine Storybook).
- Descriptions ajoutées aux atomes privés qui n'en avaient pas : `.Logo Qirin`, `.Flyout Menu Content`, 3 `.Item`.

### Renommages des gabarits
- 9 cadres `_Design system header` vers `Component` (Header 2290:7246, Side Navigation 2083:7469, Modal 2076:17777, Drawer 2465:6993,
  Page Title 4077:7123, Filter Drawer 4077:7343, Spotlight 4077:7550, Shortcuts Panel 4077:7757, Scrollbar 2081:2184).
- Environ 95 calques `Frame n` des gabarits renommés (`Version`, `Status`, `Status list`, `Design status`, `Tech status`, `Component
  section`, `Body`, `Canvas`, `Atoms`, `Atoms section`, `Title`, `Release header`, `Version row`, `Date and type`…), hors instances.

## Suppressions (nodeId + nom)
- 2076:8368, 2256:1558, 2256:1705, 2614:627 `.Modal Box/small` (instances orphelines masquées de Modal)
- 2457:6367 `Frame 411` (composant publié, 0 instance)
- 2673:13850 `.☠️ Flyout Menu Content` (privé, 0 instance sur la page)
- 2081:2141 `_Design system header` de la page Scrollbar intitulé « Modal » (gabarit vide, textes de remplissage)
- 8 sections To review (aucun composant dedans, vérifié avant chaque suppression) :
  - 4077:1753 `Modal - To review` (2076:17643 en-tête ancien, 2290:6617 section `Explo`, 3188:644 et 2509:651 instances Modal, 2509:716 `Vector 6`)
  - 4073:1570 `Header - To review` (2290:7203 en-tête ancien, 3287:15052 et 3287:15053 `.Logo Qirin`, 3287:15072 et 3287:15073 `Application Name`, 2390:1010 `.Flyout`)
  - 4075:1888 `Side Navigation - To review` (2083:7426 en-tête ancien, 3132:14492 `Shape`)
  - 4080:1943 `Drawer - To review` (2667:10083 en-tête ancien)
  - 4077:8164 `Page Title - To review` (4020:679 `Notes / Page Title`, 4010:919 `Examples`)
  - 4077:22551 `Filter Drawer - To review` (4020:625 `Notes / Filter Drawer`)
  - 4077:22552 `Spotlight - To review` (4020:632 `Notes / Spotlight`)
  - 4077:22553 `Shortcuts Panel - To review` (4020:637 `Notes / Shortcuts Panel`, note périmée « Keycap is a new local atom »)

## Contrôles
- Instances cassées : 0 sur Header, Side Navigation, Modal, Drawer, Scrollbar, Page Title, Overlay.
- Dimensions comparées avant / après par script : Modal (4 variantes + boîtes), Header (2), Side Navigation et les 3 groupes,
  Spotlight, Scrollbar, Drawer.
- Pages : aucune section superposée, rien ne dépasse d'une section, 160 px entre cadres (Overlay, Drawer, Page Title vérifiés par
  script ; Header, Side Navigation, Modal : Versionning plus haut mais dans sa section).

## Non fait, laissé (raison)
- **Modal Header `Back`** (BOOLEAN orphelin) : aucun calque Back dans l'en-tête, rien d'évident à relier. Propriété laissée.
- **Instances des copies locales** (20, non échangées : un swap ferait perdre les textes) :
  - `_Keycap (local copy)` (16) : 4017:331, 4017:333, 4017:335, 4017:343, 4017:345, 4017:347 (dans la copie Shortcut Row) ;
    4035:4694, 4035:4702, I4035:4658;4017:331, I4035:4658;4017:333, I4035:4675;4017:343, I4035:4675;4017:345 (Documentation ·
    Shortcuts Panel) ; I4028:1096;4018:1264;4017:343, I4028:1096;4018:1264;4017:345, I4028:1096;4018:1215;4017:343,
    I4028:1096;4018:1215;4017:345 (Do/Don't).
  - `_Shortcut Row (local copy)` (4) : 4035:4658, 4035:4675 (Documentation) ; I4028:1096;4018:1264 et I4028:1096;4018:1215
    (Do/Don't, via une instance de Shortcuts Panel). **Attention** : ces deux derniers chemins montrent que le maître Shortcuts
    Panel 4018:1029 contient lui-même 2 rangées 4018:1264 et 4018:1215 de la copie locale (contrairement à l'audit qui disait 12
    rangées d'Action). La copie privée imbriquée reste fonctionnelle ; à basculer vers Action avec relevé des textes avant.
- **Slots blancs bruts laissés** (le rendu changerait) : Page Title `Icon` 4010:15 et `Actions` 4010:911 (vides, posés directement
  dans le composant transparent : le carré blanc disparaîtrait) ; Filter Section `Body` 4013:109 (des instances sont sur fond gris
  245, ex. 4035:2901, 4035:2916, 4026:702, 4026:629).
- **Filter Section** 4013:132 reste publiée (description « Local to Filter Drawer ») : hors liste de ce lot.
- **Slot** : 26 instances de Buyer Summary non migrées (migration nécessaire).
- Décisions en attente, non touchées : Header `Menu Open`, Modal xlarge.
- Non liés (hors verdict « sûr » du lot 1 ou sans Semantic) : gap 16 de `.Logo Qirin`, valeurs de `.Flyout Menu Content` (gap 14
  sans token), fonds Foundation de `.Item` sans Semantic, paddings 12 / gap 72 de Header, gap 45 de Side Navigation, gap 10 de
  Drawer et de Scrollbar, padding 2 et rayons 1000 de Scrollbar, padding 272 de Modal, backdrop Modal (style distant).
- Drawer Tabs : Button Icon masqué 2459:2497 sans booléen (non listé au lot 2).
- Company Information / Assessment / Tools toujours en vrac en haut de la page Side Navigation, hors section.
- Brouillons hors section de la page Drawer (8 `Side Panel`, vecteurs, textes) : non touchés.
- Entrée publiée fantôme « Task » (`search_design_system`) : à vérifier dans le panneau de publication, invisible par l'API.
- `components.json` non modifié : Scrollbar y est déjà (0.1.0 draft).

## À publier (par l'utilisateur)
Librairie Layout. À relire au moment de publier : la liste de publication doit montrer comme retirés `.Company Information`,
`.Assessment`, `.Tools`, `_Tabs row (draft)`, `Frame 411` (supprimé), `_Keycap (local copy)`, `_Shortcut Row (local copy)` et les
4 composants `_` de Search, plus la collection `Layouts` ; Modal Header / Content / Footer renommés (mêmes clés) ; Header avec
3 nouveaux booléens.
