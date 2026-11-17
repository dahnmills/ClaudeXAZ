# Brief commun : lot 2 + partie sûre du lot 3 (feu vert utilisateur 2026-11-17 11:13)

Lis : CLAUDE.md, docs/figma/PLAYBOOK.md, docs/figma/_audit-components-SYNTHESE.md, le rapport de TA librairie
(docs/figma/_audit-components-<lib>.md) et docs/figma/_audit-lot1-consumers.md (verdicts sûr / migration).
Mémoires utiles : ~/.claude/projects/C--Users-JDAHAN-documents-Qirin-Claude/memory/ (figma-component-page-layout,
ds-token-rules, figma-masters-slots, figma-nested-props, figma-exact-sizes).

Outils : skills `figma:figma-use` (obligatoire avant use_figma) et `figma:figma-generate-library` ; ToolSearch pour les
schémas MCP Figma ; create_session. Pas de navigateur Playwright. AUCUNE publication de librairie (l'utilisateur publie).

## À FAIRE (dans TON fichier de librairie uniquement)
Lot 2, nettoyage :
- Supprimer les sections « To review » (et leurs restes), les anciens atomes en double signalés, les instances orphelines.
- Renommer : sets mal nommés, calques « Frame n » / « Group n » / « Rectangle n » (nom = contenu), cadres `_Design system header` -> `Component`.
- Blocs Versionning : remplir ou créer (gabarit du kit docs/figma/doc-kit/page-kit.js), version et statut ALIGNÉS sur
  docs/components-status/components.json (version, state). Si Figma dit WIP et le JSON ready : écrire ce que dit le JSON et le signaler.
- Liens de documentation : `documentationLinks` de chaque maître publié vers sa page ZeroHeight
  (https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/<id6> ; ids dans components.json champ zeroheight ou docs/zeroheight/zh-editor-kit.md ;
  si aucune page : lien Storybook https://dahnmills.github.io/ClaudeXAZ/storybook/). Descriptions des atomes privés manquantes.
- Variantes et propriétés MANQUANTES listées au lot 2 de la synthèse pour ta librairie (ajout seulement, défauts = comportement actuel).
- Foundation en direct ou collection `qrn` -> variable Semantic de MÊME valeur.
Partie sûre du lot 3 (seulement les points marqués « sûr » dans _audit-lot1-consumers.md) :
- Supprimer / dépublier (préfixe `_` ou `.` selon la convention du fichier pour rendre privé) les composants sans consommateur.
- Lier les rayons, traits, paddings, gaps et styles de texte bruts au Semantic / style Tokens de MÊME valeur (pas de changement visuel).
  Valeur sans token exact : NE PAS lier, lister.
- Swap de l'ancien Link `b9493d2f…` vers Link `77367a8f…` DANS LES MAÎTRES seulement, en réglant Icon=None, en vérifiant que les libellés restent.

## INTERDIT
- Toucher aux fichiers de fonctionnalités (Coverbook, Reject Management, etc.) ou à une autre librairie.
- Migrations listées comme « migration nécessaire » : Flyout Legacy, Table Row en double, ancien Cell 38:13911, Slot déprécié, Tenant.
- Décisions en attente de l'utilisateur : taille/graisse du Badge, valeurs hors grille de Data Entry, ombres, Header Menu Open,
  Modal xlarge, propriétés de code absentes de Figma non listées au lot 2.
- Changer une valeur visible (couleur, taille, espacement). Toute liaison doit être à valeur identique.
- Créer une collection, un mode ou une variable.

## Contrôle et livrable
- Avant chaque suppression : noter nodeId + nom. Après chaque composant : vérifier (lecture) qu'aucune instance n'est cassée et
  que les dimensions des variantes n'ont pas bougé (comparaison avant/après par script, pas sur image).
- Pages : rien ne déborde, sections jamais superposées (160 px, PLAYBOOK).
- Rapport docs/figma/_lot2-<lib>.md : fait / non fait / laissé (raison), liste des suppressions avec nodeId, à publier.
- Ne commite pas. Pas de tiret cadratin (—). Rapport final court en français.
