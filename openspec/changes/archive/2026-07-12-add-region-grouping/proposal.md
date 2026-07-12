## Why

The dataset now spans the whole Cape, and the List view is just one
long undifferentiated column. Grouping by the traditional Cape Cod
regions (Upper/Mid/Lower/Outer Cape, plus the islands) makes it
scannable and matches how Cape Codders actually think about geography.

## What Changes

- Derive a region from each location's existing `area` (town) via a
  static lookup table — no new required field on locations, since the
  region is fully determined by the town and this avoids backfilling
  28 entries with a redundant value that could drift from `area`.
- List view groups cards under region headings, in geographic order:
  Upper Cape, Mid Cape, Lower Cape, Outer Cape, Nantucket, Martha's
  Vineyard. Islands are included in the lookup/order now (none of the
  current data lives there) so future entries there group correctly
  with no further code changes.
- A town not yet in the lookup falls into an "Other" group instead of
  crashing or disappearing, so new areas never break the list.

## Capabilities

### Modified Capabilities
- `location-data`: the list view requirement now includes region
  grouping.

## Impact

- New: `src/lib/capeRegions.js` (town → region lookup + region order).
- Modified: `src/features/locations/LocationList.jsx`, `src/App.css`.
- No new dependencies, no data migration.
