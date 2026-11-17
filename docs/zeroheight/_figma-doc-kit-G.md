# Figma doc kit, lot G (page Utility)

Fichier `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`), page Utility (`950:2`). Kit `docs/figma/doc-kit/doc-kit.js`, reference visuelle: cadre Button `971:1014`. Cadres poses a x = 4560 (a plus de 560 px des sections annotees, dont la derniere finit a x = 4000), empiles verticalement avec 560 px d'ecart, 1280 de large. `miss` vide pour les cinq.

## Cadres crees

| Composant | Cadre | Hauteur | Version | Statuts affiches |
|---|---|---|---|---|
| Keycap | `981:1847` | 2474 | 0.2.0 | Design WIP (unpublished), Tech In code, ZeroHeight Draft (hidden) |
| Shortcut Keys | `981:5377` | 2239 | 0.2.0 | idem |
| Shortcut Row | `981:6365` | 3147 | 0.2.0 | idem |
| Keyboard Map | `981:8654` | 2405 | 0.2.0 | idem |
| Flag | `982:1514` | 2083 | 1.0.0 | idem |

Contenu: bandeau (logo cloné du gabarit Button `230:2138`, fil d'Ariane, version, statuts, liens code / Storybook / ZeroHeight masquee avec les URL `p/1032c3`, `p/49b237`, `p/164dda`, `p/91c535`, `p/756efd`), Anatomy (instance du COMPONENT, reperes), Properties, States and variants (instances reelles), Tokens (variables Semantic liees), Notes, Usage and accessibility, pied de page. Anglais, sans tiret cadratin.

## Gabarits `_Design system header` et `Versionning`

La page Utility n'en contient aucun (seulement `Utility sections` et les cinq sections `ZeroHeight · ... illustrations`). Ils n'ont donc pas ete remplis ni crees: le bandeau du cadre kit porte deja version, statuts, description, liens et fil d'Ariane. A decider si on clone les gabarits de la page Button (`230:2132`, `230:2186`, `230:2229`) sur Utility.

## Anciens cadres plats supprimes

Aucun: il n'existait pas de cadre `Documentation · <Nom>` sur cette page.

## Ecarts restants (repris dans les Notes de chaque cadre)

- Tous: `components.json` indique encore design indisponible et etat draft alors que les composants Figma existent (bibliotheque non publiee); aucune story Storybook sauf Flag. Statut Design affiche en WIP (unpublished).
- Keycap: Wide est une variante manuelle (code: longueur du libelle); Wide=True avec le libelle M mesure 24 x 24 comme Wide=False; texte accent `Interactive/Text/Neutral/Default` faute de variable `text-main-reversed` dans Semantic.
- Shortcut Keys: 3 touches max en Figma, liste libre en code; "then" sans padding en Figma (XXS en code).
- Shortcut Row: hover / active / focus en variantes (CSS en code); largeur 480 fixe; decalage du focus (XXS) non reproduit.
- Keyboard Map: touches allumees et disposition reglees sur l'instance; cote gauche fixe a 360 px (plafond sizing-3xl x 9 en code); nouveau constat: le sélecteur de dispositions mesure 423 px dans un cadre Side de 360 px qui rogne, le Tag QWERTZ est coupe. Composant non touche, a corriger a la source.
- Flag: couleurs en dur (comme le code); bordure 1 px token contre 0,5 px rgba en code; rayon XS (2 px) contre 1 px en code; gb simplifie; maitre "Flags" de la librairie Assets non reutilise. Dans les tokens, la colonne CSS dit "none in code" pour ces valeurs.

## Corrige apres critique (2 passes)

- Keycap: repere 2 (Label) deplace sur le bas de la lettre au lieu de traverser son milieu.
- Shortcut Keys: pastille 3 (Gap) chevauchait le coin de la touche 1; trait rallonge, pastille sous les touches.
- Shortcut Row: l'ancre d'anatomie etait l'etat Default dont le conteneur est invisible (repere 1 dans le vide); instance remplacee par la variante Hover pour que la rangee se voie.
- Keyboard Map: pastille 5 (touche allumee) recouvrait la touche M de la 3e rangee; repere retourne vers le haut. Note ajoutee sur le Tag QWERTZ rogne, notes renumerotees.
- Flag: legende du repere Bordure precise (dessinee a x10, la bordure de 1 px parait epaisse).
- Non corrige: tuiles de Keycap Wide=False / Wide=True identiques (propre aux variantes Figma, signale en note 2); anatomie Keyboard Map a l'echelle 0.7, texte petit, la largeur du canevas ne permet pas plus.

Captures de controle: `C:/Users/JDAHAN/AppData/Local/Temp/doc-kit-G/` (hors repo).
