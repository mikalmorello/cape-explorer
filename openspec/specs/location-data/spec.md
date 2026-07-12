# location-data Specification

## Purpose
Defines the shape of the app's location and activity data — the single
source of truth the map and list views render from.
## Requirements
### Requirement: Locations and activities are defined in a static JSON data source
The app SHALL load its location and activity data from a JSON file in
the repo (`src/data/locations.json`). Each location SHALL have `id`,
`name`, `type`, `lat`, `lng`, and MAY have `area`, `dogFriendly`,
`coordsVerified`, `website`, `notes`, and an `activities` array. Each
activity SHALL have `title` and MAY have `category` and `notes`.

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

### Requirement: Locations have a primary type
Each location SHALL have a `type` field (a lowercase string, e.g.
`beach`, `food`, `brewery`, `hike`, `entertainment`, `shopping`,
`attraction`, `park`, `fishing`, `winery`, `watersports`) identifying
its primary category, for use in future map icon styling and
filtering.

#### Scenario: Every location has a type
- **WHEN** the location data is loaded
- **THEN** every location entry has a non-empty `type` value

### Requirement: Locations may record dog-friendliness
A location MAY have a `dogFriendly` boolean field. It SHALL be omitted
rather than guessed when the policy is not confidently known, and any
seasonal or conditional rules SHALL be captured in the location's
`notes`.

#### Scenario: Verified dog-friendly location
- **WHEN** a location's dog policy has been confirmed via research
- **THEN** `dogFriendly` is set to `true` or `false` and any
  conditions (leash rules, seasonal restrictions) appear in `notes`

#### Scenario: Unverified dog policy
- **WHEN** a location's dog policy has not been verified
- **THEN** the `dogFriendly` field is omitted entirely rather than set
  to a guessed value

### Requirement: Locations may link a Google Photos shared album
A location MAY have a `photoAlbum` field containing a Google Photos
shared-album URL (e.g. `https://photos.app.goo.gl/...`). The app
SHALL treat locations without the field as simply having no photos.

#### Scenario: Location with a linked album
- **WHEN** a location has a `photoAlbum` URL
- **THEN** its photos are harvested at deploy time and shown in the
  app's photo features

#### Scenario: Location without a linked album
- **WHEN** a location has no `photoAlbum` field
- **THEN** it remains fully valid and appears everywhere else in the
  app as before

