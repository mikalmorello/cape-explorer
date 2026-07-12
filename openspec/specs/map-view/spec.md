# map-view Specification

## Purpose
Renders the interactive Cape Cod map that is the primary way of
browsing the app's locations, and keeps that map focused on the app's
own data rather than Google's general-purpose map clutter.

## Requirements

### Requirement: Cape Cod-centered map renders on load
The app SHALL render an interactive Google Maps map centered on Cape Cod,
Massachusetts, when the app loads.

#### Scenario: App loads with a valid Google Maps API key configured
- **WHEN** a user opens the app and `VITE_GOOGLE_MAPS_API_KEY` is set
- **THEN** an interactive map is displayed, centered and zoomed on Cape
  Cod, pannable and zoomable by the user

#### Scenario: Google Maps API key is missing
- **WHEN** a user opens the app and `VITE_GOOGLE_MAPS_API_KEY` is not set
- **THEN** the app shows a clear inline message explaining the map cannot
  render without an API key, instead of a blank screen or an unhandled
  error

### Requirement: Map displays at least one pin
The map SHALL display one marker (pin) per location loaded from the
app's location data source. No hardcoded dummy marker is displayed.

#### Scenario: All locations appear as pins
- **WHEN** the map renders successfully
- **THEN** every location in the data source is shown as a marker at
  its `lat`/`lng`, and no dummy marker is displayed

### Requirement: Pin click shows location details
Clicking a marker SHALL open an info popup for that location showing
its name, its activities (title and category), and — when present —
its area, website link, and notes.

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
The map SHALL suppress Google's default points-of-interest icons/labels
and transit markers, showing only the app's own location pins plus
base map features (roads, water, town/place labels).

#### Scenario: Map renders without competing default icons
- **WHEN** the map loads
- **THEN** no default Google POI icons (restaurants, shops, etc.) or
  transit markers are visible
- **AND** the app's own location pins remain visible
