# Search V2 : résultats Policies, plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** aligner la recherche Policies de `/search-v2` sur la réunion du 2026-10-27 : un seul mode (Global search, Issued par défaut), un modèle police/draft réaliste, une recherche texte élargie et une carte de résultat police/draft sur 2 lignes.

**Architecture :** la logique pure (modèle, libellés de carte, règles de date, moteur de recherche, signature d'historique, mock) vit dans des modules `.ts` sans import Angular, testés par `node --test`. Les composants Angular (`ds-policy-result-card`, `ds-search-bar-scoped`, page `search-v2`, carte de recherche récente) ne font que consommer ces fonctions.

**Tech Stack :** Angular 19 standalone + signals, SCSS sur tokens, tests `node:test` (Node 26, types retirés nativement).

**Spec :** `docs/superpowers/specs/2026-10-28-search-v2-policy-results-design.md`

## Global Constraints

- Travailler sur une branche `feat/policy-search-results` dans un worktree : `main` porte du travail non commité sans rapport.
- `/search` (V1) et la recherche Buyers de la V2 restent inchangées.
- `CLAUDE.md` : standalone, signals, `@if` / `@for`, aucune valeur en dur dans SCSS ou TS (tokens `--semantic-*`), composition stricte (atomes `ds-*` uniquement), pas de `style=""`.
- Pas de tiret cadratin (`—`) dans la prose, commentaires compris. Seule exception : `—` seul comme valeur vide d'un champ.
- Icônes du registry : police `contract`, draft APP `file-new`, draft NBI `file-text`, alerte `warning-triangle`.
- Commandes : tests `node --test tests/search-v2/`, build `npx ng build`. Le build n'est attendu vert qu'à la fin de la tâche 3.

## Review Focus

- Une saisie avec des espaces autour (« ` 40213377 ` ») doit matcher un Company ID exact. Test en tâche 1.
- Une police Issued sans `nextRenewalDate` ne doit pas afficher « Invalid Date » ni d'alerte. Test en tâche 2.
- L'alerte de renouvellement le jour J et à J+30 inclus, pas à J+31. Test en tâche 2.
- Repasser de Drafts à Policies doit recocher Issued, sinon `statusError` bloque une recherche que l'utilisateur n'a pas cassée. Couvert par `defaultPolicyCriteria` en tâche 1, appliqué en tâche 3.
- Deux polices au même n° dans deux BU sont deux favoris distincts. Test d'unicité des `id` en tâche 1.

---

### Task 1 : modèle, critères, moteur, historique et mock

**Files :**
- Modify : `src/app/shared/ui/policy-result-card/policy.model.ts`
- Modify : `src/app/shared/ui/policy-criteria/policy-criteria.model.ts`
- Modify : `src/app/pages/search-v2/policy-search.ts`
- Modify : `src/app/pages/search-v2/search-v2-recents.model.ts`
- Rewrite : `src/app/pages/search-v2/policies.mock.ts`
- Test : `tests/search-v2/policy-search.test.ts` (réécrit), `tests/search-v2/search-v2-recents.test.ts` (tests Open retirés), `tests/search-v2/policies-mock.test.ts` (nouveau)

**Interfaces :**
- Produces (`policy.model.ts`) :
  ```ts
  export type PolicyStatus = 'issued' | 'cancelled' | 'expired';
  export type DraftStatus = 'applicant' | 'pending' | 'returned' | 'aborted' | 'cancelled' | 'transformed';
  export type DraftStage = 'app' | 'nbi';
  interface PolicyBase {
    id: string; buCode: string; policyNumber: string; policyName: string; insuredName: string;
    insuredCompanyId?: string; insuredCountry?: string; product?: string;
    segment?: string; lob?: string; brokerName?: string; brokerCompanyId?: string;
  }
  export interface SignedPolicy extends PolicyBase {
    kind: 'policy'; extension: string | null; status: PolicyStatus;
    inceptionDate: string; expiryDate: string;            // ISO 'YYYY-MM-DD'
    nextRenewalDate?: string; cancellationDate?: string; inforceBu?: string;
  }
  export interface DraftPolicy extends PolicyBase {
    kind: 'draft'; draftStage: DraftStage; status: DraftStatus; updatedDate: string;
  }
  export type PolicyResultData = SignedPolicy | DraftPolicy;
  export function policyId(p: { kind: 'policy'; buCode: string; policyNumber: string; extension: string | null }
                           | { kind: 'draft'; buCode: string; policyNumber: string }): string;
  // 'POL/AT UK/7730012/0234', 'POL/AT UK/7730250' (sans extension), 'DFT/AT UK/D20431'
  export const POLICY_STATUS_LABELS: Record<PolicyStatus, string>;   // inchangé
  export const DRAFT_STATUS_LABELS: Record<DraftStatus, string>;     // 'Applicant', 'Pending', 'Returned', 'Aborted', 'Cancelled', 'Transformed'
  export const BU_CODES: string[];                                   // inchangé, à compléter si le mock ajoute une BU
  ```
  `details`, `policyholder`, `effectiveDate` disparaissent.
- Produces (`policy-criteria.model.ts`) : `PolicyCriteriaValues = { searchIn: 'policies' | 'drafts'; statuses: PolicyStatus[] }`, `POLICY_STATUSES` inchangé, `defaultPolicyCriteria()` → `{ searchIn: 'policies', statuses: ['issued'] }`. `PolicyMode`, `POLICY_MODES`, `allPolicyStatuses` et `extension` sont supprimés.
- Produces (`policy-search.ts`) : `PolicyQuery = { buCode: string | null; query: string; criteria: PolicyCriteriaValues }`, `searchPolicies(pool: PolicyResultData[], q: PolicyQuery): PolicyResultData[]`. `PolicySearchResult` et `exactHit` sont supprimés.
- Produces (`search-v2-recents.model.ts`) : `PolicyRecentV2 = { kind: 'policy'; buCode: string | null; query: string; criteria: PolicyCriteriaValues; ts: number }`. `recentKey` pour une policy : `['policy', buCode, query, searchIn, searchIn === 'drafts' ? [] : statuses triés]`.
- Produces (`policies.mock.ts`) : `POLICIES: PolicyResultData[]`, dates calculées depuis `new Date()` au chargement.

- [ ] **Step 1 : écrire les tests qui échouent**

`tests/search-v2/policy-search.test.ts`, avec `q = (over) => ({ buCode: null, query: '', criteria: defaultPolicyCriteria(), ...over })` :
  - `default criteria check Issued only` : `defaultPolicyCriteria().statuses` deep-equal `['issued']`.
  - `default search lists issued policies only` : tous `kind === 'policy'` et `status === 'issued'`, liste non vide.
  - `BU filter keeps only that BU`.
  - `matches policy name, partial, case insensitive` : `'food'` ramène au moins 2 polices, chacune avec `food` dans `policyName` ou `insuredName`.
  - `matches insured name partial`, `matches broker name partial` (un broker du mock partagé par au moins 2 polices).
  - `matches policy number partial` : un fragment du n° ramène toutes les polices qui le contiennent, toutes BU confondues.
  - `insured Company ID matches exactly, not partially` : l'ID complet ramène ses polices ; l'ID sans ses 2 derniers chiffres ramène `[]`.
  - `broker Company ID matches exactly`.
  - `Company ID ignores surrounding spaces` (Review Focus).
  - `extension is never searched` : saisir une extension seule (`'0234'`) ne ramène pas la police par son extension.
  - `drafts ignore statuses` : `searchIn: 'drafts', statuses: []` ramène tous les drafts, aucun `kind === 'policy'`.
  - `no status checked finds no policy`.
  - `no match returns an empty list`.

`tests/search-v2/policies-mock.test.ts` :
  - `ids are unique` (Review Focus).
  - `same policy number exists in two BUs`.
  - `extensions are text: 001 and 1 coexist on one policy number`.
  - `one policy has no extension` (`extension === null`).
  - `one issued policy renews within 30 days of today`.
  - `covers every policy status` et `drafts cover both stages and at least 3 statuses`.
  - `every APP draft has status applicant`.
  - `one insured holds a CAP and a Partial non-can policy`.
  - `some policies have no segment nor LOB`.

`tests/search-v2/search-v2-recents.test.ts` : retirer `mode` des fixtures, supprimer le test `open policy key keeps the extension…` et le cas `o` (open) du premier test. Les autres tests gardent leurs assertions.

- [ ] **Step 2 : lancer, constater l'échec**

Run : `node --test tests/search-v2/`
Expected : FAIL (imports et champs manquants).

- [ ] **Step 3 : implémenter modèle, critères, moteur, signature et mock** selon les Interfaces ci-dessus. Le moteur compare en partiel `policyName`, `insuredName`, `brokerName`, `policyNumber` (minuscules, `includes`), et en exact `insuredCompanyId`, `brokerCompanyId` (après `trim`). Le mock reprend les assurés de `buyers.mock.ts` et s'appuie sur un helper local `isoInDays(n: number): string`.

- [ ] **Step 4 : relancer**

Run : `node --test tests/search-v2/`
Expected : PASS sur les trois fichiers, plus `search-v2-history.test.ts` inchangé.

- [ ] **Step 5 : commit**

```bash
git add src/app/shared/ui/policy-result-card/policy.model.ts src/app/shared/ui/policy-criteria/policy-criteria.model.ts src/app/pages/search-v2/policy-search.ts src/app/pages/search-v2/search-v2-recents.model.ts src/app/pages/search-v2/policies.mock.ts tests/search-v2/
git commit -m "feat(search-v2): policy model, search and mock match the policy meeting"
```

---

### Task 2 : carte de résultat police et draft

**Files :**
- Create : `src/app/shared/ui/policy-result-card/policy-card.view.ts` (pur, sans Angular)
- Modify : `src/app/shared/ui/policy-result-card/policy-result-card.component.ts|html|scss`
- Modify : `src/app/shared/ui/policy-result-card/policy-result-card.stories.ts`
- Test : `tests/search-v2/policy-card-view.test.ts`

**Interfaces :**
- Consumes : `PolicyResultData`, `SignedPolicy`, `DraftPolicy`, labels de la tâche 1.
- Produces (`policy-card.view.ts`) :
  ```ts
  export function policyKeyLabel(p: PolicyResultData): string;
  // 'AT UK · 7730012 · 0234' | 'AT UK · 7730250' | 'AT UK · D20431 · NBI' | 'AT UK · D20432 · APP'
  export function policyBadge(p: PolicyResultData): { label: string; status: BadgeStatus };
  export function policyDateBlock(p: PolicyResultData, today: Date):
    { label: string; value: string; alert: boolean } | null;
  export function formatPolicyDate(iso: string): string;   // '2026-11-15' → '15 Nov 2026'
  export function policyDetailRows(p: PolicyResultData): { label: string; value: string }[];
  export function policyTileIcon(p: PolicyResultData): 'contract' | 'file-new' | 'file-text';
  ```
  `BadgeStatus` en `import type` depuis `../badge/badge.component` (effacé à l'exécution).

- [ ] **Step 1 : écrire les tests qui échouent** (`tests/search-v2/policy-card-view.test.ts`, fixtures locales, `today = new Date('2026-10-28')`) :
  - `key label with extension`, `key label without extension`, `draft key label shows stage` (valeurs ci-dessus).
  - `policy badges` : issued → `success`, cancelled → `error`, expired → `neutral`.
  - `draft badges` : applicant `info`, pending `warning`, returned `warning`, aborted `neutral`, cancelled `error`, transformed `success`.
  - `renewal in 30 days alerts, 31 does not` : `nextRenewalDate` `2026-11-27` → `{ label: 'Next renewal', value: '27 Nov 2026', alert: true }` ; `2026-11-28` → `alert: false` (Review Focus).
  - `renewal today alerts`.
  - `renewal past on an issued policy` → `{ label: 'Renewal overdue', alert: true }`.
  - `issued without renewal date` → `null` (Review Focus).
  - `cancelled shows cancellation date` → `label: 'Cancelled on'`, valeur = `cancellationDate`, `alert: false`.
  - `expired shows expiry date` → `label: 'Expired on'`.
  - `draft shows updated date` → `label: 'Updated'`.
  - `detail rows for a policy` : dans l'ordre `Insured Company ID`, `Insured country`, `Inception`, `Expiry`, `Segment`, `LOB`, `Broker`, `Inforce BU` ; Broker = `'Marsh Ltd · 80011290'` ; valeur manquante = `'—'`.
  - `detail rows for a draft` : mêmes libellés sans `Inception`, `Expiry`, `Inforce BU`.
  - `tile icons` : policy `contract`, APP `file-new`, NBI `file-text`.

- [ ] **Step 2 : lancer, constater l'échec**

Run : `node --test tests/search-v2/policy-card-view.test.ts`
Expected : FAIL (module absent).

- [ ] **Step 3 : implémenter `policy-card.view.ts`**. Fenêtre d'alerte : `0 <= jours avant nextRenewalDate <= 30`, calculée en jours calendaires UTC ; négatif → « Renewal overdue ».

- [ ] **Step 4 : relancer**

Run : `node --test tests/search-v2/`
Expected : PASS.

- [ ] **Step 5 : brancher le composant**
  - `today = input<Date>(new Date())` pour que les stories figent la date ; les computed appellent les fonctions de `policy-card.view.ts`.
  - Template, ligne 1 : `ds-link` (nom, seul déclencheur de `opened`), `ds-badge`, `ds-identifier [value]="keyLabel()" [copyable]="true"` (police et draft).
  - Ligne 2 : `product · insuredName`, `product` omis s'il est absent.
  - Tuile : `ds-icon-tile` + `ds-icon [name]="tileIcon()"`, tone `brand` pour la police et `subtle` pour les drafts.
  - Colonne droite, dans cet ordre : `slot=meta`, bloc date (libellé au-dessus, valeur dessous ; si `alert`, `ds-icon name="warning-triangle"` + classe `--alert` en `--semantic-color-static-text-main-functional-warning`), étoile, chevron.
  - Le chevron n'est plus jamais désactivé (`hasDetails` supprimé).
  - Dépliage : `ds-properties-panel [columns]="4" variant="flat"` alimenté par `policyDetailRows`.
  - Le titre `Policy …-…` disparaît : le nom de police le remplace.
  - SCSS : réutiliser les règles existantes `__holder` et `__period`, ajouter `__date` et `__date--alert`, tokens uniquement. La hauteur en première lecture reste celle de deux lignes de texte.

- [ ] **Step 6 : stories** : réécrire les fixtures sur le nouveau modèle, `today` figé à `2026-10-28`. Une story par cas : Issued, Issued en fenêtre de renouvellement, Cancelled, Expired, sans extension, Draft APP, Draft NBI, ouverte (dépliée), size `s` avec `slot=meta`.

- [ ] **Step 7 : commit**

```bash
git add src/app/shared/ui/policy-result-card/ tests/search-v2/policy-card-view.test.ts
git commit -m "feat(design-system): policy result card shows name, key, product and renewal"
```

---

### Task 3 : barre sans Open, page et carte de recherche récente

**Files :**
- Modify : `src/app/shared/ui/search-bar-scoped/search-bar-scoped.component.ts|html` (+ `.stories.ts` si elle utilise `policyMode`)
- Modify : `src/app/pages/search-v2/search-v2.component.ts|html`
- Modify : `src/app/pages/search-v2/components/recent-search-v2-card.component.ts`

**Interfaces :**
- Consumes : `PolicyCriteriaValues`, `defaultPolicyCriteria`, `searchPolicies(pool, q): PolicyResultData[]`, `PolicyRecentV2` sans `mode` (tâche 1) ; carte de la tâche 2 (mêmes inputs `data`, `open`, `size`, `favorited`, mêmes outputs).
- Produces : `ds-search-bar-scoped` sans `policyMode` (model) ni `policyModeChange`.

- [ ] **Step 1 : barre**
  - Supprimer : slot mode, champ Extension, `buError`, `pickMode`, `onExtensionInput`, `clearExtension`, `isOpen`, `modeMeta`, `policyModes`, `POLICY_MODE_ICONS`, le flyout `'mode'`.
  - `placeholder` Policies : `'Policy name or number, insured, broker, Company ID'`. `submitLabel` : toujours `'Search'`. `fieldIcon` : toujours `'search'`.
  - `queryError` : Buyers seulement. `searchValid` Policies : `!statusError()`. `buLabel` : `buCode() ?? 'All BUs'`. Option « All BUs » affichée sans condition de mode.
  - `pickSearchIn` : retour à Policies → `statuses: defaultPolicyCriteria().statuses` (Review Focus).
  - Mettre à jour le commentaire de classe (plus de « deux écrans de Qirin »).

- [ ] **Step 2 : page**
  - Supprimer `policyMode`, `onPolicyModeChange` et le binding `(policyModeChange)` / `[policyMode]`.
  - `policyResult` devient `computed<PolicyResultData[]>` ; `totalCount` / `visiblePolicies` lisent le tableau.
  - `runSearch` : `PolicyQuery` sans `mode`, `expandedKey.set(null)` (plus de dépliage d'office), `record` sans `mode`.
  - `pickRecent` : ne restaure plus de mode.
  - `onScopeChange` : ne remet plus de mode à zéro.

- [ ] **Step 3 : carte de recherche récente**
  - `policyView` : supprimer la branche `open` et l'import `POLICY_MODES`.
  - `searchType` : `'Global search'`.
  - Le libellé Status vaut `'All'` quand les 3 statuts sont cochés, sinon la liste.
  - Placeholder vide : `'Any name, number or Company ID'`.

- [ ] **Step 4 : vérifier**

Run : `node --test tests/search-v2/` puis `npx ng build`
Expected : tests PASS ; build sans erreur. `grep -rn "policyMode\|PolicyMode\|exactHit\|policyholder" src tests` ne renvoie rien.

- [ ] **Step 5 : contrôle visuel** (`npx ng serve`, `/search-v2`, scope Policies) :
  - la barre n'a plus le slot de mode ni Extension, Status montre Issued seul ;
  - « food » ramène plusieurs cartes à 2 lignes ;
  - une carte en fenêtre de renouvellement montre l'alerte orange ;
  - le dépliage montre 8 champs ;
  - Drafts montre des tuiles APP et NBI différentes avec l'étape dans la clé ;
  - ouvrir une police l'envoie dans Recently viewed, la date d'historique à gauche du bloc date, même hauteur que la carte buyer ;
  - une recherche passée se rejoue depuis Recent search.

- [ ] **Step 6 : commit**

```bash
git add src/app/shared/ui/search-bar-scoped/ src/app/pages/search-v2/
git commit -m "feat(search-v2): policies search drops Open policy, Issued by default"
```
