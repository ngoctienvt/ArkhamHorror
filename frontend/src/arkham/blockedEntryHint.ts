/* A location you cannot enter yet (The Gathering's Parlor behind its barrier, a locked door, ...).
 * The map shows a padlock on the path into it instead of a move arrow; hovering it tells why, in the
 * location's own printed words.
 *
 * Import-free on purpose so tests can load it without the Vue toolchain. */

export type EntryModifier = { type: { tag: string; contents?: unknown } }

const BLOCKING_FLAGS = new Set(['Blocked', 'CannotEnter', 'CannotBeEnteredBy'])

/** Whether something on the location itself keeps investigators out of it. */
export function entryBlocked(modifiers: readonly EntryModifier[] | null | undefined): boolean {
  return (modifiers ?? []).some(({ type }) =>
    type.tag === 'CannotEnter' || type.tag === 'CannotBeEnteredBy'
    || (type.tag === 'OtherModifier' && typeof type.contents === 'string' && BLOCKING_FLAGS.has(type.contents)))
}

/** The face-up text of the shut location as plain prose (markup and icon tags dropped); null when empty. */
export function blockedReason(locationText: string | null | undefined): string | null {
  if (!locationText) return null
  const text = locationText.replace(/<[^>]+>/g, '').replace(/\[[a-z_]+\]/gi, '').replace(/\s+/g, ' ').trim()
  return text || null
}
