---
name: add-location
description: Add or edit locations and activities in Cape Explorer's src/data/locations.json. Use whenever the user wants to add a place, add an activity to an existing place, or fix location details. Keeps entries consistent with the documented schema and verifies coordinates before committing.
---

Add or edit entries in `src/data/locations.json`, keeping the data
consistent and coordinates accurate.

## Schema

The file has a single `locations` array. Fields:

**Location** — one pin on the map:
- `id` (required): kebab-case slug, unique (e.g. `sandy-neck-beach`)
- `name` (required): display name
- `lat`, `lng` (required): verified coordinates
- `area` (optional): town/area, e.g. `"Provincetown"` — used for
  future filtering; specific spots in the same town share an `area`
- `website` (optional)
- `notes` (optional): address, hours, tips
- `activities` (optional array): may be empty — a location can be just
  a saved place

**Activity** — a thing done at that location:
- `title` (required)
- `category` (optional): lowercase single word (existing: beach, food,
  cruise, entertainment, drinks, shopping, hike, winery — reuse before
  inventing new ones)
- `notes` (optional)

## Rules

1. **A location is a specific spot, not a town.** If the user names a
   town with an activity ("Provincetown — dune hike"), find the actual
   spot for the pin and put the town in `area`.
2. **Verify coordinates — never guess.** Web-search the place's
   address, then derive lat/lng. If coordinates can't be confidently
   verified, tell the user instead of silently guessing.
3. **One location, many activities.** If the place already exists in
   the JSON, append to its `activities` — don't create a duplicate
   location.
4. **Reuse categories** already present in the file when they fit.

## Steps

1. Read `src/data/locations.json`.
2. For a new place: web-search its address/coordinates. For an edit:
   locate the entry by `id` or `name`.
3. Apply the change following the schema above.
4. Validate: `node -e "JSON.parse(require('fs').readFileSync('src/data/locations.json'))"`.
5. Run `npm run build` to confirm the app still builds.
6. Commit with a message like `Add <name> to locations` and push to
   `main` (deploys automatically to GitHub Pages).
7. Tell the user what was added and remind them the live site updates
   in ~1 minute.
