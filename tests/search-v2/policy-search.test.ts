import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchPolicies } from '../../src/app/pages/search-v2/policy-search.ts';
import { POLICIES } from '../../src/app/pages/search-v2/policies.mock.ts';
import { defaultPolicyCriteria } from '../../src/app/shared/ui/policy-criteria/policy-criteria.model.ts';

const crit = (over = {}) => ({ ...defaultPolicyCriteria(), ...over });

// ── Open policy ──────────────────────────────────────────────────────────

test('open: number + BU is a direct hit', () => {
  const r = searchPolicies(POLICIES, { mode: 'open', buCode: 'AT USA', query: '5012390', criteria: crit() });
  assert.equal(r.exactHit, true);
  assert.deepEqual(r.items.map(p => p.id), ['5012390-00']);
});

test('open: without BU finds nothing (BU is required)', () => {
  const r = searchPolicies(POLICIES, { mode: 'open', buCode: null, query: '5012390', criteria: crit() });
  assert.deepEqual(r.items, []);
});

test('open: wrong BU finds nothing', () => {
  const r = searchPolicies(POLICIES, { mode: 'open', buCode: 'AT UK', query: '5012390', criteria: crit() });
  assert.deepEqual(r.items, []);
});

test('open: several extensions, no extension given, lists them all', () => {
  const r = searchPolicies(POLICIES, { mode: 'open', buCode: 'AT USA', query: '5012346', criteria: crit() });
  assert.equal(r.exactHit, false);
  assert.equal(r.items.length, 2);
});

test('open: extension narrows to one hit, any status', () => {
  const r = searchPolicies(POLICIES, { mode: 'open', buCode: 'AT USA', query: '5012346', criteria: crit({ extension: '00' }) });
  assert.equal(r.exactHit, true);
  assert.deepEqual(r.items.map(p => p.id), ['5012346-00']);
  assert.equal(r.items[0].status, 'expired');
});

test('open: number-extension as displayed is a direct hit', () => {
  const r = searchPolicies(POLICIES, { mode: 'open', buCode: 'AT USA', query: '5012346-01', criteria: crit() });
  assert.equal(r.exactHit, true);
  assert.deepEqual(r.items.map(p => p.id), ['5012346-01']);
});

test('open: partial number is not a match', () => {
  const r = searchPolicies(POLICIES, { mode: 'open', buCode: 'AT USA', query: '50123', criteria: crit() });
  assert.deepEqual(r.items, []);
});

// ── Global search ────────────────────────────────────────────────────────

test('global: default criteria list every policy, all statuses, across BUs', () => {
  const r = searchPolicies(POLICIES, { mode: 'global', buCode: null, query: '', criteria: crit() });
  assert.equal(r.exactHit, false);
  assert.ok(r.items.length > 0);
  assert.ok(r.items.every(p => p.kind === 'policy'));
  assert.equal(new Set(r.items.map(p => p.status)).size, 3);
});

test('global: BU filter keeps only that BU', () => {
  const r = searchPolicies(POLICIES, { mode: 'global', buCode: 'AT UK', query: '', criteria: crit() });
  assert.ok(r.items.length > 0);
  assert.ok(r.items.every(p => p.buCode === 'AT UK'));
});

test('global: keyword matches policyholder, case insensitive', () => {
  const r = searchPolicies(POLICIES, { mode: 'global', buCode: null, query: 'brooklyn', criteria: crit() });
  assert.ok(r.items.length >= 2);
  assert.ok(r.items.every(p => p.policyholder.toLowerCase().includes('brooklyn')));
});

test('global: exact number is never a direct hit', () => {
  const r = searchPolicies(POLICIES, { mode: 'global', buCode: 'AT USA', query: '5012390', criteria: crit() });
  assert.equal(r.exactHit, false);
  assert.deepEqual(r.items.map(p => p.id), ['5012390-00']);
});

test('global: extension is ignored', () => {
  const r = searchPolicies(POLICIES, { mode: 'global', buCode: 'AT USA', query: '5012346', criteria: crit({ extension: '01' }) });
  assert.equal(r.items.length, 2);
});


test('global: drafts ignore statuses', () => {
  const r = searchPolicies(POLICIES, { mode: 'global', buCode: null, query: '', criteria: crit({ searchIn: 'drafts', statuses: ['issued'] }) });
  assert.equal(r.items.length, 4);
  assert.ok(r.items.every(p => p.kind === 'draft'));
});

test('global: no match returns an empty list', () => {
  const r = searchPolicies(POLICIES, { mode: 'global', buCode: null, query: 'zzz-nothing', criteria: crit() });
  assert.deepEqual(r.items, []);
});

test('global: one status keeps only that status', () => {
  const r = searchPolicies(POLICIES, { mode: 'global', buCode: 'AT USA', query: '', criteria: crit({ statuses: ['expired'] }) });
  assert.ok(r.items.length > 0);
  assert.ok(r.items.every(p => p.status === 'expired'));
});

test('global: no status checked finds no policy', () => {
  const r = searchPolicies(POLICIES, { mode: 'global', buCode: 'AT USA', query: '', criteria: crit({ statuses: [] }) });
  assert.deepEqual(r.items, []);
});

test('default criteria check every status', () => {
  assert.deepEqual([...defaultPolicyCriteria().statuses].sort(), ['cancelled', 'expired', 'issued']);
});
