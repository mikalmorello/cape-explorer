# map-view Specification

## Purpose
Renders the interactive map that is the primary way of browsing the
app's locations: an isolated, illustrated-leaning Cape Cod + islands
composition built entirely from self-hosted data, free of any
map-provider API keys or base-map clutter.

## Requirements

### Requirement: Cape Cod-centered map renders on load
The app SHALL render an interactive MapLibre GL map when the app
loads, showing only Cape Cod: land is drawn from committed
shoreline-clipped town-boundary data (US Census cartographic
boundary series - the real Cape Cod outline; no mainland, no world
basemap), the ocean is a decorative wave-patterned background, and
the initial view fits the Cape. No API key or external map service
is required.

#### Scenario: App loads
- **WHEN** a user opens the app
- **THEN** an interactive map renders showing the Cape's real
  coastline shape, pannable and zoomable within restricted bounds,
  with no mainland visible and no map-provider API key involved

### Requirement: Towns are outlined and colored by Cape region
The map SHALL render each Cape town as a shoreline-clipped polygon
with a visible outline, filled with a color determined by its region
(Upper Cape, Mid Cape, Lower Cape, Outer Cape). Inland water bodies
SHALL render simplified above the town fills, geometrically clipped to
the town land so no water can extend past the real coastline; the
ocean SHALL NOT be rendered from map data.

#### Scenario: Region coloring
- **WHEN** the map renders
- **THEN** towns in the same region share a fill color, distinct from
  adjacent regions, with town boundaries visible as outlines

#### Scenario: Simplified inland water
- **WHEN** the map renders at typical zooms
- **THEN** ponds, lakes, and rivers on the Cape appear in the water
  color above the region fills, in simplified form

### Requirement: Islands are deferred until the base map is settled
Martha's Vineyard and Nantucket SHALL NOT render for now; their
boundary polygons SHALL remain in the committed town data so they can
be re-enabled (planned as an inset display shifted toward the Cape
via `REGION_DISPLAY_OFFSET`, with the same offset applied to island
pins). Location data SHALL keep true real-world coordinates
regardless.

#### Scenario: Islands not rendered
- **WHEN** the map renders
- **THEN** no Martha's Vineyard or Nantucket polygons appear, while
  their features remain present in the committed boundary data

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
