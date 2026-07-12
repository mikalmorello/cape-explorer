## ADDED Requirements

### Requirement: Photos are harvested from shared albums at build time
The deploy pipeline SHALL, before building the app, fetch each
location's `photoAlbum` shared-album page and extract its image URLs
into the photo data consumed by the app. A failed album fetch SHALL
log a warning and yield no photos for that location without failing
the build. Photo data refreshes only when a deploy runs.

#### Scenario: Album fetch succeeds
- **WHEN** the deploy workflow runs for a location with a valid
  `photoAlbum` link
- **THEN** that location's image URLs appear in the built site's photo
  data, and the workflow log records how many photos were found

#### Scenario: Album fetch fails
- **WHEN** an album page can't be fetched or yields no URLs
- **THEN** the build completes anyway, the location simply has no
  photos, and the workflow log shows a warning for that album

### Requirement: Photo grid view with location drill-down
The app SHALL provide a Photos view, toggleable alongside Map and
List, showing a grid with exactly one cover photo per linked album
(its first harvested photo), labeled with the location name. Selecting
a cover SHALL show that location's details (name, area, activities,
notes, website) together with its full gallery.

#### Scenario: Browsing the grid
- **WHEN** the user opens the Photos view and albums have been linked
- **THEN** the grid shows one cover tile per album, each labeled with
  its location

#### Scenario: Drilling into a location
- **WHEN** the user clicks an album cover in the grid
- **THEN** the location's details and its full photo gallery are shown

#### Scenario: No albums linked
- **WHEN** no location has a `photoAlbum` (or no photos were
  harvested)
- **THEN** the Photos view shows a friendly explanation instead of an
  empty grid
