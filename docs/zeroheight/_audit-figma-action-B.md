# Audit Figma Action B : Link, Crumb, Breadcrumb, Chip, Tag

Date : 2026-11-06. Lecture seule (Figma, code, ZeroHeight). Fichier Figma `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`), code `src/app/shared/ui/{link,crumb,breadcrumbs,chip,tag}`, docs `docs/zeroheight/action/*.md`.

Objectif : composants Figma propres et iso avec le code. Sens des corrections : "Figma" = corriger la librairie, "Code" = corriger Angular, "Doc" = corriger la page ZeroHeight.

## Constats transverses (valables pour les 5 composants)

| # | Ecart | Sev. | Correction |
|---|-------|------|-----------|
| T1 | Aucune description sur aucun composant (Link, Crumb, Breadcrumb, Chip, Tag). La doc Breadcrumb cite une description Figma qui n'existe pas sur le noeud 298:5526 | Moyenne | Figma : renseigner `description` sur chaque set / composant. Doc : retirer la citation tant qu'elle est vide |
| T2 | Espacements (gap, padding) jamais lies a une variable : Link gap 4, Chip 16/8/8/4, Tag/.Options 8/4/4, Breadcrumb gap 4 | Haute | Figma : lier a Semantic Measurement/Spacing (XS 4, S 8, M 16). Le code utilise deja ces tokens (sauf Link) |
| T3 | Rayons non lies : Tag/.Options 4 (et 4/0/0/4, 0/4/4/0), Chip 10000 | Haute | Figma : lier a Semantic Border/Radius S (4) et Round (code : `--semantic-border-radius-round`) |
| T4 | Styles de texte non lies sur Chip (Allianz Neo SemiBold 14 et 12) et Tag/.Options (SemiBold 14). Link et Crumb sont lies (Body/L, Body/M) | Haute | Figma : lier a Body/M/Semi Bold (Chip M, Tag) et au style 12 Semi Bold (Chip S) |
| T5 | Noms de variables obsoletes : Chip, Tag, Breadcrumb lient `Color/Interactive/Text/Main/...`, `Background/Main`, `Border/Main/Alt`, `Muted`, `Pressed`, alors que Link/Crumb lient `Strong`, `Strong/Alt`, `Active` (noms du code). Aucune couleur Foundation directe ni valeur brute, mais deux vocabulaires coexistent | Moyenne | Figma : re-lier Chip/Tag/Breadcrumb aux variables `Strong`, `Strong/Alt`, `Active` (memes valeurs resolues) |
| T6 | Calques sans nom par defaut : aucun (RAS). Auto-layout : OK partout. Aucun detachement d'instance detecte | OK | n/a |
| T7 | Remplissage brut (non lie) sur la racine de certaines variantes (Link ? non, Tag `Type=Select/Filter`, Crumb `Current Page`, `.Options` Chip) | Basse | Figma : retirer le fill vide ou le lier |
| T8 | Couleurs : toutes les liees sont Semantic (jamais Foundation ni brut) sur les 5 composants | OK | n/a |

## 1. Link

- Noeud : set `688:4202` (page Link). Verdict : **A CORRIGER**
- 288 variantes (State 4 x Tone 3 x Icon 3 x Size 2 x Font Weight 2 x Text Decoration 2). Defauts : State Default, Tone Default, Icon Left, Size M, Font Weight Semi-Bold, Decoration None.
- Meme page : `Link` 689:4239 (12 variantes, State/Tone Neutral-Default-Reversed, base `.Specs`), `.Specs` 171:3065, `.Specs` 77:260, `[DEPRECATED] Link` 77:315. Quatre sets en plus du principal.
- Calques : `Icon Functional` > `Color` > `🔗 Icon` (instance Edit Pen) + `Label`. Couleurs texte et icone liees aux variables Semantic Interactive Text/Icon (Strong, Strong/Alt, Neutral x Default/Hover/Active/Disabled). Texte lie a Body/L et Body/M (Regular, Semi Bold, Underline).

| Ecart | Figma | Code | Sev. | Correction (cote) |
|-------|-------|------|------|-------------------|
| Trop de variantes : Icon (3 valeurs) et Decoration/Weight multiplient le set par 288 ; variante `Icon=None` contient quand meme une instance d'icone masquee | Icon = variant Left/Right/None | slots icon-left / icon-right | Haute | Figma : remplacer `Icon` par 2 booleens (Icon Left, Icon Right) + instance swap du glyphe ; ramene a 96 variantes (voire 48 si Weight devient un autre axe) |
| Defaut Font Weight | Semi-Bold | `regular` | Moyenne | Decider un seul defaut. Proposition : code passe a `semi-bold`, ou Figma repasse a Regular (la doc le signale deja) (Code ou Figma) |
| Nom du ton neutre | `Accent` (#121212, Strong/Alt) | `neutral` (Grey/900) | Moyenne | Aligner : renommer Figma `Accent` en `Neutral` (le set 689:4239 dit deja `Neutral`) ou le code en `accent`. Le code `neutral` suit CLAUDE.md et la doc ; renommer Figma (Figma) |
| Etat Active vs Pressed | `Active` (set principal), `Pressed` (set 689:4239) | `:active` | Basse | Figma : unifier sur `Active` |
| Tokens du ton neutre | Strong/Alt/{Default,Hover,Active} (#121212, #262626, #414141) | `static-text-main-primary`, `interactive-text-strong-alt-hover`, `static-text-main-secondary` (melange Static/Interactive) | Moyenne | Code : utiliser `interactive-text-strong-alt-{default,hover,active}` (memes valeurs, un seul jeu) (Code) |
| Gap icone/label | 4 non lie | `var(--foundation-spacing-4, 4px)` : Foundation direct + repli en dur | Haute | Figma : lier au Semantic Spacing XS. Code : `--semantic-measurement-spacing-xs` (Figma + Code) |
| Focus | aucune variante (dessine en CSS, 3px offset 2px radius 2px en dur) | `:focus-visible` outline 3px | Basse | Code : lier outline-width / offset / radius a des tokens. Figma : annotation, pas de variante (Code) |
| Props code seulement | aucune | `href`, `external` | Info | Doc : deja documente |
| Disabled | opacity 0.4 sur le noeud + token Disabled (meme couleur que Default) | opacity-disabled 0.40 | OK | iso |
| Tailles | M 16/24, S 14/20 | size-l/line-height-l ; size-m/line-height-m | OK | iso |
| Doublons | 4 sets annexes dont 1 deprecated | n/a | Moyenne | Figma : supprimer `[DEPRECATED] Link` et `.Specs` 171:3065 apres migration, fusionner 689:4239 dans le set principal (Breadcrumb en depend) |

Doc `link.md` : suit (ecarts Accent/neutral, defaut Weight, 689:4239 deja listes). Rien a changer sauf mention du plan de fusion.

## 2. Crumb

- Noeud : set `705:4485` (parent `_Design system header`, page Breadcrumb). Verdict : **A CORRIGER**
- 2 variantes : `Current Page` True/False (defaut False). Composition : instance `Link` (Accent, Icon Right, Regular) avec chevron, ou Link Default Semi-Bold sans icone en Current.

| Ecart | Figma | Code | Sev. | Correction (cote) |
|-------|-------|------|------|-------------------|
| Crumb non utilise par Breadcrumb | Breadcrumb compose 7 `Link` bruts (set 689:4239) et non des `Crumb` | Breadcrumbs projette des `ds-crumb` | Haute | Figma : Breadcrumb doit empiler des instances de Crumb (une seule source de verite) |
| Emplacement du composant | Crumb est dans le cadre `_Design system header` au lieu d'etre sur son propre cadre de page | n/a | Basse | Figma : deplacer dans un cadre de composants |
| Hauteur | 20 (Link texte de 24 dans 20) | `height: 20px` | OK | iso |
| Etat Disabled | absent | `disabled` input (opacity 0.4) | Moyenne | Figma : ajouter un booleen/variante Disabled ou documenter que Link le porte (Figma) |
| Couleur du courant | Strong/Default (#007ab3) Semi-Bold | `interactive-text-strong-default` semi-bold | OK | iso |
| Libelle | texte "Crumb" du Link | input `label` requis | OK | iso |
| Gap | 4 non lie (T2) | `spacing-xs` | Haute | Figma : lier |
| Doc | `crumb.md` cite le noeud 705:4485 : correct. Commentaire du scss cite 1709:14619 : introuvable | Basse | Code : corriger le commentaire de tete de crumb.component.scss (Code) |

Doc `crumb.md` : suit.

## 3. Breadcrumb

- Noeud : composant `298:5526` (page Breadcrumb). Verdict : **A CORRIGER**
- 1 seul composant, aucune propriete, 7 instances `Link` (set 689:4239, Tone Neutral + `.Specs` Icon Right chevron) et le dernier en Default Semi-Bold. 513x24.

| Ecart | Figma | Code | Sev. | Correction (cote) |
|-------|-------|------|------|-------------------|
| Pas de composition par Crumb | 7 Link + chevrons dans `.Specs` | `ds-crumb` | Haute | Figma : refaire avec 7 instances de Crumb, slot ou booleens de visibilite |
| Profondeur geree en masquant des calques | aucune propriete | contenu projete (nombre libre) | Moyenne | Figma : un slot "Crumbs" (Crumb en defaut) ou booleens Crumb 2..7 ; pas de variantes |
| Zone d'actions absente | aucune | slot `[slot=actions]`, min-height 32, gap M | Moyenne | Figma : slot `Actions` masquable par booleen (ou le cacher en doc) |
| Texte du Link lie a Main/Alt (nom obsolete) | `Text/Main/Alt/Default` | n/a | Moyenne | Figma : T5 |
| Gap 4 non lie | oui | `spacing-m` entre trail et actions | Haute | Figma : T2 |
| Description | vide | citee dans la doc | Moyenne | Figma : renseigner (T1) |
| a11y | n/a | `role=navigation`, `aria-label=Breadcrumb` | Info | Doc : deja mentionne |
| Coherence interne | `Breadcrumbs - Topbox` (Data Display, clef 099403d1...) existe en plus | n/a | Moyenne | A auditer a part : verifier qu'il compose Breadcrumb |

Doc `breadcrumb.md` : suit pour la structure, mais cite une description Figma inexistante.

## 4. Chip

- Noeud : set `456:438` (page Chip). Verdict : **A CORRIGER**
- 16 variantes : State (Default/Hover/Active/Disabled) x Selected (False/True) x Size (M/S). Defauts : Default, False, M. Un seul calque `Value` (texte), layout vertical.

| Ecart | Figma | Code | Sev. | Correction (cote) |
|-------|-------|------|------|-------------------|
| Type absent | un seul chip selectionnable | `type` static / filter / select (defaut `static`) | Haute | Figma : ajouter `Type` (Static, Filter, Select) ou documenter la limite. Eviter de multiplier le set : Static sans hover = retirer des variantes via boolean ; Filter = booleen "Close" |
| Croix du type filter | absente | caractere texte "×" (`<span>×</span>`) | Haute | Code : remplacer par `<ds-icon name="close">` (regle CLAUDE.md "pas d'icone texte"). Figma : ajouter un atome `.Close` imbrique expose (Figma + Code) |
| Slots icone gauche/droite | absents | `[slot=icon-left]`, `[slot=icon-right]` | Moyenne | Figma : 2 booleens + instance swap (ou doc : code seul) |
| Selected hover/active | bg Main/Hover, Pressed | `background-strong-hover/active` | OK (valeurs) | T5 pour les noms |
| Hover/Active du libelle inverses | Text/Main/Alt/Pressed au hover, Hover a l'appui | idem, inverse volontaire | Basse | Equivalent. Figma ou code : corriger les deux pour que hover = Hover, active = Active (inversion probablement un bug de la maquette) |
| Rayon | 10000 brut | `--semantic-border-radius-round` | Haute | Figma : lier au rayon Round (T3) |
| Padding / hauteur | M 16/8 (32), S 8/4 (24) non lies | sizing-xl/l, spacing-m/s | Haute | Figma : lier (T2) |
| Texte | SemiBold 14/12 sans style | font-size-m / s | Haute | Figma : lier styles (T4) |
| Layout | vertical, gap 8 inutile pour 1 calque | flex horizontal | Basse | Figma : passer en horizontal, gap 4 (le code a gap xs) pour accueillir icones et croix |
| Disabled | opacity 0.4 (texte/bord restent Default) | opacity 0.40 | OK | iso |
| Focus | aucune variante | outline 2px offset 2px | Basse | Figma : annotation (comme Button Icon, Focus = cadre Border Focus booleen) ou Code seul |
| Etat | Default, Hover, Active, Disabled | idem | OK | iso |

Doc `chip.md` : suit (ecarts Type, croix, slots tous listes).

## 5. Tag

- Noeud : set `102:558` (page Tag). Verdict : **A CORRIGER**
- 3 variantes : Type Static / Filter / Select (defaut Filter). Chaque variante contient une instance exposee de `.Options` (Select 102:494 State x Selected ; Filter 102:347 State x Type Default/Dropdown), sauf Static qui est un cadre `Chip` brut + un second `Chip` masque.
- Etats portes par le sous-composant, pas par le Tag : ok pour le pattern atome imbrique expose.

| Ecart | Figma | Code | Sev. | Correction (cote) |
|-------|-------|------|------|-------------------|
| Defaut du Type | Filter | `select` | Moyenne | Aligner (Figma : Select, ou code : filter). La doc le signale |
| Static n'est pas une instance de `.Options` | cadre `Chip` en dur, + Chip masque (calque mort) | n/a | Haute | Figma : faire de Static une instance de `.Options` 102:537 (qui existe deja) ; supprimer le Chip masque. La doc (`.Options` 102:537) decrit un etat qui n'est pas celui du fichier |
| Calques masques morts | chaque variante Select garde un `Chip` droit masque + icone | n/a | Moyenne | Figma : supprimer les calques masques ou les remplacer par booleens |
| 3 composants nommes `.Options` | 102:347, 102:494, 102:537 | n/a | Moyenne | Figma : nommer `.Tag Filter Options`, `.Tag Select Options`, `.Tag Static Options` (ou fusionner Static dans Select via booleen "Check") |
| `Type=Dropdown` du filtre | present (chevron) | absent du code | Moyenne | Code : ajouter ou Figma : retirer. Demander au produit si les tags-dropdown existent |
| Etats Hover/Active du Filter | plaque droite seulement | `.ds-tag__chip--right` seulement | OK | iso |
| Hover/Active du Select | plaque entiere, Muted/Hover (#d9eaf2) / Pressed | `main-alt-secondary/tertiary` | OK (valeurs) | T5 pour les noms |
| Select selected : bordure | 1px Border/Main/Default | `border-strong-default` | OK | iso (noms T5) |
| Disabled | opacity 0.4 | opacity-disabled | OK | iso |
| Focus | aucune variante | outline 3px offset 2px radius-s | Basse | Code : lier outline aux tokens |
| Rayons non lies, padding non lie, texte sans style | oui | tokens | Haute | Figma : T2, T3, T4 |
| Taille de l'icone | 12 (Close, Check, Chevron) | `ds-icon size=12` | OK | iso |
| Plaque Filter : bordure/rayon | 4/0/0/4 et 0/4/4/0 | idem | OK | iso |

Doc `tag.md` : suit, sauf la description de `.Options` Static (102:537) qui n'est pas instanciee dans le Tag.

## Synthese

| Composant | Noeud | Verdict | Ecarts haute severite |
|-----------|-------|---------|----------------------|
| Link | 688:4202 | A CORRIGER | 288 variantes, gap non lie / foundation en code |
| Crumb | 705:4485 | A CORRIGER | Non utilise par Breadcrumb |
| Breadcrumb | 298:5526 | A CORRIGER | Pas de Crumb, pas de slot, description vide |
| Chip | 456:438 | A CORRIGER | Type et croix absents, rayon/espacement/texte non lies |
| Tag | 102:558 | A CORRIGER | Static non instance, tokens non lies, 3 `.Options` |

Priorites : (1) lier espacements, rayons et styles de texte a Semantic (T2 T3 T4) sur Chip, Tag, Link, Crumb, Breadcrumb ; (2) re-lier aux noms `Strong` (T5) ; (3) refondre Breadcrumb sur Crumb avec slot ; (4) reduire Link (booleens d'icones) et supprimer les sets deprecated/doublons ; (5) corriger cote code : croix du chip en `ds-icon`, tokens Link, focus rings.
