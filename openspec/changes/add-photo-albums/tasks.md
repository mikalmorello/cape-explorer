## 1. Harvest script

- [x] 1.1 Create `scripts/fetch-photos.mjs`: read `locations.json`,
      fetch each `photoAlbum` page, regex-extract
      `lh3.googleusercontent.com/pw/...` URLs, write
      `src/data/photos.json` (`{ locationId: [urls] }`); warn and
      continue on failures; log per-album photo counts
- [x] 1.2 Commit an empty-default `src/data/photos.json` so local dev
      builds work without network
- [x] 1.3 Unit-check the extraction regex against a synthetic album
      page snippet

## 2. Deploy pipeline

- [x] 2.1 Add a fetch-photos step to `.github/workflows/deploy.yml`
      before `npm run build` (deploy-triggered only — no cron)

## 3. Photos view

- [x] 3.1 Create `src/features/photos/PhotosView.jsx`: thumbnail grid
      (URL-suffix sizing), location name on each tile, empty-state
      message when no photos
- [x] 3.2 Clicking a photo opens the location's details (name, area,
      activities, notes, website) with its full gallery
- [x] 3.3 Add "Photos" as a third header toggle; add a Photos link in
      the map popup for locations with albums

## 4. Docs

- [x] 4.1 Document `photoAlbum` in README and the `add-location` skill

## 5. Test with real album (owner-assisted)

- [x] 5.1 Owner shares one Google Photos shared-album link for a
      location; wire it into that location's `photoAlbum`
- [x] 5.2 Deploy, verify via workflow logs (photo count > 0) and on
      the live site; if extraction fails, regroup on approach
      (result: 22 photos extracted from the Pirate Adventures album;
      owner confirmed rendering)

## 6. Scope revision: cover-only (owner decision after testing)

- [x] 6.1 Harvest only one cover URL per album; `photos.json` becomes
      `{ locationId: coverUrl }`
- [x] 6.2 Photos grid: one cover tile per album; detail shows cover +
      "View album in Google Photos" link instead of inline gallery
- [x] 6.3 Clean up: removed per-location photo cap and unused gallery
      code; updated spec/design/proposal, README, and add-location
      skill to match
