## ADDED Requirements

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
The map SHALL display at least one marker (pin) to demonstrate that pins
can be placed and rendered on the map.

#### Scenario: Dummy pin is visible
- **WHEN** the map renders successfully
- **THEN** a single dummy marker is visible at a fixed Cape Cod location
