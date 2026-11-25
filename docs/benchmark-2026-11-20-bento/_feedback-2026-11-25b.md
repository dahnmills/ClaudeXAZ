# Retours utilisateur du 2026-11-25, suite (Buyer Summary V2)

1. **Boards modèles (templates) NON modifiables.** On ne peut ni les éditer, ni les renommer, ni les supprimer.
   Sur un modèle ouvert, pas de bouton « Edit board » : à la place, « Duplicate » (ou « Duplicate to edit ») qui crée
   un board perso à partir du modèle et l'ouvre directement en mode édition. Les boards perso restent entièrement
   modifiables (Edit board, renommer, supprimer).
2. **Dupliquer, deux chemins :**
   - « d'un côté » : bouton Duplicate sur le board ouvert (modèle ou perso) ; dans Manage boards, une action Duplicate
     sur chaque ligne (modèle et perso) est acceptable si c'est le plus clair, mais pas de flèches de tri ni de Reset ;
   - « New board » propose : à partir d'un modèle, à partir d'un board existant (copie d'un modèle ou d'un perso), ou
     vide.
   Le nouveau board reçoit un nom par défaut éditable (« Copy of Common », « New board »).
3. **Plus d'étoile pour l'emphase.** Dans Qirin, l'étoile veut dire **favori** (comme dans Search), jamais emphase.
   Le bouton Emphasis de la barre d'outils de card (code et Figma, atome `.Card Toolbar` de la librairie Data Display)
   prend une icône plus claire pour « fond de la card » : chercher d'abord dans la librairie d'icônes Qirin / A1 de
   Figma (pot de peinture, remplissage, contraste, palette) et l'ajouter au registre `ds-icon` si elle manque ; sinon
   remplacer le bouton icône par un petit aperçu de couleur (pastille du fond actuel). Libellé accessible « Background ».
   Vérifier qu'aucune autre étoile ne sert à l'emphase nulle part (galerie, menus, doc, Do/Don't).
4. Reset : rien à réintroduire, les modèles n'étant plus modifiables. Undo / Cancel en édition restent.
