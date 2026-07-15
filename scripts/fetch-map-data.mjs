// Deploy-time tile fetcher. Produces one gitignored artifact, cached
// across deploys via actions/cache (run locally with `npm run
// fetch-tiles` - needs open network, so typically CI-only):
//
//   public/tiles/cape.pmtiles - Protomaps vector-tile extract of the
//     Cape region (inland water detail), cut with `pmtiles extract`
//     against a region polygon derived from the committed town
//     boundaries in src/data/capeTowns.json.
//
// Town boundaries themselves are committed data (regenerated on
// demand by the generate-towns workflow), so the land always renders
// regardless of this fetch. Still: a missing tile file with a failed
// fetch FAILS the build - inland water is part of the design.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, chmodSync, rmSync, readFileSync } from 'node:fs'

const TOWNS_PATH = 'src/data/capeTowns.json'
const TILES_PATH = 'public/tiles/cape.pmtiles'
const PMTILES_VERSION = '1.28.0'

async function capeRegionPolygon() {
  const { default: buffer } = await import('@turf/buffer')
  const { union } = await import('@turf/union')
  const { featureCollection } = await import('@turf/helpers')

  const towns = JSON.parse(readFileSync(TOWNS_PATH, 'utf8'))
  // Cape mainland towns only: the extract intentionally excludes the
  // islands (their inland water would render at un-shifted positions
  // under the inset display offset).
  const capeOnly = towns.features.filter((f) => f.properties.region.endsWith('Cape'))
  const buffered = capeOnly.map((f) => buffer(f, 1, { units: 'kilometers' }))
  return union(featureCollection(buffered))
}

async function fetchTiles() {
  const region = await capeRegionPolygon()
  writeFileSync('/tmp/cape-region.geojson', JSON.stringify(region))

  const bin = '/tmp/pmtiles'
  if (!existsSync(bin)) {
    const url = `https://github.com/protomaps/go-pmtiles/releases/download/v${PMTILES_VERSION}/go-pmtiles_${PMTILES_VERSION}_Linux_x86_64.tar.gz`
    execFileSync('bash', ['-c', `curl -sSfL "${url}" | tar -xz -C /tmp pmtiles`])
    chmodSync(bin, 0o755)
  }

  // Builds are daily files named YYYYMMDD.pmtiles with no stable index
  // endpoint - probe from today backwards until one exists.
  let latest = null
  for (let daysBack = 0; daysBack <= 10 && !latest; daysBack++) {
    const d = new Date(Date.now() - daysBack * 86400000)
    const key = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}.pmtiles`
    const res = await fetch(`https://build.protomaps.com/${key}`, {
      headers: { Range: 'bytes=0-0' },
    })
    if (res.ok || res.status === 206) latest = key
    res.body?.cancel?.()
  }
  if (!latest) throw new Error('No Protomaps daily build found in the last 10 days')

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

if (existsSync(TILES_PATH)) {
  console.log('Tile extract already present (cache hit) - skipping fetch.')
} else {
  await fetchTiles()
}
