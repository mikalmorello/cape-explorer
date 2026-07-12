# deployment Specification

## Purpose
TBD - created by archiving change add-initial-scaffold. Update Purpose after archive.
## Requirements
### Requirement: App auto-deploys to GitHub Pages on push to main
The repository SHALL build and publish the app to GitHub Pages
automatically whenever commits are pushed to the `main` branch, via a
GitHub Actions workflow.

#### Scenario: Push to main triggers a deploy
- **WHEN** a commit is pushed to `main`
- **THEN** a GitHub Actions workflow builds the app and publishes the
  build output to GitHub Pages without manual intervention

#### Scenario: Google Maps key is supplied via repository secret
- **WHEN** the deploy workflow builds the app
- **THEN** it reads the Google Maps API key from a `GOOGLE_MAPS_API_KEY`
  repository secret and injects it as `VITE_GOOGLE_MAPS_API_KEY` at build
  time, rather than the key being hardcoded in the repo

### Requirement: Site is reachable at the project's GitHub Pages URL
The deployed app SHALL be reachable at
`https://mikalmorello.github.io/cape-explorer/` once GitHub Pages is
enabled for the repository.

#### Scenario: Owner enables Pages with GitHub Actions as the source
- **WHEN** the repository owner sets Settings → Pages → Source to "GitHub
  Actions" (a one-time manual step, since it requires repo-admin access)
- **THEN** subsequent workflow runs publish successfully and the site
  loads at the project's Pages URL

