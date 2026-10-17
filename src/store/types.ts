export type Level = { id: string; label: string; color: string };
export type Category = { id: string; name: string; levels: Level[]; createdAt: string };
export type Entries = Record<string, Record<string, number>>; // catId -> dayKey -> level index
export type Persisted = { version: number; categories: Category[]; entries: Entries };
