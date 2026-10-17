export type DayCell = { key: string; future: boolean } | null;
export type Week = { cells: DayCell[]; monthLabel: string | null };

const pad = (n: number) => String(n).padStart(2, '0');
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Local-date key, e.g. 2026-10-17. Never uses UTC, so no timezone drift. */
export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Weeks as columns (Sun..Sat rows). Days outside `year` are null. */
export function buildYear(year: number, today: Date = new Date()): Week[] {
  const todayKey = toKey(today);
  const weeks: Week[] = [];
  const d = new Date(year, 0, 1);
  d.setDate(d.getDate() - d.getDay()); // back up to Sunday
  let lastMonth = -1;
  while (d.getFullYear() <= year) {
    const cells: DayCell[] = [];
    let monthLabel: string | null = null;
    for (let i = 0; i < 7; i++) {
      if (d.getFullYear() === year) {
        const key = toKey(d);
        cells.push({ key, future: key > todayKey });
        if (d.getMonth() !== lastMonth) {
          lastMonth = d.getMonth();
          if (i === 0 || monthLabel === null) monthLabel = MONTHS[lastMonth];
        }
      } else cells.push(null);
      d.setDate(d.getDate() + 1);
    }
    if (cells.some(Boolean)) weeks.push({ cells, monthLabel });
    if (d.getFullYear() > year && d.getDay() === 0) break;
  }
  return weeks;
}

export const nextLevel = (current: number, levelCount: number) =>
  levelCount <= 0 ? 0 : (current + 1) % levelCount;

/** Consecutive days ending today (or yesterday if today is untouched) where level is 0. */
export function cleanStreak(entries: Record<string, number>, today: Date = new Date()): number {
  const d = new Date(today);
  let n = 0;
  if ((entries[toKey(d)] ?? 0) !== 0) return 0;
  while ((entries[toKey(d)] ?? 0) === 0 && n < 3660) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
