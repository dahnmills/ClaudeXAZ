# Audit Figma Action (lot C) : Segmented Control, Tab, Stepper, Pagination

Fichier : [Components] Action (`xCeEJPn6fliEshuE9fnrqs`). Audit en lecture seule (Figma, code, ZeroHeight). Date : 2026-11-06.
Légende côté de correction : FIGMA = corriger Figma, CODE = corriger le code, LES DEUX = décision à prendre puis alignement.
Sévérité : H = écart visible ou structurel, M = écart de modèle ou de dette, B = mineur.

Constat transversal : dans ces quatre pages, aucun fill ni stroke brut dans les variantes principales, la typo est reliée aux variables de police, mais l'espacement, les paddings et les rayons ne sont reliés à aucune variable Semantic (valeurs 4, 8, 16, 24 en dur), aucune description de composant n'est renseignée, et plusieurs fills pointent directement un token Foundation.

---

## 1. Segmented Control

- Node : set `302:2197` (page `302:2`), nommé **`Component 1`**. Atome interne `.Content` `302:1938`.
- Verdict : **A CORRIGER**
- Variantes : 24 (State 4 x Position 3 x Selected 2). `.Content` : Icon Left, Right, None (exposé). Descriptions vides.

| # | Sujet | Figma | Code | Sév. | Correction (côté) |
|---|---|---|---|---|---|
| 1 | Nom du set | `Component 1` | `ds-segmented-control` | H | Renommer en `Segmented Control Item` (ou `Segment`) et créer un composant groupe `Segmented Control` (FIGMA) |
| 2 | Modèle | Un seul segment à répéter, pas de composant groupe | Un composant groupe (`options[]`, `selected`, `mode`) | H | Créer le groupe Figma avec segments en instances (Position gérée par le groupe) (FIGMA) |
| 3 | Couleur bordure et libellé au repos | Bordure `Border/Strong/Default` et texte `Text/Strong/Default` = bleu `#007ab3` | Bordure `border-strong-alt-default` et texte `static-text-main-primary` = gris `#121212` | H | Choisir la référence puis aligner l'autre côté (LES DEUX). La page ZeroHeight annonce Grey/900 pour Figma, c'est faux |
| 4 | Hover, non sélectionné | Fond blanc (`Background/Neutral/Hover` = `#ffffff`), texte et bordure passent en `#006192` | Plaque bleu clair `background-light-hover`, texte inchangé | H | Aligner (LES DEUX) |
| 5 | Active, non sélectionné | Fond blanc, texte et bordure `#075994` | Plaque `background-light-active` | H | Idem |
| 6 | Disabled | Couleurs `...Disabled` ET opacité du calque 0.40 (double atténuation) | Opacité 0.40 seule, couleurs de repos | M | Retirer l'opacité du calque Figma ou les jetons Disabled (FIGMA) |
| 7 | Hover/Active sélectionné | Fond `Background/Strong/Hover|Active` | Fond `border-strong-hover|active` (même valeur, jeton différent) | B | Aligner le jeton côté code (CODE) |
| 8 | Position `Single` | Absent | `--single` (rayon complet) | M | Ajouter `Position=Single` (FIGMA) ou le gérer dans le groupe |
| 9 | Espace icône/libellé | `.Content` itemSpacing 8 | `gap: spacing-xs` (4) | H | Corriger l'un des deux, vérifier d'abord la valeur voulue (LES DEUX) |
| 10 | Rayon | 4 sur First/Last, valeur brute, non liée | `--semantic-border-radius-s` | M | Lier à `Border/Radius/S` (FIGMA) |
| 11 | Padding, hauteur | 16 / 4 bruts, hauteur issue du contenu | `spacing-none spacing-m`, hauteur `spacing-xl` | M | Lier à `Measurement/Spacing` (FIGMA) |
| 12 | Focus | Aucun | Aucun style (défaut navigateur) | M | Ajouter `:focus-visible` dans le code et un booléen Focus dans Figma, comme Button Icon (LES DEUX) |
| 13 | Modes tabs/radio, `describedBy`, `ariaLabel` | Sans objet | Présents | B | Fonctionnel seulement, noter dans la doc (aucun écart visuel) |
| 14 | Propriété texte du libellé | Libellé dans `.Content`, texte non exposé | `option.label` | B | Exposer le texte `Label` sur le segment (FIGMA) |
| 15 | Description | Vide | Sans objet | M | Renseigner (FIGMA) |
| 16 | Icône Foundation | `foundation/color/neutral/white` sur `Color` dans `Icon Functional` (remote) | `ds-icon` | B | Corriger dans la librairie des icônes |

Doc `docs/zeroheight/action/segmented-control.md` : suit le code et l'état Figma pour la structure (Component 1, positions, `.Content`). Erreurs : annonce « 1px Grey/900 border » pour Figma (réel : bleu #007ab3, cf. 3), ne signale pas les écarts 4, 5, 6, 9. Le tableau tokens décrit le code, pas Figma.

---

## 2. Tab

- Node : set `57:231` (page `56:228`), atome interne `.Options` `160:131`.
- Verdict : **A CORRIGER**
- Variantes : 24 (State 4 x Selected 2 x Tone 3). Propriétés : Dropdown (bool, true), Mask (bool, false), Badge (bool, true), Label (texte), `.Options` exposé (Open). Description vide.

| # | Sujet | Figma | Code | Sév. | Correction (côté) |
|---|---|---|---|---|---|
| 1 | Graisse du libellé sélectionné | Selected=True = Bold (700), non sélectionné = Regular (largeur 68 contre 67) | Toujours `font-weight-regular` | H | Aligner : choisir Bold ou Regular pour Selected (LES DEUX) |
| 2 | Défaut `Selected` | True | false | M | Mettre False par défaut dans Figma (FIGMA) |
| 3 | Défaut `Dropdown` / `Badge` | true / true | `chevron=false` / `counter=null` | M | Mettre false par défaut dans Figma (FIGMA) |
| 4 | Compteur | Instance `Badge` 12 x 12 en position ABSOLUTE (coin haut droit) dans `Badge Wrapper` > `Constraint` | Pastille rouge 16 px en ligne après le libellé (`.ds-tab__counter`) | H | Choisir une seule position et taille (LES DEUX) |
| 5 | Compteur inline `(3)` et `counterStrong` | Absent | `counterStyle='inline'`, `counterStrong` | M | Ajouter au Figma ou retirer du code (LES DEUX) |
| 6 | Point de changement `changed` | Absent | Présent (`ds-tab__change-dot`) | M | Ajouter un booléen `Changed` (FIGMA) |
| 7 | Icône à gauche (`icon`, slot) | Absent | Présent | M | Ajouter un booléen + instance swap (FIGMA) |
| 8 | `fill` (part égale) | Absent | Présent | B | Comportement de layout, à noter dans Figma (FIGMA) |
| 9 | `Mask` | Booléen, Left/Right avec fill noir brut et dégradé non lié | Aucun | M | Supprimer ou documenter, remplacer par fills liés (FIGMA) |
| 10 | `.Options` Open | Variante Open True/False | Aucun état ouvert du chevron | B | Ajouter `chevronOpen` ou retirer la variante (LES DEUX) |
| 11 | Indicateur au survol, non sélectionné | Calque `Active` masqué (visible=false) | Visible à opacité 0.35 au survol | H | Ajouter le comportement dans Figma (FIGMA) |
| 12 | Indicateur : fills non sémantiques | Non sélectionné : `foundation/color/action/blue/600|650|700` en direct (calque masqué) | `border-strong-*` Semantic | H | Remplacer par `Color/Interactive/Border/Strong/*` (FIGMA) |
| 13 | Indicateur : rayon | 0 | `2px 2px 0 0` | B | Aligner (LES DEUX) |
| 14 | Teinte Reversed | `Text/Muted/Alt/Default` = `#ffffff` | `text-neutral-default` = blanc | B | Même valeur, jeton différent, aligner le jeton (LES DEUX) |
| 15 | Disabled | Couleurs `...Disabled` et opacité 0.40 | Opacité 0.40 seule | M | Retirer la double atténuation (FIGMA) |
| 16 | Focus | Aucun | `:focus-visible` outline 3px offset 2px | M | Ajouter booléen Focus (FIGMA) |
| 17 | Espacements | itemSpacing 4, 2, 10 bruts non liés | Tokens | M | Lier (FIGMA) |
| 18 | Valeurs en dur dans le SCSS | Sans objet | `4px`, `2px`, `16px`, `12px`, `9999px`, `3px`, opacité `0.35` | M | Remplacer par des jetons (CODE) (dette CLAUDE.md) |
| 19 | Description | Vide | Sans objet | M | Renseigner (FIGMA) |
| 20 | Propreté | Calques `Constraint`, `Badge Wrapper` à 10 px de gap non lié, Badge non exposé | Sans objet | B | Exposer l'instance `Badge` (isExposedInstance) pour le chiffre (FIGMA) |

Doc `tab.md` : suit bien le code et Figma (propriétés, défauts divergents signalés, valeurs hors tokens). Manques : n'indique pas la graisse Bold du sélectionné dans Figma (1), ni l'indicateur masqué au survol (11), ni la taille 12 x 12 du badge (4), ni les jetons Foundation directs (12).

---

## 3. Stepper

- Node : page `312:1332` (« Stepper 🔴 », sous WIP), cadre `Frame 1` `312:1333`. **Aucun composant ni set.**
- Verdict : **A CORRIGER** (à construire)
- Contenu : maquettes libres, calques `Frame 1..25` non nommés, 4 variantes horizontales dessinées (Minimum, Sub text and number Centered, Sub text and number + status, Progress bar global), faute « Aditionnal info ».

| # | Sujet | Figma | Code | Sév. | Correction (côté) |
|---|---|---|---|---|---|
| 1 | Composant | Aucun component set | `ds-stepper` | H | Créer `Stepper Step` (atome) + `Stepper` (FIGMA) |
| 2 | Orientation | 4 modèles horizontaux | Vertical seulement | H | Décision produit : horizontal à coder ou à retirer du design (LES DEUX) |
| 3 | Statuts | Non modélisés | 7 : upcoming, unlocked, current, completed, current-completed, error, warning | H | Variante `Status` sur l'étape (7 valeurs) (FIGMA) |
| 4 | Marqueur | Cadres libres 16 / 24 px | Cercle 24 px, anneau 2 px, point 8 px, check 14 px, icônes error/warning 24 px | M | Reprendre les cotes du code, ou l'inverse (LES DEUX) |
| 5 | Textes | « Business info », « Review » | « Step N/M », libellé, statut (« Completed », « Error », « Warning ») | M | Texte `Label`, `Index`, `Status` exposés (FIGMA) |
| 6 | Propreté | Noms `Frame N`, auto-layout partiel, valeurs probablement brutes | Tokens | H | Tout reconstruire avec variables Semantic (FIGMA) |
| 7 | Connecteur | Cadres de 2 / 4 px | Trait 1 px `border-subtle-tertiary` | M | Aligner (LES DEUX) |
| 8 | Défauts | Sans objet | `current=0`, `navigableUpTo=-1` | B | Données, pas de variante (aucune) |
| 9 | Typo | À vérifier à la reconstruction | Index 12 px, libellé 14 px semi-bold | B | Utiliser les styles Body S / Body M (FIGMA) |
| 10 | A11y code | Sans objet | `div` cliquables, sans rôle ni clavier ni `aria-current` | H | Passer en `ds-button`/liste + `aria-current` (CODE) |
| 11 | Valeurs en dur dans le SCSS | Sans objet | `56px`, `70px`, `24px`, `8px`, `2px`, `4px`, `16px` | M | Jetons (CODE) |

Proposition de modèle Figma minimal : atome `.Step` (Status 7 valeurs, `Last` booléen pour le connecteur, `Clickable` booléen), `Stepper` en auto-layout vertical avec slot de `.Step`. Pas de variante de contenu.

Doc `stepper.md` : exacte, dit déjà que Figma est vide (« Design WIP ») et décrit le code. Ne signale pas les 4 maquettes horizontales ni l'écart d'orientation (2).

---

## 4. Pagination

- Node : set `53:2994` (page `52:779`), atome interne `.Options` `53:2954`.
- Verdict : **A CORRIGER**
- Variantes : Pagination Style = Infinite Scroll, Classic (2). `.Options` Type = Full, Select, Minimal (3, exposé). Description vide.

| # | Sujet | Figma | Code | Sév. | Correction (côté) |
|---|---|---|---|---|---|
| 1 | Nom des styles | `Infinite Scroll` = bouton « Load more results » (`Button Load More`) ; `Classic` = instance de `.Options` (défaut Minimal) | `classic` = First/Back/pages/Next/Last, `infinite` = Back, N of M, Next | H | Renommer côté code ou Figma : p. ex. Figma `Style = Pages | Load more`, code `type` aligné (LES DEUX) |
| 2 | Type Select | Présent (Dropdown de page + `of` + dernier numéro) | Absent | H | Coder ou retirer (LES DEUX) |
| 3 | Load more | Dans le set | Pas dans `ds-pagination` (est dans `ds-button`) | M | Sortir du set Figma (composant `Button Load More` suffit) (FIGMA) |
| 4 | Page courante | Aucun style distinct (tous les liens SemiBold bleu) | Gris `#121212`, non cliquable, `aria-current` | H | Ajouter un état courant (variante Link `Current` ou propriété) (FIGMA) |
| 5 | Ellipsis | `...` est un `Link` bleu cliquable | `…` gris, `aria-hidden` | M | Texte statique côté Figma (FIGMA) |
| 6 | Écarts de gap | Full : 24 entre blocs, 16 entre pages ; Minimal : 24 / 8 | `spacing-m` (16) partout | H | Aligner (LES DEUX), puis lier à `Measurement/Spacing` |
| 7 | Composition | `Link` en instances | `<button>` natifs avec CSS recopié (viole CLAUDE.md : composer `ds-link`) | H | Composer `ds-link` (CODE) |
| 8 | First/Back/Next/Last | Doubles `Link` masqués à l'intérieur des cadres `Back` et `Next` | `showFirstLast` | M | Booléen `Show first/last` exposé (FIGMA) |
| 9 | Disabled (page 1 et dernière) | Aucun état | `disabled`, opacité 0.40, hors tabulation | M | Ajouter via `Link State=Disabled` dans la maquette (FIGMA) |
| 10 | Hover/Active | Celui de Link | Recopié dans le SCSS | B | Disparaît avec le point 7 (CODE) |
| 11 | Focus | Aucun | Défaut navigateur | M | `:focus-visible` via Link (LES DEUX) |
| 12 | Texte « N of M » | Textes `X`, `of`, `X` sans style de texte ni nom clair | `<strong>` | M | Appliquer le style `Body/L/Regular|Semi Bold`, nommer `Current`, `Total` (FIGMA) |
| 13 | Hauteurs | Infinite Scroll 32, Classic 24 | Ligne 24 | B | Sans objet si Load more sort du set |
| 14 | Propriétés | `Style` et `Type` en deux niveaux imbriqués | `style`, `page`, `total`, `siblings`, `showFirstLast` | M | Deux axes simples : Style + `Show first/last` booléen (FIGMA) |
| 15 | Fills Foundation directs | `foundation/color/action/blue/500` sur l'icône (remote) ; bouton Load more : rayon 4 et padding 16/4 bruts | Sans objet | M | Corriger dans les librairies Icon et Button Load More |
| 16 | Description | Vide | Sans objet | M | Renseigner (FIGMA) |

Doc `pagination.md` : bonne et honnête (signale déjà les noms qui ne correspondent pas, Select sans équivalent). Manques : gaps différents (6), page courante absente de Figma (4), `<button>` natifs (7), ellipsis cliquable (5).

---

## Synthèse

| Composant | Verdict | Écarts H |
|---|---|---|
| Segmented Control | A CORRIGER | 5 |
| Tab | A CORRIGER | 4 |
| Stepper | A CORRIGER | 4 |
| Pagination | A CORRIGER | 5 |

Priorités : (1) trancher Segmented Control repos bleu ou gris, Tab Bold ou Regular, Pagination Classic/Infinite et Select, Stepper horizontal ; (2) renommer `Component 1` et créer le groupe ; (3) lier padding, gap, rayon aux Semantic dans tous les sets ; (4) remplacer les fills Foundation directs de Tab ; (5) construire le Stepper dans Figma ; (6) faire composer `ds-link` à Pagination ; (7) renseigner les descriptions.

Limites : les pages d'autres composants (Link, Button Load More, Dropdown, Badge, Icon Functional) n'ont pas été auditées ici, seulement signalées quand elles apparaissent en instance. Hover/Active/Disabled des tons Accent et Reversed du Tab ont été vérifiés par échantillon (jetons), pas variante par variante.
