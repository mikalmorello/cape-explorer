// Build-time photo harvester: fetches a cover image URL per location
// into src/data/photos.json ({ locationId: coverUrl }). Prefers
// `coverPhotoLink` (a single-photo share link, useful when the main
// album is gated to invited people) and falls back to `photoAlbum`.
// Full albums are reached via `photoAlbum` itself, not harvested. Runs
// in the deploy workflow before `vite build`. Fail-open: a broken link
// logs a warning and yields no cover; it never fails the build.
import { readFileSync, writeFileSync } from 'node:fs'

const LOCATIONS_PATH = 'src/data/locations.json'
const PHOTOS_PATH = 'src/data/photos.json'

// A shared-album or single-item share page's og:image meta tag
// reflects its actual chosen cover (same image used for link
// previews), unlike the embedded photo array which is upload order.
const OG_IMAGE_RE = /<meta property="og:image" content="([^"]+)"/

// Fallback: these pages embed image URLs in a JS payload as
// ["https://lh3.googleusercontent.com/pw/<id>",width,height,...]
const IMAGE_URL_RE = /"(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]+)"/g

async function fetchCoverUrl(pageUrl) {
  const res = await fetch(pageUrl, {
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
const withLinks = locations.filter((loc) => loc.coverPhotoLink || loc.photoAlbum)
const covers = {}
let failures = 0

for (const loc of withLinks) {
  const source = loc.coverPhotoLink ?? loc.photoAlbum
  const usingFallback = !loc.coverPhotoLink
  try {
    const result = await fetchCoverUrl(source)
    if (!result) {
      failures++
      console.warn(`WARN ${loc.id}: fetched but no cover image found`)
    } else {
      covers[loc.id] = result.url
      console.log(
        `OK   ${loc.id}: cover selected (${result.source}` +
          (usingFallback ? ', via photoAlbum' : ', via coverPhotoLink') +
          ')',
      )
    }
  } catch (err) {
    failures++
    console.warn(`WARN ${loc.id}: fetch failed (${err.message})`)
  }
}

writeFileSync(PHOTOS_PATH, JSON.stringify(covers, null, 2) + '\n')
console.log(
  `Wrote ${PHOTOS_PATH}: ${Object.keys(covers).length}/${withLinks.length} covers harvested` +
    (failures ? `, ${failures} warnings` : ''),
)
