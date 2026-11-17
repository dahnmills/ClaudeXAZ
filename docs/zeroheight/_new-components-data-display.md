# Nouveaux composants Data Display (fichier Figma VpConH5AUGyCqtp8PMqj1i)

Créés le 2026-11-06, additif (aucun nœud existant modifié, librairie non publiée, aucun token créé).
Chaque composant a sa page "🆕 ..." avec l'en-tête de documentation (clone du gabarit Progress Bar) et le cadre Versionning.
Les annotations Dev Mode n'ont pas été ajoutées (le gabarit des pages 🆕 n'en porte pas).

## Action Card

- Page `2117:2`, set `2117:1081`, componentKey `add3adf66241d989332419d6a9af2599c9842f12`
- Variantes (3) : `Variant=Standard, Selected=False` ; `Variant=Selectable, Selected=False` ; `Variant=Selectable, Selected=True`
- Propriétés : `Title` (texte, "Find a buyer"), `Description` (texte, "Search and identify a buyer from your porfolio or a new one"), `Show description` (booléen, true), `Badge` (booléen, false). Instances exposées : Icon Tile (glyphe), Link (libellé "Get started"), Badge (Tag Static, libellé "New").
- Atomes composés : Icon Tile local (Size L, Brand), Link `77367a8f...` (Icon Right, M, Regular, flèche Arrow Right), Radio `905cba18...` (Label masqué), Tag `0543a49f...` (Static). Tokens Semantic : fond Main/Primary, bordure Subtle/Tertiary ou Interactive Border Strong, fond Functional/Subtle/Informative, espacements M/S/XXS, rayon S, styles Body L Semi Bold et Body M Regular.
- Écarts avec le code : survol (ombre `--semantic-shadow-card` du standard, fond muted-hover du selectable) et focus non dessinés (aucun style d'ombre trouvé dans Tokens) ; largeur fixée à 320 (le code laisse le conteneur décider) ; le code utilise `--foundation-spacing-16/8` en direct, Figma utilise les Semantic M et S ; Figma n'a pas la combinaison Standard + Selected (inexistante dans le code).

### Brouillon de page ZeroHeight

1. Action Card : carte qui mène vers une action ou une zone.
2. Usage : Standard pour les actions rapides d'une page d'accueil (icône, titre, description, lien).
3. Usage : Selectable pour choisir une option parmi plusieurs (radio, badge facultatif).
4. À éviter : données en lecture seule (utiliser Card), plus d'une action par carte.
5. Variantes : Standard, Selectable ; Selectable a l'état Selected (bordure forte, fond informatif).
6. Propriétés : Title, Description, Show description, Badge ; glyphe, lien et badge via les instances exposées.
7. Largeur : donnée par le conteneur (320 dans Figma), hauteur selon le contenu.
8. Grille conseillée : 4 cartes Standard par ligne sur 1280 px.
9. Composition : Icon Tile, Link, Radio, Tag ; ne pas redessiner ces atomes.
10. Code : `ds-action-card`, inputs `variant`, `title`, `description`, `linkLabel`, `linkHref`, `selected`, `badgeLabel`, output `selectedChange`.
11. A11y : le Selectable porte `role="radio"`, `aria-checked`, `tabindex=0`, Entrée et Espace sélectionnent.
12. A11y : le focus visible est un contour 2 px (non dessiné dans Figma).
13. A11y : un groupe de cartes Selectable doit être entouré d'un `radiogroup` avec un nom.
14. Contraste : titre Main/Primary, description Main/Secondary, conformes AA.
15. Le lien du Standard est un vrai lien : libellé explicite, pas de "Click here".

## Pie Chart

- Page `2118:95`, composant (sans variantes) `2118:177`, componentKey `e63344ce3c1afe9f529d32673e5bcb7dec8e83e6`
- Propriétés : slot `Segments` (contient le cadre `Donut` : 3 arcs par défaut Low risk 62 positive, Medium risk 24 warning, High risk 14 negative, 120 x 120, épaisseur 16, bouts ronds, écart 3 degrés) ; `Tooltip` (booléen, false) avec instance Tooltip exposée (texte "Low risk: 62%").
- Atomes composés : Tooltip `056bed62...` (Position Top Center, Reversed False). Tokens Semantic : traits liés à Background/Functional/Positive, Warning, Negative ; épaisseur liée à Spacing M.
- Écarts avec le code : le Tooltip de Figma est l'atome du design system (avec flèche) au lieu du bloc sans flèche du code ; opacité 0,7 au survol d'un segment non dessinée ; ton `brand` du code non dessiné (aucun segment par défaut ne l'utilise) ; `size` et `thickness` se règlent en redessinant le Donut dans le slot (pas de propriété) ; position du Tooltip (4 px sous le graphique) posée en absolu, non liée à un token.

### Brouillon de page ZeroHeight

1. Pie Chart : anneau qui montre la répartition d'un total en quelques parts.
2. Usage : répartition de risque, de statuts, jusqu'à 5 parts.
3. À éviter : comparaison précise de valeurs (tableau ou barres), plus de 5 parts, une seule valeur (Progress Bar).
4. Taille par défaut 120 x 120, anneau de 16, bouts arrondis, écart de 3 degrés entre parts.
5. Tons : Positive, Warning, Negative (Brand dans le code).
6. Les données sont locales : on remplace le Donut dans le slot Segments.
7. Tooltip : booléen, affiche le texte de la part sous le graphique (survol dans le code).
8. Ordre conseillé des parts : du plus faible risque au plus fort, dans le sens horaire depuis midi.
9. Toujours accompagner le graphique d'une légende ou d'un texte : la couleur seule ne suffit pas.
10. Code : `ds-pie-chart`, inputs `segments` (label, value, tone, tooltip), `size`, `thickness`.
11. A11y : le SVG a `role="img"` ; fournir un nom accessible et les valeurs en texte à côté.
12. A11y : l'infobulle n'est visible qu'au survol souris, donner la même information en texte.
13. Contraste : vert, orange, rouge des fonds Functional sur fond clair, au moins 3:1 pour un graphique.
14. Ne pas animer ni faire clignoter les parts.
15. Composition : Tooltip du design system ; ne pas redessiner d'infobulle.

## Properties Panel : non créé

Le composant existe déjà sous un autre nom : Card, atome interne `.Columns` (non publié), qui a remplacé Properties Panel retiré de la librairie le 2026-11-04 (décision : pas de composant spécifique, maîtres génériques à slots). `components.json` l'indique : "Retired from the Figma library (replaced by Card .Columns, which is private)". Le recréer irait à l'encontre de cette décision. Si l'on veut quand même un composant public, la voie est de publier `.Columns` ou d'ajouter une variante à Card, pas un nouveau composant.
