// MapLibre style for the illustrated Cape map: region-colored town
// fills with white outlines and name labels (land comes from the
// committed Census cartographic-boundary town polygons), no
// roads/POIs. The ocean is deliberately NOT drawn - the canvas stays
// transparent so the container's CSS wave pattern shows behind the
// landmass.
//
// Inland water is removed for now (src/data/capeWater.json and the
// generate-water pipeline that produces it still exist - re-enabling
// is a matter of adding back a `water` geojson source and an
// `inland-water` fill layer using it, same as before).
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
  return {
    version: 8,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      towns: {
        type: 'geojson',
        data: townsGeojson ?? EMPTY_TOWNS,
        attribution: 'US Census',
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
        id: 'town-outline',
        type: 'line',
        source: 'towns',
        paint: {
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 7, 1, 12, 2.5],
        },
      },
      {
        id: 'town-label',
        type: 'symbol',
        source: 'towns',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 7, 10, 12, 15],
        },
        paint: {
          'text-color': '#2b2b2b',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.2,
        },
      },
    ],
  }
}
