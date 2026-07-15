# Cape Explorer

A web app for mapping and documenting our Cape Cod activities — the
places we go and the things we do there.

Live site: https://mikalmorello.github.io/cape-explorer/

## Stack

- React + Vite (JavaScript)
- MapLibre GL (via `react-map-gl`) with self-hosted map data — no API
  keys, no map-provider accounts
- Deployed to GitHub Pages on every push to `main`

See `openspec/config.yaml` and `openspec/changes/` for the plan and
in-progress work.

## Data structure

All data lives in [`src/data/locations.json`](src/data/locations.json).
The map renders one pin per location; the List view shows the same data
as cards.

```jsonc
{
  "locations": [
    {
      "id": "sandy-neck-beach",          // required — kebab-case slug, unique
      "name": "Sandy Neck Beach",        // required — display name
      "type": "beach",                   // required — primary category (see below)
      "closed": false,                   // optional — true if the place has closed; still shown, marked "Closed"
      "dogFriendly": true,               // optional — only set when verified, never guessed
      "lat": 41.7387,                    // required — pin latitude
      "lng": -70.3822,                   // required — pin longitude
      "area": "West Barnstable",         // optional — town/area; also the town-filter key
      "address": "…, West Barnstable, MA …", // optional — full street address, informational
      "coordsVerified": false,           // optional — present + false when coords are an estimate
      "website": "https://…",            // optional
      "photoAlbum": "https://photos.app.goo.gl/…", // optional — link to the full album (public or gated)
      "coverPhotoLink": "https://photos.google.com/share/…?key=…", // optional — public single-photo link for the cover, when photoAlbum is gated
      "notes": "Entrance off Route 6A.", // optional
      "activities": [                    // optional — can be empty: a saved place
        {
          "title": "Fire on the beach at night", // required
          "category": "beach",                   // optional — filter axis later
          "notes": "Permit required."            // optional
        }
      ]
    }
  ]
}
```

`type` values in use so far: `beach`, `food`, `brewery`, `winery`,
`hike`, `entertainment`, `shopping`, `attraction`, `park`, `fishing`,
`watersports`. Reuse one of these before inventing a new one — it's
what future map icons and filters will key off of.

Rules of thumb:

- A **location** is a specific spot, not a town — "Downtown
  Provincetown" and "Provincetown Dunes" are separate locations that
  share `area: "Provincetown"`.
- The app header has a **town filter** (derived from the distinct
  `area` values in the data — no separate list to maintain) that
  narrows both the Map and List views to one town at a time.
- `address` is the full street address, verified the same way as
  coordinates (search it, never guess). It's purely informational —
  filtering still keys off `area`, so always set `area` too even when
  `address` is present.
- A location with no activities yet is fine — it's just a saved place.
- Coordinates should be verified (not guessed) so pins land on the
  actual spot when zoomed in. When a precise geocode can't be found,
  use a best estimate and set `"coordsVerified": false` — don't
  present a guess as verified.
- `dogFriendly` is opt-in: only set it when a place's actual policy has
  been checked. Leave it unset rather than guess.
- **No auto-generated `notes`.** Don't add descriptive text (addresses,
  hours, caveats) on your own initiative — locations carry only what
  the user explicitly dictates. If they give you specific text for
  `notes`, use it verbatim; otherwise leave the field out entirely.
- `photoAlbum` is the "view full album" link shown in the UI. For a
  fully public album, use the `photos.app.goo.gl` shareable link — the
  harvester also uses it to grab the cover, and linking one makes it
  effectively public via the site.
- To gate the full album to people you invite while still showing a
  cover to everyone, use a `photos.google.com/album/...` URL (visitors
  without access get Google's own sign-in/request-access screen) for
  `photoAlbum`, and separately share **one photo** on its own (Google
  Photos treats a single-item share as its own independent public
  mini-album) for `coverPhotoLink` — that's what the harvester fetches
  the cover from. **Turning off an album's own link sharing kills that
  exact link for everyone, including invited people** — invited people
  view it through their own Google Photos account instead, so don't
  expect the old link to keep working for them.
- At deploy time `scripts/fetch-photos.mjs` harvests one **cover
  image** (preferring `coverPhotoLink`, falling back to `photoAlbum`)
  into `src/data/photos.json` for the Photos view. Covers refresh on
  each deploy, so after changing a link, re-run the deploy workflow
  (or push any commit).
- The harvester caches results across deploys
  (`src/data/photos-cache.json`, restored via `actions/cache`) and only
  re-fetches a location whose link actually changed — most deploys make
  few or no photo requests. A fetch failure keeps the last-known-good
  cover instead of dropping it, and results are reported in the
  workflow run's job summary.

To add or edit entries, use the `add-location` Claude skill
(`.claude/skills/add-location/`) — or edit the JSON directly following
the shape above. Pushing to `main` deploys automatically.

## Itineraries

`locations.json` also has a top-level `itineraries` array — hand-picked
day plans stringing a few locations together in order:

```jsonc
{
  "itineraries": [
    {
      "id": "nauset-then-hog-island",      // required — kebab-case slug, unique
      "name": "Nauset Light Beach → Hog Island Beer Co.", // required
      "notes": "…",                        // optional, itinerary-level
      "stops": [                           // required — ordered
        { "locationId": "nauset-light-beach", "note": "Morning" },
        { "locationId": "hog-island-beer-co", "note": "After" }
      ]
    }
  ]
}
```

A stop only stores `locationId` + a short `note` ("Morning", "After")
— everything else (name, area, activities, cover) is looked up live
from the referenced location, so it can never drift out of sync.
**Itineraries are entirely hand-curated, same as `notes`** — only add
one when describing a real plan from actual experience; never
auto-suggest by proximity, type, or any heuristic.

## Local setup

```bash
npm install
npm run dev
```

No API keys or env vars needed.

### Map data

The map is MapLibre GL rendering two self-hosted artifacts, both
produced at deploy time by `scripts/fetch-map-data.mjs` (cached across
deploys via `actions/cache`; a failed fetch with no cache fails the
build — the map is core):

- `public/data/cape-towns.json` — town boundary polygons (US Census
  TIGERweb) for the 15 Cape towns plus Martha's Vineyard towns and
  Nantucket, tagged with their Cape region. Rendered as
  region-colored fills with white outlines; the region colors,
  municipality→region mapping, and island display offsets live in
  `src/lib/capeMunicipalities.js`.
- `public/tiles/cape.pmtiles` — a Protomaps vector-tile extract
  clipped to the Cape, used only for simplified inland water (ponds,
  lakes, rivers). The ocean is a CSS wave pattern, and the mainland is
  simply never drawn — only the Cape + islands render.

The islands are displayed **inset** (shifted toward the Cape so
everything fits one frame). `locations.json` always stores true
coordinates; the shift is applied at render time only, from
`REGION_DISPLAY_OFFSET`, to both island land and island pins.

Locally, `npm run dev` works without the fetched data (pins + ocean
render; land/water appear once data exists). To fetch the real data
locally run `npm run fetch-tiles` (needs open network access).

The previous Google Maps implementation is preserved on the
`backup/google-maps-map` branch.
