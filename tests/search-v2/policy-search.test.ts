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
