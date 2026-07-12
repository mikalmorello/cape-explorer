## Why

The location dataset is growing past its original schema. The owner
wants two things: richer per-location metadata (a place `type` for
future custom icons/filtering, and whether a place is dog-friendly),
and a decluttered map — this app is meant to be a focused record of the
owner's own activities, not a general-purpose Google Maps browser with
every restaurant and transit icon showing.

## What Changes

- Add a required `type` field to **Location** (e.g. `beach`, `food`,
  `brewery`, `hike`, `entertainment`, `shopping`, `attraction`, `park`,
  `fishing`, `winery`, `watersports`) — the primary category used for
  future map icon styling and filtering. Backfill it on all existing
  locations.
- Add an optional `dogFriendly` boolean to **Location**. Left unset
  where not yet verified (existing locations keep it unset unless
  confidently known); no guessing.
- Simplify the map's visual style: hide Google's default points-of-
  interest icons/labels and transit markers so only the app's own
  location pins are visible.
- Update `src/data/locations.json` schema docs (README, `add-location`
  skill) to describe the new fields.

Out of scope: custom pin icons themselves (this change only adds the
`type` field they'll key off of), a UI toggle for map layers (can be
added later if the always-simplified view isn't enough).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `location-data`: adds `type` (required) and `dogFriendly` (optional)
  fields to the Location shape.
- `map-view`: the map no longer shows Google's default POI/transit
  layer, so only the app's own pins are visible.

## Impact

- Modified: `src/data/locations.json` (schema + all 27 entries),
  `src/features/map/MapView.jsx` (map style), `README.md`,
  `.claude/skills/add-location/SKILL.md`.
- No new dependencies.
