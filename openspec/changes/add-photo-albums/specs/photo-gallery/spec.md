## ADDED Requirements

### Requirement: Album covers are harvested from shared albums at build time
The deploy pipeline SHALL, before building the app, fetch each
location's `photoAlbum` shared-album page and extract **one cover
image URL** (the album's first photo) into the photo data consumed by
the app. Full albums are not harvested — they are reached through the
album link itself. A failed album fetch SHALL log a warning and yield
no cover for that location without failing the build. Covers refresh
only when a deploy runs.

#### Scenario: Album fetch succeeds
- **WHEN** the deploy workflow runs for a location with a valid
  `photoAlbum` link
- **THEN** that location's cover URL appears in the built site's photo
  data, and the workflow log records the harvest

#### Scenario: Album fetch fails
- **WHEN** an album page can't be fetched or yields no URLs
- **THEN** the build completes anyway, the location simply has no
  cover, and the workflow log shows a warning for that album

### Requirement: Photo grid view with location drill-down
The app SHALL provide a Photos view, toggleable alongside Map and
List, showing a grid with exactly one cover photo per linked album,
labeled with the location name. Selecting a cover SHALL show that
location's details (name, area, activities, notes, website), its
cover image, and a link to open the full album in Google Photos.

#### Scenario: Browsing the grid
- **WHEN** the user opens the Photos view and albums have been linked
- **THEN** the grid shows one cover tile per album, each labeled with
  its location

#### Scenario: Drilling into a location
- **WHEN** the user clicks an album cover in the grid
- **THEN** the location's details are shown with its cover image and a
  link that opens the full album in Google Photos

#### Scenario: No albums linked
- **WHEN** no location has a `photoAlbum` (or no covers were
  harvested)
- **THEN** the Photos view shows a friendly explanation instead of an
  empty grid
