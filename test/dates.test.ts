import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildYear, nextLevel, toKey, cleanStreak } from '../src/lib/dates.ts';

test('covers every day of a leap year exactly once', () => {
  const keys = buildYear(2024, new Date(2024, 5, 1)).flatMap((w) => w.cells.filter(Boolean).map((c) => c!.key));
  assert.equal(keys.length, 366);
  assert.equal(new Set(keys).size, 366);
});
test('non-leap year has 365 days; first column aligned to Sunday', () => {
  const weeks = buildYear(2026, new Date(2026, 0, 1));
  assert.equal(weeks.flatMap((w) => w.cells.filter(Boolean)).length, 365);
  assert.equal(weeks[0].cells[4]?.key, '2026-01-01'); // Thursday
  assert.equal(weeks[0].cells[0], null);
});
test('future flag', () => {
  const cells = buildYear(2026, new Date(2026, 9, 17)).flatMap((w) => w.cells.filter(Boolean));
  assert.equal(cells.find((c) => c!.key === '2026-10-17')!.future, false);
  assert.equal(cells.find((c) => c!.key === '2026-10-18')!.future, true);
});
test('month labels: 12 of them', () => {
  assert.equal(buildYear(2026).filter((w) => w.monthLabel).length, 12);
});
test('nextLevel wraps', () => {
  assert.equal(nextLevel(4, 5), 0);
  assert.equal(nextLevel(0, 5), 1);
});
test('streak', () => {
  const t = new Date(2026, 9, 17);
  assert.equal(cleanStreak({ '2026-10-14': 2 }, t), 3);
  assert.equal(cleanStreak({ '2026-10-17': 1 }, t), 0);
});
test('toKey is local', () => assert.equal(toKey(new Date(2026, 0, 5, 23, 59)), '2026-01-05'));
