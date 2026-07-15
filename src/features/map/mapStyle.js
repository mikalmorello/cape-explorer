// MapLibre style for the illustrated Cape map: region-colored town
// fills with white outlines (land comes from the committed Census
// cartographic-boundary town polygons), simplified inland water from
// OSM water polygons pre-clipped to the land union (so it can never
// bleed past the coastline), no labels/roads/POIs. The ocean is
// deliberately NOT drawn - the canvas stays transparent so the
// container's CSS wave pattern shows behind the landmass.
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

export function buildMapStyle(townsGeojson, waterGeojson) {
  return {
    version: 8,
    sources: {
      towns: {
        type: 'geojson',
        data: townsGeojson ?? EMPTY_TOWNS,
        attribution: 'US Census',
      },
      water: {
        type: 'geojson',
        data: waterGeojson ?? EMPTY_TOWNS,
        attribution: '© OpenStreetMap contributors',
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
        source: 'water',
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
