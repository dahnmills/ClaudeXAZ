# Inventaire Figma du design system Qirin

Relevé du 2026-11-03, pour reproduire le prototype dans Figma (voir
`docs/superpowers/specs/2026-11-03-figma-sync-search-design.md`). Clés à réutiliser dans
les scripts `use_figma` (`importComponentSetByKeyAsync`, `importComponentByKeyAsync`,
`importVariableByKeyAsync`).

## Fichiers et librairies

| Librairie | Fichier | Clé librairie |
|-----------|---------|---------------|
| Tokens | `4TxqgJPVFZc4ZKw4JZ6OAn` | `lk-f91ca7837e1c488af5cf4cbe0ff8b6e271a5aeedf2ce075905ae248fc1a3208fa06cb2fd205b8260dae6d37749e2c475b7bea3906f796054299f035d2c57c233` |
| [Components] Action | `xCeEJPn6fliEshuE9fnrqs` | `lk-a1e47514a471c358e24843c7b5b0ed55579da589ccc59c78b5e69bcbfc9a804f94b61b3e6723f0c78dfb801d8a2604b05cbfbfc9b2cf77947c8fc649c224024f` |
| [Components] Data Display | `VpConH5AUGyCqtp8PMqj1i` | `lk-d7a646b9740d6d1fe8231623375205e8e929aae3e6fefd3569d0a576393615bd6047070b415a8d3c6296a68a6737cd0534ab1143b9cc164256a0a5048f7d3ca6` |
| [Components] Data Entry | `1wVY9FfjONIX6us9JmIm7U` | `lk-ec62dd4eaf5602f76f16b2ac8e5548b54aa16d09a66e37a64f1d3786f973b90be117b27030b4f8c6d59b7ea180ca213aafa95b0d5c698621d459b1ff663d05fa` |
| [Components] Feedback | `fH3vmSNZR8r0sU3kN455CD` | `lk-43489d3a82ca8aa2dd027b623725084a06e1e78c55e872a364b02533b573aa2d9e1f09f4edf1a6e4500770f8cc3e8fd26348bd90cf7c35b05985ba0a31856c44` |
| Icônes : wrapper `Icon Functional` (NDBX 🌎 Web) + glyphes NDBX 🌎 Icons | | NDBX Icons : `lk-04e45aeca2eed1482dcdc1f565d6ed737f31009bd6b6f9adca248e8ffcfb449c1577280778cf6017e72ed34867ff65b7df2e0c734c492d51ab9a456252e10d20` |

## Tokens

- Collection **Foundation** (139 variables, mode `Mode 1`) : `Color/<Teinte>/<Nuance>`,
  `Spacing/<n>`, `Sizing/<n>`, `Radius/<n>`, `Opacity/<n>`, `Font/…`.
- Collection **Semantic** (371 variables, mode `Default`) : `Color/Interactive/…` (213),
  `Color/Static/…` (86), `Measurement/Spacing|Sizing|Opacity`, `Border/Radius|Size`,
  `Font/Title|Text Style|Display`. Le nom suit le CSS du code :
  `Color/Interactive/Background/Strong/Default` = `--semantic-color-interactive-background-strong-default`.
- **Styles de texte** (35) : `Title/H1…H4`, `Body/L|M|S/Regular|Semi Bold|Bold (+ Underline)`,
  `Display/L|M|S/…`. Ex. `Body/L/Regular` = `991a0807bb103fd3cab93f4c80ca0fc63aa70edb`.

## Composants à instancier

| Composant | Librairie | Clé (set) | Propriétés utiles |
|-----------|-----------|-----------|-------------------|
| Button | Action | `ba6612f79423df12e7c8056091b4f2be0117a96d` | |
| Button Icon | Action | `50cb3176e31c571421705604e00f707cd7365bfd` | State, Type (Primary/Secondary/Tertiary/Plain), Size (S/M), Reversed, Tone (Default/Accent/Positive/Negative), Focus |
| Link | Action | `b9493d2f368c2be7b05432781ca275cc35a896f3` | |
| Chip | Action | `1547bf755eadb695613b4348141045dc99dff38e` | |
| Tab | Action | `a1d28507f69545610a9b26df6159ff1bd5d4710b` | |
| Breadcrumb | Action | composant `955f4ed585e92b7a35ef2efe4ecd083514754dd8` | |
| Crumb | Action | `fe536134ad6af724c0d84b27bfdbff5b035da785` | |
| Flyout Menu | Action | `5d1147ac0e38f8f0c1dc9e3f24e12925e60d5631` | (le Flyout Menu vit dans Action, pas dans Data Entry) |
| Badge | Feedback | `990a9ef2dd348f99e5b84b6d0605673ec4be7d23` | |
| Skeleton Item | Feedback | `ed7d5d07b928ee3c836b31189bdd366d3e75bb8b` | |
| Card | Data Display | `1d68f1804fb8a066557949eb3a00d267ecbbff95` | |
| Page Header | Data Display | composant `659acf912d814d5afd4958b3659e72813e6ca115` | |
| Breadcrumbs - Topbox | Data Display | composant `099403d1a6c62b133cc1e5b00fab016f68c5faf8` | |
| Tabs - Topbox | Data Display | composant `5126f0cd01518ef3ed698910afa3ffd713dfdca8` | |
| Icon Functional | NDBX 🌎 Web | `cdf378d4bf0b5a2960c73de094a0b11a6f10b236` | glyphe en instance swap `🔗 Icon` |

## Absents des librairies (à créer)

| Composant code | Fichier cible | Tâche du plan |
|----------------|---------------|---------------|
| `ds-identifier` | Data Display | 3 |
| état `selectable` / `selected` du Flyout Menu Item | Action (page Flyout Menu) | 4 |
| `ds-standalone-dropdown` | Data Entry | 5 |
| `ds-result-card` | Data Display | 6 |
| `ds-policy-result-card` | Data Display | 7 |
| `ds-search-bar-scoped` | Data Entry | 8 |
| `app-recent-search-v2-card` | fichier Search, composant local | 8 |
| Header Qirin (bandeau bleu du shell) | à vérifier dans `[Common] Top box / Page Header` avant de créer | 9 |

## Gabarit de documentation (pages des librairies)

Page par composant, cadre `_Design system header` (1800 px de large) :
`Gradient strip` → `Content` (vertical, gap 64, padding 64/80) :
1. ligne d'en-tête : logo Qirin + fil d'Ariane « Qirin Components → <Nom> », « Version : 1.0.0 » ;
2. titre + description, bloc « Status » avec pastilles Design / Tech (Badge) ;
3. trait ; section **Component** (texte d'intro + cadre gris avec le component set) ;
4. section **Atoms** (sous-éléments préfixés `.`).
À côté, un cadre `Versionning` (titre « Changelog », entrées Version / date / texte, Divider).
Exemple de référence : fichier Data Entry, page `Dropdown`, cadre `2049:578` et `2193:2376`.
Pour un nouveau composant : dupliquer ce cadre, l'adapter, remplacer le set.

## Glyphes NDBX 🌎 Icons (clé composant, à poser dans `Icon Functional` › `🔗 Icon`)

| Code (`ds-icon`) | Glyphe NDBX | Clé |
|------------------|-------------|-----|
| copy | Duplicate | `4cc33b8728c3c7366be1517191d9588ecb25b61e` |
| hash | absent de NDBX, glyphe local `🆕 Hash` (Data Display, page 🆕 Identifier) | |
| chevron-down | Chevron-Small Down | `d87ac7320f789b4f0d90dae043c69a14610c067e` |
| search | Search | `a365c036b6478ec14ee5bbec38b282b35286ee8c` |
| star (vide / plein) | Star Outline / Star Filled | `01a2099921c798d98ac697aaf69daa65c2639fe8` / `91983a35151b8979741819dffffd07b6681326ce` |
| close | Close | `58ed8425eb1b2050e41e5ffeaebc55bae7fb32dd` |
| check | Check | `b347b88f078b486b16c699fdeb0fd6e08e9dc011` |
| building | Building | `6fdd10ed0cca0fb0bd2e4b1f97b23039007bd965` |
| clock | Clock Outline | `8699aa200bb418dcffe75a2a59fa36626a8efb15` |
| map-pin | Location Outline | `f3d122aa073034adbc2e065258f2a9db139014f2` |

Choix unique (Search in, Group by…) : `Dropdown Flyout Menu` de Data Entry
(`2ce5aa6cf66b8e72b87203122fca400190015691`, variante `Multi-Select=False, Grouped=False`) :
emplacement d'icône fixe de 20 px et propriété `Selected` sur `.Item Properties`.
Aucune extension du Flyout Menu d'Action n'est nécessaire (tâche 4 sans objet).
| plus | Plus | `83cadb70a0d880c2703fd927411de7fb46b4bffa` |
| chevron-up | Chevron-Small Up | `89f86f9035c48939191d577336cccfc490d02347` |
| calendar | Calendar | `50ddfe903239c89a5c6d3eaa7851a3584a75fa65` |
| file / policy | Paper Document Outline | `30da1b34f526a03d3d682988cb6a2f0df446bb5a` |
| grid | absent de NDBX, glyphe local `🆕 Grid` (Data Display, page 🆕 Icon Tile) | |

Divider (doc et cartes) : `9498f5f558f5f6c87dcaced34d9f08d1a1435a69` (variantes `Property 1=Divider 0px padding | 32px padding`).

## Composants 🆕 publiés (2026-11-03)

| Composant | Librairie | Clé |
|-----------|-----------|-----|
| Identifier | Data Display | `53c3ac2707ece794a631ff38fb720f3daf55c38f` |
| Icon Tile | Data Display | `d0deb1323d2cc6e2c4cd3a946361b71774b697ec` |
| Progress Bar | Data Display | `4df39ca608325e342d59fce52895ba277b0acb05` |
| Standalone Dropdown | Data Entry | `c8b538b2c02d49f7811cbed28cff4cdcf7c7606e` |
| Glyphes Data Display (composants) | Hash `931c5930…4f30`, Grid `4e1e1993…5165`, Contract `ab403cca…c31a`, File Text `cb8968ae…3323`, File New `2bcf031d…6e32` | |
| Header (Layout) | Layout | set `39e53ceff3e27048d193a6a0e8d87a6337f410d5` |
| Tag | Action | set `0543a49f706402ccaf894754b854424cea08cab6` |

## Maîtres à slots (2026-11-03, après refonte)

| Maître | Librairie | Clé | Slots / props |
|--------|-----------|-----|---------------|
| Horizontal Card (variante Type=Slot) | Data Display | set `f217735ceefb49b06f599e5ae35a6239dcc80d57` | Leading, Content, Trailing, Extra actions (+ Show extra actions), Details ; Open, Size, Favorited |
| Search Bar | Data Entry | set `b084316c812d814b121583b538e770364979098c` | Filters, Options ; Query ; Filled |
| Card (Type=Default, contient `.Columns`) | Data Display | set `1d68f1804fb8a066557949eb3a00d267ecbbff95` | `.Columns` : # Columns, Layout, Loading (réglables sur l'instance) |
| Card (composant avec Slot) | Data Display | `987bbbe7989deb275ffaddf597d7930ef5560401` | Slot, Button |

Retirés : Result Card, Policy Result Card, Properties Panel, .Property Row, Search Bar Scoped.

## Clés complètes (Buyer Summary, 2026-11-04)

| Composant | Clé |
|-----------|-----|
| Dropdown (Data Entry) | `9274a067572ab011d011923afe655c8ede781f25` |
| Drawer (Layout) | `413684a36328011d3e9d4a452107c914f8440d5b` |
| Modal (Layout) | `c81f6a2d522228de5c1ba82eb0240bc02fa658c4` |
| Radio Card (Data Entry) | `50c847daec5c6553ab40d2d83a94aa7baea693b4` |
| Logo Qirin | `d4206ee4062b4521ca7005e17b172f4c2d925029` |
| Spinner | `d19dd496d14564251acf7492ec0b97fde810da81` |
| Effet `Shadows/Bottom/400` | `3aa40b207e3dbeb82e7947cc955316d69a750a41` |
| Opacity `Measurement/Opacity/Disabled` | `635452a78f88f38f12a7db3e3aa46feb80d4d5ff` (Overlay `ad43f78e3ae00bf22accc617d33951dc9065d269`) |

Police : l'identifiant de la topbox est en Menlo dans la librairie et le code ; Menlo n'est
pas installé là où les scripts tournent, le texte est passé en JetBrains Mono dans les fichiers de synchro.
