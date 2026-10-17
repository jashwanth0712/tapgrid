import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nextLevel } from '../lib/dates';
import { foodPreset } from '../presets';
import type { Category, Entries, Persisted } from './types';

export const SCHEMA_VERSION = 1;

type State = Persisted & {
  cycle: (catId: string, day: string) => void;
  saveCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
  move: (id: string, dir: -1 | 1) => void;
  importData: (json: string) => string | null; // returns error message or null
  exportData: () => string;
};

const clampEntries = (entries: Record<string, number> = {}, max: number) => {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(entries)) {
    const c = Math.min(v, max);
    if (c > 0) out[k] = c;
  }
  return out;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      version: SCHEMA_VERSION,
      categories: [foodPreset()],
      entries: {} as Entries,

      cycle: (catId, day) =>
        set((s) => {
          const cat = s.categories.find((c) => c.id === catId);
          if (!cat) return s;
          const cur = s.entries[catId]?.[day] ?? 0;
          const next = nextLevel(cur, cat.levels.length);
          const catEntries = { ...(s.entries[catId] ?? {}) };
          if (next === 0) delete catEntries[day];
          else catEntries[day] = next;
          return { entries: { ...s.entries, [catId]: catEntries } };
        }),

      saveCategory: (cat) =>
        set((s) => {
          const exists = s.categories.some((c) => c.id === cat.id);
          const categories = exists
            ? s.categories.map((c) => (c.id === cat.id ? cat : c))
            : [...s.categories, cat];
          const entries = {
            ...s.entries,
            [cat.id]: clampEntries(s.entries[cat.id], cat.levels.length - 1),
          };
          return { categories, entries };
        }),

      deleteCategory: (id) =>
        set((s) => {
          const entries = { ...s.entries };
          delete entries[id];
          return { categories: s.categories.filter((c) => c.id !== id), entries };
        }),

      move: (id, dir) =>
        set((s) => {
          const i = s.categories.findIndex((c) => c.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= s.categories.length) return s;
          const categories = [...s.categories];
          [categories[i], categories[j]] = [categories[j], categories[i]];
          return { categories };
        }),

      exportData: () => {
        const { version, categories, entries } = get();
        return JSON.stringify({ version, categories, entries }, null, 2);
      },

      importData: (json) => {
        try {
          const d = JSON.parse(json);
          if (!Array.isArray(d.categories) || typeof d.entries !== 'object' || !d.entries)
            return 'Not a TapGrid backup.';
          for (const c of d.categories)
            if (!c.id || !c.name || !Array.isArray(c.levels) || c.levels.length < 1)
              return 'Backup has an invalid category.';
          set({ version: SCHEMA_VERSION, categories: d.categories, entries: d.entries });
          return null;
        } catch {
          return 'Invalid JSON.';
        }
      },
    }),
    {
      name: 'tapgrid-v1',
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ version: s.version, categories: s.categories, entries: s.entries }),
      // add migrations here when SCHEMA_VERSION bumps
      migrate: (persisted) => persisted as State,
    },
  ),
);
