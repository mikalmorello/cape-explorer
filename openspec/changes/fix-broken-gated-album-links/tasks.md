## 1. Data

- [ ] 1.1 Remove `photoAlbum` from the 17 affected locations, keeping
      `coverPhotoLink` intact
- [ ] 1.2 Validate `locations.json` still parses and the app builds

## 2. Docs

- [ ] 2.1 Update README: remove the "authenticated album URL" gating
      guidance, explain the real limitation and cover-only fallback
- [ ] 2.2 Update `add-location` skill docs to match

## 3. Specs

- [ ] 3.1 Correct `location-data` spec: `photoAlbum` is public-link-only
- [ ] 3.2 Correct `photo-gallery` spec: cover-only scenario when
      `photoAlbum` is absent but `coverPhotoLink` is present

## 4. Ship

- [ ] 4.1 Commit and push to `claude/cape-explorer-handoff-y4ni9d`
- [ ] 4.2 Archive this change
