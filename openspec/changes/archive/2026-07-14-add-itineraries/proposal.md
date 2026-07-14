## Why

The owner wants to plan short day-trips by stringing together a
handful of existing locations in order — e.g. "Nauset Light Beach in
the morning, Hog Island Brewery after." There's currently no way to
express that grouping; locations only exist as independent pins/cards.

## What Changes

- Add a top-level `itineraries` array to `locations.json`. Each
  itinerary is `{ id, name, stops: [{ locationId, note }], notes }` —
  `stops` reference existing location `id`s in order, `note` is a
  short manually-written label per stop (e.g. "Morning", "After").
  Itineraries are **entirely hand-curated** — never auto-generated,
  never suggested by proximity/type. This mirrors the existing rule
  for `notes`: only the owner's own words, based on actual experience.
- Add an "Itineraries" view, toggleable alongside Map/List/Photos,
  showing one card per itinerary with its stops in order (location
  name, area, the stop's note, and its activities/cover if available).
- Seed the first real itinerary from the owner's own example: Nauset
  Light Beach (morning) → Hog Island Beer Co. (after).

## Capabilities

### Added Capabilities
- `itineraries`: the data shape and the read-only Itineraries view.

## Impact

- Modified: `src/data/locations.json` (new `itineraries` array),
  `src/App.jsx` (new view toggle).
- New: `src/features/itineraries/ItinerariesView.jsx`.
- No new dependencies. Existing Map/List/Photos views are unaffected.
