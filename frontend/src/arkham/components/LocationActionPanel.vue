<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Location } from '@/arkham/types/Location'
import { MessageType } from '@/arkham/types/Message'
import { cardId } from '@/arkham/types/Card'
import { useGameChoices } from '@/arkham/composables/useGameChoices'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { useAbilityCardText, type AbilitySection } from '@/arkham/composables/useAbilityCardText'
import { sourceEntityId, kindOf, type AbilityKind, type EntityChoice } from '@/arkham/locationChoices'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import { abilityActions } from '@/arkham/locationInfoModel'
import { entityImage, basicActionImage } from '@/arkham/actionPreviewImage'
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import AbilityTextRow from '@/arkham/components/AbilityTextRow.vue'
import LocationAboutBlock from '@/arkham/components/LocationAboutBlock.vue'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'

/* Every action the server offers right now, listed in one panel beside the scene the way the offline demo
 * does: basic actions, what the location and scenario offer, enemies and cards in play. Moving, playing
 * cards, and act/agenda abilities are left out: those are taken from the location, the hand, and the strip.
 * It only arranges the current choices; each row sends the index its choice already had. */
const props = defineProps<{ game: Game; playerId: string; location: Location | null; info?: MapLocationInfo | null }>()
const emit = defineEmits<{ (e: 'choose', index: number): void; (e: 'close'): void }>()

const { t } = useI18n()
const nameOf = useCardNames()
const choices = useGameChoices(() => props.game, () => props.playerId)
const me = computed(() => ownInvestigator(props.game, props.playerId))

type SectionKey = AbilitySection
const SECTIONS: SectionKey[] = ['basic', 'scenario', 'enemies', 'inPlay', 'other']
const { lookup, attachText } = useAbilityCardText(() => props.game)

const handIds = computed(() => new Set((me.value?.hand ?? []).map(cardId)))

type Row = {
  index: number; group: string | null; label: string | null; contents: EntityChoice['contents'] | null
  /** The card that offers it, and which printed ability kind it is: used to find its own line of card text. */
  sourceId: string | null; kind: AbilityKind | null
  /** Its printed text line from the card, filled in once all rows are known. */
  text: string | null
  /** The card this action is about, shown by the card hover preview; null when none fits. */
  image: string | null
}


const sections = computed(() => {
  const rows: Record<SectionKey, Row[]> = { basic: [], scenario: [], enemies: [], inPlay: [], other: [] }
  const mine = me.value?.id
  const ability = (section: SectionKey, index: number, group: string | null, contents: EntityChoice['contents'], image: string | null, sourceId: string | null = null) =>
    rows[section].push({ index, group, label: null, contents, sourceId, kind: kindOf(contents), text: null, image })
  const plain = (section: SectionKey, index: number, group: string | null, label: string) =>
    rows[section].push({ index, group, label, contents: null, sourceId: null, kind: null, text: null, image: null })

  choices.value.forEach((choice, index) => {
    switch (choice.tag) {
      case MessageType.FIGHT_LABEL:
      case MessageType.FIGHT_LABEL_WITH_SKILL:
      case MessageType.EVADE_LABEL:
      case MessageType.EVADE_LABEL_WITH_SKILL:
      case MessageType.ENGAGE_LABEL:
        ability('enemies', index, lookup(choice.enemyId)?.name ?? null, choice, entityImage(props.game, choice.enemyId))
        break
      case MessageType.ABILITY_LABEL: {
        // Moving is done from the location's own button, and playing a card from the hand itself.
        const actions = abilityActions(choice)
        if (actions.includes('Move') || actions.includes('Play')) break
        const sid = sourceEntityId(choice.ability.source)
        // Cards in hand are played from the hand; act and agenda abilities from their cards on the strip.
        if (sid && (handIds.value.has(sid) || props.game.acts[sid] || props.game.agendas[sid])) break
        // Basic actions (Investigate, Draw…) aren't printed on the card, so they get no card-text hint.
        if (choice.ability.basic) ability('basic', index, null, choice, entityImage(props.game, sid) ?? basicActionImage(props.game, me.value, actions))
        else {
          const known = sid ? lookup(sid) : null
          ability(known?.section ?? 'other', index, known && known.section !== 'basic' ? known.name : null, choice, entityImage(props.game, sid), sid)
        }
        break
      }
      case MessageType.COMPONENT_LABEL: {
        const c = choice.component
        if (c?.tag === 'InvestigatorComponent' && c.tokenType === 'ResourceToken' && c.investigatorId === mine) plain('basic', index, null, t('locationMap.gainResource'))
        else if (c?.tag === 'InvestigatorDeckComponent' && props.playerId === me.value?.playerId) plain('basic', index, null, t('locationMap.drawCard'))
        break
      }
      case MessageType.END_TURN_BUTTON:
        if (choice.investigatorId === mine) plain('basic', index, null, t('locationMap.endTurn'))
        break
      case MessageType.SKIP_TRIGGERS_BUTTON:
        if (choice.investigatorId === mine) plain('basic', index, null, t('locationMap.skipTriggers'))
        break
    }
  })
  Object.values(rows).forEach((r) => attachText(r))
  return SECTIONS.filter((key) => rows[key].length > 0).map((key) => ({ key, title: t(`locationMap.section.${key}`), rows: rows[key] }))
})

</script>

<template>
  <aside class="panel" :aria-label="t('locationMap.actions')">
    <header>
      <h3>{{ location ? nameOf(location.cardCode) : t('locationMap.actions') }}</h3>
      <button class="close" :aria-label="t('locationMap.close')" @click="emit('close')">✕</button>
    </header>
    <LocationAboutBlock v-if="location && info" :game="game" :location="location" :info="info" />
    <p v-if="sections.length === 0" class="empty">{{ t('locationMap.noActions') }}</p>
    <section v-for="s in sections" :key="s.key" class="section">
      <h4>{{ s.title }}</h4>
      <template v-for="(r, i) in s.rows" :key="r.index">
        <h5 v-if="r.group && r.group !== s.rows[i - 1]?.group">{{ r.group }}</h5>
        <button v-if="r.label" class="row" :data-image="r.image ?? undefined" @click="emit('choose', r.index)">{{ r.label }}</button>
        <div v-else-if="r.contents && r.text" class="choice" :data-image="r.image ?? undefined">
          <AbilityTextRow class="text-row" :kind="r.kind" :html="r.text" @choose="emit('choose', r.index)" />
        </div>
        <AbilityButton v-else-if="r.contents" class="row" :data-image="r.image ?? undefined" :game="game" :ability="r.contents" @choose="emit('choose', r.index)" />
      </template>
    </section>
  </aside>
</template>

<style scoped>
.panel { display: flex; flex-direction: column; gap: 8px; width: 270px; max-height: 100%; overflow-y: auto; padding: 12px; background: #0f1813f2; border: 1px solid #c6a873aa; border-radius: 8px; box-shadow: 0 8px 28px #000a; color: #e5e2d4; }
header { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
h3 { margin: 0; font: 1.4rem var(--ui-serif); }
.close { background: transparent; border: 1px solid #ffffff33; border-radius: 4px; color: #c9d0c3; padding: 2px 8px; cursor: pointer; }
.section { display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #ffffff14; padding-top: 6px; }
h4 { margin: 0; font-size: 0.75rem; color: #c6d6b4; }
h5 { margin: 4px 0 0; font-size: 0.7rem; color: #e0a595; font-weight: 600; }
.row, .section :deep(button) { width: 100%; text-align: left; justify-content: flex-start; padding: 7px 10px; font-size: 0.78rem; background: #17261f !important; border: 1px solid #ffffff22 !important; border-radius: 4px; color: #e5e2d4 !important; cursor: pointer; }
.row:hover, .section :deep(button:hover:not(:disabled)) { background: #213529 !important; border-color: #e6c584 !important; }
.section :deep(button:disabled) { opacity: 0.5; }
.choice { display: flex; flex-direction: column; background: #17261f; border: 1px solid #ffffff22; border-radius: 4px; cursor: pointer; }
.choice:hover { background: #213529; border-color: #e6c584; }
.choice :deep(button), .choice :deep(button:hover:not(:disabled)) { border: 0 !important; background: transparent !important; }
.choice .text-row { font-size: 0.78rem; color: #e5e2d4 !important; }
.empty { margin: 0; font-size: 0.8rem; color: #98a38f; }
</style>
