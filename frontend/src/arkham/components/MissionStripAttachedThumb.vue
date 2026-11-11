<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Game } from '@/arkham/types/Game'
import { MessageType } from '@/arkham/types/Message'
import type { AttachedCard } from '@/arkham/composables/useMissionStripPanels'
import { useGameChoices } from '@/arkham/composables/useGameChoices'
import { choicesFor } from '@/arkham/locationChoices'
import AbilityButton from '@/arkham/components/AbilityButton.vue'

/* A card next to / attached to an act or agenda, as a thumbnail on the mission strip header (Dark Matter
 * puts enemies, assets and stories next to the act). When the game offers something on it, the
 * thumbnail glows: a click picks it when the game asks to choose the card, otherwise its options
 * (fight, evade, its abilities) open in a small menu teleported to the page. */
const props = defineProps<{ game: Game; playerId: string; card: AttachedCard }>()
const emit = defineEmits<{ (e: 'choose', index: number): void }>()

const choices = useGameChoices(() => props.game, () => props.playerId)
const targetIndex = computed(() => choices.value.findIndex((c) => c.tag === MessageType.TARGET_LABEL && c.target.contents === props.card.id))
const options = computed(() => choicesFor(choices.value, props.card.id))
const actionable = computed(() => targetIndex.value !== -1 || options.value.length > 0)

const menu = ref<{ left: number; top: number } | null>(null)
function click(event: MouseEvent) {
  if (targetIndex.value !== -1) { menu.value = null; emit('choose', targetIndex.value); return }
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
  <button type="button" class="thumb" :class="{ actionable }" :aria-label="card.name"
    @pointerdown.stop @click.stop="click">
    <img :src="card.image" :data-image="menu ? undefined : card.image" :data-card-code="card.code" :alt="card.name" loading="lazy" />
  </button>
  <Teleport to="body">
    <span v-if="menu" class="thumb-menu" role="menu" :aria-label="card.name" data-no-card-overlay
      :style="{ left: menu.left + 'px', top: menu.top + 'px' }" @click.stop @pointerdown.stop>
      <b class="name">{{ card.name }}</b>
      <AbilityButton v-for="c in options" :key="c.index" :game="game" :ability="c.contents" @choose="pick(c.index)" />
    </span>
  </Teleport>
</template>

<style scoped>
.thumb { all: unset; display: inline-flex; border-radius: 3px; cursor: zoom-in; }
.thumb img { height: 24px; width: auto; border-radius: 3px; border: 1px solid #c9887a99; }
.thumb.actionable { cursor: pointer; }
.thumb.actionable img { border-color: #f2d27a; box-shadow: 0 0 8px 2px #f2d27a; }
.thumb:focus-visible img { outline: 1px solid #f2d27a; outline-offset: 1px; }
.thumb-menu { position: fixed; z-index: 1000; translate: -50% 6px; display: grid; gap: 4px; min-width: 150px; padding: 6px;
  background: #101a14f5; border: 1px solid #c6a873; border-radius: 6px; box-shadow: 0 8px 20px #000c; }
.thumb-menu .name { font-size: 0.75rem; color: #f0dfb5; }
</style>
