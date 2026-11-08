import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import * as ArkhamGame from '@/arkham/types/Game'
import type { Question } from '@/arkham/types/Question'
import type { Message } from '@/arkham/types/Message'
import { toCardContents } from '@/arkham/types/Card'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { useChoiceContext } from '@/arkham/composables/useChoiceContext'
import { firstEngineAction } from '@/arkham/engine-message-actions'
import { sourceEntityId } from '@/arkham/locationChoices'
import { handleI18n } from '@/arkham/i18n'

/** One investigator the game is waiting on: who, what they have to do, and whether it is only an open fast window. */
export type StatusRow = { id: string; mine: boolean; who: string; text: string; detail: string | null; effect: string | null; window: boolean }

// Rules-reference number of each phase step; the fast windows between steps have none.
const STEP_NO: Record<string, string> = {
  MythosPhaseBeginsStep: '1.1', PlaceDoomOnAgendaStep: '1.2', CheckDoomThresholdStep: '1.3',
  EachInvestigatorDrawsEncounterCardStep: '1.4', MythosPhaseEndsStep: '1.5',
  InvestigationPhaseBeginsStep: '2.1', NextInvestigatorsTurnBeginsStep: '2.2', InvestigatorTakesActionStep: '2.2.1',
  InvestigatorsTurnEndsStep: '2.2.2', InvestigationPhaseEndsStep: '2.3',
  EnemyPhaseBeginsStep: '3.1', HunterEnemiesMoveStep: '3.2', ResolveAttacksStep: '3.3', EnemyPhaseEndsStep: '3.4',
  UpkeepPhaseBeginsStep: '4.1', ResetActionsStep: '4.2', ReadyExhaustedStep: '4.3',
  DrawCardAndGainResourceStep: '4.4', CheckHandSizeStep: '4.5', UpkeepPhaseEndsStep: '4.6',
}

/* The status lines every seat sees: the phase, the round step, what is resolving right now, and one row per
 * investigator the game is waiting on. Shared by the status panel above the log and the centred prompt
 * notice, so both always say the same thing. Reads server state only; sends nothing. */
export function useGameStatusLines(game: () => Game, playerId: () => string) {
  const { t, te } = useI18n()
  const nameOf = useCardNames()
  const { entityName, effectText, choicesContext } = useChoiceContext(game)

  const plainText = (text: string) => (text.startsWith('$') ? handleI18n(text, t) : text)
    .replace(/<[^>]+>/g, '').replace(/\{[a-zA-Z]+\}/g, '').replace(/_/g, '').trim()

  const sourceName = (s: Parameters<typeof sourceEntityId>[0] | null) => entityName(s ? sourceEntityId(s) : null)

  // The wrappers around a question carry the engine's own sentence for it; the innermost question says what kind of answer is wanted.
  function questionInfo(pid: string) {
    let q: Question | undefined = game().question[pid]
    let label: string | null = null
    while (q) {
      if (q.tag === 'QuestionLabel' && !label) label = q.label
      if (!('question' in q) || !q.question) break
      q = q.question
    }
    const amount = q && 'amount' in q && typeof q.amount === 'number' ? q.amount : null
    const choices = q && 'choices' in q && Array.isArray(q.choices) ? q.choices as Message[] : []
    return { kind: q?.tag ?? null, label, amount, choices, window: q?.tag === 'ChooseOne' && q.isPlayerWindow === true }
  }

  // A short name for one answer button, so an unlabelled question can still say what is on offer.
  function describeChoice(m: Message): string | null {
    switch (m.tag) {
      case 'Label': case 'TooltipLabel': case 'SkillLabelWithLabel': case 'ScenarioLabel': case 'Done':
        return plainText(m.label) || null
      case 'TargetLabel': {
        if (m.target.label) return plainText(m.target.label)
        const id = typeof m.target.contents === 'string' ? m.target.contents : null
        const name = entityName(id)
        // A card offered from hand: say it is a card being played, not just its name.
        if (name && firstEngineAction(m.messages)?.key === 'playCard') return t('locationMap.status.choice.playCard', { name })
        return name
      }
      case 'AbilityLabel': {
        const name = sourceName(m.ability.source)
        return name ? t('locationMap.status.choice.useAbility', { name }) : null
      }
      case 'CardLabel': return nameOf(m.cardCode)
      case 'PortraitLabel': return nameOf(m.investigatorId)
      case 'SkillLabel': return t(`locationMap.status.skill.${m.skillType}`, m.skillType)
      case 'FightLabel': case 'FightLabelWithSkill':
        return t('locationMap.status.choice.fight', { name: entityName(m.enemyId) ?? '' })
      case 'EvadeLabel': case 'EvadeLabelWithSkill':
        return t('locationMap.status.choice.evade', { name: entityName(m.enemyId) ?? '' })
      case 'EngageLabel': return t('locationMap.status.choice.engage', { name: entityName(m.enemyId) ?? '' })
      case 'SkipTriggersButton': return t('locationMap.status.choice.skip')
      default: return null
    }
  }

  // "A / B / C (+2)" from the distinct named answers, or null when none can be named.
  function choicesSummary(choices: Message[]): string | null {
    const names = [...new Set(choices.map(describeChoice).filter((n): n is string => !!n))]
    if (names.length === 0) return null
    const shown = names.slice(0, 3).join(' / ')
    return names.length > 3 ? `${shown} (+${names.length - 3})` : shown
  }

  // What the game is busy resolving, most specific first.
  const doing = computed<string | null>(() => {
    const g = game()
    const test = g.skillTest
    if (test) {
      const skills = test.skills.map((s) => t(`locationMap.status.skill.${s}`, s)).join('/')
      const base = t('locationMap.status.skillTest', {
        who: entityName(test.investigator) ?? '', skill: skills, value: test.modifiedSkillValue, difficulty: test.modifiedDifficulty,
        source: sourceName(test.source as unknown as Parameters<typeof sourceName>[0]) ?? t('locationMap.status.unknownSource'),
      })
      const step = `locationMap.status.testStep.${test.step}`
      const result = test.result ? t(`locationMap.status.testResult.${test.result.tag}`, '') : ''
      return [base, result || (te(step) ? t(step) : '')].filter(Boolean).join(' · ')
    }
    if (g.activeCard) return t('locationMap.status.playing', { name: nameOf(toCardContents(g.activeCard).cardCode) })
    if (g.enemyAttackTargets.length > 0) {
      const names = [...new Set(g.enemyAttackTargets.map((a) => entityName(a.enemy)).filter(Boolean))]
      return t('locationMap.status.attacking', { names: names.join(', ') })
    }
    return null
  })

  // Where in the round the game is: the step number and what happens in it.
  const stepLine = computed<string | null>(() => {
    const step = game().phaseStep?.contents
    const key = step ? `locationMap.status.step.${step}` : null
    if (!step || !key || !te(key)) return null
    return [STEP_NO[step], t(key)].filter(Boolean).join(' · ')
  })

  const phase = computed(() => t(`locationMap.status.phase.${game().phase}`))
  const turnOf = computed(() => game().phase === 'InvestigationPhase' && game().activeInvestigatorId
    ? t('locationMap.status.turnOf', { name: nameOf(game().activeInvestigatorId!) }) : null)

  // One row per investigator the game is waiting on, the viewer's own first.
  const rows = computed<StatusRow[]>(() => {
    const g = game()
    return Object.values(g.investigators).flatMap((inv) => {
      const k = questionInfo(inv.playerId)
      if (!k.kind) return []
      const mine = inv.playerId === playerId()
      const who = nameOf(inv.id)
      const actions = g.phase === 'InvestigationPhase' && g.activeInvestigatorId === inv.id
        ? t('locationMap.status.actionsLeft', { count: inv.remainingActions }) : null
      if (k.window) return [{ id: inv.id, mine, who, text: t('locationMap.status.windowNow', { who }), detail: actions, effect: null, window: true }]
      const tooltip = ArkhamGame.choicesTooltip(g, inv.playerId)
      const kindText = t(`locationMap.status.kind.${k.kind}`, t('locationMap.status.kind.default'))
      const bare = !k.label && !tooltip
      const options = bare ? choicesSummary(k.choices) : null
      const context = bare ? choicesContext(k.choices) : { sourceId: null, intent: null }
      const lead = context.intent ?? kindText.replace(/[.:]\s*$/, '')
      const what = k.label ? plainText(k.label) : tooltip ? plainText(tooltip)
        : options ? t('locationMap.status.options', { kind: lead, options }) : context.intent ?? kindText
      const askedBy = ArkhamGame.choicesSource(g, inv.playerId)
      const fromId = askedBy ? sourceEntityId(askedBy) : context.sourceId
      const from = entityName(fromId)
      const count = k.amount !== null ? t(`locationMap.status.amount.${k.kind}`, { count: k.amount }, '') : ''
      return [{
        id: inv.id, mine, who, window: false,
        text: from ? t('locationMap.status.askFrom', { who, from, what }) : t('locationMap.status.ask', { who, what }),
        detail: [actions, count].filter(Boolean).join(' · ') || null,
        effect: bare ? effectText(fromId) : null,
      }]
    }).sort((a, b) => Number(b.mine) - Number(a.mine))
  })

  const over = computed(() => game().gameState.tag === 'IsOver')

  return { phase, turnOf, stepLine, doing, rows, over }
}
