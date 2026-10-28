# Search V2 : résultats Policies après la réunion du 27 octobre

Date : 2026-10-28
Statut : design validé en conversation, spec à relire
Suite de : `2026-10-20-search-v2-policies-design.md`

## Intention

La V2 Policies a été construite avant une démo métier de l'ancienne search Policies de
Qirin (réunion du 2026-10-27, transcript `2026-10-27_14-32-01_YouTube_1080p_fra.txt`).
La réunion a fixé ce qu'est une police, ce qu'on cherche et ce qu'il faut voir dans un
résultat. Le constat : le défi est l'affichage, pas la mécanique. L'ancienne search montre
à peine 4 résultats à l'écran, il faut densifier comme la search buyer.

Ce chantier aligne la V2 sur la réunion : modèle de données, barre, moteur de recherche
mock et carte de résultat (police et draft).

### Critères de réussite

- Une recherche Policies se fait en un seul mode (l'ex Global search), Issued par défaut.
- La carte police et la carte draft affichent en première lecture ce que la réunion juge
  important, le reste au dépliage, sur la même hauteur que la carte buyer.
- Le texte libre retrouve une police par nom de police, assuré, broker, n° partiel ou
  Company ID exact.
- Recent search, Recently viewed et Favorites continuent de marcher pour les policies.
- `/search` (V1) reste strictement inchangée, comme dans la spec précédente.

## Règles métier (réunion)

- Clé d'une police : BU + Policy Number + Extension, en texte. `001`, `01` et `1` sont trois
  clés différentes. Un même n° peut exister dans deux BU.
- Un draft s'identifie par BU + n° de draft (`D…` dans la nouvelle nomenclature, `C…`
  dans l'existant) + un suffixe que Qirin affiche `000`, `002`… (extension ou version,
  non tranché). Il passe par une étape APP (applicant), puis par N versions NBI (Non
  Binding Indication), jusqu'à 50. Chaque version a un statut (Issued, Inactive, Pending,
  Returned, Aborted, Cancelled, Transformed). « Applicant » est l'étape, pas un statut :
  dans Qirin une APP peut être Issued.
- Un draft porte les mêmes champs qu'une police : produit, segment, LOB, In Force BU,
  pays / PH company ID, inception, expiration (capture de l'existant, 2026-10-28).
- Les utilisateurs cherchent le draft, pas une version : « je veux la draft, c'est un
  sous-détail ». Ce qui compte : savoir si le prospect en est à APP ou à NBI, et le statut.
- Polices et drafts ne se mélangent jamais dans une même liste (Compass ne sait pas).
- Inforce BU (porteur du risque) = BU de la police dans ~95 % des cas, en voie de
  disparition avec Compass : donnée secondaire.
- Segment et LOB n'existent que pour les polices passées dans Compass.
- Une police approche de son renouvellement dans le mois qui précède la next renewal date :
  l'ancienne search pose alors un picto d'alerte (traduit ici par 30 jours).

## Décisions validées

| Sujet | Décision |
|-------|----------|
| Open policy | Sort de la search (« c'est pas de la search »). Pas de nouvelle place pour l'instant, la page Policy est hors périmètre |
| Forme de la carte | Carte sur 2 lignes, même famille et même hauteur que la carte buyer, dépliable (option A de la maquette) |
| Contenu de la carte police | Celui de la réunion : clé + nom de police, statut, produit, next renewal en première lecture ; le reste au dépliage |
| Drafts | Une carte par draft. Aucune liste de versions, ni à plat ni au dépliage |
| Statut par défaut | Issued seul |

## Ce qui change

### 1. Modèle (`shared/ui/policy-result-card/policy.model.ts`)

`PolicyResultData` devient :

| Champ | Police | Draft | Notes |
|-------|--------|-------|-------|
| `id` | `POL/{bu}/{n°}/{ext}` | `DFT/{bu}/{n°}/{suffixe}` | Inclut la BU : plus de collision dans les favoris ou l'historique |
| `kind` | `'policy'` | `'draft'` | Inchangé |
| `buCode` | ✓ | ✓ | Libellé de BU, inchangé |
| `policyNumber` | ✓ | ✓ (`D…`) | |
| `extension` | `string \| null` | `string \| null` | Texte. `null` = pas d'extension, la clé s'affiche sans. Draft : le suffixe `000`, `002` tel quel |
| `policyName` | ✓ | ✓ | **Nouveau.** Distinct du nom de l'assuré |
| `insuredName` | ✓ | ✓ | Remplace `policyholder` |
| `insuredCompanyId` | ✓ | optionnel | |
| `insuredCountry` | ✓ | optionnel | |
| `product` | ✓ | optionnel | CAP, CAP+, Partial non-can… |
| `status` | `PolicyStatus` | `DraftStatus` | Deux types distincts |
| `draftStage` | — | `'app' \| 'nbi'` | Étape atteinte par le draft |
| `inceptionDate` | ✓ | ✓ | Draft : début de la couverture proposée |
| `expiryDate` | ✓ | ✓ | |
| `nextRenewalDate` | optionnel | — | Absente pour une police terminée |
| `segment`, `lob` | optionnels | optionnels | Absents hors Compass |
| `brokerName`, `brokerCompanyId` | optionnels | optionnels | |
| `inforceBu` | optionnel | optionnel | |
| `cancellationDate` | optionnel | — | Police Cancelled seulement |

- `PolicyStatus` reste `'issued' | 'cancelled' | 'expired'`.
- `DraftStatus` = `'issued' | 'inactive' | 'pending' | 'returned' | 'aborted' | 'cancelled' | 'transformed'`.
- `details` (montant couvert, devise, nombre de buyers) disparaît : la réunion n'en parle pas.
- Un type discriminé par `kind` est souhaité si ça reste lisible. La forme exacte est
  laissée au builder.

### 2. Barre (`shared/ui/search-bar-scoped`)

En Policies, la barre devient :
`Policies ▾ | BU ▾ | champ texte | Search in ▾ | Status | Search`

- Le slot de mode (Open policy / Global search) disparaît, ainsi que le champ Extension et
  l'erreur « BU obligatoire ».
- BU : optionnelle, « All BUs » par défaut.
- Status : Issued seul coché par défaut, désactivé sur Drafts comme aujourd'hui.
- Placeholder du champ : « Policy name or number, insured, broker, Company ID ».
- Le bouton s'appelle « Search » dans tous les cas.
- `PolicyMode`, `POLICY_MODES` et le champ `extension` de `PolicyCriteriaValues`
  disparaissent, ainsi que tout ce qui en dépend (`policyMode` dans la page, `mode` dans
  `PolicyRecentV2`, `recentKey`, la carte de recherche récente).

### 3. Moteur mock (`pages/search-v2/policy-search.ts`)

- Plus de branche Open. Plus de `exactHit` (la page ne déplie plus rien d'office).
- Filtres inchangés : source (polices ou drafts), BU si choisie, statuts cochés (polices
  seulement).
- Texte, insensible à la casse :
  - en partiel : `policyName`, `insuredName`, `brokerName`, `policyNumber` ;
  - en exact : `insuredCompanyId`, `brokerCompanyId` ;
  - jamais l'extension.

### 4. Carte de résultat (`shared/ui/policy-result-card`)

Même enveloppe, mêmes tailles `s` / `m`, même rangée d'actions (méta, étoile, chevron)
qu'aujourd'hui.

**Police**
- Ligne 1 : nom de police en `ds-link` (seul élément qui ouvre la police), badge de
  statut (Issued `success`, Cancelled `error`, Expired `neutral`), clé
  `BU · n° · ext` en `ds-identifier` copiable (sans `· ext` si pas d'extension).
- Ligne 2 : `produit · nom de l'assuré`, en secondaire.
- Colonne droite : « Next renewal » + date. Dans les 30 jours qui précèdent, la date passe
  en ton warning avec une icône d'alerte. Police terminée : « Expired on » ou
  « Cancelled on » + date de fin.
- Dépliage (`ds-properties-panel`, 4 colonnes) : Insured Company ID, Insured country,
  Inception, Expiry, Segment, LOB, Broker (nom + ID), Inforce BU. Valeur absente : `—`.

**Draft**
- Ligne 1 : nom, clé `BU · n° · suffixe` telle que Qirin l'affiche.
- Ligne 2 : `produit · nom de l'assuré` (produit omis s'il manque).
- Colonne droite : badge `ÉTAPE · Statut` (ex. `NBI · Pending`, `APP · Issued`) posé
  contre la date, pour tomber au même endroit d'une carte à l'autre. L'étape d'abord :
  « s'il est que applicant, il faut que tu le saches ». Puis « Inception » + date.
- Icône de tuile : différente pour APP et pour NBI.
- Dépliage : les mêmes 8 champs que la police.
- Pas de numéro ni d'historique de versions : « c'est un sous-détail ».

**Interaction** : comme la carte buyer et comme aujourd'hui, le chevron déplie et seul le
nom ouvre (toaster « coming soon » + entrée dans Recently viewed). Pas de zone cliquable
sur toute la carte : c'est ce qui ouvrait le détail par erreur dans l'ancienne search.
*(Choix de l'auteur.)*

**Colonne droite dans les historiques** : dans Recently viewed, la date d'historique
(`slot=meta`, « Viewed yesterday ») reste à gauche du bloc de date de la carte. Les deux
sont gardés, sur la même ligne, et la hauteur ne change pas (le bloc tient sur deux lignes
de texte, comme les deux lignes d'info). *(Choix de l'auteur.)*

**Règles de date** *(choix de l'auteur)* :
- Fenêtre d'alerte : `nextRenewalDate` dans les 30 jours à venir.
- Police Issued dont `nextRenewalDate` est passée : même alerte, libellé « Renewal overdue ».
- Police Cancelled : « Cancelled on » + `cancellationDate` (nouveau champ optionnel du
  modèle). Police Expired : « Expired on » + `expiryDate`.

**Statuts de draft** *(choix de l'auteur)* :
- L'étape s'écrit en texte dans le badge, pas seulement par l'icône.
- Tons de badge : issued `info`, inactive `neutral`, pending `warning`, returned
  `warning`, aborted `neutral`, cancelled `error`, transformed `success`.
- Le sens d'*Issued* sur une APP (envoyée ? validée ?) reste à demander aux users.

**Copie de la clé** : l'identifier copie la clé telle qu'affichée (`AT UK · 7730012 · 0234`).
L'utilisateur la relit pour remplir les champs ailleurs, aucun format de collage Qirin n'est
connu. *(Choix de l'auteur.)*

### 5. Mock (`pages/search-v2/policies.mock.ts`)

Réécrit sur le nouveau modèle. Il doit permettre de démontrer :
- le même n° dans deux BU ;
- une police à plusieurs extensions, dont une clé à zéros (`001` à côté de `1`) ;
- une police sans extension ;
- une police dans sa fenêtre de renouvellement (moins de 30 jours après aujourd'hui,
  date calculée au chargement pour que la démo ne vieillisse pas) ;
- des polices Issued, Cancelled et Expired ;
- un assuré qui a deux polices (une CAP et une Partial non-can, comme le cas « sibling »
  de la réunion) ;
- des polices sans segment ni LOB (hors Compass) ;
- des drafts APP et NBI avec plusieurs statuts ;
- une recherche « food » qui ramène plusieurs résultats, et un broker partagé par
  plusieurs polices.

Les assurés restent repris des buyers du mock pour garder une démo cohérente.

## Non-objectifs

- Page Policy, et donc nouvelle place pour Open policy.
- Ouvrir directement la police quand il n'y a qu'un résultat (sans page, ça ne ferait
  qu'afficher le toaster).
- Historique des versions d'un draft.
- Liste en colonnes (option B de la maquette).
- Tri des résultats, autre pagination que le chargement au scroll actuel.

## Anti-objectifs

- Toucher à `/search` (V1) ou à la recherche Buyers de la V2.
- Réimplémenter un atome : badge, identifier, link, properties-panel, icon-tile restent
  ceux du design system. Aucune valeur en dur dans le SCSS.
- Une carte police plus haute que la carte buyer en première lecture.

## Contraintes

- Règles de `CLAUDE.md` : standalone, signals, `@if` / `@for`, tokens uniquement,
  composition stricte, pas de tiret cadratin dans la prose.
- Tests node existants (`tests/search-v2/*.test.ts`) mis à jour : les tests Open
  disparaissent, de nouveaux tests couvrent le texte (partiel / exact / extension ignorée)
  et le statut Issued par défaut.
- Stores en mémoire (pas de persistance) : pas de migration d'historique à prévoir.

## Choix du builder

- Libellés exacts, icônes choisies dans le registry pour APP / NBI / police.
- Forme TypeScript du modèle (union discriminée ou non).
- Contenu précis du mock dans le cadre ci-dessus.
- Mise à jour des stories de la carte.
