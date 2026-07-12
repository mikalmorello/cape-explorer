## MODIFIED Requirements

### Requirement: Album covers are harvested from shared albums at build time
The deploy pipeline SHALL, before building the app, fetch a cover image
for each location that has a `photoAlbum` or `coverPhotoLink`, preferring
`coverPhotoLink` when present, and extract **the designated cover photo**
(via the page's `og:image` meta tag, falling back to the first embedded
photo URL if `og:image` is absent) into the photo data consumed by the
app. Full albums are not harvested — `photoAlbum` is reached through its
own link. A failed fetch SHALL log a warning and yield no cover for that
location without failing the build. Covers refresh only when a deploy
runs.

#### Scenario: Cover-photo link takes priority
- **WHEN** a location has both `coverPhotoLink` and `photoAlbum`
- **THEN** the harvester fetches the cover from `coverPhotoLink`, not
  `photoAlbum`

#### Scenario: Falls back to photoAlbum when no cover link is set
- **WHEN** a location has `photoAlbum` but no `coverPhotoLink`
- **THEN** the harvester fetches the cover from `photoAlbum` as before

#### Scenario: Album fetch succeeds using the designated cover
- **WHEN** the fetched page exposes an `og:image` tag
- **THEN** that location's cover URL is the `og:image` photo, and the
  workflow log records that it came from `og:image`

#### Scenario: Fallback when no og:image is present
- **WHEN** the fetched page has no `og:image` tag but does contain
  embedded photo URLs
- **THEN** the first embedded photo URL is used as the cover, and the
  workflow log records the fallback

#### Scenario: Fetch fails
- **WHEN** the relevant page can't be fetched or yields no usable URL
- **THEN** the build completes anyway, the location simply has no
  cover, and the workflow log shows a warning for that album
