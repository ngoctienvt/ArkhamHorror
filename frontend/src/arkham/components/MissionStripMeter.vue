<script lang="ts" setup>
import { computed } from 'vue'
import GameIcon from '@/arkham/components/GameIcon.vue'
import type { MeterChange } from '@/arkham/composables/useMissionStripPanels'

/* A doom or clue track for the mission strip, sized to sit on the panel's header line: icon, a thin bar
 * (doom: a row of tokens, see `pips`), and "value/max". `onCard` (doom only) marks how much of `value` sits on the agenda card itself; the rest
 * is doom elsewhere in play and gets a lighter, striped fill, so the track and the advance warning agree. */
const props = defineProps<{
  variant: 'doom' | 'clue'
  value: number
  max: number
  onCard?: number
  change?: MeterChange
  label: string
  /** The parent shows its own hover popover, so skip the native tooltip that would cover it. */
  noTooltip?: boolean
}>()

const pct = (n: number) => `${Math.min(100, (100 * Math.max(0, n)) / Math.max(1, props.max))}%`
const filled = computed(() => Math.min(props.value, props.max))
const solid = computed(() => Math.min(props.onCard ?? props.value, filled.value))
const delta = computed(() => props.change ? props.change.to - props.change.from : 0)

/* Doom reads as a row of doom tokens, one slot per point of the threshold: doom on the agenda card is a
 * full token, doom elsewhere in play a faded one, and the slots still open a faint ring. Past a dozen
 * slots the row would crowd the header line, so long thresholds keep the bar. */
const MAX_PIPS = 12
const pips = computed(() => {
  if (props.variant !== 'doom' || props.max < 1 || props.max > MAX_PIPS) return null
  return Array.from({ length: props.max }, (_, i) =>
    i < solid.value ? 'card' : i < filled.value ? 'elsewhere' : 'empty')
})
</script>

<template>
  <div class="meter" :class="`meter--${variant}`" role="img" :title="noTooltip ? undefined : label" :aria-label="label">
    <span v-if="pips" class="pips">
      <i v-for="(s, i) in pips" :key="i" class="pip" :class="`pip--${s}`">
        <GameIcon v-if="s !== 'empty'" type="doom" class="pip__token" />
      </i>
    </span>
    <GameIcon v-if="!pips" :type="variant" class="meter__icon" />
    <!-- Clues read as icon + "1/3" only; the bar stays for a doom threshold too long for tokens. -->
    <i v-if="!pips && variant === 'doom'" class="bar">
      <b class="bar__elsewhere" :style="{ width: pct(filled) }"></b>
      <b class="bar__solid" :style="{ width: pct(solid) }"></b>
    </i>
    <span v-if="!pips" class="num" :class="{ 'num--bump': delta }" :key="change?.to">{{ value }}<small>/{{ max }}</small></span>
    <span v-if="delta" :key="`d${change!.to}`" class="delta" :class="{ 'delta--down': delta < 0 }">{{ delta > 0 ? '+' : '−' }}{{ Math.abs(delta) }}</span>
  </div>
</template>

<style scoped>
.meter { display: inline-flex; align-items: center; gap: 5px; min-width: 0; }
.meter__icon { width: 14px; height: 14px; flex: none; }
.bar { position: relative; display: block; width: 64px; height: 6px; border-radius: 3px; overflow: hidden; background: #ffffff18; box-shadow: inset 0 0 0 1px #ffffff14; }
.bar b { position: absolute; inset: 0 auto 0 0; transition: width 0.4s ease-out; }
.meter--doom .bar__solid { background: var(--doom, #e0523f); box-shadow: 0 0 4px #ff5a4a88; }
.meter--doom .bar__elsewhere { background: repeating-linear-gradient(45deg, #ff7a64aa 0 3px, #5a1a14aa 3px 6px); }
.pips { display: inline-flex; align-items: center; gap: 2px; }
.pip { position: relative; display: inline-flex; width: 15px; height: 15px; flex: none; border-radius: 50%; }
.pip__token { width: 100%; height: 100%; transition: opacity 0.3s, filter 0.3s; }
.pip--card .pip__token { filter: drop-shadow(0 0 3px #ff5a4a99); }
/* Doom from elsewhere: a ghost of the token in a dashed ring, so it reads as counted but not on the agenda. */
.pip--elsewhere { box-shadow: inset 0 0 0 1px #ff8a7466; outline: 1px dashed #ff8a7488; outline-offset: -1px; }
.pip--elsewhere .pip__token { opacity: 0.38; filter: grayscale(0.6); transform: scale(0.78); }
.pip--empty { box-shadow: inset 0 0 0 1px #ffffff26; background: #00000033; }
.num { font-weight: 700; font-size: 0.8rem; font-variant-numeric: tabular-nums; color: var(--heading, #fff4df); }
.num small { font-size: 0.68rem; font-weight: 500; color: var(--text-muted, #9aa597); }
.num--bump { animation: bump 0.9s cubic-bezier(.2,1.6,.4,1) both; }
.delta { font-weight: 800; font-size: 0.8rem; animation: delta 2.1s ease-out both; }
.meter--doom .delta { color: #ff9b86; text-shadow: 0 0 8px #ff5a4a; }
.meter--clue .delta { color: #7ef0a8; text-shadow: 0 0 8px #3ddc7a; }
.meter--doom .delta--down { color: #9fd3a6; text-shadow: 0 0 8px #4aff7a88; }
@keyframes bump { 0% { transform: scale(1.6); filter: brightness(2); } 100% { transform: none; filter: none; } }
@keyframes delta { 0% { transform: translateY(6px) scale(.6); opacity: 0; } 15% { transform: none; opacity: 1; } 70% { opacity: 1; } 100% { transform: translateY(-6px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .num--bump, .delta, .bar b { animation: none; transition: none; } }
</style>
