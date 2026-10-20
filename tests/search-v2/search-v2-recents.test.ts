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
