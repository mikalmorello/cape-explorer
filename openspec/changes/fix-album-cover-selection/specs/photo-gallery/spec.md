## MODIFIED Requirements

### Requirement: Album covers are harvested from shared albums at build time
The deploy pipeline SHALL, before building the app, fetch each
location's `photoAlbum` shared-album page and extract **the album's
actual designated cover photo** (via the page's `og:image` meta tag)
into the photo data consumed by the app, falling back to the first
embedded photo URL only if `og:image` is not present. Full albums are
not harvested — they are reached through the album link itself. A
failed album fetch SHALL log a warning and yield no cover for that
location without failing the build. Covers refresh only when a deploy
runs.

#### Scenario: Album fetch succeeds using the designated cover
- **WHEN** the deploy workflow runs for a location with a valid
  `photoAlbum` link and the album page exposes an `og:image` tag
- **THEN** that location's cover URL is the `og:image` photo (the
  cover the owner chose in Google Photos), and the workflow log
  records that it came from `og:image`

#### Scenario: Fallback when no og:image is present
- **WHEN** an album page has no `og:image` tag but does contain
  embedded photo URLs
- **THEN** the first embedded photo URL is used as the cover, and the
  workflow log records the fallback

#### Scenario: Album fetch fails
- **WHEN** an album page can't be fetched or yields no usable URL
- **THEN** the build completes anyway, the location simply has no
  cover, and the workflow log shows a warning for that album
