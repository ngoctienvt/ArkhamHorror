import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import * as ArkhamGame from '@/arkham/types/Game'
import type { Question } from '@/arkham/types/Question'
import type { Message } from '@/arkham/types/Message'
import { useCardInfo, useCardNames } from '@/arkham/composables/useCardNames'
import { sourceEntityId } from '@/arkham/locationChoices'
import { toCardContents } from '@/arkham/types/Card'
import { firstAbilitySourceId, firstEngineAction, firstWindow, type EngineAction } from '@/arkham/engine-message-actions'

/** Who raised a prompt, what answering it does, and the card rule behind it. Any part may be unknown. */
export type PromptContext = { from: string | null; intent: string | null; effect: string | null }

const ENTITY_KINDS = ['assets', 'events', 'skills', 'treacheries', 'enemies', 'locations', 'stories', 'acts', 'agendas', 'investigators'] as const

// Card text as one plain line: no markup, [[Trait]] kept as its word, icon tokens dropped.
const cleanCardText = (text: string) => text.replace(/<[^>]+>/g, '').replace(/\[\[([^\]]+)\]\]/g, '$1')
  .replace(/\[[a-z_]+\]/gi, '').replace(/\s+/g, ' ').trim()
const EFFECT_LINE = /^(forced|bắt buộc|reaction|phản ứng|revelation)\b/i

// What kind of thing one answer picks, for "Choose a <noun> to ...".
function choiceNoun(m: Message): string {
  switch (m.tag) {
    case 'PortraitLabel': return 'investigator'
    case 'CardLabel': return 'card'
    case 'FightLabel': case 'FightLabelWithSkill': case 'EvadeLabel': case 'EvadeLabelWithSkill': case 'EngageLabel': return 'enemy'
    case 'TargetLabel': {
      const tag = m.target.innerTag ?? m.target.tag
      if (tag === 'LocationTarget') return 'location'
      if (tag === 'EnemyTarget') return 'enemy'
      if (tag === 'InvestigatorTarget') return 'investigator'
      if (/^(Asset|Event|Skill|Treachery|Card|CardId|Story)Target$/.test(tag)) return 'card'
      return 'option'
    }
    default: return 'option'
  }
}

const sameAction = (a: EngineAction, b: EngineAction) =>
  a.key === b.key && a.n === b.n && a.horror === b.horror && a.token === b.token

/* Explains an unlabelled engine prompt from what the game already sent: the card that asked (the question's
 * source, or the source inside the messages its answers will run), what the answers do, and that card's
 * Forced/Reaction/Revelation text. Shared by the status panel and the choice popup. Reads state only. */
export function useChoiceContext(game: () => Game) {
  const { t, te } = useI18n()
  const nameOf = useCardNames()
  const cardInfo = useCardInfo()

  function entityCode(id: string | null): string | null {
    if (!id) return null
    for (const kind of ENTITY_KINDS) {
      const found = (game()[kind] as unknown as Record<string, { id: string; cardCode?: string }> | undefined)?.[id]
      if (found) return found.cardCode ?? found.id
    }
    // A card still in someone's hand (e.g. a reaction event offered in a window) is not an entity yet.
    for (const inv of Object.values(game().investigators)) {
      const card = inv.hand.find((c) => toCardContents(c).id === id)
      if (card) return toCardContents(card).cardCode
    }
    return null
  }
  function entityName(id: string | null): string | null {
    const code = entityCode(id)
    return code ? nameOf(code) : null
  }

  // The card's own Forced/Reaction/Revelation paragraph, so a bare prompt shows the rule that raised it.
  function effectText(id: string | null): string | null {
    const code = entityCode(id)
    const text = code ? cardInfo(code)?.text : null
    if (!text) return null
    return text.split(/\n+/).map(cleanCardText).find((l) => EFFECT_LINE.test(l)) ?? null
  }

  const tokenName = (token: string | null) => token
    ? t(`locationMap.status.intent.token.${token}`, token.toLowerCase()) : t('locationMap.status.intent.token.default')

  // One action as a verb phrase. `name` is the thing acted on; empty when each answer picks a different one.
  function actionPhrase(a: EngineAction, name: string): string {
    const n = a.n ?? 1
    if (a.key === 'takeDamage' || a.key === 'dealDamage') {
      const parts = [
        a.n ? t('locationMap.status.intent.amount.damage', { n: a.n }) : '',
        a.horror ? t('locationMap.status.intent.amount.horror', { n: a.horror }) : '',
      ].filter(Boolean)
      const what = parts.join(t('locationMap.status.intent.and')) || t('locationMap.status.intent.amount.someDamage')
      return t(`locationMap.status.intent.action.${a.key}`, { name, what })
    }
    return t(`locationMap.status.intent.action.${a.key}`, { name, n, token: tokenName(a.token) })
  }

  // The moment a reaction window opens on, e.g. "Seer of the Sign is about to attack Roland Banks".
  function windowSituation(choices: Message[]): string | null {
    const w = firstWindow(choices.map((c) => c.messages))
    if (!w) return null
    const key = `locationMap.status.intent.window.${w.type}`
    if (!te(key)) return null
    return t(key, { enemy: entityName(w.enemyId) ?? '', target: entityName(w.targetId) ?? '' }).replace(/\s+/g, ' ').trim()
  }

  // What an unlabelled choice will do, read from the engine messages its answers carry: the card that
  // asked, and, when every answer runs the same action, that action ("Choose an enemy to place 1 doom on").
  function choicesContext(choices: Message[]): { sourceId: string | null; intent: string | null } {
    const withMessages = choices.filter((c) => Array.isArray(c.messages) && c.messages.length > 0)
    if (withMessages.length === 0) return { sourceId: null, intent: null }
    const actions = withMessages.map((c) => firstEngineAction(c.messages))
    const first = actions[0]
    const sourceId = actions.find((a) => a?.sourceId)?.sourceId ?? firstAbilitySourceId(withMessages.map((c) => c.messages))
    const situation = windowSituation(withMessages)
    if (situation || !first || actions.some((a) => !a || !sameAction(a, first))) return { sourceId, intent: situation }
    const subjects = new Set(actions.map((a) => a!.subjectId))
    const name = subjects.size === 1 ? entityName(first.subjectId) ?? '' : ''
    const verb = actionPhrase(first, name).replace(/\s+/g, ' ').trim()
    // A single answer is a confirmation, not a pick: just say what it does.
    if (withMessages.length === 1) return { sourceId, intent: verb.charAt(0).toUpperCase() + verb.slice(1) }
    const nouns = new Set(withMessages.map(choiceNoun))
    const noun = t(`locationMap.status.intent.noun.${nouns.size === 1 ? [...nouns][0] : 'option'}`)
    return { sourceId, intent: t('locationMap.status.intent.choose', { noun, verb }) }
  }
  // The whole context for one seat's pending question, or null when the engine already labelled it.
  function promptContext(pid: string): PromptContext | null {
    let q: Question | undefined = game().question[pid]
    while (q) {
      if (q.tag === 'QuestionLabel' || q.tag === 'Read') return null
      if (!('question' in q) || !q.question) break
      q = q.question
    }
    if (!q || ArkhamGame.choicesTooltip(game(), pid)) return null
    const choices = 'choices' in q && Array.isArray(q.choices) ? q.choices as Message[] : []
    const context = choicesContext(choices)
    const askedBy = ArkhamGame.choicesSource(game(), pid)
    const fromId = askedBy ? sourceEntityId(askedBy) : context.sourceId
    const result = { from: entityName(fromId), intent: context.intent, effect: effectText(fromId) }
    return result.from || result.intent || result.effect ? result : null
  }

  return { entityName, effectText, choicesContext, promptContext }
}
