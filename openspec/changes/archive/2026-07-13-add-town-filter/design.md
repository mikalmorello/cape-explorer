## Context

`area` is already one town/village name per location (e.g. "West
Dennis", "Provincetown") and is what `capeRegions.js` maps to a region
for List grouping. It's the natural filter key — no need for a
separate `town` field that could drift from `area`.

## Decision

- Filter options are derived from the data itself: the distinct set of
  `area` values present, sorted alphabetically, not a hardcoded list —
  new towns just work as locations are added.
- Filter state lives in `App.jsx` (`const [town, setTown] = useState('all')`)
  and is passed as a prop to both `MapView` and `LocationList`, so the
  two views can't disagree about which town is active. Photos view is
  left unfiltered for now — narrower scope, not asked for.
- `address` is stored but not used for filtering or display grouping,
  just shown alongside `website`/`notes` in the popup and card. Kept
  optional since most existing locations only have `area` today.

## Non-goals

- No multi-town / multi-select filtering — one town or "all", matching
  the simple ask.
- No geocoding `address` into `lat`/`lng` — those stay independently
  verified per the existing coordinate rule.
