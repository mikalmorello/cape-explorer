## Why

Locations only carry a rough `area` (which is really the town/village,
e.g. "West Dennis"), and there's no way to narrow either view down to
one town — the List view only groups into broad Cape regions (Upper
Cape, Mid Cape, etc.), and the Map shows every pin at once. The owner
wants to filter down to a single town, and also wants the full street
address recorded per location (useful on its own, and as the source of
truth `area`/town is drawn from).

## What Changes

- Add an optional `address` field to **Location**: the full street
  address (e.g. `"1120 Cahoon Hollow Rd, Wellfleet, MA 02667"|`). Purely
  informational — filtering keeps using `area` (already the town),
  since that's the field already normalized to one town name per
  location.
- Add a town filter control (a dropdown of towns present in the data,
  plus "All towns") shared across Map and List views: selecting a town
  narrows the map to that town's pins and the list to that town's
  cards. Selection lives in `App` and is passed down, so both views
  stay in sync.
- List view keeps its region grouping when "All towns" is selected;
  when a specific town is selected, it shows just that town's cards
  (no need for a region heading over a single town).

## Capabilities

### Modified Capabilities
- `location-data`: adds the optional `address` field; adds a
  requirement that locations can be filtered down to one town.
- `map-view`: map pins respect the active town filter.

## Impact

- Modified: `src/data/locations.json` (add `address` where known),
  `src/App.jsx` (lift filter state), `src/features/locations/LocationList.jsx`,
  `src/features/map/MapView.jsx`, README, `add-location` skill docs.
- No new dependencies.
