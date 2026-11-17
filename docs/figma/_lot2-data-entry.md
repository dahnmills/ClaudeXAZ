# Lot 2 (et partie sûre du lot 3) : Data Entry (2026-11-17)

Fichier `1wVY9FfjONIX6us9JmIm7U`, tokens `4TxqgJPVFZc4ZKw4JZ6OAn`. Brief : `docs/figma/_lot2-brief.md`. Rien n'a été publié, rien n'a été commité.

Contrôle après chaque page, par script : dimensions de toutes les variantes avant / après (aucun écart sur aucune page), aucune instance sans maître, aucun chevauchement entre nœuds de premier niveau.

## Fait

### Suppressions (nodeId + nom)
- Variante Dropdown `2288:1056` « State=Read Only, Filtering=False, Property 3=True » (clé `d98df6d2…`, 0 instance d'après le lot 1, 0 sur la page). La propriété parasite `Property 3` a disparu avec elle (Dropdown : `Helper Text`, `Label`, `State`, `Filtering`).
- Sections « To review » (17 trouvées dans le fichier, pas 19) :
  - `3158:10035` Checkbox - To review : `2043:2490` _Design system header
  - `3161:5153` Checkbox Card - To review : `2193:2591` _Design system header
  - `3161:3663` Date Range - To review : `2634:1427` _Design system header, `2844:468` / `2844:585` / `2844:703` instances Date Range, `2844:583` Vector 1, `2844:584` Vector 2, `2844:700` Frame 32, `2844:701` Frame 33, `2844:702` Frame 34
  - `3165:2233` Dropdown - To review : `2046:1204` _Design system header, `3008:817` instance Dropdown
  - `3165:4208` Dropdown Flyout Menu - To review : `2049:969` _Design system header, `2862:1431` Icon Functional (copie détachée), `2862:1444` Vector 1, `2862:1487` Frame 38
  - `3161:5799` Input Date - To review : `2222:1691`
  - `3158:6722` Input Text - To review : `2045:997`
  - `3165:4053` Input Search - To review : `2695:3419`
  - `3160:3782` Input Email - To review : `2222:1391`
  - `3160:3597` Inline Edit - To review : `2317:441`
  - `3160:912` Radio - To review : `2044:2764`
  - `3162:4418` Radio Card - To review : `2193:2801`, `2915:103` instance Radio Card, `2915:387` instance Modal, `2915:1243` Frame 32
  - `3158:3830` Select Button - To review : `2221:1295`
  - `3172:642` Text Area - To review : `2330:649`, `2573:244` Frame 32
  - `3160:4697` Toggle - To review : `2044:3025`
  - `3160:1352` Standalone Dropdown - To review : `3022:1101`
  - `3181:231` Cover - To review : `2694:3174` Frame 5
  (les cadres sans id listé sont des `_Design system header`). Aucune ne contenait de maître.
- Collections locales : `VariableCollectionId:2164:662` « Data Entry Variables » (variable STRING `Value` `2164:663`) et `VariableCollectionId:2190:89` « Collection » (COLOR `2190:90`). Supprimées après contrôle : aucun nœud lié sur les 36 pages (pages séparatrices vides comprises), aucun mode explicite, aucun style local, aucun alias.
- Lignes redessinées des cartes (remplacées, voir Composition) : Checkbox Card `2093:334/347/360/373/386/399/412/425`, Radio Card `2093:229/242/255/268/281/294/307/320`. Glyphes `Close` nus remplacés : `2045:757` (Input Text), `2222:1658` (Input Date), `2695:3388` (Input Search).

### Dépublication (préfixe `.`)
- `1:92` Task > `.Task` ; `2340:2236` User card > `.User card` ; `2340:2447` ☠️ Users Card List > `.☠️ Users Card List` (descriptions « Deprecated, private » ajoutées). Tenant non touché.

### Renommages
- Set `2695:3344` « Input Date » > **Input Search**.
- Tous les `_Design system header` > `Component` (23 pages).
- Calques `Frame n` hors instances (environ 230) : cadres de maîtres > `Components` / `Atoms`, en-têtes > `Status`, `Design`, `Tech`, `Design + Tech`, `Text`, `Content`, Versionning > `Title`, `Meta`, `Status`, `Date`. Explicites : `2049:5072` > `List`, `2046:799` (`.Tags`) > `List`, `2583:1927` > `Atoms`, `3099:257` « Case Component (Recent searches = false) » > `Components`, Input Text `.Append` texte `Text` > `Unit`, 16 calques `🧬 Switch` > `Switch`.

### Versionning (aligné sur `components.json`)
- Remplis (gabarit vide) : Checkbox (Ready v1.0.0, September 10, 2026), Checkbox Card (Ready v1.0.0, September 8), Radio (September 8), Radio Card (September 10), Toggle (September 8).
- Datés : Date Range (September 8, 2026), Inline Edit (June 2, 2026), restes « Update / Text » remplacés.
- Créés (clone du bloc d'Input Text, section élargie à 6594, 160 px partout) : Search Bar Home `3229:857`, Search Bar Multi `3230:1579`, Tag Filter Chip `3231:975`, Grid Selection `3232:425` (In review v1.0.0), File Upload `3233:599` (Draft v0.1.0).
- **Écarts Figma / JSON corrigés, à signaler** : Standalone Dropdown et More Criteria « New » > Ready ; Search Bar « New v1.0.0 » > Ready **v0.9.0** (le JSON dit 0.9.0).

### Liens de documentation (`documentationLinks`)
- Storybook (aucune page ZeroHeight pour ces composants) : Checkbox, Checkbox Card, Date Range (+ `Header` publié), Dropdown (story Select), Dropdown Flyout Menu, Input Text, Input Email, Input Date, Input Search, Inline Edit, Radio, Radio Card, Select Button, Text Area, Toggle, Standalone Dropdown, More Criteria, Search Bar (story search-bar-scoped).
- ZeroHeight : Search Bar Home `3449f9`, Search Bar Multi `15d363`, Tag Filter Chip `99e410`, Grid Selection `56f3ef`, File Upload `879591`.

### Descriptions des atomes privés
- 12 atomes du Dropdown, `.Item`, `.Item Properties`, les deux `.Label` (`2045:742`, `2583:3766`), `.Helper Text` (`2568:2019`).

### Propriétés ajoutées (défaut = comportement actuel)
- Booléen `Helper Text` (défaut faux) + instance exposée `.Helper Text` masquée dans chaque variante : Input Text, Input Email, Input Date, Input Search (Status Informative, Negative sur `State=Error`).
- Booléen `Label` (défaut vrai) sur Text Area, relié à `.Label` des 6 variantes.

### Liaisons de tokens (valeur identique)
- Traits 1 / 2 > `Border/Size/S` / `M` : Checkbox, Checkbox Card, Radio Card, Radio, Toggle, Input Text, Email, Date, Search, Text Area.
- Rayons 1000 et 14 (Switch 40 x 20, pilule) > `Border/Radius/Round` : Checkbox (`Frame 14` masqué), Radio, Toggle.
- Gaps 2 / 4 > `Spacing/XXS` / `XS` : `.Label` (x2), `.Helper Text` (4 variantes).
- Non liés comme demandé : paddings racine de Checkbox et d'Input Text, padding de `.Item` Type=Title.

### Composition
- Séparateur de Checkbox Card et Radio Card : instance `Divider` (Data Display, `Divider 0px padding`), 372 x 0, FILL.
- Effacement d'Input Text, Input Date, Input Search : `Button Icon` (Plain, S, Accent, glyphe Close), 16 x 16 comme le glyphe, même réglage que celui d'Input Email.
- `.Label` d'Input Text et d'Input Email en FILL (111 et 40 > 261, hauteur inchangée).

### Liaison héritée
- Input Email Active `2222:1321` : trait `qrn / foundation/color/action/blue/600` > `Color/Interactive/Border/Strong/Active` (le Semantic d'Input Text Active). Plus aucune liaison hors Semantic dans les maîtres audités.

## Laissé (raison)
- **Couleur d'Input Email Active** : la valeur change un peu (#006192 > #075994, celle d'Input Text). Liaison faite parce que le brief la demandait nommément ; à valider.
- **Couleur des séparateurs et de l'effacement** : la ligne de `Divider` et le Button Icon Accent remplacent un trait `#E6E6E6` et un glyphe nu ; teinte à vérifier sur capture avant publication.
- Valeurs hors grille, décision en attente : paddings 6 (champs, Dropdown, `.Item`), gaps 10 (Active) et 12 (cartes), rayon 6 de l'anneau de focus (Checkbox 18, Radio 12, Toggle 12, champs, Text Area, Inline Edit, Dropdown), padding 26 du Toggle.
- `.Helper Text` Status=Positive `2568:2018` : gap 3 (pas de token, passer à 4 changerait la valeur).
- Styles de texte : non liés (les styles de la librairie Tokens ne s'importent pas par clé, voir doc-kit README).
- `Header` de Date Range `2002:811` : reste publié sous un nom générique (privatiser n'est pas classé « sûr »).
- 🆕 Tenant `3028:361` : migration, non touché.
- Select Card : pas de Versionning créé (page condamnée, composants rendus privés) ; ses liaisons `qrn` restent.
- Hors périmètre de ce lot (non demandés) : `Deletable` et `Focus` d'Inline Edit, `Focus` de `.Item`, `Tone` de Radio Card, `Shortcuts` de Date Range, icône de Select Button, `.Append` propre à Input Search, maître `.Label` unique, faute `Aditionnal Content`, `.Chevron` posé hors de sa section.
- Swap de l'ancien Link : aucun ancien Link dans les maîtres Data Entry (lot 1).

## À publier (par l'utilisateur)
Toute la librairie Data Entry : Dropdown (variante supprimée), Input Search (renommé), Input Text / Email / Date / Search (Helper Text, Button Icon, Label FILL, traits), Text Area (Label, traits), Checkbox, Checkbox Card, Radio, Radio Card, Toggle (traits, rayons, Divider), Dropdown Flyout Menu (descriptions), `.Label`, `.Helper Text`, les liens de documentation de tous les maîtres, la dépublication de Task / User card / Users Card List et la suppression des deux collections locales. Faire un contrôle sur capture des cartes et des champs avant publication.
