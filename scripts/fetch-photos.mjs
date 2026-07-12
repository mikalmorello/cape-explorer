// Build-time photo harvester: fetches each location's Google Photos
// shared-album page and extracts the album's actual designated cover
// photo (via og:image, falling back to the first embedded photo if
// that's missing) into src/data/photos.json ({ locationId: coverUrl }).
// Full albums are reached via the album link itself, not harvested.
// Runs in the deploy workflow before `vite build`. Fail-open: a broken
// album logs a warning and yields no cover; it never fails the build.
import { readFileSync, writeFileSync } from 'node:fs'

const LOCATIONS_PATH = 'src/data/locations.json'
const PHOTOS_PATH = 'src/data/photos.json'

// The shared-album page's og:image meta tag reflects the album's
// actual chosen cover (same image used for link previews), unlike the
// embedded photo array which is just upload/date order.
const OG_IMAGE_RE = /<meta property="og:image" content="([^"]+)"/

// Fallback: shared-album pages embed image URLs in a JS payload as
// ["https://lh3.googleusercontent.com/pw/<id>",width,height,...]
const IMAGE_URL_RE = /"(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]+)"/g

async function fetchAlbumCoverUrl(albumUrl) {
  const res = await fetch(albumUrl, {
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0 (cape-explorer photo sync)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()

  const ogMatch = html.match(OG_IMAGE_RE)
  if (ogMatch) return { url: ogMatch[1], source: 'og:image' }

  const fallback = html.match(IMAGE_URL_RE)
  if (fallback) return { url: fallback[0].slice(1, -1), source: 'first-photo fallback' }

  return null
}

const { locations } = JSON.parse(readFileSync(LOCATIONS_PATH, 'utf8'))
const withAlbums = locations.filter((loc) => loc.photoAlbum)
const covers = {}
let failures = 0

for (const loc of withAlbums) {
  try {
    const result = await fetchAlbumCoverUrl(loc.photoAlbum)
    if (!result) {
      failures++
      console.warn(`WARN ${loc.id}: album fetched but no cover image found`)
    } else {
      covers[loc.id] = result.url
      console.log(`OK   ${loc.id}: cover selected (${result.source})`)
    }
  } catch (err) {
    failures++
    console.warn(`WARN ${loc.id}: fetch failed (${err.message})`)
  }
}

writeFileSync(PHOTOS_PATH, JSON.stringify(covers, null, 2) + '\n')
console.log(
  `Wrote ${PHOTOS_PATH}: ${Object.keys(covers).length}/${withAlbums.length} covers harvested` +
    (failures ? `, ${failures} warnings` : ''),
)
