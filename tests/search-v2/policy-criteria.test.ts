import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withSearchIn } from '../../src/app/shared/ui/policy-criteria/policy-criteria.model.ts';

const picked = { searchIn: 'policies' as const, statuses: ['issued' as const, 'cancelled' as const] };

test('re-picking the current source keeps the checked statuses', () => {
  assert.deepEqual(withSearchIn(picked, 'policies'), picked);
});

test('back to Policies from Drafts rechecks Issued', () => {
  assert.deepEqual(withSearchIn({ searchIn: 'drafts', statuses: [] }, 'policies'), { searchIn: 'policies', statuses: ['issued'] });
});

test('going to Drafts keeps the statuses for later', () => {
  assert.deepEqual(withSearchIn(picked, 'drafts'), { ...picked, searchIn: 'drafts' });
});
