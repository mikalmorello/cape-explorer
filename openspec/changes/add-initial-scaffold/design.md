## Context

Greenfield repo. This is the first change: get a map rendering and
published at a public URL, nothing else.

## Goals / Non-Goals

**Goals:**
- A running Vite + React app (JavaScript).
- A map that renders, centered on Cape Cod, with one dummy pin, using
  Google Maps.
- Clear local setup instructions.
- The app auto-deploys to GitHub Pages on push to `main`.

**Non-Goals:**
- No Tailwind, no Supabase client in this change — each is its own
  follow-up change once actually needed.
- No real data model, activity CRUD, list view, or filters yet.
- No custom domain — plain `<owner>.github.io/<repo>` URL for now.

## Decisions

- **Google Maps over Mapbox/Leaflet**: using Google Maps JS API. Requires
  a Google Cloud API key (usage limits/billing apply above the free tier,
  acceptable for a 2-person project's low traffic).
- **`@vis.gl/react-google-maps` as the React wrapper**: this is Google's
  own actively-maintained library (successor to the older, now
  in-maintenance-mode `@react-google-maps/api`), so it tracks the Maps JS
  API directly and fits React's component model for the pins later
  changes will add.
- **Folder layout**: `src/features/map/` for the map view. Keeps room to
  add `src/features/activities/` in a later change without restructuring.
- **Plain JavaScript, not TypeScript**: keeps the scaffold minimal per
  project owner's preference.
- **GitHub Pages via GitHub Actions** (not a `gh-pages` branch pushed by a
  tool): use the official `actions/configure-pages` +
  `actions/upload-pages-artifact` + `actions/deploy-pages` flow, triggered
  on push to `main`. This is the currently-recommended approach for
  project sites and keeps the deploy fully declarative in the workflow
  file.
- **API key delivery**: the Google Maps key is a **public, client-visible**
  value once bundled (that's normal for browser Maps JS API keys) — it's
  restricted by HTTP referrer in Google Cloud Console, not kept secret.
  The workflow reads it from a `GOOGLE_MAPS_API_KEY` repository secret at
  *build* time (`VITE_GOOGLE_MAPS_API_KEY=${{ secrets.GOOGLE_MAPS_API_KEY }}`)
  so it isn't hardcoded in the repo, even though it ends up in the public
  JS bundle after build — the actual security boundary is the HTTP
  referrer restriction on the key itself, not secrecy of the built asset.
- **Vite `base` path**: since this is a project page
  (`mikalmorello.github.io/cape-explorer`, not a user/org root page), set
  `base: '/cape-explorer/'` in `vite.config.js` so built asset URLs
  resolve correctly.

## Risks / Trade-offs

- [Risk] No API key committed (as expected) means the map won't render
  until the owner adds one → Mitigation: the map component shows a clear
  inline message when `VITE_GOOGLE_MAPS_API_KEY` is missing, instead of a
  blank screen or crash. Same fallback applies on the deployed site until
  the secret is added.
- [Risk] An unrestricted Maps API key could be abused if leaked/scraped
  from the public bundle → Mitigation: walk the owner through restricting
  the key by HTTP referrer to their GitHub Pages origin (and localhost for
  dev) when creating it.
- [Risk] GitHub Pages requires a one-time manual repo-settings change
  (Settings → Pages → Source → "GitHub Actions") that the agent cannot
  perform via available tooling → Mitigation: documented as an explicit
  walkthrough step for the project owner.
- [Trade-off] Deferring Tailwind/Supabase means this change alone has no
  real data or styling system yet → acceptable, those are separate
  follow-up changes.
