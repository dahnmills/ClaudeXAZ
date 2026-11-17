# Tutoriel vidéo Button : rapport

## Fichiers

- `tuto-output/button/Qirin-Button-tutorial-1080p.mp4` : 1920 x 1080, 60 i/s, 44 s, 5,9 Mo
- `tuto-output/button/Qirin-Button-tutorial-720p.mp4` : 1280 x 720, 30 i/s, 1,9 Mo (pour ZeroHeight)
- `tuto-output/button/poster.jpg` : vignette (titre posé, aussi image 0 de la vidéo)
- `tuto-output/button/work/` : captures (`shots/`), images, bande son, contrôles (`qc/`, `stills/`)
- `tuto-output/_template/` : le gabarit (moteur, configs, musique, README)

## Scènes (44 s)

| Temps | Chapitre | À l'écran |
|---|---|---|
| 0-3,4 | Titre | Qirin design system, **Button**, pastille Action (fond navy) |
| 3,4-7,6 | 1 What it is | « A button triggers an action on the current screen. » Un vrai Validate : survol puis appui |
| 7,6-12 | 2 Four types | Primary, Secondary, Tertiary, Plain côte à côte, chacun avec son rôle |
| 12-19 | 3 The key rule | « One Primary per area. » Do : la barre réelle de Reject Management (Delete Secondary, Resubmit Primary). Don't : la même barre où Delete bascule en Primary |
| 19-28 | 4 States | Hover (curseur, puis appui), Focus (touche Tab, anneau), Loading (vrai spinner en rotation), Disabled |
| 28-39,6 | 5 In use | Reject Management : actions grisées, deux lignes cochées, zoom sur la barre (bulles Secondary, Primary), survol et clic sur Resubmit, lignes retirées, toaster « 2 rejects resubmitted » |
| 39,6-44 | Fin | Button, « Full guidelines on ZeroHeight », « Live examples in Storybook », chemin Design System / Action / Button |

Tous les boutons sont de vrais `ds-button` du serveur de dev (port 4450, code courant, libellé SemiBold) : déplacés
sur une scène blanche et réglés par leurs inputs signal (`type`, `disabled`, `loading`). Survol, appui et focus sont
de vrais événements souris et clavier, les 12 images du spinner viennent de son animation CSS. Pas de topbox (Reject
Management n'en a pas). Mots mis en avant en bleu. Aucun tiret cadratin.

## Son

Musique seule, sans voix ni effet (pas de whoosh, riser ni bip). ElevenLabs `music_v2_5` (identifiant vérifié par
`/v1/music/plan`), brief de compositeur « calm and confident corporate keynote », 48 s à 120 BPM. Prise `a` retenue :
c'est la seule des deux qui a une vraie fin (la `b` s'arrête net à 48 s). Elle démarre à 4 s dans la piste, donc ses
changements de phrase (cymbale sur le temps fort) tombent à 12 s (règle clé) et 28 s (mise en situation), et son
accord final sonne de 42 à 44 s. Spectrogramme contrôlé : rien ne monte au-dessus de 5 kHz avant les changements de
phrase. Fondu d'entrée 0,8 s, -16 LUFS.

**Crédits ElevenLabs :** un plan (gratuit) et deux générations musicales de 48 s (prises a et b). La clé n'a pas le
droit `user_read`, donc le coût exact n'est pas lisible par l'API (et aucun en-tête de coût n'est renvoyé) : le
vérifier dans le tableau de bord ElevenLabs. Cette piste sert à **tous** les futurs tutoriels : pas de nouveau crédit
pour décliner un composant.

## Autocritique (images extraites du MP4 final)

- Lisibilité : titres 60 px, textes 30 à 40 px, composants agrandis 2,2 à 2,6 fois (captures x4, nettes). L'écran
  entier de Reject Management en vue large a un texte d'environ 15 px : lisible en 1080p, juste en 720p ; d'où le zoom
  sur la barre d'actions et la bulle sur le toaster.
- Textes sur une ligne : vérifiés toutes les 0,25 s (`render.js check`), aucun débordement.
- Éléments coupés : corrigés en cours de route (un zoom de fin coupait les colonnes du tableau, remplacé par la vue
  entière et une bulle ; un filet gris en bord de capture Do/Don't, recadré ; le cadrage du zoom sur la barre s'arrête
  sur une ligne de séparation). Le bas de l'écran est le bord réel de la fenêtre 1440 x 810.
- Rythme : un chapitre toutes les 4 à 9 s, calé sur la musique. Point faible restant : la galerie des quatre types
  (4,4 s) passe vite ; on peut lui donner 1 s de plus en raccourcissant la scène « What it is ».

## Décliner un autre composant

Voir `tuto-output/_template/README.md`. En bref : copier `components/button.config.js`, changer la recette de capture
et les textes, puis `capture.js`, `render.js check`, `render.js stills`, rendu des images, `encode.js`.
Test fait avec **Badge** (`components/badge.config.js`, aperçu seul, pas d'export) : vrais `ds-badge` du Notification
module, réglés en `label`, `status` et `variant`, cinq statuts Light, Light contre Strong, mise en situation dans le
Notification module. Le moteur a suivi sans changement de fond (deux ajouts génériques : démo statique sans curseur,
scène d'écran sans curseur). La scène « In use » du Badge reste un brouillon (20 s pour un seul plan : à découper en
temps forts avant tout export). Images d'aperçu : `tuto-output/badge/work/stills/`.
