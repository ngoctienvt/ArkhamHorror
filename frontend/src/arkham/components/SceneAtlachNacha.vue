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
import { enemyStat } from '@/arkham/enemyStats'
import GameIcon from '@/arkham/components/GameIcon.vue'
import { TokenType } from '@/arkham/types/Token'

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
/* Damage taken over health left, so the legs and the body show how close they are to dying. */
function wound(enemy: Enemy): { left: number; max: number; pct: number } | null {
  const max = enemyStat(enemy, 'health', Object.keys(props.game.investigators).length)?.current
  if (max === undefined) return null
  const taken = (enemy.tokens[TokenType.Damage] || 0) + enemy.assignedDamage
  const left = Math.max(0, max - taken)
  return { left, max, pct: max > 0 ? (100 * left) / max : 0 }
}
/* A point a little way along the leg, in the open space between the web centre and the plate. */
const LEG_REACH = 0.58
const alongLeg = ([x, y]: Point): Point => [50 + (x - 50) * LEG_REACH, 50 + (y - 50) * LEG_REACH]
const choices = useGameChoices(() => props.game, () => props.playerId)
const bodyButton = ref<HTMLButtonElement | null>(null)
const at = (step: number) => props.positions[WEB_RING[step]] ?? webRingPoint(step)
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const legGeometry = computed(() => props.spider.legs.map(({ enemy, step }) => {
  const [x, y] = at(step)
  const dx = (x - 50) * props.width / 100
  const dy = (y - 50) * props.height / 100
  const angle = Math.atan2(dx, -dy) * 180 / Math.PI
  const [bx, by] = alongLeg([x, y])
  return { enemy, angle, start: [bx, by] as Point, length: Math.hypot(dx, dy) * (1 - LEG_REACH) * 0.85 }
}))

/* The creature looks between two legs, never along one, so the legs read as pointing at the locations.
 * Of the gaps between neighbouring legs, the one closest to straight up is used, so it never leans far. */
const faceAngle = computed(() => {
  const angles = legGeometry.value.map((leg) => leg.angle).sort((a, b) => a - b)
  if (angles.length < 2) return 0
  const gaps = angles.map((a, i) => {
    const next = i + 1 < angles.length ? angles[i + 1] : angles[0] + 360
    return Math.round((a + next) / 2 * 100) / 100
  })
  const wrap = (a: number) => ((a + 180) % 360 + 360) % 360 - 180
  return gaps.map(wrap).reduce((best, a) => Math.abs(a) < Math.abs(best) ? a : best)
})
const narrow = computed(() => props.width <= 600)
const spiderSize = computed(() => Math.min(props.height, props.width) * 0.52)
const onWeb = ([x, y]: Point): Point => [x, Math.min(95, y + (narrow.value ? 8 : 4))]
const bodyPoint = computed<Point>(() => props.spider.bodyStep < 0 ? [50, 50] : onWeb(at(props.spider.bodyStep)))
// The whole creature, facing the viewer: large in the middle of the web, small when it stands on a location.
const bodySize = computed(() => props.spider.bodyStep < 0
  ? spiderSize.value * 0.95 : Math.min(props.height, props.width) * (narrow.value ? 0.13 : 0.16))
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
  <button v-for="{ enemy, length, angle, start } in legGeometry" :key="enemy.id" type="button" class="spider-part leg"
    :class="{ actionable: actionable(enemy) }" :aria-label="nameOf(enemy.cardCode)"
    :data-game-actionable="actionable(enemy) || undefined"
    :data-image="cardImage(enemy.cardCode)" :data-card-code="enemy.cardCode" :data-fx-target="`enemy-${enemy.id}`"
    :style="{ left: start[0] + '%', top: start[1] + '%', height: length + 'px', rotate: angle + 'deg' }"
    @pointerdown.stop @click.stop="interact($event, enemy)" />
  <template v-for="{ enemy, step } in spider.legs" :key="`wound-${enemy.id}`">
    <button v-if="wound(enemy)" type="button" class="wound" :class="{ actionable: actionable(enemy) }" :title="nameOf(enemy.cardCode)"
      :data-image="cardImage(enemy.cardCode)" :data-card-code="enemy.cardCode" @pointerdown.stop @click.stop="interact($event, enemy)"
      :style="{ left: alongLeg(at(step))[0] + '%', top: alongLeg(at(step))[1] + '%' }">
      <template v-for="w in [wound(enemy)!]" :key="0"><span class="chip-info"><span class="track"><i :style="{ width: w.pct + '%' }"></i></span><em><GameIcon type="health" /> {{ w.left }}/{{ w.max }}</em></span></template>
    </button>
  </template>
  <button v-if="spider.body" ref="bodyButton" type="button" class="spider-part body"
    :class="{ actionable: actionable(spider.body) }" :aria-label="nameOf(spider.body.cardCode)"
    :data-game-actionable="actionable(spider.body) || undefined"
    :data-image="cardImage(spider.body.cardCode, spider.body.flipped ? 'b' : '')"
    :data-card-code="spider.body.cardCode" :data-fx-target="`enemy-${spider.body.id}`"
    :style="{ left: bodyPoint[0] + '%', top: bodyPoint[1] + '%', width: bodySize + 'px' }"
    @pointerdown.stop @click.stop="interact($event, spider.body)">
    <img :src="`${WEAVER_FOLDER}/atlach-nacha-front.webp`" :style="{ rotate: faceAngle + 'deg' }" alt="" draggable="false" />
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
.spider-part.actionable { cursor: pointer; }
.body.actionable { filter: drop-shadow(0 0 5px #f2d27a); }
.spider-part:focus-visible { outline: 2px solid #f2d27a; }
.leg { width: max(20px, 3%); translate: -50% -100%; transform-origin: 50% 100%; z-index: 5; }
/* a dashed red line from the health chip to the location the leg stands on */
.leg::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 0; translate: -50% 0; border-left: 3px dashed #e5484d; filter: drop-shadow(0 0 3px rgba(229, 72, 77, 0.8)); pointer-events: none; }
.body { translate: -50% -50%; aspect-ratio: 1; transition: rotate 500ms ease-in-out; z-index: 4; }
.body img { width: 100%; transition: rotate 500ms ease-in-out; }
.wound { position: absolute; translate: -50% -50%; z-index: 6; display: flex; align-items: center; gap: 5px; min-width: 76px; padding: 2px 7px; border-radius: 8px; text-align: left; background: rgba(23, 21, 33, 0.88); border: 1px solid #c8aa69; color: #ff9b87; font: 700 12px/1.3 sans-serif; cursor: pointer; }
.wound.actionable { border-color: #f2d27a; box-shadow: 0 0 8px #f2d27a; }
.wound .chip-info { display: grid; gap: 3px; flex: 1; min-width: 0; }
.wound .track { flex: 1; min-width: 16px; height: 4px; background: #5b5a54; border-radius: 3px; overflow: hidden; }
.wound .track i { display: block; height: 100%; background: currentColor; }
.wound em { font-style: normal; flex: none; white-space: nowrap; color: #fff4df; }
.spider-menu-backdrop { position: fixed; inset: 0; z-index: 220; }
.spider-menu { position: absolute; display: grid; gap: 4px; width: min(18rem, 100vw); max-height: 12rem; overflow: auto; padding: 6px; background: #171521; border: 1px solid #c8aa69; border-radius: 6px; }
@media (prefers-reduced-motion: reduce) { .leg, .body { transition: none; } }
</style>
