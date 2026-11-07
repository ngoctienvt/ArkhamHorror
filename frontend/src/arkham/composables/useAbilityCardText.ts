import type { Game } from '@/arkham/types/Game'
import { useCardNames, useCardInfo } from '@/arkham/composables/useCardNames'
import { LINE_KIND, type AbilityKind } from '@/arkham/locationChoices'
import { replaceText } from '@/arkham/cardTextFormat'

export type AbilitySection = 'basic' | 'scenario' | 'enemies' | 'inPlay' | 'other'

/** Anything that carries an ability's source card and printed kind, and gets that card's line of text. */
export type TextRow = { sourceId: string | null; kind: AbilityKind | null; text: string | null }

type Known = { id: string; cardCode?: string; revealed?: boolean }

// Which part of the board an entity id belongs to decides the section its abilities fall under.
const KIND_SECTION: [string, AbilitySection][] = [
  ['investigators', 'basic'], ['locations', 'scenario'], ['stories', 'scenario'],
  ['enemies', 'enemies'], ['assets', 'inPlay'], ['events', 'inPlay'], ['skills', 'inPlay'], ['treacheries', 'inPlay'],
]

/* Finds the card behind an ability's source and its printed line of text, so an
 * ability button can show what it does without opening the card. Shared by the
 * location action panel and the skill test panel. */
export function useAbilityCardText(game: () => Game) {
  const nameOf = useCardNames()
  const cardInfo = useCardInfo()

  function lookupEntity(id: string): { entity: Known; section: AbilitySection } | null {
    for (const [kind, section] of KIND_SECTION) {
      const found = (game()[kind as keyof Game] as unknown as Record<string, Known> | undefined)?.[id]
      if (found) return { entity: found, section }
    }
    return null
  }

  function lookup(id: string): { section: AbilitySection; name: string } | null {
    const found = lookupEntity(id)
    return found ? { section: found.section, name: nameOf(found.entity.cardCode ?? found.entity.id) } : null
  }

  // The face-up text of the card that offers an ability, one printed line per entry, tagged with its ability kind.
  function printedLines(sourceId: string): { kind: AbilityKind; html: string }[] {
    const entity = lookupEntity(sourceId)?.entity
    if (!entity) return []
    const card = cardInfo(entity.cardCode ?? entity.id)
    const text = (entity.revealed === false ? card?.back_text : card?.text) ?? ''
    return text.split(/\n|<br\s*\/?>/i).flatMap((line) => {
      const kind = LINE_KIND.find(([re]) => re.test(line))?.[1]
      // The ability button already shows the leading action icon, so don't repeat it in the hint.
      return kind ? [{ kind, html: replaceText(line.trim()).replace(/^\s*<span class="[\w-]+-icon"><\/span>\s*:?\s*/, '') }] : []
    })
  }

  // Several abilities of one kind on one card line up with that card's lines of the same kind, in printed order.
  function attachText<R extends TextRow>(rows: R[]): R[] {
    const seen = new Map<string, number>()
    for (const row of rows) {
      if (!row.sourceId || !row.kind) continue
      const key = `${row.sourceId}|${row.kind}`
      const nth = seen.get(key) ?? 0
      seen.set(key, nth + 1)
      const lines = printedLines(row.sourceId).filter((l) => l.kind === row.kind)
      const total = rows.filter((r) => r.sourceId === row.sourceId && r.kind === row.kind).length
      if (lines.length === total) row.text = lines[nth].html
    }
    return rows
  }

  return { lookup, attachText }
}
