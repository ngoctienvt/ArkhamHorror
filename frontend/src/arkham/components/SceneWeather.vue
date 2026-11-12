<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { advanceDrop, makeRain, nextLightningDelay, RAIN_SLANT, type RainDrop } from '@/arkham/scene-storm'

/* A storm over a painted sea (Devil Reef): the swell slides across the water, rain streaks down in two depths,
 * fog drifts past and, now and then, lightning lights the sky. It sits between the painting and the islands,
 * never takes a click, and draws nothing for players who ask for reduced motion. The rain stops by itself in a
 * background tab (animation frames pause there). */
const props = defineProps<{
  /** Size of the map stage in layout pixels. */
  width: number
  height: number
}>()

const reducedMotion = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* The swell: crests of light on dark water, drawn once into a tile that wraps on every side and slid across
 * the sea by the compositor (a transform, so no repaint per frame). */
const TILE = 512
let swellTile: string | null = null
function makeSwellTile(): string {
  if (swellTile) return swellTile
  const canvas = document.createElement('canvas')
  canvas.width = TILE
  canvas.height = TILE
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.lineCap = 'round'
  for (let i = 0; i < 170; i++) {
    const x = Math.random() * TILE
    const y = Math.random() * TILE
    const w = 18 + Math.random() * 48
    const lift = 2 + Math.random() * 4
    ctx.strokeStyle = `rgba(205, 228, 236, ${0.06 + Math.random() * 0.18})`
    ctx.lineWidth = 0.8 + Math.random() * 1.6
    // Drawn again one tile over on each side, so a crest cut by an edge carries on across the seam.
    for (const dx of [-TILE, 0, TILE]) {
      for (const dy of [-TILE, 0, TILE]) {
        ctx.beginPath()
        ctx.moveTo(x + dx, y + dy)
        ctx.quadraticCurveTo(x + dx + w / 2, y + dy - lift, x + dx + w, y + dy)
        ctx.stroke()
      }
    }
  }
  swellTile = `url(${canvas.toDataURL('image/png')})`
  return swellTile
}
const swell = ref('')

// --- rain ---
const canvas = ref<HTMLCanvasElement | null>(null)
let drops: RainDrop[] = []
let frame = 0
let last = 0
/** The rain is redrawn at most this often: smooth enough for streaks, half the work of every frame. */
const FRAME_MS = 1000 / 30
const RAIN_COLOURS = { far: ['rgba(190, 210, 230, 0.18)', 1], near: ['rgba(214, 228, 242, 0.28)', 1.2] } as const

function resize() {
  const el = canvas.value
  if (!el) return
  const scale = Math.min(window.devicePixelRatio || 1, 1.5)
  el.width = Math.round(props.width * scale)
  el.height = Math.round(props.height * scale)
  el.getContext('2d')?.setTransform(scale, 0, 0, scale, 0, 0)
  drops = makeRain(props.width, props.height, Math.random)
}

function draw(now: number) {
  frame = requestAnimationFrame(draw)
  const elapsed = now - last
  if (elapsed < FRAME_MS) return
  // After a pause (background tab) the rain carries on rather than jumping a whole second.
  const seconds = Math.min(elapsed, 100) / 1000
  last = now
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  drops = drops.map((d) => advanceDrop(d, seconds, props.width, props.height, Math.random))
  ctx.clearRect(0, 0, props.width, props.height)
  for (const layer of ['far', 'near'] as const) {
    const [colour, lineWidth] = RAIN_COLOURS[layer]
    ctx.strokeStyle = colour
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    for (const d of drops) {
      if (d.layer !== layer) continue
      ctx.moveTo(d.x, d.y)
      ctx.lineTo(d.x + d.length * RAIN_SLANT, d.y + d.length)
    }
    ctx.stroke()
  }
}

// --- lightning: a dim flash from a random point of the sky, every 18 to 50 seconds ---
const flash = ref<{ key: number; x: number } | null>(null)
let lightningTimer: ReturnType<typeof setTimeout> | null = null
function scheduleLightning() {
  lightningTimer = setTimeout(() => {
    if (!document.hidden) flash.value = { key: Date.now(), x: 10 + Math.random() * 80 }
    scheduleLightning()
  }, nextLightningDelay(Math.random))
}

onMounted(() => {
  if (reducedMotion) return
  swell.value = makeSwellTile()
  resize()
  frame = requestAnimationFrame(draw)
  scheduleLightning()
})
watch(() => [props.width, props.height], () => { if (!reducedMotion) resize() })
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  if (lightningTimer) clearTimeout(lightningTimer)
})
</script>

<template>
  <div v-if="!reducedMotion" class="weather" aria-hidden="true">
    <div class="swell near" :style="{ backgroundImage: swell }"></div>
    <div class="swell far" :style="{ backgroundImage: swell }"></div>
    <div class="fog"></div>
    <canvas ref="canvas" class="rain" :style="{ width: width + 'px', height: height + 'px' }"></canvas>
    <div v-if="flash" :key="flash.key" class="lightning" :style="{ '--x': flash.x + '%' }" @animationend="flash = null"></div>
  </div>
</template>

<style scoped>
.weather { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
/* One tile larger than the stage on each side, slid by exactly one tile, so the loop has no seam. */
.swell {
  position: absolute; left: -512px; top: -512px; width: calc(100% + 1024px); height: calc(100% + 1024px);
  background-repeat: repeat; mix-blend-mode: screen; will-change: transform;
}
.swell.near { opacity: 0.55; animation: swell-drift 70s linear infinite, swell-heave 7s ease-in-out infinite alternate; }
.swell.far {
  opacity: 0.35; background-size: 384px 384px;
  animation: swell-drift-back 48s linear infinite, swell-heave 5s ease-in-out -2s infinite alternate;
}
@keyframes swell-drift { from { transform: translate(0, 0); } to { transform: translate(512px, 0); } }
@keyframes swell-drift-back { from { transform: translate(0, 0); } to { transform: translate(-384px, 384px); } }
@keyframes swell-heave { from { translate: 0 -3px; } to { translate: 0 4px; } }
/* Banks of sea fog, wider than the stage, drifting slowly back and forth. */
.fog {
  position: absolute; top: 0; left: -50%; width: 200%; height: 100%; opacity: 0.22;
  background:
    radial-gradient(ellipse 18% 22% at 12% 30%, #a9bcc0 0%, transparent 70%),
    radial-gradient(ellipse 22% 18% at 38% 75%, #a9bcc0 0%, transparent 70%),
    radial-gradient(ellipse 16% 20% at 63% 20%, #a9bcc0 0%, transparent 70%),
    radial-gradient(ellipse 20% 24% at 88% 62%, #a9bcc0 0%, transparent 70%);
  animation: fog-drift 140s ease-in-out infinite alternate;
}
@keyframes fog-drift { from { transform: translateX(0); } to { transform: translateX(25%); } }
.rain { position: absolute; left: 0; top: 0; }
/* Two quick dim pulses, then darkness: well under three flashes a second. */
.lightning {
  position: absolute; inset: 0; opacity: 0;
  background: radial-gradient(ellipse 60% 70% at var(--x) 0%, rgba(214, 230, 255, 0.55), transparent 70%), rgba(190, 210, 255, 0.06);
  animation: lightning 1.4s ease-out forwards;
}
@keyframes lightning {
  0% { opacity: 0; }
  5% { opacity: 0.55; }
  12% { opacity: 0.1; }
  22% { opacity: 0.4; }
  55%, 100% { opacity: 0; }
}
</style>
