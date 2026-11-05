# Synchro Figma Search : avancement

Plan : `docs/superpowers/plans/2026-11-03-figma-sync-search.md`

## Repères
- Fichier livrable `Qirin · Search` : `LBLqJmlPqXmx9qksCyYGPb` (pages Cover 0:1, Changelog 1:2, Overview 1:3, Screens 1:4, States & edge cases 1:5, Specs 1:6, Local components 1:7)
- Session MCP : `123b5bc3-c254-4615-b302-f69f592b7b2a`
- Captures de référence : `node .tmp-figma-ref.js <route> <selector> <out.png>` (Edge, playwright-core dans `%TEMP%/figma-ref`, serveur dédié `ng serve --port 4430`)
- Clés des tokens : `docs/figma/tokens-keys.md` ; composants : `docs/figma/qirin-figma-inventory.md`

## Tâches
- Task 1 : complete (inventaire écrit)
- Task 2 : complete. Cover 7:85, Changelog 8:88 (composant local `Changelog entry` 8:57), Overview 8:117. Audit vide.
- Task 3 : complete. Data Display, page `🆕 Identifier` 2007:47, set `Identifier` 2009:105 (Copyable × State, props Value, Icon), glyphe local `🆕 Hash` 2009:59. Audit vide, rendu = app (124×24).

## Décisions (rulings)
- Texte blanc : pas de `Text/Main/Reversed` dans Figma, on prend `Color/Interactive/Text/Neutral/Default` (celui du Button primaire). Coût si faux : rebinder 1 token.
- Vignette du fichier : l'API ne permet pas `setFileThumbnailNodeAsync`, à faire à la main (clic droit sur Cover → Set as thumbnail).
- Icônes : le code a son propre registre (pas NDBX). `copy` → NDBX `Duplicate` ; `hash` absent de NDBX → glyphe local `🆕 Hash` tiré du SVG du code.
- Identifier : pas d'INSTANCE_SWAP possible sur le glyphe imbriqué d'Icon Functional ; instance `Leading icon` exposée à la place.
- Focus : anneau 2 px extérieur `Border/Focus` ; le décalage de 2 px du code n'est pas reproductible.
- Typo Identifier : `Body/S/Regular` (12/16) ; le code a 12/24 (line-height L) dans une hauteur fixe de 24, rendu identique.
- Task 4 : sans objet. Data Entry › `Dropdown Flyout Menu` (Multi-Select=False) a déjà l'emplacement fixe de 20 px et `Selected` sur `.Item Properties`. Ruling : pas d'extension du Flyout Menu d'Action ; les listes à choix unique des écrans utilisent ce composant. Coût si faux : une variante à ajouter plus tard.
- Task 5 : complete. Data Entry, page `🆕 Standalone Dropdown` 3022:800, set 3023:214 (Tone Accent/Default × State Default/Hover/Active/Focus/Disabled + Open, props Label, Icon). Audit vide, rendu = app (32 px, gris #121212).
- Task 6 : complete. Briques ajoutées en chemin, toutes dans Data Display (une librairie ne peut pas instancier un composant non publié d'une autre) :
  - `🆕 Icon Tile` page 2020:47, set 2020:358 (Size S/M/L × Tone Brand/Neutral/Subtle), glyphe local `🆕 Grid` 2020:291
  - `🆕 Properties Panel` page 2022:47, set `Properties Panel` 2022:353 (Card/Flat, Title, Row 1..5) + `.Property Row` 2022:306 (Inline/Stacked × Muted)
  - `🆕 Progress Bar` page 2024:47, set 2024:313 (Size S/M × 4 tons) ; valeur = padding droit de l'instance
  - `🆕 Result Card` page 2025:47, set 2026:684 (7 variantes : M fermé/favori/ouvert, Exists=False fermé/ouvert, S fermé/favori ; props Name, City, Show city, Address, Score)
  Audit vide (sauf padding de valeur de la Progress Bar, voulu). Rendu = app (fermé, ouvert).
- Rulings Task 6 :
  - Progress Bar déplacée de Feedback (page supprimée) vers Data Display : dépendance de la Result Card sans attendre une publication. Coût si faux : déplacer un set.
  - Valeur de la Progress Bar = padding droit (le redimensionnement d'un calque d'instance n'est pas permis par l'API). Coût : une valeur numérique non liée à un token, par nature.
  - Divider de la librairie : cadre interne fixe à 320 ; dans la Result Card l'instance passe le cadre interne en FILL. Défaut à signaler à l'équipe DS.
  - Link : la propriété `Label` de `.Specs` n'est pas reliée au texte dans la librairie ; le libellé est posé directement sur le texte (override). Défaut à signaler.
  - Étoile favorite : pas de `Color/Static/Icon/Favorite` en Figma, on prend `Color/Static/Icon/Main/Functional/Warning` (orange 400 au lieu de 300).
  - Gap du nom 11 px en code → `Measurement/Spacing/S` (8 px), pas de token 11.
  - Icon Tile M : rayon 5 px en code → `Border/Radius/S` (4 px).
- Task 7 : complete. Data Display, page `🆕 Policy Result Card` 2030:47, set 2031:712 (8 variantes : Policy M fermé/alerte/ouvert/favori, Draft M fermé/ouvert, Policy S, Draft S ; prop Show date), glyphes locaux `🆕 Contract` 2030:341, `🆕 File Text` 2030:349, `🆕 File New` 2030:357. Audit vide, rendu = app.
  - Ruling : textes (2e ligne, date) laissés en surcharge directe, pas en propriété texte : une propriété impose la même valeur à toutes les variantes et rendait le draft faux.
  - Ruling : badges en Size S (comme l'app). Changer la taille d'un Badge existant par setProperties le passe en texte blanc : on recrée l'instance.
- Task 8 : complete (partie librairie). Data Entry, page `🆕 Search Bar Scoped` 3028:93, set 3030:992 (6 variantes : Buyers Company ID vide/rempli, Buyers ID vide/erreur, Policies défaut/erreur). Glyphes locaux Data Entry : `🆕 Hash` 3028:339, `🆕 Contract` 3028:345, `🆕 File Text` 3028:353, `🆕 Tenant` 3028:361. Audit vide, rendu = app.
  - Standalone Dropdown modifié : libellé en FILL (le chevron se cale à droite quand la case est plus large, comme le code).
  - Ruling : glyphes du code dupliqués dans Data Entry (Data Display pas encore publié). Coût : deux copies à remplacer quand NDBX les aura.
  - Ruling : diviseurs verticaux = instance Divider tournée de 90° (pas de variante verticale en librairie). Défaut à signaler.
  - Ruling : la largeur des cases suit le code (142, 167, 108, 144) mais grandit si le texte Figma est plus large (rendu de police un peu plus large que le navigateur).
  - Ruling : `Recent Search Card` (composant local du fichier Search) reporté au début de la tâche 9 : il instancie Icon Tile, non publié.
- ARRÊT publication : à publier Data Display (Identifier, Icon Tile, Properties Panel, Progress Bar, Result Card, Policy Result Card + glyphes) et Data Entry (Standalone Dropdown, Search Bar Scoped + glyphes).
- Publication 1 faite par l'utilisateur (2026-11-03). Clés publiées dans `qirin-figma-inventory.md`.
- Task 9-11 : écrans faits (page Screens 1:4), sections Buyers 22:1925 (Empty 22:680, Results 22:1155, Card open 22:1526), Policies 24:4920 (Results 24:1412, Card open 24:2363, Group by Status 24:3015, Drafts 24:3546, Drafts by Stage 24:4145, No result 24:4692), History 25:5742 (Recent search 25:4611, Recently viewed 25:4990, Favorites 25:5382). Composants locaux (page 1:7) : `Search shell` 18:5346 (Tab = onglet actif), `Recent Search Card` 20:766.
  - Ruling : shell = Header (Layout) + Page Header sans topbox ni titre ; espacements du Page Header de la librairie, pas ceux du code (Figma source de vérité).
  - Ruling : Tab de la librairie sans icône ; le code en a une par onglet. Défaut à signaler.
  - Correction après comparaison : More criteria désactivé pour Company ID (variante « Company ID, Filled » corrigée) ; propriété `Meta` + `Show meta` ajoutée à Result Card et Policy Result Card (date des historiques).
  - Nouveau composant : `🆕 More Criteria` (Data Entry, page 3041:93, composant 3041:304), `ds-more-criteria` étant dans shared/ui.
- Task 12 : complete. States 26:2514 (no company found, loading more, champs requis, statut requis, favoris vides, liste des manques), Specs 28:45 (8 règles) + annotations Dev Mode sur 9 nœuds des écrans. Audit vide sur toutes les pages.
- ARRÊT publication 2 : Data Display (Meta) et Data Entry (fix More criteria, More Criteria). Reste après : écran Buyers · More criteria, Show meta sur Recently viewed, tâche 13.
- Publication 2 faite (2026-11-03). Les instances du fichier Search ne se mettent pas à jour seules : échange programmatique vers la dernière version (49 sur Screens, 8 sur States), surcharges conservées.
- Écran `Buyers · More criteria` 32:5969 (type Manager, pays désactivé, panneau More Criteria). Show meta activé sur Recently viewed.
  - Piège : `figma.skipInvisibleInstanceChildren` est vrai par défaut ; un calque d'instance masqué disparaît des `children`. Le passer à false avant de masquer / démasquer.
  - Ruling : carte ouverte en alerte J-30 : pas de variante Open + Alert dans Policy Result Card ; date passée en couleur warning par surcharge, sans l'icône. Variante à ajouter en librairie.
- Task 13 : Overview avec vignettes (copies réduites des écrans) et liens vers les écrans ; couverture « Ready for dev » ; Changelog v1.0 mis à jour. Version nommée et vignette du fichier : à faire à la main (API non disponible).
- Retour utilisateur : les annotations débordaient sur l'écran suivant. Écart entre écrans passé de 120 à 560 px (sections Buyers, Policies, History), marge de fin de section 480 px. Contrôle par script : 584 px libres à droite de chaque nœud annoté, aucun nœud hors de son écran, aucun chevauchement.

## Refonte « maîtres + slots » (demande utilisateur, 2026-11-03)

Principe : les librairies gardent des maîtres génériques (structure, règles, états) avec des slots ; les contenus propres à une fonctionnalité sont des composants locaux du fichier, posés dans les slots. Vérifier l'existant avant de créer.

Relevé de l'existant (Data Display) :
- Card › `.Columns` (415:2129) : panneau label/valeur, `# Columns` 1-4, `Layout` Vertical / Horizontal / Mixed, `Loading` (skeleton). Fait ce que faisait 🆕 Properties Panel → Properties Panel et `.Property Row` retirés, remplacés par `.Columns`.
- Card (1325:10443) : composant avec `Slot` + `Button` ; Card set (354:4525) a une variante `Type=Slot`. Base du Widget Card de Buyer Summary.
- Horizontal Card (680:6820, `Type` Select | Collapsible) bâti sur Row (679:5381, colonne d'ordre, données en colonnes, actions séparées) : dessin différent du résultat de recherche → extension par une variante `Type=Slot` plutôt qu'un nouveau composant.

Cible :
1. Horizontal Card `Type=Slot` (+ `Open`, `Size`, `Favorited`) : slots Leading, Content, Trailing, Extra actions, Details ; actions communes Favorite + Toggle dans le maître.
2. Contenus locaux du fichier Search : Buyer content (Exists), Policy content (Kind), Buyer trailing (score), Policy trailing (badge, date, Alert), détails en `.Columns`.
3. Search Bar maître à slots (Data Entry) ; compositions Buyers / Policies locales. Search Bar Scoped retiré après migration.
4. Migration des 13 écrans + States, puis retrait de Result Card, Policy Result Card, Properties Panel, Property Row, Search Bar Scoped ; republication.
- Fait : Horizontal Card étendu (Data Display, set 680:6820) : nouvelles propriétés de variante Open / Size / Favorited (valeurs par défaut = rendu actuel des variantes Select et Collapsible) et 6 variantes `Type=Slot` ; slots Leading, Content, Trailing, Extra actions, Details, décrits ; note de doc 2046:1393. Slots en « hug » vertical (sinon le contenu est coupé). Test de remplissage OK (tuile, textes, `.Columns` # Columns=3 Horizontal en Details, en-tête de `.Columns` masqué).
- Fait : `🆕 Search Bar` (Data Entry, page 3047:93, set 3047:427) : Filled False/True, slots Filters et Options, champ et bouton Search dans le maître, prop Query.
- ARRÊT publication 3 : Data Display (Horizontal Card) et Data Entry (Search Bar), avant les contenus locaux et la migration du fichier Search.
- Publication 3 faite. Contenus locaux du fichier Search (page 1:7) : section « Result contents » (Result / Buyer content 49:2986, Policy content 49:3127, Score 49:3128, Date 49:3145, Meta 49:3146, Action spacer 49:3148, Create action 49:3149, Buyer details 49:3159, Policy details 49:4047) et section « Search Bar compositions » (Buyer filters 53:1174, Buyer options 53:1226, Policy filters 53:1227, Policy options 53:1373).
  - `.Columns` est privé (préfixe « . », non publié) : les détails passent par Card `Type=Default` (publié), dont on règle `# Columns` et `Layout` sur l'instance ; bordure et fond retirés, padding lié à Spacing/None. Pas de variante 4 colonnes Horizontal : 4 Cards d'une colonne.
  - Slot vide = 100 × 100 : booléen `Show extra actions` ajouté au maître (défaut off) ; slots vides masqués dans le fichier en attendant.
  - Spacer d'action = 24 px (largeur d'un Button Icon Size M), pas 32.
- Migration : 40 cartes et 10 barres sur Screens, 4 cartes et 4 barres sur States ; vignettes de l'Overview régénérées (copies réduites : leurs liaisons de tokens ne survivent pas à la réduction, exclues de l'audit). Contrôle : 0 instance des anciens composants, audit vide, aucun débordement visible.
- Retirés des librairies : pages 🆕 Result Card, 🆕 Policy Result Card, 🆕 Properties Panel (Data Display ; glyphes Contract / File Text / File New déplacés sur 🆕 Icon Tile), 🆕 Search Bar Scoped (Data Entry ; glyphe Tenant déplacé sur 🆕 Search Bar, copies Hash / Contract / File Text supprimées).
- Changelog du fichier Search : entrée v1.1 (63:77).
- ARRÊT publication 4 : Data Display (retraits, Show extra actions) et Data Entry (retrait). Après : passer `Show extra actions` à on sur les cartes buyer (spacer / + Create), sinon le slot disparaît.
- Publication 4 faite. Instances du fichier Search mises à la dernière version (39 Screens, 8 States, 14 Overview) ; Show extra actions activé sur les 10 cartes buyer qui ont un spacer ou + Create. Refonte Search terminée.

## Buyer Summary (fichier suivant)
- Relevé librairies pour Buyer Summary : Card set (Default = carte de chiffres avec `.Columns` et `.Action`, Empty State, Key Info, Company Profile), Card avec Slot (1325:10443), Side Navigation (Layout, Open=False = rail), Page Header (Topbox Data Type=Buyer + Breadcrumb), Drawer, Modal (slots), Dropdown, Tab, Input Search, Radio Card (déjà un Slot + Display Slot). Task (Layout) = case à cocher, inutilisable pour les listes.
- Fait (librairies) :
  - Card (slot) : booléen `Header` (défaut off) + en-tête `.Title` exposé et séparateur repris de Card Default ; kebab existant gardé.
  - `🆕 List Item` (Data Display, page 2059:47, composant 2059:394) : Tags (slot + Show tags), Title (Link neutre souligné, exposé), Date (+ Date icon), Badge (exposé), Excerpt.
  - `🆕 Chart` (Data Display, page 2060:47, set 2060:338) : Grid Vertical / Both, Y axis ; slots Y labels, Series, X labels ; lignes de grille dans le maître.
  - Radio Card (Data Entry 2093:217) : `Show selector`, `Show label` (défaut on ; le séparateur du slot suit Show label) pour le sélecteur de grille.
- Fichier `Qirin · Buyer Summary` : `0ZjZu0OjHdzGowm3hliM2M`, pages Cover 0:1 (cover 1:209), Changelog 1:2 (entrée 2:85, composant 2:49), Overview 1:3 (3:38), Screens 1:4, States 1:5, Specs 1:6, Local components 1:7.
- ARRÊT publication 5 : Data Display (Card header, List Item, Chart) et Data Entry (Radio Card).

## Buyer Summary (`0ZjZu0OjHdzGowm3hliM2M`), livré v1.0 le 2026-11-04

Cadres en **1280** (règle utilisateur : jamais 1440). Pages : Cover 1:209 (Ready for dev, main · 9f6736de), Changelog entrée 2:85, Overview 3:38 (vignettes par étape), Screens 1:4, States 1:5 (section 94:25), Specs 1:6 (section 95:25, 6 écrans annotés), Local components 1:7.

**Locaux** : shell `Buyer Summary shell` 15:5169 (Mode Default / Editing, slot Content, voile Background/Main/Primary × Opacity/Disabled), `Board actions` 19:1820, `Board slot` 34:1629 (Empty / Targeted), `Slot toolbar` 34:1630, `Board editor bar` 34:1645, `Card content / Loading` 27:1597, `Modal content / Full properties` 37:1641, `Drawer content / Cards` 43:2470, `Drawer tabs / Cards & layouts` 45:2764, `Layout preview` 62:2757 (6 grilles), `Drawer content / New board` 71:1886 (Radio Card), `Board row` 84:2062 (Horizontal Card + `Board row / Label` 84:1762 + `Board row / Actions` 84:1812), `Create board` 63:3269, `Drawer content / Boards` 85:2354 (List / Renaming / With custom board). Contenus de cards `Card content / *` dans la section 9:858.

**Sections Screens** : Default boards 21:25 (21:26, 21:3115, 21:4371), Board interactions 28:3080 (loading 28:3081, sélecteur 28:4111, menu 28:6265, Full properties 38:4753), New board 55:5596 (pick 73:5682, ciblé + drawer 74:6506, première card 55:5597, rempli 76:7498, placing 77:7944, enregistré 79:10875, abandon 90:10830), Manage boards 86:8741 (liste 86:8742, renommage 88:9478, board perso 88:11585).

Rulings :
- Sets Widget (12 Type) et Catalog card supprimés : variantes de contenu. Les écrans posent Card (slot) ou Card Default + contenu local. Coût si faux : un set à recréer.
- Identifiant de la topbox en JetBrains Mono : Menlo indisponible là où tournent les scripts.
- Rail de la Side Navigation : `Frame 172` à hauteur fixe masqué, trait droit relié à `foundation/color/grey/100` sur l'instance (défaut librairie).
- Discard en Primary Default : Button n'a pas de ton Negative (écart librairie).
- Board row repose sur Horizontal Card (padding M unique depuis la suppression de Size) : 58 px au lieu de 48 dans l'app.

## Refactor des librairies (2026-11-04)

- Horizontal Card : 8 → 4 variantes (Type × Open), `.Favorite` (2074:1404, clé `382c158f…`) exposé, Size supprimée. Publié.
- Standalone Dropdown : 12 → 8 (Tone × State), `.Chevron` (3067:232, Tone × Open) exposé, Focus booléen. Publié.
- Identifier : 4 → 2 (State), Copyable et Focus booléens. **À republier.**
- 30 propriétés inutilisées supprimées (Data Entry, Data Display). Collection Density créée puis supprimée (refus utilisateur : 2 niveaux de tokens seulement).
- Fichier Search recâblé : 96 instances.

## Qirin · Coverbook (`NflKzgx17mOn2JPoFaqnjW`), livré v1.0 le 2026-11-05

Pages : Cover 0:1 (cover 3:287, Ready for dev, v1.0, 2026-11-05), Changelog 1:2 (entrée 7:90, composant 7:60), Overview 1:3 (8:48, 6 vignettes `Screen copy` = copies réduites 199 px de large, ordre du parcours), Screens 1:4 (Buyer covers 42:36, Policy covers 42:37, Cover details 52:10722, Row actions 62:13417), States 1:5 (Loading 60:9370, Empty and filtered 74:13999, Scroll and long content 78:23140, Interaction 83:26670), Specs 1:6 (section 54:6151, 4 écrans annotés + cadres Notes 99:7034 / 99:7048 / 99:7065 / 99:7073, Deviations 78:7063), Local components 1:7.
Composants locaux (tous décrits `Local · `, aucun orphelin) : Coverbook shell 12:6887, Covers toolbar 16:1764, Policy summary panel 20:1719, Cover details modal content 21:1851, Row menu 21:1914 (final : View details seul, 2e item masqué supprimé via `# Items=1`), Covers table Buyer credit limits 25:3805, Policy credit limits 25:4722, Buyer grade based covers 29:11254, Policy grade based covers 29:13648.
QA finale : écarts 560 px entre écrans, 200 px entre sections, aucun débordement ; fonds des 14 écrans States et de la coque reliés à Background/Main/Primary ; champ « Filtered » de la toolbar relié aux tokens (Spacing S/XS, Radius S, Body S Regular) ; aucun tiret cadratin, aucun texte provisoire.
Écarts : vignettes 2 et 4 = écrans côté policy, 3 = état Filtered (page States) faute d'écran Screens dédié ; étape 6 de l'Overview devenue « Open the row menu » (plus de saut vers l'autre côté) ; les copies réduites sont détachées (liaisons de tokens non conservées, exclues de l'audit) ; écarts librairie listés dans Specs · Deviations (Card sans ton subtle, pas de chips sur le multi-select, Link sans icône). Version nommée et vignette du fichier : à faire à la main.

## Qirin · Reject Management (`zUzOSE77EjbShM9u7yLthB`), livré v1.0 le 2026-11-05

Cadres en **1280**. Pages : Cover 0:1 (cadre 3:2, Ready for dev, v1.0, main · 5929db5b), Changelog 1:2 (cadre 5:128, une seule entrée v1.0 ; composant `Changelog entry` 5:98), Overview 1:3 (cadre 8:25, 6 vignettes = clones réduits des écrans de Screens), Screens 1:4 (sections Rejects list 83:3202, Correction modal 100:9106, Bulk actions 109:16392), States 1:5 (sections 87:25 à 87:28), Specs 1:6 (section 66:25 ; 4 écrans annotés + Notes 480 px + Deviations 84:6449), Local components 1:7.
**Locaux** : `Reject Management shell` 16:11688 (Active tab × 4), `Rejects toolbar` 23:1688, `Rejects table` 25:4981, `Resolution notice` 31:4052, `Block card` 37:4044, `Field panel` 43:4009, `Correction modal footer` 47:4226. Tous décrits `Local · `, aucune maîtresse orpheline.
**Écarts** : pas de ton Negative sur Button (Delete en Primary Default) ; Functional Notice sans slot (notice de résolution et notice « select all » en wrappers locaux) ; padding du Page Header posé sur l'instance ; pas d'icône info à côté du libellé Country code ; contour gris hover/focus de Back et Delete non reproduit ; retrait gauche 56 px des lignes Suggestion et Steps (aligné sur le texte de la notice, sans token) ; conteneurs d'ensembles de composants gardent leur padding 40 par défaut.
Audit final : tokens liés (fills de sections, paddings, gaps, rayons), aucun tiret cadratin, 560 px entre écrans, 200 px entre sections. Le panneau Field n'est montré que dans les écrans Errors de Screens, pas dans les Specs.

## Qirin · Manual Underwriting (`9EXkGvyk2yGF9qFpRpV0Ey`), livré v1.0 le 2026-11-05
- Pages : Cover 4:287 (Ready for dev, v1.0, 2026-11-05, source main), Changelog 11:74 (entrée 11:79, composant local 11:49, `main · c4fcc784`), Overview 14:39 (7 étapes, vignettes = copies réduites et rognées des écrans, ordre du parcours).
- Screens 1:4 : Request page 71:10316, Without rights 71:13208, Card details 71:14028, Complete 74:22221, Send 77:8533, Validate or reject 77:11334 (sections espacées de 200, écrans de 560).
- States 1:5 : Loading 70:4477, Statuses and rights 70:9677, Disabled actions 74:4266, Form and modal errors 77:22503, Feedback 79:12343.
- Specs 1:6 : 4 écrans annotés (69:3438, 70:7237, 70:7781, 70:7982), cadres Notes 71:13001 / 71:13024 / 71:13047 / 71:13067, cadre Deviations 71:13178 ; 440 px libres puis Notes (480) puis 560 px.
- Locaux (1:7) : UW page shell 28:2201 (Status Draft / To be validated / Validated ; badge To be validated = Warning dans le maître 28:1346, surcharges des instances retirées), UW card 21:178, UW property row 14:104, UW content / Buyer 15:27, Current limit 15:44, Validation 15:64, Insured and policy 15:93, Request 17:1483, Answer 17:1647, UW card menu 21:431, Modal content / View details 29:1766, Complete form 29:2368 et Validate or reject 32:1868 (footer inclus), Send 32:1761.
- Écarts : pas de ton Negative sur Button (Reject en secondary), Menlo remplacé par JetBrains Mono, destinataire multi-sélection (la maquette ManA est un select simple), séparateur de carte en longueur fixe, libellés de champ en semi-bold dans le code (regular dans la librairie). Détail dans le cadre Deviations 71:13178.
- Audit final : 0 tiret cadratin, 0 valeur non liée hors chrome des sets de composants, libellés du rail replié de la side nav tolérés ; sections et notes liées à Background/Main/Primary ou sans fond.
- Reste à faire à la main : version nommée dans l'historique Figma, vignette du fichier, republication si les composants locaux migrent en librairie.
