## 1. Schema

- [x] 1.1 Add `type` to every existing location (backfilled from its
      activities/nature)
- [x] 1.2 Add `dogFriendly` where confidently verified (Sandy Neck
      Beach, Nickerson State Park), leave unset elsewhere
- [x] 1.3 Update README and `add-location` skill docs with the new
      fields and vocabulary

## 2. New locations

- [x] 2.1 Add Pancake Man, Provincetown Breakwater, Crab Creek,
      Smugglers Beach, Cape Cod Waterways (with `type` from the start)

## 3. Map style

- [x] 3.1 Add a `styles` array to `<Map>` hiding `poi` and `transit`
      feature types
- [x] 3.2 Verify visually (headless screenshot) that only the app's
      pins remain, base map still readable

## 4. Verify & deploy

- [x] 4.1 Validate JSON, `npm run build`
- [x] 4.2 Push to `main`, confirm deploy succeeds
