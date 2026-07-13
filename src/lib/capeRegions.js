// Maps a location's `area` (town) to its traditional Cape Cod region.
// Region is fully derived from the town, so it isn't stored as its own
// field on locations - one lookup here instead of 28+ redundant values
// that could drift.
const TOWN_TO_REGION = {
  Bourne: 'Upper Cape',
  Falmouth: 'Upper Cape',
  Mashpee: 'Upper Cape',
  Sandwich: 'Upper Cape',

  Barnstable: 'Mid Cape',
  Hyannis: 'Mid Cape',
  'West Barnstable': 'Mid Cape',
  Yarmouth: 'Mid Cape',
  'South Yarmouth': 'Mid Cape',
  'West Yarmouth': 'Mid Cape',
  'Yarmouth Port': 'Mid Cape',
  Dennis: 'Mid Cape',
  'South Dennis': 'Mid Cape',
  'West Dennis': 'Mid Cape',
  'Dennis Port': 'Mid Cape',
  'East Dennis': 'Mid Cape',

  Brewster: 'Lower Cape',
  Chatham: 'Lower Cape',
  Harwich: 'Lower Cape',
  Orleans: 'Lower Cape',

  Eastham: 'Outer Cape',
  Wellfleet: 'Outer Cape',
  Truro: 'Outer Cape',
  'North Truro': 'Outer Cape',
  Provincetown: 'Outer Cape',

  Nantucket: 'Nantucket',
  'Oak Bluffs': "Martha's Vineyard",
  Edgartown: "Martha's Vineyard",
  Tisbury: "Martha's Vineyard",
  'Vineyard Haven': "Martha's Vineyard",
  Chilmark: "Martha's Vineyard",
  'West Tisbury': "Martha's Vineyard",
  Aquinnah: "Martha's Vineyard",
}

export const REGION_ORDER = [
  'Upper Cape',
  'Mid Cape',
  'Lower Cape',
  'Outer Cape',
  'Nantucket',
  "Martha's Vineyard",
  'Other',
]

export function regionForArea(area) {
  return TOWN_TO_REGION[area] ?? 'Other'
}

// Distinct `area` values present in the data, sorted alphabetically -
// the options for the town filter.
export function distinctAreas(locations) {
  return [...new Set(locations.map((loc) => loc.area).filter(Boolean))].sort()
}
