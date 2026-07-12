## Why

The Photos view and map popup already show a location's cover photo;
the List view didn't, even though it's the primary "just the data"
view. Small consistency gap, quick fix.

## What Changes

- List view cards show the location's cover photo (from
  `photos.json`) as a small thumbnail when one exists; cards without a
  cover render as before.

## Capabilities

### Modified Capabilities
- `location-data`: the list view requirement now includes the cover
  thumbnail when available.

## Impact

- Modified: `src/features/locations/LocationList.jsx`, `src/App.css`.
- No new dependencies.
