## Context

First data-bearing change. The shape chosen here becomes the seed for
the eventual Supabase schema, so it should mirror the agreed model:
locations anchor pins; activities belong to locations.

## Goals / Non-Goals

**Goals:**
- All of the owner's starter places visible as pins with correct
  coordinates.
- Pin click shows the location's details and activities.
- Data model documented and easy to extend by editing one JSON file.

**Non-Goals:**
- No list view, no filtering, no add/edit UI, no photos yet.
- No Supabase — JSON now, migrate later.

## Decisions

- **One JSON file with activities nested inside locations**
  (`src/data/locations.json`), rather than two files joined by IDs.
  Nested matches how the data is authored and read at this stage; the
  flat two-table split happens when Supabase arrives.
- **Location is the only pin-worthy entity.** Specific spots, not
  towns: "Downtown Provincetown" and "Provincetown Dunes" are separate
  locations; the optional `area` field carries the town name for
  future area filtering.
- **No done/want-to-do status field.** The owner clarified the data is
  a record of things they did/do, not a wishlist. If a wishlist notion
  returns later, it comes back as a field on the activity in its own
  change.
- **Coordinates verified during implementation** (web search per
  place) rather than guessed; each seeded location should land on the
  actual spot when the map is zoomed in.
- **Popup via `InfoWindow`** from `@vis.gl/react-google-maps` — no new
  dependency.
- **IDs are simple slugs** (e.g. `marconi-beach`) — human-readable in
  the JSON, stable enough for future migration.

## Risks / Trade-offs

- [Risk] Some places (e.g. Captain Baker Donuts) may have ambiguous or
  hard-to-verify coordinates → verify via web search; if still
  uncertain, mark the entry with a `"coordsVerified": false` note in
  JSON and flag to the owner rather than silently guessing.
- [Trade-off] Editing JSON to add data requires a commit + deploy per
  edit → acceptable while the dataset is small; the add-activity UI
  change removes this later.
