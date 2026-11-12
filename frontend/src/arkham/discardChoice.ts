import { MessageType, type Message } from '@/arkham/types/Message'
import { findRaw } from '@/arkham/engine-message-actions'

/* Engine messages that move a single chosen card or asset to the discard pile.
 * Deck-level discards (DiscardTopOfDeck, DiscardHand, ...) never pick a card on
 * screen, so they are not listed. */
const DISCARD_TAG = /^(DiscardCard|Discard|DiscardAsset|DiscardEvent|DiscardSkill|DiscardTreachery|DiscardFromHand|ChooseAndDiscard\w*)$/

/** True when answering this choice discards the card/asset it targets. */
export function isDiscardChoice(choice: Message): boolean {
  if (choice.tag !== MessageType.TARGET_LABEL) return false
  const messages = (choice as { messages?: unknown[] }).messages
  if (!messages) return false
  return findRaw(messages, (o) => typeof o.tag === 'string' && DISCARD_TAG.test(o.tag)) !== null
}
