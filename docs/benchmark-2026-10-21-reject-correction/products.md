# Benchmark visuel : corriger un enregistrement rejeté (produits réels)

Date : 2026-10-21. Zone : produits où l'on corrige des enregistrements rejetés ou invalides.
Question : comment grouper les erreurs d'un rejet (écran 1) et comment organiser l'écran de correction,
sous deux contraintes fermes ajoutées en cours de route :

1. **Pas de hub-and-spoke** (récap, entrer dans une catégorie, revenir, entrer dans la suivante).
2. **Volume** : un rejet compte 60 à 80 champs, dont une partie seulement en erreur (ex. 12).

## Méthode

- Pas de moteur de recherche. Point d'entrée : recherche d'images Bing (Edge headless), 45 requêtes,
  une planche de 12 vignettes par requête, puis récupération en pleine taille des images utiles
  (`~/bench-shots/rcsheet.js`, `rcget.js`).
- Sources : aide officielle (HubSpot, Tipalti, Sonar, Ataccama, GOV.UK, SAP Community), tutoriels
  d'intégrateurs, fiches GetApp, forums vendeurs. Aucun compte produit n'a été ouvert : on voit ce que
  les captures publiques montrent, rien de plus.
- 34 produits regardés en image, 20 captures retenues dans `shots/` (`pc-01` à `pc-20`).
- **Vu** = lisible sur la capture. **Inf.** = inférence (connaissance du produit, capture partielle,
  ou annotation de tutoriel qu'on ne peut pas distinguer de l'UI).
- Limites : certaines captures datent (SAP AIF 2016, Ariba 2016) ; plusieurs vignettes SAP Community
  ne se chargent qu'en basse définition (403 sur l'original), donc lues à la vignette. Les cadres
  rouges ou jaunes des tutoriels (Chorus Pro, Tipalti, Ariba) sont des annotations, pas l'UI.
- Biais : la zone mélange des contextes **mono-enregistrement** (une facture, une fiche, ce qui
  ressemble à notre modale de rejet) et **multi-enregistrements** (import CSV, catalogue, site web).
  La synthèse les sépare parce qu'ils ne groupent pas de la même façon.

---

## Tableau A : groupement des erreurs (équivalent écran 1)

Ctx : **M** = mono-enregistrement (un objet, N erreurs), **L** = lot (N objets).

| # | Produit | Ctx | Source (page où l'image a été trouvée) | Groupement 1er niveau | 2e niveau | Contenu d'une ligne de groupe | Statut |
|---|---|---|---|---|---|---|---|
| 1 | SAP Ariba, Invoice Reconciliation | M | slidetodoc.com/invoicing-resolve-invoice-exceptions-access-an-invoice-with | **Type d'exception** (PO Quantity Variance, Price Variance, Tax Variance, Received Qty) | aucun (onglets « Assigned to me (1) / All Exceptions (1) ») | titre du type, n° de ligne, valeur facturée vs attendue (5 vs 4), statut « Open », menu Action | Vu (pc-01) |
| 2 | SoftCo AP, Exceptions | M | financesonline.com/softco-pricing | pas de liste : exception posée **sur la ligne** de facture (cellule orange) | aucun | code + titre (« 10500 PO Row price tolerance exceeded »), écart attendu, étapes suggérées | Vu (pc-03) |
| 3 | Oracle Fusion Payables | M | rpforacle.blogspot.com/2018/03/creating-payables-invoice-in-oracle-fusion.html | panneau « Invoice Summary » : Status puis **Holds par type** (Line variance, Distribution variance, Manual, System, Supplier site) | aucun | libellé + compteur, coche verte quand 0 | Vu (pc-04) |
| 4 | Tipalti, Invoice review | M | help.tipalti.com/hc/en-us/articles/30718223367703 | pas de récap d'erreurs ; formulaire en **sections** (Supplier & approver, General, Bill approval, totaux) | aucun | n/a | Vu (pc-05) ; surlignage jaune = annotation (Inf.) |
| 5 | SAP Fiori, Message Popover (design system) | M | community.sap.com/…/qaq-p/12390967 | **Section du formulaire** (en-tête de groupe « Personal, General Data ») | aucun ; **filtre gravité** All / Error / Warning / Success / Info avec compteurs | icône gravité + message + nom du champ, chevron vers le champ | Vu (pc-06) |
| 6 | SAP AIF, Monitoring & Error Handling | L | community.sap.com/…/monitoring-and-error-handling-for-interfaces-in-aif/ba-p/13176468 | **Arbre** : namespace (ZFI Finance (28), ZPR Procurement (61)) | interface, puis message | **colonnes de compteurs par statut** (erreurs, warnings, succès, info) | Vu à la vignette (pc-07) |
| 7 | Chorus Pro, facture à recycler | M | communaute.chorus-pro.gouv.fr/comment-traiter-une-facture-qui-mest-renvoyee | pas de liste : **motif en tête** (« Motif de demande de recyclage : vous n'avez pas indiqué le bon destinataire ») | aucun | n/a | Vu à la vignette (pc-08) |
| 8 | SPS Commerce (EDI), Certification | M | getapp.com.au/software/1426/sps-commerce | **liste plate numérotée** (1, 2, 3) dans un panneau « Errors » | aucun | « Validation Error », champ (BuyerPartNumber), **valeur envoyée** ('12'), valeurs attendues, segment / élément | Vu (pc-09) |
| 9 | Amazon Seller Central, édition d'offre | M | youtube.com/watch?v=VeXJb4XNfk4 | **Onglets = sections** (Vital Info, Variations, Offer, Images, Keywords), pastille d'erreur sur l'onglet concerné | aucun | compteur global en bannière « Fix 2 errors before submitting your listing » | Vu (pc-10) |
| 10 | Amazon Seller Central, Fix Your Products | L | sellercentral.amazon.com/seller-forums/discussions/t/78d9aa3c… | **Raison** en facettes (Search Suppressed (8) > More Information Required (7), Invalid Information (1)) | aucun | compteur ; ligne = produit + badge « Missing info » + description | Vu (pc-11) |
| 11 | Google Merchant Center, fiche produit | M | webappick.com/most-common-price-errors-in-google-merchant-center | onglet « Needs attention (8) », **accordéon par problème** | aucun | titre (Missing product price) + **impact** (« Prevents from showing in United States ») | Vu (pc-12) |
| 12 | Google Merchant Center, liste produits | L | digitalcommerce.com/google-shopping/optimize-product-attributes | **cartes par type de problème** (Missing value [availability], [image link]…) | produits impactés | **nb de produits impactés**, liens « View fix / View products » | Vu |
| 13 | Google Search Console, Page indexing | L | ibeamconsulting.com/blog/fix-google-deindexed-pages | **Raison** (Page with redirect, Excluded by noindex…) | exemples d'URL (écran suivant) | source (Website / Google systems), statut de validation, tendance, **nb de pages** (0 affiché aussi) | Vu (pc-13, pc-14) |
| 14 | Meta Commerce Manager, Issues | L | help.godatafeed.com/…/360048376912 | **domaine** (Catalog) puis **type** (Missing or invalid information, Items not showing) | aucun | icône gravité, explication, nb d'items (« 12 or more items »), bouton Review ; filtre Errors | Vu (pc-15) |
| 15 | HubSpot, import errors | L | knowledge.hubspot.com/import-and-export/troubleshoot-import-errors | table : colonne du fichier × **type d'erreur** | aucun | objet, propriété, type (Invalid enumeration option), **impact** (« 2 values not imported ») | Vu |
| 16 | HubSpot, Fix errors | L | blog.actuado.com/en/fix-import-errors-in-hubspot-without-ever-leaving-the-platform | **type d'erreur** (« Replace the unmatched association label… ») | **valeur distincte** du fichier | valeur, nb de lignes, liste « Replace with » | Vu (pc-16) |
| 17 | Ryerson (B2B métaux), Bulk Upload | L | ryerson.com/metal-resources/references/faq | **liste plate** des lignes en erreur | aucun | n/a | Vu (pc-17) |
| 18 | Surecomp RIVO (trade finance), Bulk upload | L | rivo-support.surecomp.com/…/13530967718033 | **Enregistrement** (Record 1 : 1 warning, 4 errors ; Record 2 : 2 errors), dépliable | erreurs | compteurs par gravité dans le libellé | Vu (pc-18) |
| 19 | Accelerate (LMS), Import users | L | training.accelerate.education/knowledgebase/create-users | liste plate, colonne Error | aucun | pied : « 5 rows / 1 error » + **toggle « Show only lines with errors »** | Vu (pc-19) |
| 20 | Toast, Platform import | L | doc.toasttab.com/doc/platformguide/platformFixingImportFailures.html | compteur seul (« Errors found : 1 ») | aucun | n/a ; procédure en 4 étapes (télécharger, corriger le fichier, réimporter) | Vu |
| 21 | Workday, demande d'absence | M | erp.umd.edu/newsroom/new-requirement-employees-multiple-jobs | **liste plate** « Errors : 1 · View All » en tête du panneau | aucun | « Page Error · Worker With Multiple Positions Missing Comment » | Vu à la vignette |
| 22 | Workday, merit (grille) | L | slideserve.com/travise/workday-merit-process-powerpoint-ppt-presentation | aucun ; **colonne « Error or Warning »** par ligne | aucun | losange rouge = critique, **bloque la soumission** ; triangle = warning, **ne bloque pas** ; compteur | Vu (pc-20) |
| 23 | Salesforce Lightning, enregistrement | M | sfdc-lightning.com/2019/09/error-handling-in-lightning-component.html | **liste plate** « We hit a snag. Review the errors on this page » | aucun | message ; champs en rouge dans la fiche | Vu |
| 24 | Salesforce, Data Import Wizard | L | tutorialkart.com/salesforce/salesforce-data-import-wizard-insert-update-upsert | fichier résultat, colonne Error | aucun | REQUIRED_FIELD_MISSING + **liste des champs** ([LastName, Company]) | Vu |
| 25 | Dynamics 365, Import job | L | encorebusiness.com/blog/how-to-import-records-d365-crm | onglets **par issue** (Failures / Success / Partial failure) | aucun | phase (Transform) + description | Vu |
| 26 | Xero, import de factures | L | fastlane-global.com/hk/blog/how-to-import-bills-into-xero | résumé (« 6 will be imported, 1 bill has errors ») | aucun | « Row 3 : ContactName cannot be empty » | Vu |
| 27 | FixMyCSV (app Shopify) | L | apps.shopify.com/csv-product-fixer | **type de correction** (Fix boolean casing · 6 fixes, Fix invalid handle · 1 fix…) | lignes | compteur, avant → après | Vu |
| 28 | VS Code, Problems | L | vscode-docs1.readthedocs.io/en/latest/editor/editingevolved | **Fichier** (app.js (5), index.js (4)) | problèmes | badge compteur ; gravité en icône et en **filtre** | Vu |
| 29 | SonarQube, Issues | L | docs.sonarsource.com/sonarqube-cloud/managing-your-projects/issues/retrieving | liste groupée par **fichier** ; facettes Software quality / **Severity** / attribut | issues | compteurs dans les facettes | Vu |
| 30 | GitHub, check annotations | L | github.com/marketplace/actions/publish-test-results | **Fichier**, puis annotation à la ligne dans le diff | annotation | gravité (warning / failure) sur l'annotation | Vu |
| 31 | Sentry, Issues | L | blog.sentry.io/the-sentry-workflow | **issue = empreinte** (type d'erreur agrégé) | événements | nb d'événements, utilisateurs, priorité | Vu |
| 32 | Ataccama ONE, Data Quality | L | docs.ataccama.com/one/latest/data-quality/data-quality-overview.html | **dimension** (Validity, Completeness, Uniqueness) et par attribut | règles | % de qualité, nb de checks | Vu |
| 33 | GOV.UK Design System | M | github.com/alphagov/govuk-design-system-backlog/issues/47 | **liste plate** « There is a problem », liens vers les champs | aucun | message = lien vers le champ | Vu |
| 34 | GOV.UK, Task list | M | tempertemper.net/portfolio/a-minimal-task-list-pattern-for-govuk | **sections** du dossier avec statut | aucun | statut (Completed / Next / Not required) | Vu à la vignette |

---

## Tableau B : écran de correction

Contenu : **Complet** = formulaire entier avec erreurs signalées dedans ; **Erreurs seules** = seuls
les champs ou lignes en erreur ; **Hors outil** = on corrige ailleurs (fichier, source) puis on relance.

| # | Produit | Contenu | Valeur rejetée affichée | Raison affichée | Nav. entre erreurs / objets | Lot | Resoumission | Un écran ou allers-retours | Contenant | Champs sans erreur accessibles par |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | SAP Ariba | Erreurs seules (onglet Exceptions), facture complète dans l'onglet Line View | Oui, facturé vs attendu (Vu) | Oui, titre du type (Vu) | non vu | non vu | bannière « The invoice is now reconciled » puis **Submit** (Vu, pc-02) | un écran, onglets | page dédiée | **onglets** (Line View, Reference, History) |
| 2 | SoftCo | Complet, erreur posée sur la cellule | Oui, 120.00 vs 90 à 110 (Vu) | Oui + **étapes de résolution** (Vu) | flèches à côté du CaseID (Vu, rôle Inf.) | non vu | « Send for Approval » (Vu) | un écran, onglets Invoice details / Matching / Coding | page dédiée | onglets |
| 3 | Oracle Fusion | Complet + panneau récap à droite | n/a | type de hold (Vu) | non vu | non vu | Invoice Actions > Validate (Vu dans une autre capture) | **un écran** : récap en panneau latéral, formulaire à gauche | page + panneau latéral | tout visible |
| 4 | Tipalti | Complet, en sections, à côté de l'image de la facture | n/a | n/a | **« 1 of 53 » ‹ ›** entre factures (Vu) | non | Submit / Save / Dispute (Vu) | un écran | page, panneau latéral de saisie | sections |
| 5 | SAP Fiori popover | Complet, champs en rouge | dans le champ (Vu) | Oui (Vu) | **clic sur un message = saut au champ** (Inf., doc) | non | Create / Save (Vu) | **un écran** : le popover se superpose au formulaire | popover sur page | sections du formulaire |
| 6 | SAP AIF | données du message en arbre + log ; édition et Restart | Oui (Inf.) | Oui, log (Vu à la vignette) | non vu | Restart sur sélection (Vu bouton) | **Restart** (Vu bouton) | un écran, panneaux | transaction plein écran | arbre de structure |
| 7 | Chorus Pro | **Complet**, sections repliables (icônes –) | dans les champs | motif en tête (Vu) | non | non | redépôt (Inf.) | un écran | page dédiée | **sections repliables** |
| 8 | SPS Commerce | document brut + liste ; pas d'édition | **Oui** ('12', '65') (Vu) | Oui + valeurs attendues (Vu) | non | non | « submit a new document test » (Vu) | un écran | page + panneau | bouton **Hide Errors** |
| 9 | Amazon, édition d'offre | **Complet**, onglets marqués | dans le champ | dans le champ (Inf.) | via les onglets marqués (Vu) | non | Save Changes (Vu) | **un écran**, onglets | page dédiée | **toggle « Advanced View »** (champs avancés masqués par défaut) |
| 10 | Amazon, Fix Your Products | **Erreurs seules, inline dans la liste** : seul le champ manquant est proposé | champ vide | Oui (Vu) | défilement de la liste | cases à cocher (Vu) | **Save par ligne**, puis « Submitted, up to 15 minutes » (Vu) | **un écran, pas de détail à ouvrir** | page liste | n/a |
| 11 | Merchant Center, fiche | aide seulement, correction dans la source | non | Oui + impact (Vu) | non | « Other products may have the same issue » (Vu) | non vu | allers-retours (source puis retour) (Inf.) | page dédiée | onglet Product details |
| 12 | Merchant Center, liste | Hors outil | non | Oui (Vu) | non | par type (Inf.) | non vu | **hub-and-spoke** : type > produits > fiche (Inf.) | page | n/a |
| 13 | Search Console | Hors outil, puis **Validate fix** | non (URL exemples) | Oui (Vu) | non | validation par raison, sur toutes les URL (Vu, pc-14) | **Validate fix** puis Pending / Failed (Vu) | **hub-and-spoke** : raison > détail > retour (Vu) | page | n/a |
| 14 | Meta Commerce | Review par type | non vu | Oui (Vu) | non vu | par type (Inf.) | non vu | hub-and-spoke (Review) (Inf.) | page | n/a |
| 15-16 | HubSpot | **Erreurs seules**, par valeur distincte | **Oui** (Value from file) (Vu) | Oui, titre du groupe (Vu) | non | **Bulk fix, Auto fix, Reset all** (Vu) | relance de l'import (Inf.) | un écran | panneau dans l'assistant | n/a |
| 17 | Ryerson | **Erreurs seules** : 4 lignes, **cellules fautives encadrées en rouge**, éditables | **Oui, dans la cellule** (Vu) | Oui, colonne Error (Vu) | non | toutes les lignes d'un coup (Vu) | **« Process Corrections & Try Again »** (Vu) | **un écran** | modale (assistant 3 étapes) | n/a |
| 18 | Surecomp RIVO | liste dépliable, pas d'édition | non vu | Oui (Vu) | non | non | Back puis nouveau fichier (Vu) | allers-retours vers le fichier | modale | n/a |
| 19 | Accelerate LMS | Complet par défaut + **toggle « Show only lines with errors »** | Oui, dans la ligne (Vu) | Oui (Vu) | non | non | Import (Vu) | un écran | modale | **toggle** |
| 20 | Toast | Hors outil | non | via fichier (Vu) | non | non | Retry import (Vu) | allers-retours | page | n/a |
| 21 | Workday, absence | Complet, panneau | dans le champ (Inf.) | Oui (Vu) | **View All** déplie la liste (Vu) | non | Submit Request (Vu) | un écran | **panneau latéral / dialogue** | défilement |
| 22 | Workday, merit | grille | n/a | au clic du compteur (Inf.) | non | grille entière | soumission bloquée si critique (Vu) | un écran | page | n/a |
| 23 | Salesforce Lightning | Complet, champs en rouge | dans le champ | Oui (Vu) | liste des erreurs en popover au pied (Vu) | non | Save (Vu) | un écran | page ou modale d'édition | sections de la fiche |
| 24-26 | SF Import Wizard, Dynamics, Xero | Hors outil (export des lignes en erreur) | non / partiel | Oui (Vu) | non | « Export Error Rows » (Vu Dynamics) | réimport | allers-retours | page | n/a |
| 27 | FixMyCSV | Erreurs seules, avant → après | **Oui, Current value** (Vu) | Oui (Vu) | non | **Apply all fixes** (Vu) | Import to Shopify (Vu) | un écran | page | n/a |
| 28-30 | VS Code, Sonar, GitHub | erreur ancrée à l'emplacement dans le code | le code | Oui (Vu) | VS Code : F8 / Maj+F8 (Inf., connu) ; Sonar : « Navigate to issue » (Vu) | Sonar : Bulk change (Vu) | n/a | un écran (liste + éditeur) | panneau bas / page | le fichier entier reste visible |
| 31-32 | Sentry, Ataccama | triage / supervision, pas de correction de champ | n/a | Oui | non | Resolve en lot (Vu Sentry) | n/a | n/a | page | n/a |
| 33 | GOV.UK error summary | Complet, une question par page | dans le champ (Vu) | Oui (Vu) | **liens du résumé vers le champ** (Vu) | non | Continue (Vu) | un écran par question | page | n/a |
| 34 | GOV.UK task list | sections, une à la fois | n/a | statut par section (Vu) | retour à la liste après chaque section | non | Submit en fin (Vu) | **hub-and-spoke assumé** (Vu) | pages | n/a |

---

## Synthèse

### 1. Axes de groupement du 1er niveau

Sur les 34 produits, 21 groupent au moins à un niveau, 13 affichent une liste plate ou une
marque par champ sans groupement.

| Axe de 1er niveau | Fréquence | Produits | Contexte dominant |
|---|---|---|---|
| **Type / raison d'erreur** | 11 / 21 | Ariba, Oracle (holds), Merchant Center ×2, Search Console, Meta, Amazon Fix Products, HubSpot ×2, FixMyCSV, Sentry (+ Ataccama par dimension, 12 / 21 si on la compte) | **lot** (9 sur 11) : le type sert à corriger N objets d'un coup |
| **Emplacement** (section, onglet, fichier, enregistrement, interface) | 9 / 21 | Fiori (section), Amazon édition (onglet), GOV.UK task list (section), RIVO (enregistrement), SAP AIF (interface), VS Code, Sonar, GitHub (fichier), Tipalti (sections sans récap) | **mono-enregistrement** dès qu'on est dans un formulaire |
| **Gravité** | **0 / 21 en 1er niveau** | présente partout comme **attribut** (icône, couleur, compteur) ou **filtre** : Fiori, Meta, VS Code, Sonar, RIVO, Workday, AIF | transverse |

Sous-ensemble **mono-enregistrement avec formulaire** (le plus proche de la modale de rejet) :
Ariba, SoftCo, Oracle, Tipalti, Fiori, Chorus Pro, SPS, Amazon édition, Merchant Center fiche,
Workday absence, Salesforce, GOV.UK ×2 (13 produits).

- Groupement par **emplacement / section** : 4 (Fiori, Amazon onglets, GOV.UK task list, Tipalti et
  Chorus Pro implicitement par les sections du formulaire).
- Groupement par **type métier** : 3 (Ariba, Oracle, Merchant Center). Chez Ariba et Oracle, le type
  est une **catégorie de contrôle métier** (variance de quantité, de prix, de taxe), pas un emplacement.
- **Liste plate** : 5 (SPS, Workday, Salesforce, GOV.UK error summary, SoftCo inline). Avec 1 à 5
  erreurs, aucun produit ne juge utile de grouper.
- **Deux niveaux empilés sur les mêmes erreurs** (statut puis typologie) : **0 sur 34**. Au mieux,
  un compteur global + un groupement, la gravité restant un attribut de chaque ligne (Fiori, RIVO,
  Meta). SAP AIF met les statuts en **colonnes de compteurs** à côté d'un seul arbre, pas en niveau.

### 2. Patterns de l'écran de correction

1. **Formulaire complet, erreurs signalées dedans** : 10 produits (SoftCo, Oracle, Tipalti, Fiori,
   Chorus Pro, Amazon édition, Workday, Salesforce, GOV.UK, Accelerate). C'est le pattern dominant en
   mono-enregistrement. Le récap est un **panneau ou popover posé sur le même écran** (Oracle, Fiori,
   SPS, Workday, Salesforce), jamais un écran intermédiaire.
2. **Champs ou lignes en erreur seuls** : 6 (Ariba onglet Exceptions, Amazon Fix Your Products,
   HubSpot, Ryerson, FixMyCSV, Accelerate avec son toggle). Chaque fois, le reste reste à un clic :
   **onglet** (Ariba Line View), **toggle** (Accelerate « Show only lines with errors », Amazon
   « Advanced View », SPS « Hide Errors »), ou **sections repliables** (Chorus Pro).
3. **Hors outil** (on corrige le fichier ou la source, puis on relance) : 8 (Search Console,
   Merchant Center, Meta, Xero, SF Import, Dynamics, Toast, RIVO). C'est exactement là que le
   **hub-and-spoke** apparaît (Search Console : raison > exemples > validation > retour). Ces produits
   corrigent des lots, pas un enregistrement : ce n'est pas notre cas.
4. **Valeur rejetée affichée explicitement** : 7 (SPS « value sent '12' », SoftCo 120 vs 90 à 110,
   Ariba 5 vs 4, HubSpot, FixMyCSV, Ryerson dans la cellule, Accelerate). Les meilleurs montrent
   **valeur reçue + attendue** côte à côte (SPS, SoftCo, Ariba).
5. **Raison** : quasi universelle. SoftCo et Merchant Center ajoutent des **étapes de résolution** ;
   Merchant Center et HubSpot ajoutent l'**impact** (« Prevents from showing », « 2 values not imported »).
6. **Navigation** : le bouton « erreur suivante » est rare dans les captures (VS Code F8, connu, pas vu).
   Le substitut dominant est **la liste cliquable qui saute au champ** (Fiori, GOV.UK, Workday View
   All, Salesforce) et **l'onglet marqué** (Amazon). Tipalti et SoftCo ont **‹ › entre objets**
   (« 1 of 53 »), utile pour enchaîner les rejets sans revenir au tableau.
7. **Lot** : seulement en contexte multi-objets (HubSpot Bulk fix / Auto fix, FixMyCSV Apply all,
   Sonar Bulk change, Search Console Validate fix). En mono-enregistrement : aucun.
8. **Resoumission** : un seul bouton final, souvent conditionné à « plus d'erreur bloquante »
   (Ariba « now reconciled » puis Submit ; Ryerson « Process Corrections & Try Again » ; Workday :
   critique bloque, warning ne bloque pas).
9. **Contenant** : page dédiée pour les objets lourds (Ariba, SoftCo, Oracle, Tipalti, Chorus Pro,
   Amazon) ; modale pour les assistants d'import (Ryerson, RIVO, Accelerate) ; panneau latéral chez
   Workday et Tipalti (saisie à droite, document à gauche). Pour 60 à 80 champs, aucun produit vu ne
   met le formulaire complet dans une petite modale : c'est page, plein écran ou grand panneau.

### 3. Hub-and-spoke : qui l'évite et comment

- **Tombent dedans** : Search Console, Merchant Center liste, Meta (Review par type), GOV.UK task list
  (assumé, pour un public non expert). Tous en contexte lot ou grand public.
- **L'évitent** (11) avec quatre techniques :
  1. **récap sur le même écran que le formulaire** : panneau latéral (Oracle, SPS, Workday), popover
     (Fiori, Salesforce) ;
  2. **onglets ou sections marqués dans un seul écran** : Amazon (pastille sur l'onglet), Ariba,
     SoftCo, Chorus Pro (sections repliables) ;
  3. **correction inline dans la liste** : Amazon Fix Your Products, Ryerson, HubSpot (pas de
     détail à ouvrir) ;
  4. **‹ › entre objets** : Tipalti, SoftCo.

### 4. L'hypothèse « résumé global + un seul groupement par catégorie = sections du formulaire, gravité portée par le champ »

**Confirme (Vu)**
- **Gravité jamais en 1er niveau** (0 / 21) ; elle est portée par la ligne ou le champ (Fiori, Workday,
  RIVO, Meta, VS Code). Workday montre pourquoi elle doit rester visible : critique **bloque** la
  soumission, warning **non**.
- **Groupement par section du formulaire** : SAP Fiori le fait mot pour mot (en-tête de groupe
  « Personal, General Data » au-dessus des messages, clic vers le champ) ; Amazon le fait avec ses
  onglets marqués ; Chorus Pro et Tipalti avec leurs sections.
- **Résumé global en tête** : Amazon (« Fix 2 errors before submitting »), Workday (« Errors : 1 »),
  GOV.UK, Ryerson (« unable to process 4 items »), RIVO (« 1 warning, 7 errors »).
- **Deux niveaux empilés (états puis typologie)** : aucun des 34 ne le fait. Ce qui condamne la
  structure actuelle du wireframe (« Things to correct (states) » puis « Categories (typology) »).
- **Un seul écran** : tous les mono-enregistrements proches (Oracle, Fiori, Amazon, Chorus Pro,
  SoftCo, Ariba) corrigent sur un écran, sans aller-retour.

**Nuance ou contredit**
- Chez **Ariba et Oracle**, le groupement est par **type de contrôle métier** (variance de quantité,
  de prix, de taxe), pas par section. Ça ne contredit l'hypothèse que si nos catégories (« Payment
  incident », « Buyer Identification ») ne correspondent pas aux sections du formulaire. **À vérifier
  : si une catégorie couvre des champs de plusieurs sections, il faut choisir un seul axe** et ce
  doit être celui du formulaire, sinon la liste ne mène pas au bon endroit.
- En contexte lot, le **type d'erreur domine** (9 sur 11) parce qu'il permet la correction en lot
  (HubSpot). Pour nous, ça ne s'applique que si un même champ fautif se répète (lignes de paiement
  multiples, par exemple) : alors un sous-groupe « même erreur × N lignes » avec correction en lot
  se justifie. **Inf.**
- **Catégorie à 0 erreur** : Oracle (coche verte + 0) et Search Console (ligne à 0) la montrent ;
  la plupart des autres la cachent. Afficher « Buyer Identification · 0 error » en vert est permis,
  pas nécessaire. En revanche, avec 60 à 80 champs, les sections sans erreur doivent rester
  **atteignables** (toggle « afficher tous les champs », sections repliées) : Amazon Advanced View,
  Accelerate, Chorus Pro, Ariba Line View.
- La **flèche vers l'écran 2** du wireframe est le seul geste vu nulle part en mono-enregistrement :
  les produits proches posent le récap à côté du formulaire ou en tête, pas avant lui.

### Niveau de confiance

- **Élevé** : gravité en attribut, pas en niveau ; aucun double niveau ; correction sur un seul écran
  en mono-enregistrement ; valeur reçue et attendue côte à côte chez les meilleurs.
- **Moyen** : section du formulaire comme axe unique (preuve forte chez Fiori et Amazon, mais
  Ariba et Oracle groupent par contrôle métier) ; toggle pour les champs sans erreur (3 exemples).
- **Faible** : navigation « erreur suivante » (peu de preuves visuelles) ; captures SAP anciennes
  ou lues à la vignette.

## Captures (`shots/`)

| Fichier | Ce qu'elle prouve |
|---|---|
| pc-01-sap-ariba-exception-carte | carte par type d'exception, facturé vs attendu, actions |
| pc-02-sap-ariba-reconcilie-resoumission | « invoice is now reconciled » puis Submit |
| pc-03-softco-exception-inline | erreur posée sur la cellule, écart attendu, étapes de résolution |
| pc-04-oracle-fusion-holds-panneau | récap par type en panneau latéral, formulaire à côté, 0 en vert |
| pc-05-tipalti-revue-prev-next | formulaire en sections à côté du document, « 1 of 53 » |
| pc-06-sap-fiori-popover-par-section | messages groupés par section du formulaire (vignette) |
| pc-07-sap-aif-arbre-compteurs | arbre unique + compteurs par statut en colonnes (vignette) |
| pc-08-chorus-pro-recyclage-formulaire | motif en tête, formulaire complet en sections repliables (vignette) |
| pc-09-sps-commerce-panneau-erreurs | valeur envoyée + attendue, segment / élément, Hide Errors |
| pc-10-amazon-onglets-marques-erreur | compteur global + onglet marqué + toggle Advanced View |
| pc-11-amazon-fix-products-par-raison | facettes par raison, correction inline du seul champ manquant |
| pc-12-merchant-center-needs-attention | accordéon par problème avec impact |
| pc-13-search-console-raisons | table par raison, compteurs, 0 affiché |
| pc-14-search-console-validation | Validate fix (hub-and-spoke, contre-exemple) |
| pc-15-meta-commerce-issues-par-type | type + gravité + Review (contre-exemple) |
| pc-16-hubspot-fix-errors-lot | groupement par type, valeur du fichier, Bulk / Auto fix |
| pc-17-ryerson-tableau-correction-inline | lignes en erreur seules, cellules rouges éditables, Try Again |
| pc-18-surecomp-rivo-par-enregistrement | groupement par enregistrement, gravité en compteurs |
| pc-19-lms-toggle-lignes-en-erreur | toggle « Show only lines with errors » |
| pc-20-workday-critique-vs-warning | critique bloque la soumission, warning non |
