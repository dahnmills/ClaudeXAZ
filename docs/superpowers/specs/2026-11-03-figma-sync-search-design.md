# Synchroniser le prototype dans Figma : Search en premier

Date : 2026-11-03
Statut : design validé en conversation, spec à relire

## Intention

Le prototype Qirin est vibecodé (Angular, sur GitHub). Les maquettes Figma qui le
décrivent n'existent pas ou sont en retard. On veut reproduire le prototype dans Figma,
écran par écran, avec les **vrais composants et les vrais tokens** du design system
Qirin, dans des fichiers propres, historisés et livrables.

Public : devs, designers, PM, tout le monde. Les fichiers doivent donc se lire sans
contexte (à quoi sert l'écran, quels états, quelles règles) et rester exacts.

Premier fichier : **Search** (la page `/search-v2` de `main`). Les suivants (Buyer
Summary, TAG…) reprendront le même gabarit.

## Décisions validées

| Sujet | Décision |
|-------|----------|
| Emplacement | Dossier Figma `https://www.figma.com/files/938843005951693382/folder/683452905` (organisation Allianz). L'utilisateur rangera ensuite |
| Découpage | Un fichier par fonctionnalité : `Qirin · Search`, puis `Qirin · Buyer Summary`… |
| Pages du fichier | Cover, Changelog, Overview, Screens, States & edge cases, Specs |
| Couverture | Travaillée, « stylée », sert aussi de vignette du fichier |
| Composants | Instances des librairies Qirin et variables `Tokens` uniquement, aucune valeur en dur |
| Composants absents des librairies | **Ajoutés aux fichiers de librairie Qirin**, au fur et à mesure, repérables comme nouveaux, avec leur documentation Figma |
| Écrans Search | ~15, depuis l'état réel de `main` et les données du mock |

## Sources

- **Code** : `src/app/pages/search-v2/`, `src/app/shared/ui/` sur `main` (Search V2
  Policies fusionnée, walkthrough fusionné). Règles métier : `docs/superpowers/specs/2026-10-28-search-v2-policy-results-design.md`.
- **Librairies Qirin** (organisation Allianz) : `Tokens` (`4TxqgJPVFZc4ZKw4JZ6OAn`),
  `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`), `[Components] Data Display`
  (`VpConH5AUGyCqtp8PMqj1i`), `[Components] Data Entry` (`1wVY9FfjONIX6us9JmIm7U`),
  `[Components] Feedback` (`fH3vmSNZR8r0sU3kN455CD`), `[Common] Top box / Page Header`.
- **Gabarit de documentation existant** dans ces fichiers : chaque composant a une
  page avec un cadre `_Design system header` (titre, description, pastilles
  « Design : » et « Tech : », liens Supernova / Storybook), ses variantes, ses
  sous-éléments, et un cadre `Versionning`. Exemple : page `Dropdown` du fichier Data Entry.

## Livrable 1 : nouveaux composants dans les librairies

### Inventaire (Search)

Composants présents en code et introuvables dans les librairies Qirin (recherche faite
le 2026-11-03). L'inventaire exact est à confirmer composant par composant au moment de
construire :

| Composant code | Fichier de librairie cible |
|----------------|----------------------------|
| `ds-search-bar-scoped` (barre à objet Buyers / Policies) | Data Entry |
| `ds-standalone-dropdown` (déclencheur texte, choix unique) | Data Entry |
| `ds-result-card` (résultat buyer) | Data Display |
| `ds-policy-result-card` (résultat police / draft) | Data Display |
| `ds-identifier` (identifiant copiable) | Data Display |
| `ds-flyout-menu-item` état `selectable` / `selected` (coche à emplacement fixe) | Data Entry, sur l'item existant |
| Toute autre pièce de l'écran absente des librairies | selon sa nature |

### Règles de construction

- **Composition** : chaque nouveau composant est fait d'instances des atomes déjà en
  librairie (Badge, Button, Button Icon, Icon, Tab…) et de variables `Tokens`. Pas de
  rectangle stylé à la main là où un atome existe.
- **Variantes = inputs du code** : une propriété Figma par input Angular qui change
  l'apparence (ex. `Size = S | M`, `Open = true | false`, `Kind = Policy | Draft`).
  Propriétés texte pour les libellés, booléennes pour les éléments optionnels.
- **Auto-layout** partout, calques nommés, pas de groupe libre.
- **Fidélité** : mesures prises dans le code et le rendu réel, pas à l'œil.

### Repérer les nouveaux

- Nom de la page de documentation préfixé `🆕 ` (ex. `🆕 Search Bar Scoped`).
- Dans le `_Design system header` : pastille « Design : New » et « Tech : In code »
  (mêmes pastilles Badge que les pages existantes).
- Description du composant (champ Figma) qui commence par `New · 2026-11 · ` puis
  l'usage.
- Le préfixe `🆕` est retiré quand l'équipe DS valide le composant (hors périmètre).

### Documentation par composant

Une page par composant, sur le gabarit existant :
1. `_Design system header` (titre, description d'usage, pastilles, lien Storybook du
   composant).
2. Le component set avec toutes ses variantes, légendées.
3. Les sous-éléments internes s'il y en a (préfixe `.` comme dans les librairies).
4. Règles d'usage courtes (« à faire / à éviter »), tirées des commentaires du code et
   de CLAUDE.md.
5. Cadre `Versionning` : version 1.0, date, auteur.

### Droits

Le builder modifie **directement** les fichiers de librairie Qirin (accord de
l'utilisateur, 2026-11-03), sans branche Figma. Cela inclut d'**étendre** un composant
existant quand le code l'a fait évoluer (ex. état `selectable` / `selected` du Flyout
Menu Item) : on ajoute des variantes ou des propriétés, on ne casse ni ne renomme les
existantes, pour que les fichiers qui les utilisent déjà ne bougent pas.

### Publication

La publication d'une librairie est manuelle. Le builder prépare les composants et
signale qu'ils sont prêts ; l'utilisateur (ou l'équipe DS) publie. Le fichier Search ne
peut instancier un composant qu'une fois celui-ci publié.

## Livrable 2 : le fichier `Qirin · Search`

### Pages

1. **Cover** : nom du fichier, statut (`In progress` / `Ready for dev`), version, date
   de dernière livraison, équipe. Design soigné aux couleurs de la marque (tokens), qui
   tient en vignette. Défini comme vignette du fichier.
2. **Changelog** : une entrée par livraison (date, version, ce qui change, lien du
   commit GitHub). Chaque livraison est aussi figée en **version nommée** de l'historique
   Figma (`v1.0 · Search V2`).
3. **Overview** : à quoi sert la recherche, pour qui (analystes crédit), le parcours
   principal en vignettes fléchées.
4. **Screens** : écrans 1440 px, un cadre par état, en sections :
   - **Buyers** : accueil vide, résultats, carte dépliée, panneau More criteria.
   - **Policies** : résultats (Issued par défaut), carte police dépliée, drafts, Group by
     Stage, Group by Status, aucun résultat.
   - **Historiques** : Recent search, Recently viewed, Favorites.
5. **States & edge cases** : chargement, chargement progressif, aucun résultat, erreurs
   de saisie de la barre.
6. **Specs** : annotations pour les devs, posées sur les écrans : ce que cherche le texte
   libre, statut par défaut, règles d'affichage police / draft, Group by, ordre des
   statuts, règle du renouvellement à J-30.

### Règles

- Écrans montés en instances : shell (header, side nav, page header), barre, cartes,
  chips, badges.
- Contenu repris du mock (`buyers.mock.ts`, `policies.mock.ts`), dates fixées pour la
  capture.
- Chaque écran porte un titre de cadre clair (`Policies · Group by Stage`).

## Non-objectifs

- Les autres fonctionnalités (Buyer Summary, TAG…) : fichiers suivants, même gabarit.
- Le prototypage interactif Figma (liens entre écrans).
- Publier les librairies.
- Renommer ou casser les composants existants des librairies (les étendre est permis,
  voir « Droits »).

## Anti-objectifs

- Copier des composants des librairies dans le fichier Search au lieu de les instancier.
- Une couleur, une taille ou un espacement en dur.
- Un nouveau composant non repérable comme nouveau, ou sans documentation.

## Choix de l'auteur (après relecture)

- **Shell des écrans** : celui de `main`, pas un shell idéal. `/search-v2` affiche le
  header Qirin et le page header, **sans side nav ni topbox**. Les écrans le reproduisent.
- **États dessinés** : uniquement ceux que le code produit (accueil vide, résultats,
  chargement progressif « Loading more results… », aucun résultat, champ désactivé du
  téléphone sans pays, erreurs « This field is required » de la barre buyers, erreur
  « Select at least one status » côté policies). Les états absents du code ne sont pas
  inventés ; ils sont listés en fin de page « States & edge cases » comme manques.
- **Composants propres à la page** (`app-recent-search-v2-card`, ce qui vit hors de
  `shared/ui`) : **composants locaux du fichier Search**, documentés dans une page
  `Local components`, avec le même repère `🆕`. Seuls les composants de `shared/ui`
  vont dans les librairies.
- **Hors périmètre Search** : l'assistant de création de société
  (`app-company-creation-wizard`) et la modale de confirmation ; ils ont leur propre flux.
- **Ordre de construction** : en parallèle des composants de librairie, le fichier Search
  reçoit d'abord Cover, Changelog et Overview. Les écrans se montent une fois les
  nouveaux composants publiés, pour éviter de remplacer des instances après coup.
- **Liens Storybook / Supernova** : pas d'URL publique connue, le champ indique
  « Storybook : local (repo qirin-claude) ».
- **Date de référence des captures** : 2026-11-03. Les dates relatives du mock sont
  calculées depuis ce jour (renouvellement à J-30 cohérent avec la page Specs).
- **Changelog** : première entrée `v1.0`, commit `ef8d0ee3` de `main` (hash seul, l'URL
  du dépôt distant n'est pas confirmée).

## Laissé au builder

- Mise en page exacte de la couverture et de l'Overview.
- Découpage fin des variantes de chaque nouveau composant.
- Ordre de construction des composants.
