import type { ArkhamDBCard } from '@/stores/dbCards'

/* Printed card text for homebrew campaigns, discovered from
 * frontend/homebrew/<campaign>/cards_<lang>.json (written by
 * scripts/import-arkham-build-homebrew.cjs) in the same shape as the ArkhamDB
 * records, so card lookups treat both alike. ArkhamDB has no fan-made cards, so
 * without these a homebrew card shows its raw code instead of a name.
 *
 * Each file is its own chunk, fetched only when a card of that campaign is first
 * looked up. A campaign without the player's language falls back to English. */
const loaders = import.meta.glob<{ default: ArkhamDBCard[] }>('@homebrew/*/cards_*.json')

interface HomebrewCardFile {
  campaign: string
  lang: string
  load: () => Promise<{ default: ArkhamDBCard[] }>
}

const files: HomebrewCardFile[] = Object.entries(loaders).flatMap(([path, load]) => {
  const match = path.match(/\/([^/]+)\/cards_([a-z-]+)\.json$/)
  return match && match[1] && match[2] ? [{ campaign: match[1], lang: match[2], load }] : []
})

/** The campaign a homebrew card code belongs to (`c:dark-matter:027` -> `dark-matter`), or null. */
export function homebrewCampaignOf(code: string): string | null {
  return code.match(/^c?:([a-z0-9-]+):/)?.[1] ?? null
}

/** One campaign's card records in `lang`, English when the campaign has no such file. */
export async function loadHomebrewCampaignCards(campaign: string, lang: string): Promise<ArkhamDBCard[]> {
  const file = files.find((f) => f.campaign === campaign && f.lang === lang)
    ?? files.find((f) => f.campaign === campaign && f.lang === 'en')
  return file ? (await file.load()).default : []
}
