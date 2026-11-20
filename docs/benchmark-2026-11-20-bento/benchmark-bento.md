# Benchmark Bento UI : refonte des cards de Buyer Summary V2

Date : 20/11/2026. Périmètre : `src/app/pages/buyer-summary-v2/` (copie de la V1 : grille de 4 colonnes, slots de
1 ou 2 colonnes et 1 ou 2 lignes, board plafonné à 2 lignes par `BOARD_MAX_ROWS`, tailles S / M / L).

Demande, dans l'ordre où elle est arrivée :
- nouvelles cards from scratch, sans limite de lignes, esprit Bento, plus moderne ;
- une card peut être « highlight » (fond de couleur) ;
- cards responsives (leur contenu s'adapte à leur taille) et grille responsive à toutes les résolutions ;
- réorganisation fluide, « comme quand tu réorganises ton écran d'application sur iOS » (ajout de 10 h 14) ;
- **critère principal** (10 h 22) : un vrai dashboard dense, le maximum d'information par card, la beauté au service
  de la densité, rien de décoratif ;
- **tous les formats** (10 h 25) : 1x1, 2x1, 1x2, 2x2, 2x3, 3x2, 1x3, 3x1 et au-delà (4x1, 4x2, 1x4...), chacun en
  version normale ou highlight, avec ce que devient chaque format quand l'écran rétrécit.

Études réutilisées, non refaites : `docs/card-builder-benchmark-2026-10-06.md` (Apple Watch, iOS widgets, Garmin,
Wahoo, Karoo, Jira, Koyfin, Finviz), `docs/benchmark-2026-10-15/` (Grafana, Datadog, Power BI, Tableau, Looker,
Metabase, Salesforce, Airtable, Notion, Bloomberg Launchpad, Shopify, iOS Lock Screen, WoW Edit Mode),
`docs/card-builder-redesign-brief-2026-10-14.md` (catalogue par groupes métier, format désactivé avec sa raison).

---

## 1. Synthèse en 10 lignes

1. Le bento utile à Qirin est celui des outils de données (Grafana, Datadog, Power BI, Stripe), pas celui des pages marketing (Mercury, Ramp, Brex : une idée par tuile) : une question métier par card, beaucoup de chiffres, zéro décor.
2. Grille : colonnes calculées sur la **largeur du board** (container query), en nombres pairs 2, 4, 6, 8 ou 12, de 172 px minimum ; **6 colonnes à 1280 px**, 8 à 1920, 12 à 2560. Gouttière 16 px.
3. Unité de ligne **carrée** (hauteur de ligne = largeur de colonne, de 180 à 263 px selon l'écran) : un 2x1 reste un rectangle 2:1, un 1x1 reste un petit carré.
4. Quatorze formats : carrés (1x1, 2x2, 3x3), horizontaux (2x1, 3x1, 4x1, pleine largeur), verticaux (1x2, 1x3, 1x4), blocs (3x2, 2x3, 4x2, 4x3). Chacun existe en version normale et en version highlight.
5. Repli : la largeur d'un format est bornée au nombre de colonnes, sa hauteur ne change pas ; la card descend alors d'un niveau de contenu (tableau complet section 3.2).
6. Placement : la liste ordonnée de l'analyste fait foi (modèle iOS) ; un moteur JS pose chaque card au premier emplacement libre et rend le DOM dans l'ordre visuel, pour que Tab et lecteur d'écran suivent l'œil (MDN : `dense` désordonne la lecture).
7. Densité lisible : chaque card est un conteneur (`container-type: size`) qui choisit parmi 9 niveaux (3 largeurs x 3 hauteurs) ; on ajoute des couches d'information, on ne grossit jamais (Apple HIG) ; chiffres tabulaires, sparklines (Tufte), bullet graphs (Few), deltas en flèche + texte, couleur réservée au statut.
8. Highlight : une card par board, fond `static-background-brand` (marine) avec texte blanc à 11,27:1 ; la teinte bleu clair existante est à écarter (1,02:1 contre le fond de page, texte tertiaire à 4,25:1).
9. Réorganisation : mode édition explicite, card soulevée qui suit le pointeur, voisines qui s'écartent en FLIP (`transform` seul, 200 à 250 ms, `cubic-bezier(0.2, 0, 0, 1)`), place fantôme, choix de format parmi les 14, alternative sans glisser (WCAG 2.5.7), clavier et `aria-live`. Angular 19 : pointer events + signals + FLIP maison, View Transitions pour les changements discrets ; le CDK drag-drop n'anime pas le tri en `mixed` et ne gère pas la 2D.
10. Recommandation : **direction A « Mosaïque ordonnée »** (0 cellule libre sur le board d'exemple à 1280 px, 6 à 1920 px), avec des titres de card formulés comme des questions ; B et C perdent trop de place (21 et 2 à 14 cellules libres).

---

## 2. Références

Méthode : chaque source a été ouverte le 20/11/2026 (WebFetch, ou navigateur Playwright en 1440 x 900). Pour linear.app
et vercel.com, les valeurs de grille ont été **mesurées** dans le DOM (`getComputedStyle`), pas lues sur une image.
Les pages produit Apple consultées (iPhone, MacBook Pro) ne contenaient pas de bento le jour de la visite : Apple est
donc cité par ses HIG. La page Bloomberg sur l'UX du Terminal a renvoyé 403 et la recherche web était bloquée par un
captcha : seules des URL directes ont pu être vérifiées. Les points marqués [étude du 15/10] ou [étude du 06/10]
viennent des benchmarks précédents et n'ont pas été revérifiés. Les contrastes cités sont calculés avec la formule
WCAG sur les valeurs de `_tokens.scss`. Les capacités en données par format sont des estimations à partir des tokens,
à confirmer en maquette.

### 2.1 Tableau

| # | Référence | Lien | Ce qu'on retient | Ce qu'on écarte |
|---|---|---|---|---|
| 1 | Apple HIG, Widgets | https://developer.apple.com/design/human-interface-guidelines/widgets | « Small widgets ... show a single piece of information while larger sizes support additional layers » ; « Avoid expanding a smaller widget's content to simply fill a larger area » ; marges standard 16 pt, 11 pt pour des groupes serrés ; rayon du contenu coordonné à celui du conteneur ; « Convey meaning without relying on specific colors » ; trop dense : « a larger widget size or replacing text with graphics ». | Apparences teintée et transparente (« Liquid Glass ») : verre et translucidité sont des anti-références. |
| 2 | Apple HIG, Charting data | https://developer.apple.com/design/human-interface-guidelines/charting-data | Petit graphique = aperçu « glanceable » d'un plus grand ; titres et annotations qui disent quoi retenir ; étiquettes d'accessibilité obligatoires. | « Resist the temptation to pack as much data as possible into a chart » : appliqué au graphique, pas à la card (la card est dense, chaque graphique reste simple). |
| 3 | Power BI, card visual (GA novembre 2025) | https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-card | Une card = 3 zones (callout, image, reference labels) ; les reference labels donnent le contexte du chiffre (écart à la cible, % de l'objectif) avec un niveau « Detail » ; tendance 6 mois en SVG à côté de la valeur ; mise en forme conditionnelle pour signaler une card sous l'objectif ; padding par défaut 12 px. | Abréviations automatiques (12K) par défaut : à trancher pour un analyste crédit (question 7) ; images de produit, icônes décoratives. |
| 4 | Grafana, Stat panel | https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/ | « The graph sparkline is automatically hidden if the panel becomes too small » ; mise en page ajustée « depending on available width and height » ; tailles de texte séparées pour titre, valeur et variation ; couleur de variation inversable (une hausse peut être mauvaise). | « Background Gradient » : dégradé décoratif. |
| 5 | Grafana, layout | https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/view-dashboard-json-model/ et https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/create-dashboard/ | 24 colonnes, unité de hauteur de 30 px ; « negative gravity » qui remonte les panneaux ; auto grid : largeur minimale de colonne, 10 colonnes max, hauteur de ligne au choix ; redimensionnement par le coin. | Liberté x / y au pixel : trop fine, produit des boards incohérents. |
| 6 | Datadog, dashboards et Query Value | https://docs.datadoghq.com/dashboards/configure/ , https://www.datadoghq.com/blog/datadog-dashboards/ , https://docs.datadoghq.com/dashboards/widgets/query_value/ | Grille responsive qui « will scale to any screen size » ; widget un peu trop grand « squeezed » ; groupes qui suivent la grille ; « high density mode » sur grand écran ; Query Value : série temporelle en fond, indicateur de variation relatif / absolu dont le sens « bon » se règle. | Fond de tuile coloré par règle : chez nous, le fond coloré est réservé au highlight. |
| 7 | Stripe Dashboard | https://docs.stripe.com/dashboard/basics | Accueil fait de widgets d'analyse que l'utilisateur ajoute ou retire (« Ajouter » sous « Vue d'ensemble », puis « Appliquer ») ; alertes importantes (litiges) sur la même page. | La doc ne décrit ni tailles ni grille : rien d'autre de vérifié. |
| 8 | Linear (site, mesuré) | https://linear.app/ | Pistes égales sans gouttière, figures numérotées « FIG 0.1 », filets de 0,57 px `rgba(255,255,255,0.08)`, rayons 12 et 8 px : la structure vient des filets, pas des ombres. | Fond quasi noir `rgb(8,9,10)` : hors registre. |
| 9 | Linear Dashboards | https://linear.app/docs/dashboards | Trois formats d'insight (chart, table, metric block) ; chaque insight ouvre la vue filtrée ; filtres de dashboard hérités par chaque insight. | La doc ne dit rien de la grille. |
| 10 | Vercel (site, mesuré) et Geist Grid | https://vercel.com/ et https://vercel.com/geist/grid | 12 colonnes mesurées, gouttières 20 et 24 px, un bloc 6x2 à côté de deux 6x1 sur des lignes de 280 px, rayon 6 px ; Geist : colonnes par point de rupture (`sm: 1, md: 2, lg: 3`), cellules sur plusieurs lignes, guides en `aria-hidden`. | Geist se dit fait pour le marketing ; « pour des cartes responsives simples », une grille CSS suffit. |
| 11 | IBM Carbon, 2x Grid | https://carbondesignsystem.com/elements/2x-grid/overview/ | Mini-unité de 8 px ; 4 / 8 / 16 colonnes à 320 / 672 / 1056 px ; tuiles fluides dont la **hauteur est un multiple de la largeur de colonne**, ratios 1:1, 2:1, 2:3, 3:2... | Gouttière de 32 px : trop aérée pour un dossier. |
| 12 | IBM Carbon, Dashboards | https://carbondesignsystem.com/data-visualization/dashboards/ | « The most important data should have the highest contrast and occupy the largest area » ; couleurs constantes par jeu de données ; mêmes layout, espacements et position de légende sur tous les graphiques. | Rien. |
| 13 | Atlassian, Grid | https://atlassian.design/foundations/grid | 2, 6 puis 12 colonnes ; gouttière 16 px et marges 32 px dès 1024 px : les valeurs de Qirin (`spacing-m`, `spacing-xl`). | Paliers sur la fenêtre et non sur la zone de contenu (la doc le dit elle-même). |
| 14 | Shopify Polaris, valeurs responsives | https://shopify.dev/docs/api/polaris/using-polaris-web-components | Propriétés responsives selon « the parent container's inline size » (`@container`) ; la valeur de repli doit marcher « at the smallest size ». | Rien. |
| 15 | Android, window size classes (Material 3) | https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes | Classes de largeur < 600, 600 à 840, 840 à 1200, 1200 à 1600, ≥ 1600 dp ; « not determined by the size of the device screen » ; tester d'abord la plus large. | Paliers pensés pour le mobile : on les applique à la largeur du board. |
| 16 | Tufte, sparklines | https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/ | « data-intense, design-simple, word-sized graphics » ; dernière valeur reliée à son chiffre ; bande grise de normalité ; placées partout où un mot ou un nombre peut aller. | Rien. |
| 17 | Stephen Few, Bullet Graph Design Spec | https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf | Conçu « to replace the meters and gauges » ; une mesure, 1 ou 2 comparatifs, 2 à 5 plages (idéalement 3) en **intensités d'une seule teinte**, pas en couleurs distinctes, pour les daltoniens. | Jauges circulaires et anneaux. |
| 18 | Tableau, bonnes pratiques | https://help.tableau.com/current/pro/desktop/en-us/dashboards_best_practices.htm | Vue la plus importante en haut à gauche ; « construct your visualization at the size it will be viewed at ». | « two or three » vues par dashboard : vaut pour l'exploration, pas pour un dossier d'analyste. |
| 19 | Mercury | https://mercury.com/ | Tuiles de ratios variés (images 1x1, 3x2, 4x5, 2x1) ; tuiles qui partent d'un chiffre ; une seule bande d'emphase. | Illustrations abstraites, tuile purement décorative, chiffres héros marketing. |
| 20 | Ramp | https://ramp.com/ | Une seule tuile mise en avant sur cinq (Banking) : l'emphase est rare. | Chiffres de preuve isolés ; grille de quinze témoignages identiques (« grille infinie »). |
| 21 | Brex | https://www.brex.com/ | Rien à reprendre. | Trois blocs « grand chiffre + légende » : le chiffre héros type. |
| 22 | Raycast | https://www.raycast.com/ | Contre-exemple : fond « Blue glass-effect » (texte alternatif d'image). | Verre, lueurs. |
| 23 | bentogrids.com | https://bentogrids.com/ | Catalogue de bentos réels (Apple, Geist, Frame.io, Medusa, Mintlify, Tailwind UI...) : utile pour le genre. | Presque tout est marketing : une idée par tuile. |
| 24 | Bloomberg Terminal | https://professional.bloomberg.com/products/bloomberg-terminal/ + [étude du 15/10] | « customized workspace », « multi-asset class security monitors » ; liaison des fenêtres par groupe de couleur [étude du 15/10]. | Mnémoniques, courbe d'apprentissage ; pas de hiérarchie visuelle à copier. |
| 25 | Koyfin | https://www.koyfin.com/features + [étude du 06/10] | « custom dashboards ... on one screen », un dashboard par classe d'actifs. | Rien de vérifié sur la grille. |
| 26 | MDN, `grid-auto-flow` | https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow | `dense` « may cause items to appear out-of-order » ; le mode sparse garde l'ordre mais laisse des trous. | `dense` en CSS pur (voir 3.1). |
| 27 | MDN, Grid et accessibilité | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Grid_layout_and_accessibility | Le placement grid ne change ni la lecture vocale ni l'ordre de tabulation ; test : « tab around the document ». | Réordonner l'affichage sans réordonner le DOM. |
| 28 | MDN, container queries + web.dev | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries et https://web.dev/blog/cq-stable | `size` et `inline-size`, conteneurs nommés, requêtes d'orientation ; stables depuis Chrome 105, Firefox 110, Safari 16 ; unités `cqi`. | Rien. |
| 29 | MDN, subgrid | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid | Grille imbriquée qui reprend les pistes du parent ; Baseline depuis septembre 2023 ; utile pour aligner les sections de la direction B. | Rien. |
| 30 | Ahmad Shadeed, container queries | https://ishadeed.com/article/container-queries-are-finally-here/ | `container-type` sur l'enveloppe, pas sur la card ; conteneur nommé ; styles de base = petite taille. | Rien. |

Les références du volet mouvement sont listées en section 5.

### 2.2 Ce qui rend les meilleures références qualitatives

- **Une seule trame.** Grafana (24 colonnes, lignes de 30 px), Carbon (mini-unité de 8 px), Vercel (12 colonnes, lignes de 280 px) : les tuiles tombent toujours sur la même trame. C'est ce qui fait « propre » même quand c'est dense.
- **La taille dit l'importance.** Carbon : la donnée la plus importante a « the largest area ». Tableau : en haut à gauche. Vercel mesuré : un 6x2 à côté de deux 6x1.
- **Le contenu change avec la taille, il ne grossit pas.** Apple HIG ; Grafana (sparkline masquée quand la tuile est trop petite) ; Power BI (zones réglables).
- **Le chiffre n'est jamais seul.** Power BI reference labels, Datadog change indicator, Grafana percent change.
- **L'emphase est rare.** Ramp : une tuile sur cinq ; Mercury : une bande sur toute la page.
- **Structure par filets plutôt que par ombres** (Linear mesuré).

---

## 3. Principes Bento applicables à Qirin

### 3.1 Grille

| Règle | Proposition | Justification |
|---|---|---|
| Référence de largeur | La **largeur du board**, par container query sur l'élément grille, jamais la fenêtre. | Le board perd 224 px quand la side-nav s'ouvre (56 puis 280 px) et 388 px quand le drawer s'ouvre (`$drawer-w` = 6 x `sizing-3xl` + `sizing-xs`). Atlassian reconnaît que ses paliers suivent la fenêtre et pas la zone de contenu ; Polaris et Android raisonnent en espace disponible. |
| Colonnes | **2, 4, 6, 8 ou 12**, le plus grand nombre de colonnes de **172 px minimum** qui tient (seuils section 4). Une seule colonne sous 360 px. | Six colonnes dès 1280 px permettent de porter 3x1, 3x2, 4x1 et 4x2 à côté d'autres cards. Les nombres pairs évitent les trous systématiques des cards de largeur 2 ; 6 et 12 accueillent aussi les largeurs 3 (Atlassian 2 / 6 / 12, Carbon 4 / 8 / 16 sont pairs). 172 px est la plus petite largeur où un carré garde 140 px utiles avec 16 px de padding. |
| Gouttière | `--semantic-measurement-spacing-m` (16 px), constante. | Identique à la V1 et à Atlassian desktop ; Carbon (32 px) est trop aéré. |
| Unité de ligne | **Carrée : hauteur de ligne = largeur de colonne** (de 180 à 263 px selon l'écran, tableau section 4). Une card de h lignes mesure h x unité + (h - 1) x 16 px. | Carbon : hauteur « multiple of column width », ratio 1:1. Les formats gardent leurs proportions à toutes les tailles : un 1x1 reste un petit carré, un 3x1 un bandeau. Alternative : hauteur fixe de 208 px (2 x `--semantic-measurement-size-tile`), plus prévisible mais les proportions changent avec l'écran (question 2). |
| Spans | Largeurs 1, 2, 3, 4, ou pleine largeur ; hauteurs 1 à 4. Quatorze formats (3.2). Aire maximale 12 cellules. | Assez pour du carré, de l'horizontal, du vertical et des blocs, sans liberté au pixel (Grafana) qui produit des boards incohérents. |
| Repli | Largeur bornée au nombre de colonnes, **hauteur conservée** ; la card passe au niveau de contenu correspondant à sa nouvelle taille (3.3). | Le contenu reste à la même place verticale : l'analyste ne « perd » pas une card plus bas. |
| Packing | **Premier emplacement libre, calculé en JS** dans l'ordre de la liste, en repartant du haut à chaque card (ce qui remplit les trous laissés plus haut), puis **DOM rendu dans l'ordre visuel** (ligne, puis colonne). | `dense` en CSS remplit aussi, mais sépare ordre visuel et ordre DOM (MDN 26 et 27). En calculant nous-mêmes et en triant le DOM, on a le remplissage sans casser Tab ni le lecteur d'écran. C'est la « negative gravity » de Grafana. |
| Trous | Possibles quand aucune card suivante ne tient. En lecture : fond de page. En édition : place fantôme « Add a card here » aux dimensions du trou, cliquable. | Ne jamais étirer une voisine pour boucher : son niveau de contenu changerait sans que l'analyste l'ait voulu. |
| Ordre et clavier | Ordre de lecture = ordre visuel calculé. Chaque card est une région titrée (`<section aria-labelledby>`), titre en `h3`. | MDN : « tab around the document ». |
| Lignes | Illimitées : `BOARD_MAX_ROWS` disparaît, le board défile. | Demande utilisateur ; Datadog et Grafana défilent. |

### 3.2 Les quatorze formats

Tailles en px à 1280 px (board de 1160 px, 6 colonnes de 180 px, lignes carrées de 180 px). Données : valeurs entre
guillemets = mocks actuels (`DATA_CATALOG`, `gradeData`, `MONTHS`) ; (?) = champ supposé, à confirmer avec le métier.
Capacité : estimation du nombre de valeurs lisibles (chiffre, date, statut) à partir des tokens, à valider en maquette.

**Version highlight, commune à tous les formats** : fond `--semantic-color-static-background-brand` (marine #003781) ;
texte principal `static-text-main-reversed` (blanc, **11,27:1**) ; texte secondaire `static-text-subtle-tertiary`
(grey-200, **7,98:1**) ; filets internes `static-border-subtle-tertiary` ; liens `ds-link` tone `reversed` ;
graphiques en tonalité « reversed » à créer dans `ds-chart` (le bleu blue-a-400 sur marine n'a que 3,13:1) ;
icône `star-filled` à côté du titre et libellé accessible « Highlighted ». Contraste du fond avec la page grey-050 : 10,34:1.

| Format | Orientation | Taille à 1280 | Usage type | Exemple Qirin dense et données | Capacité | Réduite (repli) | Highlight |
|---|---|---|---|---|---|---|---|
| **1x1** | Carré | 180 x 180 | Un indicateur et son contexte | **Score** : « 82 / 100 », tendance « Stable » (flèche + texte), mise à jour « 11 nov 2024 », sparkline 8 points | 4 à 5 | Ne se replie pas | Oui, cas idéal : petit carré marine |
| **2x1** | Horizontal | 376 x 180 | Indicateur + explication côte à côte | **Payment behaviour** : payé à l'heure « 94 % » + barre empilée « 94 % » / « 6 % » / « 0 % » (on time, 1-30 j, 30+ j) ; total overdue « 0 », plus ancien « N/A », litiges « None » | 8 à 10 | 1 col. : 1x1, garde le % et la barre | Oui |
| **3x1** | Horizontal | 572 x 180 | Bandeau d'un sujet | **Exposure** : « 1 548 000 » + bullet graph contre la plus haute limite « 10 000 246 000 », nombre de limites « 72 », tendance 8 points, granted « 5 000 000 » / used « 1 548 000 » / available « 3 452 000 » | 10 à 12 | 2 col. : 2x1, sans la tendance ; 1 col. : 1x1, valeur + bullet | Oui |
| **4x1** | Horizontal | 768 x 180 | Comparaison de 4 valeurs | **Limit & coverage** : cover requested « 2 000 000 », cover granted « 2 000 000 », décision « Approved » (`ds-badge`), granted limit « 5 000 000 » avec bullet utilisé / disponible | 12 à 16 | 2 col. : 2x1, décision + bullet ; 1 col. : 1x1 | Oui |
| **Pleine largeur** (6x1 à 1280, 8x1 à 1920) | Horizontal | 1160 x 180 | Synthèse transversale | **Risk at a glance** : grade, exposition, payé à l'heure, total overdue, score, décision de couverture, chacun avec sa micro-viz (sparkline ou bullet) | 18 à 24 | S'adapte à toute largeur : les indicateurs passent à la ligne par paires | Déconseillé : bande marine pleine largeur trop lourde (question 3) |
| **1x2** | Vertical | 180 x 376 | Petite liste ou état détaillé | **Overdues** : total « 0 », plus ancien « N/A », litiges « None » ; état vide « No overdue recorded » + date ; sinon jusqu'à 5 impayés ouverts : montant, échéance (?) | 8 à 10 | Ne se replie pas | Oui |
| **1x3** | Vertical | 180 x 572 | Liste | **Jobs to do** : nombre de tâches, puis 8 tâches : titre (1 ligne), échéance, statut `ds-badge` | 16 à 24 | Ne se replie pas | Oui |
| **1x4** | Vertical | 180 x 768 | Chronologie | **Newsfeed** en timeline : 8 à 10 actualités, date, titre sur 2 lignes, tonalité (`ds-badge` « Positive »...) | 25 à 30 | Ne se replie pas | Possible ; colonne marine très haute, à juger en maquette |
| **2x2** | Carré | 376 x 376 | Indicateur + graphique | **Coverage** : demandée / accordée « 2 000 000 », décision « Approved », date et auteur (?), historique des décisions (?) ; ou **Newsfeed** : 3 actualités avec extrait | 15 à 20 | 1 col. : 1x2, liste sans graphique | Oui |
| **3x2** | Bloc horizontal | 572 x 376 | Analyse d'un sujet | **Grade** : `ds-grade` + libellé, date, delta, graphique 8 mois (`MONTHS`, Y inversé), 4 derniers changements : date, de / vers, motif (?) ; Score « 82 / 100 » | 25 à 30 | 2 col. : 2x2, graphique + dernier changement ; 1 col. : 1x2 | Oui (6 cellules : limite conseillée) |
| **2x3** | Bloc vertical | 376 x 572 | Tableau étroit | **Financials** : turnover « 123 900 000 », pre-tax profit « 18 000 », cashflow « 22 000 » et 3 à 5 autres agrégats (?) sur 3 exercices en colonnes tabulaires, une sparkline par ligne | 25 à 30 | 1 col. : 1x3, dernier exercice seul + delta | Oui (6 cellules) |
| **4x2** | Bloc horizontal | 768 x 376 | Tableau large | **Exposure by policy** : 6 polices : n° de police (?), encours, part du total en barre, limite (?), statut ; total en pied | 35 à 45 | 2 col. : 2x2, top 3 polices + « + 3 more » ; 1 col. : 1x2 | Déconseillé (8 cellules) |
| **3x3** | Grand carré | 572 x 572 | Analyse complète | **Exposure** étendue : 4 chiffres clés + graphique + barre empilée par police jusqu'à 5 segments, lignes au-delà (règle « Card d'exposition ») | 40 à 50 | 2 col. : 2x3, sans barre empilée ; 1 col. : 1x3 | Déconseillé (9 cellules) |
| **4x3** | Grand bloc | 768 x 572 | Dossier | **Payment experience** (?) : tableau mensuel 12 lignes (payé, en retard, montant) + graphique ; une seule par board | 50 à 60 | 2 col. : 2x3 ; 1 col. : 1x3 | Déconseillé (12 cellules) |

Au-delà (2x4, 3x4, 4x4) : non proposés ; au-dessus de 12 cellules, une card devient une page et doit s'ouvrir dans un
drawer ou une vue dédiée (principe « One view, one job »).

### 3.3 Contenu responsif par card

- Chaque cellule porte `container-type: size` et `container-name: card`. C'est permis parce que la taille de la cellule
  vient de la grille et pas du contenu (MDN : la containment de taille l'exige).
- Neuf niveaux, combinaison de 3 classes de largeur et 3 classes de hauteur (seuils indicatifs, à caler) :

| | Courte (< 300 px, 1 ligne) | Moyenne (300 à 620 px, 2 ou 3 lignes) | Haute (> 620 px, 4 lignes) |
|---|---|---|---|
| **Étroite** (< 300 px, 1 col.) | Titre, valeur clé + delta, 1 micro-viz, 1 ou 2 faits | Valeur clé, puis liste de 5 à 12 lignes | Chronologie de 8 à 10 entrées |
| **Moyenne** (300 à 620 px, 2 ou 3 col.) | Deux zones : valeur clé à gauche, explication ou barre à droite | Valeur clé + graphique avec axes, ou tableau de 4 à 6 lignes | Tableau de 8 à 12 lignes |
| **Large** (> 620 px, 4 col. et plus) | Rangée de 4 à 6 indicateurs avec micro-viz | Chiffres clés + graphique annoté + détail | Dossier : chiffres, graphique, tableau |

- Règles reprises des références :
  - **ajouter des couches, jamais agrandir** (Apple HIG) : passée en 3x2, une card ne montre pas un chiffre plus gros, elle montre l'historique ;
  - **masquer avant de serrer** (Grafana) : sous le seuil, la sparkline disparaît plutôt que de rétrécir ; une liste montre « + 4 more » plutôt qu'une police plus petite ;
  - **la valeur de repli est la plus petite** (Polaris) : les styles de base décrivent le niveau étroit et court, les requêtes ajoutent ;
  - le **titre** ne passe jamais sur deux lignes (règle des libellés de champ de CLAUDE.md) : il est court par construction ;
  - en 1x1 (148 px utiles), une valeur de plus de 9 caractères ne tient pas en 24 px : elle s'affiche en unité abrégée et sa valeur exacte reste dans le libellé accessible et au survol (question 7).

### 3.4 Densité lisible (critère principal)

**Règle de base : une card = une question métier.** Le titre est la question, le contenu y répond. Groupes repris du
benchmark du 06/10 : Our exposure, Financial strength, Payment behaviour, Risk rating, plus Activity (tâches,
actualités, notes). Si une card répond à deux questions, on en fait deux.

| Technique | Règle Qirin | Source |
|---|---|---|
| Hiérarchie typographique | 3 niveaux par card au plus : **valeur clé** `title-size-m` 24 px semi-bold (1x1 à 3x1), `title-size-l` 28 px dans les blocs ; **données** `text-style-size-m` 14 px ; **libellés et unités** `text-style-size-s` 12 px semi-bold, texte secondaire. Jamais de `display` dans une card. | DESIGN.md (Compact-Default Rule) ; Grafana (tailles séparées titre / valeur / variation) |
| Chiffres tabulaires | `font-variant-numeric: tabular-nums` sur toute valeur, colonnes de chiffres alignées à droite. Déjà utilisé dans `coverbook.page.scss`. Allianz Neo doit porter `tnum` (question 8). | MDN `font-variant-numeric` |
| Le chiffre n'est jamais seul | Toute valeur clé porte un contexte : période, cible ou limite, variation. C'est la parade au « chiffre héros » de PRODUCT.md. | Power BI reference labels ; Datadog change indicator |
| Delta | Flèche (`ds-icon`) + valeur signée + période en texte (« +1 vs Sep 23 »). Couleur fonctionnelle seulement si le sens est défini pour la métrique : une hausse d'exposition n'est ni bonne ni mauvaise en soi. | Grafana (couleur inversable) ; Datadog (sens réglable) ; PRODUCT.md (jamais la couleur seule) |
| Sparkline | Hauteur d'une à deux lignes de texte, sans axe, dernière valeur marquée et reliée à son chiffre, bande grise de normalité si un seuil existe. | Tufte |
| Bullet graph | Pour « utilisé contre accordé » (limite, couverture, exposition contre plus haute limite) : barre de la mesure, trait du comparatif, 2 ou 3 plages en gris de la rampe via les tokens de fond existants. Remplace jauges et anneaux. | Few |
| Barre empilée | Répartition d'un total (exposition par police, retards par tranche) : 5 segments au plus, lignes au-delà. | Règle déjà figée pour la card d'exposition |
| Grille interne | Colonnes de valeurs alignées (`ds-properties-panel`, columns 1 à 4) ; mêmes positions de légende et d'axes sur toutes les cards. | Carbon Dashboards |
| Espacement serré mais rythmé | `spacing-xs` (4) entre libellé et valeur, `spacing-s` (8) entre lignes d'un groupe, `spacing-m` (16) entre groupes ; padding `spacing-m` en largeur étroite, `spacing-l` au-delà. | Apple HIG (16 pt, 11 pt pour des groupes serrés) ; tokens existants |
| Couleur parcimonieuse | Encre et gris pour la structure ; bleu d'action seulement sur ce qui se clique ; couleurs fonctionnelles seulement sur un statut avec libellé ; une couleur constante par série d'une card à l'autre. | DESIGN.md (One Blue, Status-Earns-Its-Color) ; Carbon |
| Rien de décoratif | Pas d'icône d'illustration en tête de card, pas d'eyebrow en capitales, pas de fond coloré hors highlight, pas d'ombre au repos, pas de dégradé. | PRODUCT.md, anti-références |

Budget d'un 1x1 à 1280 px (calcul, à vérifier en maquette) : 180 px moins 2 x 16 px de padding = 148 x 148 px utiles :
titre 20, espace 8, valeur 28, contexte 16, espace 8, micro-viz 32, reste 36 pour une ligne de deux faits en 12 px.
Soit 4 à 5 valeurs. À 1920 px (colonnes de 211 px), le même carré gagne 31 px dans chaque sens et peut afficher la
ligne de faits complète.

### 3.5 Highlight

| Question | Proposition | Justification |
|---|---|---|
| Quand | Choix explicite de l'analyste (« Highlight this card » dans le menu de la card). Jamais automatique sur un statut : un statut a déjà son badge. | Status-Earns-Its-Color (DESIGN.md). Power BI colore par règle, mais chez nous ce serait une couleur de statut. |
| Combien | **Une par board.** En choisir une autre retire la précédente (choix unique). | Ramp, Mercury : l'emphase ne vaut que si elle est rare. |
| Sur quels formats | Tous techniquement ; conseillé jusqu'à 6 cellules (1x1 à 3x2 / 2x3). Au-delà, la masse marine écrase le board. | Carbon : la plus grande surface attire déjà l'œil ; ajouter la couleur sur un grand format double l'effet. |
| Couleur retenue | Marine `static-background-brand` (voir 3.2) : 11,27:1 et 7,98:1. | Calculs WCAG |
| Couleurs écartées | Teinte `static-background-main-alt-primary` (blue-a-025, déjà `ds-card tone="subtle"`) : **1,02:1** contre la page, texte tertiaire grey-500 à 4,25:1 et lien blue-a-500 à 4,44:1, tous deux sous 4,5:1. `main-alt-secondary` (blue-a-050) : 1,13:1 contre la page, tertiaire 3,68:1, lien 3,83:1. Encre `static-background-accent-primary` (grey-900) : 18,73:1 mais c'est le fond du bouton `strong-alt`, la card se lirait comme un bouton. Fonds fonctionnels : réservés au statut. | Calculs WCAG ; DESIGN.md |
| Ce qui change dans la card | Graphiques en tonalité reversed (à ajouter à `ds-chart`, question 11) ; badges : leurs variantes ont leur propre fond, à contrôler une à une ; bouton icône : variante reversed à contrôler. | WCAG 1.4.11 (3:1 pour un élément graphique porteur de sens) |
| Jamais la couleur seule | Le highlight porte un sens (« prioritaire pour moi ») : icône `star-filled` à côté du titre, libellé accessible « Highlighted ». | PRODUCT.md, Apple HIG |
| Risque | Le marine est la couleur d'identité (header) : la card peut se lire comme « sélectionnée ». À tester (question 3). | One Blue Rule |

### 3.6 États

| État | Comportement |
|---|---|
| Chargement | `ds-skeleton-item` qui reproduit la structure du niveau courant (en-tête, valeur, micro-viz) ; `ds-card` `loading` pour `aria-busy`. Taille fixe : aucun saut à l'arrivée des données. |
| Vide (pas de donnée) | Phrase datée qui dit ce qui est vide (« No overdue recorded as of 11 Nov 2024 »), en 14 px, sans illustration. Une absence d'impayé est une information : la card reste à sa place. |
| Partiel ou ancien | `ds-badge` warning « Outdated » + date de la donnée dans l'en-tête ; la valeur reste lisible. |
| Erreur | `ds-functional-notice` dans la card, « Retry » en `ds-button` plain ; la card garde son format et sa place. |
| Édition | Place fantôme « Add a card here » aux dimensions du trou ; poignée et menu visibles (section 5). |

### 3.7 Rythme, coins, élévation

- **Gouttière** `spacing-m` partout ; **marge du board** `spacing-xl` (comme la V1) ; aucun espacement hors tokens Semantic.
- **Coins** : `--semantic-border-radius-s` (4 px), comme `ds-card` et DESIGN.md. Les bentos mesurés vont de 6 px (Vercel) à 12 px (Linear) ; passer à `radius-m` (8 px) serait une décision de design system, pas de page (question 5).
- **Élévation** : plate au repos, bordure `static-border-subtle-tertiary` ; ombre seulement sur la card soulevée pendant le glissement (`--semantic-shadow-popover`), règle Flat-At-Rest.
- **Composants** : `ds-card` (`noPadding` quand le niveau gère son padding), `ds-widget-card` pour l'en-tête, `ds-properties-panel`, `ds-chart`, `ds-grade`, `ds-badge`, `ds-list-widget`, `ds-newsfeed`, `ds-skeleton-item`, `ds-functional-notice`. Pas de `<button>` ni de `<svg>` natifs dans les cards.

---

## 4. Points de rupture

Hypothèse : board = fenêtre moins la side-nav (56 px repliée, 280 px dépliée) moins 2 x 32 px de marge. Colonnes
de 172 px minimum, gouttière 16 px, nombres pairs. Seuils de **largeur du board** : 2 colonnes à partir de 360 px,
4 à partir de 736, 6 à partir de 1112, 8 à partir de 1488, 12 à partir de 2240 ; une colonne en dessous de 360.

| Fenêtre | Board, nav repliée | Colonnes (unité carrée) | Board, nav dépliée | Colonnes (unité carrée) |
|---|---|---|---|---|
| 1024 | 904 | 4 (214 px) | 680 | 2 (332 px) |
| 1280 | 1160 | **6 (180 px)** | 936 | 4 (222 px) |
| 1440 | 1320 | 6 (207 px) | 1096 | 4 (262 px) |
| 1680 | 1560 | 8 (181 px) | 1336 | 6 (209 px) |
| 1920 | 1800 | **8 (211 px)** | 1576 | 8 (183 px) |
| 2560 | 2440 | 12 (189 px) | 2216 | 8 (263 px) |

Drawer ouvert : le board perd 388 px (à 1280 px, nav repliée : 772 px, donc 4 colonnes de 181 px) ; la grille se
recompose en direct, animée (section 5).

Ce que devient chaque format :

| Format | 12, 8 ou 6 col. | 4 col. | 2 col. | 1 col. (< 360 px) |
|---|---|---|---|---|
| 1x1, 1x2, 1x3, 1x4 | inchangé | inchangé | inchangé | inchangé |
| 2x1, 2x2, 2x3 | inchangé | inchangé | inchangé | 1x1, 1x2, 1x3 |
| 3x1, 3x2, 3x3 | inchangé | inchangé | 2x1, 2x2, 2x3 | 1x1, 1x2, 1x3 |
| 4x1, 4x2, 4x3 | inchangé | inchangé (toute la largeur) | 2x1, 2x2, 2x3 | 1x1, 1x2, 1x3 |
| Pleine largeur | n x 1 | 4x1 | 2x1 | 1x1 |

Sous 1024 px : la même règle s'applique jusqu'à une colonne, cards empilées dans l'ordre de lecture. Qirin est un outil
de bureau : on garantit la lisibilité, pas une expérience mobile optimisée.

Exemple de repli, board de la direction A à 1024 px, nav repliée (4 colonnes) :
```
+-----------------------------+---------+
| Grade ★                     | Limit   |
| 3x2 marine                  | 1x1     |
|                             +---------+
|                             | Overdues|
|                             | 1x2     |
+-----------------------------+         |
| Exposure                    |         |
| 3x1                         |         |
+-------------------+---------+---------+
| Payment history   | Financials        |
| 2x1               | 2x3               |
+---------+---------+                   |
| Jobs to | Score   |                   |
| 1x3     | 1x1     |                   |
|         +---------+                   |
|         | Risk fig|                   |
|         | 1x1     |                   |
|         +---------+---------+---------+
|         | Newsfeed          | Notepad |
|         | 2x2               | 1x1     |
+---------+                   +---------+
| libre...|                   | libre...|
|.........|                   |.........|
+---------+-------------------+---------+
| Exposure by policy                    |
| 4x2                                   |
|                                       |
|                                       |
|                                       |
+-------------------+---------+---------+
| Coverage          | libre...| libre...|
| 2x2               |.........|.........|
|                   +---------+---------+
|                   | libre...| libre...|
|                   |.........|.........|
+-------------------+---------+---------+
| Risk at a glance                      |
| 4x1                                   |
+---------------------------------------+
(13 lignes, 6 cellule(s) libre(s))
```

---

## 5. Réorganisation et mouvement

Sources de cette section (ouvertes le 20/11/2026, URL complètes en fin de section) : aide Apple iPhone (déplacer apps
et widgets ; ajouter et modifier des widgets) et iPad (Stage Manager), aide Android et doc développeur App Widgets,
dépôts GitHub react-grid-layout, gridstack.js, swapy, muuri, `package.json` de grafana/scenes, doc dnd-kit (sortable,
accessibilité), Atlassian Pragmatic drag and drop (design et accessibilité), MDN View Transition API et
`view-transition-name`, Chrome « same-document view transitions », Paul Lewis « FLIP your animations », angular.dev
drag-drop et release 18.1.0 d'angular/components, WCAG 2.2 Understanding 2.5.7 et 2.5.8, MDN live regions et
`prefers-reduced-motion`, Material Motion (doc material-components-android), Apple HIG Motion, IBM Carbon Motion,
NN/g « animation duration », web.dev (animations guide, compositor-only properties).
Notion, Framer et le geste exact de redimensionnement de Stage Manager n'ont pas pu être vérifiés.

### 5.1 Ce que font les références

| Moment | iOS / iPadOS | Android | Outils web | Ce qu'on retient |
|---|---|---|---|---|
| Entrer en édition | Appui long sur le fond « until the items begin to jiggle » ; Edit puis Done pour les widgets | Appui long sur le widget | Atlassian : poignée visible ; react-grid-layout : `isDraggable` par item | **Mode édition explicite** (« Edit board ») signalé sans tremblement : poignée et menu apparaissent en fondu de 150 ms |
| Saisir | Appui long | Appui long puis glisser | Poignée (Atlassian) ou toute la card | Souris : toute la card en mode édition, poignée `drag-handle` visible ; tactile : appui long |
| Suivre le pointeur | La tuile suit le doigt | « Slide the item » | CDK `.cdk-drag-preview` ; Atlassian : aperçu de 3 informations au plus, moins de 280 x 280 px | La card suit en `transform`, soulevée (ombre `popover`) ; au-delà de 2x2, l'aperçu se réduit à son en-tête |
| Les autres s'écartent | Les icônes se poussent (constaté, non écrit dans l'aide : non vérifié) | Non documenté | react-grid-layout : « compact items upward » ; Muuri : layout animé par Web Animations | Le moteur recalcule le placement avec la place fantôme, les voisines glissent en **FLIP** |
| Aperçu de la place | Implicite | Implicite | CDK `.cdk-drag-placeholder` ; Atlassian : ligne d'insertion | **Place fantôme** aux dimensions du format, bordure pointillée `static-border-main-tertiary` |
| Redimensionner | Taille choisie dans une liste, pas de poignée | Points sur les bords, bornés par `minResizeWidth/Height` et `maxResizeWidth/Height` | Grafana : coin inférieur droit ; react-grid-layout : poignée `se` par défaut | **Choix parmi les 14 formats** dans le menu (vignettes groupées : Carré, Horizontal, Vertical, Bloc) + poignée de coin qui ne s'arrête que sur ces formats ; un format qui ferait perdre du contenu est désactivé avec sa raison |
| Déposer | La tuile se pose | | Atlassian : fond qui « should flash » pendant 700 ms | Atterrissage en FLIP, puis fond `static-background-main-alt-primary` qui s'efface en 700 ms |
| Annuler | Pas de geste documenté | | dnd-kit : Échap | Échap pendant le glissement : retour animé ; « Revert » dans la barre d'édition ; « Done » enregistre |
| Clavier et lecteur d'écran | | | dnd-kit : Espace ou Entrée pour saisir, flèches, Échap ; annonces `onDragStart/Over/End/Cancel` dans une live region | Même schéma, en positions et non en pixels (5.3) |

### 5.2 Durées, courbes et coût

| Mouvement | Durée | Courbe | Source |
|---|---|---|---|
| Poignées qui apparaissent en édition | 150 ms | `cubic-bezier(0.2, 0, 0, 1)` (Material standard) | Material short3 = 150 ms ; Carbon moderate-01 = 150 ms |
| Card soulevée | 100 à 150 ms | standard decelerate `(0, 0, 0, 1)` | NN/g : retour simple autour de 100 ms |
| Voisines qui s'écartent | 200 à 250 ms | `(0.2, 0, 0, 1)` | Material short4 / medium1 = 200 / 250 ms ; Carbon moderate-02 = 240 ms ; exemple angular.dev : `transform 250ms cubic-bezier(0, 0, 0.2, 1)` |
| Atterrissage, changement de format | 250 à 300 ms | emphasized decelerate `(0.05, 0.7, 0.1, 1)` | Material medium1-2 ; NN/g : 200 à 300 ms pour un changement notable |
| Recomposition au changement de colonnes | 300 ms au plus | `(0.2, 0, 0, 1)` | NN/g : jusqu'à 400 ms pour de grands déplacements ; « At 500ms, animations start to feel like a real drag » |
| Flash après dépôt | 700 ms (fondu) | linéaire | Atlassian |
| Rebond | Facultatif, très léger : dépassement de quelques pixels à l'atterrissage seulement, jamais pendant le glissement. Une courbe à dépassement existe déjà dans le code : `cubic-bezier(0.34, 1.4, 0.5, 1)`. | | Demande utilisateur ; DESIGN.md (micro-interactions retenues) ; Apple HIG : « Aim for brevity and precision in feedback animations » |

- **Coût** : n'animer que `transform` et `opacity`, les deux propriétés gérées par le compositeur (web.dev) ; `will-change`
  seulement sur la card portée (« sparingly ») ; mesurer toutes les positions en un passage (FLIP : « First, Last,
  Invert, Play » ; Paul Lewis note une fenêtre d'environ 100 ms après l'action pour faire ces calculs sans que ça se
  voie). Un board compte 10 à 25 cards : coût faible tant que la cible est calculée sur le modèle et pas en relisant le
  DOM à chaque `pointermove`.
- **Reduced motion** : sous `prefers-reduced-motion: reduce`, ni translation ni soulèvement ; les cards changent de place
  sans animation ou en fondu de 100 à 150 ms ; place fantôme et annonces restent. Chrome : « reduced motion doesn't
  mean the user wants no motion ».
- **Tokens** : aucun token de durée ni de courbe dans `_semantic.scss`, et six courbes différentes sont écrites en dur
  dans `shared/ui`. Créer `--semantic-motion-*` serait une décision de design system (question 9).

### 5.3 Accessibilité

- **WCAG 2.5.7** : tout glisser doit pouvoir se faire « by a single pointer without dragging », et « achieving keyboard
  equivalence ... does not automatically meet this success criterion ». Menu de chaque card en édition : Move before,
  Move after, Move to start, Move to end, Format, Highlight, Remove.
- **WCAG 2.5.8** : cibles d'au moins 24 x 24 px (poignée, menu, coin de redimensionnement).
- **Clavier** (schéma dnd-kit) : focus sur une card en édition, Espace ou Entrée pour la saisir, flèches gauche / droite
  pour changer de position dans l'ordre de lecture, haut / bas pour changer de ligne, Espace pour déposer, Échap pour
  annuler ; Alt + flèches pour passer au format voisin (plus large, plus haut).
- **Annonces** : une région `role="status"` (polite) présente dès le chargement (MDN : « include them in the initial
  markup ») : « Grade picked up. Position 1 of 14, row 1, columns 1 to 3. », puis « Grade dropped at position 4. » ;
  le focus reste sur la card déplacée (Atlassian : rendre le focus au déclencheur).

### 5.4 Options techniques pour Angular 19

| Option | Pour | Contre | Verdict |
|---|---|---|---|
| CDK drag-drop (`cdkDropList`) | Officiel, tactile, classes preview / placeholder | Sans `mixed`, la liste « works only in one direction » ; en `mixed` (depuis 18.1.0) « the list can no longer animate the sorting action » ; rien sur les tailles variées ni la 2D ; clavier non documenté | Écarté pour le tri ; `cdkDrag` seul pourrait capter le geste, mais on lutterait contre son modèle de liste (avis) |
| Gridstack.js | « no external dependencies », wrapper Angular fourni, glisser + redimensionner + collisions | Environ 70k annoncés dans le README ; styles et DOM à lui, hors tokens ; clavier et ARIA non documentés | Rapide pour une démo, coûteux pour le design system et l'a11y |
| react-grid-layout, dnd-kit | Modèles de comportement (compactage, annonces, clavier) | React | À imiter, pas à installer |
| Muuri | Bin packing animé, glisser entre grilles | Dernière version citée 0.9.5, maintenance incertaine | Écarté |
| Swapy | Agnostique du framework | Échange de deux éléments, pas de recomposition | Écarté |
| View Transitions API | Une ligne pour animer un changement de layout ; `view-transition-name` unique par card ; Baseline depuis octobre 2025 | « the page is frozen » pendant le callback : inadapté au suivi continu du pointeur | Pour les changements **discrets** : dépôt, format, ajout / retrait, changement de colonnes, changement de board |
| **Pointer events + modèle en signals + FLIP maison** | Contrôle total de la grille, de l'a11y et des tokens ; aucune dépendance | Moteur de placement, cible et FLIP à écrire et tester | **Recommandé** (avis) |

Architecture recommandée, sans code : un `signal` porte la liste ordonnée `{ widgetType, format, highlight }` ; un
`computed` en déduit les positions pour le nombre de colonnes courant (premier emplacement libre, voisin de
`boardRowCount()` en V1 et de l'algorithme qui a produit les schémas de la section 6) ; un `ResizeObserver` sur le
board fournit le nombre de colonnes ; une directive FLIP anime les cards quand leurs positions changent ; pendant le
glissement, la cible est calculée sur le modèle (cellule sous le centre de la card portée, avec une petite hystérésis
pour éviter les oscillations) ; au dépôt et pour les changements discrets, `document.startViewTransition` quand il
existe, FLIP sinon.

URL de la section : https://support.apple.com/guide/iphone/move-apps-and-widgets-on-the-home-screen-iphd2fc8ce30/ios ,
https://support.apple.com/guide/iphone/add-edit-and-remove-widgets-iphb8f1bf206/ios ,
https://support.apple.com/guide/ipad/resize-windows-ipad1240f36f/ipados , https://support.google.com/android/answer/9450271 ,
https://developer.android.com/develop/ui/views/appwidgets/layouts , https://github.com/react-grid-layout/react-grid-layout ,
https://github.com/gridstack/gridstack.js , https://github.com/TahaSh/swapy , https://github.com/haltu/muuri ,
https://raw.githubusercontent.com/grafana/scenes/main/packages/scenes/package.json , https://dndkit.com/presets/sortable ,
https://dndkit.com/guides/accessibility , https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines ,
https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines ,
https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API ,
https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name ,
https://developer.chrome.com/docs/web-platform/view-transitions/same-document , https://aerotwist.com/blog/flip-your-animations/ ,
https://angular.dev/guide/drag-drop , https://github.com/angular/components/releases/tag/18.1.0 ,
https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html ,
https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ,
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions ,
https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion ,
https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Motion.md ,
https://developer.apple.com/design/human-interface-guidelines/motion , https://carbondesignsystem.com/elements/motion/overview/ ,
https://www.nngroup.com/articles/animation-duration/ , https://web.dev/articles/animations-guide ,
https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count

---

## 6. Trois directions pour la V2

Les schémas sont **générés** par l'algorithme de placement proposé (premier emplacement libre dans l'ordre de la liste,
largeur bornée au nombre de colonnes), pas dessinés à la main : les trous montrés (« libre ») sont réels. Chaque case
de schéma est une colonne ; « marine » signale la card highlight. 1280 px = 6 colonnes, 1920 px = 8 colonnes (nav repliée).

### Direction A : « Mosaïque ordonnée »

**Idée.** Une seule grille bento. L'analyste ordonne une liste, le moteur la pose sur 2 à 12 colonnes. Quatorze formats,
neuf niveaux de contenu, un highlight. La réorganisation façon iOS s'applique à toute la grille.

Board d'exemple, dans l'ordre : Grade 3x2 (highlight), Exposure 3x1, Limit 1x1, Payment history 2x1, Overdues 1x2,
Financials 2x3, Jobs to do 1x3, Newsfeed 2x2, Score 1x1, Risk figures 1x1, Notepad 1x1, Exposure by policy 4x2,
Coverage 2x2, Risk at a glance pleine largeur.

1280 px (6 colonnes) :
```
+-----------------------------+-----------------------------+
| Grade ★                     | Exposure                    |
| 3x2 marine                  | 3x1                         |
|                             +---------+-------------------+
|                             | Limit   | Payment history   |
|                             | 1x1     | 2x1               |
+---------+-------------------+---------+-------------------+
| Overdues| Financials        | Jobs to | Newsfeed          |
| 1x2     | 2x3               | 1x3     | 2x2               |
|         |                   |         |                   |
|         |                   |         |                   |
|         |                   |         |                   |
+---------+                   |         +---------+---------+
| Score   |                   |         | Risk fig| Notepad |
| 1x1     |                   |         | 1x1     | 1x1     |
+---------+-------------------+---------+---------+---------+
| Exposure by policy                    | Coverage          |
| 4x2                                   | 2x2               |
|                                       |                   |
|                                       |                   |
|                                       |                   |
+---------------------------------------+-------------------+
| Risk at a glance                                          |
| 6x1                                                       |
+-----------------------------------------------------------+
(8 lignes, 0 cellule(s) libre(s))
```

1920 px (8 colonnes) :
```
+-----------------------------+-----------------------------+---------+---------+
| Grade ★                     | Exposure                    | Limit   | Overdues|
| 3x2 marine                  | 3x1                         | 1x1     | 1x2     |
|                             +-------------------+---------+---------+         |
|                             | Payment history   | Financials        |         |
|                             | 2x1               | 2x3               |         |
+---------+-------------------+---------+---------+                   +---------+
| Jobs to | Newsfeed          | Score   | Risk fig|                   | Notepad |
| 1x3     | 2x2               | 1x1     | 1x1     |                   | 1x1     |
|         |                   +---------+---------+                   +---------+
|         |                   | libre...| libre...|                   | libre...|
|         |                   |.........|.........|                   |.........|
|         +-------------------+---------+---------+-------------------+---------+
|         | Exposure by policy                    | Coverage          | libre...|
|         | 4x2                                   | 2x2               |.........|
+---------+                                       |                   +---------+
| libre...|                                       |                   | libre...|
|.........|                                       |                   |.........|
+---------+---------------------------------------+-------------------+---------+
| Risk at a glance                                                              |
| 8x1                                                                           |
+-------------------------------------------------------------------------------+
(7 lignes, 6 cellule(s) libre(s))
```

- **Forces** : un seul modèle mental (la liste, comme l'écran d'accueil iOS) ; robuste à toutes les largeurs sans layout
  par point de rupture ; lecture clavier = lecture visuelle ; la plus simple à construire et à tester ; mélange naturel
  de carrés, bandeaux, colonnes et blocs.
- **Risques** : un board composé à 6 colonnes laisse des trous à 8 (6 cellules ici) : on les montre en édition, avec
  « Add a card here » ; un board très long peut redevenir une « grille infinie » si tout est en 1x1.
- **Mouvement** : réorganisation iOS sur toute la grille ; changements de colonnes animés.

### Direction B : « Rangées thématiques »

**Idée.** Le board est une suite de sections titrées par question métier (Risk rating, Our exposure, Payment &
financials, Activity). Chaque section est une sous-grille (`subgrid`) alignée sur les mêmes colonnes ; on réordonne et
on replie les sections. Équivalent des groupes Datadog et des rows Grafana. Mêmes cards que A, réparties par section.

1280 px (6 colonnes) :
```
Risk rating --------------------------------------------- [v]
+-----------------------------+---------+---------+---------+
| Grade ★                     | Score   | Risk fig| libre...|
| 3x2 marine                  | 1x1     | 1x1     |.........|
|                             +---------+---------+---------+
|                             | Payment history   | libre...|
|                             | 2x1               |.........|
+-----------------------------+-------------------+---------+
Our exposure -------------------------------------------- [v]
+-----------------------------+---------+-------------------+
| Exposure                    | Limit   | Coverage          |
| 3x1                         | 1x1     | 2x2               |
+-----------------------------+---------+                   |
| Exposure by policy                    |                   |
| 4x2                                   |                   |
|                                       +---------+---------+
|                                       | libre...| libre...|
|                                       |.........|.........|
+---------------------------------------+---------+---------+
Payment & financials ------------------------------------ [v]
+-------------------+---------+-----------------------------+
| Financials        | Overdues| Risk at a glance            |
| 2x3               | 1x2     | 3x1                         |
|                   |         +---------+---------+---------+
|                   |         | libre...| libre...| libre...|
|                   |         |.........|.........|.........|
|                   +---------+---------+---------+---------+
|                   | libre...| libre...| libre...| libre...|
|                   |.........|.........|.........|.........|
+-------------------+---------+---------+---------+---------+
Activity ------------------------------------------------ [v]
+---------+-------------------+---------+---------+---------+
| Jobs to | Newsfeed          | Notepad | libre...| libre...|
| 1x3     | 2x2               | 1x1     |.........|.........|
|         |                   +---------+---------+---------+
|         |                   | libre...| libre...| libre...|
|         |                   |.........|.........|.........|
|         +---------+---------+---------+---------+---------+
|         | libre...| libre...| libre...| libre...| libre...|
|         |.........|.........|.........|.........|.........|
+---------+---------+---------+---------+---------+---------+
(21 cellule(s) libre(s))
```

1920 px (8 colonnes) :
```
Risk rating ----------------------------------------------------------------- [v]
+-----------------------------+---------+---------+-------------------+---------+
| Grade ★                     | Score   | Risk fig| Payment history   | libre...|
| 3x2 marine                  | 1x1     | 1x1     | 2x1               |.........|
|                             +---------+---------+---------+---------+---------+
|                             | libre...| libre...| libre...| libre...| libre...|
|                             |.........|.........|.........|.........|.........|
+-----------------------------+---------+---------+---------+---------+---------+
Our exposure ---------------------------------------------------------------- [v]
+-----------------------------+---------+-------------------+---------+---------+
| Exposure                    | Limit   | Coverage          | libre...| libre...|
| 3x1                         | 1x1     | 2x2               |.........|.........|
+-----------------------------+---------+                   +---------+---------+
| Exposure by policy                    |                   | libre...| libre...|
| 4x2                                   |                   |.........|.........|
|                                       +---------+---------+---------+---------+
|                                       | libre...| libre...| libre...| libre...|
|                                       |.........|.........|.........|.........|
+---------------------------------------+---------+---------+---------+---------+
Payment & financials -------------------------------------------------------- [v]
+-------------------+---------+-----------------------------+---------+---------+
| Financials        | Overdues| Risk at a glance            | libre...| libre...|
| 2x3               | 1x2     | 3x1                         |.........|.........|
|                   |         +---------+---------+---------+---------+---------+
|                   |         | libre...| libre...| libre...| libre...| libre...|
|                   |         |.........|.........|.........|.........|.........|
|                   +---------+---------+---------+---------+---------+---------+
|                   | libre...| libre...| libre...| libre...| libre...| libre...|
|                   |.........|.........|.........|.........|.........|.........|
+-------------------+---------+---------+---------+---------+---------+---------+
Activity -------------------------------------------------------------------- [v]
+---------+-------------------+---------+---------+---------+---------+---------+
| Jobs to | Newsfeed          | Notepad | libre...| libre...| libre...| libre...|
| 1x3     | 2x2               | 1x1     |.........|.........|.........|.........|
|         |                   +---------+---------+---------+---------+---------+
|         |                   | libre...| libre...| libre...| libre...| libre...|
|         |                   |.........|.........|.........|.........|.........|
|         +---------+---------+---------+---------+---------+---------+---------+
|         | libre...| libre...| libre...| libre...| libre...| libre...| libre...|
|         |.........|.........|.........|.........|.........|.........|.........|
+---------+---------+---------+---------+---------+---------+---------+---------+
(43 cellule(s) libre(s))
```

- **Forces** : repères forts pour un dossier long ; une section se replie d'un geste ; correspond aux groupes métier
  validés le 06/10.
- **Risques** : chaque section termine sa rangée, d'où **21 cellules libres à 1280 et 43 à 1920** pour les mêmes cards
  que A : la densité, critère principal, en souffre ; titres de section à ne pas transformer en eyebrows
  (`title-size-s`, casse normale) ; glisser entre sections plus complexe (deux niveaux de tri) ; structure imposée à des
  analystes qui veulent « leur » board.

### Direction C : « Rail de décision + mosaïque »

**Idée.** Une colonne fixe à gauche, collante au défilement, porte les quatre indicateurs lus sur tout buyer (Grade,
Exposure, Limit, Overdues) en 1x1 ; la mosaïque libre occupe le reste et se réorganise. Le highlight vit dans la
mosaïque (ici Exposure by policy 3x2).

1280 px (1 + 5 colonnes) :
```
+---------+-----------------------------+-------------------+
| Grade   | Exposure by policy ★        | Payment history   |
| 1x1     | 3x2 marine                  | 2x1               |
+---------+                             +---------+---------+
| Exposure|                             | Score   | Risk fig|
| 1x1     |                             | 1x1     | 1x1     |
+---------+-------------------+---------+---------+---------+
| Limit   | Financials        | Jobs to | Newsfeed          |
| 1x1     | 2x3               | 1x3     | 2x2               |
+---------+                   |         |                   |
| Overdues|                   |         |                   |
| 1x1     |                   |         |                   |
+---------+                   |         +-------------------+
|         |                   |         | Coverage          |
|         |                   |         | 2x2               |
+---------+---------+---------+---------+                   |
|         | Notepad | libre...| libre...|                   |
|         | 1x1     |.........|.........|                   |
+---------+---------+---------+---------+-------------------+
|         | Risk at a glance                                |
|         | 5x1                                             |
+---------+-------------------------------------------------+
(rail collant en colonne 1 ; 2 cellule(s) libre(s) dans la mosaïque ; sous le rail, espace vide)
```

1920 px (1 + 7 colonnes) :
```
+---------+-----------------------------+-------------------+---------+---------+
| Grade   | Exposure by policy ★        | Payment history   | Score   | Risk fig|
| 1x1     | 3x2 marine                  | 2x1               | 1x1     | 1x1     |
+---------+                             +-------------------+---------+---------+
| Exposure|                             | Financials        | Jobs to | Notepad |
| 1x1     |                             | 2x3               | 1x3     | 1x1     |
+---------+-------------------+---------+                   |         +---------+
| Limit   | Newsfeed          | libre...|                   |         | libre...|
| 1x1     | 2x2               |.........|                   |         |.........|
+---------+                   +---------+                   |         +---------+
| Overdues|                   | libre...|                   |         | libre...|
| 1x1     |                   |.........|                   |         |.........|
+---------+-------------------+---------+---------+---------+---------+---------+
|         | Coverage          | libre...| libre...| libre...| libre...| libre...|
|         | 2x2               |.........|.........|.........|.........|.........|
+---------+                   +---------+---------+---------+---------+---------+
|         |                   | libre...| libre...| libre...| libre...| libre...|
|         |                   |.........|.........|.........|.........|.........|
+---------+-------------------+---------+---------+---------+---------+---------+
|         | Risk at a glance                                                    |
|         | 7x1                                                                 |
+---------+---------------------------------------------------------------------+
(rail collant en colonne 1 ; 14 cellule(s) libre(s) dans la mosaïque ; sous le rail, espace vide)
```

- **Forces** : l'essentiel reste visible quand on défile loin, ce qui compte maintenant que les lignes sont illimitées ;
  un board personnalisé ne peut pas « perdre » la décision.
- **Risques** : une colonne de moins pour la mosaïque, et 5 ou 7 colonnes impaires (2 cellules libres à 1280, 14 à
  1920) ; le rail peut faire doublon avec la topbox (hors périmètre, à vérifier) ; deux zones de tri différentes.

### Recommandation

**Direction A**, avec deux emprunts :
1. à B, le titre de chaque card formulé comme une question métier et le catalogue par groupes ; si les tests montrent
   que les analystes se perdent dans les boards longs, ajouter un format « séparateur titré » pleine largeur plutôt
   qu'une structure de sections imposée ;
2. à C, l'option à tester d'un rappel collant (grade, exposition) quand on défile loin, à arbitrer avec la topbox.

Pourquoi A : c'est la seule direction qui garde la densité (0 cellule libre à 1280 sur le board d'exemple) tout en
répondant aux autres demandes (lignes illimitées, quatorze formats, highlight, cards et grille responsives) avec un seul
modèle ; c'est aussi la plus proche du geste iOS demandé, et celle où l'ordre clavier et l'animation sont les plus
simples à garantir.

Ordre de réalisation proposé :
1. moteur de placement, container queries et niveaux de contenu de 4 cards (Grade, Exposure, Payment behaviour, Jobs) dans 4 formats chacune ;
2. highlight ;
3. mode édition, menu de déplacement et de format, clavier, annonces ;
4. glisser avec FLIP ;
5. View Transitions et reduced motion ;
6. le reste du catalogue et les trois boards par défaut.

---

## 7. Questions ouvertes

1. **Direction** : A (recommandée), B ou C ?
2. **Unité de ligne** : carrée (hauteur = largeur de colonne, recommandé) ou fixe à 208 px (2 x `size-tile`) ? Et la largeur minimale de colonne de 172 px : les seuils de container query ne peuvent pas lire un `var()`. Accepte-t-on ces constantes de layout dans la page, ou faut-il un token Semantic de layout (ce qui serait une création de token, contraire à la règle actuelle) ?
3. **Highlight** : marine `static-background-brand` (recommandé), au risque d'être lu comme « sélectionné » ou comme le header ? Autorise-t-on le highlight sur les formats de plus de 6 cellules et sur la pleine largeur ?
4. **Formats** : garde-t-on les quatorze, ou retire-t-on 4x3 et 3x3 du premier lot ?
5. **Coins** : rester à 4 px (`radius-s`, DESIGN.md) ou passer les cards du board à 8 px (`radius-m`) pour l'esprit bento ? Décision de design system.
6. **Trous** : les laisser visibles en lecture (proposé), ou permettre à l'analyste de composer un board par nombre de colonnes (6 et 8) pour les éviter ?
7. **Montants** : complets avec séparateurs (« 10 000 246 000 ») ou abrégés (« 10.0 bn ») dans les petits formats ? Un 1x1 ne loge pas plus de 9 caractères en 24 px.
8. **Allianz Neo** porte-t-elle les chiffres tabulaires (`tnum`) ? Sinon, alignement à droite seulement.
9. **Tokens de mouvement** : aucun aujourd'hui. En crée-t-on au niveau Foundation + Semantic (durées et courbes Material), ou garde-t-on des valeurs locales documentées pour le prototype ?
10. **Rebond à l'atterrissage** : léger dépassement, ou aucun ?
11. **`ds-chart` sur fond marine** : accepte-t-on d'ajouter une tonalité « reversed » au composant (variante, pas de nouveau token) ?
12. **Données** : les champs marqués (?) (motif de changement de grade, encours par police, impayés ouverts, exercices financiers, historique des décisions de couverture, expérience de paiement mensuelle) existent-ils dans les sources Qirin ?
13. **Boards par défaut** : refait-on les trois `DEFAULT_BOARDS` avec les nouveaux formats, et avec combien de cards ?
14. **Tactile** : faut-il l'appui long (tablettes), ou la souris et le clavier suffisent-ils ?
