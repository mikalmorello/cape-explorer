## MODIFIED Requirements

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
