## Why

The `add-gated-album-covers` change assumed a location's `photoAlbum`
could be set to the album's `https://photos.google.com/album/...` URL
to "gate" the full gallery — visitors without access would hit
Google's sign-in/request-access screen, invited people would see the
full album. That assumption was wrong: this URL format is a **personal
library permalink**, not a shareable resource. It only ever resolves
for the signed-in owner and 404s for literally everyone else,
regardless of whether they've been invited to the album. This was
confirmed by a real invited user hitting a 404 on the Cape Cod Pirate
Adventures link, and independently confirmed via Google's own Photos
Help and community forum threads: Google Photos has exactly two
sharing mechanisms — a link that works for anyone holding it ("anyone
with the link"), or direct invite-by-email with no link at all
(access lives inside the invited person's own Google Photos app).
There is no third mode where a URL is gated to a specific invite list.

Since the owner does not want albums to be fully public, `photoAlbum`
values using this broken personal-library format are removed for the
affected locations. The already-working, separately-scoped
`coverPhotoLink` (a deliberately public single-photo share, used only
for the thumbnail) is unaffected and continues to work as documented.

## What Changes

- Remove `photoAlbum` from the 28 locations that had a
  `photos.google.com/album/...` personal-library link: Cuffy's of Cape
  Cod, Provincetown Ghost Tours, Marconi Beach, Captain Baker Donut
  Shop, Cape Cod Pirate Adventures, Wellfleet Drive-In, Provincetown
  Dunes, Sandy Neck Beach, Pirate's Cove Adventure Golf, Bass River
  Sports World, Cape Cod Creamery, Lewis Bay, Devil's Purse Brewing,
  Ryan Family Amusements, Wicked Waves Cape Cod, Truro Vineyards, The
  Pancake Man, The Beachcomber, Crab Creek Conservation Area,
  Provincetown Breakwater, Downtown Provincetown, Provincetown Brewing
  Co., Race Point Beach, Nickerson State Park, The Brewster Store,
  Breakwater Beach, Cape Cod Waterways, Wilbur Park (the last eleven
  added after this proposal was drafted, using the same pattern
  pending this decision).
  Their
  `coverPhotoLink` stays, so covers keep showing; the site simply has
  no "view full album" link
  for these until a real link exists.
- Correct `location-data` and `photo-gallery` specs: `photoAlbum` is
  only ever a public "anyone with the link" URL (e.g.
  `photos.app.goo.gl/...`); there is no gated form of this field.
  `coverPhotoLink` remains documented as the mechanism for showing a
  cover without a public album link.
- Update README and the `add-location` skill to drop the
  "authenticated album URL" guidance and explain the real limitation.

## Capabilities

### Modified Capabilities
- `location-data`: corrects the `photoAlbum` requirement — it's a
  public link only, never a gating mechanism.
- `photo-gallery`: clarifies that a location with `coverPhotoLink` but
  no `photoAlbum` shows a cover with no "view full album" link, rather
  than implying `photoAlbum` can be an access-controlled URL.

## Impact

- Modified: `src/data/locations.json` (17 locations lose `photoAlbum`,
  keep `coverPhotoLink`), README.md, `.claude/skills/add-location/SKILL.md`.
- No code changes needed in `scripts/fetch-photos.mjs` or the UI — both
  already treat a missing `photoAlbum` as "no album link" correctly.
