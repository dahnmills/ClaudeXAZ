# Suivi en cours (mis à jour à chaque étape)

Dernière mise à jour : 2026-11-04 14:55

## Figma : librairies (refactor des propriétés)

| Composant | Avant | Après | État |
|-----------|-------|-------|------|
| Horizontal Card (Data Display) | 8 variantes (Open × Size × Favorited) | 4 variantes, Open seul axe, `.Favorite` exposé | Publié |
| Standalone Dropdown (Data Entry) | 12 variantes | 8, `.Chevron` exposé (Tone × Open), Focus booléen | Publié |
| Identifier (Data Display) | 4 variantes | 2, Copyable et Focus booléens | Fait, **à republier** |
| Propriétés inutilisées | 30 dans Data Entry + Data Display | 0 | Fait, à publier |
| Collection Density (Tokens) | créée par erreur | supprimée | Fait |

Publié : Horizontal Card, Standalone Dropdown. **Reste à publier** : Data Display (Identifier : 2 variantes en source, encore 4 en publié).
Fichier Search recâblé : 96 instances sur les nouvelles versions (favoris et dropdowns ouverts conservés).

## Figma : Buyer Summary (`0ZjZu0OjHdzGowm3hliM2M`)

| Étape | État |
|-------|------|
| Shell (Default / Editing), barre d'action | Fait |
| Sets Widget et Catalog card (variantes de contenu) | Supprimés : écrans recâblés sur Card + contenu local (41 cards) |
| Boards par défaut ×3, chargement, sélecteur ouvert, menu de card, Full properties | Fait |
| New board : première card posée | Fait |
| Board row (Manage boards) | À refaire : reposait sur la taille S supprimée de la Horizontal Card |
| New board : choix de grille (Radio Card + Layout preview), placing, case ciblée + drawer Cards & layouts, board rempli, enregistré | En cours |
| Manage boards, renommage, confirmation d'abandon | À faire |
| States, Specs, Overview, couverture, changelog | À faire |

## ZeroHeight

MCP ZeroHeight pas encore branché dans Claude Code (commande dans la conversation). En attendant, les pages sont écrites en Markdown dans `docs/zeroheight/` par 3 agents en parallèle (lecture seule sur Figma) :

| Agent | Périmètre | Dossier |
|-------|-----------|---------|
| 1 | Action **terminé** (18 pages), Feedback en cours | `docs/zeroheight/action/`, `docs/zeroheight/feedback/` |
| 2 | Data Entry : **terminé**, 18 pages + index | `docs/zeroheight/data-entry/` |
| 3 | Data Display + Layout + Foundations : **terminé** (29 pages) | `docs/zeroheight/data-display/`, `layout/`, `foundations/` |

## Reject Management

Agent dédié sur `feat/integration` (worktree `qirin-reject-management`, http://localhost:4400/#/reject-management) : les 3 rejets de référence (doublon d'identifiant → Delete après duplicate removal ; code région inconnu → correction dans le rejet puis Resubmit ; activité principale → Resubmit tel quel après inversion), champs fautifs en erreur, champs obsolètes masqués, checkboxes + un bouton par action. **Fait, non committé.** Questions métier ouvertes : Country code corrigeable ? masquer Resubmit sur le doublon ? confirmer avant « Resubmit as is » ? propriétaire de la liste des régions ? Archive / Move.

## Coverbook

Agent dédié sur la branche `feat/coverbook` (worktree `C:\Users\JDAHAN\documents\qirin-coverbook`, port 4440) : pages Buyer Covers et Policy Covers depuis le Figma `[CU] Coverbook 2026` (nœuds 6032:6969 et 6359:3002), données fictives calquées sur la structure des Excel. **Fait** : onglets Credit Limits (Figma) et Grade based covers (capture), filtres, colonnes, devise, tri, modale détails, navigation buyer ↔ policy. Nouvel atome `shared/ui/policy-color`, extensions opt-in de cell-header, properties-panel, card.

## Temps restant (2026-11-04 11:10)

| Tâche | État | Reste | Dépend de |
|---|---|---|---|
| Buyer Summary : écrans + States | fait | | |
| Buyer Summary : Specs, Overview, couverture, changelog | fait | | |
| Buyer Summary : contrôles finaux + passage en 1280 | fait | | |
| Identifier : republier puis recâbler | attend publication | 10 min | publication Data Display |
| Doc ZeroHeight : toutes les librairies (78 pages) + `_audit.md` | fait | | |
| Fichier Search en 1280 | fait (Overview : vignettes encore en 1440, à refaire en review) | | |
| Doc ZeroHeight : relecture | à faire | 30 min | |
| Doc ZeroHeight : envoi | pilote Button posé (masqué), attend validation | 1 h après validation | clé du fichier Layout pour 5 pages |
| Coverbook | fait : feat/coverbook (2 commits b5da4ab6, b618a76e), http://localhost:4440/#/coverbook/buyer/4421706 | | |
| Reject Management | fait, non committé (feat/integration) : 3 scénarios + layout v3 (127 champs, 80 masqués) | | |

## ZeroHeight : MCP en écriture (2026-11-04 12:30)

- Serveur `allianz-trade` (OAuth, `https://mcp.zeroheight.com/mcp`, config locale du projet) : connecté, écriture OK (`create-page`, `edit-page`, `update-page-metadata`, `update-structure`, `upload-asset`). Styleguide **Qirin**, id 138794. Le serveur `zeroheight` (clé dans l'URL) est en lecture seule et peut être retiré (`claude mcp remove zeroheight`).
- Piège : `create-page` et `edit-page` publient **tout de suite** (sauf `hidden: true`). Toujours créer en masqué, faire valider, puis démasquer.
- Pas de ton de voix défini, aucun Storybook connecté, aucun component set dans ZeroHeight.
- Catégories : Components 2189567, Foundation 2189561 (Typography 2189564, Colors 2189563, Spacing & layout 2189565, Accessibility 2189566), Patterns 2189568, Resources 2189569, Getting Started 2189557.
- **Page pilote Button** (id 8352976) : remplie et **masquée**, à relire sur https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/893ed3 puis démasquer. Les 77 autres pages attendent sa validation.

## ZeroHeight : refonte de la page Button (2026-11-04 14:10)

Retour utilisateur : la première version (Markdown converti) n'est ni belle ni visuelle. Recherche faite (Carbon, Atlassian, Primer, GOV.UK) : exemple d'abord, onglets (Overview / Usage / Specs / Code), une règle = un titre court, do/don't illustrés, schéma d'anatomie numéroté, tableau « quel composant choisir ». Exigence ajoutée : **maillage** (liens vers le bon composant, mots-clés de recherche « Also searched as »).
- Nouvelle page **Button** (id 9166118, uid 20fe33, masquée) : 4 onglets, vrais composants Figma via `<design-uploads>`, tableau de maillage vers Link / Button Icon / Button Split / Segmented Control / Tag.
- Pages stub masquées créées pour les liens : Link 9166113, Button Icon 9166114, Button Split 9166115, Segmented Control 9166116, Tag 9166117. Ancienne page 8352976 renommée « Button (first draft, to delete) » (à supprimer à la main, pas d'outil de suppression).
- Limite : les illustrations PNG exigent de transcrire du base64 dans l'appel `upload-asset` (fragile, un test a été tronqué). Frames d'illustration dans le fichier Buyer Summary, page `tmp · ZeroHeight illustrations` (112:25) : anatomie + 4 paires do/don't, à supprimer ensuite. Alternative : SVG courts.
- Library Figma synchronisée dans ZeroHeight : Action et Data Entry seulement (mars 2026, sans l'état Loading) ; Data Display, Layout et Feedback à connecter côté ZeroHeight.

## Fusion dans main (2026-11-04 14:55)

`feat/coverbook` (0ee92c0c) puis `feat/integration` / Reject Management (ea706313, après commit 7dbf592e) fusionnés dans main, build de développement OK. Conflit résolu dans `src/app/user-testing/screens.data.ts`. Non poussé. Les worktrees `qirin-coverbook` et `qirin-reject-management` existent encore (serveurs 4440 et 4400).

## Reject Management : note PDF (2026-11-04 15:00)

`docs/reject-management/Reject-Management-note-de-conception.pdf` (4 pages, source `note-de-conception.html`, rendu avec Edge headless) : retours du métier, décisions de conception et leur origine, les 3 rejets, ce qui est simulé, écart assumé avec la recherche UX (carrefour gardé car prévu par la maquette), 6 questions ouvertes. Non committé.
Coverbook : la page policy existe (`#/coverbook/policy/2590417133`), accessible via le menu de ligne « Go to policy covers » et la liste d'écrans du prototype ; pas de lien visible depuis la page buyer en dehors de ce menu.

## UX/UI Reject Management et Coverbook (2026-11-04 15:40, non committé dans main)

- Reject Management : le carrefour de la modale n'a plus les blocs « Why it was rejected » + « How to resolve » + « Things to check » (3 cartes avant d'atteindre le contenu). Une seule `ds-functional-notice` (info) : la raison en titre sur une ligne, l'action suggérée, les étapes sur une ligne chacune avec leurs boutons ; la cause probable passe en info-bulle. Puis directement « Errors » et les blocs, sans défilement. Textes de `reject-cases.data.ts` raccourcis.
- Coverbook : colonne `Policy Type & ID` avec largeur plancher, les identifiants ne sont plus tronqués.
- Serveur de test de main : http://localhost:4450 (les ports 4400 et 4440 servent les worktrees, pas main).

## ZeroHeight : Button v2 (2026-11-04 16:05)
Page Button (id 9166118, masquée) : tableaux sans pleine largeur, 3 paires Do / Don't visuelles avec les vrais composants Figma (une seule Primary, hiérarchie, bouton désactivé) dans l'onglet Usage. Les callouts ne sont pas autorisés dans les colonnes ZeroHeight. Reste : images pour les do / don't de libellé (pas de composant Figma avec texte libre), schéma d'anatomie, états Loading (librairie à resynchroniser dans ZeroHeight).

## ZeroHeight : do / don't en vert et rouge (2026-11-04 16:40)
Cause du problème : mes paires Do / Don't en colonnes remplaçaient le bloc `<rules>` natif (cartes vertes et rouges). Correction : une `<rule item-id>` par cas, l'image venant d'un frame Figma synchronisé.
- Frames d'illustration créés dans la librairie **Action**, page Button, section `ZeroHeight · Button illustrations` (id 930:1069) : do/don't (une Primary, libellé, hiérarchie, loading/disabled), icône, anatomie numérotée. Source : vrais composants Button.
- **À faire par l'utilisateur** : resynchroniser la librairie Action dans ZeroHeight (et republier le fichier Figma si besoin). Ensuite : `get-designs` (libraryUid xCeEJPn6fliEshuE9fnrqs, search "do ·" / "dont ·") donne les `item_id`, puis refonte du bloc rules de la page Button (9166118).
- L'envoi d'images en base64 par `upload-asset` est abandonné : un PNG de test a été refusé par l'API de lecture d'images. Page de test masquée `tmp image test` (9167232) à supprimer à la main, avec l'ancienne page « Button (first draft, to delete) » (8352976).

## ZeroHeight : Button, vrais do / don't (2026-11-04 20:10)
Synchro de la librairie Action OK. Page Button (9166118, masquée) : 4 blocs `<rules>` natifs (une Primary, hiérarchie, loading/disabled, libellés et icône) avec images Figma (`item-id` 647197887 à 647197899), schéma d'anatomie dans l'onglet Specs (version 991880171). Les `version-id` des designs de l'Overview ont été mis à jour automatiquement par ZeroHeight (nouvelle synchro). À valider par l'utilisateur avant de démasquer et de décliner sur les autres pages.

## 2026-11-05 : push, création de buyer par pays, Manual Underwriting (matin)

- **GitHub** : main poussé (40a9f428 puis 5929db5b). Le hook pre-push exige une entrée dans `release-notes.data.ts` et la version de l'écran modifié quand `src/app/pages/` change. Build de production : Coverbook et Reject Management passés en `loadComponent` (bundle initial 1,89 Mo, budget 2 Mo).
- **Création de buyer (Search)** : le pays est le premier champ de l'étape Identity (`shared/country-rules/country-rules.data.ts`, 8 pays, échantillon plausible). Il filtre formes juridiques, types d'identifiant, zone administrative et nomenclature d'activité ; champs désactivés tant qu'aucun pays n'est choisi ; l'étape Address affiche le pays en lecture seule. Édition (Admin Data, `company-edit-wizard`) : pays déjà fixé (gb), mêmes listes filtrées. Commit 5351eac5 local, **non poussé**.
- **Reject Management** : carrefour uniforme (notice toujours présente, carte « Errors » toujours nommée ainsi, plus de mention des champs masqués), panneau gris qui s'adapte au contenu.
- **Manual Underwriting** : analyse Useberry faite (`docs/manual-underwriting/useberry-analysis.md`, 197 sessions, 6 cartes proposées). Agent de construction en cours sur `feat/manual-underwriting` (worktree `C:\Users\JDAHAN\documents\qirin-manual-underwriting`, port 4460) : page `manual-underwriting/:id`, cartes avec « View details », modale Complete, modale Send (transfert de la demande) d'après le Figma ManA (SbtOWQeRBaqzPyRr6e4Eas, nœud 5:8014).
- **À venir sur Figma** (après validation par l'utilisateur) : un fichier par fonctionnalité dans le dossier MCP : Coverbook (buyer + policy ensemble), Reject Management, Manual Underwriting, même gabarit que Search et Buyer Summary, cadres en 1280.

## Figma en parallèle (2026-11-05 10:30)
Fichiers créés dans le dossier MCP (projet 683452905), 7 pages chacun : **Qirin · Coverbook** `NflKzgx17mOn2JPoFaqnjW`, **Qirin · Reject Management** `zUzOSE77EjbShM9u7yLthB`, **Qirin · Manual Underwriting** `9EXkGvyk2yGF9qFpRpV0Ey` (attend la fin de la page). Playbook technique pour les agents : `docs/figma/PLAYBOOK.md`.
Étape 1 (4 agents en cours) : composants locaux + shell, et Cover / Changelog / Overview, pour Coverbook et pour Reject Management. Étape 2 à lancer ensuite : écrans (plusieurs agents par fichier, une section chacun), States, Specs annotées, vignettes de l'Overview, contrôles débordement, couverture « Ready for dev ».
