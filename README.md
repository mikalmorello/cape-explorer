# Cape Explorer

A web app for mapping and documenting our Cape Cod activities — the
places we go and the things we do there.

Live site: https://mikalmorello.github.io/cape-explorer/

## Stack

- React + Vite (JavaScript)
- Google Maps JS API (via `@vis.gl/react-google-maps`)
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

To add or edit entries, use the `add-location` Claude skill
(`.claude/skills/add-location/`) — or edit the JSON directly following
the shape above. Pushing to `main` deploys automatically.

## Local setup

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your Google Maps API key
npm run dev
```

### Google Maps API key

The map needs a Google Maps JavaScript API key:

1. Create/select a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the "Maps JavaScript API".
3. Create an API key and restrict it to your local/deploy origins.
4. Put it in `.env.local` as `VITE_GOOGLE_MAPS_API_KEY`.

Without a key, the app still runs but shows a message in place of the
map. The deployed site gets its key from the `GOOGLE_MAPS_API_KEY`
GitHub Actions secret at build time.
