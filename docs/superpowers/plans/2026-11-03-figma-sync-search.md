# Synchroniser Search dans Figma : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** créer le fichier Figma `Qirin · Search` (couverture, changelog, overview, écrans, états, specs) et ajouter aux librairies Qirin les composants de la Search qui n'existent qu'en code, documentés et repérables comme nouveaux.

**Architecture :** le travail se fait par le MCP Figma (`use_figma`, Plugin API). Chaque composant ou écran est construit par un script `use_figma` court, puis vérifié par deux contrôles automatiques : un **audit de liaison** (aucune couleur, taille ou espacement non relié à une variable `Tokens`) et une **comparaison visuelle** avec le rendu réel de l'app (capture Edge du prototype `main`). Les librairies sont modifiées en place ; la publication est faite par l'utilisateur entre la tâche 8 et la tâche 9.

**Tech Stack :** Figma MCP (plugin officiel), Figma Plugin API, prototype Angular `main` servi en local, Edge piloté par `playwright-core` pour les captures de référence.

**Spec :** `docs/superpowers/specs/2026-11-03-figma-sync-search-design.md`

## Global Constraints

- Skills à charger avant tout appel : `figma:figma-use` (avant chaque `use_figma`), `figma:figma-create-new-file` (avant `create_new_file`), `figma:figma-generate-library` (tâches 2 à 8), `figma:figma-generate-design` (tâches 9 à 12).
- `create_session` avec la clé du fichier avant toute lecture ou écriture ; réutiliser le `sessionId`.
- Aucune valeur en dur : couleurs, espacements, rayons, tailles de texte reliés aux variables de la librairie `Tokens` (`4TxqgJPVFZc4ZKw4JZ6OAn`).
- Composition : instances des composants des librairies Qirin (`[Components] Action`, `Data Display`, `Data Entry`, `Feedback`) ; jamais de copie détachée.
- Auto-layout partout, calques nommés, aucun groupe libre.
- Repère des nouveautés : page `🆕 <Nom>`, pastilles « Design : New » et « Tech : In code », description `New · 2026-11 · …`.
- Étendre un composant existant est permis ; le renommer ou casser ses variantes, non.
- Fichiers dans le dossier `https://www.figma.com/files/938843005951693382/folder/683452905`.
- Date de référence des données : 2026-11-03. Pas de tiret cadratin dans les textes.
- Mesures prises dans le code et le rendu (jamais au pixel sur un PNG exporté), via `get_design_context` avec `excludeScreenshot: true` pour les composants Figma.

## Review Focus

- Une instance reliée à une librairie non publiée casse au moment de la publication : chaque tâche 9 à 12 vérifie que les composants instanciés viennent de la version **publiée**.
- Variables de mode (thème) : un écran doit rester correct si le fichier change de mode ; l'audit de liaison le garantit.
- Textes longs (noms de société, de police) : chaque carte est testée avec le nom le plus long du mock, sans débordement.
- Les variantes ajoutées au Flyout Menu Item ne doivent pas changer l'apparence des instances existantes (valeur par défaut = rendu actuel).
- La couverture doit rester lisible en vignette (320 × 160) : contrôle par capture réduite.

## Contrôles réutilisés par toutes les tâches

- **Audit de liaison** : script `use_figma` qui parcourt le nœud livré et liste chaque fill, stroke, padding, gap, rayon, taille de texte **non relié** à une variable ou à un style de la librairie. Attendu : liste vide.
- **Comparaison visuelle** : capture du nœud (`get_screenshot`) à côté de la capture Edge du même état de l'app, à la même largeur. Attendu : même structure, mêmes libellés, mêmes couleurs ; écarts notés et corrigés.

---

### Task 1 : relevé des librairies et du gabarit de documentation

**Files :** Create `docs/figma/qirin-figma-inventory.md`

- [ ] Lire une page de documentation existante (`Dropdown` dans Data Entry) avec `get_metadata` puis `get_design_context` sur le cadre `_Design system header` : relever sa structure (titre, description, pastilles, liens, cadre `Versionning`).
- [ ] Lister les collections de variables de `Tokens` (couleurs, spacing, radius, typo) avec leurs clés.
- [ ] Lister les clés des composants à instancier : Badge (Feedback), Tab, Chip, Button, Button Icon (Action), Page Header (Data Display), Icon, Divider, Flyout Menu et Item (Data Entry), header Qirin (Common / Top box).
- [ ] Écrire l'inventaire dans `docs/figma/qirin-figma-inventory.md` (clés, noms, fichier source, variantes utiles). Attendu : toutes les pièces de l'écran Search ont une clé ou sont marquées « absent → tâche N ».

### Task 2 : fichier `Qirin · Search`, Cover, Changelog, Overview

- [ ] Créer le fichier dans le dossier cible, pages : `Cover`, `Changelog`, `Overview`, `Screens`, `States & edge cases`, `Specs`, `Local components`.
- [ ] Ajouter les librairies Qirin et `Tokens` au fichier.
- [ ] Concevoir la couverture : nom, statut `In progress`, version `v1.0`, date, équipe ; composition soignée aux couleurs de marque (variables), lisible en vignette ; la définir comme vignette du fichier.
- [ ] Changelog : gabarit d'entrée (date, version, changements, commit) et première entrée `v1.0 · 2026-11-03 · Search V2 · ef8d0ee3`.
- [ ] Overview : objet de la page, utilisateurs (analystes crédit), parcours principal en vignettes (à compléter en tâche 13 une fois les écrans faits).
- [ ] Contrôles : audit de liaison sur les trois pages ; capture de la couverture en taille réelle et en 320 × 160.

### Task 3 : Identifier (Data Display)

- [ ] Relever `ds-identifier` (`shared/ui/identifier`) : icône, valeur, bouton copier, états.
- [ ] Créer le component set dans Data Display (propriétés : `Value` texte, `Icon` booléen, `Copyable` booléen), page `🆕 Identifier` documentée sur le gabarit.
- [ ] Contrôles : audit de liaison ; comparaison avec l'identifiant de la carte police de l'app.

### Task 4 : Flyout Menu Item, choix unique (Data Entry, extension)

- [ ] Ajouter les propriétés `Selectable` (défaut false) et `Selected` à l'item existant : emplacement fixe de 20 px, coche visible si `Selected`, libellé à 32 px dans tous les cas.
- [ ] Vérifier que les instances existantes ne changent pas (défauts = rendu actuel).
- [ ] Documenter la variante sur la page existante, avec le repère `🆕` sur la section ajoutée.
- [ ] Contrôles : audit ; comparaison avec le flyout « Search in » de l'app.

### Task 5 : Standalone Dropdown (Data Entry)

- [ ] Relever `ds-standalone-dropdown` : icône optionnelle, libellé, chevron, tons, état ouvert avec liste.
- [ ] Component set (propriétés : `Tone`, `Icon`, `Open`, `Disabled`), page `🆕 Standalone Dropdown`.
- [ ] Contrôles : audit ; comparaison avec « Group by » et « Search in » de l'app.

### Task 6 : Result Card buyer (Data Display)

- [ ] Relever `ds-result-card` : tuile, nom + ville, identifiant, adresse, score, actions, dépliage, tailles `S` / `M`.
- [ ] Component set (propriétés : `Size`, `Open`, `Exists`, `Favorited`), instances d'Identifier, Badge, Button Icon ; page `🆕 Result Card`.
- [ ] Contrôles : audit ; comparaison avec une carte buyer de l'app, fermée et dépliée ; test du nom le plus long.

### Task 7 : Policy Result Card (Data Display)

- [ ] Relever `ds-policy-result-card` et `policy-card.view.ts` : nom, clé, produit · assuré · versions, badge statut ou étape · statut, bloc date (alerte J-30), dépliage 8 champs.
- [ ] Component set (propriétés : `Kind = Policy | Draft`, `Open`, `Size`, `Alert`, `Favorited`), page `🆕 Policy Result Card`.
- [ ] Contrôles : audit ; comparaison avec une police Issued, une police en alerte, un draft, une carte dépliée.

### Task 8 : Search Bar Scoped (Data Entry) et composant local Recent Search Card

- [ ] Relever `ds-search-bar-scoped` : slots Buyers (type, pays, type d'ID, champ, More criteria, Search) et Policies (BU, champ, Search in, Status, Search), erreurs.
- [ ] Component set (propriétés : `Scope = Buyers | Policies`, `Type`, `Error`), page `🆕 Search Bar Scoped`.
- [ ] Dans le fichier Search, page `Local components` : `app-recent-search-v2-card` en composant local documenté, repère `🆕`.
- [ ] Contrôles : audit ; comparaison avec la barre en Buyers et en Policies.
- [ ] **Arrêt** : signaler à l'utilisateur que les composants des tâches 3 à 8 sont prêts à publier, avec la liste par librairie. Attendre la publication.

### Task 9 : écrans Buyers

- [ ] Captures de référence de l'app (accueil vide, résultats, carte dépliée, More criteria).
- [ ] Écrans 1440 px dans la page `Screens`, section `Buyers`, en instances publiées ; données du mock.
- [ ] Contrôles : audit ; comparaison écran par écran.

### Task 10 : écrans Policies

- [ ] Captures de référence : résultats, carte police dépliée, drafts, Group by Stage, Group by Status, aucun résultat.
- [ ] Écrans dans la section `Policies`.
- [ ] Contrôles : audit ; comparaison.

### Task 11 : écrans Historiques

- [ ] Recent search, Recently viewed, Favorites (avec données), dans la section `History`.
- [ ] Contrôles : audit ; comparaison.

### Task 12 : States & edge cases, Specs

- [ ] États produits par le code (chargement progressif, aucun résultat, champ téléphone désactivé, erreurs de la barre), plus la liste des manques.
- [ ] Page Specs : annotations sur les écrans (texte libre, statut par défaut, police / draft, Group by, ordre des statuts, J-30).
- [ ] Contrôles : audit ; relecture des annotations contre la spec métier.

### Task 13 : livraison

- [ ] Compléter l'Overview avec les vignettes des écrans.
- [ ] Passer la couverture à `Ready for dev`, mettre à jour le Changelog.
- [ ] Enregistrer la version nommée `v1.0 · Search V2` dans l'historique du fichier.
- [ ] Envoyer à l'utilisateur les liens du fichier et des pages de librairie modifiées.
