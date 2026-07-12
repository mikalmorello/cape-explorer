## 1. Data

- [x] 1.1 Create `src/data/locations.json` with the location/activity
      structure from the design
- [x] 1.2 Verify real coordinates (web search) and seed the starter
      list: Marconi Beach (surfing), Captain Baker Donuts (breakfast,
      website), Cape Cod Pirate Adventures Hyannis (children's cruise),
      Wellfleet Drive-In, Downtown Provincetown (drinks, shopping),
      Provincetown Dunes (sand dune hike), Lighthouse Beach, Sandy Neck
      Beach (fire on beach at night), Truro Vineyards
- [x] 1.3 Flag any location whose coordinates couldn't be confidently
      verified to the owner

## 2. Map pins

- [x] 2.1 Render one marker per location from the JSON (remove the
      dummy pin)
- [x] 2.2 Add an info popup on pin click: name, area, activities with
      status, website link, notes
- [x] 2.3 Handle the zero-activities case gracefully in the popup

## 3. Data view

- [x] 3.1 Add a Map/List toggle to the app header
- [x] 3.2 Build the List view: every location with area, website,
      notes, and activities (title, category, status)

## 4. Structured add/edit workflow

- [x] 4.1 Create `.claude/skills/add-location/SKILL.md` documenting the
      schema and the add/edit steps (verify coords via web search, slug
      ids, validate JSON, commit and push to main)

## 5. Verify & deploy

- [x] 5.1 `npm run build` passes; check pins, popups, and list view
      locally with a headless-browser screenshot
- [x] 5.2 Push to `main`, confirm deploy workflow succeeds, owner
      spot-checks pins on the live site
