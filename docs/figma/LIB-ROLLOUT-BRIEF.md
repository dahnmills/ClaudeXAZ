# Consigne commune : caler une librairie Figma sur le modèle Action

À lire EN ENTIER avant de commencer. Modèle validé par l'utilisateur le 2026-11-16 : librairie Action (`xCeEJPn6fliEshuE9fnrqs`), pages Button (44:554, section 4030:979) et Button Icon (12:118, section 4040:1005). Regarde-les en capture avant toute écriture.

Écrire en français dans les rapports, en anglais dans Figma. Aucun tiret cadratin (—) nulle part. Pas de publication, pas de commit git, pas de MCP ZeroHeight (il coûte des crédits).

## Outils
ToolSearch `select:mcp__plugin_figma_figma__use_figma,mcp__plugin_figma_figma__create_session,mcp__plugin_figma_figma__get_screenshot,mcp__plugin_figma_figma__get_metadata`, puis Skill `figma:figma-use`. Un `create_session` par agent, avec `skillNames: "figma-use"` à chaque appel. Appels `use_figma` séquentiels pour un même agent, un seul `setCurrentPageAsync` par appel. D'autres agents travaillent en même temps dans le même fichier, sur d'AUTRES pages : ne touche qu'aux pages de tes composants.

## Ce que tu fais pour CHAQUE composant, dans cet ordre

### 1. Figma propre, sans rien casser (modèle : `docs/zeroheight/_fix-figma-action-A.md`)
- Lie aux variables `Tokens / Semantic` les paddings, gaps, rayons, couleurs et textes en dur, UNIQUEMENT quand un Semantic de même valeur résolue existe. Remplace les liaisons Foundation directes par le Semantic de même valeur.
- Description du composant (COMPONENT_SET ou COMPONENT) : une phrase d'usage, d'après le .md ZeroHeight.
- Ne crée, ne renomme et ne supprime aucun composant, aucune variante, aucune propriété. Ne détache rien. Aucun token, collection ni mode créé.
- Vérification : signature de géométrie avant/après (positions, tailles, paddings, rayons, fills) et capture avant/après. Si un rendu change (cas des rayons de Button dans Split), annule la liaison et note-la en « différé ».

### 2. Frames do / dont (modèle : `docs/zeroheight/_dodont-figma-A.md`)
- Règles : onglet Usage du .md local `docs/zeroheight/<famille>/<composant>.md` (blocs Do / Don't). Texte EXACT de la règle.
- Une frame par règle dessinable, nommée `do · <composant-kebab> · <sujet court>` ou `dont · ...`. Taille 360 x 140 (plus haute si besoin, plus large seulement si le composant l'exige). Fond `Static/Background/Main/Secondary`. Contenu : VRAIES instances des composants publiés, jamais de dessin à la main ni de copie détachée.
- Règle non dessinable : pas de frame, elle sera en carte « text only ».
- Une frame `anatomy · <composant>` si l'anatomie s'y prête.

### 3. Doc kit : cadre `Documentation · <Nom>` (`docs/figma/doc-kit/doc-kit.js` et README)
- Spec construit depuis le .md (description, propriétés, états, tokens, notes, usage), `docs/components-status/components.json` (version, statut, liens Storybook et ZeroHeight) et le code `src/app/shared/ui/<composant>` (inputs Angular). Les écarts Figma / code vont dans `notes`, jamais corrigés en douce.
- `miss` doit être vide.

### 4. Planche Do / Don't (`docs/figma/doc-kit/board-kit.js`)
- Avec les frames de l'étape 2 (paires, `textOnly`, `extras` pour anatomy).

### 5. Page normalisée (`docs/figma/doc-kit/page-kit.js`, fonction `normalize`, notice en fin de README)
- Résultat : UNE section au nom du composant : Versionning | `_Design system header` (01 Component, restylé) | `Documentation · <Nom>` (02) | `Do/Don't` (03). Tout aligné en haut, 160 px de marge et d'écart. `lost`, `miss` et `overlaps` vides.
- `review` : 2e gabarit `_Design system header` « Documentation » (ancien Do/Dont) et brouillons, rangés dans `<Nom> - To review`, jamais supprimés. Un objet qui contient des COMPONENT ne va jamais en To review : signale-le.
- Pas de gabarit d'en-tête sur la page : laisse le composant en place, normalise 02 et 03, signale-le (décision utilisateur).
- Plusieurs composants sur une page : une section par composant, empilées à 400 px d'écart.

### 6. Contrôle visuel (obligatoire, voir mémoire « leçons de qualité visuelle »)
Au moins 2 passes de capture par composant. Juge comme un designer : comparaison avec Button, textes coupés, libellés sur deux lignes, cartes déséquilibrées, repères d'anatomie qui ne visent pas leur cible, frame qui déborde. Corrige par petits scripts.

## Interdits absolus
- Ne jamais renommer, dupliquer, redimensionner ni recréer une frame `do · ...` / `dont · ...` / `anatomy` existante (ZeroHeight les vise par id).
- Ne pas toucher aux composants des autres agents, ni aux maquettes (le fichier Layout `bbgSPUChd18EVNGijjoZGn` contient la maquette cible, node 2865:10424 : n'y touche pas).
- Ne rien supprimer en dehors des cadres de kit vidés et des sections ZeroHeight vides (le kit le fait).

## Rapport
`docs/zeroheight/_lib-rollout-<lot>.md`, tenu au fil de l'eau (une section par composant : ids de la section, de Documentation et de Do/Don't ; liaisons posées et différées ; frames do/dont créées avec la règle ZeroHeight correspondante et le nodeId ; règles text only ; To review ; écarts et décisions). Réponse finale : 10 lignes maximum.
