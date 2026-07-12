## Context

Google Photos sharing has exactly two independent mechanisms, confirmed
via Google's own help docs and community threads:

1. **Link sharing** (`photos.app.goo.gl/...` → resolves to
   `photos.google.com/share/...?key=...`): a single on/off toggle.
   While on, anyone holding the link gets in. While off, the link 404s
   for everyone, including people separately invited as collaborators.
2. **Direct invite by email**: the invited person gets a notification
   and views the album inside their own signed-in Google Photos
   account, under Sharing. No URL is ever generated for this path.

`https://photos.google.com/album/AF1Qip.../` — the URL that appears in
the browser address bar while browsing your own library — is neither
of these. It's a personal-library permalink: valid only for the
signed-in owner's session, 404 for anyone else regardless of invite
status. There is no "restricted link, ACL-checked against an invite
list" mode analogous to Google Drive's restricted sharing.

## Decision

Given the owner's requirement — no fully-public albums — the only
option consistent with that constraint is to stop offering a "view
full album" link at all for locations whose owner wants the gallery
non-public. The cover photo (via `coverPhotoLink`, a deliberately
public single-photo mini-share, already accepted as public) keeps
showing. Invited people still get full access to the real album, just
through their own Google Photos app rather than a link on the site.

Alternative considered and rejected: replace `photoAlbum` with the real
`photos.app.goo.gl` share link. This works but makes the album public
to anyone holding the link — explicitly ruled out by the owner.

## Non-goals

- Building any kind of proxy/auth layer to gate album access — out of
  scope for a static, backend-free site, and overkill for this use
  case.
