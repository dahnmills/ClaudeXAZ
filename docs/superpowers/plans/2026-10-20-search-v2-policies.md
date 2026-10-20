# Search V2 (Buyers + Policies) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Une page `/search-v2`, copie de `/search`, où le premier slot de la barre choisit Buyers ou Policies, avec la recherche Policies, sa carte de résultat, son panneau More criteria, et des historiques filtrables All / Buyers / Policies.

**Architecture:** La V1 n'est pas touchée. Trois nouveaux composants `shared/ui` (`ds-search-bar-scoped`, `ds-policy-criteria`, `ds-policy-result-card`) composent les atomes existants. La logique (filtre Policies, tri / groupage / comptage des historiques, clés de dédoublonnage) vit dans des modules TypeScript purs, sans import Angular, testés avec `node --test`. Les stores V2 et la page sont de minces couches Angular au-dessus.

**Tech Stack:** Angular 19 standalone, signals, SCSS + tokens, Storybook 8, Node 26 (`node --test` exécute le TypeScript nativement, aucune dépendance à installer).

**Spec:** `docs/superpowers/specs/2026-10-20-search-v2-policies-design.md`

## Global Constraints

- Aucun fichier modifié sous `src/app/pages/search/`, `src/app/shared/ui/search-bar-multi/`, `src/app/shared/ui/more-criteria/`, `src/app/shared/ui/result-card/`, ni `src/app/pages/buyer-summary/viewed-buyers.store.ts`.
- Angular standalone, `input()` / `model()` / `output()` / `computed()`, blocs `@if` / `@for` / `@switch` uniquement.
- Aucune valeur en dur dans `.scss` / `.ts` : couleurs, espacements, tailles, rayons via `var(--semantic-…)` (ou `--foundation-…` si aucun sémantique n'existe).
- Pas de `style=""` inline, pas de `<button>`, `<a>`, `<input>`, `<svg>` natifs dans `shared/ui/**` ni dans les pages : `ds-button`, `ds-button-icon`, `ds-link`, `ds-input-text`, `ds-icon`.
- Pas de tiret cadratin dans la prose (commentaires, textes d'interface).
- Libellés de champ en semi-bold, jamais sur deux lignes.
- Les modules purs (`*.model.ts`, `policy-search.ts`, `search-v2-history.ts`, `policies.mock.ts`) n'ont **que des `import type`** : `node --test` les charge sans résoudre d'autres fichiers TS.
- Les tests vivent dans `tests/search-v2/` (hors `src/`, donc hors build Angular) et se lancent avec `node --test tests/search-v2/`.

## Review Focus

1. Changer d'objet après une recherche : les résultats, la saisie et les critères de l'objet quitté disparaissent, le panneau More criteria se ferme. Test : Task 8, étape de vérification navigateur « bascule après recherche ».
2. N° exact sans BU choisi : pas de dépliage d'office, recherche partielle normale. Test : Task 1, `exact number without BU is a partial search`.
3. Drafts + statuts cochés : les statuts sont ignorés (un draft n'a pas de statut), sinon la liste Drafts serait toujours vide. Test : Task 1, `drafts ignore statuses`.
4. Clear sous un filtre : « Clear policies » n'efface pas les buyers. Test : Task 2, `clearKind keeps the other kind`.
5. Rejouer une recherche Policy depuis Recent search : la barre repasse sur Policies avec BU, saisie et critères, et le résultat est le même qu'à l'origine. Test : Task 3, `recentKey distinguishes kinds and criteria`, puis Task 9, vérification navigateur « rejeu ».

---

### Task 1: Modèles Policy, mock et filtre de recherche

**Files:**
- Create: `src/app/shared/ui/policy-result-card/policy.model.ts`
- Create: `src/app/shared/ui/policy-criteria/policy-criteria.model.ts`
- Create: `src/app/pages/search-v2/policies.mock.ts`
- Create: `src/app/pages/search-v2/policy-search.ts`
- Test: `tests/search-v2/policy-search.test.ts`

**Interfaces:**
- Produces:
  - `PolicyStatus = 'issued' | 'cancelled' | 'expired'`, `PolicyKind = 'policy' | 'draft'`
  - `PolicyResultData { id; policyNumber; extension; kind; status: PolicyStatus | null; policyholder; buCode; effectiveDate; expiryDate; details? }`
  - `BU_CODES: string[]`
  - `PolicyCriteriaValues { searchIn: 'policies' | 'drafts'; statuses: PolicyStatus[]; extension: string }`
  - `POLICY_STATUSES`, `defaultPolicyCriteria()`, `policyCriteriaCount(v)`
  - `POLICIES: PolicyResultData[]`
  - `PolicyQuery { buCode: string | null; query: string; criteria: PolicyCriteriaValues }`
  - `PolicySearchResult { items: PolicyResultData[]; exactHit: boolean }`
  - `searchPolicies(pool, q): PolicySearchResult`

- [ ] **Step 1: Écrire les modèles**

`src/app/shared/ui/policy-result-card/policy.model.ts` :

```ts
/** Modèle d'une police (ou d'un draft) tel que la recherche V2 l'affiche.
 *  Module pur : aucun import Angular, lu par les tests node. */

export type PolicyStatus = 'issued' | 'cancelled' | 'expired';
export type PolicyKind = 'policy' | 'draft';

export interface PolicyDetail { label: string; value: string; }

export interface PolicyResultData {
  /** Identifiant stable : n° + extension. Clé des favoris et de l'historique. */
  id: string;
  policyNumber: string;
  /** '00', '01'… ; '00' pour un draft. */
  extension: string;
  kind: PolicyKind;
  /** null pour un draft : il n'a pas encore de statut. */
  status: PolicyStatus | null;
  policyholder: string;
  /** Libellé de BU, ex. 'AT USA'. */
  buCode: string;
  effectiveDate: string;
  expiryDate: string;
  details?: PolicyDetail[];
}

/** BU proposées par le slot BU de la barre, triées. */
export const BU_CODES: string[] = ['Acredia', 'AT Belgium', 'AT Brazil', 'AT UK', 'AT USA'];

export const POLICY_STATUS_LABELS: Record<PolicyStatus, string> = {
  issued:    'Issued',
  cancelled: 'Cancelled',
  expired:   'Expired',
};
```

`src/app/shared/ui/policy-criteria/policy-criteria.model.ts` :

```ts
import type { PolicyStatus } from '../policy-result-card/policy.model';

/** Critères complémentaires d'une recherche Policies, tels que la page les détient. */
export interface PolicyCriteriaValues {
  searchIn: 'policies' | 'drafts';
  statuses: PolicyStatus[];
  extension: string;
}

export const POLICY_STATUSES: { id: PolicyStatus; label: string }[] = [
  { id: 'issued',    label: 'Issued' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'expired',   label: 'Expired' },
];

/** Jeu par défaut, celui de Qirin : polices émises. Fonction, pas constante :
 *  chaque appelant a le sien. */
export function defaultPolicyCriteria(): PolicyCriteriaValues {
  return { searchIn: 'policies', statuses: ['issued'], extension: '' };
}

/** Nombre de critères actifs, lu par le compteur « More criteria (n) ».
 *  En Drafts, les statuts ne filtrent rien : ils ne comptent pas. */
export function policyCriteriaCount(v: PolicyCriteriaValues): number {
  let n = v.searchIn === 'drafts' ? 1 : v.statuses.length;
  if (v.extension.trim()) n++;
  return n;
}
```

- [ ] **Step 2: Écrire le mock**

`src/app/pages/search-v2/policies.mock.ts` :

```ts
import type { PolicyResultData, PolicyKind, PolicyStatus } from '../../shared/ui/policy-result-card/policy.model';

/** Fabrique compacte : une ligne par police dans la table ci-dessous. */
function p(
  policyNumber: string, extension: string, kind: PolicyKind, status: PolicyStatus | null,
  policyholder: string, buCode: string, effectiveDate: string, expiryDate: string,
  covered: string, currency: string, buyers: number,
): PolicyResultData {
  return {
    id: `${policyNumber}-${extension}`,
    policyNumber, extension, kind, status, policyholder, buCode, effectiveDate, expiryDate,
    details: [
      { label: 'Covered amount', value: covered },
      { label: 'Currency',       value: currency },
      { label: 'Covered buyers', value: String(buyers) },
    ],
  };
}

/** Policyholders repris des buyers du mock V1 : la démo reste cohérente. */
export const POLICIES: PolicyResultData[] = [
  p('5012346', '01', 'policy', 'issued',    'Brooklyn Craft Goods LLC',     'AT USA',     '01 Jan 2026', '31 Dec 2026', '$2 000 000',   'USD', 14),
  p('5012346', '00', 'policy', 'expired',   'Brooklyn Craft Goods LLC',     'AT USA',     '01 Jan 2025', '31 Dec 2025', '$1 500 000',   'USD', 11),
  p('5012390', '00', 'policy', 'issued',    'Atlantic Seafood Imports Inc', 'AT USA',     '01 Mar 2026', '28 Feb 2027', '$3 200 000',   'USD', 22),
  p('5012391', '00', 'policy', 'cancelled', 'Atlantic Seafood Imports Inc', 'AT USA',     '01 Mar 2024', '28 Feb 2025', '$900 000',     'USD', 6),
  p('7730012', '02', 'policy', 'issued',    'Northwind Trading Ltd',        'AT UK',      '01 Apr 2026', '31 Mar 2027', '£1 800 000',   'GBP', 9),
  p('7730012', '01', 'policy', 'expired',   'Northwind Trading Ltd',        'AT UK',      '01 Apr 2025', '31 Mar 2026', '£1 600 000',   'GBP', 8),
  p('7730250', '00', 'policy', 'issued',    'Galaxy Pharma Distribution',   'AT UK',      '15 Jun 2026', '14 Jun 2027', '€2 400 000',   'EUR', 17),
  p('3301174', '00', 'policy', 'issued',    'Immobilière du Marais',        'AT Belgium', '01 Jan 2026', '31 Dec 2026', '€750 000',     'EUR', 4),
  p('3301175', '01', 'policy', 'cancelled', 'Le Marais SARL',               'AT Belgium', '01 Feb 2025', '31 Jan 2026', '€300 000',     'EUR', 2),
  p('8840221', '00', 'policy', 'issued',    'Iberia Cafés y Tostados SL',   'AT Brazil',  '01 May 2026', '30 Apr 2027', 'BRL 4 000 000','BRL', 12),
  p('8840222', '00', 'policy', 'expired',   'Verde Agricoltura SpA',        'AT Brazil',  '01 May 2024', '30 Apr 2025', 'BRL 2 100 000','BRL', 5),
  p('1100458', '00', 'policy', 'issued',    'Nordsee Logistik GmbH',        'Acredia',    '01 Jan 2026', '31 Dec 2026', '€5 000 000',   'EUR', 31),
  p('1100459', '01', 'policy', 'issued',    'Danube Textiles Kft',          'Acredia',    '01 Jul 2026', '30 Jun 2027', '€1 200 000',   'EUR', 7),
  p('1100460', '00', 'policy', 'cancelled', 'Stahlbau Müller AG',           'Acredia',    '01 Jan 2025', '31 Dec 2025', 'CHF 2 000 000','CHF', 10),
  p('5012510', '00', 'policy', 'issued',    'Helvetia Watch Components',    'AT USA',     '01 Sep 2026', '31 Aug 2027', '$1 100 000',   'USD', 5),
  p('D-20431', '00', 'draft',  null,        'Polaris Tech Nordic AB',       'AT UK',      '01 Jan 2027', '31 Dec 2027', '£900 000',     'GBP', 3),
  p('D-20432', '00', 'draft',  null,        'Aurora Solar Solutions BV',    'AT Belgium', '01 Jan 2027', '31 Dec 2027', '€600 000',     'EUR', 2),
  p('D-20433', '00', 'draft',  null,        'Brooklyn Craft Goods LLC',     'AT USA',     '01 Jan 2027', '31 Dec 2027', '$2 200 000',   'USD', 15),
  p('D-20434', '00', 'draft',  null,        'Mistral Énergie Renouvelable', 'Acredia',    '01 Mar 2027', '29 Feb 2028', '€1 000 000',   'EUR', 4),
];
```

- [ ] **Step 3: Écrire le test qui échoue**

`tests/search-v2/policy-search.test.ts` :

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchPolicies } from '../../src/app/pages/search-v2/policy-search.ts';
import { POLICIES } from '../../src/app/pages/search-v2/policies.mock.ts';
import { defaultPolicyCriteria, policyCriteriaCount } from '../../src/app/shared/ui/policy-criteria/policy-criteria.model.ts';

const crit = (over = {}) => ({ ...defaultPolicyCriteria(), ...over });

test('empty query lists every issued policy across BUs', () => {
  const r = searchPolicies(POLICIES, { buCode: null, query: '', criteria: crit() });
  assert.equal(r.exactHit, false);
  assert.ok(r.items.length > 0);
  assert.ok(r.items.every(p => p.kind === 'policy' && p.status === 'issued'));
});

test('BU filter keeps only that BU', () => {
  const r = searchPolicies(POLICIES, { buCode: 'AT UK', query: '', criteria: crit() });
  assert.ok(r.items.length > 0);
  assert.ok(r.items.every(p => p.buCode === 'AT UK'));
});

test('exact number with BU is a direct hit', () => {
  const r = searchPolicies(POLICIES, { buCode: 'AT USA', query: '5012390', criteria: crit() });
  assert.equal(r.exactHit, true);
  assert.deepEqual(r.items.map(p => p.id), ['5012390-00']);
});

test('exact number without BU is a partial search', () => {
  const r = searchPolicies(POLICIES, { buCode: null, query: '5012390', criteria: crit() });
  assert.equal(r.exactHit, false);
  assert.deepEqual(r.items.map(p => p.id), ['5012390-00']);
});

test('exact number matching several extensions is not a direct hit', () => {
  const r = searchPolicies(POLICIES, { buCode: 'AT USA', query: '5012346', criteria: crit({ statuses: [] }) });
  assert.equal(r.exactHit, false);
  assert.equal(r.items.length, 2);
});

test('extension narrows an exact number to one hit', () => {
  const r = searchPolicies(POLICIES, { buCode: 'AT USA', query: '5012346', criteria: crit({ statuses: [], extension: '01' }) });
  assert.equal(r.exactHit, true);
  assert.deepEqual(r.items.map(p => p.id), ['5012346-01']);
});

test('keyword matches policyholder, case insensitive', () => {
  const r = searchPolicies(POLICIES, { buCode: null, query: 'brooklyn', criteria: crit({ statuses: [] }) });
  assert.ok(r.items.length >= 2);
  assert.ok(r.items.every(p => p.policyholder.toLowerCase().includes('brooklyn')));
});

test('no status checked means every status', () => {
  const r = searchPolicies(POLICIES, { buCode: 'AT USA', query: '', criteria: crit({ statuses: [] }) });
  const statuses = new Set(r.items.map(p => p.status));
  assert.ok(statuses.has('issued') && statuses.has('expired') && statuses.has('cancelled'));
});

test('drafts ignore statuses', () => {
  const r = searchPolicies(POLICIES, { buCode: null, query: '', criteria: crit({ searchIn: 'drafts', statuses: ['issued'] }) });
  assert.equal(r.items.length, 4);
  assert.ok(r.items.every(p => p.kind === 'draft'));
});

test('no match returns an empty list', () => {
  const r = searchPolicies(POLICIES, { buCode: null, query: 'zzz-nothing', criteria: crit() });
  assert.deepEqual(r.items, []);
});

test('criteria count: default is 1, drafts counts as 1, extension adds 1', () => {
  assert.equal(policyCriteriaCount(defaultPolicyCriteria()), 1);
  assert.equal(policyCriteriaCount(crit({ searchIn: 'drafts', statuses: ['issued', 'expired'] })), 1);
  assert.equal(policyCriteriaCount(crit({ statuses: ['issued', 'expired'], extension: '01' })), 3);
  assert.equal(policyCriteriaCount(crit({ statuses: [] })), 0);
});
```

- [ ] **Step 4: Lancer le test, vérifier l'échec**

Run: `node --test tests/search-v2/`
Expected: FAIL, `Cannot find module '…/policy-search.ts'`.

- [ ] **Step 5: Écrire le filtre**

`src/app/pages/search-v2/policy-search.ts` :

```ts
import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import type { PolicyCriteriaValues } from '../../shared/ui/policy-criteria/policy-criteria.model';

/** Une recherche Policies telle que la barre et le panneau la posent. */
export interface PolicyQuery {
  /** null = toutes les BU. */
  buCode: string | null;
  query: string;
  criteria: PolicyCriteriaValues;
}

export interface PolicySearchResult {
  items: PolicyResultData[];
  /** Vrai quand la saisie désigne exactement une police d'une BU choisie :
   *  c'est l'ancien « Open policy », la page déplie le résultat d'office. */
  exactHit: boolean;
}

/**
 * Filtre le jeu de polices. Ordre : source (polices ou drafts, exclusif), BU,
 * statut (polices seulement, aucun coché = tous), extension, puis la saisie.
 * Une saisie égale au n° d'une seule police, BU choisie, donne un accès direct ;
 * sinon recherche partielle sur le n° et le policyholder.
 */
export function searchPolicies(pool: PolicyResultData[], q: PolicyQuery): PolicySearchResult {
  const c = q.criteria;
  const ext = c.extension.trim();
  const filtered = pool.filter(p =>
    (c.searchIn === 'drafts' ? p.kind === 'draft' : p.kind === 'policy') &&
    (!q.buCode || p.buCode === q.buCode) &&
    (c.searchIn === 'drafts' || !c.statuses.length || (p.status !== null && c.statuses.includes(p.status))) &&
    (!ext || p.extension === ext),
  );

  const text = q.query.trim().toLowerCase();
  if (!text) return { items: filtered, exactHit: false };

  if (q.buCode) {
    const exact = filtered.filter(p => p.policyNumber.toLowerCase() === text);
    if (exact.length === 1) return { items: exact, exactHit: true };
  }

  return {
    items: filtered.filter(p =>
      p.policyNumber.toLowerCase().includes(text) || p.policyholder.toLowerCase().includes(text),
    ),
    exactHit: false,
  };
}
```

- [ ] **Step 6: Lancer le test, vérifier le succès**

Run: `node --test tests/search-v2/`
Expected: PASS, 11 tests.

- [ ] **Step 7: Commit**

```bash
git add tests/search-v2/policy-search.test.ts src/app/shared/ui/policy-result-card/policy.model.ts src/app/shared/ui/policy-criteria/policy-criteria.model.ts src/app/pages/search-v2/policies.mock.ts src/app/pages/search-v2/policy-search.ts
git commit -m "feat(search-v2): policy model, mock and search filter"
```

---

### Task 2: Logique des historiques (filtre, tri, groupage, libellés)

**Files:**
- Create: `src/app/pages/search-v2/search-v2-history.ts`
- Test: `tests/search-v2/search-v2-history.test.ts`

**Interfaces:**
- Produces:
  - `HistoryKind = 'buyer' | 'policy'`, `HistoryFilter = 'all' | HistoryKind`, `HistoryTab = 'searched' | 'viewed' | 'favorites'`
  - `Stamped { kind: HistoryKind; ts: number }`
  - `byRecent<T extends { ts: number }>(items: T[]): T[]`
  - `filterHistory<T extends Stamped>(items: T[], f: HistoryFilter): T[]`
  - `groupByKind<T extends Stamped>(items: T[]): HistoryGroup<T>[]` où `HistoryGroup<T> { kind; label: 'Buyers' | 'Policies'; items: T[] }`
  - `countByKind(items: Stamped[]): Record<HistoryFilter, number>`
  - `clearLabel(f: HistoryFilter): string`
  - `emptyLabel(tab: HistoryTab, f: HistoryFilter): string`
  - `upsertFront<T extends { ts: number }>(list: T[], entry: T, key: (e: T) => string, max: number): T[]`
  - `removeKind<T extends Stamped>(list: T[], kind?: HistoryKind): T[]`

- [ ] **Step 1: Écrire le test qui échoue**

`tests/search-v2/search-v2-history.test.ts` :

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  byRecent, filterHistory, groupByKind, countByKind, clearLabel, emptyLabel, upsertFront, removeKind,
} from '../../src/app/pages/search-v2/search-v2-history.ts';

type E = { kind: 'buyer' | 'policy'; ts: number; id: string };
const items: E[] = [
  { kind: 'buyer',  ts: 1, id: 'b1' },
  { kind: 'policy', ts: 4, id: 'p1' },
  { kind: 'buyer',  ts: 3, id: 'b2' },
  { kind: 'policy', ts: 2, id: 'p2' },
];

test('byRecent sorts newest first without mutating', () => {
  assert.deepEqual(byRecent(items).map(e => e.id), ['p1', 'b2', 'p2', 'b1']);
  assert.equal(items[0].id, 'b1');
});

test('filterHistory all is one chronological thread', () => {
  assert.deepEqual(filterHistory(items, 'all').map(e => e.id), ['p1', 'b2', 'p2', 'b1']);
});

test('filterHistory by kind keeps only that kind, newest first', () => {
  assert.deepEqual(filterHistory(items, 'policy').map(e => e.id), ['p1', 'p2']);
  assert.deepEqual(filterHistory(items, 'buyer').map(e => e.id), ['b2', 'b1']);
});

test('groupByKind puts Buyers then Policies, each newest first', () => {
  const g = groupByKind(items);
  assert.deepEqual(g.map(x => x.label), ['Buyers', 'Policies']);
  assert.deepEqual(g[0].items.map(e => e.id), ['b2', 'b1']);
  assert.deepEqual(g[1].items.map(e => e.id), ['p1', 'p2']);
});

test('groupByKind drops an empty group', () => {
  const g = groupByKind(items.filter(e => e.kind === 'policy'));
  assert.deepEqual(g.map(x => x.label), ['Policies']);
});

test('countByKind', () => {
  assert.deepEqual(countByKind(items), { all: 4, buyer: 2, policy: 2 });
  assert.deepEqual(countByKind([]), { all: 0, buyer: 0, policy: 0 });
});

test('clearLabel follows the filter', () => {
  assert.equal(clearLabel('all'), 'Clear all');
  assert.equal(clearLabel('buyer'), 'Clear buyers');
  assert.equal(clearLabel('policy'), 'Clear policies');
});

test('emptyLabel per tab and filter', () => {
  assert.equal(emptyLabel('searched', 'all'), 'No recent search');
  assert.equal(emptyLabel('searched', 'policy'), 'No policy search yet');
  assert.equal(emptyLabel('viewed', 'buyer'), 'No buyer viewed yet');
  assert.equal(emptyLabel('favorites', 'policy'), 'No favorite policy yet');
});

test('upsertFront moves a known entry to the front and caps the list', () => {
  const key = (e: E) => e.id;
  const next = upsertFront(items, { kind: 'buyer', ts: 9, id: 'b1' }, key, 3);
  assert.deepEqual(next.map(e => e.id), ['b1', 'p1', 'b2']);
  assert.equal(next[0].ts, 9);
});

test('clearKind keeps the other kind', () => {
  assert.deepEqual(removeKind(items, 'policy').map(e => e.id), ['b1', 'b2']);
  assert.deepEqual(removeKind(items), []);
});
```

- [ ] **Step 2: Lancer le test, vérifier l'échec**

Run: `node --test tests/search-v2/`
Expected: FAIL, `Cannot find module '…/search-v2-history.ts'`.

- [ ] **Step 3: Écrire le module**

`src/app/pages/search-v2/search-v2-history.ts` :

```ts
/** Logique des historiques de la Search V2 (Recent search, Recently viewed,
 *  Favorites). Module pur, sans Angular : la page et les stores l'appellent,
 *  les tests node le lisent directement. */

export type HistoryKind = 'buyer' | 'policy';
export type HistoryFilter = 'all' | HistoryKind;
export type HistoryTab = 'searched' | 'viewed' | 'favorites';

export interface Stamped { kind: HistoryKind; ts: number; }

export interface HistoryGroup<T> {
  kind: HistoryKind;
  label: 'Buyers' | 'Policies';
  items: T[];
}

/** Du plus récent au plus ancien, sur une copie. */
export function byRecent<T extends { ts: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.ts - a.ts);
}

/** All = un seul fil chronologique ; sinon le seul objet demandé. */
export function filterHistory<T extends Stamped>(items: T[], f: HistoryFilter): T[] {
  return byRecent(f === 'all' ? items : items.filter(i => i.kind === f));
}

/** Favorites en All : Buyers puis Policies, chaque section triée, section vide omise. */
export function groupByKind<T extends Stamped>(items: T[]): HistoryGroup<T>[] {
  const groups: HistoryGroup<T>[] = [
    { kind: 'buyer',  label: 'Buyers',   items: filterHistory(items, 'buyer') },
    { kind: 'policy', label: 'Policies', items: filterHistory(items, 'policy') },
  ];
  return groups.filter(g => g.items.length > 0);
}

export function countByKind(items: Stamped[]): Record<HistoryFilter, number> {
  const buyer = items.filter(i => i.kind === 'buyer').length;
  return { all: items.length, buyer, policy: items.length - buyer };
}

/** Clear n'efface que ce qui est affiché. */
export function clearLabel(f: HistoryFilter): string {
  return f === 'all' ? 'Clear all' : f === 'buyer' ? 'Clear buyers' : 'Clear policies';
}

const EMPTY: Record<HistoryTab, Record<HistoryFilter, string>> = {
  searched: {
    all:    'No recent search',
    buyer:  'No buyer search yet',
    policy: 'No policy search yet',
  },
  viewed: {
    all:    'Nothing viewed yet. Open a buyer or a policy to find it here',
    buyer:  'No buyer viewed yet',
    policy: 'No policy viewed yet',
  },
  favorites: {
    all:    'No favorites yet. Star a result to add it here',
    buyer:  'No favorite buyer yet',
    policy: 'No favorite policy yet',
  },
};

export function emptyLabel(tab: HistoryTab, f: HistoryFilter): string {
  return EMPTY[tab][f];
}

/** Ajoute en tête ; une entrée de même clé remonte au lieu d'être dupliquée. */
export function upsertFront<T extends { ts: number }>(list: T[], entry: T, key: (e: T) => string, max: number): T[] {
  const k = key(entry);
  return [entry, ...list.filter(e => key(e) !== k)].slice(0, max);
}

/** Sans kind : tout. Avec kind : seulement cet objet, l'autre reste. */
export function removeKind<T extends Stamped>(list: T[], kind?: HistoryKind): T[] {
  return kind ? list.filter(e => e.kind !== kind) : [];
}
```

- [ ] **Step 4: Lancer le test, vérifier le succès**

Run: `node --test tests/search-v2/`
Expected: PASS, 21 tests au total.

- [ ] **Step 5: Commit**

```bash
git add tests/search-v2/search-v2-history.test.ts src/app/pages/search-v2/search-v2-history.ts
git commit -m "feat(search-v2): history filter, grouping and labels"
```

---

### Task 3: Stores V2 (recherches récentes, policies vues, favoris)

**Files:**
- Create: `src/app/pages/search-v2/search-v2-recents.model.ts`
- Create: `src/app/pages/search-v2/search-v2-recents.store.ts`
- Create: `src/app/pages/search-v2/search-v2-viewed.store.ts`
- Create: `src/app/pages/search-v2/search-v2-favorites.store.ts`
- Test: `tests/search-v2/search-v2-recents.test.ts`

**Interfaces:**
- Consumes: `upsertFront`, `removeKind`, `HistoryKind` (Task 2) ; `PolicyResultData` (Task 1) ; `PolicyCriteriaValues` (Task 1) ; V1 types `SearchType`, `IdTypeOption` (`shared/ui/search-bar-multi/search-bar-multi.component`), `FlagCode`, `MoreCriteriaValues`, `ResultCardData` (lecture seule).
- Produces:
  - `BuyerRecentV2 { kind: 'buyer'; type: SearchType; query; country: FlagCode | null; idType: IdTypeOption | null; criteria: MoreCriteriaValues; ts }`
  - `PolicyRecentV2 { kind: 'policy'; buCode: string | null; query; criteria: PolicyCriteriaValues; ts }`
  - `RecentV2Entry = BuyerRecentV2 | PolicyRecentV2`, `RecentV2Input` (même union sans `ts`)
  - `recentKey(e: RecentV2Input): string`
  - `SearchV2RecentsStore { entries: Signal<RecentV2Entry[]>; record(e: RecentV2Input); clear(kind?: HistoryKind) }`
  - `ViewedPolicy { kind: 'policy'; id: string; policy: PolicyResultData; ts }`, `SearchV2ViewedStore { entries; record(p: PolicyResultData); clear() }`
  - `FavoriteV2 = { kind: 'buyer'; id: string; buyer: ResultCardData; ts } | { kind: 'policy'; id: string; policy: PolicyResultData; ts }`
  - `SearchV2FavoritesStore { entries; has(kind, id): boolean; toggle(f: FavoriteV2Input); clear(kind?: HistoryKind) }`

- [ ] **Step 1: Écrire le test qui échoue**

`tests/search-v2/search-v2-recents.test.ts` :

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recentKey } from '../../src/app/pages/search-v2/search-v2-recents.model.ts';

const buyerCrit = { statuses: [], extendCountry: false, street: '', city: '', region: '', zip: '', phone: '' };
const policyCrit = { searchIn: 'policies' as const, statuses: ['issued' as const], extension: '' };

test('recentKey distinguishes kinds and criteria', () => {
  const b = recentKey({ kind: 'buyer', type: 'name', query: 'marais', country: null, idType: null, criteria: buyerCrit });
  const p = recentKey({ kind: 'policy', buCode: null, query: 'marais', criteria: policyCrit });
  const p2 = recentKey({ kind: 'policy', buCode: 'AT USA', query: 'marais', criteria: policyCrit });
  const p3 = recentKey({ kind: 'policy', buCode: null, query: 'marais', criteria: { ...policyCrit, searchIn: 'drafts' } });
  assert.notEqual(b, p);
  assert.notEqual(p, p2);
  assert.notEqual(p, p3);
});

test('recentKey ignores status order', () => {
  const a = recentKey({ kind: 'policy', buCode: null, query: 'x', criteria: { ...policyCrit, statuses: ['issued', 'expired'] } });
  const b = recentKey({ kind: 'policy', buCode: null, query: 'x', criteria: { ...policyCrit, statuses: ['expired', 'issued'] } });
  assert.equal(a, b);
});
```

- [ ] **Step 2: Lancer le test, vérifier l'échec**

Run: `node --test tests/search-v2/`
Expected: FAIL, `Cannot find module '…/search-v2-recents.model.ts'`.

- [ ] **Step 3: Écrire le modèle des recherches récentes**

`src/app/pages/search-v2/search-v2-recents.model.ts` :

```ts
import type { SearchType, IdTypeOption } from '../../shared/ui/search-bar-multi/search-bar-multi.component';
import type { FlagCode } from '../../shared/ui/flag/flag.component';
import type { MoreCriteriaValues } from '../../shared/ui/more-criteria/more-criteria.component';
import type { PolicyCriteriaValues } from '../../shared/ui/policy-criteria/policy-criteria.model';

/** Une recherche buyer passée : mêmes champs que l'entrée V1, plus son objet. */
export interface BuyerRecentV2 {
  kind: 'buyer';
  type: SearchType;
  query: string;
  country: FlagCode | null;
  idType: IdTypeOption | null;
  criteria: MoreCriteriaValues;
  ts: number;
}

/** Une recherche policy passée, avec tout ce qui la distingue d'une autre. */
export interface PolicyRecentV2 {
  kind: 'policy';
  buCode: string | null;
  query: string;
  criteria: PolicyCriteriaValues;
  ts: number;
}

export type RecentV2Entry = BuyerRecentV2 | PolicyRecentV2;
export type RecentV2Input = Omit<BuyerRecentV2, 'ts'> | Omit<PolicyRecentV2, 'ts'>;

/** Signature d'une recherche. Deux entrées ne coexistent que si un critère les distingue. */
export function recentKey(e: RecentV2Input): string {
  if (e.kind === 'buyer') {
    const c = e.criteria;
    return JSON.stringify([
      'buyer', e.type, e.query, e.country, e.idType,
      [...c.statuses].sort(), c.extendCountry, c.street, c.city, c.region, c.zip, c.phone,
    ]);
  }
  const c = e.criteria;
  return JSON.stringify(['policy', e.buCode, e.query, c.searchIn, [...c.statuses].sort(), c.extension]);
}
```

- [ ] **Step 4: Lancer le test, vérifier le succès**

Run: `node --test tests/search-v2/`
Expected: PASS, 23 tests au total.

- [ ] **Step 5: Écrire les trois stores**

`src/app/pages/search-v2/search-v2-recents.store.ts` :

```ts
import { Injectable, signal } from '@angular/core';
import { recentKey, type RecentV2Entry, type RecentV2Input } from './search-v2-recents.model';
import { upsertFront, removeKind, type HistoryKind } from './search-v2-history';

/** Les deux objets partagent la liste : 20 laisse de la place à chacun. */
const MAX_RECENTS = 20;

/**
 * Recherches passées de la V2, buyers et policies mêlées. Singleton root,
 * séparé du store V1 : la V1 garde son historique intact.
 */
@Injectable({ providedIn: 'root' })
export class SearchV2RecentsStore {
  readonly entries = signal<RecentV2Entry[]>([]);

  /** Une recherche sans saisie n'est pas retenue, comme en V1. */
  record(entry: RecentV2Input): void {
    if (!entry.query.trim()) return;
    const next = { ...entry, ts: Date.now() } as RecentV2Entry;
    this.entries.update(list => upsertFront(list, next, recentKey, MAX_RECENTS));
  }

  clear(kind?: HistoryKind): void {
    this.entries.update(list => removeKind(list, kind));
  }
}
```

`src/app/pages/search-v2/search-v2-viewed.store.ts` :

```ts
import { Injectable, signal } from '@angular/core';
import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import { upsertFront } from './search-v2-history';

export interface ViewedPolicy {
  kind: 'policy';
  id: string;
  policy: PolicyResultData;
  ts: number;
}

const MAX_VIEWED = 10;

/**
 * Policies ouvertes depuis la V2. Les buyers consultés restent dans
 * ViewedBuyersStore (alimenté par la page Buyer Summary) : la page fusionne.
 */
@Injectable({ providedIn: 'root' })
export class SearchV2ViewedStore {
  readonly entries = signal<ViewedPolicy[]>([]);

  record(policy: PolicyResultData): void {
    const entry: ViewedPolicy = { kind: 'policy', id: policy.id, policy, ts: Date.now() };
    this.entries.update(list => upsertFront(list, entry, e => e.id, MAX_VIEWED));
  }

  clear(): void {
    this.entries.set([]);
  }
}
```

`src/app/pages/search-v2/search-v2-favorites.store.ts` :

```ts
import { Injectable, signal } from '@angular/core';
import type { ResultCardData } from '../../shared/ui/result-card/result-card.component';
import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import { removeKind, type HistoryKind } from './search-v2-history';

export type FavoriteV2 =
  | { kind: 'buyer';  id: string; buyer: ResultCardData;   ts: number }
  | { kind: 'policy'; id: string; policy: PolicyResultData; ts: number };

export type FavoriteV2Input =
  | Omit<Extract<FavoriteV2, { kind: 'buyer' }>, 'ts'>
  | Omit<Extract<FavoriteV2, { kind: 'policy' }>, 'ts'>;

/** Favoris V2, buyers (clé Company ID) et policies (clé n°-extension), avec
 *  leur date d'ajout pour trier les sections de l'onglet Favorites. */
@Injectable({ providedIn: 'root' })
export class SearchV2FavoritesStore {
  readonly entries = signal<FavoriteV2[]>([]);

  has(kind: HistoryKind, id: string): boolean {
    return this.entries().some(f => f.kind === kind && f.id === id);
  }

  toggle(fav: FavoriteV2Input): void {
    if (this.has(fav.kind, fav.id)) {
      this.entries.update(list => list.filter(f => !(f.kind === fav.kind && f.id === fav.id)));
      return;
    }
    this.entries.update(list => [{ ...fav, ts: Date.now() } as FavoriteV2, ...list]);
  }

  clear(kind?: HistoryKind): void {
    this.entries.update(list => removeKind(list, kind));
  }
}
```

- [ ] **Step 6: Vérifier la compilation**

Run: `npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep search-v2`
Expected: aucune ligne.

- [ ] **Step 7: Commit**

```bash
git add tests/search-v2/search-v2-recents.test.ts src/app/pages/search-v2/search-v2-recents.model.ts src/app/pages/search-v2/search-v2-recents.store.ts src/app/pages/search-v2/search-v2-viewed.store.ts src/app/pages/search-v2/search-v2-favorites.store.ts
git commit -m "feat(search-v2): recents, viewed and favorites stores"
```

---

### Task 4: `ds-policy-criteria` (More criteria version Policies)

**Files:**
- Create: `src/app/shared/ui/policy-criteria/policy-criteria.component.ts`
- Create: `src/app/shared/ui/policy-criteria/policy-criteria.component.html`
- Create: `src/app/shared/ui/policy-criteria/policy-criteria.component.scss`
- Create: `src/app/shared/ui/policy-criteria/policy-criteria.stories.ts`
- Modify: `src/app/shared/ui/index.ts` (ajout en fin de fichier)

**Interfaces:**
- Consumes: `PolicyCriteriaValues`, `POLICY_STATUSES`, `defaultPolicyCriteria` (Task 1).
- Produces: `<ds-policy-criteria [(value)]="…" (closed)="…" />`, classe `PolicyCriteriaComponent`.

- [ ] **Step 1: Composant**

`policy-criteria.component.ts` :

```ts
import { Component, computed, model, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { TagComponent } from '../tag/tag.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { DividerComponent } from '../divider/divider.component';
import { SegmentedControlComponent, type SegmentedOption } from '../segmented-control/segmented-control.component';
import type { PolicyStatus } from '../policy-result-card/policy.model';
import { POLICY_STATUSES, defaultPolicyCriteria, type PolicyCriteriaValues } from './policy-criteria.model';

export * from './policy-criteria.model';

/**
 * More criteria d'une recherche Policies. Même coque que ds-more-criteria
 * (en-tête, divider, rangées libellé + contrôle), contenu propre aux polices.
 */
@Component({
  selector: 'ds-policy-criteria',
  standalone: true,
  imports: [IconComponent, ButtonComponent, ButtonIconComponent, TagComponent, InputTextComponent, DividerComponent, SegmentedControlComponent],
  templateUrl: './policy-criteria.component.html',
  styleUrl: './policy-criteria.component.scss',
  host: { class: 'ds-policy-criteria' },
})
export class PolicyCriteriaComponent {
  value = model<PolicyCriteriaValues>(defaultPolicyCriteria());
  closed = output<void>();

  readonly statuses = POLICY_STATUSES;
  readonly searchInOptions: SegmentedOption[] = [
    { value: 'policies', label: 'Policies' },
    { value: 'drafts',   label: 'Drafts' },
  ];

  /** Un draft n'a pas de statut : les tags restent visibles, désactivés, avec la raison. */
  statusDisabled = computed(() => this.value().searchIn === 'drafts');

  setSearchIn(v: string) {
    this.value.update(c => ({ ...c, searchIn: v === 'drafts' ? 'drafts' : 'policies' }));
  }

  isSelected(id: PolicyStatus) {
    return this.value().statuses.includes(id);
  }

  toggleStatus(id: PolicyStatus) {
    if (this.statusDisabled()) return;
    this.value.update(c => ({
      ...c,
      statuses: c.statuses.includes(id) ? c.statuses.filter(s => s !== id) : [...c.statuses, id],
    }));
  }

  setExtension(v: string) {
    this.value.update(c => ({ ...c, extension: v }));
  }

  reset() {
    this.value.set(defaultPolicyCriteria());
  }
}
```

`policy-criteria.component.html` :

```html
<div class="ds-policy-criteria__header">
  <h3 class="ds-policy-criteria__title">More criteria</h3>
  <div class="ds-policy-criteria__actions">
    <ds-button type="plain" tone="accent" (clicked)="reset()">
      <ds-icon slot="icon-left" name="refresh" [size]="16" />
      Reset
    </ds-button>
    <ds-button-icon type="plain" tone="accent" ariaLabel="Close" (clicked)="closed.emit()">
      <ds-icon name="close" [size]="16" />
    </ds-button-icon>
  </div>
</div>
<ds-divider class="ds-policy-criteria__divider" />

<div class="ds-policy-criteria__body">
  <div class="ds-policy-criteria__row">
    <span class="ds-policy-criteria__label" id="ds-policy-criteria-search-in">Search in</span>
    <ds-segmented-control
      mode="radio"
      ariaLabel="Search in"
      [options]="searchInOptions"
      [selected]="value().searchIn"
      (selectedChange)="setSearchIn($event)"
    />
  </div>

  <div class="ds-policy-criteria__row">
    <span class="ds-policy-criteria__label">Status</span>
    <div class="ds-policy-criteria__chips" role="group" aria-label="Status"
         [attr.aria-describedby]="statusDisabled() ? 'ds-policy-criteria-status-hint' : null">
      @for (s of statuses; track s.id) {
        <ds-tag
          type="select"
          [label]="s.label"
          [selected]="isSelected(s.id)"
          [disabled]="statusDisabled()"
          (toggled)="toggleStatus(s.id)"
        />
      }
    </div>
    @if (statusDisabled()) {
      <span class="ds-policy-criteria__hint" id="ds-policy-criteria-status-hint">Drafts have no status yet</span>
    }
  </div>

  <div class="ds-policy-criteria__row">
    <ds-input-text
      class="ds-policy-criteria__field"
      label="Extension"
      placeholder="e.g. 01"
      inputmode="numeric"
      [optional]="true"
      [value]="value().extension"
      (valueChange)="setExtension($event)"
    />
  </div>
</div>
```

`policy-criteria.component.scss` : copier `src/app/shared/ui/more-criteria/more-criteria.component.scss` puis remplacer le préfixe, et ajouter les deux règles ci-dessous.

```bash
sed 's/ds-more-criteria/ds-policy-criteria/g' src/app/shared/ui/more-criteria/more-criteria.component.scss > src/app/shared/ui/policy-criteria/policy-criteria.component.scss
```

Ajouter en fin de fichier :

```scss
// Raison d'un contrôle désactivé : toujours lisible, jamais seulement grisée
.ds-policy-criteria__hint {
  font-family: var(--semantic-font-family);
  font-size:   var(--semantic-font-text-style-size-s);
  line-height: var(--semantic-font-text-style-line-height-s);
  color:       var(--semantic-color-static-text-main-secondary);
}

// Extension : champ court (plus grand pas d'espacement Foundation) ; le
// libellé semi-bold est déjà porté par ds-input-text et tient sur une ligne
.ds-policy-criteria__field {
  width: calc(var(--foundation-spacing-104) * 2);
}
```

- [ ] **Step 2: Story**

`policy-criteria.stories.ts` :

```ts
import type { Meta, StoryObj } from '@storybook/angular';
import { PolicyCriteriaComponent } from './policy-criteria.component';

const meta: Meta<PolicyCriteriaComponent> = {
  title: 'Design System/Data Entry/Policy Criteria',
  component: PolicyCriteriaComponent,
  tags: ['autodocs'],
  argTypes: { closed: { action: 'closed' } },
};

export default meta;
type Story = StoryObj<PolicyCriteriaComponent>;

export const Default: Story = {};

export const Drafts: Story = {
  args: { value: { searchIn: 'drafts', statuses: ['issued'], extension: '' } },
};
```

- [ ] **Step 3: Export**

Ajouter en fin de `src/app/shared/ui/index.ts` :

```ts
export * from './policy-criteria/policy-criteria.component';
```

- [ ] **Step 4: Vérifier**

Run: `npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep -i policy-criteria` → aucune ligne.
Run: `grep -nE "#[0-9a-fA-F]{3,6}|[0-9]+px" src/app/shared/ui/policy-criteria/policy-criteria.component.scss` → seules les lignes copiées de `ds-more-criteria` (ex. `width: 80px` du libellé) ; les signaler en revue sans les modifier.

- [ ] **Step 5: Commit**

```bash
git add src/app/shared/ui/policy-criteria src/app/shared/ui/index.ts
git commit -m "feat(design-system): policy criteria panel"
```

---

### Task 5: `ds-policy-result-card`

**Files:**
- Create: `src/app/shared/ui/policy-result-card/policy-result-card.component.ts`
- Create: `src/app/shared/ui/policy-result-card/policy-result-card.component.html`
- Create: `src/app/shared/ui/policy-result-card/policy-result-card.component.scss`
- Create: `src/app/shared/ui/policy-result-card/policy-result-card.stories.ts`
- Modify: `src/app/shared/ui/index.ts`

**Interfaces:**
- Consumes: `PolicyResultData`, `POLICY_STATUS_LABELS` (Task 1).
- Produces: `<ds-policy-result-card [data] [open] [favorited] (toggled) (starred) (opened) />`, classe `PolicyResultCardComponent`.

- [ ] **Step 1: Composant**

`policy-result-card.component.ts` :

```ts
import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconTileComponent } from '../icon-tile/icon-tile.component';
import { LinkComponent } from '../link/link.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { BadgeComponent, type BadgeStatus } from '../badge/badge.component';
import { IdentifierComponent } from '../identifier/identifier.component';
import { DividerComponent } from '../divider/divider.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { PropertiesPanelComponent, type PropertySection } from '../properties-panel/properties-panel.component';
import { POLICY_STATUS_LABELS, type PolicyResultData } from './policy.model';

export * from './policy.model';

/**
 * Résultat de recherche d'une police. Même enveloppe et même rangée d'actions
 * que ds-result-card : un buyer et une police se lisent pareil dans une liste.
 */
@Component({
  selector: 'ds-policy-result-card',
  standalone: true,
  imports: [IconComponent, IconTileComponent, LinkComponent, ButtonIconComponent, BadgeComponent, IdentifierComponent, DividerComponent, TooltipDirective, PropertiesPanelComponent],
  templateUrl: './policy-result-card.component.html',
  styleUrl: './policy-result-card.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class PolicyResultCardComponent {
  data = input.required<PolicyResultData>();
  open = input<boolean>(false);
  favorited = input<boolean>(false);

  toggled = output<void>();
  starred = output<void>();
  opened = output<void>();

  hostClasses = computed(() => ['ds-policy-result-card', this.open() ? 'ds-policy-result-card--open' : ''].filter(Boolean).join(' '));

  title = computed(() => {
    const d = this.data();
    return d.kind === 'draft' ? `Draft ${d.policyNumber}` : `Policy ${d.policyNumber}-${d.extension}`;
  });

  badge = computed<{ label: string; status: BadgeStatus }>(() => {
    const d = this.data();
    if (d.kind === 'draft' || !d.status) return { label: 'Draft', status: 'info' };
    const status: BadgeStatus = d.status === 'issued' ? 'success' : d.status === 'cancelled' ? 'error' : 'neutral';
    return { label: POLICY_STATUS_LABELS[d.status], status };
  });

  period = computed(() => `${this.data().effectiveDate} → ${this.data().expiryDate}`);

  hasDetails = computed(() => !!this.data().details?.length);

  detailSections = computed<PropertySection[]>(() => [
    { rows: (this.data().details ?? []).map(r => ({ label: r.label, value: r.value })) },
  ]);

  onOpen(ev: Event) {
    ev.preventDefault();
    this.opened.emit();
  }
}
```

`policy-result-card.component.html` :

```html
<div class="ds-policy-result-card__main">
  <div class="ds-policy-result-card__left">
    <ds-icon-tile size="m" tone="brand">
      <ds-icon name="contract" [size]="24" />
    </ds-icon-tile>
    <div class="ds-policy-result-card__info">
      <div class="ds-policy-result-card__name-row">
        <ds-link
          href="#"
          weight="semi-bold"
          dsTooltip="Open the policy"
          dsTooltipPosition="top-center"
          (click)="onOpen($event)"
        >{{ title() }}</ds-link>
        <ds-badge [label]="badge().label" [status]="badge().status" />
        <ds-identifier [value]="data().id" icon="hash" [copyable]="true" />
      </div>
      <span class="ds-policy-result-card__holder">{{ data().policyholder }} · {{ data().buCode }}</span>
      <span class="ds-policy-result-card__period">{{ period() }}</span>
    </div>
  </div>

  <div class="ds-policy-result-card__actions">
    <ds-button-icon
      type="plain"
      tone="accent"
      [ariaLabel]="favorited() ? 'Unfavorite' : 'Favorite'"
      class="ds-policy-result-card__star"
      [class.ds-policy-result-card__star--on]="favorited()"
      dsTooltip="Add to favorite"
      dsTooltipPosition="top-center"
      (clicked)="starred.emit()"
    >
      <ds-icon [name]="favorited() ? 'star-filled' : 'star'" [size]="20" />
    </ds-button-icon>
    <ds-button-icon type="plain" tone="accent" ariaLabel="Toggle details"
      [disabled]="!hasDetails()"
      (clicked)="hasDetails() && toggled.emit()">
      <ds-icon [name]="open() ? 'chevron-up' : 'chevron-down'" [size]="20" />
    </ds-button-icon>
  </div>
</div>

@if (open()) {
  <ds-divider class="ds-policy-result-card__divider" />
  <div class="ds-policy-result-card__details">
    <ds-properties-panel [sections]="detailSections()" [columns]="3" variant="flat" />
  </div>
}
```

Note : le titre en `ds-link` sert d'action Open, exactement comme le nom du buyer dans `ds-result-card`. Un bouton « Open » en plus doublerait l'action ; la spec dit « Open », le lien en est la forme du design system.

`policy-result-card.component.scss` : partir de `result-card.component.scss`.

```bash
sed 's/ds-result-card/ds-policy-result-card/g' src/app/shared/ui/result-card/result-card.component.scss > src/app/shared/ui/policy-result-card/policy-result-card.component.scss
```

Puis dans le fichier copié : supprimer les blocs `__score*`, `__add*`, `__col*`, `__name`, `__sep`, `__city` (sans usage ici), renommer `__address` en `__holder`, renommer `__right` en `__actions` (garder ses déclarations, retirer l'ancien bloc `__actions` s'il fait doublon), et ajouter :

```scss
.ds-policy-result-card__period {
  color:       var(--semantic-color-static-text-main-tertiary);
  font-family: var(--semantic-font-family);
  font-size:   var(--semantic-font-text-style-size-m);
  line-height: var(--semantic-font-text-style-line-height-m);
}
```

Le `gap: 11px` de `__name-row` hérité de la V1 est une valeur en dur : le remplacer par `var(--semantic-measurement-spacing-s)` dans la copie.

- [ ] **Step 2: Story**

`policy-result-card.stories.ts` :

```ts
import type { Meta, StoryObj } from '@storybook/angular';
import { PolicyResultCardComponent } from './policy-result-card.component';
import type { PolicyResultData } from './policy.model';

const issued: PolicyResultData = {
  id: '5012346-01', policyNumber: '5012346', extension: '01', kind: 'policy', status: 'issued',
  policyholder: 'Brooklyn Craft Goods LLC', buCode: 'AT USA',
  effectiveDate: '01 Jan 2026', expiryDate: '31 Dec 2026',
  details: [
    { label: 'Covered amount', value: '$2 000 000' },
    { label: 'Currency', value: 'USD' },
    { label: 'Covered buyers', value: '14' },
  ],
};

const meta: Meta<PolicyResultCardComponent> = {
  title: 'Design System/Data Display/Policy Result Card',
  component: PolicyResultCardComponent,
  tags: ['autodocs'],
  argTypes: { toggled: { action: 'toggled' }, starred: { action: 'starred' }, opened: { action: 'opened' } },
  args: { data: issued },
};

export default meta;
type Story = StoryObj<PolicyResultCardComponent>;

export const Issued: Story = {};
export const Open: Story = { args: { open: true, favorited: true } };
export const Cancelled: Story = { args: { data: { ...issued, id: '5012391-00', status: 'cancelled' } } };
export const Expired: Story = { args: { data: { ...issued, id: '5012346-00', status: 'expired' } } };
export const Draft: Story = { args: { data: { ...issued, id: 'D-20433-00', policyNumber: 'D-20433', extension: '00', kind: 'draft', status: null } } };
```

- [ ] **Step 3: Export**

Ajouter en fin de `src/app/shared/ui/index.ts` :

```ts
export * from './policy-result-card/policy-result-card.component';
```

`policy-criteria.component.ts` réexporte `policy-criteria.model` et `policy-result-card.component.ts` réexporte `policy.model` : vérifier qu'aucun nom n'est exporté deux fois depuis `index.ts` (`npx tsc` le signalerait en erreur TS2308).

- [ ] **Step 4: Vérifier**

Run: `npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep -i policy` → aucune ligne.
Run: `npm run storybook` puis ouvrir « Policy Result Card » : les 5 stories s'affichent, le badge change de couleur selon le statut, le dépliage montre 3 propriétés.

- [ ] **Step 5: Commit**

```bash
git add src/app/shared/ui/policy-result-card src/app/shared/ui/index.ts
git commit -m "feat(design-system): policy result card"
```

---

### Task 6: `ds-search-bar-scoped`

**Files:**
- Create: `src/app/shared/ui/search-bar-scoped/search-bar-scoped.component.ts`
- Create: `src/app/shared/ui/search-bar-scoped/search-bar-scoped.component.html`
- Create: `src/app/shared/ui/search-bar-scoped/search-bar-scoped.component.scss`
- Create: `src/app/shared/ui/search-bar-scoped/search-bar-scoped.stories.ts`
- Modify: `src/app/shared/ui/index.ts`

**Interfaces:**
- Consumes: `SearchType`, `IdTypeOption`, `SEARCH_TYPES`, `COUNTRIES`, `ID_TYPES`, `DIAL_CODES` importés depuis `../search-bar-multi/search-bar-multi.component` (V1, lecture seule) ; `BU_CODES` (Task 1).
- Produces:
  - `SearchScope = 'buyers' | 'policies'`
  - `<ds-search-bar-scoped [scope] (scopeChange) [(type)] [(country)] [(idType)] [(buCode)] [(query)] [criteriaCount] (moreCriteriaClicked) (searchClicked) />`

- [ ] **Step 1: Composant**

`search-bar-scoped.component.ts` :

```ts
import { Component, ElementRef, HostListener, computed, inject, input, model, output, signal } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { StandaloneDropdownComponent } from '../standalone-dropdown/standalone-dropdown.component';
import { ButtonComponent } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../flyout-menu/flyout-menu-item.component';
import { FlagComponent, type FlagCode } from '../flag/flag.component';
import { DividerComponent } from '../divider/divider.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { InputTextComponent } from '../input-text/input-text.component';
import { InputSearchComponent } from '../input-search/input-search.component';
import {
  SEARCH_TYPES, COUNTRIES, ID_TYPES, DIAL_CODES,
  type SearchType, type IdTypeOption,
} from '../search-bar-multi/search-bar-multi.component';
import { BU_CODES } from '../policy-result-card/policy.model';

export type SearchScope = 'buyers' | 'policies';

const SCOPES: { id: SearchScope; label: string; icon: IconName }[] = [
  { id: 'buyers',   label: 'Buyers',   icon: 'buyers' },
  { id: 'policies', label: 'Policies', icon: 'contract' },
];

const BUYER_PLACEHOLDERS: Record<SearchType, string> = {
  'company-id': 'Enter a company ID (e.g. 113, 184...)',
  'id':         'Enter a company ID (e.g. 113, 184...)',
  'name':       'Enter a company name',
  'phone':      'Enter a phone number',
  'manager':    'Enter a manager name',
};

/**
 * Barre de recherche à objet. Le premier slot choisit ce qu'on cherche ;
 * les slots suivants en dépendent. Côté Buyers, mêmes règles que
 * ds-search-bar-multi (types et listes importés, pas redéclarés). Côté
 * Policies : BU (optionnelle) puis un champ unique, n° ou mot-clé.
 */
@Component({
  selector: 'ds-search-bar-scoped',
  standalone: true,
  imports: [IconComponent, StandaloneDropdownComponent, ButtonComponent, ButtonIconComponent, FlyoutMenuComponent, FlyoutMenuItemComponent, FlagComponent, DividerComponent, TooltipDirective, InputTextComponent, InputSearchComponent],
  templateUrl: './search-bar-scoped.component.html',
  styleUrl: './search-bar-scoped.component.scss',
  host: { class: 'ds-search-bar-scoped' },
})
export class SearchBarScopedComponent {
  scope   = model<SearchScope>('buyers');
  type    = model<SearchType>('company-id');
  country = model<FlagCode | null>(null);
  idType  = model<IdTypeOption | null>(null);
  buCode  = model<string | null>(null);
  query   = model<string>('');
  criteriaCount = input<number>(0);

  searchClicked = output<void>();
  moreCriteriaClicked = output<void>();

  openFlyout = signal<'scope' | 'type' | 'country' | 'id-type' | 'bu' | null>(null);
  buFilter = signal<string>('');

  readonly scopes = SCOPES;
  readonly searchTypes = SEARCH_TYPES;
  readonly countries = COUNTRIES;
  readonly idTypes = ID_TYPES;

  isBuyers = computed(() => this.scope() === 'buyers');
  scopeMeta = computed(() => SCOPES.find(s => s.id === this.scope())!);
  typeMeta = computed(() => SEARCH_TYPES.find(t => t.id === this.type())!);

  placeholder = computed(() => this.isBuyers() ? BUYER_PLACEHOLDERS[this.type()] : 'Policy number or keyword');

  // ── Buyers : règles reprises de ds-search-bar-multi ───────────────────
  countryVisible = computed(() => this.isBuyers() && this.type() !== 'company-id');
  countryEnabled = computed(() => ['id', 'name', 'phone'].includes(this.type()));
  idTypeVisible  = computed(() => this.isBuyers() && this.type() === 'id');
  idTypeEnabled  = computed(() => this.idTypeVisible() && !!this.country());
  countryLabel = computed(() => {
    const c = this.country();
    return c ? (COUNTRIES.find(x => x.code === c)?.label ?? 'Select a country') : 'Select a country';
  });
  idTypeLabel = computed(() => this.idType() ?? 'ID Type');
  idTypeTooltip = computed(() => this.idTypeVisible() && !this.country() ? 'Select a country before choosing an ID Type' : '');
  phonePrefix = computed(() => {
    const c = this.country();
    return this.isBuyers() && this.type() === 'phone' && c ? DIAL_CODES[c] : null;
  });
  inputDisabled = computed(() => this.isBuyers() && this.type() === 'phone' && !this.country());

  /** Company ID = recherche interne, critères inutiles. Policies : toujours disponibles. */
  moreCriteriaEnabled = computed(() => !this.isBuyers() || this.type() !== 'company-id');
  moreCriteriaTooltip = computed(() => this.moreCriteriaEnabled() ? '' : 'Not available for a Company ID search');

  attempted = signal(false);
  countryError = computed(() => this.attempted() && this.countryEnabled() && this.countryVisible()
    && (this.type() === 'phone' || this.type() === 'id') && !this.country());
  idTypeError = computed(() => this.attempted() && this.idTypeEnabled() && !this.idType());
  /** La saisie n'est obligatoire que côté Buyers : une recherche Policies vide liste les filtres. */
  queryError = computed(() => this.attempted() && this.isBuyers() && !this.query().trim());

  searchValid = computed(() => {
    if (!this.isBuyers()) return true;
    if (!this.query().trim()) return false;
    if (this.type() === 'phone') return !!this.country();
    if (this.type() === 'id') return !!this.country() && !!this.idType();
    return true;
  });

  // ── Policies : BU ─────────────────────────────────────────────────────
  buLabel = computed(() => this.buCode() ?? 'All BUs');
  buOptions = computed(() => {
    const f = this.buFilter().trim().toLowerCase();
    return f ? BU_CODES.filter(b => b.toLowerCase().includes(f)) : BU_CODES;
  });

  private host = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent) {
    if (this.openFlyout() && !this.host.nativeElement.contains(ev.target as Node)) this.close();
  }

  toggle(which: 'scope' | 'type' | 'country' | 'id-type' | 'bu') {
    this.openFlyout.update(v => v === which ? null : which);
    if (which === 'bu') this.buFilter.set('');
  }
  close() { this.openFlyout.set(null); }

  /** Changer d'objet vide la saisie ; le parent vide les critères de l'objet quitté. */
  pickScope(s: SearchScope) {
    this.close();
    if (s === this.scope()) return;
    this.query.set('');
    this.attempted.set(false);
    this.scope.set(s);
  }

  pickType(t: SearchType) {
    this.type.set(t);
    if (!this.countryEnabled()) this.country.set(null);
    if (t !== 'id') this.idType.set(null);
    this.attempted.set(false);
    this.close();
  }
  pickCountry(c: FlagCode) { this.country.set(c); this.close(); }
  pickIdType(it: IdTypeOption) { this.idType.set(it); this.close(); }
  pickBu(b: string | null) { this.buCode.set(b); this.close(); }

  markTouched() { this.attempted.set(true); }
  clearQuery() { this.query.set(''); }

  submit() {
    if (this.searchValid()) this.searchClicked.emit();
    else this.attempted.set(true);
  }
}
```

`search-bar-scoped.component.html` :

```html
<div class="ds-search-bar-scoped__content">
  <!-- Slot 1 : l'objet cherché -->
  <div class="ds-search-bar-scoped__slot">
    <ds-standalone-dropdown [icon]="scopeMeta().icon" [label]="scopeMeta().label" (clicked)="toggle('scope')" />
    @if (openFlyout() === 'scope') {
      <div class="ds-search-bar-scoped__flyout">
        <ds-flyout-menu>
          @for (s of scopes; track s.id) {
            <ds-flyout-menu-item [label]="s.label" [icon]="s.icon" (clicked)="pickScope(s.id)" />
          }
        </ds-flyout-menu>
      </div>
    }
  </div>
  <ds-divider class="ds-search-bar-scoped__divider" orientation="vertical" />

  @if (isBuyers()) {
    <div class="ds-search-bar-scoped__slot">
      <ds-standalone-dropdown [icon]="typeMeta().icon" [label]="typeMeta().label" (clicked)="toggle('type')" />
      @if (openFlyout() === 'type') {
        <div class="ds-search-bar-scoped__flyout">
          <ds-flyout-menu>
            @for (t of searchTypes; track t.id) {
              <ds-flyout-menu-item [label]="t.label" [icon]="t.icon" (clicked)="pickType(t.id)" />
            }
          </ds-flyout-menu>
        </div>
      }
    </div>
    <ds-divider class="ds-search-bar-scoped__divider"
      [class.ds-search-bar-scoped__divider--error-adjacent]="countryError()" orientation="vertical" />

    @if (countryVisible()) {
      <div class="ds-search-bar-scoped__slot" [class.ds-search-bar-scoped__slot--error]="countryError()">
        @if (country(); as c) {
          <ds-standalone-dropdown [icon]="null" [label]="countryLabel()" [disabled]="!countryEnabled()" (clicked)="toggle('country')">
            <ds-flag slot="icon" [code]="c" />
          </ds-standalone-dropdown>
        } @else {
          <ds-standalone-dropdown icon="globe" [label]="countryLabel()" [disabled]="!countryEnabled()" (clicked)="toggle('country')" />
        }
        @if (openFlyout() === 'country') {
          <div class="ds-search-bar-scoped__flyout">
            <ds-flyout-menu>
              @for (c of countries; track c.code) {
                <ds-flyout-menu-item [label]="c.label" (clicked)="pickCountry(c.code)">
                  <ds-flag slot="icon" [code]="c.code" />
                </ds-flyout-menu-item>
              }
            </ds-flyout-menu>
          </div>
        }
        @if (countryError()) {
          <span class="ds-search-bar-scoped__error-msg">
            <ds-icon name="error-circle" [size]="16" /> This field is required
          </span>
        }
      </div>
      <ds-divider class="ds-search-bar-scoped__divider"
        [class.ds-search-bar-scoped__divider--error-adjacent]="idTypeVisible() ? idTypeError() : queryError()" orientation="vertical" />
    }

    @if (idTypeVisible()) {
      <div class="ds-search-bar-scoped__slot" [class.ds-search-bar-scoped__slot--error]="idTypeError()"
        [dsTooltip]="idTypeTooltip()" dsTooltipPosition="top-center">
        <ds-standalone-dropdown icon="hash" [label]="idTypeLabel()" [disabled]="!idTypeEnabled()" (clicked)="toggle('id-type')" />
        @if (openFlyout() === 'id-type') {
          <div class="ds-search-bar-scoped__flyout">
            <ds-flyout-menu>
              @for (it of idTypes; track it) {
                <ds-flyout-menu-item [label]="it" (clicked)="pickIdType(it)" />
              }
            </ds-flyout-menu>
          </div>
        }
        @if (idTypeError()) {
          <span class="ds-search-bar-scoped__error-msg">
            <ds-icon name="error-circle" [size]="16" /> This field is required
          </span>
        }
      </div>
      <ds-divider class="ds-search-bar-scoped__divider"
        [class.ds-search-bar-scoped__divider--error-adjacent]="queryError()" orientation="vertical" />
    }
  } @else {
    <!-- Policies : BU optionnelle, flyout filtrable -->
    <div class="ds-search-bar-scoped__slot">
      <ds-standalone-dropdown icon="tenant" [label]="buLabel()" (clicked)="toggle('bu')" />
      @if (openFlyout() === 'bu') {
        <div class="ds-search-bar-scoped__flyout ds-search-bar-scoped__flyout--bu">
          <ds-input-search class="ds-search-bar-scoped__bu-filter" placeholder="Search option" [(value)]="buFilter" />
          <ds-flyout-menu>
            <ds-flyout-menu-item label="All BUs" (clicked)="pickBu(null)" />
            @for (b of buOptions(); track b) {
              <ds-flyout-menu-item [label]="b" (clicked)="pickBu(b)" />
            }
          </ds-flyout-menu>
        </div>
      }
    </div>
    <ds-divider class="ds-search-bar-scoped__divider" orientation="vertical" />
  }

  <div class="ds-search-bar-scoped__slot ds-search-bar-scoped__field-slot" [class.ds-search-bar-scoped__slot--error]="queryError()">
    <div class="ds-search-bar-scoped__field"
      [class.ds-search-bar-scoped__field--disabled]="inputDisabled()"
      (focusout)="markTouched()"
      (keydown.enter)="submit()">
      <ds-icon name="search" [size]="24" class="ds-search-bar-scoped__field-icon" />
      @if (phonePrefix(); as p) {
        <span class="ds-search-bar-scoped__phone-prefix">{{ p }}</span>
      }
      <ds-input-text class="ds-search-bar-scoped__input" variant="inline"
        [placeholder]="placeholder()" [disabled]="inputDisabled()" [(value)]="query" />
      @if (query() && !inputDisabled()) {
        <ds-button-icon class="ds-search-bar-scoped__clear" type="plain" size="s" ariaLabel="Clear" (clicked)="clearQuery()">
          <ds-icon name="close" [size]="16" />
        </ds-button-icon>
      }
    </div>
    @if (queryError()) {
      <span class="ds-search-bar-scoped__error-msg">
        <ds-icon name="error-circle" [size]="16" /> This field is required
      </span>
    }
  </div>
  <ds-divider class="ds-search-bar-scoped__divider" orientation="vertical" />

  <span [dsTooltip]="moreCriteriaTooltip()" dsTooltipPosition="top-center">
    <ds-button type="tertiary" tone="accent" [disabled]="!moreCriteriaEnabled()"
      (clicked)="moreCriteriaEnabled() && moreCriteriaClicked.emit()">
      <ds-icon slot="icon-left" name="sliders" [size]="16" />
      More criteria ({{ criteriaCount() }})
    </ds-button>
  </span>
  <ds-button type="primary" [disabled]="!searchValid()" (clicked)="submit()">Search</ds-button>
</div>
```

`search-bar-scoped.component.scss` :

```bash
sed 's/ds-search-bar-multi/ds-search-bar-scoped/g' src/app/shared/ui/search-bar-multi/search-bar-multi.component.scss > src/app/shared/ui/search-bar-scoped/search-bar-scoped.component.scss
```

Dans la copie : supprimer les règles qui stylent l'ancien `<input>` natif (`__input` en tant qu'élément natif : `border`, `outline`, `background`, `::placeholder`) et ajouter :

```scss
// Le champ est un ds-input-text inline : il prend la place libre du slot
.ds-search-bar-scoped__input {
  flex:      1 1 auto;
  min-width: 0;
}

// Flyout BU : filtre en tête, liste dessous (comme le select de BU de Qirin)
.ds-search-bar-scoped__flyout--bu {
  display:        flex;
  flex-direction: column;
  gap:            var(--semantic-measurement-spacing-xs);
  padding:        var(--semantic-measurement-spacing-s);
  background:     var(--semantic-color-interactive-background-neutral-default);
  border-radius:  var(--semantic-border-radius-m);
  box-shadow:     var(--semantic-shadow-flyout);
}
```

Si `ds-flyout-menu` porte déjà son propre fond et son ombre, retirer `background` / `box-shadow` de `--bu` pour éviter une double ombre (vérifier dans le navigateur, étape 4).

- [ ] **Step 2: Story**

`search-bar-scoped.stories.ts` :

```ts
import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBarScopedComponent } from './search-bar-scoped.component';

const meta: Meta<SearchBarScopedComponent> = {
  title: 'Design System/Data Entry/Search Bar Scoped',
  component: SearchBarScopedComponent,
  tags: ['autodocs'],
  argTypes: { searchClicked: { action: 'searchClicked' }, moreCriteriaClicked: { action: 'moreCriteriaClicked' } },
};

export default meta;
type Story = StoryObj<SearchBarScopedComponent>;

export const Buyers: Story = { args: { scope: 'buyers', type: 'name', country: 'fr' } };
export const Policies: Story = { args: { scope: 'policies', buCode: 'AT USA', criteriaCount: 1 } };
export const PoliciesAllBus: Story = { args: { scope: 'policies', buCode: null, criteriaCount: 1 } };
```

- [ ] **Step 3: Export**

Ajouter en fin de `src/app/shared/ui/index.ts` :

```ts
export * from './search-bar-scoped/search-bar-scoped.component';
```

- [ ] **Step 4: Vérifier**

Run: `npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep -i scoped` → aucune ligne.
Storybook « Search Bar Scoped » :
- Buyers : la barre se lit comme `ds-search-bar-multi` (mettre la story « Search Bar Multi » à côté pour comparer).
- Changer d'objet dans le slot 1 vide la saisie, et les slots changent.
- Policies : le flyout BU filtre en tapant « uk », puis « All BUs » remet le libellé.
- Entrée dans le champ déclenche `searchClicked`. Search est actif même quand la saisie est vide.

- [ ] **Step 5: Commit**

```bash
git add src/app/shared/ui/search-bar-scoped src/app/shared/ui/index.ts
git commit -m "feat(design-system): scoped search bar (buyers | policies)"
```

---

### Task 7: Carte de recherche récente V2

**Files:**
- Create: `src/app/pages/search-v2/components/recent-search-v2-card.component.ts`
- Create: `src/app/pages/search-v2/components/recent-search-v2-card.component.html`
- Create: `src/app/pages/search-v2/components/recent-search-v2-card.component.scss`

**Interfaces:**
- Consumes: `RecentV2Entry` (Task 3), `POLICY_STATUSES` (Task 1), V1 `SEARCH_TYPES`, `COUNTRIES`, `DIAL_CODES`, `moreCriteriaSlots` (lecture seule).
- Produces: `<app-recent-search-v2-card [entry] (replayed) />`.

- [ ] **Step 1: Composant**

`recent-search-v2-card.component.ts` :

```ts
import { Component, computed, input, output } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { FlagComponent, type FlagCode } from '../../../shared/ui/flag/flag.component';
import { SEARCH_TYPES, COUNTRIES, DIAL_CODES } from '../../../shared/ui/search-bar-multi/search-bar-multi.component';
import { moreCriteriaSlots } from '../../../shared/ui/more-criteria/more-criteria.component';
import { POLICY_STATUSES } from '../../../shared/ui/policy-criteria/policy-criteria.model';
import type { RecentV2Entry } from '../search-v2-recents.model';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface RecentField { label: string; value: string; flag?: FlagCode; }

/** Copie de la carte V1, avec une variante Policy (colonnes propres aux polices). */
@Component({
  selector: 'app-recent-search-v2-card',
  standalone: true,
  imports: [CardComponent, FlagComponent],
  templateUrl: './recent-search-v2-card.component.html',
  styleUrl: './recent-search-v2-card.component.scss',
})
export class RecentSearchV2CardComponent {
  entry = input.required<RecentV2Entry>();
  replayed = output<void>();

  isPolicy = computed(() => this.entry().kind === 'policy');

  searchedValue = computed(() => {
    const e = this.entry();
    return e.kind === 'buyer' && e.type === 'phone' && e.country ? `${DIAL_CODES[e.country]} ${e.query}` : e.query;
  });

  timestamp = computed(() => {
    const d = new Date(this.entry().ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
  });

  fields = computed<RecentField[]>(() => {
    const e = this.entry();
    if (e.kind === 'policy') {
      const c = e.criteria;
      const statuses = c.searchIn === 'drafts'
        ? ''
        : POLICY_STATUSES.filter(s => c.statuses.includes(s.id)).map(s => s.label).join(', ');
      return [
        { label: 'Searched',    value: this.searchedValue() },
        { label: 'BU code',     value: e.buCode ?? 'All BUs' },
        { label: 'Search in',   value: c.searchIn === 'drafts' ? 'Drafts' : 'Policies' },
        { label: 'Status',      value: statuses },
        { label: 'Extension',   value: c.extension },
        { label: 'Searched at', value: this.timestamp() },
      ];
    }
    const s = moreCriteriaSlots(e.criteria);
    const country = e.country ? COUNTRIES.find(c => c.code === e.country)?.label ?? e.country.toUpperCase() : '';
    return [
      { label: 'Searched', value: this.searchedValue() },
      { label: 'Type',     value: SEARCH_TYPES.find(t => t.id === e.type)?.label ?? e.type },
      { label: 'Country',  value: country, flag: e.country ?? undefined },
      { label: 'ID type',  value: e.idType ?? '' },
      { label: s.status.key,         value: s.status.value ?? '' },
      { label: s.street.key,         value: s.street.value ?? '' },
      { label: s.city.key,           value: s.city.value ?? '' },
      { label: s.region.key,         value: s.region.value ?? '' },
      { label: s.zip.key,            value: s.zip.value ?? '' },
      { label: s.phone.key,          value: s.phone.value ?? '' },
      { label: s.extendedSearch.key, value: s.extendedSearch.value ?? '' },
      { label: 'Searched at', value: this.timestamp() },
    ];
  });
}
```

`recent-search-v2-card.component.html` : copier `src/app/pages/search/components/recent-search-card.component.html`, puis sur la `div.recent-card` ajouter `[class.recent-card--policy]="isPolicy()"`.

```bash
cp src/app/pages/search/components/recent-search-card.component.html src/app/pages/search-v2/components/recent-search-v2-card.component.html
cp src/app/pages/search/components/recent-search-card.component.scss src/app/pages/search-v2/components/recent-search-v2-card.component.scss
```

Dans le `.html` copié, la ligne `<div class="recent-card" role="button" tabindex="0"` devient :

```html
  <div class="recent-card" [class.recent-card--policy]="isPolicy()" role="button" tabindex="0"
```

Ajouter en fin du `.scss` copié :

```scss
// Variante Policy : six colonnes, mêmes deux pistes libellé / valeur
.recent-card--policy {
  grid-template-columns:
    minmax(0, 1.5fr)    // Searched
    minmax(0, 1fr)      // BU code
    minmax(0, 0.9fr)    // Search in
    minmax(0, 1.4fr)    // Status
    minmax(0, 0.8fr)    // Extension
    minmax(0, 1.6fr);   // Searched at
}
```

- [ ] **Step 2: Vérifier**

Run: `npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep recent-search-v2` → aucune ligne.

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/search-v2/components
git commit -m "feat(search-v2): recent search card with policy variant"
```

---

### Task 8: Page `/search-v2`, recherche Buyers et Policies

**Files:**
- Create: `src/app/pages/search-v2/search-v2.component.ts`
- Create: `src/app/pages/search-v2/search-v2.component.html`
- Create: `src/app/pages/search-v2/search-v2.component.scss`
- Create: `src/app/pages/search-v2/search-v2.stories.ts`
- Modify: `src/app/app.routes.ts` (import + ligne dans `PROTO_PAGES`)
- Modify: `src/app/user-testing/screens.data.ts` (ligne après `search`)

**Interfaces:**
- Consumes: tout ce qui précède ; V1 `SEED_RESULTS` n'est **pas** exporté par `search.component.ts` : le copier dans `src/app/pages/search-v2/buyers.mock.ts` (voir étape 1) ; `CompanyCreationWizardComponent` importé depuis `../search/company-creation-wizard/company-creation-wizard.component`.
- Produces: `SearchV2Component` (selector `app-search-v2`), route `search-v2`. Signaux utilisés par Task 9 : `activeTab`, `scope`, `favorites` (store), `recentsStore`, `viewedPolicies`, `viewedBuyers`, `openPolicy(p)`, `openResult(r)`, `pickRecent(e)`, `toggleBuyerFavorite(r)`, `togglePolicyFavorite(p)`, `isBuyerFavorite(r)`, `isPolicyFavorite(p)`.

- [ ] **Step 1: Mock buyers**

Générer `src/app/pages/search-v2/buyers.mock.ts` à partir du tableau `SEED_RESULTS` de la V1 (copie à l'identique, la V1 n'est pas modifiée) :

```bash
{
  echo "import type { ResultCardData } from '../../shared/ui/result-card/result-card.component';"
  echo ""
  echo "/** Copie du jeu V1 : la V2 ne dépend pas de l'intérieur de la page V1. */"
  echo "export const BUYERS: ResultCardData[] = ["
  sed -n '/^const SEED_RESULTS/,/^];/p' src/app/pages/search/search.component.ts | sed '1d'
} > src/app/pages/search-v2/buyers.mock.ts
```

Vérification : `grep -c "name:" src/app/pages/search-v2/buyers.mock.ts` donne 25, et le fichier finit par `];`.

- [ ] **Step 2: Composant**

`search-v2.component.ts` :

```ts
import { Component, computed, inject, input, signal, viewChild, type ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, TabComponent, IconComponent,
  ConfirmDialogComponent, ButtonComponent, SpinnerComponent, SegmentedControlComponent,
} from '../../shared/ui';
import { SearchBarScopedComponent, type SearchScope } from '../../shared/ui/search-bar-scoped/search-bar-scoped.component';
import type { SearchType, IdTypeOption } from '../../shared/ui/search-bar-multi/search-bar-multi.component';
import type { FlagCode } from '../../shared/ui/flag/flag.component';
import {
  MoreCriteriaComponent, emptyMoreCriteria, moreCriteriaCount, type MoreCriteriaValues,
} from '../../shared/ui/more-criteria/more-criteria.component';
import { PolicyCriteriaComponent } from '../../shared/ui/policy-criteria/policy-criteria.component';
import { defaultPolicyCriteria, policyCriteriaCount, type PolicyCriteriaValues } from '../../shared/ui/policy-criteria/policy-criteria.model';
import { ResultCardComponent, type ResultCardData } from '../../shared/ui/result-card/result-card.component';
import { PolicyResultCardComponent } from '../../shared/ui/policy-result-card/policy-result-card.component';
import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { BuyerSummaryStore } from '../buyer-summary/buyer-summary.store';
import { ViewedBuyersStore } from '../buyer-summary/viewed-buyers.store';
import { CompanyCreationWizardComponent } from '../search/company-creation-wizard/company-creation-wizard.component';
import { ToasterService } from '../../shared/ui/toaster/toaster.service';
import { RecentSearchV2CardComponent } from './components/recent-search-v2-card.component';
import { SearchV2RecentsStore } from './search-v2-recents.store';
import type { RecentV2Entry } from './search-v2-recents.model';
import { SearchV2ViewedStore } from './search-v2-viewed.store';
import { SearchV2FavoritesStore } from './search-v2-favorites.store';
import { searchPolicies, type PolicyQuery } from './policy-search';
import { POLICIES } from './policies.mock';
import { BUYERS } from './buyers.mock';

type TabId = 'search' | 'searched' | 'viewed' | 'favorites';

@Component({
  selector: 'app-search-v2',
  standalone: true,
  imports: [
    TopboxTestShellComponent, PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, TabComponent,
    IconComponent, ButtonComponent, SpinnerComponent, ConfirmDialogComponent, SegmentedControlComponent,
    SearchBarScopedComponent, MoreCriteriaComponent, PolicyCriteriaComponent,
    ResultCardComponent, PolicyResultCardComponent, RecentSearchV2CardComponent, CompanyCreationWizardComponent,
  ],
  templateUrl: './search-v2.component.html',
  styleUrl: './search-v2.component.scss',
})
export class SearchV2Component {
  state = input<'default' | 'results'>('default');

  activeTab = signal<TabId>('search');
  showMoreCriteria = signal(false);

  // ── Barre ───────────────────────────────────────────────────────────────
  scope = signal<SearchScope>('buyers');
  searchType = signal<SearchType>('company-id');
  searchCountry = signal<FlagCode | null>(null);
  searchIdType = signal<IdTypeOption | null>(null);
  buCode = signal<string | null>(null);
  searchQuery = signal('');
  criteria = signal<MoreCriteriaValues>(emptyMoreCriteria());
  policyCriteria = signal<PolicyCriteriaValues>(defaultPolicyCriteria());

  criteriaCount = computed(() => this.scope() === 'buyers'
    ? moreCriteriaCount(this.criteria())
    : policyCriteriaCount(this.policyCriteria()));

  hasSearched = signal(false);
  isResults = computed(() => this.hasSearched() || this.state() === 'results');

  /** Changer d'objet repart de zéro : rien de l'objet quitté ne reste affiché. */
  onScopeChange(s: SearchScope) {
    this.scope.set(s);
    this.searchQuery.set('');
    this.criteria.set(emptyMoreCriteria());
    this.policyCriteria.set(defaultPolicyCriteria());
    this.buCode.set(null);
    this.hasSearched.set(false);
    this.appliedPolicyQuery.set(null);
    this.showMoreCriteria.set(false);
    this.expandedKey.set(null);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  toggleMoreCriteria() { this.showMoreCriteria.update(v => !v); }

  // ── Buyers (logique V1) ─────────────────────────────────────────────────
  results = signal<ResultCardData[]>(BUYERS);
  appliedQuery = signal('');
  appliedType = signal<SearchType>('company-id');
  isInternalSearch = computed(() => this.isResults() && this.appliedType() === 'company-id');

  buyerFiltered = computed(() => {
    const q = this.appliedQuery();
    const all = this.results();
    if (!q) return all;
    if (this.appliedType() === 'company-id') return all.filter(r => (r.companyId ?? '') === q);
    return all.filter(r => r.name.toLowerCase().includes(q) || (r.companyId ?? '').includes(q));
  });

  // ── Policies ────────────────────────────────────────────────────────────
  appliedPolicyQuery = signal<PolicyQuery | null>(null);
  policyResult = computed(() => {
    const q = this.appliedPolicyQuery();
    return q ? searchPolicies(POLICIES, q) : { items: [] as PolicyResultData[], exactHit: false };
  });

  // ── Liste courante + chargement progressif ─────────────────────────────
  private readonly PAGE_SIZE = 6;
  visibleCount = signal(this.PAGE_SIZE);
  loadingMore = signal(false);

  totalCount = computed(() => this.scope() === 'buyers' ? this.buyerFiltered().length : this.policyResult().items.length);
  visibleBuyers = computed(() => this.buyerFiltered().slice(0, this.visibleCount()));
  visiblePolicies = computed(() => this.policyResult().items.slice(0, this.visibleCount()));
  allLoaded = computed(() => this.visibleCount() >= this.totalCount());
  noResults = computed(() => this.isResults() && this.totalCount() === 0);

  scrollHost = viewChild<ElementRef<HTMLElement>>('scrollHost');

  loadMore() {
    if (this.loadingMore() || this.allLoaded()) return;
    this.loadingMore.set(true);
    setTimeout(() => {
      this.visibleCount.update(n => Math.min(n + this.PAGE_SIZE, this.totalCount()));
      this.loadingMore.set(false);
      this.maybeFill();
    }, 500);
  }

  onScroll(e: Event) {
    const el = e.target as HTMLElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 160) this.loadMore();
  }

  private maybeFill() {
    const el = this.scrollHost()?.nativeElement;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight + 4 && !this.allLoaded() && !this.loadingMore()) this.loadMore();
  }

  /** Dépliage d'une carte, toutes listes confondues : `buyer:<id>` ou `policy:<id>`. */
  expandedKey = signal<string | null>(null);
  toggleExpanded(key: string) { this.expandedKey.set(this.expandedKey() === key ? null : key); }
  buyerKey(r: ResultCardData, i: number) { return `buyer:${r.companyId ?? 'idx-' + i}`; }
  policyKey(p: PolicyResultData) { return `policy:${p.id}`; }

  // ── Recherche ───────────────────────────────────────────────────────────
  recentsStore = inject(SearchV2RecentsStore);

  runSearch() {
    this.hasSearched.set(true);
    this.visibleCount.set(this.PAGE_SIZE);
    this.activeTab.set('search');
    this.showMoreCriteria.set(false);
    const q = this.searchQuery().trim();

    if (this.scope() === 'buyers') {
      this.appliedType.set(this.searchType());
      this.appliedQuery.set(q.toLowerCase());
      this.expandedKey.set(null);
      this.recentsStore.record({
        kind: 'buyer', type: this.searchType(), query: q,
        country: this.searchCountry(), idType: this.searchIdType(), criteria: this.criteria(),
      });
    } else {
      const query: PolicyQuery = { buCode: this.buCode(), query: q, criteria: this.policyCriteria() };
      this.appliedPolicyQuery.set(query);
      const r = this.policyResult();
      this.expandedKey.set(r.exactHit ? this.policyKey(r.items[0]) : null);
      this.recentsStore.record({ kind: 'policy', buCode: query.buCode, query: q, criteria: query.criteria });
    }
    setTimeout(() => this.maybeFill());
  }

  /** Rejouer remet la barre sur le bon objet, recharge tout et relance. */
  pickRecent(e: RecentV2Entry) {
    // Changer d'objet passe par la même remise à zéro qu'au clic sur le slot 1
    const target: SearchScope = e.kind === 'buyer' ? 'buyers' : 'policies';
    if (target !== this.scope()) this.onScopeChange(target);
    if (e.kind === 'buyer') {
      this.searchType.set(e.type);
      this.searchCountry.set(e.country);
      this.searchIdType.set(e.idType);
      this.criteria.set(e.criteria);
    } else {
      this.buCode.set(e.buCode);
      this.policyCriteria.set(e.criteria);
    }
    this.searchQuery.set(e.query);
    this.runSearch();
  }

  // ── Actions buyers (V1) ─────────────────────────────────────────────────
  private router = inject(Router);
  private buyerStore = inject(BuyerSummaryStore);
  private toaster = inject(ToasterService);
  favorites = inject(SearchV2FavoritesStore);

  isBuyerFavorite(r: ResultCardData) { return !!r.companyId && this.favorites.has('buyer', r.companyId); }
  toggleBuyerFavorite(r: ResultCardData) {
    if (!r.companyId) return;
    this.favorites.toggle({ kind: 'buyer', id: r.companyId, buyer: r });
  }

  pendingCreateIdx = signal<number | null>(null);
  pendingCompanyName = computed(() => {
    const idx = this.pendingCreateIdx();
    return idx === null ? '' : (this.results()[idx]?.name ?? '');
  });
  addCompany(r: ResultCardData) { this.pendingCreateIdx.set(this.results().indexOf(r)); }
  cancelCreate() { this.pendingCreateIdx.set(null); }

  confirmCreate() {
    const idx = this.pendingCreateIdx();
    if (idx === null || idx < 0) return;
    const id = Math.floor(Math.random() * 1e9).toString();
    let created: ResultCardData | undefined;
    this.results.update(list => list.map((r, i) => {
      if (i !== idx) return r;
      created = { ...r, exists: true, companyId: id };
      return created;
    }));
    if (created) {
      this.buyerStore.set({ name: created.name, companyId: id, city: created.city, address: created.address }, false);
      this.toaster.show('Company created', { tone: 'success', title: 'Success' });
    }
    this.pendingCreateIdx.set(null);
    this.router.navigate(['/buyer-summary', id]);
  }

  openResult(r: ResultCardData) {
    if (!r.companyId) return;
    this.buyerStore.set({ name: r.name, companyId: r.companyId, city: r.city, address: r.address });
    this.router.navigate(['/buyer-summary', r.companyId]);
  }

  showCreateWizard = signal(false);
  openManualCreate()  { this.showCreateWizard.set(true); }
  closeManualCreate() { this.showCreateWizard.set(false); }

  // ── Actions policies ────────────────────────────────────────────────────
  viewedPolicies = inject(SearchV2ViewedStore);

  isPolicyFavorite(p: PolicyResultData) { return this.favorites.has('policy', p.id); }
  togglePolicyFavorite(p: PolicyResultData) { this.favorites.toggle({ kind: 'policy', id: p.id, policy: p }); }

  /** Pas encore de page Police : on le dit, et la police entre dans Recently viewed. */
  openPolicy(p: PolicyResultData) {
    this.viewedPolicies.record(p);
    this.toaster.show('Policy page coming soon', { tone: 'info', title: 'Not available yet' });
  }

  // ── Onglets ─────────────────────────────────────────────────────────────
  viewedBuyers = inject(ViewedBuyersStore);

  setTab(t: TabId) {
    this.activeTab.set(t);
    this.expandedKey.set(null);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  recentsCount = computed(() => this.recentsStore.entries().length);
  viewedCount = computed(() => this.viewedBuyers.entries().length + this.viewedPolicies.entries().length);
  favoritesCount = computed(() => this.favorites.entries().length);
}
```

- [ ] **Step 3: Template (onglet Search ; les trois onglets d'historique arrivent en Task 9)**

`search-v2.component.html` :

```html
<div class="search-page">
  <app-topbox-test-shell [showSidenav]="false">
    <div class="search-page__content">
      <ds-page-header [topbox]="false" [breadcrumb]="true" [tabs]="true">
        <ds-breadcrumbs slot="breadcrumbs">
          <ds-crumb label="Home" />
          <ds-crumb label="Search" [currentPage]="true" />
        </ds-breadcrumbs>

        <ng-container slot="tabs">
          <ds-tab [selected]="activeTab() === 'search'" [icon]="true" (clicked)="setTab('search')">
            <ds-icon slot="icon" name="search" [size]="20" /> Search
          </ds-tab>
          <ds-tab [selected]="activeTab() === 'searched'" [icon]="true" [counter]="recentsCount() || null" (clicked)="setTab('searched')">
            <ds-icon slot="icon" name="search-recent" [size]="20" /> Recent search
          </ds-tab>
          <ds-tab [selected]="activeTab() === 'viewed'" [icon]="true" [counter]="viewedCount() || null" (clicked)="setTab('viewed')">
            <ds-icon slot="icon" name="history" [size]="20" /> Recently viewed
          </ds-tab>
          <ds-tab [selected]="activeTab() === 'favorites'" [icon]="true" [counter]="favoritesCount() || null" (clicked)="setTab('favorites')">
            <ds-icon slot="icon" name="star" [size]="20" /> Favorites
          </ds-tab>
        </ng-container>
      </ds-page-header>

      @if (activeTab() === 'search') {
        <div class="search-page__bar-wrap">
          <ds-search-bar-scoped
            [scope]="scope()"
            (scopeChange)="onScopeChange($event)"
            [(type)]="searchType"
            [(country)]="searchCountry"
            [(idType)]="searchIdType"
            [(buCode)]="buCode"
            [(query)]="searchQuery"
            [criteriaCount]="criteriaCount()"
            (moreCriteriaClicked)="toggleMoreCriteria()"
            (searchClicked)="runSearch()"
          />

          @if (showMoreCriteria()) {
            <div class="search-page__criteria-overlay">
              @if (scope() === 'buyers') {
                <ds-more-criteria [(value)]="criteria" (closed)="toggleMoreCriteria()" />
              } @else {
                <ds-policy-criteria [(value)]="policyCriteria" (closed)="toggleMoreCriteria()" />
              }
            </div>
          }
        </div>
      }

      <div class="search-page__inner" #scrollHost (scroll)="onScroll($event)">
        @if (activeTab() === 'search') {
          @if (isResults()) {
            @if (noResults()) {
              <div class="search-page__empty">
                <ds-icon name="search" [size]="48" />
                @if (scope() === 'buyers') {
                  <span class="search-page__empty-text">No company found for your search</span>
                  <ds-button type="primary" (clicked)="openManualCreate()">
                    <ds-icon slot="icon-left" name="plus" [size]="16" /> Create a company manually
                  </ds-button>
                } @else {
                  <span class="search-page__empty-text">No policy found for your search</span>
                }
              </div>
            } @else {
              <div class="search-page__results-header">
                {{ totalCount() }} {{ totalCount() === 1 ? 'result' : 'results' }}
              </div>
              <div class="search-page__results">
                @if (scope() === 'buyers') {
                  @for (r of visibleBuyers(); track $index) {
                    <ds-result-card
                      [data]="r"
                      [open]="expandedKey() === buyerKey(r, $index)"
                      [favorited]="isBuyerFavorite(r)"
                      [internal]="isInternalSearch()"
                      (toggled)="toggleExpanded(buyerKey(r, $index))"
                      (starred)="toggleBuyerFavorite(r)"
                      (added)="addCompany(r)"
                      (opened)="openResult(r)"
                    />
                  }
                } @else {
                  @for (p of visiblePolicies(); track p.id) {
                    <ds-policy-result-card
                      [data]="p"
                      [open]="expandedKey() === policyKey(p)"
                      [favorited]="isPolicyFavorite(p)"
                      (toggled)="toggleExpanded(policyKey(p))"
                      (starred)="togglePolicyFavorite(p)"
                      (opened)="openPolicy(p)"
                    />
                  }
                }
              </div>

              @if (loadingMore()) {
                <div class="search-page__loading-more">
                  <ds-spinner size="s" /> <span>Loading more results…</span>
                </div>
              }

              @if (allLoaded() && scope() === 'buyers') {
                <div class="search-page__end">
                  <span class="search-page__end-text">Can’t find the company you’re looking for?</span>
                  <ds-button type="primary" (clicked)="openManualCreate()">
                    <ds-icon slot="icon-left" name="plus" [size]="16" /> Create a company manually
                  </ds-button>
                </div>
              }
            }
          } @else {
            <div class="search-page__empty">
              <ds-icon name="search" [size]="48" />
              <span class="search-page__empty-text">Start your search above</span>
            </div>
          }
        }

        <!-- HISTORY_TABS : remplacé en Task 9 -->
      </div>
    </div>
  </app-topbox-test-shell>

  <ds-confirm-dialog
    title="Create company" tone="info" confirmLabel="Create" cancelLabel="Cancel"
    [open]="pendingCreateIdx() !== null"
    (confirmed)="confirmCreate()" (cancelled)="cancelCreate()">
    Do you really want to create the company "{{ pendingCompanyName() }}"?
  </ds-confirm-dialog>

  <app-company-creation-wizard [open]="showCreateWizard()" (closed)="closeManualCreate()" />
</div>
```

`search-v2.component.scss` :

```bash
cp src/app/pages/search/search.component.scss src/app/pages/search-v2/search-v2.component.scss
```

`search-v2.stories.ts` :

```ts
import type { Meta, StoryObj } from '@storybook/angular';
import { SearchV2Component } from './search-v2.component';

const meta: Meta<SearchV2Component> = {
  title: 'Pages/Search V2',
  component: SearchV2Component,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<SearchV2Component>;

export const Default: Story = { args: { state: 'default' } };
export const Results: Story = { args: { state: 'results' } };
```

- [ ] **Step 4: Route et liste des écrans**

`src/app/app.routes.ts` : sous `import { SearchComponent } from './pages/search/search.component';` ajouter

```ts
import { SearchV2Component } from './pages/search-v2/search-v2.component';
```

et dans `PROTO_PAGES`, sous `{ path: 'search', component: SearchComponent },` :

```ts
  { path: 'search-v2', component: SearchV2Component },
```

`src/app/user-testing/screens.data.ts`, sous la ligne `path: 'search'` :

```ts
  { path: 'search-v2', label: 'Search V2', hint: 'Buyers and policies', version: { ...V1 } },
```

- [ ] **Step 5: Vérifier**

Run: `npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep -i search-v2` → aucune ligne.
Run: `git diff --stat -- src/app/pages/search src/app/shared/ui/search-bar-multi src/app/shared/ui/more-criteria src/app/shared/ui/result-card` → vide.
Navigateur, `/search-v2` :
- Buyers, Name « marais », Search : mêmes résultats que `/search`. L'étoile ajoute aux favoris, le clic sur un nom ouvre le Buyer Summary.
- Slot 1 → Policies : la saisie est vidée, « Start your search above » s'affiche, More criteria (1).
- BU AT USA, « 5012390 », Search : 1 résultat, déplié.
- All BUs, « brooklyn », More criteria → décocher Issued, Search : 2 polices au moins.
- More criteria → Drafts : les statuts sont grisés avec « Drafts have no status yet », Search : 4 drafts.
- « zzz » : « No policy found for your search », sans bouton de création.
- **Bascule après recherche** : faire une recherche Policies, puis passer à Buyers. La liste disparaît et le panneau More criteria se ferme.
- Clic sur le titre d'une police : toast « Policy page coming soon ».

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/search-v2 src/app/app.routes.ts src/app/user-testing/screens.data.ts
git commit -m "feat(search-v2): search page with buyers and policies"
```

---

### Task 9: Onglets d'historique filtrables

**Files:**
- Modify: `src/app/pages/search-v2/search-v2.component.ts` (ajout de la section historique)
- Modify: `src/app/pages/search-v2/search-v2.component.html` (remplacer le commentaire `HISTORY_TABS`)
- Modify: `src/app/pages/search-v2/search-v2.component.scss` (ajouts en fin)

**Interfaces:**
- Consumes: `filterHistory`, `groupByKind`, `countByKind`, `clearLabel`, `emptyLabel`, `HistoryFilter`, `HistoryTab` (Task 2) ; `ViewedBuyer` de `../buyer-summary/viewed-buyers.store` (type) ; signaux de Task 8.

- [ ] **Step 1: Logique dans le composant**

Ajouter les imports :

```ts
import type { SegmentedOption } from '../../shared/ui/segmented-control/segmented-control.component';
import {
  filterHistory, groupByKind, countByKind, clearLabel, emptyLabel,
  type HistoryFilter, type HistoryTab, type HistoryKind,
} from './search-v2-history';
```

Ajouter à la fin de la classe `SearchV2Component` :

```ts
  // ── Historiques : filtre partagé All / Buyers / Policies ───────────────
  historyFilter = signal<HistoryFilter>('all');
  setHistoryFilter(v: string) {
    this.historyFilter.set(v === 'buyer' || v === 'policy' ? v : 'all');
    this.expandedKey.set(null);
  }

  /** Un buyer consulté se lit dans sa carte de résultat (copie de la règle V1). */
  private buyerCard(companyId: string, fallback: ResultCardData): ResultCardData {
    return this.results().find(r => r.companyId === companyId) ?? fallback;
  }

  viewedItems = computed(() => [
    ...this.viewedBuyers.entries().map(b => ({
      kind: 'buyer' as const, ts: b.ts, id: b.companyId ?? '',
      buyer: this.buyerCard(b.companyId ?? '', { name: b.name, city: b.city, address: b.address ?? '', companyId: b.companyId, exists: true }),
    })),
    ...this.viewedPolicies.entries().map(v => ({ kind: 'policy' as const, ts: v.ts, id: v.id, policy: v.policy })),
  ]);

  private tabItems = computed<{ kind: HistoryKind; ts: number }[]>(() => {
    switch (this.activeTab()) {
      case 'searched':  return this.recentsStore.entries();
      case 'viewed':    return this.viewedItems();
      case 'favorites': return this.favorites.entries();
      default:          return [];
    }
  });

  historyCounts = computed(() => countByKind(this.tabItems()));

  historyOptions = computed<SegmentedOption[]>(() => {
    const c = this.historyCounts();
    return [
      { value: 'all',    label: `All (${c.all})` },
      { value: 'buyer',  label: `Buyers (${c.buyer})` },
      { value: 'policy', label: `Policies (${c.policy})` },
    ];
  });

  shownRecents   = computed(() => filterHistory(this.recentsStore.entries(), this.historyFilter()));
  shownViewed    = computed(() => filterHistory(this.viewedItems(), this.historyFilter()));
  shownFavorites = computed(() => filterHistory(this.favorites.entries(), this.historyFilter()));
  /** Favorites en All : sections Buyers puis Policies. */
  favoriteGroups = computed(() => groupByKind(this.favorites.entries()));

  /** Repère d'objet au-dessus de chaque carte, seulement en All. */
  showKindMarker = computed(() => this.historyFilter() === 'all');

  historyClearLabel = computed(() => clearLabel(this.historyFilter()));
  historyEmpty(tab: HistoryTab) { return emptyLabel(tab, this.historyFilter()); }
  historyShownCount = computed(() => this.historyCounts()[this.historyFilter()]);

  /** Clear n'efface que ce qui est affiché. */
  clearHistory() {
    const f = this.historyFilter();
    const kind = f === 'all' ? undefined : f;
    switch (this.activeTab()) {
      case 'searched':
        this.recentsStore.clear(kind);
        break;
      case 'viewed':
        if (kind !== 'policy') this.viewedBuyers.clear();
        if (kind !== 'buyer') this.viewedPolicies.clear();
        break;
      case 'favorites':
        this.favorites.clear(kind);
        break;
    }
  }
```

- [ ] **Step 2: Template**

Dans `search-v2.component.html`, remplacer la ligne `<!-- HISTORY_TABS : remplacé en Task 9 -->` par :

```html
        @if (activeTab() !== 'search') {
          <div class="search-page__list-header search-page__list-header--split">
            <ds-segmented-control
              mode="tabs"
              ariaLabel="Show"
              [options]="historyOptions()"
              [selected]="historyFilter()"
              (selectedChange)="setHistoryFilter($event)"
            />
            @if (historyShownCount() > 0) {
              <ds-button type="plain" tone="default" (clicked)="clearHistory()">
                <ds-icon slot="icon-left" name="trash" [size]="16" /> {{ historyClearLabel() }}
              </ds-button>
            }
          </div>
        }

        <ng-template #kindMarker let-kind>
          @if (showKindMarker()) {
            <span class="search-page__kind">
              <ds-icon [name]="kind === 'buyer' ? 'buyers' : 'contract'" [size]="16" />
              {{ kind === 'buyer' ? 'Buyer' : 'Policy' }}
            </span>
          }
        </ng-template>

        @if (activeTab() === 'searched') {
          @if (shownRecents().length === 0) {
            <div class="search-page__empty">
              <ds-icon name="search-recent" [size]="48" />
              <span class="search-page__empty-text">{{ historyEmpty('searched') }}</span>
            </div>
          } @else {
            <div class="search-page__list">
              @for (r of shownRecents(); track r.ts) {
                <div class="search-page__entry">
                  <ng-container [ngTemplateOutlet]="kindMarker" [ngTemplateOutletContext]="{ $implicit: r.kind }" />
                  <app-recent-search-v2-card [entry]="r" (replayed)="pickRecent(r)" />
                </div>
              }
            </div>
          }
        }

        @if (activeTab() === 'viewed') {
          @if (shownViewed().length === 0) {
            <div class="search-page__empty">
              <ds-icon name="history" [size]="48" />
              <span class="search-page__empty-text">{{ historyEmpty('viewed') }}</span>
            </div>
          } @else {
            <div class="search-page__results">
              @for (v of shownViewed(); track v.kind + v.id) {
                <div class="search-page__entry">
                  <ng-container [ngTemplateOutlet]="kindMarker" [ngTemplateOutletContext]="{ $implicit: v.kind }" />
                  @if (v.kind === 'buyer') {
                    <ds-result-card
                      [data]="v.buyer"
                      [open]="expandedKey() === 'buyer:' + v.id"
                      [favorited]="isBuyerFavorite(v.buyer)"
                      (toggled)="toggleExpanded('buyer:' + v.id)"
                      (starred)="toggleBuyerFavorite(v.buyer)"
                      (opened)="openResult(v.buyer)"
                    />
                  } @else {
                    <ds-policy-result-card
                      [data]="v.policy"
                      [open]="expandedKey() === 'policy:' + v.id"
                      [favorited]="isPolicyFavorite(v.policy)"
                      (toggled)="toggleExpanded('policy:' + v.id)"
                      (starred)="togglePolicyFavorite(v.policy)"
                      (opened)="openPolicy(v.policy)"
                    />
                  }
                </div>
              }
            </div>
          }
        }

        @if (activeTab() === 'favorites') {
          @if (shownFavorites().length === 0) {
            <div class="search-page__empty">
              <ds-icon name="star" [size]="48" />
              <span class="search-page__empty-text">{{ historyEmpty('favorites') }}</span>
            </div>
          } @else {
            <ng-template #favCard let-f>
              @if (f.kind === 'buyer') {
                <ds-result-card
                  [data]="f.buyer"
                  [open]="expandedKey() === 'buyer:' + f.id"
                  [favorited]="true"
                  (toggled)="toggleExpanded('buyer:' + f.id)"
                  (starred)="toggleBuyerFavorite(f.buyer)"
                  (opened)="openResult(f.buyer)"
                />
              } @else {
                <ds-policy-result-card
                  [data]="f.policy"
                  [open]="expandedKey() === 'policy:' + f.id"
                  [favorited]="true"
                  (toggled)="toggleExpanded('policy:' + f.id)"
                  (starred)="togglePolicyFavorite(f.policy)"
                  (opened)="openPolicy(f.policy)"
                />
              }
            </ng-template>

            @if (historyFilter() === 'all') {
              @for (g of favoriteGroups(); track g.kind) {
                <section class="search-page__group" [attr.aria-label]="g.label">
                  <h3 class="search-page__group-title">{{ g.label }} ({{ g.items.length }})</h3>
                  <div class="search-page__results">
                    @for (f of g.items; track f.kind + f.id) {
                      <ng-container [ngTemplateOutlet]="favCard" [ngTemplateOutletContext]="{ $implicit: f }" />
                    }
                  </div>
                </section>
              }
            } @else {
              <div class="search-page__results">
                @for (f of shownFavorites(); track f.kind + f.id) {
                  <ng-container [ngTemplateOutlet]="favCard" [ngTemplateOutletContext]="{ $implicit: f }" />
                }
              </div>
            }
          }
        }
```

Note : dans Favorites groupé, le repère d'objet n'est pas affiché : le titre de section le dit déjà.

Ajouter `NgTemplateOutlet` aux imports du composant :

```ts
import { NgTemplateOutlet } from '@angular/common';
```

et l'inscrire dans le tableau `imports` du `@Component`.

Le contexte `let-f` d'un `ng-template` est typé `any` : `strictTemplates` l'accepte. Si le compilateur refuse `f.buyer` / `f.policy`, remplacer le template `#favCard` par deux blocs `@for` dupliqués (un par section), sans `ng-template`.

- [ ] **Step 3: Styles**

Ajouter en fin de `search-v2.component.scss` :

```scss
// En-tête de liste des historiques : filtre à gauche, Clear à droite
.search-page__list-header--split {
  justify-content: space-between;
  gap:             var(--semantic-measurement-spacing-m);
}

// Une carte d'historique + son repère d'objet au-dessus
.search-page__entry {
  display:        flex;
  flex-direction: column;
  gap:            var(--semantic-measurement-spacing-xs);
}

// Repère d'objet (vue All) : texte secondaire, pas un badge
.search-page__kind {
  display:     inline-flex;
  align-items: center;
  gap:         var(--semantic-measurement-spacing-xs);
  font-family: var(--semantic-font-family);
  font-size:   var(--semantic-font-text-style-size-s);
  line-height: var(--semantic-font-text-style-line-height-s);
  color:       var(--semantic-color-static-text-main-secondary);
}

// Favorites en All : une section par objet
.search-page__group {
  display:        flex;
  flex-direction: column;
  gap:            var(--semantic-measurement-spacing-s);

  & + & { margin-top: var(--semantic-measurement-spacing-xl); }
}

.search-page__group-title {
  margin:      0;
  font-family: var(--semantic-font-family);
  font-size:   var(--semantic-font-text-style-size-l);
  font-weight: var(--semantic-font-text-style-font-weight-semi-bold);
  line-height: var(--semantic-font-text-style-line-height-l);
  color:       var(--semantic-color-static-text-main-primary);
}
```

- [ ] **Step 4: Vérifier**

Run: `npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep -i search-v2` → aucune ligne.
Navigateur, `/search-v2` :
- Faire 2 recherches Buyers puis 1 Policies. Recent search : All (3), fil chronologique avec la police en tête, repère « Policy » / « Buyer » au-dessus de chaque carte.
- Filtre Policies : 1 carte, sans repère, le bouton devient « Clear policies ». Clic : Policies (0), « No policy search yet », les buyers sont toujours là en All.
- **Rejeu** : cliquer une recherche Policy récente. La barre repasse sur Policies, avec la même BU, la même saisie et le même compteur More criteria, et les résultats sont les mêmes qu'à l'origine.
- Ouvrir une police (toast), étoiler une police et un buyer. Recently viewed en All : la police en tête. Favorites en All : section Buyers (1) puis Policies (1).
- Le filtre choisi dans un onglet est conservé quand on change d'onglet.

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/search-v2
git commit -m "feat(search-v2): history tabs filtered by object"
```

---

### Task 10: Vérification finale

**Files:** aucun nouveau.

- [ ] **Step 1: Tests purs**

Run: `node --test tests/search-v2/`
Expected: PASS, 23 tests.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: succès, aucune erreur ; les warnings de budget déjà présents avant le chantier sont acceptés (comparer avec `git stash` si besoin, sans perdre le travail en cours).

- [ ] **Step 3: V1 intacte**

Run: `git diff main --stat -- src/app/pages/search src/app/shared/ui/search-bar-multi src/app/shared/ui/more-criteria src/app/shared/ui/result-card src/app/pages/buyer-summary/viewed-buyers.store.ts`
Expected: vide.

- [ ] **Step 4: Règles du design system**

Run: `grep -rnE "<(button|a|input|select|textarea|svg)[ >]" src/app/shared/ui/search-bar-scoped src/app/shared/ui/policy-criteria src/app/shared/ui/policy-result-card src/app/pages/search-v2`
Expected: aucune ligne.
Run: `grep -rn "—" src/app/shared/ui/search-bar-scoped src/app/shared/ui/policy-criteria src/app/shared/ui/policy-result-card src/app/pages/search-v2`
Expected: aucune ligne.
Run: `grep -rnE "#[0-9a-fA-F]{3,6}\b" src/app/shared/ui/search-bar-scoped src/app/shared/ui/policy-criteria src/app/shared/ui/policy-result-card src/app/pages/search-v2 --include=*.scss`
Expected: aucune ligne.

- [ ] **Step 5: Parcours complet dans le navigateur**

Reprendre les listes de vérification des Tasks 8 et 9 d'un seul tenant, sur `/search-v2`, puis ouvrir `/search` et vérifier qu'elle n'a pas changé (barre sans slot Objet, onglets sans filtre).
