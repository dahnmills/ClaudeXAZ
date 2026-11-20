# Figma : Formats · verticals and blocks (page 1:3)

Fichier `XW7jVtIa6UWRTqKMDqOF5D`, page `1:3` uniquement. Date : 2026-11-20. Rien de publié, aucune librairie modifiée.

## Contenu

Une section Figma par format, empilées verticalement (200 px entre sections), fond `Static/Background/Main/Secondary`.
Chaque section : étiquette « NxM · orientation · usage » (Title/H2), une ligne de description (taille, card, données),
puis la version Normal et la version Highlight côte à côte. Tailles selon la grille du brief (172 px, gouttière 16).

Données alignées sur `src/app/pages/buyer-summary-v2/buyer-summary-v2.data.ts` (devise USD, grade A3, tâches, actualités,
financials, polices, tendance d'exposition, titres des cards de bloc repris de `KINDS`).

| Section | nodeId | Card (question) | Normal | Highlight |
|---|---|---|---|---|
| 1x2 · vertical · Small list or detailed status | 10:1893 | Overdues, « Any overdue? » : 0 USD, delta, badge Clean record, oldest, disputes, open items, bande 12 mois, phrase datée | 10:1726 | 10:1814 |
| 1x3 · vertical · List | 25:3331 | Jobs to do, « What to do? » : 6 tâches, barre par priorité (2 / 2 / 2) + légende, 5 tâches les plus proches (`JOBS`) avec échéance et badge, lien « Open all tasks (6) » | 25:2979 | 25:3163 |
| 1x4 · vertical · Timeline | 25:3674 | Newsfeed, « Any news? » : 6 actualités depuis Aug 24, barre par tonalité (3 / 2 / 1) + légende, 5 dernières (`NEWS`) avec date, badge et source, lien « Open newsfeed (6) » | 25:3339 | 25:3505 |
| 2x3 · vertical block · Narrow table | 26:4739 | Financials, « Is the company financially sound? » : turnover 123 900 USD k et +4,6 %, 7 agrégats `FINANCIALS` sur FY 2023 / 2022 / 2021 avec variation, colonnes turnover 2019 à 2023 (`TURNOVER_TREND`), définition du gearing | 26:4510 | 26:4625 |
| 3x2 · horizontal block · Subject analysis | 26:5026 | Grade, « How risky is this buyer? » : Grade A3, « -1 vs May 24, risk down (A4 to A3) », Chart `GRADE_HISTORY` (échelle inversée), meilleur A3 / pire A5, 3 derniers changements `GRADE_CHANGES`, score / tendance / type / date | 26:4747 | 26:4885 |
| 4x2 · horizontal block · Wide table | 27:998 | Policies, « Which policies carry the exposure? » : 1 548 000 USD contre la limite accordée (bullet), 6 polices `POLICIES` (exposition, part, limite, utilisation, statut), total | 27:479 | 27:755 |
| 3x3 · large square · Full analysis | 27:1327 | Exposure, « How much are we exposed? » : total, +17,6 %, bullet, 3 chiffres clés, Chart `EXPOSURE_TREND`, barre par police (top 4 + others) et légende en lignes | 27:1006 | 27:1165 |
| 4x3 · large block · Dossier | 17:1096 | Payment experience, « Does the buyer pay on time? » : 94 % et delta, barre `PAYMENT_BANDS` + légende, colonnes mensuelles, faits d'impayés, meilleur et pire mois, lecture en une phrase, tableau 12 mois + total (USD k) | 17:719 | 17:906 |

2x4 : non listé dans le benchmark (« au-delà de 12 cellules », non proposé), donc pas construit.

## Construction

- Cards en auto-layout, cadres custom (assouplissement du 20/11, 10 h 48) : fond, bordure, rayon, padding (M en 1 colonne,
  L au-delà) et gaps tous liés aux variables Semantic ; textes en styles Tokens (Title/H2, Body M/S Regular et Semi Bold).
- Instances de librairie : Badge (icône masquée par `.Content Properties` Icon=False), Link (S, Right, Tone Reversed sur
  marine, glyphe Arrow Right), Button Icon (Plain S, Reversed sur marine, Ellipsis Vertical) pour le menu, Icon Functional
  (Arrow Up / Down / Right, Star Filled), Grade (Automatic 3, M), Chart (Grid=Both, Y axis) dans 3x2 et 3x3.
- Micro-visualisations dessinées (vecteurs et rectangles) : barres empilées, bullet graphs, bande 12 mois, colonnes
  mensuelles et annuelles. Couleurs liées aux variables ; seules les longueurs et positions viennent des données.
- Highlight : fond `Static/Background/Brand`, texte `Static/Text/Subtle/Primary` (blanc), secondaire `Subtle/Secondary`,
  tertiaire `Subtle/Tertiary`, icône étoile « Highlighted » devant le titre, séries en blanc (`Static/Background/Subtle/Primary`).
- Audit par script (après la dernière modification) : aucun contenu ne déborde de sa card (ni en bas, ni à droite),
  aucun titre sur deux lignes ; contrôle visuel par capture de chaque section.
- Vides comblés avec de l'information : 1x4 (sources, une actualité plus longue, plus que 34 px libres), 2x3 (turnover sur
  5 ans, définition du gearing, 28 px libres), 4x3 (meilleur et pire mois, lecture en une phrase, tableau réparti sur la
  hauteur, 5 px libres). 1x3 garde 44 px : une 6e tâche sur deux lignes n'y tient pas.

## Modernisation et propositions (valeurs sans token adapté)

1. **Rayon des cards** : `Border/Radius/M` (8 px) au lieu de S (4 px). Token existant, mais c'est la question 5 du
   benchmark (décision de design system) : **proposition**, à valider.
2. **Valeur clé à 24 px semi-bold** : aucun style de texte Tokens ne fait 24 semi-bold (Title/H1 est en Regular). Le style
   Title/H2 est posé, avec la taille et l'interligne liés à `Font/Title/Size/M` et `Font/Title/Line Height/M`.
   Proposition : un style « Title/Key value » 24/28 Semi Bold.
3. **Chiffres tabulaires** : l'API Figma ne permet pas d'activer `tnum` par script. À régler dans le style (question 8).
4. **Highlight, couleurs à arbitrer** (pas de token « reversed ») : rails et pistes en `Static/Border/Main/Secondary`
   (grey-700), filets en `Static/Border/Main/Tertiary` (grey-500), grille des Chart surchargée en grey-700 ; segments de
   statut en `Interactive/Background/Strong/Negative/Default` (red-300) et `.../Positive/Default` (green-400) parce que
   les fonds fonctionnels Subtle (050) sont indiscernables entre eux. Tokens détournés de leur rôle : une tonalité
   « reversed » de `ds-chart` (question 11) réglerait le sujet.
5. **Épaisseurs et hauteurs de dessin** : traits de Chart 2 px, colonnes mensuelles et annuelles : valeurs de dessin,
   sans token.

## Doutes

- **Hors fichier data (supposé)** : 1x2 « No change vs Oct 24 » et bande 12 mois ; 4x3 tableau mensuel, colonnes,
  délai moyen 4 jours, « +2 pts », meilleur et pire mois ; 3x3 « +17,6 % vs May 24 » (déduit de `EXPOSURE_TREND`).
- Le fichier data compte 6 tâches et 6 actualités : les cards 1 colonne en montrent 5 avec un lien vers la liste complète.
- Dates du Newsfeed en « 11 Nov 24 » (au lieu de « 11 Nov 2024 ») pour tenir sur une ligne à côté du badge.
- **Formats** : 3x2 et 4x2 sont des « blocs » dans le benchmark, donc posés ici ; 3x3 (« grand carré ») est posé ici
  comme demandé. Possible doublon avec la page 1:2 à vérifier.
- Titres des cards en 1 colonne raccourcis (« Any overdue? », « What to do? », « Any news? ») : ceux de `KINDS` ne tiennent
  pas sur une ligne avec l'étoile et le menu dans 140 px utiles.
