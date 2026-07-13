# location-data Specification

## Purpose
Defines the shape of the app's location and activity data — the single
source of truth the map and list views render from.
## Requirements
### Requirement: Locations and activities are defined in a static JSON data source
The app SHALL load its location and activity data from a JSON file in
the repo (`src/data/locations.json`). Each location SHALL have `id`,
`name`, `type`, `lat`, `lng`, and MAY have `area`, `address`,
`dogFriendly`, `coordsVerified`, `website`, `notes`, and an
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
groups locations under region headings (Upper Cape, Mid Cape, Lower
Cape, Outer Cape, Nantucket, Martha's Vineyard, in that geographic
order; an "Other" group for any town not yet mapped to a region), and
within each group shows every location with its area, website, notes,
activities (title and category), and cover thumbnail when available.

#### Scenario: Switching to list view
- **WHEN** the user switches the view toggle to "List"
- **THEN** locations are shown grouped under region headings instead
  of the map

#### Scenario: Switching back to map
- **WHEN** the user switches the toggle back to "Map"
- **THEN** the map with all pins is shown again

#### Scenario: Location with a cover photo
- **WHEN** a location has a harvested cover photo
- **THEN** its list card shows a thumbnail of that cover

#### Scenario: Location without a cover photo
- **WHEN** a location has no cover photo
- **THEN** its list card renders without a thumbnail, unchanged
  otherwise

#### Scenario: Town not yet mapped to a region
- **WHEN** a location's `area` isn't in the town-to-region lookup
- **THEN** it appears under an "Other" group rather than being dropped
  or causing an error

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

### Requirement: Locations may record a full street address
A location MAY have an `address` field containing its full street
address as free text. The app SHALL treat `address` as informational
only — filtering and region-grouping continue to use `area`, not
`address`.

#### Scenario: Location with an address
- **WHEN** a location has an `address` field
- **THEN** it is shown alongside the location's other details (website,
  notes) in the map popup and list card

#### Scenario: Location without an address
- **WHEN** a location has no `address` field
- **THEN** it remains fully valid and simply shows no address line

### Requirement: Locations can be filtered down to a single town
The app SHALL provide a town filter, its options derived from the
distinct `area` values present in the location data (sorted
alphabetically) plus an "All towns" default, shared by the Map and
List views so both reflect the same active filter.

#### Scenario: Filtering to one town
- **WHEN** the user selects a specific town from the filter
- **THEN** only locations whose `area` matches that town are shown, in
  both the Map and List views

#### Scenario: Resetting to all towns
- **WHEN** the user selects "All towns"
- **THEN** every location is shown again, and the List view resumes
  its normal region grouping

#### Scenario: Single town selected in List view
- **WHEN** a specific town is selected and the user is on the List view
- **THEN** the matching cards are shown without a region heading, since
  they all share one town
