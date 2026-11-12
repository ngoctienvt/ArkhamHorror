<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import { MessageType } from '@/arkham/types/Message'
import { cardImage, investigatorCardArt, portraitImage } from '@/arkham/cardImages'
import { spriteFor } from '@/arkham/sceneSprites'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { useGameChoices } from '@/arkham/composables/useGameChoices'
import { choicesFor } from '@/arkham/locationChoices'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import { headingAfterMove, type SceneVehicle } from '@/arkham/scene-vehicle-model'
import AbilityButton from '@/arkham/components/AbilityButton.vue'

/* A vehicle sailing between the cells of a scene map (Devil Reef's Fishing Vessel). Whoever is aboard stands
 * on its deck. Clicking it offers what the server currently allows with it: board or leave, sail it, or pick
 * it as a target. With exactly one such choice the click sends it; with several a small menu opens. The boat
 * glides to its new cell and turns its bow the way it travelled. */
const props = defineProps<{
  game: Game
  playerId: string
  vehicle: SceneVehicle
  /** Where it is drawn, in percent of the stage. */
  x: number
  y: number
  /** Width of the sprite in pixels; the 3:2 picture sets the height. */
  width: number
}>()
const emit = defineEmits<{ (e: 'choose', index: number): void }>()

const { t } = useI18n()
const nameOf = useCardNames()
const name = computed(() => nameOf(props.vehicle.cardCode))
const choices = useGameChoices(() => props.game, () => props.playerId)
const targetIndex = computed(() => choices.value.findIndex((c) => c.tag === MessageType.TARGET_LABEL && c.target.contents === props.vehicle.id))
const options = computed(() => choicesFor(choices.value, props.vehicle.id))
const actionable = computed(() => targetIndex.value !== -1 || options.value.length > 0)

const heading = ref<'left' | 'right'>('right')
watch(() => props.x, (to, from) => { heading.value = headingAfterMove(from, to, heading.value) })

const ownId = computed(() => ownInvestigator(props.game, props.playerId)?.id)
const passengerName = (id: string) => nameOf(props.game.investigators[id]?.cardCode ?? id)
/* Passengers stand on the deck as the same full-body figures the other scene maps use; an investigator
 * without one falls back to the round portrait. */
const crew = computed(() => props.vehicle.passengers.flatMap((id) => {
  const i = props.game.investigators[id]
  if (!i) return []
  const art = investigatorCardArt(i)
  const sprite = spriteFor(art) ?? (i.form.tag === 'RegularForm' ? spriteFor(i.art) : null)
  return [{ id, name: nameOf(i.cardCode), sprite, src: sprite ?? portraitImage(i.cardCode), card: cardImage(art), you: id === ownId.value }]
}))
const label = computed(() => {
  const aboard = props.vehicle.passengers.map(passengerName).join(', ')
  return aboard ? t('locationMap.vehicle.aboard', { name: name.value, names: aboard }) : t('locationMap.vehicle.empty', { name: name.value })
})

/* Figures on the deck are smaller than on an island, and shrink further as more climb aboard, so a full crew
 * still fits on the planks between the wheelhouse and the mast. Height is a share of the boat's picture. */
const DECK_HEIGHTS = ['44%', '38%', '33%', '29%']
const deckHeight = computed(() => DECK_HEIGHTS[Math.min(crew.value.length, DECK_HEIGHTS.length) - 1])

const menu = ref<{ left: number; top: number } | null>(null)
function click(event: MouseEvent) {
  if (targetIndex.value !== -1) { menu.value = null; emit('choose', targetIndex.value); return }
  if (options.value.length === 1) { menu.value = null; emit('choose', options.value[0].index); return }
  if (menu.value || options.value.length === 0) { menu.value = null; return }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  menu.value = { left: rect.left + rect.width / 2, top: rect.bottom }
}
function pick(index: number) {
  menu.value = null
  emit('choose', index)
}
const close = () => { menu.value = null }
watch(choices, close)
onMounted(() => window.addEventListener('click', close))
onBeforeUnmount(() => window.removeEventListener('click', close))
</script>

<template>
  <button type="button" class="vehicle" :class="{ actionable }" :aria-label="label" :title="label"
    :style="{ left: x + '%', top: y + '%', width: width + 'px' }"
    :data-image="menu ? undefined : cardImage(vehicle.cardCode, '')" :data-card-code="vehicle.cardCode"
    :data-game-actionable="actionable || undefined" :data-fx-target="`asset-${vehicle.id}`"
    @pointerdown.stop @click.stop="click">
    <img class="hull" :class="{ left: heading === 'left' }" :src="vehicle.image" alt="" draggable="false" />
    <span v-if="crew.length" class="deck" :style="{ height: deckHeight }">
      <img v-for="p in crew" :key="p.id" class="passenger" :class="{ standee: p.sprite, you: p.you }"
        :src="p.src" :alt="p.name" :data-image="p.card" :data-investigator-mini="p.id" draggable="false" />
    </span>
  </button>
  <Teleport to="body">
    <span v-if="menu" class="vehicle-menu" role="menu" :aria-label="name" data-no-card-overlay
      :style="{ left: menu.left + 'px', top: menu.top + 'px' }" @click.stop @pointerdown.stop>
      <b class="name">{{ name }}</b>
      <AbilityButton v-for="c in options" :key="c.index" :game="game" :ability="c.contents" @choose="pick(c.index)" />
    </span>
  </Teleport>
</template>

<style scoped>
.vehicle {
  all: unset; position: absolute; z-index: 4; translate: -50% -50%; aspect-ratio: 3 / 2; cursor: zoom-in;
  transition: left 600ms ease-in-out, top 600ms ease-in-out;
}
.vehicle.actionable { cursor: pointer; }
.hull {
  display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; user-select: none;
  filter: drop-shadow(0 6px 10px #000a); transition: transform 300ms ease-in-out;
}
.hull.left { transform: scaleX(-1); }
.vehicle.actionable .hull { filter: drop-shadow(0 0 6px #f2d27a) drop-shadow(0 6px 10px #000a); }
.vehicle:focus-visible { outline: 2px solid #f2d27a; outline-offset: 2px; border-radius: 6px; }
/* Passengers stand on the planked deck of the sprite: feet on its floor (about two thirds down the picture),
 * between the wheelhouse and the mast. */
.deck {
  position: absolute; left: 50%; bottom: 33%; translate: -50% 0; max-width: 40%; display: flex; align-items: flex-end;
  justify-content: center; pointer-events: none; filter: drop-shadow(1px 3px 2px #000c);
}
.passenger { pointer-events: auto; min-width: 0; }
/* Neighbours overlap a little, like a crowd on a small deck. */
.passenger.standee { height: 100%; width: auto; }
.passenger.standee + .passenger.standee { margin-left: -18%; }
.passenger.standee.you { filter: drop-shadow(0 0 4px #ffe9a0); }
.passenger:not(.standee) {
  height: 45%; aspect-ratio: 1; border-radius: 50%; object-fit: cover; object-position: 50% 20%;
  border: 2px solid #c9dab1; background: #09100c;
}
.passenger:not(.standee).you { border-color: #ffe9a0; box-shadow: 0 0 8px #ffe9a0; }
.vehicle-menu { position: fixed; z-index: 1000; translate: -50% 6px; display: grid; gap: 4px; min-width: 170px; padding: 6px;
  background: #101a14f5; border: 1px solid #c6a873; border-radius: 6px; box-shadow: 0 8px 20px #000c; }
.vehicle-menu .name { font-size: 0.75rem; color: #f0dfb5; }
@media (prefers-reduced-motion: reduce) {
  .vehicle, .hull { transition: none; }
}
</style>
