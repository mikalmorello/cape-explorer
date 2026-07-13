## 1. Data

- [x] 1.1 Add optional `address` field to schema docs (README, skill)

## 2. Filter UI

- [x] 2.1 Lift a `town` filter state into `App.jsx`, derive the
      sorted list of distinct `area` values from `locations.json`
- [x] 2.2 Add a town `<select>` control in the app header (All towns +
      one option per distinct area)
- [x] 2.3 `MapView` only renders pins matching the active town filter
- [x] 2.4 `LocationList` only renders cards matching the active town
      filter; skip region headings when a single town is selected
- [x] 2.5 Show `address` in the map popup and list card when present

## 3. Specs

- [x] 3.1 Update `location-data` spec: `address` field + town filter
      requirement
- [x] 3.2 Update `map-view` spec: pins respect the town filter

## 4. Ship

- [x] 4.1 Build and manually verify filtering works in both views
- [x] 4.2 Commit and push to `claude/cape-explorer-handoff-y4ni9d`
- [x] 4.3 Archive this change
