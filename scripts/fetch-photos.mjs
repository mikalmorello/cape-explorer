// Build-time photo harvester: fetches each location's Google Photos
// shared-album page and extracts one cover image URL per album into
// src/data/photos.json ({ locationId: coverUrl }). Full albums are
// reached via the album link itself, not harvested. Runs in the deploy
// workflow before `vite build`. Fail-open: a broken album logs a
// warning and yields no cover; it never fails the build.
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
  return [...new Set([...html.matchAll(IMAGE_URL_RE)].map((m) => m[1]))]
}

const { locations } = JSON.parse(readFileSync(LOCATIONS_PATH, 'utf8'))
const withAlbums = locations.filter((loc) => loc.photoAlbum)
const covers = {}
let failures = 0

for (const loc of withAlbums) {
  try {
    const urls = await fetchAlbumImageUrls(loc.photoAlbum)
    if (urls.length === 0) {
      failures++
      console.warn(`WARN ${loc.id}: album fetched but 0 image URLs extracted`)
    } else {
      covers[loc.id] = urls[0]
      console.log(`OK   ${loc.id}: cover selected (${urls.length} photos in album)`)
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
