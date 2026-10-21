import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  byRecent, filterHistory, countByKind, clearLabel, emptyLabel, upsertFront, removeKind,
  searchedLabel, fullDate,
} from '../../src/app/pages/search-v2/search-v2-history.ts';

type E = { kind: 'buyer' | 'policy'; ts: number; id: string };
const items: E[] = [
  { kind: 'buyer',  ts: 1, id: 'b1' },
  { kind: 'policy', ts: 4, id: 'p1' },
  { kind: 'buyer',  ts: 3, id: 'b2' },
  { kind: 'policy', ts: 2, id: 'p2' },
];

test('byRecent sorts newest first without mutating', () => {
  assert.deepEqual(byRecent(items).map(e => e.id), ['p1', 'b2', 'p2', 'b1']);
  assert.equal(items[0].id, 'b1');
});

test('filterHistory all is one chronological thread', () => {
  assert.deepEqual(filterHistory(items, 'all').map(e => e.id), ['p1', 'b2', 'p2', 'b1']);
});

test('filterHistory by kind keeps only that kind, newest first', () => {
  assert.deepEqual(filterHistory(items, 'policy').map(e => e.id), ['p1', 'p2']);
  assert.deepEqual(filterHistory(items, 'buyer').map(e => e.id), ['b2', 'b1']);
});



test('countByKind', () => {
  assert.deepEqual(countByKind(items), { all: 4, buyer: 2, policy: 2 });
  assert.deepEqual(countByKind([]), { all: 0, buyer: 0, policy: 0 });
});

test('clearLabel follows the filter', () => {
  assert.equal(clearLabel('all'), 'Clear all');
  assert.equal(clearLabel('buyer'), 'Clear buyers');
  assert.equal(clearLabel('policy'), 'Clear policies');
});

test('emptyLabel per tab and filter', () => {
  assert.equal(emptyLabel('searched', 'all'), 'No recent search');
  assert.equal(emptyLabel('searched', 'policy'), 'No policy search yet');
  assert.equal(emptyLabel('viewed', 'buyer'), 'No buyer viewed yet');
  assert.equal(emptyLabel('favorites', 'policy'), 'No favorite policy yet');
});

test('upsertFront moves a known entry to the front and caps the list', () => {
  const key = (e: E) => e.id;
  const next = upsertFront(items, { kind: 'buyer', ts: 9, id: 'b1' }, key, 3);
  assert.deepEqual(next.map(e => e.id), ['b1', 'p1', 'b2']);
  assert.equal(next[0].ts, 9);
});

test('clearKind keeps the other kind', () => {
  assert.deepEqual(removeKind(items, 'policy').map(e => e.id), ['b1', 'b2']);
  assert.deepEqual(removeKind(items), []);
});


// Mercredi 21 octobre 2026, 15:00 (heure locale)
const now = new Date(2026, 9, 21, 15, 0).getTime();
const at = (d: number, h: number, m = 0, y = 2026, mo = 9) => new Date(y, mo, d, h, m).getTime();

test('searchedLabel is relative over a few days, with the verb', () => {
  assert.equal(searchedLabel(now - 30_000, now), 'Searched just now');
  assert.equal(searchedLabel(at(21, 14, 48), now), 'Searched 12 min ago');
  assert.equal(searchedLabel(at(21, 9), now), 'Searched 6 h ago');
  assert.equal(searchedLabel(at(20, 23), now), 'Searched yesterday');
  assert.equal(searchedLabel(at(17, 10), now), 'Searched 4 days ago');
});

test('searchedLabel turns absolute after a week, year only when it differs', () => {
  assert.equal(searchedLabel(at(14, 10), now), 'Searched 14 Oct');
  assert.equal(searchedLabel(at(29, 10, 0, 2025, 8), now), 'Searched 29 Sep 2025');
});

test('fullDate gives the exact moment for the tooltip', () => {
  assert.equal(fullDate(at(29, 14, 32, 2026, 8)), '29 Sep 2026, 14:32');
});
