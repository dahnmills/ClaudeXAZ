import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WALKTHROUGHS, walkthroughsFor } from '../../src/app/shared/walkthrough/walkthroughs.ts';

test('buyer summary offers the custom board walkthrough', () => {
  assert.deepEqual(walkthroughsFor('/buyer-summary/137381425').map(w => w.id), ['create-custom-board']);
});

test('the dev and review zones resolve to the same page', () => {
  assert.equal(walkthroughsFor('/prototype/buyer-summary/1').length, 1);
  assert.equal(walkthroughsFor('/review/buyer-summary/1?x=1').length, 1);
});

test('a page without walkthrough gets none', () => {
  assert.deepEqual(walkthroughsFor('/search-v2'), []);
  assert.deepEqual(walkthroughsFor('/'), []);
});

test('a page name is matched as a whole path segment', () => {
  assert.deepEqual(walkthroughsFor('/buyer-summary-lab'), []);
});

test('every walkthrough is well formed', () => {
  const ids = new Set<string>();
  for (const w of WALKTHROUGHS) {
    assert.ok(!ids.has(w.id), `duplicate id ${w.id}`);
    ids.add(w.id);
    assert.ok(w.label && w.page && w.steps.length >= 2);
    for (const s of w.steps) assert.ok(s.element && s.title && s.description, `${w.id}: incomplete step`);
    assert.ok(w.steps.slice(0, -1).every(s => s.advance === 'click'), `${w.id}: the user does every step but the last`);
    assert.equal(w.steps[w.steps.length - 1].advance, 'done', `${w.id}: ends on a Done step`);
  }
});

test('the custom board walkthrough follows the board builder path', () => {
  const w = WALKTHROUGHS.find(x => x.id === 'create-custom-board')!;
  assert.deepEqual(w.steps.map(s => s.title), [
    'Manage your boards', 'Create a new board', 'Pick a layout', 'Fill a spot', 'Add a card', 'Save your board', 'Your new board',
  ]);
});
