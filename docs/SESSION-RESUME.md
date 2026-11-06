# SESSION-RESUME : état du monde pour reprendre une session

Ce fichier est injecté automatiquement au démarrage et après chaque compaction (hook SessionStart). Il est court et à jour : le mettre à jour après CHAQUE décision de l'utilisateur, chaque jalon et chaque rapport d'agent. Détail long : `docs/figma/STATUS.md`, `docs/figma/progress.md`, `docs/figma/PLAYBOOK.md`. Règles durables : dossier mémoire `~/.claude/projects/C--Users-JDAHAN-Documents-Qirin-Claude/memory/` (index MEMORY.md).

Dernière mise à jour : 2026-11-06 10:45.

## Code (dépôt dahnmills/ClaudeXAZ, branche main)
- Tout est fusionné et poussé sur main (dernier push 2f378648, Pages OK) : Search pays en premier, Reject Management, Coverbook, Manual Underwriting, passe de qualité visuelle, atomes partagés corrigés, `docs/components-status/`. Commits locaux non poussés possibles : voir `git log origin/main..main`.
- NON fusionné : `feat/exposure-cards` (worktree `C:\Users\JDAHAN\Documents\qirin-exposure`, port 4480, commit f03ccec1). Attend la revue de l'utilisateur.
- Avant tout push : build de production (budget bloquant 2 Mo, actuel 1,91 Mo), note de version `src/app/pages/release-notes/release-notes.data.ts` + version d'écran dans `src/app/user-testing/screens.data.ts` (hook pre-push). Déploiement bloqué : voir mémoire `github-pages-stuck-deploy`.
- Serveurs : main 4450 (`npx ng serve --port 4450`), worktrees reject-management 4400, coverbook 4440, manual-underwriting 4460, exposure 4480.

## Figma (dossier MCP, projet 683452905, plan organization::938843005951693382)
- Livrés (7 pages, "Ready for dev" v1.0) : Coverbook `NflKzgx17mOn2JPoFaqnjW`, Reject Management `zUzOSE77EjbShM9u7yLthB`, Manual Underwriting `9EXkGvyk2yGF9qFpRpV0Ey`. Search `LBLqJmlPqXmx9qksCyYGPb` et Buyer Summary `0ZjZu0OjHdzGowm3hliM2M` livrés avant.
- Exposure Card `5OVzA6FZD7o8aGtfK5qo7g` (1 page, aligné sur f03ccec1).
- Component Status `wqlQIlGhJmMCfgc2XD1Umm` : EN CONSTRUCTION par un agent à partir de `docs/components-status/components.json` (169 composants). À vérifier à son rapport.
- À faire à la main par l'utilisateur : nommer la version et choisir la vignette de chaque fichier ; publier les librairies. Les agents Figma ne publient jamais les librairies.
- Règles : PLAYBOOK.md (1280 px, tokens, annotations courtes + Notes, 440 px libres, 560 px entre écrans, jamais de sections superposées).

## ZeroHeight (reporté par l'utilisateur)
- Serveur MCP `allianz-trade` rajouté (`claude mcp add --transport http allianz-trade https://mcp.zeroheight.com/mcp`) : visible seulement après redémarrage de session puis `/mcp` > Authenticate.
- 78 pages Markdown dans `docs/zeroheight/`, page Button pilote masquée (9166118). Bloqueurs : valider le Button, connecter les librairies Feedback et Layout dans ZeroHeight, supprimer à la main les pages de test 8352976 et 9167232. Toujours créer en masqué.

## Décisions en attente de l'utilisateur
1. Valider la card d'exposition et fusionner `feat/exposure-cards`. Composant Figma Exposure Card : garder le contenu d'exemple dans les variantes ou le refaire avec de vrais slots. Contraste jaune/orange/gris sous 3:1.
2. Changelog Reject Management : une v1.0 fusionnée (2026-11-05) ou deux entrées (v1.0 du 2026-10-21 et v1.1).
3. Dossier Figma « Qirin Local Library » : donner l'URL pour y recréer Component Status (aujourd'hui dans le dossier MCP).
4. Hypothèses Manual Underwriting à confirmer avec le métier (quatre yeux, retour en Draft).

## Agents en cours à vérifier
- Component Status Figma (agent adaa8febcb6fe010a) : rapport attendu.

## Préférences de travail de l'utilisateur
- Réponses en français, courtes, avec un tableau d'avancement en % et une heure de fin quand il le demande. Il délègue (« toi tu gères ») : agir sans lui renvoyer des commandes. Plusieurs agents en parallèle pour aller vite (plafond pratique 6 à 7 agents Figma). Pas de tiret cadratin. Juger les captures, pas seulement des scripts (voir mémoire `visual-qa-lessons`).
