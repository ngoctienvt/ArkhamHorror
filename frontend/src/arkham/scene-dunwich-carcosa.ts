import type { HemlockOverview } from './hemlock-overview'
import type { Act } from './types/Act'
import type { Agenda } from './types/Agenda'
import type { Location } from './types/Location'

export type CampaignSceneState = {
  acts: readonly Pick<Act, 'id' | 'sequence'>[]
  agendas: readonly Pick<Agenda, 'id' | 'sequence' | 'flipped' | 'deckId'>[]
  locations: readonly Pick<Location, 'id' | 'label' | 'cardCode' | 'tokens' | 'revealed'>[]
  reminders: readonly string[]
}

const code = (id: string) => id.replace(/^c/, '')
const back = (agenda: CampaignSceneState['agendas'][number]) =>
  agenda.flipped || ['B', 'D'].includes(agenda.sequence.side)
const stage = (state: CampaignSceneState) =>
  Math.max(1, ...state.agendas.map((agenda) => agenda.sequence.step + (back(agenda) ? 1 : 0)))
const actStage = (state: CampaignSceneState) =>
  Math.max(1, ...state.acts.map(({ sequence }) => sequence.number + (sequence.side === 'B' ? 1 : 0)))

const curtainEffects: Record<string, string> = {
  '03047a': 'fire', '03047b': 'ooze', '03047c': 'flood',
  '52015': 'mist', '52016': 'vines',
}

function curtainEffect(board: HemlockOverview, state: CampaignSceneState): HemlockOverview['locationEffect'] {
  // The resolved Stranger stays beside the act deck. Its identity selects the hazard.
  const pending = state.acts.filter(({ sequence }) => sequence.number === 2 && sequence.side === 'B')
  const reminder = [...state.reminders, ...pending.map(({ id }) => id)]
    .map(code).find((id) => curtainEffects[id])
  if (!reminder) return
  const masks = state.locations.filter(({ tokens }) => (tokens.Horror ?? 0) > 0).flatMap((location) => {
    const labelPoint = board.anchors?.[location.label]
    const cardPoint = board.anchors?.[code(location.cardCode)]
    const point = location.revealed ? cardPoint ?? labelPoint : labelPoint ?? cardPoint
    if (!point) return []
    const [x, y] = point
    // The theatre is a larger space than the private rooms flanking it.
    const main = code(location.cardCode) === '03049'
    return [`radial-gradient(ellipse ${main ? 19 : 12}% ${main ? 24 : 15}% at ${x}% ${y}%, black 65%, transparent 100%)`]
  })
  if (masks.length) return {
    image: `img/scenes/the-path-to-carcosa/return-to-curtain-call-${curtainEffects[reminder]}.webp`,
    mask: masks.join(', '),
  }
}

function blackStarsSuffix(state: CampaignSceneState): string {
  const tide = state.agendas.some((agenda) =>
    /^(0327[567])/.test(code(agenda.id))
      && (agenda.sequence.step >= 3 || (code(agenda.id) === '03276a' && back(agenda))),
  )
  const vortex = state.agendas.some((agenda) =>
    /^(0327[89]|03280)/.test(code(agenda.id))
      && (agenda.sequence.step >= 3 || (code(agenda.id) === '03279a' && back(agenda))),
  )
  if (tide && vortex) return '-flood-vortex'
  if (tide) return '-flood'
  if (vortex) return '-vortex'
  return ''
}

/** Select scenery exclusively from the loaded snapshot so undo and reload agree. */
export function dunwichCarcosaScene(
  board: HemlockOverview | undefined, state: CampaignSceneState,
): HemlockOverview | undefined {
  if (!board) return
  const art = board.layoutArt ?? board.image.slice('img/scenes/'.length, -'.webp'.length)
  const agenda = stage(state)
  let suffix = ''
  switch (art) {
    case 'the-dunwich-legacy/return-to-the-house-always-wins':
      suffix = agenda >= 3 ? '-damaged' : ''
      break
    case 'the-dunwich-legacy/return-to-the-miskatonic-museum':
      suffix = agenda >= 3 ? '-darkness' : agenda >= 2 ? '-shadows' : ''
      break
    case 'the-dunwich-legacy/essex-county-rails':
      suffix = agenda >= 2 ? '-maw' : ''
      break
    case 'the-dunwich-legacy/blood-on-the-altar':
      suffix = agenda >= 2 ? '-night' : ''
      break
    case 'the-dunwich-legacy/undimensioned-and-unseen':
      suffix = agenda >= 3 ? '-storm' : ''
      break
    case 'the-dunwich-legacy/where-doom-awaits':
      suffix = actStage(state) >= 3 ? '-gate' : agenda >= 2 ? '-warped' : '-quiet'
      break
    case 'the-path-to-carcosa/return-to-curtain-call': {
      const effect = curtainEffect(board, state)
      return effect ? { ...board, locationEffect: effect } : board
    }
    case 'the-path-to-carcosa/the-last-king':
      suffix = agenda >= 2 ? '-madness' : ''
      break
    case 'the-path-to-carcosa/the-unspeakable-oath':
      suffix = actStage(state) >= 4 ? '-alarm' : '-revised'
      break
    case 'the-path-to-carcosa/a-phantom-of-truth':
      // Dawn is on the back of each night. The next agenda starts at evening again.
      suffix = state.agendas.some(back) ? '-dawn' : ''
      break
    case 'the-path-to-carcosa/the-pallid-mask-catacombs':
      suffix = state.acts.some(({ id }) => code(id) === '03245') ? '-collapse' : ''
      break
    case 'the-path-to-carcosa/black-stars-rise': {
      const weather = blackStarsSuffix(state)
      if (weather === '-flood-vortex') {
        return {
          ...board,
          image: `img/scenes/${art}-flood.webp`,
          layoutArt: art,
          locationEffect: {
            image: `img/scenes/${art}-vortex.webp`,
            mask: 'linear-gradient(to bottom, black 0%, black 18%, transparent 34%)',
          },
        }
      }
      suffix = weather || '-revised'
      break
    }
    case 'the-path-to-carcosa/return-to-dim-carcosa':
      suffix = actStage(state) === 1 ? '-theatre' : ''
      break
    default:
      return board
  }
  return suffix ? { ...board, image: `img/scenes/${art}${suffix}.webp`, layoutArt: art } : board
}
