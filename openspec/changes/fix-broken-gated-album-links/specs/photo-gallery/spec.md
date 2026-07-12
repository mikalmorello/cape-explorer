## MODIFIED Requirements

### Requirement: Photo grid view with location drill-down
The app SHALL provide a Photos view, toggleable alongside Map and
List, showing a grid with exactly one cover photo per location that
has a harvested cover, labeled with the location name. Selecting a
cover SHALL show that location's details (name, area, activities,
notes, website), its cover image, and — only when `photoAlbum` is
set — a link to open the full album in Google Photos. A location with
a cover but no `photoAlbum` (its gallery isn't public) SHALL show the
cover with no "view full album" link, rather than a broken or
misleading one.

#### Scenario: Browsing the grid
- **WHEN** the user opens the Photos view and covers have been
  harvested
- **THEN** the grid shows one cover tile per location with a cover,
  each labeled with its location name

#### Scenario: Drilling into a location with a public album
- **WHEN** the user clicks a cover for a location that has `photoAlbum`
- **THEN** the location's details are shown with its cover image and a
  link that opens the full album in Google Photos

#### Scenario: Drilling into a location without a public album
- **WHEN** the user clicks a cover for a location that has
  `coverPhotoLink` but no `photoAlbum`
- **THEN** the location's details are shown with its cover image and
  no "view full album" link

#### Scenario: No albums linked
- **WHEN** no location has a `photoAlbum` or `coverPhotoLink` (or no
  covers were harvested)
- **THEN** the Photos view shows a friendly explanation instead of an
  empty grid
