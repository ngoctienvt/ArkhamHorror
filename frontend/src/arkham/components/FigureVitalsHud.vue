<script lang="ts" setup>
import GameIcon from '@/arkham/components/GameIcon.vue'

/* The health and sanity bars above a figure on a scene map: standing in a room (LocationStandees) or riding
 * a vehicle (SceneVehicle). Parents shrink it through `:deep(.hud)`. */
export type Meter = { left: number; max: number }
/** An investigator's resources and clues, counted in the same box under the bars. */
export type Stock = { resources: number; clues: number }
withDefaults(defineProps<{ health: Meter | null; sanity: Meter | null; stock?: Stock | null }>(), { stock: null })
const pct = (m: Meter) => (100 * m.left / Math.max(1, m.max)) + '%'
</script>

<template>
  <span v-if="health || sanity" class="hud">
    <span v-if="health" class="meter hp"><GameIcon type="health" /><span class="track"><i :style="{ width: pct(health) }"></i></span><b>{{ health.left }}/{{ health.max }}</b></span>
    <span v-if="sanity" class="meter sanity"><GameIcon type="sanity" /><span class="track"><i :style="{ width: pct(sanity) }"></i></span><b>{{ sanity.left }}/{{ sanity.max }}</b></span>
    <span v-if="stock" class="stock">
      <span class="tok res"><GameIcon type="resource" /><b>{{ stock.resources }}</b></span>
      <span class="tok clue"><GameIcon type="clue" /><b>{{ stock.clues }}</b></span>
    </span>
  </span>
</template>

<style scoped>
.hud { display: grid; gap: 2px; min-width: 56px; padding: 3px 5px; background: #111815ef; border: 1px solid #9f8d605c; border-radius: 4px; font: 600 11px/1.15 system-ui, sans-serif; white-space: nowrap; text-shadow: none; }
.hud .meter { display: flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums; }
.hud .meter.hp { color: #ff9b87; }
.hud .meter.sanity { color: #9fceee; }
.hud .track { width: 22px; height: 4px; background: #67645d; border-radius: 3px; overflow: hidden; }
.hud .track i { display: block; height: 100%; background: currentColor; }
.hud .meter b { margin-left: auto; color: #fff4df; }
.hud .stock { display: flex; justify-content: space-between; gap: 6px; padding-top: 2px; border-top: 1px solid #9f8d6040; }
.hud .tok { display: inline-flex; align-items: center; gap: 2px; font-variant-numeric: tabular-nums; }
.hud .tok b { color: #fff4df; }
.hud .tok.res { color: #f0d9a8; }
.hud .tok.clue { color: #9fe0c8; }
</style>
