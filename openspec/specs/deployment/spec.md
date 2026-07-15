# deployment Specification

## Purpose
TBD - created by archiving change add-initial-scaffold. Update Purpose after archive.
## Requirements
### Requirement: App auto-deploys to GitHub Pages on push to main
The repository SHALL build and publish the app to GitHub Pages
automatically whenever commits are pushed to the `main` branch, via a
GitHub Actions workflow. Before building, the workflow SHALL ensure
the Cape-region inland-water tile extract is present (restoring it
from the Actions cache or fetching it via
`scripts/fetch-map-data.mjs`); a failed fetch with no cached copy
SHALL fail the build. Town boundary polygons are committed data,
regenerated on demand by the manually-dispatched `generate-towns`
workflow. No map-provider API
key is used at build time.

#### Scenario: Push to main triggers a deploy
- **WHEN** a commit is pushed to `main`
- **THEN** a GitHub Actions workflow restores or fetches the map
  data, builds the app, and publishes the build output to GitHub
  Pages without manual intervention

#### Scenario: Map data is cached across deploys
- **WHEN** a deploy runs and previously fetched map data is in the
  Actions cache
- **THEN** the workflow reuses it without re-downloading

#### Scenario: Map data fetch fails with no cache
- **WHEN** the map data fetch fails and no cached copy exists
- **THEN** the build fails visibly rather than deploying a site with
  no land or water rendering

### Requirement: Site is reachable at the project's GitHub Pages URL
The deployed app SHALL be reachable at
`https://mikalmorello.github.io/cape-explorer/` once GitHub Pages is
enabled for the repository.

#### Scenario: Owner enables Pages with GitHub Actions as the source
- **WHEN** the repository owner sets Settings → Pages → Source to "GitHub
  Actions" (a one-time manual step, since it requires repo-admin access)
- **THEN** subsequent workflow runs publish successfully and the site
  loads at the project's Pages URL

