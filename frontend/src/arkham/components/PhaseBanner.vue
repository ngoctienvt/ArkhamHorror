<script lang="ts" setup>
/* A short banner when the game moves into a new phase ("Mythos Phase"), so the
 * change of rhythm -- especially into Mythos, where doom and encounter cards
 * arrive on their own -- is not missed. It never blocks the board: it does not
 * take pointer events and fades out by itself. Toggle in Settings; off with
 * the motion setting, and a plain fade when the OS asks for reduced motion. */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Phase } from '@/arkham/types/Phase'
import { useSettings } from '@/stores/settings'
import { MOTION_MS, scaledMs } from '@/arkham/motion/motionTokens'

const props = defineProps<{ game: Game }>()
const settings = useSettings()
const { t } = useI18n()

const PHASE_KEY: Partial<Record<Phase, string>> = {
  MythosPhase: 'phase.mythosPhase',
  InvestigationPhase: 'phase.investigationPhase',
  EnemyPhase: 'phase.enemyPhase',
  UpkeepPhase: 'phase.upkeepPhase',
}

/* How long the banner stays up at normal speed, entrance and exit included. */
const SHOW_MS = MOTION_MS.linger + 600

const shown = ref<{ key: number; text: string } | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let lastGameId = props.game.id
let nextKey = 0

const enabled = computed(() => settings.phaseBanner && settings.motionLevel !== 'off')

watch(
  () => props.game.phase,
  (phase, previous) => {
    const sameGame = props.game.id === lastGameId
    lastGameId = props.game.id
    if (!sameGame || previous === undefined || phase === previous || !enabled.value) return
    const key = PHASE_KEY[phase]
    if (!key) return
    shown.value = { key: nextKey++, text: t('phase.phaseBanner', { phase: t(key) }) }
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (shown.value = null), scaledMs(SHOW_MS, settings.motionSpeed))
  },
)

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="phase-banner-layer" aria-live="polite">
    <Transition name="phase-banner">
      <div v-if="shown" :key="shown.key" class="phase-banner">{{ shown.text }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.phase-banner-layer {
  position: fixed;
  top: calc(var(--nav-height) + 18vh);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 8999;
}

.phase-banner {
  padding: 10px 48px;
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #f3e7c9;
  text-shadow: 0 2px 6px #000;
  background: linear-gradient(90deg, transparent, rgba(10, 8, 14, 0.85) 20%, rgba(10, 8, 14, 0.85) 80%, transparent);
}

.phase-banner-enter-active {
  transition: opacity var(--motion-base) var(--ease-out), transform var(--motion-base) var(--ease-out);
}
.phase-banner-leave-active {
  transition: opacity var(--motion-travel) var(--ease-in-out), transform var(--motion-travel) var(--ease-in-out);
}
.phase-banner-enter-from {
  opacity: 0;
  transform: scaleX(0.6);
}
.phase-banner-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .phase-banner-enter-from,
  .phase-banner-leave-to {
    transform: none;
  }
}
</style>
