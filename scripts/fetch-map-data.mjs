// Deploy-time map data fetcher. Produces two gitignored artifacts,
// cached across deploys via actions/cache (run locally with
// `npm run fetch-tiles` - needs open network, so typically CI-only):
//
//   public/data/cape-towns.json - town boundary polygons for the Cape
//     + islands from US Census TIGERweb, simplified server-side, each
//     feature tagged { name, region } via capeMunicipalities.js. This
//     is the land the map renders.
//   public/tiles/cape.pmtiles - Protomaps vector-tile extract of the
//     Cape region (inland water detail), cut with `pmtiles extract`
//     against a region polygon derived from the Cape town boundaries.
//
// Unlike photo harvesting, this FAILS the build when data can't be
// produced and isn't already present: the map is core to the app.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, chmodSync, rmSync } from 'node:fs'
import { MUNICIPALITY_TO_REGION } from '../src/lib/capeMunicipalities.js'

const TOWNS_PATH = 'public/data/cape-towns.json'
const TILES_PATH = 'public/tiles/cape.pmtiles'
const PMTILES_VERSION = '1.28.0'

const TIGERWEB_SERVICE =
  'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer'
// Barnstable (Cape), Dukes (Vineyard + Gosnold), Nantucket
const COUNTY_FIPS = ['001', '007', '019']

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

async function fetchTowns() {
  const meta = await fetchJson(`${TIGERWEB_SERVICE}?f=json`)
  const layer = meta.layers.find((l) => /county subdivisions/i.test(l.name))
  if (!layer) throw new Error('County Subdivisions layer not found in TIGERweb service')

  const where = `STATE='25' AND COUNTY IN (${COUNTY_FIPS.map((c) => `'${c}'`).join(',')})`
  const params = new URLSearchParams({
    where,
    outFields: 'BASENAME,NAME,COUNTY',
    returnGeometry: 'true',
    geometryPrecision: '5',
    // ~50m generalization: "simplified" is a design requirement, and
    // it keeps the committed-to-cache file small.
    maxAllowableOffset: '0.0005',
    outSR: '4326',
    f: 'geojson',
  })
  const gj = await fetchJson(`${TIGERWEB_SERVICE}/${layer.id}/query?${params}`)
  if (!gj.features?.length) throw new Error('TIGERweb query returned no features')

  // Census names carry legal-form suffixes some MA municipalities
  // have ("Barnstable Town city" - Barnstable is legally a city named
  // "Town"). Try raw names first, then with town/city suffixes
  // stripped, until one matches our municipality list.
  const normalize = (f) => {
    const raw = [f.properties.BASENAME, f.properties.NAME].filter(Boolean)
    const candidates = raw.flatMap((n) => {
      const out = [n]
      let s = n
      for (let i = 0; i < 2; i++) {
        s = s.replace(/ (town|city)$/i, '')
        out.push(s)
      }
      return out
    })
    return candidates.find((n) => MUNICIPALITY_TO_REGION[n])
  }

  const features = gj.features
    .map((f) => {
      const name = normalize(f)
      return name
        ? {
            type: 'Feature',
            properties: { name, region: MUNICIPALITY_TO_REGION[name] },
            geometry: f.geometry,
          }
        : null
    })
    .filter(Boolean)

  const missing = Object.keys(MUNICIPALITY_TO_REGION).filter(
    (name) => !features.some((f) => f.properties.name === name),
  )
  if (missing.length) throw new Error(`Towns missing from TIGERweb result: ${missing.join(', ')}`)

  mkdirSync('public/data', { recursive: true })
  writeFileSync(TOWNS_PATH, JSON.stringify({ type: 'FeatureCollection', features }))
  console.log(`Wrote ${TOWNS_PATH}: ${features.length} municipalities`)
  return features
}

async function capeRegionPolygon(townFeatures) {
  const { default: buffer } = await import('@turf/buffer')
  const { union } = await import('@turf/union')
  const { featureCollection } = await import('@turf/helpers')

  // Cape mainland towns only: the extract intentionally excludes the
  // islands (their inland water would render at un-shifted positions
  // under the inset display offset).
  const capeOnly = townFeatures.filter((f) => f.properties.region.endsWith('Cape'))
  const buffered = capeOnly.map((f) => buffer(f, 1, { units: 'kilometers' }))
  const merged = union(featureCollection(buffered))
  return merged
}

async function fetchTiles(townFeatures) {
  const region = await capeRegionPolygon(townFeatures)
  writeFileSync('/tmp/cape-region.geojson', JSON.stringify(region))

  const bin = '/tmp/pmtiles'
  if (!existsSync(bin)) {
    const url = `https://github.com/protomaps/go-pmtiles/releases/download/v${PMTILES_VERSION}/go-pmtiles_${PMTILES_VERSION}_Linux_x86_64.tar.gz`
    execFileSync('bash', ['-c', `curl -sSfL "${url}" | tar -xz -C /tmp pmtiles`])
    chmodSync(bin, 0o755)
  }

  const builds = await fetchJson('https://build.protomaps.com/builds.json')
  const keys = builds
    .map((b) => (typeof b === 'string' ? b : b.key))
    .filter((k) => k?.endsWith('.pmtiles'))
    .sort()
  if (!keys.length) throw new Error('No Protomaps builds found in builds.json')
  const latest = keys[keys.length - 1]

  mkdirSync('public/tiles', { recursive: true })
  console.log(`Extracting Cape region from ${latest} (maxzoom 13)...`)
  execFileSync(bin, [
    'extract',
    `https://build.protomaps.com/${latest}`,
    TILES_PATH,
    '--region=/tmp/cape-region.geojson',
    '--maxzoom=13',
  ])
  rmSync('/tmp/cape-region.geojson', { force: true })
  console.log(`Wrote ${TILES_PATH}`)
}

if (existsSync(TOWNS_PATH) && existsSync(TILES_PATH)) {
  console.log('Map data already present (cache hit) - skipping fetch.')
} else {
  const towns = await fetchTowns()
  await fetchTiles(towns)
}
