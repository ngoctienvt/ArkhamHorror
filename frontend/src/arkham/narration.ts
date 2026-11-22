/* Which pre-rendered story narration to play for the current game state.
 *
 * Every client receives every player's pending question, so when the lead
 * investigator is shown an intro or resolution, each table member's browser
 * sees the same `Read` question at the same moment and plays the same file:
 * the table hears the story together, each in their own narration language.
 *
 * Import-free (types only) so tests can load it without the Vue toolchain. */
import type { FlavorTextEntry } from '@/arkham/types/FlavorText'
import type { Question } from '@/arkham/types/Question'

export type NarrationLanguage = 'en' | 'vi'
export const NARRATION_LANGUAGES: NarrationLanguage[] = ['en', 'vi']

/* public/audio/narration/manifest.json, written by scripts/narration/generate_narration.py:
 * language -> i18n key -> content hash (the hash busts the browser cache when a file is re-rendered). */
export type NarrationManifest = {
  version: number
  languages: Partial<Record<NarrationLanguage, Record<string, string>>>
}

export type NarrationTrack = { key: string; url: string }

/* The i18n keys a flavor text is built from, in reading order. */
export function entryKeys(
  entries: FlavorTextEntry[],
  { includeInvalid = true }: { includeInvalid?: boolean } = {},
): string[] {
  const out: string[] = []
  const walk = (e: FlavorTextEntry) => {
    switch (e.tag) {
      case 'I18nEntry':
        out.push(e.key)
        break
      case 'ModifyEntry':
        if (!includeInvalid && e.modifiers.includes('InvalidEntry')) break
        walk(e.entry)
        break
      case 'FootnoteEntry':
        walk(e.entry)
        break
      case 'CompositeEntry':
      case 'ColumnEntry':
        e.entries.forEach(walk)
        break
      case 'ListEntry': {
        const items = (list: { entry: FlavorTextEntry; nested: unknown[] }[]): void =>
          list.forEach((i) => {
            walk(i.entry)
            items(i.nested as { entry: FlavorTextEntry; nested: unknown[] }[])
          })
        items(e.list)
        break
      }
      default:
        break
    }
  }
  entries.forEach(walk)
  return out
}

function readEntries(question: Question | undefined): FlavorTextEntry[] {
  if (!question) return []
  if (question.tag === 'Read') return question.flavorText.body
  if (question.tag === 'QuestionWithSource' || question.tag === 'QuestionLabel') {
    return readEntries((question as { question: Question }).question)
  }
  return []
}

/* The story keys any player is being shown right now, de-duplicated and in
 * player order (several players can be shown the same text at once). */
export function storyKeysInPlay(questions: Record<string, Question> | null | undefined): string[] {
  const seen = new Set<string>()
  for (const question of Object.values(questions ?? {})) {
    for (const key of entryKeys(readEntries(question))) seen.add(key)
  }
  return [...seen]
}

/* The tracks to play for those keys: only keys with a rendered file, in the
 * chosen language, falling back to English for a key not translated yet. */
export function narrationTracks(
  keys: string[],
  manifest: NarrationManifest | null,
  language: NarrationLanguage,
  root = '/audio/narration',
): NarrationTrack[] {
  if (!manifest) return []
  const tracks: NarrationTrack[] = []
  for (const key of keys) {
    const lang = manifest.languages[language]?.[key] ? language : manifest.languages.en?.[key] ? 'en' : null
    if (!lang) continue
    const hash = manifest.languages[lang]![key]
    tracks.push({ key, url: `${root}/${lang}/${encodeURIComponent(key)}.mp3?v=${hash}` })
  }
  return tracks
}

export function cardNarrationKeys(code: string, side: 'a' | 'b' | null = null): string[] {
  const bare = code.replace(/^c(?=\d)/, '')
  if (side === 'b') {
    if (bare.endsWith('b')) {
      return [`cards.${bare}`, `cards.${bare.slice(0, -1)}.b`, `cards.${bare.slice(0, -1)}b`]
    }
    if (bare.endsWith('a')) {
      const base = bare.slice(0, -1)
      return [`cards.${base}b`, `cards.${base}.b`, `cards.${bare}.b`]
    }
    return [`cards.${bare}b`, `cards.${bare}.b`, `cards.${bare}`]
  }
  if (side === 'a') {
    if (bare.endsWith('a')) {
      return [`cards.${bare}`, `cards.${bare.slice(0, -1)}`, `cards.${bare.slice(0, -1)}.a`, `cards.${bare}.a`]
    }
    return [`cards.${bare}`, `cards.${bare}a`, `cards.${bare}.a`]
  }
  return [`cards.${bare}`, `cards.${bare}a`, `cards.${bare}b`, `cards.${bare}.a`, `cards.${bare}.b`]
}

export function cardNarrationTrack(
  code: string,
  side: 'a' | 'b' | null,
  manifest: NarrationManifest | null,
  language: NarrationLanguage,
  root = '/audio/narration',
): NarrationTrack | null {
  const keys = cardNarrationKeys(code, side)
  const tracks = narrationTracks(keys, manifest, language, root)
  return tracks[0] ?? null
}

/* The narration language to start with: Vietnamese for a Vietnamese browser, else English. */
export function defaultNarrationLanguage(browserLanguages: readonly string[]): NarrationLanguage {
  return browserLanguages.some((l) => l.toLowerCase().startsWith('vi')) ? 'vi' : 'en'
}

export function readNarrationLanguage(value: string | null, fallback: NarrationLanguage): NarrationLanguage {
  return NARRATION_LANGUAGES.find((l) => l === value) ?? fallback
}

/* Reading speed of the narration audio (HTMLMediaElement.playbackRate; the
 * browser keeps the voice's pitch). Stepped by 0.1 between 0.5x and 2x. */
export const NARRATION_RATE_MIN = 0.5
export const NARRATION_RATE_MAX = 2
export const NARRATION_RATE_STEP = 0.1

const clampRate = (n: number): number =>
  Math.round(Math.min(NARRATION_RATE_MAX, Math.max(NARRATION_RATE_MIN, n)) * 10) / 10

export function readNarrationRate(value: string | null): number {
  const n = value === null ? NaN : Number(value)
  return Number.isFinite(n) ? clampRate(n) : 1
}

/* One step faster (+1) or slower (-1), kept on the 0.1 grid. */
export function stepNarrationRate(rate: number, direction: 1 | -1): number {
  return clampRate(rate + direction * NARRATION_RATE_STEP)
}

/* "1x", "1.2x", "0.5x" for the reading-panel speed label. */
export function formatNarrationRate(rate: number): string {
  return `${Number(rate.toFixed(1))}×`
}

/* Sets the speed on a narration player. defaultPlaybackRate too, since a
 * (re)load resets playbackRate to it. */
export function applyNarrationRate(audio: HTMLMediaElement, rate: number): void {
  audio.defaultPlaybackRate = rate
  audio.playbackRate = rate
}
