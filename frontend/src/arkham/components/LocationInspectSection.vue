<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import { computeStat, formatStat } from '@/arkham/statModel'
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import SceneGlyph from '@/arkham/components/SceneGlyph.vue'
import BarrierIcon from '@/arkham/components/BarrierIcon.vue'

/* The part of the action panel shown while looking at a location other than the one you stand on:
 * where it leads (each a button that looks at that location next), how your intellect compares with its
 * shroud, and the actions the server offers for it right now. Every button sends the index its choice
 * already had; looking never sends anything. */
const props = defineProps<{
  game: Game
  playerId: string
  info: MapLocationInfo
  /** Each connecting location, with the barriers standing on the link to it (In Too Deep; 0 elsewhere). */
  connections: { id: string; name: string; revealed: boolean; barriers?: number }[]
}>()
const emit = defineEmits<{ (e: 'choose', index: number): void; (e: 'inspect', id: string): void }>()

const { t } = useI18n()
const me = computed(() => ownInvestigator(props.game, props.playerId))
// Your intellect with lasting modifiers applied (a Death XIII in play), shown as `5(4+1)` when changed.
const myIntellect = computed(() => {
  if (!me.value) return null
  const stat = computeStat('intellect', me.value.intellect, me.value.modifiers)
  return { value: stat.current, label: formatStat(stat.current, stat.printed) }
})
const hasAction = computed(() => Boolean(props.info.actions.move || props.info.actions.investigate
  || props.info.actions.other.length || props.info.actions.selectIndex !== -1))
</script>

<template>
  <div class="inspect">
    <p v-if="info.shroud && !info.shroud.x && myIntellect" class="compare"
      :title="t('locationMap.info.investigateCompare', { intellect: myIntellect.value, shroud: info.shroud.current })">
      <span class="intellect-icon" aria-hidden="true"></span> {{ myIntellect.label }} vs {{ info.shroud.current }}
    </p>

    <div v-if="connections.length" class="link-row" :aria-label="t('locationMap.info.connections')">
      <span class="arrow"><SceneGlyph name="move" /></span>
      <button v-for="c in connections" :key="c.id" type="button" class="link-chip" :class="{ hidden: !c.revealed, blocked: (c.barriers ?? 0) > 0 }"
        :title="(c.barriers ?? 0) > 0 ? t('locationMap.link.barriers', { n: c.barriers, a: info.face.name, b: c.name }, c.barriers ?? 0) : undefined"
        @click="emit('inspect', c.id)">
        {{ c.revealed ? '●' : '?' }} {{ c.name }}<span v-if="(c.barriers ?? 0) > 0" class="barriers"><BarrierIcon class="icon" />{{ c.barriers }}</span></button>
    </div>

    <section v-if="hasAction" class="actions">
      <button v-if="info.actions.selectIndex !== -1" type="button" class="act primary" @click="emit('choose', info.actions.selectIndex)"><SceneGlyph name="choose" /> {{ t('locationMap.info.chooseThis') }}</button>
      <button v-if="info.actions.move" type="button" class="act move" @click="emit('choose', info.actions.move.index)"><SceneGlyph name="move" /> {{ t('locationMap.marker.moveHere') }}</button>
      <button v-if="info.actions.investigate" type="button" class="act investigate" @click="emit('choose', info.actions.investigate.index)"><SceneGlyph name="investigate" /> {{ t('locationMap.info.investigate') }}</button>
      <AbilityButton v-for="c in info.actions.other" :key="c.index" :game="game" :ability="c.contents" @choose="emit('choose', c.index)" />
    </section>
  </div>
</template>

<style scoped>
.inspect { display: grid; gap: 8px; font-size: 0.78rem; }
.compare { margin: 0; color: var(--clue, #8fd0e4); font-variant-numeric: tabular-nums; }
.link-row { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
.arrow { display: inline-grid; color: var(--accent-gold, #d9b878); }
.link-chip { min-height: 24px; padding: 1px 8px; border: 1px solid var(--line-strong, #c6a873aa); border-radius: 999px; background: transparent; color: var(--text, #f2ecdc); font: inherit; cursor: pointer; }
.link-chip.hidden { border-style: dashed; color: var(--text-muted, #b6bfb0); }
.link-chip:hover { border-color: var(--state-here, #ffe9a0); }
/* A link holding barriers: rust rim and a barricade with the count after the name. */
.link-chip.blocked { border-color: #d9774f; }
.link-chip .barriers { display: inline-flex; align-items: center; gap: 2px; margin-left: 6px; color: #d9774f; font-weight: 700; }
.link-chip .barriers .icon { width: 14px; height: 14px; }
.actions { display: grid; gap: 5px; }
.act { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border: 1px solid var(--line, #c6a87355); border-radius: var(--radius, 6px); background: var(--surface-1, #1f2d25); color: var(--text, #f2ecdc); font: inherit; font-weight: 600; text-align: left; cursor: pointer; }
.act:hover { border-color: var(--accent-gold, #d9b878); background: var(--surface-2, #283a30); }
.act.primary { background: var(--accent-gold, #d9b878); border-color: var(--accent-gold, #d9b878); color: #191c16; }
.act.move { border-color: var(--state-move, #8fd19a); }
.act.investigate { border-color: var(--clue, #8fd0e4); }
button:focus-visible { outline: var(--focus-ring, 2px solid #ffe9a0); outline-offset: 2px; }
/* Fingers: every button reaches 44px. */
.location-map[data-input='touch'] .inspect { font-size: 0.9rem; }
.panel[data-input='touch'] .link-row { gap: var(--tap-gap); }
.panel[data-input='touch'] .link-chip { min-height: var(--tap-min); padding: 0 14px; border-radius: 22px; }
.panel[data-input='touch'] .actions { gap: var(--tap-gap); }
.panel[data-input='touch'] .act { min-height: var(--tap-min); }
</style>
