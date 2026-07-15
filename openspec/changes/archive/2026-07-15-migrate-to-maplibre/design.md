## Context

Owner's decisions driving this design: (1) only the Cape + islands
visible - no mainland; (2) towns outlined, with each Cape section
color-coded (Upper/Mid/Lower/Outer, per the owner's reference image)
plus Martha's Vineyard and Nantucket; (3) inland water kept but
simplified; (4) decorative ocean waves behind the landmass; (5) real
lat/lng pins with click-for-popup, exactly as today. The project's
standing constraints - static site, no backend, no accounts/keys, no
billing - rule out Google Maps (can't hide the mainland, limited
styling) and hosted tile services, in favor of MapLibre + self-hosted
data.

## Decisions

- **Land = town polygons from committed GeoJSON, not basemap tiles.**
  A one-time-generated, simplified GeoJSON of the 15 Cape towns plus
  the Vineyard towns and Nantucket (sourced from US Census
  TIGERweb/MassGIS town boundaries - real geography, not drawn by
  hand) is committed to the repo and rendered as fill + white outline
  layers. Fill color is data-driven by a municipality-to-region
  mapping (extending the notion already in `capeRegions.js`): Upper,
  Mid, Lower, Outer Cape, Martha's Vineyard, Nantucket each get a
  color. Because only these towns are filled, any mainland that falls
  inside the tile bbox simply never renders - stronger isolation than
  bbox clipping alone.
- **Inland water from a Cape-only PMTiles extract.** Ponds, lakes, and
  rivers come from a Protomaps vector-tile extract (`pmtiles extract`
  with a region polygon derived from the town boundaries, maxzoom 13),
  drawn above the town fills and filtered to non-ocean water kinds.
  Low extract maxzoom naturally simplifies shorelines - "retained but
  simplified" for free. The ocean is never drawn from tiles.
- **Ocean waves via CSS, not map data.** The MapLibre canvas stays
  transparent outside the land/water layers; the map container's CSS
  background is a repeating SVG wave pattern (data URI, no external
  asset). Everything outside the landmass - including where tiles
  don't exist - shows waves, matching the reference composition.
- **Tiles fetched at deploy, cached, not committed.**
  `scripts/fetch-tiles.mjs` (run by CI and by `npm run fetch-tiles`
  locally) resolves Protomaps' latest daily build and extracts the
  Cape region into `public/tiles/cape.pmtiles`. `actions/cache` keyed
  like the photo cache skips the download on most deploys. A missing
  tile file fails the build (the map is core), unlike fail-open photo
  covers. The committed towns GeoJSON keeps deploys working even if
  the tile fetch breaks upstream - the land always renders.
- **No text layers.** Zero glyph/font/sprite dependencies keeps the
  style self-contained and reads as intentionally illustrated. Town
  names as labels are a future pass (requires adding a glyph source).
- **Islands shifted closer to the Cape (inset-style).** So the Cape,
  the Vineyard, and Nantucket fit one frame, the island town polygons
  are translated toward the Cape at render time by fixed lat/lng
  deltas defined in one shared constant. Any pin whose `area` is an
  island town gets the same delta applied at render time, so markers
  stay on their (shifted) land. `locations.json` always stores TRUE
  real-world coordinates - the shift is purely presentational, applied
  in the map layer only, and reverting it is deleting the constant.
  Consequence: the tile extract region covers the Cape only, so
  islands render without inland-water detail (their ponds would
  otherwise draw at un-shifted true positions) - an accepted
  simplification at these sizes.
- **Pan/zoom restricted** to the composed frame (Cape + shifted
  islands); initial view fits the whole composition.

## Non-goals

- Custom illustrated marker art and fully hand-drawn (Level 2) raster
  tiles - future design passes on top of this foundation.
- Town name labels on the base map (needs glyphs; future).
- Deleting the now-unused `GOOGLE_MAPS_API_KEY` repo secret (owner
  action, harmless if left).
