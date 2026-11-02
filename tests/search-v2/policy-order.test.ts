import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orderOptions, orderPolicies, groupPolicies, groupCounts } from '../../src/app/pages/search-v2/policy-order.ts';
import type { SignedPolicy, DraftPolicy, PolicyResultData } from '../../src/app/shared/ui/policy-result-card/policy.model.ts';

const pol = (n: string, over: Partial<SignedPolicy> = {}): SignedPolicy => ({
  id: `POL/AT UK/${n}`, kind: 'policy', buCode: 'AT UK', policyNumber: n, extension: null, status: 'issued',
  policyName: n, insuredName: 'x', inceptionDate: '2026-01-01', expiryDate: '2026-12-31', ...over,
});
const dft = (n: string, over: Partial<DraftPolicy> = {}): DraftPolicy => ({
  id: `DFT/AT UK/${n}`, kind: 'draft', buCode: 'AT UK', policyNumber: n, extension: null, draftStage: 'nbi',
  status: 'pending', versionCount: 2, policyName: n, insuredName: 'x',
  inceptionDate: '2027-01-01', expiryDate: '2027-12-31', ...over,
});
const ids = (l: PolicyResultData[]) => l.map(p => p.policyNumber);

test('order options: Stage only exists for drafts', () => {
  assert.deepEqual(orderOptions('drafts').map(o => o.value), ['relevance', 'stage', 'status', 'date', 'name']);
  assert.deepEqual(orderOptions('policies').map(o => o.value), ['relevance', 'status', 'date', 'name']);
  assert.equal(orderOptions('policies').find(o => o.value === 'date')?.label, 'Next renewal');
  assert.equal(orderOptions('drafts').find(o => o.value === 'date')?.label, 'Inception');
});

test('relevance keeps the search order', () => {
  const l = [dft('C'), dft('A'), dft('B')];
  assert.deepEqual(ids(orderPolicies(l, 'relevance')), ['C', 'A', 'B']);
});

test('stage puts APP before NBI, search order kept inside a stage', () => {
  const l = [dft('N1'), dft('A1', { draftStage: 'app', status: 'issued', versionCount: 1 }), dft('N2'), dft('A2', { draftStage: 'app', status: 'issued', versionCount: 1 })];
  assert.deepEqual(ids(orderPolicies(l, 'stage')), ['A1', 'A2', 'N1', 'N2']);
});

test('draft status order goes from live to closed', () => {
  const l = [dft('c', { status: 'cancelled' }), dft('t', { status: 'transformed' }), dft('p', { status: 'pending' }), dft('i', { status: 'issued' })];
  assert.deepEqual(ids(orderPolicies(l, 'status')), ['p', 'i', 't', 'c']);
});

test('policy status order: issued, cancelled, expired', () => {
  const l = [pol('e', { status: 'expired' }), pol('c', { status: 'cancelled' }), pol('i')];
  assert.deepEqual(ids(orderPolicies(l, 'status')), ['i', 'c', 'e']);
});

test('date: nearest renewal first for policies, missing dates last', () => {
  const l = [pol('late', { nextRenewalDate: '2027-06-01' }), pol('none'), pol('soon', { nextRenewalDate: '2026-11-20' })];
  assert.deepEqual(ids(orderPolicies(l, 'date')), ['soon', 'late', 'none']);
});

test('date: earliest inception first for drafts', () => {
  const l = [dft('b', { inceptionDate: '2027-03-01' }), dft('a', { inceptionDate: '2026-09-01' })];
  assert.deepEqual(ids(orderPolicies(l, 'date')), ['a', 'b']);
});

test('name: alphabetical, accents and case ignored', () => {
  const l = [dft('x', { policyName: 'mistral' }), dft('y', { policyName: 'Énergie' }), dft('z', { policyName: 'Aurora' })];
  assert.deepEqual(orderPolicies(l, 'name').map(p => p.policyName), ['Aurora', 'Énergie', 'mistral']);
});

test('ordering never mutates the input', () => {
  const l = [dft('B'), dft('A', { draftStage: 'app', status: 'issued', versionCount: 1 })];
  orderPolicies(l, 'stage');
  assert.deepEqual(ids(l), ['B', 'A']);
});

test('stage and status group the list; other orders stay flat', () => {
  const l = orderPolicies([dft('N'), dft('A', { draftStage: 'app', status: 'issued', versionCount: 1 })], 'stage');
  assert.deepEqual(groupPolicies(l, 'stage').map(g => [g.label, ids(g.items)]), [['APP', ['A']], ['NBI', ['N']]]);
  assert.deepEqual(groupPolicies(l, 'name').map(g => g.label), [null]);
  assert.deepEqual(groupPolicies(orderPolicies([pol('i'), pol('e', { status: 'expired' })], 'status'), 'status').map(g => g.label), ['Issued', 'Expired']);
});

test('group counts come from the whole list, not the loaded page', () => {
  const all = orderPolicies([dft('N1'), dft('N2'), dft('A', { draftStage: 'app', status: 'issued', versionCount: 1 })], 'stage');
  assert.deepEqual(groupCounts(all, 'stage'), { APP: 1, NBI: 2 });
});

test('empty list gives no group', () => {
  assert.deepEqual(groupPolicies([], 'stage'), []);
});
