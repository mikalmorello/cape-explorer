// Build-time photo harvester: fetches each location's Google Photos
// shared-album page and extracts its image URLs into src/data/photos.json.
// Runs in the deploy workflow before `vite build`. Fail-open: a broken
// album logs a warning and yields no photos; it never fails the build.
import { readFileSync, writeFileSync } from 'node:fs'

const LOCATIONS_PATH = 'src/data/locations.json'
const PHOTOS_PATH = 'src/data/photos.json'

// Shared-album pages embed image URLs in a JS payload as
// ["https://lh3.googleusercontent.com/pw/<id>",width,height,...]
const IMAGE_URL_RE = /"(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]+)"/g

async function fetchAlbumImageUrls(albumUrl) {
  const res = await fetch(albumUrl, {
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0 (cape-explorer photo sync)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const urls = [...new Set([...html.matchAll(IMAGE_URL_RE)].map((m) => m[1]))]
  return urls
}

const { locations } = JSON.parse(readFileSync(LOCATIONS_PATH, 'utf8'))
const withAlbums = locations.filter((loc) => loc.photoAlbum)
const photos = {}
let failures = 0

for (const loc of withAlbums) {
  try {
    const urls = await fetchAlbumImageUrls(loc.photoAlbum)
    if (urls.length === 0) {
      failures++
      console.warn(`WARN ${loc.id}: album fetched but 0 image URLs extracted`)
    } else {
      photos[loc.id] = urls
      console.log(`OK   ${loc.id}: ${urls.length} photos`)
    }
  } catch (err) {
    failures++
    console.warn(`WARN ${loc.id}: fetch failed (${err.message})`)
  }
}

writeFileSync(PHOTOS_PATH, JSON.stringify(photos, null, 2) + '\n')
console.log(
  `Wrote ${PHOTOS_PATH}: ${Object.keys(photos).length}/${withAlbums.length} albums harvested` +
    (failures ? `, ${failures} warnings` : ''),
)
