## Why

The deployed app shows one dummy pin. The owner wants to get their real
Cape Cod places into the app and see them on the map — that's the whole
value of the product. Start simple: data in a file, pins on the map.
Viewing modes (list) and filtering come in later changes.

## What Changes

- Define the data structure as a static JSON file in the repo:
  - **Location** (gets a pin): `id`, `name`, `lat`, `lng`, optional
    `area` (town, e.g. "Provincetown"), optional `website`, optional
    `notes`, `activities[]`. A location can have zero activities.
  - **Activity** (nested in its location): `title`, `category`,
    `status` (`done` / `want-to-do`), optional `notes`.
- Seed the file with the owner's real starter list (Marconi Beach,
  Captain Baker Donuts, Wellfleet Drive-In, Downtown Provincetown,
  Provincetown Dunes, Lighthouse Beach, Sandy Neck Beach, Truro
  Vineyards, Cape Cod Pirate Adventures), with verified coordinates.
- Replace the dummy pin: render one pin per location from the data.
- Clicking a pin opens an info popup: location name, area, its
  activities (title + status), website link if present, notes.
- Remove the dummy-pin code.

Out of scope (future changes): list view, filters, add/edit UI, photos,
Supabase.

## Capabilities

### New Capabilities
- `location-data`: The app's location + activity data model and the
  static JSON data source that feeds the map.

### Modified Capabilities
- `map-view`: The map now renders one pin per location from real data
  (replacing the single dummy pin) and shows location details in a
  popup on pin click.

## Impact

- New: `src/data/locations.json`, `src/features/map/LocationPopup.jsx`
  (or similar).
- Modified: `src/features/map/MapView.jsx`.
- No new dependencies expected (`@vis.gl/react-google-maps` provides
  `InfoWindow`/`Marker`).
- Data updates happen by editing the JSON file (owner can ask Claude to
  add entries) until an add/edit UI exists.
