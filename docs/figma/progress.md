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
