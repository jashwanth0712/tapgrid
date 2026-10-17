# TapGrid – Implementation Plan

A lightweight iOS app (Expo / React Native) of GitHub-style calendar grids. Each **category** (Outside Food, etc.) has its own grid; tapping a day cycles it through that category's ordered **levels** (colors).

## Decisions
- Toolchain: Expo (managed, TypeScript), run on iPhone via Expo Go / dev build.
- Storage: local only, on-device. JSON export/import for backup.
- Categories: created/edited in-app via a settings (gear) icon.
- Repo: github.com/jashwanth0712/tapgrid (public), pushed through SSH host `github.com-personal`.

## Data model
```ts
Level    = { id: string; label: string; color: string }
Category = { id: string; name: string; levels: Level[]; createdAt: string; order: number }
// levels[0] = "default/zero" state (e.g. green = nothing eaten outside)
Entries  = { [categoryId]: { [yyyy-mm-dd]: levelIndex } }   // missing key = level 0
```
Storing only non-zero days keeps data tiny. Day keys are local-date strings, so there are no timezone bugs.

### Food preset (seeded on first launch)
| idx | color | meaning |
|---|---|---|
| 0 | green | nothing eaten outside |
| 1 | yellow | once |
| 2 | red | twice |
| 3 | maroon | thrice |
| 4 | dark maroon | extra snacks too |

Tap past the last level and it wraps to 0. **Future days are gray and not tappable.**

## Screens
1. **Home** – list of category cards (name, mini current-month/streak summary). Tap one to open its grid. A gear icon at top right opens Settings.
2. **Category grid** – GitHub-style calendar: columns are weeks, rows are Sun–Sat, month labels on top. Defaults to the current year, scrolls horizontally, and starts scrolled to today. Tap a cell to cycle its level, with a light haptic. A legend shows level colors and counts. Shows summary stats (clean days, streak, this month).
3. **Settings / Category editor** – add, rename, delete, and reorder categories. Edit levels (label, color picker from a preset palette, add/remove/reorder). Export/import JSON.

## Architecture (small deps)
- `expo`, `react-native`, TypeScript, `expo-router` (or plain React Navigation).
- State: `zustand` + persist middleware over `react-native-mmkv` (or AsyncStorage as fallback). No other state libs.
- Grid rendered with plain `View`s, or a single `FlatList` of week columns. No chart libs. Memoize cells so a tap re-renders one cell.
- `expo-haptics` for tap feedback, `expo-file-system` + `expo-sharing` for export/import.
- Folder layout:
  ```
  app/            routes (index, category/[id], settings)
  src/store/      zustand store, persistence, migrations (versioned schema)
  src/lib/        date utils (buildYearGrid, toKey), cycle logic
  src/components/ Grid, Cell, Legend, CategoryCard, LevelEditor
  src/presets.ts  food preset
  ```

## Edge cases
- Future dates: gray, disabled. Today and past dates are editable (so you can backfill).
- Deleting a level that has entries: remap entries to the nearest valid index, with a confirm dialog.
- Reducing the level count: clamp existing entries.
- Day rollover while the app is open: recompute "today" on app foreground (AppState).
- Persisted schema `version` field with a migrate function.
- Year switcher for past years.

## Milestones
1. Scaffold Expo TS app, repo, CI-free baseline. ✅ (this commit: plan)
2. Date grid util + unit tests (leap years, week alignment, month labels).
3. Store + persistence + Food preset.
4. Grid screen with tap-to-cycle, future-gray, haptics.
5. Home list + settings + category/level editor.
6. Stats, year switcher, export/import.
7. Polish: dark mode, app icon, splash; test on a physical iPhone; EAS/TestFlight build only if wanted.

## Out of scope for v1
Cloud sync, accounts, notifications, widgets (possible v2 via a native widget target).

## Open items
- Verify the GitHub username: your account is `jashwanth0712` (you said "jeshwan0712").
