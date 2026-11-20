# Brief commun : Buyer Summary V2 en Bento, fichier Figma (2026-11-20)

Fichier : « Qirin · Buyer Summary V2 (Bento) », clé `XW7jVtIa6UWRTqKMDqOF5D`. Pages : Read me 0:1,
Formats · squares and horizontals 1:2, Formats · verticals and blocks 1:3, Board · 1280 1:4, Board · 1920 1:5.
Plusieurs agents travaillent EN PARALLÈLE : chacun ne touche QUE sa page (setCurrentPageAsync sur son id).

À lire : CLAUDE.md, PRODUCT.md, DESIGN.md, docs/figma/PLAYBOOK.md, et SURTOUT
docs/benchmark-2026-11-20-bento/benchmark-bento.md (direction A « Mosaïque ordonnée », grille, 14 formats, tableau des
formats avec exemple de card Qirin dense et données, niveaux de contenu, highlight marine static-background-brand).
Données : mocks de src/app/pages/buyer-summary-v2/ (société Immobilière du Marais, 137381425) ; rester cohérent.

Demande utilisateur : vrai dashboard Bento, MAXIMUM d'information, cards DENSES mais belles et lisibles ; tous les
formats (carrés, horizontaux, verticaux, blocs) ; chaque format en version normale ET highlight (fond coloré).

Règles Figma :
- Skills `figma:figma-use` + `figma:figma-generate-design` avant tout use_figma (ToolSearch pour les schémas), session
  existante ou create_session sur ce fichier.
- Vraies instances des librairies Qirin (Action xCeEJPn6fliEshuE9fnrqs, Data Entry 1wVY9FfjONIX6us9JmIm7U, Data Display
  VpConH5AUGyCqtp8PMqj1i, Feedback fH3vmSNZR8r0sU3kN455CD, Layout bbgSPUChd18EVNGijjoZGn ; tokens 4TxqgJPVFZc4ZKw4JZ6OAn) via
  search_design_system / import par clé : Grade, Badge, Chart, Pie Chart, Progress Bar, Link, Button Icon, Icon, Card…
  Couleurs, espacements, rayons, textes liés aux variables Semantic et styles de texte Tokens. Aucune valeur brute.
- Grille : unité de colonne 172 px de large, lignes carrées (172 px), gouttière 16 px (Spacing/M). Une card NxM =
  N*172 + (N-1)*16 de large et M*172 + (M-1)*16 de haut. Auto-layout à l'intérieur des cards.
- Titre de card = question métier ; chiffre jamais seul (contexte, delta flèche + texte) ; une card = une question.
- Ne modifie aucune librairie, ne publie rien. Textes en anglais. Aucun tiret cadratin.
- Vérifie par capture (get_screenshot) : aucun texte coupé, pas de card vide ou saturée, contraste du highlight.
- Rapport : docs/benchmark-2026-11-20-bento/_figma-<page>.md (nodeIds, contenu, doutes). Ne commite pas. Rapport final court.

## Ajouts utilisateur (2026-11-20 11:08)
- MODERNISER : c'est l'occasion de moderniser le rendu selon le benchmark (rythme, hiérarchie, micro-visualisations,
  rayons et respiration plus actuels si le benchmark le justifie). Toute valeur qui n'existe pas en token est notée
  comme proposition dans le rapport, pas inventée en dur sans le dire.
- BORD BAS PROPRE : le bento ne déborde pas en bas. Le board forme un rectangle net : toutes les colonnes se terminent
  à la même hauteur (dernière rangée complète, pas de card qui dépasse seule, pas de trou en bas) à chaque largeur.
  Choisir et ajuster les formats pour que ça tombe juste. Et aucun contenu ne déborde de sa card (rien de coupé,
  pas de scroll interne).
