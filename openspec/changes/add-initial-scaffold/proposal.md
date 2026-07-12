## Why

The repo is currently empty. We need the smallest possible running
skeleton — an app that actually renders a map and is visible at a public
URL — before any activity CRUD work can start.

## What Changes

- Scaffold a Vite + React app (JavaScript, no TypeScript).
- Install Google Maps (`@vis.gl/react-google-maps`) and render a Cape
  Cod-centered map with a single dummy pin, using a Google Maps API key
  from an env var.
- Basic app shell (just enough to mount the map).
- `.gitignore`, `README.md` with local setup instructions.
- Deploy to GitHub Pages via a GitHub Actions workflow that builds the app
  and publishes it on every push to `main`, reading the Google Maps key
  from a repository secret at build time.

Explicitly out of scope for this change: Tailwind and Supabase — those
come later once the app shell and map actually work.

## Capabilities

### New Capabilities
- `map-view`: Renders an interactive, Cape Cod-centered map (Google Maps)
  capable of showing activity pins. This change delivers the map shell and
  one dummy pin; activity-driven pins come in a later change.

### Modified Capabilities
(none — this is the first change)

## Impact

- New repo structure: `src/`, `package.json`, `vite.config.js`,
  `.env.example`, `.github/workflows/deploy.yml`.
- New dependencies: react, react-dom, vite, @vis.gl/react-google-maps.
- No existing code affected (greenfield).
- Manual follow-ups requiring the project owner's accounts (walked
  through as part of this change, not automated by the agent):
  - Creating a Google Maps API key in Google Cloud Console and adding it
    as a `GOOGLE_MAPS_API_KEY` GitHub Actions repository secret.
  - Setting the repo's Settings → Pages → Source to "GitHub Actions" once,
    since that requires repo-admin access the agent doesn't have.
