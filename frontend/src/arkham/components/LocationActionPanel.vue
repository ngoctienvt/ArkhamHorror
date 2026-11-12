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
import { entityImage, basicActionImage, investigatorImage } from '@/arkham/actionPreviewImage'
import { imgsrc } from '@/arkham/helpers'
import { visibleConcealedImage } from '@/arkham/concealedCards'
import { sceneFallbackTargets, sceneFallbackTokens } from '@/arkham/sceneTargetFallback'
import { cardImage } from '@/arkham/cardImages'
import { keyToImage } from '@/arkham/keyImage'
import type { ArkhamKey } from '@/arkham/types/Key'
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import AbilityTextRow from '@/arkham/components/AbilityTextRow.vue'
import LocationAboutBlock from '@/arkham/components/LocationAboutBlock.vue'
import SceneGlyph from '@/arkham/components/SceneGlyph.vue'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'

/* Every action the server offers right now, listed in one panel beside the scene the way the offline demo
 * does: basic actions, what the location and scenario offer, enemies and cards in play. Moving, playing
 * cards, and act/agenda abilities are left out: those are taken from the location, the hand, and the strip.
 * It only arranges the current choices; each row sends the index its choice already had. */
const props = defineProps<{
  game: Game; playerId: string; location: Location | null; info?: MapLocationInfo | null
  /** Locations drawn on the map: picking one of them is done on its plate, so the panel leaves those out. */
  mapLocationIds?: string[]
  /** Drawn as a bottom sheet (tablet held upright): a grab bar on top folds and unfolds it. */
  sheet?: boolean
  expanded?: boolean
}>()
const emit = defineEmits<{ (e: 'choose', index: number): void; (e: 'close'): void; (e: 'toggleSheet'): void }>()

const { t, te } = useI18n()
const nameOf = useCardNames()
const choices = useGameChoices(() => props.game, () => props.playerId)
const me = computed(() => ownInvestigator(props.game, props.playerId))

// 'targets' first: when the game asks to pick a card the scene cannot show as clickable, that is the question.
type SectionKey = AbilitySection | 'targets'
const SECTIONS: SectionKey[] = ['targets', 'basic', 'scenario', 'enemies', 'inPlay', 'other']
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
  /** Layout of a plain basic row: 'half' sits two to a line (resource, draw), 'end' closes the list (end turn). */
  variant: 'half' | 'end' | null
}


// Concealed mini-cards (The Scarlet Keys) are not cards in play: their Fight / Evade and the choices that
// pick one get a heading of their own, and only the face a player may see as the preview.
const concealedImage = (id: string) => {
  const card = props.game.concealed[id]
  return card ? imgsrc(visibleConcealedImage(card)) : null
}
const concealedWhere = (id: string) => {
  const placement = props.game.concealed[id]?.placement
  const location = placement?.tag === 'AtLocation' ? props.game.locations[placement.contents as string] : null
  return location ? nameOf(location.cardCode) : t('locationMap.concealedInShadows')
}

// A key is named by its colour, a chaos-token key by its token, a face-down one as such.
const keyName = (k: ArkhamKey): string => {
  if (k.tag === 'TokenKey') return k.contents.face
  if (k.tag === 'UnrevealedKey') return t('locationMap.keyColor.UnrevealedKey')
  return te(`locationMap.keyColor.${k.tag}`) ? t(`locationMap.keyColor.${k.tag}`) : k.tag
}

const sections = computed(() => {
  const rows: Record<SectionKey, Row[]> = { targets: [], basic: [], scenario: [], enemies: [], inPlay: [], other: [] }
  const mine = me.value?.id
  const ability = (section: SectionKey, index: number, group: string | null, contents: EntityChoice['contents'], image: string | null, sourceId: string | null = null) =>
    rows[section].push({ index, group, label: null, contents, sourceId, kind: kindOf(contents), text: null, image, variant: null })
  const plain = (section: SectionKey, index: number, group: string | null, label: string, variant: Row['variant'] = null) =>
    rows[section].push({ index, group, label, contents: null, sourceId: null, kind: null, text: null, image: null, variant })

  choices.value.forEach((choice, index) => {
    switch (choice.tag) {
      case MessageType.FIGHT_LABEL:
      case MessageType.FIGHT_LABEL_WITH_SKILL:
      case MessageType.EVADE_LABEL:
      case MessageType.EVADE_LABEL_WITH_SKILL:
      case MessageType.ENGAGE_LABEL:
        if (props.game.concealed[choice.enemyId]) ability('enemies', index, t('locationMap.concealedCard'), choice, concealedImage(choice.enemyId))
        else ability('enemies', index, lookup(choice.enemyId)?.name ?? null, choice, entityImage(props.game, choice.enemyId))
        break
      case MessageType.TARGET_LABEL: {
        // Picking a concealed card is drawn on the map, but a stack shows only its top card, so every
        // one of them is also listed here.
        const id = choice.target.contents
        if (typeof id === 'string' && props.game.concealed[id]) {
          rows.targets.push({ index, group: t('locationMap.concealedCard'), label: t('locationMap.chooseConcealed', { where: concealedWhere(id) }),
            contents: null, sourceId: null, kind: null, text: null, image: concealedImage(id), variant: null })
        }
        break
      }
      case MessageType.ABILITY_LABEL: {
        // Moving is done from the location's own button, and playing a card from the hand itself.
        const actions = abilityActions(choice)
        if (actions.includes('Move') || actions.includes('Play')) break
        const sid = sourceEntityId(choice.ability.source)
        if (sid && props.game.concealed[sid]) { ability('enemies', index, t('locationMap.concealedCard'), choice, concealedImage(sid)); break }
        // Cards in hand are played from the hand; act and agenda abilities from their cards on the strip.
        if (sid && (handIds.value.has(sid) || props.game.acts[sid] || props.game.agendas[sid])) break
        // Basic actions (Investigate, Draw…) aren't printed on the card, so they get no card-text hint.
        if (choice.ability.basic) ability('basic', index, null, choice, entityImage(props.game, sid) ?? basicActionImage(props.game, me.value, actions))
        else {
          // A non-basic ability is printed on its card, investigator cards included, so it is headed by that card's name.
          const known = sid ? lookup(sid) : null
          ability(known?.section ?? 'other', index, known?.name ?? null, choice, entityImage(props.game, sid) ?? investigatorImage(props.game, sid), sid)
        }
        break
      }
      case MessageType.COMPONENT_LABEL: {
        const c = choice.component
        if (c?.tag === 'InvestigatorComponent' && c.tokenType === 'ResourceToken' && c.investigatorId === mine) plain('basic', index, null, t('locationMap.gainResource'), 'half')
        else if (c?.tag === 'InvestigatorDeckComponent' && props.playerId === me.value?.playerId) plain('basic', index, null, t('locationMap.drawCard'), 'half')
        break
      }
      // Keys lie on locations, enemies and investigators, none of which the scene draws as clickable keys.
      case MessageType.KEY_LABEL:
        rows.targets.push({ index, group: t('locationMap.targetKind.key'), label: t('locationMap.chooseKey', { key: keyName(choice.key) }),
          contents: null, sourceId: null, kind: null, text: null, image: keyToImage(choice.key), variant: null })
        break
      case MessageType.END_TURN_BUTTON:
        if (choice.investigatorId === mine) plain('basic', index, null, t('locationMap.endTurn'), 'end')
        break
      case MessageType.SKIP_TRIGGERS_BUTTON:
        if (choice.investigatorId === mine) plain('basic', index, null, t('locationMap.skipTriggers'))
        break
    }
  })
  for (const target of sceneFallbackTargets(props.game, choices.value, new Set(props.mapLocationIds ?? []))) {
    rows.targets.push({ index: target.index, group: t(`locationMap.targetKind.${target.kind}`), label: nameOf(target.code),
      contents: null, sourceId: null, kind: null, text: null, image: cardImage(target.art, target.side), variant: null })
  }
  for (const token of sceneFallbackTokens(choices.value, mine ?? null)) {
    const investigator = props.game.investigators[token.investigatorId]
    const who = investigator ? nameOf(investigator.cardCode) : token.investigatorId
    const what = te(`locationMap.tokenChoice.${token.tokenType}`) ? t(`locationMap.tokenChoice.${token.tokenType}`) : token.tokenType
    rows.targets.push({ index: token.index, group: who, label: what, contents: null, sourceId: null, kind: null, text: null,
      image: investigator ? cardImage(investigator.cardCode) : null, variant: null })
  }
  Object.values(rows).forEach((r) => attachText(r))
  return SECTIONS.filter((key) => rows[key].length > 0).map((key) => ({ key, title: t(`locationMap.section.${key}`), rows: rows[key] }))
})
/* End turn is not one action among the others: it sits pinned at the panel's foot with the actions left. */
const endTurn = computed(() => sections.value.find((s) => s.key === 'basic')?.rows.find((r) => r.variant === 'end') ?? null)
const listed = computed(() => sections.value
  .map((s) => ({ ...s, rows: s.rows.filter((r) => r.variant !== 'end') }))
  .filter((s) => s.rows.length > 0))

</script>

<template>
  <aside class="panel" :class="{ sheet, expanded }" :aria-label="t('locationMap.actions')">
    <button v-if="sheet" class="grab" type="button" :aria-expanded="expanded" :aria-label="t('locationMap.sheetHandle')" @click="emit('toggleSheet')"><span aria-hidden="true"></span></button>
    <header>
      <h3>{{ location ? nameOf(location.cardCode) : t('locationMap.actions') }}</h3>
      <button class="close" :aria-label="t('locationMap.close')" @click="emit('close')"><SceneGlyph name="close" /></button>
    </header>
    <LocationAboutBlock v-if="location && info" :game="game" :location="location" :info="info" />
    <p v-if="sections.length === 0" class="empty">{{ t('locationMap.noActions') }}</p>
    <section v-for="s in listed" :key="s.key" class="section" :class="`section--${s.key}`">
      <h4>{{ s.title }}</h4>
      <template v-for="(r, i) in s.rows" :key="r.index">
        <h5 v-if="r.group && r.group !== s.rows[i - 1]?.group">{{ r.group }}</h5>
        <button v-if="r.label" class="row" :class="r.variant && `row--${r.variant}`" :data-image="r.image ?? undefined" @click="emit('choose', r.index)">{{ r.label }}</button>
        <div v-else-if="r.contents && r.text" class="choice" :data-image="r.image ?? undefined">
          <AbilityTextRow class="text-row" :kind="r.kind" :html="r.text" @choose="emit('choose', r.index)" />
        </div>
        <AbilityButton v-else-if="r.contents" class="row" :data-image="r.image ?? undefined" :game="game" :ability="r.contents" @choose="emit('choose', r.index)" />
      </template>
    </section>
    <footer v-if="endTurn" class="foot">
      <span v-if="me" class="actions-left">{{ t('locationMap.actionsLeft', { count: me.remainingActions }) }}</span>
      <button type="button" class="end-turn" @click="emit('choose', endTurn.index)">{{ endTurn.label }}</button>
    </footer>
  </aside>
</template>

<style scoped>
.panel { display: flex; flex-direction: column; gap: 10px; width: var(--panel-w, 280px); max-height: 100%; overflow-y: auto; padding: 0 12px 12px; background: linear-gradient(180deg, var(--surface-1, #142019), var(--surface-0, #0d1611)); border: 1px solid var(--line-strong, #c6a87399); border-radius: var(--radius-lg, 8px); box-shadow: var(--shadow-pop, 0 8px 28px #000a); color: var(--text, #e8e3d0); scrollbar-width: thin; scrollbar-color: var(--line, #c6a87355) transparent; }
/* The name and close button stay put while the actions scroll under them. */
header { position: sticky; top: 0; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 0 -12px; padding: 10px 12px 8px; background: var(--surface-1, #142019); border-bottom: 1px solid var(--line, #c6a87340); }
h3 { margin: 0; min-width: 0; font: 600 1rem/1.2 var(--ui-serif); color: var(--heading, #fff4df); overflow-wrap: anywhere; }
.close { flex: none; display: grid; place-items: center; background: transparent; border: 1px solid var(--line, #ffffff26); border-radius: var(--radius, 6px); color: var(--text-muted, #c9d0c3); padding: 4px; cursor: pointer; }
.close:hover { border-color: var(--accent-gold, #d9b878); color: var(--heading, #fff); }
.section { display: flex; flex-direction: column; gap: 5px; border-top: 1px solid #ffffff14; padding-top: 8px; }
h4 { margin: 0 0 2px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-gold, #d9b878); }
/* Basic actions: resource and draw side by side, the rest full width, end turn last and set apart. */
.section--basic { display: grid; grid-template-columns: 1fr 1fr; }
.section--basic > * { grid-column: 1 / -1; }
.section--basic > .row--half { grid-column: auto; text-align: center; justify-content: center; }
.foot { position: sticky; bottom: 0; z-index: 1; display: flex; align-items: center; gap: 8px; margin: auto -12px -12px; padding: 8px 12px 10px; background: var(--surface-0, #0d1611); border-top: 1px solid var(--line, #c6a87340); }
.actions-left { flex: 1; font-size: 0.74rem; color: var(--text-muted, #b6bfb0); }
.end-turn { flex: none; padding: 7px 14px; border-radius: var(--radius, 6px); border: 1px solid #e0915a99; background: #3a241666; color: #ffd9b8; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.end-turn:hover { background: #3a2416; border-color: #e0915a; }
.end-turn:focus-visible { outline: var(--focus-ring, 2px solid #ffe9a0); outline-offset: 2px; }
/* Group headings take their section's colour: red only for enemies, brass for cards in play. */
h5 { margin: 4px 0 0; font-size: 0.72rem; color: var(--text-flavor, #cdd4c2); font-weight: 600; }
.section--enemies h5 { color: #e0a595; }
.section--inPlay h5, .section--other h5 { color: var(--accent-gold, #d9b878); }
.section--targets h5 { color: var(--state-target, #f2d27a); }
.row, .section :deep(button) { width: 100%; text-align: left; justify-content: flex-start; padding: 7px 10px; font-size: 0.78rem; background: #1b2a22 !important; border: 1px solid #ffffff1f !important; border-radius: 5px; transition: background 0.15s, border-color 0.15s; color: #e5e2d4 !important; cursor: pointer; }
.row:hover, .section :deep(button:hover:not(:disabled)) { background: #213529 !important; border-color: #e6c584 !important; }
.section :deep(button:disabled) { opacity: 0.5; }
.choice { display: flex; flex-direction: column; background: #1b2a22; border: 1px solid #ffffff1f; border-radius: 5px; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.choice:hover { background: #213529; border-color: #e6c584; }
.choice :deep(button), .choice :deep(button:hover:not(:disabled)) { border: 0 !important; background: transparent !important; }
.choice .text-row { font-size: 0.78rem; color: #e5e2d4 !important; }
.empty { margin: 0; font-size: 0.8rem; color: #98a38f; }
/* Bottom sheet: full width, folded to a peek until the grab bar is pressed. */
.panel.sheet { width: auto; max-height: var(--sheet-peek, 30dvh); border-radius: 12px 12px 0 0; padding-top: 4px; transition: max-height 0.2s; }
.panel.sheet.expanded { max-height: var(--sheet-max, 56dvh); }
.grab { flex: none; align-self: center; width: 100%; min-height: var(--tap-min, 0px); display: grid; place-items: center; background: transparent; border: 0; cursor: pointer; }
.grab span { width: 44px; height: 5px; border-radius: 3px; background: #c6a873aa; }
@media (prefers-reduced-motion: reduce) { .panel.sheet { transition: none; } }
/* Fingers: rows and the close button reach 44px, with room between them. */
.location-map[data-input='touch'] .close { min-width: var(--tap-min); min-height: var(--tap-min); font-size: 1.1rem; }
.location-map[data-input='touch'] .section { gap: var(--tap-gap); }
.location-map[data-input='touch'] .row,
.location-map[data-input='touch'] .section :deep(button) { min-height: var(--tap-min); font-size: 0.9rem; }
.location-map[data-input='touch'] .choice { min-height: var(--tap-min); }
.location-map[data-input='touch'] .choice .text-row { font-size: 0.9rem; }
.location-map[data-input='touch'] .end-turn { min-height: var(--tap-min); }
</style>
