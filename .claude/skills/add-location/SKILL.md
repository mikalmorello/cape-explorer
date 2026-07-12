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
- `type` (required): primary category — reuse one of: `beach`, `food`,
  `brewery`, `winery`, `hike`, `entertainment`, `shopping`,
  `attraction`, `park`, `fishing`, `watersports` — before inventing a
  new one. This drives future map icons/filters.
- `lat`, `lng` (required): verified coordinates
- `dogFriendly` (optional boolean): only set when the place's actual
  policy has been checked (search it); never guess. Leave unset if
  unknown. Capture leash/seasonal conditions in `notes`.
- `area` (optional): town/area, e.g. `"Provincetown"` — used for
  future filtering; specific spots in the same town share an `area`
- `coordsVerified` (optional, `false`): set when a precise geocode
  couldn't be found and `lat`/`lng` are an address-based estimate.
  Mention it in `notes` too.
- `website` (optional)
- `photoAlbum` (optional): a Google Photos **shared** album URL
  (`https://photos.app.goo.gl/...`). One cover image per album is
  harvested at deploy time into `src/data/photos.json`; the full album
  opens via the link. Remind the user that linked albums become
  effectively public and that cover changes appear after the next
  deploy.
- `notes` (optional): address, hours, tips
- `activities` (optional array): may be empty — a location can be just
  a saved place

**Activity** — a thing done at that location:
- `title` (required)
- `category` (optional): lowercase single word (existing: beach, food,
  cruise, entertainment, drinks, shopping, hike, winery, fishing,
  brewery, sightseeing, watersports — reuse before inventing new ones)
- `notes` (optional)

## Rules

1. **A location is a specific spot, not a town.** If the user names a
   town with an activity ("Provincetown — dune hike"), find the actual
   spot for the pin and put the town in `area`.
2. **Verify coordinates — never guess.** Web-search the place's
   address, then derive lat/lng. If a precise geocode truly can't be
   found after a reasonable search, use a best estimate, set
   `"coordsVerified": false`, and say so in `notes` and to the user —
   don't present a guess as verified.
3. **`dogFriendly` is opt-in, not default.** Only set it when checked;
   otherwise omit the field entirely.
4. **One location, many activities.** If the place already exists in
   the JSON, append to its `activities` — don't create a duplicate
   location.
5. **Reuse `type` and `category` values** already present in the file
   when they fit.

## Steps

1. Read `src/data/locations.json`.
2. For a new place: web-search its address/coordinates (and dog policy
   if asked). For an edit: locate the entry by `id` or `name`.
3. Apply the change following the schema above.
4. Validate: `node -e "JSON.parse(require('fs').readFileSync('src/data/locations.json'))"`.
5. Run `npm run build` to confirm the app still builds.
6. Commit with a message like `Add <name> to locations` and push to
   `main` (deploys automatically to GitHub Pages).
7. Tell the user what was added, flag anything with `coordsVerified:
   false`, and remind them the live site updates in ~1 minute.
