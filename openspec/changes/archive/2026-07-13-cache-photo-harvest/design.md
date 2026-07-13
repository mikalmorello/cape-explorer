## Context

`actions/cache` can't overwrite an existing key, so a naive
`key: photo-harvest-cache` would only ever save once. The standard
rolling-cache pattern is used instead:

- `key: photo-harvest-${{ github.run_id }}` — unique every run, so
  saving always succeeds.
- `restore-keys: photo-harvest-` — prefix match, restores the most
  recent previous run's cache.

## Decision

- Cache shape is `{ locationId: { sourceUrl, coverUrl } }` — storing
  `sourceUrl` alongside the cover is what makes change-detection
  possible (compare the location's current `photoAlbum`/
  `coverPhotoLink` against what was last fetched).
- On skip (unchanged source): no network request, reuse cached cover,
  log `SKIP <id>: unchanged source, reusing cached cover`.
- On fetch failure with a cache entry present: keep the cached cover
  rather than dropping it — a transient 500 shouldn't blank out a
  previously-working image. Only a location that has *never*
  successfully harvested ends up with genuinely no cover.
- Job summary via `$GITHUB_STEP_SUMMARY` (plain markdown appended to
  the step) — native GitHub Actions mechanism, no extra dependency,
  renders directly on the run page.

## Non-goals

- No cross-location throttling/backoff logic — skipping unchanged
  locations already cuts most runs down to near-zero requests, which
  addresses the practical rate-limit risk without added complexity.
