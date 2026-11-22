<script lang="ts" setup>
// A slim caption for the effect replay step that is playing (see advanceEffects.ts).
// The board itself shows what happens (cards flip, appear, fade out); this ribbon
// only names it, in the same style as the phase banner. Presentational: Game.vue
// plays the steps and decides how long each one shows.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LogPart from '@/arkham/components/LogPart.vue'
import { useCardInfo } from '@/arkham/composables/useCardNames'
import { discardSourceCode, discardedCardCodes, type EffectItem, type EffectStep } from '@/arkham/advanceEffects'

const props = defineProps<{ step: EffectStep; index: number; total: number }>()
const emit = defineEmits<{ skip: [] }>()

const { t } = useI18n()
const cardInfo = useCardInfo()

/* Log sentences grouped under one heading each. */
const LOG_GROUPS: Record<string, string> = {
  enemyAttacks: 'attack',
  engages: 'engage',
  disengages: 'engage',
  placesDoom: 'doom',
  doomOnAgenda: 'doom',
  removesDoom: 'doom',
  placesClues: 'clues',
  removesClues: 'clues',
  discarded: 'discard',
  discardedBy: 'discard',
  defeated: 'defeat',
  defeatedBy: 'defeat',
  removedFromGame: 'remove',
  exiled: 'remove',
  isMovedTo: 'move',
  enemyMovesTo: 'enemyMove',
  enemySpawned: 'spawn',
  enemySpawnedAt: 'spawn',
  locationRevealed: 'reveal',
  attachesTo: 'attach',
}

const group = computed(() => LOG_GROUPS[props.step.logKey ?? ''] ?? 'other')
const heading = computed(() =>
  props.step.kind === 'logged' ? t(`effectTimeline.log.${group.value}`) : t(`effectTimeline.kind.${props.step.kind}`))

const LEAVING_KINDS = new Set(['discardEnemy', 'removeCard', 'removeLocation'])
const LEAVING_GROUPS = new Set(['discard', 'defeat', 'remove'])
const tone = computed(() => {
  if (props.step.logKey === 'enemyAttacks') return 'hostile'
  if (LEAVING_KINDS.has(props.step.kind) || LEAVING_GROUPS.has(group.value)) return 'leaving'
  return 'neutral'
})

const nameOf = (code: string) => cardInfo(code)?.name ?? ''
const join = (items: EffectItem[]) => items.map((item) => nameOf(item.cardCode)).filter(Boolean).join(', ')
/* A scene change reads "old place → new places"; anything else lists what it touched. */
const isScene = computed(() => props.step.kind === 'changeScene')
const names = computed(() => isScene.value
  ? join(props.step.removed ?? [])
  : join(props.step.items))
/* A run of deck discards: how many, what caused it, and the cards turned over. */
const groupedSummary = computed(() => {
  if (!props.step.grouped) return null
  const count = props.step.grouped.length
  const source = nameOf(discardSourceCode(props.step) ?? '')
  return source
    ? t('effectTimeline.discardedCardsBy', { count, source })
    : t('effectTimeline.discardedCards', { count })
})
const groupedNames = computed(() => discardedCardCodes(props.step).map(nameOf).filter(Boolean).join(', '))
const destination = computed(() => {
  if (isScene.value) return join(props.step.items.filter((item) => item.dict === 'locations'))
  return props.step.toLocation ? nameOf(props.step.toLocation.cardCode) : ''
})
</script>

<template>
  <div class="effect-timeline" role="status" aria-live="polite">
    <div :key="`${index}-${step.kind}`" class="effect-timeline__ribbon" :class="`effect-timeline__ribbon--${tone}`">
      <span class="effect-timeline__heading">{{ heading }}</span>
      <span class="effect-timeline__sentence">
        <template v-if="groupedSummary">
          {{ groupedSummary }}
          <span class="effect-timeline__cards">{{ groupedNames }}</span>
        </template>
        <template v-else-if="step.entry">
          <LogPart v-for="(part, i) in step.entry.body" :key="i" :part="part" />
        </template>
        <template v-else>
          {{ names }}<template v-if="destination"> → {{ destination }}</template>
        </template>
      </span>
    </div>
    <div class="effect-timeline__controls">
      <span v-if="total > 1" class="effect-timeline__pips" :aria-label="`${index + 1}/${total}`">
        <i v-for="n in total" :key="n" :class="{ 'is-done': n - 1 < index, 'is-current': n - 1 === index }"></i>
      </span>
      <button type="button" class="effect-timeline__skip" @click="emit('skip')">{{ $t('effectTimeline.skip') }} »</button>
    </div>
  </div>
</template>

<style scoped>
.effect-timeline {
  --et-accent: #f1c97b;
  --et-band: rgba(10, 8, 14, 0.86);
  position: fixed;
  top: calc(var(--nav-height, 36px) + 19vh);
  left: 0;
  right: 0;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

/* Same band as the phase banner: dark in the middle, fading out at both ends. */
.effect-timeline__ribbon {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: min(760px, calc(100vw - 32px));
  padding: 8px 72px 9px;
  text-align: center;
  color: #f3e7c9;
  text-shadow: 0 2px 6px #000;
  background: linear-gradient(90deg, transparent, var(--et-band) 18%, var(--et-band) 82%, transparent);
  animation: effect-timeline-in 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.effect-timeline__ribbon--leaving { --et-accent: #e7a08f; }
.effect-timeline__ribbon--hostile { --et-accent: #ff8a6e; --et-band: rgba(48, 10, 8, 0.88); }

.effect-timeline__heading {
  font-family: Teutonic, var(--ui-serif, serif);
  font-size: clamp(1.1rem, 2.2vw, 1.5rem);
  letter-spacing: 0.08em;
  line-height: 1.15;
  color: var(--et-accent);
}
.effect-timeline__sentence {
  margin-top: 2px;
  font-size: 0.95rem;
  line-height: 1.35;
}

.effect-timeline__cards {
  display: block;
  margin-top: 2px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.effect-timeline__controls {
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
}
.effect-timeline__pips { display: flex; gap: 5px; }
.effect-timeline__pips i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(243, 231, 201, 0.25);
  transition: background 200ms ease, transform 200ms ease;
}
.effect-timeline__pips i.is-done { background: rgba(241, 201, 123, 0.6); }
.effect-timeline__pips i.is-current { background: #f1c97b; transform: scale(1.35); }
.effect-timeline__skip {
  padding: 1px 10px;
  border: 0;
  border-radius: 999px;
  background: rgba(10, 8, 14, 0.7);
  color: rgba(243, 231, 201, 0.75);
  font-size: 0.75rem;
  cursor: pointer;
}
.effect-timeline__skip:hover { color: #f1c97b; background: rgba(10, 8, 14, 0.9); }

@keyframes effect-timeline-in {
  from { opacity: 0; transform: scaleX(0.7); }
  to { opacity: 1; transform: none; }
}
@media (max-width: 800px) {
  .effect-timeline { top: calc(var(--nav-height, 36px) + 10vh); }
  .effect-timeline__ribbon { padding: 6px 36px 7px; }
  .effect-timeline__sentence { font-size: 0.85rem; }
}
@media (prefers-reduced-motion: reduce) {
  .effect-timeline__ribbon { animation: none; }
}
</style>

<style>
/* Board elements a step is touching, marked by Game.vue through data-fx-target.
   drop-shadow follows the card or sprite outline instead of drawing a box. */
.effect-fx--appearing {
  animation: effect-fx-appear 700ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
}
.effect-fx--flip-out {
  animation: effect-fx-flip-out 260ms ease-in forwards;
}
.effect-fx--flip-in {
  animation: effect-fx-flip-in 520ms cubic-bezier(0.2, 0.8, 0.3, 1) both;
}
.effect-fx--arriving {
  animation: effect-fx-glow 1100ms ease-out;
}
.effect-fx--leaving {
  animation: effect-fx-leave 650ms ease-in forwards;
}
.effect-fx--attacking {
  animation: effect-fx-strike 450ms ease-in-out 2;
}
@keyframes effect-fx-appear {
  0% { opacity: 0; transform: scale(0.6); filter: drop-shadow(0 0 0 rgba(241, 201, 123, 0)); }
  60% { opacity: 1; transform: scale(1.06); filter: drop-shadow(0 0 14px rgba(241, 201, 123, 0.95)); }
  100% { transform: none; filter: drop-shadow(0 0 0 rgba(241, 201, 123, 0)); }
}
@keyframes effect-fx-flip-out {
  to { transform: perspective(700px) rotateY(90deg); }
}
@keyframes effect-fx-flip-in {
  0% { transform: perspective(700px) rotateY(-90deg); filter: drop-shadow(0 0 16px rgba(241, 201, 123, 0.95)); }
  100% { transform: none; filter: drop-shadow(0 0 0 rgba(241, 201, 123, 0)); }
}
@keyframes effect-fx-glow {
  0% { filter: drop-shadow(0 0 14px rgba(241, 201, 123, 0.95)); }
  100% { filter: drop-shadow(0 0 0 rgba(241, 201, 123, 0)); }
}
@keyframes effect-fx-leave {
  0% { filter: drop-shadow(0 0 10px rgba(217, 96, 76, 0.9)); }
  100% { opacity: 0; filter: grayscale(1) drop-shadow(0 0 0 rgba(217, 96, 76, 0)); transform: scale(0.85); }
}
@keyframes effect-fx-strike {
  0%, 100% { transform: none; filter: drop-shadow(0 0 0 rgba(255, 90, 60, 0)); }
  30% { transform: translateX(-6px) rotate(-2deg); filter: drop-shadow(0 0 14px rgba(255, 90, 60, 0.95)); }
  70% { transform: translateX(6px) rotate(2deg); }
}
@media (prefers-reduced-motion: reduce) {
  .effect-fx--appearing, .effect-fx--flip-out, .effect-fx--flip-in,
  .effect-fx--arriving, .effect-fx--leaving, .effect-fx--attacking { animation: none; }
}
</style>
