import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POLICIES } from '../../src/app/pages/search-v2/policies.mock.ts';
import { policyId, type SignedPolicy, type DraftPolicy } from '../../src/app/shared/ui/policy-result-card/policy.model.ts';

const signed = POLICIES.filter((p): p is SignedPolicy => p.kind === 'policy');
const drafts = POLICIES.filter((p): p is DraftPolicy => p.kind === 'draft');
const DAY = 86_400_000;

test('policyId includes the BU and the extension when there is one', () => {
  assert.equal(policyId({ kind: 'policy', buCode: 'AT UK', policyNumber: '7730012', extension: '0234' }), 'POL/AT UK/7730012/0234');
  assert.equal(policyId({ kind: 'policy', buCode: 'AT UK', policyNumber: '7730250', extension: null }), 'POL/AT UK/7730250');
  assert.equal(policyId({ kind: 'draft', buCode: 'AT UK', policyNumber: 'D20431' }), 'DFT/AT UK/D20431');
});

test('ids are unique', () => {
  assert.equal(new Set(POLICIES.map(p => p.id)).size, POLICIES.length);
});

test('ids are built by policyId', () => {
  assert.ok(POLICIES.every(p => p.id === policyId(p)));
});

test('same policy number exists in two BUs', () => {
  const byNumber = new Map<string, Set<string>>();
  for (const p of signed) byNumber.set(p.policyNumber, (byNumber.get(p.policyNumber) ?? new Set()).add(p.buCode));
  assert.ok([...byNumber.values()].some(bus => bus.size >= 2));
});

test('extensions are text: 001 and 1 coexist on one policy number', () => {
  const nums = (ext: string) => new Set(signed.filter(p => p.extension === ext).map(p => `${p.buCode}/${p.policyNumber}`));
  const ones = nums('1');
  assert.ok([...nums('001')].some(k => ones.has(k)));
});

test('one policy has no extension', () => {
  assert.ok(signed.some(p => p.extension === null));
});

test('one issued policy renews within 30 days of today', () => {
  const now = Date.now();
  assert.ok(signed.some(p => p.status === 'issued' && p.nextRenewalDate
    && Date.parse(p.nextRenewalDate) - now >= 0 && Date.parse(p.nextRenewalDate) - now <= 30 * DAY));
});

test('covers every policy status', () => {
  assert.deepEqual(new Set(signed.map(p => p.status)), new Set(['issued', 'cancelled', 'expired']));
});

test('cancelled policies carry a cancellation date', () => {
  assert.ok(signed.filter(p => p.status === 'cancelled').every(p => !!p.cancellationDate));
});

test('drafts cover both stages and at least 3 statuses', () => {
  assert.deepEqual(new Set(drafts.map(d => d.draftStage)), new Set(['app', 'nbi']));
  assert.ok(new Set(drafts.map(d => d.status)).size >= 3);
});

test('every APP draft has status applicant', () => {
  assert.ok(drafts.filter(d => d.draftStage === 'app').every(d => d.status === 'applicant'));
  assert.ok(drafts.filter(d => d.draftStage === 'nbi').every(d => d.status !== 'applicant'));
});

test('one insured holds a CAP and a Partial non-can policy', () => {
  const products = new Map<string, Set<string>>();
  for (const p of signed) products.set(p.insuredName, (products.get(p.insuredName) ?? new Set()).add(p.product ?? ''));
  assert.ok([...products.values()].some(s => s.has('CAP') && s.has('Partial non-can')));
});

test('some policies have no segment nor LOB', () => {
  assert.ok(signed.some(p => !p.segment && !p.lob));
});
