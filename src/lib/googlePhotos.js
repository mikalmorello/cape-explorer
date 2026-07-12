// Google Photos image URLs (lh3.googleusercontent.com/...) take an
// optional "=w123-h123-c" size directive. Harvested URLs may or may not
// already carry one (og:image covers usually do; raw photo URLs don't),
// so strip any existing suffix before appending ours - appending onto an
// existing suffix produces a malformed, non-loading URL.
export function sizedPhotoUrl(url, sizeDirective) {
  const base = url.replace(/=w\d+(-h\d+)?(-[a-z]+)*$/, '')
  return `${base}=${sizeDirective}`
}
