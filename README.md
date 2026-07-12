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
      "lat": 41.7387,                    // required — pin latitude
      "lng": -70.3822,                   // required — pin longitude
      "area": "West Barnstable",         // optional — town/area, for future filtering
      "website": "https://…",            // optional
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

Rules of thumb:

- A **location** is a specific spot, not a town — "Downtown
  Provincetown" and "Provincetown Dunes" are separate locations that
  share `area: "Provincetown"`.
- A location with no activities yet is fine — it's just a saved place.
- Coordinates should be verified (not guessed) so pins land on the
  actual spot when zoomed in.

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
