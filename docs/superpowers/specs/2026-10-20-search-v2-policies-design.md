# Search V2 : Buyers et Policies dans une même barre

Date : 2026-10-20
Statut : design validé en conversation, spec à relire

## Intention

Dupliquer la page Search actuelle en « Search V2 », sans rien modifier de la V1, et y ajouter
la recherche de **Policies** à côté de celle des **Buyers**. Les deux objets sont très
différents : la barre de recherche se conditionne selon l'objet choisi.

Référence métier : l'écran Policies du Qirin actuel, avec deux modes.

- **Open policy** : BU code (obligatoire), Policy number, Extension, bouton Open.
- **Global search** : BU code (optionnel), texte libre, Search in (Policies | Drafts),
  Policies status (multi : Issued, Cancelled, Expired ; Issued par défaut).

### Critères de réussite

- `/search` (V1) strictement inchangée : aucun fichier de `pages/search/`, ni
  `ds-search-bar-multi`, ni `ds-more-criteria`, ni leurs stores ne sont modifiés.
- `/search-v2` reproduit la recherche Buyers à l'identique et ajoute Policies.
- Le parcours Policies complet est démontrable : chercher, filtrer, ouvrir, étoiler,
  retrouver dans Recent search / Recently viewed / Favorites, rejouer une recherche.

## Décisions validées

| Sujet | Décision |
|-------|----------|
| Bascule Buyers / Policies | Premier slot de la barre (dropdown objet) |
| Barre Policies | `Policies ▾ \| BU code ▾ \| Policy number or keyword` + More criteria + Search |
| More criteria Policies | Search in, Status, Extension |
| Deux modes Qirin | Fusionnés : un n° exact + BU donne directement la police, sinon recherche globale |
| Résultat Policy | Carte dédiée calquée sur `ds-result-card` ; Open = toast (pas de page Police) |
| Onglets Recent / Viewed / Favorites | Communs aux deux objets, filtre All / Buyers / Policies, All groupé par objet, chaque carte garde son rendu |
| Construction de la barre | Nouvelle molécule `ds-search-bar-scoped`, composée des mêmes atomes que `ds-search-bar-multi` |

## Architecture

### Fichiers créés

```
src/app/pages/search-v2/
├── search-v2.component.ts|html|scss     # copie de pages/search, étendue
├── search-v2.stories.ts
├── policies.mock.ts                      # policies + drafts mock
├── search-v2-recents.store.ts            # recherches récentes V2 (buyer | policy)
├── search-v2-viewed.store.ts             # policies consultées (les buyers lisent ViewedBuyersStore)
└── components/
    └── recent-search-v2-card.component.* # copie de recent-search-card + variante Policy

src/app/shared/ui/
├── search-bar-scoped/                    # barre à objet (Buyers | Policies)
├── policy-criteria/                      # panneau More criteria version Policies
└── policy-result-card/                   # carte de résultat Policy
```

### Fichiers modifiés (hors V1)

- `src/app/app.routes.ts` : ajout `{ path: 'search-v2', component: SearchV2Component }` dans
  `PROTO_PAGES`.
- `src/app/user-testing/screens.data.ts` : entrée « Search V2 » (hint « Buyers and policies »).
- `src/app/shared/ui/index.ts` : export des trois nouveaux composants.

Le wizard `company-creation-wizard` est **importé** depuis `pages/search/`, pas copié : il
n'est pas modifié, la V2 le consomme tel quel. `ViewedBuyersStore` et `BuyerSummaryStore` sont
partagés pour les buyers (ouvrir un buyer depuis la V2 alimente le même historique, c'est le
même buyer summary).

### `ds-search-bar-scoped`

Molécule. Compose `ds-standalone-dropdown`, `ds-flyout-menu`, `ds-flyout-menu-item`,
`ds-flag`, `ds-divider`, `ds-button`, `ds-button-icon`, `ds-input-search`, `dsTooltip`. Aucun
natif interactif.

```ts
export type SearchScope = 'buyers' | 'policies';

scope    = model<SearchScope>('buyers');
// Buyers : mêmes modèles que ds-search-bar-multi
type     = model<SearchType>('company-id');
country  = model<FlagCode | null>(null);
idType   = model<IdTypeOption | null>(null);
// Policies
buCode   = model<string | null>(null);     // null = All BUs
// Commun
query         = model<string>('');
criteriaCount = input<number>(0);
searchClicked       = output<void>();
moreCriteriaClicked = output<void>();
```

- Slot 1 : objet (`Buyers` icône `user`, `Policies` icône `document` ou équivalent du registry).
- `scope === 'buyers'` : slots, validations et placeholders repris de `ds-search-bar-multi`
  (logique copiée ; types `SearchType`, `IdTypeOption`, constantes `SEARCH_TYPES`, `COUNTRIES`,
  `ID_TYPES` **importés** depuis `search-bar-multi`, pas redéclarés).
- `scope === 'policies'` : slot BU code (libellé « All BUs » quand null), flyout avec un
  `ds-input-search` en tête qui filtre la liste, puis le champ « Policy number or keyword ».
  Aucune erreur bloquante : le BU est optionnel.
- Changer de scope vide `query` et ferme les flyouts ; le parent vide les critères de l'objet
  quitté.
- Entrée dans le champ = `searchClicked`.

### `ds-policy-criteria`

Même coque visuelle que `ds-more-criteria` (en-tête Reset + Close, divider, corps), styles
propres au composant, mêmes tokens.

```ts
export interface PolicyCriteriaValues {
  searchIn: 'policies' | 'drafts';
  statuses: PolicyStatus[];     // 'issued' | 'cancelled' | 'expired'
  extension: string;
}
export function defaultPolicyCriteria(): PolicyCriteriaValues  // { 'policies', ['issued'], '' }
export function policyCriteriaCount(v): number                  // statuts + extension renseignée + (searchIn === 'drafts')
value  = model<PolicyCriteriaValues>(defaultPolicyCriteria());
closed = output<void>();
```

- Search in : `ds-segmented-control mode="radio"`.
- Status : `ds-tag` type filter, un par statut. Désactivés quand `searchIn === 'drafts'`, raison
  annoncée via `describedBy` : « Drafts have no status yet ».
- Extension : `ds-input-text`, libellé semi-bold sur une ligne (règle formulaires).
- Reset : revient à `defaultPolicyCriteria()`.

### `ds-policy-result-card`

Calquée sur `ds-result-card` (même enveloppe `ds-card`, même rangée d'actions, même dépliage).

```ts
export interface PolicyResultData {
  policyNumber: string;
  extension: string;          // '00', '01'…
  kind: 'policy' | 'draft';
  status: PolicyStatus | null; // null pour un draft
  policyholder: string;
  buCode: string;             // libellé BU, ex. 'AT USA'
  effectiveDate: string;
  expiryDate: string;
  details?: { label: string; value: string }[]; // montant couvert, devise, nb de buyers
}
data = input.required<PolicyResultData>();
open = input<boolean>(false);
favorited = input<boolean>(false);
toggled = output<void>(); starred = output<void>(); opened = output<void>();
```

- Fermée : `Policy {n°}-{ext}` (ou `Draft {n°}`), `ds-badge` de statut
  (Issued → success, Cancelled → error, Expired → neutral, Draft → info), policyholder · BU,
  période `effective → expiry`, étoile, chevron, `Open`.
- Dépliée : `ds-properties-panel` des `details`.

## Comportement

### Changement d'objet

Slot 1 Buyers ↔ Policies : la saisie et les critères de l'objet quitté sont vidés,
`hasSearched` repasse à false (« Start your search above »), le panneau More criteria se ferme.
Le bouton More criteria ouvre le panneau de l'objet courant.

### Recherche Policies

Au clic Search (ou Entrée), sur le jeu `policies.mock.ts` :

1. Source : `searchIn` (policies ou drafts, exclusif).
2. BU : filtré si `buCode` non null.
3. Statut : policies seulement, statut ∈ `statuses` (aucun statut coché = tous).
4. Extension : égalité si renseignée.
5. Saisie :
   - **Correspondance exacte** sur le n° de police (après filtres 1 à 4) avec un BU choisi :
     un seul résultat, déplié d'office. C'est l'ancien « Open policy ».
   - Sinon : recherche partielle, insensible à la casse, sur n°, policyholder.
   - Saisie vide : tout ce que les filtres laissent passer.

Compteur « N results », pagination au scroll identique aux buyers.

### Actions sur une Policy

- **Open** : toast info « Policy page coming soon » ; la policy entre dans Recently viewed.
- **Étoile** : entre / sort de Favorites.

### Onglets

- **Recent search** : chaque recherche est enregistrée avec `kind: 'buyer' | 'policy'` et tous
  ses critères ; une recherche identique remonte en tête au lieu d'être dupliquée (même règle
  que V1). La carte récente Policy affiche BU, saisie, Search in, statuts, extension. Rejouer
  remet la barre sur le bon objet, recharge les critères et relance.
- **Recently viewed** : buyers (via `ViewedBuyersStore`) et policies (via
  `SearchV2ViewedStore`) fusionnés par date de consultation, du plus récent au plus ancien.
- **Favorites** : buyers et policies, chaque carte avec son composant.
- Compteurs d'onglet : total buyers + policies.

### Filtre par objet dans les historiques

Dans Recent search, Recently viewed et Favorites, l'en-tête de liste porte à gauche un
`ds-segmented-control` `mode="tabs"` (bascule de vue) : **All (n) · Buyers (n) · Policies (n)**,
et à droite le bouton Clear.

- Tri : toujours du plus récent au plus ancien.
- **All** : deux sections groupées, « Buyers » puis « Policies », chacune avec en-tête et
  compteur, triées par date à l'intérieur. Une section vide n'est pas affichée.
- **Buyers** / **Policies** : la seule liste de l'objet, sans en-tête de section.
- Un seul filtre, partagé par les trois onglets (signal de page `historyFilter`), défaut All.
- Clear suit le filtre : « Clear all » en All, « Clear buyers » / « Clear policies » sinon. On
  n'efface jamais ce qui n'est pas affiché.
- Catégorie à 0 : l'option reste sélectionnable et affiche un état vide dédié (« No policy
  search yet », « No policy viewed yet », « No favorite policy yet », et leurs équivalents
  buyers).
- Les stores exposent `clear(kind?: 'buyer' | 'policy')`. Pour Recently viewed côté buyers,
  `ViewedBuyersStore.clear()` existe déjà et n'est pas modifié : « Clear buyers » l'appelle.

### Buyers

Identique à la V1 : filtre exact par Company ID, partiel sinon, création avec confirmation,
wizard de création manuelle, ouverture vers `/buyer-summary/:id`, chargement au scroll.

## Données mock

- 5 BU : AT USA, AT UK, AT Belgium, AT Brazil, Acredia (liste du flyout BU, triée).
- ~15 policies réparties sur ces BU et les 3 statuts, extensions `00` à `02`, policyholders
  repris des buyers du mock V1 (Brooklyn Craft Goods LLC, Atlantic Seafood Imports Inc,
  Northwind Trading Ltd…).
- 4 drafts sans statut.

## Cas limites

| Cas | Comportement |
|-----|--------------|
| Aucun résultat Policies | « No policy found for your search », pas de CTA de création |
| Drafts sélectionné | Status désactivé avec raison annoncée, ignoré par le filtre |
| Statut par défaut | Issued : compteur More criteria à (1) dès l'arrivée, Reset y revient |
| Policy hors du jeu courant dans Viewed / Favorites | La carte s'affiche depuis les données du store |
| BU non choisi + n° exact | Pas de dépliage d'office : recherche globale normale |

## Hors périmètre

- Page de détail d'une Policy.
- Toute modification de `/search` V1 et de ses composants.
- Entrée topbox / raccourci clavier vers la V2 (le raccourci `alt+4` reste sur `/search`).

## Vérification

- `ng build` sans erreur ; stories Storybook pour les trois nouveaux composants et la page.
- `git diff` sur `src/app/pages/search/`, `shared/ui/search-bar-multi/`,
  `shared/ui/more-criteria/` : vide.
- Parcours manuel dans le navigateur : les cas du tableau ci-dessus et le rejeu d'une recherche
  Policy depuis Recent search.
