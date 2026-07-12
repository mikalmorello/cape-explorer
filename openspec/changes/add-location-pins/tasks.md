## 1. Data

- [ ] 1.1 Create `src/data/locations.json` with the location/activity
      structure from the design
- [ ] 1.2 Verify real coordinates (web search) and seed the starter
      list: Marconi Beach (surfing), Captain Baker Donuts (breakfast,
      website), Cape Cod Pirate Adventures Hyannis (children's cruise),
      Wellfleet Drive-In, Downtown Provincetown (drinks, shopping),
      Provincetown Dunes (sand dune hike), Lighthouse Beach, Sandy Neck
      Beach (fire on beach at night), Truro Vineyards
- [ ] 1.3 Flag any location whose coordinates couldn't be confidently
      verified to the owner

## 2. Map pins

- [ ] 2.1 Render one marker per location from the JSON (remove the
      dummy pin)
- [ ] 2.2 Add an info popup on pin click: name, area, activities with
      status, website link, notes
- [ ] 2.3 Handle the zero-activities case gracefully in the popup

## 3. Verify & deploy

- [ ] 3.1 `npm run build` passes; check pins and popups locally with a
      headless-browser screenshot
- [ ] 3.2 Push to `main`, confirm deploy workflow succeeds, owner
      spot-checks pins on the live site
