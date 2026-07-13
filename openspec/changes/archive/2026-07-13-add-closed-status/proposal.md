## Why

Provincetown Brewing Co. has closed while it looks for a new location.
There's currently no way to mark a location as closed — removing it
outright would lose the activity history, but leaving it exactly as
before misrepresents a place that's no longer operating.

## What Changes

- Add an optional `closed` boolean field to **Location**. When `true`,
  the location still appears on the Map and in the List (the visit
  history stays intact) but is visibly marked as closed rather than
  looking like a currently-open place.
- Apply it to Provincetown Brewing Co.

## Capabilities

### Modified Capabilities
- `location-data`: adds the optional `closed` field and the display
  requirement for it.

## Impact

- Modified: `src/data/locations.json` (Provincetown Brewing Co.),
  `src/features/map/MapView.jsx`, `src/features/locations/LocationList.jsx`,
  README, `add-location` skill docs.
