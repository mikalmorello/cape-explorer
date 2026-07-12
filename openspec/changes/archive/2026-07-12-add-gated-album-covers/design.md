## Context

Confirmed via a live test (Sandy Neck Beach): disabling an album's
"anyone with the link" toggle 404s the album page for anonymous
fetches immediately, and the very same link stops working for
literally everyone, including people individually invited — invited
viewers access the album through their own Google Photos account, not
through the link that was ever displayed on the site. There is no
Google Photos link that is simultaneously public-for-cover and
gated-for-gallery.

The seam that makes both halves possible: sharing a single item
generates its own independent mini shared-album with its own
link-sharing toggle - unrelated to whichever state the main album's
toggle is in.

## Goals / Non-Goals

**Goals:**
- Owner can gate a full album to invited people while the site still
  shows a cover photo to all visitors.
- No change required for the common case (fully public albums).

**Non-Goals:**
- No attempt to detect or auto-recover from an album going private
  mid-flight - `coverPhotoLink` must be deliberately set by the owner.
- No change to how the "view full album" link is rendered - it's
  already just a plain `<a href>`; a sign-in wall is Google's page,
  not ours to build.

## Decisions

- **`coverPhotoLink` is separate from `photoAlbum`**, not a mode flag,
  because a location can transition between public and gated over time
  without changing which field means what.
- **Harvester tries `coverPhotoLink` first, falls back to
  `photoAlbum`.** Reusing the same extraction logic (og:image, then
  first-embedded-photo) for both, since a single-item share page has
  the same og:image mechanism as an album page.
- **No UI change to the "view album" link.** It already just renders
  `photoAlbum` as a link; whether that URL is public or gated is a
  Google-side property of the URL, invisible to the app.

## Risks / Trade-offs

- [Risk] If the owner later shares a *different* photo as the cover
  link, `coverPhotoLink` needs a manual update - not automatic.
  Acceptable; same manual-curation model as adding albums in the first
  place.
- [Trade-off] The site can't show *why* a full album is inaccessible
  to a given visitor (Google's own screen handles that) - acceptable,
  it's Google's UI to own.
