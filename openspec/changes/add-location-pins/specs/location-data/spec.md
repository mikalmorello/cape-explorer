## ADDED Requirements

### Requirement: Locations and activities are defined in a static JSON data source
The app SHALL load its location and activity data from a JSON file in
the repo (`src/data/locations.json`). Each location SHALL have `id`,
`name`, `lat`, `lng`, and MAY have `area`, `website`, `notes`, and an
`activities` array. Each activity SHALL have `title`, `category`, and
`status` (`done` or `want-to-do`), and MAY have `notes`.

#### Scenario: Location without activities
- **WHEN** a location has an empty or missing `activities` array
- **THEN** it is still valid and appears on the map as a pin

#### Scenario: Location with multiple activities
- **WHEN** a location has more than one activity
- **THEN** all of its activities are associated with that single
  location (one pin, many activities)
