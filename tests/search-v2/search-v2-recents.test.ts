import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recentKey } from '../../src/app/pages/search-v2/search-v2-recents.model.ts';

const buyerCrit = { statuses: [], extendCountry: false, street: '', city: '', region: '', zip: '', phone: '' };
const policyCrit = { searchIn: 'policies' as const, statuses: ['issued' as const] };

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

test('drafts searches ignore stale statuses in the key', () => {
  const d = (statuses: ('issued' | 'expired')[]) =>
    recentKey({ kind: 'policy', buCode: null, query: 'x', criteria: { ...policyCrit, searchIn: 'drafts', statuses } });
  assert.equal(d(['issued']), d(['expired']));
});

test('policy key has a single mode: a leftover mode field changes nothing', () => {
  const base = { kind: 'policy' as const, buCode: 'AT USA', query: '5012346', criteria: policyCrit };
  assert.equal(recentKey({ ...base, mode: 'open' } as typeof base), recentKey(base));
});
