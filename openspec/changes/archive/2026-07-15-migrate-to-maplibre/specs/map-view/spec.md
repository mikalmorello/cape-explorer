## MODIFIED Requirements

### Requirement: Cape Cod-centered map renders on load
The app SHALL render an interactive MapLibre GL map when the app
loads, showing only Cape Cod and the islands: land is drawn from the
committed town-boundary data (no mainland, no world basemap), the
ocean is a decorative wave-patterned background, and the initial view
fits the whole composition (Cape plus the inset islands). No API key
or external map service is required.

#### Scenario: App loads
- **WHEN** a user opens the app
- **THEN** an interactive map renders showing the Cape and islands
  composition, pannable and zoomable within restricted bounds, with
  no mainland visible and no map-provider API key involved

#### Scenario: Tile file unavailable
- **WHEN** the inland-water tile file is missing or unreachable
- **THEN** the town polygons, ocean waves, and all pins still render
  from committed data - the map remains usable, only inland-water
  detail is absent

### Requirement: Towns are outlined and colored by Cape region
The map SHALL render each Cape town, Martha's Vineyard town, and
Nantucket as a polygon with a visible outline, filled with a color
determined by its region (Upper Cape, Mid Cape, Lower Cape, Outer
Cape, Martha's Vineyard, Nantucket). Inland water bodies SHALL render
simplified above the town fills; the ocean SHALL NOT be rendered from
map data.

#### Scenario: Region coloring
- **WHEN** the map renders
- **THEN** towns in the same region share a fill color, distinct from
  adjacent regions, with town boundaries visible as outlines

#### Scenario: Simplified inland water
- **WHEN** the map renders at typical zooms
- **THEN** ponds, lakes, and rivers on the Cape appear in the water
  color above the region fills, in simplified form

### Requirement: Islands are displayed inset near the Cape
The map SHALL display Martha's Vineyard and Nantucket translated
closer to the Cape by fixed display-time offsets so the full
composition fits one frame. Location data SHALL keep true real-world
coordinates; the same offset applied to an island's land SHALL be
applied to pins for locations in that island's towns.

#### Scenario: Island pin lands on shifted island
- **WHEN** a location whose `area` is an island town is rendered
- **THEN** its marker appears at the correct spot on the shifted
  island polygon, while its stored lat/lng remain the true values

### Requirement: Map displays at least one pin
The map SHALL display one marker (pin) per location loaded from the
app's location data source that matches the active town filter (or
every location when "All towns" is selected). No hardcoded dummy
marker is displayed.

#### Scenario: All matching locations appear as pins
- **WHEN** the map renders successfully with a town filter active
- **THEN** only locations whose `area` matches the selected town are
  shown as markers, at their `lat`/`lng` (display-offset for island
  towns)

#### Scenario: No filter active
- **WHEN** "All towns" is selected
- **THEN** every location in the data source is shown as a marker

### Requirement: Pin click shows location details
Clicking a marker SHALL open an info popup for that location showing
its name, its activities (title and category), and - when present -
its area, address, website link, notes, photo album link, and closed
badge.

#### Scenario: Location with activities and website
- **WHEN** the user clicks the marker of a location that has
  activities and a website
- **THEN** the popup shows the location name, each activity, and a
  clickable website link

#### Scenario: Location with no activities
- **WHEN** the user clicks the marker of a location with no activities
- **THEN** the popup shows the location name (and area/notes if
  present) without an activities section

### Requirement: Map hides default points-of-interest and transit layers
The map SHALL contain no third-party base-map clutter: no POI icons,
no transit markers, no road network, and no text labels. Only the
app's own land/water rendering and location pins appear.

#### Scenario: Map renders without competing content
- **WHEN** the map loads
- **THEN** no POI icons, transit markers, roads, or base-map labels
  are visible - only the region-colored towns, water, waves, and the
  app's pins
