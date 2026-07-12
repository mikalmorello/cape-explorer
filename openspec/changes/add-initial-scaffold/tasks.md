## 1. Scaffold

- [x] 1.1 Create Vite + React app (JavaScript) in the repo root
- [x] 1.2 Add `.gitignore` (node_modules, dist, .env, .env.local)
- [x] 1.3 Add root `README.md` with local setup instructions

## 2. Map view

- [x] 2.1 Install `@vis.gl/react-google-maps`
- [x] 2.2 Add `.env.example` documenting `VITE_GOOGLE_MAPS_API_KEY`
- [x] 2.3 Create `src/features/map/MapView.jsx` centered on Cape Cod
- [x] 2.4 Add one dummy marker/pin to the map
- [x] 2.5 Show a clear inline message when `VITE_GOOGLE_MAPS_API_KEY` is
      missing instead of a blank map or crash
- [x] 2.6 Mount `MapView` as the app's main content

## 3. Verify

- [x] 3.1 `npm run build` succeeds
- [x] 3.2 `npm run dev` serves the app and the map (or the missing-key
      message) renders correctly

## 4. Deploy to GitHub Pages

- [x] 4.1 Set `base: '/cape-explorer/'` in `vite.config.js` for the
      project-pages URL
- [x] 4.2 Add `.github/workflows/deploy.yml` that builds on push to
      `main` and deploys via `actions/configure-pages` +
      `actions/upload-pages-artifact` + `actions/deploy-pages`, passing
      `VITE_GOOGLE_MAPS_API_KEY` from a `GOOGLE_MAPS_API_KEY` repo secret
- [ ] 4.3 Walk the project owner through: creating a Google Maps API key
      in Google Cloud Console, restricting it by HTTP referrer to the
      Pages origin (+ localhost for dev), adding it as a
      `GOOGLE_MAPS_API_KEY` repository secret, and setting Settings →
      Pages → Source to "GitHub Actions"
- [ ] 4.4 Confirm the workflow run succeeds and the site is reachable at
      `https://mikalmorello.github.io/cape-explorer/`
