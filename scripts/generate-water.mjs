// Manual one-shot: fetches real OSM inland-water polygons (ponds, lakes,
// the Cape Cod Canal, etc.) for the Cape mainland, then intersects each
// one against the union of committed town land polygons. The output
// (src/data/capeWater.json) can therefore NEVER extend past real land -
// it's an exact geometric intersection, not a zoom/kind heuristic. This
// replaces the earlier pmtiles vector-tile approach, which pulled in
// whole tiles (and their full, unclipped water features) and let large
// coastal water bodies bleed past the coastline into the ocean.
import { writeFileSync, readFileSync } from 'node:fs'

const TOWNS_PATH = 'src/data/capeTowns.json'
const WATER_PATH = 'src/data/capeWater.json'

function bboxOf(features) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  const visit = (coords, depth) => {
    if (depth === 0) {
      const [x, y] = coords
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    } else {
      for (const c of coords) visit(c, depth - 1)
    }
  }
  for (const f of features) {
    const depth = f.geometry.type === 'Polygon' ? 2 : 3
    visit(f.geometry.coordinates, depth)
  }
  return [minX, minY, maxX, maxY]
}

async function fetchOsmWater(bbox) {
  const [minX, minY, maxX, maxY] = bbox
  // Overpass bbox order is south,west,north,east.
  const query = `[out:json][timeout:90];(way["natural"="water"](${minY},${minX},${maxY},${maxX});relation["natural"="water"](${minY},${minX},${maxY},${maxX}););out geom;`
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  if (!res.ok) throw new Error(`Overpass request failed: HTTP ${res.status}`)
  return res.json()
}

async function main() {
  const { union } = await import('@turf/union')
  const { intersect } = await import('@turf/intersect')
  const { featureCollection } = await import('@turf/helpers')
  const osmtogeojson = (await import('osmtogeojson')).default

  const towns = JSON.parse(readFileSync(TOWNS_PATH, 'utf8'))
  // Mainland Cape only for now, matching the islands-deferred state of
  // the map itself - extend to all regions when islands come back.
  const capeTowns = towns.features.filter((f) => f.properties.region.endsWith('Cape'))
  const land = union(featureCollection(capeTowns))
  if (!land) throw new Error('Could not union Cape town polygons')

  const bbox = bboxOf(capeTowns)
  console.log(`Querying Overpass for natural=water in bbox ${bbox.join(',')}...`)
  const osmJson = await fetchOsmWater(bbox)
  const raw = osmtogeojson(osmJson)
  const waterPolys = raw.features.filter(
    (f) => f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'),
  )
  console.log(`Fetched ${waterPolys.length} candidate water polygons; intersecting with land...`)

  const clipped = []
  for (const water of waterPolys) {
    let result
    try {
      result = intersect(featureCollection([water, land]))
    } catch {
      continue // degenerate/self-intersecting OSM geometry - skip rather than fail the whole run
    }
    if (result) {
      clipped.push({
        type: 'Feature',
        properties: { name: water.properties?.name ?? null },
        geometry: result.geometry,
      })
    }
  }
  if (clipped.length === 0) throw new Error('No inland water survived intersection with land - check the query/bbox')

  console.log(`${clipped.length} water polygons clipped to land.`)
  writeFileSync(WATER_PATH, JSON.stringify({ type: 'FeatureCollection', features: clipped }))
  console.log(`Wrote ${WATER_PATH}`)
}

await main()
