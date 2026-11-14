/* Fetch a file under `cards/` as JSON.
 *
 * The path is document-relative first (hash routing keeps the offline package working from a
 * subdirectory). But the server also serves index.html at deep URLs such as /games/<id>, where a
 * relative path resolves to /games/cards/... and comes back as HTML. When that happens, retry
 * against the app's base URL. */
export async function fetchCardFile<T>(file: string): Promise<T> {
  const candidates = [`cards/${file}`, `${import.meta.env.BASE_URL}cards/${file}`]
  let failure = ''
  for (const path of [...new Set(candidates)]) {
    const response = await fetch(path)
    const contentType = response.headers.get('content-type') ?? ''
    if (response.ok && contentType.includes('json')) return (await response.json()) as T
    failure = `${path}: ${response.ok ? `expected JSON, got ${contentType || 'no content type'}` : `${response.status} ${response.statusText}`}`
  }
  throw new Error(failure)
}
