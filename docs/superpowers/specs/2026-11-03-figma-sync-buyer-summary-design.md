# Synchroniser Buyer Summary dans Figma

Date : 2026-11-03
Statut : proposition, à valider par l'utilisateur
Suite de : `2026-11-03-figma-sync-search-design.md` (même gabarit, mêmes règles)

## Intention

Deuxième fichier de la synchro prototype → Figma : la page Buyer Summary
(`src/app/pages/buyer-summary/`, `main`). Même exigence que la Search : vrais
composants et vrais tokens Qirin, fichier propre et livrable, nouveaux composants
ajoutés aux librairies et repérables `🆕`.

## Ce qui ne change pas (repris de la Search)

- Fichier `Qirin · Buyer Summary` dans le dossier `683452905`, pages Cover, Changelog,
  Overview, Screens, States & edge cases, Specs, Local components.
- Composants de `shared/ui` absents → librairies Qirin (Data Display, Data Entry…),
  page `🆕 <Nom>`, pastilles Design New / Tech In code, description `New · 2026-11 · …`.
  Composants propres à la page → composants locaux du fichier.
- Captures de référence de l'app sur un serveur dédié, audit de liaison, comparaison
  visuelle, contrôle de débordement et de chevauchement (annotations comprises).
- Publication manuelle par l'utilisateur entre les composants et les écrans.

## Règles propres à Buyer Summary (mémoire du film, 2026-10-16)

- La topbox est globale : elle est dessinée dans le shell, mais n'est pas présentée
  comme une fonction de la page (Overview et Specs n'en parlent pas).
- Les trois boards par défaut sont montrés : Common, Credit Assessment, Credit
  Underwriting (`DEFAULT_BOARDS`).
- Un board personnalisé tient sur 2 lignes (8 unités sur une grille de 4) : aucun
  écran, ni état intermédiaire, ne montre une 3e ligne.
- Le card builder (création de card custom) est hors périmètre : seule la
  personnalisation du board est dessinée.

## Inventaire des composants

Présents en librairie : Topbox, Page Header, Breadcrumb, Card, Modal, Drawer
(Layout), Dropdown (Select), Input Text, Input Search, Text Area, Button, Button Icon,
Flyout Menu, Divider, Skeleton Item, Properties Panel (🆕).

Absents, à créer (à confirmer composant par composant au moment de construire) :

| Composant code | Librairie cible |
|----------------|-----------------|
| `ds-widget-card` (card de board : titre, actions, contenu) | Data Display |
| `ds-chart` (barres / lignes des cards Exposure, Payment history…) | Data Display |
| `ds-list-widget` (liste dans une card : Jobs to do, Overdues…) | Data Display |
| `ds-newsfeed` (card Newsfeed) | Data Display |
| `ds-grid-selection` (choix d'une grille de board) | Data Entry |
| Contenus des 12 types de cards (Grade, Exposure, Risk figures, Limit, Overdues, Payment history, Score, Coverage, Financials, Notepad, Jobs to do, Newsfeed) | composants locaux du fichier, construits avec les composants ci-dessus |

## Écrans proposés (~12)

- **Boards par défaut** : Common, Credit Assessment, Credit Underwriting (une page
  chacun, données du mock), plus le chargement (skeletons).
- **Gérer ses boards** : sélecteur de board ouvert, drawer Manage boards (liste,
  Default, board courant coché, renommage en ligne).
- **Créer un board** : choix de la grille (Grid selection), board vide avec ses
  cases, drawer du catalogue de cards, board rempli avec la barre flottante Save
  board, board enregistré et renommé (« Risk review », comme dans la visite guidée).
- **Détail** : modale Full properties.
- **États** : abandon des modifications (confirmation), card en chargement, cases vides.

## Non-objectifs

- Card builder et page `card-builder-lab`.
- Visite guidée (walkthrough) : non dessinée, citée dans les Specs.
- Topbox présentée comme une fonction de la page.

## Laissé au builder

Découpage des variantes, ordre de construction, mise en page de la couverture et de
l'Overview.
