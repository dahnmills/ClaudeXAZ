import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WALKTHROUGHS, walkthroughFor, TOUR_MENU_LABEL } from '../../src/app/shared/walkthrough/walkthroughs.ts';

test('the Help menu entry has one generic wording for every page', () => {
  assert.equal(TOUR_MENU_LABEL, 'Take a tour of this page');
});

test('buyer summary has its tour, in every zone', () => {
  assert.equal(walkthroughFor('/buyer-summary/137381425')?.id, 'buyer-summary');
  assert.equal(walkthroughFor('/prototype/buyer-summary/1')?.id, 'buyer-summary');
  assert.equal(walkthroughFor('/review/buyer-summary/1?x=1')?.id, 'buyer-summary');
});

test('a page without tour gets none', () => {
  assert.equal(walkthroughFor('/search-v2'), null);
  assert.equal(walkthroughFor('/'), null);
  assert.equal(walkthroughFor('/buyer-summary-lab'), null);
});

test('one tour per page at most', () => {
  const pages = WALKTHROUGHS.map(w => w.page);
  assert.equal(new Set(pages).size, pages.length);
});

test('every tour opens on an intro and closes on an outro, both centered', () => {
  for (const w of WALKTHROUGHS) {
    const first = w.steps[0], last = w.steps[w.steps.length - 1];
    assert.equal(first.element, undefined);
    assert.equal(first.advance, 'next');
    assert.equal(first.nextLabel, 'Start');
    assert.equal(last.element, undefined);
    assert.equal(last.advance, 'done');
  }
});

test('every middle step targets an element; gone steps name what must disappear', () => {
  for (const w of WALKTHROUGHS) {
    for (const s of w.steps.slice(1, -1)) {
      assert.ok(s.element && s.title && s.description, `${w.id}: incomplete step "${s.title}"`);
      if (s.advance === 'gone') assert.ok(s.gone, `${w.id}: "${s.title}" needs a gone selector`);
    }
  }
});

test('the buyer summary tour builds a full board, then names it', () => {
  const w = walkthroughFor('/buyer-summary/1')!;
  const titles = w.steps.map(s => s.title);
  assert.deepEqual(titles.slice(0, 4), ['Build your own board', 'Manage your boards', 'Create a new board', 'Pick the 2×2 grid']);
  // Les 4 cases du 2×2, chacune avec une card différente
  const adds = w.steps.filter(s => s.title.startsWith('Add '));
  assert.deepEqual(adds.map(s => s.title), ['Add Grade', 'Add Exposure', 'Add Risk figures', 'Add Limit']);
  assert.equal(new Set(adds.map(s => s.element)).size, 4);
  assert.deepEqual(w.steps.filter(s => s.title.startsWith('Fill a spot')).map(s => s.title),
    ['Fill a spot · 4 left', 'Fill a spot · 3 left', 'Fill a spot · 2 left', 'Fill a spot · 1 left']);
  assert.deepEqual(titles.slice(-6), ['Resize a card', 'Save your board', 'Open Manage boards again', 'Rename it', 'Type a name', 'Your board is ready']);
});
