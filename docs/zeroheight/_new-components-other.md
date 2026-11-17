# Nouveaux composants Figma, catégorie Other (page Utility)

Fichier `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`), nouvelle page **Utility** (`950:2`), sections empilées dans `950:3`. Aucune page existante touchée, librairie non publiée (à publier à la main). Tokens: Semantic uniquement, importés par clé, aucun token créé. Textes via styles Body (Allianz Neo).

| Composant | Type | nodeId | componentKey / componentSetKey |
|---|---|---|---|
| Keycap | set | `950:24` | `d40d368b4459c7f69af2e9c23d85978aa4706f20` |
| Shortcut Keys | set | `950:64` | `0cf13d5ff98b9b18d4527be8e224829b790effca` |
| Shortcut Row | set | `951:110` | `efbf23025fd16479af0be1470e5be6eb8aff1007` |
| Keyboard Map | composant | `951:150` | `6cd2ccd9cf9a5338d8b6cc1f2b1be06111bcf2b7` |
| Flag | set | `952:165` | `9e55a28dc6eb2a86a72dced7b205be1f86a7d2d0` |
| Focus Trap | non créé | n/a | directive sans visuel |

Chaque section porte aussi un cadre "Properties notes" (texte réel) et la description du composant (anglais, Do/Don't, lien code).

## Keycap (atome)
- Propriétés: Tone `Default|Accent`, Wide `False|True` (4 variantes), Label texte (défaut `M`). Hauteur et largeur min = Sizing/L, rayon Radius/S, bordure Border/Size/S, texte Body S Semi Bold.
- Écarts: en code `wide` se déduit de la longueur du libellé; en Figma c'est une variante choisie à la main. Le texte par défaut est `M` sur toutes les variantes (limite des propriétés TEXT), les touches nommées se règlent sur l'instance. Texte accent: `Interactive/Text/Neutral/Default` (pas d'équivalent `text-main-reversed`).

## Shortcut Keys (molécule)
- Propriétés: Tone `Default|Accent`, Show then (bool, off), Show key 3 (bool, off); instances exposées Key 1, Key 2, Key 3 (Keycap). Défaut `Alt` `M`. Gap Sizing: Spacing/XXS.
- Écarts: le code accepte une liste libre de touches, Figma plafonne à 3. "then" est un texte Body S tertiaire sans padding propre.

## Shortcut Row (molécule)
- Propriétés: State `Default|Hover|Active|Focus`, Used `False|True` (8 variantes), Label (texte), Context (texte) + Show context (bool, off), instance exposée Keys (Shortcut Keys, Tone suit Used). Pointillé: trait bas Border/Size/S, `Static/Border/Main/Tertiary`. Hover `Muted/Hover`, Active `Muted/Active`, Focus contour `Interactive/Border/Focus` Border/Size/M.
- Écarts: hover/active/focus sont du CSS en code, des variantes ici (nécessaire pour les montrer). Largeur 480 fixe par défaut, le pointillé remplit. Pas de décalage de focus (offset XXS) reproduit.

## Keyboard Map (molécule)
- Propriétés: Hint (texte, phrase des sources browser/manual/guess); instances exposées Layout 1, 2, 3 (Tag Type=Select, QWERTY/AZERTY/QWERTZ avec libellés complets). Clavier: 3 rangées décalées (Spacing/S puis L), 26 Keycap, touches allumées Tone Accent (M, G, I, S en exemple).
- Composé: Keycap, Tag (librairie Action).
- Écarts: touches allumées et choix du layout se règlent sur l'instance (pas de propriété). Côté gauche fixé à 360 px (code: plafond en sizing-3xl x 9, absent de Figma). Libellés des tags: texte surchargé sur le Tag, à contrôler après mise à jour du Tag.

## Flag (atome)
- Propriété: Code `fr|de|kr|gb|us|no|pt` (7 variantes), 16 x 12, rayon Radius/XS, bordure intérieure `Static/Border/Subtle/Tertiary` Border/Size/S.
- Écarts: couleurs des drapeaux en dur (art national, comme en code); bordure 1 px (token) au lieu de 0,5 px noir à 10 %. Le fichier librairie "Assets" contient un maître "Flags" (feuille 3x2/1x1) non adapté, non réutilisé. Le drapeau gb est simplifié (sans clip-path, comme rendu pratique).

## Focus Trap
Directive `dsFocusTrap` sans rendu: pas de composant Figma. Documenter côté ZeroHeight (comportement: focus dans la boîte, Tab bouclé, focus rendu au déclencheur).

## Brouillons de pages ZeroHeight (15 lignes)

### Keycap et Shortcut Keys
Usage: représenter une touche (Keycap) ou un combo (Shortcut Keys) dans l'aide aux raccourcis.
Une Keycap par touche, libellé déjà résolu pour l'OS (Alt sous Windows, glyphe sous macOS).
Shortcut Keys juxtapose les touches sans signe plus; le mot then sépare une séquence (G then I).
Variantes: Tone Default (touche jamais essayée) ou Accent (raccourci déjà utilisé).
Wide pour les touches nommées; les lettres restent carrées, la hauteur ne change jamais.
Do: libellés courts, 3 touches maximum par combo.
Don't: mettre un combo entier dans une Keycap, ajouter un plus.
A11y: rendu en `kbd`, le lecteur d'écran annonce une touche.
Contraste texte/fond conforme WCAG AA pour les deux tons.
Code: `ds-keycap`, `ds-shortcut-keys`.

### Shortcut Row
Usage: une ligne du panneau de raccourcis: libellé, pointillé, combo.
La ligne entière est cliquable et lance l'action (palette autant qu'aide-mémoire).
Variantes: Used (libellé et touches en bleu), contexte optionnel ("in a table").
États: Default, Hover, Active, Focus (contour visible).
Do: ne l'utiliser que dans un panneau de raccourcis.
Don't: y imbriquer un bouton.
A11y: rôle button, focusable, Entrée et Espace déclenchent l'action.
Info-bulle native "Run this shortcut".
Code: `ds-shortcut-row`.

### Keyboard Map
Usage: montrer quelles lettres portent un raccourci selon la disposition (QWERTY, AZERTY, QWERTZ).
Les raccourcis suivent la lettre gravée, le dessin change, pas la logique.
Trois rangées de lettres seulement, touches bleues = raccourci existant.
Une ligne d'aide dit d'où vient la disposition (navigateur, choix manuel, supposition).
A11y: le dessin est masqué aux lecteurs d'écran, les lignes de raccourcis portent l'information.
Code: `ds-keyboard-map`.

### Flag
Usage: drapeau décoratif 16 x 12 à côté d'un nom de pays ou d'une langue.
Codes: fr, de, kr, gb, us, no, pt. Toujours accompagné d'un texte.
A11y: décoratif, ne porte aucune information seul.
Code: `ds-flag`.

### Focus Trap (comportement)
Directive posée sur toute boîte modale (`ds-modal`, `ds-confirm-dialog`): focus dans la boîte à l'ouverture, Tab bouclé, focus rendu au déclencheur à la fermeture. Aucun visuel Figma.
