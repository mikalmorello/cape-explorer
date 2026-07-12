## ADDED Requirements

### Requirement: Locations may specify a separate cover-photo link for gated albums
A location MAY have a `coverPhotoLink` field: a Google Photos
single-item share link used only for harvesting the cover image. The
app SHALL keep this independent of the album's own sharing state so a
gated `photoAlbum` can still surface a public cover.

#### Scenario: Location with both a gated album and a cover link
- **WHEN** a location has a `photoAlbum` that requires sign-in and a
  `coverPhotoLink` that is publicly shareable
- **THEN** the harvester uses `coverPhotoLink` for the cover while
  `photoAlbum` remains the "view full album" link shown in the UI

#### Scenario: Location without a cover-photo link
- **WHEN** a location has no `coverPhotoLink`
- **THEN** the harvester uses `photoAlbum` for the cover as before
