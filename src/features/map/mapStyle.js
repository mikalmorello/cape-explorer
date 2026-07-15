// MapLibre style for the illustrated Cape map: region-colored town
// fills with white outlines (land comes from the fetched TIGERweb
// town polygons, passed in already island-shifted), simplified inland
// water from the Cape PMTiles extract, no labels/roads/POIs. The
// ocean is deliberately NOT drawn - the canvas stays transparent so
// the container's CSS wave pattern shows behind the landmass.
import { REGION_COLORS } from '../../lib/capeMunicipalities'

export const EMPTY_TOWNS = { type: 'FeatureCollection', features: [] }

// Frame around the Cape (islands hidden for now - widen these again
// when Martha's Vineyard/Nantucket return).
export const FRAME_BOUNDS = [
  [-70.72, 41.5],
  [-69.87, 42.1],
]
export const PAN_BOUNDS = [
  [-70.85, 41.4],
  [-69.75, 42.18],
]

const regionColorMatch = [
  'match',
  ['get', 'region'],
  ...Object.entries(REGION_COLORS).flat(),
  '#cccccc',
]

export function buildMapStyle(townsGeojson) {
  const base = import.meta.env.BASE_URL
  return {
    version: 8,
    sources: {
      towns: {
        type: 'geojson',
        data: townsGeojson ?? EMPTY_TOWNS,
        attribution: 'US Census TIGER',
      },
      cape: {
        type: 'vector',
        url: `pmtiles://${window.location.origin}${base}tiles/cape.pmtiles`,
        attribution: '© OpenStreetMap contributors, Protomaps',
      },
    },
    layers: [
      {
        id: 'town-fill',
        type: 'fill',
        source: 'towns',
        paint: { 'fill-color': regionColorMatch },
      },
      {
        id: 'inland-water',
        type: 'fill',
        source: 'cape',
        'source-layer': 'water',
        // Tile extract starts at z10 (see fetch-map-data.mjs), so
        // ponds/rivers fade in once zoomed into a town - the overview
        // stays clean flat color.
        minzoom: 10,
        filter: ['!=', ['get', 'kind'], 'ocean'],
        paint: { 'fill-color': '#a9d7e8' },
      },
      {
        id: 'town-outline',
        type: 'line',
        source: 'towns',
        paint: {
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 7, 1, 12, 2.5],
        },
      },
    ],
  }
}
