import type { LogEntry } from '@/arkham/types/GameLog'

/* The server logs activation before resolving an ability. That line alone
 * cannot tell whether anything happened. Show the consequence entries instead;
 * keep the original stream intact for pagination, undo and activity detection. */
export function forcedEffectLogEntries(entries: readonly LogEntry[]): LogEntry[] {
  return entries.flatMap((entry) => {
    const children = forcedEffectLogEntries(entry.children)
    const part = entry.body.length === 1 ? entry.body[0] : undefined
    if (
      entry.kind === 'Action' &&
      part?.tag === 'LogI18n' &&
      part.contents[0] === 'log.triggersForcedAbility'
    ) return children
    return [{ ...entry, children }]
  })
}
