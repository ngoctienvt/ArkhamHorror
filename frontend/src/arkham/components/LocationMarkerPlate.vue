<script lang="ts" setup>
import { heldCount } from '@/arkham/motion/tokenHolds'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'
import { replaceText } from '@/arkham/cardTextFormat'

/* The name plate a location wears on the map: its name, whether it is revealed, and the numbers that
 * matter at a glance, on one slim line so it hides as little of the painting as it can. Clicking it picks
 * the location when a choice asks for one, otherwise opens its info card. Hovering the location shows the
 * card itself with its translated text (CardOverlay), so the plate carries no info button of its own. */
/* `hideMove`: the map draws this location's move button on the link leading to it instead. */
const props = withDefaults(defineProps<{ info: MapLocationInfo; size?: 'full' | 'compact' | 'room'; showText?: boolean; game?: Game; locationId?: string; hideMove?: boolean }>(), { size: 'full', showText: false, hideMove: false })
/* Clues still here on screen while they fly off to the investigator who found them. */
const cluesLeft = computed(() =>
  props.locationId ? heldCount(`location-${props.locationId}`, 'clue', props.info.clues.left) : props.info.clues.left,
)
const emit = defineEmits<{ (e: 'inspect', anchor: HTMLElement): void; (e: 'choose', index: number): void }>()

const { t } = useI18n()

// A room plate on a picture has space for the face-up side's text and flavour, shown without a click.
const textHtml = computed(() => props.size === 'room' && props.showText && props.info.face.text ? replaceText(props.info.face.text) : null)
const flavorHtml = computed(() => props.size === 'room' && props.showText && props.info.face.flavor ? replaceText(props.info.face.flavor) : null)

const showStats = computed(() => props.size !== 'compact' && props.info.revealed)
const showClues = computed(() => props.size === 'compact'
  ? cluesLeft.value > 0
  : showStats.value && (cluesLeft.value > 0 || (props.info.clues.printed ?? 0) > 0))
const clueLabel = computed(() => t('locationMap.marker.cluesValue', { n: cluesLeft.value }))
const clueTitle = computed(() => props.info.clues.printed === null
  ? clueLabel.value
  : clueLabel.value + ' · ' + t('locationMap.marker.printed', { n: props.info.clues.printed }))

const summary = computed(() => {
  const i = props.info
  const parts = [i.face.name, i.revealed ? t('locationMap.marker.revealed') : t('locationMap.marker.unrevealed')]
  if (i.here) parts.push(t('locationMap.marker.youAreHere'))
  else if (i.adjacent) parts.push(t('locationMap.marker.adjacent'))
  if (i.shroud) parts.push(t('locationMap.marker.shroudValue', { n: i.shroud.x ? 'X' : i.shroud.current }))
  if (showClues.value) parts.push(clueLabel.value)
  if (i.onEnter) parts.push(t('locationMap.marker.onEnter'))
  if (i.targetable) parts.push(t('locationMap.marker.targetable'))
  return parts.join(', ')
})

function anchorOf(event: Event): HTMLElement {
  return ((event.currentTarget as HTMLElement).closest('.plate') as HTMLElement | null) ?? (event.currentTarget as HTMLElement)
}

function onMain(event: Event) {
  if (props.info.actions.selectIndex !== -1) emit('choose', props.info.actions.selectIndex)
  else emit('inspect', anchorOf(event))
}
import GameIcon from '@/arkham/components/GameIcon.vue'
import PoolItem from '@/arkham/components/PoolItem.vue'
import ShroudDisc from '@/arkham/components/ShroudDisc.vue'
import AttachmentChips from '@/arkham/components/AttachmentChips.vue'
import type { Game } from '@/arkham/types/Game'
</script>

<template>
  <div class="plate" :class="[size, {
    movable: !!info.actions.move,
    revealed: info.revealed, here: info.here, adjacent: info.adjacent, targetable: info.targetable, exhausted: info.exhausted,
    'with-lore': !!(textHtml || flavorHtml),
  }]">
    <div class="head">
      <!-- Shroud sits in front of the name like the printed card's disc; clues and doom trail it, so the
           plate is one tidy line instead of a name row over a half-empty stats row. -->
      <ShroudDisc v-if="showStats && info.shroud" :value="info.shroud.x ? 'X' : info.shroud.current"
        :modified="info.shroud.current !== info.shroud.printed"
        :title="t('locationMap.marker.shroud') + (info.shroud.current !== info.shroud.printed ? ' · ' + t('locationMap.marker.printed', { n: info.shroud.printed }) : '')" />
      <button class="main" type="button" :aria-label="summary" @click.stop="onMain">
        <span class="name">{{ info.face.name }}</span>
        <span v-if="info.onEnter" class="warn" aria-hidden="true">⚠</span>
      </button>
      <PoolItem v-if="showClues" type="clue" :amount="cluesLeft" class="clue-token"
        :style="{ '--clue-digits': String(cluesLeft).length }" :title="clueTitle" aria-hidden="true" />
      <span v-if="showStats && info.doom" class="chip doom" :title="t('locationMap.doom')"><GameIcon type="doom" />{{ info.doom }}</span>
      <button v-if="size !== 'compact' && info.actions.move && !hideMove" class="go" type="button"
        :title="t('locationMap.marker.moveHere')" :aria-label="t('locationMap.marker.moveHere')"
        @click.stop="emit('choose', info.actions.move.index)"><span aria-hidden="true">↔</span></button>
    </div>
    <!-- Cards lying on this location (Obscuring Fog, Locked Door…) get their own row so several stay readable;
         hover a chip for its effect and the card. -->
    <AttachmentChips v-if="game && locationId && size !== 'compact'" :game="game" host="location" :hostId="locationId" placement="down" :max="4" />
    <!-- Card text comes from the bundled ArkhamDB card list, formatted the way the card overlay formats it. -->
    <div v-if="textHtml || flavorHtml" class="lore">
      <p v-if="textHtml" class="text" v-html="textHtml"></p>
      <p v-if="flavorHtml" class="flavor" v-html="flavorHtml"></p>
    </div>
  </div>
</template>

<style scoped>
.plate {
  --edge: #c6a873;
  display: inline-grid; justify-items: stretch; gap: 3px; min-width: 0; max-width: max(240px, 26cqw);
  padding: 2px 5px; border: 1px solid var(--edge); border-radius: 6px;
  /* See-through enough that the room painted underneath still reads; the blur keeps the name legible. */
  background: linear-gradient(180deg, #18241cc4, #0b120eb8); box-shadow: inset 0 1px 0 #ffffff12, 0 2px 8px #000a; backdrop-filter: blur(3px);
  transition: background 0.15s, box-shadow 0.15s;
  color: #efe6cf; font: 600 11px/1.2 system-ui, sans-serif; text-align: left; pointer-events: auto;
}
.plate:not(.revealed) { --edge: var(--state-hidden, #9a9d98); border-style: dashed; background: #5b5f5ae6; color: #ecebe4; }
.plate:hover, .plate:focus-within { background: linear-gradient(180deg, #18241cf2, #0b120eee); }
/* A plate you can walk to gets a green edge, the same colour as its ↔ pill. */
.plate.movable:not(.here) { --edge: var(--state-move, #8fd19a); }
.plate.here { --edge: var(--state-here, #ffe9a0); box-shadow: 0 0 0 1px #ffe9a080, 0 0 14px #ffe9a066, 0 2px 10px #000c; }
.plate.adjacent { --edge: #9fc3a0; }
.plate.targetable { --edge: var(--state-target, #f2d27a); animation: beckon 1.6s ease-in-out infinite; }
.plate.exhausted .name { color: #9a968c; }
@keyframes beckon { 50% { box-shadow: 0 0 0 2px #f2d27a, 0 0 18px #f2d27aaa; } }
@media (prefers-reduced-motion: reduce) { .plate.targetable { animation: none; box-shadow: 0 0 0 2px #f2d27a; } }
.head { display: flex; align-items: center; gap: 4px; }
/* Attachment row: left-aligned under the name, with room below for the chips' counter badges. */
.plate > :deep(.chips) { justify-self: start; justify-content: flex-start; max-width: 100%; gap: 6px; padding: 0 6px 4px 0; }
.plate > :deep(.chips .chip) { width: 22px; height: 22px; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
.main { display: flex; align-items: center; gap: 4px; flex: 1; min-width: 0; min-height: 18px; }
.main:focus-visible, .go:focus-visible { outline: var(--focus-ring, 2px solid #ffe9a0); outline-offset: 2px; border-radius: 3px; }
.name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 600 0.8rem/1.15 var(--ui-serif); font-variant: small-caps; letter-spacing: 0.02em; text-shadow: 0 1px 2px #000; }
.warn { color: #f0a868; }
.main:hover .name { color: #fff3cf; }
.chip { display: inline-flex; align-items: center; gap: 2px; flex: none; height: 1.5em; padding: 0 5px 0 3px; border-radius: 9px; background: #00000059; border: 1px solid #ffffff1a; font-variant-numeric: tabular-nums; white-space: nowrap; }
.chip :deep(.game-icon) { width: 1.15em; height: 1.15em; }
.head > .clue-token {
  --pool-token-width: 1.75em; /* Same diameter as ShroudDisc. */
  flex: none;
  font-size: inherit;
}
.clue-token :deep(span) {
  font-size: min(calc(var(--pool-token-width) * .62), calc(var(--pool-token-width) * 1.25 / var(--clue-digits)));
  line-height: 1;
}
.chip.doom { color: #e0a595; }
/* Move here: a small green pill at the end of the name line instead of a second row under it. */
.go { display: inline-grid; place-items: center; flex: none; height: 1.5em; padding: 0 6px; border: 1px solid #8fd19a; border-radius: 9px; background: #1d3324; color: #d7ecd2; font-size: 11px; line-height: 1; }
.go:hover { background: #2f5a3a; color: #fff; box-shadow: 0 0 6px #5fd88a88; }
/* A room plate hugs its content and only spans the room's width when it carries the card text. */
.plate.room { display: grid; width: fit-content; max-width: 100%; min-width: 0; font-size: clamp(9px, 1.5cqh, 12px); }
.plate.room.with-lore { width: 100%; }
.room .name { font-size: clamp(0.8rem, 2.1cqh, 1.05rem); }
.lore { display: grid; gap: 3px; max-height: 11em; overflow-y: auto; padding-top: 3px; border-top: 1px solid #c6a87333; font-weight: 500; line-height: 1.3; }
.lore p { margin: 0; white-space: pre-line; }
.lore .flavor { font-style: italic; color: #c9bf9f; }
.plate.compact { min-width: 0; max-width: 100%; padding: 1px 3px; gap: 0; font-size: 8px; border-radius: 4px; box-shadow: none; backdrop-filter: none; }
.compact .name { font-size: 0.55rem; }
.compact .head { display: grid; gap: 0; }
.compact .main { min-height: 0; min-width: 0; gap: 2px; }
.compact .clue-token { justify-self: center; }
@media (max-width: 800px) {
  .plate.full .main { min-height: 44px; }
  .plate.full .go { min-height: 44px; }
}
/* Fingers: the buttons keep their look but reach 44px, so a plate stays small over the painting.
 * The invisible reach of the name and the ↔ pill never overlaps: the name stops where the pill's reach begins. */
.location-map[data-input='touch'] .plate.full { font-size: 12px; }
.location-map[data-input='touch'] .plate.room { font-size: max(12px, clamp(9px, 1.5cqh, 12px)); }
.location-map[data-input='touch'] .plate:not(.compact) .chip { font-size: 12px; padding: 2px 7px; }
.location-map[data-input='touch'] .plate:not(.compact) .main,
.location-map[data-input='touch'] .plate:not(.compact) .go { position: relative; }
.location-map[data-input='touch'] .plate:not(.compact) .main::before { content: ''; position: absolute; inset: calc((var(--tap-min) - 22px) / -2) 0; }
.location-map[data-input='touch'] .plate:not(.compact) .go::after { content: ''; position: absolute; inset: calc((var(--tap-min) - 20px) / -2); }
.location-map[data-input='touch'] .plate:not(.compact) .head { gap: calc((var(--tap-min) - 20px) / 2); }
</style>
