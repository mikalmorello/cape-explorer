// Municipal (town-government) boundaries are the unit the map's land
// polygons come in - distinct from locations' `area` values, which use
// village names ("West Dennis", "Hyannis"). This maps each
// municipality to its Cape region for fill coloring, and is shared by
// scripts/generate-towns.mjs (tagging fetched boundary features) and
// the map style (colors, island offsets).
export const MUNICIPALITY_TO_REGION = {
  Bourne: 'Upper Cape',
  Sandwich: 'Upper Cape',
  Falmouth: 'Upper Cape',
  Mashpee: 'Upper Cape',

  Barnstable: 'Mid Cape',
  Yarmouth: 'Mid Cape',
  Dennis: 'Mid Cape',

  Brewster: 'Lower Cape',
  Harwich: 'Lower Cape',
  Chatham: 'Lower Cape',
  Orleans: 'Lower Cape',

  Eastham: 'Outer Cape',
  Wellfleet: 'Outer Cape',
  Truro: 'Outer Cape',
  Provincetown: 'Outer Cape',

  Tisbury: "Martha's Vineyard",
  'Oak Bluffs': "Martha's Vineyard",
  Edgartown: "Martha's Vineyard",
  'West Tisbury': "Martha's Vineyard",
  Chilmark: "Martha's Vineyard",
  Aquinnah: "Martha's Vineyard",
  Gosnold: "Martha's Vineyard",

  Nantucket: 'Nantucket',
}

// Fill color per region - shades of pink (owner-provided palette),
// darkest at Upper Cape fading to lightest at Outer Cape. Islands
// reuse two of the shades (they're hidden for now anyway).
export const REGION_COLORS = {
  'Upper Cape': '#64113F',
  'Mid Cape': '#DE4D86',
  'Lower Cape': '#F29CA3',
  'Outer Cape': '#F7CACD',
  "Martha's Vineyard": '#DE4D86',
  Nantucket: '#F29CA3',
}

// Display-only translation (degrees [lng, lat]) pulling the islands
// toward the Cape so the whole composition fits one frame. Applied to
// island town polygons AND to pins whose area is in an island town's
// region - locations.json always stores true coordinates.
export const REGION_DISPLAY_OFFSET = {
  "Martha's Vineyard": [0.05, 0.06],
  Nantucket: [-0.05, 0.12],
}
