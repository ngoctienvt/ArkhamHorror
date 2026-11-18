<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import HandCard from '@/arkham/components/HandCard.vue'
import Treachery from '@/arkham/components/Treachery.vue'
import EnemyView from '@/arkham/components/Enemy.vue'
import { useSortedHand } from '@/arkham/composables/useSortedHand'

/* The hand, fixed to the bottom of the browser window like the offline demo: every card is shown at once,
 * each showing about 60% of itself and rising when hovered. Playing a card still goes through HandCard,
 * so it sends the choice the server offered. */
const props = defineProps<{ game: Game; playerId: string }>()
const emit = defineEmits<{ (e: 'choose', index: number): void }>()

const { t } = useI18n()
const me = computed(() => ownInvestigator(props.game, props.playerId))
const hand = useSortedHand(() => me.value?.hand ?? [])
/* Cards held in hand that are not in `investigator.hand`: a Hidden treachery (e.g. Visions in Your Mind)
 * or an enemy kept in hand. They live in the game's treacheries/enemies with a hand placement. */
const inHand = (p: { tag: string; contents?: unknown }) =>
  (p.tag === 'HiddenInHand' || p.tag === 'StillInHand') && p.contents === me.value?.id
const hiddenTreacheries = computed(() =>
  me.value ? Object.values(props.game.treacheries).filter((t) => inHand(t.placement)) : [])
const hiddenEnemies = computed(() =>
  me.value ? Object.values(props.game.enemies).filter((e) => inHand(e.placement)) : [])
const handCount = computed(() => hand.value.length + hiddenTreacheries.value.length + hiddenEnemies.value.length)
const dock = ref<HTMLElement | null>(null)
let observer: ResizeObserver | null = null
/* Other overlays keep clear of the hand through two variables: `--hand-h` is the room the page leaves
 * under the map for the hand, `--hand-cover` how much of the window the resting cards really cover.
 * The cards stand taller than the room left for them, so anything pinned to the bottom of the map
 * (the action panel's End turn) has to stop above `--hand-cover`, not `--hand-h`. */
const clearHandVars = () => {
  const root = document.documentElement.style
  root.removeProperty('--hand-h')
  root.removeProperty('--hand-cover')
}
watch(dock, (el) => {
  observer?.disconnect()
  observer = null
  if (!el) { clearHandVars(); return }
  observer = new ResizeObserver(() => {
    const height = el.getBoundingClientRect().height
    const root = document.documentElement.style
    // Never negative: on a phone the cards are small and the dock is shorter than the sunk part of a full-size card.
    root.setProperty('--hand-h', `${Math.max(0, Math.round(height - 0.4 * 1.4 * 130))}px`)
    root.setProperty('--hand-cover', `${Math.round(height)}px`)
  })
  observer.observe(el)
})
onBeforeUnmount(() => { observer?.disconnect(); clearHandVars() })

// No hover on a finger: a tap on a card opens HandCard's enlarged preview with its Play button.
</script>

<template>
  <Teleport to="body">
    <div v-if="me && handCount" ref="dock" class="hand-dock" :aria-label="t('locationMap.hand', { count: handCount })">
      <div class="cards">
        <div v-for="(card, i) in hand" :key="i" class="slot">
          <HandCard :card="card" :game="game" :ownerId="me.id" :playerId="playerId" @choose="emit('choose', $event)" />
        </div>
        <div v-for="enemy in hiddenEnemies" :key="enemy.id" class="slot">
          <EnemyView :enemy="enemy" :game="game" :playerId="playerId" @choose="emit('choose', $event)" />
        </div>
        <div v-for="treachery in hiddenTreacheries" :key="treachery.id" class="slot">
          <Treachery :treachery="treachery" :game="game" :playerId="playerId" :isInHand="true" @choose="emit('choose', $event)" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.hand-dock { position: fixed; left: 0; right: 0; bottom: 0; padding-bottom: env(safe-area-inset-bottom, 0px); box-sizing: border-box; z-index: 900; display: flex; flex-direction: column; align-items: center; pointer-events: none; }
/* card height is about 1.4x its width; sinking the row by 40% of that leaves 60% of every card visible */
.cards { display: flex; justify-content: center; gap: 6px; margin-bottom: calc(-0.4 * 1.4 * 130px); max-width: 100%; padding: 0 8px; box-sizing: border-box; }
.slot { pointer-events: auto; flex: 0 1 130px; min-width: 0; transition: transform 0.15s; }
@media (hover: hover) { .slot:hover { transform: translateY(calc(-0.4 * 1.4 * 130px - 6px)); } }
.slot :deep(.card) { width: 100%; min-width: 0; max-width: none; }
/* Treachery/Enemy size themselves with --card-width and wrap in fit-content; stretch them to the slot like HandCard. */
.slot > :deep(.treachery), .slot > :deep(.enemy), .slot > :deep(.enemy--outer) { width: 100%; }
.slot :deep(.treachery-face) { width: 100%; }
</style>
