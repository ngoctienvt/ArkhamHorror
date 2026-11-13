import type { Game } from '@/arkham/types/Game'
import type { Message } from '@/arkham/types/Message'
import type { Location } from '@/arkham/types/Location'
import { cardArt } from '@/arkham/cardImages'
import { useCardInfo } from '@/arkham/composables/useCardNames'
import { choicesFor, selectLocationIndex, type EntityChoice } from '@/arkham/locationChoices'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import { buildLocationInfo, type LocationInfo } from '@/arkham/locationInfoModel'

/** Scenario-only locations that have no printed card record, so the map names them itself. */
const UNPRINTED_NAMES: Readonly<Record<string, string>> = { xsky: 'Open Sky' }

export type MapLocationInfo = LocationInfo<EntityChoice['contents']>

/** Builds the map's view of a location from the live game, card records and offered choices. */
export function useLocationInfo(
  game: () => Game,
  playerId: () => string,
  choices: () => readonly Message[],
  enemiesAt: (l: Location) => string[],
): (l: Location) => MapLocationInfo {
  const info = useCardInfo()
  return (l: Location) => {
    const code = cardArt(l.cardCode)
    const front = info(code)
    // A record filed under the `b` code itself is that face; otherwise the lookup lent the front record.
    const back = l.revealed ? null : info(`${code}b`)
    const ownBack = back && back.code === `${code}b` ? back : null
    const offered = choices()
    return buildLocationInfo(l, {
      front,
      ownBack,
      fallbackName: front?.name ?? UNPRINTED_NAMES[code] ?? code,
      playerCount: Object.keys(game().investigators).length,
      myLocationId: ownInvestigator(game(), playerId())?.location ?? null,
      enemyCount: enemiesAt(l).length,
      choices: choicesFor(offered, l.id),
      selectIndex: selectLocationIndex(offered, l),
    })
  }
}
