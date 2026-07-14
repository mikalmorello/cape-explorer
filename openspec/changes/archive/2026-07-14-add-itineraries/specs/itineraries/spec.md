## ADDED Requirements

### Requirement: Itineraries group existing locations into a manually-curated plan
The app SHALL support a top-level `itineraries` array in the location
data source, sibling to `locations`. Each itinerary SHALL have `id`,
`name`, and a `stops` array of `{ locationId, note }` referencing
existing location `id`s in visit order; `notes` on the itinerary
itself is optional. Itineraries SHALL only be added from the owner's
own described experience — never auto-generated or suggested by
proximity, type, or any other heuristic.

#### Scenario: Itinerary references existing locations
- **WHEN** an itinerary's `stops` list a sequence of `locationId`s
- **THEN** each stop's displayed details (name, area, activities,
  cover) are looked up live from the referenced location, not
  duplicated into the itinerary

#### Scenario: No itineraries defined
- **WHEN** the `itineraries` array is empty or absent
- **THEN** the rest of the app is unaffected and the Itineraries view
  shows a friendly explanation instead of an empty list

### Requirement: Itineraries view shows curated day plans
The app SHALL provide an Itineraries view, toggleable alongside
Map/List/Photos, showing one card per itinerary with its stops
rendered in stored order, each stop showing the location's name, area,
the stop's `note`, and the location's activities/cover when available.

#### Scenario: Browsing itineraries
- **WHEN** the user opens the Itineraries view and itineraries exist
- **THEN** each itinerary appears as a card listing its stops in order

#### Scenario: Stop shows live location details
- **WHEN** a stop's referenced location has activities or a harvested
  cover photo
- **THEN** the stop displays that location's current activities/cover,
  not a stale copy
