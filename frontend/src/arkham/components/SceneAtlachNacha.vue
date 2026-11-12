<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import { cardImage } from '@/arkham/cardImages'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { useGameChoices } from '@/arkham/composables/useGameChoices'
import { clockwiseArc, WEB_RING, WEAVER_FOLDER, webRingPoint, type weaverEnemies } from '@/arkham/dream-eaters-scene-model'
import { choicesFor } from '@/arkham/locationChoices'
import type { Point } from '@/arkham/locationGraph'
import type { Enemy } from '@/arkham/types/Enemy'
import type { Game } from '@/arkham/types/Game'
import { MessageType } from '@/arkham/types/Message'

const props = defineProps<{
  game: Game
  playerId: string
  spider: ReturnType<typeof weaverEnemies>
  positions: Record<string, Point>
  width: number
  height: number
}>()
const emit = defineEmits<{ choose: [index: number] }>()
const nameOf = useCardNames()
const choices = useGameChoices(() => props.game, () => props.playerId)
const bodyButton = ref<HTMLButtonElement | null>(null)
const at = (step: number) => props.positions[WEB_RING[step]] ?? webRingPoint(step)
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const turn = (to: number, from: number) => ((to - from) % 360 + 360) % 360
const rotation = ref(props.spider.rotation)
watch(() => props.spider.rotation, (to) => { rotation.value += turn(to, rotation.value) })

const legGeometry = computed(() => props.spider.legs.map(({ enemy, step, base }) => {
  const [x, y] = at(step)
  const dx = (x - 50) * props.width / 100
  const dy = (y - 50) * props.height / 100
  const expected = base * 45 + rotation.value
  const actual = Math.atan2(dx, -dy) * 180 / Math.PI
  return { enemy, angle: expected + turn(actual, expected - 180) - 180, length: Math.hypot(dx, dy) * 0.80 }
}))

const narrow = computed(() => props.width <= 600)
const onWeb = ([x, y]: Point): Point => [x, Math.min(95, y + (narrow.value ? 8 : 4))]
const bodyPoint = computed<Point>(() => props.spider.bodyStep < 0 ? [50, 50] : onWeb(at(props.spider.bodyStep)))
const bodySize = computed(() => Math.min(props.height, props.width)
  * (props.spider.bodyStep < 0 ? 0.22 : narrow.value ? 0.095 : 0.11))
let crawl: Animation | undefined
watch(() => props.spider.bodyStep, (to, from) => {
  crawl?.cancel()
  if (from < 0 || to < 0 || !bodyButton.value || reducedMotion()) return
  const radiusX = (at(2)[0] - at(6)[0]) / 2
  const points = clockwiseArc(from, to, radiusX).map(onWeb)
  points[0] = onWeb(at(from))
  points[points.length - 1] = onWeb(at(to))
  crawl = bodyButton.value.animate(points.map(([x, y]) => ({ left: `${x}%`, top: `${y}%` })),
    { duration: 500, easing: 'ease-in-out' })
})

const menu = ref<{ left: number; top: number; id: string } | null>(null)
watch(choices, () => { menu.value = null })
const menuChoices = computed(() => menu.value ? choicesFor(choices.value, menu.value.id) : [])
const targetIndex = (enemy: Enemy) => choices.value.findIndex((c) => c.tag === MessageType.TARGET_LABEL
  && c.target.tag === 'EnemyTarget' && c.target.contents === enemy.id)
const actionable = (enemy: Enemy) => targetIndex(enemy) >= 0 || choicesFor(choices.value, enemy.id).length > 0
function choose(index: number) {
  menu.value = null
  emit('choose', index)
}
function interact(event: MouseEvent, enemy: Enemy) {
  const target = targetIndex(enemy)
  if (target >= 0) { choose(target); return }
  const options = choicesFor(choices.value, enemy.id)
  if (options.length === 1) { choose(options[0].index); return }
  if (options.length < 2 || menu.value?.id === enemy.id) { menu.value = null; return }
  menu.value = { left: event.clientX, top: event.clientY, id: enemy.id }
}
</script>

<template>
  <button v-for="{ enemy, length, angle } in legGeometry" :key="enemy.id" type="button" class="spider-part leg"
    :class="{ actionable: actionable(enemy) }" :aria-label="nameOf(enemy.cardCode)"
    :data-game-actionable="actionable(enemy) || undefined"
    :data-image="cardImage(enemy.cardCode)" :data-card-code="enemy.cardCode" :data-fx-target="`enemy-${enemy.id}`"
    :style="{ height: length + 'px', rotate: angle + 'deg' }"
    @pointerdown.stop @click.stop="interact($event, enemy)">
    <img :src="`${WEAVER_FOLDER}/legs.webp`" alt="" draggable="false" />
  </button>
  <button v-if="spider.body" ref="bodyButton" type="button" class="spider-part body"
    :class="{ actionable: actionable(spider.body) }" :aria-label="nameOf(spider.body.cardCode)"
    :data-game-actionable="actionable(spider.body) || undefined"
    :data-image="cardImage(spider.body.cardCode, spider.body.flipped ? 'b' : '')"
    :data-card-code="spider.body.cardCode" :data-fx-target="`enemy-${spider.body.id}`"
    :style="{ left: bodyPoint[0] + '%', top: bodyPoint[1] + '%', width: bodySize + 'px', rotate: rotation + 'deg' }"
    @pointerdown.stop @click.stop="interact($event, spider.body)">
    <img :src="`${WEAVER_FOLDER}/atlach-nacha.webp`" alt="" draggable="false" />
  </button>
  <Teleport to="body">
    <div v-if="menu" class="spider-menu-backdrop" @click.self="menu = null" @keydown.esc="menu = null">
      <div class="spider-menu" :style="{ left: `clamp(0px, ${menu.left}px, 100vw - 18rem)`, top: `clamp(0px, ${menu.top}px, 100vh - 12rem)` }">
        <AbilityButton v-for="option in menuChoices" :key="option.index" :game="game" :ability="option.contents" @choose="choose(option.index)" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.spider-part { position: absolute; margin: 0; border: 0; padding: 0; background: transparent; }
.spider-part img { display: block; pointer-events: none; }
.spider-part.actionable { cursor: pointer; filter: drop-shadow(0 0 5px #f2d27a); }
.spider-part:focus-visible { outline: 2px solid #f2d27a; }
.leg { left: 50%; bottom: 50%; width: max(20px, 3%); translate: -50% 0; transform-origin: 50% 100%; transition: rotate 500ms ease-in-out; z-index: 3; }
.leg img { position: absolute; bottom: 0; left: 50%; translate: -50% 0; height: 100%; }
.body { translate: -50% -50%; aspect-ratio: 1; transition: rotate 500ms ease-in-out; z-index: 4; }
.body img { width: 100%; }
.spider-menu-backdrop { position: fixed; inset: 0; z-index: 220; }
.spider-menu { position: absolute; display: grid; gap: 4px; width: min(18rem, 100vw); max-height: 12rem; overflow: auto; padding: 6px; background: #171521; border: 1px solid #c8aa69; border-radius: 6px; }
@media (prefers-reduced-motion: reduce) { .leg, .body { transition: none; } }
</style>
