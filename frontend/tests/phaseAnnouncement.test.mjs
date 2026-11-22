import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/arkham/components/PhaseAnnouncement.vue', import.meta.url), 'utf8')

test('each phase gets its own band so back-to-back phases replay the fade', () => {
  // The band's fade is a one-shot animation that ends at opacity 0. Reusing the
  // element for the next phase (Enemy then Upkeep in the same tick) left the
  // Upkeep announcement invisible.
  const band = source.match(/<div[^>]*class="phase-announcement"[^>]*>/)?.[0] ?? ''
  assert.match(band, /:key="phase"/)
})
