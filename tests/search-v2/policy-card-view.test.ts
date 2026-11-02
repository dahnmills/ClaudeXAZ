import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  policyKeyLabel, policyBadge, policyDateBlock, formatPolicyDate, policyDetailRows, policyDetailColumns, policyTileIcon,
  policySecondLine,
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
  id: 'DFT/AT UK/D20431', kind: 'draft', buCode: 'AT UK', policyNumber: 'D20431', extension: null, draftStage: 'nbi',
  status: 'pending', versionCount: 3, policyName: 'Nordic Food Supply', insuredName: 'Polaris Tech Nordic AB',
  insuredCompanyId: '20087731', insuredCountry: 'Sweden', product: 'CAP', segment: 'SME', lob: 'Core',
  brokerName: 'Marsh Ltd', brokerCompanyId: '80011290',
  inceptionDate: '2027-01-01', expiryDate: '2027-12-31', inforceBu: 'AT UK',
  ...over,
});

test('key label with extension', () => {
  assert.equal(policyKeyLabel(policy()), 'AT UK · 7730012 · 0234');
});

test('key label without extension', () => {
  assert.equal(policyKeyLabel(policy({ policyNumber: '7730250', extension: null })), 'AT UK · 7730250');
});

test('draft key label is the draft, not one of its versions', () => {
  assert.equal(policyKeyLabel(draft()), 'AT UK · D20431');
});

test('second line: product then insured', () => {
  assert.equal(policySecondLine(policy()), 'CAP · Galaxy Pharma Distribution Ltd');
  assert.equal(policySecondLine(policy({ product: undefined })), 'Galaxy Pharma Distribution Ltd');
});

test('second line of a draft ends with its version count', () => {
  assert.equal(policySecondLine(draft()), 'CAP · Polaris Tech Nordic AB · 3 versions');
  assert.equal(policySecondLine(draft({ draftStage: 'app', status: 'issued', versionCount: 1 })), 'CAP · Polaris Tech Nordic AB · 1 version');
});

test('policy badges', () => {
  assert.deepEqual(policyBadge(policy()), { label: 'Issued', status: 'success' });
  assert.deepEqual(policyBadge(policy({ status: 'cancelled' })), { label: 'Cancelled', status: 'error' });
  assert.deepEqual(policyBadge(policy({ status: 'expired' })), { label: 'Expired', status: 'neutral' });
});

test('draft badges', () => {
  const tone = (status: DraftPolicy['status']) => policyBadge(draft({ status })).status;
  assert.equal(tone('issued'), 'info');
  assert.equal(tone('inactive'), 'neutral');
  assert.equal(tone('pending'), 'warning');
  assert.equal(tone('returned'), 'warning');
  assert.equal(tone('aborted'), 'neutral');
  assert.equal(tone('cancelled'), 'error');
  assert.equal(tone('transformed'), 'success');
});

test('draft badge reads stage first, then status', () => {
  assert.equal(policyBadge(draft()).label, 'NBI · Pending');
  assert.equal(policyBadge(draft({ draftStage: 'app', status: 'issued' })).label, 'APP · Issued');
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

test('draft shows its proposed inception', () => {
  assert.deepEqual(policyDateBlock(draft(), today), { label: 'Inception', value: '01 Jan 2027', alert: false });
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

test('detail rows for a draft are the same fields as a policy', () => {
  assert.deepEqual(policyDetailRows(draft()).map(r => r.label), policyDetailRows(policy()).map(r => r.label));
  assert.equal(policyDetailRows(draft()).find(r => r.label === 'Expiry')?.value, '31 Dec 2027');
});

test('tile icons', () => {
  assert.equal(policyTileIcon(policy()), 'contract');
  assert.equal(policyTileIcon(draft({ draftStage: 'app', status: 'issued' })), 'file-new');
  assert.equal(policyTileIcon(draft()), 'file-text');
});

test('detail columns: a policy reads as 4 columns of 2 fields', () => {
  const cols = policyDetailColumns(policy());
  assert.deepEqual(cols.map(c => c.length), [2, 2, 2, 2]);
  assert.deepEqual(cols[0].map(r => r.label), ['Insured Company ID', 'Insured country']);
  assert.deepEqual(cols[3].map(r => r.label), ['Broker', 'Inforce BU']);
});

test('detail columns: a draft reads as 4 columns of 2 fields too', () => {
  assert.deepEqual(policyDetailColumns(draft()).map(c => c.length), [2, 2, 2, 2]);
});
