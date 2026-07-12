## Why

The owner wants to see their Google Photos from each place inside the
app — including a photo-first browsing mode: a grid of pictures where
clicking one reveals the location and its details. Google's official
APIs can't power this on a static site (post-March-2025 the Picker API
requires per-session sign-in and its URLs expire in ~60 minutes), so
this change uses build-time harvesting of *shared album* pages instead
— an unofficial but well-established technique — keeping the app
backend-free on GitHub Pages.

This is explicitly an experiment: if the shared-album technique proves
unreliable, we change direction (fallback options: committing photos
into the repo, or Supabase Storage later).

## What Changes

- Add an optional `photoAlbum` field to **Location**: a Google Photos
  shared-album URL.
- Add a build-time script (`scripts/fetch-photos.mjs`, no new
  dependencies) that fetches each linked shared album and extracts its
  image URLs into `src/data/photos.json`. It runs inside the deploy
  workflow before `vite build` — photos refresh **on deploy only** (no
  scheduled rebuilds, per owner). If an album fetch fails, the build
  continues with whatever data it has (empty gallery beats broken
  deploy).
- Add a **Photos** view (third header toggle: Map | List | Photos): a
  grid of photos from all linked albums; clicking a photo opens that
  location's details (name, area, activities, notes, website) plus its
  full gallery.
- Show a "Photos" link in the map popup for locations that have a
  linked album.
- Document the `photoAlbum` field in README and the `add-location`
  skill.

## Capabilities

### New Capabilities
- `photo-gallery`: build-time photo harvesting from shared albums and
  the photo-grid browsing view.

### Modified Capabilities
- `location-data`: adds the optional `photoAlbum` field.

## Impact

- New: `scripts/fetch-photos.mjs`, `src/data/photos.json` (committed
  empty default; populated during CI builds),
  `src/features/photos/PhotosView.jsx`.
- Modified: `.github/workflows/deploy.yml`, `src/App.jsx`,
  `src/features/map/MapView.jsx`, `README.md`,
  `.claude/skills/add-location/SKILL.md`.
- No new dependencies, no API keys, no billing surface: the script
  performs plain HTTP GETs of public shared-album pages from the
  GitHub Actions runner.
- Risk accepted by owner: unofficial technique — Google could change
  the shared-album page format, breaking the fetch script (site keeps
  working with last-built data; we then pivot).
