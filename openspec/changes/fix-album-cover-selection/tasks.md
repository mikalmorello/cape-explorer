## 1. Cover selection fix

- [x] 1.1 Harvester prefers `og:image` meta tag over first-photo order,
      falls back when absent
- [x] 1.2 Shared `sizedPhotoUrl` helper strips any existing size suffix
      before appending, used by Photos view and List view

## 2. Verify & deploy

- [x] 2.1 Unit-check `og:image` extraction and suffix-stripping
- [x] 2.2 Push to `main`, confirm deploy succeeds and workflow logs
      show `og:image` as the cover source for existing albums
