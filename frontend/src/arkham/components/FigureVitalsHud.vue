<script lang="ts" setup>
import GameIcon from '@/arkham/components/GameIcon.vue'

/* The health and sanity bars above a figure on a scene map: standing in a room (LocationStandees) or riding
 * a vehicle (SceneVehicle). Parents shrink it through `:deep(.hud)`. */
export type Meter = { left: number; max: number }
defineProps<{ health: Meter | null; sanity: Meter | null }>()
const pct = (m: Meter) => (100 * m.left / Math.max(1, m.max)) + '%'
</script>

<template>
  <span v-if="health || sanity" class="hud">
    <span v-if="health" class="meter hp"><GameIcon type="health" /><span class="track"><i :style="{ width: pct(health) }"></i></span><b>{{ health.left }}/{{ health.max }}</b></span>
    <span v-if="sanity" class="meter sanity"><GameIcon type="sanity" /><span class="track"><i :style="{ width: pct(sanity) }"></i></span><b>{{ sanity.left }}/{{ sanity.max }}</b></span>
  </span>
</template>

<style scoped>
.hud { display: grid; gap: 2px; min-width: 56px; padding: 3px 5px; background: #111815ef; border: 1px solid #9f8d605c; border-radius: 4px; font: 600 10px/1.15 system-ui, sans-serif; white-space: nowrap; text-shadow: none; }
.hud .meter { display: flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums; }
.hud .meter.hp { color: #ff9b87; }
.hud .meter.sanity { color: #9fceee; }
.hud .track { width: 22px; height: 4px; background: #67645d; border-radius: 3px; overflow: hidden; }
.hud .track i { display: block; height: 100%; background: currentColor; }
.hud .meter b { margin-left: auto; color: #fff4df; }
</style>
