/**
 * Target choices the scene map has no control for.
 *
 * Question.vue leaves out every "choose this card" choice whose card is drawn on the card board, since the
 * board makes that card clickable. The scene map draws far less of the board: enemies on a plain map are
 * a count, enemies with no scene control, stories in a grid cell (Red Sunrise),
 * locations in a play area, cards in the Void / pursuit / shadows, or anything attached to a location are
 * not clickable there. Without this list such a choice could not be answered without switching views.
 *
 * A choice is kept when its target is a card on the board, i.e. not one the player zone already shows
 * (play areas, threat areas, hands), not a location drawn on the map, not an investigator (team strip /
 * player tabs on the card board only: the scene hides the investigator card), not an act or agenda (mission strip), and not a concealed card (listed on its own).
 */
import type { Game } from '@/arkham/types/Game'
import type { Placement } from '@/arkham/types/Placement'
import type { Message, TargetLabel } from '@/arkham/types/Message'

// Import-free at runtime (types only) so tests/sceneTargetFallback.test.mjs can load it without the Vue toolchain.
const TARGET_LABEL = 'TargetLabel'

export type FallbackKind = 'investigator' | 'enemy' | 'location' | 'asset' | 'event' | 'skill' | 'treachery' | 'story' | 'scarletKey'
/** `code` names the card (for its name), `art` and `side` the face shown in the hover preview. */
export interface FallbackTarget { index: number; id: string; kind: FallbackKind; code: string; art: string; side: '' | 'b' }

type Placed = {
  cardCode?: string; placement?: Placement | null; flipped?: boolean; revealed?: boolean
  art?: string; flippedArt?: string; stability?: string
}

// Stories and scarlet keys carry no cardCode: a story is named by its id and drawn by its art, a key is its id.
function faceOf(kind: FallbackKind, id: string, e: Placed): Pick<FallbackTarget, 'code' | 'art' | 'side'> | null {
  if (kind === 'story') return { code: id.replace(/^c/, ''), art: (e.flipped ? e.flippedArt : e.art) ?? id, side: '' }
  if (kind === 'scarletKey') return { code: id, art: id, side: e.stability === 'Unstable' ? 'b' : '' }
  if (!e.cardCode) return null
  const back = kind === 'location' ? e.revealed === false : Boolean(e.flipped)
  return { code: e.cardCode, art: e.cardCode, side: back ? 'b' : '' }
}

const POOLS: [string, FallbackKind, keyof Game][] = [
  ['InvestigatorTarget', 'investigator', 'investigators'],
  ['EnemyTarget', 'enemy', 'enemies'], ['LocationTarget', 'location', 'locations'], ['AssetTarget', 'asset', 'assets'],
  ['EventTarget', 'event', 'events'], ['SkillTarget', 'skill', 'skills'], ['TreacheryTarget', 'treachery', 'treacheries'],
  ['StoryTarget', 'story', 'stories'], ['ScarletKeyTarget', 'scarletKey', 'scarletKeys'],
]

// Placements the player zone draws (and makes clickable) in scene mode as well.
const PLAYER_ZONE = new Set(['InThreatArea', 'FacedownInThreatArea', 'InPlayArea', 'StillInHand', 'StillInDiscard', 'HiddenInHand', 'OnTopOfDeck', 'InVehicle'])

/** Whether the player zone shows a card with this placement; a card attached to an asset goes where the asset is. */
function inPlayerZone(game: Game, placement: Placement | null | undefined, depth = 0): boolean {
  if (!placement) return false
  if (PLAYER_ZONE.has(placement.tag)) return true
  if (placement.tag === 'AttachedToAsset' && depth < 4) {
    const [assetId, inner] = placement.contents
    return inPlayerZone(game, inner ?? game.assets[assetId]?.placement, depth + 1)
  }
  return false
}

/** Every target choice the scene map cannot otherwise answer, with the card each one is about. */
export function sceneFallbackTargets(game: Game, choices: readonly Message[], mapLocationIds: ReadonlySet<string>, mapEnemyIds?: ReadonlySet<string>): FallbackTarget[] {
  const result: FallbackTarget[] = []
  choices.forEach((choice, index) => {
    if ((choice.tag as string) !== TARGET_LABEL) return
    const { tag, contents } = (choice as TargetLabel).target as { tag: string; contents: unknown }
    if (typeof contents !== 'string') return
    const pool = POOLS.find(([t]) => t === tag)
    if (!pool) return
    const [, kind, key] = pool
    if (kind === 'enemy' && mapEnemyIds?.has(contents)) return
    const entity = (game[key] as unknown as Record<string, Placed> | undefined)?.[contents]
    if (!entity) return
    // The scene draws no investigator card, so picking an investigator is always listed.
    if (kind === 'location' ? mapLocationIds.has(contents) : kind !== 'investigator' && inPlayerZone(game, entity.placement)) return
    const face = faceOf(kind, contents, entity)
    if (face) result.push({ index, id: contents, kind, ...face })
  })
  return result
}

/** A token on an investigator the game asks to pick (assign damage or horror, spend clues, take resources). */
export interface FallbackToken { index: number; investigatorId: string; tokenType: string; auxiliary: boolean }

/**
 * Token choices on investigators. The card board answers them from the investigator's token row
 * (Resources.vue), which the scene hides; only the illustrated boards have their own +1 buttons. Your own
 * "take a resource" is the basic action the panel already lists, so it is left out here.
 */
export function sceneFallbackTokens(choices: readonly Message[], myInvestigatorId: string | null): FallbackToken[] {
  const result: FallbackToken[] = []
  choices.forEach((choice, index) => {
    const tag = choice.tag as string
    if (tag !== 'ComponentLabel' && tag !== 'AuxiliaryComponentLabel') return
    const component = (choice as { component?: { tag: string; investigatorId?: string; tokenType?: string } }).component
    if (component?.tag !== 'InvestigatorComponent' || !component.investigatorId || !component.tokenType) return
    const auxiliary = tag === 'AuxiliaryComponentLabel'
    if (!auxiliary && component.tokenType === 'ResourceToken' && component.investigatorId === myInvestigatorId) return
    result.push({ index, investigatorId: component.investigatorId, tokenType: component.tokenType, auxiliary })
  })
  return result
}

/** How many choices only the scene's action panel can answer: board targets, investigator tokens, concealed
 * cards and keys. While it is above zero the map keeps the panel open, so closing it never hides the question. */
export function scenePanelOnlyCount(game: Game, choices: readonly Message[], mapLocationIds: ReadonlySet<string>, myInvestigatorId: string | null, mapEnemyIds?: ReadonlySet<string>): number {
  const concealedOrKey = choices.filter((choice) => {
    const tag = choice.tag as string
    if (tag === 'KeyLabel') return true
    if (tag !== TARGET_LABEL) return false
    const contents = (choice as TargetLabel).target.contents
    return typeof contents === 'string' && contents in (game.concealed ?? {})
  }).length
  return sceneFallbackTargets(game, choices, mapLocationIds, mapEnemyIds).length + sceneFallbackTokens(choices, myInvestigatorId).length + concealedOrKey
}
