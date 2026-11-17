# Do / Don't Figma : nouveaux composants Data Entry (fileKey 1wVY9FfjONIX6us9JmIm7U)

Modèle : sections `ZeroHeight · <Composant> illustrations` de la librairie Action. Une frame par règle, fond Static/Background/Main/Secondary, padding Spacing/XL, gap Spacing/L, instances des vrais composants. Sections posées sur la page Figma du composant, 560 px sous le contenu existant (frame `_Design system header`), sur fond Static/Background/Main/Primary. Rien modifié, rien publié, aucun token créé. Les bars ont `Content` sans fond.

Libraries importées par clé (non modifiées) : Tooltip et Functional Notice de `[Components] Feedback`.

## Search Bar Home (page 3098:2, ZH 9186071) : section 3111:438 `ZeroHeight · Search Bar Home illustrations`
| Règle ZH (texte exact) | Frame | nodeId |
|---|---|---|
| Do : Keep one bar per page. | do · search-bar-home · one bar per page | 3111:139 |
| Do : Say what is searched in the placeholder, for example "Search for a buyer". | do · search-bar-home · placeholder says what is searched | 3111:157 |
| Do : Keep the button label short. | do · search-bar-home · short button label | 3111:264 |
| Don't : Add filters inside this bar: use the scoped Search Bar instead. | dont · search-bar-home · filters inside the bar | 3111:346 |

## Search Bar Multi (page 3102:2, ZH 9186072) : section 3113:877
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Keep the order Type, Country, ID Type, query, actions. | do · search-bar-multi · field order | 3113:613 |
| Do : Explain a disabled control with a tooltip, as the code does for ID Type and More criteria. | do · search-bar-multi · tooltip explains disabled control | 3113:694 |
| Do : Show the error as text and colour together. | do · search-bar-multi · error text and colour | 3113:746 |
| Don't : Use it for a scoped search: use the scoped Search Bar instead. | dont · search-bar-multi · scoped search | 3113:801 |

## Tag Filter Chip (page 3104:1002, ZH 9186073) : section 3115:562
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Use Chip in filter bars and Field in forms. | do · tag-filter-chip · chip in filter bars, field in forms | 3115:363 |
| Do : Turn on search field by field, for lists linked to a reference such as NACE sectors. | do · tag-filter-chip · search on a reference list | 3115:394 |
| Don't : Decide on search from the number of options: a closed list of 13 grades reads at a glance. | dont · tag-filter-chip · search chosen by option count | 3115:454 |
| Don't : Use it for a single choice. | dont · tag-filter-chip · single choice | 3115:515 |

## Grid Selection (page 3105:2, ZH 9186074) : section 3116:802
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : Keep the miniatures on the same grid so layouts compare at a glance. | do · grid-selection · same grid for every miniature | 3116:568 |
| Do : Keep the label visible under each miniature. | do · grid-selection · label stays visible | 3116:626 |
| Don't : Select several cards at once. | dont · grid-selection · several cards selected | 3116:675 |
| Don't : Use it for generic choices: use Radio Card instead. | dont · grid-selection · generic choices | 3116:753 |

## File Upload (page 3107:2, ZH 9186075) : section 3117:491
| Règle ZH | Frame | nodeId |
|---|---|---|
| Do : State the limits in the hint before the user drops a file. | do · file-upload · limits in the hint | 3117:354 |
| Do : Let the screen show errors, with a notice or helper text, from the rejection reason. | do · file-upload · errors shown by the screen | 3117:372 |
| Don't : Rely on drag and drop alone: browse must stay available. | dont · file-upload · drag and drop only | 3117:413 |
| Don't : Use it as a plain button. | dont · file-upload · used as a plain button | 3117:432 |

## Règles sautées
Aucune : les 20 règles sont dessinées.

## Notes
- Search Bar Home / Multi : le Don't "scoped" est montré par le contexte (bar dans un périmètre "Portfolio Alpha" avec chips de filtre dessous), pas par le composant scoped lui-même.
- Search Bar Multi tooltip : l'instance Tooltip (Top Right) est en positionnement absolu sous le bouton More criteria désactivé.
- Tag Filter Chip : labels, options et placeholder de recherche surchargés en texte local (NACE sector, Grade, Currency).
- Grid Selection : les cartes sont des clones des instances de la frame de doc `3106:266` (aperçus de layout déjà remplis dans le slot).
- File Upload : le bouton Browse est masqué (visible = false) dans les deux anti-patterns.
- Légendes Body S ajoutées uniquement quand le visuel seul ne suffit pas à lire la règle.
