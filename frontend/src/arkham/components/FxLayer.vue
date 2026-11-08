<script lang="ts" setup>
/* Shows what an update did to the board: clues flying from a location to the
 * investigator who found them, damage and horror flying off an investigator,
 * an enemy lunging at them, doom landing on the agenda.
 *
 * This is the board's effect director. It keeps a baseline snapshot -- the last
 * state whose effects were shown -- and diffs the current game against it
 * (gameDeltaFx.ts). It only does that when the board is actually readable:
 *
 * - not while an overlay holds `uiLock` (a draw spotlight or a revelation is
 *   covering the board, and effects behind it would be missed);
 * - not while a view transition is running (the board is a snapshot and every
 *   position measured now would be the old one);
 * - not while a previous timeline is still playing.
 *
 * Updates that arrive meanwhile are not queued one by one: the next diff simply
 * runs from the baseline to whatever the game is by then, so several updates
 * collapse into one timeline (played a little faster) and nothing piles up.
 *
 * Anchors are whatever carries `data-fx-target="<kind>-<id>"` (falling back to
 * the older `data-investigator-mini` / enemy `data-id` hooks and to
 * `data-fx-fallback`), so it works the same in the card table, the map and the
 * scene. An anchor that is not laid out on screen is skipped.
 *
 * While anything plays, `fxBusy` is true so the autopilot waits: the next
 * automatic answer must not run over an effect the player is still reading. */
import { computed, inject, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import type { Game } from '@/arkham/types/Game'
import { useSettings } from '@/stores/settings'
import { imgsrc } from '@/arkham/helpers'
import {
  diffSnapshots,
  eventsEndMs,
  snapshotOf,
  FX_TIMINGS,
  type FxEvent,
  type FxKind,
  type FxSnapshot,
} from '@/arkham/gameDeltaFx'
import { holdFxBusy, setFxDeferred } from '@/arkham/composables/useFxBusy'
import {
  clearFlying,
  clearHolds,
  setPendingHolds,
  settleTransfer,
  startFlying,
  tokenLanded,
  tokenLeft,
} from '@/arkham/motion/tokenHolds'
import { transitionActive } from '@/arkham/motion/viewTransitionGuard'
import { allowsFlourish, allowsTravel, EASE, SPEED_FACTOR } from '@/arkham/motion/motionTokens'

const props = defineProps<{ game: Game }>()
const settings = useSettings()
const uiLock = inject<Ref<boolean>>('uiLock', ref(false))

type Floater = { id: number; x: number; y: number; text: string; kind: FxKind }
const floaters = ref<Floater[]>([])
const layer = ref<HTMLElement | null>(null)
let nextId = 0
let baseline: FxSnapshot | null = null
let baselineStep = -1
let baselineGameId = ''
let playingUntil = 0
/* Updates that landed since the baseline; more than one means a collapsed timeline. */
let pendingUpdates = 0
const timers = new Set<ReturnType<typeof setTimeout>>()

const level = computed(() => (settings.combatFx ? settings.motionLevel : 'off'))
const layerClass = computed(() => `fx-layer--${level.value}`)

/* Classes put on the anchor itself. Shakes and lunges are flourish; the doom
 * pulse and the landing glow carry information and stay at `reduced`. */
const CLASS_FOR: Partial<Record<FxKind, string>> = {
  damage: 'fx-hit-damage',
  horror: 'fx-hit-horror',
  enemyDamage: 'fx-hit-damage',
  enemyDefeated: 'fx-defeated',
  doom: 'fx-doom',
  attack: 'fx-lunge',
  uses: 'fx-mark',
  clue: 'fx-mark',
}
const FLOURISH = new Set<FxKind>(['damage', 'horror', 'enemyDamage', 'attack'])

const TOKEN_IMAGE = { clue: 'tokens/clue.png', resource: 'tokens/resource.png' } as const

function later(ms: number, fn: () => void) {
  const handle = setTimeout(() => {
    timers.delete(handle)
    fn()
  }, ms)
  timers.add(handle)
}

const laidOut = (el: Element | null): el is HTMLElement => {
  if (!(el instanceof HTMLElement)) return false
  const r = el.getBoundingClientRect()
  return r.width > 0 || r.height > 0
}

/* The first copy that occupies space: a card is often rendered more than once
 * (desktop and mobile hands, inactive investigator tabs kept at display:none). */
function firstLaidOut(selector: string): HTMLElement | null {
  for (const el of document.querySelectorAll(selector)) if (laidOut(el)) return el as HTMLElement
  return null
}

function findAnchor(anchor: string): HTMLElement | null {
  const key = CSS.escape(anchor)
  const exact = firstLaidOut(`[data-fx-target="${key}"]`)
  if (exact) return exact
  const dash = anchor.indexOf('-')
  const entity = anchor.slice(0, dash)
  const id = CSS.escape(anchor.slice(dash + 1))
  if (entity === 'investigator') {
    const mini = firstLaidOut(`[data-investigator-mini="${id}"]`)
    if (mini) return mini
  }
  if (entity === 'enemy') {
    const img = firstLaidOut(`img[data-id="${id}"]`)
    if (img) return img
  }
  return firstLaidOut(`[data-fx-fallback="${key}"]`)
}

function label(event: FxEvent): string {
  const n = Math.abs(event.amount)
  const sign = event.amount > 0 ? '+' : '-'
  switch (event.kind) {
    case 'damage': return `-${n} dmg`
    case 'horror': return `-${n} horror`
    case 'enemyDamage': return `${event.amount > 0 ? '-' : '+'}${n}`
    case 'doom': return `${sign}${n} doom`
    case 'clue': return `${sign}${n} clue`
    case 'resource': return `${sign}${n} resource`
    case 'uses': return `${sign}${n}`
    default: return ''
  }
}

function flash(el: HTMLElement, cls: string, ms: number) {
  el.classList.remove(cls)
  void el.offsetWidth // restart the animation if it is already running
  el.classList.add(cls)
  later(ms, () => el.classList.remove(cls))
}

function addFloater(rect: DOMRect, text: string, kind: FxKind, ms: number) {
  const floater: Floater = { id: nextId++, x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.25, text, kind }
  floaters.value = [...floaters.value, floater]
  later(ms, () => {
    floaters.value = floaters.value.filter((f) => f.id !== floater.id)
  })
}

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 })

/* Tokens travelling from one anchor to another on a gentle arc, one after the
 * other. Up to five are drawn; more than that is one token and a count, which
 * reads better than a swarm. The destination glows as each one lands. */
function playTransfer(event: FxEvent, factor: number) {
  const from = findAnchor(event.anchor)
  const to = event.toward ? findAnchor(event.toward) : null
  const token = event.token ?? 'clue'
  if (!from || !to || !layer.value || !allowsTravel(level.value)) {
    // No route on screen (or no travel allowed): settle the counts and say it
    // where it landed.
    if (event.toward) settleTransfer(event.anchor, event.toward, token)
    const target = to ?? from
    if (!target) return
    addFloater(target.getBoundingClientRect(), `+${event.amount} ${token === 'clue' ? 'clue' : '$'}`, token === 'clue' ? 'clue' : 'resource', FX_TIMINGS.floaterMs * factor)
    flash(target, 'fx-land', 600 * factor)
    return
  }
  const a = centre(from.getBoundingClientRect())
  const b = centre(to.getBoundingClientRect())
  const lift = Math.min(90, Math.hypot(b.x - a.x, b.y - a.y) * 0.25)
  const mid = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - lift }
  const count = Math.min(event.amount, 5)
  const travel = FX_TIMINGS.travelMs * factor
  for (let i = 0; i < count; i++) {
    const img = document.createElement('img')
    img.src = imgsrc(TOKEN_IMAGE[token])
    img.className = 'fx-token'
    img.alt = ''
    layer.value.appendChild(img)
    const delay = i * FX_TIMINGS.staggerMs * factor
    // With more tokens than are drawn, the last one drawn carries the rest.
    const carries = i === count - 1 ? event.amount - (count - 1) : 1
    later(delay, () => tokenLeft(event.anchor, token, carries))
    const at = (p: { x: number; y: number }, s: number) => `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${s})`
    const anim = img.animate(
      [
        { transform: at(a, 0.6), opacity: 0 },
        { transform: at(a, 1), opacity: 1, offset: 0.1 },
        { transform: at(mid, 1.2), opacity: 1, offset: 0.55 },
        { transform: at(b, 0.8), opacity: 1 },
      ],
      { duration: travel, delay, easing: EASE.inOut, fill: 'both' },
    )
    const landed = () => {
      img.remove()
      tokenLanded(event.toward!, token, carries)
      flash(to, 'fx-land', 500 * factor)
    }
    anim.onfinish = landed
    anim.oncancel = () => {
      img.remove()
      tokenLanded(event.toward!, token, carries)
    }
  }
  if (event.amount > count) {
    later(travel, () => addFloater(to.getBoundingClientRect(), `+${event.amount}`, token === 'clue' ? 'clue' : 'resource', FX_TIMINGS.floaterMs * factor))
  }
}

function play(event: FxEvent, factor: number) {
  if (event.kind === 'transfer') {
    playTransfer(event, factor)
    return
  }
  const el = findAnchor(event.anchor)
  if (!el) return
  const rect = el.getBoundingClientRect()

  const cls = CLASS_FOR[event.kind]
  const flourishOk = allowsFlourish(level.value)
  if (cls && level.value !== 'static' && (flourishOk || !FLOURISH.has(event.kind))) {
    if (event.kind === 'attack' && event.toward) {
      const to = findAnchor(event.toward)?.getBoundingClientRect()
      if (to) {
        const dx = (to.left + to.width / 2 - (rect.left + rect.width / 2)) * 0.45
        const dy = (to.top + to.height / 2 - (rect.top + rect.height / 2)) * 0.45
        el.style.setProperty('--fx-dx', `${dx}px`)
        el.style.setProperty('--fx-dy', `${dy}px`)
      }
    }
    flash(el, cls, FX_TIMINGS.floaterMs * factor)
  } else if (level.value === 'static' && event.kind !== 'attack') {
    flash(el, 'fx-static-mark', FX_TIMINGS.floaterMs * factor)
  }

  const text = label(event)
  if (text) addFloater(rect, text, event.kind, FX_TIMINGS.floaterMs * factor)
}

function isFresh(game: Game): boolean {
  return baseline === null || game.id !== baselineGameId || game.scenarioSteps < baselineStep
}

function rebase(game: Game) {
  setPendingHolds([])
  baseline = snapshotOf(game)
  baselineStep = game.scenarioSteps
  baselineGameId = game.id
  pendingUpdates = 0
}

/* Diff the baseline against the game as it is now and play the result, if the
 * board is in a state where effects can be seen. Otherwise leave the baseline
 * alone: the next attempt covers everything since. */
function dispatch() {
  const game = props.game
  if (level.value === 'off' || isFresh(game)) {
    clearHolds()
    rebase(game)
    setFxDeferred(false)
    return
  }
  if (uiLock.value || transitionActive.value || Date.now() < playingUntil) return

  const events = diffSnapshots(baseline!, snapshotOf(game))
  const collapsed = pendingUpdates > 1
  rebase(game)
  if (events.length === 0) {
    setFxDeferred(false)
    return
  }
  if (allowsTravel(level.value)) startFlying(events)

  // A collapsed timeline plays faster so a burst of updates does not drag on.
  const factor = SPEED_FACTOR[settings.motionSpeed] * (collapsed ? 0.6 : 1)
  const total = Math.round(eventsEndMs(events) * factor)
  playingUntil = Date.now() + total
  holdFxBusy(total)
  setFxDeferred(false)
  for (const event of events) later(event.delayMs * factor, () => play(event, factor))
  later(total + 16, () => {
    clearFlying()
    dispatch()
  })
}

watch(
  () => props.game,
  (game) => {
    if (!isFresh(game) && level.value !== 'off') {
      pendingUpdates += 1
      // Until its effects start, this update counts as busy for the autopilot,
      // and token counts taking part in a transfer keep showing the old number
      // (set here, before this render, so they never flash the new one first).
      setFxDeferred(true)
      if (allowsTravel(level.value)) setPendingHolds(diffSnapshots(baseline!, snapshotOf(game)))
    }
    dispatch()
  },
  { immediate: true },
)
// Turning effects off (or back on) mid-game settles everything at once.
watch(level, () => dispatch())
// The board became readable again (overlay dismissed, transition landed).
watch([uiLock, transitionActive], ([locked, moving]) => {
  if (!locked && !moving) dispatch()
})

onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  clearHolds()
  setFxDeferred(false)
  layer.value?.querySelectorAll('.fx-token').forEach((el) => el.remove())
})
</script>

<template>
  <div ref="layer" class="fx-layer" :class="layerClass" aria-hidden="true">
    <span v-for="f in floaters" :key="f.id" class="fx-floater" :class="`fx-floater--${f.kind}`" :style="{ left: f.x + 'px', top: f.y + 'px' }">
      {{ f.text }}
    </span>
  </div>
</template>

<style lang="scss">
.fx-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9000;
}

.fx-token {
  position: absolute;
  left: 0;
  top: 0;
  width: 34px;
  height: 34px;
  will-change: transform, opacity;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.7));
}

.fx-floater {
  position: absolute;
  transform: translate(-50%, 0);
  font-weight: 800;
  font-size: 1.5rem;
  white-space: nowrap;
  text-shadow: 0 0 6px #000, 0 2px 2px #000;
  animation: fx-float var(--motion-linger) var(--ease-out) forwards;
}
.fx-floater--damage, .fx-floater--enemyDamage { color: #ff5a4d; }
.fx-floater--horror { color: #b58cff; }
.fx-floater--doom { color: #ff9a3c; }
.fx-floater--clue { color: #7fe3ff; }
.fx-floater--resource { color: #ffe27a; }
.fx-floater--uses { color: #e8e8e8; }

/* No movement: the number appears where it applies and fades. */
.fx-layer--static .fx-floater { animation-name: fx-fade; }

@keyframes fx-float {
  0% { opacity: 0; transform: translate(-50%, 10px) scale(0.7); }
  15% { opacity: 1; transform: translate(-50%, 0) scale(1.25); }
  100% { opacity: 0; transform: translate(-50%, -46px) scale(1); }
}
@keyframes fx-fade {
  0% { opacity: 0; }
  10%, 70% { opacity: 1; }
  100% { opacity: 0; }
}

/* Anchor effects. Motion is transform/opacity only. The glow is a filter
 * because anchors are often <img> (no pseudo-elements) or absolutely placed
 * standees (a positioned overlay would move them); it runs for well under a
 * second on one element, which is cheap. */
.fx-hit-damage { animation: fx-shake 0.5s var(--ease-out), fx-glow-red 0.6s var(--ease-out); }
.fx-hit-horror { animation: fx-throb 0.6s var(--ease-out), fx-glow-purple 0.6s var(--ease-out); }
.fx-doom { animation: fx-throb 0.8s var(--ease-out), fx-glow-orange 0.8s var(--ease-out); }
.fx-land { animation: fx-glow-cyan 0.5s var(--ease-out); }
.fx-mark { animation: fx-glow-white 0.6s var(--ease-out); }
.fx-static-mark { animation: fx-glow-white 1s linear; }
.fx-lunge { animation: fx-lunge 0.45s var(--ease-in-out); }
.fx-defeated { animation: fx-defeated 0.8s ease-in forwards; }

@keyframes fx-glow-red { 25% { filter: drop-shadow(0 0 8px #ff2a1c) brightness(1.3); } }
@keyframes fx-glow-purple { 25% { filter: drop-shadow(0 0 10px #9a5cff); } }
@keyframes fx-glow-orange { 25% { filter: drop-shadow(0 0 12px #ff7a1a) brightness(1.3); } }
@keyframes fx-glow-cyan { 30% { filter: drop-shadow(0 0 10px #7fe3ff) brightness(1.2); } }
@keyframes fx-glow-white { 25%, 60% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)); } }
/* Individual `rotate` / `scale` properties, not `transform`: they compose with
 * whatever transform the anchor already has (a location card rotated with
 * --ui-rotation, an exhausted card turned sideways) instead of replacing it. */
@keyframes fx-shake {
  0%, 100% { rotate: 0deg; }
  15% { rotate: -2.5deg; }
  35% { rotate: 2.5deg; }
  55% { rotate: -1.5deg; }
  75% { rotate: 1deg; }
}
@keyframes fx-throb {
  0%, 100% { scale: 1; }
  30% { scale: 1.06; }
}
@keyframes fx-lunge {
  0%, 100% { transform: translate(0, 0); }
  45% { transform: translate(var(--fx-dx, 0), var(--fx-dy, 0)) scale(1.1); }
}
@keyframes fx-defeated {
  to { opacity: 0; transform: translateY(14px) scale(0.9); }
}

/* `static` is chosen in code when the OS asks for reduced motion; this catches
 * a preference that flips while something is already playing. */
@media (prefers-reduced-motion: reduce) {
  .fx-hit-damage, .fx-hit-horror, .fx-doom, .fx-lunge, .fx-defeated { animation: fx-glow-white 1s linear; }
  .fx-floater { animation-name: fx-fade; }
}
</style>
