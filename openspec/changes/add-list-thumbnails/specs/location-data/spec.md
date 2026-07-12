## MODIFIED Requirements

### Requirement: Data can be viewed as a list
The app SHALL provide a list view, toggleable with the map view, that
shows every location with its area, website, notes, activities (title
and category), and — when a cover photo has been harvested for that
location — a thumbnail of it.

#### Scenario: Switching to list view
- **WHEN** the user switches the view toggle to "List"
- **THEN** all locations from the data source are shown as a readable
  list instead of the map

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
