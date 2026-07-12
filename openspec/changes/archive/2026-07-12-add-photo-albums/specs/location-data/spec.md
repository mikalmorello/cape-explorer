## ADDED Requirements

### Requirement: Locations may link a Google Photos shared album
A location MAY have a `photoAlbum` field containing a Google Photos
shared-album URL (e.g. `https://photos.app.goo.gl/...`). The app
SHALL treat locations without the field as simply having no photos.

#### Scenario: Location with a linked album
- **WHEN** a location has a `photoAlbum` URL
- **THEN** its photos are harvested at deploy time and shown in the
  app's photo features

#### Scenario: Location without a linked album
- **WHEN** a location has no `photoAlbum` field
- **THEN** it remains fully valid and appears everywhere else in the
  app as before
