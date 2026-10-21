# Benchmark : historique de recherche multi-types (2026-10-21)

Décision évaluée : une carte unique, indépendante du type d'objet, pour Recent search,
Recently viewed et Favorites (icône d'objet, ligne 1 = recherche + type de recherche,
ligne 2 = critères renseignés, date à droite), un seul fil chronologique et un filtre de type.

## Méthode et limites

- Pas d'outil de recherche web : sources atteintes par fetch direct d'URL (moteur proxy vite
  limité en HTTP 429). Environ 60 URL tentées, une trentaine exploitables.
- Sources surtout textuelles (documentation) : elles disent ce que fait le produit, rarement la
  mise en page exacte d'un élément d'historique. Galeries visuelles (Mobbin, Dribbble, Land-book,
  Pttrns, Behance, UI Sources) non analysées (accès refusé ou contenu non lisible).
- « Fait » = ce que dit la source ; « inférence » = déduction.

## 1. Résumé exécutif

**Verdict : à ajuster. Décision valide sur le fond, quatre corrections. Confiance ~65 %.**

- La liste chronologique mixte de récents tous types est le pattern des sources qui documentent
  les récents (Salesforce, Jira, Linear, Notion). Le regroupement par type sert surtout aux
  résultats (Dynamics, Salesforce), pas à l'historique : l'abandon des blocs par type est soutenu.
- Le filtre de type à côté d'une liste unique est très courant (LinkedIn, Slack, Dynamics,
  Shopify, HubSpot) ; segmenté puis dropdown au-delà de quelques types est cohérent.
- Aucune source ne montre un résumé des critères d'une recherche passée en ligne 2 : c'est le
  point le moins étayé. Analogues : Stripe (requête en jetons `clé:valeur`), GitHub.
- À ajuster : (1) distinguer recherche passée et objet consulté, (2) libellé de type en texte en
  plus de l'icône, (3) états vides et filtre actif visibles par onglet, (4) troncature « +N » de la
  ligne 2.

## 2. Patterns observés

| # | Pattern | Sources | Détail |
|---|---|---|---|
| P1 | Récents avant toute saisie | 8 : Salesforce, Jira, Linear, Notion, GitHub, Slack, UX Magazine, UX Collective | Notion : pages visitées avec heure ; Slack : icône horloge |
| P2 | Liste mixte multi-types pour les récents | 3 : Salesforce, Jira, Notion | Regroupement non précisé |
| P3 | Regroupement par type pour les résultats, pas l'historique | 2 à 3 : Dynamics, Salesforce, Slack | Distinction résultats/historique : inférence |
| P4 | Filtre de type à côté d'une liste unique | 10 : LinkedIn, Slack, Dynamics, Shopify, HubSpot, Zendesk, Stripe, Linear, Google Drive, UX Magazine | Dropdown si beaucoup de types (Dynamics) |
| P5 | Types distingués par libellé et style | 3 : NN/g, UX Magazine, Baymard | |
| P6 | Suppression d'historique | 5 : LinkedIn, Shopify, YouTube, Spotify, Slack | × par ligne, « Clear » global confirmé |
| P7 | Rejeu en un clic | 4 : LinkedIn, GitHub, Linear, Stripe | |
| P8 | Recherches enregistrées distinctes de l'historique | 3 : GitHub, Jira, Linear | |
| P9 | Limite de taille | 2 : UX Magazine (moins de 10 en dropdown), Salesforce (5) | |
| P10 | Résumé de critères d'une requête passée | 1 indirect : Stripe | |

## 3. Sources principales

Enterprise / B2B : Salesforce (salesforceben.com/salesforce-search, lightningdesignsystem.com),
Jira (support.atlassian.com/jira-software-cloud/docs/find-recent-issues), Linear
(linear.app/docs/search), Notion (notion.com/help/search), Slack
(slack.com/help/articles/202528808), GitHub (docs.github.com, about-searching-on-github,
using-github-code-search), HubSpot (knowledge.hubspot.com, search-within-your-hubspot-account),
Dynamics 365 / Power Apps (learn.microsoft.com, quick-find, search-records), Stripe
(docs.stripe.com/dashboard/search), Shopify (help.shopify.com, admin search), Zendesk
(support.zendesk.com, Searching Zendesk Support), Google Drive (support.google.com/drive/answer/2375114),
VS Code, macOS Spotlight, Alfred, Raycast.

Grand public : LinkedIn (linkedin.com/help, a523136 et a524275), YouTube
(support.google.com/youtube/answer/57711), Spotify (community.spotify.com).

Recherche UX et design systems : NN/g (Enriched Site-Search Suggestions, Site Search
Suggestions, Search: Visible and Simple, Filters vs. Facets, Designing Search Suggestions),
Baymard (Autocomplete design), UX Magazine (Best practices designing autosuggest), UX Collective
(UX for search 101), IxDF, UXPin (Advanced search UX), Material 3 (search specs), Carbon
(search usage), GOV.UK Design System, Page Flows.

## 4. Recommandations

1. **Anatomie** : icône d'objet, 2 lignes, date à droite de la ligne 1, actions en bout de ligne
   au survol et au focus ; hauteur fixe pour les trois onglets.
2. **Lignes** : ligne 1 = ce qu'on a cherché en gras + type de recherche en texte secondaire ;
   ligne 2 = critères renseignés seulement, ordre du formulaire, séparateur unique.
3. **Type** : icône + libellé texte (NN/g, UX Magazine) ; une requête passée et un objet ouvert
   doivent se distinguer.
4. **Date** : relative les derniers jours (« 2 h ago », « Yesterday »), date courte au-delà,
   date complète au survol (inférence, aucune source ne tranche).
5. **Critères** : 4 visibles au plus puis « +N », une ligne avec ellipse, statuts multiples
   condensés (inférence).
6. **Groupement par date** : en-têtes légers Today / Yesterday / Earlier (YouTube groupe par
   date), pas pour Favorites (inférence à tester).
7. **Filtre** : All par défaut, segmenté jusqu'à 4 types puis dropdown avec compteurs ; portée
   active visible, sortie en un clic quand le filtre ne rend rien.
8. **Rejeu** : carte entière cliquable (Recent relance, Viewed et Favorites ouvrent l'objet).
9. **Suppression** : × par ligne au survol et au focus ; « Clear all » confirmé ; retrait de
   favori distinct.
10. **Taille et états vides** : ~20 éléments puis « Show more » ; état vide propre à chaque
    onglet et état « filtre sans résultat » avec lien vers All.

## 5. Risques et points ouverts

1. Pas de précédent pour la ligne 2 « critères résumés » : tester avec des analystes sur des cas
   réels (buyer avec adresse complète, police avec plusieurs statuts).
2. Preuves faibles sur la mise en page des éléments : revue visuelle des produits et des galeries
   à faire.
3. Trois onglets + un filtre de type = deux axes de navigation ; vérifier que les trois onglets
   correspondent à des tâches distinctes.
4. Un composant pour deux natures d'éléments (requête passée, objet ouvert) : risque de confusion.
5. Accessibilité AA : date relative lisible au lecteur d'écran, suppression au clavier, icône nommée.
6. Confidentialité : l'historique de recherche d'entreprises est sensible ; rétention et taille à
   définir.
