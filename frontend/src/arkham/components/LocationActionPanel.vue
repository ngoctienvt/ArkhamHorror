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
import { computeStat } from '@/arkham/statModel'
import type { SkillType } from '@/arkham/types/SkillType'
import { shouldPulseEndTurn } from '@/arkham/endTurnAttention'
import { abilityActions } from '@/arkham/locationInfoModel'
import { entityImage, basicActionImage, investigatorImage } from '@/arkham/actionPreviewImage'
import { imgsrc } from '@/arkham/helpers'
import { visibleConcealedImage } from '@/arkham/concealedCards'
import { sceneFallbackTargets, sceneFallbackTokens } from '@/arkham/sceneTargetFallback'
import { sceneHiddenCardChoices } from '@/arkham/sceneHiddenCardChoices'
import { cardImage } from '@/arkham/cardImages'
import { keyToImage } from '@/arkham/keyImage'
import type { ArkhamKey } from '@/arkham/types/Key'
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import AbilityTextRow from '@/arkham/components/AbilityTextRow.vue'
import LocationAboutBlock from '@/arkham/components/LocationAboutBlock.vue'
import LocationInspectSection from '@/arkham/components/LocationInspectSection.vue'
import { panelModeFor } from '@/arkham/location-panel-mode'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'

/* Every action the server offers right now, listed in one panel beside the scene the way the offline demo
 * does: basic actions, what the location and scenario offer, enemies and cards in play. Moving, playing
 * cards, and act/agenda abilities are left out: those are taken from the location, the hand, and the strip.
 * It only arranges the current choices; each row sends the index its choice already had. */
const props = defineProps<{
  game: Game; playerId: string; location: Location | null; info?: MapLocationInfo | null
  /** Locations drawn on the map: picking one of them is done on its plate, so the panel leaves those out. */
  mapLocationIds?: string[]
  mapEnemyIds?: ReadonlySet<string>
  /** Drawn as a bottom sheet (tablet held upright): a grab bar on top folds and unfolds it. */
  sheet?: boolean
  expanded?: boolean
  /** Another location the player clicked to look at: the panel describes it instead of listing the actions
   * where they stand, until they go back. Null (or the location they stand on) is the usual action list. */
  inspected?: Location | null
  inspectedInfo?: MapLocationInfo | null
  /** Where the inspected location leads. */
  connections?: { id: string; name: string; revealed: boolean; barriers?: number }[]
  /** Little height to spare (or docked in the sidebar): only the actions are listed, without the location text. */
  compact?: boolean
}>()
const emit = defineEmits<{
  (e: 'choose', index: number): void; (e: 'toggleSheet'): void
  /** Look at another location (a connection chip). */
  (e: 'inspect', id: string): void
  /** Leave the inspected location and list the actions again. */
  (e: 'back'): void
}>()

const { t, te } = useI18n()
const viewing = computed(() => panelModeFor(props.inspected?.id ?? null, props.location?.id ?? null) === 'viewing'
  && !!props.inspected && !!props.inspectedInfo)
const shown = computed(() => (viewing.value ? props.inspected : props.location) ?? null)
/* A choice made from the inspected location is done with it: back to the action list. */
function chooseInspected(index: number) {
  emit('choose', index)
  emit('back')
}
const nameOf = useCardNames()
const choices = useGameChoices(() => props.game, () => props.playerId)
const me = computed(() => ownInvestigator(props.game, props.playerId))

// 'targets' first: when the game asks to pick a card the scene cannot show as clickable, that is the question.
type SectionKey = AbilitySection | 'targets'
const SECTIONS: SectionKey[] = ['targets', 'basic', 'scenario', 'enemies', 'inPlay', 'other']
const { lookup, attachText } = useAbilityCardText(() => props.game)

const ownedIds = computed(() => new Set(Object.values(props.game.investigators).filter((i) => i.playerId === props.playerId).map((i) => i.id)))
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
        // These are already this player's choices, so match any investigator they control, not only the first.
        if (ownedIds.value.has(choice.investigatorId) || choice.investigatorId === mine) plain('basic', index, null, t('locationMap.endTurn'), 'end')
        break
      case MessageType.SKIP_TRIGGERS_BUTTON:
        if (choice.investigatorId === mine) plain('basic', index, null, t('locationMap.skipTriggers'))
        break
    }
  })
  for (const target of sceneFallbackTargets(props.game, choices.value, new Set(props.mapLocationIds ?? []), props.mapEnemyIds)) {
    rows.targets.push({ index: target.index, group: t(`locationMap.targetKind.${target.kind}`), label: nameOf(target.code),
      contents: null, sourceId: null, kind: null, text: null, image: cardImage(target.art, target.side), variant: null })
  }
  for (const card of sceneHiddenCardChoices(props.game, choices.value)) {
    rows.targets.push({ index: card.index, group: t('locationMap.targetKind.card'), label: nameOf(card.cardCode),
      contents: null, sourceId: null, kind: null, text: null, image: cardImage(card.cardCode), variant: null })
  }
  for (const token of sceneFallbackTokens(choices.value, mine ?? null)) {
    const investigator = props.game.investigators[token.investigatorId]
    const who = investigator ? nameOf(investigator.cardCode) : token.investigatorId
    const key = `locationMap.tokenChoice.${token.heal ? 'heal.' : ''}${token.tokenType}`
    const what = te(key) ? t(key) : token.tokenType
    rows.targets.push({ index: token.index, group: who, label: what, contents: null, sourceId: null, kind: null, text: null,
      image: investigator ? cardImage(investigator.cardCode) : null, variant: null })
  }
  Object.values(rows).forEach((r) => attachText(r))
  return SECTIONS.filter((key) => rows[key].length > 0).map((key) => ({ key, title: t(`locationMap.section.${key}`), rows: rows[key] }))
})
/* End turn is not one action among the others: it sits pinned at the panel's foot with the actions left. */
const endTurn = computed(() => sections.value.find((s) => s.key === 'basic')?.rows.find((r) => r.variant === 'end') ?? null)
/* The turn is never ended automatically; End Turn blinks instead once no action is left or it is the only choice. */
const pulseEndTurn = computed(() => shouldPulseEndTurn(endTurn.value !== null, me.value?.remainingActions ?? 1, choices.value))
/* The acting investigator's skills with lasting modifiers applied, shown on the basic actions they test. */
const mySkills = computed<Partial<Record<SkillType, number>> | null>(() => {
  const i = me.value
  if (!i) return null
  const value = (key: 'willpower' | 'intellect' | 'combat' | 'agility') => computeStat(key, i[key], i.modifiers).current
  return { SkillWillpower: value('willpower'), SkillIntellect: value('intellect'), SkillCombat: value('combat'), SkillAgility: value('agility') }
})
/* Actions left drawn as pips (a turn has three, more with extra actions): spent ones stay as hollow rings. */
const actionPips = computed(() => Math.max(3, me.value?.remainingActions ?? 0))
const listed = computed(() => sections.value
  .map((s) => ({ ...s, rows: s.rows.filter((r) => r.variant !== 'end') }))
  .filter((s) => s.rows.length > 0))
/* Abilities of the location you stand on that the list offers with their printed text: the about block
 * leaves those lines out, so each is read once, as the button that uses it. */
const offeredHere = computed(() => listed.value.flatMap((s) => s.rows)
  .filter((r) => r.text && r.kind && r.sourceId === props.location?.id)
  .map((r) => r.kind as string))

</script>

<template>
  <aside class="panel" :class="{ sheet, expanded }" :aria-label="t('locationMap.actions')">
    <button v-if="sheet" class="grab" type="button" :aria-expanded="expanded" :aria-label="t('locationMap.sheetHandle')" @click="emit('toggleSheet')"><span aria-hidden="true"></span></button>
    <div class="body">
    <!-- Only when looking at another location: its name and the way back. At your own location the scene
         already shows where you stand, so the list starts straight with the actions. -->
    <header v-if="viewing">
      <button v-if="viewing" class="back" type="button" :title="t('locationMap.backToHere')" :aria-label="t('locationMap.backToHere')" @click="emit('back')"><span aria-hidden="true">←</span></button>
      <div class="heading">
        <span v-if="viewing" class="eyebrow">{{ t('locationMap.viewing') }}</span>
        <h3>{{ shown ? nameOf(shown.cardCode) : t('locationMap.actions') }}</h3>
      </div>
    </header>
    <!-- At your own location: a section title bar, styled like the phase bar of the turn status above. -->
    <header v-else class="title-bar">{{ t('locationMap.yourActions') }}</header>
    <!-- Looking at another location: what it is, where it leads and what can be done with it from here. -->
    <template v-if="viewing && inspected && inspectedInfo">
      <LocationAboutBlock :game="game" :playerId="playerId" :location="inspected" :info="inspectedInfo" />
      <LocationInspectSection :game="game" :playerId="playerId" :info="inspectedInfo" :connections="connections ?? []"
        @choose="chooseInspected" @inspect="emit('inspect', $event)" />
    </template>
    <template v-else>
    <!-- Docked or short on height, the panel is the action list alone; with room it opens on the location's text. -->
    <LocationAboutBlock v-if="location && info && !compact" :game="game" :playerId="playerId" :location="location" :info="info" :offeredKinds="offeredHere" />
    <p v-if="sections.length === 0" class="empty">{{ t('locationMap.noActions') }}</p>
    <section v-for="s in listed" :key="s.key" class="section" :class="`section--${s.key}`">
      <h4>{{ s.title }}</h4>
      <template v-for="(r, i) in s.rows" :key="r.index">
        <h5 v-if="r.group && r.group !== s.rows[i - 1]?.group">{{ r.group }}</h5>
        <button v-if="r.label" class="row" :class="r.variant && `row--${r.variant}`" :data-image="r.image ?? undefined" @click="emit('choose', r.index)">{{ r.label }}</button>
        <div v-else-if="r.contents && r.text" class="choice" :data-image="r.image ?? undefined">
          <AbilityTextRow class="text-row" :kind="r.kind" :html="r.text" @choose="emit('choose', r.index)" />
        </div>
        <AbilityButton v-else-if="r.contents" class="row" :data-image="r.image ?? undefined" :game="game" :ability="r.contents"
          :skillValues="s.key === 'basic' ? mySkills : null" @choose="emit('choose', r.index)" />
      </template>
    </section>
    </template>
    </div>
    <!-- Always present; greyed out while the server is not offering End Turn. A div, not <footer>:
         base.css pins every <footer> to the bottom of the viewport for the site footer. -->
    <div class="foot">
      <span v-if="me" class="actions-left" role="img" :aria-label="t('locationMap.actionsLeft', { count: me.remainingActions })" :title="t('locationMap.actionsLeft', { count: me.remainingActions })">
        <span v-for="n in actionPips" :key="n" class="pip" :class="{ 'pip--spent': n > me.remainingActions }" aria-hidden="true"></span>
      </span>
      <button type="button" class="end-turn" :class="{ 'end-turn--pulse': pulseEndTurn }" :disabled="!endTurn" :data-game-actionable="endTurn ? true : undefined" @click="endTurn && emit('choose', endTurn.index)">{{ endTurn?.label ?? t('locationMap.endTurn') }}</button>
    </div>
  </aside>
</template>

<style scoped>
.panel { display: flex; flex-direction: column; width: var(--panel-w, 280px); max-height: 100%; overflow: hidden; padding: 0; background: linear-gradient(180deg, var(--surface-1, #142019), var(--surface-0, #0d1611)); border: 1px solid var(--line-strong, #c6a87399); border-radius: var(--radius-lg, 8px); box-shadow: var(--shadow-pop, 0 8px 28px #000a); color: var(--text, #e8e3d0); }
.panel.action-docked {
  width: 100%;
  height: 100%;
  /* Docked between the status block and the log: the sidebar's own divider lines frame it, no card border. */
  border: 0;
  border-block: 1px solid var(--line, #c6a87340);
  border-radius: 0;
  box-shadow: none;
}
/* Only the body scrolls; the end-turn footer stays in view. */
.body { display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 10px 12px 12px; scrollbar-width: thin; scrollbar-color: var(--line, #c6a87355) transparent; overscroll-behavior-y: contain; }
/* The location name stays put while the actions scroll under it. */
/* Same band style as the phase bar and the mission strip titles: a pure colour pair (emerald for your
 * own actions), light uppercase caption with a shadow, a lighter rule underneath. */
header.title-bar { display: block; margin: -10px -12px 0; padding: 7px 12px; font-size: 0.74rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #fff8ea; text-shadow: 0 1px 2px #000a; background: linear-gradient(180deg, #2f7350, #22553b); border-block: 1px solid #5fb487; box-shadow: inset 0 1px 0 #ffffff26; }
header { position: sticky; top: -10px; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: -10px -12px 0; padding: 10px 12px 8px; background: var(--surface-1, #142019); border-bottom: 1px solid var(--line, #c6a87340); }
h3 { margin: 0; min-width: 0; font: 600 1rem/1.2 var(--ui-serif); color: var(--heading, #fff4df); overflow-wrap: anywhere; }
.heading { flex: 1; min-width: 0; display: grid; }
.eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--state-target, #f2d27a); }
.back { flex: none; display: grid; place-items: center; min-width: 26px; min-height: 26px; background: transparent; border: 1px solid var(--line-strong, #c6a873aa); border-radius: var(--radius, 6px); color: var(--heading, #fff4df); font-size: 1rem; line-height: 1; cursor: pointer; }
.back:hover { border-color: var(--accent-gold, #d9b878); background: var(--surface-2, #283a30); }
.back:focus-visible, .section { display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }
.section + .section { border-top: 1px solid #ffffff12; padding-top: 10px; }
h4 { margin: 0 0 2px; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-gold, #d9b878); }
/* Basic actions: resource and draw side by side, the rest full width, end turn last and set apart. */
.section--basic { display: grid; grid-template-columns: 1fr 1fr; }
.section--basic > * { grid-column: 1 / -1; }
.section--basic > .row--half { grid-column: auto; text-align: center; justify-content: center; }
.foot { flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; margin: 0; padding: 8px 12px 10px; background: var(--surface-0, #0d1611); border-top: 1px solid var(--line, #c6a87340); }
.actions-left { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 5px; }
.pip { width: 10px; height: 10px; border-radius: 50%; background: var(--accent-gold, #d9b878); box-shadow: 0 0 5px #d9b87866; }
.pip--spent { background: transparent; box-shadow: inset 0 0 0 1.5px #ffffff38; }
.end-turn { flex: none; min-height: 34px; padding: 0 16px; border-radius: var(--radius, 6px); border: 1px solid #e0915a99; background: #3a241666; color: #ffd9b8; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.end-turn:disabled { opacity: 0.45; cursor: not-allowed; }
.end-turn:hover:not(:disabled) { background: #3a2416; border-color: #e0915a; }
.end-turn--pulse:not(:disabled) { animation: end-turn-pulse 1.1s ease-in-out infinite; border-color: #e0915a; }
@keyframes end-turn-pulse {
  0%, 100% { box-shadow: 0 0 0 0 transparent; background: #3a241666; }
  50% { box-shadow: 0 0 12px 3px #e0915acc; background: #5a3418; }
}
@media (prefers-reduced-motion: reduce) { .end-turn--pulse:not(:disabled) { animation: none; box-shadow: 0 0 10px 2px #e0915acc; } }
.end-turn:focus-visible { outline: var(--focus-ring, 2px solid #ffe9a0); outline-offset: 2px; }
/* Group headings take their section's colour: red only for enemies, brass for cards in play. */
h5 { margin: 4px 0 0; font-size: 0.72rem; color: var(--text-flavor, #cdd4c2); font-weight: 600; }
.section--enemies h5 { color: #e0a595; }
.section--inPlay h5, .section--other h5 { color: var(--accent-gold, #d9b878); }
.section--targets h5 { color: var(--state-target, #f2d27a); }
/* Action rows are the bright, raised layer of the panel: a lit green-slate face with a soft top highlight,
   white text, so they stand clear of the darker panel and log around them. */
.panel { --row-face: linear-gradient(180deg, #3a5244, #2c4234); --row-face-hover: linear-gradient(180deg, #46634f, #35503f); }
.row, .section :deep(button) { width: 100%; min-height: 38px; text-align: left; justify-content: flex-start; align-items: center; padding: 0 10px; font-size: 0.82rem; font-weight: 600; background: var(--row-face) !important; border: 1px solid #c6a87359 !important; border-radius: 6px; box-shadow: inset 0 1px 0 #ffffff1f, 0 1px 2px #0006 !important; transition: background 0.15s, border-color 0.15s, transform 0.1s; color: #fffaf0 !important; cursor: pointer; }
.row:hover, .section :deep(button:hover:not(:disabled)) { background: var(--row-face-hover) !important; border-color: #e6c584 !important; }
.row:active, .section :deep(button:active:not(:disabled)) { transform: translateY(1px); }
.section :deep(button:disabled) { opacity: 0.5; }
/* Inside the panel an ability button is one clean row: label on the left, the tested skill on the right.
   The "basic ability" marker repeats the section heading, so it is dropped. */
.section :deep(.button-basic-section) { display: none; }
.section :deep(.button-label) { flex: 1 1 auto; justify-content: flex-start; padding: 0; gap: 6px; }
.section :deep(button::before) { padding: 0 6px 0 0 !important; margin: 0 !important; opacity: 0.75; font-size: 0.9em; }
.section :deep(.button-skill-section) { padding: 0 0 0 8px; background: transparent; border: 0; font-size: 0.9rem; color: #fff; text-shadow: 0 1px 2px #0008; }
/* The tested skill colours the row's left edge and its icon, so Investigate / Fight / Evade read at a glance. */
.section :deep(button:has(.skill-intellect)) { --skill-tint: var(--intellect, #8a63b8); }
.section :deep(button:has(.skill-combat)) { --skill-tint: var(--combat, #b34a3c); }
.section :deep(button:has(.skill-agility)) { --skill-tint: var(--agility, #3c8a4a); }
.section :deep(button:has(.skill-willpower)) { --skill-tint: var(--willpower, #3c6ab3); }
/* Skill-tested rows wear their skill: a saturated wash that fades toward the label's right, and a bright left edge. */
.section :deep(button:has(.button-skill-section :is(.skill-icon, .skill-icon-img))) { background: linear-gradient(90deg, color-mix(in srgb, var(--skill-tint) 70%, #2c4234), color-mix(in srgb, var(--skill-tint) 35%, #2c4234)) !important; border-color: color-mix(in srgb, var(--skill-tint) 60%, #fff) !important; border-left: 4px solid color-mix(in srgb, var(--skill-tint) 55%, #fff) !important; }
.section :deep(button:has(.button-skill-section :is(.skill-icon, .skill-icon-img)):hover:not(:disabled)) { background: linear-gradient(90deg, color-mix(in srgb, var(--skill-tint) 85%, #3a5244), color-mix(in srgb, var(--skill-tint) 50%, #3a5244)) !important; }
.section--basic > .row--half { font-weight: 500; }
.choice { display: flex; flex-direction: column; background: var(--row-face); border: 1px solid #c6a87359; border-radius: 6px; box-shadow: inset 0 1px 0 #ffffff1f, 0 1px 2px #0006; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.choice:hover { background: var(--row-face-hover); border-color: #e6c584; }
.choice :deep(button), .choice :deep(button:hover:not(:disabled)) { border: 0 !important; background: transparent !important; box-shadow: none !important; }
.choice .text-row { font-size: 0.8rem; color: #fffaf0 !important; }
.empty { margin: 0; font-size: 0.8rem; color: #98a38f; }
/* Bottom sheet: full width, folded to a peek until the grab bar is pressed. */
.panel.sheet { width: auto; max-height: var(--sheet-peek, 30dvh); border-radius: 12px 12px 0 0; padding-top: 4px; transition: max-height 0.2s; }
.panel.sheet.expanded { max-height: var(--sheet-max, 56dvh); }
.grab { flex: none; align-self: center; width: 100%; min-height: var(--tap-min, 0px); display: grid; place-items: center; background: transparent; border: 0; cursor: pointer; }
.grab span { width: 44px; height: 5px; border-radius: 3px; background: #c6a873aa; }
@media (prefers-reduced-motion: reduce) { .panel.sheet { transition: none; } }
/* The panel can be teleported outside the map, so size touch controls from its own input mode. */
.panel[data-input='touch'] { --tap-min: 44px; --tap-gap: 8px; }
.panel[data-input='touch'] .back { min-width: var(--tap-min); min-height: var(--tap-min); font-size: 1.1rem; }
.panel[data-input='touch'] .panel[data-input='touch'] .section { gap: var(--tap-gap); }
.location-map[data-input='touch'] .row,
.panel[data-input='touch'] .section :deep(button) { min-height: var(--tap-min); font-size: 0.9rem; }
.panel[data-input='touch'] .choice { min-height: var(--tap-min); }
.location-map[data-input='touch'] .choice .text-row { font-size: 0.9rem; }
.panel[data-input='touch'] .end-turn { min-height: var(--tap-min); }
</style>
