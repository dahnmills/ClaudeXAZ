# Benchmark complémentaire : flux d'édition du board Bento (Buyer Summary V2)

Date : 20/11/2026. Complète `benchmark-bento.md` (grille, quatorze formats, highlight, mouvement), qui n'est pas refait ici.
Périmètre : `src/app/pages/buyer-summary-v2/` dans son état actuel (mode édition « Edit board » / « Done » /
« Reset layout », barre d'outils par card avec formats rapides et menu des 14 formats, niveaux d'emphase `EMPHASES`,
duplication, déplacement clavier) et la gestion des boards de la V1 (`DEFAULT_BOARDS` : Common, Credit Assessment,
Credit Underwriting, `builtin` non supprimables, confirmation avant perte `discardConfirmOpen`).

Méthode : URL directes ouvertes le 20/11/2026 avec WebFetch (la recherche web est bloquée par captcha). Chaque point
« vérifié » vient d'une page lue ce jour ; les citations sont en anglais, telles quelles. Ce qui n'a pas pu être lu
est marqué **non vérifié** et n'est pas utilisé comme preuve.

Non vérifié aujourd'hui (page vide, table des matières seule, ou rien trouvé) : aide iPadOS sur les widgets, widget
Bourse et Résumé de Santé d'Apple, Mercury et Ramp (aucune page d'aide sur un tableau de bord personnalisable trouvée),
tiroir de widgets et glisser de Datadog, Material 3 (site rendu en JavaScript ; valeurs reprises de la doc
material-components-android), le PDF de Stephen Few « Common Pitfalls in Dashboard Design » (binaire illisible).

---

## Synthèse en 10 lignes

1. Ajout : galerie dans un `ds-drawer` non modal à droite, board visible à gauche ; liste groupée par question métier, recherche en tête, puis détail avec **aperçu réel** (vrai composant, données du buyer) et choix du format parmi les 14 (iOS fait défiler les tailles du widget lui-même).
2. Pose par clic au premier emplacement libre qui accepte le format (macOS), ou sur le trou cliqué ; glisser depuis la galerie en P2, jamais obligatoire (WCAG 2.5.7).
3. Boards : les trois modèles par rôle (Common, Credit Assessment, Credit Underwriting) restent non supprimables et réinitialisables ; les boards personnels se créent depuis un modèle ou par duplication, se renomment en place, se suppriment avec confirmation.
4. Partage : copie d'un board, pas de board vivant partagé, au moins jusqu'aux tests ; dernier board utilisé mémorisé, modèle du rôle au premier accès.
5. Édition : mode explicite (déjà là) avec barre Add card, Undo, Reset layout, Cancel, Done ; Done enregistre, Cancel demande confirmation s'il y a des changements, comme quitter la page.
6. Annuler : pile d'undo de session (Ctrl+Z) sur chaque action ; retirer une card se fait sans confirmation, avec « Undo » dans un snackbar : réversible plutôt que bloquant.
7. Redimensionnement : poignée de coin 24 x 24 px qui ne s'arrête que sur les 14 formats, avec l'étiquette du format en cours ; le menu de formats reste l'alternative sans glisser.
8. Détail : le titre de la card ouvre un panneau latéral (données en tableau, source, date, lien vers l'écran complet) ; plein écran et export CSV en P2, comme Grafana, Datadog et Power BI.
9. Mise en avant : séparer le **statut** (calculé par des règles d'admin, badge + icône dans la card, automatique) de l'**emphase** (choix de l'analyste, fond) ; fond automatique seulement pour ce qui demande une action, plafonné, expliqué et désactivable (SRE : « Every page should be actionable »).
10. Lisibilité : 12 px plancher pour unités, axes et légendes seulement, 14 px pour le texte, 16 px et plus pour les valeurs clés, chiffres tabulaires partout, test à 200 % (WCAG 1.4.4) ; WCAG ne fixe aucune taille minimale, Apple et Carbon donnent les planchers.

---

## Références

| # | Référence | Lien | Sujet | Vérifié |
|---|---|---|---|---|
| 1 | Apple, ajouter des widgets (iPhone) | https://support.apple.com/guide/iphone/add-edit-and-remove-widgets-iphb8f1bf206/ios | 1 | oui |
| 2 | Apple, widgets sur Mac | https://support.apple.com/guide/mac-help/add-and-customize-widgets-mchl52be5da5/mac | 1, 3 | oui |
| 3 | Android, widgets | https://support.google.com/android/answer/9450271 | 1, 3 | oui |
| 4 | Notion, dashboard view | https://www.notion.com/help/dashboards | 1, 3 | oui |
| 5 | Linear Dashboards | https://linear.app/docs/dashboards | 1, 2, 4, 5 | oui |
| 6 | Grafana, créer un dashboard | https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/create-dashboard/ | 1, 3 | oui |
| 7 | Grafana, panneaux de bibliothèque | https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/manage-library-panels/ | 1 | oui |
| 8 | Grafana, historique des versions | https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/manage-version-history/ | 2, 3 | oui |
| 9 | Grafana, utiliser un dashboard (vue panneau, raccourcis, refresh) | https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/ | 4, 5 | oui |
| 10 | Grafana, panel inspect | https://grafana.com/docs/grafana/latest/panels-visualizations/panel-inspector/ | 4 | oui |
| 11 | Grafana, seuils | https://grafana.com/docs/grafana/latest/panels-visualizations/configure-thresholds/ | 6 | oui |
| 12 | Grafana, options standard (No value) | https://grafana.com/docs/grafana/latest/panels-visualizations/configure-standard-options/ | 5 | oui |
| 13 | Datadog, dashboards | https://docs.datadoghq.com/dashboards/ | 2 | oui |
| 14 | Datadog, configurer (clone, versions, suppression, permissions, densité) | https://docs.datadoghq.com/dashboards/configure/ | 2, 3 | oui |
| 15 | Datadog, widgets | https://docs.datadoghq.com/dashboards/widgets/ | 1 | en partie |
| 16 | Datadog, configuration des widgets (plein écran, export) | https://docs.datadoghq.com/dashboards/widgets/configuration/ | 4 | oui |
| 17 | Power BI, créer un dashboard | https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboard-create | 1, 2 | oui |
| 18 | Power BI, tuiles (déplacer, 1x1 à 5x5, supprimer) | https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboard-edit-tile | 1, 3 | oui |
| 19 | Power BI, focus mode et plein écran | https://learn.microsoft.com/en-us/power-bi/explore-reports/end-user-report-view | 4 | oui |
| 20 | Power BI, export de données | https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-export-data | 4 | oui |
| 21 | Stripe, Dashboard Web | https://docs.stripe.com/dashboard/basics | 1 | oui |
| 22 | IBM Carbon, états vides | https://carbondesignsystem.com/patterns/empty-states-pattern/ | 5 | oui |
| 23 | IBM Carbon, chargement | https://carbondesignsystem.com/patterns/loading-pattern/ | 5 | oui |
| 24 | IBM Carbon, indicateurs de statut | https://carbondesignsystem.com/patterns/status-indicator-pattern/ | 6 | oui |
| 25 | IBM Carbon, jeux typographiques | https://carbondesignsystem.com/elements/typography/type-sets/ | 7 | oui |
| 26 | Google SRE Book, Monitoring Distributed Systems | https://sre.google/sre-book/monitoring-distributed-systems/ | 6 | oui |
| 27 | Apple HIG, Typography (JSON de la page) | https://developer.apple.com/design/human-interface-guidelines/typography | 7 | oui |
| 28 | Material 3, échelle typographique (doc material-components-android) | https://github.com/material-components/material-components-android/blob/master/docs/theming/Typography.md | 7 | oui |
| 29 | MDN, `font-variant-numeric` | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric | 7 | oui |
| 30 | W3C, Understanding SC 1.4.4 Resize Text | https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html | 7 | oui |
| 31 | iPadOS widgets, Apple Bourse, Apple Santé, Mercury, Ramp, Material 3 (m3.material.io), Few « Common Pitfalls » | | 1, 6, 7 | **non** |

Rappels repris de `benchmark-bento.md` sans les refaire : WCAG 2.5.7 et 2.5.8, schéma clavier dnd-kit, flash de 700 ms
(Atlassian), Few (bullet graph), Power BI (mise en forme conditionnelle), contrastes calculés sur les tokens.

---

## 1. Flux d'ajout de card

### 1.1 Ce que font les références

| Référence | Ouvrir | Lister, grouper, chercher | Prévisualiser, choisir le format | Poser dans la grille | Source |
|---|---|---|---|---|---|
| iOS (iPhone) | Appui long sur le fond « until the apps begin to jiggle », Edit, Add Widget | Galerie : « Browse or search » | On touche un widget puis on fait défiler à gauche ou à droite « through its size and style options » ; l'aperçu est le widget lui-même | « Add Widget » quand la bonne taille est affichée, puis on le glisse à sa place tant que tout tremble, Done | support.apple.com/guide/iphone/iphb8f1bf206 (vérifié) |
| iPadOS | | | | | non vérifié |
| macOS | Clic droit sur le fond, Edit Widgets | Galerie en deux colonnes : catégories à gauche, widgets à droite ; recherche | Taille changée après coup (clic droit sur le widget) ; la page ne décrit pas de choix avant l'ajout | Clic sur le widget (ou son bouton Add) : **posé automatiquement** ; ou glissé « to any spot » ; Done | support.apple.com/guide/mac-help/mchl52be5da5 (vérifié) |
| Android | Appui long sur un espace vide, Widgets | Liste **par application** : « tap the app » pour voir ses widgets | Pas d'aperçu décrit hors des vignettes d'écran pendant le glisser | Appui long puis glisser sur l'écran ; redimensionnement par des points sur les bords | support.google.com/android/answer/9450271 (vérifié) |
| Notion (dashboard view) | Edit dans l'en-tête, « You'll start in Edit mode » à la création | `+` sur une rangée ou en bas | Le widget est une vue de base existante ou nouvelle (table, board, graphique) | Posé sur la rangée choisie ; largeur à la poignée, hauteur au séparateur de rangées ; « up to 4 widgets per row and 12 widgets total » | notion.com/help/dashboards (vérifié) |
| Linear Dashboards | Depuis une vue : « Add to dashboard » dans le menu d'un insight | Pas de galerie : on part de la donnée | Trois formats : chart, metric block, table | Nouveau dashboard ou dashboard existant ; un insight peut vivre sur plusieurs dashboards | linear.app/docs/dashboards (vérifié) |
| Grafana | Edit, « Add new element », Panel ; ou survol, « Add panel » | Panneaux de bibliothèque dans un **tiroir** : « Filter the list or search », filtres par dossier et par type | Aucun aperçu visuel dans la liste (la doc montre seulement où le panneau est utilisé) | « Click a panel to add it » ; un doublon est « added next to the original one » ; on dépose quand « the new position is highlighted in a solid blue line » | grafana.com (create-dashboard, manage-library-panels) (vérifié) |
| Datadog | Add Widget en édition | Choix par type de visualisation | | Tiroir et glisser : non vérifiés | docs.datadoghq.com/dashboards/widgets (vérifié en partie) |
| Power BI | Épingle sur un visuel du rapport | Pas de galerie : on épingle depuis la source | Le visuel garde son type ; la tuile se redimensionne de 1x1 à 5x5 unités par la poignée en bas à droite | « Existing dashboard » ou « New dashboard » | learn.microsoft.com (service-dashboard-create, edit-tile) (vérifié) |
| Stripe | « Ajouter » sous « Vue d'ensemble » | Liste à cocher : on sélectionne ou désélectionne des widgets | Pas de format à choisir | « Appliquer » enregistre ; ajout de plusieurs widgets d'un coup | docs.stripe.com/dashboard/basics (vérifié) |
| Mercury, Ramp, Apple Bourse et Santé | | | | | non vérifiés |

### 1.2 Ce qu'on retient

1. **Deux familles de flux.** La galerie (iOS, macOS, Android, Grafana, Notion, Stripe) part du board ; l'épingle (Power BI,
   Linear) part de la donnée, ailleurs dans l'application. Qirin a besoin de la première tout de suite ; la seconde
   (« Add to board » depuis un écran de détail) est une piste pour plus tard.
2. **Le meilleur aperçu est le widget réel à sa taille réelle** (iOS : on fait défiler les tailles du widget lui-même).
   Grafana n'a aucun aperçu et c'est son point faible.
3. **Groupes + recherche** dans la même colonne (macOS : catégories à gauche, Grafana : filtres et recherche).
   Android groupe par application : chez Qirin, l'équivalent est le groupe métier (Risque, Exposition, Paiement...).
4. **Deux façons de poser** : clic = place automatique (macOS), glisser = place choisie (iOS, macOS, Android). Grafana
   pose le doublon à côté de l'original.
5. **La galerie reste ouverte** pour enchaîner plusieurs ajouts (macOS : on ferme avec Done ; Stripe : cases à cocher puis
   Appliquer).
6. **Le format se choisit à l'ajout** (iOS) et se change après (macOS, Android, Power BI) : les deux sont nécessaires.

### 1.3 Recommandations pour Qirin (priorisées)

**P1, à faire pour la V2**

1. **Entrées.** En mode édition : bouton « Add card » dans la barre d'édition (à gauche de « Reset layout ») et place
   fantôme « Add a card here » dans chaque trou du board. Hors édition : « Add card » dans le menu du board, qui ouvre
   le mode édition et la galerie en même temps (une seule action pour l'analyste).
2. **Galerie = `ds-drawer` à droite, non modal** (`aria-modal="false"` déjà en place), le board reste visible à
   gauche : on voit où la card va tomber. Pas de modale : elle cacherait le board. Échap ferme, le focus revient au
   bouton « Add card ».
3. **Liste groupée par question métier** (repris du brief du 14/10) : Risque (grade, score, sanctions), Exposition et
   limites (exposure, limit left, risk figures, by policy, coverage, limit review), Paiement (payments, overdues),
   Société (company, financials, news), Travail (jobs, decisions, notes), Synthèse (at a glance). Chaque ligne : titre
   question (« How much are we exposed? ») + nom court + une ligne de contenu + vignette de format par défaut.
   Une card déjà sur le board porte un `ds-badge` neutral « On board » ; elle reste ajoutable (la V2 sait dupliquer).
4. **Recherche** en tête (`ds-input-search`) sur titre, nom court et mots-clés (« DBT », « overdue », « limit »),
   filtrage immédiat, groupes vides masqués, « No card matches "xyz" » sinon.
5. **Étape détail dans le même tiroir** (bouton retour du `ds-drawer`, `showBack`) : aperçu **avec les données du
   buyer ouvert**, rendu par le vrai composant de card ; choix du format par les quatre groupes de la V2 (Square,
   Horizontal, Vertical, Block) en vignettes ; format recommandé présélectionné et marqué « Recommended » ; format qui
   ferait perdre l'essentiel désactivé avec sa raison (« Too narrow for the limit table »). Jusqu'à 2 colonnes,
   l'aperçu est à l'échelle 1 ; au-delà, réduit et légendé « Scaled preview ».
6. **Pose par clic.** « Add to board » place la card au **premier emplacement libre qui accepte le format**, dans l'ordre
   de lecture (comme macOS), sinon en fin de board. Le board défile jusqu'à elle, fond qui s'efface en 700 ms (déjà
   retenu dans `benchmark-bento.md`), annonce `aria-live` « Exposure added, position 7, row 3 ». Le tiroir revient à
   la liste pour l'ajout suivant ; le focus reste dans le tiroir.
7. **Pose sur un trou.** Un clic sur « Add a card here » ouvre la galerie **filtrée sur les formats qui tiennent dans ce
   trou** (« Fits 2 x 1 ») et pose la card exactement là.

**P2**

8. **Aperçu en place** : pendant le choix du format, une place fantôme pointillée apparaît sur le board à l'endroit
   d'atterrissage et les voisines s'écartent en FLIP ; l'analyste voit le résultat avant de valider (le geste iOS sans
   le tremblement).
9. **Glisser depuis la galerie** vers une place choisie (réutilise le moteur de glisser de la V2). Toujours doublé par le
   clic (WCAG 2.5.7 : pas de glisser obligatoire).
10. **Emphase à l'ajout** : une ligne repliée « Emphasis: None » dans l'étape détail, fermée par défaut. Le réglage
    principal reste la barre d'outils de la card, une fois posée.

**P3**

11. « Add to board » depuis les écrans de détail (famille Power BI / Linear), avec choix du board.
12. Ajout multiple façon Stripe (cases à cocher, « Add 3 cards ») si les tests montrent que les analystes composent un
    board de zéro ; sinon inutile, les boards partent d'un modèle (section 2).

### 1.4 Micro-schémas du flux

Écran A : board en édition, point d'entrée.

```
+---------------------------------------------------------------------------------+
| Buyer Summary . ACME SAS          [Add card] [Undo] [Reset layout] [Cancel] [Done]|
+---------------------------------------------------------------------------------+
| +-----------+ +-----------------------+ +-----------+ +-----------------------+ |
| | Grade   ::| | Exposure            ::| | Limit   ::| | Payments            ::| |
| |  4        | |  1 548 k USD  /\/\/'  | |  452 k    | |  DBT 12 d   ======    | |
| +-----------+ +-----------------------+ +-----------+ +-----------------------+ |
| +-----------------------+ +- - - - - - - - - - - -+ +-----------------------+ |
| | Jobs to do          ::| :  + Add a card here    : | News                ::| |
| |  3 open  . 1 overdue  | :    fits 2 x 1         : |  ...                  | |
| +-----------------------+ +- - - - - - - - - - - -+ +-----------------------+ |
+---------------------------------------------------------------------------------+
  :: = poignée + menu de card ;  pointillés = trou, cliquable
```

Écran B : galerie, liste.

```
+---------------------------------------------+-------------------------------+
| board (reste visible, édition)              | Add a card                  X |
|                                             | [ Search cards...           ] |
|  +--------+ +----------------+              |                               |
|  | Grade  | | Exposure       |              | RISK                          |
|  +--------+ +----------------+              |  [1x1] How risky is this      |
|                                             |        buyer?  Grade . On board|
|  +----------------+ +- - - - - - -+         |  [1x1] What does the score    |
|  | Jobs           | : Add a card  :         |        say?  Score            |
|  +----------------+ +- - - - - - -+         | EXPOSURE AND LIMITS           |
|                                             |  [2x1] How much limit is left?|
|                                             |  [3x2] Which policies carry   |
|                                             |        the exposure?          |
|                                             | PAYMENT ...                   |
+---------------------------------------------+-------------------------------+
```

Écran C : galerie, détail et format.

```
+-------------------------------+
| < Back     Limit left       X |
| How much limit is left?       |
| +---------------------------+ |
| | Limit left          USD   | |   aperçu réel, données du buyer
| |  452 000 of 2 000 000     | |   (échelle 1 jusqu'à 2 colonnes)
| |  [=======-----------] 23% | |
| +---------------------------+ |
| Format                        |
|  Square     [1x1] [2x2] [3x3] |
|  Horizontal [2x1*][3x1][4x1]  |   * = Recommended
|  Vertical   [1x2] [1x3] [1x4] |
|  Block      [3x2] [2x3] ...   |   grisé + raison si contenu perdu
| > Emphasis: None              |   (P2, replié)
|                               |
|              [Add to board]   |
+-------------------------------+
```

Écran D : après l'ajout.

```
+---------------------------------------------+-------------------------------+
|  ...                                        | Add a card                  X |
|  +----------------+ +================+      | [ Search cards...           ] |
|  | Jobs           | # Limit left     #      | RISK ...                      |
|  +----------------+ # 452 000 USD    #      |                               |
|                     +================+      |                               |
|   # = fond qui s'efface en 700 ms           |                               |
|   live region : "Limit left added, position 6, row 2."                      |
+---------------------------------------------+-------------------------------+
```

### 1.5 Décisions par défaut proposées (ajout)

| Sujet | Défaut |
|---|---|
| Conteneur de la galerie | `ds-drawer` non modal à droite, liste puis détail avec retour |
| Groupement | Groupes métier, ordre fixe ; recherche en tête |
| Aperçu | Vrai composant, données du buyer ouvert ; échelle 1 jusqu'à 2 colonnes |
| Format proposé | Format recommandé de la card présélectionné |
| Emphase à l'ajout | None (réglage après coup dans la barre d'outils) |
| Placement | Premier emplacement libre qui accepte le format, sinon fin du board ; sur un trou cliqué, ce trou |
| Après l'ajout | Défilement vers la card, fond qui s'efface en 700 ms, annonce polie, galerie qui reste ouverte |
| Doublons | Autorisés, signalés « On board » dans la liste |

---

## 2. Plusieurs boards

### 2.1 Ce que font les références

- **Créer** : Power BI crée un dashboard « from a report, from scratch, from a semantic model, or by duplicating an
  existing dashboard », et propose « New dashboard » au moment d'épingler. Datadog : « +New Dashboard », nom puis type
  de layout. Notion ouvre directement en édition à la création.
- **Dupliquer** : Datadog « Clone dashboard », « You are prompted to name the clone ». Grafana restaure ou clone une
  version.
- **Supprimer** : Datadog « Dashboards must be unstarred before deletion », puis 30 jours dans « Recently Deleted » où
  on peut restaurer. Power BI : supprimer une tuile ne supprime pas le visuel source.
- **Ranger et posséder** : Linear range un dashboard au niveau workspace, équipe ou personnel (« Move to... »), avec un
  propriétaire transférable ; les dashboards personnels sont visibles de leur seul auteur.
- **Droits** : Datadog limite l'édition par rôle, les membres gardent l'accès en lecture. Power BI : un lecteur
  « often can't move or resize tiles ».
- **Historique** : Grafana garde 20 versions par défaut ; « Restore » crée une nouvelle version identique.
- **Qirin V1** : trois boards `builtin` (non supprimables, non renommables), boards personnels, confirmation avant perte.

### 2.2 Recommandations

**P1**
1. **Modèles par rôle** = les trois boards de la V1, refaits avec les formats de la V2. Leur disposition est
   modifiable par l'analyste ; « Reset layout » les ramène au modèle. Ni renommables ni supprimables (règle V1).
2. **Créer** : « New board » propose deux départs, « Copy of the current board » (présélectionné) ou un des trois
   modèles. Pas de board vide par défaut : il obligerait à tout composer de zéro.
3. **Dupliquer** depuis le menu du board, nom proposé « Copy of Credit Assessment », champ sélectionné pour être
   remplacé (modèle Datadog).
4. **Renommer** en place avec `ds-inline-edit` ; nom obligatoire, unique parmi les boards de l'utilisateur, 40
   caractères au plus (proposition), jamais sur deux lignes dans le sélecteur.
5. **Supprimer** : `ds-confirm-dialog` qui nomme le board et son contenu (« Delete "My watchlist"? Its 9 cards will be
   removed. »), bouton destructif. Retour sur le board précédent ou sur Common.
6. **Board par défaut** : le dernier board utilisé, mémorisé par utilisateur ; au premier accès, le modèle du rôle
   (analyste : Credit Assessment ; souscripteur : Credit Underwriting ; autre : Common).

**P2**
7. « Set as default board » explicite dans le menu, si les tests montrent que « dernier utilisé » surprend.
8. Restauration après suppression (équivalent « Recently Deleted » de Datadog) si la donnée vit côté serveur ; dans le
   prototype, un snackbar « Board deleted. Undo » de 10 s.

**P3**
9. **Partager** une copie (« Send a copy to... ») : le destinataire reçoit un board personnel indépendant. Pas de board
   partagé vivant tant qu'il n'y a ni propriétaire ni droits d'édition (Linear et Datadog montrent ce que ça demande).
10. **Modèles d'équipe** publiés par un admin pays (niveau « team » de Linear), en plus des trois modèles.

---

## 3. Édition

### 3.1 Ce que font les références

| Moment | Références (vérifiées) |
|---|---|
| Entrer | iOS : Edit sur le fond qui tremble ; macOS : Edit Widgets ; Grafana : Edit ; Notion : distingue « Edit mode » (mise en page) et « View mode » (usage) |
| Sortir et valider | iOS et macOS : Done ; Grafana : Save (description facultative) puis « Exit edit » ; Stripe : Appliquer ; Android : toucher en dehors du widget |
| Annuler, revenir | Grafana : historique de versions, comparaison, Restore ; Datadog : « Preview, restore, or clone » une version ; Power BI focus mode : « Reset to default ». Aucune page lue ne décrit de confirmation avant perte. |
| Redimensionner | Grafana : « drag the lower-right corner » (layout Custom seulement ; en Auto grid la grille fixe la taille) ; Power BI : poignée en bas à droite, de 1x1 à 5x5 unités ; Android : points sur les bords ; Notion : poignée gauche-droite et séparateur de rangées ; iOS : taille choisie à l'ajout seulement |

### 3.2 Recommandations

**P1**
1. **Barre d'édition** (déjà amorcée) : `Add card` · `Undo` · `Reset layout` · `Cancel` · `Done` (primary, à droite).
2. **Done** enregistre et sort (toast « Board updated » déjà en place). **Cancel** sort sans enregistrer : sans changement,
   immédiat ; avec changements, `ds-confirm-dialog` « Discard 4 changes? » (Keep editing / Discard), même schéma que
   `discardConfirmOpen` en V1. Même dialogue si l'analyste change de board, de buyer ou de page en cours d'édition.
3. **Échap** annule le glisser ou ferme le menu ouvert, jamais le mode édition : une touche ne fait pas perdre un travail.
4. **Undo de session** : chaque action (ajouter, retirer, dupliquer, déplacer, changer de format ou d'emphase, reset)
   est une étape ; `Ctrl+Z` et `Ctrl+Shift+Z` en plus du bouton ; annonce « Undone: Limit left moved ». Pile vidée à
   Done et à Cancel.
5. **Retirer une card** : pas de confirmation, snackbar « Exposure removed. Undo ». Une action réversible vaut mieux
   qu'une question (PRODUCT.md : « reversible »). **Reset layout** : une étape d'undo, avec le même snackbar.

**P2**
6. **Poignée de redimensionnement** en bas à droite, cible de 24 x 24 px au moins (WCAG 2.5.8). Pendant le geste, la
   place fantôme saute au format autorisé le plus proche (les 14 seulement, jamais un 2x4 qui n'existe pas), étiquette
   « 3 x 2 » près du pointeur, voisines en FLIP ; un format désactivé est sauté et sa raison s'affiche dans l'étiquette.
   Relâcher = une étape d'undo. Le menu des formats et Alt + flèches restent l'alternative (WCAG 2.5.7).
7. **Compteur de changements** dans la barre (« 4 changes ») : il donne du sens à Cancel et à la confirmation.

**P3**
8. Historique des versions d'un board (Grafana, Datadog) : seulement si les boards deviennent partagés.

---

## 4. Détail d'une card

### 4.1 Ce que font les références

- **Grafana** : touche `v` pour le plein écran d'un panneau, Échap pour revenir ; « panel inspect » depuis le menu du
  panneau, onglets Data, Stats, JSON, Query, « Download CSV », bascules « Formatted data » et « Download for Excel ».
- **Datadog** : bouton plein écran en haut à droite du widget, période modifiable ; export PNG, SVG ou CSV d'un widget,
  CSV actif par défaut mais désactivable par l'organisation.
- **Power BI** : « Focus mode expands a visual to fill the canvas while keeping the Filters pane accessible », sortie par
  « Exit focus mode » ; export « .csv » d'une tuile, données résumées ou sous-jacentes, export filtré comme le visuel,
  désactivable par l'admin.
- **Linear** : chaque insight ouvre sa vue filtrée (benchmark Bento).

### 4.2 Recommandations

**P1**
1. Le **titre de la card** est un `ds-link` (pas toute la card : une card dense porte déjà ses liens) qui ouvre un
   `ds-drawer` à droite : la même donnée en plus grand et **en tableau** (lisible au lecteur d'écran), source et date,
   lien « Open full page » vers l'écran métier (Exposure vers les polices, Jobs vers la liste des tâches). Le board reste
   visible, Échap ferme, le focus revient au titre.
2. En mode édition, le titre n'ouvre rien : le clic sert à saisir la card.

**P2**
3. **Plein écran** (« Expand ») pour les cards à graphique temporel, avec choix de période ; Échap pour revenir.
4. **Export** dans le panneau : « Download CSV » des données de la card, nom de fichier avec le buyer, la card et la date
   (`acme-sas_exposure_2026-11-20.csv`), première ligne qui rappelle le périmètre (comme Power BI rappelle les filtres).
   Soumis aux droits de l'utilisateur.

**P3**
5. « Copy values » (presse-papier, format tableur) pour coller dans un mémo de crédit.

---

## 5. États

### 5.1 Ce que font les références

- **Carbon, chargement** : squelettes pour les conteneurs (tuiles, cards, tableaux), pas pour les boutons ;
  « Never represent toast notifications, overflow menus, dropdown items, modals, and loaders with skeleton states » ;
  chargement progressif, ce qui n'est pas encore chargé peut rester un espace vide à sa taille finale.
- **Carbon, vide** : « Empty states should replace the element that would ordinarily show » ; « Be specific about what
  will be available » ; une action principale, pas d'impasse ; illustration facultative, texte seul si la place manque.
- **Grafana** : « No value » remplace une valeur vide, « - » par défaut ; un rafraîchissement annule les requêtes en
  cours ; l'onglet « Error and notices » n'apparaît qu'en cas d'erreur.
- **Linear** : « Refresh data » dans le menu ; Datadog : dashboards publics rafraîchis toutes les 30 s.
- Date de dernière mise à jour affichée par tuile (Power BI) : **non vérifiée**.

### 5.2 Recommandations (complètent `benchmark-bento.md` 3.6)

**P1**
1. **Date au niveau du board** : « Data as of 20 Nov 2026, 09:42 » dans l'en-tête du board, une seule fois ; une card
   n'affiche sa date que si elle diffère (grade du 12/03, comptes de l'exercice 2023).
2. **Périmé** : seuil par type de donnée (grade, exposition, comptes, paiements), fixé par les règles métier et non par
   l'analyste ; au-delà, `ds-badge` warning « Outdated » + date ; la valeur reste lisible, jamais grisée.
3. **Trois vides distincts**, une phrase datée sans illustration : rien à signaler (« No overdue recorded as of
   20 Nov 2026 », c'est une information), non disponible (« No financial statements received »), non applicable
   (« Not applicable to sole traders »). Le tiret seul reste réservé à la cellule vide d'un tableau.
4. **Erreur par card**, jamais pour tout le board : `ds-functional-notice` dans la card, « Retry » ; les autres cards
   restent utilisables ; si tout échoue, une seule notice en tête du board.
5. **Chargement progressif** dans l'ordre de lecture, squelette du niveau courant à la taille finale : aucun saut.
6. **Aperçu de la galerie** : si la donnée du buyer est vide, l'aperçu montre l'état vide réel, pas des données
   d'exemple.

**P2**
7. « Refresh data » dans le menu du board, qui annule les requêtes en cours (Grafana).

---

## 6. Mise en avant automatique ou manuelle

### 6.1 Ce que disent les références

- **Grafana** : seuils par défaut « base » vert et 80 rouge ; la couleur du seuil s'applique au texte de la valeur ou au
  fond (Stat), aux cellules (table). Tout panneau est donc coloré par défaut : terrain de l'alarmisme.
- **Carbon** : « Avoid using status indicators when no user action is required » ; au-delà de 5 ou 6 indicateurs,
  l'utilisateur ne sait plus où regarder ; « When multiple statuses are consolidated, use the highest-attention color to
  represent the group » ; jamais la couleur seule.
- **Google SRE** : « Every page should be actionable » ; trop d'alertes et les gens les survolent puis les ignorent ;
  « Rules that generate alerts for humans should be simple to understand and represent a clear failure » ; le non
  urgent va dans un dashboard, pas dans une alerte.
- **Power BI** : la mise en forme conditionnelle n'est pas reprise sur les tuiles épinglées (« Conditional formatting
  isn't applied »).

### 6.2 Recommandations

La V2 mélange dans `EMPHASES` une emphase personnelle (subtle, strong) et des tons de statut choisis à la main
(On track, Warning, Problem). Un statut choisi à la main peut contredire la donnée (« On track » sur un buyer en
impayé) : c'est le risque principal.

**P1**
1. **Statut = calculé.** On track / Warning / Problem viennent de règles (seuils d'impayé, de grade, d'utilisation de
   limite) posées par les admins pays, comme les règles TAG : mêmes seuils pour tous les analystes d'un pays. Affichés
   par `ds-badge` + icône à côté de la valeur concernée, pas en fond.
2. **Emphase = choisie.** Le fond (subtle, strong) reste le choix de l'analyste, une card par board (décision du
   benchmark Bento), au sens « important pour moi ».
3. **Retirer les tons de statut du menu d'emphase**, ou les réserver à la règle automatique (point 4). Pas de fond vert :
   « tout va bien » ne demande aucune action (Carbon, SRE).

**P2**
4. **Fond automatique** seulement pour une condition critique et actionnable (sanction à lever, impayé au-delà du seuil,
   revue de limite échue), **deux cards au plus** par board ; au-delà, une card de synthèse « 3 points need attention »
   au ton le plus fort (Carbon). Le fond automatique dit pourquoi (« Overdue above 30 days since 02 Nov ») ; l'analyste
   peut le **masquer pour ce buyer** (« Acknowledge », tracé) et couper la mise en avant automatique dans les réglages
   du board. L'emphase manuelle n'est jamais effacée : si les deux tombent sur la même card, l'automatique décide de la
   couleur et l'étoile reste.

---

## 7. Lisibilité des boards denses

### 7.1 Normes et repères

| Source | Repère |
|---|---|
| WCAG 2.2, SC 1.4.4 | Texte agrandi à 200 % sans perte de contenu ni de fonction ; **aucune taille minimale** fixée par WCAG |
| WCAG 1.4.3 et 1.4.11 | 4,5:1 pour le texte courant, 3:1 pour le grand texte et pour un graphique porteur de sens (rappel du benchmark Bento) |
| Apple HIG, Typography | Défaut / minimum : iOS et iPadOS 17 / 11 pt, macOS 13 / 10 pt, visionOS 17 / 12 pt, watchOS 16 / 12 pt ; « avoid light font weights » ; police fine : viser plus grand que le minimum |
| IBM Carbon | Plus petit style 12 px / 16 px (label-01, helper-text-01, legal-01), « It should not be used for body copy » ; texte compact 14 px / 18 px (body-compact-01) |
| Material 3 | labelSmall 11 sp, labelMedium et bodySmall 12 sp, bodyMedium 14 sp |
| MDN | `tabular-nums` : chiffres de même largeur, « easily aligned like in tables » (OpenType `tnum`) ; `slashed-zero` distingue O et 0 |

Qirin : `--semantic-font-text-style-size-s` 12 px, `-m` 14 px, `-l` 16 px, Foundation de 18 à 64 px ; la V2 applique
déjà `tabular-nums` à une partie des chiffres (`.bc-num` et quatre autres règles).

### 7.2 Recommandations

**P1**
1. **Plancher 12 px** (`size-s`) pour unités, axes, légendes, dates et méta seulement ; jamais pour une valeur ni pour une
   phrase. Texte courant 14 px (`size-m`). Valeur clé 16 px au moins, 20 à 32 px selon le format. C'est au-dessus des
   minima Apple (macOS 10 pt) et Material (11 sp), au niveau du plus petit style Carbon.
2. **Trois tailles au plus par card** (méta, texte, valeur clé) et une seule valeur clé : la hiérarchie fait la densité.
3. **Graisse régulière au minimum**, jamais light (Apple) ; semi-bold pour la valeur clé.
4. **`tabular-nums` sur tous les chiffres** du board (une règle sur le conteneur des cards, pas classe par classe),
   colonnes de nombres alignées à droite, unité dans la méta du titre plutôt que répétée. Vérifier qu'Allianz Neo porte
   `tnum` (question 8 du benchmark Bento).
5. **Test à 200 %** : à 1280 px, le board se comporte comme à 640 px, les container queries descendent d'un niveau ;
   vérifier qu'aucune valeur n'est coupée par une ellipse sans moyen de la lire (titre complet en info-bulle et dans le
   panneau de détail).

**P2**
6. Contrôle automatique (script Playwright) des tailles calculées sous 12 px et des contrastes sous 4,5:1 dans le board,
   pour chaque format.

---

## 8. Décisions par défaut proposées

| Sujet | Décision par défaut |
|---|---|
| Galerie | `ds-drawer` non modal à droite ; groupes métier + recherche ; détail avec aperçu réel et 14 formats, recommandé présélectionné |
| Pose | Clic : premier emplacement libre qui accepte le format, sinon fin du board ; trou cliqué : ce trou ; glisser en P2 |
| Après ajout | Défilement, fond qui s'efface en 700 ms, annonce polie, galerie ouverte |
| Boards | Trois modèles par rôle non supprimables, réinitialisables ; boards personnels créés par copie du board courant |
| Board ouvert | Dernier utilisé ; au premier accès, modèle du rôle |
| Partage | Copie indépendante (P3), pas de board partagé vivant |
| Édition | Barre Add card · Undo · Reset layout · Cancel · Done ; Échap ne sort jamais du mode édition |
| Perte | Confirmation seulement pour Cancel avec changements, sortie de page en édition, suppression de board |
| Annulation | Undo de session pour toute action ; retrait de card et reset suivis d'un snackbar « Undo » |
| Taille | Menu des 14 formats (P1), poignée de coin accrochée aux formats (P2) |
| Détail | Titre en lien, panneau latéral avec tableau, source, date, lien vers l'écran complet ; plein écran et CSV en P2 |
| États | Date au niveau du board, date de card seulement si différente ; Outdated par seuil métier ; erreur par card ; trois vides distincts |
| Statut | Calculé par règles d'admin, badge + icône, jamais de fond vert |
| Emphase | Manuelle, une par board ; fond automatique (P2) pour l'actionnable seulement, deux au plus, expliqué, masquable |
| Texte | 12 px plancher (méta), 14 px texte, 16 px et plus valeur clé, `tabular-nums` partout, test à 200 % |

### Questions ouvertes

1. Retire-t-on les tons de statut manuels (On track, Warning, Problem) du menu d'emphase de la V2 ?
2. Quels seuils de fraîcheur par type de donnée, et qui les fixe (admin pays, comme TAG) ?
3. Le rôle de l'utilisateur est-il connu à la connexion (pour choisir le modèle par défaut) ?
4. Longueur maximale d'un nom de board : 40 caractères proposés.
5. Galerie et panneau de détail utilisent tous deux `ds-drawer` : un seul ouvert à la fois (proposé) ?
