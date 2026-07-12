## ADDED Requirements

### Requirement: Locations and activities are defined in a static JSON data source
The app SHALL load its location and activity data from a JSON file in
the repo (`src/data/locations.json`). Each location SHALL have `id`,
`name`, `lat`, `lng`, and MAY have `area`, `website`, `notes`, and an
`activities` array. Each activity SHALL have `title` and MAY have
`category` and `notes`.

#### Scenario: Location without activities
- **WHEN** a location has an empty or missing `activities` array
- **THEN** it is still valid and appears on the map as a pin

#### Scenario: Location with multiple activities
- **WHEN** a location has more than one activity
- **THEN** all of its activities are associated with that single
  location (one pin, many activities)

### Requirement: Data can be viewed as a list
The app SHALL provide a list view, toggleable with the map view, that
shows every location with its area, website, notes, and activities
(title and category).

#### Scenario: Switching to list view
- **WHEN** the user switches the view toggle to "List"
- **THEN** all locations from the data source are shown as a readable
  list instead of the map

#### Scenario: Switching back to map
- **WHEN** the user switches the toggle back to "Map"
- **THEN** the map with all pins is shown again
