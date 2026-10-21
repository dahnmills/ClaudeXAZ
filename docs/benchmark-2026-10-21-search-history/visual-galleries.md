# Benchmark visuel : galeries de design (2026-10-21)

Complément visuel de `report.md`. Objet : combler les trous (a) à (e) de la première passe avec des
captures réellement regardées. Captures retenues dans `shots/gal-NN-*.png`.

## 1. Méthode

- Navigateur : Edge headless (Playwright, scripts maison dans `~/bench-shots/`), 1440x1000.
  Pour Dribbble, extraction de l'image principale du shot puis rechargement en 1600x1200.
  Pour Page Flows, lecture des vignettes de vidéos en taille native (1920x1080 web, 1170x2532 iOS).
- Termes : recent searches, search history, saved searches, recently viewed, command palette,
  global search dashboard, search filters saas, advanced search saas, saved filters, search alerts,
  search modal recent, browsing history.

| Source | Accès | Résultat |
|---|---|---|
| Dribbble | OK (pages de recherche et shots) | 33 shots ouverts, 30 exploitables (3 échecs : image paresseuse ou vidéo) |
| Page Flows | OK partiel (écrans gratuits, vignettes) | 15 écrans ouverts, 12 exploitables. **Seule source de produits en production** |
| Collect UI | Page de recherche lisible, vignettes petites | survolé, non compté |
| Refero | 6 vignettes puis mur de connexion | non exploitable |
| Behance | HTTP 400 (bot bloqué) | non |
| Saaspo | Cloudflare (« Un instant… ») | non |
| Nicelydone | connexion requise | non |
| SaaSFrame | « No matching results » | non |
| UI Garage | site fermé | non |
| Land-book | 404 sur la recherche, et galerie de landing pages hors sujet | non |
| Mobbin | exclu par consigne | |

**Total : 48 exemples ouverts, 42 exploitables** (30 concepts Dribbble, 12 produits Page Flows).
Pondération : un concept Dribbble montre une intention de designer, pas un usage validé. Les écrans
Page Flows sont des captures de vrais produits (Autotrader, Indeed, Gumtree, Twenty, Grok, Cosmos,
Uber Eats, SchoolAI, Microsoft Teams, Zoho CRM, Craigslist, Hipmunk), majoritairement grand public
ou mobile. Aucun produit B2B d'analyse de crédit dans l'échantillon.

## 2. Observations

Légende : P = produit en production (Page Flows), C = concept (Dribbble). « Lignes » = lignes de
texte par élément.

| # | Exemple | P/C | URL | Ce qu'on voit | Capture |
|---|---|---|---|---|---|
| 1 | Autotrader, Saved > Searches | P | pageflows.com (Autotrader iOS) | Carte par recherche enregistrée. L1 titre gras (« Upto 200 miles from N19 4PQ »), **L2 = critères seuls séparés par « • » : 200 miles • N19 4PQ • £4K - £20K • Petrol • Manual**, L3 date relative (« a minute ago », « 77 weeks ago ») + toggle Alerts, menu ⋯. Onglets Adverts / Searches, Filter, Sort by | gal-01 |
| 2 | Indeed, Recent searches | P | pageflows.com (Indeed iOS) | Onglet « Recent searches » à côté de « Job feed ». L1 requête, L2 compteur « 1,536 new », L3 critère lieu « in London East, Greater London ». × par ligne, bandeau « Search removed · Undo ». Pas de date, pas d'icône | gal-02 |
| 3 | Gumtree, Saved > Search Alerts | P | pageflows.com (Gumtree iOS) | Onglets Favourites / Search Alerts. L1 « Cars in Bury St Edmunds », L2 gris **« Cars - Bury St Edmunds » (catégorie + lieu)**, pastille non lu | gal-03 |
| 4 | Twenty CRM, recherche globale | P | pageflows.com (Twenty web) | Liste unique mixte avant saisie : avatar/logo + nom + **type en gris « · Person », « · Company », « · Opportunity »**. Pas de date, pas de groupement | gal-04 |
| 5 | Grok, palette de recherche | P | pageflows.com (Grok web) | Section Actions puis **en-tête « Today »**, une ligne : requête tronquée + « 25 minutes ago » à droite. Actions en pied : Go, Edit, Delete avec raccourcis | gal-05 |
| 6 | Cosmos, recherche | P | pageflows.com (Cosmos web) | **Deux sections séparées** : « Recent » (puce avec loupe : « beach aesthetic ») et « Recently viewed » (vignettes d'objets). « Clear » par section | gal-06 |
| 7 | Uber Eats, recherche | P | pageflows.com (Uber Eats web) | Onglets de type All / Restaurants / Grocery / Alcohol au-dessus de « Recent » : icône horloge + requête, une ligne, pas de date | (non copié) |
| 8 | SchoolAI, Discover | P | pageflows.com (SchoolAI web) | « Recently viewed » en cartes horizontales : vignette + titre 2 lignes + auteur. « View all (8) » | (non copié) |
| 9 | Microsoft Teams, recherche | P | pageflows.com (Teams iOS) | Filtre All / People / Communities / Messages. **État vide de filtre : « We didn't find any matches here. Try your search in other tabs. »** | gal-18 |
| 10 | Zoho CRM, recherche | P | pageflows.com (Zoho CRM iOS) | Segmenté My records / All records, état vide « No matching results » + lien de repli | (non copié) |
| 11 | Craigslist, my searches | P | pageflows.com (Craigslist iOS) | Onglets categories / my searches, état vide expliquant l'usage (« save a search for easy access… ») | (non copié) |
| 12 | Hipmunk, Search Activity | P | pageflows.com (Hipmunk iOS) | État vide « You have no recent searches. When you run a flight or hotel search, it will show up here. » | (non copié) |
| 13 | Dynalist, jump to | P | pageflows.com (Dynalist web) | Un document récent, icône + titre, une ligne | (non copié) |
| 14 | Omnisearch (cliff.ai) | C | dribbble.com/shots/15551591 | « Recent history » multi-entités : icône source, L1 nom, **L2 = type en gras + date + attributs « Streams • Apr 02, 2021 • Measures - 1 • Dimensions - 1 »**, flèche ↗ à droite, « More.. » | gal-07 |
| 15 | Quick Search (Shayoli Singh) | C | dribbble.com/shots/17224557 | Deux variantes côte à côte : à gauche recherches récentes **groupées par type** (Sales Agent, City, Developer, Project, Team) ; à droite **liste unique avec type entre parenthèses en gris** (« Hyderabad (City) ») et **filtre All / City / Developer / Project / Team / Mandate / Person**. Icône historique, × par ligne, Clear | gal-08 |
| 16 | Advanced Search (Valery Lyakhova) | C | dribbble.com/shots/19206453 | Colonnes Saved (nom + compteur) et Recent. Recherche récente **libellée par sa date** (« 2 minutes ago », « 12 Apr 2022, 5:46 PM »), **badge du nombre de critères**, **critères complets en infobulle « Company …, Project …, Due Date Before 14 Mar 2022 »**, icône enregistrer | gal-09 |
| 17 | Command+K, Untitled UI | C | dribbble.com/shots/24366410 | « Recent searches » qui contient en fait des objets (projets) : icône dossier en boîte, L1 gras, L2 « Project by … in … », avatars, bouton « Jump to… ». Survol = fond gris | gal-10 |
| 18 | Quick search, Untitled UI | C | dribbble.com/shots/26999544 | « Recent » + Clear : icône de type + nom, une ligne, mélange objets et commandes | (non copié) |
| 19 | Overwatch AI | C | dribbble.com/shots/26998022 | Onglet « Search History », **en-tête « Today »**, carte : L1 requête tronquée + « 10m » à droite, L2 résumé du résultat (« I found 3 matches, mostly in FL ») | gal-11 |
| 20 | Case Search WIP | C | dribbble.com/shots/13476138 | « Recently Viewed Cases » : icône document, nom, **date relative en pastille** (8 minutes ago … 2 weeks ago), chevron | gal-12 |
| 21 | Recent & Saved Searches (Eugen Eşanu) | C | dribbble.com/shots/15401304 | Prospection B2B type Apollo : filtres à gauche, blocs « Saved Searches » et « Recent Searches » côte à côte, états vides (« Your last five searches will be here ») | gal-13 |
| 22 | Search Modal Recent & Favorites | C | dribbble.com/shots/25067306 | « Recents Apps » en tuiles avec × chacune + « Clear all », « Favourites » en liste avec étoile à droite. Deux sections, deux formes | gal-14 |
| 23 | Saved Filters, HR Dashboard | C | dribbble.com/shots/26598695 | Dropdown « Saved Filters » : noms seuls (« New Joiners », « Pending Approvals »), aucun critère | gal-15 |
| 24 | Browsing History mobile | C | dribbble.com/shots/24052857 | **En-tête « Today »**, logo + titre + domaine, corbeille globale ; état vide dédié | gal-16 |
| 25 | search palette (AJ Abbasi) | C | dribbble.com/shots/24499521 | Liste mixte personnes / sociétés / familles : **le type est porté par l'icône seule** (avatar vs mallette). Portée « Contact » en puce dans le champ, onglets All / People / Family / Company, tri A→Z | gal-17 |
| 26 | macOS App Recent searches | C | dribbble.com/shots/23456080 | Recherches récentes en puces, « Clear × » | (non copié) |
| 27 | Recent Searches Search Pattern | C | dribbble.com/shots/2672700 | Loupe + requête + × par ligne ; bloc « Saved searches » séparé | (non copié) |
| 28 | Search Drop Down (Billie) | C | dribbble.com/shots/27018433 | Recherches récentes en puces avec × ; résultats en 2 lignes (titre / type + compteur) | (non copié) |
| 29 | Custom Search Panel | C | dribbble.com/shots/27668091 | « Recently viewed » clients : avatar + nom + email sur une ligne, ⋮ à droite, survol gris | (non copié) |
| 30 | Search history mobile (Bala) | C | dribbble.com/shots/4577022 | Icône horloge + requête, « Clear History » | (non copié) |
| 31 | Capsule, Recently viewed contacts | C | dribbble.com/shots/4061550 | Carrousel d'avatars (personnes et sociétés distinguées par avatar vs icône immeuble) | (non copié) |
| 32 | Search Quotes, Zeus | C | dribbble.com/shots/23562446 | Onglets All / Active / Inactive avec compteur, pas d'historique visible | (non copié) |
| 33 | Quick/Global Search CRM | C | dribbble.com/shots/24804279 | Onglets All / Document / Tasks / Contact, résultats groupés par type, L2 « in Sales Reports », ↗ | (non copié) |
| 34 | Global Search Command Palette (Shift) | C | dribbble.com/shots/27601774 | Filtre segmenté avec icônes All / Horizon / Knowledge / Actions / Reports, date courte à droite (1d, 13d, 4mo), état vide | (non copié) |
| 35 | Global Search HR | C | dribbble.com/shots/27210251 | Onglets de type, groupes par type, L2 « 9:00 AM, 23 Mar, 2026 • 6 participants » | (non copié) |
| 36 | Saved Filters and Favorites | C | dribbble.com/shots/11461829 | Filtres enregistrés nommés, sauvegarde par nom, pas de résumé | (non copié) |
| 37 | Vizibl Saved Views | C | dribbble.com/shots/12588032 | « My Views » / « Popular Views », noms seuls, étoile favori au survol | (non copié) |
| 38 | Dechea Search | C | dribbble.com/shots/16928724 | « Recent search » : avatar patient, L2 « last appointment: May 30 (3 days ago) » | (non copié) |
| 39 | Command Palette & Global Search | C | dribbble.com/shots/27774429 | « Recently Viewed » : icône de type (pdf, réglage, dossier) + nom, une ligne | (non copié) |
| 40 | Creative Directory Search States | C | dribbble.com/shots/27799082 | Filtre de catégories au-dessus de « Recently viewed », L2 « From $2,500 • Bristol, UK • Replies in ~1h », chevron | (non copié) |
| 41 | Case Management KMS | C | dribbble.com/shots/14332639 | « Most Viewed » et « Recent Case » séparés, L2 tags en pastilles | (non copié) |
| 42 | Property Search Alerts | C | dribbble.com/shots/27407656 | Critères appliqués en puces au-dessus des résultats (« Under $2M », « 3+ Beds »), pas d'historique | (non copié) |

Non exploitables : Scout Saved Searches (GIF, première image hors sujet), deux shots vidéo en
timeout, Expedia et Zoopla (vignette sur un autre état que l'historique), shot 1 Dribbble (image
non chargée, repris au #21).

## 3. Réponses aux trous

### (a) Ligne 2 qui résume les critères d'une recherche passée

- **Vu.** Sur 18 exemples montrant des recherches passées ou enregistrées (pas des objets),
  **5 affichent les critères** : Autotrader (P), Gumtree (P), Indeed (P), Omnisearch (C),
  Advanced Search (C, en infobulle). 10 n'affichent que la requête texte (Uber Eats, Cosmos, Grok,
  macOS, Heena, Billie, Bala, Quick Search, Overwatch, Recent & Saved vide), 3 que le nom donné
  par l'utilisateur (Saved Filters x2, Vizibl).
- **Vu, et c'est le point clé** : la ligne de critères apparaît quand la recherche est
  **structurée** (formulaire multi-champs : distance, code postal, budget, carburant, catégorie,
  lieu). Les recherches en texte libre s'affichent par leur requête seule. Les 3 produits en
  production à recherche structurée de l'échantillon montrent tous les critères.
- Autotrader (gal-01) est quasiment notre carte : titre en gras, ligne de critères seuls séparés
  par un point, ordre stable, date relative. Différence : le titre est généré à partir du critère
  principal, la date est sous les critères, pas à droite.
- Gumtree (gal-03) : L2 courte « catégorie - lieu ». Indeed (gal-02) : le lieu sort en ligne à
  part (« in London »), précédé du nombre de nouveaux résultats.
- Variante Advanced Search (gal-09, concept) : critères en infobulle + badge du nombre de critères.
  Plus compact, mais cache l'information.
- **Verdict** : la ligne 2 « critères renseignés seulement » a désormais un précédent visuel en
  production (Autotrader, Gumtree). Elle est justifiée parce que notre recherche est un formulaire
  structuré. Confiance moyenne à bonne (grand public, pas B2B).

### (b) Distinction recherche passée vs objet consulté

- **Vu.** Sur 7 exemples qui montrent les deux natures, **6 les séparent** : sections distinctes
  (Cosmos gal-06, Search Modal gal-14, Recent & Saved gal-13, Case Management) ou onglets
  distincts (Autotrader Adverts / Searches, Gumtree Favourites / Search Alerts). 1 seul les mêle
  dans un même bloc, et c'est ambigu (Untitled UI gal-10 : « Recent searches » qui liste des
  projets).
- **Vu** : la forme diffère selon la nature. Recherche passée = icône générique horloge ou loupe
  (Cosmos, Uber Eats, Heena, Bala, Quick Search), souvent une seule ligne. Objet consulté = icône
  ou avatar propre à l'objet (Twenty, Capsule, Case Search, Custom Panel, Dechea, SchoolAI).
- **Inférence** : nos onglets Recent search / Recently viewed font déjà la séparation, ce qui
  correspond à la majorité. Le risque est dans Favorites s'il mêle recherches et objets : c'est
  là que la carte unique doit marquer la nature (libellé de type de recherche « Company ID » vs
  statut d'objet, ou glyphe de recherche).
- **Verdict** : carte unique acceptable tant que l'onglet porte la nature ; à renforcer si un
  même fil mêle les deux.

### (c) Groupement par date (Today / Yesterday)

- **Vu** : **3 sur 42** groupent par date, tous avec un seul en-tête « Today » visible : Grok
  (P, gal-05), Overwatch (C, gal-11), Browsing History (C, gal-16). Aucun « Yesterday » visible
  (les listes montrées sont courtes).
- **Vu** : date par élément dans 10 exemples. Position : à droite de la ligne 1 dans 4 (Grok,
  Overwatch, Shift, Dechea en L2), en pastille après le titre (Case Search), en pied de carte
  (Autotrader), dans la L2 (Omnisearch, Global Search HR). Format relatif court dominant
  (« 25 minutes ago », « 10m », « 1d », « 4mo »). Advanced Search (gal-09) passe du relatif
  (« 2 hours ago ») à l'absolu (« 12 Apr 2022, 5:46 PM ») : c'est notre recommandation.
- **Vu, anti-exemple** : Autotrader affiche « 77 weeks ago ». Le relatif sans bascule vers
  l'absolu devient illisible.
- **Vu** : la majorité des listes de recherches récentes n'affichent **aucune date** (Uber Eats,
  Cosmos, Indeed, Gumtree, Quick Search, Untitled).
- **Verdict** : le groupement par date est minoritaire mais présent dans les historiques longs
  (palettes IA, navigateur). Pour nous : date à droite (conforme à 4 exemples), relatif court
  puis date absolue au-delà de quelques jours. En-têtes Today / Yesterday : optionnels, plutôt
  utiles si la liste dépasse un écran ; pas de preuve forte.

### (d) Troncature « +N »

- **Vu** : **0 sur 42** éléments d'historique utilisent « +N ». Les seuls « +N » vus sont hors
  historique (onglets « +3 More » dans Twenty, tags de la galerie Collect UI).
- **Vu** : troncature par ellipse sur une ligne dans 4 exemples (Grok, Overwatch, Untitled,
  Twenty). Critères complets en infobulle dans 1 (Advanced Search). Autotrader affiche 5 critères
  sans tronquer, sur une ligne mobile.
- **Verdict** : « +N » n'a pas de précédent. Ellipse sur une ligne + texte complet au survol et au
  focus est le pattern vu. Le badge « nombre de critères » (gal-09) est une alternative si la
  place manque. Recommandation du premier rapport à corriger : préférer ellipse + infobulle à
  « +N » (inférence, à tester avec des cas réels longs).

### (e) Anatomie d'un élément d'historique

- **Icône à gauche** : 30 sur 42. Recherche passée : horloge ou loupe générique ; objet : icône de
  type ou avatar. 4 sans icône du tout (Indeed, Gumtree, Autotrader, Saved Filters).
- **Lignes** : 1 ligne dans 19 exemples (surtout requêtes texte et palettes), 2 lignes dans 17
  (objets et recherches structurées), 3 lignes dans 3 (Indeed, Autotrader, Overwatch).
- **Type en texte** : 4 l'écrivent en gris à côté du nom (Twenty « · Company », Quick Search
  « (City) », Omnisearch en gras en L2, Billie en L2). 6 le portent par en-têtes de groupe. Sinon
  icône seule (search palette gal-17).
- **Actions** : « Clear » ou « Clear all » au niveau de la section dans 8 ; × par ligne dans 6
  (Heena, Billie, Search Modal, Quick Search, Indeed, macOS), visible en permanence dans tous ces
  cas (pas seulement au survol) ; flèche ↗ ou chevron d'ouverture dans 7 ; menu ⋮ / ⋯ dans 2
  (Custom Panel, Autotrader) ; enregistrer depuis le récent dans 1 (Advanced Search) ; Undo après
  suppression dans 1 (Indeed, P). Survol = fond gris de ligne dans 5.
- **Filtre de type** : 10 exemples ont des onglets ou puces All / type (Uber Eats, Teams, Zoho,
  Quick Search, Creative Directory, search palette, CRM, Shift, HR, Zeus). 3 les posent **au-dessus
  de la liste de récents** (Uber Eats, Quick Search, Creative Directory). État vide propre au
  filtre : Teams (gal-18, « Try your search in other tabs »).
- **Verdict** : notre anatomie (icône, L1 gras + type gris, L2 critères, date à droite) est
  conforme au pattern majoritaire des éléments à 2 lignes. Deux écarts à trancher : × par ligne
  visible en permanence est plus fréquent que « au survol seulement » ; Undo après suppression
  (Indeed) est un bon filet.

## 4. Ce qui confirme, ce qui contredit

### Confirme (vu)

- Liste unique chronologique + type en texte gris + filtre All / types : Quick Search (gal-08),
  qui montre même côte à côte la version groupée par type et la version liste unique filtrable.
  Twenty (P, gal-04) : liste mixte, type en gris après le nom.
- Ligne 2 de critères seuls, séparateur unique : Autotrader (P, gal-01), Gumtree (P, gal-03),
  Omnisearch (gal-07).
- Date à droite en format relatif court : Grok (P), Overwatch, Shift.
- Filtre de type au-dessus des récents : Uber Eats (P), Quick Search, Creative Directory.

### Contredit ou nuance (vu)

- Recherches passées et objets consultés sont presque toujours séparés et de forme différente
  (6 sur 7). La carte unique ne contredit pas cela grâce aux onglets, mais un fil mixte
  (Favorites) n'a pas de précédent propre.
- La plupart des historiques de recherche sont plus pauvres que notre carte : requête seule, une
  ligne, pas de date. Notre carte est plus dense que la norme, ce qui est cohérent avec un public
  d'analystes mais demande une hauteur fixe et une ligne 2 discrète.
- « +N » : aucun précédent ; ellipse + infobulle domine.
- Les recherches enregistrées (Saved filters, Views) portent un nom choisi, pas un résumé de
  critères. Si Favorites contient des recherches, prévoir le renommage ou un titre généré
  (Autotrader génère « Upto 200 miles from N19 4PQ »).

### Inférences (non vues)

- Pour une police avec plusieurs statuts, condenser les statuts multiples en une valeur
  (« 3 statuses ») plutôt qu'énumérer.
- En-têtes Today / Yesterday utiles seulement au-delà d'une vingtaine d'éléments.
- Le libellé « type de recherche » (Company ID, Open policy) joue le rôle de l'horloge des
  exemples pour signaler une recherche passée.

## Niveau de confiance

Moyen (~65 %). Bonne preuve visuelle pour (a), (b) et (e) ; preuve faible pour (c) (3 exemples) ;
preuve négative pour (d). Limites : 30 des 42 exemples sont des concepts, les produits vus sont
grand public ou mobiles, aucune galerie B2B ne s'est ouverte sans compte.
