## 1. Harvester

- [x] 1.1 Fetch-photos script tries `coverPhotoLink` first, falls back
      to `photoAlbum`

## 2. Apply to Sandy Neck Beach (real test)

- [x] 2.1 Set Sandy Neck Beach's `photoAlbum` to the gated album URL
      and `coverPhotoLink` to the public single-photo link the owner
      provided
- [ ] 2.2 Deploy, verify via workflow logs that the cover harvests
      successfully and the "view album" link still points at the
      gated URL

## 3. Docs

- [x] 3.1 Document `coverPhotoLink` in README and the `add-location`
      skill
