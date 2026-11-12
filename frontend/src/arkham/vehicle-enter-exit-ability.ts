import type { Game } from '@/arkham/types/Game'
import type { Ability } from '@/arkham/types/Ability'
import { sourceEntityId } from '@/arkham/locationChoices'

/* The engine gives every vehicle (Fishing Vessel, the cars of Horror in High Gear, Rocket Ship…) a rules
 * ability with this fixed index: enter the vehicle when outside it, leave it when inside. It is not printed
 * on the card, so a bare "use Fishing Vessel's ability" reads like a mystery trigger; name it instead. */
export const VEHICLE_ENTER_EXIT_ABILITY_INDEX = 2000

export type VehicleMove = { kind: 'enter' | 'leave'; vehicleId: string }

/** Whether this ability boards or leaves a vehicle for `investigatorId` (the turn owner when omitted). */
export function vehicleEnterExitMove(game: Game, ability: Ability, investigatorId?: string | null): VehicleMove | null {
  if (ability.index !== VEHICLE_ENTER_EXIT_ABILITY_INDEX) return null
  const vehicleId = sourceEntityId(ability.source)
  if (!vehicleId) return null
  const who = game.investigators[investigatorId ?? game.activeInvestigatorId]
  const placement = who?.placement
  const inside = placement?.tag === 'InVehicle' && placement.contents === vehicleId
  return { kind: inside ? 'leave' : 'enter', vehicleId }
}
