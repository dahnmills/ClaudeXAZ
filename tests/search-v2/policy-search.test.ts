import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchPolicies, type PolicyQuery } from '../../src/app/pages/search-v2/policy-search.ts';
import { POLICIES } from '../../src/app/pages/search-v2/policies.mock.ts';
import { defaultPolicyCriteria } from '../../src/app/shared/ui/policy-criteria/policy-criteria.model.ts';

const q = (over: Partial<PolicyQuery> = {}): PolicyQuery =>
  ({ buCode: null, query: '', criteria: defaultPolicyCriteria(), ...over });
const crit = (over = {}) => ({ ...defaultPolicyCriteria(), ...over });
const allStatuses = crit({ statuses: ['issued', 'cancelled', 'expired'] });

test('default criteria check Issued only', () => {
  assert.deepEqual(defaultPolicyCriteria().statuses, ['issued']);
});

test('default search lists issued policies only', () => {
  const r = searchPolicies(POLICIES, q());
  assert.ok(r.length > 0);
  assert.ok(r.every(p => p.kind === 'policy' && p.status === 'issued'));
});

test('BU filter keeps only that BU', () => {
  const r = searchPolicies(POLICIES, q({ buCode: 'AT UK', criteria: allStatuses }));
  assert.ok(r.length > 0);
  assert.ok(r.every(p => p.buCode === 'AT UK'));
});

test('matches policy name, partial, case insensitive', () => {
  const r = searchPolicies(POLICIES, q({ query: 'FOOD' }));
  assert.ok(r.length >= 2);
  assert.ok(r.every(p => `${p.policyName} ${p.insuredName}`.toLowerCase().includes('food')));
  assert.ok(r.some(p => p.policyName.toLowerCase().includes('food')));
});

test('matches insured name partial', () => {
  const r = searchPolicies(POLICIES, q({ query: 'brooklyn craft', criteria: allStatuses }));
  assert.ok(r.length >= 2);
  assert.ok(r.every(p => p.insuredName.toLowerCase().includes('brooklyn craft')));
});

test('matches broker name partial', () => {
  const r = searchPolicies(POLICIES, q({ query: 'marsh', criteria: allStatuses }));
  assert.ok(r.length >= 2);
  assert.ok(r.every(p => (p.brokerName ?? '').toLowerCase().includes('marsh')));
});

test('matches policy number partial across BUs', () => {
  const r = searchPolicies(POLICIES, q({ query: '330117', criteria: allStatuses }));
  assert.ok(r.every(p => p.policyNumber.includes('330117')));
  assert.ok(new Set(r.map(p => p.buCode)).size >= 2);
});

test('insured Company ID matches exactly, not partially', () => {
  const full = searchPolicies(POLICIES, q({ query: '40213377' }));
  assert.ok(full.length >= 1);
  assert.ok(full.every(p => p.insuredCompanyId === '40213377'));
  assert.deepEqual(searchPolicies(POLICIES, q({ query: '402133' })), []);
});

test('broker Company ID matches exactly', () => {
  const r = searchPolicies(POLICIES, q({ query: '80011290', criteria: allStatuses }));
  assert.ok(r.length >= 2);
  assert.ok(r.every(p => p.brokerCompanyId === '80011290'));
  assert.deepEqual(searchPolicies(POLICIES, q({ query: '800112', criteria: allStatuses })), []);
});

test('Company ID ignores surrounding spaces', () => {
  const r = searchPolicies(POLICIES, q({ query: '  40213377 ' }));
  assert.ok(r.length >= 1);
  assert.ok(r.every(p => p.insuredCompanyId === '40213377'));
});

test('extension is never searched', () => {
  const withExt = POLICIES.find(p => p.kind === 'policy' && p.extension === '0234');
  assert.ok(withExt, 'mock has a policy with extension 0234');
  const r = searchPolicies(POLICIES, q({ query: '0234', criteria: allStatuses }));
  assert.ok(!r.some(p => p.id === withExt.id));
});

test('drafts ignore statuses', () => {
  const r = searchPolicies(POLICIES, q({ criteria: crit({ searchIn: 'drafts', statuses: [] }) }));
  assert.equal(r.length, POLICIES.filter(p => p.kind === 'draft').length);
  assert.ok(r.every(p => p.kind === 'draft'));
});

test('no status checked finds no policy', () => {
  assert.deepEqual(searchPolicies(POLICIES, q({ criteria: crit({ statuses: [] }) })), []);
});

test('no match returns an empty list', () => {
  assert.deepEqual(searchPolicies(POLICIES, q({ query: 'zzz-nothing', criteria: allStatuses })), []);
});
