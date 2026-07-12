## Context

The dataset now has 27 locations spanning breweries, beaches, hikes,
food, and entertainment with no way to visually distinguish them on the
map, and no way to know in advance whether a place welcomes dogs. The
map itself still shows Google's default restaurant/shop/transit icons,
which compete visually with the app's own pins and don't serve this
app's purpose (a personal activity log, not a general map browser).

## Goals / Non-Goals

**Goals:**
- Every location has a `type` for future icon/filter work.
- `dogFriendly` is available as a field, populated only where verified.
- The map shows only the app's own pins — no competing default icons.

**Non-Goals:**
- No custom pin icons yet (follow-up change once `type` values settle).
- No filter UI yet (follow-up change).
- No map-layer toggle switch — the simplified view is the new default;
  a toggle is only added later if that turns out to be insufficient.

## Decisions

- **`type` is a single, required, lowercase string per location** —
  reusing the existing activity-category vocabulary where it fits
  (beach, food, brewery, hike, entertainment, shopping, winery,
  fishing) plus a couple of new ones needed for this batch (`park`,
  `attraction`, `watersports`). It's the location's primary identity
  for a future icon, not an exhaustive tag list — a location with mixed
  activities (e.g. Downtown Provincetown: drinks + shopping) still gets
  one representative `type`.
- **`dogFriendly` is optional and unset by default.** Only set where
  confidently verified via search (e.g. official park/beach policy
  pages) — with the specific rule captured in `notes` since dog rules
  are usually seasonal/conditional, not a flat yes/no.
- **Map decluttering via the `styles` prop on `<Map>`**, not a
  `mapId`/Cloud-based style. The app doesn't use Advanced Markers, so
  there's no reason to add the Cloud Console `mapId` setup step just
  for styling — the classic JSON `styles` array (`featureType: 'poi'`
  and `'transit'`, `visibility: 'off'`) achieves the same result with
  zero extra configuration.

## Risks / Trade-offs

- [Risk] Hiding POI icons also hides some default labels the owner
  might miss (e.g. a road landmark) → Mitigation: the app's own pins
  and popups are the intended source of truth for "places we care
  about"; base map labels (roads, towns, water) remain visible.
- [Trade-off] `type` is single-valued, so mixed-purpose locations lose
  some nuance in map iconography → acceptable; the `activities[]` list
  still fully captures what happens there.
