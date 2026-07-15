# deployment Specification

## Purpose
TBD - created by archiving change add-initial-scaffold. Update Purpose after archive.
## Requirements
### Requirement: App auto-deploys to GitHub Pages on push to main
The repository SHALL build and publish the app to GitHub Pages
automatically whenever commits are pushed to the `main` branch, via a
GitHub Actions workflow. Both town boundary polygons
(`src/data/capeTowns.json`) and inland water polygons
(`src/data/capeWater.json`) are committed data, each regenerated on
demand by its own manually-dispatched workflow (`generate-towns`,
`generate-water`) rather than fetched at deploy time. No map-provider
API key is used at build time.

#### Scenario: Push to main triggers a deploy
- **WHEN** a commit is pushed to `main`
- **THEN** a GitHub Actions workflow builds the app from the
  committed map data and publishes the build output to GitHub Pages
  without manual intervention

### Requirement: Site is reachable at the project's GitHub Pages URL
The deployed app SHALL be reachable at
`https://mikalmorello.github.io/cape-explorer/` once GitHub Pages is
enabled for the repository.

#### Scenario: Owner enables Pages with GitHub Actions as the source
- **WHEN** the repository owner sets Settings → Pages → Source to "GitHub
  Actions" (a one-time manual step, since it requires repo-admin access)
- **THEN** subsequent workflow runs publish successfully and the site
  loads at the project's Pages URL

