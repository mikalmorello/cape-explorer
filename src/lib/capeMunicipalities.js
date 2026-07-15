// Municipal (town-government) boundaries are the unit the map's land
// polygons come in - distinct from locations' `area` values, which use
// village names ("West Dennis", "Hyannis"). This maps each
// municipality to its Cape region for fill coloring, and is shared by
// scripts/fetch-map-data.mjs (tagging fetched boundary features) and
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

// Fill color per region - palette follows the owner's reference image
// (Upper green, Mid tan, Lower blue, Outer pink) extended for the
// islands.
export const REGION_COLORS = {
  'Upper Cape': '#94bf9a',
  'Mid Cape': '#e9d9a9',
  'Lower Cape': '#94b7dd',
  'Outer Cape': '#e2a3c7',
  "Martha's Vineyard": '#b9a8dc',
  Nantucket: '#e8b48f',
}

// Display-only translation (degrees [lng, lat]) pulling the islands
// toward the Cape so the whole composition fits one frame. Applied to
// island town polygons AND to pins whose area is in an island town's
// region - locations.json always stores true coordinates.
export const REGION_DISPLAY_OFFSET = {
  "Martha's Vineyard": [0.05, 0.06],
  Nantucket: [-0.05, 0.12],
}
