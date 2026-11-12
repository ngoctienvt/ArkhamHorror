<script lang="ts" setup>
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import AbilityTextRow from '@/arkham/components/AbilityTextRow.vue'
import Question from '@/arkham/components/Question.vue';
import { useDebug } from '@/arkham/debug'
import { computed } from 'vue';
import { isCollectionSearch } from '@/arkham/collectionSearch';
import { ChaosBag } from '@/arkham/types/ChaosBag';
import * as Cards from '@/arkham/types/Card';
import { chaosTokenImage, customTokenKey, type TokenFace } from '@/arkham/types/ChaosToken';
import { chaosTokenEffectKey, symbolChaosTokenFaces } from '@/arkham/types/Scenario';
import { Game } from '@/arkham/types/Game';
import { Enemy } from '@/arkham/types/Enemy';
import { Modifier, cannotCommitCardsToWords } from '@/arkham/types/Modifier';
import { ChaosTokenFaceEffect, ChaosTokenValueEntry, SkillTest, chaosTokenEffectParts } from '@/arkham/types/SkillTest';
import { formatModifier, valueBadge, type TokenTier } from '@/arkham/referenceTokenX';
import TokenModifierBadge from '@/arkham/components/TokenModifierBadge.vue';
import { AbilityLabel, AbilityMessage, Message } from '@/arkham/types/Message'
import Draggable from '@/components/Draggable.vue';
import Card from '@/arkham/components/Card.vue'
import CommittedSkills from '@/arkham/components/CommittedSkills.vue';
import { MessageType, StartSkillTestButton } from '@/arkham/types/Message';
import * as ArkhamGame from '@/arkham/types/Game';
import { imgsrc, formatContent } from '@/arkham/helpers';
import { cardArt, cardImage, portraitImage, sourceCardCode } from '@/arkham/cardImages';
import ChaosBagView from '@/arkham/components/ChaosBag.vue';
import Token from '@/arkham/components/Token.vue';
import { useI18n } from 'vue-i18n';
import { chanceOfSuccess } from '@/arkham/chaosBagOdds';
import { useAbilityCardText } from '@/arkham/composables/useAbilityCardText';
import { sourceEntityId, kindOf, type AbilityKind } from '@/arkham/locationChoices';
import { useChaosDraw } from '@/arkham/composables/useChaosDraw';
import { useCardNames } from '@/arkham/composables/useCardNames';

const debug = useDebug()
const { t } = useI18n()
const props = defineProps<{
  game: Game
  skillTest: SkillTest
  chaosBag: ChaosBag
  playerId: string
}>()

const normalizeSkill = (skill: string) => {
  switch (skill) {
    case 'SkillWillpower': return 'willpower'
    case 'SkillIntellect': return 'intellect'
    case 'SkillCombat': return 'combat'
    case 'SkillAgility': return 'agility'
    default: return skill
  }
}

/* Painted art for the four printed skills; anything else (wild…) keeps its font glyph. */
const SKILL_ART = new Set(['willpower', 'intellect', 'combat', 'agility'])
const skillImage = (skill: string): string | null =>
  SKILL_ART.has(skill) ? imgsrc(`icons/skills/${skill}.png`) : null

/* The panel takes the colour of the skill being tested (a single one; mixed or
 * wild tests keep the neutral brass theme). */
const themeClass = computed(() => {
  const only = skills.value.length === 1 ? skills.value[0] : null
  return only && ['willpower', 'intellect', 'combat', 'agility'].includes(only) ? `skill-test--${only}` : null
})

const skills = computed(() => {
  const { skillTest } = props
  return skillTest.skills.map(normalizeSkill)
})
/* While the drawn token is still in the bag (ChaosDrawAnimation), nothing that
 * follows from it is shown: not the total, not the result, not its effects. */
const { isDrawing } = useChaosDraw()
const skillTestResults = computed(() => isDrawing.value ? null : props.game.skillTestResults)
const emit = defineEmits(['choose'])
const shouldRender = (mod: Modifier) => {
  const { type } = mod
  if (!('tag' in type)) return false
  if (type.tag === 'DiscoveredClues') return true
  if (type.tag === 'CancelEffects') return true
  if (type.tag === 'DamageDealt') return true
  if (type.tag === 'AnySkillValue') return true
  if (type.tag === 'SkillModifier') return true
  if (type.tag === 'ActionSkillModifier') return type.action === props.skillTest.action
  if (type.tag === 'AddSkillValue') return true
  if (type.tag === 'RevealAnotherChaosToken') return true
  if (type.tag === 'DoubleSuccess') return true
  if (type.tag === 'DoubleDifficulty') return true
  if (type.tag === 'AutomaticallyFailIfSucceedByAtLeast') return true
  if (type.tag === 'CannotCommitCards')
    return props.playerId == props.game.investigators[props.skillTest.investigator].playerId
  if (type.tag === 'OtherModifier' && type.contents === 'MayIgnoreLocationEffectsAndKeywords') return true
  if (type.tag === 'OtherModifier' && type.contents === 'SkillIconsSubtract') return true
  return false
}

const shouldRenderYourModifiers = (mod: Modifier) => {
  const { type } = mod
  if (!('tag' in type)) return false
  if (props.game.investigators[props.skillTest.investigator].playerId === props.playerId) return false
  if (type.tag === 'CannotCommitCards') return true
  return false
}

const yourModifiers = computed(() => {
  const investigator = Object.values(props.game.investigators).find((i) => i.playerId === props.playerId)
  if (!investigator) return []
  return (investigator.modifiers ?? []).filter(shouldRenderYourModifiers)
})

const shouldRenderSkillTestModifier = (mod: Modifier) => {
  // Chaos token values are listed per token in the token-effects bars, attributed
  // to the card that added them, so a pill would duplicate them. The decoder has
  // no case for this tag, so it arrives through the OtherModifier catch-all and
  // rendered as a textless pill anyway.
  if (mod.type.tag === 'OtherModifier' && mod.type.contents === 'AddChaosTokenValue') return false
  return mod.type.tag !== 'MetaModifier' || mod.type.contents === 'ThreeAces1'
}

const modifiers = computed(() =>
  [...(props.game.investigators[props.skillTest.investigator]?.modifiers ?? []).
    filter(shouldRender), ...yourModifiers.value, ...(props.skillTest.modifiers ?? []).filter(shouldRenderSkillTestModifier)]) 

/* How much a modifier adds to the tested skill, when it is a plain number. */
function modifierAmount(mod: Modifier): number | null {
  const { type } = mod
  if (type.tag === 'SkillModifier' || type.tag === 'ActionSkillModifier')
    return skills.value.includes(normalizeSkill(type.skillType)) ? type.value : null
  if (type.tag === 'AnySkillValue') return type.contents
  return null
}

/* With the "5 = 4 + 1" line showing, the numeric bonuses are already named there, so
 * only the other effects (cancel, double difficulty…) keep a pill of their own. */
const listedModifiers = computed(() =>
  skillBreakdown.value ? modifiers.value.filter((mod) => modifierAmount(mod) === null) : modifiers.value)

const cardName = useCardNames()

/* The card a modifier comes from, by name ("Higher Education"), so each bonus says where it is from. */
function modifierSourceName(mod: Modifier): string | null {
  const code = modifierSource(mod)
  return code ? cardName(code) : null
}

type BreakdownPart = { value: number; label: string }

function committedShareLabel(): string {
  const cards = committedCards.value
  if (cards.length === 1) return cardName(Cards.toCardContents(cards[0]).cardCode)
  if (cards.length > 1) return t('skillTest.breakdownCommitted')
  return t('skillTest.breakdownOther')
}

/* "5 = 4 + 1": the printed skill plus each numeric bonus with its source. Only for a
 * single-skill test on the investigator's own skill, before the token is resolved. */
const skillBreakdown = computed<{ total: number; parts: BreakdownPart[] } | null>(() => {
  if (skillTestResults.value !== null) return null
  if (props.skillTest.baseValue.tag !== 'SkillBaseValue' || skills.value.length !== 1) return null
  const investigator = props.game.investigators[props.skillTest.investigator]
  const skill = skills.value[0]
  if (!investigator || !(skill === 'willpower' || skill === 'intellect' || skill === 'combat' || skill === 'agility')) return null
  const base = investigator[skill]
  const bonuses = modifiers.value.flatMap((mod): BreakdownPart[] => {
    const value = modifierAmount(mod)
    return value === null || value === 0 ? [] : [{ value, label: modifierSourceName(mod) ?? t('skillTest.breakdownOther') }]
  })
  const total = skillValue.value
  const unexplained = total - base - bonuses.reduce((sum, part) => sum + part.value, 0)
  const parts = [{ value: base, label: t('skillTest.breakdownBase') }, ...bonuses]
  // The client is not sent the committed cards' printed icons, but the engine's value
  // already counts them: what is left over is their share. One card gets its name.
  if (unexplained !== 0) parts.push({ value: unexplained, label: committedShareLabel() })
  return parts.length > 1 ? { total, parts } : null
})

const committedCards = computed(() => props.skillTest.committedCards)
const choices = computed(() => ArkhamGame.choices(props.game, props.playerId))
const collectionSearch = computed(() => isCollectionSearch(props.game, props.playerId))

const skipTriggersAction = computed(() => choices.value.findIndex((c) => c.tag === MessageType.SKIP_TRIGGERS_BUTTON))

const investigatorPortrait = computed(() => {
  const choice = choices.value.find((c): c is StartSkillTestButton => c.tag === MessageType.START_SKILL_TEST_BUTTON)
  if (choice) {
    const player = props.game.investigators[choice.investigatorId]
    const code = (player.form.tag === "YithianForm" || player.form.tag === "HomunculusForm" || player.form.tag === "ShatteredForm")
      ? choice.investigatorId
      : player.cardCode
    return portraitImage(code)
  }

  if (props.skillTest) {
    const player = props.game.investigators[props.skillTest.investigator]
    const code = (player.form.tag === "YithianForm" || player.form.tag === "HomunculusForm" || player.form.tag === "ShatteredForm")
      ? props.skillTest.investigator
      : player.cardCode
    return portraitImage(code)
  }

  return null;
})

function isAbility(v: Message): v is AbilityLabel {
  if ("ability" in v) {
    const ability = v.ability
    if ("source" in ability) {
      const { source } = ability

      if (source.sourceTag === 'ProxySource') {
        return source.source.tag === 'SkillTestSource'
      }
    }
  }

  return false
}

const abilities = computed<AbilityMessage[]>(() => {
  return choices.value
    .reduce<AbilityMessage[]>((acc, v, i) =>
      isAbility(v) ? [...acc, { contents: v, displayAsAction: false, index: i}] : acc
    , [])
})


/* Every other ability the player may use right now (Higher Education, fast
 * cards in play, reactions...), listed in the panel with its card's name and
 * printed line so the player can follow what is available during the test
 * without looking at the side panel. Skill-test-sourced ones are shown above. */
const { lookup, attachText } = useAbilityCardText(() => props.game)

type TriggerRow = { index: number; contents: AbilityLabel; name: string | null; sourceId: string | null; kind: AbilityKind | null; text: string | null }

const triggers = computed<TriggerRow[]>(() => {
  const shown = new Set(abilities.value.map((a) => a.index))
  const rows = choices.value.flatMap((choice, index): TriggerRow[] => {
    if (choice.tag !== MessageType.ABILITY_LABEL || shown.has(index) || choice.ability.basic) return []
    const sourceId = sourceEntityId(choice.ability.source)
    if (sourceId && (props.game.acts[sourceId] || props.game.agendas[sourceId])) return []
    const name = sourceId ? lookup(sourceId)?.name ?? null : null
    return [{ index, contents: choice, name, sourceId, kind: kindOf(choice), text: null }]
  })
  return attachText(rows)
})

/* Cards in this player's hand the game offers to commit right now, so they can
 * be picked from the panel instead of the hand row. Each player sees only the
 * cards their own choices offer, so in multiplayer every investigator allowed
 * to help commits from their own panel. */
const committableCards = computed(() => {
  if (props.skillTest.step !== 'CommitCardsFromHandToSkillTestStep') return []
  const me = Object.values(props.game.investigators).find((i) => i.playerId === props.playerId)
  if (!me) return []
  const hand = new Map(me.hand.map((card) => [Cards.toCardContents(card).id, Cards.toCardContents(card)]))
  // A card already picked shows in the "to be committed" row below (where clicking it uncommits),
  // so it is dropped here instead of appearing twice.
  const committed = new Set(committedCards.value.map((card) => Cards.toCardContents(card).id))
  return choices.value.flatMap((choice, index) => {
    if (choice.tag !== MessageType.TARGET_LABEL) return []
    if (typeof choice.target.contents === 'string' && committed.has(choice.target.contents)) return []
    const card = typeof choice.target.contents === 'string' ? hand.get(choice.target.contents) : undefined
    return card ? [{ index, id: card.id, image: cardImage(card.cardCode) }] : []
  })
})

/* A mouse wheel over the commit row scrolls it sideways while it has room to move;
 * at either end the wheel goes back to scrolling the panel. */
function scrollRowSideways(event: WheelEvent) {
  const row = event.currentTarget as HTMLElement
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || row.scrollWidth <= row.clientWidth) return
  const atStart = row.scrollLeft <= 0 && event.deltaY < 0
  const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1 && event.deltaY > 0
  if (atStart || atEnd) return
  event.preventDefault()
  row.scrollLeft += event.deltaY
}

async function choose(idx: number) {
  emit('choose', idx)
}

function modifierSource(mod: Modifier) {
  if(mod.card) {
    return cardArt(Cards.toCardContents(mod.card).cardCode)
  }

  return sourceCardCode(mod.source, props.game)
}

const concealedTarget = computed(() => {
  // ConcealedCardTarget carries the mini-card's id, and targetDecoder flattens a
  // ProxyTarget down to the proxied target's contents, so both land here as a string
  const contents = props.skillTest.target?.contents
  if (typeof contents !== 'string') return null
  return props.game.concealed[contents] ?? null
})

const isConcealed = computed(() => {
  if (concealedTarget.value) return true
  return props.skillTest.source.tag === 'AbilitySource' && props.skillTest.source.contents[0].tag === 'ConcealedCardSource'
})

// a concealed mini-card has no card to show, and falling back to the source would
// put the attacking asset in the target slot
const targetCardId = computed(() =>
  props.skillTest.targetCard ?? (isConcealed.value ? null : props.skillTest.sourceCard)
)

const targetCard = computed(() => {
  if (!targetCardId.value) return null
  return props.game.cards[targetCardId.value]
})

const cardIsRevealed = (cardId: string | null | undefined) => {
  if (!cardId) return true
  const location = Object.values(props.game.locations).find(
    (candidate) => candidate.cardId === cardId,
  )
  return location?.revealed ?? true
}

const targetCardRevealed = computed(() => !isFlippedAgendaCard(targetCardId.value) && cardIsRevealed(targetCardId.value))

type SwarmEnemy = Omit<Enemy, "placement"> & {
  placement: { tag: "AsSwarm"; swarmHost: string; swarmCard: Cards.Card };
};

const swarmEnemy = computed<SwarmEnemy | null>(() => {
  let enemy = Object.values(props.game.enemies).find((e): e is SwarmEnemy => {
    if (e.placement.tag !== 'AsSwarm') return false
    return Cards.toCardContents(e.placement.swarmCard).id === props.skillTest.targetCard
  })
  if (!enemy) return null
  return {...enemy}
})

const swarmHost = computed(() => {
  if (!swarmEnemy.value) return null
  return props.game.cards[props.game.enemies[swarmEnemy.value.placement.swarmHost].cardId]
})

/* The enemy being tested stands on a card from someone's deck (The Myriad
 * Gentleman's copies), so its entity id is that deck card's and `targetCard`
 * resolves to the deck card rather than to the enemy. Read it off the entity
 * instead and draw it the way a swarm card is drawn: a player back beside the
 * enemy's own card. A weakness enemy IS its player card, so its codes match and
 * this leaves it alone. */
const deckCardEnemy = computed(() => {
  if (!targetCardId.value || swarmEnemy.value) return null
  const physical = targetCard.value
  if (!physical || physical.tag !== 'PlayerCard') return null
  const code = Cards.toCardContents(physical).cardCode
  return (
    Object.values(props.game.enemies).find(
      (e) => e.cardId === targetCardId.value && e.cardCode !== code,
    ) ?? null
  )
})

const deckCardEnemyCard = computed<Cards.Card | null>(() => {
  const enemy = deckCardEnemy.value
  if (!enemy || !targetCard.value) return null
  return {
    tag: 'EncounterCard',
    contents: { ...Cards.toCardContents(targetCard.value), cardCode: enemy.cardCode },
  }
})

const sourceCard = computed(() => {
  if (!props.skillTest.sourceCard) return null
  if (props.skillTest.sourceCard === props.skillTest.targetCard) return null
  const card = props.game.cards[props.skillTest.sourceCard]
  if (targetCard.value === card) return null
  return card ? sideShown(card, props.skillTest.sourceCard) : card
})

/* A test made by an agenda's back side (e.g. 1b) runs while the agenda is flipped, or after the
 * next agenda has already replaced it, but the card record still holds its front face. Show the
 * back unless the agenda is still in play unflipped (an ability printed on its front side). */
const sourceAgendaFlipped = computed(() => {
  const { source } = props.skillTest
  if (source.tag !== 'AgendaSource' || typeof source.contents !== 'string') return false
  const agenda = props.game.agendas[source.contents]
  return agenda ? agenda.flipped : true
})

/* The agenda's card, as the side it is on: the source slot, and the target slot when a test aimed
 * at an investigator falls back to showing the source card there. */
const isFlippedAgendaCard = (cardId: string | null | undefined) =>
  !!cardId && cardId === props.skillTest.sourceCard && sourceAgendaFlipped.value
const sideShown = (card: Cards.Card, cardId: string | null | undefined): Cards.Card =>
  isFlippedAgendaCard(cardId) ? { tag: 'EncounterCard', contents: { ...Cards.toCardContents(card), isFlipped: true } } : card

const sourceCardRevealed = computed(() => !isFlippedAgendaCard(props.skillTest.sourceCard) && cardIsRevealed(props.skillTest.sourceCard))
const targetCardShown = computed(() => targetCard.value ? sideShown(targetCard.value, targetCardId.value) : null)

const applyResultsAction = computed(() => {
  return choices.value.findIndex((c) => c.tag === "SkillTestApplyResultsButton");
})

const skillValue = computed(() => {
  const result = skillTestResults.value
  const cap = (a: number) => Math.max(0, a)
  if (result !== null) {
    const {skillTestResultsSkillValue, skillTestResultsIconValue, skillTestResultsChaosTokensValue } = result
    return cap(skillTestResultsSkillValue + skillTestResultsIconValue + skillTestResultsChaosTokensValue)
  } else {
    return cap(props.skillTest.modifiedSkillValue)
  }
})

const testResult = computed(() => {
  const result = skillTestResults.value
  if (result !== null) {
    // A forced result (Scrape By (1), Lab Coat (1)) overrides the tested values,
    // so it can't be derived from them -- take the engine's own answer.
    const forced = props.skillTest.resultForced ? props.skillTest.result?.contents?.[1] : undefined
    if (forced !== undefined) return forced
    const {skillTestResultsDifficulty} = result
    return skillValue.value - skillTestResultsDifficulty
  } else {
    return null
  }
})

const focusedChaosTokens = computed(() => {
  const skillTestTokenIds = new Set(props.game.skillTestChaosTokens.map((token) => token.id))
  return props.game.focusedChaosTokens.filter((token) => !skillTestTokenIds.has(token.id))
})

/* The drawn token's value from the scenario's own rule ("-X. X is ...", already counted by the engine), for
 * the badge beside its printed effect. Card effects on the face are listed in their own bars with their own
 * values, so they are taken back out here rather than counted twice. Null when the server sent no breakdown. */
function scenarioBadge(entry: ChaosTokenValueEntry | undefined): { label: string; tier: TokenTier } | null {
  if (!entry) return null
  if (entry.autoFail) return { label: t('locationMap.referenceX.autoFail'), tier: 'fail' }
  if (entry.autoSuccess) return { label: t('locationMap.referenceX.autoSuccess'), tier: 'good' }
  if (entry.value === null) return null
  const fromCards = entry.effects.reduce((n, e) => n + (e.value ?? 0), 0)
  const { modifier, tier } = valueBadge(entry.value - fromCards)
  return modifier === null ? null : { label: formatModifier(modifier), tier }
}

const tokenEffects = computed(() => {
  const scenario = props.game.scenario
  const tokens = props.skillTest.resolvedChaosTokens.length > 0
    ? props.skillTest.resolvedChaosTokens
    : props.skillTest.revealedChaosTokens
  const skillTestTokens = new Map(props.game.skillTestChaosTokens.map((token) => [token.id, token]))
  const faces = tokens.flatMap((token) => {
    const displayedToken = skillTestTokens.get(token.id) ?? token
    return displayedToken.modifiedFaces?.length ? displayedToken.modifiedFaces : [token.face]
  })

  // Cards that registered an effect on a face, from the engine's own breakdown.
  const cardEffects = new Map<TokenFace, ChaosTokenFaceEffect[]>()
  const breakdown = new Map<TokenFace, ChaosTokenValueEntry>()
  for (const entry of props.skillTest.valueBreakdown?.tokens ?? []) {
    breakdown.set(entry.face, entry)
    if (entry.effects.length > 0) cardEffects.set(entry.face, entry.effects)
  }

  // The printed symbols first, in their canonical order, then any homebrew token
  // that came out, in the order it was revealed, then any other revealed face a
  // card is acting on — a card effect can land on a numeric token too.
  const effectFaces = [
    ...(symbolChaosTokenFaces as readonly TokenFace[]).filter((face) => faces.includes(face)),
    ...new Set(faces.filter((face) => customTokenKey(face) !== null)),
  ]
  for (const face of new Set(faces)) {
    if (!effectFaces.includes(face) && cardEffects.has(face)) effectFaces.push(face)
  }

  return effectFaces
    .flatMap((face) => {
      // Scenarios without a `tokens` block in their locale (every homebrew one
      // so far) get the key back from `t`; showing it would leak the raw path.
      const key = scenario ? chaosTokenEffectKey(scenario, face) : null
      const text = key ? t(key) : null
      const html = text && text !== key ? formatContent(text) : null

      // Card effects sit beneath the scenario's printed effect rather than
      // replacing it, so a drawn token shows both. Each becomes its own bar.
      const cards = (cardEffects.get(face) ?? []).map((effect) => {
        const { value, text } = chaosTokenEffectParts(effect, t)
        return {
          name: effect.name,
          value,
          text: text === null ? null : formatContent(text),
          applied: effect.applied,
        }
      })

      if (!html && cards.length === 0) return []
      return [{ face, image: chaosTokenImage(face), html, cards, badge: scenarioBadge(breakdown.get(face)) }]
    })
})

/* The eight printed skill test steps plus the two player windows, in order.
 * `label` is the short chip text; fast windows show the {fast} glyph instead. */
const testSteps = [
  { step: 'DetermineSkillOfTestStep', label: '1', key: 'skillTest.determineSkillOfTestStep' },
  { step: 'SkillTestFastWindow1', label: null, key: 'skillTest.fastWindowBeforeCommit' },
  { step: 'CommitCardsFromHandToSkillTestStep', label: '2', key: 'skillTest.commitCardsFromHandToSkillTestStep' },
  { step: 'SkillTestFastWindow2', label: null, key: 'skillTest.fastWindowBeforeReveal' },
  { step: 'RevealChaosTokenStep', label: '3', key: 'skillTest.revealChaosTokenStep' },
  { step: 'ResolveChaosSymbolEffectsStep', label: '4', key: 'skillTest.resolveChaosSymbolEffectsStep' },
  { step: 'DetermineInvestigatorsModifiedSkillValueStep', label: '5', key: 'skillTest.determineInvestigatorsModifiedSkillValueStep' },
  { step: 'DetermineSuccessOrFailureOfSkillTestStep', label: '6', key: 'skillTest.determineSuccessOrFailureOfSkillTestStep' },
  { step: 'ApplySkillTestResultsStep', label: '7', key: 'skillTest.applySkillTestResultsStep' },
  { step: 'SkillTestEndsStep', label: '8', key: 'skillTest.skillTestEndsStep' },
] as const

const currentStepIndex = computed(() => testSteps.findIndex((s) => s.step === props.skillTest.step))
const currentStep = computed(() => testSteps[currentStepIndex.value] ?? null)


/* Chance to win against what is left in the bag, shown beside the title until
 * the test has a result. */
const winOdds = computed(() => {
  const b = props.skillTest.valueBreakdown
  if (!b || skillTestResults.value) return null
  return Math.round(chanceOfSuccess(b, b.skillValue, b.difficulty) * 100)
})

const createModifier = (target: {tag: string, contents: string}, modifier: {tag: string, contents: unknown}) =>
  debug.skillTestModifier(props.game.id, props.skillTest.id, target, modifier)

const adjustDebugSkillValue = (event: MouseEvent, direction: 1 | -1) => {
  const amount = event.shiftKey ? 5 : 1
  createModifier(
    { tag: 'InvestigatorTarget', contents: props.skillTest.investigator },
    { tag: 'AnySkillValue', contents: direction * amount },
  )
}
</script>

<template>
  <Draggable
    width="min(680px, calc(100vw - 32px))"
    avoid-selector=".concealed-card--can-interact, .location-cell--can-interact, .location-cell--can-interact .location-wrapper, .location-cell--can-interact .card-frame"
  >
    <template #handle>
      <h2 class="skill-test-title">
        {{ $t('skillTestTitle') }}
        <span
          v-if="winOdds !== null"
          class="win-odds"
          v-tooltip="$t('skillTest.winOddsHint')"
        >{{ $t('skillTest.winOdds', { n: winOdds }) }}</span>
      </h2>
    </template>
    <div class="skill-test" :class="[{ 'skill-test--drawing': isDrawing }, themeClass]">
      <div class="steps">
        <div
          v-for="(s, i) in testSteps"
          :key="s.step"
          v-tooltip="{ content: formatContent($t(s.key)), html: true }"
          class="step"
          :class="{ active: i === currentStepIndex, done: currentStepIndex !== -1 && i < currentStepIndex, fast: s.label === null }"
        >
          <span v-if="s.label">{{ s.label }}</span>
          <span v-else v-html="formatContent('{fast}')" />
        </div>
      </div>
      <div v-if="currentStep" class="step-caption">
        <span class="step-caption__badge">
          <template v-if="currentStep.label">{{ $t('skillTest.stepOf', { n: currentStep.label, total: 8 }) }}</template>
          <span v-else v-html="formatContent('{fast}')" />
        </span>
        <span class="step-caption__text" v-html="formatContent($t(currentStep.key))" />
      </div>
      <div class="skill-test-contents">
        <div v-if="swarmEnemy || deckCardEnemy" class="target-card swarming">
          <div class="swarm">
            <img :src="imgsrc('backs/back_player.jpg')" class="card" />
          </div>
          <div v-if="swarmHost ?? deckCardEnemyCard" class="host">
            <Card :game="game" :card="(swarmHost ?? deckCardEnemyCard)!" :revealed="true" playerId="" />
          </div>
        </div>
        <Card
          v-else-if="targetCardShown"
          :game="game"
          :card="targetCardShown"
          class="target-card"
          :revealed="targetCardRevealed"
          playerId=""
        />
        <img
          v-else-if="isConcealed"
          :src="imgsrc('mini-cards/concealed-card.jpg')"
          class="target-card concealed"
          :data-image="imgsrc('mini-cards/concealed-card.jpg')"
        />
        <div class="test-status">
          <div class="test-difficulty stat">
            <div class="stat__value">
              <button
                  v-if="debug.active"
                  type="button"
                  class="debug-stepper-button"
                  @click="createModifier({tag: 'SkillTestTarget', contents: skillTest.id}, {tag: 'Difficulty', contents: -1})"
              >-</button>
              <span class="difficulty">{{skillTest.modifiedDifficulty}}</span>
              <span v-if="skills.length > 0" class="stat__skills">
                <i v-for="(skill, idx) in skills" :key="idx" :class="`${skill}-icon`" :style="{ color: `var(--${skill})` }" :title="skill"></i>
              </span>
              <button
                  v-if="debug.active"
                  type="button"
                  class="debug-stepper-button"
                  @click="createModifier({tag: 'SkillTestTarget', contents: skillTest.id}, {tag: 'Difficulty', contents: 1})"
              >+</button>
            </div>
          </div>
          <!-- Both sides carry the tested skill's icon ("1 [book] vs 5 [book]"), so the comparison reads at a glance. -->
          <div class="vs">
            <span class="vs__text">VS</span>
          </div>
          <div class="modified-skill stat">
            <div class="stat__value">
              <button
                  v-if="debug.active"
                  type="button"
                  class="debug-stepper-button"
                  @click="adjustDebugSkillValue($event, -1)"
              >-</button>
              <span class="skill">{{skillValue}}</span>
              <span v-if="skills.length > 0" class="stat__skills">
                <i v-for="(skill, idx) in skills" :key="idx" :class="`${skill}-icon`" :style="{ color: `var(--${skill})` }" :title="skill"></i>
              </span>
              <span v-else-if="skillTest.baseValue.tag === 'HalfResourcesOf'" class="half-resources">
                <img :src="imgsrc(`tokens/resource.png`)" /> / 2
              </span>
              <button
                  v-if="debug.active"
                  type="button"
                  class="debug-stepper-button"
                  @click="adjustDebugSkillValue($event, 1)"
              >+</button>
            </div>
          </div>
        </div>
        <div class="test-source">
          <img
            v-if="investigatorPortrait"
            class="portrait"
            :src="investigatorPortrait"
          />
          <Card
            v-if="sourceCard"
            :game="game"
            :card="sourceCard"
            :revealed="sourceCardRevealed"
            playerId=""
          />
        </div>
      </div>
      <ChaosBagView
        :game="game"
        :chaosBag="chaosBag"
        :skillTest="skillTest"
        :playerId="playerId"
        @choose="choose"
      />
      <div v-if="focusedChaosTokens.length > 0" class="focused-chaos-tokens">
        <Token v-for="focusedToken in focusedChaosTokens" :key="focusedToken.id" :token="focusedToken" :playerId="playerId" :game="game" @choose="choose" />
      </div>
      <div v-if="tokenEffects.length > 0" class="token-effects">
        <template v-for="effect in tokenEffects" :key="effect.face">
          <div class="token-effect">
            <div class="token-effect__token"><img :src="effect.image" /></div>
            <div class="token-effect__text">
              <span v-if="effect.html" class="token-effect__line">
                <TokenModifierBadge v-if="effect.badge" class="token-effect__badge" :label="effect.badge.label" :tier="effect.badge.tier" />
                <span v-html="effect.html"></span>
              </span>
            </div>
          </div>
          <div
            v-for="(card, i) in effect.cards"
            :key="`${effect.face}-${i}`"
            class="token-addon"
            :class="{ 'token-addon--pending': !card.applied }"
          >
            <div class="token-addon__body">
              <span v-if="card.name" class="token-addon__name">{{ card.name }}</span>
              <span v-if="card.text" class="token-addon__text" v-html="card.text"></span>
            </div>
            <div v-if="card.value" class="token-addon__value">{{ card.value }}</div>
          </div>
        </template>
      </div>
      <div v-if="debug.active && skillTest.result?.tag == 'Unrun' && !['SkillTestFastWindow1', 'SkillTestFastWindow2'].includes(skillTest.step)">
        <button @click="debug.send(game.id, {tag: 'SkillTestMessage', contents: {tag: 'PassSkillTest_'}})">{{ $t('skillTestActions.passSkillTest') }}</button>
        <button @click="debug.send(game.id, {tag: 'SkillTestMessage', contents: {tag: 'FailSkillTest_'}})">{{ $t('skillTestActions.failSkillTest') }}</button>
      </div>
      <div v-if="committableCards.length > 0" class="committable">
        <h3 class="triggers__title">{{ $t('skillTest.committableCards') }}</h3>
        <div class="committable__row" @wheel="scrollRowSideways">
          <button
            v-for="card in committableCards"
            :key="card.id"
            type="button"
            class="committable__card"
            :data-image="card.image"
            @click="choose(card.index)"
          ><img :src="card.image" :alt="''" /></button>
        </div>
      </div>
      <div v-if="committedCards.length > 0" class="committed-skills" key="committed-skills">
        <template v-if="skillTest.step === 'CommitCardsFromHandToSkillTestStep'">
          <h2>{{t('toBeCommitted')}}</h2>
        </template>
        <template v-else>
          <h2>{{t('committedCards')}}</h2>
        </template>
        <div class="skills-container">
          <CommittedSkills
            :game="game"
            :cards="committedCards"
            :playerId="playerId"
            @choose="$emit('choose', $event)"
          />
        </div>
      </div>
      <!-- Bonuses already in force on this test (a weapon's +1 combat / +1 damage…), not commit options:
           labelled so they don't read as part of the commit row, and hovering one shows its source card. -->
      <div v-if="modifiers.length > 0 || skillBreakdown" class="modifiers">
        <h3 class="triggers__title modifiers__title" :title="$t('skillTest.activeModifiersHint')">{{ $t('skillTest.skillValueLabel') }}</h3>
        <!-- "5 = 4 + 1": where the tested value comes from, each part named. -->
        <div v-if="skillBreakdown" class="skill-breakdown">
          <span class="skill-breakdown__part skill-breakdown__part--total">
            <span class="skill-breakdown__chip">
              <span class="skill-breakdown__num">{{ skillBreakdown.total }}</span>
              <i :class="`${skills[0]}-icon`" :style="{ color: `var(--${skills[0]})` }"></i>
            </span>
          </span>
          <span class="skill-breakdown__op">=</span>
          <template v-for="(part, i) in skillBreakdown.parts" :key="i">
            <span v-if="i > 0" class="skill-breakdown__op">{{ part.value < 0 ? '−' : '+' }}</span>
            <span class="skill-breakdown__part">
              <span class="skill-breakdown__chip">
                <span class="skill-breakdown__num">{{ Math.abs(part.value) }}</span>
                <i :class="`${skills[0]}-icon`" :style="{ color: `var(--${skills[0]})` }"></i>
              </span>
              <small class="skill-breakdown__label">{{ part.label }}</small>
            </span>
          </template>
        </div>
        <div v-for="(modifier, idx) in listedModifiers" :key="idx" class="modifier" :class="{ 'sideways': modifier.source.tag === 'InvestigatorSource' }" :data-image-id="modifierSource(modifier)">
          <template v-if="modifier.type.tag === 'CannotCommitCards'">
            <span>{{cannotCommitCardsToWords(modifier.type)}}</span>
          </template>
          <template v-if="modifier.type.tag === 'Difficulty'">
            <span><template v-if="modifier.type.contents >= 0">+</template>{{modifier.type.contents}}</span>
            {{ $t('modifier.difficulty') }}
          </template>
          <template v-if="modifier.type.tag === 'CancelEffects'">
            <span class="text">{{ $t('modifier.cancelEffects') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'CannotPerformSkillTest'">
            <span class="text">{{ $t('modifier.cannotPerformSkillTest') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'DiscoveredClues'">
            <span>+{{modifier.type.contents}}</span>
            <img :src="imgsrc(`tokens/clue.png`)" />
          </template>
          <template v-if="modifier.type.tag === 'SkillTestResultValueModifier'">
            <span class="text">{{ $t('modifier.result') }}</span> <span>{{modifier.type.contents > 0 ? '+' : ''}}{{modifier.type.contents}}</span>
          </template>
          <template v-if="modifier.type.tag === 'DamageDealt'">
            <span>+{{modifier.type.contents}}</span>
            <img :src="imgsrc(`damage.png`)" />
          </template>
          <template v-if="modifier.type.tag === 'AddSkillValue'">
            <span>+</span>
            <img v-if="skillImage(normalizeSkill(modifier.type.contents))" class="skill-art skill-art--badge" :src="skillImage(normalizeSkill(modifier.type.contents))!" :alt="normalizeSkill(modifier.type.contents)" />
            <i v-else
               :class="`${normalizeSkill(modifier.type.contents)}-icon`"
               class="skill-badge" :style="{ '--skill': `var(--${normalizeSkill(modifier.type.contents)})` }"
            ></i>
          </template>
          <template v-if="modifier.type.tag === 'SkillModifier'">
            <span>+{{modifier.type.value}}</span>
            <img v-if="skillImage(normalizeSkill(modifier.type.skillType))" class="skill-art skill-art--badge" :src="skillImage(normalizeSkill(modifier.type.skillType))!" :alt="normalizeSkill(modifier.type.skillType)" />
            <i v-else
               :class="`${normalizeSkill(modifier.type.skillType)}-icon`"
               class="skill-badge" :style="{ '--skill': `var(--${normalizeSkill(modifier.type.skillType)})` }"
            ></i>
          </template>
          <template v-if="modifier.type.tag === 'ActionSkillModifier'">
            <span>+{{modifier.type.value}}</span>
            <img v-if="skillImage(normalizeSkill(modifier.type.skillType))" class="skill-art skill-art--badge" :src="skillImage(normalizeSkill(modifier.type.skillType))!" :alt="normalizeSkill(modifier.type.skillType)" />
            <i v-else
               :class="`${normalizeSkill(modifier.type.skillType)}-icon`"
               class="skill-badge" :style="{ '--skill': `var(--${normalizeSkill(modifier.type.skillType)})` }"
            ></i>
          </template>
          <template v-if="modifier.type.tag === 'AnySkillValue'">
            <span> {{modifier.type.contents}}</span>
            <span class="text">{{ $t('modifier.skillValue') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'DoubleSuccess'">
            <span class="text">{{ $t('modifier.doubleSuccess') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'DoubleDifficulty'">
            <span class="text">{{ $t('modifier.doubleDifficulty') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'AutomaticallyFailIfSucceedByAtLeast'">
            <span class="text">{{ $t('modifier.automaticallyFailIfSucceedByAtLeast', { amount: modifier.type.contents }) }}</span>
          </template>
          <template v-if="modifier.type.tag === 'OtherModifier' && modifier.type.contents === 'CancelAnyChaosToken'">
            <span class="text">{{ $t('modifier.cancelMatchingChaosTokensShort') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'OtherModifier' && modifier.type.contents === 'MayIgnoreLocationEffectsAndKeywords'">
            <span class="text">{{ $t('modifier.mayIgnoreLocationEffects') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'OtherModifier' && modifier.type.contents === 'ReturnBlessedToChaosBag'">
            <span class="text" v-html="formatContent($t('modifier.returnBlessedToChaosBag'))"></span>
          </template>
          <template v-if="modifier.type.tag === 'OtherModifier' && modifier.type.contents === 'SkillIconsSubtract'">
            <span class="text">{{ $t('modifier.skillIconsSubtract') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'OtherModifier' && modifier.type.contents === 'SkillTestAutomaticallySucceeds'">
            <span class="text">{{ $t('modifier.skillTestAutomaticallySucceeds') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'MetaModifier' && modifier.type.contents === 'ThreeAces1'">
            <span class="text">{{ $t('modifier.skillTestAutomaticallySucceeds') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'OtherModifier' && modifier.type.contents === 'RevealAnotherChaosToken'">
            <span class="text">{{ $t('modifier.revealAnotherChaosToken') }}</span>
          </template>
          <template v-if="modifier.type.tag === 'OtherModifier' && modifier.type.contents === 'CancelAnyChaosTokenAndDrawAnother'">
            <span class="text">{{ $t('modifier.cancelMatchingChaosTokens') }}</span>
          </template>
          <span v-if="modifierSourceName(modifier)" class="modifier__source">{{ modifierSourceName(modifier) }}</span>
        </div>
      </div>
      <AbilityButton
        v-for="ability in abilities"
        :key="ability.index"
        :ability="ability.contents"
        :tooltipIsButtonText="true"
        :game="game"
        @click="choose(ability.index)"
        />

      <div v-if="triggers.length > 0" class="triggers">
        <h3 class="triggers__title">{{ $t('skillTest.availableTriggers') }}</h3>
        <div v-for="trigger in triggers" :key="trigger.index" class="trigger" @click="choose(trigger.index)">
          <span v-if="trigger.name" class="trigger__name">{{ trigger.name }}</span>
          <AbilityTextRow v-if="trigger.text" class="trigger__line" :kind="trigger.kind" :html="trigger.text" @choose="choose(trigger.index)" @click.stop />
          <AbilityButton v-else class="trigger__button" :game="game" :ability="trigger.contents" @choose="choose(trigger.index)" @click.stop />
        </div>
      </div>

      <div v-if="skillTestResults" class="skill-test-results" :class="{ success: skillTestResults.skillTestResultsSuccess, failure: !skillTestResults.skillTestResultsSuccess}">
        <span v-if="skillTestResults.skillTestResultsSuccess">
          {{ $t('succeededBy', { amount: Math.abs((testResult ?? 0) + (skillTestResults.skillTestResultsResultModifiers || 0)) }) }}
        </span>
        <span v-else-if="testResult !== null">
          {{ $t('failedBy', { amount: Math.abs(testResult - (skillTestResults.skillTestResultsResultModifiers || 0)) }) }}
        </span>
      </div>

      <div v-if="skillTestResults" class="skill-test-results-break"></div>
      <button
        v-if="skipTriggersAction !== -1"
        @click="$emit('choose', skipTriggersAction)"
        class="skip-triggers-button"
      >{{ $t('investigator.skipTriggers') }}</button>
      <Question v-if="!collectionSearch" :game="game" :playerId="playerId" @choose="choose" :isSkillTest="true" />
      <button
        class="apply-results"
        v-if="applyResultsAction !== -1"
        @click="choose(applyResultsAction)"
      >{{ $t('label.applyResults') }}</button>
    </div>
  </Draggable>
</template>

<style scoped src="./debug/stepper.css"></style>

<style lang="scss" scoped>
.skill-test {
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px); /* Safari support */
  background: #75968600;
  min-width: 0;
  max-width: 100%;
  text-align: center;
  z-index: var(--z-index-10);
  overflow: auto;

  .choices, :deep(.choices) {
    gap: 0px;
  }

  .question-choices, :deep(.question-choices) {
    gap: 0px;
    padding: 0;
  }
}

.skill-test {
  font-size: 16px;
  /* Neutral inner sheet; the themed window shows as a coloured rim around it. */
  background: #1f1f23;
  margin: 0 6px 6px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* The panel is a window over the map: an opaque warm-dark body with a brass edge,
 * so it no longer melts into the jungle art behind it. */
/* Theme: only the outer window (frame, title bar, edge) takes the tested skill's
 * colour; everything inside stays neutral grey so the cards and numbers read
 * cleanly. Mixed / wild tests keep the brass frame. */
:global(.draggable:has(.skill-test)) {
  --st-body: #26262a;
  --st-glow: rgba(255, 255, 255, 0.05);
  --st-accent: #d9d6cf;
  --st-accent-rgb: 217, 214, 207;
  --st-accent-strong: #4b4b52;
}
:global(.draggable:has(.skill-test)) {
  --st-panel: #2e2418;
  --st-header-from: #4d3a20;
  --st-header-to: #33261a;
  --st-edge: rgba(216, 178, 110, 0.9);
}
:global(.draggable:has(.skill-test--willpower)) {
  --st-panel: #1f3550;
  --st-header-from: #2f5480;
  --st-header-to: #213a58;
  --st-edge: rgba(127, 178, 224, 0.9);
}
:global(.draggable:has(.skill-test--intellect)) {
  --st-panel: #352549;
  --st-header-from: #53386f;
  --st-header-to: #3a2850;
  --st-edge: rgba(198, 154, 214, 0.9);
}
:global(.draggable:has(.skill-test--combat)) {
  --st-panel: #4a2420;
  --st-header-from: #6e322a;
  --st-header-to: #4f2722;
  --st-edge: rgba(224, 144, 128, 0.9);
}
:global(.draggable:has(.skill-test--agility)) {
  --st-panel: #1f4030;
  --st-header-from: #2d6045;
  --st-header-to: #22452f;
  --st-edge: rgba(143, 214, 168, 0.9);
}

:global(.draggable:has(.skill-test)) {
  background: var(--st-panel);
  border: 2px solid var(--st-edge);
  box-shadow: 0 0 0 1px #000, 0 12px 40px rgba(0, 0, 0, 0.85);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:global(.draggable:has(.skill-test) > header) {
  background: linear-gradient(180deg, var(--st-header-from), var(--st-header-to));
  border-bottom: 1px solid var(--st-edge);
}

/* Everything below the bag waits for the drawn token: its effects, the result,
 * the triggers it opens and the buttons that move past it. Committed cards and
 * modifiers were there before the draw, so they stay. */
.skill-test--drawing > .chaos-bag ~ :not(.committed-skills):not(.modifiers):not(.focused-chaos-tokens) {
  display: none;
}

/* Revealed chaos tokens inside the skill test panel only. */
.skill-test :deep(.token-container),
.skill-test :deep(.token-container .token) {
  width: min(80px, 16vw);
}

.committable {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.6);
  text-align: left;
}

.committable__row {
  /* One row only; extra cards scroll sideways instead of stacking into a wall. */
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 6px 2px 8px; /* room for the hover lift and the scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--st-accent-rgb), 0.6) transparent;
}

/* Beats the panel-wide full-width button rule: a card is its own size. */
.committable .committable__card {
  flex-shrink: 0;
  width: calc(var(--card-width) * 1.25);
  padding: 0;
  background: transparent;
  border: 2px solid rgba(var(--st-accent-rgb), 0.45);
  border-radius: 7px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background: transparent;
    transform: translateY(-4px);
    border-color: var(--st-accent);
    box-shadow: 0 0 12px rgba(var(--st-accent-rgb), 0.7);
  }

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

.triggers {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.6);
  text-align: left;
}

/* "5 = 4 + 1" laid out as small parchment chips (the same look as the VS boxes),
 * each with its source written underneath. */
.skill-breakdown {
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 6px 10px;
  padding: 4px 4px 10px;
}

.skill-breakdown__part {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.skill-breakdown__chip {
  display: inline-flex;
  align-items: baseline;
  gap: 0.2em;
  padding: 0.2em 0.5em;
  border-radius: 0.6em;
  background: linear-gradient(180deg, #fbf4e2, #e6d6b2);
  color: #2b2117;
  border: 2px solid #8a7550;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  font-family: "Arkham";
  font-size: 1.3em;
  line-height: 1;
  text-transform: none;

  i { font-style: normal; }
}

.skill-breakdown__part--total .skill-breakdown__chip {
  border-color: #2ec46b;
  box-shadow: 0 0 10px rgba(46, 196, 107, 0.6), 0 2px 5px rgba(0, 0, 0, 0.5);
}

.skill-breakdown__op {
  align-self: flex-start;
  padding-top: 0.15em;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.4em;
  line-height: 1;
  color: rgba(255, 255, 255, 0.75);
}

.skill-breakdown__label {
  max-width: 9em;
  font-size: 0.7em;
  line-height: 1.2;
  text-align: center;
  text-transform: none;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.75);
}

/* Which card a bonus pill comes from. */
.modifier__source {
  margin-left: 2px;
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 0.8em;
  text-transform: none;
  color: rgba(255, 255, 255, 0.75);
}

.modifiers__title { flex-basis: 100%; text-align: left; cursor: help; }

.triggers__title {
  margin: 0;
  font-size: 0.8em;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--st-accent);
}

.trigger {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-left: 3px solid var(--st-accent);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: rgba(33, 53, 41, 0.95);
    border-color: #e6c584;
  }

  .trigger__button, .trigger__button:hover:not(:disabled) {
    width: 100%;
    padding: 2px 0;
    background: transparent !important;
    border: 0 !important;
    text-align: left;
    justify-content: flex-start;
  }
}

/* The panel-wide button rule would make it uppercase on a purple fill. */
.trigger .trigger__line, .trigger .trigger__line:hover {
  padding: 2px 0;
  background: transparent;
  color: #dfe5d8;
  font-size: 0.9em;
  text-align: left;
  text-transform: none;
}

.trigger__name {
  font-size: 0.8em;
  font-weight: 700;
  color: #e0a595;
}

.trigger__text {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 0.85em;
  line-height: 1.4;
  color: #c9d0c3;

  :deep(img) {
    height: 1.1em;
    vertical-align: -0.15em;
  }
}

.skill-test-title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.win-odds {
  padding: 1px 10px;
  border-radius: 999px;
  background: rgba(40, 160, 80, 0.3);
  border: 1px solid rgba(110, 210, 140, 0.55);
  color: #c9f2d5;
  font-size: 0.8em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.skill-test-contents {
  padding: 10px 12px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  justify-items: center;
  gap: 10px;
  color: white;
  background:
    radial-gradient(ellipse at center, var(--st-glow), transparent 70%),
    var(--st-body);
  backdrop-filter: blur(80px);
  -webkit-backdrop-filter: blur(80px); /* Safari support */
}

.test-status {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: min(28px, 3vw);
  padding: 0 min(20px, 2vw);
  text-transform: uppercase;
}

/* A big numbered medallion with its meaning written under it. */
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* Each side drawn like a skill box on an investigator card: a parchment frame
 * holding a dark serif number and the skill's coloured icon ("1 [book] VS 5 [book]").
 * The frame's edge says which side it is: red = to beat, green = the investigator. */
.stat__value {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.3em;
  padding: 0.15em 0.55em 0.15em 0.65em;
  border-radius: 0.9em;
  background: linear-gradient(180deg, #fbf4e2, #e6d6b2);
  color: #2b2117;
  border: 5px solid var(--side, #3b2a1b);
  box-shadow:
    inset 0 0 0 2px #fff8e6,
    0 0 0 2px rgba(0, 0, 0, 0.55),
    0 0 18px var(--side-glow, transparent),
    0 3px 8px rgba(0, 0, 0, 0.6);
}

.test-difficulty .stat__value { --side: #e0393b; --side-glow: rgba(224, 57, 59, 0.75); }
.modified-skill .stat__value { --side: #2ec46b; --side-glow: rgba(46, 196, 107, 0.75); }

.difficulty, .skill {
  /* The game's own card font: its digits and skill icons share one height, so
   * the number and the icon beside it line up top and bottom. */
  font-family: "Arkham";
  font-size: 2.2em;
  line-height: 1;
}

.skill-art {
  display: block;
  width: 1.9em;
  height: 1.9em;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));

  &.skill-art--badge {
    width: 22px;
    height: 22px;
  }
}

.stat__skills {
  display: inline-flex;
  gap: 0.15em;
  font-size: 2.2em;
  line-height: 1;
  text-transform: none;

  i {
    font-style: normal;
  }
}

.portrait {
  width: var(--skill-test-card-width);
  height: auto;
  border-radius: 5px;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.45);

  &:has(+ .card-container) {
    margin-right: 0;
  }
}

.committed-skills {
  background: rgba(0, 0, 0, 0.6);

  h2 {
    background: rgba(0, 0, 0, 0.3);
    color: var(--st-accent);
    font-size: 0.85em;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 10px;
    margin: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
}

.skills-container {
  padding: 6px 10px;
  @media (max-width: 800px) and (orientation: portrait) {
    .card-row-cards {
      height: auto;
    }
    :deep(.card) {
      width: 10.71vw ;
      height: 14.994vw;
      max-width: 10.71vw;
    }
  }
}

.skill-test-results {
  animation: skill-test-result-in var(--motion-travel) var(--ease-land) both;
  padding: 12px 14px;
  font-size: 1.35em;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
}

/* The verdict lands with a beat, so the outcome reads before the buttons do. */
@keyframes skill-test-result-in {
  0% { opacity: 0; transform: scale(0.7); letter-spacing: 0.3em; }
  60% { opacity: 1; transform: scale(1.08); }
  100% { opacity: 1; transform: none; letter-spacing: 0.1em; }
}
@media (prefers-reduced-motion: reduce) {
  .skill-test-results { animation: none; }
}

.skill-test-results-break {
  flex-basis: 100%;
  height: 0;
}

.apply-results {
  width: 100%;
  border: 0;
  text-align: center;
  text-transform: uppercase;
  transition: background-color var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out), filter var(--motion-fast) var(--ease-out);
  border: 0;
  padding: 10px;
  /* Same cream action style as the other panel buttons (it used to paint light
   * text over the cream gradient, which left the label unreadable). */
  background: linear-gradient(180deg, #f3eee2, #ddd5c3);
  color: #23211d;
  font-weight: 700;
  letter-spacing: 0.06em;
  &:hover {
    background: linear-gradient(180deg, #ffffff, #ebe4d3);
  }
}

button:where(:not(.debug-stepper-button)) {
  width: 100%;
  border: 0;
  text-align: center;
  text-transform: uppercase;
  transition: background-color var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out), filter var(--motion-fast) var(--ease-out);
  border: 0;
  padding: 10px;
  /* Panel actions (Confirm, Skip triggers…) in the same cream as the number boxes:
   * light on the dark sheet, dark text, so they read at a glance. */
  background: linear-gradient(180deg, #f3eee2, #ddd5c3);
  color: #23211d;
  font-weight: 700;
  letter-spacing: 0.06em;
  &:hover {
    background: linear-gradient(180deg, #ffffff, #ebe4d3);
  }
}

.success {
  background: linear-gradient(90deg, #0b3d1c, #1f8a45 50%, #0b3d1c);
  text-transform: uppercase;
  text-align: center;
  color: white;
}

.failure {
  background: linear-gradient(90deg, #3d0b0b, #a82424 50%, #3d0b0b);
  text-transform: uppercase;
  text-align: center;
  color: white;
}

i {
  font-family: 'Arkham';
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  position: relative;
}

i.iconSkull {
  &:before {
    font-family: "Arkham";
    content: "\004E";
  }
}

i.iconCultist {
  &:before {
    font-family: "Arkham";
    content: "\0042";
  }
}

i.iconTablet {
  &:before {
    font-family: "Arkham";
    content: "\0056";
  }
}

i.iconElderThing {
  &:before {
    font-family: "Arkham";
    content: "\0043";
  }
}

i.iconSkillWillpower {
  &:before {
    font-family: "Arkham";
    content: "\0041";
  }
}

i.iconSkillIntellect {
  &:before {
    font-family: "Arkham";
    content: "\0046";
  }
}

i.iconSkillCombat {
  &:before {
    font-family: "Arkham";
    content: "\0044";
  }
}

i.iconSkillAgility {
  &:before {
    font-family: "Arkham";
    content: "\0053";
  }
}

.button {
  display: inline-block;
  padding: 5px 10px;
  margin: 2px;
  background-color: var(--neutral-dark);
  color: white;
  border: 1px solid #666;
  cursor: pointer;

  &:hover {
    background-color: #111;
  }

  &:active {
    background-color: #666;
    border-color: #111;
  }

  flex: 1;
}

.skill-test :deep(.choices) {
  display: flex;
  width: 100%;
  padding: 0;
  margin: 0;
  gap: 0;
  font-size: 0.7em;

  .message-label {
    flex: 1;
    margin: 0;
  }

  button {
    display: block;
    border: 0;
    text-align: left;
    text-transform: uppercase;
    transition: background-color var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out), filter var(--motion-fast) var(--ease-out);
    border: 0;
    padding: 10px;
    margin: 0 !important;
    border-radius: 0;
    background: linear-gradient(180deg, #f3eee2, #ddd5c3);
    color: #23211d;
    font-weight: 700;
    &:hover {
      background: linear-gradient(180deg, #ffffff, #ebe4d3);
    }
  }
}


.message-label {
  flex: 1;
}

.vs {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.vs__text {
  font-size: 1.1em;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.85);
}


/* Progress track: past steps tinted, current step glows, future steps muted. */
.steps {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  gap: 3px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.55);
  box-sizing: border-box;

  .step {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 22px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.55);
    font-weight: 700;
    font-size: 0.95em;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

    &.fast {
      flex: 0.6;
    }
  }

  .step.done {
    background: rgba(var(--st-accent-rgb), 0.18);
    color: rgba(255, 255, 255, 0.85);
  }

  .step.active {
    background: linear-gradient(180deg, var(--st-accent), var(--st-accent-strong));
    color: white;
    box-shadow: 0 0 10px rgba(var(--st-accent-rgb), 0.6);
    transform: scale(1.06);
  }
}

.step-caption {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.25);
  color: #f1ede6;
  text-align: left;
  font-size: 0.95em;
  line-height: 1.35;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  :deep(img) {
    height: 1.1em;
    vertical-align: -0.15em;
  }
}

.step-caption__badge {
  flex-shrink: 0;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(var(--st-accent-rgb), 0.2);
  border: 1px solid rgba(var(--st-accent-rgb), 0.6);
  font-size: 0.8em;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.willpower-skill {
  color: var(--willpower);
  background: var(--willpower-light);
}

.intellect-skill {
  color: var(--intellect);
  background: var(--intellect-light);
}

.combat-skill {
  color: var(--combat);
  background: var(--combat-light);
}

.agility-skill {
  color: var(--agility);
  background: var(--agility-light);
}

.willpower-skill, .intellect-skill, .combat-skill, .agility-skill {
  font-size: 2em;
  width: 1.3em;
  height: 1.3em;
  line-height: 1.3em;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.willpower-skill span, .intellect-skill span, .combat-skill span, .agility-skill span {
  display: none;
}

.swarming {
  display: flex;
  flex-direction: row;
  gap: 5px;

  .swarm img {
    width: var(--card-width);
    min-width: var(--card-width);
    border-radius: 7px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.23), 0 3px 6px rgba(0,0,0,0.53);
    border-radius: 6px;
  }

  .host :deep(img) {
    box-sizing: border-box;
    border: 2px dashed var(--title);
    border-radius: 7px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.23), 0 3px 6px rgba(0,0,0,0.53);
    border-radius: 6px;
  }
}


.skills {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.half-resources {
  img {
    width: 30px;
  }
  align-items: center;
  display: flex;
  gap: 5px;
}

.modifier {
  flex-shrink: 0;
  align-items: center;
  background: #000;
  border-radius: 100px;
  border: none;
  color: var(--title);
  display: flex;
  gap: 6px;
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.95em;
  text-align: center;
  user-select: none;
  text-decoration: none;
  text-transform: uppercase;
  font-family: sans-serif;
  > * {
    pointer-events: none;
  }

  img {
    height: 18px;
  }

  i {
    align-self: flex-end;
  }

  /* A skill icon as printed on the cards: the white glyph on a tile of that skill's colour. */
  i.skill-badge {
    align-self: center;
    display: inline-grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background: var(--skill);
    box-shadow: inset 0 0 0 1px #ffffff40, 0 1px 2px #000a;
    color: #fff;
    font-style: normal;
    font-size: 14px;
    line-height: 1;
    &::before { line-height: 1; }
  }

  .text {
    font-size: 0.8em;
  }
}

.modifiers {
  align-self: flex-start;
  display: flex;
  flex-wrap: wrap;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 10px;
  gap: 5px;
  font-size: 1em;
}

.focused-chaos-tokens {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.5);
}

.token-effects {
  background: rgba(0, 0, 0, 0.5);
}

.token-effect {
  display: grid;
  grid-template-columns: 66px 1fr;
  align-items: stretch;
  background: rgba(10, 11, 15, 0.66);

  & + .token-effect {
    border-top: 1px solid rgba(255, 255, 255, 0.09);
  }
}

.token-effect__token {
  display: grid;
  place-items: center;
  padding: 8px 0;
  background: rgba(0, 0, 0, 0.42);
  border-right: 1px solid rgba(255, 255, 255, 0.09);

  img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
  }
}

.token-effect__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
  padding: 9px 14px;
  text-align: left;
  color: #dbe0e7;
  font-family: 'Noto Sans', Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  line-height: 1.5;

  :deep(img) {
    height: 1.1em;
    vertical-align: -0.15em;
  }
}

/* The token's value now, ahead of its printed effect: "−3 · -X. X is the number of ...". */
.token-effect__line {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.token-effect__badge {
  flex: none;
  font-size: 12px;
}

/* One card's effect on the drawn token: its own full-width bar under the
   token's, so the effects read as add-ons stacked on it. A separate class
   rather than a .token-effect modifier, so the grid columns don't collide. */
.token-addon {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  background: rgba(10, 11, 15, 0.66);
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  color: #dbe0e7;
  font-family: 'Noto Sans', Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  line-height: 1.5;
}

.token-addon__body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  border-left: 3px solid var(--title);
  padding-left: 12px;
}

/* Declared but not yet resolved: the stripe is dimmed, the row is not. */
.token-addon--pending .token-addon__body {
  border-left-color: rgba(255, 255, 255, 0.22);
}

.token-addon__name {
  color: #f4ecf8;
  font-weight: 600;
}

.token-addon__text :deep(img) {
  height: 1.1em;
  vertical-align: -0.15em;
}

.token-addon__value {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: 13px;
  color: #f4ecf8;
  min-width: 2.2em;
  text-align: right;
}

.test-source {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

/* Cards on both ends share one size and hug the numbers in the middle
 * instead of drifting to the panel's corners. */
.skill-test-contents {
  --skill-test-card-width: calc(var(--card-width) * 1.15);
}

.target-card,
.test-source {
  --card-width: var(--skill-test-card-width);
  width: auto;
}

.test-source { justify-self: end; }
.target-card {
  justify-self: start;
  &.concealed {
    width: var(--skill-test-card-width);
  }
}

/* The investigator reads first: [Kate] [5 book] VS [1 book] [tested card].
 * Done with `order` so the markup keeps its target → status → source sequence. */
.test-source { order: 0; }
.test-status { order: 1; }
.target-card { order: 2; }
.modified-skill { order: 0; }
.vs { order: 1; }
.test-difficulty { order: 2; }


</style>
