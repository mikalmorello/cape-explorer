## Context

Post-March-2025, Google's Photos APIs cannot serve a public static
gallery: the Library API only reads app-created content, and Picker
API URLs expire in ~60 minutes. Shared-album pages, however, embed
long-lived `lh3.googleusercontent.com/pw/...` image URLs in their
HTML/JS payload, extractable with a regex. The deploy workflow is the
app's only compute, so harvesting happens there.

## Goals / Non-Goals

**Goals:**
- Photos from linked shared albums visible in the app with zero
  runtime auth and zero backend.
- Photo-first browsing: grid → click → location details + gallery.
- Refresh on deploy only — adding photos to an album shows up on the
  next push to `main` (or a manual workflow run).

**Non-Goals:**
- No scheduled/cron rebuilds (owner preference).
- No official Google Photos API integration, no OAuth.
- No downloading/committing image files (hotlinking the stable shared
  URLs; pivot to self-hosting only if they prove unstable).

## Decisions

- **Own ~30-line fetch script instead of the
  `google-photos-album-image-url-fetch` npm package** — the package is
  unmaintained (last publish >1 year ago) and the technique is a
  single regex over the fetched page; owning it means we can fix it
  the day Google changes the format.
- **`photos.json` is committed with an empty default and regenerated
  in CI, not committed back.** Local dev and PR builds work (empty
  gallery), CI builds get fresh data, and the repo never churns with
  URL updates.
- **Fail-open fetch:** an album that can't be fetched logs a warning
  in the workflow (visible in run logs, greppable for verification)
  and yields an empty list — a broken album never breaks the deploy.
- **Image sizing via URL suffix:** `lh3` URLs accept size directives;
  store the bare URL and append `=w400-h400-c` for grid thumbnails and
  `=w1600` for the detail gallery, so we never store multiple sizes.
- **Cover-only harvesting (owner decision, revised during testing):**
  only the album's first photo URL is stored per location; the full
  album opens via the Google Photos link. This shrinks the scraped
  surface to one URL per location (less exposure to URL rot and page-
  format changes), keeps `photos.json` tiny, and makes Google Photos
  the system of record for galleries. The grid shows one labeled
  cover tile per album; clicking shows location details + cover +
  album link.

## Risks / Trade-offs

- [Risk] Google changes the shared-album page structure → script
  extracts zero URLs. Mitigation: fail-open build + workflow logs
  showing per-album counts make the breakage visible immediately;
  pivot plan already agreed (self-host photos or Supabase Storage).
- [Risk] `lh3` URLs could someday rot despite their historical
  stability → next deploy re-harvests fresh ones; if rot outpaces
  deploys, that's the signal to pivot.
- [Trade-off] Shared albums are "anyone with the link"; embedding
  them on a public site makes the photos effectively public →
  accepted by owner (site is public); only link albums you're happy
  to publish.
