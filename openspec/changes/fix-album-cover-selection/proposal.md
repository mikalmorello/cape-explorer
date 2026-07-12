## Why

The cover harvester was grabbing the *first photo in album order*
(upload/date order), not the photo the owner actually set as the
album's cover in Google Photos — those are frequently different
photos. It also assumed harvested URLs never carry a size suffix,
which would break if a future data source did.

## What Changes

- Prefer the shared-album page's `og:image` meta tag (Google's own
  designated cover, used for link previews) when selecting a
  location's cover photo; fall back to the first embedded photo URL
  only if `og:image` is missing.
- Make thumbnail/cover URL sizing resilient to a base URL that already
  carries a size suffix (strip-then-append instead of blind-append),
  shared via `src/lib/googlePhotos.js` and used by both the Photos view
  and the List view thumbnails.

## Capabilities

### Modified Capabilities
- `photo-gallery`: cover selection now reflects Google Photos' actual
  designated cover photo, not upload order.

## Impact

- Modified: `scripts/fetch-photos.mjs`,
  `src/features/photos/PhotosView.jsx`,
  `src/features/locations/LocationList.jsx`.
- New: `src/lib/googlePhotos.js` (shared sizing helper).
- No new dependencies. Existing harvested covers (Pirate Adventures,
  Provincetown Dunes) get corrected on the next deploy.
