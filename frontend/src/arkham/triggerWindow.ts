import { MessageType, type Message } from '@/arkham/types/Message'

/**
 * A reaction / trigger window: the game paused to let the player use a [reaction] or [fast]
 * card, and it can be declined with "Skip triggers". While it is open the cards that can be used
 * get the strong `trigger-ready` highlight (styles/components.css), not the everyday gold glow
 * that also marks every card playable during a normal action.
 */
export function isTriggerWindow(choices: readonly Message[]): boolean {
  return choices.some((choice) => choice.tag === MessageType.SKIP_TRIGGERS_BUTTON)
}

/** Index of the damage / horror assignment choice for this investigator or asset, or -1. */
export function assignIndex(
  choices: readonly Message[],
  kind: 'investigator' | 'asset',
  id: string,
  tokenType: 'DamageToken' | 'HorrorToken',
): number {
  return choices.findIndex((choice) => {
    if (choice.tag !== MessageType.COMPONENT_LABEL) return false
    const c = choice.component
    if (c?.tag === 'InvestigatorComponent') return kind === 'investigator' && c.investigatorId === id && c.tokenType === tokenType
    if (c?.tag === 'AssetComponent') return kind === 'asset' && c.assetId === id && c.tokenType === tokenType
    return false
  })
}
