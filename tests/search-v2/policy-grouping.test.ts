import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupingOptions, sortForGrouping, groupPolicies, groupCounts } from '../../src/app/pages/search-v2/policy-grouping.ts';
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
const app = (n: string) => dft(n, { draftStage: 'app', status: 'issued', versionCount: 1 });
const ids = (l: PolicyResultData[]) => l.map(p => p.policyNumber);

test('grouping options: Stage only exists for drafts', () => {
  assert.deepEqual(groupingOptions('drafts'), [
    { value: 'none', label: 'None' }, { value: 'stage', label: 'Stage' }, { value: 'status', label: 'Status' },
  ]);
  assert.deepEqual(groupingOptions('policies').map(o => o.value), ['none', 'status']);
});

test('no grouping keeps the search order, in a single headless group', () => {
  const l = [dft('C'), app('A'), dft('B')];
  assert.deepEqual(ids(sortForGrouping(l, 'none')), ['C', 'A', 'B']);
  assert.deepEqual(groupPolicies(l, 'none').map(g => [g.label, ids(g.items)]), [[null, ['C', 'A', 'B']]]);
});

test('stage puts APP before NBI, search order kept inside a stage', () => {
  const l = [dft('N1'), app('A1'), dft('N2'), app('A2')];
  assert.deepEqual(ids(sortForGrouping(l, 'stage')), ['A1', 'A2', 'N1', 'N2']);
});

test('draft status groups go from live to closed', () => {
  const l = [dft('c', { status: 'cancelled' }), dft('t', { status: 'transformed' }), dft('p'), dft('i', { status: 'issued' })];
  assert.deepEqual(ids(sortForGrouping(l, 'status')), ['p', 'i', 't', 'c']);
});

test('policy status groups: issued, cancelled, expired', () => {
  const l = [pol('e', { status: 'expired' }), pol('c', { status: 'cancelled' }), pol('i')];
  assert.deepEqual(ids(sortForGrouping(l, 'status')), ['i', 'c', 'e']);
});

test('grouping never mutates the input', () => {
  const l = [dft('B'), app('A')];
  sortForGrouping(l, 'stage');
  assert.deepEqual(ids(l), ['B', 'A']);
});

test('groups are labelled by stage or status', () => {
  const l = sortForGrouping([dft('N'), app('A')], 'stage');
  assert.deepEqual(groupPolicies(l, 'stage').map(g => [g.label, ids(g.items)]), [['APP', ['A']], ['NBI', ['N']]]);
  const s = sortForGrouping([pol('i'), pol('e', { status: 'expired' })], 'status');
  assert.deepEqual(groupPolicies(s, 'status').map(g => g.label), ['Issued', 'Expired']);
});

test('group counts come from the whole list, not the loaded page', () => {
  const all = sortForGrouping([dft('N1'), dft('N2'), app('A')], 'stage');
  assert.deepEqual(groupCounts(all, 'stage'), { APP: 1, NBI: 2 });
});

test('empty list gives no group', () => {
  assert.deepEqual(groupPolicies([], 'stage'), []);
});
