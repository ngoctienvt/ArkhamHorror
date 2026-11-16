/* Keywords a card gained or lost from modifiers (AddKeyword / RemoveKeyword), and the markup
 * that shows them in the hover text: gained ones in red, lost ones struck through in red.
 * Import-free on purpose so the node tests can load it without the Vue toolchain. */

type KeywordModifier = { type: { tag: string, contents?: unknown } }

export type KeywordChanges = { gained: string[], lost: string[] }

/* Dataset values carry keyword lists as "Hunter. Retaliate". */
export const KEYWORD_SEPARATOR = '. '

const uniqueStrings = (values: unknown[]): string[] =>
  [...new Set(values.filter((v): v is string => typeof v === 'string' && v.length > 0))]

/* A keyword both added and removed shows as lost: the card ends up without it. */
export function keywordChanges(modifiers: readonly KeywordModifier[] | null | undefined): KeywordChanges {
  const list = modifiers ?? []
  const lost = uniqueStrings(list.filter(m => m.type.tag === 'RemoveKeyword').map(m => m.type.contents))
  const gained = uniqueStrings(list.filter(m => m.type.tag === 'AddKeyword').map(m => m.type.contents))
    .filter(k => !lost.includes(k))
  return { gained, lost }
}

export const joinKeywords = (keywords: readonly string[]): string | undefined =>
  keywords.length > 0 ? keywords.join(KEYWORD_SEPARATOR) : undefined

export const splitKeywords = (value: string | null | undefined): string[] =>
  (value ?? '').split(KEYWORD_SEPARATOR).map(k => k.trim().replace(/\.$/, '')).filter(Boolean)

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/* Strike the printed keyword in the card's text (HTML), touching only text between tags so
 * attributes stay intact. Keyword names stay in English in every translation, so the English
 * name is what we look for. Returns the keywords the text does not print, for the caller to
 * show struck through on their own. */
export function strikeLostKeywords(html: string, lost: readonly string[]): { html: string, unmatched: string[] } {
  const unmatched: string[] = []
  let result = html
  for (const keyword of lost) {
    const re = new RegExp(`(^|[^\\p{L}])(${escapeRegExp(keyword)})(?![\\p{L}])`, 'u')
    let found = false
    result = result.split(/(<[^>]*>)/).map(part => {
      if (found || part.startsWith('<')) return part
      return part.replace(re, (_m, before: string, word: string) => {
        found = true
        return `${before}<span class="keyword-lost">${word}</span>`
      })
    }).join('')
    if (!found) unmatched.push(keyword)
  }
  return { html: result, unmatched }
}
