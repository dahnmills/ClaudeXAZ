# Illustrations ZeroHeight dans Figma

Fichier Tokens (`4TxqgJPVFZc4ZKw4JZ6OAn`), page `ZeroHeight illustrations` (id `293:2`).
14 frames, largeur 1280 (sauf 8 px rhythm en 760), fond `Color/Static/Background/Main/Secondary`,
560 px d'espace vertical entre frames. Tout est lie aux variables Semantic (couleur, espacement,
rayon, bordure, styles de texte). Aucun token, collection ou mode cree. Composants reels
importes des librairies `[Components] Action` (Button, Button Icon) et `[Components] Data Entry`
(Input Text).

| Frame | nodeId | Page ZeroHeight cible |
|-------|--------|-----------------------|
| ill · spacing scale | 294:3 | Spacing & layout |
| ill · 8 px rhythm | 294:42 | Spacing & layout |
| ill · page grid 1280 | 294:62 | Spacing & layout |
| ill · density | 294:86 | Spacing & layout, Principles |
| ill · radius scale | 295:3 | Spacing & layout |
| ill · typography ladder | 295:43 | Typography |
| ill · color roles | 295:86 | Welcome, What's inside |
| ill · contrast pairs AA | 295:665 | Accessibility |
| ill · focus ring and keyboard order | 297:21 | Accessibility |
| ill · touch and click target size | 297:184 | Accessibility |
| ill · two-level token flow | 297:961 | What's inside, Principles |
| ill · strict composition cascade | 298:338 | Why Qirin, Principles |
| ill · Figma code doc loop | 298:423 | Why Qirin, Welcome |
| ill · atoms molecules organisms templates | 298:450 | What's inside, Welcome |

## Ecarts et notes

- Page grid : 12 colonnes, marge `Spacing/XL` (32 px), gouttiere `Spacing/L` (24 px). Aucun token de
  grille n'existe, ces valeurs sont les plus proches et restent a confirmer avec le layout cible.
- Contrast pairs : les ratios sont calcules depuis les valeurs reelles des tokens. Resultat a
  connaitre : `Text/Main/Tertiary` sur `Background/Main/Tertiary` = 3.8:1 et sur `Main/Secondary`
  = 4.2:1, donc sous AA pour du texte courant.
- Touch target : minimum 24 px (WCAG 2.2 AA) en `Sizing` equivalent, icon button S 32 et M 40.
- Focus ring : `Color/Interactive/Border/Focus` avec `Border/Size/M`.
- Foundation n'est jamais lie directement : la carte Foundation du token flow n'affiche que le texte
  (valeur brute `#008ED6` et nom CSS), son echantillon est lie au Semantic.
- Badge (librairie Feedback) n'est pas utilise : c'est une pastille de 12 px, sans valeur ici.
- Rien n'a ete publie, aucun node existant n'a ete modifie.
