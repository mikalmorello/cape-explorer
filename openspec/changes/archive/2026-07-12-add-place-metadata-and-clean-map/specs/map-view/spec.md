## ADDED Requirements

### Requirement: Map hides default points-of-interest and transit layers
The map SHALL suppress Google's default points-of-interest icons/labels
and transit markers, showing only the app's own location pins plus
base map features (roads, water, town/place labels).

#### Scenario: Map renders without competing default icons
- **WHEN** the map loads
- **THEN** no default Google POI icons (restaurants, shops, etc.) or
  transit markers are visible
- **AND** the app's own location pins remain visible
