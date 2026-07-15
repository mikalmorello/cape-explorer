## 1. Data

- [x] 1.1 Obtain real town boundary polygons (Census TIGERweb/MassGIS)
      for the 15 Cape towns + Vineyard towns + Nantucket; simplify and
      commit as `src/data/capeTowns.json`
- [x] 1.2 Generate the Cape-only extract region polygon for
      `pmtiles extract`; commit as `scripts/data/cape-region.geojson`

## 2. Map stack swap

- [x] 2.1 Replace `@vis.gl/react-google-maps` with `maplibre-gl`,
      `react-map-gl`, `pmtiles` in package.json
- [x] 2.2 `scripts/fetch-tiles.mjs`: resolve latest Protomaps build,
      extract Cape region to `public/tiles/cape.pmtiles` (gitignored)
- [x] 2.3 `src/features/map/mapStyle.js`: style JSON - region-colored
      town fills (municipality-to-region mapping), white town
      outlines, simplified inland water from tiles, no labels; shared
      island-offset constant
- [x] 2.4 Rewrite `MapView.jsx` on react-map-gl/maplibre: markers from
      locations.json (island pins offset), popup on click, town
      filter, closed badge, CSS wave-pattern ocean background,
      restricted bounds, initial fit to Cape + shifted islands

## 3. Deploy pipeline

- [x] 3.1 Workflow: fetch/cache tiles step (fails build on error);
      remove VITE_GOOGLE_MAPS_API_KEY env
- [x] 3.2 `npm run fetch-tiles` script for local dev

## 4. Docs

- [x] 4.1 README: remove Google Maps key setup, document tiles +
      towns data + island offset; update .env.example; CLAUDE.md if
      needed

## 5. Specs

- [x] 5.1 map-view: MODIFIED requirements (MapLibre, Cape-only,
      region colors, outlines, waves, island inset, no key)
- [x] 5.2 deployment: MODIFIED (tiles fetch/cache replaces Maps key
      injection)

## 6. Ship

- [x] 6.1 Validate + build + Playwright check (markers, popup,
      filter, region colors render)
- [x] 6.2 Commit, merge to main, push; verify deploy incl. tiles step
- [x] 6.3 Archive this change
