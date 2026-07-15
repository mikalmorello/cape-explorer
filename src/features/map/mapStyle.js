// MapLibre style for the illustrated Cape map: region-colored town
// fills with white outlines (land comes from the fetched TIGERweb
// town polygons, passed in already island-shifted), simplified inland
// water from the Cape PMTiles extract, no labels/roads/POIs. The
// ocean is deliberately NOT drawn - the canvas stays transparent so
// the container's CSS wave pattern shows behind the landmass.
import { REGION_COLORS } from '../../lib/capeMunicipalities'

export const EMPTY_TOWNS = { type: 'FeatureCollection', features: [] }

// Frame around the Cape + inset islands (post-offset positions).
export const FRAME_BOUNDS = [
  [-70.82, 41.3],
  [-69.86, 42.1],
]
export const PAN_BOUNDS = [
  [-71.1, 41.1],
  [-69.55, 42.3],
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
