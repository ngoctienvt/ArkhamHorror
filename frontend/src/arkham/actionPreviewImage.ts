/**
 * Which card an action in the location panel is about, as an image url for the shared card hover preview
 * (CardOverlay reads `data-image`). Fight / evade / engage show their enemy, Investigate shows the location,
 * and a card ability shows the card that offers it. Null when no single card fits.
 */
import type { Game } from '@/arkham/types/Game'
import type { Enemy } from '@/arkham/types/Enemy'
import type { Investigator } from '@/arkham/types/Investigator'
import { cardImage } from '@/arkham/cardImages'

type Carded = { cardCode?: string; revealed?: boolean; flipped?: boolean }

// Investigators are left out: their basic actions point at what they act on, not at themselves.
const KINDS = ['enemies', 'locations', 'assets', 'events', 'skills', 'treacheries', 'stories'] as const

/** The image of the card in play with this id, front or back as it lies on the table. */
export function entityImage(game: Game, id: string | null | undefined): string | null {
  if (!id) return null
  for (const kind of KINDS) {
    const found = (game[kind as keyof Game] as unknown as Record<string, Carded> | undefined)?.[id]
    if (!found?.cardCode) continue
    if (kind === 'locations') return cardImage(found.cardCode, found.revealed === false ? 'b' : '')
    return cardImage(found.cardCode, found.flipped ? 'b' : '')
  }
  return null
}

/** An investigator's own card, for an ability printed on it (unlike basic actions, it is about the investigator). */
export function investigatorImage(game: Game, id: string | null | undefined): string | null {
  const found = id ? game.investigators[id] : null
  return found?.cardCode ? cardImage(found.cardCode) : null
}

function enemyAt(enemy: Enemy, locationId: string): boolean {
  return enemy.placement.tag === 'AtLocation' && enemy.placement.contents === locationId
}

/** The enemy a basic fight / evade / engage must be aimed at, or null when it could be more than one.
 *  The basic action is a single button and its target is picked after it is taken, so a preview of one
 *  enemy out of several would wrongly suggest it can only hit that one. */
function onlyTarget(game: Game, me: Investigator, action: string): string | null {
  const enemies = Object.values(game.enemies)
  const engaged = enemies.filter((e) => me.engagedEnemies.includes(e.id) || e.engagedInvestigators.includes(me.id))
  const here = enemies.filter((e) => enemyAt(e, me.location) && !engaged.includes(e))
  // Evading only frees you from enemies engaged with you; engaging only takes enemies not yet engaged.
  const pool = action === 'Evade' ? engaged : action === 'Engage' ? here : [...engaged, ...here]
  return pool.length === 1 ? pool[0].id : null
}

/** The card a basic action (from the investigator card) is about, by which action it is. */
export function basicActionImage(game: Game, me: Investigator | null | undefined, actions: string[]): string | null {
  if (!me) return null
  if (actions.includes('Investigate')) return entityImage(game, me.location)
  const action = actions.find((a) => a === 'Fight' || a === 'Evade' || a === 'Engage')
  return action ? entityImage(game, onlyTarget(game, me, action)) : null
}
