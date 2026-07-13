# Working agreement for Cape Explorer

## Deploy

- **Always deploy and sync without asking.** After committing work on
  `claude/cape-explorer-handoff-y4ni9d` (or whatever branch is
  designated for the session), merge it into `main` and push — that's
  what triggers the GitHub Pages deploy workflow. Don't stop to ask
  first; just do it as the last step of any change.
- Before merging/pushing: validate the JSON
  (`node -e "JSON.parse(require('fs').readFileSync('src/data/locations.json'))"`)
  and run `npm run build`.

## OpenSpec

- Every feature change or non-trivial decision goes through OpenSpec:
  proposal → design (when there's a real decision to record) → delta
  specs → tasks → archive. Keep `openspec/specs/` current as the
  living source of truth — don't let it drift from what's actually
  built (it has before; check it reflects reality, not an old plan).
- A plain data addition that only uses fields the specs already
  document (e.g. adding a location with existing fields) doesn't need
  its own change — the schema-defining change already covers it.
- If the OpenSpec CLI's validator rejects a MODIFIED requirement diff
  (a known quirk with dropped/renamed scenarios), hand-merge the spec
  file directly and archive with `--skip-specs`.
- Forward-looking ideas that aren't being built yet go in
  `openspec/config.yaml`'s "Future design references" section, not a
  change — a change implies active work.

## Location data (`src/data/locations.json`)

Full schema lives in `README.md` and `.claude/skills/add-location/SKILL.md`
— use the `add-location` skill for adding/editing entries. Standing
rules worth restating because they're easy to violate by default:

- **Never auto-generate `notes`.** Only the user's own words go in
  `notes` — no invented addresses, hours, or descriptions.
- **Never guess coordinates or addresses.** Web-search and verify. If
  a precise geocode can't be found, use a best estimate, set
  `coordsVerified: false`, and say so — don't present a guess as
  verified.
- **`dogFriendly` is opt-in.** Only set it when the policy is actually
  checked; omit otherwise.
- **Reuse existing `type`/`category` values** before inventing new
  ones.

## Verification

- Validate + build before every commit (see Deploy section).
- For UI changes, actually check them render correctly — a headless
  Playwright check against `npm run preview` works well here (the
  `playwright` package isn't a project dependency, but a global install
  is reachable at `/opt/node22/lib/node_modules/playwright`, and
  Chromium is pre-installed at `/opt/pw-browsers/chromium`).
