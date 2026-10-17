# TapGrid

GitHub-style calendar grids you fill by tapping. Each category has ordered levels (colors); a tap advances a day to the next level and wraps back to the first. Future days are gray and locked. Categories and levels are edited in-app via the ⚙️ icon. Ships with an "Outside Food" preset (green → yellow → red → maroon → dark maroon).

Data is stored on-device only; Settings has JSON export/import.

## Run
```
npm install
npx expo start      # scan the QR with Expo Go on your iPhone, or press i for the simulator
npm test            # date-grid unit tests
npm run typecheck
```
See PLAN.md for the design.
