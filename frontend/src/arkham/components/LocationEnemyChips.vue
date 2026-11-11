<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Game } from '@/arkham/types/Game'
import type { Location } from '@/arkham/types/Location'
import { MessageType } from '@/arkham/types/Message'
import { TokenType } from '@/arkham/types/Token'
import { useGameChoices } from '@/arkham/composables/useGameChoices'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { choicesFor } from '@/arkham/locationChoices'
import { isTriggerWindow } from '@/arkham/triggerWindow'
import { cardImage } from '@/arkham/cardImages'
import AbilityButton from '@/arkham/components/AbilityButton.vue'

/* The enemies in a location's tile on the plain scene map, as small round faces instead of a bare count.
 * A click acts the way a standee does on the illustrated boards: when the game asks to pick the enemy it
 * picks it, otherwise its options (fight, evade, engage, its abilities) open in a small menu. The menu is
 * teleported to the page, since the tile clips its contents. */
const props = defineProps<{ game: Game; playerId: string; location: Location; enemiesAt: (l: Location) => string[]; compact?: boolean }>()
const emit = defineEmits<{ (e: 'choose', index: number): void }>()

const nameOf = useCardNames()
const choices = useGameChoices(() => props.game, () => props.playerId)

const MAX_SHOWN = 6
const enemies = computed(() => props.enemiesAt(props.location).flatMap((id) => {
  const e = props.game.enemies[id]
  if (!e) return []
  const image = cardImage(e.cardCode, e.flipped ? 'b' : '')
  const damage = (e.tokens[TokenType.Damage] ?? 0) + e.assignedDamage
  return [{ id, name: nameOf(e.cardCode), image, exhausted: e.exhausted, damage }]
}))
const shown = computed(() => enemies.value.slice(0, MAX_SHOWN))
const hiddenCount = computed(() => Math.max(0, enemies.value.length - MAX_SHOWN))

const targetIndex = (id: string) => choices.value.findIndex((c) => c.tag === MessageType.TARGET_LABEL && c.target.contents === id)
const optionsFor = (id: string) => choicesFor(choices.value, id)
const actionable = (id: string) => targetIndex(id) !== -1 || optionsFor(id).length > 0
const triggerWindow = computed(() => isTriggerWindow(choices.value))

const openMenu = ref<{ id: string; name: string; left: number; top: number } | null>(null)
function clickEnemy(enemy: { id: string; name: string }, event: MouseEvent) {
  const target = targetIndex(enemy.id)
  if (target !== -1) { openMenu.value = null; emit('choose', target); return }
  const options = optionsFor(enemy.id)
  if (openMenu.value?.id === enemy.id || options.length === 0) { openMenu.value = null; return }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  openMenu.value = { id: enemy.id, name: enemy.name, left: rect.left + rect.width / 2, top: rect.top }
}
function pick(index: number) {
  openMenu.value = null
  emit('choose', index)
}
// Closes on any click outside it and whenever the offered choices change.
const closeMenu = () => { openMenu.value = null }
watch(choices, closeMenu)
onMounted(() => window.addEventListener('click', closeMenu))
onBeforeUnmount(() => window.removeEventListener('click', closeMenu))
</script>

<template>
  <span v-if="enemies.length" class="enemy-chips" :class="{ compact }">
    <button v-for="enemy in shown" :key="enemy.id" type="button" class="chip"
      :class="{ actionable: actionable(enemy.id), trigger: triggerWindow && actionable(enemy.id), exhausted: enemy.exhausted }"
      :style="{ backgroundImage: `url(${enemy.image})` }" :aria-label="enemy.name"
      :data-image="openMenu?.id === enemy.id ? undefined : enemy.image" :data-fx-target="`enemy-${enemy.id}`"
      @pointerdown.stop @click.stop="clickEnemy(enemy, $event)">
      <b v-if="enemy.damage && !compact" class="damage">{{ enemy.damage }}</b>
    </button>
    <span v-if="hiddenCount" class="more">+{{ hiddenCount }}</span>
    <Teleport to="body">
      <span v-if="openMenu" class="enemy-chip-menu" role="menu" :aria-label="openMenu.name" data-no-card-overlay
        :style="{ left: openMenu.left + 'px', top: openMenu.top + 'px' }" @click.stop @pointerdown.stop>
        <b class="name">{{ openMenu.name }}</b>
        <AbilityButton v-for="c in optionsFor(openMenu.id)" :key="c.index" :game="game" :ability="c.contents" @choose="pick(c.index)" />
      </span>
    </Teleport>
  </span>
</template>

<style scoped>
.enemy-chips { display: inline-flex; flex-wrap: wrap; gap: 3px; align-items: center; }
.chip { position: relative; width: clamp(24px, 2.6vw, 34px); aspect-ratio: 1; padding: 0; border-radius: 50%; border: 2px solid #d99e8e;
  background-color: #2a0f0b; background-size: 260%; background-position: 50% 18%; cursor: default; box-shadow: 0 1px 3px #000c; }
.chip.actionable { cursor: pointer; border-color: #f2d27a; box-shadow: 0 0 8px 2px #f2d27a; }
.chip.trigger { border-color: #f39a4a; box-shadow: 0 0 8px 2px #f39a4a; }
.chip.exhausted { filter: grayscale(0.7) brightness(0.75); }
.damage { position: absolute; right: -5px; bottom: -4px; min-width: 14px; height: 14px; padding: 0 2px; display: grid; place-items: center;
  border-radius: 7px; background: #8c1d14; color: #fff; font-size: 0.6rem; line-height: 1; }
.more { font-size: 0.7rem; color: #d99e8e; }
.compact .chip { width: 12px; border-width: 1px; }
.enemy-chip-menu { position: fixed; z-index: 1000; translate: -50% calc(-100% - 6px); display: grid; gap: 4px; min-width: 150px; padding: 6px;
  background: #101a14f5; border: 1px solid #c6a873; border-radius: 6px; box-shadow: 0 8px 20px #000c; }
.enemy-chip-menu .name { font-size: 0.75rem; color: #f0dfb5; }
</style>
