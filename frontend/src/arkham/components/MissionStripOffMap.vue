<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'
import type { Location as LocationModel } from '@/arkham/types/Location'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'
import { offMapGroups } from '@/arkham/offMapCards'
import { hasOwnIsland } from '@/arkham/scene-island-sprites'
import EnemyView from '@/arkham/components/Enemy.vue'
import Investigator from '@/arkham/components/Investigator.vue'
import Location from '@/arkham/components/Location.vue'
import MissionStripOffMapSprite from '@/arkham/components/MissionStripOffMapSprite.vue'
import Story from '@/arkham/components/Story.vue'
import Asset from '@/arkham/components/Asset.vue'
import TreacheryView from '@/arkham/components/Treachery.vue'

/* Cards in play at no location (in the shadows, pursuit, the Void / The Depths, global, next to the
 * reference card) on the scene's mission strip, beside the reference card. The card board shows them
 * in its scenario row, which the scene hides. Each is the board's own card view, so tokens, abilities,
 * hover text and target clicks work the same. */
const props = defineProps<{
  game: Game; scenario: Scenario; playerId: string; compact?: boolean
  /** The map's sprite folder and how it reads a location, so an isolated location is drawn as its sprite. */
  sprites?: { folder: string; infoOf: (l: LocationModel) => MapLocationInfo; enemiesAt: (l: LocationModel) => string[] }
}>()
const emit = defineEmits<{ (e: 'choose', index: number): void; (e: 'inspect', location: LocationModel, anchor: HTMLElement | null): void }>()

const { t } = useI18n()
const groups = computed(() => offMapGroups(props.game, props.scenario))
const choose = (index: number) => emit('choose', index)
/** A location in the box is its sprite on a board that has one for it, otherwise its card. */
const spriteOf = (id: string) => props.sprites && props.game.locations[id] && hasOwnIsland(props.sprites.folder, props.game.locations[id].cardCode)
</script>

<template>
  <section v-for="g in groups" :key="g.kind" class="off-map" :class="[`off-map--${g.kind}`, { compact }]" :aria-label="t(`locationMap.offMap.${g.kind}`)">
    <header class="eyebrow">{{ t(`locationMap.offMap.${g.kind}`) }}</header>
    <div class="cards">
      <template v-for="id in g.locations" :key="id">
        <MissionStripOffMapSprite v-if="sprites && spriteOf(id)" :game="game" :playerId="playerId" :location="game.locations[id]"
          :info="sprites.infoOf(game.locations[id])" :folder="sprites.folder" :enemiesAt="sprites.enemiesAt" :compact="compact"
          @choose="choose" @inspect="(l, anchor) => emit('inspect', l, anchor)" />
        <Location v-else-if="game.locations[id]" class="location" :game="game" :playerId="playerId" :location="game.locations[id]" @choose="choose" />
      </template>
      <template v-for="id in g.enemies" :key="id">
        <EnemyView v-if="game.enemies[id]" :enemy="game.enemies[id]" :game="game" :playerId="playerId" @choose="choose" />
      </template>
      <template v-for="id in g.investigators" :key="id">
        <Investigator v-if="game.investigators[id]" :choices="[]" :investigator="game.investigators[id]" :playerId="playerId" :game="game" :portrait="true" />
      </template>
      <template v-for="id in g.stories" :key="id">
        <Story v-if="game.stories[id]" :story="game.stories[id]" :game="game" :playerId="playerId" @choose="choose" />
      </template>
      <template v-for="id in g.assets" :key="id">
        <Asset v-if="game.assets[id]" :asset="game.assets[id]" :game="game" :playerId="playerId" @choose="choose" />
      </template>
      <template v-for="id in g.treacheries" :key="id">
        <TreacheryView v-if="game.treacheries[id]" :treachery="game.treacheries[id]" :game="game" :playerId="playerId" @choose="choose" />
      </template>
    </div>
  </section>
</template>

<style scoped>
.off-map { flex: none; display: flex; flex-direction: column; gap: 4px; padding: 5px 8px; border-radius: 8px; background: #0009; border: 1px solid #c6a87355; }
.off-map--shadows { border-color: #7a5a8c88; }
.off-map--pursuit, .off-map--void, .off-map--depths { border-color: #c9684f88; }
.eyebrow { font-size: 0.66rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #e6d3a8; white-space: nowrap; }
.off-map--shadows .eyebrow { color: #c9a8de; }
.off-map--pursuit .eyebrow, .off-map--void .eyebrow, .off-map--depths .eyebrow { color: #e8a08d; }
.cards { display: flex; gap: 6px; align-items: flex-start; flex-wrap: wrap; max-width: 46vw; }
/* Card views size themselves for the board; the strip keeps them thumbnail-sized. */
.cards :deep(.card) { width: 64px; min-width: 0; }
.cards :deep(.location) { min-width: unset; }
.cards :deep(.location-container) { grid-template-columns: 0 1fr 0; }
.cards :deep(.portrait) { width: 48px; }
.compact .cards :deep(.card) { width: 34px; }
.compact .cards :deep(.portrait) { width: 28px; }
.compact .cards :deep(.pool) { display: none; }
</style>
