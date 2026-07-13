## Why

Every deploy re-fetches a cover for all 23+ linked locations, even
though most of their `photoAlbum`/`coverPhotoLink` values never
change between deploys. Two problems this caused directly:

1. **No visibility into failures.** The 2026-07-13 deploy silently
   dropped covers for Provincetown Dunes and Provincetown Breakwater
   (both hit an HTTP 500 from Google Photos) — the warning only exists
   buried in the Actions run log, invisible unless someone goes
   looking. A retry of the same run succeeded, confirming it was
   transient, but there was no report surfacing that anything had
   failed at all.
2. **Unnecessary request volume.** Firing 23 fetches back-to-back with
   no delay on every deploy is more load than needed and is a
   plausible contributor to the transient 500s (rate-limiting-shaped
   behavior: failures took ~10x longer than successes before erroring).

## What Changes

- The harvester persists a cache (`src/data/photos-cache.json`,
  `{ locationId: { sourceUrl, coverUrl } }`) across deploys via
  `actions/cache`. A location is only re-fetched when its
  `photoAlbum`/`coverPhotoLink` value has changed since the last
  successful harvest; unchanged locations reuse the cached cover with
  no network request.
- On a failed fetch, if a previous cover is cached for that location,
  it's kept (last-known-good) instead of the location losing its cover
  for one bad deploy.
- The harvester writes a summary (locations harvested/skipped/failed)
  to the GitHub Actions job summary, so failures are visible on the
  run's summary page without opening raw logs.

## Capabilities

### Modified Capabilities
- `photo-gallery`: harvester skips unchanged locations, keeps
  last-known-good covers on failure, and reports results in the job
  summary.

## Impact

- Modified: `scripts/fetch-photos.mjs`, `.github/workflows/deploy.yml`
  (add `actions/cache` step), README.
- New file: `src/data/photos-cache.json` (internal harvester state, not
  consumed by the app — `photos.json` stays the app-facing file).
