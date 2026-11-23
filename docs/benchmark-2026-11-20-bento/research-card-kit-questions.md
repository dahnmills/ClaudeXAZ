# Recherche : 7 questions ouvertes du Card kit Bento (Buyer Summary V2)

Date : 23/11/2026. Livrable écrit seulement : aucune modification de code ni de Figma.
Entrées lues : `PRODUCT.md`, `DESIGN.md`, `benchmark-bento.md`, `benchmark-edit-flow.md`, `_figma-card-kit.md`,
`_figma-card-kit-brief.md`, mémoires `figma-masters-slots`, `figma-nested-props`, `visual-qa-lessons`,
`docs/figma/_audit-components-data-display.md`, `docs/components-status/components.json`,
`src/app/shared/ui/widget-card/`, `buyer-summary-v2.component.html` (statut calculé, raison en infobulle).

Méthode : chaque source marquée « vérifié » a été ouverte le 23/11/2026 (WebFetch). Les points marqués « connu » viennent
de la documentation publique sans revérification ce jour (page inaccessible ou rendue sans texte). Aucune source ne fixe
de seuil chiffré de densité : quand une règle est une décision Qirin, c'est dit.

---

## Synthèse

| # | Question | Recommandation |
|---|---|---|
| 1 | Raison d'un statut calculé | **Texte visible** pour tout statut Warning ou Problem, **obligatoire** sur les 2 cards à fond automatique ; l'infobulle n'est jamais le seul support. On track sans raison visible. |
| 2 | Sparkline et repère du Bullet graph | **Ni variantes de forme, ni Chart piloté par données en Figma** : atome à slot `Plot` (tracé local, style du maître) en Figma ; composants **pilotés par données** en code (`ds-sparkline`, `ds-bullet-graph`). |
| 3 | Libellé de groupe | **Oui** : atome `Group heading`, 12 px semi-bold, texte secondaire, casse de phrase, une ligne, `h4` en code, seulement à partir de 2 groupes. |
| 4 | Liseré de 4 px | **Le retirer.** Teinte de fond + bord complet de 1 px dans le ton + `.Status` (icône et libellé) dans l'en-tête. |
| 5 | Densité ≤ 15 % | **Règle par card** (bloquante) ; **contrôle par colonne** à 25 % (non bloquant), corrigé par rééquilibrage, jamais par contenu inventé. Aucune règle chiffrée publiée. |
| 6 | Données inventées | **Annotation Figma de catégorie « Sample data »** sur chaque card concernée + tableau des champs à valider dans les Notes + noms de personnes génériques ; en prototype, badge neutre « Sample data ». |
| 7 | Librairie | **Data Display** : le maître remplace la Widget Card (nouvelle version majeure, même nom, ancien set déprécié puis dépublié) ; atomes `.` dans le même set ; micro-viz génériques publiées ; atomes propres au Buyer Summary en local. |

---

## 1. Raison d'un statut calculé : texte visible ou infobulle ?

### Constat
Dans le code, la raison (« Review due in 12 days ») est dans un `dsTooltip` posé sur un `<span>` non focalisable, doublée
d'un texte `bento-sr` pour les lecteurs d'écran. Un utilisateur au clavier voyant ne peut pas l'afficher, un utilisateur
tactile non plus. Dans Figma, `.Status` porte `Reason` en booléen, éteint par défaut.

### Recommandation tranchée
1. **Warning et Problem : raison visible par défaut, sur toutes les cards** qui portent ce statut. Le statut appelle une
   action (Carbon, SRE : `benchmark-edit-flow.md` 6.1) ; une alerte sans son motif oblige à survoler pour décider.
2. **Les 2 cards à fond automatique : raison visible obligatoire, non masquable.** C'est déjà la règle P2 du benchmark
   d'édition (« Le fond automatique dit pourquoi »).
3. **On track : pas de raison visible** (aucune action requise ; Carbon déconseille un indicateur quand rien n'est à faire).
   La raison reste dans le panneau de détail.
4. **L'infobulle n'est plus un support de la raison.** Elle reste permise pour le titre tronqué ou une icône info, sur
   un élément interactif seulement.
5. Format : une ligne sous le titre, 12 px (`size-s`) régulier, couleur du texte secondaire (ou du ton sur fond subtle,
   comme le libellé du statut), phrase courte avec échéance ou seuil (« Review due in 12 days », « Overdue above 30 days
   since 02 Nov »). Pas de troncature : en 1x1, la raison remplace la ligne de contexte de la valeur clé.

### Sources
- Atlassian, Tooltip (vérifié) : « Never put critical information in tooltips, as this can create accessibility barriers
  for different devices and users » ; « Only use tooltips on interactive elements ». https://atlassian.design/components/tooltip/usage
- GOV.UK, Details (vérifié) : « Do not use the details component to hide information that the majority of your users will
  need » ; des utilisateurs « avoid clicking the link to show more details ». https://design-system.service.gov.uk/components/details/
- WCAG 2.2, Understanding 1.4.13 Content on Hover or Focus (vérifié) : le contenu au survol « can be difficult or impossible
  to perceive » ; « There are usually more predictable and accessible means of adding content to the page ».
  https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
- Carbon, Status indicators (vérifié) : quand le libellé seul ne suffit pas, « provide a heading or additional content to
  clarify the status intention ». https://carbondesignsystem.com/patterns/status-indicator-pattern/

### Impact
- **Figma** : dans les variantes `Negative subtle`, `Warning subtle`, `Negative strong`, `Warning strong` du maître, poser
  `.Status` avec `Reason = true` ; déplacer la raison sur une seconde rangée de `.Card Header` (sous le titre) plutôt qu'en
  ligne à côté du libellé, pour ne jamais pousser le titre sur deux lignes. Note de section 01 à mettre à jour.
- **Code** (`buyer-summary-v2.component.html`, l. 488) : remplacer le `dsTooltip` du statut par un
  `<span class="bc-reason">` visible quand `tone` vaut warning ou problem ; garder le texte `bento-sr` seulement pour
  On track. Vérifier le test à 200 % (la raison passe à la ligne, ne se coupe pas).

---

## 2. Sparkline et repère du Bullet graph : variantes de forme ou Chart de librairie ?

### Constat
La Sparkline locale a une série figée ; le repère du Bullet graph ne se déplace pas sur une instance (Figma n'autorise
pas à déplacer ou redimensionner un calque d'instance). La librairie Chart (`2060:338`) a des slots `Y labels`,
`Series`, `X labels`, mais impose grille et axes.

### Ce que font les systèmes de référence
- **Carbon** (vérifié) : `Sparkline`, `Bullet` et `Meter` sont des types de la librairie Carbon Charts, c'est-à-dire du
  code piloté par données, pas des composants de forme. https://carbondesignsystem.com/data-visualization/chart-types/
- **Fluent 2** (vérifié) : `Sparkline`, `GaugeChart`, `HorizontalBarChart` sont des composants de `@fluentui/react-charts`,
  alimentés par des données. https://github.com/microsoft/fluentui/tree/master/packages/charts/react-charts/library/src/components
- **Polaris Viz** (vérifié) : la librairie de visualisation de Shopify (SparkLineChart, SparkBarChart, connu) est un
  paquet React à part, aujourd'hui « deprecated » et archivé : la micro-viz vit dans le code, pas dans le kit Figma.
  https://github.com/Shopify/polaris-viz
- **Ant Design** (connu) : `TinyLine`, `TinyArea`, `TinyColumn`, `Bullet` dans Ant Design Charts (code), à côté de
  `Statistic` (valeur + préfixe + suffixe, vérifié https://ant.design/components/statistic).
- **Figma** (vérifié) : variantes « to manage varying states or types », slots pour « add, edit, and rearrange content » ;
  l'échange d'instance empêche de changer « dimensions and position » des calques imbriqués ; « Importing large component
  sets will impact Figma's speed ». https://help.figma.com/hc/en-us/articles/38741465279895 et
  https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants
- Atlassian, Material 3, Spectrum, GOV.UK, Primer, Lightning : pas de micro-viz dans leurs composants (rien trouvé de
  vérifiable), ce qui confirme que le sujet relève d'une librairie de graphiques à part.

### Recommandation tranchée
**Ni variantes de forme (montante, plate, descendante), ni renvoi vers la Chart.** Une forme de données en variante est une
variante de contenu (contraire à `figma-nested-props`) et ne couvre jamais la vraie donnée ; la Chart apporte axes et
grille qu'une sparkline n'a pas (Tufte : « word-sized », sans axe).
- **Figma** : chaque micro-viz garde son cadre, sa légende, ses tokens et sa hauteur dans le maître, et reçoit un **slot
  `Plot`** pré-rempli par défaut. Le designer redessine le tracé (Sparkline) ou redimensionne la barre de mesure et
  déplace le repère (Bullet graph) dans le slot, ce que le slot permet. Pour garder le style, proposer 2 ou 3
  « préférés » locaux du slot (tracé, repère) déjà reliés aux variables, sans en faire des variantes de l'atome.
- **Code** : la donnée pilote le rendu. Deux atomes `ds-sparkline` (`values`, `lastValue`, bande de normalité optionnelle)
  et `ds-bullet-graph` (`value`, `target`, `ranges` de 2 à 3 plages dans une seule teinte, Few), chacun avec un
  `ariaLabel` obligatoire qui dit la tendance ou l'écart en mots. Pas une option de `ds-chart`, dont l'API est faite
  d'axes et de grille.

### Impact
- Figma : remplacer la série fixe de `Local · Sparkline` (`84:262`) et le repère de `Local · Bullet graph` (`84:218`)
  par un slot `Plot` ; supprimer l'écart 2 du rapport (repère masqué en 07).
- Code : deux atomes nouveaux dans `shared/ui/` (avec `<svg>` interne, autorisé pour un atome au même titre que `Icon`),
  variante `reversed` pour les fonds forts (question 11 du benchmark Bento), export dans `index.ts`.

---

## 3. Faut-il un atome « libellé de groupe » ?

### Recommandation tranchée
**Oui, un atome `Group heading`.** Il manque dans Today (« Limit movements » contourné) et dans les cards multi-blocs
(By policy, Debt, Tenants).
- **Nom** : `Group heading` (Figma `Local · Group heading`, code `ds-group-heading`). Nom repris de Primer
  (`ActionList.GroupHeading`) ; « eyebrow » écarté (anti-référence de `PRODUCT.md`).
- **Style** : `text-style-size-s` 12 px, semi-bold, `Text/Main/Secondary` (Subtle/Secondary en Reversed), **casse de
  phrase, sans capitales ni interlettrage** (DESIGN.md interdit l'eyebrow capitales en tête de section). Méta optionnelle
  alignée à droite (« 3 movements », « EUR k »), même taille, régulier.
- **Espacements** : `spacing-m` au-dessus (sauf premier élément du slot), `spacing-xs` ou `spacing-s` en dessous, comme les
  paliers déjà fixés (`benchmark-bento.md` 3.4). Pas de filet : la proximité suffit (NN/g).
- **Règles** : seulement à partir de **2 groupes** dans une card ; jamais en premier élément s'il répète le titre de la
  card ; 4 mots au plus, une ligne, jamais tronqué (règle des libellés de `CLAUDE.md`) ; niveau de titre **h4** sous le
  titre de card **h3**, sans sauter de niveau.

### Sources
- Primer, ActionList (vérifié) : `GroupHeading` sert à « give a heading to the groups », niveau réglé par `as`, style
  `subtle` par défaut. https://primer.style/product/components/action-list/
- Atlassian, Heading (vérifié) : « Never skip lower heading levels ». https://atlassian.design/components/heading/usage
- WCAG 2.2, Understanding 1.3.1 Info and Relationships (vérifié) : « Use code to reinforce relationships and information
  conveyed through presentation » (technique H42). https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
- Carbon, Tile (vérifié) : dans une tuile haute, structurer par l'espacement vertical entre sections, avec les tokens.
  https://carbondesignsystem.com/components/tile/usage/

### Impact
- Figma : nouvel atome local (propriétés `Label`, `Meta` booléen + texte, `Reversed`), posé dans Today (By policy, Limit
  movements) et Future (Debt, Tenants, Owners).
- Code : atome `ds-group-heading` (`level` = 3 à 6, défaut 4), à utiliser à la place des classes ad hoc de
  `bento-card-body`.

---

## 4. Liseré d'accent de 4 px à gauche des cards Subtle

### Constat
Le kit pose un liseré de 4 px (`Border/Size/L`) dans la couleur du ton sur les niveaux subtle. `DESIGN.md` : « Don't use
`border-left`/`border-right` >1px as a colored accent stripe on cards or callouts. » Le rapport relève déjà que c'est un
usage nouveau du token.

### Ce que disent les références
- Carbon, Notification style (vérifié) : les notifications inline et toast ont bien un `border-left` de **3 px** coloré par
  type (`$support-error`, etc.). C'est un callout étroit, pas une card de dashboard. https://carbondesignsystem.com/components/notification/style/
- GOV.UK, Inset text (connu, bord gauche gris) : à utiliser « very sparingly », et pas pour l'information très importante,
  que des utilisateurs manquent. https://design-system.service.gov.uk/components/inset-text/
- WCAG 2.2, Understanding 1.4.11 (vérifié) : un graphique redondant avec un texte qui dit la même chose n'est pas soumis au
  3:1. Le liseré n'apporte donc rien à la conformité : le statut tient déjà par l'icône et le libellé.
  https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- NN/g, Dashboards (vérifié) : « Shape or clear visual grouping are more reliable signals for relatedness » que la couleur.
  https://www.nngroup.com/articles/dashboards-preattentive/

### Recommandation tranchée
**Retirer le liseré.** Il est interdit par le DS, il double un signal déjà porté par `.Status`, il ne se lit qu'en couleur
(le contraire de « Status is never color-only »), et sur un rayon de 8 px il produit un bord gauche épais qui se courbe mal.
Le remplacer par :
1. **Teinte de fond** du ton (déjà en place) ;
2. **Bord complet de 1 px** dans le ton (`Border/Main/Functional/<ton>`, `Border/Size/S`), ce qui délimite la card même
   quand la teinte est proche du fond de page (le benchmark mesure 1,02:1 pour la teinte bleue contre la page) ;
3. **`.Status` dans l'en-tête** (icône + libellé + raison, question 1), seul porteur du sens.
Pour `Subtle` (emphase personnelle, non statutaire) : teinte + bord neutre habituel + étoile « Highlighted », pas de bord
bleu (One Blue Rule : le bleu dit « actionnable »).
Avantages : conforme à `DESIGN.md`, un seul langage de bord sur toutes les cards, sens lisible en niveaux de gris, rien à
justifier en 1.4.11 (l'orange à 2,48:1 du liseré Warning ne porterait plus seul une différence visuelle).

### Impact
- Figma : sur les 4 variantes subtle du maître, supprimer le calque de liseré, passer le trait à 1 px tokenisé sur les
  4 côtés ; retirer la proposition « Liseré 4 px sur Border/Size/L ». Captures 01, 04 et 06 à refaire.
- Code : supprimer les `border-left` d'accent des emphases subtle de la V2, garder `border: var(--semantic-border-size-s)`
  avec la couleur du ton.

---

## 5. Densité « ≤ 15 % de vide par card » : par card ou par colonne ?

### Ce qui est publié
Aucun système de référence ne publie de seuil chiffré de vide. Les règles publiées sont qualitatives :
- Apple HIG, Widgets (vérifié dans `benchmark-bento.md`) : « Avoid expanding a smaller widget's content to simply fill a
  larger area ». https://developer.apple.com/design/human-interface-guidelines/widgets
- Tufte, Sparklines (vérifié) : « max[data], min[design] » ; densité à « the resolution of typography ».
  https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/
- Carbon, Tile (vérifié) : sections espacées par les tokens dans une tuile haute ; Carbon Dashboards : la donnée la plus
  importante occupe la plus grande surface. https://carbondesignsystem.com/components/tile/usage/
- Fluent 2, Card (vérifié) : « Real estate is limited so keep card content brief ». https://fluent2.microsoft.design/components/web/react/core/card/usage

### Recommandation tranchée
Le 15 % est une **règle Qirin** (à écrire comme telle dans les notes du kit), pas une norme.
1. **Par card : règle bloquante**, ≤ 15 % entre le bas du contenu du slot et le bas du slot, mesurée par script.
2. **Par colonne : contrôle d'équilibre, non bloquant, à 25 %.** Au-delà, on corrige dans cet ordre : déplacer un bloc
   d'une colonne à l'autre, changer le partage des colonnes, aligner le dernier élément en bas (footer), changer de
   format. **Jamais** d'ajout de donnée pour remplir (mémoire `visual-qa-lessons` : « ne rien inventer »).
3. Les 6 colonnes listées en passe 2 (22 à 27 %) : Exposure, 3e colonne (27 %) est la seule à reprendre ; les autres
   passent.

### Impact
- Figma : ajouter la mesure par colonne au script d'audit (alerte, pas échec) ; Notes 06 et 07 : « 15 % par card (règle),
  25 % par colonne (contrôle) ».
- Code : la même mesure dans le contrôle Playwright P2 du benchmark d'édition (7.2, point 6), par format.

---

## 6. Signaler des données inventées dans une maquette de DS

### Recommandation tranchée
1. **Annotation Figma native de catégorie « Sample data »** (catégorie créée dans le fichier) sur chaque card de 07 qui
   contient une donnée inventée, avec la liste de ses champs. Elle est filtrable en Dev Mode et ne pollue pas la card.
2. **Tableau dans `Notes · Future`** : champ, valeur montrée, statut (« à confirmer dans les sources Qirin », « inexistant
   à ce jour »), responsable. C'est la suite de la question 12 du benchmark Bento.
3. **Sous-titre de section** : « Illustrative data, not validated ». Le marquage se voit dans toute capture de la section.
4. **Personnes et sociétés tierces** : noms génériques et manifestement fictifs (« Holding A SAS », « Tenant 1 »),
   jamais une personne réelle ni un vrai SIREN tiers ; montants cohérents avec Immobilière du Marais.
5. **Prototype** (tests utilisateurs, Echo) : badge `ds-badge` neutre « Sample data » dans le pied des cards futures,
   piloté par un champ `sample: true` dans `*.data.ts`. Un testeur ne doit pas prendre une donnée inventée pour un
   besoin validé.

### Sources
- Figma, Annotations (vérifié) : catégories (Development, Interaction, Accessibility, Content) renommables, filtrables en
  Dev Mode. https://help.figma.com/hc/en-us/articles/20774752502935-Add-measurements-and-annotations-in-Dev-Mode
- NN/g, fidélité des prototypes (vérifié) : la fidélité du contenu est un axe à part entière (« all the content that would
  appear in the final design »), d'où l'intérêt de dire lequel est réel. https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/
- RGPD, art. 5(1)(c) (vérifié) : données « limited to what is necessary » : pas de données personnelles réelles dans une
  maquette partagée. https://gdpr-info.eu/art-5-gdpr/

### Impact
- Figma : une catégorie d'annotation, une annotation par card de 07, sous-titre de section, Notes complétées. Aucun
  composant nouveau.
- Code : un booléen par contenu futur et un badge existant ; rien dans les atomes.

---

## 7. Dans quelle librairie mettre les nouvelles cards, et que faire de la Widget Card ?

### Constat
- `Widget Card` (Data Display, `1325:10443`, publiée sous le nom « Card », à renommer selon l'audit) : titre, actions,
  séparateur, slot. En code, `ds-widget-card` est utilisée par 7 pages (Buyer Summary V1, Card builder lab, Manual
  Underwriting...).
- Le `Bento Card` du kit est la même idée (coquille à slot pour un widget de board), plus complète : emphases, états,
  statut, pied.
- Règle utilisateur : maîtres génériques à slots en librairie, contenu propre à une fonctionnalité en local ; vérifier
  l'existant avant de créer ; atomes `.` non publiés.

### Recommandation tranchée

| Élément | Où | Pourquoi |
|---|---|---|
| Maître `Bento Card` | **Data Display**, publié sous le nom **`Widget Card`**, nouvelle version majeure (2.0) | Même rôle que la Widget Card ; un nom de fonction, pas de style (« Bento » décrit la grille, pas le composant) ; Data Display porte déjà Card, Chart, Table. |
| `.Card Header`, `.Status`, `.Card Footer`, `.Delta` | **Dans le même fichier**, préfixe `.`, non publiés, exposés | Ils n'ont de sens que dans la card (règle des sous-éléments de `CLAUDE.md`) ; `.Delta` est aussi utilisé par Key figure : il suit Key figure s'il est publié. |
| Micro-viz génériques : `Sparkline`, `Bullet graph`, `Stacked bar`, `Key figure` (+ `Delta`), `Group heading` | **Data Display, publiés** (page « Data viz » à côté de Chart et Progress Bar) | Aucun contenu métier : réutilisables par Coverbook, Manual Underwriting, Exposure cards. Ils doivent être publiés pour être posés dans le slot depuis un autre fichier. |
| `Key figure row`, `List row`, `Mini table row`, `Progress`, `Empty hint` | **Vérifier l'existant d'abord** : List row contre Properties Panel, Mini table row contre Table Row, Progress contre Progress Bar, Empty hint contre l'état vide du maître | S'ils recouvrent un composant publié, étendre ce composant ; sinon, local. |
| `Task item`, `News item`, `Timeline item`, `Grade chip` | **Local** au fichier Buyer Summary V2 | Compositions de List Item, Grade, Timeline Event publiés : du contenu propre à la fonctionnalité. |

**Widget Card existante : fusionner, puis déprécier l'ancien set.** Figma recommande, quand la logique change, de
reconstruire, de déplacer l'ancien set dans une section à part, de le retirer de la publication et de documenter la
migration : les instances existantes ne se mettent pas à jour seules. Concrètement : nouveau set publié `Widget Card` 2.0 ;
ancien set renommé « Widget Card (deprecated) », laissé publié jusqu'à ce que le comptage d'usage tombe à zéro (Buyer
Summary V1, Manual Underwriting), puis dépublié ; ligne de `components.json` et page ZeroHeight à mettre à jour (version
2.0.0, commentaire de migration).

### Sources
- Mémoires `figma-masters-slots` et `figma-nested-props` (règles de l'utilisateur).
- Figma, Migrate a library to using slots (vérifié) : « This is effectively a rebuild » ; déplacer l'ancien set, le
  retirer de la publication, « publish a new version of the component » ; les liaisons existantes ne se mettent pas à jour
  et cela « needs careful documentation for downstream teams ».
  https://help.figma.com/hc/en-us/articles/38607529833751-Migrate-a-library-to-using-slots
- Figma, Create and use slots (vérifié) : contenu par défaut, instances préférées, « Only allow preferred instances » pour
  guider ce qu'on pose dans le slot. https://help.figma.com/hc/en-us/articles/38231200344599
- Figma, Component properties (vérifié) : exposer les instances imbriquées ; booléen plutôt qu'une variante par état.
  https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties
- Fluent 2, Card (vérifié) : anatomie header, preview, footer « flexible based on the needs of the card », même découpage
  que le maître. https://fluent2.microsoft.design/components/web/react/core/card/usage

### Impact
- **Figma** : déplacer le maître et ses atomes `.` du fichier Bento vers Data Display ; déclarer les micro-viz publiées
  comme instances préférées du slot `Content` ; garder les 12 variantes (états sur None) ; mettre à jour le statut dans le
  fichier Component Status.
- **Code** : faire évoluer `ds-widget-card` (inputs `emphasis`, `state`, `status`, `reason`, `footer`) au lieu de créer
  `ds-bento-card` ; garder les inputs actuels (`seeFigures`, `externalLink`) pour ne pas casser les 7 pages consommatrices,
  puis migrer la V2 dessus. Atomes publiés côté Figma = atomes `shared/ui` côté code ; atomes locaux = composants de la page
  `buyer-summary-v2`.

---

## Points non vérifiés ce jour
- Material 3 (Tooltips) et Lightning (Cards) : pages rendues sans texte, non cités.
- Polaris Viz : liste des composants non lue (site injoignable), seul l'état « deprecated » du dépôt est vérifié.
- Ant Design Charts `Tiny*` et `Bullet` : page 404, mention de mémoire.
- Few, Bullet Graph Design Spec : PDF non lisible ce jour, repris du benchmark Bento (déjà vérifié le 20/11).
