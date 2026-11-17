# Why Qirin (vitrine ZeroHeight, essai)

Public : équipes produit (designers, développeurs, PO). Page masquée tant que l'utilisateur n'a pas validé.
Ton : sobre, fiable, dense (PRODUCT.md). Pas de dégradé décoratif, pas de chiffre héros géant, pas de surtitre en
capitales sur chaque section, pas d'emoji. Anglais, comme le reste du styleguide. Aucun tiret cadratin.

Visuels (Figma, vrais composants et tokens, export PNG x2, largeur 1280) : V1 à V4 ci-dessous.

---

## [V1] Bannière d'ouverture

Titre : **Build Qirin screens faster, and get them right the first time.**
Sous-titre : One design system for the credit workspace: the same components in Figma and in code, driven by the same tokens.
Visuel : une composition de vrais composants (en-tête de page, carte, tableau dense, boutons, badges de statut), cadrée
comme un écran Qirin réel mais générique (aucune donnée de feature identifiable).

Boutons (liens) : **Open the Figma libraries** · **Browse Storybook** · **Get started**

## What you get

Trois cartes côte à côte (bloc cartes ZH), une phrase chacune :

- **Design and code match.** Every Figma component has its Angular twin with the same name, the same variants and the
  same states. What you hand off is what ships.
- **Change once, update everywhere.** Colors, spacing, radius and type come from tokens. Update a token or an atom and
  every screen that uses it follows.
- **Accessible by default.** WCAG AA contrast, visible focus, keyboard support, and status that never relies on color
  alone. You inherit it instead of rebuilding it.

## [V2] What's inside

Une ligne de faits, en texte normal (pas de chiffres géants) :
106 library components in 5 Figma libraries (Action, Data Entry, Data Display, Feedback, Layout), about 380 semantic
tokens on top of a foundation palette, Storybook and usage guidelines for every component.

Visuel : planche des 5 familles, une tuile par librairie avec 3 ou 4 vrais composants représentatifs et le nom de la
famille. Chaque tuile renvoie à la page d'accueil de la famille dans ZH.

## Built for dense, serious screens

Paragraphe court :
Qirin screens show a lot of data to experts who decide fast. The system is tuned for that: compact tables,
readable status, clear hierarchy, and one primary action per area. It favours clarity over decoration.

[V3] Visuel : avant / après sur un même bloc générique (une rangée d'actions et un tableau), à gauche bricolé à la
main (couleurs proches mais fausses, deux boutons primaires, statut en couleur seule), à droite composé avec Qirin.
Légendes : « Hand-made » / « With Qirin ».

## Get started

Deux colonnes :

**Designers**
1. Enable the Qirin libraries in your Figma file (Assets > Libraries).
2. Start from Layout: page header, side navigation, grid.
3. Pick components, keep their properties, avoid detaching.

**Developers**
1. Import from `shared/ui` (standalone Angular components, signal inputs).
2. Use semantic tokens (`--semantic-*`), never raw values.
3. Check the component in Storybook before writing your own.

## [V4] Bandeau de fin

Phrase : **Missing something? Ask before you build it.**
Sous-texte : New needs feed the system: tell us and we will add or extend a component, so the next team gets it for free.
Contact : mail qirin_design@allianz-trade.com (décision utilisateur 2026-11-17 : un mail, pas de lien de page).

---

## Liens à confirmer

- Storybook : https://dahnmills.github.io/ClaudeXAZ/storybook/
- Figma : librairies Action `xCeEJPn6fliEshuE9fnrqs`, Data Entry `1wVY9FfjONIX6us9JmIm7U`, Data Display
  `VpConH5AUGyCqtp8PMqj1i`, Feedback `fH3vmSNZR8r0sU3kN455CD`, Layout `bbgSPUChd18EVNGijjoZGn`
- Contact de l'équipe design system : qirin_design@allianz-trade.com
