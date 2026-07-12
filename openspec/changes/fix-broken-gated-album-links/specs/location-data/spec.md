## MODIFIED Requirements

### Requirement: Locations may link a Google Photos shared album
A location MAY have a `photoAlbum` field containing a **public**
Google Photos shared-album link (`https://photos.app.goo.gl/...` or
its resolved `https://photos.google.com/share/...?key=...` form) —
i.e. a link with "anyone with the link" sharing turned on. Google
Photos has no mechanism for a link restricted to specific invited
people only, so `photoAlbum` SHALL NOT be set to a personal-library
URL (`https://photos.google.com/album/...` or `/photo/...` copied from
the address bar) in an attempt to gate access — that URL format only
resolves for the signed-in owner and 404s for everyone else regardless
of invitation status. The app SHALL treat locations without the field
as simply having no "view full album" link.

#### Scenario: Location with a public album link
- **WHEN** a location has a `photoAlbum` URL
- **THEN** its cover is harvested at deploy time and a "view full
  album" link is shown, reachable by anyone holding that link

#### Scenario: Location without a linked album
- **WHEN** a location has no `photoAlbum` field
- **THEN** it remains fully valid and appears everywhere else in the
  app as before, with no "view full album" link shown
