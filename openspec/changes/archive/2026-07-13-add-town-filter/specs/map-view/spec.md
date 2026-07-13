## MODIFIED Requirements

### Requirement: Map displays at least one pin
The map SHALL display one marker (pin) per location loaded from the
app's location data source that matches the active town filter (or
every location when "All towns" is selected). No hardcoded dummy
marker is displayed.

#### Scenario: All matching locations appear as pins
- **WHEN** the map renders successfully with a town filter active
- **THEN** only locations whose `area` matches the selected town are
  shown as markers, at their `lat`/`lng`

#### Scenario: No filter active
- **WHEN** "All towns" is selected
- **THEN** every location in the data source is shown as a marker
