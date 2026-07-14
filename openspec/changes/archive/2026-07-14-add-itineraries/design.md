## Context

Itineraries are a thin, separate concept from locations: an ordered
list of references plus a short label per stop. Duplicating location
fields into the itinerary would drift out of sync with the real
location data, so a stop is just `{ locationId, note }` — everything
else (name, area, activities, cover) is looked up live from
`locations.json` at render time.

## Decision

- `itineraries` is a new top-level array, sibling to `locations`, not
  nested inside it — an itinerary isn't owned by any one location.
- The Itineraries view is read-only: it renders each itinerary's stops
  in the order stored, pulling the referenced location's existing
  fields for display. No new interactions (drag-to-reorder, editing in
  the UI) — same pattern as everything else in this app: edit
  `locations.json` directly or via the `add-location` skill.
- Manual curation only, enforced by convention (like `notes`): an
  itinerary only gets added when the owner actually describes a real
  plan from experience, never inferred from proximity or type.

## Non-goals

- No automatic itinerary suggestions (by area, distance, type, time of
  day) — explicitly against what the owner asked for ("not making
  things up").
- No cross-view deep-linking (e.g. clicking a stop jumping to Map view
  centered on that pin) — a plain read-only card is enough for now and
  avoids adding shared navigation state between views.
- No scheduling/dates — a stop's `note` ("Morning", "After") is free
  text, not a structured time.
