## 1. Harvester

- [x] 1.1 Load `src/data/photos-cache.json` if present
- [x] 1.2 Skip fetch when a location's source URL matches the cache;
      reuse its cached cover
- [x] 1.3 On fetch failure, fall back to the cached cover if one
      exists, instead of dropping it
- [x] 1.4 Write the updated cache back to `photos-cache.json`
- [x] 1.5 Append a harvest summary (harvested/skipped/failed) to
      `$GITHUB_STEP_SUMMARY`

## 2. Workflow

- [x] 2.1 Add an `actions/cache` step for `src/data/photos-cache.json`
      keyed on `photo-harvest-${{ github.run_id }}` with
      `restore-keys: photo-harvest-`, before the fetch-photos step

## 3. Docs

- [x] 3.1 Note the caching behavior in the README

## 4. Ship

- [x] 4.1 Validate, build, commit, merge to main, push
- [x] 4.2 Verify via a deploy that unchanged locations are skipped and
      the job summary shows up
- [x] 4.3 Archive this change
