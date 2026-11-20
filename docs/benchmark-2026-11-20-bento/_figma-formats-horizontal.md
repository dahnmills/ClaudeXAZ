# Figma : Formats · squares and horizontals (2026-11-20)

Fichier `XW7jVtIa6UWRTqKMDqOF5D`, page `1:2`. Rien touché ailleurs, aucune librairie modifiée, rien publié.

## Structure

Cadre racine `8:11264` « Formats · squares and horizontals » (auto-layout vertical, fond Static/Background/Main/Secondary,
padding et écart Spacing/3XL), en x = 0, y = 0, 2400 x 3512. Une section par format, chacune : étiquette
« NxM · orientation · usage », ligne de méta (taille, exemple, capacité, repli, highlight, valeurs supposées), puis les
versions Normal et Highlight côte à côte.

| Section | nodeId | Card normale | Card highlight | Exemple |
|---|---|---|---|---|
| Intro | `8:11265` | | | |
| 1x1 · square | `8:11268` | `8:11276` | `8:11332` | Score : 82 / 100, delta stable, sparkline 8 points, date de mise à jour |
| 2x1 · horizontal | `10:1250` | `10:1258` | `10:1355` | Payment behaviour : 94 %, barre empilée 94 / 6 / 0 avec légende, overdue, oldest, disputes |
| 3x1 · horizontal | `10:1449` | `10:1457` | `10:1562` | Exposure : 1 548 000, bullet utilisé / accordé (31 %), granted / used / available, tendance 8 points, highest limit, nombre de limites |
| 4x1 · horizontal | `12:1443` | `12:1451` | `12:1564` | Limit and coverage : cover requested, cover granted, décision Approved, granted limit + bullet, used / available |
| 6x1 · full width | `12:1666` | `12:1674` | `12:1820` | Risk at a glance : grade, exposition, payé à l'heure, overdue, score, décision, chacun avec sa micro-viz |
| 2x2 · square | `15:1446` | `15:1454` | `15:1595` | Coverage : accordé / demandé + bullet, décision, historique de 3 décisions, lien |
| 3x2 · horizontal block | `15:1718` | `15:1726` | `15:1888` | Grade : grade A6 + delta, score + bullet, 4 derniers changements, graphique 8 mois (Y inversé, 1 en haut) |
| 4x2 · horizontal block | `16:822` | `16:830` | `16:1153` | Exposure by policy : total + KPI, tableau de 6 polices (statut, encours, part, limite, utilisé), ligne de total |

3x3 et 4x3 ne sont pas sur cette page (ils sont faits par un autre agent).

## Construction

- Chaque card est une instance de **Widget Card** (Data Display, `987bbbe7…`), Header=False, Button=True (menu ellipsis
  en Button Icon S, Reversed=True en highlight) ; le contenu va dans le slot, en auto-layout. Tailles de la grille :
  N x 172 + (N - 1) x 16. Padding Spacing/M (cards d'une rangée ou d'une colonne), Spacing/L (blocs).
- Instances : Grade (A6), Badge (Approved, Partly approved, Issued, Expiring, sans icône comme `ds-badge` par défaut),
  Link (View all decisions, Reversed en highlight), Icon Functional + glyphes NDBX (Star Filled, Arrow Up, Arrow Right).
- Micro-visualisations en custom (assouplissement du 2026-11-20) : sparklines, bullet graphs, barres empilées, graphique
  de grade, filets. Couleurs, espacements, rayons et textes tous liés aux variables Semantic et aux styles Tokens.
- Highlight : fond Static/Background/Brand, bordure Static/Border/Brand, textes Static/Text/Subtle/Primary (blanc),
  Subtle/Secondary (grey-050), Subtle/Tertiary (grey-200), courbes et mesures en blanc, étoile pleine devant le titre,
  icône du menu en Static/Icon/Subtle/Primary.
- Contrôle par script : aucun texte ni graphique ne sort du padding de sa card, aucun libellé sur deux lignes, rien de
  coupé en bas. Seul contact restant : la barre empilée du 2x1 touche le bas de la zone de 32 px du bouton menu (le
  glyphe est centré, rien ne se recouvre à l'œil).

## Modernisation (propositions, à valider)

- **Rayon des cards Border/Radius/M (8 px)** au lieu de S (4 px) : surcharge sur les instances, la librairie reste en S.
  C'est la question 5 du benchmark, une décision de design system.
- **Barres en pilule** (Border/Radius/Round) pour les bullets, barres empilées et pastilles de légende.
- **Valeur clé des blocs 2x2 et 4x2 en Title/H1 (24 px Regular)** ; ailleurs Title/H2 (20 px SemiBold). Le benchmark
  demande 24 px semi-bold (1x1 à 3x1) et 28 px dans les blocs : **ces styles n'existent pas dans Tokens**, à créer si
  retenu.
- **Couleurs reversed des graphiques** : piste et filets du highlight en `Static/Text/Main/Alt/Secondary` (blue-a-600),
  mesure en `Static/Background/Subtle/Primary` (blanc). Un token de texte sert ici de fond : il faudrait des tokens
  `chart reversed` (question 11 du benchmark). Les filets du highlight ne prennent pas `static-border-subtle-tertiary`
  (grey-200, trop dur sur marine) comme le dit le benchmark : proposition à trancher.
- Pas de style de texte à chiffres tabulaires (`tnum`) dans Figma : alignement à droite seulement.

## Valeurs supposées (absentes des mocks)

Delta du score « vs Oct 24 » et son historique 8 points ; fenêtre « Last 12 months » ; tendance d'exposition traduite en
« Rising since May 23 » ; dates « Requested 04 Nov 2024 » et « Valid until 11 Nov 2025 » ; auteur « Credit analyst » et
historique des décisions (02 May 2024 Partly approved 1 500 000, 14 Nov 2023 Approved 1 500 000) ; motifs des
changements de grade (Payment delays, Accounts filed, Annual review, Press alert) ; les 6 polices (numéros, encours qui
totalisent 1 548 000, limites qui totalisent 5 000 000, statuts dont un Expiring). Grade A6 et ses changements viennent
de `gradeData` et `MONTHS`.

## Doutes

- 3x1 : le benchmark compare l'exposition à la plus haute limite (10 000 246 000) ; à cette échelle la barre serait
  invisible, le bullet compare donc l'utilisé à la limite accordée et la plus haute limite reste un fait.
- Hausse du grade (5 vers 6) colorée en négatif : à confirmer (1 = meilleur, d'où l'axe inversé).
- 6x1 et 4x2 en highlight : déconseillés par le benchmark, montrés pour comparer et étiquetés comme tels.
- Titres-questions courts en 1x1 (« Score stable? ») à cause de la largeur utile de 116 px à côté du menu.
