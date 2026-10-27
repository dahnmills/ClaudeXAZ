import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recentKey } from '../../src/app/pages/search-v2/search-v2-recents.model.ts';

const buyerCrit = { statuses: [], extendCountry: false, street: '', city: '', region: '', zip: '', phone: '' };
const policyCrit = { searchIn: 'policies' as const, statuses: ['issued' as const], extension: '' };

test('recentKey distinguishes kinds, modes and criteria', () => {
  const b = recentKey({ kind: 'buyer', type: 'name', query: 'marais', country: null, idType: null, criteria: buyerCrit });
  const p = recentKey({ kind: 'policy', mode: 'global', buCode: null, query: 'marais', criteria: policyCrit });
  const p2 = recentKey({ kind: 'policy', mode: 'global', buCode: 'AT USA', query: 'marais', criteria: policyCrit });
  const p3 = recentKey({ kind: 'policy', mode: 'global', buCode: null, query: 'marais', criteria: { ...policyCrit, searchIn: 'drafts' } });
  const o = recentKey({ kind: 'policy', mode: 'open', buCode: null, query: 'marais', criteria: policyCrit });
  assert.notEqual(b, p);
  assert.notEqual(p, p2);
  assert.notEqual(p, p3);
  assert.notEqual(p, o);
});

test('recentKey ignores status order', () => {
  const a = recentKey({ kind: 'policy', mode: 'global', buCode: null, query: 'x', criteria: { ...policyCrit, statuses: ['issued', 'expired'] } });
  const b = recentKey({ kind: 'policy', mode: 'global', buCode: null, query: 'x', criteria: { ...policyCrit, statuses: ['expired', 'issued'] } });
  assert.equal(a, b);
});

test('drafts searches ignore stale statuses in the key', () => {
  const d = (statuses: ('issued' | 'expired')[]) =>
    recentKey({ kind: 'policy', mode: 'global', buCode: null, query: 'x', criteria: { ...policyCrit, searchIn: 'drafts', statuses } });
  assert.equal(d(['issued']), d(['expired']));
});

test('open policy key keeps the extension, ignores search in and statuses', () => {
  const o = (over = {}) => recentKey({ kind: 'policy', mode: 'open', buCode: 'AT USA', query: '5012346', criteria: { ...policyCrit, ...over } });
  assert.notEqual(o({ extension: '01' }), o({ extension: '00' }));
  assert.equal(o({ statuses: ['expired'] }), o({ searchIn: 'drafts' }));
});

test('global key ignores the extension', () => {
  const g = (extension: string) => recentKey({ kind: 'policy', mode: 'global', buCode: null, query: 'x', criteria: { ...policyCrit, extension } });
  assert.equal(g('01'), g(''));
});
