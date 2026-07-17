// One-time (re)generator for src/data/capeTowns.json - run by the
// generate-towns workflow (manual dispatch), NOT at every deploy.
//
// Uses the Census *cartographic boundary* series (cb_*_cousub_500k):
// town polygons CLIPPED TO THE SHORELINE and pre-generalized for
// mapping. The TIGERweb legal boundaries used previously extend into
// coastal water (MA towns legally reach into the sea), which rendered
// as blocky made-up-looking shapes instead of the real Cape Cod
// outline. The result is committed so the app bundles real geometry
// with no runtime/deploy dependency on Census.
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import area from '@turf/area'
import pointOnFeature from '@turf/point-on-feature'
import { polygon } from '@turf/helpers'
import { MUNICIPALITY_TO_REGION } from '../src/lib/capeMunicipalities.js'

const VINTAGE = '2023'
const URL = `https://www2.census.gov/geo/tiger/GENZ${VINTAGE}/shp/cb_${VINTAGE}_25_cousub_500k.zip`
const OUT_PATH = 'src/data/capeTowns.json'
const COUNTY_FIPS = new Set(['001', '007', '019'])

// A town's polygon can be a MultiPolygon (mainland plus small offshore
// fragments, e.g. Barnstable's Sandy Neck) - a symbol layer labels
// every part of a MultiPolygon feature, which repeats the name. So we
// precompute one guaranteed-inside point on the LARGEST part here and
// use that (not the polygon geometry) for map labels.
function labelPointOf(geometry) {
  const parts = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates]
  let largest = parts[0]
  let largestArea = -1
  for (const coords of parts) {
    const a = area(polygon(coords))
    if (a > largestArea) {
      largestArea = a
      largest = coords
    }
  }
  return pointOnFeature(polygon(largest)).geometry.coordinates
}

const normalize = (raw) => {
  const candidates = [raw]
  let s = raw
  for (let i = 0; i < 2; i++) {
    s = s.replace(/ (town|city)$/i, '')
    candidates.push(s)
  }
  return candidates.find((n) => MUNICIPALITY_TO_REGION[n])
}

const dir = mkdtempSync(join(tmpdir(), 'cousub-'))
execFileSync('bash', ['-c', `curl -sSfL "${URL}" -o "${dir}/cousub.zip" && unzip -q -o "${dir}/cousub.zip" -d "${dir}"`])

const shapefile = await import('shapefile')
const source = await shapefile.open(
  `${dir}/cb_${VINTAGE}_25_cousub_500k.shp`,
  `${dir}/cb_${VINTAGE}_25_cousub_500k.dbf`,
)

const features = []
for (;;) {
  const { done, value } = await source.read()
  if (done) break
  const p = value.properties
  if (!COUNTY_FIPS.has(p.COUNTYFP)) continue
  const name = normalize(p.NAME)
  if (!name) continue
  features.push({
    type: 'Feature',
    properties: {
      name,
      region: MUNICIPALITY_TO_REGION[name],
      labelPoint: labelPointOf(value.geometry),
    },
    geometry: value.geometry,
  })
}
rmSync(dir, { recursive: true, force: true })

const missing = Object.keys(MUNICIPALITY_TO_REGION).filter(
  (name) => !features.some((f) => f.properties.name === name),
)
if (missing.length) throw new Error(`Missing municipalities: ${missing.join(', ')}`)

// Round coordinates to 5 decimals (~1m) to keep the committed file small.
const round = (c) =>
  typeof c === 'number' ? Math.round(c * 1e5) / 1e5 : c.map(round)
for (const f of features) {
  f.geometry.coordinates = round(f.geometry.coordinates)
  f.properties.labelPoint = round(f.properties.labelPoint)
}

writeFileSync(OUT_PATH, JSON.stringify({ type: 'FeatureCollection', features }))
console.log(`Wrote ${OUT_PATH}: ${features.length} shoreline-clipped municipalities`)
