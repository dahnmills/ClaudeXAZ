# Documentation Figma Action (lot D)

Date : 2026-11-06. Librairie `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`). Ajouts uniquement : aucun composant, variante, frame existant ni section `ZeroHeight · ... illustrations` n'a ete modifie, rien n'a ete publie.

## Methode

- Un cadre `Documentation - <Composant>` de 1280 px par composant, auto-layout, pose sous tout le contenu existant de la page (>= 560 px d'ecart, controle par script : 0 debordement, ecart mini 560).
- Contenu : en-tete (nom, description, statut, liens code / Storybook / ZeroHeight / Figma, URLs cliquables), Anatomy (schema avec instance reelle + pastilles numerotees reliees + legende), Properties, States, Tokens (noms CSS Semantic reels + alias Foundation), Usage and accessibility, cadre Notes (ecarts connus et decisions en attente).
- Tout est lie aux variables Semantic existantes (fonds, traits, espacements, rayons, tailles) et aux styles de texte Title / Body ; aucun token cree. Textes en anglais, sans tiret cadratin.
- Les pastilles d'anatomie jouent le role d'annotations courtes ; aucune annotation native Figma ajoutee (elles s'empilent sur des noeuds proches).
- Statut ZeroHeight indique `draft (page hidden)`.

## Tile (page 615:77)

- Ajoute : `Documentation - Tile` **960:924** (stage d'anatomie 960:959, instance reelle de `Tiles` avec Sub Label active).
- Existait deja : en-tete gabarit (615:158, placeholder "Component description"), frame Documentation gabarit (615:299, placeholders "Doc text", liens `https://qirin.zeroheight.com/tag`, do/dont vides), Versionning 615:342 (modele vide), section illustrations 944:6130.
- Ecarts restants (dans les Notes) : hover/active gris vs bleu, bordure 1 px, padding 0 vs 8, Sub Label absent du code, pas de Focus des deux cotes, styles `Copy/*`, fills bruts `#ECECEC` / `#5A5360`, opacite 0,4 non liee, glyphe par defaut, set nomme `Tiles`, absent de la page Status.

## Visual Button (page 288:822)

- Ajoute : `Documentation - Visual Button` **960:5627** (instance reelle de `Visual Button`, State=Default).
- Existait deja : en-tete gabarit 296:4153 (description copiee de Radio), documentation gabarit 296:4247, Versionning 296:4227, illustrations 944:6668.
- Ecarts restants : 160 vs 240 px, padding 8 vs 24, gap 4 vs 16, rayon 4 vs 8, icone 32 sans plaque vs plaque 48, bordure repos et hover differents, Selected et Focus absents de Figma, Active sans style code, input `tone` mort, sous-libelle semi-bold vs regular, ombre locale, opacite brute, pas de proprietes TEXT, valeurs brutes dans le SCSS (240, 48, 1, 3, 2 px).

## Flyout Menu (page 1:3)

- Ajoute : `Documentation - Flyout Menu` **961:1831** (instance reelle de `Flyout Menu` v3 avec 3 instances de `Flyout Item` dans le slot).
- Existait deja : en-tetes gabarits 235:2154, 235:2290, 507:1018, Versionning 235:2333, illustrations 944:7236 et 944:7432.
- Ecarts restants : doublon v2.0.0 (1:20) + `.Item` (1:56) a retirer apres migration (rien supprime), Slot sans valeur preferee (196 x 1 vide), titre de section et separateur absents, min-width 196 px brut dans le SCSS.

## Flyout Menu Item (page 1:3)

- Ajoute : `Documentation - Flyout Menu Item` **961:2081** (deux instances reelles de `Flyout Item`, dont une avec Focus).
- Existait deja : memes gabarits que ci-dessus, set `Flyout Item` 507:996 et doublon `.Item` 1:56.
- Ecarts restants : coche `selectable/selected` et `shortcut` code only, defaut d'icone different, hover grey-050 (Figma) vs grey-100 (code), noms de tokens differents pour le fond blanc, propriete `    ↳ Icon` non renommable, pas de TEXT `Label` ni de style `Body/L/Regular`, opacite Disabled brute posee sur les enfants.

## Restant a decider

- Les textes placeholders des gabarits existants (description, liens, Versionning, do/dont) n'ont pas ete remplis, la consigne interdisant de modifier les frames existants. Proposition : les remplir (ou remplacer par les nouveaux cadres) avec l'accord de l'utilisateur.
- Decisions listees dans `_audit-figma-action-D.md` (dimensions Visual Button, hover Tile, hover Flyout Item, coche de selection).
