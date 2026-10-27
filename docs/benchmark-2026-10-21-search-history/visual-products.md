# Benchmark visuel : historique de recherche dans des produits réels (2026-10-21)

Complément visuel de `report.md`. Décision évaluée : carte unique indépendante du type d'objet
(icône d'objet ; ligne 1 = ce qu'on a cherché en gras + type de recherche en gris ; ligne 2 =
seuls critères renseignés ; date à droite), un seul fil chronologique, filtre All / Buyers / Policies,
sous le formulaire, dans 3 onglets Recent search / Recently viewed / Favorites.

## 1. Méthode

- Outil : Edge headless piloté par Playwright (scripts maison dans `~/bench-shots/`). Recherche
  web texte (Bing, DuckDuckGo) inutilisable (résultats hors sujet ou captcha). Recherche
  d'images Bing exploitable : elle donne la page source et l'URL de l'image ; chaque image a été
  rendue dans une page vierge puis capturée et regardée une par une.
- Sources : pages d'aide officielles (Zendesk, Atlassian, Notion, Linear, Crunchbase, Apollo,
  Shopify, Material 3, Figma), changelogs et blogs produit (Linear, GitHub, Slack, Attio, Algolia),
  issues GitHub (Kibana), blogs de tutoriels avec captures (Salesforce, Pipedrive, Sales
  Navigator, ZoomInfo, Gmail, Drive, YouTube, voyages), étude de cas d'un designer (Airbnb).
- Volume : environ 140 images ouvertes, **38 produits regardés en image**, dont **33 montrent une
  UI pertinente** (récents, historique, recherches enregistrées, ou au moins l'anatomie d'une ligne
  multi-types). 20 captures retenues dans `shots/prod-NN-*.png`.
- Concurrents directs : rien d'exploitable. Allianz Trade (écran de connexion seulement), Coface
  (aucune capture d'UI publique), Creditsafe (formulaire et tableau de résultats, pas
  d'historique), D&B Hoovers (liste de résultats, pas d'historique). Le plus proche du métier :
  **Orbis (Moody's / Bureau van Dijk)**, base d'entreprises utilisée en analyse crédit.
- Limites : captures souvent anciennes (2016 à 2024), parfois des maquettes de communication
  (Notion, Rovo, Linear) ; GIF lus image par image ; aucune interaction réelle (survol, focus)
  possible, donc les actions au survol ne sont vues que sur des lignes déjà actives à la capture.
- Convention : **vu** = visible sur une capture ; **inférence** = déduction de ma part.

## 2. Tableau d'observations

Légende : L = nombre de lignes de texte par élément.

| # | Produit | Source (page) | Ce qu'on voit | Capture |
|---|---|---|---|---|
| 1 | Algolia Autocomplete (plugin recent searches) | algolia.com/doc/ui-libraries/autocomplete/introduction/sandboxes | Requête passée mêlée aux suggestions ; icône horloge vs loupe ; L1 ; sur la ligne active : corbeille + flèche « remplir le champ » ; pas de date | (non copiée) |
| 2 | Algolia DocSearch | github.com/algolia/autocomplete (media/showcase) | Sections **Recent** et **Favorites** ; Recent = pages ouvertes (pas des requêtes) avec icône horloge ; L1 ou L2 (titre + rubrique grise) ; étoile + × sur chaque ligne ; pas de date | prod-01 |
| 3 | Zendesk Support | support.zendesk.com (What's new Feb 2024, Searching Zendesk Support data) | Sections **Recently viewed** et **Recently searched** ; vus = icône de type (personne, ticket, article) ; recherches = icône historique ; L2 : titre puis date relative (« 30 minutes ago », « yesterday », « 1 month ago », puis absolue « 10/08/2023 ») ; titre tronqué en gardant l'ID (« Incorrect Order... • #112345 ») ; filtres suggérés par type (Tickets, Users, Articles, Organizations) | prod-02 |
| 4 | Atlassian Rovo / Confluence | support.atlassian.com/rovo/docs/search | **Recently viewed** mélangé (Jira, Confluence, Goal, Project) ; icône de type ; L1 titre gras, L2 grise « Jira · Bug · Équipe / Espace » ; date à droite avec verbe (« Viewed yesterday », « Viewed 3 days ago », « Updated Oct 2, 2023 ») ; « Filter by » en pied | prod-03 |
| 5 | Linear | linear.app/releases/2021-06, linear.app/docs/search | **Recent searches** (loupe + requête, L1) séparé de **Recent issues** (ID gris + icône de statut + titre, L1) ; pas de date | prod-04 |
| 6 | Dynamics 365 (relevance search) | strategy365.co.uk (new relevance search experience) | **Recent searches** (horloge + requête) au-dessus des enregistrements récents groupés par entité (« Accounts », avatar à initiales) ; L1 | prod-05 |
| 7 | Notion (Search / Quick Find) | notion.com/help/search ; notiongot.com ; notiontour.com | Groupes **Today** / **Past Week** ; icône de page ; titre gras + emplacement gris sur la même ligne ; date à droite seulement pour les groupes anciens (« Jan 18 ») ; ↵ sur la ligne active ; filtres en puces (Created by, Teamspace, In, Date) | prod-06 |
| 8 | Google Drive (Recent) | makeuseof.com (Drive search tips, 2025) ; comprompt.co.in (2015) | Groupes **Today** / **Yesterday** / **Earlier this year** ; icône de type ; heure pour aujourd'hui (« 13:19 »), date au-delà (« 2 Sept ») ; version 2015 : verbe à côté de la date (« Opened by me », « Modified by me ») ; filtre **Type** en puce | prod-07 |
| 9 | Pipedrive | marksgroup.net (Recently viewed records, Search bar) | **Recently viewed** mélangé (deal, lead, personne, organisation) ; icône de type ; L1 titre gras, L2 grise « $1 · Jesse Hagedorn · Sage & Spruce LLC » ; badge statut « LOST » ; pas de date. Résultats : filtre de type en colonne gauche (All categories, Deals, Leads, People, Organizations), « 3 more matches found in notes » | prod-08 |
| 10 | Salesforce Lightning | tech.co (Salesforce review) ; salesforce.stackexchange.com/q/237768 ; trailhead (nav setup) ; salesforcethinkers | **Recent Records** mélangé : icône d'objet colorée + nom, colonne **Type** en texte (Dashboard, Lead, Account…) ; carte d'accueil « Recent Records » L1 ; portée de recherche « All ▾ » (Accounts, Campaigns…) ; résultats groupés par objet | prod-09 |
| 11 | LinkedIn Sales Navigator | evaboot.com/blog/linkedin-sales-navigator-saved-searches | **Saved searches** séparées en onglets **Lead / Account** ; nom en gras, « Viewed 11/1/2023 », puis critères renseignés seulement, un par ligne « Clé : valeur » (Company headcount: 1-10 ; HQ location: United States…) ; « 37 new results since 8/29/2023 » ; nom auto « 1-10, United States, "Head of Sa... (4 filters) » | prod-10, prod-11 |
| 12 | Airbnb (refonte 2016, étude de cas du designer) | karrisaarinen.com/airbnb | Recherches récentes sous le champ : lieu en noir + pays gris, puis à droite « Oct 27 – Oct 29 · 1 guest · 3 filters » ; L1 ; pas d'icône | prod-12 |
| 13 | Booking.com | travelpayouts.com (dynamic content) | **Your recent searches** sous le formulaire, en cartes : vignette, destination en gras, L2 « 20 Mar–27 Mar, 1 person » | prod-13 |
| 14 | Expedia (portail Chase) | millionmilesecrets.com (Chase portal powered by Expedia) | **Your Recent Searches** : nom, « 3 nights (May 23 - May 26) », lieu ; × de suppression toujours visible | prod-14 |
| 15 | Indeed (2018) | makeuseof.com/tag/search-jobs-indeed | **Recent Searches** sous le formulaire : « content writer - Vancouver, BC » (quoi - où) + « 87 new » + lien « clear » global | prod-15 |
| 16 | Skyscanner (mobile) | blog.mirajavora.com/projects | « Recent searches and Price Alerts » en cartes : destination, « from Prague », dates aller / retour, cloche | (non copiée, image minuscule) |
| 17 | Kibana / Elastic | github.com/elastic/kibana/issues/19144 et /134587 | **Recently viewed** en ligne horizontale tronquée (« Cassandra RequestCoun... ») + « **4 more** ▾ » ; sans icône (l'issue 134587 demande justement d'ajouter les icônes d'objet) | prod-16 |
| 18 | Crunchbase | support.crunchbase.com (Where can I find my saved lists and searches) | Puces **All (42) / Saved Searches (20) / Lists (22)** ; liste mélangée triée par « Recently Viewed » ; icône de nature + nom + (nb de résultats) + colonne **Type** (« Saved Search (Query Builder) », « List ») ; badge « 111 additions » ; nom tronqué « … » | prod-17 |
| 19 | Orbis (Moody's / BvD) | wu.ac.at (Orbis Bank Focus) ; gzconsulting.org ; libraryguides.vu.edu.au | Onglets **Search / Saved searches / Favourites / History** ; stratégie de recherche = liste numérotée de critères « Status: Active companies », « NACE Rev. 2: 511 », « World region: European Union » ; nouvelle UI « Load a search » | prod-18 |
| 20 | ZoomInfo | evaboot.com/blog/how-to-use-zoominfo ; spekit.com | Menu « Open Search » : **Saved Searches**, **Recent Searches**, **Recently Viewed Contacts**, **Recently Viewed Companies** séparés ; bloc « Recent Saved Searches » sur l'accueil | prod-19 |
| 21 | Gmail | androidauthority.com (delete Gmail search history) | Horloge + requête, L1 ; × sur la ligne survolée ; puces de filtre au-dessus (Has attachment, Last 7 days, From me) | prod-20 |
| 22 | Shopify admin | help.shopify.com (admin overview) | **RECENT SEARCHES** (requête seule) + « Clear history » ; puces de type (Sales channels, Apps) | (non copiée) |
| 23 | Material 3 (Search) | m3.material.io/components/search/guidelines | Icône historique pour les requêtes passées, séparées des suggestions et des contacts ; L1 | (non copiée) |
| 24 | Slack | wrangle.io (Slack tips) ; slack.com blog (simplified search) | Menu Recent (horloge) mélangé : DM, canal, Saved items ; icône de type ; L1. Requête avec modificateurs « world cup ad from:@Paige Robinson fro... » tronquée | (non copiée) |
| 25 | Jira Data Center (quick search) | confluence.atlassian.com (Quick searching, 9.12) | Récents groupés par type : ISSUES puis PROJECTS ; icône de type ; L2 (titre, clé « TIS-4 » ou « Software ») ; « View all issues » | (non copiée) |
| 26 | YouTube | idownloadblog.com (watch history) | Historique groupé **Today** ; « Clear all watch history » | (non copiée) |
| 27 | Chrome | technewstoday.com (Chrome history by date) | Groupes « Today - Monday, September 26, 2022 », heure à gauche | (non copiée) |
| 28 | HubSpot | knowledge.hubspot.com (search within your account) ; blog.actuado.com | Résultats groupés par type (Contacts, Meetings, Notes) + « Filter by » en boutons ; historique non visible dans les GIF | (non copiée) |
| 29 | Apollo.io | knowledge.apollo.io (Search filters overview) | Onglets Search / Saved searches ; compteur « Filters 5 » ; critères en puces sous chaque filtre | (non copiée) |
| 30 | GitHub (code search) | github.blog/changelog/2022-11-09 | Requête avec qualificatifs en jetons (« repo: vuejs/vue reactive ») ; portée en texte gris à droite | (non copiée) |
| 31 | Raycast | manual.raycast.com/file-search | L1 : titre + sous-titre gris sur la même ligne (« ~/Documents ») | (non copiée) |
| 32 | Attio | attio.com/changelog | Palette groupée (NOW, COMPANIES, QUICK ACTIONS), pas d'historique visible | (non copiée) |
| 33 | Figma | help.figma.com (Guide to the file browser) | Entrée « Recents » / « Recently viewed », détail illisible | (non copiée) |
| 34 à 38 | Creditsafe, D&B Hoovers, Allianz Trade, Coface, Zillow | docs.cosmoconsult.com ; creditsafe.com ; community.dnb.com ; assurance-credit-entreprise.fr ; zillow.zendesk.com | Aucun historique visible (formulaires, résultats, connexion, « Save search ») | (non copiées) |

## 3. Réponses aux trous (a) à (e)

### (a) Une ligne 2 qui résume les critères d'une recherche passée

- **Vu** : parmi les 15 produits qui affichent des recherches passées comme éléments de liste,
  **6 résument des critères** : Sales Navigator, Airbnb, Booking, Expedia, Indeed, Skyscanner
  (Orbis montre la même chose dans sa « search strategy », pas dans la liste). Les 9 autres
  (Algolia, Dynamics, Linear, Zendesk, Gmail, Shopify, Material 3, Crunchbase par son nom, Slack)
  n'affichent que la requête texte.
- La ligne de critères apparaît **exactement quand la recherche est un formulaire multi-champs**
  (voyage, emploi, prospection B2B). Les moteurs plein texte n'en ont pas besoin. Notre
  formulaire est multi-champs : on est dans le bon cas.
- Formats vus :
  - terme principal en gras, critères en gris derrière ou dessous (Booking « Irkutsk » /
    « 20 Mar–27 Mar, 1 person » ; Airbnb « Helsinki Finland … Oct 27 – Oct 29 · 1 guest ») ;
  - séparateurs : « · » (Airbnb, Pipedrive, Rovo), « , » (Booking), « - » (Indeed) ;
  - seuls les critères renseignés (Sales Navigator, Booking, Indeed) ;
  - valeurs seules (Airbnb, Booking, Indeed) contre « Clé : valeur » (Sales Navigator, Orbis,
    quand les critères sont nombreux et ambigus sans libellé).
- **Verdict** : la ligne 2 est confirmée, sur 6 produits sur 15. Le précédent le plus proche est
  Sales Navigator (base d'entreprises, critères filtrés). Deux nuances.
  1. Des valeurs seules ne marchent que si chacune se lit sans libellé (« France »,
     « Active », « Paris »). Une valeur ambiguë (un code, un nombre, « 01 ») a besoin d'un
     libellé court : « Ext. 01 » le fait déjà. **Inférence** : garder le libellé pour les valeurs
     non parlantes, pas pour les pays ni les statuts.
  2. Le « · » est le séparateur le plus courant en produit B2B (Pipedrive, Rovo, Airbnb).

### (b) Distinguer une recherche passée d'un objet consulté

- **Vu** : 6 produits montrent à la fois des recherches et des objets : Dynamics, Linear,
  Zendesk, ZoomInfo, Orbis, Crunchbase. **6 sur 6 les distinguent** ; **5 sur 6 les rangent dans
  des sections ou onglets distincts** (Zendesk « Recently viewed » / « Recently searched »,
  Linear, Dynamics, ZoomInfo, Orbis « Saved searches / Favourites / History »). Seul Crunchbase
  mélange recherches et listes dans une liste, mais avec une icône de nature et une colonne
  « Type » en texte.
- Code visuel : pour une recherche, icône horloge ou historique (Algolia, Dynamics, Zendesk,
  Gmail, Material 3 : 5 produits) ou loupe (Linear). Pour un objet, icône de type (Zendesk,
  Rovo, Pipedrive, Salesforce, Jira, Slack, Notion, Drive). Contre-exemple : DocSearch met
  l'horloge sur des pages consultées. Drive et Rovo ajoutent un verbe à la date (« Opened by
  me », « Modified by me », « Viewed yesterday », « Updated Oct 2 »).
- **Verdict** : nos onglets séparent déjà Recent search et Recently viewed, ce que font 5
  produits sur 6. Le risque reste à deux endroits.
  1. **Favorites**, s'il mélange des recherches enregistrées et des objets : il faut le modèle
     Crunchbase (icône de nature + type en texte). **Inférence.**
  2. **Même carte, même icône d'objet dans les trois onglets** : aucun produit vu ne donne à une
     recherche passée la même icône qu'à l'objet consulté. Ils utilisent tous l'horloge ou la loupe
     pour la recherche. **Inférence** : la ligne 1 « Company ID » / « Open policy » aide, mais le
     verbe ou l'icône devrait porter la nature (par ex. date « Searched 2 h ago » contre « Viewed
     2 h ago », ou badge loupe sur l'icône d'objet).

### (c) Groupement par date (Today / Yesterday)

- **Vu** : **4 produits** groupent par date : Notion (Today / Past Week), Google Drive
  (Today / Yesterday / Earlier this year), YouTube (Today), Chrome (Today + date). Tous sont des
  historiques longs en page pleine, ou le Quick Find de Notion.
- Aucun des récents courts ne groupe par date (environ 20 produits) : Zendesk, Rovo,
  Pipedrive, Linear, Dynamics, Salesforce, Gmail, Algolia, Booking, Sales Navigator, Crunchbase… Ils
  mettent une date par ligne, ou pas de date du tout.
- Quand il y a des groupes, la date de ligne est allégée. Drive met l'heure seule pour Today
  (« 13:19 ») et une date courte au-delà (« 2 Sept »). Notion n'affiche aucune date dans Today et
  une date courte dans Past Week (« Jan 18 »). Aucun produit ne combine en-tête de groupe et date
  relative complète sur chaque ligne.
- **Verdict** : le groupement est optionnel. Il se justifie au-delà d'une vingtaine
  d'éléments ou sur plusieurs jours. Si on groupe, on raccourcit la date de ligne (heure pour
  Today, date courte au-delà), sinon c'est redondant. Pas de groupement dans Favorites :
  Crunchbase et DocSearch trient ou listent sans date. **Inférence**, cohérente avec ce qui est
  vu.

### (d) Troncature et « +N »

- **Vu** : l'ellipse est courante (au moins 6 produits : Zendesk, Crunchbase, Sales Navigator,
  Kibana, Slack, Algolia DocSearch). Un compteur du reste apparaît sur **4 produits** :
  Sales Navigator « … (4 filters) », Airbnb « · 3 filters », Kibana « 4 more ▾ », Pipedrive
  « 3 more matches found in notes ».
- **Aucun produit vu n'utilise un badge « +N »**. Le compte est écrit en mots (« 3 filters »,
  « 4 more »), et chez Sales Navigator il donne le total des critères, pas le nombre de masqués.
- Zendesk tronque le texte libre et garde l'identifiant visible (« Incorrect Order... •
  #112345 »).
- **Verdict** : la troncature est confirmée. Le compteur est confirmé aussi, mais écrit en mots
  plutôt qu'en badge. Recommandation (**inférence**) : afficher en clair les 2 ou 3 critères les
  plus discriminants, puis « · 2 more » en gris, avec la liste complète dans une infobulle. Ne
  jamais tronquer l'identifiant (Company ID, numéro de police) : tronquer d'abord le texte libre
  (nom, ville).

### (e) Anatomie d'un élément d'historique

| Élément | Fréquence vue | Exemples | Pour notre carte |
|---|---|---|---|
| Icône à gauche | 16 sur 20 listes d'historique ou de récents | type d'objet : Salesforce, Pipedrive, Zendesk, Rovo, Jira, Slack, Notion, Drive, Crunchbase ; nature (horloge) : Algolia, Dynamics, Zendesk, Gmail, Material 3 ; sans icône : Kibana (icônes demandées depuis), Sales Navigator, Indeed, Shopify | Confirmé |
| 2 lignes | 8 (Zendesk, Rovo, Pipedrive, Jira, Booking, Expedia, Sales Navigator, DocSearch parfois) contre 11 sur une ligne (Linear, Dynamics, Gmail, Algolia, Salesforce, Slack, Notion, Kibana, Shopify, Indeed, Airbnb) | Les listes à une ligne sont des requêtes texte ou des noms d'objet ; les 2 lignes servent quand il y a du contexte (critères, attributs, emplacement) | Confirmé pour notre cas multi-critères |
| Ligne 2 = attributs en gris séparés par « · » | Rovo, Pipedrive, Airbnb | « Jira · Bug · Team / Space » ; « $1 · Jesse Hagedorn · Sage & Spruce LLC » | Confirmé, c'est le format le plus proche |
| Type d'objet écrit en texte | Rovo (ligne 2), Salesforce et Crunchbase (colonne Type), Zendesk (filtres) | Pipedrive, Notion, Slack n'ont que l'icône | Confirmé : icône + texte |
| Date | 5 sur 20 l'affichent par ligne : à droite (Rovo, Notion, Drive en colonne), en ligne 2 (Zendesk, Sales Navigator). Les autres n'en ont pas | Relative récente (« 30 minutes ago », « yesterday ») puis absolue (« 10/08/2023 », « Oct 2, 2023 ») ; verbe (« Viewed », « Updated ») | Date à droite confirmée (modèle Rovo) ; ajouter le verbe (inférence) |
| Actions sur la ligne | Au survol ou sur la ligne active : Algolia (corbeille, remplir), Gmail (×), Notion (↵), DocSearch (étoile, ×). Toujours visibles : Expedia (×) | Effacement global : Indeed « clear », Shopify « Clear history », YouTube « Clear all » | Confirmé : × et étoile au survol et au focus, « Clear all » global |
| Compteur de nouveautés | Sales Navigator (« 37 new results since »), Indeed (« 87 new »), Crunchbase (« 111 additions ») | Sur des recherches enregistrées ou récentes | Idée hors périmètre (inférence) |
| Statut en badge | Pipedrive (« LOST ») | | Possible pour une police (Active / Expired), à ne pas confondre avec les critères |

## 4. Ce qui confirme, ce qui contredit

### Confirme (vu)

1. **Liste mixte multi-types en ordre chronologique** : 8 produits (Salesforce Recent Records,
   Pipedrive, Rovo, Zendesk Recently viewed, Slack, Notion, Drive, Crunchbase).
2. **Icône de type + titre gras + ligne 2 grise d'attributs + date à droite** : Rovo
   (prod-03) est presque notre carte ; Pipedrive (prod-08) pareil sans la date.
3. **Ligne 2 = critères renseignés d'une recherche passée** : 6 produits, dont un B2B de
   prospection d'entreprises (Sales Navigator, prod-10).
4. **Section d'historique sous le formulaire** : Booking, Indeed, Expedia (prod-13 à 15).
5. **Filtre de type au-dessus d'une liste unique** : Crunchbase (All / Saved Searches / Lists
   avec compteurs), Drive (Type), Notion, Zendesk, Salesforce (portée « All ▾ »), Pipedrive,
   HubSpot.
6. **Trois onglets historique / enregistrées / favoris** : Orbis (Moody's), seul produit vu du
   monde du risque crédit, a « Saved searches / Favourites / History » (prod-18).

### Contredit ou nuance (vu)

1. **Séparation par type chez les bases B2B les plus proches** : Sales Navigator sépare Lead
   et Account en onglets, ZoomInfo sépare Contacts et Companies, Jira DC groupe Issues /
   Projects, Dynamics groupe par entité (4 produits contre 8 qui mélangent). Notre filtre
   All / Buyers / Policies couvre ce besoin, mais il faut l'afficher clairement et le
   mémoriser (inférence).
2. **Recherche passée et objet consulté ne partagent jamais la même icône** (voir b) : une carte
   unique avec icône d'objet partout va à l'encontre de tout ce qui est vu. À compenser par le
   verbe de date ou un badge (inférence).
3. **Pas de « +N » en badge** : le compte est écrit en mots.
4. **La date n'est pas systématique** : la plupart des récents courts n'en ont pas. Elle reste
   utile chez nous parce que la section est une page d'historique, pas un menu déroulant
   (inférence).

### Niveau de confiance

- Anatomie et ligne 2 de critères : **élevé** (plusieurs captures nettes et concordantes).
- Distinction recherche / objet : **élevé** sur le constat, **moyen** sur le remède
  (verbe ou badge : inférence).
- Groupement par date : **moyen** (4 exemples, tous en historique long).
- « +N » : **moyen** (4 exemples, aucun en badge).
- Concurrents directs (Allianz Trade, Coface, Creditsafe, D&B) : **aucune preuve** ; Orbis est
  le seul analogue métier, et ses captures datent.
