# Brief : page « Card kit » du fichier Bento (2026-11-23)

Fichier : « Qirin · Buyer Summary V2 (Bento) », clé `XW7jVtIa6UWRTqKMDqOF5D`. Créer une NOUVELLE page « Card kit »
(ne modifier aucune autre page, sauf lecture ; cloner est permis). Rien en librairie, rien publié.

## Demande utilisateur
Une panoplie de cards génériques, basée sur les nouvelles cards Bento de Buyer Summary V2, pour imaginer les futurs
contenus ET disposer de cards génériques qu'on fait évoluer : normaliser, chaque taille, chaque état, avec des SLOTS et des
ATOMES DE CONTENU LOCAUX. Validé tel quel par l'utilisateur.

## À lire d'abord
CLAUDE.md, DESIGN.md, docs/figma/PLAYBOOK.md (pièges use_figma), mémoire utilisateur (index
`~/.claude/projects/C--Users-JDAHAN-documents-Qirin-Claude/memory/MEMORY.md`, surtout figma-masters-slots,
figma-nested-props, buyer-summary-v2-bento, figma-component-page-layout, figma-specs-layout, figma-canvas-spacing,
ds-token-rules, visual-qa-lessons, no-em-dashes). Rapports existants du dossier docs/benchmark-2026-11-20-bento/
(_figma-*.md : ids, constructions déjà faites, composants locaux « Local · » section 51:3654 de la page Edit flow 44:2 à
RÉUTILISER : Card toolbar, Toolbar size…). Données : src/app/pages/buyer-summary-v2/*.data.ts, *.status.ts, *.facts.ts,
bento-card-body.component.html (contenus réels par card et par palier).

## Structure validée
1. Maître unique `Bento Card` (component set local) :
   - Variantes : `Emphasis` = None, Subtle, Strong, Negative subtle, Warning subtle, Positive subtle, Negative strong,
     Warning strong (PAS de Positive strong / vert plein) ; `State` = Default, Loading (squelette), Empty, Error (Retry),
     Edit (barre d'outils V1 + poignée, réutiliser Local · Card toolbar). Si le produit croisé est trop lourd, garder
     Emphasis x Default et seulement None pour Loading/Empty/Error/Edit ; justifier dans le rapport.
   - Taille = PAS une variante : auto-layout, la card se redimensionne ; 14 préréglages documentés (1x1 à 4x3, unité et
     gouttière des pages Board : reprendre la règle du rapport _figma-board-1280.md, 180 px à 1280, gouttière 16).
   - Atomes internes préfixés « . » exposés (isExposedInstance) : `.Card Header` (titre = question métier, icône info,
     `.Status` = icône + libellé + raison, Button Icon optionnel), slot `Content` (createSlot), `.Card Footer` optionnel
     (date de mise à jour ou Link « See figures »), visibilité par booléens. Propriétés minimales.
   - Rayon 8 px Border/Radius/M, couleurs des emphases = celles de la page Emphasis levels 29:2 (_figma-emphasis.md).
2. Atomes de contenu locaux `Local · …` (composants locaux, booléen ou variante `Reversed` pour fonds forts) :
   Key figure (valeur + unité + delta flèche + contexte), Key figure row, Bullet graph, Stacked bar, Sparkline, List row,
   Task item, News item, Timeline item, Mini table row, Progress, Grade chip, Empty hint. Réutiliser d'abord les
   instances de librairie (Grade, Badge, Progress Bar, Chart, Link, Icon…) via search_design_system.
3. Page « Card kit », sections « NN · Sujet » sur une ligne ou une grille propre, marges 160, 560 px entre sections
   annotées, annotations courtes + cadre Notes :
   01 Master (variantes, propriétés), 02 Sizes (14 formats, slot vide, cotes), 03 States (5 états x 3 tailles),
   04 Emphasis (niveaux), 05 Content atoms (chaque atome normal + Reversed), 06 Today (les cards actuelles du Buyer
   Summary V2 refaites avec le maître + atomes, données du code), 07 Future (8 à 12 idées de contenus futurs composées
   UNIQUEMENT avec maître + atomes : historique de paiements, comparaison sectorielle, alertes, documents, contacts,
   groupe / bénéficiaires, notations externes, sinistres…, chacune titrée par une question métier, données plausibles
   cohérentes avec Immobilière du Marais 137381425).

## Règles
- Skills figma:figma-use + figma:figma-generate-library (+ figma-generate-design pour 06/07) chargées avant use_figma ;
  create_session sur la clé ; appels use_figma séquentiels.
- Variables Semantic et styles de texte Tokens partout, aucune valeur brute ; toute valeur sans token = proposition notée.
- Textes en anglais, aucun tiret cadratin. Look « fait main », beau, dense mais lisible (12 méta / 14 texte / 16+ valeurs).
- Vérifier par get_screenshot chaque section : aucun texte coupé, aucun débordement, aucune card vide ou saturée,
  rien qui chevauche une section voisine.
- Rapport : docs/benchmark-2026-11-20-bento/_figma-card-kit.md (ids du maître, des atomes, des sections, propriétés,
  écarts, propositions de tokens, questions). Ne pas commiter. Réponse finale courte.
