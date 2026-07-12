## ADDED Requirements

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
