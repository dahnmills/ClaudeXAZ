import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  policyKeyLabel, policyBadge, policyDateBlock, formatPolicyDate, policyDetailRows, policyTileIcon,
} from '../../src/app/shared/ui/policy-result-card/policy-card.view.ts';
import type { SignedPolicy, DraftPolicy } from '../../src/app/shared/ui/policy-result-card/policy.model.ts';

const today = new Date('2026-10-28T00:00:00Z');

const policy = (over: Partial<SignedPolicy> = {}): SignedPolicy => ({
  id: 'POL/AT UK/7730012/0234', kind: 'policy', buCode: 'AT UK', policyNumber: '7730012', extension: '0234',
  status: 'issued', policyName: 'Galaxy Pharma Distribution', insuredName: 'Galaxy Pharma Distribution Ltd',
  insuredCompanyId: '40213377', insuredCountry: 'United Kingdom', product: 'CAP',
  segment: 'Mid Market', lob: 'Single Risk', brokerName: 'Marsh Ltd', brokerCompanyId: '80011290',
  inceptionDate: '2026-06-15', expiryDate: '2027-06-14', nextRenewalDate: '2027-06-14', inforceBu: 'AT UK',
  ...over,
});

const draft = (over: Partial<DraftPolicy> = {}): DraftPolicy => ({
  id: 'DFT/AT UK/D20431', kind: 'draft', buCode: 'AT UK', policyNumber: 'D20431', draftStage: 'nbi',
  status: 'pending', updatedDate: '2026-10-21', policyName: 'Nordic Food Supply', insuredName: 'Polaris Tech Nordic AB',
  ...over,
});

test('key label with extension', () => {
  assert.equal(policyKeyLabel(policy()), 'AT UK · 7730012 · 0234');
});

test('key label without extension', () => {
  assert.equal(policyKeyLabel(policy({ policyNumber: '7730250', extension: null })), 'AT UK · 7730250');
});

test('draft key label shows stage', () => {
  assert.equal(policyKeyLabel(draft()), 'AT UK · D20431 · NBI');
  assert.equal(policyKeyLabel(draft({ policyNumber: 'D20432', draftStage: 'app', status: 'applicant' })), 'AT UK · D20432 · APP');
});

test('policy badges', () => {
  assert.deepEqual(policyBadge(policy()), { label: 'Issued', status: 'success' });
  assert.deepEqual(policyBadge(policy({ status: 'cancelled' })), { label: 'Cancelled', status: 'error' });
  assert.deepEqual(policyBadge(policy({ status: 'expired' })), { label: 'Expired', status: 'neutral' });
});

test('draft badges', () => {
  const tone = (status: DraftPolicy['status']) => policyBadge(draft({ status })).status;
  assert.equal(tone('applicant'), 'info');
  assert.equal(tone('pending'), 'warning');
  assert.equal(tone('returned'), 'warning');
  assert.equal(tone('aborted'), 'neutral');
  assert.equal(tone('cancelled'), 'error');
  assert.equal(tone('transformed'), 'success');
  assert.equal(policyBadge(draft({ status: 'transformed' })).label, 'Transformed');
});

test('format policy date', () => {
  assert.equal(formatPolicyDate('2026-11-15'), '15 Nov 2026');
  assert.equal(formatPolicyDate('2027-01-02'), '02 Jan 2027');
});

test('renewal in 30 days alerts, 31 does not', () => {
  assert.deepEqual(policyDateBlock(policy({ nextRenewalDate: '2026-11-27' }), today),
    { label: 'Next renewal', value: '27 Nov 2026', alert: true });
  assert.deepEqual(policyDateBlock(policy({ nextRenewalDate: '2026-11-28' }), today),
    { label: 'Next renewal', value: '28 Nov 2026', alert: false });
});

test('renewal today alerts', () => {
  assert.equal(policyDateBlock(policy({ nextRenewalDate: '2026-10-28' }), today)?.alert, true);
});

test('renewal today alerts whatever the time of day', () => {
  assert.equal(policyDateBlock(policy({ nextRenewalDate: '2026-10-28' }), new Date('2026-10-28T22:30:00Z'))?.label, 'Next renewal');
});

test('renewal past on an issued policy', () => {
  assert.deepEqual(policyDateBlock(policy({ nextRenewalDate: '2026-10-23' }), today),
    { label: 'Renewal overdue', value: '23 Oct 2026', alert: true });
});

test('issued without renewal date', () => {
  assert.equal(policyDateBlock(policy({ nextRenewalDate: undefined }), today), null);
});

test('cancelled shows cancellation date', () => {
  assert.deepEqual(policyDateBlock(policy({ status: 'cancelled', nextRenewalDate: undefined, cancellationDate: '2026-03-01' }), today),
    { label: 'Cancelled on', value: '01 Mar 2026', alert: false });
});

test('expired shows expiry date', () => {
  assert.deepEqual(policyDateBlock(policy({ status: 'expired', nextRenewalDate: undefined, expiryDate: '2026-03-31' }), today),
    { label: 'Expired on', value: '31 Mar 2026', alert: false });
});

test('draft shows updated date', () => {
  assert.deepEqual(policyDateBlock(draft(), today), { label: 'Updated', value: '21 Oct 2026', alert: false });
});

test('detail rows for a policy', () => {
  assert.deepEqual(policyDetailRows(policy()), [
    { label: 'Insured Company ID', value: '40213377' },
    { label: 'Insured country', value: 'United Kingdom' },
    { label: 'Inception', value: '15 Jun 2026' },
    { label: 'Expiry', value: '14 Jun 2027' },
    { label: 'Segment', value: 'Mid Market' },
    { label: 'LOB', value: 'Single Risk' },
    { label: 'Broker', value: 'Marsh Ltd · 80011290' },
    { label: 'Inforce BU', value: 'AT UK' },
  ]);
});

test('detail rows show — for a missing value', () => {
  const rows = policyDetailRows(policy({ segment: undefined, lob: undefined, brokerName: undefined, brokerCompanyId: undefined }));
  assert.equal(rows.find(r => r.label === 'Segment')?.value, '—');
  assert.equal(rows.find(r => r.label === 'LOB')?.value, '—');
  assert.equal(rows.find(r => r.label === 'Broker')?.value, '—');
});

test('detail rows for a draft', () => {
  assert.deepEqual(policyDetailRows(draft()).map(r => r.label),
    ['Insured Company ID', 'Insured country', 'Segment', 'LOB', 'Broker']);
});

test('tile icons', () => {
  assert.equal(policyTileIcon(policy()), 'contract');
  assert.equal(policyTileIcon(draft({ draftStage: 'app', status: 'applicant' })), 'file-new');
  assert.equal(policyTileIcon(draft()), 'file-text');
});
