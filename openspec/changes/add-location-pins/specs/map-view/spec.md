## MODIFIED Requirements

### Requirement: Map displays at least one pin
The map SHALL display one marker (pin) per location loaded from the
app's location data source, replacing the previous single dummy
marker.

#### Scenario: All locations appear as pins
- **WHEN** the map renders successfully
- **THEN** every location in the data source is shown as a marker at
  its `lat`/`lng`

#### Scenario: No dummy pin remains
- **WHEN** the map renders successfully
- **THEN** no hardcoded dummy marker is displayed

## ADDED Requirements

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
