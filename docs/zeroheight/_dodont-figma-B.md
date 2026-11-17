# Do / Don't Figma illustrations, lot B (Link, Crumb, Breadcrumb, Chip, Tag)

Fichier Figma `[Components] Action` (xCeEJPn6fliEshuE9fnrqs). Modele: section `ZeroHeight · Button illustrations` (930:1069). Meme gabarit: section 1500 px de large, fond Static/Background/Main/Primary, frames 360 x 140 (fond Main/Secondary, auto-layout vertical centre, gap Spacing/L), grille 80 / 520 / 960 en x, 80 / 300 en y. Tout est lie aux variables Semantic existantes, aucun token cree, rien de modifie dans l'existant. Les regles viennent de `docs/zeroheight/action/<slug>.md` (section Do / Don't, identique aux blocs Best practices de la page Link lue via MCP).

Ecart de bordure: le trait de section est lie a `Color/Static/Border/Subtle/Primary` (le trait de la section Button n'est pas lie a une variable).

## Link (page Link, section 944:4682, x 317 y 102)
| Regle ZH | Frame | nodeId |
|---|---|---|
| Navigate, do not act: Do | do · link · navigate | 944:4689 |
| Navigate, do not act: Don't | dont · link · action | 944:4701 |
| Links in paragraphs: Do | do · link · underline in text | 944:4710 |
| Links in paragraphs: Don't | dont · link · color only in text | 944:4725 |
| External links: Do | do · link · external marked | 944:4740 |
| External links: Don't | dont · link · external unmarked | 944:4752 |

Note: le glyphe de l'icone droite est celui par defaut du composant (Edit Pen), pas une icone de lien externe (aucune dans la librairie).

## Crumb (page Breadcrumb, section 944:6266, x 471 y 1792)
| Regle | Frame | nodeId |
|---|---|---|
| Mark only the last crumb as current: Do | do · crumb · one current | 944:6267 |
| Mark only the last crumb as current: Don't | dont · crumb · several current | 944:6293 |

Sautee: "Route on clicked, not on href" (comportement code, rien a dessiner).

## Breadcrumb (page Breadcrumb, section 944:7086, x 471 y 2652)
Les trails sont composes avec des instances du vrai composant Crumb (le composant Breadcrumb Figma a 7 Link fixes, dont les calques ne peuvent pas etre masques proprement dans une instance).
| Regle | Frame | nodeId |
|---|---|---|
| End with the current page: Do | do · breadcrumb · current page last | 944:7093 |
| End with the current page: Don't | dont · breadcrumb · current page as link | 944:7119 |
| Labels identical to page titles: Do | do · breadcrumb · labels match titles | 944:7142 |
| Labels identical to page titles: Don't | dont · breadcrumb · labels renamed | 944:7162 |
| Page actions in the actions area: Do | do · breadcrumb · actions apart | 944:7182 |
| Page actions in the actions area: Don't | dont · breadcrumb · action in trail | 944:7210 |

Le titre de page des frames "labels" est un simple texte (style du Link), pas un composant Page Title.

## Chip (page Chip, section 946:594, x 453 y 1604)
| Regle | Frame | nodeId |
|---|---|---|
| Keep the set short: Do | do · chip · short set | 946:595 |
| Keep the set short: Don't (14 chips) | dont · chip · long list | 946:604 |
| Badge for statuses: Do | do · chip · status as badge | 946:648 |
| Badge for statuses: Don't | dont · chip · status as chip | 946:676 |

Sautee: "Use the filter type for a removable applied filter" (Do et Don't): le composant Figma ne modelise que le chip selectionnable, pas le type filter ni la croix de suppression.
Le Badge vient de la librairie [Components] Feedback (importe, instance).

## Tag (page Tag, section 946:1107, x 1580 y 2615)
| Regle | Frame | nodeId |
|---|---|---|
| Select tags for multi-choice: Do | do · tag · multi choice | 946:1108 |
| Select tags for multi-choice: Don't (choix unique) | dont · tag · single choice | 946:1166 |
| Filter tags show what is applied: Do | do · tag · applied filters visible | 946:1214 |
| Filter tags show what is applied: Don't (cache derriere un bouton) | dont · tag · filters hidden in menu | 946:1234 |
| Badge for statuses: Do | do · tag · status as badge | 946:1252 |
| Badge for statuses: Don't | dont · tag · status as tag | 946:1280 |

## Verification
Capture de chaque section: pas de debordement ni de chevauchement. Sections placees a 560 px ou plus du contenu existant de chaque page. Bibliotheque non publiee.
