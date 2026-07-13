// Build-time photo harvester: fetches a cover image URL per location
// into src/data/photos.json ({ locationId: coverUrl }). Prefers
// `coverPhotoLink` (a single-photo share link, useful when the main
// album is gated to invited people) and falls back to `photoAlbum`.
// Full albums are reached via `photoAlbum` itself, not harvested. Runs
// in the deploy workflow before `vite build`. Fail-open: a broken link
// logs a warning and keeps the last-known-good cover (or yields none,
// if there's never been one) rather than failing the build.
//
// src/data/photos-cache.json ({ locationId: { sourceUrl, coverUrl } })
// persists across deploys via actions/cache. A location whose source
// URL hasn't changed since the last successful harvest is skipped
// entirely - no network request - which is what keeps most deploys
// from re-fetching everything.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const LOCATIONS_PATH = 'src/data/locations.json'
const PHOTOS_PATH = 'src/data/photos.json'
const CACHE_PATH = 'src/data/photos-cache.json'

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

function loadCache() {
  if (!existsSync(CACHE_PATH)) return {}
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
  } catch {
    return {}
  }
}

const { locations } = JSON.parse(readFileSync(LOCATIONS_PATH, 'utf8'))
const withLinks = locations.filter((loc) => loc.coverPhotoLink || loc.photoAlbum)
const cache = loadCache()
const covers = {}
const failures = []
let skipped = 0

for (const loc of withLinks) {
  const source = loc.coverPhotoLink ?? loc.photoAlbum
  const usingFallback = !loc.coverPhotoLink
  const cached = cache[loc.id]

  if (cached && cached.sourceUrl === source) {
    covers[loc.id] = cached.coverUrl
    skipped++
    console.log(`SKIP ${loc.id}: unchanged source, reusing cached cover`)
    continue
  }

  try {
    const result = await fetchCoverUrl(source)
    if (!result) {
      failures.push({ id: loc.id, reason: 'no cover image found' })
      console.warn(`WARN ${loc.id}: fetched but no cover image found`)
      if (cached) covers[loc.id] = cached.coverUrl
    } else {
      covers[loc.id] = result.url
      cache[loc.id] = { sourceUrl: source, coverUrl: result.url }
      console.log(
        `OK   ${loc.id}: cover selected (${result.source}` +
          (usingFallback ? ', via photoAlbum' : ', via coverPhotoLink') +
          ')',
      )
    }
  } catch (err) {
    failures.push({ id: loc.id, reason: err.message })
    console.warn(`WARN ${loc.id}: fetch failed (${err.message})`)
    if (cached) {
      covers[loc.id] = cached.coverUrl
      console.log(`     ${loc.id}: keeping last-known-good cover from cache`)
    }
  }
}

writeFileSync(PHOTOS_PATH, JSON.stringify(covers, null, 2) + '\n')
writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n')

const fetched = withLinks.length - skipped
const summaryLines = [
  '## Photo harvest',
  '',
  `${Object.keys(covers).length}/${withLinks.length} locations have a cover ` +
    `(${skipped} skipped unchanged, ${fetched - failures.length}/${fetched} fetches succeeded).`,
]
if (failures.length) {
  summaryLines.push(
    '',
    '### Failed fetches',
    ...failures.map((f) => `- ⚠️ \`${f.id}\`: ${f.reason}`),
  )
}
console.log(summaryLines.join('\n'))
if (process.env.GITHUB_STEP_SUMMARY) {
  writeFileSync(process.env.GITHUB_STEP_SUMMARY, summaryLines.join('\n') + '\n', { flag: 'a' })
}
