# Playbook : synchroniser une fonctionnalité du prototype dans Figma

Résumé de ce qui a été appris sur Search et Buyer Summary (fichiers `LBLqJmlPqXmx9qksCyYGPb` et `0ZjZu0OjHdzGowm3hliM2M`). À lire en entier avant le premier script. Références : `docs/figma/progress.md` (ledger, IDs), `docs/figma/qirin-figma-inventory.md` (clés des composants), `docs/figma/tokens-keys.md` (clés des variables et styles).

## Exigences de livraison
- Un fichier par fonctionnalité, **cadres en 1280 px de large** (jamais 1440), hauteur 800 minimum.
- Pages : Cover, Changelog, Overview, Screens (sections), States & edge cases, Specs (écrans annotés), Local components.
- **Vrais composants Qirin et vrais tokens, jamais de valeur en dur** : fills, strokes, paddings, gaps, rayons, styles de texte reliés aux variables de la librairie Tokens (clés dans `tokens-keys.md`). Instances des composants publiés (clés dans l'inventaire), jamais de copie détachée.
- Pas de tiret cadratin (`—`) nulle part (textes, noms, descriptions).
- Anglais pour tous les textes de l'interface.
- **Rien ne déborde sur l'écran voisin**, annotations comprises : 560 px entre deux écrans d'une section, au moins 400 px libres à droite d'un nœud annoté ; sections séparées d'au moins 200 px ; contrôle par script en fin de travail.
- Auto-layout partout, calques nommés, pas de groupe libre. Les écrans montent en instances (shell, cartes, boutons, badges).
- Les composants propres à la fonctionnalité sont des **composants locaux** (page Local components), avec description commençant par `Local · `. Pas de composant « écran » trop spécifique : un maître avec peu de propriétés et des **slots**, le contenu variable posé dedans. Ne pas créer de variantes de contenu. Propriétés minimales : variante = structure, booléen = afficher/masquer, texte, instance swap, atome imbriqué exposé (`isExposedInstance`).
- **Ne jamais créer de collection, de mode ou de variable dans Tokens** : seulement Foundation et Semantic existent.

## Source de vérité
Figma ne s'invente pas : les écrans reproduisent l'état réel du prototype. Captures de référence avec Edge piloté par playwright-core (`chromium.launch({ channel: 'msedge' })`, module à `C:\Users\JDAHAN\AppData\Local\Temp\figma-ref\node_modules\playwright-core`, scripts écrits comme fichiers dans `%TEMP%`, jamais dans le dépôt). Serveur de test de main : `http://localhost:4450/#/...` (routage par hash). Viewport 1280 x 800.

## Pièges de l'API Figma (use_figma)
- Charger la skill `figma:figma-use` (et `figma:figma-generate-design` pour des écrans, `figma:figma-generate-library` pour des composants) avant les appels, et passer `skillNames`. `create_session` avec la clé du fichier avant toute lecture ou écriture. Appels `use_figma` **séquentiels** sur un même fichier ; un seul `setCurrentPageAsync` par appel.
- `figma.skipInvisibleInstanceChildren = false` avant de toucher aux calques masqués d'une instance.
- Charger les polices avant d'écrire du texte ou de cloner : `Allianz Neo` (Regular, SemiBold, Bold), `JetBrains Mono` (l'identifiant de la topbox est en Menlo dans la librairie, absent ici), Inter.
- Une propriété TEXT impose la même valeur à toutes les variantes : surcharger directement le texte sur chaque instance. Lier un texte d'un sous-calque d'instance exige d'exposer l'instance.
- Un slot vide fait 100 x 100 : le masquer par booléen. Les slots se remplissent par `slot.appendChild(...)` sur l'instance ; `setProperties` ne touche pas aux slots.
- Les atomes préfixés `.` ne sont pas publiés (non importables). Pour `.Columns`, passer par Card `Type=Default` et régler ses propriétés sur l'instance.
- `Button` : le variant `State=Loading` n'a pas de `.Content`. Pas de ton Negative dans la librairie (le code l'a) : utiliser Primary Default et le noter dans les Specs.
- Comparer les nœuds par `id`, jamais par identité d'objet. Redimensionner un calque à l'intérieur d'une instance est interdit ; le padding d'une instance se surcharge.
- `combineAsVariants` : `page.appendChild` d'abord. Grilles : `layoutMode = 'GRID'`, `gridColumnCount`, `gridRowSizes[i].type = 'HUG'`, `gridColumnSpan` sur l'enfant (retirer et réinsérer les enfants pour changer un span).
- `figma.base64Encode` + `upload-asset` ne servent pas (images illisibles) ; ne pas exporter d'images pour ZeroHeight.
- Si `get_screenshot` dépasse 2 minutes, il part en tâche de fond et peut échouer : réessayer sur un nœud plus petit.
- Les annotations s'écrivent `node.annotations = [{ labelMarkdown: '...' }]` (rien d'autre dans l'objet) ; `get_screenshot` ne les affiche pas : contrôler par script qu'il reste de la place à droite.

## Clés utiles (détail dans l'inventaire)
Header Layout `39e53ceff3e27048d193a6a0e8d87a6337f410d5` (variante `Menu Open=False`), Side Navigation `7472d0df1c69d84a49701b96603fe096a864c6a6` (`Open=False`, rail : masquer `Frame 172` à hauteur fixe et mettre un trait droit relié à `foundation/color/grey/100` sur l'instance), Page Header `659acf912d814d5afd4958b3659e72813e6ca115` (Topbox / Breadcrumb / Tabs ; `.Topbox Content` avec `Data Type` Buyer ou Policy), Crumb `fe536134ad6af724c0d84b27bfdbff5b035da785`, Button `ba6612f79423df12e7c8056091b4f2be0117a96d`, Button Icon `50cb3176e31c571421705604e00f707cd7365bfd`, Badge `990a9ef2dd348f99e5b84b6d0605673ec4be7d23`, Grade (Data Display, page Grade), Card `1d68f1804fb8a066557949eb3a00d267ecbbff95` et Card slot `987bbbe7989deb275ffaddf597d7930ef5560401`, Horizontal Card `f217735ceefb49b06f599e5ae35a6239dcc80d57`, Dropdown `9274a067572ab011d011923afe655c8ede781f25`, Input Text `c88876bcbd398f68ea33b999f6f9206668395eac`, Drawer `413684a36328011d3e9d4a452107c914f8440d5b`, Modal `c81f6a2d522228de5c1ba82eb0240bc02fa658c4`, Tab `a1d28507f69545610a9b26df6159ff1bd5d4710b`, Flyout Menu `5d1147ac0e38f8f0c1dc9e3f24e12925e60d5631`, Dropdown Flyout Menu `2ce5aa6cf66b8e72b87203122fca400190015691`, Toaster `4cf21ce2c262dd24d9ab592332e6e430a825582d`, Skeleton Item `ed7d5d07b928ee3c836b31189bdd366d3e75bb8b`, Tag `0543a49f706402ccaf894754b854424cea08cab6`, Divider `9498f5f558f5f6c87dcaced34d9f08d1a1435a69`, Icon Functional `cdf378d4bf0b5a2960c73de094a0b11a6f10b236` (glyphe dans `🔗 Icon`, clés des glyphes dans l'inventaire). Tokens : Background/Main/Primary `24cbcb33a9a054c76dd9b5ac32456c3cd328475e`, Spacing M/L/XL `29937d51…`, `8ac2c55e…`, `e09a4861…`, Radius S/M `e3eb315f…`, `497d0c15…`, Tertiary background (section) `5bb86eaa324409d6f4d0f7f506bcfd782cfef9bf`. Styles de texte : Body L Regular `991a0807bb103fd3cab93f4c80ca0fc63aa70edb`, Body L Semi Bold `eccdf8053dde38ca892a5124f29e67b4c1ab2b40`, Body S Regular `092fa8c4ce222a0d27b4fee53ddb7bd00f80a0ce`, Title H3 `9c3b2714cd664aad4ed94ad7da280e99cf301160`.

## Modèles à imiter
- Shell de page : composant local « shell » (Header + rail + Page Header + slot `Content`), voir le fichier Buyer Summary page Local components, composant « Buyer Summary shell » (`15:5169`).
- Couverture, changelog, overview, specs : voir le fichier Search (`LBLqJmlPqXmx9qksCyYGPb`) pages 0:1, 1:2, 1:3, 1:6 et le ledger.
- Les agents lisent ces fichiers par `use_figma` en LECTURE seule (cloner un gabarit est permis, jamais modifier l'original).

## Publication des librairies
Elle est faite à la main par l'utilisateur. Ne jamais modifier les fichiers de librairie dans ce lot. Un composant manquant en librairie devient un composant local du fichier, noté dans le rapport.

## Annotations (Specs)
Figma empile les callouts au y du noeud annoté : des notes longues sur des noeuds proches se superposent (constaté sur Coverbook). Règle : annotation COURTE (numéro + titre, 12 mots max) et au moins 300 px verticaux entre deux noeuds annotés d'un même écran, sinon une seule annotation sur le parent. Le détail va dans un cadre « Notes » en vrai texte (liste numérotée, largeur 480) à droite de l'écran, 560 px avant l'écran suivant. Contrôle par script du chevauchement estimé des callouts (hauteur ~ 24 px + 18 px par 40 caractères, largeur 360).
