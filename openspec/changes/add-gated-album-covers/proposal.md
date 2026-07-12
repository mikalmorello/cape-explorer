## Why

The owner wants real access control on some albums: only people they
invite should see the full gallery, while the site still shows a cover
photo to every visitor. Testing showed the album's own "anyone with
the link" toggle governs both the album page *and* any previously
harvested cover URL together — turning it off 404s everything, for
everyone, including invited people (invited people view the album
inside their own Google Photos account, not via the old public link).

Google Photos' single-photo "Get link" action turns out to create its
own independent mini shared-album (its own link-sharing toggle,
separate from the main album). That's the seam this change uses: share
one cover photo publicly on its own, keep the real album gated.

## What Changes

- Add an optional `coverPhotoLink` field to **Location**: a Google
  Photos single-item share link (`https://photos.google.com/share/
  ...?key=...`), used only to harvest the cover image.
- The harvester tries `coverPhotoLink` first when present, falling
  back to `photoAlbum` when it isn't — so fully-public locations need
  no change.
- `photoAlbum` keeps its existing job as the "view full album" link
  shown in the UI. For a gated location it can now be the album's
  authenticated URL (`https://photos.google.com/album/...`) — visitors
  without access see Google's own sign-in/request-access screen, which
  is the real access control the owner wants; invited viewers see the
  full gallery.
- Apply this to Sandy Neck Beach as the first real test: its
  `photoAlbum` becomes the gated album URL, its `coverPhotoLink` the
  public single-photo link.

## Capabilities

### Modified Capabilities
- `location-data`: adds the optional `coverPhotoLink` field.
- `photo-gallery`: harvester prefers `coverPhotoLink` over `photoAlbum`
  when both are present.

## Impact

- Modified: `scripts/fetch-photos.mjs`, `src/data/locations.json`
  (Sandy Neck Beach), README, `add-location` skill docs.
- No new dependencies. Locations that only set `photoAlbum` (the
  common case) are unaffected.
