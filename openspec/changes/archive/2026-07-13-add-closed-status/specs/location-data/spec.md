## ADDED Requirements

### Requirement: Locations may be marked closed
A location MAY have a `closed` boolean field. When `true`, the app
SHALL still show the location on the Map and in the List (preserving
its activity history) but SHALL visibly mark it as closed rather than
presenting it as currently operating.

#### Scenario: Closed location still appears
- **WHEN** a location has `closed: true`
- **THEN** it still appears as a pin on the Map and a card in the List,
  with a visible "Closed" indicator

#### Scenario: Location without the field
- **WHEN** a location has no `closed` field
- **THEN** it is treated as open, unchanged from current behavior
