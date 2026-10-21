# Benchmark : historique de recherche multi-types (2026-10-21)

Décision évaluée : une carte unique, indépendante du type d'objet, pour Recent search,
Recently viewed et Favorites (icône d'objet, ligne 1 = recherche + type de recherche,
ligne 2 = critères renseignés, date à droite), un seul fil chronologique et un filtre de type.

Deux passes :

- **Passe 1 (texte)** : documentation produit et recherche UX, sans navigateur.
- **Passe 2 (visuel)** : navigateur réel (Edge headless), captures analysées une à une.
  Détail dans [`visual-galleries.md`](visual-galleries.md) et [`visual-products.md`](visual-products.md),
  captures dans [`shots/`](shots/) (`gal-*` galeries, `prod-*` produits).

## 1. Résumé exécutif

**Verdict : décision validée, avec cinq ajustements. Confiance ~80 %** (65 % après la passe 1).

- **Ligne 2 de critères : confirmée.** C'était le point le moins étayé. 6 produits sur les 15
  qui listent des recherches passées résument les critères (Sales Navigator, Airbnb, Booking,
  Expedia, Indeed, Skyscanner), plus Autotrader et Gumtree côté galeries. Règle observée :
  recherche par formulaire multi-champs = critères affichés ; texte libre = requête seule.
  Notre recherche est un formulaire.
- **Anatomie : un précédent quasi identique en production.** Atlassian Rovo (`prod-03`) :
  icône de type, titre gras, ligne 2 grise « Jira · Bug · … », date à droite avec verbe
  (« Viewed yesterday »). Pipedrive (`prod-08`) : même structure sans la date. Autotrader
  (`gal-01`) : titre généré, « 200 miles • N19 4PQ • £4K - £20K • Petrol • Manual », date relative.
- **Liste mixte + filtre de type : confirmés.** 8 produits mélangent les types, 4 les séparent
  (Sales Navigator, ZoomInfo : les bases B2B les plus proches). Le filtre All / Buyers / Policies
  couvre ce besoin s'il reste bien visible.
- **Recherche passée et objet consulté : toujours distingués** (6 sur 6 produits, 6 sur 7
  galeries), le plus souvent par sections ou onglets. Nos onglets le font déjà. Aucun produit
  ne donne à une recherche passée l'icône de l'objet : c'est le seul point contre la carte unique.
- **Concurrents directs** : rien de public chez Allianz Trade, Coface, Creditsafe, D&B. Seul
  analogue métier : Orbis (Moody's), onglets « Saved searches / Favourites / History » (`prod-18`),
  très proches des nôtres.

## 2. Ajustements à la décision

1. **Verbe dans la date** : « Searched 2 h ago » dans Recent search, « Viewed yesterday » dans
   Recently viewed (Rovo). Compense l'icône d'objet partagée entre requête et objet.
2. **Pas de badge « +N »** : 0 cas en historique. Une ligne avec ellipse, texte complet au
   survol. Si un compteur est nécessaire, en mots (« 4 more », Kibana `prod-16`, Sales Navigator
   `prod-11`). Les identifiants (Company ID, n° de police) restent visibles, on tronque le reste.
3. **Libellé court sur les valeurs ambiguës** : « Ext. 01 » oui, « 01 » seul non. Séparateur « · ».
4. **Favorites** : si l'onglet mélange recherches et objets, type écrit en texte en plus de
   l'icône (Crunchbase `prod-17`). Une recherche favorite a besoin d'un titre lisible : généré à
   partir des critères (Autotrader) ou renommable.
5. **Date** : relative sur quelques jours, puis absolue (Autotrader affiche « 77 weeks ago »,
   à éviter). Date complète au survol.

## 3. Points tranchés en passe 2

| Question | Passe 1 | Passe 2 (vu) | Conclusion |
|---|---|---|---|
| (a) Ligne 2 = critères | 1 source indirecte | 8 produits + 2 concepts | Garder |
| (b) Requête vs objet | Risque signalé | Distingués partout, sections ou onglets | Onglets OK + verbe dans la date |
| (c) Groupement par date | Recommandé | 4 produits (Notion, Drive, YouTube, Chrome), tous des historiques longs ; 3 concepts sur 42 | Optionnel, pas pour v1 |
| (d) Troncature « +N » | Recommandée | 0 cas ; ellipse + infobulle, compteur en mots sur 4 produits | Remplacer par ellipse |
| (e) Anatomie | Inférence | Rovo, Pipedrive, Autotrader | Garder |
| × de suppression | Au survol | Survol chez Rovo ; toujours visible sur 6 cas mobiles | Survol + focus (desktop), « Clear all » confirmé, Undo (Indeed) |

## 4. Recommandations (mises à jour)

1. **Anatomie** : icône d'objet, 2 lignes, date avec verbe à droite de la ligne 1, actions au
   survol et au focus ; hauteur fixe pour les trois onglets.
2. **Lignes** : ligne 1 = ce qu'on a cherché en gras + type de recherche en texte secondaire ;
   ligne 2 = critères renseignés seulement, ordre du formulaire, séparateur « · », ellipse.
3. **Filtre** : All par défaut, segmenté jusqu'à 4 types puis dropdown ; état « filtre sans
   résultat » avec retour vers All (Teams `gal-18`).
4. **Rejeu** : carte entière cliquable (Recent relance, Viewed et Favorites ouvrent l'objet).
5. **Suppression** : × par ligne, « Clear all » confirmé, Undo après suppression.
6. **Taille et états vides** : ~20 éléments puis « Show more » ; état vide propre à chaque onglet.

## 5. Risques et points ouverts

1. Aucun concurrent direct observable : tester avec des analystes sur des cas réels (buyer avec
   adresse complète, police avec plusieurs statuts).
2. Galeries : 30 exemples sur 42 sont des concepts Dribbble, pondérés en conséquence.
3. Échantillon produits surtout grand public pour la ligne 2 (voyage, emploi, auto) ; seul
   Sales Navigator est B2B sur ce point.
4. Accessibilité AA : date relative lisible au lecteur d'écran, suppression au clavier, icône nommée.
5. Confidentialité : l'historique de recherche d'entreprises est sensible ; rétention et taille à définir.

## 6. Méthode et limites

- Passe 1 : environ 60 URL tentées, une trentaine exploitables, sources textuelles. Sources
  principales : Salesforce, Jira, Linear, Notion, Slack, GitHub, HubSpot, Dynamics 365, Stripe,
  Shopify, Zendesk, Google Drive, LinkedIn, NN/g, Baymard, Material 3, Carbon, GOV.UK.
- Passe 2 galeries : 48 exemples ouverts, 42 exploitables (Dribbble, Page Flows). Behance,
  Saaspo, Nicelydone, Refero, SaaSFrame, Land-book bloqués ou vides ; UI Garage fermé ; Mobbin exclu.
- Passe 2 produits : 38 produits, environ 140 captures publiques ouvertes, 33 utiles. Entrée par
  la recherche d'images Bing (recherche texte inutilisable).
- « Vu » = constaté sur capture ; « inférence » = déduction.
