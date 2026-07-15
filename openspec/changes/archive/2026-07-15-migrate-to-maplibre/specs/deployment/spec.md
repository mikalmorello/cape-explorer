## MODIFIED Requirements

### Requirement: App auto-deploys to GitHub Pages on push to main
The repository SHALL build and publish the app to GitHub Pages
automatically whenever commits are pushed to the `main` branch, via a
GitHub Actions workflow. Before building, the workflow SHALL ensure
the Cape-region map tile extract is present (restoring it from the
Actions cache or fetching it via `scripts/fetch-tiles.mjs`); a failed
tile fetch with no cached copy SHALL fail the build. No map-provider
API key is used at build time.

#### Scenario: Push to main triggers a deploy
- **WHEN** a commit is pushed to `main`
- **THEN** a GitHub Actions workflow restores or fetches the map
  tiles, builds the app, and publishes the build output to GitHub
  Pages without manual intervention

#### Scenario: Tile extract is cached across deploys
- **WHEN** a deploy runs and a previously fetched tile extract is in
  the Actions cache
- **THEN** the workflow reuses it without re-downloading

#### Scenario: Tile fetch fails with no cache
- **WHEN** the tile fetch fails and no cached extract exists
- **THEN** the build fails visibly rather than deploying a site with
  no inland-water layer
