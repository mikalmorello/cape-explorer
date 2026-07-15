## Why

The owner wants the map to show only Cape Cod and the islands (no
mainland), styled toward a clean illustrated look (flat colors, no
road/label clutter), as the foundation for eventually overlaying
custom illustrated markers per location. Google Maps can't do this:
its base layer always renders the full real world, its styling is
limited, and it carries an API key, a repo secret, referrer
restrictions, and a quota to watch. MapLibre GL (open-source) with a
self-hosted Cape-Cod-only tile extract removes all of that: the
mainland literally isn't in the tile data, the style is a fully
author-controlled JSON file, and there are no keys, accounts, or
usage limits.

The previous Google Maps implementation is preserved on the
`backup/google-maps-map` branch for easy revert.

## What Changes

- Replace `@vis.gl/react-google-maps` with `maplibre-gl` +
  `react-map-gl` (+ `pmtiles` for the tile protocol) in `MapView`.
  Markers, click-for-popup, town filtering, and the closed badge all
  behave exactly as before, driven by the same `locations.json`
  lat/lng values.
- Base map becomes a self-hosted PMTiles vector-tile extract clipped
  to Cape Cod + the islands, downloaded from Protomaps' daily builds
  by a new `scripts/fetch-tiles.mjs` at deploy time (cached via
  `actions/cache`, like photo covers) and served as a static file with
  the site. Outside the extract the map renders plain background - the
  isolated Cape look.
- Hand-written minimal style: flat land color, water color, ponds; no
  text labels, no POI, no glyph/sprite/font dependencies. Pan/zoom is
  restricted to Cape bounds.
- Remove the Google Maps API key path entirely: workflow env,
  `.env.example`, README key instructions, and the missing-key notice.

## Capabilities

### Modified Capabilities
- `map-view`: rendered by MapLibre from self-hosted Cape-only tiles;
  no API key; bounded to the Cape; label-free illustrated-leaning
  style.
- `deployment`: workflow fetches/caches the tile extract instead of
  injecting a Maps API key.

## Impact

- Modified: `src/features/map/MapView.jsx`, `package.json`,
  `.github/workflows/deploy.yml`, `.env.example`, README, CLAUDE.md.
- New: `scripts/fetch-tiles.mjs`, `src/features/map/mapStyle.js`,
  `public/tiles/` (gitignored; populated at deploy/local fetch).
- Removed dependency: `@vis.gl/react-google-maps`. The
  `GOOGLE_MAPS_API_KEY` secret becomes unused (can be deleted from
  repo settings whenever).
- Rollback: `git checkout backup/google-maps-map`.
