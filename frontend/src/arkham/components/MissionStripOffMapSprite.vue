<script lang="ts" setup>
import { computed } from 'vue'
import type { Game } from '@/arkham/types/Game'
import type { Location } from '@/arkham/types/Location'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'
import { islandImage, islandWaterImage } from '@/arkham/scene-island-sprites'
import LocationMarkerPlate from '@/arkham/components/LocationMarkerPlate.vue'
import LocationStandees from '@/arkham/components/LocationStandees.vue'

/* A location that stands outside the map's grid (A Light in the Fog's Holding Cells), drawn in the off-map box as
 * its sprite: the plate on top, the people standing on the sprite below. Clicking works as on the map: a choice
 * that asks for this location picks it, otherwise the info card opens (the map owns that card). */
const props = defineProps<{
  game: Game
  playerId: string
  location: Location
  info: MapLocationInfo
  folder: string
  enemiesAt: (l: Location) => string[]
  compact?: boolean
}>()
const emit = defineEmits<{ (e: 'choose', index: number): void; (e: 'inspect', location: Location, anchor: HTMLElement | null): void }>()

const image = computed(() => islandImage(props.folder, props.location.cardCode, props.location.revealed))
const water = computed(() => islandWaterImage(props.folder, props.location.cardCode, props.location.revealed, props.location.floodLevel))

function click(event: MouseEvent) {
  if (props.info.actions.selectIndex !== -1) emit('choose', props.info.actions.selectIndex)
  else emit('inspect', props.location, event.currentTarget as HTMLElement)
}
</script>

<template>
  <div class="off-map-sprite" :class="{ compact, here: info.here, targetable: info.targetable }" :data-id="location.id" @click.stop="click">
    <div class="picture">
      <img class="island" :src="image" alt="" aria-hidden="true" draggable="false" />
      <img v-if="water" class="island water" :src="water" alt="" aria-hidden="true" draggable="false" />
    </div>
    <LocationMarkerPlate class="plate-on-sprite" :info="info" :size="compact ? 'compact' : 'full'" :game="game" :playerId="playerId" :locationId="location.id"
      :data-fx-target="`location-${location.id}`" :data-card-code="location.cardCode"
      @inspect="emit('inspect', location, $event)" @choose="emit('choose', $event)" />
    <div class="floor">
      <LocationStandees :game="game" :playerId="playerId" :location="location" :enemiesAt="enemiesAt" @choose="emit('choose', $event)" />
    </div>
  </div>
</template>

<style scoped>
.off-map-sprite { position: relative; width: 168px; cursor: pointer; display: flex; flex-direction: column; align-items: stretch; }
.off-map-sprite.compact { width: 84px; }
/* The sprite sits under the plate; the floor (the standees) hangs over its lower part. */
.picture { position: relative; aspect-ratio: 3 / 2; margin-top: 22px; }
.compact .picture { margin-top: 14px; }
.island { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; pointer-events: none; user-select: none; filter: drop-shadow(0 6px 10px #0009); }
.island.water { filter: none; }
.off-map-sprite.targetable .picture .island:first-child { filter: drop-shadow(0 0 10px #f2d27a) drop-shadow(0 6px 10px #0009); }
.plate-on-sprite { position: absolute; top: 0; left: 0; right: 0; min-width: 0; z-index: 2; }
.floor { position: relative; z-index: 3; margin-top: -34%; isolation: isolate; }
.compact .floor { margin-top: -24%; }
.floor :deep(.standees) { position: relative; justify-content: center; flex-wrap: wrap; gap: 2px 4px; padding-top: 4px; z-index: 2; }
.floor :deep(.hud) { min-width: 0; padding: 2px 3px; font-size: 10px; }
.floor :deep(.hud .track) { width: 16px; }
.floor :deep(.figure) { height: 56px; max-width: none; }
.floor :deep(.crop) { width: 42px; }
.compact .floor :deep(.figure) { height: 36px; }
.compact .floor :deep(.crop) { width: 28px; }
.compact .floor :deep(.hud) { display: none; }
</style>
