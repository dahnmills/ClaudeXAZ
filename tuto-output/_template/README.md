# Gabarit des tutoriels vidéo du design system

Un film de 44 s par composant, musique seule (pas de voix), textes en anglais à l'écran.
Le contenu est dans `components/<composant>.config.js`, le moteur dans `engine/`.

## Faire le film d'un autre composant

1. Le prototype doit tourner : `npx ng serve --port 4450` (routage par hash).
2. Copier `components/button.config.js` en `components/<nom>.config.js` (ou `badge.config.js`, plus court) et adapter :
   - `id`, `name`, `family`, `files` ;
   - `capture.run(h)` : quelle page ouvrir, quels composants isoler, dans quels états (voir « Capture ») ;
   - `scenes` : textes et timings (voir « Scènes »).
3. Lancer, depuis `engine/` :

```sh
node capture.js <nom>                # captures réelles -> ../../<nom>/work/shots
node render.js <nom> check           # chaque texte sur une ligne, dans la zone sûre
node render.js <nom> stills 2 9 16   # images de contrôle -> work/stills
# rendu complet (2640 images), en 4 morceaux parallèles
for r in 0:659 660:1319 1320:1979 1980:2639; do PORT=$((4471 + ${r%%:*} / 660)) node render.js <nom> frames $r & done; wait
node encode.js <nom>                 # MP4 1920 x 1080 60 i/s + 1280 x 720 30 i/s, poster.jpg
```

Avant de livrer : extraire des images du MP4 final avec ffmpeg et les regarder (textes sur une ligne, rien de coupé,
pas de curseur sur un texte), puis `node analyse.js ../../<nom>/work/audio.wav` (spectrogramme).

## Capture (`h`)

**Mise en situation générique, jamais d'écran ni de libellé de feature.** Un film de composant ne doit pas être
associé à une fonctionnalité du produit : ni écran de fonctionnalité, ni nom de feature, ni libellé métier (dans les
captures, les légendes, les bulles et les toasts). On compose une scène neutre avec de vrais `ds-*` (par exemple le
catalogue `/design-system-components` : une modale « Edit contact details », un footer Cancel + Save, un toaster
« Changes saved ») et des textes génériques (Save, Cancel, Jane Smith, example.com).

Rien n'est dessiné : on déplace de vrais composants `ds-*` de la page sur une scène blanche et on règle leurs inputs
signal sur l'instance vivante.

| Appel | Effet |
|---|---|
| `h.go(route, { vp, dpr })` | ouvre `http://localhost:4450/#<route>` (1440 x 810 par défaut, capture x4) |
| `h.eval(fn, arg)` | code dans la page ; `__t.adopt(el, { label, keepIcons, inputs })`, `__t.setIn(el, input, valeur)`, `__t.rect`, `__t.union` |
| `h.shot(id, sélecteur, { pad, clip })` | capture d'un élément (même `clip` pour tous les états d'un composant) |
| `h.hover`, `h.press` + `h.release`, `h.keyFocus`, `h.away` | vrais survol, appui, focus clavier, souris hors champ |
| `h.frames(id, sélecteur, n, période, clip)` | n images d'une animation CSS (spinner, skeleton) |
| `h.screen(id, { nom: sélecteur })` | écran entier + rectangles nommés (curseur, caméra, bulles) |

## Scènes

| Type | Champs | Usage |
|---|---|---|
| `title` | `kicker`, `title`, `tag` | ouverture, fond navy |
| `statement` | `text`, `sub`, `demo` (`shots.rest`, optionnel `hover`, `down`, `hoverAt`, `clickAt`) | à quoi il sert |
| `gallery` | `heading`, `scale`, `items` (`shot`, `sub`, optionnel `caption`) | variantes côte à côte |
| `dodont` | `heading`, `sub`, `do`, `dont` (`shot`, `text`), `scale` | règle clé ; le Don't part du Do puis bascule |
| `states` | `heading`, `rest`, `items` (`kind` hover, focus, loading, disabled) | états, un par un, puis tous visibles |
| `screen` | `shots`, `cursor`, `camera`, `captions`, `callouts` | en situation dans un vrai écran |
| `end` | `title`, `lines`, `foot` | où trouver la doc |

Mots mis en avant : `<em>` (bleu, jamais rose). Pas de tiret cadratin. Pas de topbox, pas d'écran ni de libellé de feature (voir « Capture »).

## Musique

Une seule piste pour tous les films : `music/bed-a.mp3` (ElevenLabs `music_v2_5`, 48 s, 120 BPM), jouée à partir de 4 s.
Elle change de phrase à **12 s** et **28 s** du film et son accord final sonne de 42 à 44 s : couper les chapitres
sur ces instants (le gabarit Button le fait). Une nouvelle piste : `NODE_OPTIONS=--use-system-ca node music.js plan`
(gratuit) puis `compose -c` (payant), et la contrôler avec `analyse.js` (pas de souffle qui monte avant 16 s et 32 s).
La clé est lue dans `brag-output-2026-10-15-bs/work/.env.local` (ou `TUTO_ENV`), jamais affichée.
