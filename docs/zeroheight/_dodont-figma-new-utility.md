# Do / Don't Figma : composants Utility (librairie [Components] Action, fileKey xCeEJPn6fliEshuE9fnrqs)

Page Figma `Utility` (950:2). Cinq sections `ZeroHeight · <Composant> illustrations` posées à x = 1720 (560 px à droite du contenu existant, qui s'arrête à x = 1160), empilées avec 560 px d'écart. Frames 360 x 140 (Shortcut Row 600 x 220, Keyboard Map 1020 x 240), fond Secondary, instances des vrais composants, couleurs, interlignes et texte liés aux variables Semantic existantes. Rien modifié, rien publié, aucun token créé.

Note technique : la variante Keycap Wide est en largeur FIXED (24) dans le maître, donc chaque instance à libellé long est passée en HUG (override d'instance).

## Keycap (page ZH 9186058) : section 963:145
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Give the label already resolved for the operating system: Alt on Windows, the glyph on macOS. | do · keycap · label resolved for os | 963:114 |
| Don't : Put a whole combo such as Alt+M in one keycap. | dont · keycap · whole combo in one keycap | 963:124 |
| Do : Keep labels short: one letter or one key name. | do · keycap · short labels | 963:129 |
| Don't : Change the height of a named key: only the width grows. | dont · keycap · taller named key | 963:139 |

## Shortcut Keys (page ZH 9186065) : section 964:144
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Keep a combo to three keys at most. | do · shortcut-keys · three keys at most | 964:111 |
| Don't : Add a plus sign between keys. | dont · shortcut-keys · plus sign between keys | 964:123 |
| Do : Use "then" for keys pressed one after the other. | do · shortcut-keys · then for a sequence | 964:130 |
| Don't : Put a whole combo in a single Keycap. | dont · shortcut-keys · combo in one keycap | 964:140 |

## Shortcut Row (page ZH 9186067) : section 966:634
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Use it only inside a shortcuts panel. | do · shortcut-row · inside a shortcuts panel | 966:499 |
| Don't : Nest a button in the row: the whole line is already the button. | dont · shortcut-row · button inside the row | 966:542 |
| Do : Keep the label short enough for one line. | do · shortcut-row · short label on one line | 966:576 |
| Don't : Remove the dotted leader: the eye loses the link between label and keys. | dont · shortcut-row · no dotted leader | 966:605 |

Note : le bouton du "dont" est posé dans le même conteneur que la ligne (on ne peut pas ajouter d'enfant dans une instance). Le trait pointillé est masqué par override d'instance (calque Leader).

## Keyboard Map (page ZH 9186068) : section 967:1560
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Draw only the three letter rows: the digit row is the same on every Latin layout. | do · keyboard-map · three letter rows | 967:1176 |
| Don't : Promise that shortcuts move with the layout: they follow the printed letter. | dont · keyboard-map · promise that shortcuts move | 967:1477 |
| Do : Say where the layout comes from: browser, manual choice or guess. | do · keyboard-map · say where the layout comes from | 967:1361 |
| (ajoutée) rangée de chiffres : anti-pattern de la 1re règle Do | dont · keyboard-map · digit row added | 967:1258 |

Sautée : "Don't : Replace the Tags with a dropdown: three choices do not need a menu." (le Dropdown vit dans la librairie Data Entry, absente du fichier Action; à faire avec cette librairie).
Remarque : le sélecteur de layout du composant Keyboard Map est coupé à droite dans le maître (pas dans mes frames), "QWERTZ (" visible tronqué.

## Flag (page ZH 9186070) : section 965:198
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Always put the country or language name next to the flag. | do · flag · name next to the flag | 965:128 |
| Don't : Use the flag alone to carry the meaning. | dont · flag · flag alone | 965:148 |
| Do : Keep the 16 by 12 size. | do · flag · keep 16 by 12 | 965:170 |
| Don't (contre-exemple de taille, lié à "Keep the 16 by 12 size") | dont · flag · enlarged flag | 965:189 |

Sautée : "Don't : Use a code that is not in the list: only fr, de, kr, gb, us, no and pt exist." (aucune variante hors liste, impossible sans dessin à la main).

## Résumé
20 frames créées, 18 des 20 règles ZH couvertes, 2 sautées (Keyboard Map dropdown, Flag code inconnu). Les frames "dont · keyboard-map · digit row added" et "dont · flag · enlarged flag" sont des contre-exemples ajoutés à la place des règles sautées.
Focus Trap : aucun visuel, pas de page.
