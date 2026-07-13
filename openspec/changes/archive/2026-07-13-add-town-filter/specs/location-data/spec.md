## ADDED Requirements

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
