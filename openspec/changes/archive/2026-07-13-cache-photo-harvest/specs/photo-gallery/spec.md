## MODIFIED Requirements

### Requirement: Album covers are harvested from shared albums at build time
The deploy pipeline SHALL, before building the app, fetch a cover image
for each location that has a `photoAlbum` or `coverPhotoLink`,
preferring `coverPhotoLink` when present, and extract **the designated
cover photo** (via the page's `og:image` meta tag, falling back to the
first embedded photo URL if `og:image` is absent) into the photo data
consumed by the app. Full albums are not harvested — `photoAlbum` is
reached through its own link. The harvester SHALL persist a cache of
each location's source URL and resulting cover across deploys, and
SHALL skip re-fetching a location whose source URL is unchanged since
the last successful harvest. A failed fetch SHALL log a warning; if a
previous cover is cached for that location it is kept, otherwise the
location has no cover — either way the build does not fail. The
harvester SHALL report harvested/skipped/failed counts in the GitHub
Actions job summary. Covers refresh only when a deploy runs.

#### Scenario: Cover-photo link takes priority
- **WHEN** a location has both `coverPhotoLink` and `photoAlbum`
- **THEN** the harvester fetches the cover from `coverPhotoLink`, not
  `photoAlbum` - this is what lets a gated `photoAlbum` still show a
  public cover

#### Scenario: Falls back to photoAlbum when no cover link is set
- **WHEN** a location has `photoAlbum` but no `coverPhotoLink`
- **THEN** the harvester fetches the cover from `photoAlbum` as before

#### Scenario: Fetch succeeds using the designated cover
- **WHEN** the fetched page exposes an `og:image` tag
- **THEN** that location's cover URL is the `og:image` photo (the
  cover the owner chose in Google Photos), and the workflow log
  records that it came from `og:image`

#### Scenario: Fallback when no og:image is present
- **WHEN** the fetched page has no `og:image` tag but does contain
  embedded photo URLs
- **THEN** the first embedded photo URL is used as the cover, and the
  workflow log records the fallback

#### Scenario: Unchanged source URL is skipped
- **WHEN** a location's `photoAlbum`/`coverPhotoLink` matches what was
  cached from the previous successful harvest
- **THEN** no network request is made for that location, and its
  cached cover is reused

#### Scenario: Fetch fails with a cached cover available
- **WHEN** the relevant page can't be fetched or yields no usable URL,
  and a previous cover is cached for that location
- **THEN** the build completes anyway, the location keeps its
  last-known-good cover, and the workflow log and job summary show a
  warning for that album

#### Scenario: Fetch fails with no cached cover
- **WHEN** the relevant page can't be fetched or yields no usable URL,
  and no previous cover is cached for that location
- **THEN** the build completes anyway, the location simply has no
  cover, and the workflow log and job summary show a warning for that
  album
