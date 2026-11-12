<script lang="ts" setup>
import { computed } from 'vue'
import { chaosTokenImage } from '@/arkham/types/ChaosToken'
import { reelStrip, type ChaosDrawStyle } from '@/arkham/chaosDrawReveal'

/* The beat before a drawn chaos token is shown. Purely visual: the real tokens
 * are already known, held back by useChaosDraw until the timer runs out or the
 * player clicks to skip. Durations follow chaosDrawReveal.drawDurationMs and are
 * scaled by --motion-scale like every other board animation. */
const props = defineProps<{
  drawStyle: Exclude<ChaosDrawStyle, 'off'>
  /* Faces of the tokens being drawn, in reveal order. */
  faces: readonly string[]
  /* Faces still in the bag, for the reel to spin through. */
  bagFaces: readonly string[]
  /* Restarts the animation when a token joins a draw already running. */
  run: number
}>()

const emit = defineEmits<{ skip: [] }>()

const REEL_LENGTH = 16

/* One reel per drawn token, built once per run so it does not reshuffle mid-spin. */
const reels = computed(() => {
  void props.run
  return props.faces.map((face) => reelStrip([...props.bagFaces, face], face, REEL_LENGTH))
})

/* The bag lets one face-down token out per drawn token (at most four, matching
 * the cap on the pause). */
const facedownCount = computed(() => Math.min(Math.max(props.faces.length, 1), 4))
</script>

<template>
  <button
    :key="run"
    type="button"
    class="chaos-draw"
    :class="`chaos-draw--${drawStyle}`"
    :aria-label="$t('gameBar.chaosDrawSkip')"
    @click="emit('skip')"
  >
    <template v-if="drawStyle === 'bag'">
      <div class="bag-stage">
        <svg class="bag" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <radialGradient id="chaos-bag-cloth" cx="40%" cy="35%" r="75%">
              <stop offset="0%" stop-color="#5b3b6e" />
              <stop offset="60%" stop-color="#341f43" />
              <stop offset="100%" stop-color="#1a0f22" />
            </radialGradient>
          </defs>
          <!-- body -->
          <path
            d="M36 46 C 12 64, 10 112, 60 113 C 110 112, 108 64, 84 46 Z"
            fill="url(#chaos-bag-cloth)"
            stroke="#120a18"
            stroke-width="2"
          />
          <!-- folds -->
          <path d="M48 54 C 42 74, 44 96, 50 108" fill="none" stroke="#1a0f22" stroke-width="2" opacity="0.6" />
          <path d="M74 54 C 80 76, 78 96, 70 108" fill="none" stroke="#1a0f22" stroke-width="2" opacity="0.6" />
          <!-- elder sign stitched on the front -->
          <path
            d="M60 66 L64 78 L76 78 L66 86 L70 98 L60 90 L50 98 L54 86 L44 78 L56 78 Z"
            fill="none"
            stroke="#c9a85c"
            stroke-width="1.6"
            stroke-linejoin="round"
            opacity="0.85"
          />
          <!-- gathered neck and open mouth -->
          <ellipse cx="60" cy="44" rx="26" ry="7" fill="#0c0610" stroke="#4a2e5a" stroke-width="2" />
          <path d="M36 50 Q 60 58 84 50" fill="none" stroke="#c9a85c" stroke-width="2.4" stroke-linecap="round" />
          <circle cx="86" cy="52" r="2.6" fill="#c9a85c" />
          <path d="M86 54 Q 92 64 88 72" fill="none" stroke="#c9a85c" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <span
          v-for="i in facedownCount"
          :key="i"
          class="facedown"
          :style="{ '--i': i - 1, '--n': facedownCount }"
        />
      </div>
    </template>

    <template v-else>
      <div class="reels">
        <div v-for="(strip, r) in reels" :key="r" class="reel" :style="{ '--r': r }">
          <div class="reel__strip" :style="{ '--len': strip.length }">
            <img v-for="(face, i) in strip" :key="i" :src="chaosTokenImage(face)" alt="" />
          </div>
        </div>
      </div>
    </template>

    <span class="chaos-draw__hint">{{ $t('gameBar.chaosDrawSkip') }}</span>
  </button>
</template>

<style scoped>
.chaos-draw {
  --tok: min(92px, 18vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: auto;
  min-height: calc(var(--tok) + 40px);
  margin: 0 auto 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.chaos-draw__hint {
  font-size: 11px;
  letter-spacing: 0.04em;
  opacity: 0;
  color: rgba(255, 255, 255, 0.6);
  animation: hint-in calc(300ms * var(--motion-scale)) ease-out calc(500ms * var(--motion-scale)) forwards;
}

@keyframes hint-in {
  to { opacity: 1; }
}

/* ---- A: the bag ---------------------------------------------------------- */

.bag-stage {
  position: relative;
  width: calc(var(--tok) * 1.5);
  height: calc(var(--tok) * 1.35);
}

.bag {
  position: absolute;
  inset: auto 0 0 0;
  width: 100%;
  height: auto;
  transform-origin: 50% 90%;
  filter: drop-shadow(0 6px 6px rgba(0, 0, 0, 0.6));
  animation: bag-rummage calc(900ms * var(--motion-scale)) ease-in-out both;
}

/* Shaken, then rummaged: quick tilts that settle, with the cloth squashing. */
@keyframes bag-rummage {
  0% { transform: translateY(8px) scale(0.9); opacity: 0; }
  12% { transform: rotate(-8deg) scale(1, 0.96); opacity: 1; }
  24% { transform: rotate(7deg) scale(0.97, 1.03); }
  36% { transform: rotate(-6deg) scale(1.03, 0.96); }
  48% { transform: rotate(5deg) scale(0.98, 1.02); }
  60% { transform: rotate(-3deg) scale(1.02, 0.98); }
  72% { transform: rotate(2deg); }
  86% { transform: rotate(0deg) scale(1.04, 0.95); }
  100% { transform: none; }
}

/* A token, face down, pulled up out of the mouth of the bag and spun, ready for
 * the real token to land in its place with the panel's own flip. */
.facedown {
  --size: calc(var(--tok) * 0.62);
  position: absolute;
  left: calc(50% - var(--size) / 2 + (var(--i) - (var(--n) - 1) / 2) * var(--size) * 0.7);
  top: 30%;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, transparent 38%, rgba(201, 168, 92, 0.85) 40%, rgba(201, 168, 92, 0.85) 44%, transparent 46%),
    radial-gradient(circle at 35% 30%, #4b3a2a, #1c140d 70%);
  border: 2px solid #c9a85c;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7), inset 0 0 8px rgba(0, 0, 0, 0.8);
  opacity: 0;
  z-index: 0;
  animation: facedown-out calc(700ms * var(--motion-scale)) cubic-bezier(0.32, 0.72, 0, 1)
    calc((650ms + var(--i) * 350ms) * var(--motion-scale)) forwards;
}

@keyframes facedown-out {
  0% { opacity: 0; transform: translateY(20%) scale(0.5) rotateY(0deg); }
  25% { opacity: 1; }
  70% { transform: translateY(-95%) scale(1.05) rotateY(540deg); }
  100% { opacity: 1; transform: translateY(-85%) scale(1) rotateY(720deg); }
}

/* ---- B: the reel --------------------------------------------------------- */

.reels {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.reel {
  position: relative;
  width: var(--tok);
  height: var(--tok);
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(201, 168, 92, 0.7), 0 0 14px rgba(201, 168, 92, 0.25), inset 0 0 10px rgba(0, 0, 0, 0.9);
  background: rgba(0, 0, 0, 0.6);
}

/* Darkened edges, so faces read as rolling past a window rather than sliding. */
.reel::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(rgba(0, 0, 0, 0.7), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.7));
  pointer-events: none;
}

.reel__strip {
  display: flex;
  flex-direction: column;
  transform: translateY(0);
  animation: reel-spin calc((1650ms + var(--r) * 350ms) * var(--motion-scale)) cubic-bezier(0.12, 0.7, 0.2, 1) forwards;

  img {
    display: block;
    width: var(--tok);
    height: var(--tok);
    flex: none;
    border-radius: 50%;
  }
}

/* Fast and smeared at first, sharpening as it slows onto the last face. */
@keyframes reel-spin {
  0% { transform: translateY(0); filter: blur(2px); }
  60% { filter: blur(1px); }
  85% { filter: blur(0); }
  100% { transform: translateY(calc(var(--tok) * (var(--len) - 1) * -1)); filter: blur(0); }
}
</style>
