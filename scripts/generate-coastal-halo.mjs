// One-shot generator for src/data/capeCoastalHalo.json - a thin ring
// of "shallow water" hugging the real coastline, for a lighter-blue
// halo effect between the land and the flat ocean background. Reads
// only committed local data (no network needed), so this can be run
// anytime capeTowns.json changes.
import { readFileSync, writeFileSync } from 'node:fs'

const TOWNS_PATH = 'src/data/capeTowns.json'
const OUT_PATH = 'src/data/capeCoastalHalo.json'
const HALO_KM = 2.5

async function main() {
  const { union } = await import('@turf/union')
  const { default: buffer } = await import('@turf/buffer')
  const { default: difference } = await import('@turf/difference')
  const { featureCollection } = await import('@turf/helpers')

  const towns = JSON.parse(readFileSync(TOWNS_PATH, 'utf8'))
  // Mainland Cape only, matching what's currently rendered (islands hidden).
  const capeTowns = towns.features.filter((f) => f.properties.region.endsWith('Cape'))
  const land = union(featureCollection(capeTowns))
  if (!land) throw new Error('Could not union Cape town polygons')

  const outer = buffer(land, HALO_KM, { units: 'kilometers' })
  const halo = difference(featureCollection([outer, land]))
  if (!halo) throw new Error('Halo difference produced no geometry')

  const round = (c) => (typeof c === 'number' ? Math.round(c * 1e5) / 1e5 : c.map(round))
  halo.geometry.coordinates = round(halo.geometry.coordinates)

  const out = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: halo.geometry }] }
  writeFileSync(OUT_PATH, JSON.stringify(out))
  console.log(`Wrote ${OUT_PATH} (${HALO_KM}km coastal halo)`)
}

await main()
