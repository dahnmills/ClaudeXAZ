# Figma : Formats · verticals and blocks (page 1:3)

Fichier `XW7jVtIa6UWRTqKMDqOF5D`, page `1:3` uniquement. Date : 2026-11-20. Rien de publié, aucune librairie modifiée.

## Contenu

Une section Figma par format, empilées verticalement (200 px entre sections), fond `Static/Background/Main/Secondary`.
Chaque section : étiquette « NxM · orientation · usage » (Title/H2), une ligne de description (taille, card, données),
puis la version Normal et la version Highlight côte à côte. Tailles selon la grille du brief (172 px, gouttière 16).

| Section | nodeId | Card (question) | Normal | Highlight |
|---|---|---|---|---|
| 1x2 · vertical · Small list or detailed status | 10:1893 | Overdues, « Any overdue? » : 0 EUR, delta, badge Clean record, oldest, disputes, open items, bande 12 mois, phrase datée | 10:1726 | 10:1814 |
| 1x3 · vertical · List | 10:2198 | Jobs to do, « What to do? » : 6 tâches, barre par priorité + légende, 6 tâches (mocks) avec date et badge, lien « Open all tasks » | 10:1901 | 10:2057 |
| 1x4 · vertical · Timeline | 13:1653 | Newsfeed, « Any news? » : 8 actualités sur 30 jours, barre par tonalité + légende, 7 actualités datées avec badge, lien « Open newsfeed (8) » | 13:1200 | 13:1441 |
| 2x3 · vertical block · Narrow table | 13:1904 | Financials, « Is the buyer financially sound? » : turnover 123 900 000 et delta, 8 agrégats sur 3 exercices (k EUR) avec tendance par ligne, 3 ratios | 13:1661 | 13:1781 |
| 3x2 · horizontal block · Subject analysis | 15:2645 | Grade, « How risky is this buyer? » : Grade A6, delta, Chart 8 mois (échelle inversée), meilleur et pire, 3 derniers changements avec motif, score / tendance / type / date | 15:2351 | 15:2498 |
| 4x2 · horizontal block · Wide table | 15:3163 | Exposure by policy, « Where is our exposure? » : 1 548 000 contre la limite accordée (bullet), 6 polices (exposition, part, limite, utilisation, statut), total | 15:2653 | 15:2921 |
| 3x3 · large square · Full analysis | 17:711 | Exposure, « How much do we carry on this buyer? » : total, delta, bullet, 3 chiffres clés, Chart 8 périodes, barre par police (top 4 + others) et légende en lignes | 17:384 | 17:548 |
| 4x3 · large block · Dossier | 17:1096 | Payment experience, « Does the buyer pay on time? » : 94 % et delta, barre par retard + légende, colonnes mensuelles, faits d'impayés, tableau 12 mois + total | 17:719 | 17:906 |

2x4 : non listé dans le benchmark (« au-delà de 12 cellules », non proposé), donc pas construit.

## Construction

- Cards en auto-layout, cadres custom (assouplissement du 20/11, 10 h 48) : fond, bordure, rayon, padding (M en 1 colonne,
  L au-delà) et gaps tous liés aux variables Semantic ; textes en styles Tokens (Title/H2, Body M/S Regular et Semi Bold).
- Instances de librairie : Badge (icône masquée par `.Content Properties` Icon=False), Link (S, Right, Tone Reversed sur
  marine, glyphe Arrow Right), Button Icon (Plain S, Reversed sur marine, Ellipsis Vertical) pour le menu, Icon Functional
  (Arrow Up / Right, Star Filled), Grade (Automatic 6, M), Chart (Grid=Both, Y axis) dans 3x2 et 3x3.
- Micro-visualisations dessinées (vecteurs et rectangles) : barres empilées, bullet graphs, sparklines par ligne, bande
  12 mois, colonnes mensuelles. Couleurs liées aux variables ; seules les longueurs et positions viennent des données.
- Highlight : fond `Static/Background/Brand`, texte `Static/Text/Subtle/Primary` (blanc), secondaire `Subtle/Secondary`,
  tertiaire `Subtle/Tertiary`, icône étoile « Highlighted » devant le titre, séries en blanc (`Static/Background/Subtle/Primary`).
- Audit par script : aucun contenu ne déborde de sa card (ni en bas, ni à droite), aucun titre sur deux lignes.

## Modernisation et propositions (valeurs sans token adapté)

1. **Rayon des cards** : passé à `Border/Radius/M` (8 px) au lieu de S (4 px). C'est un token existant, mais c'est la
   question 5 du benchmark (décision de design system) : à valider.
2. **Valeur clé à 24 px semi-bold** : aucun style de texte Tokens ne fait 24 semi-bold (Title/H1 est en Regular). Le style
   Title/H2 est posé, avec la taille et l'interligne liés à `Font/Title/Size/M` et `Font/Title/Line Height/M`.
   Proposition : un style « Title/Key value » 24/28 Semi Bold.
3. **Chiffres tabulaires** : l'API Figma ne permet pas d'activer `tnum` par script. À régler dans le style (question 8).
4. **Highlight, couleurs à arbitrer** (pas de token « reversed ») : rails et pistes en `Static/Border/Main/Secondary`
   (grey-700), filets en `Static/Border/Main/Tertiary` (grey-500), grille des Chart surchargée en grey-700 ; segments de
   statut en `Interactive/Background/Strong/Negative/Default` (red-300) et `.../Positive/Default` (green-400) parce que
   les fonds fonctionnels Subtle (050) sont indiscernables entre eux. Ce sont des tokens détournés de leur rôle :
   une tonalité « reversed » de `ds-chart` (question 11) réglerait le sujet.
5. **Épaisseurs** : traits de sparkline 1,5 px et de Chart 2 px, repère du bullet 2 px, hauteur des colonnes mensuelles :
   valeurs de dessin, sans token.

## Doutes

- **Grade** : le topbox des mocks affiche A3, l'historique `gradeData` finit à 6. La card suit l'historique (A6).
- **Données supposées (?)** : motifs des changements de grade, polices et preneurs (numéros, noms, limites par police,
  statuts), exercices 2021 et 2022 et les agrégats autres que turnover / pre-tax profit / cashflow (le texte de la card le
  dit), actualités autres que JP Morgan, tableau mensuel de paiement, délai moyen, delta « +2 pts », « +17,6 % vs May 24 »
  (déduit de la tendance des mocks).
- **Formats** : 3x2 et 4x2 sont des « blocs » dans le benchmark, donc posés ici ; 3x3 (« grand carré ») est posé ici
  comme demandé. Possible doublon avec la page 1:2 à vérifier.
- **Remplissage** : 1x4 (55 px libres), 2x3 (40 px) et le bas de 4x3 (environ 100 px dans les deux colonnes) gardent du
  vide sans rien de coupé ; on peut ajouter une 8e actualité en 1x4 si on raccourcit les titres.
- Titres des cards en 1 colonne raccourcis (« What to do? », « Any news? ») pour tenir sur une ligne avec l'étoile.
