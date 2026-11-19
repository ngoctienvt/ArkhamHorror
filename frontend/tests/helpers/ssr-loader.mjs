import { after } from 'node:test'
import { fileURLToPath, URL } from 'node:url'
import { createServer } from 'vite'

/** Share compilation within a test file for modules whose tests do not mutate module state.
 * Stateful store/registry tests keep their own server and isolation. */
export function createSsrLoader() {
  let serverPromise
  after(async () => {
    if (serverPromise) await (await serverPromise).close()
  })
  return async (id) => {
    serverPromise ??= createServer({
      root: fileURLToPath(new URL('../..', import.meta.url)),
      appType: 'custom',
      logLevel: 'silent',
      server: { middlewareMode: true, hmr: false, watch: null },
    })
    return (await serverPromise).ssrLoadModule(id)
  }
}
