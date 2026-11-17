# Visuels « Why Qirin » (V1 à V4), rapport (2026-11-17)

## Fichier

- Fichier Figma : **Qirin · ZeroHeight showcase**, clé `FS7qNdQx4Qyo9CkBgIWRMi` (projet MCP 683452905), https://www.figma.com/design/FS7qNdQx4Qyo9CkBgIWRMi
- Page unique **Why Qirin**. Aucun fichier de librairie modifié, rien de publié, rien de commité.

| Visuel | Cadre | nodeId | Position | Taille |
|--------|-------|--------|----------|--------|
| V1 | `V1 Hero` | `5:2100` | 0, 0 | 1280 × 560 |
| V2 | `V2 Inside` | `10:3649` | 0, 1120 | 1280 × 520 |
| V3 | `V3 Before After` | `12:1534` | 0, 2200 | 1280 × 480 |
| V4 | `V4 Closing` | `13:1800` | 0, 3240 | 1280 × 200 |

Cadres empilés verticalement, 560 px entre deux cadres, `clipsContent` actif, rien ne déborde.

Exports PNG x2 (2560 px de large) : `docs/zeroheight/marketing/visuals/V1-hero.png`, `V2-inside.png`,
`V3-before-after.png`, `V4-closing.png`.

## Composants utilisés (instances des librairies, aucun détaché)

- **Action** : Button (Primary, Secondary, Tertiary, Reversed ; icône retirée via `.Content` Icon=None), Button Icon (glyphes NDBX Search, Duplicate, Plus), Link, Tab, Chip.
- **Data Entry** : Input Text, Dropdown, Checkbox, Radio, Toggle.
- **Data Display** : Card (composant à slot `987bbbe7…`, Header on/off), Table Header Row, Table Header, Table Row (sélection Checkbox), Table Cell (Text et Slot), Grade, Identifier, Progress Bar, Pie Chart, Tag, Page Header (dans la miniature).
- **Feedback** : Badge (Light, sans icône), Spinner, Skeleton Item, Tooltip.
- **Layout** : Header, Side Navigation (fermée), Modal (Small), Drawer, en miniatures.
- Variables Semantic (import par clé) : `Color/Static/Background/Brand`, `Main/Primary`, `Main/Secondary`, `Color/Static/Text/Main/Primary|Secondary`, `Color/Interactive/Text/Neutral/Default` (texte sur fond Brand, comme la cover Action), `Measurement/Spacing/XS…3XL`.
- Styles de texte : `Display/S/Bold` (titres V1, V4), `Title/H3`, `Title/H4`, `Body/L/Regular`, `Body/M/Regular`, `Body/S/Regular`. Police Allianz Neo partout.
- Audit par script : aucun fill, gap, padding ou texte non lié hors instances, en dehors de la zone Hand-made de V3.

## Choix

- **V1** : modèle des covers (fond Brand, message à gauche, visuel à droite). Titre Display S (32/40) et non Display L : pas de titre géant. Trois boutons pour les trois liens, un seul Primary (Open the Figma libraries), Secondary (Browse Storybook), Tertiary (Get started). Visuel : une Card « Credit requests » avec filtres Chip, Export + New request, tableau dense de 4 lignes (entreprises fictives, montants en EUR, statuts Approved / Pending / In review / Declined, toujours avec libellé).
- **V2** : cinq tuiles égales (Card à slot, titre = famille, sous-titre court), 3 à 5 vrais composants par tuile, lien « Browse <famille> » en pied de tuile pour le renvoi vers la page ZH. Layout montré en miniatures (Header + Side Navigation + Page Header + cartes vides, puis Modal et Drawer) réduites par `rescale` : illustration de structure, textes illisibles à cette échelle.
- **V3** : même bloc des deux côtés (titre, deux actions, tableau de 3 lignes). Légendes « Hand-made » et « With Qirin » avec une ligne d'explication chacune.
  - Zone non liée : uniquement le cadre `Hand-made panel (raw values, not linked)` (`12:1539`) dans la colonne `Hand-made (intentionally unlinked values)` (`12:1535`). Défauts visibles : deux bleus proches mais faux (#1A86C7, #0071A8) sur **deux boutons pleins**, gris approximatifs, rayon 6, tailles de texte hors échelle (13, 17), statut par **pastille de couleur seule** (calques `Status dot (color only)`).
  - Côté Qirin : Secondary + un seul Primary, Badges avec libellé, tout lié.
- **V4** : fond Brand pour fermer la page comme V1, phrase en Display S, sous-texte Body L, bouton Primary Reversed « Contact the design system team » (lien à fournir).
- Pas de surtitre en capitales, pas d'ombre, pas de dégradé, pas de tiret cadratin, pas de rose.

## Doutes et écarts

1. **Export x2** : `exportAsync` dépasse la limite de retour de `use_figma` et `get_screenshot` plafonne à la taille du nœud. Les PNG ont été rendus depuis des clones temporaires mis à l'échelle 2 (supprimés ensuite). Pour V2 le clone a demandé de remettre les tuiles en FILL après `rescale` ; le rendu final a été vérifié. Pour un ré-export simple : Figma > Export PNG 2x sur les quatre cadres.
2. **Logo Qirin** non importable (clé `d4206ee4…` introuvable), comme pour la cover Action. Il n'apparaît que dans la miniature du Header en V2. Aucun logo ajouté en V1/V4.
3. **Card à slot sans fond** : le maître a un fill masqué (carte de board). Fill surchargé sur l'instance, lié à `Background/Main/Primary`.
4. **Table Row** : colonne d'action (kebab) masquée pour laisser au badge de statut la largeur qu'il faut ; largeurs de colonnes fixées sur les cellules (Company 224/216, Amount 136).
5. **Montants en gras** : le premier texte de `.Table Cell Text` est en Bold dans la librairie ; laissé tel quel.
6. **Libellés produit dans les miniatures Layout** : la Side Navigation et le Drawer portent leurs libellés par défaut de librairie (ex. « Total receivable »), illisibles à l'échelle 0,14. À vérifier si la règle « aucun nom de fonctionnalité » doit s'appliquer aussi à ce niveau.
7. **Chiffres du brief** (106 composants, 380 tokens) : `components.json` donne 98 composants disponibles en design (25 Action, 24 Data Entry, 27 Data Display, 10 Feedback, 12 Layout) ; la collection Semantic compte 371 variables. Les visuels n'affichent aucun chiffre ; le texte ZH est à recaler.
8. **Couleur du texte sur Brand** : `Color/Interactive/Text/Neutral/Default` (blanc) faute de token « reversed » statique, comme la cover Action.
